#!/usr/bin/env bash
# Session start hook - runs at Codespace initialization
# Loads environment variables and sets up git hooks

set -euo pipefail

echo ""
echo "🚀 Initializing environment..."
echo ""

ENV_FILE=".env"

# Load env vars into current session
if [ -f "$ENV_FILE" ]; then
  echo "📦 Loading environment variables..."
  if [ -f "scripts/load-env-vars.sh" ]; then
    source scripts/load-env-vars.sh "$ENV_FILE" 2>/dev/null || true
  else
    echo "⚠️  load-env-vars.sh not found"
  fi
else
  echo "⚠️  $ENV_FILE not found - skipping env load"
fi

# Set up Git hooks
echo ""
echo "🔧 Installing Git hooks..."
if [ -d ".git/hooks" ]; then
  # Create pre-push hook if not exists
  PRE_PUSH=".git/hooks/pre-push"
  if [ ! -f "$PRE_PUSH" ]; then
    echo "#!/usr/bin/env bash" > "$PRE_PUSH"
    echo "# Pre-push hook - syncs env secrets before push" >> "$PRE_PUSH"
    echo "echo \"\"" >> "$PRE_PUSH"
    echo "echo \"🔄 Pre-push hook: Syncing environment secrets...\"" >> "$PRE_PUSH"
    echo "echo \"\"" >> "$PRE_PUSH"
    echo "" >> "$PRE_PUSH"
    echo "if [ -f \"scripts/sync-env-secrets.sh\" ]; then" >> "$PRE_PUSH"
    echo "  bash scripts/sync-env-secrets.sh" >> "$PRE_PUSH"
    echo "fi" >> "$PRE_PUSH"
    echo "" >> "$PRE_PUSH"
    echo "exit 0" >> "$PRE_PUSH"
    chmod +x "$PRE_PUSH"
    echo "✓ Git pre-push hook installed"
  else
    echo "✓ Git pre-push hook already exists"
  fi
else
  echo "⚠️  .git/hooks directory not found"
fi

echo ""
echo "✅ Environment initialization complete!"
echo ""
echo "📝 Available commands:"
echo "   bash scripts/sync-env-secrets.sh        # Sync new secrets"
echo "   bash scripts/sync-env-secrets.sh --dry-run  # Preview"
echo "   bash scripts/watch-env.sh              # Auto-sync on changes"
echo "   source scripts/load-env-vars.sh .env   # Reload variables"
echo ""
