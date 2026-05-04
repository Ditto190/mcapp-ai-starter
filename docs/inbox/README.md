# foam-modme Inbox

The inbox is the **raw note staging area** for the Knowledge Management Platform. All new notes, meeting summaries, imported documents, and exported content land here before classification and processing.

---

## What goes in the inbox

| Content type | Example | Route after processing |
|-------------|---------|----------------------|
| Foam notes | `.md` files written in VS Code | Knowledge Browser → Track A or B |
| M365 Copilot meeting summaries | `.md` export from M365 | Meeting Notes → Track B artefacts |
| Imported documents | `.docx`, `.pptx` | Knowledge Browser |
| GitHub issue exports | `.md` exports | Knowledge Browser → Track A/B |
| Sublime Text notes | `.md` imports (de-PII'd) | Knowledge Browser |

Any file anywhere in WSL can be an inbox candidate. Files saved to this directory trigger the ingestion pipeline (Phase 2+).

---

## Processing flow

```
docs/inbox/<file>
      ↓
PII strip       — .pii-rules.csv replacement (MANDATORY before classification)
      ↓  
Classify        — assign track + phase/domain + tags + artifact_type
      ↓
Store           — Prisma → PostgreSQL
      ↓
Dashboard       — AI Card in Wasp Knowledge Platform
```

---

## PII rules

**IMPORTANT**: The `.pii-rules.csv` file at the project root contains keyword-to-placeholder replacement rules. This file is:

- **Never committed** (`.gitignore`)
- **chmod 600** — readable only by the file owner
- **Agent-unreadable** — VS Code agents and A.D.A.M. must never access it (enforced via `AGENTS.md` APM_RULES)
- User-maintained: add rows for names, org names, project codes, email patterns

Notes must have PII stripped before moving from `raw` → `processed` status.

---

## Ingestion triggers (Phase 2+)

| Trigger | How |
|---------|-----|
| **File watch** | Automatic — file-watch script monitors this directory |
| **MCP tool** | `ingest-knowledge` called by A.D.A.M. MCP server |
| **Manual CLI** | `bun run scripts/ingest.ts <file>` |

In **Phase 1** (current): use the `ingest-knowledge` MCP tool directly, or drop files here for manual processing.

---

## Reference

- Full taxonomy: [`../knowledge-platform/taxonomy.md`](../knowledge-platform/taxonomy.md)
- Recipe — classify a note: [`../recipes/knowledge-management/classify-knowledge-item.md`](../recipes/knowledge-management/classify-knowledge-item.md)
- Recipe — process M365 meeting notes: [`../recipes/knowledge-management/process-meeting-notes.md`](../recipes/knowledge-management/process-meeting-notes.md)
- Recipe — inbox setup: [`../recipes/knowledge-management/inbox-ingestion-setup.md`](../recipes/knowledge-management/inbox-ingestion-setup.md)

---

## Existing planning documents

The files in this inbox from previous planning work are preserved here for reference and archival. They are NOT classified KM items — they are the planning artifacts from the foam-modme workspace evolution.
