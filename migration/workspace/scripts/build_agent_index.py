#!/usr/bin/env python3
"""Builds an index of Copilot agent assets in this workspace.

Outputs:
- .agents/index/agent-assets.index.json
- .agents/index/agent-assets.log.jsonl
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = (
    Path(os.environ["AGENTS_ROOT"])
    if "AGENTS_ROOT" in os.environ
    else Path(__file__).resolve().parent.parent
)
INDEX_DIR = ROOT / ".agents" / "index"
INDEX_FILE = INDEX_DIR / "agent-assets.index.json"
LOG_FILE = INDEX_DIR / "agent-assets.log.jsonl"

FRONTMATTER_RE = re.compile(r"^---\n(.*?)\n---\n", re.DOTALL)
KEYVAL_RE = re.compile(r"^([A-Za-z0-9_-]+):\s*(.*)$")


@dataclass
class Asset:
    path: str
    assetType: str
    sha256: str
    bytes: int
    modifiedUtc: str
    name: str | None = None
    description: str | None = None


def now_utc() -> str:
    return datetime.now(timezone.utc).isoformat()


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as f:
        while True:
            chunk = f.read(8192)
            if not chunk:
                break
            digest.update(chunk)
    return digest.hexdigest()


def parse_frontmatter(content: str) -> dict[str, Any]:
    m = FRONTMATTER_RE.match(content)
    if not m:
        return {}

    raw = m.group(1)
    out: dict[str, Any] = {}
    for line in raw.splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        km = KEYVAL_RE.match(line)
        if not km:
            continue
        key, value = km.group(1), km.group(2).strip()
        if (
            value.startswith(("'", '"'))
            and value.endswith(("'", '"'))
            and len(value) >= 2
        ):
            value = value[1:-1]
        out[key] = value
    return out


def classify(path: Path) -> str | None:
    p = str(path.as_posix())
    if p.startswith(".github/agents/") and p.endswith(".agent.md"):
        return "agent"
    if p.startswith(".github/instructions/") and p.endswith(".md"):
        return "instruction"
    if p.startswith(".github/prompts/") and p.endswith(".md"):
        return "prompt"
    if p.startswith(".agents/skills/") and p.endswith("/SKILL.md"):
        return "skill"
    if p.startswith(".github/hooks/") and (p.endswith(".json") or p.endswith(".md")):
        return "hook"
    if p.startswith(".agents/registry/awesome/"):
        return "awesome-cache"
    return None


def iter_candidates(root: Path) -> list[Path]:
    globs = [
        ".github/agents/**/*.md",
        ".github/instructions/**/*.md",
        ".github/prompts/**/*.md",
        ".github/hooks/**/*",
        ".agents/skills/**/SKILL.md",
        ".agents/registry/awesome/**/*",
    ]
    files: list[Path] = []
    for pattern in globs:
        for p in root.glob(pattern):
            if p.is_file():
                files.append(p)
    return sorted(set(files))


def build_index(reason: str, changed_path: str | None) -> dict[str, Any]:
    assets: list[Asset] = []
    counts: dict[str, int] = {}

    for absolute in iter_candidates(ROOT):
        rel = absolute.relative_to(ROOT)
        asset_type = classify(rel)
        if asset_type is None:
            continue

        text = ""
        try:
            text = absolute.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            text = ""

        fm = parse_frontmatter(text) if text else {}
        name = fm.get("name")
        description = fm.get("description")

        stat = absolute.stat()
        entry = Asset(
            path=str(rel.as_posix()),
            assetType=asset_type,
            sha256=file_sha256(absolute),
            bytes=stat.st_size,
            modifiedUtc=datetime.fromtimestamp(stat.st_mtime, timezone.utc).isoformat(),
            name=name,
            description=description,
        )
        assets.append(entry)
        counts[asset_type] = counts.get(asset_type, 0) + 1

    index = {
        "generatedAt": now_utc(),
        "root": str(ROOT),
        "reason": reason,
        "changedPath": changed_path,
        "counts": counts,
        "assets": [asdict(a) for a in assets],
    }
    return index


def append_log(event: dict[str, Any]) -> None:
    INDEX_DIR.mkdir(parents=True, exist_ok=True)
    with LOG_FILE.open("a", encoding="utf-8") as f:
        f.write(json.dumps(event, ensure_ascii=False) + "\n")


def main() -> int:
    parser = argparse.ArgumentParser(description="Build agent asset index")
    parser.add_argument("--reason", default="manual", help="Reason for indexing")
    parser.add_argument(
        "--changed-path", default=None, help="Path that triggered this run"
    )
    args = parser.parse_args()

    index = build_index(reason=args.reason, changed_path=args.changed_path)
    INDEX_DIR.mkdir(parents=True, exist_ok=True)
    INDEX_FILE.write_text(
        json.dumps(index, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    append_log(
        {
            "timestamp": now_utc(),
            "event": "index-build",
            "reason": args.reason,
            "changedPath": args.changed_path,
            "counts": index.get("counts", {}),
            "indexFile": str(INDEX_FILE.relative_to(ROOT).as_posix()),
        }
    )

    print(f"Wrote index: {INDEX_FILE}")
    print(f"Counts: {index.get('counts', {})}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
