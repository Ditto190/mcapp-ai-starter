---
name: copilot-chat
description: "Project-scoped Copilot Chat agent. Use when: code comprehension, refactor suggestions, adding tests, creating PR descriptions, and repository-specific guidance. Trigger phrases: 'copilot', 'agent', 'review', 'refactor', 'tests'"
applyTo:
  - "**/*"
---

# copilot-chat agent

This agent provides project-specific assistance using workspace context and the files in this repository.

Usage:
- In Copilot Chat, invoke by typing one of the trigger phrases (see frontmatter `description`).
- Use short prompts like: `Help me refactor modules in src/`, `Create unit tests for package X`, `Write a PR description for branch Y`.

Notes:
- Keep the `description` updated with relevant trigger phrases to ensure discovery.
- Narrow `applyTo` globs if you want to limit the agent to specific folders or languages.
