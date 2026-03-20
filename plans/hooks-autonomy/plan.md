Feature: hooks-autonomy

Branch: hooks-autonomy

Description:
Configure repository hooks and automation for session lifecycle and developer environment updates:
- sessionStart: detect session begin and record metadata
- autosave: periodically persist workspace state
- session-logging: record prompts and events
- session-auto-commit: automatically commit workspace changes under safe rules
- devcontainer-auto-update: detect and apply devcontainer updates (or notify)

Implementation Steps (numbered):
1) Research: gather where hooks, scripts, and devcontainer files live and existing patterns.
   Files touched: .github/hooks/hooks.json, .github/hooks/session-logger/*, package.json scripts
2) Add top-level hooks.json entries for: sessionStart, sessionEnd, userPromptSubmitted, sessionAutosave, sessionAutoCommit, devcontainerUpdate.
   Files: .github/hooks/hooks.json
3) Create session-logger scripts to log start/end/prompt events to logs/.session or GitHub Actions artifact path.
   Files: .github/hooks/session-logger/log-session-start.sh, log-session-end.sh, log-prompt.sh
4) Create autosave script and small state snapshotter (state saved to .session/snapshots/ with timestamp); schedule via sessionStart hook to run backgrounded with nohup.
   Files: .github/hooks/session-autosave/auto-save.sh
5) Create session-auto-commit scripts: detect safe changes (whitelisted files), run git add/commit with CI-safe message, and push to branch refs/session-autosave/<timestamp> or leave as local commit depending on config.
   Files: .github/hooks/session-auto-commit/auto-commit.sh
6) Devcontainer auto-update: add script to check devcontainer base image or config, create PR or update files when newer version detected. Also add a lightweight notifier to open issue or create PR draft.
   Files: .github/hooks/devcontainer-update/check-devcontainer.sh, .github/hooks/devcontainer-update/create-pr.sh
7) Integrate: ensure scripts executable, add docs, and add CI checks (optional) to validate hook scripts.
   Files: README.md under .github/hooks and plans/hooks-autonomy/implementation.md
8) Testing: Provide verification steps to simulate each hook (run scripts manually), validate autosave snapshots, verify auto-commit respects whitelist, and simulate devcontainer update detection.

Acceptance Criteria / Verification:
- All scripts are executable and present under .github/hooks/*
- .github/hooks/hooks.json lists all events and points to correct script paths
- Running log-session-start.sh produces a timestamped entry in .session/logs/start.log
- Autosave creates snapshots under .session/snapshots/ with sensible contents
- Auto-commit creates commits only for whitelisted paths and includes '[session-auto]' in commit message
- Devcontainer check script detects version drift and produces a PR draft or opens an issue

