#!/usr/bin/env bash
set -euo pipefail

REQUIRED_NODE_MAJOR=22
REQUIRED_NODE_MINOR=22

echo "[wasp-installer] Starting Wasp installer"

has_node=false
if command -v node >/dev/null 2>&1; then
  NODE_VERSION_RAW=$(node -v | sed 's/v//')
  NODE_MAJOR=$(echo "$NODE_VERSION_RAW" | cut -d. -f1)
  NODE_MINOR=$(echo "$NODE_VERSION_RAW" | cut -d. -f2)
  echo "[wasp-installer] Found node version $NODE_VERSION_RAW"
  if [ "$NODE_MAJOR" -gt "$REQUIRED_NODE_MAJOR" ] || { [ "$NODE_MAJOR" -eq "$REQUIRED_NODE_MAJOR" ] && [ "$NODE_MINOR" -ge "$REQUIRED_NODE_MINOR" ]; }; then
    has_node=true
  fi
fi

if [ "$has_node" = false ]; then
  echo "[wasp-installer] Installing nvm and Node.js (22.x)"
  # Install nvm
  curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
  export NVM_DIR="$HOME/.nvm"
  # shellcheck source=/dev/null
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
  nvm install 22
  nvm alias default 22
fi

echo "[wasp-installer] Ensuring npm is available"
npm --version

echo "[wasp-installer] Installing @wasp.sh/wasp-cli globally"
if npm install -g @wasp.sh/wasp-cli@latest; then
  echo "[wasp-installer] wasp npm package installed"
else
  echo "[wasp-installer] Global npm install failed, retrying with sudo and --unsafe-perm"
  sudo npm install -g --unsafe-perm @wasp.sh/wasp-cli@latest
fi

echo "[wasp-installer] Verifying wasp"
if command -v wasp >/dev/null 2>&1; then
  echo "[wasp-installer] wasp installed at: $(command -v wasp)"
  wasp --version || true
  touch "$HOME/.wasp_installed"
  echo "[wasp-installer] Success"
else
  echo "[wasp-installer] ERROR: wasp not found in PATH after install"
  exit 1
fi
