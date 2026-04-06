#!/usr/bin/env pwsh
# Switch n8n-MCP to use Codespace instance

$ErrorActionPreference = "Stop"

Write-Host "`n=== Switching to Codespace n8n ===" -ForegroundColor Cyan

# Paths
$globalMcpPath = "$env:APPDATA\Code\User\profiles\-c546848\mcp.json"
$backupPath = "$globalMcpPath.backup.$(Get-Date -Format 'yyyyMMdd_HHmmss')"

# Load .env for Codespace credentials
$envPath = "$PSScriptRoot\..\..\\.env"
$codespaceUrl = ""
$codespaceKey = ""

if (Test-Path $envPath) {
    Get-Content $envPath | ForEach-Object {
        if ($_ -match '^N8N_API_URL=(.+)$') {
            $codespaceUrl = $matches[1].Trim()
        }
        if ($_ -match '^N8N_API_KEY=(.+)$') {
            $codespaceKey = $matches[1].Trim()
        }
    }
}

if (!$codespaceUrl -or !$codespaceKey) {
    Write-Host "[ERROR] Could not find N8N_API_URL or N8N_API_KEY in .env" -ForegroundColor Red
    exit 1
}

Write-Host "[INFO] Codespace URL: $codespaceUrl" -ForegroundColor Cyan
Write-Host "[INFO] API Key: $($codespaceKey.Substring(0,20))..." -ForegroundColor Cyan

# Backup
Copy-Item -Path $globalMcpPath -Destination $backupPath -Force
Write-Host "[OK] Backed up to: $backupPath" -ForegroundColor Green

# Load and update JSON
$json = Get-Content $globalMcpPath -Raw | ConvertFrom-Json
$json.servers.'n8n-mcp'.env.N8N_API_URL = $codespaceUrl
$json.servers.'n8n-mcp'.env.N8N_API_KEY = $codespaceKey

# Save
$json | ConvertTo-Json -Depth 10 | Set-Content $globalMcpPath -Encoding UTF8

Write-Host "[OK] Updated global mcp.json to use Codespace!" -ForegroundColor Green
Write-Host "`nConfiguration:" -ForegroundColor Cyan
Write-Host "  URL: $codespaceUrl" -ForegroundColor White
Write-Host "  Instance: GitHub Codespaces (cloud)" -ForegroundColor White
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "  1. Reload VSCode window (Ctrl+R)" -ForegroundColor White
Write-Host "  2. Verify MCP servers loaded" -ForegroundColor White
Write-Host "  3. Ensure Codespace stays running for MCP to work" -ForegroundColor Yellow
Write-Host ""
