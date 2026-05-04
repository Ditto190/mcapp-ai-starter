---
title: WSL Nix + Zed + devenv + Next DevTools MCP Complete Guide
status: validated
last_updated: 2026-05-03
scope:
  - WSL Ubuntu
  - VS Code Insiders
  - foam-modme repo
command_list:
  - id: check_devenv
    cmd: command -v devenv && devenv version
    purpose: Verify devenv is installed and runnable
  - id: install_devenv
    cmd: nix profile add nixpkgs#devenv
    purpose: Install devenv globally via Nix profile
  - id: verify_shell_eval
    cmd: cd /home/wsl-vm/projects/foam-modme && devenv shell -- true
    purpose: Validate devenv.nix evaluation and shell activation
  - id: check_node_npx
    cmd: command -v node && node --version && command -v npx && npx --version
    purpose: Ensure Node/npx are available in WSL
  - id: check_zed
    cmd: command -v zeditor && zeditor --version && command -v zed && zed --version
    purpose: Validate Nix-managed Zed binaries
  - id: check_vulkan
    cmd: vulkaninfo --summary
    purpose: Optional GPU/Vulkan diagnostics for Zed startup
  - id: dotnet_build_cache_generator
    cmd: dotnet build /home/wsl-vm/.cache/copilot/marketplaces/github-awesome-copilot/skills/winmd-api-search/scripts/cache-generator/CacheGenerator.csproj
    purpose: Workspace build command currently available via VS Code tasks
  - id: dotnet_publish_cache_generator
    cmd: dotnet publish /home/wsl-vm/.cache/copilot/marketplaces/github-awesome-copilot/skills/winmd-api-search/scripts/cache-generator/CacheGenerator.csproj
    purpose: Workspace publish command currently available via VS Code tasks
  - id: dotnet_watch_cache_generator
    cmd: dotnet watch run --project /home/wsl-vm/.cache/copilot/marketplaces/github-awesome-copilot/skills/winmd-api-search/scripts/cache-generator/CacheGenerator.csproj
    purpose: Workspace watch/run command currently available via VS Code tasks
---

## What this guide solves

This guide standardizes a reliable setup for:

- Nix-managed Zed in WSL
- `devenv` for `foam-modme`
- `next-devtools-mcp` startup reliability in VS Code Insiders
- occasional `zsh` startup exit-code instability

## Functional baseline (known-good)

- `devenv` installed and working globally.
- `foam-modme` `devenv shell` evaluates successfully.
- Zed runs from Nix (`zeditor`; `zed` alias/symlink path available).
- Next DevTools MCP no longer depends on bare Windows `npx`.
- `.zshrc` startup is deterministic.

## Step-by-step implementation

### 1) Validate `devenv` first, install only if missing

1. Run `command -v devenv && devenv version`.
2. If missing, install with `nix profile add nixpkgs#devenv`.
3. Re-run version check.

### 2) Fix `devenv.nix` package migration (critical)

In `/home/wsl-vm/projects/foam-modme/devenv.nix`:

- Replace removed package references:
  - `nodePackages.npm` → remove (npm is included with `nodejs_20`)
  - `nodePackages.yarn` → `yarn`
- Keep `nodejs_20` in `packages`.

Why: newer nixpkgs removed `nodePackages` namespace in this usage path.

### 3) Validate project environment activation

Run:

- `cd /home/wsl-vm/projects/foam-modme && devenv shell -- true`

Success criteria:

- shell evaluates without `nodePackages has been removed`
- `enterShell` banner appears
- command exits successfully

### 4) Validate Node/npx availability in WSL

Run:

- `command -v node && node --version`
- `command -v npx && npx --version`

Use absolute paths for MCP commands where possible for stability.

### 5) Fix Next DevTools MCP spawn issue (`spawn npx ENOENT`)

If logs show `Starting server from LocalProcess extension host` and `spawn npx ENOENT`, the process is running on Windows side.

Update Windows-side MCP catalog file:

- `C:\Users\dylan.a.thomas\AppData\Roaming\Code - Insiders\User\mcp.json`

Set server `io.github.vercel/next-devtools-mcp` to run through WSL:

- `command`: `wsl.exe`
- args pattern:
  - `-e`
  - `/home/wsl-vm/.local/share/fnm/node-versions/v24.15.0/installation/bin/npx`
  - `-y`
  - `next-devtools-mcp@0.3.6`

Then reload VS Code Insiders window.

### 6) Stabilize zsh startup behavior

In `/home/wsl-vm/.zshrc`:

- remove duplicate runtime export blocks (especially repeated Bun blocks)
- keep one clean `fnm` init block
- add trailing `true` so shell init returns success

This mitigates intermittent:

- `The terminal process "/usr/bin/zsh" terminated with exit code: 1`

## Configuration references

### Project config

- `/home/wsl-vm/projects/foam-modme/devenv.nix`

### Shell config

- `/home/wsl-vm/.zshrc`

### VS Code Insiders (Windows-side MCP catalog)

- `C:\Users\dylan.a.thomas\AppData\Roaming\Code - Insiders\User\mcp.json`

### WSL-side MCP config (already valid in this setup)

- `/home/wsl-vm/.vscode/mcp.json`

## Run and build commands

### Environment run commands

- `devenv shell`
- `devenv shell -- true`
- `devenv version`

### Toolchain run commands

- `zeditor --version`
- `zed --version`
- `node --version`
- `npx --version`

### Workspace build/publish/watch task commands

- `dotnet build /home/wsl-vm/.cache/copilot/marketplaces/github-awesome-copilot/skills/winmd-api-search/scripts/cache-generator/CacheGenerator.csproj`
- `dotnet publish /home/wsl-vm/.cache/copilot/marketplaces/github-awesome-copilot/skills/winmd-api-search/scripts/cache-generator/CacheGenerator.csproj`
- `dotnet watch run --project /home/wsl-vm/.cache/copilot/marketplaces/github-awesome-copilot/skills/winmd-api-search/scripts/cache-generator/CacheGenerator.csproj`

## Lessons learned

1. MCP execution context matters: Windows-hosted local processes cannot assume WSL shell PATH.
2. Absolute executable paths reduce extension-host PATH drift issues.
3. Nix package namespace changes can break eval even when environment is otherwise valid.
4. Shell startup scripts should end in deterministic success to avoid flaky terminal startup failures.
5. For hybrid Windows+WSL dev setups, route Node-based MCP servers through `wsl.exe` when tools live in WSL.

## Quick validation checklist

- [ ] `devenv version` returns successfully
- [ ] `devenv shell -- true` works in `foam-modme`
- [ ] `node` and `npx` resolve in WSL
- [ ] Next DevTools MCP uses `wsl.exe` routing in Windows `mcp.json`
- [ ] new VS Code terminal opens without exit-code-1 failure
