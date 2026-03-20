#!/usr/bin/env bash
# Claude Code Web - Startup Script (cloud environment optimized)
# Focus: Deterministic setup, dependency freezing, no guessing
# Design: Runs in fresh Linux VMs; every session must be self-contained
# Reference: https://code.claude.com/docs/en/claude-code-on-the-web

set -Eeuo pipefail

# ============================================================================
# CONFIGURATION & HELPERS
# ============================================================================

# Control verbosity and behavior
DEBUG="${CLAUDE_DEBUG:-0}"
SKIP_NODE="${SKIP_NODE_INSTALL:-0}"
SKIP_PYTHON="${SKIP_PYTHON_INSTALL:-0}"
SKIP_RUST="${SKIP_RUST_INSTALL:-0}"
TIMEOUT_INSTALL=120  # Cloud environment: keep operations fast

log()   { [[ "$DEBUG" == "1" ]] && printf "\033[1;36m[setup]\033[0m %s\n" "$*" || true; }
info()  { printf "\033[1;32m[setup]\033[0m %s\n" "$*"; }
warn()  { printf "\033[1;33m[warn]\033[0m %s\n" "$*" >&2; }
err()   { printf "\033[1;31m[err]\033[0m %s\n" "$*" >&2; }
ok()    { printf "\033[1;32m✓\033[0m %s\n" "$*"; }

has() {
  command -v "$1" >/dev/null 2>&1
}

on_error() {
  warn "Setup failed at line ${BASH_LINENO[0]} (exit code $?)"
  warn "Continuing—Claude Code may still function."
  # Cloud env: don't fail hard; let Claude gracefully handle missing deps
}
trap on_error ERR

# ============================================================================
# CLOUD ENVIRONMENT SETUP
# ============================================================================

# Export essential variables for cloud determinism
export LANG="${LANG:-C.UTF-8}"
export LC_ALL="${LC_ALL:-C.UTF-8}"
export EDITOR="${EDITOR:-nano}"
export CI=1  # Signals non-interactive to build tools (critical for cloud)

# Suppress tool verbosity
export PYTHONUNBUFFERED=1
export NODE_ENV="${NODE_ENV:-development}"
export npm_config_loglevel="warn"

# ============================================================================
# PATH & CACHE (cloud-safe)
# ============================================================================

# Prepend local bins; many tools check PATH for pre-installed versions
for d in ".venv/bin" "venv/bin" ".direnv/bin" "node_modules/.bin"; do
  [[ -d "$d" ]] && { export PATH="$(pwd)/$d:$PATH"; break; }
done

# Cache to ephemeral /tmp (not persisted across cloud sessions)
CACHE_ROOT="/tmp/.claude-cache"
mkdir -p "$CACHE_ROOT" 2>/dev/null || true

export XDG_CACHE_HOME="$CACHE_ROOT"
export npm_config_cache="$CACHE_ROOT/npm"
export YARN_CACHE_FOLDER="$CACHE_ROOT/yarn"
export PIP_CACHE_DIR="$CACHE_ROOT/pip"
export UV_CACHE_DIR="$CACHE_ROOT/uv"

# ============================================================================
# PROJECT ROOT DETECTION
# ============================================================================

ROOT="$(pwd)"
log "Starting from: $ROOT"

# Try git root (fast check)
if has git && git rev-parse --show-toplevel &>/dev/null 2>&1; then
  ROOT="$(git rev-parse --show-toplevel)"
  cd "$ROOT" || true
  log "Git root detected: $ROOT"
fi

export PROJECT_ROOT="$ROOT"

# ============================================================================
# DIAGNOSTIC CHECK (debug only)
# ============================================================================

if [[ "$DEBUG" == "1" ]]; then
  log "=== Environment ==="
  log "OS: $(uname -s)"
  log "Shell: ${SHELL##*/}"
  log "User: $(id -un)"
  has node && log "Node: $(node --version)"
  has npm && log "npm: $(npm --version)"
  has python3 && log "Python: $(python3 --version 2>&1 | awk '{print $2}')"
  has uv && log "uv: $(uv --version)"
  has cargo && log "Cargo: $(cargo --version)"
  log "=== Path ==="
  log "PATH=$PATH"
fi

# ============================================================================
# NODE.JS DEPENDENCIES (frozen lockfiles only)
# ============================================================================

setup_node() {
  [[ -f package.json ]] || { log "No package.json; skipping Node setup"; return 0; }
  [[ "$SKIP_NODE" == "1" ]] && { log "Node setup skipped"; return 0; }

  # Lockfile-based install (deterministic)
  if [[ -f pnpm-lock.yaml ]] && has pnpm; then
    info "Installing Node deps (pnpm, frozen)..."
    timeout "$TIMEOUT_INSTALL" pnpm install --frozen-lockfile 2>&1 | grep -E "added|up to date" || warn "pnpm install partial"
  elif [[ -f yarn.lock ]] && has yarn; then
    info "Installing Node deps (yarn, frozen)..."
    timeout "$TIMEOUT_INSTALL" yarn install --immutable 2>&1 | grep -E "added|up to date" || warn "yarn install partial"
  elif [[ -f package-lock.json ]] && has npm; then
    info "Installing Node deps (npm ci)..."
    timeout "$TIMEOUT_INSTALL" npm ci 2>&1 | tail -1 || warn "npm ci partial"
  elif [[ -f bun.lockb ]] && has bun; then
    info "Installing Node deps (bun, frozen)..."
    timeout "$TIMEOUT_INSTALL" bun install --frozen-lockfile 2>&1 | tail -1 || warn "bun install partial"
  else
    warn "package.json found but no lockfile (package-lock.json, pnpm-lock.yaml, yarn.lock, bun.lockb)"
    warn "Cloud environment requires frozen lockfiles for determinism"
    return 0
  fi
  ok "Node deps installed"
}

# ============================================================================
# PYTHON DEPENDENCIES (with venv)
# ============================================================================

setup_python() {
  [[ -f requirements.txt || -f pyproject.toml || -f poetry.lock || -f uv.lock ]] || {
    log "No Python deps markers; skipping Python setup"
    return 0
  }
  [[ "$SKIP_PYTHON" == "1" ]] && { log "Python setup skipped"; return 0; }

  if ! has python3; then
    warn "python3 not found; skipping Python setup"
    return 0
  fi

  # Reuse existing venv if present
  if [[ -d .venv && -f .venv/bin/python ]]; then
    log "Activating existing .venv..."
    # shellcheck disable=SC1091
    source .venv/bin/activate 2>/dev/null || true
    return 0
  fi

  if [[ -d venv && -f venv/bin/python ]]; then
    log "Activating existing venv..."
    # shellcheck disable=SC1091
    source venv/bin/activate 2>/dev/null || true
    return 0
  fi

  # Create minimal venv (no pip overhead on fresh Linux)
  if [[ -f requirements.txt || -f pyproject.toml || -f uv.lock || -f poetry.lock ]]; then
    info "Creating Python venv (.venv)..."
    python3 -m venv .venv --without-pip 2>/dev/null || {
      warn "venv creation failed; trying with pip..."
      python3 -m venv .venv 2>/dev/null || return 0
    }
    # shellcheck disable=SC1091
    source .venv/bin/activate 2>/dev/null || true
  fi

  # Install using frozen lockfile (determinism)
  if [[ -f uv.lock ]] && has uv; then
    info "Syncing Python deps (uv, frozen)..."
    timeout "$TIMEOUT_INSTALL" uv sync 2>&1 | tail -1 || warn "uv sync partial"
  elif [[ -f poetry.lock ]] && has poetry; then
    info "Installing Python deps (poetry, frozen)..."
    timeout "$TIMEOUT_INSTALL" poetry install --no-interaction 2>&1 | tail -1 || warn "poetry partial"
  elif [[ -f requirements.txt ]]; then
    info "Installing Python deps (pip, requirements.txt)..."
    # Upgrade pip first (security)
    pip install -q --upgrade pip setuptools wheel 2>/dev/null || true
    timeout "$TIMEOUT_INSTALL" pip install -q -r requirements.txt 2>&1 || warn "pip install partial"
  else
    log "No lockfile detected for Python; project must use uv/poetry"
  fi
  ok "Python deps installed"
}

# ============================================================================
# RUST (cargo fetch for faster builds)
# ============================================================================

setup_rust() {
  [[ -f Cargo.toml ]] || { log "No Cargo.toml; skipping Rust setup"; return 0; }
  [[ "$SKIP_RUST" == "1" ]] && { log "Rust setup skipped"; return 0; }

  if ! has cargo; then
    warn "Cargo not found; skipping Rust setup"
    return 0
  fi

  log "Fetching Rust dependencies..."
  timeout "$TIMEOUT_INSTALL" cargo fetch 2>/dev/null || warn "cargo fetch partial"
  ok "Rust deps ready"
}

# ============================================================================
# MCP CONFIGURATION VALIDATION
# ============================================================================

validate_mcp() {
  # Check for Claude Desktop MCP config (if running in desktop context)
  local mcp_config="${HOME}/.claude-desktop/claude_desktop_config.json"

  if [[ -f "$mcp_config" ]]; then
    log "MCP config detected"
    if has jq; then
      if jq . "$mcp_config" >/dev/null 2>&1; then
        log "MCP config valid JSON"
      else
        warn "MCP config malformed; Claude may not access MCP servers"
      fi
    fi
  else
    log "No MCP config found (expected in web context)"
  fi
}

# ============================================================================
# ENVIRONMENT SETUP (SessionStart injection points)
# ============================================================================

# These variables are injected into Claude's context for session awareness
export CLAUDE_SESSION_START="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
export CLAUDE_SESSION_ID="$(date +%s)-$RANDOM"
export CLAUDE_ENVIRONMENT="web"  # Signals we're in cloud
export CLAUDE_SKIP_INTERACTIVE=1  # Cloud: no interactive prompts

log "Session ID: $CLAUDE_SESSION_ID"
log "Start time: $CLAUDE_SESSION_START"

# Optional: If using SessionStart hook with context injection
# Write to $CLAUDE_ENV_FILE if available (hook convention)
if [[ -n "${CLAUDE_ENV_FILE:-}" ]]; then
  {
    echo "export PROJECT_ROOT='$ROOT'"
    echo "export CLAUDE_SESSION_ID='$CLAUDE_SESSION_ID'"
    echo "export CLAUDE_ENVIRONMENT='web'"
  } >> "$CLAUDE_ENV_FILE" 2>/dev/null || true
fi

# ============================================================================
# RUN SETUP SEQUENCE
# ============================================================================

info "Starting dependency installation..."
setup_node || true
setup_python || true
setup_rust || true
validate_mcp || true

# ============================================================================
# VERIFICATION
# ============================================================================

# Check that at least one build tool is available
TOOLS_FOUND=0
for cmd in npm pnpm yarn node python3 cargo go; do
  if has "$cmd"; then
    TOOLS_FOUND=$((TOOLS_FOUND + 1))
  fi
done

if [[ $TOOLS_FOUND -eq 0 ]]; then
  warn "No build tools detected (npm, python3, cargo, go)"
  warn "Claude Code will start, but many operations may fail"
elif [[ $TOOLS_FOUND -eq 1 ]]; then
  log "Single build tool found; multi-language projects may be limited"
else
  ok "Multiple build tools available ($TOOLS_FOUND)"
fi

# ============================================================================
# COMPLETION
# ============================================================================

info "Setup complete in ${SECONDS}s"
log "Ready for Claude Code session"

# Important: Exit 0 even if deps partially failed
# Cloud environment needs to start Claude Code even with incomplete setup
exit 0