# Self-Hosted Runner with Nix

This directory contains a [Nix flake](https://nixos.wiki/wiki/Flakes) that
provisions a deterministic, reproducible GitHub Actions self-hosted runner
environment.  A single `nix build` command produces a bootable NixOS system
image or a systemd service configuration.

## Prerequisites

| Tool | Install command |
|------|----------------|
| Nix (Determinate) | `curl --proto '=https' --tlsv1.2 -sSf -L https://install.determinate.systems/nix \| sh -s -- install` |
| Git | available in Nix shell |
| A Linux VM or bare-metal host | minimum 512 MB RAM, 1 vCPU |

## Quick start

```bash
# 1. Install Determinate Nix (flakes enabled by default)
curl --proto '=https' --tlsv1.2 -sSf -L \
  https://install.determinate.systems/nix | sh -s -- install

# 2. Clone / navigate to this directory
cd .github/runners

# 3. Generate a GitHub runner registration token
#    (Settings → Actions → Runners → New self-hosted runner → "Registration token")
export RUNNER_TOKEN="<paste-token-here>"
export REPO_URL="https://github.com/Ditto190/mcapp-ai-starter"

# 4. Deploy (builds configuration + registers runner)
bash deploy.sh

# 5. The runner service starts automatically and shows up in
#    Settings → Actions → Runners as "nix-runner".
```

## Files

| File | Purpose |
|------|---------|
| `flake.nix` | Flake definition — declares inputs and NixOS system output |
| `configuration.nix` | NixOS module — installs runner service, tools, Docker |
| `deploy.sh` | Deployment script — wraps Nix build + systemd activation |
| `README.md` | This file |

## Installed tools on the runner

- **Node.js 20** + npm
- **Git**
- **ripgrep** (`rg`) — used by `discover-agents.mjs`
- **jq** — JSON processing in workflow scripts
- **Docker** (rootless) — for containerised agent steps
- **GitHub Actions runner** (latest) — auto-registers on first boot

## Updating

Because the environment is fully deterministic, updating is a one-liner:

```bash
nix flake update && bash deploy.sh
```

Nix garbage-collects old generations automatically.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Runner appears offline | Check `systemctl status github-runner` |
| Registration token expired | Generate a new token and re-run `deploy.sh` |
| Docker permission denied | Run `sudo systemctl restart docker`; ensure user is in `docker` group |
| Build fails on non-NixOS | Use `nixos-rebuild build-vm` to test in a VM first |
