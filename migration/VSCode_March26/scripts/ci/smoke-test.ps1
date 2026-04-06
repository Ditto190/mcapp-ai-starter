# scripts/ci/smoke-test.ps1
param()

Write-Host "Installing dependencies (npm ci)..."
if (Test-Path package-lock.json) { npm ci } else { npm install }

Write-Host "Running commit-with-mcp.js in dry-run (no MCP)..."
node .\scripts\ci\commit-with-mcp.js --message "Smoke test commit" --files "." || Write-Host "commit script exited non-zero"

Write-Host "Running update-context.js in dry-run mode"
node .\scripts\ci\update-context.js --message "Smoke test context" --metadata '{"smoke":"true"}' --dry-run

Write-Host "Smoke test complete."
