# Dependency Automation — Tasks

**Spec Phase:** IMPLEMENT (plan)  
**Date:** 2026-03-14  
**Status legend:** `[ ]` not started · `[-]` in progress · `[x]` done

---

## Phase 1 — Renovate Bot + Bun Bundler

### Milestone 1.A — Renovate Bot

#### Task 1.A.1 — Create `renovate.json`
- **Description:** Add `renovate.json` to repo root with `config:recommended`, automerge rules for devDeps, devcontainer feature scanning, and `ignorePaths` for `plugins/awesome-copilot/**` and `apps/skillkit/**`.
- **Expected outcome:** `npx renovate-config-validator` passes with no errors.
- **Dependencies:** None.
- **File:** `renovate.json`
- **Status:** `[ ]`

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended"],
  "ignorePaths": [
    "**/node_modules/**",
    "plugins/awesome-copilot/**",
    "apps/skillkit/**"
  ],
  "packageRules": [
    {
      "matchDepTypes": ["devDependencies"],
      "matchUpdateTypes": ["minor", "patch", "pin", "digest"],
      "automerge": true,
      "automergeType": "pr",
      "automergeStrategy": "auto"
    },
    {
      "matchDepTypes": ["dependencies", "peerDependencies"],
      "automerge": false
    },
    {
      "matchManagers": ["devcontainer"],
      "matchUpdateTypes": ["minor", "patch", "digest"],
      "automerge": true,
      "groupName": "devcontainer features"
    }
  ],
  "vulnerabilityAlerts": {
    "enabled": true,
    "labels": ["security"]
  },
  "prBodyTemplate": "{{{table}}}{{{notes}}}{{{changelogs}}}"
}
```

---

#### Task 1.A.2 — Create GitHub Actions workflow
- **Description:** Add `.github/workflows/renovate.yml` to run Renovate on a Mon–Fri 04:00 UTC schedule and on manual dispatch. Reference `RENOVATE_TOKEN` secret.
- **Expected outcome:** Workflow appears in the Actions tab; can be triggered manually without erroring (token check only — no actual PRs needed for first-run verification).
- **Dependencies:** Task 1.A.1, `RENOVATE_TOKEN` secret configured in repo settings.
- **File:** `.github/workflows/renovate.yml`
- **Status:** `[ ]`

```yaml
name: Renovate
on:
  workflow_dispatch:
  schedule:
    - cron: '0 4 * * 1-5'

jobs:
  renovate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: renovatebot/github-action@v40.0.0
        with:
          token: ${{ secrets.RENOVATE_TOKEN }}
        env:
          LOG_LEVEL: info
```

---

#### Task 1.A.3 — Configure `RENOVATE_TOKEN` secret
- **Description:** Create a fine-grained GitHub PAT or use a GitHub App with at minimum `contents: write` and `pull-requests: write` on this repository. Add to GitHub repo secrets as `RENOVATE_TOKEN`.
- **Expected outcome:** Workflow completes without `401 Unauthorized` errors.
- **Dependencies:** GitHub repo admin access.
- **File:** (GitHub UI — no file change)
- **Status:** `[ ]`

> **Security requirement:** Token scope must be limited to this repository only. Document the token expiry date in a repo-internal note or Renovate dashboard comment.

---

#### Task 1.A.4 — Validate Renovate config locally
- **Description:** Run `npx --yes renovate-config-validator` in the repo root; confirm exit 0.
- **Expected outcome:** `Config is valid!` output; no schema errors.
- **Dependencies:** Task 1.A.1.
- **Command:** `npx --yes renovate-config-validator`
- **Status:** `[ ]`

---

### Milestone 1.B — Bun Bundler

#### Task 1.B.1 — Create `scripts/detect-bun.mjs`
- **Description:** Write a Node.js script that checks if `bun` is on the system PATH and exits 0 (found) or 1 (not found). No side effects.
- **Expected outcome:** `node scripts/detect-bun.mjs` exits 0 in devcontainer; exits 1 on a system without Bun.
- **Dependencies:** None.
- **File:** `scripts/detect-bun.mjs`
- **Status:** `[ ]`

```js
#!/usr/bin/env node
// detect-bun.mjs — exits 0 if bun is on PATH, 1 otherwise
import { execFileSync } from 'node:child_process';
try {
  execFileSync('bun', ['--version'], { stdio: 'ignore' });
  process.exit(0);
} catch {
  process.exit(1);
}
```

---

#### Task 1.B.2 — Extend `build.bun.ts` for examples
- **Description:** Review `build.bun.ts` and extend the entry points array to include all example packages under `examples/*/src/index.ts` (glob). Ensure the script handles missing entry points gracefully (skip if file doesn't exist).
- **Expected outcome:** `bun run build.bun.ts` builds SDK core + all examples; `dist/` artefacts match those produced by `build-esbuild.mjs`.
- **Dependencies:** None (file already exists).
- **File:** `build.bun.ts`
- **Status:** `[ ]`

---

#### Task 1.B.3 — Add `build:bun` and `build:esbuild` npm scripts
- **Description:** In the root `package.json`, add:
  - `"build:bun"` → `"bun run build.bun.ts"`
  - `"build:esbuild"` → `"node scripts/build-esbuild.mjs"` (extract from existing `build` script if needed)
  - Update `"build"` → detect Bun and use `build:bun`, otherwise fall back to `build:esbuild`.
- **Expected outcome:** `npm run build` uses Bun in devcontainer; falls back to esbuild in environments without Bun.
- **Dependencies:** Task 1.B.1, Task 1.B.2.
- **File:** `package.json`
- **Status:** `[ ]`

---

#### Task 1.B.4 — Commit `bun.lock` if generated
- **Description:** After running `bun install` once in the devcontainer, commit the generated `bun.lock`. Add a comment in `.gitignore` confirming `bun.lock` is intentionally tracked. Keep `package-lock.json` — do not delete it.
- **Expected outcome:** Both `bun.lock` and `package-lock.json` are present in the repo. CI still uses `npm ci`.
- **Dependencies:** Bun available in devcontainer (confirmed via `@oven/bun-linux-x64` optional dep).
- **File:** `bun.lock`, `.gitignore`
- **Status:** `[ ]`

---

#### Task 1.B.5 — Add `renovate-config-validator` to CI
- **Description:** Add a step in the existing CI workflow (or a new small job) that runs `npx --yes renovate-config-validator` on every PR to catch config drift.
- **Expected outcome:** CI fails if `renovate.json` becomes invalid.
- **Dependencies:** Task 1.A.1, existing CI workflow file.
- **File:** `.github/workflows/ci.yml` (or equivalent)
- **Status:** `[ ]`

---

### Milestone 1.C — Documentation

#### Task 1.C.1 — Add `.env.example`
- **Description:** Create `.env.example` with all known env var keys (sourced from `.env`) but with placeholder values only. Ensure the real `.env` remains in `.gitignore`.
- **Expected outcome:** New contributor can run `cp .env.example .env` and fill in values without guessing key names.
- **Dependencies:** None.
- **File:** `.env.example`
- **Status:** `[ ]`

---

#### Task 1.C.2 — Update `README.md` — dependency management section
- **Description:** Add a "Dependency Management" section to `README.md` explaining: Renovate runs daily, automerges non-breaking devDeps, and how to review major version PRs.
- **Expected outcome:** README documents the automated dependency flow.
- **Dependencies:** Task 1.A.1.
- **File:** `README.md`
- **Status:** `[ ]`

---

## Phase 2 — devenv.sh + cachix (future)

> **Prerequisites:** Phase 1 complete · Team has Nix installed locally or via devcontainer feature.

### Milestone 2.A — devenv.nix baseline

#### Task 2.A.1 — Create `devenv.nix`
- **Description:** Write `devenv.nix` declaring Node.js 24, Bun, npm, and a PostgreSQL 15 service. Enable `dotenv` loading. Enable `devcontainer.enable = true` for overlay generation.
- **Expected outcome:** `devenv shell` launches without errors; `node --version` shows v24.x; `psql -h localhost` connects.
- **Dependencies:** Nix + devenv CLI installed (see Task 2.A.3).
- **File:** `devenv.nix`
- **Status:** `[ ]`

---

#### Task 2.A.2 — Create `devenv.yaml`
- **Description:** Lock the devenv version and declare the cachix binary cache to use.
- **Expected outcome:** Reproducible devenv version across all contributors.
- **File:** `devenv.yaml`
- **Status:** `[ ]`

```yaml
inputs:
  nixpkgs:
    url: github:NixOS/nixpkgs/nixpkgs-unstable
  devenv:
    url: github:cachix/devenv/v2.0.4

cachix:
  - name: devenv
```

---

#### Task 2.A.3 — Add Nix + devenv to devcontainer
- **Description:** Add the Nix devcontainer feature to `devcontainer.json`. After Nix installs, `post-create.sh` runs `cachix use devenv` if the binary is available.
- **Expected outcome:** `devenv shell` works inside the Codespace.
- **Dependencies:** Task 2.A.1.
- **File:** `.devcontainer/devcontainer.json`, `.devcontainer/post-create.sh`
- **Status:** `[ ]`

---

#### Task 2.A.4 — Add `devenv test` to CI
- **Description:** Add a CI job (matrix: ubuntu-latest) that runs `devenv test` to validate `devenv.nix` evaluates correctly on every PR.
- **Expected outcome:** CI catches `devenv.nix` breakage before it reaches default branch.
- **Dependencies:** Task 2.A.1.
- **File:** `.github/workflows/devenv.yml`
- **Status:** `[ ]`

---

### Milestone 2.B — Secret management (optional, Phase 3)

#### Task 2.B.1 — Evaluate sops-nix for `.env` secrets
- **Description:** Research `sops-nix` integration with `devenv.nix`. Document whether it is needed given GitHub Actions secrets already cover CI. Decide: adopt or defer.
- **Expected outcome:** Decision record in `docs/spec/dependency-automation/decisions.md`.
- **Dependencies:** Task 2.A.1 complete and validated.
- **File:** `docs/spec/dependency-automation/decisions.md`
- **Status:** `[ ]`

---

## Validation Checklist (Phase 1 complete)

- [ ] `renovate.json` passes `npx renovate-config-validator`
- [ ] Renovate GitHub Actions workflow triggers without errors on manual dispatch
- [ ] `npm run build` uses Bun in devcontainer, falls back to esbuild without Bun
- [ ] `dist/` output from Bun matches output from esbuild (diff check)
- [ ] Both `bun.lock` and `package-lock.json` present in repo
- [ ] `npm ci` still works in CI without Bun present
- [ ] `.env.example` covers all keys in `.env`
- [ ] README documents dependency management flow

## Validation Checklist (Phase 2 complete)

- [ ] `devenv shell` starts in < 60s (with cachix cache warm)
- [ ] PostgreSQL service reachable on `localhost:5432` inside devenv shell
- [ ] `devenv test` passes in CI
- [ ] Generated `.devcontainer.json` overlay is compatible with existing `devcontainer.json`
- [ ] No secrets in `devenv.nix` or `devenv.yaml`
