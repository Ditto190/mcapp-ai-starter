# Project Guidelines

## Code Style
- Follow existing style and tooling per component instead of forcing one formatter stack across the repo.
- Keep changes scoped to the component you touch (`src/`, `examples/`, `generateagents-mcp/`, `n8n/`, `plugins/awesome-copilot/`).
- Prefer existing naming and file conventions in each area; do not mass-reformat unrelated files.

## Architecture
This workspace is a multi-component monorepo:

1. MCP Apps SDK core in `src/` (TypeScript):
   - `src/app.ts` (`App` view runtime)
   - `src/app-bridge.ts` (`AppBridge` host runtime)
   - `src/server/index.ts` (server helpers)
   - `src/message-transport.ts` (iframe postMessage transport)
2. Example servers in `examples/` (workspace-style sample apps).
3. GenerateAgents MCP wrapper in `generateagents-mcp/` (Python/FastMCP).
4. n8n integration assets in `n8n/` and runtime in `docker-compose.yml`.
5. Plugin/content library in `plugins/awesome-copilot/`.

Protocol baseline: `specification/2026-01-26/apps.mdx`

Use nearest-folder guidance when present:
- `generateagents-mcp/AGENTS.md`
- `n8n/AGENTS.md`
- `plugins/awesome-copilot/AGENTS.md`
- `.agents/skills/vercel-react-native-skills/AGENTS.md`

## Build and Test
Run commands for the specific subsystem you are modifying.

Root / SDK / examples:
```bash
# Build SDK bundles
bun build.bun.ts

# Run examples server
npm start

# Primary regression coverage
npm run test:e2e

# Unit tests
npm test
```

GenerateAgents MCP wrapper:
```bash
cd generateagents-mcp
uv sync
uv run python verify.py
python server.py
```

n8n stack:
```bash
# Validate compose config
docker compose config -q

# Start stack
docker compose up

# Tail n8n logs
docker compose logs -f n8n
```

## Conventions
- Treat this repo as componentized: do not assume one root `package.json` script controls every area.
- Prefer folder-local docs and `AGENTS.md` for details before making edits in that folder.
- Keep secrets out of git (`.env` only local; never commit credentials).
- For n8n API operations, include `Authorization: Bearer <N8N_API_KEY>`.
- For MCP server tools, avoid exposing API keys in logs or tool responses.

## Pitfalls
- `.github/copilot-instructions.md` contains broader ecosystem guidance; when conflicts exist, prioritize this file plus nearest-folder `AGENTS.md` in this repository.
- `generateagents-mcp` uses Python/`uv`, while SDK/examples use Bun/npm; use the matching toolchain per component.
- Codespaces URLs can change; update `N8N_HOST` in local `.env` when needed.
