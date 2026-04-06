# CI / Session Hooks Quickstart

This guide explains the minimal setup to use the session hooks added under `scripts/ci`.

Files added:

- `scripts/ci/commit-with-mcp.js` — stages and commits changes locally; when `--mcp` is passed and env vars are set, it will POST to your MCP git endpoint.
- `scripts/ci/update-context.js` — posts a session update to Context7 (`CONTEXT7_API_URL`); supports `--dry-run` for local testing.
- `scripts/ci/smoke-test.ps1` — PowerShell script to run a quick smoke test (dry-run) on Windows.
- `.github/workflows/session-hooks.yml` — GitHub Actions workflow that runs these scripts on push/pr or manually.

Required secrets (GitHub):

- `MCP_GIT_API_URL`
- `MCP_TOKEN`
- `CONTEXT7_API_URL`
- `CONTEXT7_TOKEN`

Quick local test (PowerShell):

```powershell
# from repo root
.
cd .\scripts\ci
..\..\scripts\ci\smoke-test.ps1
```

Or run the smoke test from workspace root:

```powershell
.\scripts\ci\smoke-test.ps1
```

Next steps:

- Add the secrets to your repository settings for full integration.
- Optionally convert scripts to PowerShell-native implementations if you prefer Windows-only tooling.
