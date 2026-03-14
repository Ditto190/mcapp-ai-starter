## Workspace Agent Guidance

This repository includes workspace-level instruction files to guide Copilot-style assistants and workspace agents. Keep this file small and focused — it's the single place to find how agents should behave in this repo.

- **Primary stack:** TypeScript + React
- **Key tasks for agents:** code generation, tests scaffolding, example app maintenance, Playwright E2E helpers

Workspace helper profiles

- This workspace provides a Codespace profile helper that configures workspace
	shell behavior. Use `skillkit_list_profiles` and `skillkit_use_profile` to
	inspect and switch profiles. Profiles are `safe` (PATH only) and `full` (loads
	`.env` and enables session logging). See `README.skillkit.md` for details and
	security guidance.

Recommendations for agents and contributors

- Follow `.github/copilot-instructions.md` for general assistant conventions and quick commands.
- Use `examples/` when creating runnable demos and tests; prefer small, focused PRs.
- When adding new instruction files, include `description` and `applyTo` frontmatter and a 1–3 bullet context-engineering note if runtime data is required.

Quick links

- See workspace instructions: [.github/copilot-instructions.md](.github/copilot-instructions.md)
- Common places: `src/`, `examples/`, `.github/instructions/`

If you'd like, I can expand this with suggested `applyTo` globs for frontend/backends or create a short checklist template for new instruction files.

## Hooks Setup Checklist

1. Create hook config: Add a JSON config for your hook and place it under `.github/hooks/` as `<name>.json` (or for repo docs, use a folder `hooks/<name>/hooks.json`).

2. Define events & commands: In `hooks.json` set `version` and map events to commands (e.g., `preToolUse`, `postToolUse`, `sessionStart`, `sessionEnd`) with fields: `type`, `bash` (or `powershell`), `cwd`, `timeoutSec`, and optional `env`.

3. Bundle complex logic in scripts: Put reusable scripts in a `scripts/` folder (e.g., `.github/hooks/my-hook/scripts/security-check.sh`) and reference them from `hooks.json`.

4. Make scripts robust: Start scripts with `#!/usr/bin/env bash` and `set -euo pipefail`; fail fast on errors; keep one responsibility per script.

5. Make executable & test locally: Run `chmod +x scripts/*.sh` and execute scripts manually to verify behaviour before adding to `hooks.json`. Use non-zero exit codes to block actions.

6. Use `preToolUse` for gating: For security or approval flows, implement `preToolUse` scripts which receive JSON input about the tool and can exit non-zero to deny execution.

7. Set timeouts & env: Use `timeoutSec` to limit hook runtime; pass required env vars via `env` in `hooks.json`.

8. Document and bundle: Add a `README.md` (with frontmatter) in the hook folder describing setup, required tools, and commands.

9. Integrate with repo build: After adding hooks/scripts, run project build tasks (e.g., `npm run build`) so generated READMEs and indexes include the new hook; make sure CI checks pass (validate manifests if applicable).

10. Best practices: Keep hooks fast, layer simple checks (multiple hooks) rather than one big script, document dependencies (formatters/linters), and test with realistic timeouts.

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete the task more effectively. Skills provide specialized capabilities and domain knowledge.

How to use skills:
- Invoke: `skillkit read <skill-name>` or `npx skillkit read <skill-name>`
- The skill content will load with detailed instructions on how to complete the task
- Base directory provided in output for resolving bundled resources (references/, scripts/, assets/)

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
</usage>

<available_skills>

<skill>
<name>add-educational-comments</name>
<description>Add educational comments to the file specified, or prompt asking for file to comment if one is not provided.</description>
<location>project</location>
</skill>

<skill>
<name>agent-governance</name>
<description>Patterns and techniques for adding governance, safety, and trust controls to AI agent systems. Use this skill when:
- Building AI agents that call external tools (APIs, databases, file systems)
- Implementing policy-based access controls for agent tool usage
- Adding semantic intent classification to detect dangerous prompts
- Creating trust scoring systems for multi-agent workflows
- Building audit trails for agent actions and decisions
- Enforcing rate limits, content filters, or tool restrictions on agents
- Working with any agent framework (PydanticAI, CrewAI, OpenAI Agents, LangChain, AutoGen)
</description>
<location>project</location>
</skill>

<skill>
<name>agentic-eval</name>
<description>Patterns and techniques for evaluating and improving AI agent outputs. Use this skill when:
- Implementing self-critique and reflection loops
- Building evaluator-optimizer pipelines for quality-critical generation
- Creating test-driven code refinement workflows
- Designing rubric-based or LLM-as-judge evaluation systems
- Adding iterative improvement to agent outputs (code, reports, analysis)
- Measuring and improving agent response quality
</description>
<location>project</location>
</skill>

<skill>
<name>ai-prompt-engineering-safety-review</name>
<description>Comprehensive AI prompt engineering safety review and improvement prompt. Analyzes prompts for safety, bias, security vulnerabilities, and effectiveness while providing detailed improvement recommendations with extensive frameworks, testing methodologies, and educational content.</description>
<location>project</location>
</skill>

<skill>
<name>appinsights-instrumentation</name>
<description>Instrument a webapp to send useful telemetry data to Azure App Insights</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>