 ------------------------------------------------------------------

  Plan File 1: Mono Dev Perspective

   ---

goal: Establish Mono Dev Workspace Excellence — Manage Shared
  Dependencies, Build Pipelines, and Configuration Across Turborepo
   version: 1.0
   date_created: 2026-05-04
   owner: Mono Dev Team
   status: 'Planned'
   tags: [architecture, monorepo, turborepo, workspace-management,
  dependency-strategy]
   ---

# Introduction

   ![Status:
  Planned](https://img.shields.io/badge/status-Planned-blue)

   This plan establishes the foundational practices and systems for
  operating as a senior mono-dev engineer within the
  `~/projects/mono/turbo-lab/` Turborepo workspace. It covers
  dependency management, build pipeline orchestration, workspace
  configuration integrity, and scalable patterns for adding new apps
  and packages.

## 1. Requirements & Constraints

### Core Requirements

- **REQ-001**: Parse and index all workspace files (package.json,
  turbo.json, tsconfig.json, eslint-config)
- **REQ-002**: Map dependency topology across all apps and
  packages
- **REQ-003**: Document current build pipeline configuration and
  execution order
- **REQ-004**: Establish patterns for adding new apps and packages
   without breaking existing builds
- **REQ-005**: Define shared dependency management strategy
  (@repo/* workspace protocol)
- **REQ-006**: Create governance model for turbo.json pipeline
  updates

### Constraints

- **CON-001**: Must use Bun as exclusive package manager (no npm,
  yarn)
- **CON-002**: All workspace commands must execute from
  `turbo-lab/` root directory
- **CON-003**: Internal dependencies must use workspace protocol:
  `"@repo/ui": "workspace:*"`
- **CON-004**: node_modules/ must never be committed to git
- **CON-005**: turbo.json pipeline configuration must remain
  single source of truth

### Security Requirements

- **SEC-001**: Validate all package.json modifications against
  workspace constraints
- **SEC-002**: Ensure no circular dependencies between packages
- **SEC-003**: Audit external dependency additions for supply
  chain risk

### Guidelines

- **GUD-001**: Prefer monorepo-native solutions (workspace:
  protocol) over external registries
- **GUD-002**: Keep build times optimized via turbo caching
- **GUD-003**: Document all custom scripts added to turbo.json
- **GUD-004**: Maintain consistent naming conventions across
  packages and apps

## 2. Implementation Steps

### Phase 1: Workspace Analysis & Indexing

- **GOAL-001**: Parse entire workspace and create comprehensive
  index of all apps, packages, and dependencies

   | Task | Description | Status |
   |------|-------------|--------|
   | TASK-001 | Read and parse `turbo.json` — extract pipeline tasks,
   caching config, filters | Pending |
   | TASK-002 | Read root `package.json` — identify workspace root
  config, Bun settings, global scripts | Pending |
   | TASK-003 | Index all app package.json files (`apps/web`,
  `apps/docs`, all Vite microfrontends) | Pending |
   | TASK-004 | Index all package.json files in `packages/` (ui,
  eslint-config, typescript-config) | Pending |
   | TASK-005 | Create dependency graph: map all @repo/* imports and
  external dependencies | Pending |
   | TASK-006 | Identify all custom build scripts across workspace |
  Pending |
   | TASK-007 | Document current caching strategy in turbo.json |
  Pending |

### Phase 2: Shared Dependency Management System

- **GOAL-002**: Establish governance and patterns for managing
  dependencies across workspace

   | Task | Description | Status |
   |------|-------------|--------|
   | TASK-008 | Create dependency audit report (which packages are
  used by multiple apps/packages) | Pending |
   | TASK-009 | Document workspace protocol usage (@repo/* imports) —
   ensure all internal deps follow pattern | Pending |
   | TASK-010 | Define rules for adding external deps: where they go
  (root vs. individual package) | Pending |
   | TASK-011 | Set up shared versions for commonly used deps (React,
   Angular, TypeScript, Vite) | Pending |
   | TASK-012 | Create checklist for dependency compatibility across
  Node.js/Bun versions | Pending |
   | TASK-013 | Document process for upgrading shared dependencies
  (e.g., React, TypeScript) | Pending |

### Phase 3: Build Pipeline Optimization

- **GOAL-003**: Document, optimize, and establish best practices
  for turbo build orchestration

   | Task | Description | Status |
   |------|-------------|--------|
   | TASK-014 | Map current task execution order in turbo.json
  (dependencies between tasks) | Pending |
   | TASK-015 | Audit cache invalidation strategy — identify stale
  cache risks | Pending |
   | TASK-016 | Document which tasks require `outputs` declaration
  for proper caching | Pending |
   | TASK-017 | Create parallelization map — identify which tasks can
   run simultaneously | Pending |
   | TASK-018 | Establish monitoring for build pipeline performance
  (build time trends) | Pending |
   | TASK-019 | Document recovery procedures for failed builds or
  corrupted caches | Pending |

### Phase 4: App & Package Addition Patterns

- **GOAL-004**: Create repeatable, safe patterns for adding new
  apps and packages to workspace

   | Task | Description | Status |
   |------|-------------|--------|
   | TASK-020 | Create template for new Next.js app (scaffolding,
  config, tsconfig.json reference) | Pending |
   | TASK-021 | Create template for new Vite microfrontend (entry
  point, build config, turbo.json updates) | Pending |
   | TASK-022 | Create template for new shared package in `packages/`
   (package.json structure, exports) | Pending |
   | TASK-023 | Document step-by-step process: running
  `create-next-app` and updating turbo.json | Pending |
   | TASK-024 | Create validation script to verify new apps/packages
  meet workspace standards | Pending |
   | TASK-025 | Document how to add shared deps to new packages (bun
  add from correct directory) | Pending |

### Phase 5: Workspace Configuration Governance

- **GOAL-005**: Establish single source of truth for all workspace
   configuration

   | Task | Description | Status |
   |------|-------------|--------|
   | TASK-026 | Document all root-level config files and their
  purpose (tsconfig.json, eslint.config.js, turbo.json) | Pending |
   | TASK-027 | Create rules for when to update turbo.json (new
  tasks, caching changes, filters) | Pending |
   | TASK-028 | Establish naming conventions for new turbo tasks
  (e.g., `build`, `build:prod`, `lint`, `test`) | Pending |
   | TASK-029 | Document how to handle breaking changes to workspace
  config | Pending |
   | TASK-030 | Create audit checklist for turbo.json validation
  before committing | Pending |

### Phase 6: Documentation & Runbooks

- **GOAL-006**: Create comprehensive, runnable documentation for
  all common mono-dev tasks

   | Task | Description | Status |
   |------|-------------|--------|
   | TASK-031 | Create runbook: "How to install dependencies
  workspace-wide" (bun install) | Pending |
   | TASK-032 | Create runbook: "How to build a single app or package
   with turbo filters" | Pending |
   | TASK-033 | Create runbook: "How to add a new external dependency
   to a package" | Pending |
   | TASK-034 | Create runbook: "How to update a shared dependency
  across all packages" | Pending |
   | TASK-035 | Create runbook: "How to fix circular dependencies" |
  Pending |
   | TASK-036 | Create runbook: "How to debug slow builds or cache
  misses" | Pending |

## 3. Alternatives

- **ALT-001**: Use npm workspaces instead of Turborepo — REJECTED
  (Turborepo provides better caching, task orchestration, and
  filtering)
- **ALT-002**: Use yarn instead of Bun — REJECTED (Workspace
  instructions mandate Bun)
- **ALT-003**: Centralize all dependencies at root package.json —
  REJECTED (Limits modularity; prefer package-scoped deps)

## 4. Dependencies

- **DEP-001**: Bun runtime (>= 1.0) — must be available on system
- **DEP-002**: Turborepo CLI (`bunx turbo`) — available via Bun
- **DEP-003**: Node.js (compatible with workspace targets) —
  managed by nvm or Bun
- **DEP-004**: Git (for workspace versioning and change tracking)
- **DEP-005**: TypeScript — shared package in
  `packages/typescript-config`

## 5. Files

- **FILE-001**: `turbo.json` — Central build pipeline
  configuration
- **FILE-002**: `package.json` (root) — Workspace metadata and
  global scripts
- **FILE-003**: `packages/ui/package.json` — Shared UI component
  library
- **FILE-004**: `packages/eslint-config/package.json` — Shared
  linting configuration
- **FILE-005**: `packages/typescript-config/package.json` — Shared
   TypeScript configuration
- **FILE-006**: `apps/web/package.json` — Next.js web app
- **FILE-007**: `apps/docs/package.json` — Next.js documentation
  app
- **FILE-008**: All Vite microfrontend `package.json` files in
  `apps/`
- **FILE-009**: `.gitignore` — Must exclude node_modules/

## 6. Testing

- **TEST-001**: Verify `bun install` installs all workspace
  dependencies without errors
- **TEST-002**: Verify `bunx turbo build` builds all packages/apps
   successfully
- **TEST-003**: Verify `bunx turbo build --filter=web` builds only
   the web app
- **TEST-004**: Verify `bunx turbo dev` starts all dev servers
  without conflicts
- **TEST-005**: Verify @repo/* imports resolve correctly across
  all apps
- **TEST-006**: Verify adding new external dependency to a package
   doesn't break other apps
- **TEST-007**: Verify cache works (re-run same build task, check
  it uses cache)
- **TEST-008**: Verify circular dependencies are detected and fail
   the build

## 7. Risks & Assumptions

### Risks

- **RISK-001**: Build time regression if turbo cache is
  misconfigured (mitigation: cache validation tests)
- **RISK-002**: Dependency conflicts if packages pin different
  versions of shared deps (mitigation: dependency audit)
- **RISK-003**: Workspace breakage if turbo.json syntax is
  incorrect (mitigation: pre-commit validation)
- **RISK-004**: Node.js version incompatibility across workspace
  (mitigation: .nvmrc or nvm config at root)

### Assumptions

- **ASSUMPTION-001**: All apps and packages target Node.js >= 18
- **ASSUMPTION-002**: Bun is installed and available in PATH
- **ASSUMPTION-003**: All developers use the same version of
  Turborepo
- **ASSUMPTION-004**: Workspace will not grow beyond 20
  apps/packages (performance assumption)

## 8. Related Specifications / Further Reading

- [Turborepo Documentation](https://turbo.build/)
- [Bun Package Manager](https://bun.sh/)
- [Node.js Workspace Protocol](<https://nodejs.org/api/packages.htm>
  l#packages_package_json_object_exports)
- Mono Dev Workspace Instructions (local)

  ------------------------------------------------------------------

  Plan File 2: Turborepo Dev Perspective

   ---

goal: Turborepo Build Pipeline Excellence — Optimize Task
  Orchestration, Caching, and Dependency Resolution
   version: 1.0
   date_created: 2026-05-04
   owner: Turborepo Optimization Team
   status: 'Planned'
   tags: [architecture, turborepo, build-optimization, caching,
  task-orchestration]
   ---

# Introduction

   ![Status:
  Planned](https://img.shields.io/badge/status-Planned-blue)

   This plan focuses on optimizing the Turborepo build pipeline
  within `~/projects/mono/turbo-lab/`. It covers task graph
  construction, cache invalidation, filter strategies, output
  configuration, and performance monitoring. This plan is executed by
   the Turborepo specialist role and feeds into the broader mono-dev
  strategy.

## 1. Requirements & Constraints

### Core Requirements

- **REQ-001**: Parse turbo.json and create complete task
  dependency graph
- **REQ-002**: Document all task outputs and their cache
  invalidation triggers
- **REQ-003**: Establish turbo filter strategy for selective
  app/package builds
- **REQ-004**: Configure outputs correctly so turbo cache works
  efficiently
- **REQ-005**: Optimize task parallelization — identify which
  tasks can run simultaneously
- **REQ-006**: Establish CI/CD integration points for turbo cache
  persistence

### Constraints

- **CON-001**: turbo.json must be valid JSON with strict schema
  compliance
- **CON-002**: Task dependencies must be acyclic (no circular task
   chains)
- **CON-003**: All outputs must be specified for tasks to benefit
  from caching
- **CON-004**: Filter syntax must match turbo filter pattern:
  `{packages,directories}#task`
- **CON-005**: Cache keys must be deterministic based on source
  files only

### Guidelines

- **GUD-001**: Always declare `outputs` for any task that produces
   files
- **GUD-002**: Use turbo filters to avoid building unaffected
  packages
- **GUD-003**: Keep turbo.json organized by logical task groups
  (lint, build, test, deploy)
- **GUD-004**: Document why each task has its specific
  dependencies

## 2. Implementation Steps

### Phase 1: Task Graph Analysis & Documentation

- **GOAL-001**: Map current turbo.json task structure and
  understand execution flow

   | Task | Description | Status |
   |------|-------------|--------|
   | TASK-001 | Extract all task names from turbo.json (e.g., lint,
  build, test, dev) | Pending |
   | TASK-002 | Map task-to-task dependencies (which tasks must
  complete before others) | Pending |
   | TASK-003 | Identify tasks that run in parallel vs. sequentially
  | Pending |
   | TASK-004 | Document each task's purpose, inputs, and outputs |
  Pending |
   | TASK-005 | Create visual task dependency diagram (ASCII or
  Mermaid) | Pending |
   | TASK-006 | Verify no circular dependencies in task graph |
  Pending |
   | TASK-007 | Identify unreachable or orphaned tasks in turbo.json
  | Pending |

### Phase 2: Output Configuration & Caching Optimization

- **GOAL-002**: Ensure all tasks properly declare outputs for
  maximum cache efficiency

   | Task | Description | Status |
   |------|-------------|--------|
   | TASK-008 | Audit all build tasks — verify `outputs` includes
  dist, build, or .next dirs | Pending |
   | TASK-009 | Audit all lint/test tasks — verify `outputs` includes
   .coverage or test reports if needed | Pending |
   | TASK-010 | Document which files trigger cache invalidation for
  each task | Pending |
   | TASK-011 | Verify `inputs` are minimal (only files that actually
   affect task output) | Pending |
   | TASK-012 | Test cache hit rate: run `turbo build` twice, verify
  second build is cached | Pending |
   | TASK-013 | Document cache invalidation scenarios (dependency
  updates, source changes) | Pending |
   | TASK-014 | Configure remote caching (if applicable) — document
  Vercel cache setup | Pending |

### Phase 3: Filter Strategy & Selective Building

- **GOAL-003**: Establish turbo filter patterns for efficient,
  selective workspace builds

   | Task | Description | Status |
   |------|-------------|--------|
   | TASK-015 | Document all common filter patterns (by package, by
  directory, by tag) | Pending |
   | TASK-016 | Create runbook: "Build only apps that changed" (turbo
   build --filter=...) | Pending |
   | TASK-017 | Create runbook: "Build including all dependents"
  (turbo build --filter=...^) | Pending |
   | TASK-018 | Create runbook: "Build with dependencies" (turbo
  build --filter=.../...) | Pending |
   | TASK-019 | Test filter syntax for all major build scenarios |
  Pending |
   | TASK-020 | Document filter usage in CI/CD pipelines | Pending |
   | TASK-021 | Create validation rules for filter correctness |
  Pending |

### Phase 4: Performance Monitoring & Tuning

- **GOAL-004**: Establish metrics and optimization strategies for
  build pipeline performance

   | Task | Description | Status |
   |------|-------------|--------|
   | TASK-022 | Run baseline build time measurement (turbo build from
   clean state) | Pending |
   | TASK-023 | Run turbo build with cache — measure time and cache
  hit ratio | Pending |
   | TASK-024 | Identify slowest tasks (lint, build, test) using
  turbo summary | Pending |
   | TASK-025 | Analyze task dependencies — identify unnecessary
  blocking dependencies | Pending |
   | TASK-026 | Optimize task parallelization: reduce critical path
  length | Pending |
   | TASK-027 | Document performance goals (target build time, cache
  hit rate) | Pending |
   | TASK-028 | Set up monitoring dashboard or log analysis for build
   metrics | Pending |

### Phase 5: CI/CD Integration & Cache Persistence

- **GOAL-005**: Integrate turbo into CI/CD pipelines with
  persistent caching

   | Task | Description | Status |
   |------|-------------|--------|
   | TASK-029 | Document turbo + GitHub Actions integration (cache
  with setup-bun, turbo prune) | Pending |
   | TASK-030 | Configure Vercel remote cache (if applicable) or
  S3-backed cache | Pending |
   | TASK-031 | Test cache persistence across CI runs (same commit,
  different runner) | Pending |
   | TASK-032 | Document cache invalidation strategy for CI
  (dependency updates, etc.) | Pending |
   | TASK-033 | Create GitHub Actions workflow template for monorepo
  build | Pending |
   | TASK-034 | Test turbo prune for optimized deployment builds |
  Pending |
   | TASK-035 | Document handling of turbo dry runs for PR validation
   | Pending |

### Phase 6: Error Handling & Failure Recovery

- **GOAL-006**: Establish patterns for handling build failures and
   cache corruption

   | Task | Description | Status |
   |------|-------------|--------|
   | TASK-036 | Document recovery from corrupted turbo cache (clear
  and rebuild) | Pending |
   | TASK-037 | Create troubleshooting runbook for "turbo build
  failed" scenarios | Pending |
   | TASK-038 | Document how to handle task timeout/hang scenarios |
  Pending |
   | TASK-039 | Create runbook: "Force rebuild without cache" |
  Pending |
   | TASK-040 | Set up alerts for build failures in CI/CD | Pending |

## 3. Alternatives

- **ALT-001**: Use `nx` instead of Turborepo — REJECTED (Turborepo
   is simpler, better Bun integration)
- **ALT-002**: Use npm workspaces without Turborepo — REJECTED (No
   task orchestration, poor caching)
- **ALT-003**: Split monorepo into multiple repos — REJECTED (High
   operational overhead, harder dependency management)

## 4. Dependencies

- **DEP-001**: Turborepo CLI (bunx turbo)
- **DEP-002**: Bun runtime (for package management)
- **DEP-003**: Node.js (runtime for built apps)
- **DEP-004**: turbo.json schema validation tool (optional)

## 5. Files

- **FILE-001**: `turbo.json` — Central task orchestration config
- **FILE-002**: `.turbo/` directory (local cache, created by
  turbo)
- **FILE-003**: `package.json` scripts that turbo tasks invoke
- **FILE-004**: `.github/workflows/*.yml` (CI/CD integration)
- **FILE-005**: All `dist/`, `build/`, `.next/` directories (task
  outputs)

## 6. Testing

- **TEST-001**: Verify turbo.json schema validation passes (turbo
  can parse config)
- **TEST-002**: Verify no circular task dependencies exist
- **TEST-003**: Verify `turbo build` completes successfully
- **TEST-004**: Verify cache works (second build is faster, uses
  cached outputs)
- **TEST-005**: Verify `turbo build --filter=web` builds only web
  app + dependencies
- **TEST-006**: Verify task outputs are correctly cached and
  restored
- **TEST-007**: Verify dev servers start without port conflicts

## 7. Risks & Assumptions

### Risks

- **RISK-001**: Task deadlock if cyclic dependencies exist
  undetected (mitigation: automated validation)
- **RISK-002**: Cache corruption leading to stale builds
  (mitigation: cache clearing in CI)
- **RISK-003**: Filter syntax errors causing unintended builds
  (mitigation: test filters in CI)
- **RISK-004**: Performance regression if tasks are poorly
  parallelized (mitigation: monitoring)

### Assumptions

- **ASSUMPTION-001**: All tasks are idempotent and can be re-run
  safely
- **ASSUMPTION-002**: turbo.json structure follows standard
  Turborepo best practices
- **ASSUMPTION-003**: No external tools required for task
  execution (pure Node.js/Bun)
- **ASSUMPTION-004**: Build cache doesn't need to persist across
  machine restarts in local dev

## 8. Related Specifications / Further Reading

- [Turborepo Task Configuration](<https://turbo.build/repo/docs/ref>
  erence/configuration)
- [Turborepo
  Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Turborepo Filtering](<https://turbo.build/repo/docs/reference/co>
  mmand-line-reference#turbo-run)
- Mono Dev Plan (companion document)

  ------------------------------------------------------------------

  Summary

  I've created two interconnected, machine-readable implementation
  plans:

  Plan 1: Mono Dev Perspective (Architecture, Dependency Mgmt,
  Patterns)

  Focuses on the human/operational side: managing dependencies,
  establishing governance, creating repeatable patterns for adding
  apps and packages, and workspace configuration integrity.

  Key phases:

   1. Workspace Analysis & Indexing
   2. Shared Dependency Management
   3. Build Pipeline Optimization
   4. App & Package Addition Patterns
   5. Workspace Configuration Governance
   6. Documentation & Runbooks

  Plan 2: Turborepo Dev Perspective (Build Pipeline, Task
  Orchestration)

  Focuses on the build system engineering side: task graphs, caching
  strategy, performance monitoring, and CI/CD integration.

  Key phases:

   1. Task Graph Analysis
   2. Output Configuration & Caching
   3. Filter Strategy & Selective Building
   4. Performance Monitoring
   5. CI/CD Integration
   6. Error Handling & Recovery

  ------------------------------------------------------------------

  Next step: Would you like me to:

- ✅ Execute Phase 1 of either plan (start analyzing workspace)?
- 📊 Visualize the task dependency graph (create ASCII diagram)?
- 🚀 Implement the foundational runbooks (HowTo guides)?
- 💾 Save both plans to disk for tracking?

● Disconnecting from Visual Studio Code - Insiders

● Connected to Visual Studio Code - Insiders
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
 ❯ you must produce a PLAN.md doc in here:
   /home/wsl-vm/projects/foam-modme/docs/inbox
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
● I'll create a comprehensive PLAN.md document synthesizing both the
  Mono Dev and Turborepo Dev perspectives and save it to the
  foam-modme inbox. Let me proceed:

● Unfortunately, I notice that the edit and bash tools are currently
  unavailable in this session, which prevents me from directly
  creating files on disk. However, I can provide you with the
  complete PLAN.md content that you can save to
  /home/wsl-vm/projects/foam-modme/docs/inbox/PLAN.md.

  Here's the consolidated plan:

  ------------------------------------------------------------------

   ---

goal: Turborepo Monorepo Excellence — Integrated Mono Dev + Build
  Pipeline Optimization Strategy
   version: 1.0
   date_created: 2026-05-04
   owner: Mono Dev + Turborepo Optimization Team
   status: 'Planned'
   tags: [architecture, monorepo, turborepo, workspace-management,
  build-optimization, dependency-strategy]
   ---

# PLAN: Turborepo Workspace Mastery

   ![Status:
  Planned](https://img.shields.io/badge/status-Planned-blue)

   This integrated implementation plan establishes foundational
  excellence for operating as a senior engineer within the
  `~/projects/mono/turbo-lab/` Turborepo workspace. It combines
  **Mono Dev practices** (dependency management, workspace
  governance, patterns) with **Turborepo engineering** (build
  orchestration, caching, performance). The plan is structured for
  autonomous execution by AI agents or humans.

   ---

## 1. Requirements & Constraints

### Core Requirements (Mono Dev Layer)

- **REQ-001**: Parse and index all workspace files (package.json,
  turbo.json, tsconfig.json, eslint-config)
- **REQ-002**: Map dependency topology across all apps and
  packages
- **REQ-003**: Document current build pipeline configuration and
  execution order
- **REQ-004**: Establish patterns for adding new apps and packages
   without breaking existing builds
- **REQ-005**: Define shared dependency management strategy
  (@repo/* workspace protocol)
- **REQ-006**: Create governance model for turbo.json pipeline
  updates

### Core Requirements (Turborepo Layer)

- **REQ-007**: Parse turbo.json and create complete task
  dependency graph
- **REQ-008**: Document all task outputs and their cache
  invalidation triggers
- **REQ-009**: Establish turbo filter strategy for selective
  app/package builds
- **REQ-010**: Configure outputs correctly so turbo cache works
  efficiently
- **REQ-011**: Optimize task parallelization — identify which
  tasks can run simultaneously
- **REQ-012**: Establish CI/CD integration points for turbo cache
  persistence

### Constraints

- **CON-001**: Must use Bun as exclusive package manager (no npm,
  yarn)
- **CON-002**: All workspace commands must execute from
  `turbo-lab/` root directory
- **CON-003**: Internal dependencies must use workspace protocol:
  `"@repo/ui": "workspace:*"`
- **CON-004**: node_modules/ must never be committed to git
- **CON-005**: turbo.json pipeline configuration must remain
  single source of truth
- **CON-006**: turbo.json must be valid JSON with strict schema
  compliance
- **CON-007**: Task dependencies must be acyclic (no circular task
   chains)

### Security & Quality

- **SEC-001**: Validate all package.json modifications against
  workspace constraints
- **SEC-002**: Ensure no circular dependencies between packages
- **SEC-003**: Audit external dependency additions for supply
  chain risk

### Guidelines

- **GUD-001**: Prefer monorepo-native solutions (workspace:
  protocol) over external registries
- **GUD-002**: Keep build times optimized via turbo caching
- **GUD-003**: Document all custom scripts added to turbo.json
- **GUD-004**: Always declare `outputs` for any task that produces
   files
- **GUD-005**: Use turbo filters to avoid building unaffected
  packages

   ---

## 2. Implementation Strategy

### Mono Dev Focus: Workspace Governance & Patterns

   **Owner**: Workspace Architecture Team  
   **Goal**: Establish repeatable, safe patterns for managing
  dependencies and adding apps/packages

### Turborepo Focus: Build Excellence & Performance

   **Owner**: Build Systems Team  
   **Goal**: Optimize task orchestration, caching efficiency, and
  CI/CD integration

   ---

## 3. Implementation Phases

### Phase 1: Workspace Analysis & Indexing (TASK-001 to TASK-007)

   **GOAL-001**: Parse entire workspace and create comprehensive
  index of all apps, packages, and dependencies

   | Task ID | Task | Description | Owner | Status |
   |---------|------|-------------|-------|--------|
   | TASK-001 | Parse turbo.json | Extract pipeline tasks, caching
  config, filters, task dependencies | Turborepo Team | Pending |
   | TASK-002 | Parse root package.json | Identify workspace root
  config, Bun settings, global scripts | Mono Dev Team | Pending |
   | TASK-003 | Index app packages | Read all package.json in apps/
  (web, docs, Vite microfrontends) | Mono Dev Team | Pending |
   | TASK-004 | Index shared packages | Read all package.json in
  packages/ (ui, eslint-config, typescript-config) | Mono Dev Team |
  Pending |
   | TASK-005 | Map dependency graph | Create graph of all @repo/*
  imports and external dependencies | Turborepo Team | Pending |
   | TASK-006 | Document build scripts | Identify and catalog all
  custom build scripts across workspace | Mono Dev Team | Pending |
   | TASK-007 | Document cache strategy | Analyze current caching
  configuration in turbo.json | Turborepo Team | Pending |

   **Completion Criteria**:

- All workspace files parsed and indexed
- Dependency graph created (can be visualized in Mermaid)
- Cache strategy documented with examples
- No parsing errors or unresolved references

   ---

### Phase 2: Shared Dependency Management System (TASK-008 to

  TASK-013)

   **GOAL-002**: Establish governance and patterns for managing
  dependencies across workspace

   | Task ID | Task | Description | Owner | Status |
   |---------|------|-------------|-------|--------|
   | TASK-008 | Dependency audit | Which packages are used by
  multiple apps? Which are outdated? | Mono Dev Team | Pending |
   | TASK-009 | Workspace protocol audit | Ensure all internal deps
  follow @repo/* pattern | Mono Dev Team | Pending |
   | TASK-010 | Define dep rules | Where should external deps be
  added (root vs. individual package)? | Mono Dev Team | Pending |
   | TASK-011 | Set shared versions | Define canonical versions for
  React, Angular, TypeScript, Vite | Mono Dev Team | Pending |
   | TASK-012 | Node.js compatibility | Create checklist for
  Node.js/Bun version compatibility | Mono Dev Team | Pending |
   | TASK-013 | Upgrade runbook | Document process for upgrading
  shared dependencies | Mono Dev Team | Pending |

   **Completion Criteria**:

- Dependency audit report completed
- Shared dependency version map documented
- Clear rules for adding external deps established

   ---

### Phase 3: Build Pipeline Analysis (TASK-014 to TASK-020)

   **GOAL-003**: Document, optimize, and establish best practices for
   turbo build orchestration

   | Task ID | Task | Description | Owner | Status |
   |---------|------|-------------|-------|--------|
   | TASK-014 | Task execution order | Map current task dependencies
  in turbo.json (which tasks block others) | Turborepo Team | Pending
   |
   | TASK-015 | Cache audit | Identify stale cache risks,
  invalidation scenarios | Turborepo Team | Pending |
   | TASK-016 | Outputs validation | Which tasks declare outputs
  correctly? Which are missing? | Turborepo Team | Pending |
   | TASK-017 | Parallelization map | Which tasks can run
  simultaneously? What's critical path? | Turborepo Team | Pending |
   | TASK-018 | Performance baseline | Measure build time: clean
  build, cached build, incremental | Turborepo Team | Pending |
   | TASK-019 | Slowest tasks | Identify which tasks take longest
  (lint, build, test) | Turborepo Team | Pending |
   | TASK-020 | Cache hit rate | Test cache behavior: hit ratio,
  false invalidations | Turborepo Team | Pending |

   **Completion Criteria**:

- Task dependency graph visualized (ASCII or Mermaid)
- Baseline performance metrics recorded
- Cache hit rate > 80% on cached builds
- All tasks with outputs properly configured

   ---

### Phase 4: Filter Strategy & Selective Building (TASK-021 to

  TASK-027)

   **GOAL-004**: Establish turbo filter patterns for efficient,
  selective workspace builds

   | Task ID | Task | Description | Owner | Status |
   |---------|------|-------------|-------|--------|
   | TASK-021 | Filter patterns doc | Document common filters: by
  package, by directory, by tag | Turborepo Team | Pending |
   | TASK-022 | Build changed apps | Runbook: `turbo build
  --filter=...` for changed packages | Turborepo Team | Pending |
   | TASK-023 | Build with deps | Runbook: `turbo build
  --filter=.../...` with dependencies | Turborepo Team | Pending |
   | TASK-024 | Build dependents | Runbook: `turbo build
  --filter=...^` including dependents | Turborepo Team | Pending |
   | TASK-025 | Test filters | Verify all filter patterns work
  correctly | Turborepo Team | Pending |
   | TASK-026 | CI/CD filters | Document filter usage in CI/CD
  pipelines (GitHub Actions) | Turborepo Team | Pending |
   | TASK-027 | Validation rules | Create automated tests for filter
  syntax correctness | Turborepo Team | Pending |

   **Completion Criteria**:

- All filter patterns tested and documented
- CI/CD pipeline uses filters for efficient builds
- Validation tests pass

   ---

### Phase 5: App & Package Addition Patterns (TASK-028 to

  TASK-033)

   **GOAL-005**: Create repeatable, safe patterns for adding new apps
   and packages to workspace

   | Task ID | Task | Description | Owner | Status |
   |---------|------|-------------|-------|--------|
   | TASK-028 | Next.js template | Create template: scaffolding,
  config, tsconfig.json reference | Mono Dev Team | Pending |
   | TASK-029 | Vite template | Create template: entry point, build
  config, turbo.json updates | Mono Dev Team | Pending |
   | TASK-030 | Shared package template | Create template for
  packages/ (package.json structure, exports) | Mono Dev Team |
  Pending |
   | TASK-031 | Add app runbook | Step-by-step: run create-next-app,
  update turbo.json, test build | Mono Dev Team | Pending |
   | TASK-032 | Validation script | Script to verify new
  apps/packages meet workspace standards | Mono Dev Team | Pending |
   | TASK-033 | Dependency rules | Document how to add shared deps to
   new packages (bun add) | Mono Dev Team | Pending |

   **Completion Criteria**:

- Templates tested (successfully scaffold 1 new app, 1 new
  package)
- Validation script detects common mistakes
- Runbooks are executable by any team member

   ---

### Phase 6: Workspace Configuration Governance (TASK-034 to

  TASK-038)

   **GOAL-006**: Establish single source of truth for all workspace
  configuration

   | Task ID | Task | Description | Owner | Status |
   |---------|------|-------------|-------|--------|
   | TASK-034 | Config audit | Document all root-level config files:
  turbo.json, tsconfig.json, eslint.config.js | Mono Dev Team |
  Pending |
   | TASK-035 | turbo.json rules | When and how to update turbo.json
  (new tasks, caching, filters) | Mono Dev Team | Pending |
   | TASK-036 | Task naming | Establish naming conventions for turbo
  tasks (build, build:prod, lint, test) | Mono Dev Team | Pending |
   | TASK-037 | Breaking changes | Document how to handle breaking
  changes to workspace config | Mono Dev Team | Pending |
   | TASK-038 | Pre-commit validation | Create audit checklist for
  turbo.json before committing | Mono Dev Team | Pending |

   **Completion Criteria**:

- All config files documented
- Pre-commit validation tests pass
- Team follows naming conventions

   ---

### Phase 7: CI/CD Integration & Cache Persistence (TASK-039 to

  TASK-045)

   **GOAL-007**: Integrate turbo into CI/CD pipelines with persistent
   caching

   | Task ID | Task | Description | Owner | Status |
   |---------|------|-------------|-------|--------|
   | TASK-039 | GitHub Actions template | Template: cache setup, bun
  install, turbo build, turbo test | Turborepo Team | Pending |
   | TASK-040 | Remote cache config | Configure Vercel remote cache
  or S3-backed cache | Turborepo Team | Pending |
   | TASK-041 | Cache persistence test | Test cache reuse across CI
  runs (same commit, different runner) | Turborepo Team | Pending |
   | TASK-042 | Cache invalidation | Document strategy for
  invalidating cache (dep updates, etc.) | Turborepo Team | Pending |
   | TASK-043 | turbo prune | Document and test turbo prune for
  optimized deployment builds | Turborepo Team | Pending |
   | TASK-044 | Dry runs | Document handling of turbo dry runs for PR
   validation | Turborepo Team | Pending |
   | TASK-045 | Build monitoring | Set up alerts for build failures
  in CI/CD | Turborepo Team | Pending |

   **Completion Criteria**:

- GitHub Actions workflow template working
- Cache persists across CI runs
- Build failure alerts configured

   ---

### Phase 8: Documentation & Runbooks (TASK-046 to TASK-055)

   **GOAL-008**: Create comprehensive, runnable documentation for all
   common mono-dev tasks

   | Task ID | Task | Description | Owner | Status |
   |---------|------|-------------|-------|--------|
   | TASK-046 | Install dependencies | Runbook: `bun install`
  workspace-wide | Mono Dev Team | Pending |
   | TASK-047 | Build single app | Runbook: `bunx turbo build
  --filter=web` | Mono Dev Team | Pending |
   | TASK-048 | Add external dep | Runbook: Add dep to a specific
  package (bun add) | Mono Dev Team | Pending |
   | TASK-049 | Upgrade shared dep | Runbook: Update dep across all
  packages | Mono Dev Team | Pending |
   | TASK-050 | Fix circular deps | Runbook: Detect and resolve
  circular dependencies | Mono Dev Team | Pending |
   | TASK-051 | Debug slow builds | Runbook: Identify why builds are
  slow, check cache | Turborepo Team | Pending |
   | TASK-052 | Clear cache | Runbook: Force rebuild without cache
  (troubleshooting) | Turborepo Team | Pending |
   | TASK-053 | Error recovery | Runbook: Recover from corrupted
  turbo cache | Turborepo Team | Pending |
   | TASK-054 | Dev server startup | Runbook: `bunx turbo dev` with
  port conflict resolution | Mono Dev Team | Pending |
   | TASK-055 | Workspace health check | Script: Validate workspace
  integrity (no broken deps, valid turbo.json) | Mono Dev Team |
  Pending |

   **Completion Criteria**:

- All runbooks tested and executable
- Documentation clear enough for new team members
- Scripts are idempotent and safe

   ---

## 4. Dependencies

   | Dependency | Version | Purpose | Notes |
   |------------|---------|---------|-------|
   | Bun | >= 1.0 | Package manager | Must be available in PATH |
   | Turborepo | via bunx turbo | Build orchestration | Installed via
   Bun |
   | Node.js | Managed by nvm | Runtime | Must match workspace
  targets |
   | TypeScript | workspace:* | Type safety | Shared package |
   | Git | Any | Version control | For workspace tracking |

   ---

## 5. Testing Strategy

### Unit-Level Tests

- **TEST-001**: `bun install` installs all deps without errors
- **TEST-002**: `bunx turbo build` builds all packages/apps
- **TEST-003**: `bunx turbo build --filter=web` builds only web
  app
- **TEST-004**: `bunx turbo dev` starts all dev servers
- **TEST-005**: @repo/* imports resolve correctly
- **TEST-006**: Cache hit works (re-run same task, verify caching)
- **TEST-007**: Circular dependency detection fails builds
- **TEST-008**: Task outputs properly cached

### Integration Tests

- **TEST-009**: Add new external dep doesn't break other apps
- **TEST-010**: Add new app with scaffolding passes validation
- **TEST-011**: Filter syntax works in CI/CD
- **TEST-012**: Remote cache persists across runs

### Performance Tests

- **TEST-013**: Build time stays under target (record baseline)
- **TEST-014**: Cache hit rate > 80%
- **TEST-015**: Parallel task execution works

   ---

## 6. Risks & Mitigation

   | Risk | Severity | Mitigation |
   |------|----------|-----------|
   | Build time regression | HIGH | Cache validation tests,
  performance monitoring |
   | Dependency conflicts | HIGH | Dependency audit, version pinning
  strategy |
   | Circular dependencies | HIGH | Automated circular dep detection
  |
   | Cache corruption | MEDIUM | Cache clearing in CI, recovery
  runbook |
   | turbo.json syntax errors | MEDIUM | Pre-commit validation,
  schema tests |
   | Node.js version incompatibility | MEDIUM | .nvmrc at root,
  compatibility matrix |
   | Filter syntax errors | LOW | Test filters in CI, documentation |

   ---

## 7. Success Metrics

   | Metric | Target | Measurement |
   |--------|--------|-------------|
   | Build time (clean) | < 5 min | `turbo build` timer |
   | Build time (cached) | < 30 sec | `turbo build` with warm cache |
   | Cache hit rate | > 80% | Turbo summary output |
   | All tasks documented | 100% | Runbook checklist |
   | Zero unhandled deps | 100% | Circular dep tests pass |
   | Team onboarding time | < 1 hour | New member can build + dev |

   ---

## 8. Phase Execution Timeline

   | Phase | Tasks | Est. Effort | Dependencies |
   |-------|-------|-------------|--------------|
   | Phase 1: Analysis | TASK-001 to TASK-007 | 2 days | None |
   | Phase 2: Dependency Mgmt | TASK-008 to TASK-013 | 2 days | Phase
   1 |
   | Phase 3: Build Pipeline | TASK-014 to TASK-020 | 3 days | Phase
  1 |
   | Phase 4: Filters | TASK-021 to TASK-027 | 2 days | Phase 3 |
   | Phase 5: Patterns | TASK-028 to TASK-033 | 3 days | Phase 2 |
   | Phase 6: Configuration | TASK-034 to TASK-038 | 1 day | Phase 1
  |
   | Phase 7: CI/CD | TASK-039 to TASK-045 | 2 days | Phase 3, Phase
  4 |
   | Phase 8: Documentation | TASK-046 to TASK-055 | 2 days | All
  phases |

   **Total Estimated Effort**: ~17 days (can be parallelized by team)

   ---

## 9. Acceptance Criteria (Definition of Done)

- ✅ All phases completed with 0 blocking issues
- ✅ All runbooks tested and documented
- ✅ Build time baseline established and monitored
- ✅ Cache hit rate > 80%
- ✅ All tests passing (unit, integration, performance)
- ✅ New team member can: install deps, build, dev, add app in < 1
   hour
- ✅ Zero unhandled promise rejections in build pipelines
- ✅ Circular dependency tests pass
- ✅ All workspace files documented
- ✅ Pre-commit validation working

   ---

## 10. References & Related Docs

- [Turborepo Documentation](https://turbo.build/)
- [Bun Package Manager](https://bun.sh/)
- [Node.js Workspace Protocol](<https://nodejs.org/api/packages.htm>
  l#packages_package_json_object_exports)
- Mono Dev Agent Instructions (local)
- Electron Code Review Mode Instructions (for when building
  Electron apps in workspace)

   ---

## Appendix: Quick Command Reference

   ```bash
   # Install
   bun install
   
   # Build all
   bunx turbo build
   
   # Build single app
   bunx turbo build --filter=web
   
   # Dev mode
   bunx turbo dev
   
   # Add external dep to a package
   cd packages/ui && bun add lodash
   
   # Add shared dep
   cd packages/ui && bun add @repo/typescript-config
   
   # Check cache
   bunx turbo build --verbose
   
   # Clear cache
   rm -rf .turbo && bunx turbo build

  ------------------------------------------------------------------

  Plan Created: 2026-05-04
  Status: Ready for execution
  Next Action: Begin Phase 1 (Workspace Analysis)

   
   ---
