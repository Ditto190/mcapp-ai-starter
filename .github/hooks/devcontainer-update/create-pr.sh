#!/usr/bin/env bash
set -euo pipefail
TARGET_DIR="$1"
TITLE="${2:-Devcontainer updates}"
TS=$(date --utc +"%Y%m%dT%H%M%SZ")
BRANCH="devcontainer-update-$TS"

# Create commit with the changed devcontainer files
git checkout -b "$BRANCH"
git add -- "$TARGET_DIR"
git commit -m "[devcontainer-update] changes detected: $TS" || echo "Nothing to commit"

if command -v gh >/dev/null 2>&1; then
  git push --set-upstream origin "$BRANCH" || true
  gh pr create --title "$TITLE" --body "Automated devcontainer update detected." --draft || true
  echo "pr-created:$BRANCH"
else
  echo "Branch $BRANCH created locally. Push and create PR manually."
fi
