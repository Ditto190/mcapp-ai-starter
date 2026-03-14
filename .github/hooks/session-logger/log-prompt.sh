#!/usr/bin/env bash
set -euo pipefail

LOG_DIR=".session/logs"
mkdir -p "$LOG_DIR"
TS=$(date --utc +"%Y-%m-%dT%H:%M:%SZ")
USER_NAME="${GIT_AUTHOR_NAME:-$(git config user.name || echo unknown)}"
LOG_LEVEL="${LOG_LEVEL:-INFO}"

# Read prompt from stdin if available, else from first arg
PROMPT_TEXT=""
if [ -t 0 ]; then
  PROMPT_TEXT="${1-}"
else
  PROMPT_TEXT=$(cat -)
fi

# Truncate very long prompts to 4096 chars
PROMPT_TEXT_SHORT=$(printf "%s" "$PROMPT_TEXT" | cut -c1-4096)

cat >> "$LOG_DIR/prompts.log" <<EOF
$TS | PROMPT | level=$LOG_LEVEL | user=$USER_NAME | prompt="$PROMPT_TEXT_SHORT"
EOF

echo "prompt-logged:$TS"
#!/bin/bash

# Log user prompt submission

set -euo pipefail

# Skip if logging disabled
if [[ "${SKIP_LOGGING:-}" == "true" ]]; then
  exit 0
fi

# Read input from Copilot (contains prompt info)
INPUT=$(cat)

# Create logs directory if it doesn't exist
mkdir -p logs/copilot

# Extract timestamp
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Log prompt (you can parse INPUT for more details)
echo "{\"timestamp\":\"$TIMESTAMP\",\"event\":\"userPromptSubmitted\",\"level\":\"${LOG_LEVEL:-INFO}\"}" >> logs/copilot/prompts.log

exit 0
