# Changelog

All notable changes to the foam-modme Knowledge Management Platform are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Phase 2 Planning — Architecture Evolution

#### Added

**Phase 2 Implementation Plans**

- `docs/ways-of-work/plan/knowledge-platform/phase-2c-db-dashboard/implementation-plan.md` — Phase 2c: KM Platform DB Activation & Dashboard UI (Turborepo + Elysia + Prisma + Next.js + shadcn/ui + Podman + AgentCard)
- `docs/ways-of-work/plan/tool-harmonization/bun-biome-migration/implementation-plan.md` — Phase 2b: Tool Harmonization (Bun + Biome 2 migration, devenv.nix repair, TypeScript config sharing)

**Architecture Decisions (ADRs)**

- **Turborepo monorepo** — foam-modme root initialized as Turborepo workspace; `apps/`, `packages/`, `services/` layout
- **Elysia API layer** — Elysia (Bun-native, ~17× faster than Express) replaces Wasp queries as primary API layer; Eden type-safe client for dashboard
- **Composable Prisma ORM package** — `packages/db/` (`@foam/db`) as shared Prisma package; schema.prisma moved from knowledge-platform/; Prisma 7 explicit generate pipeline
- **Podman Compose** — docker-compose.yml replaced with podman-compose.yml (company policy: NO DOCKER); postgres port mapping fix (`5432:5432` added)
- **Biome 2** — Replaces ESLint + Prettier across all workspace packages; shared `@foam/biome-config` via `packages/biome-config/`
- **Bun package manager** — Root migrated from npm to Bun 1.3.13; package-lock.json removed
- **SecretSpec** — Secret contract management for developer onboarding and pipeline secrets; `secretspec run -- bun start` integration pattern
- **AgentCard** — `/.well-known/agent.json` added to A.D.A.M. server for agent discovery (Linux Foundation A2A v1.0); full A2A endpoints deferred to Stage 3
- **Dashboards as iterative artefacts** — Next.js 15 dashboard in `apps/km-dashboard/` treated as evolving design artefact, not a final deliverable

**APM Plan Updates**

- `.apm/plan.md` — Full rewrite: Stage 1 marked ✅ complete; Podman constraint documented; W5 (API Engineer) + W6 (Frontend Engineer) workers added; Stage 2 split into parallel tracks 2b (tool harmonization) and 2c (platform build); Stage 3 and 4 updated for new architecture (Elysia A2A, Podman n8n)

---

## [0.1.0] — 2026-05-04

### Knowledge Management Platform — Phase 1 Foundation

#### Added

**APM Project Infrastructure**

- `.apm/spec.md` — APM specification: architecture Option C, two-track taxonomy, design decisions
- `.apm/plan.md` — 4-stage implementation plan with Workers W1–W4
- `.apm/tracker.md` — Stage/task progress tracker (Stage 1 complete)
- `.apm/memory/index.md` — Memory index with architecture and persistence decisions
- `.apm/metadata.json` — Project metadata
- `.apm/bus/` — APM Message Bus (manager + gem-implementer channels)
- `.apm/memory/stage-01/` — 9 task logs for Stage 1 work

**Prisma Schema**

- `knowledge-platform/schema.prisma` — 6 domain models: `KnowledgeItem`, `Tag`, `KnowledgeItemTag`, `MeetingNote`, `Artifact`, `InboxItem`
- KnowledgeItem supports two-track classification: Track A (Dynamic Capabilities) and Track B (Project Delivery)
- Status flow: `raw` → `processed` → `deliverable`
- Source types: `foam-note` | `github-issue` | `sublime-import` | `m365-meeting`

**Wasp Application Scaffold**

- `knowledge-platform/` — Wasp 0.23.0 full-stack app with PostgreSQL datasource
- `knowledge-platform/main.wasp` — 4 routes: Dashboard, Knowledge Browser, Inbox, Tag Editor
- `knowledge-platform/src/pages/DashboardPage.tsx` — Phase 1 stub
- `knowledge-platform/src/pages/KnowledgeBrowserPage.tsx` — Phase 1 stub
- `knowledge-platform/src/pages/InboxPage.tsx` — Phase 1 stub
- `knowledge-platform/src/pages/TagEditorPage.tsx` — Phase 1 stub
- `knowledge-platform/.env.example` — DATABASE_URL template

**Taxonomy Documentation**

- `docs/knowledge-platform/taxonomy.md` — Full two-track classification reference, AI Card TypeScript interface, Prisma schema preview (~8.7 KB)

**Knowledge Management Recipes**

- `docs/recipes/knowledge-management/classify-knowledge-item.md` — 6-step classification workflow with MCP tool example
- `docs/recipes/knowledge-management/process-meeting-notes.md` — M365 Copilot export → PII strip → artefact extraction pipeline
- `docs/recipes/knowledge-management/inbox-ingestion-setup.md` — 3 ingestion triggers: file-watch, MCP tool, manual CLI
- `docs/recipes/recipes.md` — "Knowledge Management" section added

**Inbox Staging Area**

- `docs/inbox/README.md` — Fully replaced: formal KM staging area spec with content types, processing flow, PII rules reference, ingestion triggers

**PII Security**

- `docs/knowledge-platform/pii-rules-guide.md` — PII rules CSV format, security constraints, agent access restrictions
- `.gitignore` — `.pii-rules.csv` added (actual rules file is user-managed, never committed)

**Project Conventions**

- `AGENTS.md` — APM_RULES block: Worker rules (Prisma not Qdrant, Bun, TypeScript strict, Biome, Zod v4), PII rules, Knowledge Platform architecture table, classification system summary
- `devenv.nix` — Fixed broken `nodePackages.npm`/`nodePackages.yarn` references → `nodejs_20` + `yarn`

#### Technical Notes

- Architecture: A.D.A.M. MCP server (agent tool layer) + Wasp app (human UI layer) + shared PostgreSQL via Prisma ORM
- Wasp 0.21.1 was targeted but 0.23.0 installed — fully compatible, `main.wasp` uses `"^0.23.0"`
- Wasp default `User` model removed from schema — re-add before enabling Wasp auth in Phase 2+
- Testing strategy deferred to Phase 3 (when MCP tools implemented)
- PII rules file (`.pii-rules.csv`) is user-managed with `chmod 600` — agents must not access it

---

[0.1.0]: https://github.com/foam-modme/knowledge-platform/releases/tag/v0.1.0
