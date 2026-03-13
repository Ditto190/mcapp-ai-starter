---
applyTo: "**/*"
description: "Testing standards and practices"
---

<!-- Based on/Inspired by: https://github.com/github/awesome-copilot/blob/main/instructions/testing.instructions.md -->

# Testing Guidelines

- Write unit tests for all public functions and component behaviors.
- Use integration tests to validate interactions between modules and external services.
- Prefer deterministic tests: mock network, filesystem, and time-dependent code.
- Maintain a fast unit test suite run locally; reserve slow E2E tests for CI.
- Use coverage thresholds to prevent accidental removal of tests for critical paths.
