# GitHub Copilot Instructions for this Repository

## Purpose
These instructions teach GitHub Copilot to generate code that strictly follows patterns, versions, and architecture in this repository. Copilot must analyze the repository (auto-detect) and prioritize existing code patterns over external assumptions.

## Priority Guidelines

1. Version Compatibility: Auto-detect language, framework, and library versions from project manifests (e.g., package.json, package-lock.json, bun.lockb, pyproject.toml, requirements.txt, .csproj, pom.xml). Do not use features beyond detected versions.
2. Context Files: If present, prioritize guidance in `.github/copilot/`, `.github/`, and top-level config files (tsconfig.json, package.json, pyproject.toml, .eslintrc, etc.).
3. Codebase Patterns: When no explicit guidance exists, find and follow the most consistent patterns in nearby files (naming, error handling, async patterns, logging, DI, testing style).
4. Architectural Boundaries: Respect existing module and folder boundaries. Do not move responsibilities across layers.
5. Quality Focus: Prioritize maintainability, testability, and security as they are implemented in the repo.

## Auto-detection Steps (required before generation)

1. Identify primary languages and frameworks by file extensions and manifests.
2. Extract exact dependency versions and runtime targets from manifest files.
3. Locate representative exemplar files for the target area (same folder or nearest logical module).
4. Use those exemplars for style, error handling, and test patterns. Cite the file path and line ranges in generated code comments when giving examples.

## Scanning Priority (where to look, in order)

- Top-level manifests: `package.json`, `pyproject.toml`, `requirements.txt`, `package-lock.json`, `bun.lockb`, `pnpm-lock.yaml`, `yarn.lock`, `tsconfig.json`, `.csproj`, `pom.xml`.
- Repo conventions: `.github/`, `.github/copilot/`, `docs/`, `specification/`.
- Source folders: `src/`, `examples/`, `generateagents-mcp/`, `n8n/`, `plugins/` (match path structure to the area you're modifying).
- Tests: `tests/`, `__tests__/`, `playwright.config.ts`, and other test harnesses.

## Code Generation Rules

- Only use language or framework features supported by detected versions.
- Follow the naming and module patterns of the closest exemplar file.
- Match error handling and logging conventions (same error types, wrappers, or log levels).
- Keep functions/classes consistent in responsibility and complexity with nearby examples.
- For imports/exports, mirror the module resolution style (ESM vs CommonJS, TypeScript path aliases) used in the repository.
- When adding new public APIs, include matching tests following the repository's test style and naming conventions.

## Documentation & Comments

- Follow the repository's documentation level: match formats (JSDoc, TypeDoc, docstrings, or XML comments) used by exemplars.
- Include a short usage example when adding libraries or public functions, copying the style from exemplars and referencing the exemplar file path.

## Testing

- Before changing behavior, create unit tests matching existing patterns (naming, assertion style, mocking).
- For integration or E2E additions, mirror the repository's test fixtures and setup/teardown patterns.

## Security & Data Handling

- Follow existing input validation and sanitization patterns. If none exist for the area, default to minimal safe handling and request a human review.
- Never hardcode secrets or credentials. Use the repo's environment/config patterns.

## Examples & Concrete Guidance

When asked to implement or modify code in a specific area, Copilot should:

1. Auto-detect the most similar file(s) in the same folder (or nearest parent) and copy structural patterns.
2. Include a brief comment referencing the exemplar file path and relevant lines, e.g.: "// style matched to exemplar file (cite repo path and line range)".
3. Keep changes localized: avoid cross-module refactors unless instructed.

## When Conflicts Appear

- If multiple consistent patterns exist, prefer the pattern in the most recently modified file with tests.
- If patterns are inconsistent and no clear winner exists, prefer the smallest, safest change and add a TODO comment asking for human review.

## Placement & Usage

- Save this file as `.github/copilot/copilot-instructions.md` in the repository.
- When generating code, always run the auto-detection steps described above and include a short note about detected versions at the top of the generated change.

## Minimal Checklist for Generated PRs (include as PR description snippet)

- Detected languages/frameworks and versions
- Exemplar files used for style guidance (paths + line ranges)
- Tests added or updated
- Reason for any API changes
- Notes for human reviewers (if any TODOs were introduced)

## Final note to Copilot

Only follow practices that you can verify exist in this codebase. Prioritize consistency with the repository over external best-practice heuristics or newer language features not present in detected versions.
