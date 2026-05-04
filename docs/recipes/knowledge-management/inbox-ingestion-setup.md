# Set Up the Inbox Ingestion Pipeline

Configure the three ingestion triggers that feed raw notes into the foam-modme Knowledge Management Platform inbox.

## When to use this recipe

Use this recipe once to configure the pipeline that watches for new notes and routes them through PII-stripping and classification.

> **Phase 1 note**: The full ingestion pipeline is Phase 2+. This recipe documents the intended design. In Phase 1, manual ingestion via the `ingest-knowledge` MCP tool or direct file drop is available.

## Required Extensions / Tools

- **Foam for VSCode** — primary note authoring environment
- **A.D.A.M. MCP server** — `ingest-knowledge` tool trigger
- **n8n** (running via Docker stack at port 5678) — workflow automation for file-watch trigger
- **chokidar** or similar — Node.js file-watch library (Phase 2+)

## Ingestion Triggers

The inbox pipeline has three confirmed trigger paths:

| Trigger | How | Status |
|---------|-----|--------|
| **File watch** | Watches `docs/inbox/` for new `.md`, `.docx`, `.pptx` files | Phase 2+ |
| **MCP tool call** | `ingest-knowledge` called by any MCP-connected agent | Phase 1 (manual) |
| **Manual CLI script** | `bun run scripts/ingest.ts <file>` | Phase 2+ |

## Processing Pipeline (Design)

```
New file → docs/inbox/
    ↓
PII strip  (.pii-rules.csv replacement)
    ↓
Classify   (assign track + phase/domain + tags)
    ↓
Store      (Prisma → PostgreSQL)
    ↓
Dashboard  (AI Card appears in Wasp Knowledge Platform)
```

## PII Rules Configuration

The `.pii-rules.csv` file is the user-maintained PII blocklist:

- Location: project root (or user-specified path in config)
- Format: CSV with columns `pattern,replacement` (regex or literal)
- Permissions: `chmod 600` — readable only by owner, not by agents or VS Code
- Never committed — in `.gitignore`
- The replacement script substitutes each matching pattern with its placeholder before any note is stored or passed to a model

**Example rows** (do not use real values):

```
[Actual person name],[PERSON_A]
[Actual company],[CLIENT_ORG]
```

> **Agent rule**: Agents, including GitHub Copilot and A.D.A.M., must never attempt to read `.pii-rules.csv`. This is enforced via file permissions and explicit APM_RULES in `AGENTS.md`.

## Instructions (Phase 1 — Manual Ingestion)

Until the file-watch pipeline is implemented in Phase 2+:

### Via MCP tool

In any MCP-connected agent (Claude Desktop, VS Code Copilot, etc.):

```
ingest-knowledge(title: "...", content: "...", type: "doc", tags: ["..."])
```

### Via file drop

1. Save your note to `docs/inbox/YYYY-MM-DD-description.md`
2. Manually review and strip PII
3. Use the Tag Editor (Phase 2+) or the A.D.A.M. MCP `ingest-knowledge` tool to classify it

## How to contribute

See [`how-to-write-recipes.md`](../how-to-write-recipes.md) for the recipe contribution guide.
