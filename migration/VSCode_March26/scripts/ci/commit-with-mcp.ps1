<#
.SYNOPSIS
  Stages and commits files, optionally calls MCP add_or_commit endpoint.

PARAMETER Message
  Commit message.

PARAMETER Files
  Files or patterns to add (default: .)

PARAMETER UseMcp
  Switch to POST to MCP endpoint when `MCP_GIT_API_URL` and `MCP_TOKEN` are set.
#>
param(
    [string]$Message = "Automated commit at $(Get-Date -Format o)",
    [string]$Files = '.',
    [switch]$UseMcp
)

Write-Host "Staging files: $Files"
git add $Files

$staged = git diff --cached --name-only
if (-not $staged) {
    Write-Host "No staged changes to commit. Exiting."; exit 0
}

Write-Host "Committing: $Message"
git commit -m $Message
Write-Host "Local git commit complete."

if ($UseMcp) {
    if (-not $env:MCP_GIT_API_URL -or -not $env:MCP_TOKEN) {
        Write-Warning "UseMcp requested but MCP_GIT_API_URL or MCP_TOKEN not set. Skipping MCP call."
    }
    else {
        $body = @{ action = 'add_or_commit'; files = $Files; message = $Message } | ConvertTo-Json
        try {
            Invoke-RestMethod -Method Post -Uri $env:MCP_GIT_API_URL -Body $body -Headers @{ Authorization = "Bearer $($env:MCP_TOKEN)"; 'Content-Type' = 'application/json' }
            Write-Host "MCP git add/commit requested."
        }
        catch {
            Write-Error "MCP call failed: $_"
            exit 1
        }
    }
}
