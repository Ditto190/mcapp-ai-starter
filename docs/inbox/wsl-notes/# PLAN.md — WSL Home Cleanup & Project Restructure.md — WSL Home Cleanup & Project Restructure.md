# PLAN.md — WSL Home Cleanup & Project Restructure (Safe Migration)

## 0) Purpose
Create a clean, maintainable directory layout in WSL (`/home/wsl-vm`) by relocating “project artifacts” (e.g., `package.json`, `node_modules`, vendor repos) into a structured tree under `~/projects` (and optionally `~/tools`) **without breaking**:
- zsh/bash startup config
- PATH resolution
- SSH config/keys
- VS Code / VS Code Insiders WSL remote setup
- Claude Code + MCP + agent tooling state directories

This plan is **reversible** and uses **move-not-delete** operations.

---

## 1) Ground Rules (Non-Negotiable Constraints)

### 1.1 Do NOT move or modify (Protected Zones)
These locations are treated as **immutable** for this refactor:
- `~/.zshrc`, `~/.zprofile`, `~/.bashrc`, `~/.profile`
- `~/.ssh`, `~/.gnupg`
- `~/.nvm` (Node versions + nvm install)
- `~/.local` (especially `~/.local/bin`)
- `~/.config` (VS Code profiles live here, including Insiders)
- `~/.vscode-server*` (Remote WSL server state)
- `~/.claude`, `~/.agents`, `~/.copilot`, `~/.mcp-*`, `~/.apm`, etc. (AI tooling state)
- Any directories starting with `.` unless explicitly stated otherwise

Rationale: these directories define shell/IDE/tool stability; project cleanup must not touch them.

### 1.2 Work only in the Linux filesystem
All work stays under `/home/wsl-vm/...` (WSL filesystem). Avoid `/mnt/c` development paths.
Microsoft recommends keeping project files in the same filesystem where the toolchain is installed to avoid cross-OS pathing/compatibility/perf issues. [1](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows)

### 1.3 VS Code safety rule
Before moving anything:
- Close all VS Code / VS Code Insiders windows that have `\\wsl.localhost\Ubuntu\home\wsl-vm` open.
After moving:
- Reopen using `code .` from inside WSL (WSL extension workflow). [2](https://code.visualstudio.com/docs/remote/wsl)[3](https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-vscode)

---

## 2) Current State (Observed/Assumed Baseline)
- Node is installed via nvm (WSL-native): `~/.nvm/versions/node/...`
- A “home-level Node project” exists:
  - `~/package.json`
  - `~/package-lock.json`
  - `~/node_modules`
- `~/Foundry-Local` exists (vendor repo)
- `~/projects/` exists and contains multiple sub-projects (some with their own `package.json`, `node_modules`)
- `.zshrc` contains aliases referencing:
  - `~/scripts/health-check.sh`
  - `~/projects/...` paths
Therefore: do **not** rename `~/scripts` or `~/projects` in Phase 1.

---

## 3) Target End State (Minimal + Clean)
Phase 1 target (minimal, low risk):