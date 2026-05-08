# Shell profile and agent tooling implementation log (2026-05-09)

## Scope and intent

This document records the implementation that optimized shell startup behavior and agent tooling reliability across WSL/Linux shells and Windows PowerShell bridging.

Primary goals:

- Make Node/Bun available in non-interactive shells (so extension hosts and spawned agent shells can resolve runtimes reliably)
- Reduce shell startup friction while preserving existing behavior
- Standardize telemetry/environment flags across shells
- Add project context shortcuts for faster agent navigation
- Add Windows PowerShell → WSL command bridge helpers

## Functional outcomes

### 1) Non-interactive shell runtime availability

- `~/.zshenv` now provides early PATH/runtime exports for all zsh invocations (interactive and non-interactive).
- `nvm` is initialized with `--no-use` in non-interactive startup paths to avoid heavy auto-version switching while still making Node resolution possible.
- Result: shells spawned by tooling (including extension host workflows) can find `node`/`bun` more reliably.

### 2) Faster, safer agent shell behavior

- `~/.zshrc` now includes non-interactive detection logic (`skip_global_compinit=1`) to reduce overhead in automation contexts.
- `.env.local` autoloading on directory change was added via zsh hook for project-scoped env hydration.
- New context aliases:
  - `ctx-foam`
  - `ctx-turbo`
  - `ctx-apm`

### 3) Cross-shell consistency

- Telemetry and Node warning behavior aligned in zsh + bash:
  - `TURBO_TELEMETRY_DISABLED=1`
  - `NEXT_TELEMETRY_DISABLED=1`
  - `NODE_OPTIONS=--no-warnings`

### 4) Windows PowerShell bridge for WSL-centric workflows

- Created a PowerShell profile to route commands through WSL and provide project entry shortcuts.
- Added convenience wrappers/aliases for WSL command execution and Bun invocation from PowerShell.

### 5) Biome LSP noise reduction

- Root `biome.json` was updated to exclude `*.xhtml` from Biome file processing to stop repeated formatting/language detection failures for xhtml extension.

## Technical implementation details

## Files changed

### `/home/wsl-vm/.zshenv`

Added/standardized:

- Agent-safe PATH baseline (including Bun binary path)
- `BUN_INSTALL` export
- Telemetry + node options exports
- Existing cargo env sourcing preserved
- `nvm` init using `--no-use`

Current effective block:

- `export PATH="$HOME/.bun/bin:$HOME/.local/bin:$HOME/.dotnet:$HOME/.local/share/fnm:$PATH"`
- `export BUN_INSTALL="$HOME/.bun"`
- `export TURBO_TELEMETRY_DISABLED=1`
- `export NEXT_TELEMETRY_DISABLED=1`
- `export NODE_OPTIONS="--no-warnings"`
- `export NVM_DIR="$HOME/.nvm"`
- `[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" --no-use`

### `/home/wsl-vm/.zshrc`

Added/updated:

- Telemetry + `NODE_OPTIONS` exports in main shell profile
- Non-interactive optimization guard:
  - `if [[ ! -o interactive ]]; then skip_global_compinit=1; fi`
- `.env.local` autoload hook:
  - function `_autoload_env_local`
  - `add-zsh-hook chpwd _autoload_env_local`
  - initial call `_autoload_env_local`
- Project context aliases with guarded `.env.local` sourcing:
  - `ctx-foam`, `ctx-turbo`, `ctx-apm`

Preserved behavior:

- Existing oh-my-zsh, prompt, aliases, helper functions, toolchain setup
- Existing final `true` safeguard to prevent terminal exit-code-1 conditions

### `/home/wsl-vm/.bashrc`

Changed:

- Converted nvm load to non-switching mode:
  - from `\. "$NVM_DIR/nvm.sh"`
  - to `\. "$NVM_DIR/nvm.sh" --no-use`
- Added telemetry + `NODE_OPTIONS` parity exports

Preserved:

- Existing interactive-shell guard and user customizations
- Existing fnm + bun setup and completion blocks

### `/mnt/c/Users/dylan.a.thomas/Documents/WindowsPowerShell/Microsoft.PowerShell_profile.ps1`

Created profile with:

- `Invoke-WSL` function and `wsl-run` alias
- `Invoke-Bun` wrapper and `bun` alias routed through WSL Bun path
- Project entry helpers/aliases:
  - `ctx-foam`, `ctx-turbo`, `ctx-apm`
- Telemetry env vars in PowerShell session:
  - `$env:TURBO_TELEMETRY_DISABLED = '1'`
  - `$env:NEXT_TELEMETRY_DISABLED = '1'`

### `/home/wsl-vm/biome.json`

Changed `files.includes` to exclude xhtml:

- Added `"!**/*.xhtml"`

Rationale:

- Avoid Biome LSP `textDocument/rangeFormatting` failures when encountering xhtml files unsupported by language detection.

## Scripting steps (execution sequence)

1. Baseline inspection of active shell dotfiles:
   - `~/.zshenv`, `~/.profile`, `~/.zshrc`, `~/.bashrc`
2. Added global non-interactive-safe exports in `~/.zshenv`
3. Added zsh runtime optimizations/hooks/aliases in `~/.zshrc`
4. Aligned bash behavior in `~/.bashrc`
5. Created PowerShell profile for WSL bridge workflows
6. Updated Biome config to suppress xhtml formatting errors
7. Ran post-change validation commands and syntax checks

## Validation and testing performed

Executed checks confirmed:

- `~/.zshenv` contains expected Bun/telemetry/node options exports
- Interactive zsh startup returns clean exit (`0`)
- Non-interactive zsh resolves `bun`
- Non-interactive zsh resolves `node`
- bash context resolves `bun`
- `TURBO_TELEMETRY_DISABLED` resolves to `1` in test shell
- `ctx-foam` alias exists in interactive zsh
- PowerShell profile exists at expected Windows profile path
- `zsh -n ~/.zshrc` passes
- `bash -n ~/.bashrc` passes

## Risk controls and non-breaking safeguards

- Kept changes additive and localized; no removals of existing workflow helpers.
- Used `nvm --no-use` to avoid startup delays and accidental Node version switching.
- Preserved existing shell fallback and terminal stability patterns.
- Used conditional checks before sourcing project-local env files.
- Ensured syntax validity for both zsh and bash after edits.

## Operational notes for future maintenance

- If startup feels slow in zsh, review plugin count and expensive completions first.
- If extension-host Node disappears again, verify `~/.zshenv` remains intact and sourced in the host process context.
- If PowerShell bridge aliases stop working, confirm Windows profile execution policy and profile load status.
- Keep Bun path in `~/.zshenv` for subagent shell reliability.

## Change timestamp

- Date: 2026-05-09
- Context: WSL Ubuntu + VS Code/extension-host + mixed zsh/bash/PowerShell toolchain
