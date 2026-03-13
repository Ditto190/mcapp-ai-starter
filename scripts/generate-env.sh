#!/usr/bin/env bash
set -euo pipefail

SRC="${1:-.env.codespaces}"
DST="${2:-.env}"
WORKSPACE_ENV="${3:-.env}"

if [ ! -f "$SRC" ]; then
  echo "Source file $SRC not found"
  exit 1
fi

# Build a case-insensitive map of runtime environment variables (from Codespaces secrets)
declare -A env_vals
while IFS= read -r envline; do
  # Skip empty
  [ -z "$envline" ] && continue
  name="${envline%%=*}"
  val="${envline#*=}"
  env_vals["${name,,}"]="$val"
done < <(env)

# Build a case-insensitive map from existing workspace .env (if present)
declare -A file_vals
declare -a all_keys_from_file
if [ -f "$WORKSPACE_ENV" ]; then
  while IFS= read -r fline; do
    # Strip leading/trailing whitespace and URL comments
    line_trimmed="$(echo "$fline" | sed -e 's/^\s*//' -e 's/\s*$//' -e 's/[[:space:]]*#.*//')"
    # Skip comments, empty lines, export statements, PowerShell syntax, and non-assignment lines
    [[ "$line_trimmed" =~ ^# ]] && continue
    [[ "$line_trimmed" =~ ^export[[:space:]]+ ]] && continue
    [[ "$line_trimmed" =~ ^\$env: ]] && continue
    [[ "$line_trimmed" =~ ^\[System ]] && continue
    [ -z "$line_trimmed" ] && continue
    if [[ "$line_trimmed" == *=* ]]; then
      name="${line_trimmed%%=*}"
      val="${line_trimmed#*=}"
      name_clean="$(echo "$name" | sed -e 's/^\s*//' -e 's/\s*$//')"
      # Skip non-typical env var names (like "setx" or "git")
      if [[ "$name_clean" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]]; then
        # Store both case-insensitive and preserve original case
        file_vals["${name_clean,,}"]="$val"
        all_keys_from_file+=("$name_clean")
      fi
    fi
  done < "$WORKSPACE_ENV"
fi

echo "# Generated from $SRC on $(date -u +%Y-%m-%dT%H:%M:%SZ)" > "$DST"
echo "# Source: Codespaces secrets + $WORKSPACE_ENV fallback" >> "$DST"
echo "" >> "$DST"

# Track which keys we've processed
declare -A processed_keys

# First pass: process all keys from template
while IFS= read -r line || [ -n "$line" ]; do
  if [[ "$line" =~ ^[[:space:]]*# ]] || [[ -z "$line" ]]; then
    echo "$line" >> "$DST"
    continue
  fi

  if [[ "$line" =~ ^([A-Za-z_][A-Za-z0-9_]*)= ]]; then
    key="${BASH_REMATCH[1]}"
    key_lc="${key,,}"
    processed_keys[$key_lc]=1

    # Priority: exact runtime env var -> runtime env case-insensitive -> existing .env case-insensitive -> template default -> empty
    val=""
    if [ -n "${!key-}" ]; then
      val="${!key}"
    elif [ -n "${env_vals[$key_lc]-}" ]; then
      val="${env_vals[$key_lc]}"
    elif [ -n "${file_vals[$key_lc]-}" ]; then
      val="${file_vals[$key_lc]}"
    else
      # Extract default from template if exists
      val="${line#*=}"
    fi

    printf '%s=%s\n' "$key" "$val" >> "$DST"
  else
    echo "$line" >> "$DST"
  fi
done < "$SRC"

# Second pass: add any keys from workspace .env that aren't in the template
if [ ${#all_keys_from_file[@]} -gt 0 ]; then
  echo "" >> "$DST"
  echo "# Additional keys from workspace environment" >> "$DST"
  for key in "${all_keys_from_file[@]}"; do
    key_lc="${key,,}"
    if [ -z "${processed_keys[$key_lc]-}" ]; then
      val="${file_vals[$key_lc]:-}"
      printf '%s=%s\n' "$key" "$val" >> "$DST"
    fi
  done
fi

echo ""
echo "✓ Wrote $DST"
echo "  - Source template: $SRC"
echo "  - Workspace fallback: $WORKSPACE_ENV"
echo "  - Secrets source: Codespaces environment variables"
echo "  - Priority: Runtime env vars > Codespaces secrets > Workspace .env > Template defaults"
