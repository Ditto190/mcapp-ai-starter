---
title: "AGENTS.md Hierarchical Guidance Methodology — Adoption Spike"
category: "Architecture"
status: "🔴 Not Started"
priority: "High"
timebox: "1 week"
created: 2026-05-04
updated: 2026-05-04
owner: "APM Team"
tags: ["technical-spike", "architecture", "agents-md", "ai-agents", "methodology"]
---

# AGENTS.md Hierarchical Guidance Methodology — Adoption Spike

## Summary

**Spike Objective:** Determine how to systematically apply the folder-scoped `AGENTS.md` methodology — as demonstrated in `prompt-registry` — across all repositories and workspace areas in the APM project, ensuring AI agents always load context-relevant guidance before modifying files.

**Why This Matters:** Without folder-specific AGENTS.md files, AI agents fall back to generic behaviour and frequently produce:

- Tests that mock internals instead of asserting on public behaviour
- Adapters or services that deviate from established patterns
- Documentation written for the wrong audience or wrong section
- E2E tests that duplicate production code rather than invoking real entry points

The `prompt-registry` AGENTS.md hierarchy proves that structured, hierarchical guidance significantly reduces rework caused by agents ignoring local conventions.

**Timebox:** 1 week

**Decision Deadline:** Before any new service, adapter, or test-suite authoring begins in the remaining APM sub-projects.

---

## Research Question(s)

**Primary Question:** What is the minimal, replicable structure of `AGENTS.md` files needed in each folder-class (source, test, e2e, docs, adapters, services, specs) to reliably steer AI coding agents toward context-correct outputs?

**Secondary Questions:**

- Which folder classes carry the highest risk of agent errors without local AGENTS.md guidance?
- How do root-level and folder-level AGENTS.md files interact — does the root file's mandatory-read table get followed reliably, or do agents need direct guidance in every sub-folder?
- What is the minimum viable content for each AGENTS.md file to be effective (vs. being so long it is ignored)?
- Should AGENTS.md files reference each other (cross-linking), or should each be standalone?
- How do we validate that an agent actually read the AGENTS.md before acting (success signals vs. failure signals)?
- Is there a tooling gap — e.g., a lint rule or CI check — that can enforce AGENTS.md compliance?

---

## Investigation Plan

### Research Tasks

- [ ] Audit all existing AGENTS.md files in `prompt-registry` — map which folders have them, which don't, and what content patterns are repeated
- [ ] Run 3–5 representative agent tasks (test creation, adapter modification, doc update, spec writing) against folders **with** vs. **without** AGENTS.md files — document failure modes in the without-case
- [ ] Review AGENTS.md files in other APM sub-projects (`foam-modme`, `memento`, `agentic-project-management-modme` root) — identify common vs. project-specific patterns
- [ ] Evaluate the `frontend.prompt.md` fixture as a template pattern — assess whether `.apm/prompts/` per-package prompt files complement AGENTS.md or replace them
- [ ] Research VS Code Copilot instruction file precedence rules (how `applyTo` patterns, `description` fields, and hierarchical `.github/copilot-instructions.md` interact with AGENTS.md)
- [ ] Draft a canonical AGENTS.md template per folder class (src/services, src/adapters, test, test/e2e, docs, .kiro/specs)
- [ ] Create proof-of-concept: apply templates to one un-covered sub-project and run agent tasks to validate improvement

### Success Criteria

**This spike is complete when:**

- [ ] A canonical AGENTS.md template exists for each folder class (≤ 3 pages each)
- [ ] The root AGENTS.md mandatory-read table pattern is validated as effective (or an alternative trigger mechanism is documented)
- [ ] At least one sub-project outside `prompt-registry` has AGENTS.md files applied and tested with a real agent task
- [ ] Clear recommendation documented: which folders are HIGH PRIORITY for AGENTS.md vs. LOW PRIORITY (can use root guidance)
- [ ] A replication checklist exists that any contributor can follow to add AGENTS.md coverage to a new folder

---

## Technical Context

**Related Components:**

- `prompt-registry/AGENTS.md` — root mandatory-read dispatch table
- `prompt-registry/test/AGENTS.md` — test writing patterns (behaviour-not-implementation, mock boundaries, TDD phases)
- `prompt-registry/src/adapters/AGENTS.md` — adapter patterns
- `prompt-registry/src/services/AGENTS.md` — service layer patterns
- `prompt-registry/docs/AGENTS.md` — documentation structure and audience routing
- `prompt-registry/test/e2e/AGENTS.md` — E2E entry-point-only constraint
- `.github/instructions/copilot-instructions.md.instructions.md` — global Copilot agent instructions (all files, `applyTo: **`)

**Dependencies:**

- This spike informs the design of all future AI-agent-authored files in APM sub-projects
- Upstream blocker for: any automated agent-driven code generation pipeline (n8n, generate-agents-mcp)
- Related spike needed: validation tooling for AGENTS.md compliance (CI/linting)

**Constraints:**

- AGENTS.md files are read by both VS Code Copilot (via `description`/`applyTo` in `.github/instructions/`) AND raw LLM agents (Claude, GPT) that process the file system directly — templates must work for both audiences
- File length matters: excessively long AGENTS.md files are less likely to be read in full by agents working within token budgets
- The `consolidated_sources/` folder trees are reference copies — changes should target the live project roots, not consolidated snapshots

---

## Research Findings

### Investigation Results

_[To be filled during spike execution]_

### Prototype/Testing Notes

_[Results from proof-of-concept agent task runs — with vs. without AGENTS.md coverage]_

### External Resources

- [prompt-registry root AGENTS.md](../AGENTS.md) — reference implementation of mandatory-read dispatch pattern
- [prompt-registry test/AGENTS.md](../../test/AGENTS.md) — reference implementation of test-layer guidance
- [VS Code Copilot customization docs](https://code.visualstudio.com/docs/copilot/copilot-customization) — `applyTo`, `description`, instruction file hierarchy
- [GitHub Copilot coding agent instructions](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/about-coding-agents) — how Copilot reads AGENTS.md files
- [CODEX AGENTS.md spec](https://docs.openai.com/codex) — OpenAI agent convention reference

---

## Decision

### Recommendation

_[To be filled after research — expected outcome: a 6-template AGENTS.md kit (one per folder class) plus a 1-page root dispatch table pattern, applied to all APM sub-projects]_

### Rationale

_[To be filled based on evidence from prototype runs]_

### Implementation Notes

**Hypothesised approach** (to be validated):

1. **Root AGENTS.md**: Mandatory-read dispatch table + development methodology (bug-first TDD, minimal code, no backward-compat for same-session changes)
2. **`src/services/AGENTS.md`**: Service patterns, dependency injection conventions, error handling strategy
3. **`src/adapters/AGENTS.md`**: Adapter interface contracts, mock boundary rules, retry/timeout patterns
4. **`test/AGENTS.md`**: Behaviour-not-implementation rule, mock boundary definitions, TDD phase definitions (RED/GREEN/REFACTOR)
5. **`test/e2e/AGENTS.md`**: Entry-point-only constraint, VS Code command invocation pattern, no production-code duplication rule
6. **`docs/AGENTS.md`**: Audience routing table, when-to-update rules, section ownership

### Follow-up Actions

- [ ] Create AGENTS.md template kit (6 templates) in `docs/contributor-guide/agents-md-templates/`
- [ ] Apply templates to `foam-modme` and `memento` sub-projects
- [ ] Open GitHub issues for each sub-project missing coverage
- [ ] Add AGENTS.md presence check to CI (optional, low priority — validate spike first)
- [ ] Update root `copilot-instructions.md.instructions.md` to reference the templates

---

## Status History

| Date       | Status         | Notes                                            |
| ---------- | -------------- | ------------------------------------------------ |
| 2026-05-04 | 🔴 Not Started | Spike created and scoped from prompt-registry methodology audit |

---

_Last updated: 2026-05-04 by APM Team_
