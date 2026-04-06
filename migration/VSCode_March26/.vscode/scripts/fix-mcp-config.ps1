#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Fixes MCP configuration conflicts between workspace and global configs

.DESCRIPTION
    This script:
    1. Backs up current global mcp.json
    2. Detects which n8n instance is available (local or Codespaces)
    3. Updates global mcp.json with correct n8n-mcp configuration
    4. Validates the connection

.PARAMETER UseLocal
    Force use of local n8n instance (http://localhost:5678)

.PARAMETER UseCodespaces
    Force use of Codespaces instance (from .env)
#>

param(
    [switch]$UseLocal,
    [switch]$UseCodespaces
)

$ErrorActionPreference = "Stop"

# Colors for output
function Write-Success { param($msg) Write-Host "[OK] $msg" -ForegroundColor Green }
function Write-Error { param($msg) Write-Host "[ERROR] $msg" -ForegroundColor Red }
function Write-Info { param($msg) Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Warning { param($msg) Write-Host "[WARN] $msg" -ForegroundColor Yellow }

Write-Host "`nMCP Configuration Fix Tool`n" -ForegroundColor Magenta

# Step 1: Locate global mcp.json
$globalMcpPath = "$env:APPDATA\Code\User\profiles\-c546848\mcp.json"
if (!(Test-Path $globalMcpPath)) {
    Write-Error "Global mcp.json not found at: $globalMcpPath"
    exit 1
}
Write-Success "Found global mcp.json: $globalMcpPath"

# Step 2: Backup current config
$backupPath = "$globalMcpPath.backup.$(Get-Date -Format 'yyyyMMdd_HHmmss')"
Copy-Item -Path $globalMcpPath -Destination $backupPath -Force
Write-Success "Backed up to: $backupPath"

# Step 3: Load .env to get n8n configuration
$envPath = "$PSScriptRoot\..\..\\.env"
$envVars = @{}
if (Test-Path $envPath) {
    Get-Content $envPath | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.*)$') {
            $envVars[$matches[1].Trim()] = $matches[2].Trim()
        }
    }
}

$codespaceUrl = $envVars['N8N_API_URL']
$codespaceKey = $envVars['N8N_API_KEY']

# Step 4: Detect which n8n instance to use
$useLocalInstance = $false
$useCodespacesInstance = $false

if ($UseLocal) {
    $useLocalInstance = $true
    Write-Info "Forcing local n8n instance (localhost:5678)"
}
elseif ($UseCodespaces) {
    $useCodespacesInstance = $true
    Write-Info "Forcing Codespaces n8n instance"
}
else {
    Write-Info "Auto-detecting available n8n instances..."
    
    # Test local instance
    try {
        $localResponse = Invoke-WebRequest -Uri "http://localhost:5678" -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($localResponse.StatusCode -eq 200) {
            Write-Success "Local n8n detected at http://localhost:5678"
            $useLocalInstance = $true
        }
    }
    catch {
        Write-Warning "Local n8n not accessible"
    }
    
    # Test Codespaces instance
    if (!$useLocalInstance -and $codespaceUrl) {
        try {
            $codespaceResponse = Invoke-WebRequest -Uri $codespaceUrl -TimeoutSec 3 -ErrorAction SilentlyContinue
            if ($codespaceResponse.StatusCode -eq 200) {
                Write-Success "Codespaces n8n detected at $codespaceUrl"
                $useCodespacesInstance = $true
            }
        }
        catch {
            Write-Warning "Codespaces n8n not accessible"
        }
    }
}

# Step 5: Determine configuration
if (!$useLocalInstance -and !$useCodespacesInstance) {
    Write-Warning "No n8n instance detected. Defaulting to local (you'll need to start n8n)."
    $useLocalInstance = $true
}

# Step 6: Load current global mcp.json
$mcpConfig = Get-Content $globalMcpPath -Raw | ConvertFrom-Json

# Step 7: Update n8n-mcp configuration
if ($useLocalInstance) {
    Write-Info "Configuring for LOCAL n8n instance..."
    
    # Prompt for local API key if not set
    $localApiKey = Read-Host "Enter your LOCAL n8n API key (or press Enter to use existing)"
    if ([string]::IsNullOrWhiteSpace($localApiKey) -and $mcpConfig.servers.'n8n-mcp'.env.N8N_API_KEY) {
        $localApiKey = $mcpConfig.servers.'n8n-mcp'.env.N8N_API_KEY
        Write-Info "Using existing API key from config"
    }
    
    $mcpConfig.servers.'n8n-mcp' = [PSCustomObject]@{
        type    = "stdio"
        command = "npx"
        args    = @("n8n-mcp")
        env     = [PSCustomObject]@{
            MCP_MODE               = "stdio"
            N8N_MODE               = "true"
            LOG_LEVEL              = "error"
            DISABLE_CONSOLE_OUTPUT = "true"
            N8N_API_URL            = "http://localhost:5678"
            N8N_API_KEY            = $localApiKey
        }
    }
    
    Write-Success "Configured n8n-mcp for LOCAL instance (http://localhost:5678)"
    Write-Warning "Make sure to start n8n with: npx n8n"
    
}
elseif ($useCodespacesInstance) {
    Write-Info "Configuring for CODESPACES n8n instance..."
    
    $mcpConfig.servers.'n8n-mcp' = [PSCustomObject]@{
        type    = "stdio"
        command = "npx"
        args    = @("n8n-mcp")
        env     = [PSCustomObject]@{
            MCP_MODE               = "stdio"
            N8N_MODE               = "true"
            LOG_LEVEL              = "error"
            DISABLE_CONSOLE_OUTPUT = "true"
            N8N_API_URL            = $codespaceUrl
            N8N_API_KEY            = $codespaceKey
        }
    }
    
    Write-Success "Configured n8n-mcp for CODESPACES instance ($codespaceUrl)"
}

# Step 8: Save updated config
$mcpConfig | ConvertTo-Json -Depth 10 | Set-Content $globalMcpPath -Encoding UTF8
Write-Success "Updated global mcp.json"

# Step 9: Validate
Write-Info "`nConfiguration Summary:"
Write-Host "  Global mcp.json: $globalMcpPath" -ForegroundColor White
Write-Host "  Workspace mcp.json: REMOVED (using global only)" -ForegroundColor White
Write-Host "  n8n-mcp URL: $($mcpConfig.servers.'n8n-mcp'.env.N8N_API_URL)" -ForegroundColor White
Write-Host "  Backup saved: $backupPath" -ForegroundColor White

Write-Info "`nNext Steps:"
Write-Host "  1. Reload VSCode window (Ctrl+R) or restart GitHub Copilot" -ForegroundColor Yellow
if ($useLocalInstance) {
    Write-Host "  2. Start n8n: npx n8n" -ForegroundColor Yellow
    Write-Host "  3. Get API key: http://localhost:5678 → Settings → API" -ForegroundColor Yellow
}
Write-Host "  4. Verify MCP servers loaded: Developer → MCP Servers" -ForegroundColor Yellow

Write-Success "`nMCP configuration fix complete!`n"
