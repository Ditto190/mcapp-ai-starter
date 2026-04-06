#!/usr/bin/env bash
# =============================================================================
# install-vscode-extensions.sh
# Installs all recommended VS Code extensions for VSCode_March26 in WSL.
# Run from any directory:
#   bash scripts/ci/install-vscode-extensions.sh
# =============================================================================
set -euo pipefail

# Detect the 'code' binary (WSL remote server tunnel or standard install)
if command -v code &>/dev/null; then
  CODE_CMD="code"
elif command -v code-insiders &>/dev/null; then
  CODE_CMD="code-insiders"
else
  echo "[ERROR] 'code' command not found."
  echo "  Install from: https://code.visualstudio.com/docs/setup/linux"
  echo "  Or open this project via 'code .' from WSL to auto-install the server."
  exit 1
fi

echo "Using: $(command -v $CODE_CMD)"
echo ""

EXTENSIONS=(
  # Python
  "ms-python.python"
  "ms-python.vscode-pylance"
  "ms-pyright.pyright"
  "ms-python.debugpy"
  "ms-python.isort"
  "charliermarsh.ruff"
  "donjayamanne.python-environment-manager"
  "ms-python.vscode-python-envs"
  "njpwerner.autodocstring"
  "kevinrose.vsc-python-indent"

  # Jupyter
  "ms-toolsai.jupyter"
  "ms-toolsai.jupyter-keymap"
  "ms-toolsai.jupyter-renderers"
  "ms-toolsai.datawrangler"

  # Git / GitHub
  "eamodio.gitlens"
  "mhutchie.git-graph"
  "donjayamanne.githistory"
  "github.vscode-pull-request-github"
  "github.vscode-github-actions"

  # AI / Copilot / Agents
  "github.copilot-chat"
  "anthropic.claude-code"
  "timheuer.awesome-copilot"
  "digitarald.agent-memory"
  "visualstudioexptteam.vscodeintellicode"
  "amadeusitgroup.prompt-registry"
  "pimzino.spec-workflow-mcp"

  # Remote / WSL / Containers
  "ms-vscode-remote.remote-wsl"
  "ms-vscode-remote.remote-ssh"
  "ms-vscode-remote.remote-containers"
  "ms-vscode.remote-explorer"
  "ms-azuretools.vscode-docker"

  # Database
  "mongodb.mongodb-vscode"

  # Azure
  "ms-azuretools.vscode-bicep"
  "ms-azuretools.vscode-azureresourcegroups"

  # Web / JS / TS
  "dbaeumer.vscode-eslint"
  "esbenp.prettier-vscode"
  "christian-kohler.npm-intellisense"
  "christian-kohler.path-intellisense"

  # Shell / YAML / Config
  "foxundermoon.shell-format"
  "redhat.vscode-yaml"
  "tamasfe.even-better-toml"

  # Markdown
  "yzhang.markdown-all-in-one"
  "davidanson.vscode-markdownlint"
  "bierner.markdown-mermaid"

  # Utilities
  "humao.rest-client"
  "mechatroner.rainbow-csv"
  "formulahendry.code-runner"
  "pkief.material-icon-theme"
  "alefragnani.bookmarks"
  "codezombiech.gitignore"
  "qwtel.sqlite-viewer"
)

INSTALLED=0
SKIPPED=0
FAILED=0

for EXT in "${EXTENSIONS[@]}"; do
  echo -n "  Installing $EXT ... "
  if $CODE_CMD --install-extension "$EXT" --force &>/dev/null; then
    echo "OK"
    ((INSTALLED++)) || true
  else
    echo "FAILED"
    ((FAILED++)) || true
  fi
done

echo ""
echo "Done: $INSTALLED installed, $SKIPPED skipped, $FAILED failed."

if (( FAILED > 0 )); then
  echo "[WARN] Some extensions failed — you may need to install them manually via the Extensions panel."
fi
