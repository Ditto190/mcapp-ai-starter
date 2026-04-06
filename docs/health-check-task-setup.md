# AGENTS.md — mcapp-ai-starter

Self-hosted AI starter kit (Docker Compose + n8n + Ollama + Qdrant + PostgreSQL).

## Quick Start

```bash
# First time
cp .env.example .env
npm install

# Start AI stack
docker compose --profile cpu up -d

# Health check
bash .devcontainer/scripts/health-check.sh
```

## Key Commands

### Docker Stack
```bash
docker compose up -d                    # CPU mode
docker compose --profile gpu-nvidia up -d  # NVIDIA GPU
docker compose ps                       # Status
```

### Testing
```bash
bash scripts/test-runner.sh             # All tests
bash scripts/test-runner.sh --fast     # Fast (no e2e)
bash scripts/test-runner.sh --suite python  # Python only
bash scripts/test-runner.sh --suite npm    # JS only
```

### Component Commands
| Component | Install | Build | Test |
|-----------|---------|-------|------|
| Root | `npm install` | `npm run build` | `npm test` |
| generateagents-mcp | `cd generateagents-mcp && uv sync` | — | `uv run python verify.py` |
| awesome-copilot | `cd awesome-copilot && npm ci` | `npm run build` | `npm run skill:validate` |
| prompt-registry | N/A (empty) | — | — |

### Python Runtime
- **Use `uv`**: `uv sync`, `uv run python ...`, `uv run pytest ...`
- Never use plain `python` in scripts or CI

## Architecture

```
src/                    # MCP Apps TypeScript SDK
generateagents-mcp/     # Python FastMCP server (GenerateAgents tools)
awesome-copilot/        # Agent/skill/plugin library
examples/               # 27 example MCP servers (React, Vue, Svelte, etc.)
n8n/                    # Demo workflows and data
.github/agents/        # Agent definitions
.github/skills/        # Skill definitions
.agents/skills/        # Local Wasp/skills
```

## Important Patterns

### SKILL.md Files
- Lowercase-hyphen naming (`add-feature/`, `create-mcp-app/`)
- Frontmatter: `name` and `description` (single-quoted)
- Skills indexed in `.github/skills-index.json`

### MCP Apps SDK
- `src/app.ts` — App class
- `src/app-bridge.ts` — AppBridge host mediator
- `src/message-transport.ts` — PostMessage transport
- View-MCP communication via `AppBridge`

### Skills Directory
- `.agents/skills/` — Local Wasp/skills
- `.github/skills/` — Imported skills (~200)
- `.github/skills-index.json` — Skills index

## Conventions

- **Commit format**: `feat(component): description` (Conventional Commits)
- **Worktrees**: Use git worktrees for parallel agent work (`git worktree add ../mcapp-agent-name -b feature/agent-name`)
- **Secrets**: `.env` (never commit), use `.env.example` as template
- **N8N path**: `/data/shared` for local files in n8n workflows

## Services & Ports

| Service | Port | URL |
|---------|------|-----|
| n8n | 5678 | http://localhost:5678 |
| Ollama | 11434 | http://localhost:11434 |
| Qdrant | 6333 | http://localhost:6333 |
| PostgreSQL | 5432 | localhost:5432 |

## Health & Diagnostics

```bash
bash .devcontainer/scripts/health-check.sh   # Full health check
bash .devcontainer/scripts/self-heal-deps.sh # Auto-fix deps
bash .devcontainer/scripts/setup-llm.sh      # Configure LLM providers
```

## LLM Providers

Default: Ollama (no API key needed). Edit `llm.config.json` to enable:
- OpenAI: set `OPENAI_API_KEY` in `.env`
- Anthropic: set `ANTHROPIC_API_KEY`
- Google: set `GEMINI_API_KEY`

## Environment

- Devcontainer: `.devcontainer/devcontainer.json`
- Nix shell: `flake.nix` (Node 20, Python 3.12, uv)
- VSCode extensions: 23 pre-installed (Copilot, Ruff, Prettier, etc.)

## Key Files

- `README.md` — Project overview
- `AGENT_QUICKSTART.md` — Agent onboarding (in `.github/instructions/`)
- `multi-agent-workflow.instructions.md` — Git worktree workflow
- `.github/copilot-instructions.md` — Copilot-specific conventions
- `.github/skills-index.json` — All available SKILL.md files

## OpenCode Notes

- ContextStream MCP configured in `.mcp.json` (HTTP mode)
- Pre-commit hooks: format checks on commit
- Skills auto-discovered from `.agents/skills/` and `consolidated_sources/`
