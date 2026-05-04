# CLAUDE.md — foam-modme

Concise operating guide for Claude-compatible agents in this repository.

## Read first

1. `.github/copilot-instructions.md`
2. `AGENTS.md`
3. `README.md`

## Working model

- Multi-component repo (Docker stack + Node/TS + Python + agent assets).
- Use component-local scripts and workflows.
- Keep changes scoped and validate in the component you modify.

## Environment notes

- WSL/Linux path assumptions.
- Shell setup and aliases are defined in `/home/wsl-vm/.zshrc`.
- Use `.env.example` to bootstrap `.env` when secrets are required.
