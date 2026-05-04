---
title: foam-modme Knowledge Management Platform
modified: 2026-05-04 — Initial plan, APM Planner session
---

# APM Plan

## Workers

| Worker ID | Role | Agent |
|-----------|------|-------|
| W1 | Schema Designer | gem-implementer |
| W2 | Wasp Scaffolder | gem-implementer |
| W3 | Recipe Author | gem-implementer |
| W4 | Inbox Designer | gem-implementer |

## Stages

### Stage 1 — Foundation (Phase 1 — IN SCOPE)

| Task | ID | Worker | Description | Depends On | Status |
|------|----|--------|-------------|------------|--------|
| Prisma schema | 1.1 | W1 | Design KnowledgeItem, MeetingNote, Artifact, Tag models | — | 🔄 |
| Taxonomy doc | 1.2 | W1 | Write docs/knowledge-platform/taxonomy.md | 1.1 | 🔄 |
| Wasp scaffold | 1.3 | W2 | Init Wasp app at knowledge-platform/ with PostgreSQL | — | 🔄 |
| Prisma in Wasp | 1.4 | W2 | Add Prisma models to knowledge-platform/schema.prisma | 1.1, 1.3 | ⏳ |
| KM recipe category | 1.5 | W3 | Add "Knowledge Management" section to docs/recipes/recipes.md | — | ⏳ |
| Recipe: classify | 1.6 | W3 | docs/recipes/knowledge-management/classify-knowledge-item.md | 1.2 | ⏳ |
| Recipe: meeting notes | 1.7 | W3 | docs/recipes/knowledge-management/process-meeting-notes.md | 1.2 | ⏳ |
| Inbox redesign | 1.8 | W4 | Redesign docs/inbox/README.md as KM staging area spec | — | ⏳ |
| PII rules template | 1.9 | W4 | Create docs/knowledge-platform/pii-rules-guide.md | 1.8 | ⏳ |

### Stage 2 — Wasp UI Stubs (Phase 1 stretch / Phase 2)

| Task | ID | Worker | Description | Depends On | Status |
|------|----|--------|-------------|------------|--------|
| Knowledge browser | 2.1 | W2 | Wasp page: list/filter KnowledgeItems by track/phase/status | Stage 1 | ⏳ |
| Inbox dashboard | 2.2 | W2 | Wasp page: list raw inbox items, trigger ingest | Stage 1 | ⏳ |
| Status dashboard | 2.3 | W2 | Wasp page: artifact tracking, AI Card schema, RFI timeline | Stage 1 | ⏳ |
| Tag editor | 2.4 | W2 | Wasp page: taxonomy management UI | Stage 1 | ⏳ |

### Stage 3 — A.D.A.M. MCP Extension (Phase 2+)

| Task | ID | Worker | Description | Depends On | Status |
|------|----|--------|-------------|------------|--------|
| Prisma in MCP | 3.1 | W1 | Replace in-memory stores with Prisma client in adam-server | Stage 1 | ⏳ |
| Extend ingest-knowledge | 3.2 | W1 | Add track/phase/domain metadata to ingest-knowledge tool | 3.1 | ⏳ |
| classify-knowledge tool | 3.3 | W1 | New MCP tool: auto-classify by content | 3.2 | ⏳ |
| Meeting notes tool | 3.4 | W1 | New MCP tool: M365 dedup + structure | 3.2 | ⏳ |

### Stage 4 — Inbox Pipeline (Phase 2+)

| Task | ID | Worker | Description | Depends On | Status |
|------|----|--------|-------------|------------|--------|
| File-watch trigger | 4.1 | W4 | Watch docs/inbox/ for new files (n8n or chokidar) | Stage 1 | ⏳ |
| PII blocking script | 4.2 | W4 | Read .pii-rules.csv, replace keywords with placeholders | 4.1 | ⏳ |
| n8n workflow | 4.3 | W4 | Automated ingestion workflow in n8n | 4.2 | ⏳ |

## Dependency Graph

```
Stage 1:
  1.1 (Prisma schema) ──→ 1.2 (taxonomy) ──→ 1.6, 1.7 (recipes)
  1.3 (Wasp scaffold) ──→ 1.4 (needs 1.1 + 1.3)
  1.5 (recipe index)   ──→ standalone
  1.8 (inbox redesign) ──→ 1.9 (PII template)

Stage 1 complete ──→ Stage 2 (UI stubs)
Stage 1 complete ──→ Stage 3 (MCP extension, Phase 2+)
Stage 2 + 3 complete ──→ Stage 4 (pipeline, Phase 2+)
```

---

> **Notes:** Testing strategy is deferred — no test tasks in Stage 1 or 2. Testing infrastructure to be designed when MCP tools are implemented in Stage 3.
