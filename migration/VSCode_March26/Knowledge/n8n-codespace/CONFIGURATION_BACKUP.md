# n8n Codespaces - Configuration Backup & Restoration

**Backup Date:** 2026-03-05  
**Codespace:** curly-space-spork-v9rg679gpqw3rj6

---

## Critical Credentials (DO NOT COMMIT)

### API Key (Bearer Token)
```
n8n_api_4567aef5f325db695de6c9e7d5eeb6b99c3638ddc9c8fa5b1fb73662ea25ee1a
```

### Encryption Keys
```
N8N_ENCRYPTION_KEY=eEcVuvXciXSnUN1PiYcIZfjW7hkmU4EMWIS7LEufCkg=
N8N_USER_MANAGEMENT_JWT_SECRET=TbCVI2k4BLlwmWIbtWOcRvp4gUjx8J0A4wp8e5WJN4U=
```

### Admin Account
```
Email: dylan.work190@gmail.com
User ID: 011aedd2-da76-4ca6-8a97-358db78b6e53
```

---

## .env Configuration

### Current .env Values
```env
# n8n Settings - CODESPACE CLOUD CONNECTION (Active)
N8N_PROTOCOL=https
N8N_HOST=curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev
N8N_PORT=443
N8N_MODE=true
N8N_API_URL=https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev
N8N_API_KEY=n8n_api_4567aef5f325db695de6c9e7d5eeb6b99c3638ddc9c8fa5b1fb73662ea25ee1a

# Database setup - SQLite (default, no external DB needed)
DB_TYPE=sqlite

# n8n Settings - Additional
N8N_DEFAULT_BINARY_DATA_MODE=filesystem
N8N_BASIC_AUTH_ACTIVE=false
WEBHOOK_URL=http://localhost:5678/
NODE_ENV=production
LOG_LEVEL=info

# Codespaces Information
CODESPACE_NAME=curly-space-spork-v9rg679gpqw3rj6
CODESPACE_DOMAIN=app.github.dev
CODESPACE_N8N_ADMIN=dylan.work190@gmail.com
```

---

## mcp.json Configuration

### n8n-MCP Server Configuration
```json
"n8n-mcp": {
  "type": "stdio",
  "command": "npx",
  "args": ["n8n-mcp"],
  "env": {
    "MCP_MODE": "stdio",
    "N8N_MODE": "true",
    "LOG_LEVEL": "error",
    "DISABLE_CONSOLE_OUTPUT": "true",
    "N8N_API_URL": "https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev",
    "N8N_API_KEY": "n8n_api_4567aef5f325db695de6c9e7d5eeb6b99c3638ddc9c8fa5b1fb73662ea25ee1a"
  }
}
```

---

## DevContainer Configuration

### `.devcontainer/devcontainer.json`
```json
{
  "name": "n8n AI Starter Kit - CPU Mode",
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu-22.04",
  "features": {
    "ghcr.io/devcontainers/features/docker-in-docker:2": {
      "version": "latest"
    }
  },
  "forwardPorts": [5678, 11434, 6333, 5432],
  "portsAttributes": {
    "5678": {
      "label": "n8n UI",
      "onAutoForward": "notify",
      "visibility": "public",
      "protocol": "http"
    },
    "11434": {
      "label": "Ollama API",
      "onAutoForward": "notify",
      "visibility": "public"
    },
    "6333": {
      "label": "Qdrant API",
      "onAutoForward": "notify",
      "visibility": "public"
    },
    "5432": {
      "label": "PostgreSQL",
      "onAutoForward": "silent",
      "visibility": "private"
    }
  },
  "customizations": {
    "vscode": {
      "extensions": [
        "ms-vscode-remote.remote-containers",
        "ms-docker.docker",
        "ms-azuretools.vscode-docker",
        "ms-python.python",
        "ms-python.debugpy"
      ]
    }
  },
  "postCreateCommand": "bash .devcontainer/post-create.sh",
  "remoteEnv": {
    "DOCKER_BUILDKIT": "1",
    "COMPOSE_DOCKER_CLI_BUILD": "1",
    "N8N_PORT": "5678",
    "OLLAMA_HOST": "ollama:11434"
  },
  "hostRequirements": {
    "cpus": 4,
    "memory": "16gb"
  },
  "remoteUser": "root",
  "privileged": true
}
```

---

## Docker Compose Environment Variables

### Current `.env` in Codespace
```env
# Database Configuration
POSTGRES_USER=root
POSTGRES_PASSWORD=password
POSTGRES_DB=n8n

# n8n Encryption & Security
N8N_ENCRYPTION_KEY=eEcVuvXciXSnUN1PiYcIZfjW7hkmU4EMWIS7LEufCkg=
N8N_USER_MANAGEMENT_JWT_SECRET=TbCVI2k4BLlwmWIbtWOcRvp4gUjx8J0A4wp8e5WJN4U=

# n8n Server Configuration
N8N_PORT=5678
N8N_PROTOCOL=http
N8N_HOST=localhost
N8N_DEFAULT_BINARY_DATA_MODE=filesystem

# Diagnostics & Features
N8N_DIAGNOSTICS_ENABLED=false
N8N_PERSONALIZATION_ENABLED=false

# Ollama Configuration
OLLAMA_HOST=ollama:11434
```

---

## Git Repository Information

### Fork Details
```
Original Repo:  https://github.com/n8n-io/self-hosted-ai-starter-kit
Your Fork:      https://github.com/Ditto190/self-hosted-ai-starter-kit
Default Branch: main
Commit with Changes: c5ea711556c08428e7d4a74fde2c17e73e8953b3
```

### Files Modified/Added
```
.devcontainer/devcontainer.json          (NEW)
.devcontainer/post-create.sh             (NEW)
.env.codespaces                          (NEW - template)
```

---

## Service Status Snapshot

```
Service         Container Name           Status      Port
──────────────────────────────────────────────────────────────
n8n             self-hosted-ai-n8n-1     Up          5678
PostgreSQL      postgres                 Up          5432
Ollama CPU      ollama-cpu               Up          11434
Qdrant          qdrant                   Up          6333
n8n-import      n8n-import               Exited      -
ollama-pull     ollama-pull-llama-cpu   Exited      -

Network: demo (bridge)
```

---

## Restoration Checklist

### To Restore This Setup:

- [ ] **Fork Repository**
  ```bash
  gh repo fork n8n-io/self-hosted-ai-starter-kit
  ```

- [ ] **Push DevContainer Files** (see TECHNICAL_REFERENCE.md)
  ```bash
  git add .devcontainer/
  git commit -m "Add DevContainer configuration for Codespaces"
  git push
  ```

- [ ] **Create Codespaces Environment**
  - Go to GitHub UI → Code → Codespaces → Create codespace on main
  - Select 4-core machine
  - Wait for post-create script to finish

- [ ] **Start Docker Stack** (in Codespace terminal)
  ```bash
  docker compose --profile cpu up -d
  docker compose logs n8n | grep "accessible"
  ```

- [ ] **Configure Local .env**
  - Copy N8N_API_URL and N8N_API_KEY from this file
  - Update local mcp.json with same values

- [ ] **Verify Connection** (from local VSCode)
  ```bash
  curl -H "Authorization: Bearer <KEY>" \
    https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev/api/v1/workflows
  ```

- [ ] **Test MCP Tools**
  - Ask Claude: "Search for ollama nodes"
  - Should return node results from Codespace

---

## Backup Best Practices

### What to Version Control
```
.devcontainer/devcontainer.json    ✅ Yes
.devcontainer/post-create.sh       ✅ Yes
.env                               ⚠️ NO (contains secrets)
.env.example                       ✅ Yes (template)
mcp.json                           ⚠️ Partially (sanitize keys)
```

### What to Backup Externally
```
.env                               🔒 Encrypted backup
API_KEY                            🔒 Encrypted backup
Workflow exports (JSON)            💾 Backup regularly
Qdrant collection data             💾 Docker volume backup
PostgreSQL database                💾 Backup regularly
```

---

## Environment Variable Reference

| Variable | Value | Purpose | Safe to Share |
|----------|-------|---------|----------------|
| `N8N_API_URL` | https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev | n8n endpoint | ✅ Yes |
| `N8N_API_KEY` | `n8n_api_4567...` | Authentication | ❌ NO |
| `CODESPACE_NAME` | curly-space-spork-v9rg679gpqw3rj6 | Codespace ID | ✅ Yes |
| `N8N_ENCRYPTION_KEY` | `eEcVuvX...` | Data encryption | ❌ NO |
| `N8N_USER_MANAGEMENT_JWT_SECRET` | `TbCVI2k...` | JWT signing | ❌ NO |
| `POSTGRES_PASSWORD` | `password` | DB access | ⚠️ Development only |

---

## Disaster Recovery Procedures

### If Codespace is deleted:
1. Create new Codespace from fork (same settings)
2. Restore configuration from this backup
3. Re-run health checks from QUICK_START_GUIDE.md
4. Import saved workflows via API or UI

### If API key is compromised:
1. Open n8n Web UI
2. Settings → API → Delete old key → Create new key
3. Update `.env` and `mcp.json` locally
4. Update this backup file
5. Test connection immediately

### If PostgreSQL data is lost:
1. Docker compose will reinitialize database
2. Re-import workflows from backup JSON
3. Recreate any custom credentials

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2026-03-05 | 1.0 | Initial backup - Codespaces setup complete |

---

**⚠️ Security Note:** This file contains sensitive information. Keep it encrypted and compartmentalized. 

**For daily operations, see:** [QUICK_START_GUIDE.md](QUICK_START_GUIDE.md)  
**For architecture details, see:** [TECHNICAL_REFERENCE.md](TECHNICAL_REFERENCE.md)
