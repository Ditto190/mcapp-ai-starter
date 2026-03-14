---
name: composable-agent-collection
description: 'Compose, materialize, and validate a new GitHub Copilot plugin collection from the local awesome-copilot library. Use when: building a team plugin, creating a domain-specific agent bundle, authoring a composable collection, composing agents and skills into a plugin.json manifest, running materialize-plugins, generating marketplace.json, or validating plugin schema. Runs the full eng/ pipeline: discover → compose manifest → materialize → validate → index.'
argument-hint: 'collection name or domain (e.g. "mcp-dev-team" or "typescript")'
---

# Composable Agent Collection

Build a new installable GitHub Copilot plugin by composing agents and skills from the local `plugins/awesome-copilot/` library, then running the `eng/` pipeline to materialize, validate, and index it.

## When to Use This Skill

Use this skill when you need to:
- Build a domain-specific plugin (e.g. `mcp-dev-team`, `security-hardening`)
- Bundle agents + skills for a team or workflow into a single installable plugin
- Run `materialize-plugins.mjs`, `validate-plugins.mjs`, or `generate-marketplace.mjs`
- Sync local collections with upstream `github/awesome-copilot` via MCP tools
- Author or update a `plugin.json` manifest following the schema

## Prerequisites

- Node.js ≥ 18 (ESM support)
- `cd plugins/awesome-copilot && npm ci` (installs `js-yaml` and other deps)
- The `plugins/awesome-copilot/` subtree present in workspace

## Core Capabilities

### 1. Discover Available Content
List the 175+ agents and 210+ skills in the local library before composing.

### 2. Scaffold + Compose
Generate a valid `plugin.json` manifest and `README.md` from a name + agent/skill list.

### 3. Materialize
Copy resolved source files (`agents/*.agent.md`, `skills/*/`) into the plugin folder.

### 4. Validate + Index
Run schema validation and regenerate `marketplace.json` for Copilot CLI/VS Code discovery.

## Usage Examples

### Example 1: One-command compose via bundled script
```bash
cd plugins/awesome-copilot
node ../../.github/skills/composable-agent-collection/scripts/compose-collection.mjs \
  --name mcp-dev-team \
  --description "MCP application development team" \
  --agents "devops-expert,debug,api-architect" \
  --skills "git-commit,gh-cli" \
  --keywords "mcp,typescript,devops"
```

### Example 2: Dry-run preview (no files written)
```bash
node ../../.github/skills/composable-agent-collection/scripts/compose-collection.mjs \
  --name my-collection \
  --agents "devops-expert,debug" \
  --dry-run
```

### Example 3: Discover what's available
```bash
# List all agents (175+)
node ../../.github/skills/composable-agent-collection/scripts/compose-collection.mjs --list-agents

# List all skills (210+)
node ../../.github/skills/composable-agent-collection/scripts/compose-collection.mjs --list-skills

# Filter by keyword
ls plugins/awesome-copilot/agents/ | grep -i "mcp\|devops\|security"
```

### Example 4: Step-by-step manual pipeline
```bash
cd plugins/awesome-copilot

# 1. Scaffold
npm run plugin:create -- --name my-collection --keywords "mcp,typescript"

# 2. Edit plugin.json to add agents/skills references, then:
# 3. Materialize
node ./eng/materialize-plugins.mjs

# 4. Validate
npm run plugin:validate

# 5. Regenerate discovery index
npm run plugin:generate-marketplace
```

## Plugin Manifest Schema

`plugin.json` path references follow these rules (enforced by `validate-plugins.mjs`):

| Field | Format | Example |
|-------|--------|---------|
| `agents` items | `./agents/<name>.md` | `"./agents/devops-expert.md"` |
| `skills` items | `./skills/<name>/` | `"./skills/git-commit/"` |
| `name` | lowercase alphanumeric + hyphens, 1–50 chars, must match folder | `"mcp-dev-team"` |
| `description` | string 1–500 chars | `"Team agents for..."` |
| `keywords` | array of lowercase hyphenated strings, max 10 | `["mcp","typescript"]` |

**Resolution:** `materialize-plugins.mjs` maps `./agents/<name>.md` → `agents/<name>.agent.md` and `./skills/<name>/` → `skills/<name>/` at the repo root.

## Guidelines

1. **Name must match folder** - `plugin.json` `name` field must exactly equal the plugin directory name
2. **Validate before indexing** - always run `npm run plugin:validate` before `plugin:generate-marketplace`
3. **Use dry-run first** - `--dry-run` shows exactly what will be created without touching the filesystem
4. **Search before adding** - verify agent/skill names exist with `--list-agents` / `--list-skills`
5. **Use MCP tools for upstream** - `mcp_awesome-copil_search_instructions` discovers content not yet in local mirror

## Common Patterns

### Pattern: Minimal MCP plugin
```json
{
  "name": "mcp-typescript",
  "description": "TypeScript MCP server development agents",
  "version": "1.0.0",
  "keywords": ["mcp", "typescript"],
  "agents": ["./agents/typescript-mcp-server-generator.md"],
  "skills": ["./skills/typescript-mcp-server-generator/"]
}
```

### Pattern: Team engineering plugin
```json
{
  "name": "my-engineering-team",
  "description": "Full-lifecycle engineering agents for our team",
  "version": "1.0.0",
  "keywords": ["team", "devops", "security"],
  "agents": [
    "./agents/devops-expert.md",
    "./agents/debug.md",
    "./agents/api-architect.md",
    "./agents/se-security-reviewer.md"
  ],
  "skills": [
    "./skills/git-commit/",
    "./skills/gh-cli/",
    "./skills/conventional-commit/"
  ]
}
```

## Limitations

- Agent names in `plugin.json` must use the base name without `.agent.md` suffix (the script adds it)
- `materialize-plugins.mjs` processes ALL plugins; there's no single-plugin mode
- Skills referenced must be folder-based (contain `SKILL.md`); plain `.md` files are not supported as skills
- The `./agents` shorthand in `plugin.json` (directory, not individual files) is only valid after materialization

## Compose Script Reference

The bundled [compose-collection.mjs](./scripts/compose-collection.mjs) wraps the full pipeline:

| Flag | Description |
|------|-------------|
| `--name`, `-n` | Collection name (required) |
| `--description`, `-d` | Short description |
| `--agents`, `-a` | Comma-separated agent base-names |
| `--skills`, `-s` | Comma-separated skill folder names |
| `--keywords`, `-k` | Comma-separated tags |
| `--dry-run` | Preview without writing files |
| `--list-agents` | Print available agents and exit |
| `--list-skills` | Print available skills and exit |
