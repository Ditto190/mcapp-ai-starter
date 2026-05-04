# Copilot Instructions — foam-modme

## Purpose

Provide fast, accurate defaults for AI coding agents in this repository.

## Project profile

This repository is a multi-component AI starter/workflow workspace.

Use and link these docs instead of duplicating long instructions:

- `README.md`
- `DEVELOPER-QUICKSTART.md`
- `QUICKSTART.md`
- `AGENTS.md`
- `CLAUDE.md`

## Command routing

- Docker stack: `docker compose config -q`, then `docker compose up` (or profile variants)
- Python components: use `uv sync` and `uv run ...`
- Node components: use project-local `npm` scripts

## Conventions

- Keep instruction files concise and actionable.
- Prefer links to canonical docs rather than embedding duplicate procedures.
- Use Linux paths (`/home/wsl-vm/...`).
- Never commit secrets; initialize from `.env.example`.

## Shell/setup assumptions

- Global shell setup lives in `/home/wsl-vm/.zshrc`
- Includes alias routing (`apm`, `foam`, `mcpws`, `turbo`, etc.) and helper functions (`mkcd`, `cdf`, `ff`, `toolcheck`)
- Rust bootstrap path helper: `/home/wsl-vm/.cargo/env`
