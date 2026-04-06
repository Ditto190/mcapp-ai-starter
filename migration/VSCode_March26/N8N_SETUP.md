# n8n + n8n-mcp Setup Guide

This workspace is now configured to run n8n (workflow automation) with n8n-mcp (AI integration) using pm2 process manager and PostgreSQL.

## Quick Start

### 1. Create Data Directory
```powershell
New-Item -ItemType Directory -Force -Path ./n8n-data
```
Or use VSCode task: **Ctrl+Shift+B** → "n8n: Create data directory"

### 2. Start n8n Service
```powershell
pm2 start ecosystem.config.js
```
Or use VSCode task: **Ctrl+Shift+B** → "n8n: Start (pm2)"

### 3. Access n8n Editor
Open browser: **http://localhost:5678**

### 4. View Logs
```powershell
pm2 logs n8n
```
Or use VSCode task: **Ctrl+Shift+B** → "n8n: View Logs (pm2)"

---

## File Structure

```
.vscode/
  └── tasks.json              # VSCode tasks for n8n control
.env                          # Environment variables (gitignored)
ecosystem.config.js           # pm2 configuration (modify for PostgreSQL)
POSTGRESQL_SETUP.md           # Detailed PostgreSQL installation steps
n8n-data/                     # n8n workflows, credentials, data (gitignored)
logs/                         # pm2 logs (gitignored)
```

---

## Database Configuration

### Current: SQLite (Default)
- **Pros**: No setup needed, portable, works offline
- **Cons**: Single-process only, slower with large datasets
- **Data location**: `./n8n-data/database.sqlite`

### Recommended: PostgreSQL
1. Follow **POSTGRESQL_SETUP.md** to install PostgreSQL and create database
2. Edit `.env` and uncomment PostgreSQL section
3. Edit `ecosystem.config.js` and switch `env` to PostgreSQL config
4. Restart: `pm2 restart n8n`

---

## Environment Variables

Edit `.env` to customize:
- `DB_TYPE`: Database (sqlite / postgresdb)
- `N8N_PORT`: Server port (default: 5678)
- `N8N_HOST`: Server host (default: localhost)
- `N8N_USER_DATA_DIR`: Data storage path (default: ./n8n-data)
- `N8N_BASIC_AUTH_ACTIVE`: Enable basic auth (true/false)
- `WEBHOOK_URL`: External webhook URL for integrations

---

## VSCode Tasks

Press **Ctrl+Shift+B** to run tasks:

| Task | Command |
|------|---------|
| **n8n: Start (pm2)** | `pm2 start ecosystem.config.js` |
| **n8n: Stop (pm2)** | `pm2 stop n8n` |
| **n8n: Restart (pm2)** | `pm2 restart n8n` |
| **n8n: View Logs (pm2)** | `pm2 logs n8n --lines 100` |
| **n8n: Delete pm2 process** | `pm2 delete n8n` |
| **PostgreSQL: Open psql console** | Interactive psql prompt |
| **n8n-mcp: Start (npx)** | Start n8n-mcp server for AI |
| **Workspace: Show Env Vars** | Display all .env settings |
| **n8n: Create data directory** | Make n8n-data folder |

---

## MCP Integration

### n8n-mcp in VSCode

Your `mcp.json` is configured with n8n-mcp:
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

When n8n is running, VSCode/Copilot can:
- Search n8n nodes by name/category
- Get node properties and configurations
- Validate workflows before deployment
- Build workflows with AI assistance

---

## pm2 Process Management

**Start n8n:**
```powershell
pm2 start ecosystem.config.js
```

**Monitor processes:**
```powershell
pm2 status                    # List all processes
pm2 logs n8n                  # View real-time logs
pm2 monit                     # Resource monitoring (interactive)
```

**Stop/Restart:**
```powershell
pm2 stop n8n                  # Stop
pm2 restart n8n              # Restart
pm2 delete n8n               # Remove from pm2
```

**Startup on Windows boot (optional):**
```powershell
pm2 install pm2-windows-service
pm2 start ecosystem.config.js
pm2 save
pm2-windows-service install   # Register Windows service
```

---

## Troubleshooting

### n8n won't start
1. Check logs: `pm2 logs n8n --err`
2. Verify port 5678 is free: `netstat -ano | findstr :5678`
3. Check .env file: `Get-Content .env`
4. Ensure n8n-data directory exists: `ls n8n-data`

### Database errors
1. Verify SQLite: `ls ./n8n-data/database.sqlite` (must exist after first run)
2. For PostgreSQL: Check POSTGRESQL_SETUP.md steps
3. Reset database: Delete database file or drop PostgreSQL database

### mcp.json not loading
1. Check syntax: ESLint extension should highlight errors
2. Restart VSCode after editing mcp.json
3. Verify file location: `%APPDATA%\Code\User\profiles\<profile-id>\mcp.json`

### Port 5678 already in use
Change in `.env` and `ecosystem.config.js`:
```
N8N_PORT=5679
```

---

## Next Steps

1. **Install PostgreSQL** (see POSTGRESQL_SETUP.md) - Recommended for production
2. **Start n8n**: Use VSCode task or `pm2 start ecosystem.config.js`
3. **Access UI**: http://localhost:5678
4. **Create first workflow**: Follow n8n tutorials
5. **Connect AI tools**: Use n8n-mcp with Claude/Copilot for workflow building

---

## Useful Links

- **n8n Docs**: https://docs.n8n.io
- **n8n-mcp Repo**: https://github.com/czlonkowski/n8n-mcp
- **PostgreSQL Docs**: https://www.postgresql.org/docs
- **pm2 Docs**: https://pm2.keymetrics.io

---

## Notes

- All paths are **relative** to the workspace root (portable)
- `.env` and `n8n-data/` are in `.gitignore` for security
- n8n credentials are encrypted in the database
- Backups: Copy `./n8n-data/` to backup location
- Logs: `pm2 logs n8n` shows real-time tail
