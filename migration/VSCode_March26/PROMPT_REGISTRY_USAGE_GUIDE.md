# Prompt Registry - Practical Usage Guide

## Overview

The `prompt-registry.yaml` file serves as a **central catalog** for MCP sources in your workspace. It enables:

- **Discovery**: Find available MCP tools and capabilities
- **Documentation**: Track what each source does and how to use it
- **Configuration**: Link to MCP server configurations
- **Integration**: Connect multiple MCP sources across tools

## How It Works

### 1. VS Code Extension (if installed)

If you have a prompt-registry VS Code extension installed, it will:

1. **Auto-discover** the `prompt-registry.yaml` in your workspace root
2. **Parse sources** and display them in the extension UI
3. **Enable quick access** to MCP tools via command palette
4. **Provide IntelliSense** for registered capabilities

### 2. Manual Reference (Without Extension)

Even without an extension, the YAML file serves as **living documentation**:

```yaml
sources:
  - id: "desktop-commander"
    capabilities:
      - file_management        # File operations
      - terminal_commands      # Shell command execution
      - system_automation      # OS-level automation
      - process_control        # Process management
      - clipboard_operations   # Clipboard read/write
```

## Practical Usage Examples

### Example 1: Finding Available Tools

**Question**: "What MCP tools are available in this workspace?"

**Answer** (from prompt-registry.yaml):

- **Desktop Commander** (id: `desktop-commander`)
  - File management, terminal commands, system automation
  - Package: `@wonderwhy-er/desktop-commander`
  
- **n8n MCP** (id: `n8n-mcp`)
  - Workflow management, template search, validation
  - Package: `n8n-mcp`

### Example 2: Using Desktop Commander Capabilities

Based on registered capabilities in `prompt-registry.yaml`:

#### File Management

```javascript
// Desktop Commander provides file_management capability
// Usage: Read, write, list, delete files

// Example request to Copilot:
"Use Desktop Commander to list all .json files in the current directory"
```

#### Terminal Commands

```javascript
// Desktop Commander provides terminal_commands capability
// Usage: Execute shell commands

// Example request to Copilot:
"Use Desktop Commander to run 'npm install' in the agentspec directory"
```

#### Clipboard Operations

```javascript
// Desktop Commander provides clipboard_operations capability
// Usage: Read/write system clipboard

// Example request to Copilot:
"Use Desktop Commander to copy the contents of config.json to clipboard"
```

### Example 3: Using n8n MCP Capabilities

#### Workflow Management

```javascript
// n8n MCP provides workflow_management capability
// Usage: List, create, activate/deactivate workflows

// Example request to Copilot:
"Use n8n MCP to list all active workflows"
```

#### Template Search

```javascript
// n8n MCP provides template_search capability
// Usage: Find pre-built workflow templates

// Example request to Copilot:
"Use n8n MCP to search for Slack notification templates"
```

#### Workflow Validation

```javascript
// n8n MCP provides workflow_validation capability
// Usage: Validate workflow JSON structure

// Example request to Copilot:
"Use n8n MCP to validate the workflow in generate-agents-agentspec.json"
```

## Integration with MCP Clients

### 1. GitHub Copilot (VS Code)

The MCP servers configured in `.vscode/mcp.json` are automatically available to Copilot:

```markdown
# Ask Copilot:
"@workspace Use Desktop Commander to check if n8n is running"

# Copilot will:
1. Recognize Desktop Commander is available (from mcp.json)
2. Use the process_control capability (from prompt-registry.yaml)
3. Execute the appropriate MCP tool call
4. Return results
```

### 2. Claude Desktop

To use with Claude Desktop, copy MCP configuration:

```bash
# Windows: %APPDATA%\Claude\claude_desktop_config.json
# Add the contents of .vscode/mcp.json to Claude's config
```

### 3. Direct MCP Communication (Advanced)

Test MCP servers directly via stdio:

```powershell
# Test Desktop Commander
npx @wonderwhy-er/desktop-commander

# Test n8n MCP
npx n8n-mcp
```

## Capability Mapping

### Desktop Commander

| Capability | Use Cases | Example Commands |
|------------|-----------|------------------|
| `file_management` | CRUD operations on files | List directory, read file, write file, delete file |
| `terminal_commands` | Shell command execution | Run npm scripts, execute git commands |
| `system_automation` | OS-level tasks | Check system info, manage services |
| `process_control` | Process management | List processes, kill process, check if running |
| `clipboard_operations` | Clipboard interaction | Copy text, paste content |

### n8n MCP

| Capability | Use Cases | Example Commands |
|------------|-----------|------------------|
| `workflow_management` | CRUD workflows | List workflows, get workflow details, activate/deactivate |
| `template_search` | Find pre-built workflows | Search by task, complexity, or metadata |
| `node_validation` | Validate node configs | Check node parameters, validate auth |
| `workflow_validation` | Validate workflow JSON | Check structure, validate connections |

## Checking What's Actually Available

### Test Desktop Commander Tools

```powershell
# Option 1: Via Copilot
# Ask: "@workspace Show me what tools Desktop Commander provides"

# Option 2: Via MCP introspection (if extension supports it)
# Check extension UI for tool list

# Option 3: Via documentation
# Visit: https://desktopcommander.app/library/
```

### Test n8n MCP Tools

```powershell
# Option 1: Via Copilot
# Ask: "@workspace What n8n MCP tools can I use?"

# Option 2: Direct test
npx n8n-mcp  # Will show available tools in stdio mode (if implemented)

# Option 3: Via n8n UI
# Start n8n: npx n8n
# Check available nodes and features at http://localhost:5678
```

## Practical Workflows

### Workflow 1: File Operations with Desktop Commander

```markdown
1. Ask Copilot: "Use Desktop Commander to create a new directory called 'test-output'"
2. Ask Copilot: "Use Desktop Commander to write 'Hello World' to test-output/hello.txt"
3. Ask Copilot: "Use Desktop Commander to read the contents of test-output/hello.txt"
4. Ask Copilot: "Use Desktop Commander to delete the test-output directory"
```

### Workflow 2: n8n Workflow Automation

```markdown
1. Ask Copilot: "Use n8n MCP to search for webhook templates"
2. Review results and select a template
3. Ask Copilot: "Use n8n MCP to validate my current workflow JSON"
4. Ask Copilot: "Use n8n MCP to list all active workflows"
```

### Workflow 3: Combined Usage

```markdown
1. Ask Copilot: "Use Desktop Commander to check if n8n server is running"
2. If not running: "Use Desktop Commander to start n8n with 'npx n8n' in background"
3. Wait 10 seconds for startup
4. Ask Copilot: "Use n8n MCP to list all workflows"
5. Ask Copilot: "Use Desktop Commander to copy the workflow list to clipboard"
```

## Troubleshooting

### Issue: "MCP tools not available in Copilot"

**Solution**:

1. Reload VS Code window: `Ctrl+Shift+P` → "Developer: Reload Window"
2. Verify `.vscode/mcp.json` exists and is valid JSON
3. Check that packages are installed: `npm list @wonderwhy-er/desktop-commander`

### Issue: "Cannot find prompt-registry.yaml"

**Solution**:

1. Verify file is in workspace root (not in subdirectory)
2. Check file name is exactly `prompt-registry.yaml` (not `.yml`)
3. If using extension, check extension settings for custom paths

### Issue: "MCP server not responding"

**Solution**:

```powershell
# Test manually
npx @wonderwhy-er/desktop-commander
npx n8n-mcp

# Check for errors in output
# Verify environment variables are set (for n8n-mcp)
```

## Advanced: Extending the Registry

### Adding a New MCP Source

```yaml
sources:
  - id: "my-custom-mcp"
    name: "My Custom MCP Server"
    type: "mcp"
    description: "Custom MCP for specific automation tasks"
    enabled: true
    package: "my-custom-mcp-package"
    capabilities:
      - custom_capability_1
      - custom_capability_2
    mcp_config:
      type: "stdio"
      command: "npx"
      args:
        - "my-custom-mcp-package"
```

Then add to `.vscode/mcp.json`:

```json
{
  "mcpServers": {
    "my-custom-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["my-custom-mcp-package"]
    }
  }
}
```

## Next Steps

1. **Test capabilities**: Try the example workflows above
2. **Explore tools**: Ask Copilot to list available tools from each source
3. **Read documentation**:
   - Desktop Commander: <https://desktopcommander.app/>
   - n8n: <http://localhost:5678> (when running)
4. **Extend registry**: Add custom MCP sources as you install them

## Reference Links

- **Desktop Commander Library**: <https://desktopcommander.app/library/>
- **Desktop Commander GitHub**: <https://github.com/wonderwhy-er/DesktopCommanderMCP>
- **n8n Documentation**: <https://docs.n8n.io/>
- **MCP Specification**: <https://modelcontextprotocol.io/>
- **Prompt Registry Config**: <https://github.com/AmadeusITGroup/prompt-registry-config>
