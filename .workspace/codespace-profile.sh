#!/usr/bin/env bash
# Codespace bash profile for this workspace
# - configures PATH and SKILLKIT_HOME
# - supports selectable profiles: safe, full
# - provides helper commands: `skillkit_list_profiles`, `skillkit_use_profile`

WORKSPACE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# source basic activation (always safe)
if [ -f "$WORKSPACE_ROOT/.workspace/activate-skillkit.sh" ]; then
  # shellcheck disable=SC1090
  source "$WORKSPACE_ROOT/.workspace/activate-skillkit.sh"
fi

PROFILE_FILE="$WORKSPACE_ROOT/.workspace/.active_profile"

skillkit_list_profiles() {
  cat <<'EOF'
Available workspace profiles:
  safe  - Configure PATH only (no .env, no logging). Safe default.
  full  - Configure PATH, load .env, and enable session logging.

Use: skillkit_use_profile <name>
EOF
}

skillkit_use_profile() {
  if [ -z "$1" ]; then
    echo "Usage: skillkit_use_profile <name>" >&2
    skillkit_list_profiles
    return 1
  fi
  case "$1" in
    safe|full)
      printf '%s' "$1" > "$PROFILE_FILE"
      echo "[skillkit] profile set to '$1'";
      ;;
    *)
      echo "Unknown profile: $1" >&2
      skillkit_list_profiles
      return 2
      ;;
  esac
}

# Decide which profile to enable
ACTIVE_PROFILE="safe"
if [ -f "$PROFILE_FILE" ]; then
  ACTIVE_PROFILE="$(cat "$PROFILE_FILE" 2>/dev/null || echo safe)"
fi

echo "[skillkit] workspace profile: $ACTIVE_PROFILE" 2>/dev/null

case "$ACTIVE_PROFILE" in
  safe)
    # already activated PATH above; nothing else to do
    ;;
  full)
    # source the session-start which loads .env and enables logging
    if [ -f "$WORKSPACE_ROOT/.workspace/session-start.sh" ]; then
      # shellcheck disable=SC1090
      source "$WORKSPACE_ROOT/.workspace/session-start.sh"
      echo "[skillkit] full profile: .env loaded and session logging enabled" 2>/dev/null
    fi
    ;;
  *)
    echo "[skillkit] unknown profile '$ACTIVE_PROFILE', falling back to safe" 2>/dev/null
    ;;
esac

# brief status line for interactive shells
if [ -t 1 ]; then
  echo "[skillkit] Profile='$ACTIVE_PROFILE' SKILLKIT_HOME='$SKILLKIT_HOME' PATH='${PATH%%:*}...'"
  echo "[skillkit] Helpers: skillkit_list_profiles, skillkit_use_profile" 2>/dev/null
fi

export SKILLKIT_PROFILE="$ACTIVE_PROFILE"
