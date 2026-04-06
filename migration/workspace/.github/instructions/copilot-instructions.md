---
name: workspace-copilot-instructions
description: "Workspace-wide Copilot Chat instructions: provide consistent coding style, testing guidance, and repository conventions. Use when: 'how do I', 'please refactor', 'write tests', 'explain this file'"
applyTo:
  - "**/*"
---

These instructions are loaded into Copilot Chat for every conversation to give repository context and conventions.

Conventions:
- Python: use black + isort formatting
- Tests: use pytest, tests live in `tests/`
- Virtualenv: prefer project-level venv in `.venv/`

Examples of helpful prompts:
- "Explain the design of src/module.py"
- "Add unit tests for function X in file Y"
- "Suggest a smaller refactor for class Z"
