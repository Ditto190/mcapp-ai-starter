#!/usr/bin/env bash
# deploy.sh
#
# Deploys the Nix-based GitHub Actions self-hosted runner.
#
# Usage:
#   RUNNER_TOKEN=<token> REPO_URL=<url> bash deploy.sh
#
# Environment variables:
#   RUNNER_TOKEN  — GitHub runner registration token (required)
#                   Generate at: Settings → Actions → Runners → New runner
#   REPO_URL      — Repository URL (default: https://github.com/Ditto190/mcapp-ai-starter)
#   RUNNER_NAME   — Runner display name (default: nix-runner)
#   DRY_RUN       — Set to "1" to build without activating (default: off)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

REPO_URL="${REPO_URL:-$(git -C "${SCRIPT_DIR}" remote get-url origin 2>/dev/null || echo 'https://github.com/Ditto190/mcapp-ai-starter')}"
RUNNER_NAME="${RUNNER_NAME:-nix-runner}"
DRY_RUN="${DRY_RUN:-0}"

# ── Validate prerequisites ──────────────────────────────────────────────────
if [ -z "${RUNNER_TOKEN:-}" ]; then
  echo "ERROR: RUNNER_TOKEN is required."
  echo "  Generate one at: ${REPO_URL}/settings/actions/runners/new"
  exit 1
fi

if ! command -v nix &>/dev/null; then
  echo "Nix not found — installing Determinate Nix..."
  curl --proto '=https' --tlsv1.2 -sSf -L \
    https://install.determinate.systems/nix | sh -s -- install --no-confirm
  # Re-source nix profile for this session
  # shellcheck disable=SC1091
  [ -f /nix/var/nix/profiles/default/etc/profile.d/nix-daemon.sh ] && \
    source /nix/var/nix/profiles/default/etc/profile.d/nix-daemon.sh
fi

echo "Nix version: $(nix --version)"

# ── Build the NixOS system ──────────────────────────────────────────────────
echo "Building runner NixOS configuration..."
cd "${SCRIPT_DIR}"

# Export the repo URL so that configuration.nix can read it via builtins.getEnv
export RUNNER_REPO_URL="${REPO_URL}"

nix build ".#nixosConfigurations.runner.config.system.build.toplevel" \
  --print-build-logs \
  --no-link \
  --out-link /tmp/nix-runner-build

if [ "${DRY_RUN}" = "1" ]; then
  echo "DRY_RUN=1 — built successfully, not activating."
  exit 0
fi

# ── Write the runner registration token to the secrets directory ────────────
# This file is read by the NixOS github-runner service at startup.
# The token is write-protected and only readable by root.
echo "Writing runner token to /run/secrets/runner-token..."
sudo mkdir -p /run/secrets
printf '%s' "${RUNNER_TOKEN}" | sudo tee /run/secrets/runner-token > /dev/null
sudo chmod 600 /run/secrets/runner-token

# ── Activate the new NixOS configuration ───────────────────────────────────
echo "Activating NixOS configuration..."
sudo /tmp/nix-runner-build/bin/switch-to-configuration switch

# ── Verify the runner service started ───────────────────────────────────────
echo "Waiting for runner service to start..."
sleep 5

if systemctl is-active --quiet "github-runner-nix-runner.service" 2>/dev/null; then
  echo "✅ Runner service is active."
elif systemctl is-active --quiet "github-runner.service" 2>/dev/null; then
  echo "✅ Runner service is active (legacy service name)."
else
  echo "⚠️  Runner service may still be starting — check with:"
  echo "   systemctl status github-runner-nix-runner"
fi

echo ""
echo "Runner '${RUNNER_NAME}' deployed."
echo "Verify at: ${REPO_URL}/settings/actions/runners"
