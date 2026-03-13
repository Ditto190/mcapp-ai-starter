---
applyTo: "**/*"
description: "Security best practices"
---

<!-- Based on/Inspired by: https://github.com/github/awesome-copilot/blob/main/instructions/security.instructions.md -->

# Security Guidelines

- Treat secrets as environment configuration; never commit secrets to source.
- Use principle of least privilege for service credentials and tokens.
- Validate and sanitize all external inputs; apply defence-in-depth for public APIs.
- Keep dependencies up to date and monitor for critical CVEs.
