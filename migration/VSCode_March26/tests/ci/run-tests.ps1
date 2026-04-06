<# Simple automated tests for CI scripts (dry-run) #>
param()

Write-Host "Running PowerShell commit wrapper in dry-run (will only commit if staged)..."
pwsh -NoProfile -ExecutionPolicy Bypass -File .\scripts\ci\commit-with-mcp.ps1 -Message "Test commit from CI test" -Files "." -UseMcp:$false

Write-Host "Running PowerShell update-context wrapper in dry-run..."
pwsh -NoProfile -ExecutionPolicy Bypass -File .\scripts\ci\update-context.ps1 -Message "Test context from CI test" -Metadata '{"test":true}' -DryRun

Write-Host "Tests finished."
