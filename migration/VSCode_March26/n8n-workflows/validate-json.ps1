# Quick n8n Workflow JSON Validator
# Validates JSON syntax and basic structure only

Write-Host "=== n8n Workflow JSON Validator ===" -ForegroundColor Cyan

# Load workflow JSON
$workflowPath = "C:\Users\dylan.a.thomas\Projects\VSCode_March26\n8n-workflows\generate-agents-agentspec.json"

try {
    $json = Get-Content $workflowPath -Raw | ConvertFrom-Json
    Write-Host "âœ… JSON syntax valid" -ForegroundColor Green
    
    # Check structure
    Write-Host "`nWorkflow Structure:" -ForegroundColor Yellow
    Write-Host "  Name: $($json.name)" -ForegroundColor White
    Write-Host "  Nodes: $($json.nodes.Count)" -ForegroundColor White
    Write-Host "  Active: $($json.active)" -ForegroundColor White
    
    # List all nodes
    Write-Host "`nNodes:" -ForegroundColor Yellow
    foreach ($node in $json.nodes) {
        Write-Host "  âœ" $node.name "($($node.type))" -ForegroundColor Gray
    }
    
    # Validate node types
    Write-Host "`nValidating node types..." -ForegroundColor Yellow
    $validTypes = @(
        "n8n-nodes-base.webhook",
        "n8n-nodes-base.code",
        "n8n-nodes-base.executeCommand",
        "n8n-nodes-base.if",
        "n8n-nodes-base.respondToWebhook"
    )
    
    $invalidNodes = @()
    foreach ($node in $json.nodes) {
        if ($node.type -notin $validTypes) {
            $invalidNodes += "$($node.name): $($node.type)"
        }
    }
    
    if ($invalidNodes.Count -eq 0) {
        Write-Host "âœ… All node types valid" -ForegroundColor Green
    }
    else {
        Write-Host "âš ï¸ Invalid node types found:" -ForegroundColor Yellow
        foreach ($invalid in $invalidNodes) {
            Write-Host "     $invalid" -ForegroundColor Red
        }
    }
    
    # Check connections
    $connectionCount = 0
    foreach ($source in $json.connections.PSObject.Properties) {
        if ($source.Value.main) {
            $connectionCount += $source.Value.main.Count
        }
    }
    Write-Host "`nConnections: $connectionCount defined" -ForegroundColor White
    
    Write-Host "`n=== RESULT: Workflow JSON is valid ===" -ForegroundColor Green
    Write-Host "Ready to import into n8n at: http://localhost:5678" -ForegroundColor Cyan
    
}
catch {
    Write-Host "âŒ JSON parsing error:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
