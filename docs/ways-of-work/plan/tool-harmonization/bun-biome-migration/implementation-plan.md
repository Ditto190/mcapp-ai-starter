# Implementation Plan — Phase 2b: Tool Harmonization (Bun + Biome Migration)

**Epic:** `tool-harmonization`  
**Feature:** `bun-biome-migration`  
**Date:** 2026-05-05  
**Parallel track:** Runs in parallel with Phase 2c (no blocking dependencies)

---

## Goal

Harmonize the foam-modme workspace to a consistent, Turborepo-ready toolchain before Phase 2c workspaces are scaffolded. The migration replaces `npm` with `bun` as the workspace package manager, adopts Biome 2 as the single linter/formatter across all packages, pins the Node.js version to `20` via `.node-version`, repairs the broken `devenv.nix` package references inherited from older nixpkgs, and introduces a shared TypeScript base configuration. This establishes the clean toolchain foundation that Phase 2c depends on — ensuring every new workspace package created in Phase 2c already inherits the correct tools from root.

---

## Requirements

### Bun Migration

- Add `packageManager: "bun@1.3.13"` field to root `package.json` — signals intent to tooling and prevents accidental npm/yarn use
- Remove `package-lock.json` from root (npm lockfile) and generate `bun.lockb` via `bun install`
- Add `.npmrc` at workspace root: `public-hoist-pattern[]=*` — ensures Biome and shared configs are hoisted correctly
- Add `bun.lockb` to `.gitignore` alternatives (bun lockfile is binary — do not commit unless intentional)
- Update any scripts in existing `package.json` that call `npm run` → `bun run`
- Check all sub-package `package.json` files for `npm` references → update to `bun`
- **Scope:** root + `knowledge-platform/` + `examples/adam-server/` + any packages with `package.json`

### Biome 2 Adoption via Ultracite v5

- A `biome.json` already exists at `foam-modme/` root — it will be replaced by Ultracite-generated `biome.jsonc`
- `knowledge-platform/` currently uses ESLint + Prettier — replace both with Biome via Ultracite
- `examples/adam-server/` uses TypeScript only (no explicit linter in package.json) — add Biome via Ultracite
- **Initialize Ultracite at workspace root:** run `bun x ultracite@latest init` — interactively select: linter (Biome), frameworks (Next.js, React), editors (VSCode), agents (GitHub Copilot, Claude). Ultracite generates `biome.jsonc` with production-grade defaults used by OpenAI, Vercel, Adobe, Clerk, ElevenLabs, and Sentry.
- Each workspace package's `biome.json` extends the root `biome.jsonc` via a relative path (e.g. `{ "extends": ["../../../biome.jsonc"] }`). No need to maintain a custom `packages/biome-config/` package.
- Ultracite also generates agent rule files (`.github/copilot-instructions.md`, etc.) — review and **merge** with existing `.github/` agent files; do not blindly overwrite.
- Enable Biome's `recommended` ruleset + `organizeImports` (Ultracite includes these by default)
- Migrate any ESLint-specific rules that have Biome equivalents (document those without equivalents)
- Add `lint`, `format`, and `check` scripts to root `package.json` that delegate to `bun biome`
- Remove `eslint`, `eslint-config-*`, `prettier`, `.prettierrc*`, `.eslintrc*`, `.eslintignore` from all packages that adopt Biome

### Syncpack v15 Integration

- Install Syncpack: `bun add -d syncpack@^15` at workspace root
- Create `.syncpackrc.json` at root:

  ```json
  {
    "versionGroups": [
      {
        "label": "Local packages",
        "packages": ["**"],
        "dependencies": ["@foam/*"],
        "pinVersion": "workspace:*"
      }
    ]
  }
  ```

- Add root scripts: `"deps:lint": "syncpack lint"`, `"deps:fix": "syncpack fix"`, `"deps:list": "syncpack list"`
- Add `turbo` pipeline task `deps:lint` — runs as part of CI validation
- Run `syncpack lint` in CI to detect version mismatches before merge
- Run `syncpack fix` to auto-resolve mismatches during dependency updates
- Supports bun catalogs: if using bun's `catalog:` protocol in workspaces, Syncpack can validate catalog entries too

### devenv.nix Repairs

- Audit `devenv.nix` (project root and `knowledge-platform/devenv.nix` if present)
- Remove any remaining `nodePackages.npm` or `nodePackages.yarn` references — these attributes no longer exist in current nixpkgs (removed namespace)
- Correct replacement: use `nodejs_20` (bundles npm) + top-level `yarn` (not from `nodePackages`) + `bun`
- Add `podman-compose` to devenv packages (required by Phase 2c)
- Add `json-schema-for-humans` Python tool to devenv shell if possible (or document pip-install fallback)
- Validate repair: `devenv shell -- true` must complete without error after changes
- Pin devenv itself to a known-good version in `devenv.yaml` if not already pinned

### Node.js Version Pinning

- Add `.node-version` file at `foam-modme/` root with content `20`
- `fnm` (already configured in `.zshrc`) reads `.node-version` and auto-switches on `cd`
- Add `.node-version` to any app sub-directories that need isolated version control
- Document in `DEVENV-SETUP.md` that Node 20 is the pinned LTS (update if this file exists)

### TypeScript Config Sharing

- Create `packages/tsconfig/` with name `@foam/tsconfig`
- Provide base configs:
  - `base.json` — strict TypeScript baseline (`strict: true`, `exactOptionalPropertyTypes: true`, `moduleResolution: bundler`)
  - `nextjs.json` — extends `base.json` + Next.js specific settings
  - `bun-app.json` — extends `base.json` + Bun/Node settings (`module: ESNext`, `target: ES2022`)
- Each workspace package's `tsconfig.json` should `extends: "@foam/tsconfig/base.json"` (or variant)
- Knowledge-platform's existing `tsconfig.json` → update to extend `@foam/tsconfig/base.json` where compatible (Wasp generates its own tsconfig; extend only the user-visible portions)

---

## Technical Considerations

### System Architecture Overview

```mermaid
graph TB
    subgraph FE["Workspace Root — foam-modme/"]
        PJ[package.json\nbun@1.3.13, workspaces]
        BL[bun.lockb]
        BJ[biome.jsonc\nUltracite-generated\nproduction-grade defaults]
        TJ[turbo.json\n$schema, pipelines]
        NV[.node-version\n20]
        NX[devenv.nix\n+ podman-compose\n+ nodejs_20]
        UC[Ultracite\nbun x ultracite@latest init\nGenerates biome.jsonc]
        SRC[.syncpackrc.json]
    end

    subgraph PKG["Shared Packages"]
        TC["packages/tsconfig/\n@foam/tsconfig\nbase.json / nextjs.json / bun-app.json"]
    end

    subgraph APPS["Existing Packages — updated"]
        KP["knowledge-platform/\nRemoves: ESLint, Prettier\nAdds: biome.json extends root biome.jsonc\ntsconfig extends @foam/tsconfig/nextjs.json"]
        AS["examples/adam-server/\nAdds: biome.json extends root biome.jsonc\ntsconfig extends @foam/tsconfig/bun-app.json"]
    end

    subgraph CI["CI / Turbo Pipeline"]
        TL[turbo run lint]
        TF[turbo run format:check]
        TTC[turbo run typecheck]
        SP[syncpack v15\ndeps:lint / deps:fix]
    end

    UC --> BJ
    PJ -->|workspace protocol| TC
    BJ -->|extends| KP & AS
    TC -->|extends| KP & AS
    TJ --> TL & TF & TTC
    SRC --> SP
    NX -->|validated by| NV
```

**Technology Stack Rationale:**

| Tool | Choice | Rationale |
|---|---|---|
| Package manager | Bun 1.3.13 | Turborepo workspace policy (AGENTS.md); 5–100× faster than npm installs; single runtime for scripts + tests |
| Linter/formatter | Biome 2 via Ultracite | Ultracite v5 is a zero-config Biome preset layer; production-grade defaults used by OpenAI, Vercel, Clerk; generates AI agent rule files; eliminates need to maintain custom `@foam/biome-config` package |
| Dep version sync | Syncpack v15 | Rust-core (73% Rust), ~100× faster than npm-check-updates; bun catalog support; used by AWS, Cloudflare, Microsoft FluentUI; lint mismatches in CI before merge |
| TypeScript base | Strict `bundler` moduleResolution | Turborepo/Bun ecosystem standard; avoids `node16` quirks with `.js` extensions |
| Node version | 20 LTS | Stable, LTS; Bun 1.x targets Node 20 compatibility layer |
| devenv.nix | Nix DevEnv | Reproducible developer environments; WSL-native (already used in project) |

### Database Schema Design

_Not applicable for Phase 2b — this phase is toolchain-only; no database changes._

### API Design

_Not applicable for Phase 2b — this phase is toolchain-only; no API changes._

### Frontend Architecture

_Not applicable for Phase 2b — this phase is toolchain-only. Existing frontend code is linted/formatted but not architecturally changed._

#### Biome Rule Migration Map

```
ESLint rule                        → Biome equivalent
------------------------------------------------------
no-unused-vars                     → noUnusedVariables
no-console                         → noConsole (or disable for server code)
prefer-const                       → useConst
no-var                             → noVar
eqeqeq                             → noDoubleEquals
no-trailing-spaces (Prettier)      → Biome format: trailingCommas
semi (Prettier)                    → Biome format: semicolons
printWidth (Prettier)              → Biome format: lineWidth: 100
tabWidth: 2 (Prettier)             → Biome format: indentWidth: 2
singleQuote: true (Prettier)       → Biome format: quoteStyle: "single"

No Biome equivalent (document only):
--------------------------------------
@typescript-eslint/no-explicit-any  → no-explicit-any: use Biome's noExplicitAny (since Biome 1.6)
eslint-plugin-import/* rules        → partially covered by Biome organizeImports
```

#### Shared Biome Config Structure

```
packages/biome-config/
├── biome.json          ← extends "biome:recommended", sets project-wide rules
└── package.json        ← name: "@foam/biome-config", version: "1.0.0"
```

`biome.json` base rules (pseudocode):

```json
{
  "extends": ["biome:recommended"],
  "organizeImports": { "enabled": true },
  "formatter": {
    "lineWidth": 100,
    "indentWidth": 2,
    "indentStyle": "space"
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "trailingCommas": "all",
      "semicolons": "asNeeded"
    }
  },
  "linter": {
    "rules": {
      "correctness": { "noUnusedVariables": "error" },
      "style": { "useConst": "error", "noVar": "error" }
    }
  }
}
```

### Security Performance

**No security surface changes in Phase 2b.** This phase is purely developer tooling.

**Biome security linting (bonus):**

- Biome's `nursery.noSecrets` rule (experimental) — can detect accidental secret commits
- Consider enabling `security.noGlobalEval` and `security.noGlobalIsFinite` in shared config

**Performance impact:**

- Bun install: 5–100× faster than npm install across CI and local dev
- Biome format/lint: ~100× faster than ESLint + Prettier (sub-second on full codebase)
- Turbo caches `lint`, `format:check`, `typecheck` outputs — incremental checks only re-run on changed files
- `devenv shell` repair reduces CI rebuild time (eliminates `nodePackages has been removed` error that currently breaks env activation)

---

## Implementation Tasks (APM Stage Mapping)

| APM Task | Title | Dependencies | Complexity |
|---|---|---|---|
| 2b.0 | devenv.nix repair (`nodePackages` references) | None | XS |
| 2b.1 | `.node-version` file + fnm validation | 2b.0 | XS |
| 2b.2 | Initialize Ultracite via `bun x ultracite@latest init` | None | S |
| 2b.3 | Create `packages/tsconfig/` (@foam/tsconfig) | None | S |
| 2b.4 | Root `package.json`: add bun, workspaces, scripts | 2b.2, 2b.3 | S |
| 2b.5 | Remove `package-lock.json`, generate `bun.lockb` | 2b.4 | S |
| 2b.6 | Migrate `knowledge-platform/` to Biome (remove ESLint/Prettier) | 2b.2 | S |
| 2b.7 | Add Biome to `examples/adam-server/` | 2b.2 | XS |
| 2b.8 | Add Turbo lint/format/typecheck pipeline tasks | 2b.2, 2b.3, 2b.4 | S |
| 2b.9 | Install Syncpack v15 + `.syncpackrc.json` + CI task | 2b.4 | XS |

**Parallel execution:** 2b.2 (Ultracite init) can run independently. 2b.3 can also run independently. 2b.9 depends on 2b.4 (root `package.json` in place). 2b.0 and 2b.1 are pre-conditions that should complete first.  
**Phase 2b milestone:** `bun install` runs cleanly at root; `turbo run lint` passes with zero errors across all packages; `devenv shell -- true` exits 0; `syncpack lint` reports no version mismatches.

---

## Constraints

- **Do not touch `knowledge-platform/` Wasp-generated files** — only modify `package.json`, `tsconfig.json`, and add/remove linter configs. Do not change Wasp source files.
- **Do not modify `docs/publishing/`** — hard constraint across all phases.
- **Keep ESLint temporarily** in knowledge-platform until Biome parity is confirmed — migration should not break the existing CI/lint pass.
- **Bun lockfile binary** — `bun.lockb` is binary; do not commit if repo policy requires text lockfiles. Check `.gitignore` first.
- **Ultracite-generated agent rule files** — `bun x ultracite@latest init` may generate `.github/copilot-instructions.md` and similar agent rule files. Review these and **merge** with existing `.github/` agent files; do not blindly overwrite existing instructions.

---

## Rejected Alternatives

- **Keep npm** — npm conflicts with Turborepo workspace protocol and is 10–100× slower. Bun is the explicit toolchain policy in AGENTS.md.
- **Migrate to Biome 1.x syntax** — Project should adopt Biome 2 directly since that is the current stable version. No regression path needed.
- **ESLint + Prettier retention** — Two tools with frequent version conflict issues. Biome replaces both without config merge problems.
- **pnpm** — Explicitly rejected in AGENTS.md and AGENTS toolchain policy. Bun is the designated manager.
- **Build custom `@foam/biome-config` package** — Valid but high maintenance. Ultracite v5 provides production-grade Biome config used by major orgs (OpenAI, Vercel, Clerk) with zero ongoing maintenance. Preferred over a hand-rolled config package.
