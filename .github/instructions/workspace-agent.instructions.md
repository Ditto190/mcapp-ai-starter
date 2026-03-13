---
description: "Workspace-level Copilot instructions to bootstrap AI assistants for the MCP Apps SDK workspace."
applyTo: "**"
---

# Workspace Copilot Instructions — MCP Apps SDK

These instructions give Copilot quick access to the repository's most important conventions, build/test commands, architecture notes, and how to surface server-side context via io.github.contextstreamio/mcp-server.

Keep this file focused and concise — Copilot will read it when generating code or answering questions about repository-wide concerns.

## Quick commands (open a terminal in repository root)

- Install dependencies: npm install
- Build: npm run build
- Build all examples: npm run build:all
- Run examples server (dev): npm start
- Run E2E tests: npm run test:e2e
- Run unit tests: npm test

## High-level architecture

- Purpose: `@modelcontextprotocol/ext-apps` implements the MCP Apps SDK (Host, View, Server) for rendering interactive Views inside chat clients.
- Key folders:
  - `src/` — SDK core (app.ts, app-bridge.ts, message-transport.ts, server helpers)
  - `examples/` — runnable example packages and servers
  - `plugins/` — plugin examples and Copilot/agent customizations
  - `specification/` — protocol specification and schemas

## Repo conventions and guidance

- TypeScript code: prefer explicit types and exported index files for public APIs.
- File naming: PascalCase for public types and React components; kebab-case for prompts/instructions files in `plugins/`.
- Tests: Playwright for E2E; use descriptive test names and keep test helpers in `tests/` or `examples/*/tests`.

## Where to look first

- `AGENTS.md` — project overview and commands (highly relevant for assistants)
- `src/` — implementation entry points (app, app-bridge, server helpers)
- `examples/` — live examples and minimal reproduction sandboxes
- `plugins/` — Copilot customizations and sample instruction/skill templates

## Context engineering — io.github.contextstreamio/mcp-server

When instruction files or agents need runtime/context signals, surface them via the MCP server so Copilot can reason with environment metadata instead of relying on brittle local heuristics.

Include a short "context engineering" note in instruction files that require runtime context. Keep it to 1–3 bullets and include an example `applyTo` pattern. Example guidance to include in an instruction file:

- Context exposed: `mcp-server` exposes `project.metadata` (version, examples list), `build/status` (last build sha & timestamp), and `tools` capabilities (available tools and example endpoints).
- How it's surfaced: the MCP server provides endpoints under `/mcp/` that return JSON document with `project`, `examples`, and `ci` fields. Use `io.github.contextstreamio/mcp-server` in the instruction frontmatter to signal context usage.
- Suggested applyTo pattern: `applyTo: 'src/**, examples/**, plugins/**'`

If you author an instruction that references runtime state (build results, deployed endpoints, or CI artifacts), add a short example showing the minimal JSON shape expected from the MCP server and a recommended `applyTo` glob so Copilot applies the guidance narrowly.

Example minimal JSON shape (for guidance only):

```json
{
  "project": { "name": "mcapp-ai-starter", "version": "0.0.0" },
  "examples": [
    {
      "name": "basic-server-react",
      "url": "http://localhost:8080/basic-server-react"
    }
  ],
  "ci": {
    "lastPipeline": {
      "status": "success",
      "sha": "abc123",
      "timestamp": "2026-03-01T12:00:00Z"
    }
  }
}
```

## Writing/Updating instruction files (quick checklist)

- Use YAML frontmatter with `description` and `applyTo` fields.
- Keep the body focused (1–300 lines); include a few concrete code examples.
- If the instruction needs runtime data, add the short context-engineering note (1–3 bullets) referencing `io.github.contextstreamio/mcp-server` and an example `applyTo`.

## Example prompts to try

- "Generate a minimal example README for `examples/basic-server-react` following project conventions."
- "Create a Playwright test for the `basic-server-react` example that checks the host iframe initializes the App."

## Notes

- Preserve `AGENTS.md` for high-level architecture — prefer updating it for large changes rather than duplicating content here.
- Keep instruction files in `plugins/` under explicit `applyTo` globs to avoid global noise.

---

Generated/edited by repository bootstrap assistant — update if repo conventions change.
