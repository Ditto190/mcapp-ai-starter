#!/usr/bin/env bash
# Workspace activation helper — adds workspace `node_modules/.bin` to PATH
# Usage: `source .workspace/activate-skillkit.sh`

WORKSPACE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
export SKILLKIT_HOME="$WORKSPACE_ROOT/apps/skillkit"
export PATH="$WORKSPACE_ROOT/node_modules/.bin:$PATH"

if [ -t 1 ]; then
  echo "[skillkit] activated workspace helpers (SKILLKIT_HOME=$SKILLKIT_HOME)"
fi
