#!/usr/bin/env pwsh
# Simple MCP Config Fixer - Updates global mcp.json to use localhost

$ErrorActionPreference = "Stop"

Write-Host "`n=== MCP Configuration Fix ===" -ForegroundColor Cyan

# Paths
$globalMcpPath = "$env:APPDATA\Code\User\profiles\-c546848\mcp.json"
$backupPath = "$globalMcpPath.backup.$(Get-Date -Format 'yyyyMMdd_HHmmss')"

# Check if file exists
if (!(Test-Path $globalMcpPath)) {
    Write-Host "[ERROR] Global mcp.json not found at: $globalMcpPath" -ForegroundColor Red
    exit 1
}

Write-Host "[OK] Found global mcp.json" -ForegroundColor Green

# Backup
Copy-Item -Path $globalMcpPath -Destination $backupPath -Force
Write-Host "[OK] Backed up to: $backupPath" -ForegroundColor Green

# Load and parse JSON
$json = Get-Content $globalMcpPath -Raw | ConvertFrom-Json

# Update n8n-mcp configuration to use localhost
$json.servers.'n8n-mcp'.env.N8N_API_URL = "http://localhost:5678"

Write-Host "[INFO] Updated N8N_API_URL to: http://localhost:5678" -ForegroundColor Yellow
Write-Host "[INFO] Using existing API key from config" -ForegroundColor Yellow

# Save
$json | ConvertTo-Json -Depth 10 | Set-Content $globalMcpPath -Encoding UTF8

Write-Host "[OK] Global mcp.json updated!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "  1. Start n8n: npx n8n" -ForegroundColor White
Write-Host "  2. Reload VSCode window (Ctrl+R)" -ForegroundColor White
Write-Host "  3. Verify MCP servers loaded" -ForegroundColor White
Write-Host ""
