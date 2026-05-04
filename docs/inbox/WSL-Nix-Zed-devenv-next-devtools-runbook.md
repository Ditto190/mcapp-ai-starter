# WSL runbook: Nix Zed + devenv + Next DevTools MCP + zsh stability

## Scope

- Environment: WSL Ubuntu (`/home/wsl-vm`) with VS Code Insiders and Windows-side MCP catalog.
- Goal: stable editor/toolchain setup for `foam-modme` and reliable MCP server startup.

## Final known-good state

- `devenv` installed globally from Nix profile and runnable.
- `foam-modme` `devenv shell` evaluates successfully.
- Zed is Nix-managed (`zeditor`) and usable from shell/devenv.
- Next DevTools MCP (`io.github.vercel/next-devtools-mcp`) is routed through WSL (`wsl.exe`) instead of bare Windows `npx`.
- `.zshrc` no longer intermittently causes VS Code terminal exit code 1.

## Key file/config changes

### 1) Project devenv config

- File: `/home/wsl-vm/projects/foam-modme/devenv.nix`
- Important package migration:
  - Removed: `nodePackages.npm`, `nodePackages.yarn`
  - Use instead:
    - `nodejs_20` (already includes npm)
    - `yarn` (top-level package)
- Result: fixes nixpkgs evaluation error (`nodePackages has been removed`).

### 2) Windows VS Code MCP catalog (critical for ENOENT fix)

- File: `C:\Users\dylan.a.thomas\AppData\Roaming\Code - Insiders\User\mcp.json`
- Server: `io.github.vercel/next-devtools-mcp`
- Pattern used:
  - `"command": "wsl.exe"`
  - `"args": ["-e", "/home/wsl-vm/.local/share/fnm/node-versions/v24.15.0/installation/bin/npx", "-y", "next-devtools-mcp@0.3.6"]`
- Why: this server was running under **LocalProcess (Windows extension host)**; bare `npx` there caused `spawn npx ENOENT`.

### 3) Shell reliability cleanup

- File: `/home/wsl-vm/.zshrc`
- Changes:
  - Removed duplicate Bun export block.
  - Kept FNM init block.
  - Added final `true` line to force `.zshrc` success code.
- Why: prevents occasional VS Code message `The terminal process "/usr/bin/zsh" terminated with exit code: 1` due to non-zero final startup command.

## Essential commands (validated)

### A) Validate/install devenv

- Check:
  - `command -v devenv && devenv version`
- Install if missing (modern Nix profiles):
  - `nix profile add nixpkgs#devenv`
- Recheck:
  - `command -v devenv`
  - `devenv version`

### B) Validate `foam-modme` environment

- `cd /home/wsl-vm/projects/foam-modme`
- `devenv shell -- true`
- Success signs:
  - shell evaluation completes
  - environment banner appears
  - no `nodePackages has been removed` error

### C) Validate Node/npx availability in WSL

- `command -v node && node --version`
- `command -v npx && npx --version`
- Stable paths observed:
  - `/usr/bin/npx` (system)
  - `/home/wsl-vm/.local/share/fnm/aliases/default/bin/npx` (fnm default alias)

### D) Validate Zed from Nix

- `command -v zeditor && zeditor --version`
- `command -v zed && zed --version`

## Operational usage flow

1. Open WSL terminal in target repo (`foam-modme`).
2. Ensure tooling health quickly:
   - `command -v devenv`
   - `command -v npx`
   - `command -v zeditor`
3. Enter project env:
   - `devenv shell`
4. Use editor/commands from env:
   - `zed` (or `zeditor`)
   - project scripts/tasks
5. For MCP issues in VS Code Insiders:
   - verify Windows `mcp.json` server command uses `wsl.exe` routing
   - reload VS Code window after config edits

## Troubleshooting patterns

### `spawn npx ENOENT` in next-devtools MCP

- Root cause: Windows-hosted MCP process using bare `npx` while Node isn’t on Windows PATH.
- Fix: route command through `wsl.exe -e <absolute WSL npx path> ...`.

### `nodePackages has been removed`

- Root cause: old nixpkgs attribute path in `devenv.nix`.
- Fix: move to top-level packages (`yarn`) and rely on `nodejs_20` for npm.

### VS Code terminal opens then exits with code 1

- Root cause: shell startup scripts ending with non-zero command or duplicate/conflicting init blocks.
- Fix: clean duplicates and end `.zshrc` with `true`.

## Lessons learned

- For mixed Windows+WSL tooling, MCP server execution context matters more than where configs were edited.
- Using absolute command paths avoids PATH fragility in extension hosts.
- Nix package namespace changes (like `nodePackages`) can break env eval even when most config is correct.
- Keep shell init deterministic; avoid duplicated runtime-manager blocks.

## Quick audit checklist

- [ ] `devenv version` returns a version.
- [ ] `devenv shell -- true` succeeds in `foam-modme`.
- [ ] Windows `mcp.json` next-devtools entry uses `wsl.exe` + WSL npx absolute path.
- [ ] `zsh -i -c 'exit $?'` exits 0.
- [ ] `zeditor --version` works.

## Updated Health script for Zed

Optimizing tool selection...

Added 1 todo

I’ll inspect your current shell and health-check implementation first so I can wire `zed-doctor` into the existing checks cleanly.

Read [](file:///home/wsl-vm/scripts)

Read [](file:///home/wsl-vm/.zshrc)

Read [](file:///home/wsl-vm/scripts/health-check.sh)

I’m going to implement this in two places: add a `zed-doctor` shell function in .zshrc, and extend health-check.sh with a Zed diagnostics section so `health` and `zed-doctor` share the same checks.

Generating patch (100 lines) in [](file:///home/wsl-vm/scripts/health-check.sh)

```

```

Generating patch (21 lines) in [](file:///home/wsl-vm/.zshrc)

```

```

Progress update: wiring is in place. I’ll now run quick validation for both combined health checks and the standalone `zed-doctor` function.

Ran terminal command:  /home/wsl-vm/scripts/health-check.sh | sed -n '1,220p'

Ran terminal command:  zsh -ic 'zed-doctor | sed -n "1,180p"'

I spotted one small bug while validating: the status logic marked `Disk 6%` as “Monitor.” I’ll quickly fix that so the integrated health output is accurate.

Generating patch (26 lines) in [](file:///home/wsl-vm/scripts/health-check.sh)

```

```

Ran terminal command:  /home/wsl-vm/scripts/health-check.sh | grep -E "Disk:|RAM:"

Completed: *Inspect existing health checks* (1/4)

Done — `zed-doctor` is now added and wired into your existing health checks so they run together. ✅

## What changed

- Updated `~/.zshrc`
  - Added `zed-doctor()` function:
    - runs `/home/wsl-vm/scripts/health-check.sh --zed-only`
  - Added `zed-doctor` mention in `term-help`

- Updated health-check.sh
  - Added reusable `print_zed_diagnostics()` section
  - Included Zed diagnostics in full `health` output
  - Added `--zed-only` mode for focused checks (`zed-doctor`)
  - Fixed Disk/RAM status logic bug (now reports correctly)

## How to use

- Full health (now includes Zed/WSLg checks):
  - `health`
- Zed-only diagnostics:
  - `zed-doctor`

If your current shell session started before the .zshrc edit, run:

- `source ~/.zshrc`

## What it now checks for Zed

- `zeditor`/`zed` command presence + version
- `DISPLAY`, `WAYLAND_DISPLAY`, `XDG_RUNTIME_DIR`
- WSLg wayland socket presence
- `weston`/`Xwayland` compositor processes
- Vulkan availability/device summary

You should now get one combined health flow plus a focused doctor mode.

Made changes.
