#!/usr/bin/env bash
set -euo pipefail

LOG_DIR=".session/logs"
mkdir -p "$LOG_DIR"
TS=$(date --utc +"%Y-%m-%dT%H:%M:%SZ")
USER_NAME="${GIT_AUTHOR_NAME:-$(git config user.name || echo unknown)}"

cat >> "$LOG_DIR/end.log" <<EOF
$TS | END | user=$USER_NAME cwd=$(pwd)
EOF

echo "session-end-logged:$TS"
#!/bin/bash

# Log session end event

set -euo pipefail

# Skip if logging disabled
if [[ "${SKIP_LOGGING:-}" == "true" ]]; then
  exit 0
fi

# Read input from Copilot
INPUT=$(cat)

# Create logs directory if it doesn't exist
mkdir -p logs/copilot

# Extract timestamp
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Log session end
echo "{\"timestamp\":\"$TIMESTAMP\",\"event\":\"sessionEnd\"}" >> logs/copilot/session.log

echo "📝 Session end logged"
exit 0
