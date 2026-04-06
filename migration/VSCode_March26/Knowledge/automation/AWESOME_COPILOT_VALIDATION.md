# Awesome-Copilot MCP Server Validation

**Date**: 2025-01-26  
**Repository**: https://github.com/github/awesome-copilot.git  
**Local Path**: `C:\Users\dylan.a.thomas\ProjectFolder\mcp-dotnet-samples\awesome-copilot`  
**Status**: ✅ Configured and Responding | ⚠️ SSL Connection Issue

---

## Configuration Details

### MCP Server Location
- **Configuration File**: `C:\Users\dylan.a.thomas\AppData\Roaming\Code\User\profiles/-c546848/mcp.json`
- **Scope**: User-level (not workspace-specific)
- **Type**: stdio (subprocess communication)
- **Runtime**: .NET (dotnet run)

### awesome-copilot Server Configuration
```json
{
  "mcpServers": {
    "awesome-copilot": {
      "disabled": false,
      "type": "stdio",
      "command": "dotnet",
      "args": ["run"],
      "cwd": "C:\\Users\\dylan.a.thomas\\ProjectFolder\\mcp-dotnet-samples\\awesome-copilot\\src\\McpSamples.AwesomeCopilot.HybridApp",
      "metadata": {
        "description": "Access awesome-copilot collections, instructions, prompts, and agents"
      }
    }
  }
}
```

### Verified Components
- ✅ Repository exists at configured path
- ✅ MCP server configured in user profile
- ✅ Server responds to tool calls
- ✅ 14 total MCP servers active in user profile

---

## Tool Testing Results

### 1. ✅ `mcp_awesome-copil_list_collections`

**Status**: Working  
**Response Size**: 45KB (1423 lines JSON)  
**Collections Found**: 10+

#### Sample Collections
- **awesome-copilot**: Meta prompts for discovery (6 items)
- **awesome-agents**: Local collection from AwesomeAgents workspace (22 items)
- **azure-cloud-development**: Azure development guidance
- **github-copilot-extensions**: Extension development patterns
- Additional collections listed in output

#### Tool Call Example
```typescript
mcp_awesome-copil_list_collections()
// Returns: Large JSON array with collection metadata
```

#### Sample Response Structure
```json
{
  "collections": [
    {
      "filename": "awesome-copilot.collection.yml",
      "id": "awesome-copilot",
      "name": "Awesome Copilot",
      "description": "Meta prompts that help you discover and generate curated GitHub Copilot chat modes, collections, instructions, prompts, and agents.",
      "tags": ["github-copilot", "discovery", "meta", "prompt-engineering", "agents"],
      "items": [
        {"path": "prompts/suggest-awesome-github-copilot-chatmodes.prompt.md", "kind": "prompts"},
        {"path": "prompts/suggest-awesome-github-copilot-collections.prompt.md", "kind": "prompts"},
        {"path": "prompts/suggest-awesome-github-copilot-instructions.prompt.md", "kind": "prompts"},
        {"path": "prompts/suggest-awesome-github-copilot-prompts.prompt.md", "kind": "prompts"},
        {"path": "prompts/suggest-awesome-github-copilot-agents.prompt.md", "kind": "prompts"},
        {"path": "agents/meta-agentic-project-scaffold.agent.md", "kind": "agents"}
      ]
    }
  ]
}
```

**Note**: First call may take longer due to server initialization. Retry if timeout occurs.

---

### 2. ✅ `mcp_awesome-copil_search_instructions`

**Status**: Working  
**Response Size**: 28KB (687 lines JSON)  
**Instructions Found**: 9  
**Prompts Available**: 100+

#### Tool Call Example
```typescript
mcp_awesome-copil_search_instructions({
  keywords: "agent workflow automation"
})
// Returns: JSON with matching instructions, chatmodes, and prompts
```

#### Sample Search Results
**Instructions Found**:
- `azure-logic-apps-power-automate.instructions.md` - Azure automation platforms
- `declarative-agents-microsoft365.instructions.md` - M365 agent patterns
- `dotnet-upgrade.instructions.md` - .NET migration guidance
- `github-actions-ci-cd-best-practices.instructions.md` - CI/CD workflows
- `joyride-user-project.instructions.md` - User project automation
- `joyride-workspace-automation.instructions.md` - Workspace automation
- `power-bi-devops-alm-best-practices.instructions.md` - Power BI ALM
- `spec-driven-workflow-v1.instructions.md` - Specification-driven development
- `tasksync.instructions.md` - Task synchronization patterns

**Prompts Available** (sample):
- `boost-prompt` - Code enhancement suggestions
- `breakdown-plan` - Task decomposition
- `conventional-commit` - Commit message formatting
- `create-agentsmd` - Agent definition generation
- And 90+ more...

#### Response Structure
```json
{
  "results": {
    "metadata": {
      "chatmodes": [...],
      "instructions": [
        {
          "filename": "joyride-workspace-automation.instructions.md",
          "description": "Automate workspace operations with Joyride patterns",
          "applyTo": "**/*.{ts,js,py,md}"
        }
      ],
      "prompts": [...]
    }
  }
}
```

---

### 3. ✅ `mcp_awesome-copil_load_collection`

**Status**: Working  
**Response**: Inline JSON (collection metadata)

#### Tool Call Example
```typescript
mcp_awesome-copil_load_collection({
  id: "awesome-copilot"
})
// Returns: Collection object with items array
```

#### Sample Response
```json
{
  "filename": "awesome-copilot.collection.yml",
  "id": "awesome-copilot",
  "name": "Awesome Copilot",
  "description": "Meta prompts that help you discover and generate curated GitHub Copilot chat modes, collections, instructions, prompts, and agents.",
  "tags": ["github-copilot", "discovery", "meta", "prompt-engineering", "agents"],
  "items": [
    {
      "path": "prompts/suggest-awesome-github-copilot-agents.prompt.md",
      "kind": "prompts"
    },
    {
      "path": "agents/meta-agentic-project-scaffold.agent.md",
      "kind": "agents"
    }
  ]
}
```

**Parameter Notes**:
- ❌ `collection_id` - Incorrect parameter name
- ✅ `id` - Correct parameter name

---

### 4. ⚠️ `mcp_awesome-copil_load_instruction`

**Status**: SSL Connection Failure  
**Issue**: Cannot establish SSL connection to remote source  
**Error**: `The SSL connection could not be established, see inner exception.`

#### Tool Schema
```typescript
mcp_awesome-copil_load_instruction({
  filename: string,  // Filename of instruction/agent
  mode: "undefined" | "chatmodes" | "instructions" | "prompts" | "agents"
})
```

#### Valid Mode Values
- `"undefined"` - Default/unspecified mode
- `"chatmodes"` - Chat mode definitions
- `"instructions"` - Instruction files
- `"prompts"` - Prompt templates
- `"agents"` - Agent definitions

#### Attempted Tool Call
```typescript
mcp_awesome-copil_load_instruction({
  filename: "suggest-awesome-github-copilot-agents.prompt.md",
  mode: "prompts"
})
// Result: SSL connection error
```

#### Possible Causes
1. **Network Issue**: Firewall/proxy blocking SSL connections
2. **Remote Source Unavailable**: GitHub/remote server connectivity problem
3. **Certificate Validation**: SSL certificate trust chain issue
4. **Configuration**: Missing environment variable or credential
5. **Server Implementation**: Possible bug in dotnet HTTP client configuration

#### Troubleshooting Steps
```powershell
# Check network connectivity to GitHub
Test-NetConnection github.com -Port 443

# Test SSL connectivity with PowerShell
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/github/awesome-copilot/main/README.md"

# Check .NET SSL/TLS configuration
[System.Net.ServicePointManager]::SecurityProtocol

# Verify awesome-copilot server logs (if available)
# Check server console output for detailed error messages
```

#### Workaround Options
1. **Use search_instructions**: Get instruction content from search results
2. **Local file access**: Read instruction files directly from repository path
3. **Fix SSL configuration**: Configure .NET HTTP client with proper certificates
4. **Network debugging**: Use Fiddler/WireShark to capture SSL handshake failure

---

## MCP Server Ecosystem

### All Configured Servers (14 Total)
1. `microsoft/playwright-mcp` - Browser automation (stdio, npx)
2. `io.github.github/github-mcp-server` - GitHub API integration (http)
3. `microsoft/markitdown` - Markdown conversion (stdio, uvx)
4. `sequentialthinking` - Step-by-step reasoning (stdio, npx)
5. `memory` - Persistent memory management (stdio, npx)
6. `time` - Temporal operations (stdio, uvx)
7. `excel-mcp` - Excel file operations (stdio, uvx)
8. **`awesome-copilot`** - Collections and instructions (stdio, dotnet) ⭐
9. `io.github.upstash/context7` - Context management (stdio, npx, requires CONTEXT7_API_KEY)
10. `chroma-core/chroma-mcp` - Vector database (stdio, uvx)
11. `oraios/serena` - Symbolic coding tools (stdio, uvx, project-specific)
12. `io.github.wonderwhy-er/desktop-commander` - Desktop automation (stdio, npx)
13. `n8n-mcp` - n8n workflow automation (stdio, npx, Codespace config)
14. `io.github.contextstreamio/mcp-server` - Context streaming (stdio, npx, requires API key)

### Environment Dependencies
#### Required Environment Variables
- `CONTEXT7_API_KEY` - Context7 server authentication
- `CONTEXTSTREAM_API_KEY` - ContextStream server authentication
- `N8N_API_URL` - n8n Codespace instance URL
- `N8N_API_KEY` - n8n API authentication token

#### Runtime Requirements
- **Node.js**: npx commands (playwright, n8n-mcp, memory, etc.)
- **.NET SDK**: dotnet run (awesome-copilot)
- **Python**: uvx commands (markitdown, time, chroma, serena, excel-mcp)

---

## Integration Points

### n8n Workflow Creation
**Next Step**: Experiment with `mcp_n8n-mcp_n8n_create_workflow`

#### n8n-mcp Configuration
```json
{
  "n8n-mcp": {
    "type": "stdio",
    "command": "npx",
    "args": ["n8n-mcp"],
    "env": {
      "N8N_API_URL": "https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev",
      "N8N_API_KEY": "[CONFIGURED]"
    }
  }
}
```

#### Use Cases
- Programmatically create workflows from agent descriptions
- Integrate awesome-copilot instructions with n8n automation
- Generate health monitoring workflows dynamically
- Build workflow templates from collections

### Agent Collections
**Next Step**: Create custom agent collections

#### awesome-copilot Collection Structure
```yaml
name: Custom Collection
description: Project-specific agents and prompts
tags:
  - automation
  - workflow
  - agents
items:
  - path: agents/workflow-builder.agent.md
    kind: agents
  - path: prompts/generate-n8n-workflow.prompt.md
    kind: prompts
```

#### Integration with GenerateAgents Project
- Use awesome-copilot collections as agent definition source
- Generate agents dynamically based on task requirements
- Store custom agents in workspace-specific collections
- Combine with n8n-mcp for end-to-end automation

---

## Recommendations

### Immediate Actions
1. **Fix SSL Issue**: 
   - Debug .NET SSL configuration in awesome-copilot server
   - Check server console logs for detailed error messages
   - Test network connectivity to GitHub raw content URLs
   - Consider adding certificate trust or proxy configuration

2. **Validate Workaround**:
   - Use `search_instructions` to get instruction content
   - Read files directly from local repository path
   - Create custom loader using file system access

3. **Test n8n Integration**:
   - Validate `mcp_n8n-mcp_n8n_create_workflow` tool
   - Create workflow from awesome-copilot prompt template
   - Deploy test workflow to Codespace n8n instance

### Future Enhancements
1. **Custom Collection Creation**:
   - Build project-specific agent collections
   - Integrate with GenerateAgents workflow
   - Create templates for common automation patterns

2. **Health Monitor Integration**:
   - Use awesome-copilot prompts to enhance health checks
   - Create agent-driven diagnostic workflows
   - Automate workflow generation based on health status

3. **Documentation Generation**:
   - Generate workflow docs from awesome-copilot templates
   - Create agent definitions for common tasks
   - Build instruction library for project patterns

---

## Summary

### ✅ Working Features
- List collections (10+ collections, 45KB response)
- Search instructions (9 instructions, 28KB response)
- Load collection metadata (6 items in awesome-copilot)
- MCP server responds reliably (after initial startup delay)

### ⚠️ Known Issues
- `load_instruction` encounters SSL connection failure
- Network/certificate configuration may need adjustment
- First tool call may timeout (server initialization)

### 🎯 Ready for Next Phase
- n8n workflow creation experiments (`mcp_n8n-mcp_n8n_create_workflow`)
- Agent collection development
- Integration with GenerateAgents project
- Automated workflow generation pipelines

### 📋 Validation Status
**awesome-copilot MCP Setup**: ✅ **VALIDATED**
- Repository: ✅ Exists and configured
- MCP Server: ✅ Running and responding
- Core Tools: ✅ 3 of 4 working (75% functional)
- Blocking Issues: ⚠️ SSL connectivity (workaround available)

**Readiness**: 🟢 **PROCEED** with n8n experiments and agent collection creation. Use `search_instructions` as workaround for `load_instruction` SSL issue.

---

## Additional Resources

### Files Created This Session
- `Knowledge/automation/health_monitor_workflow.json` - 13-node n8n workflow
- `Knowledge/automation/HEALTH_MONITOR_WORKFLOW.md` - Comprehensive workflow documentation (500+ lines)
- `Knowledge/automation/HEALTH_MONITOR_INSTALL.md` - Quick installation guide
- `Knowledge/automation/AWESOME_COPILOT_VALIDATION.md` - This file

### Related Documentation
- `QUICKSTART.md` - Project setup guide
- `N8N_SETUP.md` - n8n installation and configuration
- `POSTGRESQL_SETUP.md` - PostgreSQL migration guide
- `SETUP_COMPLETE.md` - Project completion checklist
- `Knowledge/observability/TRACING_SETUP.md` - AI agent tracing configuration

### n8n Resources
- **Codespace Instance**: https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev
- **Local Port**: http://localhost:5678 (requires Node.js downgrade to fix)
- **Database**: SQLite at `./n8n-data/database.sqlite`

### MCP Resources
- **Configuration**: User profile mcp.json (not workspace-specific)
- **awesome-copilot Repository**: https://github.com/github/awesome-copilot.git
- **Local Path**: `C:\Users\dylan.a.thomas\ProjectFolder\mcp-dotnet-samples\awesome-copilot`

---

**Last Updated**: 2025-01-26 18:45 UTC  
**Validation Performed By**: GitHub Copilot Agent  
**Next Review**: After SSL issue resolution or workaround implementation
