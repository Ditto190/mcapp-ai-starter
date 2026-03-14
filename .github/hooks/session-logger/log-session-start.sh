#!/usr/bin/env bash
set -euo pipefail

LOG_DIR=".session/logs"
mkdir -p "$LOG_DIR"
TS=$(date --utc +"%Y-%m-%dT%H:%M:%SZ")
USER_NAME="${GIT_AUTHOR_NAME:-$(git config user.name || echo unknown)}"
HOSTNAME="$(hostname 2>/dev/null || echo unknown)"

cat >> "$LOG_DIR/start.log" <<EOF
$TS | START | user=$USER_NAME host=$HOSTNAME cwd=$(pwd)
EOF

# spawn autosave in background if configured
if [ "${ENABLE_SESSION_AUTOSAVE:-0}" = "1" ] && [ -x "./.github/hooks/session-autosave/auto-save.sh" ]; then
  nohup ./.github/hooks/session-autosave/auto-save.sh >/dev/null 2>&1 &
else
  # Autosave disabled by default to avoid large snapshots; enable with ENABLE_SESSION_AUTOSAVE=1
  :
fi

echo "session-start-logged:$TS"
