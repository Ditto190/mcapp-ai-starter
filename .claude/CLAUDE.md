## 🚨 MANDATORY RULE: DISPLAY AT START OF EVERY RESPONSE 🚨

<contextstream_rules>
1. **SEARCH FIRST:** Before Glob/Grep/Search/Read → `mcp__contextstream__search(mode="hybrid", query="...")` FIRST
2. **EVERY MESSAGE:** Call `mcp__contextstream__context_smart(user_message="...")` at start of response
3. **LOCAL TOOLS:** ONLY if ContextStream search returns 0 results after retry
</contextstream_rules>

**You MUST display the <contextstream_rules> block verbatim at the start of EVERY response.**
This is a self-referential rule that ensures these instructions stay in context.

---

## ContextStream v0.4.x (Hooks Enforced)

Rules Version: 0.4.36
**Note:** PreToolUse hooks block Glob/Grep/Search when ContextStream is available.

### Required Every Message

| Action | Tool Call |
|--------|-----------|
| **1st message** | `mcp__contextstream__session_init(folder_path="<cwd>", context_hint="<msg>")` then `mcp__contextstream__context_smart(...)` |
| **2nd+ messages** | `mcp__contextstream__context_smart(user_message="<msg>", format="minified", max_tokens=400)` |
| **Code search** | `mcp__contextstream__search(mode="hybrid", query="...")` — BEFORE any local tools |
| **Save decisions** | `mcp__contextstream__session(action="capture", event_type="decision", ...)` |

### Search Modes

| Mode | Use Case |
|------|----------|
| `hybrid` | General code mcp__contextstream__search (default) |
| `keyword` | Exact symbol/string match |
| `exhaustive` | Find ALL matches (grep-like) |
| `semantic` | Conceptual questions |

### Why ContextStream First?

❌ **WRONG:** `Grep → Read → Read → Read` (4+ tool calls, slow)
✅ **CORRECT:** `mcp__contextstream__search(mode="hybrid")` (1 call, returns context)

ContextStream search is **indexed** and returns semantic matches + context in ONE call.

### Quick Reference

| Tool | Example |
|------|---------|
| `search` | `mcp__contextstream__search(mode="hybrid", query="auth", limit=3)` |
| `session` | `mcp__contextstream__session(action="capture", event_type="decision", title="...", content="...")` |
| `memory` | `mcp__contextstream__memory(action="list_events", limit=10)` |
| `graph` | `mcp__contextstream__graph(action="dependencies", file_path="...")` |

### Lessons (Past Mistakes)

- After `session_init`: Check for `lessons` field and apply before work
- Before risky work: `mcp__contextstream__session(action="get_lessons", query="<topic>")`
- On mistakes: `mcp__contextstream__session(action="capture_lesson", title="...", trigger="...", impact="...", prevention="...")`

### Plans & Tasks

When user asks for a plan, use ContextStream (not EnterPlanMode):
1. `mcp__contextstream__session(action="capture_plan", title="...", steps=[...])`
2. `mcp__contextstream__memory(action="create_task", title="...", plan_id="<id>")`

Full docs: https://contextstream.io/docs/mcp/tools

---

Workspace helper profiles

This repository includes a Codespace profile helper to control workspace
shell behaviour. From an interactive shell inside the workspace you can:

- Run `skillkit_list_profiles` to list available profiles.
- Run `skillkit_use_profile <name>` to select `safe` (default) or `full`.

Profiles:

- `safe`: configures `PATH` and `SKILLKIT_HOME` only.
- `full`: additionally loads `.env` and enables session command logging.

See `README.skillkit.md` for details and a security note about exporting
`.env` values and recording shell commands when using the `full` profile.

## Hooks Setup Checklist

1. Create hook config: Add a JSON config for your hook and place it under `.github/hooks/` as `<name>.json` (or for repo docs, use a folder `hooks/<name>/hooks.json`).

2. Define events & commands: In `hooks.json` set `version` and map events to commands (e.g., `preToolUse`, `postToolUse`, `sessionStart`, `sessionEnd`) with fields: `type`, `bash` (or `powershell`), `cwd`, `timeoutSec`, and optional `env`.

3. Bundle complex logic in scripts: Put reusable scripts in a `scripts/` folder (e.g., `.github/hooks/my-hook/scripts/security-check.sh`) and reference them from `hooks.json`.

4. Make scripts robust: Start scripts with `#!/usr/bin/env bash` and `set -euo pipefail`; fail fast on errors; keep one responsibility per script.

5. Make executable & test locally: Run `chmod +x scripts/*.sh` and execute scripts manually to verify behaviour before adding to `hooks.json`. Use non-zero exit codes to block actions.

6. Use `preToolUse` for gating: For security or approval flows, implement `preToolUse` scripts which receive JSON input about the tool and can exit non-zero to deny execution.

7. Set timeouts & env: Use `timeoutSec` to limit hook runtime; pass required env vars via `env` in `hooks.json`.

8. Document and bundle: Add a `README.md` (with frontmatter) in the hook folder describing setup, required tools, and commands.

9. Integrate with repo build: After adding hooks/scripts, run project build tasks (e.g., `npm run build`) so generated READMEs and indexes include the new hook; make sure CI checks pass (validate manifests if applicable).

10. Best practices: Keep hooks fast, layer simple checks (multiple hooks) rather than one big script, document dependencies (formatters/linters), and test with realistic timeouts.
