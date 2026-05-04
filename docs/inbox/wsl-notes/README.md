# WSL Notes — Reference Index

Troubleshooting guides, runbooks, and config notes for the WSL Ubuntu development environment.

## Guides in this folder

| File | Topic |
|------|-------|
| [zed-wsl-quickstart.md](./zed-wsl-quickstart.md) | **Zed editor in WSL** — software render fix, daily usage |
| [wsl-nix-zed-devenv-next-devtools-complete-guide.md](./wsl-nix-zed-devenv-next-devtools-complete-guide.md) | Full Nix + devenv + Zed + MCP setup guide |
| [## zed editor and linux.md](./##%20zed%20editor%20and%20linux.md) | Zed Linux install reference notes |
| [## M365 Copilot WSL and Agent environment setup with zsh terminal.md](./##%20M365%20Copilot%20WSL%20and%20Agent%20environment%20setup%20with%20zsh%20terminal.md) | M365 Copilot + agent env setup |
| [PLAN.md](./PLAN.md) | WSL home cleanup and project restructure plan |
| [PLAN-monodev.md](./PLAN-monodev.md) | Mono dev workspace planning |

## Quick reference

### Open Zed editor

```zsh
zed .                        # open current directory
zed ~/projects/foam-modme    # open a project
pkill -f zed-editor && zed . # force fresh start if frozen/broken
```

### Validate WSL toolchain

```zsh
command -v devenv && devenv version
command -v node && node --version
command -v zed && zed --version   # should show ~/.local/zed.app path
```

### Shell config

- Primary config: `~/.zshrc`
- Zed launcher function lives in `~/.zshrc` (with software render env vars)
- Workspace aliases: `ws`, `proj`, `foam`, `apm`, `turbo`, etc.

## Environment facts

- OS: WSL2 Ubuntu, user `wsl-vm`
- Shell: zsh + Oh My Zsh + Oh My Posh
- Zed working install: `~/.local/zed.app/` (via `curl https://zed.dev/install.sh | sh`)
- Nix Zed (`zeditor`): installed but **broken for GUI** in WSL (no GPU surface)
- GPU: llvmpipe only (LLVM CPU software renderer via Vulkan lavapipe)
- Display: WSLg (`wayland-0` → `/mnt/wslg/runtime-dir/wayland-0`)

## Key issue: Zed surface creation failure

If you see `Failed to create surface for any enabled backend: {}`, see [zed-wsl-quickstart.md](./zed-wsl-quickstart.md).
The fix requires `VK_ICD_FILENAMES=/usr/share/vulkan/icd.d/lvp_icd.json` to force lavapipe Vulkan.
