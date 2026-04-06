# n8n Instance Guide: Local vs Codespace

**Date:** March 5, 2026  
**Current Setup:** Codespace n8n Instance

---

## 📚 Understanding Your n8n Setup

You have **TWO separate n8n instances** that can be used with the MCP server:

### 🏠 **Local n8n** (Windows Machine)

- **URL:** `http://localhost:5678`
- **Location:** Running on your Windows machine
- **Data:** Stored in [`n8n-data/`](n8n-data/) folder in this project
- **Start Command:** `npx n8n`
- **Pros:**
  - ✅ Faster response times (no network latency)
  - ✅ Works offline
  - ✅ Full control over instance
  - ✅ Direct access to local files
- **Cons:**
  - ❌ Must manually start n8n server
  - ❌ Only accessible from this machine
  - ❌ Requires local resources (RAM, CPU)

### ☁️ **Codespace n8n** (GitHub Cloud)

- **URL:** `https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev`
- **Location:** Running in GitHub Codespaces (cloud container)
- **Data:** Stored in Codespace persistent storage
- **Start:** Automatic when Codespace is running
- **Pros:**
  - ✅ No local resources needed
  - ✅ Accessible from anywhere
  - ✅ Always-on when Codespace is active
  - ✅ Integrated with cloud workflows
- **Cons:**
  - ❌ Requires active Codespace (costs may apply)
  - ❌ Network latency
  - ❌ Codespace URL may change if recreated
  - ❌ Depends on GitHub Codespaces availability

---

## ⚙️ Current MCP Configuration

**Active Instance:** ☁️ **Codespace**

Your global MCP configuration (in AppData) is currently set to use:

```json
{
  "n8n-mcp": {
    "env": {
      "N8N_API_URL": "https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev",
      "N8N_API_KEY": "n8n_api_4567aef5f325db695de6c9e7d5eeb6b99c3638ddc9c8fa5b1fb73662ea25ee1a"
    }
  }
}
```

---

## 🔄 Switching Between Instances

### Quick Switch

Use the toggle script to easily switch:

```powershell
.\.vscode\scripts\toggle-n8n-instance.ps1
```

This script:
- Shows your current configuration
- Prompts to switch to the other instance
- Automatically updates global mcp.json
- Creates backups before changes

### Manual Switch

**Switch to Local:**

```powershell
.\.vscode\scripts\fix-mcp-simple.ps1
```

**Switch to Codespace:**

```powershell
.\.vscode\scripts\switch-to-codespace.ps1
```

### After Switching

**Always reload VSCode:**

```powershell
# Press Ctrl+R or
Developer → Reload Window
```

---

## 🔍 Verifying Which Instance is Active

### Check MCP Configuration

```powershell
$json = Get-Content "$env:APPDATA\Code\User\profiles\-c546848\mcp.json" -Raw | ConvertFrom-Json
$json.servers.'n8n-mcp'.env.N8N_API_URL
```

Output:
- `http://localhost:5678` → Local instance
- `https://...github.dev` → Codespace instance

### Test Connection

```powershell
# Test Local
Invoke-WebRequest http://localhost:5678 -UseBasicParsing

# Test Codespace
Invoke-WebRequest https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev -UseBasicParsing
```

---

## 🚨 Important Notes

### About Codespace URLs

⚠️ **Codespace URLs are temporary!**

If you:
- Rebuild your Codespace
- Delete and recreate the Codespace
- Change Codespace settings

The URL `curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev` will change!

**If Codespace URL changes:**

1. Update [`.env`](.env) with new URL and API key
2. Run: `.\.vscode\scripts\switch-to-codespace.ps1`
3. Reload VSCode

### About API Keys

Each instance has its own API key:

- **Local:** Get from `http://localhost:5678` → Settings → API
- **Codespace:** Get from Codespace n8n → Settings → API

These are stored in your [`.env`](.env) file:

```env
# For Codespace instance
N8N_API_URL=https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev
N8N_API_KEY=n8n_api_4567aef5f325db695de6c9e7d5eeb6b99c3638ddc9c8fa5b1fb73662ea25ee1a
```

---

## 🎯 Recommended Workflow

### For Daily Development

**Use LOCAL instance:**
- Faster, no network delays
- Works offline
- Better for iterating on workflows

```powershell
# Start local n8n
npx n8n

# Switch MCP to local
.\.vscode\scripts\fix-mcp-simple.ps1

# Reload VSCode
Ctrl+R
```

### For Cloud/Production Work

**Use CODESPACE instance:**
- Access from any device
- Share with team
- Integrated with cloud APIs

```powershell
# Ensure Codespace is running
# Visit: https://github.com/codespaces

# Switch MCP to Codespace
.\.vscode\scripts\switch-to-codespace.ps1

# Reload VSCode
Ctrl+R
```

---

## 📋 Troubleshooting

### MCP Says "n8n-mcp not available"

1. **Check which instance is configured:**
   ```powershell
   $json = Get-Content "$env:APPDATA\Code\User\profiles\-c546848\mcp.json" -Raw | ConvertFrom-Json
   $json.servers.'n8n-mcp'.env.N8N_API_URL
   ```

2. **Test if that instance is accessible:**
   ```powershell
   # Use the URL from step 1
   Invoke-WebRequest "<URL>" -UseBasicParsing
   ```

3. **If inaccessible:**
   - **Local:** Start with `npx n8n`
   - **Codespace:** Start your Codespace at github.com/codespaces

### Workflows Not Syncing

**Important:** Local and Codespace instances have **separate databases**!

- Workflows created in Local won't appear in Codespace
- Workflows created in Codespace won't appear in Local

To migrate workflows:
1. Export from source instance (Settings → Import/Export)
2. Import to destination instance

---

## 📁 Related Files

- **Global MCP Config:** `%APPDATA%\Code\User\profiles\-c546848\mcp.json`
- **Environment Variables:** [`.env`](.env)
- **Local n8n Data:** [`n8n-data/`](n8n-data/)
- **Switch Scripts:** [`.vscode/scripts/`](.vscode/scripts/)
  - [`toggle-n8n-instance.ps1`](.vscode/scripts/toggle-n8n-instance.ps1) - Interactive switcher
  - [`fix-mcp-simple.ps1`](.vscode/scripts/fix-mcp-simple.ps1) - Switch to Local
  - [`switch-to-codespace.ps1`](.vscode/scripts/switch-to-codespace.ps1) - Switch to Codespace

---

## ✅ Summary

| Aspect | Local | Codespace ⭐ (Current) |
|--------|-------|----------------------|
| **Speed** | Fast | Moderate |
| **Availability** | Must start manually | Always-on (when Codespace running) |
| **Network** | Not required | Required |
| **Data Location** | `n8n-data/` | Codespace storage |
| **URL Stability** | Always localhost:5678 | May change if Codespace recreated |
| **Best For** | Development, testing | Cloud workflows, team sharing |

**Current Setup:** Using **Codespace** instance

**To switch:** Run `.\.vscode\scripts\toggle-n8n-instance.ps1`

---

**Next Step:** Reload VSCode (Ctrl+R) to activate new configuration! 🎉
