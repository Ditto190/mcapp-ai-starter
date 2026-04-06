#!/usr/bin/env python3
"""Regenerate workspace agent assets from awesome-load logs.

Reads .agents/index/awesome-loads.jsonl and copies cached artifacts from
.agents/registry/awesome/... into project-level destinations.
"""

from __future__ import annotations

import argparse
import json
import os
import shutil
from pathlib import Path

ROOT = (
    Path(os.environ["AGENTS_ROOT"])
    if "AGENTS_ROOT" in os.environ
    else Path(__file__).resolve().parent.parent
)
LOAD_LOG = ROOT / ".agents" / "index" / "awesome-loads.jsonl"


def destination_for(mode: str, filename: str) -> Path:
    filename = filename.replace("\\", "/")

    if mode == "agents":
        if not filename.endswith(".agent.md"):
            filename = f"{filename}.agent.md"
        return ROOT / ".github" / "agents" / "imported" / filename.split("/")[-1]

    if mode == "instructions":
        if (
            not filename.endswith(".instructions.md")
            and filename.endswith(".md") is False
        ):
            filename = f"{filename}.instructions.md"
        return ROOT / ".github" / "instructions" / "imported" / filename.split("/")[-1]

    if mode == "hooks":
        return ROOT / ".github" / "hooks" / "awesome" / filename

    if mode == "prompts":
        if not filename.endswith(".prompt.md") and filename.endswith(".md") is False:
            filename = f"{filename}.prompt.md"
        return ROOT / ".github" / "prompts" / "imported" / filename.split("/")[-1]

    if mode == "skills":
        stem = filename.split("/")[-1].replace(".md", "")
        return ROOT / ".agents" / "skills" / f"imported-{stem}" / "SKILL.md"

    return ROOT / ".agents" / "registry" / "restored" / mode / filename


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Regenerate assets from awesome registry"
    )
    parser.add_argument(
        "--mode",
        default=None,
        help="Optional mode filter (agents|instructions|hooks|prompts|skills)",
    )
    parser.add_argument(
        "--dry-run", action="store_true", help="Show what would be copied"
    )
    args = parser.parse_args()

    if not LOAD_LOG.exists():
        raise SystemExit(f"Log file not found: {LOAD_LOG}")

    restored = 0
    for line in LOAD_LOG.read_text(encoding="utf-8", errors="ignore").splitlines():
        line = line.strip()
        if not line:
            continue
        event = json.loads(line)
        if event.get("event") != "awesome-load":
            continue

        mode = event.get("mode", "other")
        if args.mode and mode != args.mode:
            continue

        stored_rel = event.get("storedAs")
        filename = event.get("filename", "artifact.md")
        if not stored_rel:
            continue

        src = ROOT / stored_rel
        if not src.exists():
            continue

        dst = destination_for(mode, filename)

        if args.dry_run:
            print(f"[dry-run] {src} -> {dst}")
            restored += 1
            continue

        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)
        print(f"Restored: {src} -> {dst}")
        restored += 1

    print(f"Total restored entries: {restored}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
