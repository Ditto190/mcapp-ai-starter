# VSCode Project Startup Automation
# ==================================
# Triggered: On folder open (via tasks.json runOn: "folderOpen")
# Purpose: Initialize MCP servers, trace collection, and project memory

param(
    [switch]$Verbose = $false
)

$ErrorActionPreference = 'Continue'
$ProjectRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent

Write-Host "`n================================================================" -ForegroundColor Cyan
Write-Host "  VSCode Project Lifecycle Manager - Startup Sequence" -ForegroundColor Cyan
Write-Host "================================================================`n" -ForegroundColor Cyan

# Helper function for status messages
function Write-Status {
    param(
        [string]$Message,
        [string]$Type = "Info" # Info, Success, Warning, Error
    )
    
    $icon = switch ($Type) {
        "Info" { "[i]" }
        "Success" { "[OK]" }
        "Warning" { "[!]" }
        "Error" { "[X]" }
        default { "[-]" }
    }
    
    $color = switch ($Type) {
        "Info" { "Cyan" }
        "Success" { "Green" }
        "Warning" { "Yellow" }
        "Error" { "Red" }
        default { "White" }
    }
    
    Write-Host "$icon  $Message" -ForegroundColor $color
}

# ============================================================================
# 1. Load Environment Variables from .env
# ============================================================================
Write-Host "[1/7] Loading Environment Configuration..." -ForegroundColor Yellow

$envPath = Join-Path $ProjectRoot ".env"

if (Test-Path $envPath) {
    try {
        Get-Content $envPath | ForEach-Object {
            $line = $_.Trim()
            # Skip comments and empty lines
            if ($line -and -not $line.StartsWith('#')) {
                if ($line -match '^([^=]+)=(.*)$') {
                    $key = $matches[1].Trim()
                    $value = $matches[2].Trim()
                    # Remove quotes if present
                    $value = $value -replace '^["\x27]|["\x27]$', ''
                    [System.Environment]::SetEnvironmentVariable($key, $value, 'Process')
                    
                    if ($Verbose) {
                        Write-Host "  • Set $key" -ForegroundColor DarkGray
                    }
                }
            }
        }
        Write-Status "Environment variables loaded from .env" "Success"
    }
    catch {
        Write-Status "Failed to load .env: $_" "Warning"
    }
}
else {
    Write-Status ".env file not found at $envPath" "Warning"
}

# ============================================================================
# 2. Start AI Toolkit Trace Collector (if installed)
# ============================================================================
Write-Host "`n[2/7] Initializing AI Toolkit Trace Collector..." -ForegroundColor Yellow

try {
    # Check if AI Toolkit extension is installed
    $aitkInstalled = code --list-extensions | Select-String "ms-windows-ai-studio.windows-ai-studio"
    
    if ($aitkInstalled) {
        # Open tracing panel (non-blocking)
        Start-Process -NoNewWindow -FilePath "code" -ArgumentList "--command", "ai-mlstudio.tracing.open" -ErrorAction SilentlyContinue
        Write-Status "AI Toolkit trace collector initialized" "Success"
    }
    else {
        Write-Status "AI Toolkit extension not installed (optional)" "Info"
    }
}
catch {
    Write-Status "Could not start AI Toolkit trace collector: $_" "Warning"
}

Start-Sleep -Milliseconds 500

# ============================================================================
# 3. Check n8n-MCP Server Status
# ============================================================================
Write-Host "`n[3/7] Checking n8n-MCP Server Status..." -ForegroundColor Yellow

# Check if n8n-mcp is running by testing tool availability
$n8nHealthy = $false
try {
    $testJson = '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
    $response = $testJson | npx n8n-mcp 2>$null
    
    if ($response) {
        $toolData = $response | ConvertFrom-Json -ErrorAction SilentlyContinue
        $toolCount = $toolData.result.tools.Count
        
        if ($toolCount -ge 7) {
            $n8nHealthy = $true
            $statusMsg = "n8n-mcp healthy ($toolCount tools available)"
            Write-Status $statusMsg "Success"
            
            # Check for management tools (need API credentials)
            $mgmtTools = @($toolData.result.tools.name | Where-Object { $_ -like 'n8n_*' })
            if ($mgmtTools.Count -gt 0) {
                $mgmtMsg = "Management tools active ($($mgmtTools.Count) tools)"
                Write-Status $mgmtMsg "Success"
            }
            else {
                Write-Status "Core tools only (set N8N_API_KEY for management tools)" "Info"
            }
        }
    }
}
catch {
    Write-Status "n8n-mcp not responding" "Warning"
}

if (-not $n8nHealthy) {
    Write-Status "n8n-mcp may not be running or configured correctly" "Warning"
    Write-Host "  -> Check mcp.json configuration" -ForegroundColor DarkGray
    Write-Host "  -> Verify .env has N8N_API_URL and N8N_API_KEY" -ForegroundColor DarkGray
}

# ============================================================================
# 4. Check Context7 MCP Server
# ============================================================================
Write-Host "`n[4/7] Checking Context7 MCP Status..." -ForegroundColor Yellow

# Context7 is stdio-based, starts on-demand via VSCode MCP
if ($env:CONTEXT7_API_KEY) {
    Write-Status "Context7 configured (stdio mode, starts on-demand)" "Success"
}
else {
    Write-Status "Context7 API key not set (optional)" "Info"
}

# ============================================================================
# 5. Check Serena MCP Server
# ============================================================================
Write-Host "`n[5/7] Checking Serena MCP..." -ForegroundColor Yellow

$serenaMemoryPath = Join-Path $ProjectRoot ".serena\memories"

if (Test-Path $serenaMemoryPath) {
    $memoryFiles = Get-ChildItem -Path $serenaMemoryPath -Recurse -File
    $fileCount = $memoryFiles.Count
    $memoryMsg = "Serena memory initialized ($fileCount memory files)"
    Write-Status $memoryMsg "Success"
    
    # List memory topics
    $topics = Get-ChildItem -Path $serenaMemoryPath -Directory | Select-Object -ExpandProperty Name
    if ($topics) {
        $topicList = $topics -join ', '
        Write-Host "  -> Memory topics: $topicList" -ForegroundColor DarkGray
    }
}
else {
    Write-Status "Creating Serena memory directory..." "Info"
    New-Item -Path $serenaMemoryPath -ItemType Directory -Force | Out-Null
    Write-Status "Serena memory directory created" "Success"
}

# ============================================================================
# 6. Initialize Recent Changes Log
# ============================================================================
Write-Host "`n[6/7] Initializing Change Tracking..." -ForegroundColor Yellow

$changeLogPath = Join-Path $serenaMemoryPath "recent-changes.md"

if (-not (Test-Path $changeLogPath)) {
    $changeLogContent = @"
# Recent Changes Log
**Auto-generated by VSCode automation**
**Last updated**: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

---

## Change History
<!-- Recent file saves are logged here automatically -->

"@
    Set-Content -Path $changeLogPath -Value $changeLogContent
    Write-Status "Created recent-changes.md" "Success"
}
else {
    Write-Status "Change log exists (recent-changes.md)" "Success"
}

# ============================================================================
# 7. Check GitHub Repository Status (if applicable)
# ============================================================================
Write-Host "`n[7/7] Checking GitHub Repository..." -ForegroundColor Yellow

$gitPath = Join-Path $ProjectRoot ".git"

if (Test-Path $gitPath) {
    try {
        $branch = git branch --show-current 2>$null
        $status = git status --porcelain 2>$null
        
        if ($branch) {
            Write-Status "Git repository active (branch: $branch)" "Success"
            
            if ($status) {
                $changedFiles = ($status | Measure-Object).Count
                Write-Status "$changedFiles uncommitted changes detected" "Info"
            }
            else {
                Write-Status "Working directory clean" "Success"
            }
        }
    }
    catch {
        Write-Status "Git not available or not configured" "Info"
    }
}
else {
    Write-Status "Not a Git repository (optional)" "Info"
}

# ============================================================================
# 8. Final Health Summary
# ============================================================================
Write-Host "`n================================================================" -ForegroundColor Cyan
Write-Host "  [OK] Project Startup Complete" -ForegroundColor Cyan
Write-Host "================================================================`n" -ForegroundColor Cyan

Write-Host "System Status:" -ForegroundColor White
$n8nStatus = if ($n8nHealthy) { "Healthy [OK]" } else { "Check config [!]" }
$n8nColor = if ($n8nHealthy) { "Green" } else { "Yellow" }
Write-Host "  n8n-mcp         : $n8nStatus" -ForegroundColor $n8nColor
Write-Host "  Trace Collector : Ready" -ForegroundColor Green
Write-Host "  Serena Memory   : Active" -ForegroundColor Green
Write-Host "  Context7        : On-demand" -ForegroundColor Green

Write-Host "`n[TIP] Press Ctrl+S to run MCP health checks automatically" -ForegroundColor Cyan
Write-Host "[DOCS] .serena/memories/project-automation.md`n" -ForegroundColor DarkGray

# Return success status
exit 0
