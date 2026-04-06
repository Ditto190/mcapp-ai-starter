#!/usr/bin/env bash
set -euo pipefail

# Install CodeQL CLI into .tools/codeql if not already present.
# Designed for WSL / Linux environments. Safe to re-run.

TOOLS_DIR="$(pwd)/.tools"
CODEQL_BIN="$TOOLS_DIR/codeql"

log() { printf "%s\n" "$*" >&2; }

if [ -x "$CODEQL_BIN" ]; then
  log "CodeQL already installed at $CODEQL_BIN"
  exit 0
fi

log "CodeQL not found — installing into $TOOLS_DIR"
mkdir -p "$TOOLS_DIR"

# Resolve latest release download URL for linux64 via GitHub API using python for robust JSON parsing
get_latest_url() {
  repo="github/codeql-cli-binaries"
  api_url="https://api.github.com/repos/$repo/releases/latest"
  if command -v curl >/dev/null 2>&1; then
    json=$(curl -sSfL "$api_url") || return 1
  else
    log "curl not found — cannot download CodeQL"; return 2
  fi
  if command -v python3 >/dev/null 2>&1; then
    python3 - <<'PY'
import sys, json
data=json.load(sys.stdin)
assets=data.get('assets',[])
for a in assets:
    name=a.get('name','')
    url=a.get('browser_download_url')
    if name and 'linux64' in name and url:
        print(url)
        sys.exit(0)
sys.exit(1)
PY
  else
    # Fallback: crude grep-based extraction
    echo "$json" | grep -oE 'https://[^"]+linux64[^\"]+' | head -n1
  fi
}

DOWNLOAD_URL=$(get_latest_url) || {
  log "Failed to resolve latest CodeQL release URL"; exit 3
}

tmp_zip="$TOOLS_DIR/codeql_tmp.zip"
log "Downloading CodeQL from: $DOWNLOAD_URL"
curl -L -o "$tmp_zip" "$DOWNLOAD_URL"

log "Extracting CodeQL..."
unzip -q -o "$tmp_zip" -d "$TOOLS_DIR"
rm -f "$tmp_zip"

# Find the extracted 'codeql' binary inside the extracted tree
found=""
while IFS= read -r -d $'\0' f; do
  found="$f"
  break
done < <(find "$TOOLS_DIR" -type f -name codeql -print0 2>/dev/null)

if [ -z "$found" ]; then
  log "Failed to locate extracted codeql binary. Listing $TOOLS_DIR:"; ls -la "$TOOLS_DIR" >&2
  exit 4
fi

mv -f "$found" "$CODEQL_BIN"
chmod +x "$CODEQL_BIN"

# Clean up any nested directories created by the zip (keeping codeql only)
for d in "$TOOLS_DIR"/*; do
  if [ "$d" != "$CODEQL_BIN" ] && [ -d "$d" ]; then
    # leave directories that are needed; delete if they do not contain codeql
    if ! find "$d" -type f -name codeql -print -quit >/dev/null; then
      rm -rf "$d"
    fi
  fi
done

log "CodeQL installed at $CODEQL_BIN"
exit 0
