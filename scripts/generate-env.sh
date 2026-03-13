#!/usr/bin/env bash
set -euo pipefail

SRC="${1:-.env.codespaces}"
DST="${2:-.env}"

if [ ! -f "$SRC" ]; then
  echo "Source file $SRC not found"
  exit 1
fi

echo "# Generated from $SRC on $(date -u +%Y-%m-%dT%H:%M:%SZ)" > "$DST"

while IFS= read -r line || [ -n "$line" ]; do
  if [[ "$line" =~ ^[[:space:]]*# ]] || [[ -z "$line" ]]; then
    echo "$line" >> "$DST"
    continue
  fi

  if [[ "$line" =~ ^([A-Za-z_][A-Za-z0-9_]*)= ]]; then
    key="${BASH_REMATCH[1]}"
    # Use runtime env var value if set, otherwise leave empty
    val="${!key-}"
    printf '%s=%s\n' "$key" "$val" >> "$DST"
  else
    echo "$line" >> "$DST"
  fi
done < "$SRC"

echo "Wrote $DST (values taken from runtime environment where available)"
