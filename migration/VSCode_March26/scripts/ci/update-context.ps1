<#
.SYNOPSIS
  Posts a session update to Context7 (ContextStream-compatible endpoint).

PARAMETER Message
  Message/title for the context update.

PARAMETER Metadata
  JSON string of metadata.

PARAMETER DryRun
  If present, prints payload without sending.
#>
param(
  [string]$Message = "Session update: $(Get-Date -Format o)",
  [string]$Metadata = '{}',
  [switch]$DryRun
)

try { $meta = ConvertFrom-Json $Metadata } catch { $meta = @{} }

$contextUrl = $env:CONTEXT7_API_URL
$token = $env:CONTEXT7_TOKEN
$project = $env:CONTEXT7_PROJECT -or 'default'

$branch = $env:GITHUB_REF -replace 'refs/heads/', ''
if (-not $branch) { $branch = (git rev-parse --abbrev-ref HEAD).Trim() }

$payload = @{ project = $project; title = $Message; content = @{ message = $Message; metadata = $meta; branch = $branch } }

if ($DryRun -or -not $contextUrl -or -not $token) {
  Write-Warning "Dry-run mode or missing credentials. Payload:" 
  $payload | ConvertTo-Json -Depth 5 | Write-Host
  if (-not $contextUrl -or -not $token) { Write-Warning 'CONTEXT7_API_URL or CONTEXT7_TOKEN not set.' }
  exit 0
}

try {
  Invoke-RestMethod -Method Post -Uri "$contextUrl/contextstream" -Body ($payload | ConvertTo-Json -Depth 5) -Headers @{ Authorization = "Bearer $token"; 'Content-Type'='application/json' }
  Write-Host "Context update posted."
} catch {
  Write-Error "Failed to update Context7: $_"
  exit 1
}
