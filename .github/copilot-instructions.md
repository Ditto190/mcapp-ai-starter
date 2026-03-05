# Copilot Development Guide

## Quick Reference

```bash
# Environment setup
cp .env.example .env  # Configure n8n stack secrets

# GenerateAgents.md CLI
cd GenerateAgents.md && uv sync --extra dev
uv run autogenerateagentsmd /path/to/repo --style comprehensive
uv run pytest -m 'not e2e' -q  # Run fast tests

# MCP Server setup
cd generateagents-mcp && python setup.py all  # Auto-register with VS Code/Claude

# Self-hosted stack
docker compose up --profile gpu-nvidia  # With GPU
docker compose up  # CPU only
docker compose logs -f n8n  # Tail logs

# Prompt Registry (Node.js)
cd prompt-registry && npm install && npm test

# Awesome Copilot
cd awesome-copilot && npm ci && npm run build
```

## Setup Verification Checklist (Run This First)

Use this sequence to confirm setup/config/install across all integrated repos:

```bash
# 1) Root stack config
cd /workspaces/self-hosted-ai-starter-kit
docker compose config -q

# 2) GenerateAgents.md (Python)
cd GenerateAgents.md
uv sync --extra dev
uv run autogenerateagentsmd --help

# 3) generateagents-mcp (Python/FastMCP)
cd ../generateagents-mcp
uv sync
uv run python verify.py

# 4) prompt-registry (TypeScript extension)
cd ../prompt-registry
npm install
npm run compile

# 5) awesome-copilot (content library)
cd ../awesome-copilot
npm ci
npm run build
```

### Known Caveats During Verification
- `prompt-registry` full `npm test` may trigger VS Code integration download; use `npm run compile` as the fast setup smoke test.
- `generateagents-mcp` should be invoked with `uv run python ...` in environments where `python` is not on PATH.
- `awesome-copilot` may fail strict plugin validation depending on current plugin manifest format; treat `npm run build` as the baseline setup signal.

## Architecture Overview

This is a **multi-component AI toolkit** organized as:

1. **GenerateAgents.md** (`GenerateAgents.md/`) — Core CLI using DSPy + LiteLLM to generate `AGENTS.md` documentation for any codebase
2. **GenerateAgents MCP Server** (`generateagents-mcp/`) — FastMCP server wrapping the CLI, exposing tools to VS Code Copilot, Claude Desktop, and Cline
3. **Self-hosted AI Stack** — Docker Compose environment with n8n v2.10.3, Ollama, Qdrant, PostgreSQL 16-alpine
4. **Prompt Registry** (`prompt-registry/`) — VS Code extension for discovering/managing prompt libraries with TypeScript + Webpacker
5. **Awesome Copilot** (`awesome-copilot/`) — Collection of agent blueprints (`.agent.md`), skills (SKILL.md folders), hooks, workflows, and plugins

**Component Dependencies**:
```
GenerateAgents.md (Core)
    ↓ wraps
GenerateAgents MCP Server → VS Code/Claude/Cline
    ↓ analyzes repos to generate
AGENTS.md files → consumed by
Awesome Copilot agents → distributed via
Prompt Registry extension → used in
n8n workflows (Docker Stack)
```

**Key insight**: GenerateAgents.md is the intellectual core; the MCP server is its distribution layer; Awesome Copilot is the content library.

---

## GenerateAgents.md Development

### Stack & Conventions
- **Python 3.12+** with `uv` package manager
- **Type hints mandatory** on all function signatures and returns
- **Naming**: `snake_case` functions/variables, `PascalCase` classes, `ALL_CAPS_WITH_UNDERSCORES` constants
- **Imports**: Group as (1) stdlib, (2) third-party, (3) local

### Core Architecture Pattern
```
src/autogenerateagentsmd/
├── cli.py          # Entry point, parses args, orchestrates pipeline
├── modules.py      # DSPy.Module classes (CodebaseConventionExtractor, AgentsMdCreator, AntiPatternExtractor)
├── signatures.py   # DSPy.Signature definitions (contracts for LLM-driven steps)
├── model_config.py # LLM configuration, supports 100+ providers via LiteLLM
└── utils.py        # File I/O, git operations, no LLM logic
```

**Pipeline flow**: `cli.py` → load source tree → extract conventions (RLM) → generate sections (DSPy) → compile → save to disk

### Key Patterns
- **Recursive Language Models (RLM)** via DSPy for multi-pass analysis; not simple prompts
- **Style parameter** controls output: "comprehensive" (full architecture) vs "strict" (only constraints/anti-patterns)
- **Generate git lessons**: `--analyze-git-history` inspects reverted commits to deduce anti-patterns
- **Environment isolation**: `.env` file (never in repo) holds all API keys; code loads via `python-dotenv`

### Testing
```bash
# Run all non-e2e tests (no API keys required)
cd GenerateAgents.md && uv run pytest -m 'not e2e' -q

# Run specific test with timeout
uv run pytest tests/test_modules.py::test_codebase_convention_extractor_init_comprehensive -v
```
Tests use `@pytest.mark.e2e` for integration tests requiring LLM API keys. CI skips e2e by default.

---

## GenerateAgents MCP Server Development

### Stack
- **FastMCP** (Python MCP framework) for tool registration
- **Pydantic dataclasses** for request/response validation
- **Subprocess** for executing GenerateAgents CLI with timeout handling (600-900s)

### Five Exposed Tools
1. `list_models()` — Returns supported LLM providers (100+)
2. `generate_agents(repo_path, style, model, ...)` — Local repo analysis
3. `generate_agents_from_github(repo_url, ...)` — Clone + analyze GitHub repo
4. `validate_output(project_name)` — Check AGENTS.md exists and is well-formed
5. `run_tests(include_e2e?)` — Execute test suite

### Integration Pattern
- **stdio transport by default** (VS Code Copilot, Claude Desktop)
- **HTTP transport available** (cloud deployment; see DEPLOYMENT.md)
- Tools validate inputs, sanitize outputs (never expose API keys), handle timeouts gracefully
- Results include structured response + first 1000 chars of generated AGENTS.md for preview

### Setup & Deployment
```bash
# Quick test
cd generateagents-mcp && python setup.py all  # Auto-registers with detected clients

# For VS Code: copies config to .vscode/settings.json
# For Claude: updates ~/.claude/config.json (platform-dependent)
# For Cline: updates ~/.cline/mcp-servers.json
```

---

## Self-hosted AI Stack (n8n + Docker)

### Current Services (docker-compose.yml)
- **n8n:latest** (v2.10.3) — Low-code platform with 400+ integrations, orchestrates AI workflows
- **PostgreSQL 16-alpine** — Persistent storage for n8n workflows/credentials and metadata
- **Ollama:latest** — Local LLM inference (pulls llama3.2 on startup, supports 100+ models)
- **Qdrant:latest** — Vector database for RAG, embeddings storage (port 6333)
- **Volumes**: `n8n_storage`, `postgres_storage`, `ollama_storage`, `qdrant_storage`
- **Network**: Single `demo` bridge network for service discovery
- **Health checks** on PostgreSQL with `pg_isready` command

### Environment Configuration (.env.example → .env)
Copy `.env.example` to `.env` and customize:

```bash
# PostgreSQL (required)
POSTGRES_USER=root
POSTGRES_PASSWORD=password  # Change in production!
POSTGRES_DB=n8n

# n8n Security (required, generate strong secrets)
N8N_ENCRYPTION_KEY=super-secret-key  # For encrypting credentials
N8N_USER_MANAGEMENT_JWT_SECRET=even-more-secret  # JWT signing

# Agent API access (optional, for headless workflows)
N8N_API_KEY=DXx4zJ8kL2m9vQ5bR3tY7wNpH6sC1eF0oX2yZ9aB4d=  # Bearer token
N8N_HOST=https://<codespace-id>-5678.app.github.dev  # External URL

# Ollama (Mac users running locally, see README)
# OLLAMA_HOST=host.docker.internal:11434  # Uncomment for local Mac Ollama
```

**Critical**: Change default passwords before deployment. Never commit `.env` to Git.

### GPU Profiles
- `--profile gpu-nvidia` — CUDA support (requires nvidia-docker)
- `--profile gpu-amd` — ROCm support (Linux only)
- No profile = CPU mode (works everywhere, slower inference)

### Agent Access to n8n (Self-hosted in Codespaces)

**Setup**:
```bash
# 1. Verify .env has proper N8N_API_KEY and N8N_HOST set
cat .env | grep N8N_

# 2. Start self-hosted stack
docker compose up  # (add --profile gpu-nvidia for GPU)

# 3. Once n8n is running (http://localhost:5678), find your Codespace URL
# Format: https://<codespace-id>-5678.app.github.dev
```

**Agent Configuration** (for MCP or API-based workflows):
```json
{
  "n8n": {
    "api_url": "https://<codespace-id>-5678.app.github.dev",
    "api_key": "DXx4zJ8kL2m9vQ5bR3tY7wNpH6sC1eF0oX2yZ9aB4d=",
    "mode": "headless"
  }
}
```

**Agent Operations**:
- List workflows: `GET /api/v1/workflows` (Authorization: Bearer {N8N_API_KEY})
- Create workflow: `POST /api/v1/workflows` + JSON body
- Execute workflow: `POST /api/v1/workflows/{id}/execute`
- Get credentials: `GET /api/v1/credentials` (for workflow setup)

**Key Constraints**:
- API requests must include `Authorization: Bearer {N8N_API_KEY}` header
- Codespace URL changes if container restarts; update `.env` N8N_HOST if needed
- Workflows created by agents are stored in PostgreSQL (persistent across restarts)

### Workflow Conventions
- Store template workflows in `n8n/demo-data/workflows/` for pre-loading (imported on docker-compose up)
- Store demo credentials in `n8n/demo-data/credentials/` (sensitive keys encrypted with N8N_ENCRYPTION_KEY)
- Use PostgreSQL for persistent data (not file-based)
- Configure Ollama/external LLM endpoints in n8n credentials UI or via API
- Health checks ensure all services ready before agents make requests

---

## Prompt Registry (VS Code Extension)

### Stack
- **TypeScript** with strict mode, ESLint for linting
- **Webpack** for bundling (config in `webpack.config.js`)
- **VS Code Extension API** for UI/commands
- **Testing**: Mocha + sinon for mocking, rigorous test-first methodology

### Key Concepts
- **Marketplace** — Tile-based UI for discovering prompt bundles
- **Sources** — GitHub repos, local directories, Awesome Copilot collections
- **Profiles & Hubs** — Organize bundles by team/project, share configurations
- **Installation** — One-click install copies prompts to workspace `.copilot/prompts/` or global Copilot cache
- **Adapters pattern** — `src/adapters/` abstracts GitHub/local/registry data sources

### Rigorous Testing Methodology
Prompt Registry follows **test-first development** with strict completion criteria. Key principles:

1. **Bug fixes start with failing tests** — Reproduce → confirm failure → fix → confirm pass
2. **E2E tests must invoke actual code paths**, not reimplement logic
3. **Compilation + mock setup must work** before marking tasks complete
4. **Read `test/AGENTS.md` before writing tests** — contains VS Code mocking patterns, helpers, debugging strategies

See [prompt-registry/AGENTS.md](../prompt-registry/AGENTS.md) for comprehensive testing guidance.

### Architecture
```
src/
├── adapters/       # Data source abstraction (GitHub, local, registry)
├── services/       # Business logic (RegistryManager, BundleInstaller)
├── commands/       # VS Code command handlers
└── utils/          # Shared utilities
```

### Development Commands
```bash
cd prompt-registry
npm install           # Install dependencies
npm test             # Run test suite
npm run lint         # Check code style
npm run build        # Webpack bundle for distribution
```

---

## Awesome Copilot (Agent Library)

### Content Types
1. **Agents** (`agents/*.agent.md`) — Specialized Copilot agents with MCP integration
   - Front matter: `description` (required), `tools`, `model` (recommended)
   - Example: `agents/api-architect.agent.md`, `agents/azure-principal-architect.agent.md`

2. **Instructions** (`instructions/*.instructions.md`) — File-pattern-scoped coding standards
   - Front matter: `description`, `applyTo` (e.g., `'**.js, **.ts'`)
   - Applied automatically when matching files are opened

3. **Skills** (`skills/*/SKILL.md`) — Self-contained folders with bundled assets
   - Each folder has `SKILL.md` with frontmatter (`name`, `description`)
   - Can include scripts, templates, data files (< 5MB each)
   - Example: `skills/terraform-azurerm-set-diff-analyzer/`

4. **Hooks** (`hooks/*/README.md + hooks.json`) — Event-triggered workflows
   - `README.md` with frontmatter (`name`, `description`)
   - `hooks.json` defines trigger events (pre-commit, post-checkout, etc.)
   - Example: `hooks/session-logger/`, `hooks/governance-audit/`

5. **Workflows** (`workflows/*.md`) — GitHub Actions agentic workflows
   - Front matter: `name`, `description`, `on`, `permissions`, `safe-outputs`
   - Natural language instructions for automated GitHub operations
   - Only `.md` files accepted (no `.yml`)

6. **Plugins** (`plugins/*/plugin.json`) — Installable bundles grouping agents/skills/commands
   - `plugin.json` with `name`, `description`, `version`, `items[]`
   - Items reference agents/skills from top-level directories
   - `marketplace.json` auto-generated on build

### Development Workflow
```bash
cd awesome-copilot
npm ci                              # Install dependencies
npm run build                       # Generate README.md + marketplace.json

# Create new resources
npm run skill:create -- --name <skill-name>
npm run plugin:create -- --name <plugin-name>

# Validation
npm run skill:validate              # Validate all skills
npm run plugin:validate             # Validate plugin manifests
```

### File Naming Conventions
- All files: **lowercase with hyphens** (e.g., `api-architect.agent.md`)
- Front matter strings: **single quotes** (e.g., `description: 'Azure expert'`)
- Skills: Folder name must match SKILL.md `name` field

### Contributing to Awesome Copilot
- Agents stored in `awesome-copilot/agents/` with `.agent.md` extension
- Follow existing agent format: overview, capabilities, integration points
- Agents are auto-exposed in Prompt Registry Marketplace on new plugin versions
- **Read `.github/copilot-instructions.md` in awesome-copilot** for review checklist

---

## Development Workflows

### Environment Setup
```bash
# Clone repo + initialize
git clone https://github.com/n8n-io/self-hosted-ai-starter-kit
cd self-hosted-ai-starter-kit

# GenerateAgents.md
cd GenerateAgents.md && uv sync --extra dev
export GEMINI_API_KEY="..." # or other provider

# GenerateAgents MCP Server
cd ../generateagents-mcp && uv sync

# Prompt Registry (Node.js)
cd ../prompt-registry && npm install
```

### AI Agents Building n8n Workflows

This is the **agent-first workflow automation** pattern:

**Agent Workflow**:
1. Agent calls GenerateAgents MCP to analyze target codebase → produces `AGENTS.md`
2. Agent reads `AGENTS.md` to understand architecture
3. Agent designs n8n workflow (nodes, connections, credentials)
4. Agent calls n8n API `POST /api/v1/workflows` to create workflow
5. Agent calls `POST /api/v1/workflows/{id}/execute` to test
6. Agent validates output, iterates if needed

**Implementation Example** (pseudo-code):
```python
import requests

n8n_api = "https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev"
api_key = "DXx4zJ8kL2m9vQ5bR3tY7wNpH6sC1eF0oX2yZ9aB4d="

# Create workflow from agent-designed spec
workflow_json = {
    "name": "Agent-Generated ETL",
    "nodes": [...],  # Agent-designed nodes
    "connections": [...],  # Agent-designed connections
    "active": True
}

response = requests.post(
    f"{n8n_api}/api/v1/workflows",
    json=workflow_json,
    headers={"Authorization": f"Bearer {api_key}"}
)

workflow_id = response.json()["data"]["id"]

# Execute and validate
exec_response = requests.post(
    f"{n8n_api}/api/v1/workflows/{workflow_id}/execute",
    headers={"Authorization": f"Bearer {api_key}"}
)
```

**Key Integration Points**:
- **GenerateAgents MCP** → understands target repo architecture
- **n8n API** → creates/manages workflow definitions
- **n8n Credentials** → agents can fetch available credentials to link nodes
- **n8n Execution** → agents can test workflows before marking complete

### Local Testing
```bash
# Test GenerateAgents on a local repo
cd GenerateAgents.md
uv run autogenerateagentsmd /path/to/repo --style comprehensive

# Test MCP server (stdio transport)
cd ../generateagents-mcp && python server.py
# (Server listens on stdin/stdout; Ctrl+C to stop)

# Start self-hosted stack
cd .. && docker compose up --profile gpu-nvidia  # (omit profile for CPU)
# n8n available at http://localhost:5678
```

### Adding a New Feature
1. **CLI flag**: Edit `GenerateAgents.md/src/autogenerateagentsmd/cli.py` (argparse)
2. **Logic**: Implement in `modules.py` or `utils.py` with full type hints
3. **Tests**: Add to `tests/test_*.py`, mark as `@pytest.mark.e2e` if requires API
4. **Update docs**: GenerateAgents.md.README.md (auto-generated AGENTS.md updates on commit)
5. **MCP exposure** (if user-facing): Update `generateagents-mcp/server.py` to wrap the tool

### Debugging
- **GenerateAgents.md**: Enable `logging.basicConfig(level=logging.DEBUG)` in cli.py
- **MCP Server**: Check stderr from `python server.py` or redirect to file: `python server.py 2>&1 | tee debug.log`
- **Docker**: Use `docker compose logs -f <service>` (n8n, postgres, ollama, etc.)

---

## Cross-Component Patterns

### How Data Flows
1. **User request** → MCP tool call (VS Code/Claude) or direct CLI execution
2. **Repository analysis** → GenerateAgents CLI clones repo (GitHub) or reads local path
3. **LLM analysis** → DSPy modules invoke LLM (via LiteLLM, supports Gemini/Claude/OpenAI/Ollama/OpenRouter)
4. **Output** → AGENTS.md file saved to `GenerateAgents.md/projects/<repo_name>/AGENTS.md`
5. **Optional**: n8n workflows can trigger GenerateAgents via API, store results in PostgreSQL

### API Keys & Secrets
- **Never commit** `.env` files or API keys
- GenerateAgents.md loads from `.env` at runtime via `python-dotenv`
- MCP server **sanitizes all output** — never leaks API keys in responses
- Use environment variables for all credentials: `GEMINI_API_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, etc.

---

## References
- [GenerateAgents.md README](../GenerateAgents.md/README.md) — Detailed CLI usage, model support
- [GenerateAgents AGENTS.md](../GenerateAgents.md/AGENTS.md) — Auto-generated architecture guide
- [MCP Server README](../generateagents-mcp/README.md) — Tool specifications, config examples
- [MCP Deployment Guide](../generateagents-mcp/DEPLOYMENT.md) — Cloud deployment, HTTP transport
- [Prompt Registry Docs](../prompt-registry/docs/) — Extension architecture, plugin development
- [Awesome Copilot README](../awesome-copilot/README.md) — Agent collection, skill contributions

---

## Agent quick-start (summary for Copilot / agents)

Use these bullets when you need a compact reference for automated agents working in this repo.

- Primary commands: see the top "Quick Reference" code block for `uv`, `docker compose`, `npm` workflows.
- Before editing a folder, read its `AGENTS.md` (e.g., `prompt-registry/src/*/AGENTS.md`, `GenerateAgents.md/AGENTS.md`).
- Key components:
   - `GenerateAgents.md/` — core CLI to generate AGENTS.md
   - `generateagents-mcp/` — MCP server exposing GenerateAgents tools
   - `awesome-copilot/` — agents, instructions, skills, plugins
   - `prompt-registry/` — VS Code extension (TypeScript)
- Conventions: lowercase-hyphen filenames for prompts/agents, YAML frontmatter with quoted `description`, Python type hints and naming rules in `GenerateAgents.md`.
- Secrets: never commit `.env` — copy `.env.example` and populate keys locally. Verify `N8N_HOST`/`N8N_API_KEY` before running workflows.
- Safety: avoid running LLM-powered analysis on private/proprietary repos without explicit approval (sensitive data may be sent to LLM providers).

If you want, I can also add a short `DEVELOPER-QUICKSTART.md` at the repo root with one-line commands per component.

