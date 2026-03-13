#!/usr/bin/env bash
# Load all environment variables from .env file into current session
# This script exports ALL keys from .env as environment variables
# Usage: source scripts/load-env-vars.sh [.env_file]

set -o allexport  # Export all variable assignments

ENV_FILE="${1:-.env}"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Error: Environment file '$ENV_FILE' not found"
  exit 1
fi

echo "📦 Loading environment variables from $ENV_FILE..."
echo ""

# Source the .env file, filtering out comments and empty lines
while IFS= read -r line; do
  # Skip empty lines and comments
  [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]] && continue
  
  # Extract key and value
  if [[ "$line" =~ ^([A-Za-z_][A-Za-z0-9_]*)= ]]; then
    key="${BASH_REMATCH[1]}"
    value="${line#*=}"
    
    # Export the variable
    export "$key=$value"
    
    # Log (mask sensitive values)
    if [[ "$value" =~ ^sk|^ghp|^ctx|^cbiq|^rnd|^AQ|^AIza|^hf_ ]]; then
      echo "✓ $key=${value:0:10}...***" 
    else
      echo "✓ $key=$value"
    fi
  fi
done < "$ENV_FILE"

set +o allexport

echo ""
echo "✅ All environment variables loaded!"
echo ""
echo "📋 To verify, run:"
echo "   env | grep -E 'POSTGRES|N8N|OPENAI|GITHUB|ANTHROPIC|MCP|CONTEXT|GEMINI|JULES|HUGGING' | sort"
echo ""
echo "🔒 To save to Codespaces secrets, run:"
echo "   bash scripts/save-to-codespaces-secrets.sh"
