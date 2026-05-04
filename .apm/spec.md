---
title: foam-modme Knowledge Management Platform
modified: 2026-05-04 — Initial spec, APM Planner session (3 rounds)
---

# APM Spec

## Overview

A two-track knowledge management platform built on top of foam-modme, extending the A.D.A.M. MCP server with Prisma ORM persistence and a Wasp full-stack web application as the human-facing interface.

**Two tracks:**

- **Track A — Dynamic Capabilities**: Organise notes that feed into AI Architecture methodology deliverables (Sensing / Seizing / Transforming / Integrative Learning phases)
- **Track B — Project Delivery**: Process meeting notes into structured artefacts (RFI proposals, action items, decisions, status dashboard entries)

**Architecture (Option C — confirmed by user):**

- `examples/adam-server/` — A.D.A.M. MCP server, agent-facing tool layer (TypeScript, MCP SDK 1.24.0, Bun, Zod 4)
- `knowledge-platform/` — Wasp full-stack app, human-facing UI (knowledge browser, inbox dashboard, status dashboard, tag editor)
- Shared: PostgreSQL 16 via Prisma ORM (existing Docker stack, env-var credentials)

## Workspace

| Directory | Purpose |
|-----------|---------|
| `examples/adam-server/` | A.D.A.M. MCP server — existing, to be extended with Prisma in Phase 2+ |
| `knowledge-platform/` | Wasp app — to be scaffolded in Phase 1 |
| `docs/inbox/` | Raw note staging area — redesign as formal KM inbox |
| `docs/recipes/` | Foam recipe index — extend with Knowledge Management category |
| `docs/publishing/` | Existing publishing recipes — **PRESERVE, do not modify** |
| `docs/knowledge-platform/` | KM platform docs — taxonomy, architecture, schema reference |
| `.apm/` | APM work tracking (this directory) |
| `docker-compose.yml` | Docker stack: PostgreSQL 16, n8n, Qdrant, Ollama |

## Design Decisions

1. **Prisma ORM (NOT Qdrant)** — PostgreSQL via Prisma is the persistence layer; user explicitly rejected Qdrant for knowledge management
2. **Architecture Option C** — A.D.A.M. MCP layer + Wasp app UI layer, both share PostgreSQL
3. **Taxonomy-first (Phase 1)** — Design classification model and Prisma schema before building any ingestion tooling
4. **PII blocking** — `.pii-rules.csv` config file, never committed, strict file permissions (agent-unreadable), replaces keywords with placeholders before notes enter system
5. **Bun + TypeScript strict + Biome + Zod** — standard conventions for all new code in this project
6. **Testing deferred** — No test infrastructure in Phase 1; testing strategy determined in Phase 2+

## Scope

**Phase 1 (current):**

- Prisma schema design (KnowledgeItem, MeetingNote, Artifact, Tag models)
- Taxonomy document (tracks, phases, domains, statuses, AI Card schema)
- Wasp app scaffold at `knowledge-platform/` with PostgreSQL datasource
- Knowledge Management recipe category added to `docs/recipes/`
- Inbox README redesigned as formal KM staging area
- PII rules template documentation

**Phase 2+ (future):**

- A.D.A.M. MCP server: replace in-memory stores with Prisma client
- Extend `ingest-knowledge` tool with track/phase/domain metadata
- Wasp UI stub pages wired up to database
- Inbox pipeline (file-watch trigger + n8n workflow)
- Meeting notes processing (M365 dedup + structuring)

---

> **Notes:** PostgreSQL connection string is from Docker `.env` file. Port 5432 is internal only (not exposed to host). For local dev, either expose port or connect from within Docker network.
