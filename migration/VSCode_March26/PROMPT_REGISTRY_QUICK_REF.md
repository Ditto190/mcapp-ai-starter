# Prompt Registry - Quick Reference Card

## What Is Prompt Registry?

**Think of it as a PHONE BOOK for your MCP tools**

- 📖 **Documentation**: Lists what MCP tools are installed
- 🔍 **Discovery**: Shows capabilities each tool provides  
- 🔗 **Integration**: Links to MCP server configurations
- 📋 **Reference**: Quick lookup for capabilities and commands

## Your Current Setup

### File Location

```
📁 VSCode_March26/
  └── prompt-registry.yaml  ← Your MCP catalog
  └── .vscode/
      └── mcp.json         ← Actual MCP server config
```

### Two Sources Registered

#### 1. Desktop Commander

```yaml
id: desktop-commander
package: @wonderwhy-er/desktop-commander
capabilities:
  - file_management       # Read/write/list files
  - terminal_commands     # Execute shell commands
  - system_automation     # OS-level tasks
  - process_control       # Manage processes
  - clipboard_operations  # Clipboard read/write
```

#### 2. n8n MCP

```yaml
id: n8n-mcp
package: n8n-mcp
capabilities:
  - workflow_management   # CRUD workflows
  - template_search       # Find workflow templates
  - node_validation       # Validate node configs
  - workflow_validation   # Validate workflow JSON
```

## How To Use It

### Via Copilot (Recommended)

```markdown
# Ask Copilot natural language questions:

"@workspace What MCP tools do I have available?"
→ Copilot reads prompt-registry.yaml and lists sources

"@workspace Can I automate file operations?"
→ Copilot checks desktop-commander capabilities

"@workspace How do I run terminal commands via MCP?"
→ Copilot references desktop-commander's terminal_commands capability
```

### Via Manual Reference

Open `prompt-registry.yaml` and search for:

- **Capabilities**: What each tool can do
- **Package names**: For installation/updates
- **Documentation URLs**: For detailed guides
- **MCP config**: How to configure in other tools

### Via Extension (If Installed)

1. Check VS Code command palette for "Prompt Registry" commands
2. Extension UI should show registered sources
3. Quick access to capabilities from sidebar/panel

## Practical Examples

### Example 1: File Operations

**Capability**: `file_management` (Desktop Commander)

**What you can do**:

```javascript
// Via Copilot:
"Use Desktop Commander to list all JSON files"
"Use Desktop Commander to read the contents of package.json"
"Use Desktop Commander to create a new file called test.txt"
```

### Example 2: Terminal Automation

**Capability**: `terminal_commands` (Desktop Commander)

**What you can do**:

```javascript
// Via Copilot:
"Use Desktop Commander to run 'npm install'"
"Use Desktop Commander to execute 'git status'"
"Use Desktop Commander to run 'node --version'"
```

### Example 3: Workflow Management

**Capability**: `workflow_management` (n8n MCP)

**What you can do**:

```javascript
// Via Copilot:
"Use n8n MCP to list all my workflows"
"Use n8n MCP to get details about workflow ID 123"
"Use n8n MCP to activate the webhook workflow"
```

### Example 4: Template Discovery

**Capability**: `template_search` (n8n MCP)

**What you can do**:

```javascript
// Via Copilot:
"Use n8n MCP to search for Slack notification templates"
"Use n8n MCP to find webhook integration examples"
"Use n8n MCP to get templates by complexity level 'simple'"
```

## Key Concepts

### Registry ≠ Execution

```
prompt-registry.yaml  → DOCUMENTATION (phone book)
.vscode/mcp.json     → CONFIGURATION (actual connections)
MCP Servers          → EXECUTION (do the work)
```

**Analogy**:

- **Registry** = Restaurant menu (shows what's available)
- **MCP Config** = Phone number (how to reach them)
- **MCP Server** = Restaurant kitchen (makes the food)

### Capabilities = Feature Tags

Think of capabilities as hashtags that help you discover what's possible:

```yaml
#file_management   → File CRUD operations
#terminal_commands → Execute shell commands
#workflow_management → n8n workflow CRUD
#template_search   → Find pre-built workflows
```

## Testing Your Setup

### Test 1: View Registry

```powershell
Get-Content .\prompt-registry.yaml | Select-Object -First 20
# Should see your 2 sources listed
```

### Test 2: Verify MCP Config

```powershell
Get-Content .\.vscode\mcp.json
# Should see matching server configurations
```

### Test 3: Check Package Installation

```powershell
npm list @wonderwhy-er/desktop-commander --depth=0
# Should show version 0.2.38 installed
```

### Test 4: Ask Copilot

```markdown
@workspace What MCP tools are configured in this workspace?
# Copilot should reference prompt-registry.yaml
```

## Updating the Registry

### Add a New MCP Source

1. Install the package:

```powershell
npm install -g new-mcp-server
```

1. Add to `prompt-registry.yaml`:

```yaml
sources:
  - id: "new-mcp-server"
    name: "New MCP Server"
    type: "mcp"
    description: "What it does"
    enabled: true
    package: "new-mcp-server"
    capabilities:
      - capability_1
      - capability_2
    mcp_config:
      type: "stdio"
      command: "npx"
      args:
        - "new-mcp-server"
```

1. Add to `.vscode/mcp.json`:

```json
{
  "mcpServers": {
    "new-mcp-server": {
      "type": "stdio",
      "command": "npx",
      "args": ["new-mcp-server"]
    }
  }
}
```

1. Reload VS Code:

```
Ctrl+Shift+P → "Developer: Reload Window"
```

## Common Questions

### Q: Do I need the prompt-registry extension?

**A**: No! The YAML file is useful documentation even without an extension.

### Q: Can Copilot see my prompt-registry.yaml?

**A**: Yes! It's in the workspace and can be referenced via `@workspace`.

### Q: How do I know what tools Desktop Commander provides?

**A**: Check capabilities in prompt-registry.yaml or visit <https://desktopcommander.app/>

### Q: Why two files (prompt-registry.yaml and mcp.json)?

**A**:

- `prompt-registry.yaml` = Human-readable documentation
- `.vscode/mcp.json` = Machine-readable configuration for MCP clients

### Q: Can I use this with Claude Desktop?

**A**: Yes! Copy `.vscode/mcp.json` content to Claude's config file.

## Next Steps

1. ✅ **You have**: Configured both files (registry + MCP config)
2. ✅ **You can**: Reference capabilities in prompt-registry.yaml
3. 🔄 **Try next**: Ask Copilot to use Desktop Commander or n8n MCP
4. 📖 **Learn more**: See PROMPT_REGISTRY_USAGE_GUIDE.md for detailed examples

## Resources

- **Full usage guide**: [PROMPT_REGISTRY_USAGE_GUIDE.md](PROMPT_REGISTRY_USAGE_GUIDE.md)
- **Integration report**: [DESKTOP_COMMANDER_INTEGRATION_REPORT.md](DESKTOP_COMMANDER_INTEGRATION_REPORT.md)
- **Desktop Commander docs**: <https://desktopcommander.app/>
- **n8n docs**: <https://docs.n8n.io/>
- **MCP specification**: <https://modelcontextprotocol.io/>

---

**TL;DR**: `prompt-registry.yaml` is your MCP tools documentation. Reference it to see what's available, then ask Copilot to use those capabilities!
