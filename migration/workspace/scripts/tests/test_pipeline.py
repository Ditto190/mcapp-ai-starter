#!/usr/bin/env python3
"""Tests for the agent-assets pipeline components.

Covers:
 - build_agent_index.py   → index + log output, counts, sha256 stability
 - register_awesome_asset.py → registry copy, log append, idempotency
 - regenerate_from_registry.py → destination mapping, dry-run, copy
 - pipeline_sync.py       → orchestrator end-to-end, report files, step selection
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile
import textwrap
from pathlib import Path
from unittest import TestCase, main as unittest_main

SCRIPTS_DIR = Path(__file__).resolve().parent.parent
PYTHON = sys.executable


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _run(args: list[str], cwd: Path) -> subprocess.CompletedProcess:
    env = dict(os.environ)
    env["AGENTS_ROOT"] = str(cwd)
    return subprocess.run(
        args,
        capture_output=True,
        text=True,
        cwd=str(cwd),
        env=env,
    )


def _make_agent_file(
    path: Path, name: str = "test-agent", description: str = "A test agent"
) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        textwrap.dedent(f"""\
            ---
            name: {name}
            description: "{description}"
            ---
            # {name}
            Body text.
        """),
        encoding="utf-8",
    )


def _make_instruction_file(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        textwrap.dedent("""\
            ---
            description: "Test instructions."
            applyTo: "**"
            ---
            Do something.
        """),
        encoding="utf-8",
    )


# ---------------------------------------------------------------------------
# build_agent_index tests
# ---------------------------------------------------------------------------


class TestBuildAgentIndex(TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        # Minimal directory structure
        _make_agent_file(self.root / ".github" / "agents" / "sample.agent.md")
        _make_instruction_file(
            self.root / ".github" / "instructions" / "sample.instructions.md"
        )
        (self.root / ".agents" / "index").mkdir(parents=True, exist_ok=True)

    def tearDown(self):
        self.tmp.cleanup()

    def _run_build(
        self, extra_args: list[str] | None = None
    ) -> subprocess.CompletedProcess:
        cmd = [PYTHON, str(SCRIPTS_DIR / "build_agent_index.py")] + (extra_args or [])
        return _run(cmd, self.root)

    def test_exits_zero(self):
        result = self._run_build(["--reason", "test"])
        self.assertEqual(result.returncode, 0, msg=result.stderr)

    def test_index_file_created(self):
        self._run_build(["--reason", "test"])
        index_file = self.root / ".agents" / "index" / "agent-assets.index.json"
        self.assertTrue(index_file.exists(), "index JSON not created")

    def test_index_counts_agents(self):
        self._run_build(["--reason", "test"])
        index_file = self.root / ".agents" / "index" / "agent-assets.index.json"
        data = json.loads(index_file.read_text(encoding="utf-8"))
        counts = data.get("counts", {})
        self.assertGreaterEqual(counts.get("agent", 0), 1, "expected ≥1 agent in count")

    def test_log_file_appends(self):
        log_file = self.root / ".agents" / "index" / "agent-assets.log.jsonl"
        self._run_build(["--reason", "first"])
        first_lines = log_file.read_text(encoding="utf-8").splitlines()
        self._run_build(["--reason", "second"])
        second_lines = log_file.read_text(encoding="utf-8").splitlines()
        self.assertGreater(
            len(second_lines), len(first_lines), "log should grow on second run"
        )

    def test_sha256_stable(self):
        """Same file content → same sha256 across two runs."""
        self._run_build(["--reason", "run1"])
        self._run_build(["--reason", "run2"])
        index_file = self.root / ".agents" / "index" / "agent-assets.index.json"
        data = json.loads(index_file.read_text(encoding="utf-8"))
        assets = data.get("assets", [])
        hashes = {a["path"]: a["sha256"] for a in assets}
        # Re-run and compare
        self._run_build(["--reason", "run3"])
        data2 = json.loads(index_file.read_text(encoding="utf-8"))
        assets2 = data2.get("assets", [])
        hashes2 = {a["path"]: a["sha256"] for a in assets2}
        for path, sha in hashes.items():
            self.assertEqual(hashes2.get(path), sha, f"sha256 changed for {path}")


# ---------------------------------------------------------------------------
# register_awesome_asset tests
# ---------------------------------------------------------------------------


class TestRegisterAwesomeAsset(TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        (self.root / ".agents" / "index").mkdir(parents=True, exist_ok=True)
        (self.root / ".agents" / "registry" / "_incoming").mkdir(
            parents=True, exist_ok=True
        )
        # Create a fake source file
        self.src_file = self.root / "source.md"
        self.src_file.write_text("# Test\nSome content.", encoding="utf-8")

    def tearDown(self):
        self.tmp.cleanup()

    def _run_register(
        self, mode: str, filename: str, extra: list[str] | None = None
    ) -> subprocess.CompletedProcess:
        cmd = [
            PYTHON,
            str(SCRIPTS_DIR / "register_awesome_asset.py"),
            "--mode",
            mode,
            "--filename",
            filename,
            "--source-file",
            str(self.src_file),
        ] + (extra or [])
        return _run(cmd, self.root)

    def test_exits_zero(self):
        result = self._run_register("hooks", "test-hook.md")
        self.assertEqual(result.returncode, 0, msg=result.stderr)

    def test_registry_file_created(self):
        self._run_register("hooks", "test-hook.md")
        dest = self.root / ".agents" / "registry" / "awesome" / "hooks" / "test-hook.md"
        self.assertTrue(dest.exists(), f"registry file not found: {dest}")

    def test_load_log_appended(self):
        log = self.root / ".agents" / "index" / "awesome-loads.jsonl"
        self._run_register("agents", "my-agent.agent.md", ["--query", "test search"])
        self.assertTrue(log.exists(), "load log not created")
        lines = log.read_text(encoding="utf-8").splitlines()
        self.assertEqual(len(lines), 1)
        event = json.loads(lines[0])
        self.assertEqual(event.get("event"), "awesome-load")
        self.assertEqual(event.get("mode"), "agents")

    def test_idempotent_register(self):
        """Registering same file twice should not error and log both events."""
        log = self.root / ".agents" / "index" / "awesome-loads.jsonl"
        self._run_register("hooks", "dup.md")
        self._run_register("hooks", "dup.md")
        lines = log.read_text(encoding="utf-8").splitlines()
        self.assertEqual(len(lines), 2, "expected 2 log entries for 2 registrations")

    def test_query_stored_in_log(self):
        self._run_register("instructions", "instr.md", ["--query", "search terms"])
        log = self.root / ".agents" / "index" / "awesome-loads.jsonl"
        event = json.loads(log.read_text(encoding="utf-8").splitlines()[-1])
        self.assertEqual(event.get("query"), "search terms")


# ---------------------------------------------------------------------------
# regenerate_from_registry tests
# ---------------------------------------------------------------------------


class TestRegenerate(TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        idx = self.root / ".agents" / "index"
        idx.mkdir(parents=True, exist_ok=True)
        registry = self.root / ".agents" / "registry" / "awesome" / "hooks"
        registry.mkdir(parents=True, exist_ok=True)
        # Create a cached registry file
        cached = registry / "my-hook.md"
        cached.write_text("# Hook content", encoding="utf-8")
        # Write a matching load log entry
        load_log = idx / "awesome-loads.jsonl"
        load_log.write_text(
            json.dumps(
                {
                    "event": "awesome-load",
                    "mode": "hooks",
                    "filename": "my-hook.md",
                    "storedAs": ".agents/registry/awesome/hooks/my-hook.md",
                    "query": "hook search",
                    "loadedAt": "2026-01-01T00:00:00+00:00",
                }
            )
            + "\n",
            encoding="utf-8",
        )

    def tearDown(self):
        self.tmp.cleanup()

    def _run_regen(self, extra: list[str] | None = None) -> subprocess.CompletedProcess:
        cmd = [PYTHON, str(SCRIPTS_DIR / "regenerate_from_registry.py")] + (extra or [])
        return _run(cmd, self.root)

    def test_exits_zero(self):
        result = self._run_regen()
        self.assertEqual(result.returncode, 0, msg=result.stderr)

    def test_dry_run_no_copy(self):
        self._run_regen(["--dry-run"])
        dest = self.root / ".github" / "hooks" / "awesome" / "my-hook.md"
        self.assertFalse(dest.exists(), "dry-run should NOT create destination file")

    def test_copy_creates_destination(self):
        self._run_regen()
        dest = self.root / ".github" / "hooks" / "awesome" / "my-hook.md"
        self.assertTrue(dest.exists(), f"expected destination file: {dest}")

    def test_copied_content_matches_source(self):
        self._run_regen()
        dest = self.root / ".github" / "hooks" / "awesome" / "my-hook.md"
        self.assertEqual(dest.read_text(encoding="utf-8"), "# Hook content")

    def test_mode_filter_skips_other_modes(self):
        self._run_regen(["--mode", "agents"])
        dest = self.root / ".github" / "hooks" / "awesome" / "my-hook.md"
        self.assertFalse(dest.exists(), "mode=agents filter should skip hooks")


# ---------------------------------------------------------------------------
# pipeline_sync tests
# ---------------------------------------------------------------------------


class TestPipelineSync(TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        # Minimal structure so build step works
        _make_agent_file(self.root / ".github" / "agents" / "x.agent.md")
        (self.root / ".agents" / "index").mkdir(parents=True, exist_ok=True)
        # Create an empty load log so regenerate doesn't crash
        log_file = self.root / ".agents" / "index" / "awesome-loads.jsonl"
        log_file.write_text("", encoding="utf-8")

    def tearDown(self):
        self.tmp.cleanup()

    def _run_sync(self, extra: list[str] | None = None) -> subprocess.CompletedProcess:
        cmd = [PYTHON, str(SCRIPTS_DIR / "pipeline_sync.py")] + (extra or [])
        return _run(cmd, self.root)

    def test_exits_zero_full_run(self):
        result = self._run_sync()
        self.assertEqual(result.returncode, 0, msg=result.stderr + result.stdout)

    def test_report_jsonl_created(self):
        self._run_sync()
        report_file = self.root / ".agents" / "index" / "pipeline-report.jsonl"
        self.assertTrue(report_file.exists(), "pipeline-report.jsonl not created")

    def test_report_log_created(self):
        self._run_sync()
        report_file = self.root / ".agents" / "index" / "pipeline-report.log"
        self.assertTrue(report_file.exists(), "pipeline-report.log not created")

    def test_report_jsonl_valid_json(self):
        self._run_sync()
        report_file = self.root / ".agents" / "index" / "pipeline-report.jsonl"
        for line in report_file.read_text(encoding="utf-8").splitlines():
            if line.strip():
                obj = json.loads(line)  # must not raise
                self.assertIn("overall_status", obj)
                self.assertIn("steps", obj)

    def test_report_appends_on_second_run(self):
        self._run_sync()
        self._run_sync()
        report_file = self.root / ".agents" / "index" / "pipeline-report.jsonl"
        lines = [
            ln
            for ln in report_file.read_text(encoding="utf-8").splitlines()
            if ln.strip()
        ]
        self.assertEqual(len(lines), 2, "expected 2 report entries after 2 runs")

    def test_dry_run_exits_zero(self):
        result = self._run_sync(["--dry-run"])
        self.assertEqual(result.returncode, 0, msg=result.stderr + result.stdout)

    def test_step_selection_build_only(self):
        result = self._run_sync(["--steps", "build"])
        self.assertEqual(result.returncode, 0, msg=result.stderr + result.stdout)
        report_file = self.root / ".agents" / "index" / "pipeline-report.jsonl"
        obj = json.loads(report_file.read_text(encoding="utf-8").splitlines()[0])
        step_names = [s["name"] for s in obj["steps"]]
        self.assertIn("build", step_names)
        # Other steps should be skipped
        for s in obj["steps"]:
            if s["name"] != "build":
                self.assertEqual(
                    s["status"], "skipped", f"step {s['name']} should be skipped"
                )

    def test_minimal_stdout(self):
        """Orchestrator should emit only a short status line (≤3 lines)."""
        result = self._run_sync()
        lines = [ln for ln in result.stdout.splitlines() if ln.strip()]
        self.assertLessEqual(len(lines), 3, f"too much stdout: {result.stdout!r}")

    def test_invalid_step_name_exits_nonzero(self):
        result = self._run_sync(["--steps", "nonexistent"])
        self.assertNotEqual(result.returncode, 0)


if __name__ == "__main__":
    unittest_main(verbosity=2)
