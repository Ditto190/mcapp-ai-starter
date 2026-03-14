#!/usr/bin/env bash
set -euo pipefail

# auto-commit only whitelisted paths to avoid accidental commits
BASE_DIR="."
WHITELIST_FILE=".github/hooks/session-auto-commit/whitelist.txt"
TS=$(date --utc +"%Y-%m-%dT%H:%M:%SZ")
BRANCH="session-autosave-$(date +%Y%m%dT%H%M%S)"

if [ ! -f "$WHITELIST_FILE" ]; then
  echo "# Add newline-separated glob patterns to allow committing only safe files" > "$WHITELIST_FILE"
  echo ".session/**" >> "$WHITELIST_FILE"
  echo "package-lock.json" >> "$WHITELIST_FILE"
  echo "package.json" >> "$WHITELIST_FILE"
  echo "README.md" >> "$WHITELIST_FILE"
fi

# Collect changed files
CHANGED=$(git status --porcelain --untracked-files=no | awk '{print $2}')
if [ -z "$CHANGED" ]; then
  echo "No changed tracked files to commit"
  exit 0
fi

# Build list of allowed changed files
ALLOWED=()
while IFS= read -r pattern || [ -n "$pattern" ]; do
  pattern=$(echo "$pattern" | sed '/^#/d' | sed '/^[[:space:]]*$/d')
  if [ -z "$pattern" ]; then continue; fi
  # convert glob to regex (simple star handling)
  regex="^${pattern//\*/.*}$"
  for f in $CHANGED; do
    if printf "%s\n" "$f" | grep -Eq "$regex"; then
      ALLOWED+=("$f")
    fi
  done
done < "$WHITELIST_FILE"

if [ ${#ALLOWED[@]} -eq 0 ]; then
  echo "No allowed changed files to commit"
  exit 0
fi

# Create branch and commit allowed files
git checkout -b "$BRANCH"
for f in "${ALLOWED[@]}"; do
  git add -- "$f"
done

git commit -m "[session-auto] save snapshot $TS" || echo "Nothing to commit"

# Try to push; if gh is available, create a PR draft
if command -v gh >/dev/null 2>&1; then
  git push --set-upstream origin "$BRANCH" || true
  gh pr create --fill --title "[session-auto] workspace snapshot $TS" --body "Automated session autosave snapshot." --draft || true
else
  echo "gh CLI not found; branch $BRANCH created locally. Push and create PR manually if desired."
fi

echo "auto-commit-done: $BRANCH"
