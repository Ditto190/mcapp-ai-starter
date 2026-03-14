#!/usr/bin/env bash
# Session start helper for workspace
# - sources `activate-skillkit.sh`
# - loads `.env` into environment (exports variables)
# - starts a simple command logger via PROMPT_COMMAND and records start/stop

WORKSPACE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SESSION_LOG="$WORKSPACE_ROOT/.workspace/session.log"

# Source the main activate helper (sets PATH and SKILLKIT_HOME)
if [ -f "$WORKSPACE_ROOT/.workspace/activate-skillkit.sh" ]; then
  # shellcheck disable=SC1090
  source "$WORKSPACE_ROOT/.workspace/activate-skillkit.sh"
fi

# Load .env variables (if any) into exported environment
if [ -f "$WORKSPACE_ROOT/.env" ]; then
  # export variables defined in .env (simple KEY=VALUE lines)
  set -o allexport
  # shellcheck disable=SC1090
  source "$WORKSPACE_ROOT/.env"
  set +o allexport
  echo "[skillkit] loaded .env into environment" >> "$SESSION_LOG" 2>/dev/null || true
fi

# Start session logging: append session start
mkdir -p "$(dirname "$SESSION_LOG")"
echo "==== SESSION START: $(date -Is) PID=$$ USER=${USER:-unknown} PWD=${PWD} ====" >> "$SESSION_LOG"

# Preserve existing PROMPT_COMMAND
OLD_PROMPT_COMMAND=${PROMPT_COMMAND:-}

# Append a logging hook that writes the last command with timestamp
export PROMPT_COMMAND=''
PROMPT_LOGGER='printf "%s %s\n" "$(date -Is)" "$(history 1 | sed "s/^[ ]*[0-9]*[ ]*//")" >> "$SESSION_LOG"'
if [ -n "$OLD_PROMPT_COMMAND" ]; then
  export PROMPT_COMMAND="$PROMPT_LOGGER; $OLD_PROMPT_COMMAND"
else
  export PROMPT_COMMAND="$PROMPT_LOGGER"
fi

# Ensure cleanup on shell exit: restore PROMPT_COMMAND and write session end
cleanup_session() {
  export PROMPT_COMMAND="$OLD_PROMPT_COMMAND"
  echo "==== SESSION END: $(date -Is) PID=$$ ====" >> "$SESSION_LOG"
}

trap cleanup_session EXIT

export SKILLKIT_SESSION_LOG="$SESSION_LOG"
