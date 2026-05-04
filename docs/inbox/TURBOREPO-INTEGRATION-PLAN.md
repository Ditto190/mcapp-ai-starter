---
goal: Turborepo v2.8 Expert Integration — Optimize ~/projects/turbo-lab/ Monorepo for Production-Grade Performance, Caching, and Microfrontend Orchestration
version: 2.0
date_created: 2026-05-04
owner: Turborepo Optimization Team
status: 'Planned'
tags: [turborepo, build-optimization, microfrontends, remote-caching, ci-cd, performance]
---

# TURBOREPO INTEGRATION PLAN v2.0
## Expert Review & Optimization Strategy

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

This plan is a **Turborepo v2.8 expert review** of the existing monorepo at `/home/wsl-vm/projects/turbo-lab/`. Based on analysis of the current setup, this plan identifies gaps, optimizations, and production-readiness improvements.

---

## Executive Summary: Current State Analysis

### ✅ What's Working Well
- **Correct workspace structure**: 3 apps (web, docs, vite) + 3 shared packages (ui, eslint-config, typescript-config)
- **Bun integration**: Package manager set to `bun@1.3.13` (excellent)
- **Turborepo version**: v2.9.8 (latest stable, excellent)
- **Task definitions**: Basic `build`, `lint`, `check-types`, `dev` tasks configured
- **Dependency protocol**: Using `@repo/*` workspace protocol correctly
- **No circular dependencies**: Vite app doesn't import shared packages (good isolation)

### 🔴 Critical Issues Found
1. **No build script in eslint-config & typescript-config** — These are config packages but turbo expects a build command (NONEXISTENT error)
2. **Cache outputs misconfigured** — Tasks output `.next/**` but vite app outputs `dist/`; needs per-package configuration
3. **No outputs for config packages** — Should declare their outputs to avoid cache misses
4. **Missing task: test** — No test task in turbo.json despite test setup likely existing
5. **No remote caching configured** — Missing Vercel integration, S3 fallback, or other cache backend
6. **dev task not isolated** — All apps try to start on same port; needs `turbo get-mfe-port` logic
7. **No workspace filtering examples** — CI/CD doesn't use `--affected` for incremental builds
8. **Missing inputs validation** — Tasks don't declare which files trigger rebuilds

### 🟡 Medium-Priority Gaps
- No `--dry-run` or `--graph` documentation for developers
- No caching strategy document (when to use cache vs. persistent tasks)
- Missing boundary rules to enforce architecture constraints
- No performance baseline measurements (build time, cache hit rate)
- No CI/CD pipeline configured (GitHub Actions, etc.)
- Unused `"ui": "tui"` in turbo.json (legacy, can remove)

---

## 1. Requirements & Constraints (Turborepo Perspective)

### Core Turborepo Requirements
- **REQ-TURBO-001**: Fix eslint-config & typescript-config to have valid build scripts or mark as cache: false
- **REQ-TURBO-002**: Segregate task outputs by package type (Next.js apps → `.next/`, Vite apps → `dist/`, config packages → configurable)
- **REQ-TURBO-003**: Implement remote caching (Vercel or S3-backed)
- **REQ-TURBO-004**: Add test task to turbo.json pipeline
- **REQ-TURBO-005**: Configure CI/CD with `--affected` flag for incremental builds
- **REQ-TURBO-006**: Establish performance baselines and monitoring
- **REQ-TURBO-007**: Implement Turborepo 2.8+ features: boundary rules, composable config, devtools
- **REQ-TURBO-008**: Document MFE (microfrontend) orchestration patterns

### Constraints
- **CON-TURBO-001**: All tasks must be cacheable or explicitly marked `cache: false`
- **CON-TURBO-002**: Outputs must be deterministic (same inputs = same outputs)
- **CON-TURBO-003**: Dependencies must be acyclic in task graph
- **CON-TURBO-004**: Package manager must remain Bun (constraint from mono-dev rules)
- **CON-TURBO-005**: Node.js >= 18 (constraint from workspace)

### Guiding Principles (v2.8 Best Practices)
- **GUD-TURBO-001**: Use content-aware hashing — only rebuild when files actually change
- **GUD-TURBO-002**: Declare all outputs explicitly — missing outputs = cache misses
- **GUD-TURBO-003**: Use `--affected` in CI — incremental builds save minutes
- **GUD-TURBO-004**: Separate build from dev — dev tasks should have `cache: false` and `persistent: true`
- **GUD-TURBO-005**: Use composable config (v2.7+) — extend turbo.json from shared packages
- **GUD-TURBO-006**: Monitor build time and cache hit rate — use `turbo devtools` and `turbo docs`
- **GUD-TURBO-007**: Enforce architecture with boundaries — prevent shared packages from importing apps
- **GUD-TURBO-008**: Use turbo prune for deployments — generate minimal monorepo for single-app deploy

---

## 2. Implementation Phases

### Phase 1: Fix Critical Configuration Issues (TASK-T001 to TASK-T010)

**GOAL-TURBO-001**: Resolve NONEXISTENT build commands and ensure all tasks are executable

| Task ID | Task | Description | Priority | Status |
|---------|------|-------------|----------|--------|
| TASK-T001 | Fix eslint-config build | Add `build` script to `packages/eslint-config/package.json` (or mark cache: false in turbo.json) | CRITICAL | Pending |
| TASK-T002 | Fix typescript-config build | Add `build` script to `packages/typescript-config/package.json` (or mark cache: false) | CRITICAL | Pending |
| TASK-T003 | Verify config package outputs | Document what these packages output (if anything) to file system | CRITICAL | Pending |
| TASK-T004 | Remove legacy ui setting | Delete `"ui": "tui"` from turbo.json (v1 legacy, not used in v2) | LOW | Pending |
| TASK-T005 | Add test task | Create `test` task in turbo.json with appropriate dependencies | MEDIUM | Pending |
| TASK-T006 | Audit dev scripts | Document how `turbo get-mfe-port` works and ensure no port conflicts | MEDIUM | Pending |
| TASK-T007 | Verify all lint scripts | Ensure `lint` task in turbo.json matches all apps' lint scripts | MEDIUM | Pending |
| TASK-T008 | Validate tsconfig tasks | Ensure `check-types` task works for TypeScript-enabled apps only | MEDIUM | Pending |
| TASK-T009 | Document task dependencies | Create a graph showing task execution order (build → lint → test, etc.) | LOW | Pending |
| TASK-T010 | Test dry-run | Run `turbo build --dry-run` and verify no errors in task graph | CRITICAL | Pending |

**Success Criteria**:
- ✅ `turbo build --dry-run` executes without NONEXISTENT command errors
- ✅ All 6 packages can be built without failures
- ✅ Task dependency graph is acyclic
- ✅ No deprecated v1 config in turbo.json

---

### Phase 2: Optimize Caching & Outputs (TASK-T011 to TASK-T020)

**GOAL-TURBO-002**: Maximize cache hit rate and ensure outputs are properly declared

| Task ID | Task | Description | Priority | Status |
|---------|------|-------------|----------|--------|
| TASK-T011 | Segregate Next.js outputs | Next.js apps should output `.next/**` (currently correct) | HIGH | Pending |
| TASK-T012 | Segregate Vite outputs | Vite app (admin) should output `dist/**` not `.next/**` | HIGH | Pending |
| TASK-T013 | Audit inputs for build | Review `inputs: ["$TURBO_DEFAULT$", ".env*"]` — add package-specific inputs if needed | MEDIUM | Pending |
| TASK-T014 | Add lint outputs | Lint task should output nothing or minimal files (e.g., lint report) | LOW | Pending |
| TASK-T015 | Test output caching | Build, modify source, rebuild — verify cache HIT on second build | HIGH | Pending |
| TASK-T016 | Measure cache hit rate | Baseline: clean build, then cached build — record cache hit %, build time | HIGH | Pending |
| TASK-T017 | Document env var impact | Document which env vars affect task hashing (NODE_ENV, DATABASE_URL, etc.) | MEDIUM | Pending |
| TASK-T018 | Add persistent task config | Ensure `dev` task has `persistent: true` and `cache: false` | MEDIUM | Pending |
| TASK-T019 | Test incremental builds | Modify one file, run `turbo build --filter=web` — verify only web is rebuilt | HIGH | Pending |
| TASK-T020 | Profile task execution | Measure which tasks are slowest; identify parallelization bottlenecks | HIGH | Pending |

**Success Criteria**:
- ✅ Cache hit rate > 80% on unchanged builds
- ✅ Incremental builds (with `--filter`) take < 5 seconds for unaffected apps
- ✅ All outputs properly declared in turbo.json
- ✅ No false cache invalidations (e.g., from .gitignore-d files)

---

### Phase 3: Remote Caching & CI/CD Integration (TASK-T021 to TASK-T030)

**GOAL-TURBO-003**: Enable cache sharing across machines and optimize CI/CD pipelines

| Task ID | Task | Description | Priority | Status |
|---------|------|-------------|----------|--------|
| TASK-T021 | Set up Vercel remote cache | Link workspace to Vercel team; configure `TURBO_TOKEN` and `TURBO_TEAM` env vars | HIGH | Pending |
| TASK-T022 | GitHub Actions template | Create workflow with `turbo build --affected` for incremental CI | HIGH | Pending |
| TASK-T023 | Cache warming script | Create script to pre-warm remote cache after dependency updates | MEDIUM | Pending |
| TASK-T024 | Test remote cache hit | Commit change, run CI twice on same machine — verify second is faster | HIGH | Pending |
| TASK-T025 | Document cache invalidation | When does remote cache miss (dep updates, breaking changes, etc.)? | MEDIUM | Pending |
| TASK-T026 | Add --affected filter | Use `turbo build test lint --affected` in CI for PR validation | HIGH | Pending |
| TASK-T027 | Prune for deployment | Test `turbo prune --scope=web --docker` for single-app deployment | MEDIUM | Pending |
| TASK-T028 | Set up fail-safe | If remote cache is unavailable, fall back to local cache gracefully | MEDIUM | Pending |
| TASK-T029 | Monitor cache metrics | Track cache hit rate, upload speed, and latency over time | LOW | Pending |
| TASK-T030 | Parallel deploy matrix | Create matrix job for deploying multiple apps in parallel | MEDIUM | Pending |

**Success Criteria**:
- ✅ Remote cache configured and working
- ✅ CI/CD pipeline uses `--affected` for incremental builds
- ✅ Single-app deployment with `turbo prune` works
- ✅ Cache hit rate > 70% on CI after warming

---

### Phase 4: Turborepo 2.8+ Advanced Features (TASK-T031 to TASK-T040)

**GOAL-TURBO-004**: Leverage v2.8 features for production excellence

| Task ID | Task | Description | Priority | Status |
|---------|------|-------------|----------|--------|
| TASK-T031 | Set up boundary rules | Define `boundaries` in turbo.json to enforce app/shared separation | MEDIUM | Pending |
| TASK-T032 | Validate boundaries | Run `turbo boundaries` to detect violations | MEDIUM | Pending |
| TASK-T033 | Composable config | Create `packages/config/turbo.json` extending root config (v2.7+) | LOW | Pending |
| TASK-T034 | Set up devtools | Test `turbo devtools` for interactive graph visualization | LOW | Pending |
| TASK-T035 | Enable git worktree caching | Test cache sharing across git worktrees (v2.8+ feature) | LOW | Pending |
| TASK-T036 | Use turbo docs | Run `turbo docs` to fetch AI-friendly documentation | LOW | Pending |
| TASK-T037 | Monorepo watching | Test `turbo watch` mode for fast development iteration | MEDIUM | Pending |
| TASK-T038 | Task filtering by tag | Tag packages and use `--filter` with package tags | LOW | Pending |
| TASK-T039 | Dry-run JSON | Use `turbo build --dry-run=json` for programmatic task introspection | LOW | Pending |
| TASK-T040 | Graph visualization | Generate `turbo build --graph=graph.html` for documentation | LOW | Pending |

**Success Criteria**:
- ✅ Boundary rules enforced via `turbo boundaries` in CI
- ✅ `turbo devtools` accessible and useful for developers
- ✅ Task filtering via tags working correctly

---

### Phase 5: Microfrontend Orchestration (TASK-T041 to TASK-T050)

**GOAL-TURBO-005**: Optimize for MFE architecture with independent app deploys

| Task ID | Task | Description | Priority | Status |
|---------|------|-------------|----------|--------|
| TASK-T041 | Document MFE structure | Map which apps are MFEs (web, admin/vite) and which are shells/docs | MEDIUM | Pending |
| TASK-T042 | Independent build filters | Create runbook: `turbo build --filter=web`, `turbo build --filter=admin` | HIGH | Pending |
| TASK-T043 | Shared deps versioning | Document strategy for keeping React, TypeScript versions consistent across MFEs | MEDIUM | Pending |
| TASK-T044 | Port management | Document `turbo get-mfe-port` mechanism and prevent port conflicts on `turbo dev` | HIGH | Pending |
| TASK-T045 | Module federation config | If using Webpack/Next.js module federation, document turbo integration | MEDIUM | Pending |
| TASK-T046 | Prune per-app | Test `turbo prune --scope=web` and `turbo prune --scope=admin` separately | HIGH | Pending |
| TASK-T047 | Deploy manifesto | Create manifest listing which apps can be deployed independently | LOW | Pending |
| TASK-T048 | Dependency mapping | Document which shared packages each MFE imports | MEDIUM | Pending |
| TASK-T049 | Version-skew testing | Test that each app builds correctly with different versions of shared packages | MEDIUM | Pending |
| TASK-T050 | MFE test matrix | Create CI matrix job testing each app independently | MEDIUM | Pending |

**Success Criteria**:
- ✅ Each app (web, admin, docs) can be deployed independently
- ✅ Shared package changes don't block individual app deploys
- ✅ Port conflicts resolved on `turbo dev`
- ✅ `turbo prune` produces correct lockfiles per app

---

### Phase 6: Performance Monitoring & Documentation (TASK-T051 to TASK-T060)

**GOAL-TURBO-006**: Establish baselines and create runnable documentation

| Task ID | Task | Description | Priority | Status |
|---------|------|-------------|----------|--------|
| TASK-T051 | Baseline clean build | Measure time for `turbo build` from scratch (no cache) | HIGH | Pending |
| TASK-T052 | Baseline cached build | Measure time for `turbo build` with warm cache | HIGH | Pending |
| TASK-T053 | Baseline per-app build | Measure `turbo build --filter=web`, `--filter=admin`, `--filter=docs` | MEDIUM | Pending |
| TASK-T054 | Cache hit baseline | Run same build twice, record % of tasks from cache | HIGH | Pending |
| TASK-T055 | Dev server startup time | Measure `turbo dev` time to first app ready | MEDIUM | Pending |
| TASK-T056 | Install runbook | Document `bun install` in workspace (should use Bun workspaces) | HIGH | Pending |
| TASK-T057 | Build runbook | Document `bunx turbo build` for all, single app, with filters | HIGH | Pending |
| TASK-T058 | Dev runbook | Document `bunx turbo dev` with port conflict resolution | HIGH | Pending |
| TASK-T059 | Troubleshooting guide | Debug slow builds, cache misses, NONEXISTENT errors | MEDIUM | Pending |
| TASK-T060 | CI/CD runbook | Document GitHub Actions workflow with caching and incremental builds | HIGH | Pending |

**Success Criteria**:
- ✅ Build time baselines documented and tracked
- ✅ All runbooks tested and executable by new team members
- ✅ Troubleshooting guide resolves 80% of common issues
- ✅ CI/CD workflow is production-ready

---

## 3. Detailed Fixes Required

### 3.1: Config Package Build Scripts

**Current Problem**: `packages/eslint-config` and `packages/typescript-config` don't have `build` scripts.

**Solution A** (Preferred): Add minimal build scripts:
```json
{
  "name": "@repo/eslint-config",
  "scripts": {
    "build": "echo 'Config package built'",
    "check-types": "tsc --noEmit"
  }
}
```

**Solution B**: Mark as cache: false in turbo.json:
```json
{
  "tasks": {
    "build": {
      "@repo/eslint-config": { "cache": false },
      "@repo/typescript-config": { "cache": false }
    }
  }
}
```

**Recommendation**: Use Solution A for clarity.

---

### 3.2: Output Segregation

**Current Problem**: All tasks output `.next/**` and `dist/**`, but Vite app outputs only `dist/`.

**Solution**: Add package-specific outputs in turbo.json:
```json
{
  "$schema": "https://turborepo.dev/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"]
    },
    "build": {
      "web": {
        "outputs": [".next/**", "!.next/cache/**"]
      },
      "docs": {
        "outputs": [".next/**", "!.next/cache/**"]
      },
      "admin": {
        "outputs": ["dist/**"]
      }
    }
  }
}
```

---

### 3.3: Add Test Task

```json
{
  "tasks": {
    "test": {
      "dependsOn": ["build"],
      "cache": true,
      "outputs": ["coverage/**", "test-results/**"]
    }
  }
}
```

---

### 3.4: Remote Caching Setup

```bash
# Link to Vercel
bunx turbo login
bunx turbo link

# Set env vars in CI
TURBO_TOKEN=<your-vercel-token>
TURBO_TEAM=<your-team-slug>
```

---

## 4. Recommended turbo.json (v2.8 Best Practices)

```json
{
  "$schema": "https://turborepo.dev/schema.json",
  "globalDependencies": [".env*"],
  "globalEnv": ["CI", "NODE_ENV"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"],
      "inputs": ["src/**", "package.json", "tsconfig.json", "next.config.*", "vite.config.*"],
      "env": ["NODE_ENV"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**", "test-results/**"],
      "cache": true
    },
    "lint": {
      "dependsOn": ["^lint"],
      "outputs": []
    },
    "check-types": {
      "dependsOn": ["^check-types"],
      "cache": true
    },
    "dev": {
      "cache": false,
      "persistent": true,
      "interactive": true
    },
    "generate:component": {
      "cache": false
    },
    "boundaries": {
      "cache": false
    }
  },
  "boundaries": {
    "tags": {
      "apps/*": ["app"],
      "packages/ui": ["shared", "ui"],
      "packages/eslint-config": ["config"],
      "packages/typescript-config": ["config"]
    },
    "rules": [
      {
        "from": ["app"],
        "allow": ["shared", "config"]
      },
      {
        "from": ["shared", "config"],
        "deny": ["app"]
      }
    ]
  }
}
```

---

## 5. GitHub Actions CI/CD Template

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest
      
      - run: bun install --frozen-lockfile
      
      - name: Lint (affected)
        run: bunx turbo lint --affected
      
      - name: Build (affected)
        run: bunx turbo build --affected
        env:
          TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
          TURBO_TEAM: ${{ secrets.TURBO_TEAM }}
      
      - name: Test (affected)
        run: bunx turbo test --affected
      
      - name: Check types (affected)
        run: bunx turbo check-types --affected
      
      - name: Boundaries
        run: bunx turbo boundaries

  deploy-web:
    needs: lint-build-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install --frozen-lockfile
      - run: bunx turbo build --filter=web
        env:
          TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
          TURBO_TEAM: ${{ secrets.TURBO_TEAM }}
      - name: Deploy web to Vercel
        run: bunx vercel deploy apps/web --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}

  deploy-admin:
    needs: lint-build-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install --frozen-lockfile
      - run: bunx turbo build --filter=admin
        env:
          TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
          TURBO_TEAM: ${{ secrets.TURBO_TEAM }}
      - name: Deploy admin to Vercel
        run: bunx vercel deploy apps/vite --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

---

## 6. Risks & Mitigation

| Risk | Severity | Mitigation |
|------|----------|-----------|
| NONEXISTENT build commands break CI | CRITICAL | Fix config package scripts immediately |
| Cache misses due to missing outputs | HIGH | Audit and declare all outputs |
| Port conflicts on `turbo dev` | HIGH | Ensure `turbo get-mfe-port` works correctly |
| Cache invalidation on unrelated changes | MEDIUM | Review inputs declaration, globalDependencies |
| Remote cache not warming | MEDIUM | Monitor cache hit rate, pre-warm on schedule |
| Breaking changes from Turborepo upgrades | LOW | Lock version, test upgrade path before applying |

---

## 7. Success Metrics

| Metric | Target | Baseline | Current |
|--------|--------|----------|---------|
| Clean build time | < 5 min | TBD | TBD |
| Cached build time | < 30 sec | TBD | TBD |
| Cache hit rate | > 80% | TBD | TBD |
| CI build time (affected) | < 3 min | TBD | TBD |
| Task execution errors | 0 | 3 (NONEXISTENT) | Pending |
| Remote cache enabled | Yes | No | Pending |

---

## 8. Quick Reference: Turborepo Commands

```bash
# Build & test
bunx turbo build                          # All packages
bunx turbo build --filter=web             # Single app
bunx turbo build --affected               # Only changed packages
bunx turbo test --affected
bunx turbo lint
bunx turbo check-types

# Monitoring
bunx turbo build --dry-run                # See what would execute
bunx turbo build --dry-run=json           # JSON output
bunx turbo build --graph=graph.html       # Visualize task graph
bunx turbo devtools                       # Interactive graph explorer
bunx turbo ls                              # List all packages
bunx turbo ls --affected                  # List changed packages

# Development
bunx turbo dev                            # Start all dev servers
bunx turbo watch build                    # Re-run on changes

# Deployment
bunx turbo prune --scope=web --docker     # Create minimal image
bunx turbo boundaries                     # Check architecture rules

# Cache management
bunx turbo login                          # Login to Vercel
bunx turbo link                           # Link to team
rm -rf .turbo && bunx turbo build         # Clear local cache
```

---

## 9. Acceptance Criteria (Definition of Done)

- ✅ All 6 packages build successfully (`turbo build` → 0 errors)
- ✅ Cache hit rate > 80% on unchanged builds
- ✅ Remote caching configured and working
- ✅ CI/CD uses `--affected` for incremental builds
- ✅ All dev servers start without port conflicts on `turbo dev`
- ✅ Boundary rules enforced
- ✅ Performance baselines established
- ✅ All runbooks documented and tested
- ✅ No NONEXISTENT command errors
- ✅ New team member can build + dev in < 15 minutes

---

## 10. Timeline

| Phase | Effort | Dependencies |
|-------|--------|--------------|
| Phase 1: Fix Critical Issues | 1 day | None |
| Phase 2: Optimize Caching | 2 days | Phase 1 |
| Phase 3: Remote Cache + CI/CD | 2 days | Phase 2 |
| Phase 4: Advanced Features | 1 day | Phase 1 |
| Phase 5: MFE Orchestration | 1 day | Phase 1 |
| Phase 6: Monitoring + Docs | 1 day | All phases |

**Total**: ~8 days (can be parallelized)

---

## 11. Related Documentation

- [Turborepo v2.8 Docs](https://turbo.build/)
- [Vercel Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Bun Workspaces](https://bun.sh/docs/install/workspaces)
- [GitHub Actions + Turborepo](https://turbo.build/repo/docs/ci/github-actions)
- [Microfrontends with Turborepo](https://vercel.com/docs/microfrontends)

---

## Appendix: turbo-lab Workspace Snapshot

**Location**: `/home/wsl-vm/projects/turbo-lab/`

**Structure**:
```
turbo-lab/
├── apps/
│   ├── web/      (Next.js 16.2.0, React 19.1)
│   ├── docs/     (Next.js 16.2.0, React 19.1)
│   └── vite/     (Vite + React, TSX support)
├── packages/
│   ├── ui/       (@repo/ui — React component library)
│   ├── eslint-config/  (@repo/eslint-config)
│   └── typescript-config/  (@repo/typescript-config)
├── turbo.json    (v2.9.8)
├── package.json  (Bun 1.3.13, Turborepo 2.9.8)
└── bun.lock      (text format, Turborepo-compatible)
```

**Turborepo Version**: 2.9.8  
**Node**: >= 18  
**Package Manager**: Bun 1.3.13  
**Workspaces**: `apps/*`, `packages/*`

---

**Plan Status**: Ready for Phase 1 execution  
**Next Action**: Execute TASK-T001 through TASK-T010 (Fix Critical Issues)  
**Owner**: Turborepo Optimization Team  
**Created**: 2026-05-04
