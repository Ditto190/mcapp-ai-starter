# Plan: Shared Sandbox Refactor Blueprint

Refactor your repos under `/home/wsl-vm/projects` to use a shared sandbox adapter that targets AIO Sandbox APIs/MCP, with dual environment support (local Docker in dev + remote URL in prod). Start by introducing a single execution abstraction (shell/file/browser/code/mcp), then migrate call sites incrementally with compatibility fallbacks, test coverage, and staged rollout.

## Steps

### 1. Discovery baseline and inventory *(completed prerequisite)*

- Confirmed sandbox capabilities and endpoints from your fork and upstream docs: REST (`/v1/shell/*`, `/v1/file/*`, `/v1/browser/*`, `/v1/code/*`, `/v1/mcp/*`) and MCP hub (`/mcp`).
- Confirmed your target is multi-repo under `/home/wsl-vm/projects`, not a single package.

### 2. Define cross-repo execution contract *(blocks 3–8)*

- Create a shared interface package/convention used by all target repos: `SandboxExecutionProvider` with operations for shell, file, browser, code, MCP-call passthrough.
- Include normalized request/response schema (status, stdout/stderr, artifacts, timing, trace IDs, retry metadata).
- Decide transport mode strategy:
  - **Mode A:** REST-first (`/v1/*`) for deterministic typed calls
  - **Mode B:** MCP-first (`/mcp`) for tool-style routing
  - **Recommended hybrid:** REST for core execution, MCP for extensible tool categories.

### 3. Environment and endpoint resolution layer *(depends on 2)*

- Introduce runtime config resolution used consistently across repos:
  - local dev: `http://localhost:8080`
  - remote prod: `SANDBOX_BASE_URL`
- Add auth strategy hooks:
  - no-auth/local mode
  - JWT + ticket exchange mode (for protected deployments)
- Add health and capability probe on startup (`/v1/sandbox`, `/v1/mcp/servers`).

### 4. Add a shared sandbox adapter package/module *(depends on 2–3)*

- Implement one reusable adapter (either workspace package or copied pattern with same interface) that handles:
  - shell exec/session APIs
  - file read/write/find/search
  - browser actions/info/screenshot
  - python/node code execution
  - optional MCP tool invocation proxy
- Include strict allow/deny policy hooks for sensitive operations (e.g., dangerous shell commands, delete paths, outbound browser domains).

### 5. Incremental migration by boundary *(parallelizable after 4)*

- **Phase 5A (P0):** replace direct shell execution call sites.
- **Phase 5B (P0):** replace file operation call sites.
- **Phase 5C (P1):** move browser automation to sandbox browser endpoints/CDP bridging.
- **Phase 5D (P1):** move python/node code execution to sandbox endpoints.
- **Phase 5E (P2):** route existing MCP tool execution through sandbox MCP hub where appropriate.
- Keep compatibility fallback for each repo during migration: `local executor -> sandbox adapter` switch via config flag.

### 6. Compose and VM integration for local development *(depends on 3–4)*

- Add/extend compose stack so sandbox runs alongside existing services (n8n/postgres/ollama/qdrant) without port conflicts.
- Define resource limits and workspace mount policy per repo.
- Add network/access rules for container-to-container calls.

### 7. Observability, security, and guardrails *(depends on 4, parallel with 5–6)*

- Add structured logging for every sandbox call (operation, latency, retries, error category).
- Propagate tracing IDs into sandbox calls and existing telemetry.
- Implement secret redaction in payload logs.
- Enforce policy layer for command/path/tool restrictions.

### 8. Test strategy and rollout *(depends on 5–7)*

- Unit tests: adapter request building, retries, error mapping, auth headers.
- Contract tests: health check + representative shell/file/browser/code calls against a running sandbox.
- Integration tests per repo: golden workflows before/after migration.
- Rollout strategy:
  - canary repo first
  - feature flag default off
  - enable per repo after pass criteria
  - deprecate direct execution paths once stable.

### 9. Production hardening and operations checklist *(depends on 8)*

- Remote deployment config, auth key rotation, ticket TTL policy.
- SLA checks: timeout budgets, retry/backoff caps, circuit-breaker behavior.
- Runbook for sandbox outages/fallback mode.

## Relevant Files

| File | Role |
|------|------|
| [docker-compose.yml](projects/agentic-project-management-modme/docker-compose.yml) | Existing service stack; extend networking/resources for local sandbox coexistence |
| [package.json](projects/agentic-project-management-modme/package.json) | Scripts/dependencies baseline for introducing shared adapter package and verification scripts |
| [src/app-bridge.ts](projects/agentic-project-management-modme/src/app-bridge.ts) | MCP/host bridging patterns to reuse when routing tool calls through sandbox |
| [src/server/index.ts](projects/agentic-project-management-modme/src/server/index.ts) | App tool/resource registration helpers; insertion point for sandbox-backed tool registration wrappers |
| [tests/e2e/servers.spec.ts](projects/agentic-project-management-modme/tests/e2e/servers.spec.ts) | Integration test harness pattern to extend with sandbox-backed execution verification |
| [mcp-github-review-workspace/.vscode/mcp.json](projects/mcp-github-review-workspace/.vscode/mcp.json) | Local MCP config example for multi-repo workspace-level MCP wiring |

## Verification Gates

1. Local sandbox availability check passes (`/v1/sandbox`, `/v1/docs`, `/mcp`).
2. Adapter contract tests pass for shell/file/browser/code and MCP routing.
3. Existing repo integration tests pass with feature flag OFF (no regressions).
4. Canary repo integration tests pass with feature flag ON.
5. End-to-end workflow validation in VM confirms outputs and artifacts are identical or improved vs baseline.
6. Failure-mode tests pass: sandbox unavailable, auth failure, timeout, restricted command/path rejection.

## Decisions

- **Scope:** multi-repo integration under `/home/wsl-vm/projects` via shared adapter.
- **Deployment model:** both local dev (Docker) and remote prod endpoint support.
- **Migration coverage:** all execution boundaries (shell, file, browser, code, MCP).
- **Integration approach:** incremental with feature-flagged fallback, not big-bang replacement.

## Further Considerations

1. Shared adapter placement recommendation: dedicated internal package (preferred) vs per-repo duplicated module.
2. Default operation mode recommendation: REST-first for predictability, MCP bridge for extensibility.
3. Security posture recommendation: start with allowlist policy for shell/file/browser endpoints before enabling broad tool routing.
