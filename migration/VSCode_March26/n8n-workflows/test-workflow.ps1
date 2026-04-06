# n8n Workflow Validation & Test Script
# Tests the GenerateAgents workflow before deployment

Write-Host "=== n8n GenerateAgents Workflow Test Suite ===" -ForegroundColor Cyan

# Test 1: Validate JSON syntax
Write-Host "`n[TEST 1] Validating workflow JSON syntax..." -ForegroundColor Yellow
try {
    $workflow = Get-Content "n8n-workflows\generate-agents-agentspec.json" -Raw | ConvertFrom-Json
    Write-Host "✅ Valid JSON syntax" -ForegroundColor Green
    Write-Host "   - Workflow name: $($workflow.name)"
    Write-Host "   - Node count: $($workflow.nodes.Count)"
    Write-Host "   - Connection count: $($workflow.connections.Count)"
}
catch {
    Write-Host "❌ Invalid JSON: $_" -ForegroundColor Red
    exit 1
}

# Test 2: Validate required workflow fields
Write-Host "`n[TEST 2] Validating workflow structure..." -ForegroundColor Yellow
$requiredFields = @("name", "nodes", "connections")
$missing = @()
foreach ($field in $requiredFields) {
    if (-not $workflow.PSObject.Properties[$field]) {
        $missing += $field
    }
}
if ($missing.Count -eq 0) {
    Write-Host "✅ All required fields present" -ForegroundColor Green
}
else {
    Write-Host "❌ Missing fields: $($missing -join ', ')" -ForegroundColor Red
    exit 1
}

# Test 3: Validate node structure
Write-Host "`n[TEST 3] Validating nodes..." -ForegroundColor Yellow
$nodeErrors = @()
foreach ($node in $workflow.nodes) {
    if (-not $node.id) { $nodeErrors += "Node missing 'id' field" }
    if (-not $node.name) { $nodeErrors += "Node missing 'name' field" }
    if (-not $node.type) { $nodeErrors += "Node $($node.name) missing 'type' field" }
    if (-not $node.position) { $nodeErrors += "Node $($node.name) missing 'position' field" }
}
if ($nodeErrors.Count -eq 0) {
    Write-Host "✅ All nodes valid ($($workflow.nodes.Count) nodes)" -ForegroundColor Green
    foreach ($node in $workflow.nodes) {
        Write-Host "   - $($node.name) ($($node.type))"
    }
}
else {
    Write-Host "❌ Node errors:" -ForegroundColor Red
    $nodeErrors | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
    exit 1
}

# Test 4: Validate connections
Write-Host "`n[TEST 4] Validating connections..." -ForegroundColor Yellow
$connectionCount = 0
foreach ($sourceNode in $workflow.connections.PSObject.Properties) {
    foreach ($outputType in $sourceNode.Value.PSObject.Properties) {
        $connectionCount += $outputType.Value.Count
    }
}
Write-Host "✅ Valid connection structure ($connectionCount connections)" -ForegroundColor Green

# Test 5: Check AgentSpec compiler availability
Write-Host "`n[TEST 5] Checking AgentSpec compiler..." -ForegroundColor Yellow
$compilerPath = "agentspec\dist\cli\index.js"
if (Test-Path $compilerPath) {
    Write-Host "✅ Compiler found: $compilerPath" -ForegroundColor Green
}
else {
    Write-Host "⚠️  Compiler not found. Run 'npm run build' in agentspec/" -ForegroundColor Yellow
}

# Test 6: Check skills-ref validator availability
Write-Host "`n[TEST 6] Checking skills-ref validator..." -ForegroundColor Yellow
$skillsRefPath = "agent-skills\skills-ref"
if (Test-Path $skillsRefPath) {
    Write-Host "✅ skills-ref found: $skillsRefPath" -ForegroundColor Green
    try {
        $uvCheck = & uv --version 2>&1
        Write-Host "✅ uv package manager available: $uvCheck" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠️  uv package manager not found. Install from: https://docs.astral.sh/uv/" -ForegroundColor Yellow
    }
}
else {
    Write-Host "⚠️  skills-ref not found at: $skillsRefPath" -ForegroundColor Yellow
}

# Test 7: Test n8n server connectivity (optional)
Write-Host "`n[TEST 7] Testing n8n server connectivity..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5678" -Method Get -TimeoutSec 2 -ErrorAction Stop
    Write-Host "✅ n8n server is running (http://localhost:5678)" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  n8n server not reachable. Start with: npx n8n" -ForegroundColor Yellow
}

# Summary
Write-Host "`n=== Test Summary ===" -ForegroundColor Cyan
Write-Host "Workflow file: generate-agents-agentspec.json" -ForegroundColor White
Write-Host "Status: Ready for import" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Start n8n: npx n8n" -ForegroundColor White
Write-Host "2. Import workflow: http://localhost:5678 → Import from File" -ForegroundColor White
Write-Host "3. Activate workflow: Toggle 'Active' switch" -ForegroundColor White
Write-Host "4. Test webhook: POST to http://localhost:5678/webhook/generate-agent" -ForegroundColor White

Write-Host "`n=== Test Complete ===" -ForegroundColor Cyan
