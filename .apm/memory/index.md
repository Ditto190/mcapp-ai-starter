---
title: foam-modme Knowledge Management Platform
---

# APM Memory Index

## Memory Notes

### 2026-05-04 — Architecture Decision: Option C

- **Decision**: A.D.A.M. MCP server as agent-facing tool layer + Wasp app as human-facing UI layer, both sharing PostgreSQL via Prisma
- **Rationale**: Separates concerns (MCP protocol tools vs. web UI), leverages Wasp's built-in auth/routing/Prisma integration, keeps A.D.A.M. as the agent interface
- **Rejected**: Option A (extend adam-server only), Option B (Wasp-only). Qdrant rejected for KM persistence.

### 2026-05-04 — Persistence Decision: Prisma ORM

- **Decision**: Prisma ORM with PostgreSQL (existing Docker service)
- **Rationale**: User explicitly required Prisma ("NOT QDRANT i want to use PRISMA with ORM")
- **Impact**: All KnowledgeItem, MeetingNote, Artifact entities use Prisma schema + migrations

### 2026-05-04 — PII Rules Constraint

- **Decision**: `.pii-rules.csv` config file, never committed, `chmod 600`, agent-unreadable
- **Rationale**: User stated "i need this PII rules json to be unable to be parsed or seen in this VSCode - so it needs to be a secret that not even agents here can read"
- **Implementation**: File at project root or user-specified path; replacement script reads it; agents must NOT access it

### 2026-05-04 — Testing Deferred

- **Decision**: No test infrastructure in Phase 1
- **Rationale**: User stated "i actually do not know what tests i need"
- **Next step**: Testing strategy to be designed when MCP tools are implemented in Stage 3

### 2026-05-04 — Taxonomy Two-Track System

- **Track A**: capability (Sensing / Seizing / Transforming / Integrative Learning)
- **Track B**: task-bundle (meeting notes → domain-organised → RFI proposals + status dashboard)
- **Key metadata fields**: track, capability_phase, domain, artifact_type, m365_source, dashboard_status, status (raw/processed/deliverable), source, client_facing, project

## Stage Summaries

### Stage 1 — Foundation ✅ Complete

- Status: ✅ Complete
- Started: 2026-05-04
- Completed: 2026-05-04
- Objective: Design taxonomy + Prisma schema + scaffold Wasp app + add KM recipes + redesign inbox
- Deliverables:
  - `.apm/` APM project management files (spec, plan, tracker, memory, metadata)
  - `docs/knowledge-platform/taxonomy.md` — full two-track classification reference
  - `docs/knowledge-platform/pii-rules-guide.md` — PII rules documentation
  - `knowledge-platform/` — Wasp 0.23.0 app (4 stub pages, PostgreSQL datasource)
  - `knowledge-platform/schema.prisma` — 6 Prisma models (KnowledgeItem, Tag, KnowledgeItemTag, MeetingNote, Artifact, InboxItem)
  - `docs/recipes/knowledge-management/` — 3 new KM recipes
  - `docs/recipes/recipes.md` — Knowledge Management section added
  - `docs/inbox/README.md` — redesigned as formal KM staging area
  - `AGENTS.md` — APM_RULES block appended
  - `.gitignore` — `.pii-rules.csv` added
- Next stage: Stage 2 (Wasp UI pages wired to database) or Stage 3 (A.D.A.M. MCP extension with Prisma) — user to decide
