#!/usr/bin/env bash
# .claude/hooks/session-start.sh
# SessionStart hook: Runs after Claude Code starts, for context injection
# Matcher: startup, resume
# Purpose: Provide context about project state, recent changes, and dependencies

set -Eeuo pipefail

# Read hook input from stdin
INPUT=$(cat)

# Parse JSON input to get session metadata
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // "unknown"')
SOURCE=$(echo "$INPUT" | jq -r '.source // "unknown"')
CWD=$(echo "$INPUT" | jq -r '.cwd // "."')

# Only inject context on startup; skip on resume for brevity
if [[ "$SOURCE" != "startup" ]]; then
  exit 0
fi

# Output is captured and added to Claude's context
{
  echo "## Project Status"
  echo ""

  # Git branch and recent commits
  if command -v git &>/dev/null && git rev-parse --is-inside-work-tree &>/dev/null; then
    BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
    echo "**Current branch:** \`$BRANCH\`"
    echo ""
    
    echo "**Recent commits:**"
    git log --oneline -5 2>/dev/null | sed 's/^/  - /' || true
    echo ""

    echo "**Git status:**"
    if git status --porcelain 2>/dev/null | grep -q .; then
      echo "  Changes present"
    else
      echo "  Working tree clean"
    fi
    echo ""
  fi

  # Project structure hints
  echo "**Project files:**"
  [[ -f "package.json" ]] && echo "  - Node.js project (package.json)"
  [[ -f "requirements.txt" ]] && echo "  - Python project (requirements.txt)"
  [[ -f "pyproject.toml" ]] && echo "  - Python project (pyproject.toml)"
  [[ -f "Cargo.toml" ]] && echo "  - Rust project (Cargo.toml)"
  [[ -f "go.mod" ]] && echo "  - Go project (go.mod)"
  [[ -f "Dockerfile" ]] && echo "  - Docker project (Dockerfile)"
  [[ -f "README.md" ]] && echo "  - Documentation (README.md)"
  echo ""

  # Dependency status
  echo "**Dependency readiness:**"
  if [[ -d "node_modules" ]]; then
    NODE_COUNT=$(find node_modules -maxdepth 1 -type d | wc -l)
    echo "  - Node modules installed (~$NODE_COUNT packages)"
  fi
  if [[ -d ".venv" ]] || [[ -d "venv" ]]; then
    echo "  - Python venv ready"
  fi
  if [[ -f "Cargo.lock" ]]; then
    echo "  - Rust dependencies locked"
  fi

  # Test availability
  if command -v npm &>/dev/null && npm run 2>&1 | grep -q "test"; then
    echo "  - npm test available"
  fi
  if command -v python3 &>/dev/null && [[ -f "pytest.ini" || -f "setup.cfg" ]]; then
    echo "  - pytest available"
  fi
} | head -30  # Limit output to avoid context bloat

exit 0