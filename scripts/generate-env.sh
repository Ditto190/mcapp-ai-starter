#!/usr/bin/env bash
set -euo pipefail

SRC="${1:-.env.codespaces}"
DST="${2:-.env}"

if [ ! -f "$SRC" ]; then
  echo "Source file $SRC not found"
  exit 1
fi

# Build a case-insensitive map of runtime environment variables
declare -A env_vals
while IFS= read -r envline; do
  # Skip empty
  [ -z "$envline" ] && continue
  name="${envline%%=*}"
  val="${envline#*=}"
  env_vals["${name,,}"]="$val"
done < <(env)

# Build a case-insensitive map from existing .env (if present)
declare -A file_vals
if [ -f .env ]; then
  while IFS= read -r fline; do
    # Strip leading/trailing whitespace
    line_trimmed="$(echo "$fline" | sed -e 's/^\s*//' -e 's/\s*$//')"
    # Skip comments and empty lines
    [[ "$line_trimmed" =~ ^# ]] && continue
    [ -z "$line_trimmed" ] && continue
    if [[ "$line_trimmed" == *=* ]]; then
      name="${line_trimmed%%=*}"
      val="${line_trimmed#*=}"
      file_vals["${name,,}"]="$val"
    fi
  done < .env
fi

echo "# Generated from $SRC on $(date -u +%Y-%m-%dT%H:%M:%SZ)" > "$DST"

while IFS= read -r line || [ -n "$line" ]; do
  if [[ "$line" =~ ^[[:space:]]*# ]] || [[ -z "$line" ]]; then
    echo "$line" >> "$DST"
    continue
  fi

  if [[ "$line" =~ ^([A-Za-z_][A-Za-z0-9_]*)= ]]; then
    key="${BASH_REMATCH[1]}"
    key_lc="${key,,}"

    # Priority: exact runtime env var -> runtime env case-insensitive -> existing .env case-insensitive -> empty
    val=""
    if [ -n "${!key-}" ]; then
      val="${!key}"
    elif [ -n "${env_vals[$key_lc]-}" ]; then
      val="${env_vals[$key_lc]}"
    elif [ -n "${file_vals[$key_lc]-}" ]; then
      val="${file_vals[$key_lc]}"
    fi

    printf '%s=%s\n' "$key" "$val" >> "$DST"
  else
    echo "$line" >> "$DST"
  fi
done < "$SRC"

echo "Wrote $DST (values taken from runtime environment or existing .env where available)"
