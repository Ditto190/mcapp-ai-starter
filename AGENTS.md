## Workspace Agent Guidance

This repository includes workspace-level instruction files to guide Copilot-style assistants and workspace agents. Keep this file small and focused — it's the single place to find how agents should behave in this repo.

- **Primary stack:** TypeScript + React
- **Key tasks for agents:** code generation, tests scaffolding, example app maintenance, Playwright E2E helpers

Recommendations for agents and contributors

- Follow `.github/copilot-instructions.md` for general assistant conventions and quick commands.
- Use `examples/` when creating runnable demos and tests; prefer small, focused PRs.
- When adding new instruction files, include `description` and `applyTo` frontmatter and a 1–3 bullet context-engineering note if runtime data is required.

Quick links

- See workspace instructions: [.github/copilot-instructions.md](.github/copilot-instructions.md)
- Common places: `src/`, `examples/`, `.github/instructions/`

If you'd like, I can expand this with suggested `applyTo` globs for frontend/backends or create a short checklist template for new instruction files.