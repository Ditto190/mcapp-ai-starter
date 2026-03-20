MCP Apps Plugin — Installation & Usage

This folder contains a Claude Code plugin and a handful of skills for building MCP Apps.

Local verification

1. From the repository root, run:
   bash scripts/install-plugins.sh
   - This will package each plugin under plugins/ into build/plugins/<plugin>.zip for inspection.

2. Inspect the package:
   unzip -l build/plugins/mcp-apps.zip

Installing to Claude Code (manual)

- Claude Code supports marketplace and local plugin install workflows. Follow your Claude Code CLI or UI to add the plugin.
- Example (UI): use the plugin marketplace UI to add "mcp-apps" from this repository.
- Example (CLI): the exact commands depend on the client; consult Claude Code docs. This repo provides packaged zips for local install.

Repo integration

- A verification GitHub Action is available at .github/workflows/verify-plugins.yml. It runs the packaging script and uploads the plugin artifacts.

Security

- Do not publish secrets or private keys inside plugin packages.
- Verify any third-party dependencies before publishing to public marketplaces.
