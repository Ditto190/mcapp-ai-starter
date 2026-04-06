# Consolidation Specification

Purpose
-------

This document captures the planned consolidation of Node, Python, and auxiliary projects in this workspace into a single, co-located development workspace while preserving repository-level CI, agent definitions, and custom actions.

Principles
----------

- Preserve root `.github/` as canonical (agents, prompts, workflows, actions).
- Do not remove or alter nested `.github/` folders (e.g., `typespec-reference/.github/`) without explicit review and extraction of agents/actions/workflows.
- Avoid creating branches or pushing changes to remote during consolidation steps unless explicitly authorized.

Current state (summary)
-----------------------

- Root workspace: `VSCode_March26` (contains `package.json`, `.github/`, many docs).
- Node projects: numerous `package.json` files including `agent-skills`, `agentspec`, and a large pnpm monorepo at `typespec-reference/`.
- Python projects: `GenerateAgents/` (has `pyproject.toml`) and un-packaged `agents/` scripts.
- C# samples: several `*.csproj` files inside `typespec-reference/docs/samples`.

Proposal
--------

1. PNPM Workspace
   - Add `pnpm-workspace.yaml` at repository root (already added) with globs to include:
     - `.` (root)
     - `agent-skills`
     - `agentspec`
     - `typespec-reference/**`
     - `packages/**`
   - Purpose: allow `pnpm install` and cross-package scripts from repo root while preserving `typespec-reference`'s internal scripts.

2. `.github` Preservation and Reconciliation
   - Before removing or merging any nested `.github/`, extract the following artifacts and present them for approval:
     - Agent definitions (`.agent.md` files)
     - Custom actions (under `.github/actions/`)
     - Workflow files (`.github/workflows/*.yml`)
     - CODEOWNERS and policies
     - Dependabot configuration
   - Consolidation approach: prefer to keep package-specific workflows inside their package when they are tightly-coupled to that package; otherwise, migrate common workflows to root `.github/workflows` with clear comments and references.

3. Python Projects
   - Keep `GenerateAgents/` and `agents/` unchanged for now.
   - Optional later step: move Python projects under `python/` and create a shared `pyproject.toml` or use per-project `pyproject.toml` with a root `Makefile` or scripts to orchestrate tasks.

4. Samples and Multi-language
   - Keep C# samples in place under `typespec-reference/docs/samples` unless there is a desire to centralize samples into `samples/` separate from code packages.

5. Next actionable steps (no git branch creation/push)
   - Produce a full checklist of every `package.json`, `pyproject.toml`, and nested `.github` found with suggested handling for each item.
   - Review and approve any extractions from nested `.github` directories.
   - Optionally update root `package.json` to include a `packageManager` field and `workspaces` hint after checklist sign-off.

Notes
-----

- All consolidation operations will be prepared as local file edits/patches only; no branches will be created or pushed to remote without explicit approval.
- I attempted to save this plan to repository memory via `mcp_io_github_con_memory` but the tool returned an API validation error; I will retry on request or keep the plan in this spec file.

Approved by: TBD
