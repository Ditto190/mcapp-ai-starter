#!/usr/bin/env bash
set -euo pipefail

# Attach session logging: ensure session-end is called on exit, then log start
if [ -x ".github/hooks/session-logger/log-session-end.sh" ]; then
  trap '.github/hooks/session-logger/log-session-end.sh || true' EXIT
fi
if [ -x ".github/hooks/session-logger/log-session-start.sh" ]; then
  .github/hooks/session-logger/log-session-start.sh || true
fi

# Simple autosave: collect tracked files and create a timestamped tarball under .session/snapshots
SNAP_DIR=".session/snapshots"
mkdir -p "$SNAP_DIR"
TS=$(date --utc +"%Y%m%dT%H%M%SZ")
OUT="$SNAP_DIR/snapshot-$TS.tar.gz"

# Only snapshot tracked files for safety
FILES_TO_SNAPSHOT=$(git ls-files || echo "")
if [ -z "$FILES_TO_SNAPSHOT" ]; then
  echo "No tracked files to snapshot" >&2
  exit 0
fi

echo "$FILES_TO_SNAPSHOT" | tar -czf "$OUT" -T -
# Save a small index
echo "$TS" > "$SNAP_DIR/LATEST"
ls -lh "$OUT" || true

echo "snapshot-created:$OUT"
