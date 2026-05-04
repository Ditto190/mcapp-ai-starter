---
title: WSL Zsh Beginner Terminal Quickstart
description: Step-by-step guide for beginner terminal usage in WSL zsh with navigation helpers, command discovery, and AI-assisted command suggestions.
owner: wsl-vm
status: active
audience:
  - beginner
  - developer
platform:
  - wsl
  - linux
shell: zsh
tags:
  - quickstart
  - terminal
  - zsh
  - wsl
  - command-line
  - onboarding
  - awesome-copilot
last_updated: 2026-05-04
related_files:
  - /home/wsl-vm/.zshrc
  - /home/wsl-vm/AGENTS.md
  - /home/wsl-vm/projects/foam-modme/AGENTS.md
commands:
  - source ~/.zshrc
  - term-help
  - here
  - up 1
  - up 2
  - finddir <name>
  - findfile <name>
  - pathhint <term>
  - cdf
  - ff
  - learn <command>
  - cmdhint <topic>
  - askcmd "<plain-english request>"
  - toolcheck
  - acp-status
  - acp-skill-list [filter]
  - acp-skill-open <skill-substring>
  - acp-agent-list
  - acp-agent-install <agent-file-name> [target-dir]
---

## WSL Zsh Beginner Terminal Quickstart

This guide is for users who are new to terminal commands and want safe, practical ways to navigate, search, and ask for command help.

## 1) Load your helpers

Run this once per new terminal session:

source ~/.zshrc

## 2) See available helper commands

term-help

This prints the built-in helper toolkit and usage hints.

## 3) Basic navigation (beginner-safe)

- Show where you are + quick directory preview:

here

- Move up one folder:

up 1

- Move up two folders:

up 2

- Jump with existing aliases:

ws
proj
foam
apm

## 4) Find folders and files without memorizing syntax

- Find directories by partial name:

finddir [name]

Example:

finddir docs

- Find files by partial name:

findfile [name]

Example:

findfile quickstart

- Path hints from current location:

pathhint [term]

## 5) Interactive picking (if tools are installed)

- Pick a directory interactively and cd:

cdf

- Pick a file interactively:

ff

## 6) Learn commands quickly

- Learn a specific command:

learn [command]

Example:

learn ls

- Discover related commands by topic:

cmdhint [topic]

Example:

cmdhint copy

## 7) AI-assisted command suggestions

Use plain English to get terminal command suggestions:

askcmd "what you want to do"

Examples:

askcmd "list files sorted by size"
askcmd "find large files over 100MB"
askcmd "search for text in all markdown files"

Notes:

- `askcmd` uses `gh copilot suggest -t shell` when available.
- If unavailable, it falls back to `copilot -p` prompt mode.
- If neither CLI is available, use `cmdhint` and `learn`.

## 8) Awesome-copilot cache helpers

These commands inspect cached plugin skills/agents in:
`~/.copilot/installed-plugins/awesome-copilot`

- Check cache health and counts:

acp-status

- List cached skills (optionally filtered):

acp-skill-list
acp-skill-list context-map

- Open a skill file:

acp-skill-open suggest-awesome-github-copilot-agents

- List cached agent files:

acp-agent-list

- Install a cached agent into current repo:

acp-agent-install whatidid.agent.md

- Install into a specific folder:

acp-agent-install whatidid.agent.md /tmp/agents

## 9) Verify helper dependencies

toolcheck

This checks common tools like `rg`, `fzf`, `gh`, and others.

## 10) Troubleshooting

- If helpers are “command not found,” reload shell config:

source ~/.zshrc

- Check zsh config syntax:

zsh -n ~/.zshrc

- If AI suggestions fail, check whether Copilot/GitHub CLI is installed and authenticated.

## Functional summary

- Use `term-help` when unsure what to do.
- Use `here`/`up`/`finddir`/`findfile` for navigation and discovery.
- Use `learn` + `cmdhint` to build command fluency.
- Use `askcmd` for plain-English command generation.
- Use `acp-*` commands for awesome-copilot skill/agent cache workflows.
