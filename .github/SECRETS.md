## Secrets and Configuration (how-to)

This project requires several secrets for running n8n and MCP integrations. Do NOT commit secrets to the repository. Follow these steps:

1. Local development
   - Copy `.env.example` -> `.env` and fill values locally (this file is ignored by git).
   - For Codespaces, copy `.env.codespaces.example` -> `.env.codespaces` and fill values.

2. GitHub Actions / CI
   - Add required secrets in the repository Settings → Secrets → Actions.
   - Example secret names used by workflows:
     - `MCP_SERVER_URL` - URL of the MCP server (e.g., https://mcp.example.com)
     - `MCP_SERVER_TOKEN` - API token for MCP server
     - `N8N_API_KEY` - n8n API key used by automation scripts
     - `CODESPACE_NAME` - optional codespace name used in some scripts

3. Codespaces / DevContainer
   - Add repository secrets to Codespaces by navigating to Settings → Codespaces → Secrets and variables.
   - Alternatively, use a secrets manager or GitHub environment secrets.

4. Rotating & revoking
   - If a secret is accidentally committed, rotate it immediately and purge it from history.
   - Use `git rm --cached .env` and rotate keys; for history rewrite use `git filter-repo`.

5. Validation
   - This repo includes a workflow `.github/workflows/validate-secrets.yml` that checks required secrets are configured in Actions.
