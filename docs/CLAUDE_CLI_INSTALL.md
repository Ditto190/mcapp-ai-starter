Anthropic Claude CLI installed in this devcontainer

Quick usage

- Activate the virtualenv:

```bash
source .venv/bin/activate
```

- Set your API key (recommended to store in `.env`):

```bash
export ANTHROPIC_API_KEY="sk-..."
# or add to .env: ANTHROPIC_API_KEY=sk-...
```

- Run the CLI:

```bash
anthropic-cli --help
anthropic-cli -g user "Hello" -m claude-3-opus-20240229
```

Notes

- The CLI binary is installed to `.venv/bin/anthropic-cli` inside the workspace virtual environment.
- If you prefer a global install, run: `python -m pip install --upgrade anthropic anthropic-cli` outside the venv.
- The Python package version installed: anthropic 0.84.0 (may vary).

MCP proxy helper

- A helper MCP proxy entry was added to `.vscode/mcp.json` as `n8n-mcp-proxy` to help connect MCP clients when a direct connection fails due to tunnels, proxies, or SSE restrictions.
- Populate `${workspaceFolder}/.env` with `MCP_ENDPOINT` and `MCP_TOKEN` before using the proxy. Example `.env` entries:

```bash
# .env (example)
MCP_ENDPOINT=https://your-n8n-domain.tld/mcp-server/http/
MCP_TOKEN=your_access_token_here
```

To use the proxy entry from VS Code Copilot or other MCP clients, open the MCP server list and select `n8n-mcp-proxy`.