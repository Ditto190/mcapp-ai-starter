# CI Bun Migration — Conversation Review (2026-05-09)

## 1) Title + metadata

- **Title:** CI Bun Migration Conversation Review
- **Date:** 2026-05-09
- **Workspace:** `/home/wsl-vm`
- **Primary repos in scope:**
  - `projects/foam-modme`
  - `projects/memento`
  - `projects/agentic-project-management-modme`
- **Scope:** Migrate CI/workflow execution paths from npm/setup-node patterns to Bun where appropriate, preserve intentional npm-only cases, align root automation, and sync shared workflows cross-repo.

## 2) User objective

- Standardize CI and automation on Bun (`bun@1.3.13`) across shared workflows and local root tooling.
- Keep only intentional npm/setup-node references where required for publish provenance/auth and package-install-path validation.
- Ensure VS Code task configuration opens cleanly (no missing task label errors).
- Produce consistent cross-repo workflow behavior by copying shared updates.

## 3) Work completed

### CI/workflows

- Migrated workflows from npm/setup-node patterns to Bun using:
  - `oven-sh/setup-bun@v2`
  - pinned `bun-version: "1.3.13"`
- Applied updates across `foam-modme`, `memento`, and `agentic-project-management-modme` for shared workflow set:
  - `lib-collection-scripts-ci.yml`
  - `vscode-extension-secure-ci.yml`
  - `repo-ci.yml`
  - `ci.yml`
  - `docs.yml`
  - `publish.yml`
  - `serena-symbol-analysis.yml`
  - `adam-playground.yml`
  - `update-snapshots.yml`
  - `dependency-health.yml`
  - `npm-publish.yml`
  - `session-preservation-dry-run.yml`
  - `checkpoint-fast-review.yml`
- APM-specific workflow updates included:
  - `release-templates.yml`
  - `copilot-setup-steps.yml`
- `dependency-health` changes:
  - replaced `npm-audit` with `bun-audit`
  - replaced `npm outdated` with `bun outdated`
  - removed `package-lock` trigger.

### Root automation

- Updated root `/home/wsl-vm/package.json`:
  - added/updated pre-session script behavior to run via Bun
  - configured `simple-git-hooks` pre-commit and pre-push to run Bun-based commands.

### VS Code task fix

- Updated root `/home/wsl-vm/.vscode/tasks.json`:
  - added pre-session task on folder open
  - fixed missing task label issue by adding exact label:
    - `MCP: Status — check all servers`

### Cross-repo sync

- Synced updated shared workflow files from `foam-modme` into:
  - `memento`
  - `agentic-project-management-modme`
- Goal: avoid drift and keep CI behavior aligned for shared automation.

## 4) Files updated and what changed (key files)

### Root workspace (`/home/wsl-vm`)

- `package.json`
  - Bun-first pre-session script and simple-git-hooks commands.
- `.vscode/tasks.json`
  - pre-session-on-open task added; MCP status task label corrected.

### `projects/foam-modme`

- `.github/workflows/lib-collection-scripts-ci.yml`
- `.github/workflows/vscode-extension-secure-ci.yml`
- `.github/workflows/repo-ci.yml`
- `.github/workflows/ci.yml`
- `.github/workflows/docs.yml`
- `.github/workflows/publish.yml`
- `.github/workflows/serena-symbol-analysis.yml`
- `.github/workflows/adam-playground.yml`
- `.github/workflows/update-snapshots.yml`
- `.github/workflows/dependency-health.yml`
- `.github/workflows/npm-publish.yml`
- `.github/workflows/session-preservation-dry-run.yml`
- `.github/workflows/checkpoint-fast-review.yml`
- **Change pattern:** Bun setup/action adoption, Bun install/build/test equivalents where appropriate, intentional npm-only preserves for publish/auth and specific test intent.

### `projects/memento`

- `.github/workflows/lib-collection-scripts-ci.yml`
- `.github/workflows/vscode-extension-secure-ci.yml`
- `.github/workflows/repo-ci.yml`
- `.github/workflows/ci.yml`
- `.github/workflows/docs.yml`
- `.github/workflows/publish.yml`
- `.github/workflows/serena-symbol-analysis.yml`
- `.github/workflows/adam-playground.yml`
- `.github/workflows/update-snapshots.yml`
- `.github/workflows/dependency-health.yml`
- `.github/workflows/npm-publish.yml`
- `.github/workflows/session-preservation-dry-run.yml`
- `.github/workflows/checkpoint-fast-review.yml`
- **Change pattern:** synced to match shared Bun migration baseline.

### `projects/agentic-project-management-modme`

- `.github/workflows/lib-collection-scripts-ci.yml`
- `.github/workflows/vscode-extension-secure-ci.yml`
- `.github/workflows/repo-ci.yml`
- `.github/workflows/ci.yml`
- `.github/workflows/docs.yml`
- `.github/workflows/publish.yml`
- `.github/workflows/serena-symbol-analysis.yml`
- `.github/workflows/adam-playground.yml`
- `.github/workflows/update-snapshots.yml`
- `.github/workflows/dependency-health.yml`
- `.github/workflows/npm-publish.yml`
- `.github/workflows/session-preservation-dry-run.yml`
- `.github/workflows/checkpoint-fast-review.yml`
- `.github/workflows/release-templates.yml` *(APM-specific)*
- `.github/workflows/copilot-setup-steps.yml` *(APM-specific)*
- **Change pattern:** shared Bun migration + APM-specific workflow harmonization.

## 5) Validation and verification steps performed

- Verified workflow conversion consistency across target files and repos.
- Performed final grep-style verification for remaining `setup-node` / `npm` references.
- Confirmed residual references are intentional only:
  - npm publish auth/provenance path in `npm-publish` workflows.
  - `ci.yml` `test-git-install` path validating npm consumer install behavior.
- Verified VS Code tasks issue resolution by adding required MCP task label.

## 6) Intentional exceptions and rationale

- **`npm-publish` workflows keep `actions/setup-node`:**
  - required for npm registry authentication and provenance-compatible publish flow.
  - Bun used for install/build/test where applicable; node/auth segment retained intentionally.
- **`ci.yml` keeps npm in `test-git-install`:**
  - intentionally validates published package install path as npm consumers use it.
  - not a migration gap; this is explicit compatibility coverage.

## 7) Outstanding items / follow-ups

- Monitor future workflow additions to ensure they default to Bun + pinned version.
- Re-run periodic grep audits to catch drift (new npm/setup-node usage).
- Confirm each repo’s future PRs preserve intentional exceptions only (publish auth + test-git-install).
- Optional: add a CI lint/check to fail on non-exempt npm/setup-node usage in workflow YAML.

## 8) Risks and mitigations

- **Risk:** Silent drift back to npm/setup-node in new workflows.
  - **Mitigation:** periodic grep check + policy note in repo instructions.
- **Risk:** Over-zealous cleanup removes required publish auth/provenance setup.
  - **Mitigation:** document and codify exempt files/steps (`npm-publish`, `test-git-install`).
- **Risk:** Cross-repo desynchronization over time.
  - **Mitigation:** keep `foam-modme` as baseline and sync shared workflows on change.
- **Risk:** Bun version divergence.
  - **Mitigation:** standard pin to `1.3.13` via `oven-sh/setup-bun@v2` in shared workflows.

## 9) Quick restart checklist for next agent

- Confirm baseline in `projects/foam-modme/.github/workflows` reflects intended latest state.
- Re-sync changed shared workflows to `projects/memento` and `projects/agentic-project-management-modme`.
- Verify every migrated workflow uses:
  - `oven-sh/setup-bun@v2`
  - `bun-version: "1.3.13"`
- Verify intentional exceptions still present and untouched:
  - `npm-publish` node auth/provenance path
  - `ci.yml` `test-git-install` npm install path
- Re-run grep verification for `setup-node|npm` and review only non-exempt matches.
- Confirm root task/hook automation still valid:
  - `/home/wsl-vm/package.json`
  - `/home/wsl-vm/.vscode/tasks.json` (`MCP: Status — check all servers` label)

## 10) Decision log (brief)

- **Decision:** standardize CI on Bun for install/build/test.
  - **Why:** unify tooling, reduce npm-centric drift, align workspace policy.
- **Decision:** pin Bun to `1.3.13` in workflows.
  - **Why:** deterministic CI behavior across repos.
- **Decision:** retain setup-node in `npm-publish`.
  - **Why:** npm auth/provenance publish requirements.
- **Decision:** retain npm install in `ci.yml` `test-git-install`.
  - **Why:** explicit real-world npm consumer path validation.
- **Decision:** sync shared workflow changes from `foam-modme` to sibling repos.
  - **Why:** prevent CI policy drift across related codebases.

Status: Complete
