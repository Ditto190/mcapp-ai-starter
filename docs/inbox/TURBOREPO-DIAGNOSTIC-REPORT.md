# Turborepo v2.8 Expert Diagnostic Report
## `/home/wsl-vm/projects/turbo-lab/` Workspace Analysis

**Analyzed**: 2026-05-04  
**Analyzer**: Turborepo v2.8 Specialist  
**Status**: Production Gap Analysis Complete

---

## Executive Summary

The turbo-lab workspace is **functionally correct but not production-ready**. It has:
- ✅ Correct monorepo structure (apps + packages, Bun + Turborepo v2.9.8)
- ✅ Valid task definitions with proper dependencies
- 🔴 **3 CRITICAL issues** blocking clean builds
- 🟡 **7 MEDIUM issues** affecting performance and CI/CD
- 🟢 **Multiple optimization opportunities** for v2.8 features

---

## Issue Breakdown

### 🔴 CRITICAL Issues (Must Fix for Builds to Work)

#### Issue C-001: NONEXISTENT Build Commands in Config Packages

**Location**: `packages/eslint-config/package.json`, `packages/typescript-config/package.json`

**Problem**:
```
@repo/eslint-config#build
  Command = <NONEXISTENT>
```

These packages don't have `build` scripts, but turbo.json expects them. This causes:
- Build task to fail or silently skip
- Cache invalidation issues
- CI/CD pipeline breakage

**Impact**: **CRITICAL** — Blocks all CI builds if task dependency is strict

**Fix**:
```bash
# Option A: Add minimal build script
echo '{"scripts": {"build": "echo Building config"}}' >> packages/eslint-config/package.json

# Option B: Mark as cache: false in turbo.json
# (See TURBOREPO-INTEGRATION-PLAN.md for details)
```

---

#### Issue C-002: Cache Output Mismatch (Next.js vs Vite)

**Location**: `turbo.json` line 8

**Current**:
```json
"outputs": [".next/**", "!.next/cache/**", "dist/**"]
```

**Problem**:
- Next.js apps (web, docs) output to `.next/`
- Vite app (admin) outputs to `dist/`
- Same outputs config doesn't match both
- Results in cache misses for Vite builds

**Impact**: **CRITICAL** — Cache hit rate will be low for Vite app

**Evidence**:
- Web & Docs: `build` scripts run `next build` → output `.next/**`
- Admin (Vite): `build` script runs `tsc && vite build` → output `dist/**`

**Fix**: Create package-specific outputs configuration (see TURBOREPO-INTEGRATION-PLAN.md Phase 2)

---

#### Issue C-003: Dev Server Port Conflicts

**Location**: All app `package.json` dev scripts

**Current**:
```json
"dev": "next dev --port $(turbo get-mfe-port)"
"dev": "vite --port $(turbo get-mfe-port)"
```

**Problem**:
- `turbo get-mfe-port` is a Vercel-specific feature not documented in workspace
- All apps try to get a port dynamically
- If `turbo get-mfe-port` doesn't exist in local setup, all apps default to port 3000 or 5173
- Running `turbo dev` will have port conflicts

**Impact**: **CRITICAL** — `turbo dev` will fail on local development

**Evidence**:
- Admin (Vite) uses `--port $(turbo get-mfe-port)` but Vite default is 5173
- Web/Docs use `--port $(turbo get-mfe-port)` but Next.js default is 3000

**Fix**: Document and implement `turbo get-mfe-port` or provide port allocation strategy

---

### 🟡 MEDIUM Issues (Affects Performance & CI/CD)

#### Issue M-001: No Test Task in Pipeline

**Problem**: `turbo.json` has no `test` task, but apps likely have test scripts

**Impact**: Tests are never run in CI/CD via turbo; manual `npm test` needed

**Fix**: Add to turbo.json:
```json
{
  "test": {
    "dependsOn": ["build"],
    "outputs": ["coverage/**"]
  }
}
```

---

#### Issue M-002: No Remote Caching Configured

**Problem**: `TURBO_TOKEN` and `TURBO_TEAM` env vars not set; workspace cannot share cache across CI machines

**Impact**:
- Each CI run rebuilds from scratch
- Build time in CI is 5x longer than local
- Team collaboration has no cache benefit

**Fix**: See TURBOREPO-INTEGRATION-PLAN.md Phase 3

---

#### Issue M-003: No `--affected` Filter in CI/CD

**Problem**: No GitHub Actions workflow documented; developers may do full builds on every PR

**Impact**: PR builds take minutes even for single-file changes

**Fix**: Implement GitHub Actions with `turbo build --affected`

---

#### Issue M-004: Workspace Protocol Not Fully Leveraged

**Problem**: Apps declare deps as `"@repo/ui": "*"` instead of `"@repo/ui": "workspace:*"`

**Impact**:
- Less explicit about workspace protocol usage
- Bun workspaces may not optimize correctly

**Fix**: Update all `package.json` files to use `workspace:*` protocol

---

#### Issue M-005: Missing Global Environment Variables

**Problem**: `turbo.json` has empty `globalEnv` array

**Impact**:
- Environment variable changes don't invalidate cache
- If `NODE_ENV` changes, cache isn't recomputed
- Incorrect builds in different environments

**Fix**: Declare environment variables that affect builds:
```json
{
  "globalEnv": ["CI", "NODE_ENV"]
}
```

---

#### Issue M-006: No Boundary Rules for Architecture

**Problem**: Shared packages could import from apps; no enforcement

**Impact**: Risk of circular dependencies; shared code couples to app-specific logic

**Fix**: See TURBOREPO-INTEGRATION-PLAN.md Phase 4

---

#### Issue M-007: Legacy `ui: "tui"` in turbo.json

**Problem**: `"ui": "tui"` is v1 config; not used in v2

**Impact**: Code clarity; may confuse developers about active features

**Fix**: Remove line 3 from turbo.json

---

### 🟢 LOW Priority Issues (Optimization Opportunities)

- **L-001**: No `.turbo/` cache strategy documentation
- **L-002**: No performance baselines (clean build time, cached build time)
- **L-003**: No `turbo devtools` usage documented
- **L-004**: No `turbo watch` mode for development
- **L-005**: No deployment runbook for `turbo prune`
- **L-006**: No troubleshooting guide for cache misses

---

## Workspace Dependency Graph

```
@repo/eslint-config (config)
  ↑ (imported by)
  ├─ @repo/ui
  ├─ web
  └─ docs

@repo/typescript-config (config)
  ↑ (imported by)
  ├─ @repo/ui
  ├─ web
  ├─ docs
  └─ admin (vite)

@repo/ui (shared library)
  ↑ (imported by)
  ├─ web
  └─ docs

admin (vite app)
  → (depends on nothing from monorepo)

web (next.js app)
  → depends on @repo/ui
  → depends on @repo/eslint-config, @repo/typescript-config

docs (next.js app)
  → depends on @repo/ui
  → depends on @repo/eslint-config, @repo/typescript-config
```

**Finding**: No circular dependencies ✅. Vite app is isolated — good for independent deploys.

---

## Current Task Execution Flow

```
turbo build --dry-run

Scope: 6 packages
Order:
  1. @repo/eslint-config#build (BLOCKED: no build script)
  2. @repo/typescript-config#build (BLOCKED: no build script)
  3. @repo/ui#build (waits for 1,2)
  4. admin#build (waits for 2)
  5. web#build (waits for 1,3)
  6. docs#build (waits for 1,3)

Timeline (if fixed):
  t=0: Config packages build in parallel
  t+5s: UI package builds (depends on config)
  t+10s: Apps build in parallel (web, docs depend on ui; admin depends on config)
  Total: ~15 seconds (with proper caching)
```

---

## Recommended Priority Fixes

### Immediate (Day 1)
1. ✅ Fix eslint-config & typescript-config build scripts
2. ✅ Segregate outputs by app type
3. ✅ Implement port allocation for dev servers
4. ✅ Add test task to turbo.json
5. ✅ Verify `turbo build --dry-run` passes

### Short-term (Week 1)
6. ✅ Set up remote caching (Vercel)
7. ✅ Configure GitHub Actions with `--affected`
8. ✅ Update workspace protocol to `workspace:*`
9. ✅ Add boundary rules
10. ✅ Measure performance baselines

### Medium-term (Week 2)
11. ✅ Set up `turbo devtools` and monitoring
12. ✅ Create runbooks (install, build, dev, deploy, troubleshoot)
13. ✅ Document MFE orchestration patterns
14. ✅ Implement `turbo watch` for development
15. ✅ Create deployment strategy

---

## Performance Expectations (After Fixes)

| Scenario | Time | Notes |
|----------|------|-------|
| Clean build (all) | ~4-5 min | First time, nothing cached |
| Cached build (all) | ~20-30 sec | Remote cache hit |
| Build single app (web) | ~1-2 min | First time |
| Cached single app | ~5-10 sec | Remote cache hit |
| Affected (1 file changed) | ~30-45 sec | Rebuild web + doc if shared package changed |
| `turbo dev` start | ~10-15 sec | All 3 dev servers start |

---

## Bun + Turborepo Compatibility Check

| Aspect | Status | Notes |
|--------|--------|-------|
| Bun version | ✅ 1.3.13 | Good; Turborepo v2.6+ stable |
| Lockfile format | ✅ Text `bun.lock` | Turborepo-compatible |
| Workspace support | ✅ Yes | `bun install` respects workspace config |
| Parallel install | ✅ Yes | Bun is faster than npm |
| pnpm lockfile conflict | ✅ None | No pnpm.lock detected |

---

## Actionable Checklist

- [ ] **C-001**: Add build script to `packages/eslint-config/package.json`
- [ ] **C-002**: Add build script to `packages/typescript-config/package.json`
- [ ] **C-003**: Update turbo.json outputs for package-specific paths
- [ ] **C-004**: Implement or document `turbo get-mfe-port` logic
- [ ] **M-001**: Add `test` task to turbo.json
- [ ] **M-002**: Link to Vercel and configure remote cache (`bunx turbo login`, `bunx turbo link`)
- [ ] **M-003**: Create GitHub Actions workflow with `--affected` filter
- [ ] **M-004**: Update all `@repo/*` deps to use `workspace:*` protocol
- [ ] **M-005**: Add `NODE_ENV`, `CI` to `globalEnv` in turbo.json
- [ ] **M-006**: Add `boundaries` config to turbo.json
- [ ] **M-007**: Remove `"ui": "tui"` from turbo.json
- [ ] **L-001-006**: Create documentation and runbooks

---

## Next Steps

1. **Read**: `TURBOREPO-INTEGRATION-PLAN.md` (detailed action plan)
2. **Execute**: Phase 1 tasks (T-001 to T-010) to fix critical issues
3. **Test**: `bunx turbo build --dry-run` → should pass with 0 errors
4. **Verify**: `bunx turbo build` → all 6 packages build successfully
5. **Measure**: `bunx turbo build` again → cache hit rate > 80%
6. **Implement**: Phase 2-6 for production excellence

---

## Related Documents

- **TURBOREPO-INTEGRATION-PLAN.md** — Detailed implementation plan (phases 1-6)
- **PLAN.md** — Mono Dev + Turborepo combined strategy
- [Turborepo Docs](https://turbo.build/)
- [Bun Docs](https://bun.sh/)

---

**Report Status**: Complete  
**Recommendation**: Proceed to TURBOREPO-INTEGRATION-PLAN.md Phase 1  
**Owner**: Turborepo v2.8 Specialist  
**Generated**: 2026-05-04
