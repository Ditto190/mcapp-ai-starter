#!/bin/bash

# Governance Audit: Log session start with governance context

set -euo pipefail

# Attach session logging: ensure session-end is called on exit, then log start
if [ -x ".github/hooks/session-logger/log-session-end.sh" ]; then
  trap '.github/hooks/session-logger/log-session-end.sh || true' EXIT
fi
if [ -x ".github/hooks/session-logger/log-session-start.sh" ]; then
  .github/hooks/session-logger/log-session-start.sh || true
fi

if [[ "${SKIP_GOVERNANCE_AUDIT:-}" == "true" ]]; then
  exit 0
fi

INPUT=$(cat)

mkdir -p logs/copilot/governance

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
CWD=$(pwd)
LEVEL="${GOVERNANCE_LEVEL:-standard}"

jq -Rn \
  --arg timestamp "$TIMESTAMP" \
  --arg cwd "$CWD" \
  --arg level "$LEVEL" \
  '{"timestamp":$timestamp,"event":"session_start","governance_level":$level,"cwd":$cwd}' \
  >> logs/copilot/governance/audit.log

echo "🛡️ Governance audit active (level: $LEVEL)"
exit 0
