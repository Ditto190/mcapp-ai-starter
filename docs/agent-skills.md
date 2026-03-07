---
title: Agent Skills
---

# Agent Skills

[Agent Skills](https://agentskills.io/) are instruction sets that guide AI coding agents through tasks. When you invoke a skill, the agent takes the lead — it asks clarifying questions, makes decisions based on your codebase, and executes the work.

This repository provides four skills:

- [**create-mcp-app**](https://github.com/modelcontextprotocol/ext-apps/blob/main/plugins/mcp-apps/skills/create-mcp-app/SKILL.md) — scaffolds a new MCP App with an interactive UI
- [**migrate-oai-app**](https://github.com/modelcontextprotocol/ext-apps/blob/main/plugins/mcp-apps/skills/migrate-oai-app/SKILL.md) — migrates an existing OpenAI App to the MCP Apps SDK
- [**add-app-to-server**](https://github.com/modelcontextprotocol/ext-apps/blob/main/plugins/mcp-apps/skills/add-app-to-server/SKILL.md) — adds interactive UI to an existing MCP server's tools
- [**convert-web-app**](https://github.com/modelcontextprotocol/ext-apps/blob/main/plugins/mcp-apps/skills/convert-web-app/SKILL.md) — converts an existing web application into an MCP App

## Install the Skills

Choose the instructions for your agent:

### Claude Code

Install via Claude Code:

```
/plugin marketplace add modelcontextprotocol/ext-apps
/plugin install mcp-apps@modelcontextprotocol-ext-apps
```

### VS Code (Copilot agent mode)

> **Note:** Agent skills require agent mode in [VS Code Insiders](https://code.visualstudio.com/insiders/). Support in the stable VS Code release is coming soon.

**Option A — Vercel Skills CLI (recommended):**

```bash
npx skills add modelcontextprotocol/ext-apps
```

**Option B — Manual installation:**

Copy each skill folder from [`plugins/mcp-apps/skills/`](https://github.com/modelcontextprotocol/ext-apps/tree/main/plugins/mcp-apps/skills) into a skills directory that Copilot watches:

- **Personal skills** (available in all projects): `~/.copilot/skills/`
- **Project skills** (checked in to a repo): `.github/skills/`

```bash
# Clone the repo (or download the skills folder)
git clone https://github.com/modelcontextprotocol/ext-apps.git
cd ext-apps

# Copy all four skills to your personal skills directory
cp -r plugins/mcp-apps/skills/create-mcp-app    ~/.copilot/skills/
cp -r plugins/mcp-apps/skills/migrate-oai-app   ~/.copilot/skills/
cp -r plugins/mcp-apps/skills/add-app-to-server ~/.copilot/skills/
cp -r plugins/mcp-apps/skills/convert-web-app   ~/.copilot/skills/
```

See [VS Code agent skills docs](https://code.visualstudio.com/docs/copilot/customization/agent-skills) for full details.

### GitHub Copilot CLI

**Option A — Install as a plugin (recommended):**

```bash
copilot plugin install modelcontextprotocol/ext-apps:plugins/mcp-apps
```

This installs the plugin directly from the GitHub repository. Verify with:

```bash
copilot plugin list
```

**Option B — Install via the marketplace:**

```bash
copilot plugin marketplace add modelcontextprotocol/ext-apps
copilot plugin install mcp-apps@ext-apps
```

**Option C — Manual skill installation:**

Clone the repository and copy each skill folder to `~/.copilot/skills/` (personal) or `.github/skills/` (project), then reload skills in an active session:

```bash
git clone https://github.com/modelcontextprotocol/ext-apps.git
cd ext-apps

cp -r plugins/mcp-apps/skills/create-mcp-app    ~/.copilot/skills/
cp -r plugins/mcp-apps/skills/migrate-oai-app   ~/.copilot/skills/
cp -r plugins/mcp-apps/skills/add-app-to-server ~/.copilot/skills/
cp -r plugins/mcp-apps/skills/convert-web-app   ~/.copilot/skills/
```

```
/skills reload
```

See [GitHub Copilot CLI skills docs](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/create-skills) for full details.

### Other agents

Any AI coding agent that supports the [Agent Skills](https://agentskills.io/) open standard can use these skills. Use the [Vercel Skills CLI](https://skills.sh/) to install across different agents:

```bash
npx skills add modelcontextprotocol/ext-apps
```

Or copy the skill folders manually to the appropriate location for your agent:

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code/skills)
- [Codex](https://developers.openai.com/codex/skills/)
- [Gemini CLI](https://geminicli.com/docs/cli/skills/)
- [Cline](https://docs.cline.bot/features/skills#skills)
- [Goose](https://block.github.io/goose/docs/guides/context-engineering/using-skills/)

## Verify Installation

Ask your agent "What skills do you have?" — you should see `create-mcp-app`, `migrate-oai-app`, `add-app-to-server`, and `convert-web-app` among the available skills.

## Invoke a Skill

Try invoking the skills by asking your agent:

- "Create an MCP App" — scaffolds a new MCP App with an interactive UI
- "Migrate from OpenAI Apps SDK" — converts an existing OpenAI App to use the MCP Apps SDK
- "Add UI to my MCP server" — adds interactive UI to an existing MCP server's tools
- "Convert my web app to an MCP App" — converts an existing web application into an MCP App

The agent will guide you through the process, asking clarifying questions as needed.

## Test Your App

After creating or migrating your MCP App, see the [Testing MCP Apps](./testing-mcp-apps.md) guide to run and debug it locally.
