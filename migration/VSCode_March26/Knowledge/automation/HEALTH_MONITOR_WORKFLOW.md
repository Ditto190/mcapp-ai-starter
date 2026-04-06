# VSCode Automation Scripts Health Monitor Workflow

## Overview

**Workflow Name**: VSCode Automation Scripts Health Monitor  
**Purpose**: Automated health monitoring of VSCode project automation systems  
**Execution**: Every 30 minutes (scheduled) + manual trigger  
**Log Output**: `Knowledge/automation/automation-health-log.md`

---

## Workflow Architecture

### Trigger Nodes

1. **Run Every 30 Minutes** (Schedule Trigger)
   - Type: `n8n-nodes-base.scheduleTrigger`
   - Interval: 30 minutes
   - Purpose: Automatic periodic health checks

2. **Or Run Manually** (Manual Trigger)
   - Type: `n8n-nodes-base.manualTrigger`
   - Purpose: Ad-hoc health check execution

### Health Check Nodes

3. **Check MCP Health** (Execute Command)
   - Script: `.vscode/scripts/mcp-healthcheck.ps1`
   - Checks: 4 MCP servers (n8n-mcp, Context7, Serena, AI Toolkit)
   - Output: Health status for each service

4. **Get Recent Changes** (Execute Command)
   - Script: Read recent-changes.md
   - Purpose: Monitor recent file modifications
   - Output: Last 10 lines of change log

5. **Verify Scripts Exist** (Execute Command)
   - Script: Count PowerShell scripts in .vscode/scripts/
   - Expected: 8 scripts (7 in .vscode/scripts/ + 1 in root)
   - Output: Script count

6. **Check .env Variables** (Execute Command)
   - Script: Test .env file existence
   - Expected: File exists with required variables
   - Output: EXISTS or MISSING

7. **Test Codespace n8n** (HTTP Request)
   - URL: https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev/api/v1/health
   - Auth: Bearer token from .env
   - Timeout: 5 seconds
   - Continue on fail: Yes (logs failure instead of stopping workflow)

### Analysis Nodes

8. **Analyze Health Status** (Code)
   - Language: JavaScript
   - Input: All previous health check results
   - Logic:
     ```javascript
     - Parse MCP health output
     - Validate script count (expected: 8)
     - Check .env status
     - Verify Codespace connectivity
     - Compile issues list
     - Determine overall status (✅ or ⚠️)
     ```

9. **Format Log Entry** (Set)
   - Input: Health status analysis
   - Output: Formatted markdown log entry
   - Template:
     ```markdown
     ## Health Check - [timestamp]
     
     **Status:** [✅ ALL SYSTEMS HEALTHY / ⚠️ ISSUES DETECTED]
     
     ### System Status
     - MCP Health: [status]
     - .env Status: [EXISTS/MISSING]
     - Codespace n8n: [✅ Reachable / ❌ Unreachable]
     - Scripts Count: [count]/8
     
     ### Issues Detected
     [list of issues or "None"]
     ```

### Logging Nodes

10. **Write Audit Log** (Execute Command)
    - Action: Append formatted entry to automation-health-log.md
    - Location: `Knowledge/automation/automation-health-log.md`
    - Retention: Unlimited (manual cleanup recommended monthly)

### Decision & Alerting Nodes

11. **Any Issues?** (IF)
    - Condition: Status contains "⚠️ ISSUES DETECTED"
    - True branch: Log Warning
    - False branch: All Good

12. **Log Warning** (Execute Command)
    - Action: Write colored warning to PowerShell console
    - Output: `[AUTOMATION WARNING] Health check detected issues at [timestamp]`
    - Details: List of detected issues

13. **All Good** (NoOp)
    - Purpose: Workflow completion without action
    - Status: Healthy system state

---

## Workflow Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│ TRIGGERS                                                            │
│  • Schedule (every 30 min)  OR  • Manual execution                 │
└─────────────────┬───────────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ HEALTH CHECKS (Sequential)                                          │
│  1. Check MCP Health       → mcp-healthcheck.ps1                    │
│  2. Get Recent Changes     → recent-changes.md (last 10 lines)      │
│  3. Verify Scripts Exist   → Count *.ps1 in .vscode/scripts/        │
│  4. Check .env Variables   → Test .env file existence               │
│  5. Test Codespace n8n     → HTTP health check (5s timeout)         │
└─────────────────┬───────────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ ANALYSIS & FORMATTING                                               │
│  6. Analyze Health Status  → JS code (parse results, detect issues) │
│  7. Format Log Entry       → Markdown template with timestamp       │
└─────────────────┬───────────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ LOGGING                                                             │
│  8. Write Audit Log        → Append to automation-health-log.md     │
└─────────────────┬───────────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ DECISION & ALERTING                                                 │
│  9. Any Issues?            → IF node (check status)                 │
│      ├─ TRUE  → 10. Log Warning (console output with issues)        │
│      └─ FALSE → 11. All Good (silent completion)                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Health Check Criteria

### ✅ Healthy System

- **MCP Health**: All 4 services responding (n8n-mcp, Context7, Serena, AI Toolkit optional)
- **Scripts Count**: 8/8 PowerShell scripts present
- **.env Status**: EXISTS
- **Codespace n8n**: HTTP 200 response within 5 seconds
- **Recent Changes**: Log readable (not required for health)

### ⚠️ Issues Detected

| Issue | Detection Logic | Impact |
|-------|----------------|--------|
| MCP servers not all healthy | mcp-healthcheck.ps1 does not report "4/4" | AI tools may fail |
| .env file missing | Test-Path returns false | Credentials unavailable |
| Codespace n8n unreachable | HTTP request fails or times out | Cloud workflows unavailable |
| Scripts missing | PowerShell count < 7 in .vscode/scripts/ | Automation incomplete |

---

## Installation & Deployment

### Option 1: Import to n8n (Recommended)

1. **Start n8n server** (localhost or Codespace):
   ```powershell
   # Local
   npx n8n
   
   # Or use VSCode task: Ctrl+Shift+B → "n8n: Start"
   ```

2. **Open n8n Editor**:
   - Local: http://localhost:5678
   - Codespace: https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev

3. **Import workflow**:
   - Click "+" → "Import from file"
   - Select: `Knowledge/automation/health_monitor_workflow.json`
   - Click "Save"

4. **Activate workflow**:
   - Toggle "Active" switch (top right)
   - Verify: Schedule trigger shows "Active" badge

5. **Test manually**:
   - Click "Or Run Manually" node
   - Click "Execute Workflow"
   - Check: `Knowledge/automation/automation-health-log.md` updated

### Option 2: Manual n8n Configuration

If import fails, create nodes manually following the architecture section above.

### Option 3: Use n8n-MCP Tools (When Available)

```powershell
# When n8n server is running and authenticated:
# Use GitHub Copilot's n8n-MCP integration:
# "Create workflow from health_monitor_workflow.json"
```

---

## Usage

### Automatic Execution

- **Frequency**: Every 30 minutes (configurable in Schedule Trigger node)
- **Action**: No user interaction required
- **Logs**: Appended to `automation-health-log.md`

### Manual Execution

**Via n8n Editor:**
1. Open workflow in n8n
2. Click "Or Run Manually" node
3. Click "Execute Workflow" button

**Via MCP (when authenticated):**
```
"Run the VSCode health monitor workflow"
```

### Viewing Logs

**PowerShell:**
```powershell
Get-Content Knowledge\automation\automation-health-log.md -Tail 50
```

**VSCode:**
Open [automation-health-log.md](automation-health-log.md)

---

## Customization

### Change Schedule Frequency

1. Open workflow in n8n editor
2. Click "Run Every 30 Minutes" node
3. Modify "Minutes Interval" setting
4. Save workflow

**Recommended Intervals:**
- Development: 30 minutes (default)
- Production: 10-15 minutes (more responsive)
- Low-priority: 60 minutes (reduces overhead)

### Add Email/Slack Notifications

Insert after "Any Issues?" node (TRUE branch):

**Email Notification:**
```json
{
  "node": "n8n-nodes-base.emailSend",
  "parameters": {
    "toEmail": "your-email@example.com",
    "subject": "⚠️ VSCode Automation Health Alert",
    "text": "{{ $json.issues.join(', ') }}"
  }
}
```

**Slack Notification:**
```json
{
  "node": "n8n-nodes-base.slack",
  "parameters": {
    "channel": "#automation-alerts",
    "text": "⚠️ *Health Check Alert*\n{{ $json.issues.join('\n') }}"
  }
}
```

### Adjust Health Check Thresholds

Edit "Analyze Health Status" node JavaScript:

```javascript
// Example: Require only 3/4 MCP servers (make AI Toolkit optional)
if (!mcpHealth.includes('3/4') && !mcpHealth.includes('4/4')) {
  issues.push('Critical MCP servers not healthy');
}

// Example: Reduce required scripts to 7 (if one is deprecated)
if (scriptsCount < 7) issues.push(`Only ${scriptsCount}/7 scripts found`);
```

---

## Troubleshooting

### Workflow Not Running on Schedule

**Symptom**: No new log entries in automation-health-log.md  
**Cause**: Workflow not activated or n8n server stopped

**Fix:**
```powershell
# Check n8n process
Get-Process -Name node -ErrorAction SilentlyContinue

# If not running, start n8n
npx n8n

# Or use VSCode task
# Ctrl+Shift+B → "n8n: Start"
```

Verify workflow is active in n8n editor (Active toggle = ON).

### PowerShell Execution Errors

**Symptom**: Execute Command nodes fail with "cannot be loaded" errors  
**Cause**: PowerShell execution policy restricts script execution

**Fix:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Codespace Health Check Always Fails

**Symptom**: "Codespace n8n unreachable" in every log  
**Cause**: Codespace instance not running or tunnel expired

**Fix:**
```powershell
# Test connectivity manually
.vscode\scripts\fix-mcp-config.ps1 -UseCodespaces

# Or switch to localhost
.vscode\scripts\fix-mcp-simple.ps1
```

Edit "Test Codespace n8n" node to use localhost if working locally.

### Log File Growing Too Large

**Symptom**: automation-health-log.md > 1MB  
**Cause**: Months of accumulated health checks

**Fix: Manual Rotation**
```powershell
# Archive old logs
$timestamp = Get-Date -Format "yyyy-MM-dd"
Move-Item "Knowledge\automation\automation-health-log.md" `
          "Knowledge\automation\automation-health-log-$timestamp.md"

# New log will be created on next execution
```

**Fix: Automated Rotation (Future Enhancement)**
Add log rotation node to workflow (recommended: monthly archives).

---

## Log Format Specification

### Entry Structure

```markdown
## Health Check - [ISO 8601 timestamp]

**Status:** [✅ ALL SYSTEMS HEALTHY / ⚠️ ISSUES DETECTED]

### System Status
- MCP Health: [raw output from mcp-healthcheck.ps1]
- .env Status: [EXISTS / MISSING]
- Codespace n8n: [✅ Reachable / ❌ Unreachable]
- Scripts Count: [number]/8

### Issues Detected
[Issue 1]
[Issue 2]
...or "None"

---

```

### Example: Healthy System

```markdown
## Health Check - 2025-01-15T14:30:00.000Z

**Status:** ✅ ALL SYSTEMS HEALTHY

### System Status
- MCP Health: 4/4 services healthy
- .env Status: EXISTS
- Codespace n8n: ✅ Reachable
- Scripts Count: 8/8

### Issues Detected
None

---

```

### Example: Issues Detected

```markdown
## Health Check - 2025-01-15T15:00:00.000Z

**Status:** ⚠️ ISSUES DETECTED

### System Status
- MCP Health: 3/4 services healthy (AI Toolkit: FAIL)
- .env Status: EXISTS
- Codespace n8n: ❌ Unreachable
- Scripts Count: 7/8

### Issues Detected
Only 7/8 scripts found
Codespace n8n unreachable

---

```

---

## Integration with Existing Automation

### Relationship to Other Scripts

This workflow **monitors** but does not **replace** existing automation:

| Existing Script | Workflow Interaction |
|----------------|---------------------|
| startup.ps1 | Monitored (script count check) |
| mcp-healthcheck.ps1 | **Called by workflow** (Check MCP Health node) |
| catalog-changes.ps1 | Monitored (reads recent-changes.md output) |
| switch-to-codespace.ps1 | Independent (not called by workflow) |
| fix-mcp-simple.ps1 | Independent (not called by workflow) |
| fix-mcp-config.ps1 | Independent (not called by workflow) |
| toggle-n8n-instance.ps1 | Independent (not called by workflow) |

### VSCode Task Integration

The workflow is **independent** of VSCode tasks. It runs in n8n server, not VSCode lifecycle.

**To integrate with VSCode tasks** (future enhancement):
1. Create `.vscode/tasks.json` entry to trigger workflow via n8n API
2. Call task from keybindings or on folder open
3. Example:
   ```json
   {
     "label": "Run Health Monitor",
     "type": "shell",
     "command": "curl",
     "args": [
       "-X", "POST",
       "-H", "Authorization: Bearer ${env:N8N_API_KEY}",
       "http://localhost:5678/webhook/health-monitor"
     ]
   }
   ```

---

## Performance Characteristics

### Execution Time

- **Average**: 8-12 seconds
- **Breakdown**:
  - MCP health check: 2-3s (depends on service response)
  - File operations: <1s each
  - Codespace HTTP test: 1-5s (network latency)
  - Analysis & logging: <1s

### Resource Usage

- **CPU**: Minimal (PowerShell script execution)
- **Memory**: ~50MB (n8n node execution)
- **Disk I/O**: ~2KB per execution (log write)
- **Network**: ~1KB (Codespace health check)

### Scalability

- **Recommended Max Frequency**: Every 5 minutes (720 checks/day)
- **Log Growth**: ~2KB × 48 executions/day = ~96KB/day (~3MB/month)
- **Concurrent Executions**: n8n prevents overlapping runs (safe)

---

## Security Considerations

### Credentials Handling

- **API Keys**: Stored in workflow JSON (encrypted by n8n)
- **Bearer Token**: Hardcoded in HTTP Request node
- **.env File**: Read by PowerShell (not stored in workflow)

**Best Practice**: Use n8n credentials system instead of hardcoding:
1. Settings → Credentials → Add Credential → "Header Auth"
2. Reference in HTTP Request node as `{{ $credentials.n8n_api }}`

### File System Access

- **Read Access**: .serena/memories/, .vscode/scripts/, .env
- **Write Access**: Knowledge/automation/automation-health-log.md
- **Execution**: PowerShell scripts (inherits current user permissions)

**Mitigation**: Run n8n with least-privilege user account.

### Network Exposure

- **Inbound**: None (workflow does not expose endpoints)
- **Outbound**: HTTPS to Codespace n8n (curly-space-spork-*.app.github.dev)

**Mitigation**: Firewall rules allow only n8n process to Codespace domains.

---

## Future Enhancements

### Planned Features

1. **Automated Log Rotation**
   - Monthly archival of automation-health-log.md
   - Retention: Keep last 6 months, compress older

2. **Performance Metrics Collection**
   - Track execution times for each health check
   - Generate monthly performance report

3. **Predictive Alerts**
   - Detect degrading patterns (e.g., increasing Codespace latency)
   - Alert before full failure

4. **Self-Healing Actions**
   - Auto-restart failed MCP servers
   - Auto-switch to localhost if Codespace unreachable

5. **Dashboard Integration**
   - Real-time health status visualization
   - Historical trend charts

### Community Contributions

See [SCRIPTS_AUDIT_INVENTORY.md](SCRIPTS_AUDIT_INVENTORY.md) recommendations section for additional enhancement ideas.

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-01-15 | Initial workflow creation with 13 nodes, 30-min schedule |

---

## Related Documentation

- **Script Inventory**: [SCRIPTS_AUDIT_INVENTORY.md](SCRIPTS_AUDIT_INVENTORY.md)
- **n8n Setup**: [../../QUICKSTART.md](../../QUICKSTART.md)
- **MCP Configuration**: [../n8n-codespace/CONFIGURATION_BACKUP.md](../n8n-codespace/CONFIGURATION_BACKUP.md)
- **Troubleshooting**: Serena memory `n8n-codespaces/troubleshooting`

---

## Support

**Issues**: Create GitHub issue or contact project maintainer  
**Documentation Updates**: Edit this file and commit to repository  
**Workflow Modifications**: Export updated JSON from n8n and commit

---

**Workflow JSON**: [health_monitor_workflow.json](health_monitor_workflow.json)  
**Import to n8n**: Workflows → Import from file → Select JSON  
**Activation**: Toggle "Active" switch in n8n editor
