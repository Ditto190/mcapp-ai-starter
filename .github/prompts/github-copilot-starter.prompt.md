---
---

agent: "agent"
model: GPT-5 mini (copilot)
tools:
[
"edit",
"search/changes",
"read/problems",
"io.github.contextstreamio/mcp-server/search",
"io.github.contextstreamio/mcp-server/session",
"execute/getTerminalOutput",
"execute/runInTerminal",
"read/terminalLastCommand",
"read/terminalSelection",
"web/fetch",
]
description: "Bootstrap GitHub Copilot starter prompt with ContextStream / MCP server rules and guidance"

---

MANDATORY CONTEXTSTREAM RULES (adapted for GitHub Copilot)

contextstream_rules:

- SEARCH_FIRST: Use `io.github.contextstreamio/mcp-server/search(mode="hybrid", query="...")` before any local file glob/grep/read.
- SESSION_INIT: On the first message call `io.github.contextstreamio/mcp-server/session(action="init", folder_path="<cwd>", context_hint="<msg>")` then `io.github.contextstreamio/mcp-server/session(action="context", user_message="<msg>")`.
- EVERY_MESSAGE: Call `io.github.contextstreamio/mcp-server/session(action="context", user_message="<msg>", format="minified", max_tokens=400)` at the start of each turn.

Note: Prefer the MCP server search APIs — they return indexed semantic results including file paths and context; fallback to local search only if the MCP search returns 0 results.

Purpose

- Make Copilot agents context-aware and token-efficient by always consulting the MCP server first for relevant workspace context, lessons, and decisions.

Search modes (use as appropriate):

- `hybrid` — general semantic+keyword search (default)
- `keyword` — exact symbol/string match
- `exhaustive` — grep-like exhaustive match
- `semantic` — conceptual/architectural queries

Required startup sequence (first message):

1. `io.github.contextstreamio/mcp-server/session(action="init", folder_path="$PWD", context_hint="<user message>")`
2. `io.github.contextstreamio/mcp-server/session(action="context", user_message="<user message>")`

Subsequent messages (default):

- `io.github.contextstreamio/mcp-server/session(action="context", user_message="<user message>", format="minified")`

Context engineering & helpful endpoints

- `project` — metadata (name, version, examples)
- `examples` — runnable example URLs and server endpoints
- `ci` — last pipeline status, sha, timestamp

Plans & decisions

- Save plans/decisions via `io.github.contextstreamio/mcp-server/session(action="capture_plan", title="...", steps=[...])` and `io.github.contextstreamio/mcp-server/session(action="capture", event_type="decision", title="...", content="...")`.

Why this matters

- MCP search reduces token usage and surfaces lessons, decisions, and relevant code in one call. It should be the first step for all Copilot-powered tasks that need repo context.

How to use this prompt

- When asked to bootstrap Copilot configuration, follow these steps:
  1. Run MCP `search(mode="hybrid")` for the user's request to find matching instruction/prompts/agents.
  2. Read the returned file paths and load only the relevant snippets.
  3. Create or update `.github/*` files using the repository conventions; add a short context-engineering note when files reference runtime state.

Quick examples (calls the agent should make before editing):

- `io.github.contextstreamio/mcp-server/search(mode="hybrid", query="copilot-instructions OR AGENTS.md", limit=5)`
- `io.github.contextstreamio/mcp-server/session(action="context", user_message="bootstrap copilot files for TypeScript React project")`

Guidelines for generated `.github` files

- Include YAML frontmatter with `description` and `applyTo` where applicable.
- Keep instructions concise (1–300 lines). If a file requires runtime data, add a 1–3 bullet context-engineering note referencing `io.github.contextstreamio/mcp-server`.
- When adapting community templates (e.g., awesome-copilot), add attribution comments.

Safety & best-practices

- Do not assume environment specifics — verify using MCP server or repository files (`package.json`, `tsconfig.json`).
- Prefer small, focused changes. Save plans and decisions to the MCP server.

Post-creation checklist

- Ensure frontmatter is present and valid
- Add context-engineering note when runtime context is referenced
- Run MCP search for duplicate/conflicting instruction files before committing

Example prompt templates to create (minimal): `copilot-instructions.md`, `instructions/react.instructions.md`, `prompts/setup-component.prompt.md`, `agents/architect.agent.md`, `workflows/copilot-setup-steps.yml`

When finished, save a short plan via `io.github.contextstreamio/mcp-server/session(action="capture_plan", title="copilot-bootstrap", steps=[...])` and report the created/updated files.

---
