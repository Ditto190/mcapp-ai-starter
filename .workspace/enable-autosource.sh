#!/usr/bin/env bash
# Idempotently append a snippet to the user's ~/.bashrc to auto-source the
# workspace session-start script when a new interactive shell opens inside the
# workspace directory.

WORKSPACE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MARKER_START="# >>> skillkit workspace auto-source START >>>"
MARKER_END="# <<< skillkit workspace auto-source END <<<"
BASHRC="$HOME/.bashrc"

SNIPPET="$MARKER_START\n# Auto-source SkillKit workspace profile when opening a shell inside the workspace\nif [[ -n \"$PS1\" ]] && [[ \"$PWD\" == \"$WORKSPACE_ROOT\"* ]]; then\n  # shellcheck disable=SC1090\n  [ -f \"$WORKSPACE_ROOT/.workspace/codespace-profile.sh\" ] && source \"$WORKSPACE_ROOT/.workspace/codespace-profile.sh\"\nfi\n# Quick commands to manage profiles:\n#   skillkit_list_profiles   # list available profiles\n#   skillkit_use_profile full # opt-in to full profile (loads .env and session logging)\n$MARKER_END"

echo "[skillkit] enabling autosource in $BASHRC (idempotent)"

mkdir -p "$(dirname "$BASHRC")"

if grep -Fq "$MARKER_START" "$BASHRC" 2>/dev/null; then
  echo "[skillkit] autosource already present in $BASHRC"
  exit 0
fi

printf "\n%s\n" "$SNIPPET" >> "$BASHRC"
echo "[skillkit] appended autosource snippet to $BASHRC"

echo "To activate in your current shell run: source $WORKSPACE_ROOT/.workspace/session-start.sh"
