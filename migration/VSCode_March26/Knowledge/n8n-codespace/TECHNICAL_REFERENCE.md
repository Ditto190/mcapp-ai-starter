# n8n Codespaces AI Automation Stack - Technical Reference

**Last Updated:** March 5, 2026  
**Status:** Production Ready  
**Codespace:** curly-space-spork-v9rg679gpqw3rj6

---

## 1. Architecture Overview

### Cloud Environment
- **Platform:** GitHub Codespaces
- **Repository:** `https://github.com/Ditto190/self-hosted-ai-starter-kit`
- **Machine Type:** 4-core, 16GB RAM, 32GB SSD
- **OS:** Ubuntu 22.04.5 LTS
- **Region:** US-East (inferred)

### Service Stack
```
GitHub Codespaces Container
├── n8n (Port 5678)
│   ├── API Server
│   ├── WebUI Editor
│   └── Workflow Engine
├── PostgreSQL (Port 5432 - Internal)
│   └── Workflow Data Storage
├── Ollama (Port 11434)
│   ├── LLM Engine (llama3.2)
│   └── Model Runtime
├── Qdrant (Port 6333)
│   └── Vector Database
└── Docker Network: demo
```

---

## 2. Connection Details

### External Access (Local → Codespace)
```
Protocol:  HTTPS (GitHub enforces TLS/SSL)
Endpoint:  https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev
Port:      443 (HTTPS) → 5678 (n8n internal)
Auth:      Bearer Token (JWT)
```

### Internal Access (Within Codespace)
```
Protocol:  HTTP
Endpoint:  http://localhost:5678
Port:      5678
Auth:      Bearer Token
```

### Authentication
```
API Key Format:     n8n_api_XXXXX... (64 hex characters)
Current Key:        n8n_api_4567aef5f325db695de6c9e7d5eeb6b99c3638ddc9c8fa5b1fb73662ea25ee1a
Admin Email:        dylan.work190@gmail.com
User ID:            011aedd2-da76-4ca6-8a97-358db78b6e53
JWT Secret:         TbCVI2k4BLlwmWIbtWOcRvp4gUjx8J0A4wp8e5WJN4U=
Encryption Key:     eEcVuvXciXSnUN1PiYcIZfjW7hkmU4EMWIS7LEufCkg=
```

---

## 3. Service Configuration

### n8n Web UI
```
URL:              https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev
Admin User:       dylan.work190@gmail.com
API Endpoint:     /api/v1
Workflows List:   /api/v1/workflows
Health Check:     /api/v1/health
```

### PostgreSQL Database
```
Host (Internal):   postgres:5432
Host (External):   Not directly accessible (firewall)
Database:          n8n
Username:          root
Password:          password
Driver:            PostgreSQL 16 Alpine
Data Dir:          /var/lib/postgresql/data (container)
```

### Ollama LLM Service
```
Host (Internal):   ollama:11434
Host (External):   Via n8n API only
API:               /api/generate, /api/chat
Models:            llama3.2 (4.7GB - pre-installed)
Inference:         CPU-based (no GPU)
Pull Command:      docker exec ollama ollama pull <model>
```

### Qdrant Vector Database
```
Host (Internal):   qdrant:6333
API:               HTTP REST
Storage:           /qdrant/storage (container)
Purpose:           Vector embeddings for AI context
Access:            Via n8n API nodes only
```

---

## 4. API Endpoints & Methods

### Workflows
```bash
GET    /api/v1/workflows              # List all workflows
POST   /api/v1/workflows              # Create workflow
GET    /api/v1/workflows/{id}         # Get workflow details
PUT    /api/v1/workflows/{id}         # Update workflow
DELETE /api/v1/workflows/{id}         # Delete workflow
```

### Executions
```bash
POST   /api/v1/workflows/{id}/execute # Run workflow
GET    /api/v1/executions             # List executions
GET    /api/v1/executions/{id}        # Get execution details
```

### Health & Status
```bash
GET    /api/v1/health                 # Server health check
GET    /api/v1/me                     # Current user info
```

---

## 5. HTTP Header Requirements

**All API calls must include:**

```http
Authorization: Bearer n8n_api_4567aef5f325db695de6c9e7d5eeb6b99c3638ddc9c8fa5b1fb73662ea25ee1a
Content-Type: application/json
```

**Example curl:**
```bash
curl -X GET \
  https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev/api/v1/workflows \
  -H "Authorization: Bearer n8n_api_4567aef5f325db695de6c9e7d5eeb6b99c3638ddc9c8fa5b1fb73662ea25ee1a" \
  -H "Content-Type: application/json"
```

---

## 6. DevContainer Configuration

**Location:** `.devcontainer/devcontainer.json`

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
  "postCreateCommand": "bash .devcontainer/post-create.sh"
}
```

**Environment Variables Set:**
- `DOCKER_BUILDKIT=1`
- `COMPOSE_DOCKER_CLI_BUILD=1`
- `N8N_PORT=5678`
- `OLLAMA_HOST=ollama:11434`
- `QDRANT_HOST=qdrant:6333`

---

## 7. Docker Compose Services

**Profile:** `--profile cpu` (CPU-based inference)

| Service | Image | Port | Status |
|---------|-------|------|--------|
| n8n | n8nio/n8n:latest | 5678 | Running |
| postgres | postgres:16-alpine | 5432 | Running |
| ollama-cpu | ollama/ollama:latest | 11434 | Running |
| qdrant | qdrant/qdrant | 6333 | Running |
| n8n-import | n8nio/n8n:latest | - | Completed |
| ollama-pull-llama | ollama/ollama:latest | - | Completed |

---

## 8. Network Topology

```
┌─────────────────────────────────────────────────┐
│         GitHub Codespaces (Cloud)               │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │      Docker Network: "demo"               │  │
│  │                                            │  │
│  │  ┌─────────────┐   ┌──────────────┐     │  │
│  │  │    n8n      │   │  PostgreSQL  │     │  │
│  │  │  :5678      │   │    :5432     │     │  │
│  │  └────┬────────┘   └──────────────┘     │  │
│  │       │                                  │  │
│  │       ├─► Ollama       :11434           │  │
│  │       └─► Qdrant       :6333            │  │
│  │                                          │  │
│  └──────────────────────────────────────────┘  │
│           ↓                                     │
│  Port Forwarding via GitHub                   │
│  HTTPS → 443 → 5678                           │
└─────────────────────────────────────────────────┘
         ↑
    Local VSCode_March26
    (via n8n-mcp tools)
```

---

## 9. Local Configuration

### .env File Entry
```env
# Codespace n8n Cloud Connection
N8N_CLOUD_API_URL=https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev
N8N_CLOUD_API_KEY=n8n_api_4567aef5f325db695de6c9e7d5eeb6b99c3638ddc9c8fa5b1fb73662ea25ee1a
CODESPACE_NAME=curly-space-spork-v9rg679gpqw3rj6
CODESPACE_DOMAIN=app.github.dev
N8N_ADMIN_EMAIL=dylan.work190@gmail.com
```

### mcp.json Configuration
```json
"n8n-mcp": {
  "type": "stdio",
  "command": "npx",
  "args": ["n8n-mcp"],
  "env": {
    "MCP_MODE": "stdio",
    "N8N_API_URL": "https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev",
    "N8N_API_KEY": "n8n_api_4567aef5f325db695de6c9e7d5eeb6b99c3638ddc9c8fa5b1fb73662ea25ee1a"
  }
}
```

---

## 10. Available Node Types

✅ **Tested & Verified:**
- HTTP Request (v4.4)
- Webhook Trigger
- Respond to Webhook
- Ollama Chat Model
- Ollama Embeddings
- 400+ other nodes available

**Ollama Nodes:**
- `@n8n/n8n-nodes-langchain.lmChatOllama` - Chat/conversation
- `@n8n/n8n-nodes-langchain.lmOllama` - Language processing
- `@n8n/n8n-nodes-langchain.ollamaTool` - AI Agent tool
- `@n8n/n8n-nodes-langchain.embeddingsOllama` - Vector generation

---

## 11. Resource Limits & Monitoring

### Current Usage (Steady State)
```
n8n:        400-600 MB RAM, 0.5-1.5 CPU
Ollama:     2-4 GB RAM, 2-3 CPU (during inference)
PostgreSQL: 50-100 MB RAM, 0.1 CPU
Qdrant:     100-200 MB RAM, 0.1-0.3 CPU
────────────────────────────────────────
Total:      ~3 GB RAM used, 3-4 CPU cores
```

### Storage
```
Ollama models:           4.7 GB (llama3.2)
n8n execution logs:      100-500 MB
PostgreSQL data:         50-100 MB
Codespace SSD:           32 GB total
Used:                    ~5-6 GB
Available:               ~26 GB
```

---

## 12. Backup & Restore

### What to Backup
1. `.env` file (configuration)
2. `mcp.json` (MCP tool settings)
3. `.devcontainer/` folder (DevContainer config)
4. Workflow JSON files (n8n workflows export)
5. This TECHNICAL_REFERENCE.md (for restoration)

### Backup Commands
```bash
# Export all workflows from n8n
curl -X GET \
  https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev/api/v1/workflows \
  -H "Authorization: Bearer n8n_api_4567aef5f325db695de6c9e7d5eeb6b99c3638ddc9c8fa5b1fb73662ea25ee1a" \
  > workflows_backup.json

# Backup Qdrant collections
docker exec qdrant /bin/bash -c "cp -r /qdrant/storage /backup/"
```

---

## Related Documentation

- **QUICK_START_GUIDE.md** - Copy-paste commands for immediate use
- **CONFIGURATION_BACKUP.md** - Sanitized config for restoration
- **n8n-mcp/architecture-setup** (Memory) - Semantic reference
- **Codespace n8n tunnel setup and connection details** (Memory) - AI-searchable

---

**Version:** 1.0  
**Maintained by:** Ditto190  
**Last Verified:** 2026-03-05
