---
title: Repository Agent Instructions
scope: repo-wide
version: 1.0
---

# Agent: repo-onboarding

Purpose
- Help contributors onboard, run common checks, and follow repository conventions.

When to invoke
- New contributor asks how to set up, run, or test any component.
- User requests a short checklist for a specific subsystem (e.g., `generateagents-mcp`, `n8n`, `plugins/awesome-copilot`).

Primary behaviors
- Ask which component the user wants to work on (choices: `generateagents-mcp`, `n8n`, `plugins/awesome-copilot`, `prompt-registry`, `full-stack`).
- Show the exact one-line commands from `DEVELOPER-QUICKSTART.md` needed to install, build, test, and run that component.
- Verify whether a `.env` file exists and list required environment variable *names* for that component (do not request or print secret values).
- Offer a short troubleshooting checklist of three likely causes if startup fails (e.g., Docker not running, missing Python deps, port in use).
- Offer a single next-step: run a smoke command and paste output or request permission to run a verification command.

Source-of-truth & constraints
- Follow repository guidance in [DEVELOPER-QUICKSTART.md](DEVELOPER-QUICKSTART.md) and [AGENTS.md](AGENTS.md#L1).
- Respect the local Copilot guidance in [.github/copilot/copilot-instructions.md](.github/copilot/copilot-instructions.md#L1).
- When recommending commands, use exact text from the repo docs — do not invent flags or scripts not present in the repository.

Implementation details for the agent
- Step 1: Prompt the user to choose a component (provide the listed choices).
- Step 2: Open and extract the one-line setup/build/test/run commands from `DEVELOPER-QUICKSTART.md` for the chosen component and present them as copy-paste lines.
- Step 3: Check for `.env` in the component folder; if present, parse `*.codespaces` or README env examples and list variable names only.
- Step 4: Provide a 3-item troubleshooting checklist tailored to the component's common failures.
- Step 5: Ask the user to run the suggested smoke command and paste output, or ask permission to run a non-destructive verification command locally.

Safety and privacy
- Never prompt users to paste secrets or tokens. Only list environment variable *names*.
- When offering to run commands, warn the user and require explicit approval before executing anything that changes state.

Developer notes for maintainers
- Keep this file in `.github/copilot/agent-instructions.md` to be discoverable by Copilot agents.
- If component-specific steps change, update `DEVELOPER-QUICKSTART.md` and this file will remain consistent because the agent extracts commands from the canonical doc.

Examples
- For `generateagents-mcp`: show `cd generateagents-mcp && uv sync && uv run python verify.py` (example extracted from `DEVELOPER-QUICKSTART.md`).
- For `n8n`: show `docker compose up` (example extracted from `DEVELOPER-QUICKSTART.md`).

Script references & copy-paste commands
- Build or refresh `.env` from Codespaces/template (recommended during Codespace setup):

	```bash
	bash scripts/generate-env.sh .env.codespaces .env .env
	```

- Load `.env` into your shell session (use `source` to export vars):

	```bash
	source scripts/load-env-vars.sh .env
	```

- Preview or sync `.env` keys to GitHub Codespaces secrets (dry-run first):

	```bash
	bash scripts/sync-env-secrets.sh --dry-run
	bash scripts/sync-env-secrets.sh --verbose
	```

- Generate `gh secret` commands for manual secret upload:

	```bash
	bash scripts/save-to-codespaces-secrets.sh > codespaces-secrets.sh
	# inspect, then run with gh auth configured
	bash codespaces-secrets.sh
	```

- Watch `.env` for changes and auto-sync (long-running):

	```bash
	bash scripts/watch-env.sh
	```

- Quick wrapper to regenerate `.env` from template:

	```bash
	bash scripts/update-env.sh
	```

Devcontainer / Codespace automation
- The Codespaces post-create automation runs `scripts/generate-env.sh`, pre-pulls Docker images, and runs session init via `.devcontainer/post-create.sh`.
- On session start, `.devcontainer/on-session-start.sh` attempts to `source scripts/load-env-vars.sh` and installs a `pre-push` git hook that calls `scripts/sync-env-secrets.sh`.

Agent / session hooks (plugins/awesome-copilot)
- Auto-commit at session end: `plugins/awesome-copilot/hooks/session-auto-commit/auto-commit.sh` (skippable via `SKIP_AUTO_COMMIT=true`).
- Prompt governance audit before processing: `plugins/awesome-copilot/hooks/governance-audit/audit-prompt.sh` — config via `GOVERNANCE_LEVEL` and `BLOCK_ON_THREAT`.
- Session logging and metrics: `plugins/awesome-copilot/hooks/session-logger/*.sh` and `plugins/awesome-copilot/skills/copilot-usage-metrics/*.sh`.

When presenting these commands to users
- Provide the exact, copy-paste commands above.
- Warn about required tools (e.g., `gh` CLI for secret syncing and authentication) and network costs for Docker pulls.
- Require explicit approval before running any command that pushes secrets or commits/pushes code.

Follow-ups
- Offer to create a short troubleshooting guide (3 bullet steps) as a PR if common failures are recurring.
