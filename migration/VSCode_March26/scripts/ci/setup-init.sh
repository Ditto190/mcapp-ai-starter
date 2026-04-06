#!/usr/bin/env bash
# .claude/hooks/setup-init.sh
# Setup hook (init matcher): Runs on first-time repository initialization
# Trigger: claude --init
# Purpose: One-time setup tasks (copy templates, initialize databases, etc.)

set -Eeuo pipefail

echo "[setup-init] Starting repository initialization..."

# Copy environment template if not exists
if [[ ! -f ".env" && -f ".env.example" ]]; then
  echo "[setup-init] Copying .env.example → .env"
  cp .env.example .env
  chmod 600 .env
  echo "[setup-init] NOTE: Update .env with your actual values"
fi

# Initialize Git hooks if present
if [[ -d ".githooks" && -d ".git" ]]; then
  echo "[setup-init] Installing Git hooks..."
  git config core.hooksPath .githooks || true
  chmod +x .githooks/* || true
fi

# Create standard directories
for dir in logs tmp build dist coverage; do
  [[ -d "$dir" ]] || mkdir -p "$dir"
done

# Database initialization (project-specific)
if [[ -f "migrate.sh" ]]; then
  echo "[setup-init] Running migrations..."
  bash migrate.sh || echo "[setup-init] Migrations failed (expected if using external DB)"
fi

# Create CLAUDE.md if not exists (project instructions for Claude)
if [[ ! -f "CLAUDE.md" ]]; then
  cat > CLAUDE.md <<'EOF'
# Project Instructions for Claude Code

## Overview
Describe your project briefly here.

## Dependencies
- Node.js (v18+) with npm
- Python 3.9+ (optional)

## Getting Started
1. Dependencies are auto-installed on session start
2. Run tests: `npm test` or `pytest`
3. Start dev server: `npm run dev`

## Key Conventions
- Use frozen lockfiles (package-lock.json, uv.lock, poetry.lock)
- Test coverage minimum: 80%
- Commit messages follow conventional commits
- No secrets in code; use .env (gitignored)

## Rules
- Do not modify: .env, .git/, node_modules/, .venv/
- Safe to modify: src/, tests/, docs/
- Always run tests before committing

## MCP Servers (if configured)
- GitHub (repository access)
- Context7 (documentation reference)
EOF
  echo "[setup-init] Created CLAUDE.md"
fi

echo "[setup-init] Repository initialization complete"
exit 0