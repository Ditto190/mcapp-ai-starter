#!/usr/bin/env python3
"""Single-command orchestrator for the agent-assets pipeline.

Runs all pipeline steps in order and writes a structured summary to log files.
No significant output is printed to stdout/stderr — all reporting goes to:
    .agents/index/pipeline-report.jsonl   (append-only, one JSON object per run)
    .agents/index/pipeline-report.log     (append-only, human-readable lines)

Usage:
    python scripts/pipeline_sync.py
    python scripts/pipeline_sync.py --dry-run
    python scripts/pipeline_sync.py --steps build,regenerate

Exit codes:
    0  all steps succeeded or skipped
    1  one or more steps failed
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import time
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = (
    Path(os.environ["AGENTS_ROOT"])
    if "AGENTS_ROOT" in os.environ
    else Path(__file__).resolve().parent.parent
)
INDEX_DIR = ROOT / ".agents" / "index"
REPORT_JSONL = INDEX_DIR / "pipeline-report.jsonl"
REPORT_LOG = INDEX_DIR / "pipeline-report.log"
PYTHON = sys.executable


def now_utc() -> str:
    return datetime.now(timezone.utc).isoformat()


@dataclass
class StepResult:
    name: str
    status: str = "pending"  # pending | ok | skipped | failed
    duration_ms: int = 0
    returncode: int | None = None
    detail: str = ""
    stdout_lines: int = 0
    stderr_lines: int = 0


@dataclass
class PipelineReport:
    run_id: str
    started_at: str
    finished_at: str = ""
    dry_run: bool = False
    overall_status: str = "pending"  # ok | partial | failed
    steps: list[StepResult] = field(default_factory=list)
    notes: list[str] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        d = asdict(self)
        return d


def _run_step(
    name: str,
    cmd: list[str],
    dry_run: bool = False,
    extra_args: list[str] | None = None,
) -> StepResult:
    result = StepResult(name=name)
    if extra_args:
        cmd = cmd + extra_args
    if dry_run:
        cmd = [c for c in cmd] + (["--dry-run"] if name not in ("build",) else [])

    t0 = time.monotonic()
    try:
        proc = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            cwd=str(ROOT),
        )
        elapsed = int((time.monotonic() - t0) * 1000)
        result.duration_ms = elapsed
        result.returncode = proc.returncode
        result.stdout_lines = len(proc.stdout.splitlines())
        result.stderr_lines = len(proc.stderr.splitlines())
        if proc.returncode == 0:
            result.status = "ok"
        else:
            result.status = "failed"
            result.detail = (proc.stderr or proc.stdout or "").strip()[:500]
    except Exception as exc:
        result.status = "failed"
        result.detail = str(exc)[:500]
        result.duration_ms = int((time.monotonic() - t0) * 1000)
    return result


def _write_reports(report: PipelineReport) -> None:
    INDEX_DIR.mkdir(parents=True, exist_ok=True)
    report_dict = report.to_dict()

    # Append-only JSONL
    with REPORT_JSONL.open("a", encoding="utf-8") as f:
        f.write(json.dumps(report_dict, ensure_ascii=False) + "\n")

    # Human-readable log lines
    sep = "-" * 60
    lines = [
        sep,
        f"Pipeline run  : {report.run_id}",
        f"Started       : {report.started_at}",
        f"Finished      : {report.finished_at}",
        f"Dry-run       : {report.dry_run}",
        f"Overall       : {report.overall_status.upper()}",
        sep,
    ]
    for step in report.steps:
        flag = {"ok": "OK ", "failed": "ERR", "skipped": "SKIP", "pending": "???"}[
            step.status
        ]
        lines.append(
            f"[{flag}] {step.name:<24} {step.duration_ms:>5}ms  rc={step.returncode}"
        )
        if step.detail:
            lines.append(f"      detail: {step.detail}")
    if report.notes:
        lines.append(sep)
        for note in report.notes:
            lines.append(f"NOTE: {note}")
    lines.append(sep + "\n")

    with REPORT_LOG.open("a", encoding="utf-8") as f:
        f.write("\n".join(lines))


# ---------------------------------------------------------------------------
# Step definitions
# ---------------------------------------------------------------------------

ALL_STEPS = ["build", "register-incoming", "regenerate"]


def run_pipeline(dry_run: bool = False, steps: list[str] | None = None) -> int:
    active_steps = steps or ALL_STEPS
    run_id = f"run-{datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')}"
    report = PipelineReport(
        run_id=run_id,
        started_at=now_utc(),
        dry_run=dry_run,
    )

    # ------------------------------------------------------------------
    # Step 1: build index
    # ------------------------------------------------------------------
    if "build" in active_steps:
        step = _run_step(
            name="build",
            cmd=[
                PYTHON,
                str(ROOT / "scripts" / "build_agent_index.py"),
                "--reason",
                f"pipeline-sync-{run_id}",
            ],
            dry_run=False,  # build never has a dry-run flag
        )
        report.steps.append(step)
    else:
        report.steps.append(StepResult(name="build", status="skipped"))

    # ------------------------------------------------------------------
    # Step 2: register any _incoming assets
    # ------------------------------------------------------------------
    if "register-incoming" in active_steps:
        incoming_dir = ROOT / ".agents" / "registry" / "_incoming"
        if incoming_dir.exists():
            incoming_files = list(incoming_dir.glob("*.md")) + list(
                incoming_dir.glob("*.json")
            )
        else:
            incoming_files = []

        if not incoming_files:
            report.steps.append(
                StepResult(
                    name="register-incoming",
                    status="skipped",
                    detail="no _incoming files",
                )
            )
        else:
            for src in incoming_files:
                # Infer mode from filename convention: <mode>-<original-name>
                parts = src.stem.split("-", 1)
                mode = parts[0] if len(parts) == 2 else "other"
                orig_filename = parts[1] if len(parts) == 2 else src.name
                step = _run_step(
                    name=f"register-incoming:{src.name}",
                    cmd=[
                        PYTHON,
                        str(ROOT / "scripts" / "register_awesome_asset.py"),
                        "--mode",
                        mode,
                        "--filename",
                        orig_filename,
                        "--source-file",
                        str(src),
                        "--query",
                        "pipeline-auto-register",
                    ],
                    dry_run=dry_run,
                )
                report.steps.append(step)
    else:
        report.steps.append(StepResult(name="register-incoming", status="skipped"))

    # ------------------------------------------------------------------
    # Step 3: regenerate from registry
    # ------------------------------------------------------------------
    if "regenerate" in active_steps:
        regen_cmd = [
            PYTHON,
            str(ROOT / "scripts" / "regenerate_from_registry.py"),
        ]
        if dry_run:
            regen_cmd.append("--dry-run")
        step = _run_step(
            name="regenerate",
            cmd=regen_cmd,
            dry_run=dry_run,
        )
        report.steps.append(step)
    else:
        report.steps.append(StepResult(name="regenerate", status="skipped"))

    # ------------------------------------------------------------------
    # Finalise report
    # ------------------------------------------------------------------
    report.finished_at = now_utc()
    failed = [s for s in report.steps if s.status == "failed"]
    ok_or_skipped = [s for s in report.steps if s.status in ("ok", "skipped")]

    if not failed:
        report.overall_status = "ok"
    elif len(failed) < len(report.steps):
        report.overall_status = "partial"
    else:
        report.overall_status = "failed"

    _write_reports(report)

    # Minimal terminal feedback — just the status line, no full output
    print(
        f"Pipeline {report.overall_status.upper()} | "
        f"{len(ok_or_skipped)} ok/skipped, {len(failed)} failed | "
        f"report -> {REPORT_LOG.relative_to(ROOT)}"
    )

    return 0 if report.overall_status in ("ok", "partial") else 1


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Run the full agent-assets pipeline sync"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Simulate steps that support it; build always runs",
    )
    parser.add_argument(
        "--steps",
        default=None,
        help=f"Comma-separated subset of steps to run (default: all). "
        f"Options: {','.join(ALL_STEPS)}",
    )
    args = parser.parse_args()

    steps = [s.strip() for s in args.steps.split(",")] if args.steps else None
    if steps:
        invalid = [s for s in steps if s not in ALL_STEPS]
        if invalid:
            print(f"Unknown steps: {invalid}. Valid: {ALL_STEPS}", file=sys.stderr)
            return 2

    return run_pipeline(dry_run=args.dry_run, steps=steps)


if __name__ == "__main__":
    sys.exit(main())
