# n8n Codespaces Setup - Quick Start Guide

**Time to Full Setup:** ~8 minutes  
**Codespace Name:** curly-space-spork-v9rg679gpqw3rj6

---

## Instant Connection Check (30 seconds)

### PowerShell (Local Machine)
```powershell
# Test HTTPS connectivity
$headers = @{ Authorization = "Bearer n8n_api_4567aef5f325db695de6c9e7d5eeb6b99c3638ddc9c8fa5b1fb73662ea25ee1a" }
$response = Invoke-RestMethod -Uri "https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev/api/v1/workflows" -Headers $headers
Write-Host "✅ Connected! Workflow count: $($response.data.Count)" -ForegroundColor Green
```

### Bash (Codespace Terminal)
```bash
curl -s -H "Authorization: Bearer n8n_api_4567aef5f325db695de6c9e7d5eeb6b99c3638ddc9c8fa5b1fb73662ea25ee1a" \
  http://localhost:5678/api/v1/workflows | jq .data
```

---

## Copy-Paste Commands by Task

### 1. Verify Codespace Status
```bash
# SSH into Codespace (if needed)
gh codespace code -c curly-space-spork-v9rg679gpqw3rj6

# Check all services running
docker compose ps

# View n8n logs
docker compose logs n8n | grep -i "accessible\|ready\|started"

# Check Ollama models
docker exec ollama ollama list

# Verify PostgreSQL
docker exec postgres psql -U root -d n8n -c "\dt"

# Check Qdrant health
curl -s http://qdrant:6333/health | jq .
```

### 2. Test n8n API Connectivity

**From Local Machine (PowerShell):**
```powershell
# List all workflows
$headers = @{ Authorization = "Bearer n8n_api_4567aef5f325db695de6c9e7d5eeb6b99c3638ddc9c8fa5b1fb73662ea25ee1a" }
Invoke-RestMethod -Uri "https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev/api/v1/workflows" -Headers $headers | ConvertTo-Json

# Get server health
Invoke-RestMethod -Uri "https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev/api/v1/health" -Headers $headers

# Get current user
Invoke-RestMethod -Uri "https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev/api/v1/me" -Headers $headers | ConvertTo-Json
```

### 3. Access n8n Web UI

```bash
# In Codespace, get the port forwarding URL
echo "Visit: https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev"

# Or open in current browser from terminal
xdg-open "https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev"
```

### 4. Create Your First Workflow via API

```bash
# Create minimal workflow with HTTP Request node
curl -X POST \
  https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev/api/v1/workflows \
  -H "Authorization: Bearer n8n_api_4567aef5f325db695de6c9e7d5eeb6b99c3638ddc9c8fa5b1fb73662ea25ee1a" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Workflow",
    "nodes": [
      {
        "name": "HTTP Request",
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.4,
        "position": [250, 300],
        "parameters": {
          "url": "https://jsonplaceholder.typicode.com/posts/1",
          "method": "GET"
        }
      }
    ],
    "connections": {}
  }'
```

### 5. Deploy a Template

```bash
# Search for webhook templates
curl -s "https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev/api/v1/marketplace/templates?query=webhook" \
  -H "Authorization: Bearer n8n_api_4567aef5f325db695de6c9e7d5eeb6b99c3638ddc9c8fa5b1fb73662ea25ee1a" | jq .

# Import a template by ID (get ID from search results)
curl -X POST \
  https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev/api/v1/workflows/import \
  -H "Authorization: Bearer n8n_api_4567aef5f325db695de6c9e7d5eeb6b99c3638ddc9c8fa5b1fb73662ea25ee1a" \
  -H "Content-Type: application/json" \
  -d '{"templateId": 1954}'
```

### 6. Test Ollama Integration

```bash
# From Codespace terminal
docker exec ollama ollama pull mistral  # Add Mistral model (4.9GB)

# Create workflow using Ollama Chat Model
curl -X POST \
  https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev/api/v1/workflows \
  -H "Authorization: Bearer n8n_api_4567aef5f325db695de6c9e7d5eeb6b99c3638ddc9c8fa5b1fb73662ea25ee1a" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ollama Chat Workflow",
    "nodes": [
      {
        "name": "Ollama Chat",
        "type": "@n8n/n8n-nodes-langchain.lmChatOllama",
        "position": [250, 300],
        "parameters": {
          "baseUrl": "http://ollama:11434",
          "modelName": "llama3.2",
          "temperature": 0.7
        }
      }
    ]
  }'
```

### 7. Export All Workflows

```bash
# Save all workflows to JSON file
curl -s \
  -H "Authorization: Bearer n8n_api_4567aef5f325db695de6c9e7d5eeb6b99c3638ddc9c8fa5b1fb73662ea25ee1a" \
  https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev/api/v1/workflows \
  > workflows_export_$(date +%Y%m%d_%H%M%S).json

echo "✅ Exported to workflows_export_$(date +%Y%m%d_%H%M%S).json"
```

### 8. Health Check Script (Comprehensive)

```bash
#!/bin/bash
echo "🔍 n8n Codespaces Health Check"
echo "================================"

API_URL="https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev"
API_KEY="n8n_api_4567aef5f325db695de6c9e7d5eeb6b99c3638ddc9c8fa5b1fb73662ea25ee1a"
HEADERS=(-H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json")

echo "✓ Testing n8n API..."
HEALTH=$(curl -s -w "\n%{http_code}" "${HEADERS[@]}" "$API_URL/api/v1/health")
STATUS=$(echo "$HEALTH" | tail -n1)
[ "$STATUS" = "200" ] && echo "  ✅ n8n API: OK (HTTP $STATUS)" || echo "  ❌ n8n API: FAILED (HTTP $STATUS)"

echo "✓ Testing Workflows..."
WORKFLOWS=$(curl -s "${HEADERS[@]}" "$API_URL/api/v1/workflows")
COUNT=$(echo "$WORKFLOWS" | jq '.data | length')
echo "  ✅ Workflows: $COUNT found"

echo "✓ Testing Ollama..."
OLLAMA=$(curl -s -w "\n%{http_code}" "http://localhost:11434/api/tags")
OLLAMA_STATUS=$(echo "$OLLAMA" | tail -n1)
[ "$OLLAMA_STATUS" = "200" ] && echo "  ✅ Ollama: OK" || echo "  ❌ Ollama: FAILED"

echo "✓ Testing PostgreSQL..."
POSTGRES=$(docker exec postgres psql -U root -d n8n -c "SELECT 1" 2>&1)
[[ "$POSTGRES" == *"1"* ]] && echo "  ✅ PostgreSQL: OK" || echo "  ❌ PostgreSQL: FAILED"

echo "✓ Testing Qdrant..."
QDRANT=$(curl -s "http://qdrant:6333/health")
[[ "$QDRANT" == *"ok"* ]] && echo "  ✅ Qdrant: OK" || echo "  ❌ Qdrant: FAILED"

echo ""
echo "================================"
echo "Health check complete!"
```

**Run it:**
```bash
chmod +x health-check.sh
./health-check.sh
```

---

## Troubleshooting Checklist

### ❌ "Connection refused" error

```bash
# Check if Codespace is running
gh codespace list

# Restart services if needed
docker compose restart n8n
docker compose logs n8n | tail -20
```

### ❌ "API key invalid" error

```bash
# Verify key is correct in requests
echo "Current key: n8n_api_4567aef5f325db695de6c9e7d5eeb6b99c3638ddc9c8fa5b1fb73662ea25ee1a"

# Check Authorization header format (must be "Bearer " + key)
```

### ❌ Ollama timeout / hanging inference

```bash
# Check Ollama status
docker logs ollama | tail -30

# If stuck, restart Ollama
docker compose restart ollama-cpu

# Check model is loaded
docker exec ollama ollama list
```

### ❌ Portal/forwarding URL expired

```bash
# GitHub Codespaces URLs may change - refresh
gh codespace ssh -c curly-space-spork-v9rg679gpqw3rj6

# Then get fresh forwarding URL from VS Code Ports panel
```

---

## Environment Variable Summary

```bash
# Copy these to .env for quick reference
N8N_CLOUD_API_URL=https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev
N8N_CLOUD_API_KEY=n8n_api_4567aef5f325db695de6c9e7d5eeb6b99c3638ddc9c8fa5b1fb73662ea25ee1a
CODESPACE_NAME=curly-space-spork-v9rg679gpqw3rj6
CODESPACE_DOMAIN=app.github.dev
N8N_ADMIN_EMAIL=dylan.work190@gmail.com
```

---

**For detailed configuration, see:** [TECHNICAL_REFERENCE.md](TECHNICAL_REFERENCE.md)  
**For restoration, see:** [CONFIGURATION_BACKUP.md](CONFIGURATION_BACKUP.md)
