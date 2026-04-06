# Health Monitor Workflow - Quick Installation Guide

## Current Status

✅ **Workflow Created**: `health_monitor_workflow.json`  
✅ **Documentation Complete**: `HEALTH_MONITOR_WORKFLOW.md`  
⚠️ **n8n Server Issue**: Dependency error preventing local startup  
✅ **Alternative Ready**: Can deploy to Codespace n8n instance instead

---

## Installation Options

### Option 1: Deploy to Codespace n8n (Recommended - Works Now)

Your Codespace instance is already running and accessible:

**1. Access Codespace n8n Editor:**
```
https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev
```

**2. Import Workflow:**
- Click "+" in top left → "Import from file"
- Navigate to: `C:\Users\dylan.a.thomas\Projects\VSCode_March26\Knowledge\automation\health_monitor_workflow.json`
- Or drag and drop the JSON file into the editor
- Click "Save"

**3. Activate Workflow:**
- Toggle "Active" switch (top right corner)
- Workflow will start running every 30 minutes automatically

**4. Test Manually:**
- Click "Or Run Manually" node
- Click "Execute Workflow" button
- Verify log created: `Knowledge\automation\automation-health-log.md`

---

### Option 2: Fix Local n8n and Deploy Locally

Your local n8n server has a dependency issue. To fix:

**1. Clean Install:**
```powershell
# Remove corrupted node_modules
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
npm install

# Start n8n
npx n8n
```

**2. If Still Fails - Use Global Installation:**
```powershell
# Install n8n globally
npm install -g n8n

# Start n8n
n8n
```

**3. Import Workflow:**
- Open http://localhost:5678
- Follow same import steps as Option 1

---

## Quick Verification

After deployment, check that workflow is working:

**1. Check Workflow Status:**
- Open n8n editor
- Workflow should show "Active" badge
- Schedule trigger should show next execution time

**2. Force Manual Execution:**
- Click "Or Run Manually" trigger node
- Click "Execute Workflow"
- Should complete in 8-12 seconds

**3. Verify Log File:**
```powershell
# Check if log file was created
Test-Path Knowledge\automation\automation-health-log.md

# View latest entry
Get-Content Knowledge\automation\automation-health-log.md -Tail 15
```

**Expected Output:**
```markdown
## Health Check - 2025-01-15T...

**Status:** ✅ ALL SYSTEMS HEALTHY

### System Status
- MCP Health: ...
- .env Status: EXISTS
- Codespace n8n: ✅ Reachable
- Scripts Count: 8/8

### Issues Detected
None

---
```

---

## Troubleshooting

### "Execute Command" Nodes Fail

**Symptom**: PowerShell scripts won't run  
**Cause**: Execution policy restriction

**Fix:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Codespace Health Check Fails

**Symptom**: Always shows "Codespace n8n unreachable"  
**Cause**: Node path is incorrect for Codespace-running workflow

**Fix**: If running workflow IN Codespace, change "Test Codespace n8n" node to localhost:
1. Edit node → Change URL to `http://localhost:5678/api/v1/health`
2. Remove Authorization header (not needed for local)
3. Save workflow

### Log File Not Created

**Symptom**: automation-health-log.md doesn't exist  
**Cause**: Directory permissions or path error

**Fix:**
```powershell
# Ensure directory exists
New-Item -ItemType Directory -Force -Path Knowledge\automation

# Create empty log file
New-Item -ItemType File -Force -Path Knowledge\automation\automation-health-log.md

# Rerun workflow
```

---

## Fixing Local n8n Dependency Issue

The current error is:
```
TypeError: LRU is not a constructor
    at Object.<anonymous> (C:\Users\dylan.a.thomas\Projects\VSCode_March26\node_modules\semver\classes\range.js:202:15)
```

### Root Cause
- Node.js v24.11.1 is incompatible with installed semver package
- LRU cache module version mismatch

### Solution 1: Downgrade Node.js (Recommended)
```powershell
# Install nvm-windows if not already installed
# Download from: https://github.com/coreybutler/nvm-windows/releases

# Install Node LTS version
nvm install lts
nvm use lts

# Verify version
node --version  # Should show v20.x or v22.x

# Reinstall n8n
Remove-Item -Recurse -Force node_modules
npm install
npx n8n
```

### Solution 2: Use Docker (Alternative)
```powershell
# Start n8n in Docker container
docker run -it --rm `
  --name n8n `
  -p 5678:5678 `
  -v "${PWD}/n8n-data:/home/node/.n8n" `
  docker.n8n.io/n8nio/n8n

# Access at http://localhost:5678
```

### Solution 3: Use Codespace Only
Continue using your Codespace instance as the primary n8n server.

---

## Next Steps After Installation

1. **Monitor First 24 Hours**:
   - Check log file shows entries every 30 minutes
   - Verify all health checks pass

2. **Customize Schedule** (optional):
   - Edit "Run Every 30 Minutes" node
   - Change interval to preference (10-60 minutes)

3. **Add Notifications** (optional):
   - See HEALTH_MONITOR_WORKFLOW.md sections:
     - "Add Email/Slack Notifications"
     - Customize health check thresholds

4. **Set Up Log Rotation** (recommended):
   - Monthly archival of old logs
   - Keep automation-health-log.md under 1MB

---

## File Locations

```
Knowledge/automation/
├── health_monitor_workflow.json        # Import this into n8n
├── HEALTH_MONITOR_WORKFLOW.md          # Full documentation
├── HEALTH_MONITOR_INSTALL.md           # This file
├── automation-health-log.md            # Created by workflow (after first run)
└── SCRIPTS_AUDIT_INVENTORY.md          # Related automation docs
```

---

## Support Resources

- **Full Documentation**: [HEALTH_MONITOR_WORKFLOW.md](HEALTH_MONITOR_WORKFLOW.md)
- **Script Inventory**: [SCRIPTS_AUDIT_INVENTORY.md](SCRIPTS_AUDIT_INVENTORY.md)
- **n8n Quickstart**: [../../QUICKSTART.md](../../QUICKSTART.md)
- **MCP Setup**: [../n8n-codespace/CONFIGURATION_BACKUP.md](../n8n-codespace/CONFIGURATION_BACKUP.md)

---

**Recommendation**: Use Option 1 (Codespace deployment) immediately, then fix local n8n at your convenience.
