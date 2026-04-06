# Consolidation Checklist

This checklist enumerates discovered package manifests, Python manifests, requirements, and `.github` artifacts to review before consolidation.

1) Node / JavaScript projects (package.json locations)

- c:/Users/dylan.a.thomas/Projects/VSCode_March26/package.json
- c:/Users/dylan.a.thomas/Projects/VSCode_March26/agent-skills/package.json
- c:/Users/dylan.a.thomas/Projects/VSCode_March26/agentspec/package.json
- c:/Users/dylan.a.thomas/Projects/VSCode_March26/agentspec/test-verify/python-mcpexpert/package.json
- c:/Users/dylan.a.thomas/Projects/VSCode_March26/agentspec/agent-skills/package.json
- c:/Users/dylan.a.thomas/Projects/VSCode_March26/typespec-reference/package.json
- c:/Users/dylan.a.thomas/Projects/VSCode_March26/typespec-reference/packages/events/package.json
- c:/Users/dylan.a.thomas/Projects/VSCode_March26/typespec-reference/packages/astro-utils/package.json
- c:/Users/dylan.a.thomas/Projects/VSCode_March26/typespec-reference/eng/tsp-core/scripts/package.json
- c:/Users/dylan.a.thomas/Projects/VSCode_March26/typespec-reference/packages/eslint-plugin-typespec/package.json
- c:/Users/dylan.a.thomas/Projects/VSCode_March26/typespec-reference/packages/asset-emitter/package.json
- c:/Users/dylan.a.thomas/Projects/VSCode_March26/typespec-reference/e2e/package.json
- c:/Users/dylan.a.thomas/Projects/VSCode_March26/typespec-reference/e2e/basic-latest/package.json
- c:/Users/dylan.a.thomas/Projects/VSCode_March26/typespec-reference/packages/bundle-uploader/package.json
- c:/Users/dylan.a.thomas/Projects/VSCode_March26/typespec-reference/packages/bundler/package.json
- c:/Users/dylan.a.thomas/Projects/VSCode_March26/typespec-reference/packages/best-practices/package.json
- c:/Users/dylan.a.thomas/Projects/VSCode_March26/typespec-reference/packages/compiler/package.json
- c:/Users/dylan.a.thomas/Projects/VSCode_March26/typespec-reference/packages/compiler/test/server/workspace/package.json
- c:/Users/dylan.a.thomas/Projects/VSCode_March26/typespec-reference/packages/http-canonicalization/package.json
- (additional `package.json` files discovered under `typespec-reference/packages` and other subfolders — see repository search for full list)

1) Python projects and manifests

- c:/Users/dylan.a.thomas/Projects/VSCode_March26/GenerateAgents/pyproject.toml
- c:/Users/dylan.a.thomas/Projects/VSCode_March26/agentspec/agent-skills/skills-ref/pyproject.toml
- c:/Users/dylan.a.thomas/Projects/VSCode_March26/agent-skills/skills-ref/pyproject.toml
- c:/Users/dylan.a.thomas/Projects/VSCode_March26/requirements.txt

1) `.github` and automation artifacts (root + nested)

- Root `.github/` (canonical): includes agent definitions, skills, collections, workflows, and instructions
  - c:/Users/dylan.a.thomas/Projects/VSCode_March26/.github/agents/*.agent.md
  - c:/Users/dylan.a.thomas/Projects/VSCode_March26/.github/skills/**
  - c:/Users/dylan.a.thomas/Projects/VSCode_March26/.github/.github/workflows/*.yml (publish/post-pr workflows)
  - c:/Users/dylan.a.thomas/Projects/VSCode_March26/.github/CONTRIBUTING.md, CODE_OF_CONDUCT.md, etc.

- Nested `.github` to review before removal/migration:
  - c:/Users/dylan.a.thomas/Projects/VSCode_March26/typespec-reference/.github/ (contains workflows, policies, dependabot, CODEOWNERS)

1) Agent definition files (explicit agent artifacts)

- c:/Users/dylan.a.thomas/Projects/VSCode_March26/.github/agents/typescript-mcp-expert.agent.md
- c:/Users/dylan.a.thomas/Projects/VSCode_March26/.github/agents/task-planner.agent.md
- c:/Users/dylan.a.thomas/Projects/VSCode_March26/.github/agents/python-mcp-expert.agent.md
- c:/Users/dylan.a.thomas/Projects/VSCode_March26/.github/agents/n8n-workflow-expert.agent.md
- c:/Users/dylan.a.thomas/Projects/VSCode_March26/.github/agents/example.agent.md
- c:/Users/dylan.a.thomas/Projects/VSCode_March26/Knowledge/agents/generateagents.tool.agent.md
- c:/Users/dylan.a.thomas/Projects/VSCode_March26/Knowledge/agents/analyzecodebase.tool.agent.md
- c:/Users/dylan.a.thomas/Projects/VSCode_March26/agentspec/test-output/python-m-c-p-expert.agent.md

1) Action items for each listed item

- For each `package.json`: decide include in root `pnpm-workspace.yaml` or keep isolated. (Recommended: include top-level packages and `typespec-reference/**`.)
- For each nested `.github/`: extract any agent definitions (`*.agent.md`), custom actions, and workflows that must be preserved; present extracted items for approval before deleting or migrating.
- For Python projects: keep existing `pyproject.toml` files in place; optionally collect `requirements.txt` into a top-level `requirements-aggregated.txt` for environment setup.

1) Next steps (I will perform now, if you confirm)

- Produce a CSV/markdown table enumerating every `package.json` file with its package name (from `package.json` "name" field), relative path, and suggested action (include/exclude).
- Produce a separate list of nested `.github` files with a per-file recommended handling: `extract`, `preserve`, or `leave-as-is`.

If you confirm, I'll extract `name` fields from each `package.json` and produce the detailed table and recommended actions next.
