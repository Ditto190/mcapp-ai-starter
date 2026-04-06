# n8n + n8n-MCP Quick Start Guide

## ✅ What's Set Up

- **n8n**: Will run via `npx n8n` (no installation, downloads on demand)
- **n8n-MCP**: Configured in `mcp.json` for stdio mode
- **Database**: SQLite (file-based, automatic)
- **Data Directory**: `./n8n-data/` (created automatically)

## 🚀 How to Start n8n

### Option 1: Using VSCode Task (Recommended)
1. Press `Ctrl+Shift+B` (Run Build Task)
2. Select `n8n: Start` 
3. n8n will start in a new terminal and output its URL

### Option 2: Direct Command
```powershell
npx n8n
```

## ✨ Using n8n

After n8n starts, open your browser:
- **URL**: http://localhost:5678
- Data is automatically saved to `./n8n-data/`

## 🔌 n8n-MCP Integration

n8n-MCP is already configured in `.vscode/mcp.json` for Claude/Copilot to use. 

When connected, you can ask Claude to help manage n8n workflows. n8n-MCP provides:
- Access to n8n node documentation
- Workflow validation
- Configuration help

## 📝 Configuration

Edit `.env` to customize:
- `N8N_PORT`: Change port (default: 5678)
- `DB_TYPE`: Switch to PostgreSQL when ready
- `NODE_ENV`: Set to "development" for debugging

## 🧹 Clean Up

- Stop n8n: Close the n8n terminal (Ctrl+C)
- Delete data: `rm -Recurse n8n-data`
- Reset everything: Delete `n8n-data/` folder

## Troubleshooting

**"Port 5678 already in use"**
- Change `N8N_PORT` in `.env` or kill existing process
- Or use: `npx n8n --port 5679`

**"npx not found"**
- Install Node.js from https://nodejs.org (v18+)

**Need PostgreSQL?**
- Currently using SQLite (recommended for getting started)
- See `POSTGRESQL_SETUP.md` when ready to migrate

---

That's it! Start with `Ctrl+Shift+B` → `n8n: Start`
