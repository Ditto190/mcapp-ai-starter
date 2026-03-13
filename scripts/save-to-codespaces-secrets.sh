#!/usr/bin/env bash
# Generate GitHub Codespaces CLI commands to save all .env keys as secrets
# This helps you understand how to add secrets via GitHub CLI or web UI
# Usage: bash scripts/save-to-codespaces-secrets.sh > codespaces-secrets.sh

ENV_FILE=".env"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Error: $ENV_FILE not found"
  exit 1
fi

echo "#!/usr/bin/env bash"
echo "# Auto-generated script to set GitHub Codespaces secrets"
echo "# Generated on $(date)"
echo "# Usage: gh codespace secrets set VARNAME --body 'value'"
echo ""
echo "# ============================================================"
echo "# OPTION 1: Using GitHub CLI (requires: gh auth login)"
echo "# ============================================================"
echo ""
echo "echo '📝 Setting Codespaces secrets via GitHub CLI...'"
echo ""

while IFS= read -r line; do
  # Skip empty lines, comments, and special lines
  [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]] && continue
  [[ "$line" =~ ^\`\`\` ]] && continue
  
  # Extract key and value
  if [[ "$line" =~ ^([A-Za-z_][A-Za-z0-9_]*)= ]]; then
    key="${BASH_REMATCH[1]}"
    value="${line#*=}"
    
    # Escape single quotes in value
    value_escaped="${value//\'/\'\\\'\'}"
    
    # Output the gh command
    echo "gh secret set $key --body '$value_escaped'"
  fi
done < "$ENV_FILE"

echo ""
echo "echo '✅ All Codespaces secrets set!'"
echo ""
echo "# ============================================================"
echo "# OPTION 2: Using GitHub Web UI"
echo "# ============================================================"
echo ""
echo "# 1. Go to: https://github.com/settings/codespaces"
echo "# 2. Under 'Codespaces secrets', click 'New secret'"
echo "# 3. For each key below, add it:"
echo "#"

while IFS= read -r line; do
  # Skip empty lines, comments, and special lines  
  [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]] && continue
  [[ "$line" =~ ^\`\`\` ]] && continue
  
  # Extract key
  if [[ "$line" =~ ^([A-Za-z_][A-Za-z0-9_]*)= ]]; then
    key="${BASH_REMATCH[1]}"
    echo "#    Name: $key"
  fi
done < "$ENV_FILE"

echo ""
echo "# ============================================================"
echo "# OPTION 3: Terraform / Code (IaC)"
echo "# ============================================================"
echo "#"
echo "# Using GitHub Provider for Terraform:"
echo "#"
echo "# resource \"github_codespaces_secret\" \"example\" {" 
echo "#   secret_name      = \"EXAMPLE_KEY\""
echo "#   plaintext_value  = var.example_value"
echo "#   repository       = \"mcapp-ai-starter\""
echo "# }"
