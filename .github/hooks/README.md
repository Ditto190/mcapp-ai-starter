# Repository Hooks

This directory contains repository-level hooks configuration used by local automation and CI.

- `.github/hooks/hooks.json` — hook event map for tools that run repo hooks
- `session-logger/` — scripts for logging session lifecycle events
- `session-autosave/` — snapshot autosave script
- `session-auto-commit/` — whitelisted auto-commit helper
- `devcontainer-update/` — detect devcontainer changes and create PRs

To simulate a hook, run the script directly from the repository root, e.g.: `./.github/hooks/session-logger/log-session-start.sh`

To opt-out, set `DISABLE_SESSION_HOOKS=1` in your environment before running scripts.
