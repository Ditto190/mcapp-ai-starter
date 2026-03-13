#!/usr/bin/env bash
# .claude/hooks/pre-bash.sh
# PreToolUse hook: Validate before Bash execution
# Purpose: Block dangerous commands, validate cloud-safe operations

set -Eeuo pipefail

INPUT=$(cat)

# Extract the command Claude is about to run
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // ""')

# Cloud environment restrictions:
# 1. Block rm -rf / or similar destructive patterns
# 2. Block network enumeration (nmap, etc.)
# 3. Warn on long-running ops

# Check for destructive patterns
if echo "$COMMAND" | grep -qE "(rm -rf|sudo rm|mkfs|dd if=/dev|drop table|DELETE FROM)"; then
  echo "Blocked: Command appears destructive or unauthorized" >&2
  exit 2  # Exit 2 = block the action
fi

# Warn on long operations (builds, full tests)
if echo "$COMMAND" | grep -qE "(npm install[^a-z]|pip install[^a-z]|cargo build|make|docker build)"; then
  echo "Note: This build operation may take time in the cloud environment" >&2
fi

# Allow everything else
exit 0