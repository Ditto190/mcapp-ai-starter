#!/usr/bin/env bash
# .claude/hooks/session-compact.sh
# SessionStart hook: Fires when context is compacted/summarized
# Matcher: compact
# Purpose: Re-inject critical project context after Claude compresses conversation history

set -Eeuo pipefail

# When Claude's context window fills up and compacts conversation history,
# this hook re-injects essential project guidelines so Claude remembers
# after compaction.

{
  echo "## Project Context (Re-injected After Compaction)"
  echo ""
  
  # Critical conventions to remember
  echo "### Dependencies & Package Management"
  if [[ -f "package.json" ]]; then
    echo "- **Node:** Use \`npm ci\` (frozen lock) for installs"
    echo "- **Node:** Use frozen lockfiles (\`package-lock.json\`) always"
  fi
  if [[ -f "requirements.txt" ]] || [[ -f "uv.lock" ]]; then
    echo "- **Python:** Use \`uv sync\` or \`pip install -r requirements.txt\`"
    echo "- **Python:** Maintain frozen requirements across changes"
  fi
  echo ""

  # Testing expectations
  echo "### Testing & Quality"
  if [[ -f "pytest.ini" ]] || [[ -f "setup.cfg" ]]; then
    echo "- Run tests with \`pytest\` before committing"
  elif command -v npm &>/dev/null && npm run 2>&1 | grep -q "test"; then
    echo "- Run tests with \`npm test\` before committing"
  fi
  echo "- Maintain code coverage (target: >80%)"
  echo ""

  # Git conventions
  echo "### Git Workflow"
  BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")
  echo "- Current branch: \`$BRANCH\`"
  echo "- Use descriptive commit messages (conventional commits preferred)"
  echo "- Create PRs for review before merging"
  echo ""

  # File editing guidelines
  echo "### File Modification Rules"
  echo "- Never modify: \`.env\`, \`secrets/\`, \`*.key\`, dependency lock dirs"
  echo "- Safe to modify: \`src/\`, \`tests/\`, \`docs/\`, \`README.md\`"

} | head -50

exit 0