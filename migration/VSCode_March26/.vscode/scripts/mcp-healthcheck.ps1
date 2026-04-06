# VSCode MCP Server Health Check & Auto-Restart
# ===============================================
# Triggered: On save (via keybindings.json - Ctrl+S)
# Purpose: Verify all MCP servers are running, restart if down

param(
    [switch]$Verbose = $false
)

$ErrorActionPreference = 'Continue'
$ProjectRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent

Write-Host "`n[Health Check] Checking MCP Server Status..." -ForegroundColor Cyan

# Helper function for status messages
function Write-CheckStatus {
    param(
        [string]$ServerName,
        [bool]$IsHealthy,
        [string]$Details = ""
    )
    
    if ($IsHealthy) {
        Write-Host "  [OK] $ServerName healthy" -ForegroundColor Green
        if ($Details) {
            Write-Host "       $Details" -ForegroundColor DarkGray
        }
    }
    else {
        Write-Host "  [!] $ServerName not responding" -ForegroundColor Red
        if ($Details) {
            Write-Host "      $Details" -ForegroundColor DarkGray
        }
    }
}

# ============================================================================
# Load environment variables from .env
# ============================================================================
$envPath = Join-Path $ProjectRoot ".env"

if (Test-Path $envPath) {
    Get-Content $envPath | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith('#')) {
            if ($line -match '^([^=]+)=(.*)$') {
                $key = $matches[1].Trim()
                $value = $matches[2].Trim()
                $value = $value -replace '^["\x27]|["\x27]$', ''
                [System.Environment]::SetEnvironmentVariable($key, $value, 'Process')
            }
        }
    }
}

# ============================================================================
# 1. Check n8n-MCP Server
# ============================================================================
$n8nHealthy = $false
$n8nDetails = ""

try {
    # Test n8n-mcp by querying tool list
    $testJson = '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
    $response = $testJson | npx n8n-mcp 2>$null
    
    if ($response) {
        $toolData = $response | ConvertFrom-Json -ErrorAction SilentlyContinue
        $toolCount = $toolData.result.tools.Count
        
        if ($toolCount -ge 7) {
            $n8nHealthy = $true
            $n8nDetails = "$toolCount tools available"
            
            # Check for management tools
            $mgmtTools = @($toolData.result.tools.name | Where-Object { $_ -like 'n8n_*' })
            if ($mgmtTools.Count -gt 0) {
                $n8nDetails += ", $($mgmtTools.Count) management tools"
            }
        }
    }
}
catch {
    $n8nDetails = "Error: $_"
}

Write-CheckStatus "n8n-mcp" $n8nHealthy $n8nDetails

if (-not $n8nHealthy) {
    Write-Host "  [->] Attempting to restart n8n-mcp..." -ForegroundColor Yellow
    
    # Try to kill existing n8n-mcp processes
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
        $_.CommandLine -like "*n8n-mcp*"
    } | Stop-Process -Force -ErrorAction SilentlyContinue
    
    Start-Sleep -Milliseconds 500
    
    # Note: n8n-mcp runs via VSCode MCP stdio - restart is handled by VSCode
    Write-Host "  [i] n8n-mcp uses stdio mode - restart VSCode MCP server" -ForegroundColor Cyan
    Write-Host "      Command: Developer: Reload Window (Ctrl+R)" -ForegroundColor DarkGray
}

# ============================================================================
# 2. Check Context7 MCP Server
# ============================================================================
$context7Healthy = $false
$context7Details = ""

if ($env:CONTEXT7_API_KEY) {
    $context7Healthy = $true
    $context7Details = "Configured (stdio mode, on-demand)"
}
else {
    $context7Details = "No API key configured"
}

Write-CheckStatus "Context7" $context7Healthy $context7Details

# ============================================================================
# 3. Check Serena MCP Server
# ============================================================================
$serenaHealthy = $false
$serenaDetails = ""

$serenaMemoryPath = Join-Path $ProjectRoot ".serena\memories"

if (Test-Path $serenaMemoryPath) {
    $memoryFiles = Get-ChildItem -Path $serenaMemoryPath -Recurse -File -ErrorAction SilentlyContinue
    $fileCount = $memoryFiles.Count
    
    if ($fileCount -gt 0) {
        $serenaHealthy = $true
        $serenaDetails = "$fileCount memory files active"
    }
    else {
        $serenaDetails = "No memory files found"
    }
}
else {
    $serenaDetails = "Memory directory not found"
}

Write-CheckStatus "Serena" $serenaHealthy $serenaDetails

# ============================================================================
# 4. Check AI Toolkit (if installed)
# ============================================================================
$aitkHealthy = $false
$aitkDetails = ""

try {
    $aitkInstalled = code --list-extensions 2>$null | Select-String "ms-windows-ai-studio.windows-ai-studio"
    
    if ($aitkInstalled) {
        $aitkHealthy = $true
        $aitkDetails = "AI Toolkit extension installed"
    }
    else {
        $aitkDetails = "Extension not installed (optional)"
    }
}
catch {
    $aitkDetails = "Could not check extension status"
}

Write-CheckStatus "AI Toolkit" $aitkHealthy $aitkDetails

# ============================================================================
# Summary
# ============================================================================
$totalServers = 4
$healthyServers = @($n8nHealthy, $context7Healthy, $serenaHealthy, $aitkHealthy).Where({ $_ }).Count

Write-Host "`n[Summary] $healthyServers/$totalServers services healthy" -ForegroundColor $(if ($healthyServers -eq $totalServers) { "Green" } else { "Yellow" })

if ($healthyServers -lt $totalServers) {
    Write-Host "[!] Some services need attention. Check logs above." -ForegroundColor Yellow
    Write-Host "[Tip] Restart VSCode (Ctrl+R) to reload all MCP servers" -ForegroundColor Cyan
}
else {
    Write-Host "[OK] All MCP services operational`n" -ForegroundColor Green
}

# Return exit code based on health
exit $(if ($healthyServers -eq $totalServers) { 0 } else { 1 })
