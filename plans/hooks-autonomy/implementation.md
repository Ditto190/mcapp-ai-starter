# hooks-autonomy

## Goal
Provide repository-level hook scripts and automation to handle session lifecycle events (sessionStart, autosave, session-logging, session-auto-commit) and to detect/update the devcontainer configuration automatically.

## Prerequisites
Make sure you are on branch `hooks-autonomy`. If it doesn't exist, create it from `main`:

- git checkout -b hooks-autonomy main

### Step-by-Step Instructions

#### Step 1: Add top-level hooks.json entries
- [ ] Create or update `.github/hooks/hooks.json` with entries for the events below.
- [ ] Copy and paste code below into `.github/hooks/hooks.json`:

```json
{
  "version": 1,
  "hooks": {
    "sessionStart": [
      {
        "type": "command",
        "bash": "session-logger/log-session-start.sh",
        "cwd": ".",
        "timeoutSec": 10
      }
    ],
    "sessionEnd": [
      {
        "type": "command",
        "bash": "session-logger/log-session-end.sh",
        "cwd": ".",
        "timeoutSec": 10
      }
    ],
    "userPromptSubmitted": [
      {
        "type": "command",
        "bash": "session-logger/log-prompt.sh",
        "cwd": ".",
        "env": { "LOG_LEVEL": "INFO" },
        "timeoutSec": 10
      }
    ],
    "sessionAutosave": [
      {
        "type": "command",
        "bash": "session-autosave/auto-save.sh",
        "cwd": ".",
        "timeoutSec": 60
      }
    ],
    "sessionAutoCommit": [
      {
        "type": "command",
        "bash": "session-auto-commit/auto-commit.sh",
        "cwd": ".",
        "timeoutSec": 60
      }
    ],
    "devcontainerUpdate": [
      {
        "type": "command",
        "bash": "devcontainer-update/check-devcontainer.sh",
        "cwd": ".",
        "timeoutSec": 60
      }
    ]
  }
}
```

##### Step 1 Verification Checklist
- [ ] `.github/hooks/hooks.json` exists and includes all listed events
- [ ] Paths point to scripts under `.github/hooks/<component>/` exactly

**STOP & COMMIT:** Commit this file and continue after verification.

#### Step 2: Add session-logger scripts
- [ ] Create `.github/hooks/session-logger/log-session-start.sh` with the content below

```bash
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
if [ -x "./.github/hooks/session-autosave/auto-save.sh" ]; then
  nohup ./.github/hooks/session-autosave/auto-save.sh >/dev/null 2>&1 &
fi

echo "session-start-logged:$TS"
```

- [ ] Create `.github/hooks/session-logger/log-session-end.sh` with the content below

```bash
#!/usr/bin/env bash
set -euo pipefail
LOG_DIR=".session/logs"
mkdir -p "$LOG_DIR"
TS=$(date --utc +"%Y-%m-%dT%H:%M:%SZ")
USER_NAME="${GIT_AUTHOR_NAME:-$(git config user.name || echo unknown)}"

cat >> "$LOG_DIR/end.log" <<EOF
$TS | END | user=$USER_NAME cwd=$(pwd)
EOF

echo "session-end-logged:$TS"
```

- [ ] Create `.github/hooks/session-logger/log-prompt.sh` with the content below

```bash
#!/usr/bin/env bash
set -euo pipefail
LOG_DIR=".session/logs"
mkdir -p "$LOG_DIR"
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

# Truncate very long prompts to 4096 chars
PROMPT_TEXT_SHORT=$(printf "%s" "$PROMPT_TEXT" | cut -c1-4096)

cat >> "$LOG_DIR/prompts.log" <<EOF
$TS | PROMPT | level=$LOG_LEVEL | user=$USER_NAME | prompt="$PROMPT_TEXT_SHORT"
EOF

echo "prompt-logged:$TS"
```

##### Step 2 Verification Checklist
- [ ] Each script is executable (chmod +x)
- [ ] Running scripts manually produces files under `.session/logs/`

**STOP & COMMIT:** Commit scripts and verify by running them manually.

#### Step 3: Add autosave script
- [ ] Create `.github/hooks/session-autosave/auto-save.sh` and make executable

```bash
#!/usr/bin/env bash
set -euo pipefail

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
```

- [ ] Verification:
  - [ ] Run `./.github/hooks/session-autosave/auto-save.sh` and confirm `.session/snapshots/snapshot-*.tar.gz` exists

**STOP & COMMIT:** Commit autosave script.

#### Step 4: Add session-auto-commit script
- [ ] Create `.github/hooks/session-auto-commit/auto-commit.sh` with the content below

```bash
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
  for f in $CHANGED; do
    if printf "%s\n" "$f" | grep -Eq "^${pattern//\*/.*}$"; then
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
```

- [ ] Create `.github/hooks/session-auto-commit/whitelist.txt` and add safe globs (one per line). Example content below:

```
.session/**
package-lock.json
package.json
README.md
```

##### Step 4 Verification Checklist
- [ ] Make a safe change (e.g., update README.md), run script and verify a new branch is created and a commit with [session-auto] exists

**STOP & COMMIT:** Commit auto-commit script and whitelist file.

#### Step 5: Devcontainer update detection and PR creation
- [ ] Create `.github/hooks/devcontainer-update/check-devcontainer.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail

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
  if command -v ./.github/hooks/devcontainer-update/create-pr.sh >/dev/null 2>&1; then
    ./.github/hooks/devcontainer-update/create-pr.sh "$DEV_DIR" "Detected devcontainer change"
  fi
  echo "devcontainer-change-detected"
else
  echo "devcontainer-no-change"
fi
```

- [ ] Create `.github/hooks/devcontainer-update/create-pr.sh` which attempts to create a PR draft via `gh` if available, else creates a branch and stages files for manual PR

```bash
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
```

##### Step 5 Verification Checklist
- [ ] Modify `.devcontainer/` and run `check-devcontainer.sh`; script should detect change and either create a PR draft or create a branch

**STOP & COMMIT:** Commit devcontainer check scripts.

#### Step 6: Integrate and make scripts executable
- [ ] Ensure all scripts are placed under `.github/hooks/<component>/` exactly as referenced in `.github/hooks/hooks.json`
- [ ] Run the following commands in repo root:

```bash
chmod +x .github/hooks/session-logger/*.sh
chmod +x .github/hooks/session-autosave/*.sh
chmod +x .github/hooks/session-auto-commit/*.sh
chmod +x .github/hooks/devcontainer-update/*.sh

# Add and commit
git add .github/hooks/hooks.json .github/hooks/session-logger .github/hooks/session-autosave .github/hooks/session-auto-commit .github/hooks/devcontainer-update
git commit -m "Add session lifecycle hooks and automation\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>" || echo "Nothing to commit"
```

##### Step 6 Verification Checklist
- [ ] `ls -la .github/hooks` shows component folders and `hooks.json`
- [ ] All scripts are executable

#### Step 7: Testing
- [ ] Manual tests to run:
  - [ ] Run `./.github/hooks/session-logger/log-session-start.sh` and verify `.session/logs/start.log` receives an entry
  - [ ] Run `./.github/hooks/session-logger/log-prompt.sh` with a short string (or pipe input) and verify `.session/logs/prompts.log` contains the prompt
  - [ ] Run autosave script and verify snapshot tarball under `.session/snapshots`
  - [ ] Make a safe change (whitelisted), run auto-commit script and confirm a branch with `[session-auto]` commit exists
  - [ ] Modify `.devcontainer/` and run check-devcontainer.sh to verify detection and PR creation or branch creation

##### Step 7 Verification Checklist
- [ ] All manual checks above pass
- [ ] No unexpected files committed beyond whitelist

#### Step 8: Documentation
- [ ] Add a short README at `.github/hooks/README.md` describing how hooks work, how to simulate events, and how to opt-out (e.g., set DISABLE_SESSION_HOOKS=1 in environment)

Example README snippet to add:

```
# Repository Hooks

This directory contains repository-level hooks configuration used by local automation and CI.

- `.github/hooks/hooks.json` — hook event map for tools that run repo hooks
- `session-logger/` — scripts for logging session lifecycle events
- `session-autosave/` — snapshot autosave script
- `session-auto-commit/` — whitelisted auto-commit helper
- `devcontainer-update/` — detect devcontainer changes and create PRs

To simulate a hook, run the script directly from the repository root, e.g.: `./.github/hooks/session-logger/log-session-start.sh`
```

##### Step 8 Verification Checklist
- [ ] README exists and mentions simulation commands and opt-out env var

## Technology stack and commands
- Shell scripts (POSIX / bash) for hooks
- Git CLI required; `gh` CLI recommended for automated PR creation (optional)
- Node ecosystem (TypeScript) — build/test commands for project:
  - Install: `npm install`
  - Build: `npm run build`
  - Test: `npm test`

## Final verification
- [ ] Run the manual tests from Step 7
- [ ] Commit all created files


---

All files referenced are complete, copy-paste ready. After placing them in the repository and marking executable, run the manual verification checklist above. Save this document as `plans/hooks-autonomy/implementation.md`.
