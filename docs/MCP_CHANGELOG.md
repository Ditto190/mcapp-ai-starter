MCP & Anthropic CLI Change Log

Date: 2026-03-13

Summary of actions performed by assistant:

- Installed Anthropic Python SDK and CLI into the workspace virtualenv `.venv`.
  - Verified `anthropic` package and `anthropic-cli` executable.

- Added a streamable MCP proxy entry `n8n-mcp-proxy` to `.vscode/mcp.json`.
  - Intended command pattern: `npx -y mcp-remote --streamableHttp ${MCP_ENDPOINT} --header "Authorization: Bearer ${MCP_TOKEN}" --header "Accept: application/json, text/event-stream" --header "X-Tunnel-Skip-Anti-Phishing-Page: true"`.
  - Purpose: help connect MCP clients through tunnels/HTTP proxies and add required headers for SSE/streamable HTTP.

- Validated JSON syntax of `.vscode/mcp.json` after the edit.

- Updated `.env.example` with example entries: `ANTHROPIC_API_KEY`, `MCP_ENDPOINT`, `MCP_TOKEN` (example values only; do not commit real secrets).

- Documented usage and the MCP proxy notes in `docs/CLAUDE_CLI_INSTALL.md`.

Files changed:
- `.vscode/mcp.json` (added `n8n-mcp-proxy` entry)
- `.env.example` (added example vars)
- `docs/CLAUDE_CLI_INSTALL.md` (documented CLI and proxy)
- `docs/MCP_CHANGELOG.md` (this file)

Notes:
- Attempted to save this record to the workspace memory tool `mcp_io_github_con_memory`, but the memory API returned errors; consequently this change log file was created as a persistent record inside the repo.
- To use the proxy, populate your local `.env` (not committed) with `MCP_ENDPOINT` and `MCP_TOKEN` and start the `n8n-mcp-proxy` MCP server entry from your MCP client configuration.

If you want, I can now try starting `mcp-remote` in the devcontainer (requires real `MCP_ENDPOINT` and `MCP_TOKEN` in `.env`), or I can retry storing this note in the memory tool if you prefer.