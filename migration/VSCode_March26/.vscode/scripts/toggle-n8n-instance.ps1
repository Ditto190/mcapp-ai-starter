#!/usr/bin/env pwsh
# Toggle between Local and Codespace n8n instances for MCP

$ErrorActionPreference = "Stop"

Write-Host "`n=== n8n Instance Switcher for MCP ===" -ForegroundColor Magenta

$globalMcpPath = "$env:APPDATA\Code\User\profiles\-c546848\mcp.json"

# Load current config
$json = Get-Content $globalMcpPath -Raw | ConvertFrom-Json
$currentUrl = $json.servers.'n8n-mcp'.env.N8N_API_URL

# Determine current instance
$isLocal = $currentUrl -like "*localhost*"
$isCodespace = $currentUrl -like "*github.dev*"

Write-Host "`nCurrent Configuration:" -ForegroundColor Cyan
Write-Host "  URL: $currentUrl" -ForegroundColor White
if ($isLocal) {
    Write-Host "  Instance: LOCAL (Windows machine)" -ForegroundColor Green
    Write-Host "`n  Switch to: CODESPACE" -ForegroundColor Yellow
    $switchTo = "codespace"
}
elseif ($isCodespace) {
    Write-Host "  Instance: CODESPACE (Cloud)" -ForegroundColor Green
    Write-Host "`n  Switch to: LOCAL" -ForegroundColor Yellow
    $switchTo = "local"
}
else {
    Write-Host "  Instance: UNKNOWN" -ForegroundColor Red
    $switchTo = $null
}

# Prompt for switch
if ($switchTo) {
    $confirm = Read-Host "`nSwitch to $($switchTo.ToUpper())? (y/n)"
    if ($confirm -eq 'y') {
        if ($switchTo -eq "local") {
            & "$PSScriptRoot\fix-mcp-simple.ps1"
        }
        else {
            & "$PSScriptRoot\switch-to-codespace.ps1"
        }
    }
    else {
        Write-Host "[CANCELLED] No changes made" -ForegroundColor Yellow
    }
}
else {
    Write-Host "`nManual Options:" -ForegroundColor Cyan
    Write-Host "  Local:      .\fix-mcp-simple.ps1" -ForegroundColor White
    Write-Host "  Codespace:  .\switch-to-codespace.ps1" -ForegroundColor White
}

Write-Host ""
