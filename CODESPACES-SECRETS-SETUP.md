# Codespaces Secrets Setup Guide

## Overview
All keys from the `.env` file have been **loaded into your current session** and can be saved to GitHub Codespaces secrets for persistent, secure access.

## Current Status: Session Variables ✅
All 76+ environment variables are now available in this bash session:
- PostgreSQL credentials
- n8n encryption & API keys
- AI model APIs (OpenAI, Azure, Anthropic/DeepSeek, Gemini)
- Integration tokens (GitHub, GitLab, HuggingFace, Jules)
- MCP & ContextStream credentials
- Telemetry & logging config

**To use in this session:**
```bash
# All keys are available in environment
echo $OPENAI_API_KEY
echo $GITHUB_PERSONAL_ACCESS_TOKEN
echo $CONTEXTSTREAM_API_KEY
# etc.
```

---

## Option 1: GitHub CLI (Recommended)

### Prerequisites
```bash
# Install GitHub CLI
brew install gh  # macOS
# or: apt install gh  # Linux
# or: choco install gh  # Windows

# Authenticate
gh auth login
```

### Save All Secrets at Once
```bash
# Generate and run the secrets script
bash scripts/save-to-codespaces-secrets.sh > /tmp/set-secrets.sh
bash /tmp/set-secrets.sh
```

### Or Manually Set Individual Secrets
```bash
# Database secrets
gh secret set POSTGRES_USER --body 'root'
gh secret set POSTGRES_PASSWORD --body 'password'
gh secret set POSTGRES_DB --body 'n8n'

# n8n secrets
gh secret set N8N_ENCRYPTION_KEY --body "$N8N_ENCRYPTION_KEY"
gh secret set N8N_USER_MANAGEMENT_JWT_SECRET --body "$N8N_USER_MANAGEMENT_JWT_SECRET"

# AI APIs
gh secret set OPENAI_API_KEY --body "$OPENAI_API_KEY"
gh secret set ANTHROPIC_API_KEY --body "$ANTHROPIC_API_KEY"
gh secret set GEMINI_API_KEY --body "$GEMINI_API_KEY"

# GitHub integration
gh secret set GITHUB_PERSONAL_ACCESS_TOKEN --body "$GITHUB_PERSONAL_ACCESS_TOKEN"

# All others...
gh secret set N8N_API_KEY --body "$N8N_API_KEY"
gh secret set AGENTMODE_MCP_API_KEY --body "$AGENTMODE_MCP_API_KEY"
gh secret set CONTEXTSTREAM_API_KEY --body "$CONTEXTSTREAM_API_KEY"
# etc.
```

---

## Option 2: GitHub Web UI

### Manual Steps
1. **Navigate to Secrets:**
   - Go to: https://github.com/settings/codespaces
   - Click **"New secret"** button

2. **For Each Key Below:**
   - Enter **Name**: (e.g., `OPENAI_API_KEY`)
   - Enter **Value**: (from your `.env` file)
   - Click **Add secret**

3. **Keys to Set:**

**Database (4 keys)**
```
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_DB
DB_TYPE, DB_POSTGRESDB_HOST, DB_POSTGRESDB_PORT, etc.
```

**n8n Configuration (15 keys)**
```
N8N_ENCRYPTION_KEY
N8N_USER_MANAGEMENT_JWT_SECRET
N8N_PROTOCOL
N8N_HOST
N8N_PORT
N8N_EDITOR_BASE_URL
WEBHOOK_URL
N8N_MODE
N8N_API_URL
N8N_API_KEY
N8N_BASIC_AUTH_ACTIVE
N8N_USER_DATA_DIR
N8N_PUBLIC_API_DISABLED
N8N_PUBLIC_API_SWAGGERUI_DISABLED
N8N_DISABLE_UI_SHARING
N8N_AI_ASSISTANT_BASE_URL
```

**AI & LLM APIs (12 keys)**
```
OPENAI_API_KEY
ANTHROPIC_API_KEY
GEMINI_API_KEY
GOOGLE_AI_STUDIO_KEY
AZURE_OPENAI_API_KEY
APOLLO_API_KEY
CLAUDE_MODEL
```

**Integration APIs (10 keys)**
```
GITHUB_PERSONAL_ACCESS_TOKEN
gitlab_pat
HUGGING_FACE_TOKEN
JULES_API_KEY
JULES_RENDR_API_KEY
AGENTMODE_MCP_API_KEY
CONTEXT7_API_KEY
CONTEXTSTREAM_API_KEY
CONTEXTSTREAM_API_URL
```

**n8n MCP Integration (3 keys)**
```
N8N_MCP_ENDPOINT
N8N_MCP_TOKEN
MCP_MODE
MCP_SERVER_URL
```

**Metadata (3 keys)**
```
CODESPACE_NAME
CODESPACE_DOMAIN
CODESPACE_N8N_ADMIN
```

---

## Option 3: GitHub API (Advanced)

### Using `gh api` Command
```bash
# Set multiple secrets via GitHub API
gh api repos/Ditto190/mcapp-ai-starter/codespaces/secrets/OPENAI_API_KEY \
  -X PUT \
  -f encrypted_value='...' \
  -f key_id='...'
```

---

## Option 4: Infrastructure as Code (Terraform/CDK)

### Terraform Example
```hcl
resource "github_codespaces_secret" "openai_key" {
  secret_name     = "OPENAI_API_KEY"
  plaintext_value = var.openai_api_key
  repository      = "mcapp-ai-starter"
}

resource "github_codespaces_secret" "postgres_password" {
  secret_name     = "POSTGRES_PASSWORD"
  plaintext_value = var.postgres_password
  repository      = "mcapp-ai-starter"
}

# Repeat for all keys...
```

### AWS CDK (Python)
```python
from aws_cdk import github_provider

github_provider.CodespacesSecret(
    self, "OpenAIKey",
    repository="Ditto190/mcapp-ai-starter",
    secret_name="OPENAI_API_KEY",
    secret_value="sk-..."
)
```

---

## Verification

### Check Secrets Are Set
```bash
# List all Codespaces secrets (on GitHub.com)
gh secret list --app codespaces

# Verify in running Codespace
# New Codespaces will automatically load these as env vars:
env | grep OPENAI_API_KEY
env | grep CONTEXTSTREAM_API_KEY
```

### Verify in New Codespace
1. **Create new Codespace** from this repository
2. **Check environment:**
   ```bash
   echo $OPENAI_API_KEY
   echo $GITHUB_PERSONAL_ACCESS_TOKEN
   # Should be populated automatically
   ```

---

## Removing Secrets

### Via GitHub CLI
```bash
# Delete a single secret
gh secret delete OPENAI_API_KEY

# This CANNOT be undone - you'll need to re-create it
```

### Via GitHub UI
1. Go to: https://github.com/settings/codespaces
2. Click **Delete** next to the secret name
3. Confirm deletion

---

## Security Best Practices

✅ **Do's:**
- Use GitHub Secrets Manager for all sensitive data
- Rotate tokens/keys periodically
- Use environment-specific secrets (dev, staging, prod)
- Audit secret access in GitHub audit logs
- Mask secrets in CI/CD logs (GitHub does this automatically)

❌ **Don'ts:**
- Never commit `.env` files with real secrets to git
- Don't log or echo secret values in CI/CD scripts
- Don't share secrets in chat/email
- Don't use the same secret across environments
- Don't hardcode secrets in application code

---

## Troubleshooting

### Secrets Not Loading in Codespace
```bash
# Check if Codespace was created AFTER secrets were added
# If before: delete and re-create the Codespace

# If after: Restart your Codespace
# VS Code > Terminal > "Codespaces: Rebuild Container"
```

### Permission Denied Setting Secrets
```bash
# Ensure your GitHub token has "repo" and "codespace" scopes
gh auth status

# Re-authenticate if needed
gh auth login --scopes repo,codespace
```

### Secret Shows Empty in Application
```bash
# Verify it was set:
gh secret list

# Check it's in environment:
printenv | grep SECRET_NAME

# If missing, re-set it:
gh secret set SECRET_NAME --body "value"
```

---

## Related Documentation
- [Codespaces .env Setup Method](Codespaces%20.env%20Setup%20Method)
- [Enhanced .env Generation Script](Enhanced%20.env%20Generation%20Script%20-%20All%20Keys%20Support)
- [GitHub Secrets Documentation](https://github.com/settings/codespaces)
- [GitHub CLI Manual](https://cli.github.com/manual)
