#!/usr/bin/env bash
set -euo pipefail

# Simple plugin installation helper (safe; does not call external services)
# - Lists available plugins under ./plugins
# - Packages each plugin dir into a zip in ./build/plugins
# - Prints suggested install commands for Claude Code and local inspection

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PLUGINS_DIR="$ROOT_DIR/plugins"
OUT_DIR="$ROOT_DIR/build/plugins"

mkdir -p "$OUT_DIR"

if [ ! -d "$PLUGINS_DIR" ]; then
  echo "No plugins directory found at $PLUGINS_DIR"
  exit 1
fi

echo "Found plugin directories:"

shopt -s nullglob
for d in "$PLUGINS_DIR"/*/; do
  name=$(basename "$d")
  echo " - $name"
  zipfile="$OUT_DIR/${name}.zip"
  (cd "$PLUGINS_DIR" && zip -r -q "$zipfile" "$name")
  echo "Packaged $name -> $zipfile"
  echo "Suggested Claude Code install: '/plugin install $name@local' or follow README in plugins/$name"
  echo "To inspect locally: unzip -l $zipfile"
  echo
done

echo "Plugin packaging complete. Artifacts saved under $OUT_DIR"

echo "Note: This script does NOT publish to external plugin marketplaces. Follow plugin README or platform-specific CLI to publish/install."
