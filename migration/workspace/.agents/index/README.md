# Agent Registry Index

This directory stores generated indexes and logs for Copilot agent assets.

## Files

- `agent-assets.index.json` — latest full snapshot of discovered assets.
- `agent-assets.log.jsonl` — append-only operational log of index builds.
- `awesome-loads.jsonl` — append-only log of assets loaded from awesome-copilot and registered into local cache.

## Local cache

Loaded external assets are stored under:

- `.agents/registry/awesome/<mode>/<filename>`

## Why this exists

- Tracks searchable history of agent/instruction/skill assets
- Supports cleanup and regeneration workflows
- Avoids losing externally loaded templates between sessions
