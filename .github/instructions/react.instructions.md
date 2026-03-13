---
applyTo: "**/*.tsx,**/*.ts,**/*.jsx,**/*.js"
description: "React + TypeScript best practices"
---

<!-- Based on/Inspired by: https://github.com/github/awesome-copilot/blob/main/instructions/react.instructions.md -->

# React + TypeScript Guidelines

- Use TypeScript strict mode for all new code. Prefer explicit types for public APIs.
- Use functional components and React hooks; avoid class components for new code.
- Keep components small and focused; prefer composition over inheritance.
- Use CSS modules or design-system tokens for component styling to avoid global CSS leakage.
- Write unit tests for component behavior and accessibility checks for interactive components.

## Testing and Tooling

- Use `react-testing-library` for DOM-focused unit tests and `jest` for test runner.
- Use linting and formatting rules shared across the repo (ESLint + Prettier).
