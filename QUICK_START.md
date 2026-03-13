# Quick Start: Connect External Agent to Codespace

**Codespace Name**: `<CODESPACE_NAME>`

## 🚀 30-Second Setup

### Step 1: Export Credentials
```bash
# On your local machine
export N8N_API_KEY="<N8N_API_KEY>"
export CODESPACE_NAME="<CODESPACE_NAME>"
```

### Step 2: Copy the Python Helper
```bash
# Copy codespace_agent.py to your project
cp /workspaces/self-hosted-ai-starter-kit/codespace_agent.py ./
```

### Step 3: Use in Your Agent
```python
from codespace_agent import CodespaceAgent

# Initialize
agent = CodespaceAgent(
    codespace_name="<CODESPACE_NAME>",
    n8n_api_key="<N8N_API_KEY>"
)

# Use services
workflows = agent.n8n.list_workflows()
response = agent.ollama.generate("llama3.2", "Hello!")
agent.qdrant.upsert("embeddings", points=[...])
```

---

## 📋 Service URLs (Copy-Paste)

### n8n
```
Base: https://<CODESPACE_NAME>-5678.app.github.dev
API Key: <N8N_API_KEY>
Header: X-N8N-API-KEY
```

### Ollama
```
Base: https://<CODESPACE_NAME>-11434.app.github.dev
Models: llama3.2, mistral, neural-chat
```

### Qdrant
```
Base: https://<CODESPACE_NAME>-6333.app.github.dev
Default Collection: embeddings
```

---

## 🧪 Quick Test

```bash
# Test n8n
curl -H "X-N8N-API-KEY: <N8N_API_KEY>" \
  https://<CODESPACE_NAME>-5678.app.github.dev/api/v1/workflows | jq

# Test Ollama
curl https://<CODESPACE_NAME>-11434.app.github.dev/api/tags | jq

# Test Qdrant
curl https://<CODESPACE_NAME>-6333.app.github.dev/health | jq
```

---

## 📖 Full Documentation

See:
- **CONNECTION_GUIDE.md** - Detailed setup for all services
- **codespace.config** - Configuration template
- **codespace_agent.py** - Python SDK with examples

---

## 🔐 Security Notes

⚠️ **Never commit API keys to GitHub!**

Set credentials via environment variables:
```bash
export N8N_API_KEY="..."
export POSTGRES_PASSWORD="..."
```

In CI/CD, use GitHub Secrets:
```yaml
# .github/workflows/agent.yml
env:
  N8N_API_KEY: ${{ secrets.CODESPACE_N8N_API_KEY }}
```

---

## ❓ Common Questions

**Q: Can I access PostgreSQL remotely?**  
A: Yes, but requires SSH tunnel setup. See CONNECTION_GUIDE.md for details.

**Q: How do I integrate with my local LLM?**  
A: Use the Ollama client. Models are downloaded on-demand via `pull_model()`.

**Q: What if the Codespace shuts down?**  
A: Restart with `gh codespace resume --codespace <CODESPACE_NAME>`

**Q: Can multiple agents connect simultaneously?**  
A: Yes! n8n, Ollama, and Qdrant support concurrent connections.

---

## 📞 Support

- **Codespace Status**: `gh codespace list`
- **View Logs**: `docker compose logs -f n8n` (in Codespace)
- **Stop Services**: `docker compose down` (in Codespace)
- **Restart Services**: `docker compose up` (in Codespace)

