---
name: VSCode_March26 Project Snapshot
description: "Use when: working in this workspace, transferring to Linux VM, setting up fresh environment, onboarding to the AI Traceability System project, or running agents and workflows. Covers project architecture, tech stack, conventions, and migration strategy."
applyTo: "**"
---

# VSCode_March26 — Project Context & Snapshot

## Project Identity

**Name**: Comprehensive AI Traceability System  
**Purpose**: End-to-end observability integrating AI agent execution tracing, knowledge management document auditing, and n8n workflow automation into a unified PostgreSQL backend with OpenTelemetry.  
**Status**: Active development on branch `migrate-from-windows`.

---

## Architecture

```
AI Agent Execution (Python)
        │
        ▼
Knowledge Management System
        │
        ▼
n8n Workflow Observability
        │
        ▼
PostgreSQL Database (16 tables, 3 views)
        │
   ┌────┼────┐
VSCode  Analytics  Compliance
(4317)  (SQL)     (Reports)
```

**Key components:**
- `agents/` — Python agent scripts with OpenTelemetry tracing (`sample_agent.py`, `trace_database.py`)
- `n8n-workflows/` — n8n workflow JSON exports
- `n8n-data/` — Runtime n8n data (excluded from git)
- `GenerateAgents/` — Agent generation tooling and projects
- `agentspec/` — TypeSpec-based agent schema definitions
- `agent-skills/` — Reusable agent skill packages
- `scripts/` — CI/build utilities (PowerShell + Node.js)
- `.github/` — Copilot instructions, workflows, prompts, skills

---

## Tech Stack & Toolchain

| Tool | Version | Purpose |
|------|---------|---------|
| Python | 3.12.9 | Agent scripts, tracing, database |
| Node.js | v24.11.1 | n8n, script tooling |
| pnpm | 10.24.0 | Node package manager |
| n8n | latest | Workflow automation platform |
| PostgreSQL | — | Unified tracing backend |
| OpenTelemetry | >=0.45b0 | Spans, OTLP export (port 4317) |
| agent-framework-azure-ai | 1.0.0b260107 | AI agent SDK (preview) |

---

## Environment Setup

### Quick Start (after fresh clone)

```bash
# Python environment
python -m venv .venv
source .venv/bin/activate          # Linux/macOS
# .\.venv\Scripts\Activate.ps1    # Windows PowerShell
pip install -r requirements.txt

# Node dependencies
pnpm install

# Copy and fill environment variables
cp .env.example .env
# Edit .env — required: N8N_API_URL, N8N_API_KEY, database connection strings
```

### Run n8n

```bash
# Preferred (VS Code task): n8n: Start
npx n8n                            # serves http://localhost:5678
N8N_USER_DATA_DIR=./n8n-data npx n8n
```

### Run n8n-MCP bridge

```bash
npx n8n-mcp    # or VS Code task: n8n-mcp: Start (stdio)
# Env: MCP_MODE=stdio, N8N_API_URL, N8N_API_KEY
```

---

## Coding Conventions

### Python Agents
- All agent scripts live in `agents/`
- Must include OpenTelemetry instrumentation — use `tracing_config.py` as the shared setup module
- Use `python-dotenv` for all config; never hardcode credentials
- Use `pydantic>=2.0.0` for data validation at system boundaries
- Tests go in `tests/` using `pytest` + `pytest-asyncio`
- Always use Python typing annotations

### n8n Workflows
- Use `search_templates()` → `get_node()` → `validate_workflow()` flow
- Trigger nodes → Processing nodes → Output nodes pattern
- Connect IF nodes to route errors; use Error Trigger nodes for recovery
- Export workflow JSON to `n8n-workflows/` before committing

### CI / Scripts
- PowerShell wrappers in `scripts/ci/` mirror Node.js CI scripts
- `npm run ci:commit` — MCP-assisted commit
- `npm run ci:update-context` — updates ContextStream context
- GitHub Actions workflows in `.github/workflows/`

### Git Commit Style
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`
- Branch: `migrate-from-windows` is the active development branch

---

## Size & Transfer Analysis

| Folder | Size | Files | Notes |
|--------|------|-------|-------|
| `node_modules/` | 911 MB | 126,377 | `.gitignore`'d — regenerate with `pnpm install` |
| `.venv/` | 152 MB | 7,907 | `.gitignore`'d — regenerate with `pip install -r requirements.txt` |
| `typespec-reference/` | 7.5 MB | 1,515 | Reference docs |
| `local-bare.git/` | 2.6 MB | 22 | Local bare git mirror |
| Everything else | ~15 MB | ~2,100 | **Actual project content** |
| **Total on disk** | ~1,078 MB | 136,394 | |
| **Transfer payload** | **~15 MB** | ~2,100 | After excluding ignored files |

---

## Migration to Linux VM

### Recommended Approach: Git (already configured)

A `wsl` remote is already pointed at the Linux VM:

```
wsl → ssh://home_linuxos@172.29.248.95/home/home_linuxos/migration/VSCode_March26.git
```

**Step-by-step transfer:**

```bash
# 1. On Windows — commit or stash uncommitted changes
git add -A
git commit -m "chore: snapshot before linux transfer"
# OR: git stash

# 2. Push to Linux VM (branch already exists there)
git push wsl migrate-from-windows

# 3. On Linux VM — clone from the bare repo (if not yet cloned)
cd ~/migration
git clone VSCode_March26.git VSCode_March26-work
cd VSCode_March26-work
git checkout migrate-from-windows

# 4. Restore dependencies on Linux
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pnpm install

# 5. Copy .env (never committed)
# Transfer manually: scp .env home_linuxos@172.29.248.95:~/migration/VSCode_March26-work/.env
```

### What DOES NOT transfer via git (handle separately)

| Item | Reason | Action |
|------|--------|--------|
| `.env` | `.gitignore`'d (secrets) | `scp` or paste manually |
| `n8n-data/` | Runtime state, `.gitignore`'d | Export workflows to `n8n-workflows/` first |
| `node_modules/` | Regenerable | `pnpm install` on target |
| `.venv/` | Regenerable | `pip install -r requirements.txt` |
| `Logs/` | Runtime logs | Skip or scp separately if needed |

### Alternative: rsync (if git push fails)

```bash
# From Windows (requires WSL or Git Bash)
rsync -av --exclude='node_modules' --exclude='.venv' --exclude='n8n-data' \
  --exclude='Logs' --exclude='*.pyc' --exclude='__pycache__' \
  /mnt/c/Users/dylan.a.thomas/Projects/VSCode_March26/ \
  home_linuxos@172.29.248.95:~/migration/VSCode_March26-work/
```

---

## Agent Startup Checklist

When onboarding to this workspace:

1. Read `CLAUDE.md` — ContextStream rules for session management
2. Read `GenerateAgents/AGENTS.md` — GenerateAgents conventions
3. Read `README.md` — project quickstart and observability setup
4. Check `N8N_API_URL`, `N8N_API_KEY`, database connection in `.env`
5. Use `search_templates()` → `get_node()` → `validate_workflow()` for n8n work
6. All agent code must use `tracing_config.py` for OpenTelemetry setup

---

## MCP Tools Available in This Workspace

- `n8n-mcp`: workflow building, node lookup, validation
- `serena`: symbol-level code editing and navigation
- `contextstream`: session memory, plans, search
- `desktop-commander`: file ops, process management
- `github2` / `github`: PR management, issue tracking
