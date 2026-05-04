## Copilot AI instructions.md
Below is a **regenerated, more rigorous `PLAN.md`** that includes:

*   explicit **pre-flight checks** and **gates**
*   **exact commands** (with safe flags like `-v`, `-n`, timestamped backups)
*   clear **expected outcomes** / **failure handling**
*   **rollback** procedures for every phase
*   explicit **“do not touch”** boundaries protecting zsh/bash/SSH/VS Code/Claude state
*   references to authoritative guidance on:
    *   keeping project files in the same filesystem as your toolchain [\[learn.microsoft.com\]](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows)
    *   opening WSL projects in VS Code via `code .` and WSL extension behaviour [\[code.visua...studio.com\]](https://code.visualstudio.com/docs/remote/wsl), [\[learn.microsoft.com\]](https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-vscode)
    *   NVM usage patterns (`nvm install --lts`, `nvm use`) [\[github.com\]](https://github.com/nvm-sh/nvm), [\[deepwiki.com\]](https://deepwiki.com/nvm-sh/nvm/4.1-basic-commands), [\[How to ins...for Linux \| PDF\]](https://ts.accenture.com/sites/APPTECHCoEDocumentation/Shared%20Documents/APP%20Arch%20CoE/APP%20Reference%20Architecture/HowTo%20Guides/How%20to%20install%20and%20configure%20Windows%20Subsystem%20for%20Linux.pdf?web=1)

> **Note**: This plan is written for your **current observed state**: WSL2, zsh + oh-my-zsh, Node via nvm at `~/.nvm`, VS Code Insiders available on PATH, and shell aliases pointing to `~/scripts` and `~/projects`.

***

## PLAN.md

```markdown
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
Microsoft recommends keeping project files in the same filesystem where the toolchain is installed to avoid cross-OS pathing/compatibility/perf issues. 

### 1.3 VS Code safety rule
Before moving anything:
- Close all VS Code / VS Code Insiders windows that have `\\wsl.localhost\Ubuntu\home\wsl-vm` open.
After moving:
- Reopen using `code .` from inside WSL (WSL extension workflow). 

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
```

/home/wsl-vm
├─ projects/
│  └─ claude/
│     └─ home-root-migrated/   # formerly the home-level node project
│        ├─ package.json
│        ├─ package-lock.json
│        └─ node\_modules/
├─ projects/ ...               # existing projects unchanged
├─ scripts/ ...                # unchanged (aliases depend on it)
└─ (protected dot directories unchanged)

````

Optional later phases:
- `~/tools/Foundry-Local` (vendor repos separated from authored projects)
- `~/archive` for logs/err outputs

---

## 4) Pre-Flight (Snapshot + Validate) — MUST PASS BEFORE ANY MOVE

### 4.1 Create a timestamp for logs/backups
```bash
TS="$(date +%Y%m%d-%H%M%S)"
echo "TS=$TS"
````

### 4.2 Snapshot key config files (copy-only)

```bash
mkdir -p ~/archive-home/snapshots/"$TS"
cp -av ~/.zshrc ~/.zprofile ~/.bashrc ~/.profile ~/archive-home/snapshots/"$TS"/ 2>/dev/null || true
cp -av ~/.ssh ~/archive-home/snapshots/"$TS"/ 2>/dev/null || true
```

Acceptance: snapshot folder exists and contains copies.

### 4.3 Record baseline environment (read-only)

```bash
mkdir -p ~/archive-home/baselines/"$TS"
{
  echo "### DATE"; date
  echo "### PWD"; pwd
  echo "### HOME"; echo "$HOME"
  echo "### PATH"; echo "$PATH" | tr ':' '\n'
  echo "### NODE"; which node; node -v
  echo "### NPM"; which npm; npm -v
  echo "### NVM"; command -v nvm; nvm --version
  echo "### ALIASES"; alias | egrep "health=|ws=|proj=|apm=|foam=|mcpws=" || true
} | tee ~/archive-home/baselines/"$TS"/baseline.txt
```

Acceptance:

*   `which node` points to `~/.nvm/...`
*   `command -v nvm` returns `nvm`
*   aliases resolve without error

### 4.4 Confirm the home-level Node project is self-contained

```bash
cd ~
test -f package.json && echo "OK: package.json exists" || echo "FAIL: no package.json"
test -d node_modules && echo "OK: node_modules exists" || echo "FAIL: no node_modules"
npm ls --depth=0 | tee ~/archive-home/baselines/"$TS"/home-npm-ls.txt
```

Acceptance:

*   `npm ls` succeeds (it may show warnings but should not hard fail)
*   Captured output stored for rollback confidence

### 4.5 VS Code / WSL workflow check (read-only)

VS Code guidance: open WSL folders from WSL terminal using `code .` (first time installs server), and confirm WSL indicator in bottom-left. [\[code.visua...studio.com\]](https://code.visualstudio.com/docs/remote/wsl), [\[learn.microsoft.com\]](https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-vscode)

Quick check:

```bash
command -v code && echo "OK: code command on PATH" || echo "WARN: code not on PATH"
```

Acceptance:

*   `code` exists OR you already open VS Code via WSL command palette.

***

## 5) Execution Phases

## Phase 1 — Move the Home-Level Node Project (Lowest Risk, Highest Value)

### 5.1 Create destination directory (idempotent)

```bash
mkdir -p ~/projects/claude/home-root-migrated
```

### 5.2 Move artifacts as a unit (safe flags: verbose, no clobber)

> IMPORTANT: Close VS Code windows that have `~` open as a workspace before this.

```bash
cd ~
mv -vn package.json package-lock.json node_modules ~/projects/claude/home-root-migrated/
```

Acceptance:

*   `~/package.json` no longer exists
*   `~/projects/claude/home-root-migrated/package.json` exists
*   `~/projects/claude/home-root-migrated/node_modules` exists

Validation:

```bash
cd ~/projects/claude/home-root-migrated
node -v
npm -v
npm ls --depth=0 | tee ~/archive-home/baselines/"$TS"/post-move-npm-ls.txt
```

### 5.3 VS Code reopen (WSL-safe)

```bash
cd ~/projects/claude/home-root-migrated
code .
```

Acceptance:

*   VS Code shows `WSL: Ubuntu` indicator (bottom-left). [\[code.visua...studio.com\]](https://code.visualstudio.com/docs/remote/wsl), [\[learn.microsoft.com\]](https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-vscode)
*   Terminal in VS Code is a Linux shell (zsh/bash), not PowerShell.

In VS Code terminal:

```bash
pwd
which node
```

Acceptance:

*   `pwd` under `/home/wsl-vm/...`
*   `which node` under `~/.nvm/...`

### 5.4 Post-phase sanity checks

```bash
# Aliases should still work:
health || true
ws
proj
```

Acceptance:

*   `alias health` resolves (it runs `~/scripts/health-check.sh`; script may return non-zero but should exist)
*   `ws` / `proj` cd correctly

***

## Phase 2 (Optional) — Relocate Vendor Repo(s) into \~/tools

This is optional and should only occur once Phase 1 is stable.

### 6.1 Pre-check: confirm nothing references the vendor path

```bash
grep -R "Foundry-Local" ~/.zshrc ~/.bashrc ~/.profile 2>/dev/null || true
```

Acceptance: no hard-coded references OR you intentionally plan to update them.

### 6.2 Move vendor repo (reversible)

```bash
mkdir -p ~/tools
mv -vn ~/Foundry-Local ~/tools/
```

### 6.3 Validate any dependent tooling

If any scripts or docs expect that path, either:

*   add an alias, or
*   add a symlink (ONLY within WSL filesystem)

Recommended compatibility alias (no filesystem changes):

```bash
echo "alias foundry='cd ~/tools/Foundry-Local'" >> ~/archive-home/baselines/"$TS"/notes.txt
```

***

## Phase 3 (Optional) — Log/Artifact Hygiene (Archive noisy outputs)

Do NOT delete; move to archive.

Candidates:

*   `strands_*.txt`, `strands_*.err`
*   `uvx_*.txt`, `uvx_*.err`

```bash
mkdir -p ~/archive-home/artifacts/"$TS"
mv -vn ~/strands_* ~/uvx_* ~/archive-home/artifacts/"$TS"/ 2>/dev/null || true
```

Acceptance:

*   Files moved into archive folder
*   No scripts/configs were moved

***

## 6) Rollback Procedures (Per Phase)

### Rollback Phase 1 (restore home-level node project)

```bash
cd ~
mv -vn ~/projects/claude/home-root-migrated/package.json \
       ~/projects/claude/home-root-migrated/package-lock.json \
       ~/projects/claude/home-root-migrated/node_modules \
       ~/
```

Then:

```bash
cd ~
npm ls --depth=0
```

### Rollback Phase 2 (restore Foundry-Local to home)

```bash
mv -vn ~/tools/Foundry-Local ~/
```

### Rollback Phase 3 (restore artifacts)

```bash
mv -vn ~/archive-home/artifacts/"$TS"/* ~/
```

***

## 7) Success Criteria

Minimum success (Phase 1 complete):

*   `which node` still points to `~/.nvm/...`
*   `nvm --version` works
*   `npm ls --depth=0` works in `~/projects/claude/home-root-migrated`
*   VS Code opens via `code .` and shows WSL status indicator [\[code.visua...studio.com\]](https://code.visualstudio.com/docs/remote/wsl), [\[learn.microsoft.com\]](https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-vscode)
*   No dot directories moved or edited
*   Existing zsh aliases still function (ws/proj/apm/foam/mcpws/health)

***

## 8) Notes / References

*   WSL + Node guidance: keep code in the same filesystem as the toolchain (Linux projects in Linux filesystem). [\[learn.microsoft.com\]](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows)
*   VS Code WSL workflow: use WSL extension and open folders from WSL terminal using `code .`. [\[code.visua...studio.com\]](https://code.visualstudio.com/docs/remote/wsl), [\[learn.microsoft.com\]](https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-vscode)
*   NVM usage patterns (`install --lts`, `use`, `ls`) are consistent with NVM docs and internal WSL setup guidance. [\[github.com\]](https://github.com/nvm-sh/nvm), [\[deepwiki.com\]](https://deepwiki.com/nvm-sh/nvm/4.1-basic-commands), [\[How to ins...for Linux \| PDF\]](https://ts.accenture.com/sites/APPTECHCoEDocumentation/Shared%20Documents/APP%20Arch%20CoE/APP%20Reference%20Architecture/HowTo%20Guides/How%20to%20install%20and%20configure%20Windows%20Subsystem%20for%20Linux.pdf?web=1)

```

---

## Why this plan won’t break your existing SSH / zsh / VS Code Insiders setup

- Your PATH shows your tooling is anchored in `~/.local/bin`, `~/.nvm/...`, and standard package managers — we don’t touch those.
- Your `.zshrc` aliases reference `~/scripts` and `~/projects`, and Phase 1 **does not rename** either directory.
- VS Code WSL behaviour is designed to open WSL folders cleanly when invoked via `code .` from WSL, and it installs/uses the WSL server under `.vscode-server*` (which we keep protected). 

---

If you want, I can also generate a **one-command “preflight script”** (read-only) that writes all baselines to `~/archive-home/baselines/<timestamp>/` and exits non-zero if any gate fails — but I won’t do that unless you explicitly ask, since it’s beyond the PLAN.md request.
```
