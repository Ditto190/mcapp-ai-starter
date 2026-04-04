# Agent System

This directory contains the agent catalog, individual agent definitions, and
supporting documentation for the automated code-review pipeline defined in
`.github/workflows/agent-orchestrator.yml`.

## Directory layout

```
.github/agents/
├── catalog.json                 # Auto-generated, do not edit by hand
├── README.md                    # This file
├── security-reviewer.agent.md   # OWASP / secrets / supply-chain reviewer
└── typescript-expert.agent.md   # TypeScript type-safety & React expert
```

## How agents work

Each `.agent.md` file contains:

1. **YAML frontmatter** — metadata consumed by `build-catalog.mjs` and `run-agent.mjs`.
2. **Markdown body** — natural-language instructions describing the agent's responsibilities,
   output format, and auto-approval criteria.

### Frontmatter fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | ✅ | Human-readable agent name |
| `description` | ✅ | One-sentence summary |
| `model` | recommended | LLM model slug (e.g., `claude-sonnet-4`) |
| `tools` | optional | Array of tool names the agent may use |
| `tags` | optional | Array of category tags |
| `addedAt` | optional | ISO-8601 timestamp when the agent was added |

### Example frontmatter

```yaml
---
name: Security Reviewer
description: Performs OWASP Top 10 and secrets-detection analysis.
model: claude-sonnet-4
tools: [codebase_search, grep, github]
tags: [security, owasp]
addedAt: "2026-04-04T00:00:00Z"
---
```

## Agent pipeline overview

```
PR opened / updated
        │
        ▼
agent-selector     ← reads changed files, picks agents
        │
        ▼
prechecks          ← npm test + prettier (must pass)
        │
   ┌────┴────┐
   ▼         ▼
security   typescript    ← run in parallel, upload findings artifacts
reviewer    expert
   └────┬────┘
        ▼
  agent-secondary        ← optional; only when both primaries run
        │
        ▼
approval-decision        ← aggregate confidence, post review, auto-approve if ≥ 0.90
```

## Catalog

`catalog.json` is rebuilt automatically:

- **On push to `main`** when any file under `.github/agents/**` or the build scripts change
  (see `.github/workflows/build-agent-catalog.yml`).
- **Manually** via `npm run agents:catalog` (which first runs discovery).

The discovery script (`discover-agents.mjs`) also scans the entire repository for:

| Resource | Pattern |
|----------|---------|
| Agents | `**/*.agent.md` |
| Instructions | `**/*.instructions.md` |
| Skills | `**/SKILL.md` |
| Plugins | `**/plugin.json` |
| MCP tools | JSON/YAML files containing `mcpServers` or `tools` keys |

Discovered resources are merged into the catalog without overwriting manually curated entries.

## Adding a new agent

1. Create a new file: `.github/agents/<slug>.agent.md`
2. Add the required YAML frontmatter (see above).
3. Write the agent's instructions in the markdown body.
4. Push to `main` — the catalog rebuilds automatically.

## Running agents locally

```bash
# Install dependencies
npm install gray-matter @octokit/rest js-yaml

# Discover resources across the repo
npm run agents:discover

# Rebuild catalog
npm run agents:catalog

# Run an agent against a PR
GITHUB_TOKEN=<your-pat> \
npm run agents:run -- --agent=security-reviewer --pr=42 --output=/tmp/findings.json
```

## Auto-approval policy

A PR is automatically approved when **all** of the following are true:

- ✅ All prechecks pass (tests + linting)
- ✅ No `critical` or `high` severity findings from any agent
- ✅ Average agent confidence ≥ **0.90**

If any condition fails the pipeline posts a `COMMENT` review and flags the PR
for human review.
