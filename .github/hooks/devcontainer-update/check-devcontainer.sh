#!/usr/bin/env bash
set -euo pipefail

# Attach session logging: ensure session-end is called on exit, then log start
if [ -x ".github/hooks/session-logger/log-session-end.sh" ]; then
  trap '.github/hooks/session-logger/log-session-end.sh || true' EXIT
fi
if [ -x ".github/hooks/session-logger/log-session-start.sh" ]; then
  .github/hooks/session-logger/log-session-start.sh || true
fi

# Simple devcontainer check: compute hash of .devcontainer content and compare to last-seen
DEV_DIR=".devcontainer"
STAMP_FILE=".session/devcontainer.hash"
mkdir -p "$(dirname "$STAMP_FILE")"

if [ ! -d "$DEV_DIR" ]; then
  echo "No .devcontainer directory present; skipping devcontainer update check"
  exit 0
fi

NEW_HASH=$(tar -c "$DEV_DIR" | sha1sum | awk '{print $1}')
OLD_HASH=""
if [ -f "$STAMP_FILE" ]; then
  OLD_HASH=$(cat "$STAMP_FILE")
fi

if [ "$NEW_HASH" != "$OLD_HASH" ]; then
  echo "$NEW_HASH" > "$STAMP_FILE"
  # Call PR creation helper (attempt to use gh if available)
  if [ -x ./.github/hooks/devcontainer-update/create-pr.sh ]; then
    ./.github/hooks/devcontainer-update/create-pr.sh "$DEV_DIR" "Detected devcontainer change"
  fi
  echo "devcontainer-change-detected"
else
  echo "devcontainer-no-change"
fi
