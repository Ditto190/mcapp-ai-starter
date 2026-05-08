---
title: foam-modme Knowledge Management Platform
modified: 2026-05-05 — Phase 2 architecture rewrite (Turborepo + Elysia + Podman)
---

# APM Plan

> ⚠️ **CONSTRAINT: NO DOCKER** — Company policy. All container tasks use **Podman / podman-compose** only.
> Docker Desktop, docker CLI, and docker-compose.yml are prohibited. Use `podman-compose.yml`.

## Workers

| Worker ID | Role | Agent |
|-----------|------|-------|
| W1 | Platform Engineer | gem-implementer |
| W2 | Wasp Scaffolder (legacy) | gem-implementer |
| W3 | Recipe Author | gem-implementer |
| W4 | DevEnv / Toolchain Engineer | gem-implementer |
| W5 | API Engineer (Elysia) | gem-implementer |
| W6 | Frontend Engineer (Next.js) | gem-implementer |

## Stages

### Stage 1 — Foundation (Phase 1 — ✅ COMPLETE)

| Task | ID | Worker | Description | Depends On | Status |
|------|----|--------|-------------|------------|--------|
| Prisma schema | 1.1 | W1 | Design KnowledgeItem, MeetingNote, Artifact, Tag models | — | ✅ |
| Taxonomy doc | 1.2 | W1 | Write docs/knowledge-platform/taxonomy.md | 1.1 | ✅ |
| Wasp scaffold | 1.3 | W2 | Init Wasp app at knowledge-platform/ with PostgreSQL | — | ✅ |
| Prisma in Wasp | 1.4 | W2 | Add Prisma models to knowledge-platform/schema.prisma | 1.1, 1.3 | ✅ |
| KM recipe category | 1.5 | W3 | Add "Knowledge Management" section to docs/recipes/recipes.md | — | ✅ |
| Recipe: classify | 1.6 | W3 | docs/recipes/knowledge-management/classify-knowledge-item.md | 1.2 | ✅ |
| Recipe: meeting notes | 1.7 | W3 | docs/recipes/knowledge-management/process-meeting-notes.md | 1.2 | ✅ |
| Inbox redesign | 1.8 | W4 | Redesign docs/inbox/README.md as KM staging area spec | — | ✅ |
| PII rules template | 1.9 | W4 | Create docs/knowledge-platform/pii-rules-guide.md | 1.8 | ✅ |

---

### Stage 2 — Platform Evolution (Phase 2 — PARALLEL TRACKS)

> **Stage 2b and Stage 2c run in parallel.** Stage 2b is toolchain-only (no code dependencies on 2c). Stage 2c scaffolds the monorepo architecture. Both must complete before Stage 3.

#### Stage 2b — Tool Harmonization (Parallel Track)

Plan: `docs/ways-of-work/plan/tool-harmonization/bun-biome-migration/implementation-plan.md`

| Task | ID | Worker | Description | Depends On | Status |
|------|----|--------|-------------|------------|--------|
| devenv.nix repair | 2b.0 | W4 | Remove broken `nodePackages.*` refs; use nodejs_20 + top-level yarn + bun + podman-compose | — | ⏳ |
| Node version pin | 2b.1 | W4 | Add `.node-version` (content: `20`) to repo root; validate fnm auto-switch | 2b.0 | ⏳ |
| @foam/biome-config | 2b.2 | W4 | Create `packages/biome-config/` — shared Biome 2 ruleset, extend in all packages | — | ⏳ |
| @foam/tsconfig | 2b.3 | W4 | Create `packages/tsconfig/` — base/nextjs/bun-app TypeScript configs | — | ⏳ |
| Root bun migration | 2b.4 | W4 | Add `packageManager: bun@1.3.13` to root package.json; add workspaces array | 2b.2, 2b.3 | ⏳ |
| Remove package-lock | 2b.5 | W4 | Delete package-lock.json; run `bun install` to generate bun.lockb | 2b.4 | ⏳ |
| knowledge-platform Biome | 2b.6 | W4 | Remove ESLint + Prettier from knowledge-platform/; add biome.json extends @foam/biome-config | 2b.2 | ⏳ |
| adam-server Biome | 2b.7 | W4 | Add biome.json extends @foam/biome-config to examples/adam-server/ | 2b.2 | ⏳ |
| Turbo lint pipeline | 2b.8 | W4 | Add lint/format:check/typecheck tasks to turbo.json with proper caching | 2b.2, 2b.3, 2b.4 | ⏳ |

#### Stage 2c — KM Platform DB & Dashboard (Parallel Track)

Plan: `docs/ways-of-work/plan/knowledge-platform/phase-2c-db-dashboard/implementation-plan.md`

| Task | ID | Worker | Description | Depends On | Status |
|------|----|--------|-------------|------------|--------|
| Monorepo bootstrap | 2.0 | W1 | Init turbo.json at root; configure bun workspaces; migrate root package.json | Stage 1 | ⏳ |
| @foam/db package | 2.1 | W1 | Create packages/db/; move schema.prisma; singleton client; re-export types | 2.0 | ⏳ |
| Podman DB stack | 2.2 | W4 | Replace docker-compose.yml with podman-compose.yml; add port mapping 5432:5432; SecretSpec | 2.0 | ⏳ |
| Elysia API scaffold | 2.3 | W5 | Create services/km-api/ with Elysia; CRUD routes /api/knowledge, /api/inbox, /api/tags; Eden type export | 2.1, 2.2 | ⏳ |
| Next.js dashboard | 2.4 | W6 | Create apps/km-dashboard/ with Next.js 15 + shadcn/ui; Server Components; Eden client | 2.3 | ⏳ |
| A.D.A.M. upgrade | 2.5 | W1 | Move adam-server to apps/adam-server/; add @foam/db; AgentCard at /.well-known/agent.json | 2.1 | ⏳ |
| Schema docs | 2.6 | W1 | Add turbo task docs:schema; generate HTML/MD from schema.prisma via json-schema-for-humans | 2.1 | ⏳ |

---

### Stage 3 — A.D.A.M. Intelligence Layer (Phase 3)

> Requires Stage 2b + 2c complete. A.D.A.M. uses `@foam/db` (from Stage 2c). Full A2A endpoints added here.

| Task | ID | Worker | Description | Depends On | Status |
|------|----|--------|-------------|------------|--------|
| Prisma in MCP | 3.1 | W1 | Replace in-memory stores in adam-server with @foam/db Prisma client | Stage 2c | ⏳ |
| classify-knowledge tool | 3.2 | W1 | New MCP tool: auto-classify KnowledgeItem by content + metadata | 3.1 | ⏳ |
| Meeting notes tool | 3.3 | W1 | New MCP tool: M365 meeting notes dedup + structured extraction | 3.1 | ⏳ |
| Full A2A endpoints | 3.4 | W5 | Implement A2A JSON-RPC task endpoints in Elysia km-api | 3.1, 2.3 | ⏳ |

---

### Stage 4 — Inbox Automation Pipeline (Phase 4)

> NO DOCKER — use Podman. SecretSpec manages pipeline secrets.

| Task | ID | Worker | Description | Depends On | Status |
|------|----|--------|-------------|------------|--------|
| File-watch trigger | 4.1 | W4 | Watch docs/inbox/ for new files (chokidar or n8n filesystem node) | Stage 3 | ⏳ |
| PII processing | 4.2 | W4 | Read pii-rules-guide.md rules; replace keywords with placeholders (no .csv file) | 4.1 | ⏳ |
| n8n Podman workflow | 4.3 | W4 | n8n via podman-compose; automated ingestion workflow; SecretSpec for credentials | 4.2 | ⏳ |
| Pipeline SecretSpec | 4.4 | W4 | Declare all pipeline secrets in secretspec.toml; use `secretspec run --` pattern | 4.3 | ⏳ |

---

## Dependency Graph

```
Stage 1 (✅ complete)
  └──→ Stage 2b (toolchain, parallel)
         2b.0 → 2b.1
         2b.2 ─┬─→ 2b.4 → 2b.5
         2b.3 ─┘
         2b.2 → 2b.6, 2b.7
         2b.2, 2b.3, 2b.4 → 2b.8

Stage 1 (✅ complete)
  └──→ Stage 2c (platform, parallel)
         2.0 → 2.1 → 2.3 → 2.4
         2.0 → 2.2 → 2.3
         2.1 → 2.5
         2.1 → 2.6

Stage 2b + 2c both complete
  └──→ Stage 3 (intelligence)
         3.1 → 3.2, 3.3
         3.1 + 2.3 → 3.4

Stage 3 complete
  └──→ Stage 4 (pipeline)
         4.1 → 4.2 → 4.3 → 4.4
```

---

## Architecture Notes

- **Monorepo layout:** `apps/` (km-dashboard, adam-server), `packages/` (db, biome-config, tsconfig), `services/` (km-api)
- **Prisma schema location:** `packages/db/prisma/schema.prisma` (moved from knowledge-platform/)
- **Prisma 7:** `migrate dev` no longer auto-generates — turbo pipeline must include explicit `db:generate` task
- **Wasp fate:** knowledge-platform/ (Wasp 0.23) preserved but not extended; future decision in open ADR
- **Testing:** Deferred to Stage 3+. No test tasks in Stage 1 or 2.
- **PII:** No `.pii-rules.csv` file — rules are in documentation only (`docs/knowledge-platform/pii-rules-guide.md`)
- **SecretSpec:** CLI-only for Bun/Node; use `secretspec run -- bun start` pattern; `--provider dotenv` for local dev
- **Port mapping fix:** Old docker-compose.yml had NO host port mapping for postgres (5432 unreachable from host); podman-compose.yml MUST add `ports: ["5432:5432"]`
