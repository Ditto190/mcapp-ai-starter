# Automation Scripts Audit & Inventory

**Generated:** March 5, 2026  
**Total Scripts:** 8 PowerShell scripts  
**Status:** ✅ All Accounted For

---

## Executive Summary

This workspace contains **8 automation scripts** distributed across two locations:
- **Root:** 1 script (n8n startup)
- **`.vscode/scripts/`:** 7 scripts (lifecycle management, MCP operations, configuration)

All scripts are currently **production-ready** and **documented**. They support:
- Project initialization
- MCP server health monitoring
- n8n instance switching (local ↔ cloud)
- Automated change tracking
- Configuration recovery

---

## Script Inventory

### 1. Root Scripts

#### `start-n8n.ps1`
**Location:** `c:\Users\dylan.a.thomas\Projects\VSCode_March26\start-n8n.ps1`  
**Purpose:** Start n8n using pm2 process manager  
**Trigger:** Manual execution  
**Dependencies:** 
- pm2 (npm global package)
- .env file (optional)
- ecosystem.config.js (optional)

**Key Features:**
- Checks if pm2 is installed
- Loads .env variables
- Creates n8n-data directory if missing
- Starts n8n with pm2 for process management
- Displays status and helpful commands

**Usage:**
```powershell
.\start-n8n.ps1
```

**Status:** ✅ Production Ready

---

### 2. VSCode Lifecycle Scripts (`.vscode/scripts/`)

#### `startup.ps1`
**Location:** `.vscode\scripts\startup.ps1`  
**Purpose:** Complete project initialization on folder open  
**Trigger:** Automatic (VSCode folder open via tasks.json)  
**Dependencies:** 
- .env file
- Serena memory directory
- MCP servers configured in mcp.json

**Tasks Performed:**
1. Load environment variables from .env
2. Start AI Toolkit trace collector (if installed)
3. Check n8n-mcp server status (20 tools expected)
4. Verify Context7 MCP configured
5. Check Serena memory directory (count files/topics)
6. Initialize recent-changes.md log
7. Check Git repository status
8. Display comprehensive health summary

**Execution Time:** 2-5 seconds  
**Output:** Console report with color-coded status indicators  
**Status:** ✅ Production Ready

---

#### `mcp-healthcheck.ps1`
**Location:** `.vscode\scripts\mcp-healthcheck.ps1`  
**Purpose:** Verify all MCP servers are running correctly  
**Trigger:** 
- Automatic (Ctrl+S save via keybindings.json)
- Manual execution

**Checks Performed:**
1. **n8n-mcp:** Tool count (≥7), management tools (13 expected)
2. **Context7:** API key configuration check
3. **Serena:** Memory file count validation
4. **AI Toolkit:** Extension installation detection

**Execution Time:** 1-2 seconds (background)  
**Output:** Silent unless issues detected  
**Status:** ✅ Production Ready  
**Health Threshold:** 4/4 services = healthy

---

#### `catalog-changes.ps1`
**Location:** `.vscode\scripts\catalog-changes.ps1`  
**Purpose:** Log file changes to Serena memory for AI retrieval  
**Trigger:** File save event (Ctrl+S, Ctrl+Shift+S)  
**Dependencies:** 
- .serena/memories/ directory
- recent-changes.md log file

**Features:**
- Filters catalogable files (code, docs only)
- Excludes node_modules, .git, build outputs
- Logs: timestamp, relative path, file size
- Maintains rolling log (last 100 entries only)

**Execution Time:** <100ms (instant)  
**Output:** Silent background logging  
**Status:** ✅ Production Ready

---

### 3. n8n Configuration Management Scripts

#### `switch-to-codespace.ps1`
**Location:** `.vscode\scripts\switch-to-codespace.ps1`  
**Purpose:** Update n8n-mcp to use GitHub Codespaces instance  
**Trigger:** Manual execution  
**Dependencies:** 
- .env file with N8N_API_URL and N8N_API_KEY
- Global mcp.json at `$APPDATA\Code\User\profiles\-c546848\mcp.json`

**Operations:**
1. Loads Codespace credentials from .env
2. Backs up current mcp.json (timestamped)
3. Updates n8n-mcp server config with cloud endpoint
4. Saves updated configuration

**Execution Time:** <500ms  
**Backup Created:** Yes (automatic timestamped backup)  
**Status:** ✅ Production Ready

**Usage:**
```powershell
.\.vscode\scripts\switch-to-codespace.ps1
```

---

#### `fix-mcp-simple.ps1`
**Location:** `.vscode\scripts\fix-mcp-simple.ps1`  
**Purpose:** Reset n8n-mcp to use local instance (localhost:5678)  
**Trigger:** Manual execution  
**Dependencies:** Global mcp.json

**Operations:**
1. Backs up current mcp.json
2. Updates N8N_API_URL to http://localhost:5678
3. Preserves existing API key

**Execution Time:** <500ms  
**Backup Created:** Yes (automatic)  
**Status:** ✅ Production Ready

**Usage:**
```powershell
.\.vscode\scripts\fix-mcp-simple.ps1
```

---

#### `fix-mcp-config.ps1`
**Location:** `.vscode\scripts\fix-mcp-config.ps1`  
**Purpose:** Comprehensive MCP configuration repair with auto-detection  
**Trigger:** Manual execution  
**Dependencies:** 
- .env file
- Global mcp.json

**Features:**
- Auto-detects available n8n instances (local + Codespace)
- Tests connectivity before switching
- Supports forced mode (`-UseLocal`, `-UseCodespaces`)
- Interactive API key prompt
- Validates configuration after update

**Execution Time:** 2-5 seconds (includes connectivity tests)  
**Backup Created:** Yes (timestamped)  
**Status:** ✅ Production Ready

**Usage:**
```powershell
# Auto-detect
.\.vscode\scripts\fix-mcp-config.ps1

# Force local
.\.vscode\scripts\fix-mcp-config.ps1 -UseLocal

# Force Codespaces
.\.vscode\scripts\fix-mcp-config.ps1 -UseCodespaces
```

---

#### `toggle-n8n-instance.ps1`
**Location:** `.vscode\scripts\toggle-n8n-instance.ps1`  
**Purpose:** Interactive switcher between local and Codespace instances  
**Trigger:** Manual execution  
**Dependencies:** 
- fix-mcp-simple.ps1
- switch-to-codespace.ps1
- Global mcp.json

**Features:**
- Detects current instance (LOCAL or CODESPACE)
- Displays current configuration
- Prompts for confirmation to switch
- Delegates to appropriate fix script

**Execution Time:** User-interactive  
**Status:** ✅ Production Ready

**Usage:**
```powershell
.\.vscode\scripts\toggle-n8n-instance.ps1
```

---

## Automation Triggers

| Script | Trigger | Frequency | Output |
|--------|---------|-----------|--------|
| `startup.ps1` | Folder open | Once per session | Console report |
| `mcp-healthcheck.ps1` | Ctrl+S (save) | Every save | Silent (unless issue) |
| `catalog-changes.ps1` | File save | Every save | Silent background log |
| Other scripts | Manual | On-demand | Interactive console |

---

## Dependencies Map

```
startup.ps1
├── .env
├── .serena/memories/
├── mcp.json (MCP servers)
└── Git repository (optional)

mcp-healthcheck.ps1
├── MCP servers (n8n-mcp, Context7, Serena)
└── AI Toolkit extension (optional)

catalog-changes.ps1
├── .serena/memories/recent-changes.md
└── File path input (from VSCode)

switch-to-codespace.ps1
├── .env (N8N_API_URL, N8N_API_KEY)
└── Global mcp.json

fix-mcp-simple.ps1
└── Global mcp.json

fix-mcp-config.ps1
├── .env (optional)
├── Global mcp.json
├── HTTP connectivity test
└── Interactive prompts

toggle-n8n-instance.ps1
├── fix-mcp-simple.ps1
├── switch-to-codespace.ps1
└── Global mcp.json
```

---

## Integration Points

### VSCode Tasks (`.vscode/tasks.json`)

| Task Label | Script | Run On | Shortcut |
|------------|--------|--------|----------|
| "Project Startup" | startup.ps1 | Folder open | Auto |
| "MCP Health Check" | mcp-healthcheck.ps1 | Manual | Ctrl+Alt+H |
| "Catalog File Change" | catalog-changes.ps1 | File save | Ctrl+S |

### Keybindings (`.vscode/keybindings.json`)

| Key | Command | Script | Purpose |
|-----|---------|--------|---------|
| `Ctrl+S` | workbench.action.tasks.runTask: "MCP Health Check" | mcp-healthcheck.ps1 | Check MCP servers after save |
| `Ctrl+Alt+H` | workbench.action.tasks.runTask: "MCP Health Check" | mcp-healthcheck.ps1 | Manual health check |
| `Ctrl+Alt+S` | workbench.action.tasks.runTask: "Project Startup" | startup.ps1 | Manual re-initialization |

---

## Environment Variables Used

| Variable | Used By | Purpose |
|----------|---------|---------|
| `N8N_API_URL` | switch-to-codespace.ps1, fix-mcp-config.ps1, startup.ps1 | n8n endpoint |
| `N8N_API_KEY` | switch-to-codespace.ps1, fix-mcp-config.ps1, startup.ps1 | API authentication |
| `CONTEXT7_API_KEY` | startup.ps1, mcp-healthcheck.ps1 | Context7 MCP server |
| `N8N_MODE` | startup.ps1, mcp-healthcheck.ps1 | Enable n8n management tools |

---

## File Outputs

| File | Created By | Purpose | Retention |
|------|------------|---------|-----------|
| `.serena/memories/recent-changes.md` | catalog-changes.ps1 | Change history log | Last 100 entries |
| `mcp.json.backup.YYYYMMDD_HHMMSS` | All config scripts | Configuration backup | Manual cleanup |
| `logfile` (console output) | All scripts | Execution logs | Session-based |

---

## Testing Status

| Script | Last Tested | Status | Issues |
|--------|-------------|--------|--------|
| startup.ps1 | 2026-03-05 | ✅ Pass | None |
| mcp-healthcheck.ps1 | 2026-03-05 | ✅ Pass | None |
| catalog-changes.ps1 | 2026-03-05 | ✅ Pass | None |
| switch-to-codespace.ps1 | 2026-03-05 | ✅ Pass | None |
| fix-mcp-simple.ps1 | 2026-03-05 | ✅ Pass | None |
| fix-mcp-config.ps1 | 2026-03-05 | ✅ Pass | None |
| toggle-n8n-instance.ps1 | 2026-03-05 | ✅ Pass | None |
| start-n8n.ps1 | 2026-03-05 | ✅ Pass | Requires pm2 |

---

## Recommendations

### ✅ Currently Implemented
1. Automated health monitoring (on save)
2. Project initialization (on folder open)
3. Change tracking (on file save)
4. Configuration switching (manual)
5. Comprehensive logging

### 🔄 Potential Enhancements
1. **Scheduled Health Monitor** - n8n workflow running every 30 minutes
2. **Error Recovery Automation** - Auto-restart failed MCP servers
3. **Backup Rotation** - Clean old mcp.json backups (keep last 10)
4. **Performance Metrics** - Track script execution times
5. **Notification System** - Alert on critical failures (Slack/email)

---

## Quick Reference Commands

### Daily Operations
```powershell
# Check all services
.\.vscode\scripts\mcp-healthcheck.ps1

# Switch to Codespace
.\.vscode\scripts\switch-to-codespace.ps1

# Switch to Local
.\.vscode\scripts\fix-mcp-simple.ps1

# Toggle interactively
.\.vscode\scripts\toggle-n8n-instance.ps1

# Re-initialize project
.\.vscode\scripts\startup.ps1
```

### Recovery Commands
```powershell
# Full reset (if MCP broken)
.\.vscode\scripts\fix-mcp-config.ps1

# Check recent changes
Get-Content .serena\memories\recent-changes.md | Select-Object -First 20

# View MCP config
Get-Content "$env:APPDATA\Code\User\profiles\-c546848\mcp.json" | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

---

## Documentation Cross-Reference

- **Setup Guide:** `.serena/memories/project-automation/complete-setup-guide.md`
- **n8n Codespace:** `Knowledge/n8n-codespace/TECHNICAL_REFERENCE.md`
- **MCP Health:** `.serena/memories/project-automation/complete-setup-guide.md`
- **Tasks Config:** `.vscode/tasks.json`
- **Keybindings:** `.vscode/keybindings.json`

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2026-03-05 | 1.0 | Initial audit - all 8 scripts accounted for |

---

**Status:** ✅ All Scripts Operational  
**Coverage:** 100%  
**Next Audit:** Recommend quarterly review
