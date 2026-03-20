# Claude Code Web: Setup Scripts & SessionStart Hooks Guide

## Executive Summary

**Setup Scripts** (cloud environment feature) and **SessionStart Hooks** (local/web) serve different purposes:

| Feature | Setup Script | SessionStart Hook |
|---------|--------------|-------------------|
| **Trigger** | Manual via Claude Code web UI config | Automatically on session start/resume |
| **Scope** | Cloud environment only | Cloud + Local (defined in `.claude/settings.json`) |
| **Typical use** | Install dependencies, configure env vars | Context injection, logging, validation |
| **Runs** | Before Claude Code initializes | After Claude Code starts, before first prompt |
| **Failure impact** | Warns but continues (graceful) | Can block session if misconfigured |

**For cloud projects:** Use **setup scripts** for dependency management; use **SessionStart hooks** for context preparation and validation.

---

## Part 1: Setup Scripts (Cloud Environment)

### What It Is

A setup script is a Bash script that runs when a new cloud session starts, before Claude Code launches. Use setup scripts to install dependencies, configure tools, or prepare anything the cloud environment needs that isn't in the default image.

### Cloud Environment Reality

Claude operates entirely through the terminal and CLI tools available in the environment. It uses the pre-installed tools in the universal image and any additional tools you install through hooks or dependency management.

Key constraint: Runs on every session start: Hooks run each time a session starts or resumes, adding startup latency. Keep install scripts fast by checking whether dependencies are already present before reinstalling.

### Best Practices from Documentation

1. **Use frozen lockfiles only** – Cloud environments are ephemeral; `package-lock.json`, `pnpm-lock.yaml`, `poetry.lock`, `uv.lock` are required for determinism
2. **Idempotent checks** – Always check if deps are installed before reinstalling
3. **Conservative timeouts** – Long-running installs can stall sessions
4. **Graceful degradation** – Don't fail the entire session if one dep install fails

### Example: Minimal Setup Script

```bash
#!/usr/bin/env bash
set -Eeuo pipefail

# Node (frozen lockfile only)
if [[ -f package-lock.json && -z "$(ls -A node_modules 2>/dev/null)" ]]; then
  npm ci --prefer-offline
fi

# Python (venv + frozen)
if [[ -f uv.lock ]]; then
  uv sync
elif [[ -f requirements.txt && ! -d .venv ]]; then
  python3 -m venv .venv && source .venv/bin/activate
  pip install -r requirements.txt
fi

echo "Setup complete"
exit 0
```

---

## Part 2: SessionStart Hooks vs Setup Scripts

### When to Use Each

**Use SessionStart Hook for:**

- Context injection (git status, recent TODOs, project metadata)
- Environment variable setup (secrets, API keys)
- Validation before Claude starts (test availability, build system checks)
- Logging/monitoring session start
- Conditional setup based on session source (startup vs resume vs compact)

**Use Setup Script for:**

- Installing dependencies via package managers
- Building binaries (cargo, go build)
- Configuring databases or services
- One-time initialization (migrations, fixtures)

### SessionStart Hook Example

```bash
#!/usr/bin/env bash
# .claude/hooks/session_start.sh
# Runs AFTER Claude Code starts, for context injection

INPUT=$(cat)
SOURCE=$(echo "$INPUT" | jq -r '.source')  # "startup", "resume", or "compact"

# On resume/compact, remind Claude of recent context
if [[ "$SOURCE" != "startup" ]]; then
  echo "## Recent commits:"
  git log --oneline -5
  echo ""
  echo "## Git status:"
  git status --short
fi

# Always output to add to Claude's context
echo "## Project: $(basename "$(pwd)")"
exit 0
```

Configure in `.claude/settings.json`:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|resume|compact",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/session_start.sh",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

---

## Part 3: Cloud Environment Specifics

### Universal Image Contents

Pre-installed in cloud sessions:

- Node.js (latest LTS)
- Python 3.x with pip
- Ruby (multiple versions)
- Go, Rust (cargo)
- Git, GitHub CLI
- Common Unix tools (curl, jq, etc.)

### Network & Proxy

All outbound traffic in remote environments passes through a security proxy. Some package managers do not work correctly with this proxy. Bun is a known example.

**Workaround:** Use npm, yarn, or pnpm instead of bun for cloud sessions.

### GitHub Authentication

For security, all GitHub operations go through a dedicated proxy service that transparently handles all git interactions. Inside the sandbox, the git client authenticates using a custom-built scoped credential.

No manual authentication needed; GitHub operations "just work."

---

## Part 4: Dependency Management Strategy

### Node.js

```bash
# ✓ Preferred (deterministic)
npm ci --prefer-offline  # Uses package-lock.json
pnpm install --frozen-lockfile
yarn install --immutable

# ✗ Avoid in cloud
npm install  # Not reproducible
```

### Python

```bash
# ✓ Preferred (frozen)
uv sync  # uv.lock
poetry install --no-interaction  # poetry.lock

# ⚠ Acceptable (fallback)
pip install -r requirements.txt  # But not pinned across sessions

# ✗ Avoid
conda install  # Proxy issues
```

### Rust

```bash
# ✓ Preferred
cargo fetch && cargo build --release

# Just warming deps before Claude uses them
```

---

## Part 5: Recommended Setup Script for Your Use Case

Based on your toolkit (MCP, conversation analysis, multi-project):

```bash
#!/usr/bin/env bash
# setup-claude-web.sh
# Cloud-optimized setup for multi-language projects

set -Eeuo pipefail

export LANG=C.UTF-8 CI=1
TIMEOUT=120
CACHE_ROOT="/tmp/.claude-cache"
mkdir -p "$CACHE_ROOT"

export XDG_CACHE_HOME="$CACHE_ROOT"
export npm_config_cache="$CACHE_ROOT/npm"
export PIP_CACHE_DIR="$CACHE_ROOT/pip"
export UV_CACHE_DIR="$CACHE_ROOT/uv"

# Export session metadata (for downstream hooks/scripts)
export PROJECT_ROOT="$(pwd)"
export CLAUDE_SESSION_ID="$(date +%s)-$RANDOM"

# Prepend local bins
for d in .venv/bin node_modules/.bin; do
  [[ -d "$d" ]] && { export PATH="$(pwd)/$d:$PATH"; break; }
done

# Node (frozen only)
if [[ -f package.json ]]; then
  if [[ -f pnpm-lock.yaml ]] && command -v pnpm &>/dev/null; then
    timeout $TIMEOUT pnpm install --frozen-lockfile 2>&1 | tail -1
  elif [[ -f package-lock.json ]] && command -v npm &>/dev/null; then
    timeout $TIMEOUT npm ci --prefer-offline 2>&1 | tail -1
  fi
fi

# Python (venv + frozen)
if [[ -f uv.lock && command -v uv &>/dev/null ]]; then
  timeout $TIMEOUT uv sync 2>&1 | tail -1
elif [[ -f requirements.txt && command -v python3 &>/dev/null ]]; then
  [[ -d .venv ]] || python3 -m venv .venv
  source .venv/bin/activate
  timeout $TIMEOUT pip install -q -r requirements.txt 2>&1 || true
fi

# Rust
if [[ -f Cargo.toml && command -v cargo &>/dev/null ]]; then
  timeout $TIMEOUT cargo fetch 2>/dev/null || true
fi

echo "[setup] Complete (${SECONDS}s)"
exit 0
```

---

## Part 6: Integration with Your Workflow

### For MCP Server Projects

If using MCP servers in Claude Desktop, validate they're accessible:

```bash
# In setup script or SessionStart hook
MCP_CONFIG="$HOME/.claude-desktop/claude_desktop_config.json"
if [[ -f "$MCP_CONFIG" ]]; then
  jq . "$MCP_CONFIG" >/dev/null && echo "MCP config valid" || echo "MCP config invalid"
fi
```

### For Conversation Analysis ETL

Export session metadata for downstream logging:

```bash
# SessionStart hook outputs this
cat <<EOF
## Session Started
- ID: $CLAUDE_SESSION_ID
- Project: $(pwd)
- Start: $(date -u +%Y-%m-%dT%H:%M:%SZ)
EOF
```

Later scripts can grep/parse these context strings.

### For Multi-Project Switching

Store project-specific setup in `.claude/setup.sh`:

```bash
# project-A/.claude/setup.sh
npm ci && npm run build

# project-B/.claude/setup.sh
uv sync && uv run pytest --co
```

Cloud environment respects per-project hooks.

---

## Part 7: Troubleshooting

### Setup hangs or times out

**Cause:** Package manager stalling on network.
**Fix:** Add timeout; gracefully fall back:

```bash
timeout 60 npm ci || npm ci --no-audit --no-fund
```

### Dependencies partially installed

**Cause:** Proxy filtering certain packages.
**Fix:** Use lockfile frozen installs (avoid dynamic resolution):

```bash
npm ci  # ✓ Deterministic
npm install  # ✗ Tries to resolve online
```

### Python venv activation fails

**Cause:** Shell profile mismatch.
**Fix:** Use absolute path:

```bash
source "$(pwd)/.venv/bin/activate"
```

### SessionStart hook blocks startup

**Cause:** Hook timeout too short or script error.
**Fix:** Set `timeout` and graceful exit:

```json
{
  "type": "command",
  "command": "your-hook.sh || true",
  "timeout": 30
}
```

---

## Part 8: Provided Script Walkthrough

The `claude_code_web_startup.sh` script implements:

1. **Deterministic dependency resolution** – Frozen lockfiles only
2. **Fast checking** – Skips reinstalls if deps exist
3. **Graceful degradation** – Warns on partial failures; doesn't block startup
4. **Session metadata export** – `CLAUDE_SESSION_ID`, `CLAUDE_SESSION_START`
5. **Cloud-safe caching** – Uses `/tmp` (ephemeral)
6. **MCP awareness** – Validates config if present
7. **Environment variables** – Sets `CI=1`, `PYTHONUNBUFFERED=1`, etc.
8. **Timeout protection** – 120s max per operation (configurable)

**Usage:**

```bash
# Configure in Claude Code web UI:
# Environment → Setup script → paste entire script

# Or run locally for testing:
chmod +x claude_code_web_startup.sh
CLAUDE_DEBUG=1 ./claude_code_web_startup.sh
```

---

## Summary Table: When to Use What

| Task | Tool | Why |
|------|------|-----|
| Install npm/pip deps | Setup script | Runs before Claude; deterministic |
| Inject context (git status, recent TODOs) | SessionStart hook | Runs after Claude starts; adds to context window |
| Validate environment (tests pass?) | SessionStart hook | Can block/warn before Claude starts real work |
| Configure secrets/API keys | SessionStart hook (write to `$CLAUDE_ENV_FILE`) | Secure; injected into session env |
| Cleanup after session | SessionEnd hook (local only) | Not available in cloud; use post-completion scripts |
| Build binaries before coding | Setup script | Must happen before Claude can use them |

---

## References

- Claude Code on the web documentation
- Deterministic setup patterns for Laravel (JP Caparas, 2026)
- Claude Code Hooks: Complete guide (claudefa.st, 2026)
