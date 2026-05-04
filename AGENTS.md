# AGENTS.md — foam-modme

Primary agent baseline for this repository.

## Read order

1. `.github/copilot-instructions.md`
2. `README.md`
3. `DEVELOPER-QUICKSTART.md`
4. `QUICKSTART.md`

## Project profile

`foam-modme` is a multi-component workspace combining Docker stack assets, Node/TypeScript components, Python components, and agent customization content.

## Core command routing

- Docker stack validation/start:
  - `docker compose config -q`
  - `docker compose up` (or profile variants)
- TypeScript/Node components: use project-local `npm` scripts.
- Python components: prefer `uv run ...` / `uv sync` workflows.

## Safety and conventions

- Use Linux paths.
- Keep instruction files concise and link to canonical docs rather than duplicating large sections.
- Treat `.env` as required for secrets; never commit secrets.
- For shell assumptions and aliases, rely on `/home/wsl-vm/.zshrc`.

## Canonical references

- Repo Copilot rules: `.github/copilot-instructions.md`
- Docker + starter context: `README.md`
- Fast command index: `DEVELOPER-QUICKSTART.md`
- Setup flow: `QUICKSTART.md`
- Terminal onboarding quickstart: `docs/getting-started/terminal-zsh-beginner-quickstart.md`

## Zed editor (WSL)

Zed requires software Vulkan rendering in WSL2. The `zed()` function in `~/.zshrc` handles this automatically.

```zsh
zed .                          # open current project
pkill -f zed-editor && zed .   # force fresh start if frozen
```

- Working install: `~/.local/zed.app/` (local curl install)
- Nix `zeditor` binary: **broken for GUI** in WSL — do not use
- Full guide: `docs/inbox/wsl-notes/zed-wsl-quickstart.md`

---

## APM_RULES

This repository uses the APM (Agent Project Management) framework for structured multi-agent execution.

### APM Context

- **Project**: foam-modme Knowledge Management Platform
- **Phase**: 1 — Taxonomy + Schema Design + Wasp Scaffold + Recipe Docs
- **APM files**: `.apm/spec.md`, `.apm/plan.md`, `.apm/tracker.md`, `.apm/memory/index.md`
- **Plan session**: 2026-05-04 (3 Planner Q&A rounds, Understanding Summary approved)

### Worker Rules

1. Update `.apm/tracker.md` task status when starting (🔄) or completing (✅) any task
2. Log significant decisions in `.apm/memory/index.md`
3. **NEVER modify** `docs/publishing/` — existing publishing recipes must be preserved
4. **Prisma ORM is the persistence layer** — do NOT use Qdrant for knowledge management data
5. **Bun is the package manager** — never use `npm install` or `yarn add` in this workspace
6. TypeScript strict mode for all new `.ts`/`.tsx` files
7. Biome for linting and formatting (`biome.json` at workspace root)
8. Zod for all schema validation (Zod v4)

### PII Rules

- PII config: `.pii-rules.csv` at project root (or user-specified path)
- **NEVER committed** — listed in `.gitignore`
- **Agents must NOT attempt to read or parse `.pii-rules.csv`** — it is intentionally agent-unreadable (chmod 600)
- Replacement script reads the file and substitutes PII keywords with placeholders before notes enter the system
- PII blocking runs BEFORE any note is classified, stored, or passed to any model

### Knowledge Platform Architecture

| Component | Directory | Layer |
|-----------|-----------|-------|
| A.D.A.M. MCP server | `examples/adam-server/` | Agent-facing tools (MCP protocol) |
| Wasp app | `knowledge-platform/` | Human-facing UI (web) |
| Database | Docker `postgres` service | Shared PostgreSQL 16 via Prisma ORM |

### Classification System (Two Tracks)

- **Track A** (`capability`): Dynamic Capabilities methodology → phases: `sensing` / `seizing` / `transforming` / `integrative-learning`
- **Track B** (`task-bundle`): Meeting notes → domain-organised artefacts → RFI proposals + status dashboard
- See `docs/knowledge-platform/taxonomy.md` for full classification reference
- Error `Failed to create surface for any enabled backend: {}` → kill stale daemon and relaunch

## Terminal helper commands (WSL zsh)

- Beginner helpers (from `/home/wsl-vm/.zshrc`):
  - `term-help`, `here`, `up`, `finddir`, `findfile`, `learn`, `askcmd`
- Awesome-copilot cache helpers (from `/home/wsl-vm/.zshrc`):
  - `acp-status`, `acp-skill-list`, `acp-skill-open`, `acp-agent-list`, `acp-agent-install`
