Summary of recent agent customization work (2026-04-04)

Technical steps performed:

- Updated `AGENTS.md` to add a "Prompt examples" section with example Copilot Chat queries for searching and loading awesome-copilot agent/instruction templates.
- Created `.github/instructions/search-awesome-copilot.instructions.md` documenting the search/load workflow and how to invoke it from Copilot Chat, a VS Code task, or a hook.
- Added helper scripts: `scripts/run_search_instructions.ps1` (helper) and `scripts/search_hook.ps1` (hook simulator).
- Added a hook descriptor `.github/hooks/search-awesome-copilot.hook.json` (descriptive only) and a VS Code task (`Search Awesome-Copilot`) in `.vscode/tasks.json`.
- Created `.github/agents/awesome-copilot-search.agent.md` earlier as a local helper agent for discover/load workflows.
- Fetched `agents.instructions.md` and `custom-agent-foundry.agent.md` from the awesome-copilot index via the load-instruction tool; saved copies exist in the VS Code workspace storage session for review.

Functional steps:

- Verified scripts run locally: executed `run_search_instructions.ps1` and `search_hook.ps1` successfully; they print guidance and locate cached results.
- Verified the VS Code task can run the helper script (task added to `.vscode/tasks.json`).
- Attempted remote loads for some instructions; one load hit an SSL error and was retried for other files successfully.

Configuration steps:

- Added a non-destructive workflow: scripts are intentionally read-only; loaded instructions must be reviewed manually before committing.
- Hook descriptor added as metadata; environment-specific hook runner is required to actually run `scripts/search_hook.ps1` automatically.
- Tasks.json updated to include the new task without removing existing tasks.

Lessons learned / notes:

- ContextStream / MCP endpoints were intermittently unavailable (Error 522) when trying to save data to `mcp_contextstream2_memory`; operations failed and timed out. Retrying later is recommended.
- Always review frontmatter `tools` fields and `description` of fetched agent instructions before adding them to the repository—external agents may request wide tool access.
- Keep helper scripts non-destructive by default; require an explicit manual review and commit step to add external agents to the repo.
- When automating hooks that call external services, include robust retry/backoff and a local caching fallback for resilience.

Next steps suggested:

1. Retry saving the above summary and the AGENTS.md change to the ContextStream memory once the service is reachable.
2. Optionally extract specific trigger phrases from loaded instructions and append them to `copilot-chat.agent.md` and `copilot-chat.prompt.md`.
3. If desired, implement an approved gating workflow that auto-creates PRs for vetted agent additions (not auto-commit).

Files changed:

- `AGENTS.md` (prompt examples added)
- `.github/instructions/search-awesome-copilot.instructions.md`
- `scripts/run_search_instructions.ps1`
- `scripts/search_hook.ps1`
- `.github/hooks/search-awesome-copilot.hook.json`
- `.vscode/tasks.json` (task added)
- `.github/agents/awesome-copilot-search.agent.md` (helper agent)

Status: Local backup created because remote ContextStream memory calls failed.
