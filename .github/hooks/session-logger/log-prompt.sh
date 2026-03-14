#!/usr/bin/env bash
set -euo pipefail

LOG_DIR=".session/logs"
mkdir -p "$LOG_DIR"

# Rotate prompts log if it exceeds 5MB to avoid unbounded growth
PROMPTS_FILE="$LOG_DIR/prompts.log"
if [ -f "$PROMPTS_FILE" ]; then
  SIZE=$(wc -c < "$PROMPTS_FILE" || echo 0)
  MAX=$((5 * 1024 * 1024))
  if [ "$SIZE" -gt "$MAX" ]; then
    ROT_TS=$(date --utc +"%Y%m%dT%H%M%SZ")
    mv "$PROMPTS_FILE" "$LOG_DIR/prompts.log.$ROT_TS"
    gzip -f "$LOG_DIR/prompts.log.$ROT_TS" || true
  fi
fi
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

# Preserve full prompt text (Copilot chat payloads can be large JSON)
PROMPT_TEXT_RAW=$(printf "%s" "$PROMPT_TEXT")

cat >> "$LOG_DIR/prompts.log" <<EOF
$TS | PROMPT | level=$LOG_LEVEL | user=$USER_NAME | prompt="$PROMPT_TEXT_RAW"
EOF

echo "prompt-logged:$TS"
