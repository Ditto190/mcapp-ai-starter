# Dependency Automation — Design

**Spec Phase:** DESIGN  
**Confidence Score:** 88% → High Confidence path — full implementation plan, no PoC required  
**Date:** 2026-03-14

---

## Architecture Overview

The automation is delivered in two independent, additive phases. Each phase leaves the existing `npm`-based workflow intact as a fallback.

```
┌────────────────────────────────────────────────────────────────────┐
│                       Repository Root                              │
│                                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │ renovate.json│  │ build.bun.ts │  │  devenv.nix (Phase 2)  │  │
│  │  (Phase 1)   │  │  (Phase 1)   │  │                        │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬─────────────┘  │
│         │                 │                      │               │
│         ▼                 ▼                      ▼               │
│  Renovate Bot       Bun Bundler             devenv shell         │
│  (GitHub App)       npm run build           devenv test          │
│         │                 │                      │               │
│         ▼                 ▼                      ▼               │
│   Auto-merge PRs     dist/ artefacts      Nix-managed deps       │
│                                           + PostgreSQL svc        │
└────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Renovate + Bun Bundler

### Component 1 — Renovate Bot

**How it works:**

1. A GitHub Actions workflow (`renovate.yml`) runs on a daily schedule and on `workflow_dispatch`.
2. It calls `renovatebot/github-action@v40` with a `RENOVATE_TOKEN` (PAT with `repo` scope, stored as a GitHub Actions secret).
3. Renovate reads `renovate.json` at the repo root, discovers all dependency manifests (`package.json`, `devcontainer.json`), and opens or updates PRs.
4. PRs for `devDependencies` at patch/minor are auto-merged when CI passes. Major-version PRs are left for human review.

**`renovate.json` configuration:**

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

**Why `ignorePaths` for plugin folders:**
- `plugins/awesome-copilot/` is a vendored external collection with its own lifecycle; Renovate updating it would introduce unreviewed lock-step changes.
- `apps/skillkit/` uses `pnpm` workspaces with its own `pnpm-lock.yaml` and is versioned independently.

**GitHub Actions workflow (`.github/workflows/renovate.yml`):**

```yaml
name: Renovate
on:
  workflow_dispatch:
  schedule:
    - cron: '0 4 * * 1-5'   # 04:00 UTC Mon–Fri

jobs:
  renovate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Run Renovate
        uses: renovatebot/github-action@v40.0.0
        with:
          token: ${{ secrets.RENOVATE_TOKEN }}
        env:
          LOG_LEVEL: info
```

> **Security note:** `RENOVATE_TOKEN` must be a fine-grained PAT with `contents: write` and `pull-requests: write` on this repository only. It is not printed in logs and must never appear in `renovate.json`.

---

### Component 2 — Bun Bundler

**Current state:** `build.bun.ts` exists at the repo root; `@oven/bun-linux-x64@^1.2.21` is in `optionalDependencies`. This partial adoption is extended to cover all example builds.

**Architecture decision:** Bun is used exclusively as a **bundler** (replacing esbuild for bundling steps). `npm install` / `npm ci` remain the package install commands — this avoids introducing `bun.lock` / `package-lock.json` conflicts in CI.

**`build.bun.ts` extension pattern:**

The existing `build.bun.ts` already declares entry points and esbuild-compatible options. Extend it so examples use the same script:

```typescript
// build.bun.ts  (simplified extension)
await Bun.build({
  entrypoints: ["./src/app.ts", ...exampleEntrypoints],
  outdir: "./dist",
  external: ["react", "react-dom", "@modelcontextprotocol/sdk", "zod"],
  format: "esm",
  splitting: true,
  sourcemap: "external",
  minify: true,
});
```

**npm script update (`package.json`):**

```json
{
  "scripts": {
    "build": "node scripts/detect-bun.mjs && bun run build.bun.ts || node scripts/build-esbuild.mjs",
    "build:bun": "bun run build.bun.ts",
    "build:esbuild": "node scripts/build-esbuild.mjs"
  }
}
```

`scripts/detect-bun.mjs` — a tiny script that exits 0 if `bun` is on PATH, 1 otherwise. This enables the `||` fallback without shell-specific syntax.

**Lockfile strategy:**

| File | Purpose | Committed? |
|---|---|---|
| `package-lock.json` | npm install (CI, most contributors) | ✅ Yes |
| `bun.lock` | Optional bun install (fast local dev) | ✅ Yes (text format) |

`bun.lock` is in text format since Bun v1.2 and is human-readable. Both files may coexist; CI uses `npm ci` to respect `package-lock.json`.

---

## Phase 2: devenv.sh + cachix (future)

### Architecture

```
devenv shell
│
├── reads devenv.nix
│   ├── languages.javascript (Node 24, Bun, npm)
│   ├── services.postgres (PostgreSQL 15 on :5432)
│   └── devcontainer.enable = true  →  generates .devcontainer.json overlay
│
├── checks cachix binary cache (devenv.cachix.org)
│   └── pulls pre-built Nix closures; no local compilation
│
└── loads .env via dotenv (sops-nix optional, Phase 3)
```

**`devenv.nix` (target state):**

```nix
{ pkgs, config, ... }:

{
  # ── Language toolchains ─────────────────────────────────────────
  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_24;
    bun.enable = true;
    npm.enable = true;
  };

  # ── Local services ───────────────────────────────────────────────
  services.postgres = {
    enable = true;
    package = pkgs.postgresql_15;
    port = 5432;
    listen_addresses = "127.0.0.1";
    initialDatabases = [{ name = "mcapp"; }];
  };

  # ── Dev container integration ────────────────────────────────────
  devcontainer.enable = true;

  # ── Environment variables from .env ─────────────────────────────
  dotenv.enable = true;
  dotenv.filename = ".env";

  # ── Shell initialisation ─────────────────────────────────────────
  enterShell = ''
    echo "mcapp-ai-starter devenv ready"
    echo "  node: $(node --version)"
    echo "  bun:  $(bun --version)"
    echo "  pg:   localhost:${toString config.services.postgres.port}"
  '';
}
```

**cachix binary cache setup:**

```bash
# One-time: install cachix and add the devenv cache
nix-env -iA cachix -f https://cachix.org/api/v1/install
cachix use devenv
```

Add to `.devcontainer/post-create.sh` (Phase 2 section, guarded by `command -v nix`):

```bash
if command -v nix &>/dev/null && command -v cachix &>/dev/null; then
  cachix use devenv
fi
```

---

## Data Flow Diagrams

### Renovate update cycle

```
npm registry / GitHub  →  Renovate Bot (daily cron)
                          ↓
                     Reads renovate.json
                          ↓
               Scans package.json, devcontainer.json
                          ↓
               ┌──────────────────────┐
               │  New version found?  │
               └─────────┬────────────┘
                 Yes      │       No → exit 0
                          ▼
               Opens/updates PR on GitHub
                          ↓
               CI checks run (npm test, npm run build)
                          ↓
               ┌──────────────────────┐
               │  major update?       │
               └─────────┬────────────┘
               Yes: await │ human review
               No: automerge via GitHub API
```

### Build pipeline (Bun path)

```
Developer: npm run build
           ↓
   scripts/detect-bun.mjs  →  exit 0 (bun found)
           ↓
   bun run build.bun.ts
           ↓
   Bun reads tsconfig.json + entry points
           ↓
   Parallel bundling of src/ + examples/*
           ↓
   dist/ artefacts written
```

---

## Error Handling Matrix

| Error | Trigger | Response |
|---|---|---|
| `RENOVATE_TOKEN` missing | GitHub Actions workflow | Job fails with clear message; no PRs are opened; no silent drift |
| Automerge causes test failure | CI failure on Renovate PR | automerge blocked; PR flagged for human review |
| Bun not installed | `npm run build` on system without Bun | `detect-bun.mjs` exits 1; pipeline falls back to `build-esbuild.mjs`; no error message to user beyond normal output |
| `devenv.nix` Nix eval error | `devenv shell` | Nix prints clear eval error with line number; contributor fixes `devenv.nix` |
| cachix not configured | `devenv shell` first run | Nix compiles from source (slow but correct); warning logged |
| `.env` missing | `devenv shell` or any npm script | `dotenv` warns; scripts that require env vars fail fast with clear `Missing env var` message |

---

## Unit Testing Strategy

| Component | What to test | How |
|---|---|---|
| `scripts/detect-bun.mjs` | Exits 0 when bun is on PATH, exits 1 otherwise | Jest/node test with PATH manipulation |
| `build.bun.ts` | Produces `dist/src/app.js` with correct exports | `npm test` artefact check |
| `renovate.json` | Valid JSON; schema matches `renovate-schema.json` | `npx renovate-config-validator` |
| `devenv.nix` (Phase 2) | Nix evaluates without errors | `devenv test` in CI |

---

## Interface Contracts

### `scripts/detect-bun.mjs`

```js
// Input: none (reads process.env.PATH)
// Output: process.exit(0) if `bun` resolves on PATH, process.exit(1) otherwise
// Side effects: none
```

### `.github/workflows/renovate.yml` secrets

| Secret name | Scope | Required |
|---|---|---|
| `RENOVATE_TOKEN` | `contents:write, pull-requests:write` | ✅ Phase 1 |

### `devenv.nix` public interface (Phase 2)

- `services.postgres.port` — exposed as `$PGPORT` shell variable
- `services.postgres.initialDatabases[0].name` — matches `POSTGRES_DB` in `.env`
