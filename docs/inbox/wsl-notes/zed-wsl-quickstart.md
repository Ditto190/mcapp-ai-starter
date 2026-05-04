# Zed Editor in WSL — Quickstart

> **TL;DR:** Zed needs software Vulkan rendering in WSL. The `zed()` function in `~/.zshrc` handles this automatically. Just run `zed .` from your terminal.

## Prerequisites

- WSL2 Ubuntu with WSLg (wayland-0 socket present at `/run/user/1000/`)
- Zed local install: `~/.local/zed.app/` (if missing, see [Install](#install))
- `lvp_icd.json` present: `ls /usr/share/vulkan/icd.d/lvp_icd.json`

## Daily usage

```zsh
zed .                          # open current directory as project
zed ~/projects/foam-modme      # open a specific project
zed src/index.ts               # open a specific file
```

If Zed freezes or the window never appears:

```zsh
pkill -f zed-editor            # kill stale daemon
zed .                          # relaunch fresh
```

## How it works

WSL2 has no real GPU — only `llvmpipe` (LLVM CPU software renderer).
Zed uses WGPU/Vulkan internally. Without forcing the lavapipe software Vulkan ICD,
GPUI fails with `Failed to create surface for any enabled backend: {}`.

The `zed()` function in `~/.zshrc` injects the required env vars automatically:

```zsh
unalias zed 2>/dev/null
zed() {
    if [[ -x "$HOME/.local/bin/zed" ]]; then
        LIBGL_ALWAYS_SOFTWARE=1 \
        MESA_LOADER_DRIVER_OVERRIDE=llvmpipe \
        GALLIUM_DRIVER=llvmpipe \
        VK_ICD_FILENAMES=/usr/share/vulkan/icd.d/lvp_icd.json \
        "$HOME/.local/bin/zed" "$@"
    elif command -v zeditor >/dev/null 2>&1; then
        zeditor "$@"
    else
        echo "zed is not installed."; return 127
    fi
}
```

The `unalias zed 2>/dev/null` line prevents a zsh parse error when re-sourcing the file.

## Verify Zed launched correctly

```zsh
grep "Selected GPU\|Rendered first frame" ~/.local/share/zed/logs/Zed.log | tail -5
```

Success output:

```
INFO [gpui_wgpu::wgpu_context] Selected GPU: llvmpipe (LLVM 20.1.2, 256 bits) (Vulkan)
INFO [workspace] Rendered first frame
```

## Install

If `~/.local/zed.app/` is missing:

```zsh
curl -f https://zed.dev/install.sh | sh
```

> **Note:** The Nix `zeditor` binary (`~/.nix-profile/bin/zeditor`) **does not work** for GUI in WSL.
> Always use the local install via `zed` (not `zeditor`).

## Troubleshooting

### `Failed to create surface for any enabled backend: {}`

- The stale Nix daemon is running: `pkill -f zed-editor && zed .`
- Or the function isn't loaded: `source ~/.zshrc && zed .`

### `.zshrc` parse error on source (`defining function based on alias 'zed'`)

- The `unalias zed 2>/dev/null` line is missing above the `zed()` function definition.
- Check: `grep -n "unalias zed" ~/.zshrc`

### `zed --version` shows Nix path instead of local path

- The Nix binary is taking priority. Check: `which zed`
- The function should override it once `~/.zshrc` is sourced in an interactive shell.

### Zed opens but is very slow

- Expected in WSL — software CPU rendering has no GPU acceleration.
- Performance is acceptable for editing; avoid heavy GPU-rendered animations in themes.

## Diagnostics cheatsheet

```zsh
# Check Vulkan available adapters
vulkaninfo --summary 2>&1 | head -30

# Check lavapipe ICD exists
ls /usr/share/vulkan/icd.d/lvp_icd.json

# Check WSLg display
echo "WAYLAND_DISPLAY=$WAYLAND_DISPLAY"
ls -la /run/user/1000/wayland-0

# Check which zed binary is active
which zed
zed --version    # should show ~/.local/zed.app path

# Check for stale daemon
pgrep -la zed

# Full Zed log (filtered)
grep -v "fs_watcher\|worktree" ~/.local/share/zed/logs/Zed.log | tail -20
```
