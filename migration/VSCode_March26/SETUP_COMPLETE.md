# ✅ n8n + n8n-mcp Setup Complete

**Status**: n8n is **RUNNING** via pm2 process manager  
**Process ID**: 0 (online)  
**Memory**: 65.3 MB  
**Database**: SQLite (./n8n-data/database.sqlite)  
**Editor URL**: http://localhost:5678  

---

## What's Been Installed & Configured

### ✅ Core Components
- **pm2**: Global process manager (installed)
- **n8n**: Workflow automation server (running)
- **n8n-mcp**: AI integration MCP server (configured in mcp.json)
- **Node.js**: v24.11.1 (already installed)

### ✅ Configuration Files Created
- `.env` - Environment variables for n8n and database
- `.gitignore` - Protect sensitive data and large datasets
- `ecosystem.config.js` - pm2 configuration for PostgreSQL setup
- `n8n-start.js` - Node.js wrapper for pm2 execution
- `.vscode/tasks.json` - VSCode tasks for n8n control
- `start-n8n.ps1` - PowerShell startup script
- `n8n-data/` - Data directory (created, ready for use)

### ✅ Documentation Created
- `N8N_SETUP.md` - Complete setup and usage guide
- `POSTGRESQL_SETUP.md` - Step-by-step PostgreSQL installation
- `SETUP_COMPLETE.md` - This file

---

## 🚀 Quick Start Commands

### View n8n Editor
```powershell
# Open in browser:
https://localhost:5678
```

### Check Process Status
```powershell
pm2 list              # All processes
pm2 status            # Detailed status
pm2 logs n8n          # Real-time logs
```

### Control n8n Service
```powershell
pm2 stop n8n          # Stop
pm2 restart n8n      # Restart
pm2 delete n8n       # Remove from pm2
```

### View Logs
```powershell
# Last 50 lines:
pm2 logs n8n --lines 50

# Real-time tail:
pm2 logs n8n

# Error logs only:
pm2 logs n8n --err

# VSCode Task: Ctrl+Shift+B → "n8n: View Logs (pm2)"
```

---

## 📦 Database Status

### Current Database: SQLite
- **Location**: `./n8n-data/database.sqlite`
- **Type**: Embedded, file-based
- **Advantages**: 
  - Zero setup required
  - Portable (relative path)
  - Works offline
  - Good for single-user/development

### Next: Upgrade to PostgreSQL (Optional)
For production or scaling:

1. **Install PostgreSQL** - See `POSTGRESQL_SETUP.md`
2. **Create Database**:
   ```sql
   CREATE USER n8n_user WITH PASSWORD 'password';
   CREATE DATABASE n8n_db OWNER n8n_user;
   ```
3. **Update `.env`** - Uncomment PostgreSQL section
4. **Update `ecosystem.config.js`** - Switch to PostgreSQL env vars
5. **Restart n8n** - `pm2 restart n8n`

---

## 🧠 n8n-MCP Integration

### What is n8n-MCP?
MCP server that allows AI (Claude, Copilot) to:
- Search and understand n8n nodes
- Build workflows with AI assistance
- Validate configurations
- Optimize workflow design

### Configuration
Configured in your MCP client (e.g., Claude Desktop):
```json
"n8n-mcp": {
  "type": "stdio",
  "command": "npx",
  "args": ["n8n-mcp"],
  "env": {
    "MCP_MODE": "stdio",
    "LOG_LEVEL": "error",
    "DISABLE_CONSOLE_OUTPUT": "true"
  }
}
```

### How to Use
1. Tell Claude/Copilot: "Help me build an n8n workflow"
2. Claude will use n8n-mcp to:
   - Search for relevant nodes
   - Suggest configurations
   - Build workflow JSON
   - Validate the workflow
3. Deploy directly to n8n

---

## 📋 VSCode Tasks (Ctrl+Shift+B)

| Task | Purpose |
|------|---------|
| **n8n: Start (pm2)** | Start n8n via pm2 |
| **n8n: Stop (pm2)** | Stop n8n |
| **n8n: Restart (pm2)** | Restart n8n |
| **n8n: View Logs (pm2)** | Real-time log tail |
| **n8n: Delete pm2 process** | Remove from pm2 |
| **n8n: Create data directory** | Create ./n8n-data |
| **PostgreSQL: Open psql console** | Interactive psql prompt |
| **n8n-mcp: Start (npx)** | Launch n8n-mcp |
| **Workspace: Show Environment Variables** | Display .env |

---

## 🔧 Troubleshooting

### n8n won't start
```powershell
# Check process status
pm2 list

# View error logs
pm2 logs n8n --err

# Check port 5678 is free
netstat -ano | findstr 5678

# Restart
pm2 restart n8n
```

### Can't connect to http://localhost:5678
1. Verify n8n is running: `pm2 list`
2. Check port allocation: `netstat -ano | findstr 5678`
3. Wait 30 seconds (startup takes time on first run)
4. Check logs: `pm2 logs n8n`

### Database errors
1. **SQLite**: Verify `./n8n-data/database.sqlite` exists
2. **PostgreSQL**: See `POSTGRESQL_SETUP.md`
3. **Reset**: Delete database file and restart (creates fresh DB)

### Port 5678 already in use
Edit `.env` and `ecosystem.config.js`:
```
N8N_PORT=5679
```
Then restart.

---

## 📂 File Organization

```
VSCode_March26/
├── .env                          # Environment variables (GITIGNORED)
├── .gitignore                    # Protect sensitive files
├── .vscode/
│   └── tasks.json               # VSCode tasks
├── ecosystem.config.js          # pm2 configuration
├── n8n-start.js                 # Node wrapper for pm2
├── start-n8n.ps1                # PowerShell startup script
├── n8n-data/                    # n8n workflows & data (GITIGNORED)
│   └── database.sqlite          # SQLite database
├── logs/                        # pm2 logs (GITIGNORED)
├── N8N_SETUP.md                 # Setup guide
├── POSTGRESQL_SETUP.md          # PostgreSQL installation
└── SETUP_COMPLETE.md            # This file
```

---

## 🔐 Security Notes

### Current Setup (Development)
- **Authentication**: Disabled (N8N_BASIC_AUTH_ACTIVE=false)
- **Database**: SQLite (local only)
- **Access**: localhost:5678 only

### For Production
In `.env`:
```env
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=StrongPassword123!

DB_TYPE=postgresdb
# (with PostgreSQL - see POSTGRESQL_SETUP.md)
```

### Important
- Change `.env` passwords before production use
- Use HTTPS in production (nginx/reverse proxy)
- Restrict network access with firewall rules
- Backup `./n8n-data/` regularly
- Never commit `.env` or credentials to git

---

## ⚡ Next Steps

### 1. Verify n8n is Running
```powershell
# Browser: http://localhost:5678
# Should show n8n editor welcome page
```

### 2. Create Your First Workflow
- Open Editor at http://localhost:5678
- Click "New Workflow"
- Add nodes and configure
- Test execution

### 3. (Optional) Install PostgreSQL
- Follow `POSTGRESQL_SETUP.md`
- Update `.env` and `ecosystem.config.js`
- Restart n8n

### 4. Connect n8n-MCP to AI
- Start n8n-MCP: `npm x n8n-mcp`
- Use with Claude/Copilot for AI-assisted workflow building

### 5. Deploy Workflows
- Create credentials in n8n UI
- Link to external services
- Schedule or trigger workflows

---

## 📚 Useful Links

- **n8n Docs**: https://docs.n8n.io
- **n8n Nodes**: https://docs.n8n.io/integrations/
- **n8n Templates**: https://n8n.io/workflows
- **n8n-MCP Repo**: https://github.com/czlonkowski/n8n-mcp
- **PostgreSQL Docs**: https://www.postgresql.org/docs
- **pm2 Documentation**: https://pm2.keymetrics.io

---

## 📝 Environment Variables Reference

See `.env` for all variables. Key ones:

```env
# Database
DB_TYPE=sqlite                                  # or postgresdb
N8N_USER_DATA_DIR=./n8n-data                   # Relative path (portable)

# Server
N8N_PORT=5678                                  # HTTP port
N8N_PROTOCOL=http                              # http or https
N8N_HOST=localhost                             # Interface to bind

# Authentication (optional)
N8N_BASIC_AUTH_ACTIVE=false                    # Set true for authentication
N8N_BASIC_AUTH_USER=admin                      # Username
N8N_BASIC_AUTH_PASSWORD=changeme               # Password

# Webhooks
WEBHOOK_URL=http://localhost:5678/             # For external integrations
WEBHOOK_TUNNEL_URL=                            # For ngrok/tunnel services

# MCP
MCP_MODE=stdio                                 # For Claude Desktop
LOG_LEVEL=info                                 # Logging level
```

---

## ✅ What Works Now

- ✅ **n8n server**: Running on port 5678
- ✅ **pm2 process manager**: Managing n8n lifecycle
- ✅ **SQLite database**: Storing workflows and executions
- ✅ **VSCode tasks**: Quick access to controls
- ✅ **n8n-mcp configured**: Ready for AI integration
- ✅ **PostgreSQL guide**: Ready for production setup

---

## ⏭️ What's Next

- [ ] Open http://localhost:5678 and test n8n UI
- [ ] Create a simple test workflow
- [ ] (Optional) Install and configure PostgreSQL
- [ ] Connect n8n-MCP with Claude/Copilot
- [ ] Build your automation workflows!

---

**Setup completed**: March 4, 2026  
**Status**: Ready for use  
**Questions**: See N8N_SETUP.md and POSTGRESQL_SETUP.md
