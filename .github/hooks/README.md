# Repository Hooks — Onboarding

Purpose
- Lightweight repository automation for session lifecycle, autosave, safe auto-commits and devcontainer drift detection.

What’s included
- `.github/hooks/hooks.json` — event → script map
- `.github/hooks/session-logger/` — log sessionStart, sessionEnd, userPromptSubmitted
- `.github/hooks/session-autosave/auto-save.sh` — snapshot tracked files to `.session/snapshots`
- `.github/hooks/session-auto-commit/` — whitelist-based auto-commit helper
- `.github/hooks/devcontainer-update/` — detect `.devcontainer` changes and create PR branch

How it works (summary)
- Tools or agents trigger events; `hooks.json` maps events (sessionStart, sessionEnd, userPromptSubmitted, sessionAutosave, sessionAutoCommit, devcontainerUpdate) to scripts under `.github/hooks/`.
- sessionStart: logs start and optionally launches autosave in background.
- sessionEnd: logs end event.
- userPromptSubmitted: accepts prompt on stdin or as arg and appends to prompts log.
- sessionAutosave: creates timestamped tarball of tracked files under `.session/snapshots`.
- sessionAutoCommit: commits only files matching `.github/hooks/session-auto-commit/whitelist.txt`, creates a branch named `session-autosave-<ts>`, and attempts to create a draft PR if the `gh` CLI is present.
- devcontainerUpdate: computes a hash of `.devcontainer` and runs the create-pr helper when drift is detected.

Quick commands (simulate)
- Log session start:
  `./.github/hooks/session-logger/log-session-start.sh`
- Log a prompt (pipe):
  `echo "My prompt" | ./.github/hooks/session-logger/log-prompt.sh`
- Run autosave:
  `./.github/hooks/session-autosave/auto-save.sh`
- Run auto-commit (after safe change):
  `./.github/hooks/session-auto-commit/auto-commit.sh`
- Check devcontainer:
  `./.github/hooks/devcontainer-update/check-devcontainer.sh`

Safety & operational notes
- Auto-commit will only commit whitelisted paths. Never add new whitelist entries without a human review.
- Scripts attempt to push and create PRs only if `gh` CLI is available and authenticated.
- To opt-out for privacy/tests set `DISABLE_SESSION_HOOKS=1` or `SKIP_LOGGING=true` in the environment.
- Logs and artifacts:
  - Logs: `.session/logs/` or `logs/copilot/session.log` (depending on installed logger)
  - Snapshots: `.session/snapshots/*.tar.gz`
  - Auto-commit branches: `git branch --list "session-autosave*"`
- Troubleshooting: run scripts directly to see stdout/stderr; ensure scripts are executable (`chmod +x .github/hooks/**/**/*.sh`).

Contact & expectations
- Agents must not push non-whitelisted files automatically; require human approval for broader changes.
- Use branch naming conventions: `session-autosave-<timestamp>`, `devcontainer-update-<timestamp>`.

Appendix: Recommended AGENTS.md block to add

```
Hooks automation (agent guidance)
- Purpose: lightweight session lifecycle automations for logging, autosave, safe commits, and devcontainer checks.
- When to call:
  - On session start: run ./.github/hooks/session-logger/log-session-start.sh
  - When sending user prompts: pipe prompt to ./.github/hooks/session-logger/log-prompt.sh
  - Periodically or on-demand: run ./.github/hooks/session-autosave/auto-save.sh
  - To persist safe changes: run ./.github/hooks/session-auto-commit/auto-commit.sh (only whitelisted paths will be committed)
  - To detect devcontainer drift: run ./.github/hooks/devcontainer-update/check-devcontainer.sh
- Safety rules:
  - Never modify whitelist.txt without human review.
  - Do not push non-whitelisted changes automatically.
  - If gh CLI is available and used, create PRs as drafts and mention a human reviewer.
  - To disable behavior for tests/privacy set DISABLE_SESSION_HOOKS=1.
- Verification:
  - Check .session/ and local branch list after simulations.
  - Ask a human before creating commits or PRs outside whitelisted paths.
```

This block was also appended to AGENTS.md in the repository to provide guidance for agents and humans on how to safely use the hooks automation. If you'd like a separate `.github/hooks/ONBOARDING.md` file created with expanded onboarding steps, tell me and I will add it.
