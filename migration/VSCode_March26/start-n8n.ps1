#!/usr/bin/env pwsh
# n8n Quick Start Script for Windows
# Usage: .\start-n8n.ps1

Write-Host "n8n Startup Script" -ForegroundColor Cyan
Write-Host "==================`n" -ForegroundColor Cyan

# Check if pm2 is installed
try {
    $pm2Version = pm2 --version
    Write-Host "✓ pm2 detected: $pm2Version" -ForegroundColor Green
} catch {
    Write-Host "✗ pm2 not found. Install with: npm install -g pm2" -ForegroundColor Red
    exit 1
}

# Check if data directory exists
if (-not (Test-Path "./n8n-data")) {
    Write-Host "Creating ./n8n-data directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "./n8n-data" -Force | Out-Null
    Write-Host "✓ Directory created" -ForegroundColor Green
}

# Load environment variables from .env
Write-Host "Loading environment from .env..." -ForegroundColor Yellow
if (Test-Path ".env") {
    $env:DOTENV_LOADED = "true"
    Get-Content .env | ForEach-Object {
        if ($_ -match '^\s*([^#=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            [System.Environment]::SetEnvironmentVariable($key, $value, "Process")
            Write-Host "  - $key = $value" -ForegroundColor Gray
        }
    }
    Write-Host "✓ Environment loaded" -ForegroundColor Green
} else {
    Write-Host "⚠ .env file not found. Using defaults." -ForegroundColor Yellow
}

# Check if n8n process already exists
$existingProcess = pm2 list | Select-String "n8n"
if ($existingProcess) {
    Write-Host "`nWarning: n8n process already running" -ForegroundColor Yellow
    Write-Host "Run: pm2 restart n8n" -ForegroundColor Cyan
    exit 0
}

# Start n8n using ecosystem config (if it exists)
Write-Host "`nStarting n8n..." -ForegroundColor Yellow
if (Test-Path "ecosystem.config.js") {
    Write-Host "Using ecosystem.config.js" -ForegroundColor Gray
    pm2 start ecosystem.config.js
} else {
    Write-Host "Using default npx n8n" -ForegroundColor Gray
    pm2 start npx --name n8n -- n8n
}

# Give it a moment to start
Start-Sleep -Seconds 2

# Display status
Write-Host "`nProcess Status:" -ForegroundColor Cyan
pm2 status

Write-Host "`n✓ n8n is starting..." -ForegroundColor Green
Write-Host "  Access editor at: http://localhost:5678`n" -ForegroundColor Cyan
Write-Host "  View logs: pm2 logs n8n" -ForegroundColor Gray
Write-Host "  Stop: pm2 stop n8n" -ForegroundColor Gray
Write-Host "  Restart: pm2 restart n8n`n" -ForegroundColor Gray
