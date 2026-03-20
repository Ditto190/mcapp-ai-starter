# MCP Apps SDK — AI Assistant Reference

## Project Overview

This is a **hybrid monorepo** combining two major components:

1. **MCP Apps SDK** (`@modelcontextprotocol/ext-apps`) — TypeScript SDK enabling MCP servers to display interactive UIs in conversational clients (the primary codebase)
2. **Self-hosted AI Starter Kit** — Docker Compose stack (n8n, Ollama, Qdrant, PostgreSQL) plus supporting tools

Key SDK abstractions:

- **View** — UI running in an iframe; uses `App` class with `PostMessageTransport` to communicate with host
- **Host** — Chat client embedding the iframe; uses `AppBridge` class to proxy MCP requests
- **Server** — MCP server that registers tools/resources with UI metadata

Specification (stable): `specification/2026-01-26/apps.mdx`

---

## Commands

```bash
# Install dependencies (root)
npm install

# Build the SDK only (generates schemas + bundles, does not build examples)
npm run build

# Build everything (SDK + all examples)
npm run build:all

# Type check + build a single example
npm run --workspace examples/<example-name> build

# Run all examples (starts server at http://localhost:8080)
npm start

# Run E2E tests (primary testing mechanism — starts examples server automatically)
npm run test:e2e

# Run unit tests (E2E tests have broader coverage; unit tests cover specific modules)
npm test

# Sync type-checked code examples from .examples.ts files into JSDoc
npm run sync:snippets

# Check JSDoc comment syntax and {@link} references
npm exec typedoc -- --treatValidationWarningsAsErrors --emit none

# Regenerate package-lock.json (especially on setups w/ custom npm registry)
rm -fR package-lock.json node_modules && \
  docker run --rm -it --platform linux/amd64 -v $PWD:/src:rw -w /src node:latest npm i && \
  rm -fR node_modules && \
  npm i --cache=~/.npm-mcp-apps --registry=https://registry.npmjs.org/
```

---

## SDK Architecture

### Entry Points

- `@modelcontextprotocol/ext-apps` — Main SDK for Views (`App` class, `PostMessageTransport`)
- `@modelcontextprotocol/ext-apps/react` — React hooks (`useApp`, `useHostStyleVariables`, etc.)
- `@modelcontextprotocol/ext-apps/app-bridge` — SDK for Hosts (`AppBridge` class)
- `@modelcontextprotocol/ext-apps/server` — Server helpers (`registerAppTool`, `registerAppResource`)

### Key Source Files

- `src/app.ts` — `App` class extends MCP Protocol; handles guest initialization, tool calls, messaging
- `src/app-bridge.ts` — `AppBridge` class for hosts; proxies MCP requests, sends tool input/results to guests
- `src/server/index.ts` — Helpers for MCP servers to register tools/resources with UI metadata
- `src/types.ts` — Protocol types re-exported from `spec.types.ts` and Zod schemas from `generated/schema.ts` (auto-generated during build)
- `src/message-transport.ts` — `PostMessageTransport` for iframe communication
- `src/react/` — React hooks: `useApp`, `useHostStyles`, `useAutoResize`, `useDocumentTheme`
- `src/generated/` — Auto-generated at build time: `schema.ts`, `schema.json`

### Protocol Flow

```
View (App) <--PostMessageTransport--> Host (AppBridge) <--MCP Client--> MCP Server
```

1. Host creates iframe with view HTML
2. View creates `App` instance and calls `connect()` with `PostMessageTransport`
3. View sends `ui/initialize` request, receives host capabilities and context
4. Host sends `sendToolInput()` with tool arguments after initialization
5. View can call server tools via `app.callServerTool()` or send messages via `app.sendMessage()`
6. Host sends `sendToolResult()` when tool execution completes
7. Host calls `teardownResource()` before unmounting iframe

---

## Examples

Uses npm workspaces. All examples in `examples/` are separate packages. **Always use a `basic-server-*` template as the starting point for new examples.**

### Starter Templates

| Directory | Framework |
|-----------|-----------|
| `basic-server-react` | React |
| `basic-server-vue` | Vue 3 |
| `basic-server-svelte` | Svelte |
| `basic-server-preact` | Preact |
| `basic-server-solid` | Solid.js |
| `basic-server-vanillajs` | Vanilla JavaScript |
| `basic-host` | Reference host implementation |

### Feature Showcase Examples

`budget-allocator-server`, `cohort-heatmap-server`, `customer-segmentation-server`, `debug-server`, `integration-server`, `map-server`, `pdf-server`, `qr-server`, `quickstart`, `scenario-modeler-server`, `shadertoy-server`, `sheet-music-server`, `system-monitor-server`, `threejs-server`, `transcript-server`, `video-resource-server`, `wiki-explorer-server`, `adam-server`, `say-server`

Each example has a `package.json` (name: `@modelcontextprotocol/server-*`) and a `src/` directory containing server code plus frontend.

---

## Documentation Conventions

JSDoc `@example` tags pull type-checked code from companion `.examples.ts` files (e.g., `app.ts` → `app.examples.ts`). Use ` ```ts source="./file.examples.ts#regionName" ` fences referencing `//#region regionName` blocks.

**Region name convention**: `exportedName_variant` or `ClassName_methodName_variant`
- Examples: `useApp_basicUsage`, `App_hostCapabilities_checkAfterConnection`
- For whole-file inclusion (any file type), omit `#regionName`

Run `npm run sync:snippets` to sync examples into JSDoc comments.

Standalone docs in `docs/` (listed in `typedoc.config.mjs` `projectDocuments`) can also have type-checked companion `.ts`/`.tsx` files using the same pattern.

---

## Claude Code Plugin

The `plugins/mcp-apps/` directory contains a Claude Code plugin distributed via the plugin marketplace. Skills:

- `plugins/mcp-apps/skills/create-mcp-app/SKILL.md` — Create a new MCP App
- `plugins/mcp-apps/skills/migrate-oai-app/SKILL.md` — Migrate from OpenAI Apps SDK to MCP Apps SDK
- `plugins/mcp-apps/skills/add-app-to-server/SKILL.md` — Add an app to an existing MCP server
- `plugins/mcp-apps/skills/convert-web-app/SKILL.md` — Convert a web app to an MCP App

---

## Self-hosted AI Stack (Docker)

### Services (`docker-compose.yml`)

| Service | Version | Purpose | Port |
|---------|---------|---------|------|
| n8n | latest (~v2.10.3) | Workflow orchestration (400+ integrations) | 5678 |
| PostgreSQL | 16-alpine | Persistent storage for n8n workflows/credentials | 5432 |
| Ollama | latest | Local LLM inference (auto-pulls llama3.2) | 11434 |
| Qdrant | latest | Vector database for RAG/embeddings | 6333 |

All services share a single `demo` bridge network. Volumes: `n8n_storage`, `postgres_storage`, `ollama_storage`, `qdrant_storage`.

### Commands

```bash
docker compose up                    # CPU mode (works everywhere)
docker compose up --profile gpu-nvidia  # With NVIDIA GPU (requires nvidia-docker)
docker compose up --profile gpu-amd     # With AMD GPU (Linux only)
docker compose logs -f n8n           # Tail n8n logs
docker compose config -q             # Validate compose config
```

### Environment Setup

```bash
cp .env.example .env  # Then edit .env with real secrets
```

Key variables in `.env`:

```bash
POSTGRES_USER=root
POSTGRES_PASSWORD=<strong-password>   # Change before deploying!
POSTGRES_DB=n8n
N8N_ENCRYPTION_KEY=<strong-secret>    # Encrypts credentials in DB
N8N_USER_MANAGEMENT_JWT_SECRET=<secret>
N8N_API_KEY=<bearer-token>            # For headless agent access
N8N_HOST=https://<codespace-id>-5678.app.github.dev  # External URL
```

**Never commit `.env` to git.**

### n8n API Access (for Agents)

```bash
# List workflows
GET /api/v1/workflows
Authorization: Bearer {N8N_API_KEY}

# Create workflow
POST /api/v1/workflows  (JSON body)

# Execute workflow
POST /api/v1/workflows/{id}/execute
```

Workflow templates: store in `n8n/demo-data/workflows/` for auto-loading on stack start. Demo credentials: `n8n/demo-data/credentials/` (encrypted with `N8N_ENCRYPTION_KEY`).

---

## GenerateAgents MCP Server (`generateagents-mcp/`)

A FastMCP Python server that wraps the GenerateAgents CLI, exposing tools to VS Code Copilot, Claude Desktop, and Cline.

### Setup

```bash
cd generateagents-mcp
uv sync
python setup.py all  # Auto-registers with detected clients (VS Code, Claude, Cline)
uv run python verify.py  # Verify setup
```

### Exposed Tools

1. `list_models()` — Returns 100+ supported LLM providers
2. `generate_agents(repo_path, style, model, ...)` — Analyze a local repo
3. `generate_agents_from_github(repo_url, ...)` — Clone + analyze a GitHub repo
4. `validate_output(project_name)` — Check AGENTS.md exists and is well-formed
5. `run_tests(include_e2e?)` — Execute the test suite

Tools sanitize all output (API keys are never exposed in responses). Timeout: 600–900s.

---

## Multi-Component Architecture

```
GenerateAgents.md (Core CLI)
    ↓ wrapped by
GenerateAgents MCP Server → VS Code / Claude / Cline
    ↓ analyzes repos → generates
AGENTS.md files → consumed by
Awesome Copilot agents → distributed via
Prompt Registry extension → used in
n8n workflows (Docker Stack)
```

### Component Summary

| Directory | Language | Purpose |
|-----------|----------|---------|
| `src/` | TypeScript | MCP Apps SDK core |
| `examples/` | TypeScript (multi-framework) | SDK usage examples |
| `plugins/mcp-apps/` | Markdown | Claude Code plugin + skills |
| `generateagents-mcp/` | Python (FastMCP) | MCP server for GenerateAgents CLI |
| `n8n/` | JSON | n8n workflow templates |
| `docs/` | Markdown + TypeScript | API docs and guides |
| `specification/` | MDX | MCP Apps protocol spec |
| `scripts/` | TypeScript/JavaScript | Build and codegen utilities |
| `tests/e2e/` | TypeScript (Playwright) | End-to-end tests |
| `.github/workflows/` | YAML | CI/CD pipelines |

---

## Testing

- **E2E tests** are the primary mechanism (`npm run test:e2e`). They start the examples server automatically. Uses Playwright (`playwright.config.ts`).
- **Unit tests** (`npm test`) cover specific modules. Located alongside source files (e.g., `src/app-bridge.test.ts`).
- **Schema tests**: `src/generated/schema.test.ts`.

CI skips e2e tests requiring LLM API keys by default. Mark those tests with `@pytest.mark.e2e`.

---

## CI/CD (`.github/workflows/`)

| Workflow | Trigger | Purpose |
|---------|---------|---------|
| `ci.yml` | PR / push | Main CI pipeline |
| `npm-publish.yml` | Release | Publish to npm |
| `docs.yml` | Push to main | Build and deploy docs |
| `update-snapshots.yml` | Manual | Update Playwright snapshots |
| `validate-agentskills.yml` | PR | Validate agent skill definitions |
| `repo-ci.yml` | PR | Repository-level checks |

---

## Development Conventions

### TypeScript (SDK)
- All source files in `src/`, built output in `dist/`
- Companion `.examples.ts` files for type-checked JSDoc examples (one per source file)
- Code formatted with Prettier (`.prettierrc.json`)
- Pre-commit hook via Husky (`.husky/pre-commit`)

### Python (generateagents-mcp)
- Python 3.12+ with `uv` package manager
- Type hints mandatory on all function signatures and returns
- Naming: `snake_case` functions/variables, `PascalCase` classes, `ALL_CAPS` constants
- Imports grouped: (1) stdlib, (2) third-party, (3) local

### File Naming (Awesome Copilot / agent content)
- All filenames: lowercase with hyphens (e.g., `api-architect.agent.md`)
- Front matter strings: single quotes
- Skills: folder name must match SKILL.md `name` field

### Secrets
- Never commit `.env` — copy `.env.example` and populate locally
- MCP server sanitizes all output — API keys never appear in responses
- Environment variables: `GEMINI_API_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, etc.

---

## Key Reference Files

| File | Purpose |
|------|---------|
| `.github/copilot-instructions.md` | Multi-component development guide (n8n, GenerateAgents, Prompt Registry, Awesome Copilot) |
| `specification/2026-01-26/apps.mdx` | Stable MCP Apps protocol specification |
| `typedoc.config.mjs` | TypeDoc configuration for API docs |
| `playwright.config.ts` | E2E test configuration |
| `build.bun.ts` | Bun-based SDK build configuration |
| `.vscode/mcp.json` | MCP server configuration for VS Code |
| `generateagents-mcp/README.md` | GenerateAgents MCP tool specs and config examples |

---

## Agent Quick Reference

- Before editing a subdirectory, check if it has its own `AGENTS.md` for folder-specific guidance.
- Use `basic-server-*` templates as the basis for new examples — never start from scratch.
- Run `npm run sync:snippets` after editing `.examples.ts` files.
- The E2E test suite (`npm run test:e2e`) is the authoritative test; run it before submitting changes.
- Docker stack startup: `docker compose up` (CPU) or `docker compose up --profile gpu-nvidia`.
- n8n available at `http://localhost:5678` after stack starts.
- `CLAUDE.md` and `AGENTS.md` are kept in sync — they contain the same content.
