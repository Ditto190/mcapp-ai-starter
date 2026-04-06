# Agent Installation & Validation Guide

Complete guide to installing, validating, and using GitHub Copilot agents in VSCode March26 workspace.

## ✅ Installation Complete

### What Was Installed

1. **Custom Workspace Agents** (4 agents in `.github/agents/`):
   - `task-planner.agent.md` - Feature breakdown and task planning
   - `python-mcp-expert.agent.md` - Python MCP server development
   - `typescript-mcp-expert.agent.md` - TypeScript MCP server development
   - `n8n-workflow-expert.agent.md` - n8n workflow automation

2. **Collection Manifest** (`Knowledge/collections/vscode-march26-workspace.collection.yml`):
   - Registers all 4 agents
   - Tagged for discovery: n8n, mcp, workflow-automation, typescript, python
   - Featured collection

3. **Dynamic Discovery System** (`Knowledge/tools/collection_builder.py`):
   - Pattern matching engine (no LLMs)
   - Schema parser for generating agents
   - Collection generator

## 🧪 Validation Steps

### Step 1: Verify Files Created

```powershell
# Check agents directory
Get-ChildItem .github/agents/*.agent.md

# Expected output:
# n8n-workflow-expert.agent.md
# python-mcp-expert.agent.md
# task-planner.agent.md
# typescript-mcp-expert.agent.md

# Check collection
Get-Content Knowledge/collections/vscode-march26-workspace.collection.yml
```

### Step 2: Validate Agent Frontmatter

Run validation script:

```powershell
python -c "
import yaml
from pathlib import Path

agents_dir = Path('.github/agents')
errors = []

for agent_file in agents_dir.glob('*.agent.md'):
    content = agent_file.read_text()
    
    # Check YAML frontmatter
    if not content.startswith('---'):
        errors.append(f'{agent_file.name}: Missing YAML frontmatter')
        continue
    
    try:
        _, frontmatter, body = content.split('---', 2)
        metadata = yaml.safe_load(frontmatter)
        
        # Check required fields
        if 'description' not in metadata:
            errors.append(f'{agent_file.name}: Missing description')
        if 'model' not in metadata:
            errors.append(f'{agent_file.name}: Missing model')
        
        print(f'✅ {agent_file.name}')
        print(f'   Description: {metadata.get(\"description\", \"N/A\")[:60]}...')
        print(f'   Model: {metadata.get(\"model\", \"N/A\")}')
        print()
    except Exception as e:
        errors.append(f'{agent_file.name}: {str(e)}')

if errors:
    print('\\n❌ ERRORS:')
    for error in errors:
        print(f'  - {error}')
else:
    print('\\n✅ All agents valid!')
"
```

### Step 3: Test in VSCode Copilot

1. **Open Copilot Chat**:
   - Press `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Shift+I` (Mac)
   - Or click the Copilot icon in the sidebar

2. **Check Agent Discovery**:
   - Type `@` in the chat input
   - Your agents should appear in the dropdown:
     - `@task-planner`
     - `@python-mcp-expert`
     - `@typescript-mcp-expert`
     - `@n8n-workflow-expert`

3. **Test Agent Invocation**:
   ```
   @task-planner Help me plan the PostgreSQL migration
   ```

   Expected: Agent responds with task breakdown

### Step 4: Validate Collection Schema

```powershell
python -c "
import yaml
from pathlib import Path

collection_file = Path('Knowledge/collections/vscode-march26-workspace.collection.yml')
collection = yaml.safe_load(collection_file.read_text())

# Check required fields
required_fields = ['id', 'name', 'description', 'items']
missing = [field for field in required_fields if field not in collection]

if missing:
    print(f'❌ Missing fields: {missing}')
else:
    print('✅ Collection schema valid')
    print(f'   ID: {collection[\"id\"]}')
    print(f'   Name: {collection[\"name\"]}')
    print(f'   Items: {len(collection[\"items\"])} agents')
    print(f'   Tags: {collection.get(\"tags\", [])}')
"
```

## 🔍 Troubleshooting

### Agents Not Appearing in VSCode

**Problem**: Agents don't show up in `@` dropdown

**Solutions**:
1. **Reload VSCode**: 
   ```
   Ctrl+Shift+P → "Developer: Reload Window"
   ```

2. **Check Copilot Status**:
   ```
   Ctrl+Shift+P → "GitHub Copilot: Check Status"
   ```

3. **Verify File Location**:
   - Agents MUST be in `.github/agents/` at workspace root
   - Files MUST end with `.agent.md`
   - Frontmatter MUST be valid YAML

4. **Check VSCode Settings**:
   - Open Settings (`Ctrl+,`)
   - Search for "Copilot Agent"
   - Ensure agent features are enabled

### Invalid YAML Frontmatter

**Problem**: Agent file has syntax errors

**Solution**:
```powershell
# Validate YAML syntax
python -c "
import yaml
from pathlib import Path

agent_file = Path('.github/agents/task-planner.agent.md')
content = agent_file.read_text()
_, frontmatter, _ = content.split('---', 2)

try:
    yaml.safe_load(frontmatter)
    print('✅ YAML valid')
except yaml.YAMLError as e:
    print(f'❌ YAML error: {e}')
"
```

### Agent Not Responding

**Problem**: Agent invoked but doesn't respond

**Solutions**:
1. Check model availability: Ensure `gpt-4o` is accessible
2. Check instructions: Ensure markdown body is complete
3. Check Copilot logs: `Ctrl+Shift+P → "GitHub Copilot: Show Output"`

## 🚀 Using Agents

### Example 1: Task Planning

```
@task-planner I need to add authentication to n8n workflows. 
What tasks should I create?
```

**Expected Response**:
- Task breakdown with dependencies
- Acceptance criteria for each task
- Risk assessment
- Implementation order

### Example 2: Python MCP Development

```
@python-mcp-expert How do I create a FastMCP tool that 
reads from PostgreSQL?
```

**Expected Response**:
- FastMCP decorator usage
- Database connection pattern
- Error handling
- Example code

### Example 3: TypeScript MCP Development

```
@typescript-mcp-expert Add a new tool to n8n-mcp 
for workflow analytics
```

**Expected Response**:
- Tool registration pattern
- Type definitions
- Handler implementation
- Testing approach

### Example 4: n8n Workflow Design

```
@n8n-workflow-expert Design a workflow that monitors 
GitHub issues and creates Slack alerts
```

**Expected Response**:
- Workflow diagram/description
- Node configuration
- Data mapping
- Error handling strategy

## 📦 Installing awesome-copilot Collections

### Recommended Collections for This Workspace

Based on your n8n automation project, install these collections:

#### 1. Project Planning & Management

**Collection ID**: `project-planning`

**Agents**:
- task-planner
- task-researcher
- planner
- prd
- implementation-plan
- research-technical-spike

**Install**: Visit [awesome-copilot](https://github.com/github/awesome-copilot) and follow collection installation guide

#### 2. TypeScript MCP Development

**Collection ID**: `typescript-mcp-development`

**Agents**:
- typescript-mcp-expert

**Instructions**:
- typescript-mcp-server

**Install**: Same as above

#### 3. Python MCP Development

**Collection ID**: `python-mcp-development`

**Agents**:
- python-mcp-expert

**Instructions**:
- python-mcp-server

**Install**: Same as above

#### 4. DevOps On-Call

**Collection ID**: `devops-oncall`

**Agents**:
- azure-principal-architect

**Prompts**:
- azure-resource-health-diagnose
- multi-stage-dockerfile

**Install**: Same as above

## 🌟 Using Dynamic Discovery

The workspace includes a template-based dynamic discovery system (zero LLM costs):

### Quick Discovery

```
@workspace /dynamic-agent-discovery.prompt.md I need help with API testing
```

**System**:
1. Extracts keywords: ["api", "testing"]
2. Matches to collections: api-dev, testing-automation
3. Returns relevant agents from awesome-copilot
4. Provides install links

### Pattern Matching

Edit `Knowledge/tools/collection_builder.py` to customize domain patterns:

```python
domain_patterns = {
    'web-dev': ['web', 'frontend', 'react', 'vue', 'api'],
    'devops': ['devops', 'ci/cd', 'kubernetes', 'docker'],
    'data-science': ['data', 'ml', 'ai', 'analytics'],
    'testing': ['test', 'qa', 'automation'],
    'n8n': ['n8n', 'workflow', 'automation', 'integration']  # Custom pattern
}
```

## 📋 Validation Checklist

- [ ] 4 agent files created in `.github/agents/`
- [ ] Collection manifest created in `Knowledge/collections/`
- [ ] README created in `.github/agents/README.md`
- [ ] Agents visible in VSCode Copilot (`@` dropdown)
- [ ] Test agent invocation successful
- [ ] YAML frontmatter validated
- [ ] Collection schema validated
- [ ] Dynamic discovery system tested

## 🎯 Next Steps

1. **Test All Agents**: Try each agent with sample queries
2. **Customize**: Edit agent instructions to fit your workflow
3. **Expand**: Add more agents for specific domains (e.g., database-expert, security-auditor)
4. **Integrate**: Use agents in daily development workflow
5. **Share**: Contribute successful agents to awesome-copilot registry

## 📚 Documentation Links

- **VSCode Agents**: [.github/agents/README.md](.github/agents/README.md)
- **Dynamic Discovery**: [.github/prompts/dynamic-agent-discovery.prompt.md](.github/prompts/dynamic-agent-discovery.prompt.md)
- **Collection Builder**: [Knowledge/tools/collection_builder.py](Knowledge/tools/collection_builder.py)
- **Quickstart**: [DYNAMIC_DISCOVERY_QUICKSTART.md](DYNAMIC_DISCOVERY_QUICKSTART.md)
- **Implementation**: [DYNAMIC_DISCOVERY_IMPLEMENTATION.md](DYNAMIC_DISCOVERY_IMPLEMENTATION.md)

## ✅ Success Criteria

Your installation is successful when:

1. ✅ Agents appear in VSCode Copilot `@` dropdown
2. ✅ Agents respond to invocations with relevant guidance
3. ✅ Collection manifest validates against schema
4. ✅ Dynamic discovery finds relevant agents from awesome-copilot
5. ✅ All validation scripts pass without errors

---

**Installation Date**: Auto-generated at agent creation  
**Workspace**: VSCode_March26  
**Project**: n8n workflow automation with MCP integration
