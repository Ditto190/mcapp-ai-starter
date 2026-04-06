---
name: search-awesome-copilot
description: "Instructions to search and load agent/instruction templates from the awesome-copilot index and recommended workflows to use them from Copilot Chat, a task, or a hook."
---

# Search & Load Awesome-Copilot Instructions

This instruction documents how your team can discover and load agent/instruction templates from the awesome-copilot collection during Copilot Chat sessions, from a VS Code task, or via a repository hook.

Why

- Reuse community agent templates and patterns
- Speed up onboarding by providing tested agent designs
- Make it easy to preview and integrate external agents safely

What these files do

- `scripts/run_search_instructions.ps1` — helper script that prints quick instructions and shows how to call the built-in awesome-copilot search/load functions from Copilot Chat (human-facing). Also demonstrates how to fetch previously cached search results when available.
- `scripts/search_hook.ps1` — script intended to be invoked by a hook; prints a short summary and points to the agent loader steps.
- `scripts/build_agent_index.py` — builds a workspace index of agents/instructions/prompts/skills/hooks and awesome-copilot cached artifacts.
- `scripts/register_awesome_asset.py` — registers a loaded awesome-copilot artifact into local cache and append-only logs.
- `scripts/watch_agent_index.ps1` — file watcher that auto-runs indexing when agent-related files are created/edited/deleted.
- `scripts/regenerate_from_registry.py` — reconstructs project-level agent assets from logged registry entries.
- `.vscode/tasks.json` — defines a task `Search Awesome-Copilot` that runs the helper script in a terminal.
- `.github/hooks/search-awesome-copilot.hook.json` — hook metadata (descriptive); the actual hook behavior is implemented by `scripts/search_hook.ps1`. Review before enabling in any automated system.

Definitive storage paths

- Local artifact cache: `.agents/registry/awesome/<mode>/<filename>`
- Latest index snapshot: `.agents/index/agent-assets.index.json`
- Index operation log: `.agents/index/agent-assets.log.jsonl`
- Awesome load log: `.agents/index/awesome-loads.jsonl`

How to use from Copilot Chat (recommended)

1. In Copilot Chat, ask: "Search awesome-copilot for 'repo architect'" or "Find agents for 'security review'". The `awesome-copilot-search` agent in this repo documents the exact prompts.
2. When a desirable result appears, ask to load the instruction (e.g., `Load 'repo-architect.agent.md'`). Review the fetched content before committing into your workspace.
3. Save the loaded file to disk (or use a cached `content.txt` path), then register it:
   `python scripts/register_awesome_asset.py --mode agents --filename repo-architect.agent.md --source-file <path-to-loaded-file> --query "repo architect"`
4. Rebuild the index:
   `python scripts/build_agent_index.py --reason register-awesome`
5. Optional cleanup/rebuild path: delete imported assets and regenerate from logs:
   `python scripts/regenerate_from_registry.py`

How to use via the VS Code task

1. Open the Command Palette (Ctrl+Shift+P) and run `Tasks: Run Task` → `Search Awesome-Copilot`.
2. The task runs `scripts/run_search_instructions.ps1` which prints guidance and, if you have a local cache of results, will display them.
3. Run `Tasks: Run Task` → `Build Agent Index` after registering assets.
4. Enable long-running auto-indexing with `Tasks: Run Task` → `Watch Agent Index` (also configured to start on folder open).
5. To reconstruct tracked assets from logs, run `Tasks: Run Task` → `Regenerate Assets From Registry`.

How to use as a hook (manual enable)

- Place `.github/hooks/search-awesome-copilot.hook.json` in the repository. This file is only a description; your CI or agent orchestration system must be configured to call `scripts/search_hook.ps1` at the desired lifecycle event (e.g., PreToolUse, PostToolUse).
- The hook script intentionally does not auto-write to the repo. It prints recommended next steps and a safe command to run to fetch/load instructions.

Safety notes

- Always review frontmatter `tools` and `description` of loaded agent files before adding them to the repo.
- Do not auto-commit fetched agents without a human review step.

Example prompts to type into Copilot Chat

- "Search awesome-copilot for 'repo architect' and show top 5 matches"
- "Load 'custom-agent-foundry.agent.md' and show me the frontmatter and recommended tools"

Contact

- If you want this workflow to automatically fetch and add vetted agents, discuss policies and tool restrictions with the team first and implement gating (PR + human approval).
