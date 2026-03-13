#!/usr/bin/env bash
# Watch .env for changes and auto-sync secrets
# Usage: bash scripts/watch-env.sh
# Press Ctrl+C to stop

set -euo pipefail

ENV_FILE=".env"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ $ENV_FILE not found"
  exit 1
fi

get_timestamp() {
  if [ -f "$ENV_FILE" ]; then
    stat -f %m "$ENV_FILE" 2>/dev/null || stat -c %Y "$ENV_FILE" 2>/dev/null || echo "0"
  else
    echo "-1"
  fi
}

PREV_TIMESTAMP=$(get_timestamp)
echo "👁️  Watching $ENV_FILE for changes..."
echo "   (Will auto-sync new keys when file is saved)"
echo "   Press Ctrl+C to stop"
echo ""

COUNTER=0
while true; do
  sleep 2
  ((COUNTER++))
  
  CURR_TIMESTAMP=$(get_timestamp)
  
  if [ "$CURR_TIMESTAMP" != "$PREV_TIMESTAMP" ]; then
    echo "🔄 [$((COUNTER * 2))s] Change detected in $ENV_FILE"
    echo "⏳ Syncing secrets..."
    echo ""
    
    if bash scripts/sync-env-secrets.sh; then
      echo ""
      echo "✅ Synced and ready!"
    else
      echo ""
      echo "⚠️  Sync had errors (check output above)"
    fi
    
    PREV_TIMESTAMP="$CURR_TIMESTAMP"
    echo ""
    echo "👁️  Watching for more changes..."
  fi
done
