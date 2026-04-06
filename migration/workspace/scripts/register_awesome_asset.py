#!/usr/bin/env python3
"""Register a loaded awesome-copilot artifact into workspace registry.

This script stores loaded files under:
- .agents/registry/awesome/<mode>/<filename>

and appends metadata to:
- .agents/index/awesome-loads.jsonl
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
from datetime import datetime, timezone
from pathlib import Path

ROOT = (
    Path(os.environ["AGENTS_ROOT"])
    if "AGENTS_ROOT" in os.environ
    else Path(__file__).resolve().parent.parent
)
REGISTRY_ROOT = ROOT / ".agents" / "registry" / "awesome"
INDEX_DIR = ROOT / ".agents" / "index"
LOAD_LOG = INDEX_DIR / "awesome-loads.jsonl"


FRONTMATTER_RE = re.compile(r"^---\n(.*?)\n---\n", re.DOTALL)


def now_utc() -> str:
    return datetime.now(timezone.utc).isoformat()


def sanitize_filename(value: str) -> str:
    keep = []
    for ch in value:
        if ch.isalnum() or ch in ("-", "_", ".", "/"):
            keep.append(ch)
        else:
            keep.append("_")
    cleaned = "".join(keep).strip("._/")
    return cleaned or "artifact.md"


def parse_frontmatter_text(content: str) -> dict:
    m = FRONTMATTER_RE.match(content)
    if not m:
        return {}
    fm: dict[str, str] = {}
    for line in m.group(1).splitlines():
        if ":" not in line:
            continue
        k, v = line.split(":", 1)
        fm[k.strip()] = v.strip().strip("\"'")
    return fm


def append_log(event: dict) -> None:
    INDEX_DIR.mkdir(parents=True, exist_ok=True)
    with LOAD_LOG.open("a", encoding="utf-8") as f:
        f.write(json.dumps(event, ensure_ascii=False) + "\n")


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Register a loaded awesome-copilot artifact"
    )
    parser.add_argument(
        "--mode", required=True, help="agents|instructions|hooks|prompts|skills|other"
    )
    parser.add_argument(
        "--filename", required=True, help="Original filename from awesome-copilot index"
    )
    parser.add_argument(
        "--source-file", required=True, help="Path to loaded source file"
    )
    parser.add_argument(
        "--query", default=None, help="Search query/keywords that led to this load"
    )
    parser.add_argument("--notes", default=None, help="Optional operator notes")
    args = parser.parse_args()

    source = Path(args.source_file).resolve()
    if not source.exists() or not source.is_file():
        raise SystemExit(f"Source file not found: {source}")

    safe_filename = sanitize_filename(args.filename)
    destination = REGISTRY_ROOT / sanitize_filename(args.mode) / safe_filename
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, destination)

    text = destination.read_text(encoding="utf-8", errors="ignore")
    fm = parse_frontmatter_text(text)

    event = {
        "timestamp": now_utc(),
        "event": "awesome-load",
        "mode": args.mode,
        "filename": args.filename,
        "query": args.query,
        "notes": args.notes,
        "sourceFile": str(source),
        "storedAs": str(destination.relative_to(ROOT).as_posix()),
        "frontmatter": {
            "name": fm.get("name"),
            "description": fm.get("description"),
        },
    }

    append_log(event)
    print(f"Registered: {destination}")
    print(f"Logged: {LOAD_LOG}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
