# Dependency Automation — Requirements

**Spec Phase:** ANALYZE  
**Date:** 2026-03-14  
**Confidence Score:** 88% — requirements are clear, tools are well-understood, Nix adoption carries moderate ramp-up risk

---

## Problem Statement

The `mcapp-ai-starter` workspace has three dependency management gaps that increase maintenance burden and risk:

1. **No automated dependency updates** — `npm` packages drift silently; PRs for updates are manual and infrequent.
2. **Build pipeline is slow** — `esbuild` handles examples; `build.bun.ts` exists but Bun bundler is not consistently used across all examples.
3. **No reproducible dev environment** — Node version is pinned via an NVM devcontainer feature but services (PostgreSQL etc.) are not declared as code; `.env` values are manually managed.

---

## Scope

| Feature | Phase | Owner |
|---|---|---|
| Renovate Bot — automated dependency PRs | Phase 1 (now) | CI/CD |
| Bun bundler — consistent fast builds | Phase 1 (now) | Build |
| devenv.sh + cachix — Nix dev environment | Phase 2 (later) | Platform |

---

## User Stories

### US-01 — Automated dependency updates (Renovate)

**As a** maintainer,  
**I want** dependency update PRs to be opened automatically when new versions are published,  
**so that** I do not have to manually check `npm outdated` or track upstream release feeds.

#### Acceptance Criteria — EARS notation

- **WHEN** a new patch or minor version of any `devDependency` is published to the npm registry, **THE SYSTEM SHALL** open a pull request within 24 hours updating the dependency.
- **WHEN** the opened PR passes all CI checks, **THE SYSTEM SHALL** automatically merge it without human intervention (automerge for non-breaking changes).
- **WHEN** a new major version of any dependency is published, **THE SYSTEM SHALL** open a PR but NOT automerge it, requiring human review.
- **WHEN** Renovate scans the repository, **THE SYSTEM SHALL** detect and update `devcontainer.json` feature versions (e.g. `ghcr.io/devcontainers/features/node`) alongside npm packages.
- **WHEN** detecting monorepo npm workspace packages under `examples/*`, **THE SYSTEM SHALL** treat them as part of the same dependency graph and group related updates.

---

### US-02 — Fast, consistent builds (Bun)

**As a** developer,  
**I want** all example packages and the SDK core to build using Bun,  
**so that** build times are significantly shorter and the pipeline is consistent across local dev and CI.

#### Acceptance Criteria — EARS notation

- **WHEN** a developer runs `npm run build` or `npm run build:all`, **THE SYSTEM SHALL** use Bun as the bundler, completing the full build in under 30 seconds on typical hardware.
- **WHEN** Bun is not installed, **THE SYSTEM SHALL** fall back to the existing esbuild pipeline without error.
- **WHEN** building, **THE SYSTEM SHALL** produce identical output artefacts (`dist/`) regardless of whether Bun or esbuild was used.
- **WHEN** the CI workflow runs, **THE SYSTEM SHALL** use the same Bun version available in the devcontainer (`@oven/bun-linux-x64@^1.2.21`).
- **WHEN** a `bun.lock` file is generated, **THE SYSTEM SHALL** commit it alongside `package-lock.json`, which is retained for npm compatibility.

---

### US-03 — Reproducible dev environment (devenv.sh — Phase 2)

**As a** contributor setting up the project for the first time,  
**I want** to run a single command (`devenv shell`) that configures Node.js, PostgreSQL, and all required services,  
**so that** my local environment matches CI and the Codespace exactly, without manually installing tools.

#### Acceptance Criteria — EARS notation

- **WHEN** a contributor runs `devenv shell`, **THE SYSTEM SHALL** provide Node.js 24, Bun, and all declared services without requiring manual `apt install` or NVM setup.
- **WHEN** devenv initialises, **THE SYSTEM SHALL** start a local PostgreSQL 15 instance accessible on `localhost:5432` with the database name and user defined in `.env`.
- **WHEN** devenv generates a `.devcontainer.json`, **THE SYSTEM SHALL** be a superset of the existing `devcontainer.json` configuration, not replacing it.
- **WHEN** the Nix environment is built for the first time, **THE SYSTEM SHALL** pull pre-built binaries from the `cachix` binary cache, avoiding local compilation.
- **IF** `sops-nix` or equivalent secret management is not configured, **THE SYSTEM SHALL** fall back to reading `.env` values at shell initialisation, logging a warning but not failing.

---

### US-04 — Security hygiene (all phases)

**As a** security-conscious maintainer,  
**I want** dependency updates to include CVE/vulnerability metadata and no secrets to be embedded in config files,  
**so that** the project remains secure and auditable.

#### Acceptance Criteria — EARS notation

- **WHEN** Renovate opens a PR, **THE SYSTEM SHALL** include the upstream changelog or release notes as PR description body.
- **WHEN** a dependency has a known CVE, **THE SYSTEM SHALL** label the PR with `security` and prioritise it above standard update PRs.
- **WHEN** Renovate config is committed, **THE SYSTEM SHALL NOT** contain any API keys, tokens, or secrets; all credentials shall be provided via GitHub Actions secrets.
- **WHEN** `devenv.nix` declares environment variables, **THE SYSTEM SHALL** reference them via `.env` file interpolation or `dotenv`, never hardcoding values.

---

## Dependencies and Constraints

| Constraint | Detail |
|---|---|
| Node.js version | 24.x (NVM feature in devcontainer) |
| npm workspaces | `examples/*` workspace definition in root `package.json` |
| Bun optional dep | `@oven/bun-linux-x64@^1.2.21` already in `optionalDependencies` |
| No `docker-compose.yml` | Services are currently external or manual |
| `.env` file | ~40+ keys; must not be committed; values must remain injectable |
| GitHub Actions | Repository uses standard GitHub Actions for CI, secrets managed there |
| Renovate token | Requires `RENOVATE_TOKEN` secret (PAT or GitHub App) |

---

## Edge Cases and Failure Points

| Scenario | Risk | Mitigation |
|---|---|---|
| Renovate automerge breaks main | Automerged major/breaking update  | Major versions never automerged; require manual review |
| Bun lockfile conflicts with npm install in CI | `bun.lock` diverges from `package-lock.json` | CI always uses `npm ci` for install; `bun.lock` is supplementary |
| devenv Nix first-build slow (no cache) | Cold build can take 10+ min | cachix binary cache covers 99% of packages |
| Nix learning curve for contributors | PRs to `devenv.nix` may introduce errors | Validate `devenv.nix` in CI with `devenv test` |
| `.env` missing on new checkout | devenv / scripts fail silently | Provide `.env.example` with all keys documented |

---

## Out of Scope

- Docker Compose service orchestration (no Dockerfiles in this repo)
- Handlebars templating (assessed and rejected — no value here)
- Replacing `npm` with `bun` for package installation (too risky for CI; Bun used for bundling only)
- Secret rotation automation (out of scope — handled by platform team)
