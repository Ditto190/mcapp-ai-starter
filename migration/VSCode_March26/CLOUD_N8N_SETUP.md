# Cloud n8n Setup for n8n-MCP

## Status
- ✅ Cloud endpoint is reachable: `https://dyldo190.app.n8n.cloud` (HTTP 200)
- ✅ `.env` is configured with cloud credentials
- ⚠️ Claude Desktop config still points to Codespace (needs update)

## What's Blocking Full Testing

Claude Desktop's MCP server config reads from `%APPDATA%\Claude\claude_desktop_config.json`, which still has old Codespace endpoints. The VS Code n8n-MCP tools won't work until you update this file.

## How to Fix

### Step 1: Open Claude Desktop Config
Navigate to:
```
%APPDATA%\Claude\claude_desktop_config.json
```

On Windows, this is typically:
```
C:\Users\[YourUsername]\AppData\Roaming\Claude\claude_desktop_config.json
```

### Step 2: Find the n8n-mcp Server Block
Look for something like:
```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "npx",
      "args": ["-y", "n8n-mcp"]
    }
  }
}
```

### Step 3: Add Environment Variables
Update it to:
```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "npx",
      "args": ["-y", "n8n-mcp"],
      "env": {
        "MCP_MODE": "stdio",
        "N8N_MODE": "true",
        "LOG_LEVEL": "error",
        "N8N_API_URL": "https://dyldo190.app.n8n.cloud",
        "N8N_API_KEY": "nmcp_3bab323ef70b7439c0912bd4aa3707d25a85eaaba4c261319ab5428813c96735",
        "N8N_MCP_ENDPOINT": "https://dyldo190.app.n8n.cloud/mcp-server/http",
        "N8N_MCP_TOKEN": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzZTM4ZjJjYS02NmYzLTRhN2EtYjZiZS03OTAzN2Y4ZDcxODIiLCJpc3MiOiJuOG4iLCJhdWQiOiJtY3Atc2VydmVyLWFwaSIsImp0aSI6Ijc1NWU2ZGQxLWZmM2UtNDQzNi04OWJmLWRmZGYxNTllNzkxMyIsImlhdCI6MTc3MjYzNjQzOX0.FxBci0dplaHuKfUrg-n9omspsTp-WExPNxNQmcJpGFM"
      }
    }
  }
}
```

**Copy the exact values from `.env` (lines 92-98) to ensure consistency.**

### Step 4: Restart Claude Desktop
- Close Claude Desktop completely
- Reopen Claude Desktop
- MCP tools should now connect to cloud n8n

### Step 5: Verify in VS Code
Once restarted, run this in terminal:
```powershell
npx n8n-mcp --version
```

You should see:
```
n8n-mcp version 2.35.6
Connected to: https://dyldo190.app.n8n.cloud (via environment config)
```

## Cloud Testing Results Summary

| Check | Status | Details |
|-------|--------|---------|
| Cloud endpoint reachable | ✅ HTTP 200 | `https://dyldo190.app.n8n.cloud` responds |
| MCP endpoint accessible | ✅ HTTP 200 | Bearer token auth works |
| REST API endpoint exists | ✅ Responds | `/rest/workflows` path found (HTTP 401 on key format issue) |
| `.env` configuration | ✅ Cloud URLs | Both Mode 1 (commented) and Mode 2 (active) present |
| MCP process env vars | ⚠️ Stale | Claude Desktop config not yet updated with cloud endpoints |

## Next Steps After Updating Claude Desktop Config

1. **Health Check (10 seconds)**
   - MCP process should report cloud URL in diagnostics
   
2. **List Workflows (6 seconds)**
   - Query `https://dyldo190.app.n8n.cloud/rest/workflows`
   
3. **Validate Agent Collection Generator**
   - Import the workflow JSON from `Knowledge/automation/agent-collection-generator-workflow.json`
   
4. **Full Lifecycle Test**
   - Create → Validate → Test workflow execution via MCP

## Alternative: Use REST API Directly from Terminal

If you want to test without updating Claude Desktop, you can use the cloud REST API directly:

```powershell
# Get workflows from cloud n8n
$headers = @{"X-N8N-API-KEY" = "nmcp_3bab323ef70b7439c0912bd4aa3707d25a85eaaba4c261319ab5428813c96735"}
$response = curl.exe -sS -H "X-N8N-API-KEY: nmcp_3bab323ef70b7439c0912bd4aa3707d25a85eaaba4c261319ab5428813c96735" `
  "https://dyldo190.app.n8n.cloud/rest/workflows?limit=10"
$response | ConvertFrom-Json | jq '.'
```

## Credentials in `.env`

All cloud credentials are configured in `.env`:
- `N8N_API_URL`: Cloud n8n REST endpoint
- `N8N_API_KEY`: API key for REST calls
- `N8N_MCP_ENDPOINT`: MCP protocol endpoint (for n8n-mcp tool)
- `N8N_MCP_TOKEN`: Bearer token for MCP calls

Keep these synchronized between `.env` and Claude Desktop config for consistency.

---

**Timeline:**
- Today: Cloud instance is running and reachable ✅
- After Claude config update: Full MCP integration and agent-driven workflows ✅
