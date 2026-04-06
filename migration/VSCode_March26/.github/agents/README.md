# VSCode March26 Workspace Agents

Custom GitHub Copilot agents for n8n workflow automation and MCP development.

## 🤖 Available Agents

### 1. Task Planner (@task-planner)

**Purpose**: Breaks down features into implementation tasks with clear scope and dependencies

**Use when**:

- Planning new features
- Breaking down epics into stories
- Creating implementation roadmaps
- Defining task dependencies

**Example Usage**:

```
@task-planner Help me break down the n8n workflow monitoring feature into tasks
```

---

### 2. Python MCP Expert (@python-mcp-expert)

**Purpose**: Expert in building Model Context Protocol servers with Python and FastMCP

**Use when**:

- Developing Python MCP servers
- Using FastMCP decorators
- Implementing MCP tools, resources, prompts
- Debugging Python MCP issues

**Example Usage**:

```
@python-mcp-expert How do I create a FastMCP tool with file upload support?
```

---

### 3. TypeScript MCP Expert (@typescript-mcp-expert)

**Purpose**: Expert in building Model Context Protocol servers with TypeScript/Node.js

**Use when**:

- Developing TypeScript MCP servers (like n8n-mcp)
- Using official MCP TypeScript SDK
- Implementing type-safe MCP handlers
- Integrating with Node.js ecosystem

**Example Usage**:

```
@typescript-mcp-expert Help me add a new tool to n8n-mcp for workflow validation
```

---

### 4. n8n Workflow Expert (@n8n-workflow-expert)

**Purpose**: Expert in n8n workflow automation and integration

**Use when**:

- Designing n8n workflows
- Configuring n8n nodes
- Debugging workflow execution
- Optimizing workflow performance
- Integrating external APIs

**Example Usage**:

```
@n8n-workflow-expert How do I handle errors in an n8n webhook workflow?
```

## 📦 Installation

### Automatic Discovery (Recommended)

If you have this repository open in VSCode with GitHub Copilot, the agents should automatically be discovered from the `.github/agents/` directory. No additional installation needed!

### Manual Verification

1. Open VSCode with GitHub Copilot
2. Open Copilot Chat (Ctrl+Shift+I or Cmd+Shift+I)
3. Type `@` to see available agents
4. Your custom agents should appear in the list

### Troubleshooting

If agents don't appear:

1. **Reload VSCode**: Close and reopen VSCode
2. **Check Copilot Status**: Ensure GitHub Copilot is signed in
3. **Check File Location**: Agents must be in `.github/agents/` directory
4. **Check File Extension**: Files must end with `.agent.md`
5. **Check Frontmatter**: YAML frontmatter must be valid

## 🎯 Agent Collection

This workspace includes a collection manifest at:

```
Knowledge/collections/vscode-march26-workspace.collection.yml
```

The collection includes:

- **ID**: `vscode-march26-workspace`
- **Name**: VSCode March26 Workspace Agents
- **Tags**: n8n, mcp, workflow-automation, typescript, python

## 🔗 Integration with awesome-copilot

These agents follow the [awesome-copilot](https://github.com/github/awesome-copilot) patterns:

- YAML frontmatter with description and model
- Markdown body with instructions
- Compatible with collection schemas
- Ready for awesome-copilot registry

## 📚 Related Collections

Based on your n8n automation project, these awesome-copilot collections are also recommended:

1. **project-planning** - Task planning, PRDs, implementation plans
   - Agents: task-planner, task-researcher, planner, prd, implementation-plan

2. **typescript-mcp-development** - MCP server development in TypeScript
   - Agents: typescript-mcp-expert
   - Instructions: typescript-mcp-server
   - Prompts: typescript-mcp-server-generator

3. **python-mcp-development** - MCP server development in Python
   - Agents: python-mcp-expert
   - Instructions: python-mcp-server
   - Prompts: python-mcp-server-generator

4. **devops-oncall** - DevOps workflows and incident response
   - Agents: azure-principal-architect
   - Prompts: azure-resource-health-diagnose, multi-stage-dockerfile

5. **azure-cloud-development** - Azure deployment and infrastructure
   - Agents: azure-principal-architect, azure-saas-architect
   - Instructions: bicep, terraform, azure-devops-pipelines

## 🧪 Testing Agents

### Test 1: Task Planner

```
@task-planner Create an implementation plan for adding PostgreSQL support to n8n-data
```

### Test 2: Python MCP Expert

```
@python-mcp-expert Show me how to create a FastMCP tool that queries a database
```

### Test 3: TypeScript MCP Expert

```
@typescript-mcp-expert How do I add error handling to n8n-mcp tools?
```

### Test 4: n8n Workflow Expert

```
@n8n-workflow-expert Design a workflow that processes GitHub webhooks and sends Slack notifications
```

## 📝 Agent File Structure

Each agent follows this structure:

```markdown
---
description: "Brief agent description"
model: gpt-4o
tools:
  - optional-mcp-tool-name
---

# Agent Name

Agent instructions in markdown format...

## Sections

- Role definition
- Key capabilities
- Usage patterns
```

## 🚀 Next Steps

1. **Test Agents**: Open Copilot Chat and try each agent
2. **Customize**: Edit agent files to refine behaviors
3. **Expand**: Add more agents for specific domains
4. **Share**: Contribute agents to awesome-copilot registry

## 📖 Documentation

- [GitHub Copilot Agents Documentation](https://docs.github.com/en/copilot/using-github-copilot/using-extensions-to-integrate-external-tools-with-copilot-chat)
- [awesome-copilot Repository](https://github.com/github/awesome-copilot)
- [MCP Documentation](https://modelcontextprotocol.io/)
- [n8n Documentation](https://docs.n8n.io/)

## 🤝 Contributing

To add new agents:

1. Create `.agent.md` file in `.github/agents/`
2. Add YAML frontmatter with `description` and `model`
3. Write agent instructions in markdown
4. Update the collection manifest in `Knowledge/collections/`
5. Test in VSCode Copilot Chat

## 📄 License

These agents are part of the VSCode_March26 workspace and follow the workspace license.
