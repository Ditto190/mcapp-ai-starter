# GenerateAgents.md Integration Plan

**Project**: AI Traceability System + n8n Workflow Automation  
**Date**: March 5, 2026  
**Status**: In Implementation

---

## 📋 Executive Summary

This plan integrates **GenerateAgents.md** (an LLM-powered codebase analyzer) into your n8n automation workspace to automatically generate comprehensive `AGENTS.md` documentation schemas for:

1. **n8n Workflows**: Auto-document workflow patterns, node configurations, and best practices
2. **AI Agents**: Document agent personas, capabilities, and MCP tool integrations
3. **Knowledge Management**: Schema generation for document validation and traceability
4. **n8n-MCP Integration**: Standardized workflow generation guidelines

---

## 🎯 Phase 1: Environment Setup

### 1.1 Project Structure After Integration

```
VSCode_March26/
├── GenerateAgents/                    # NEW: GenerateAgents.md installation
│   ├── src/autogenerateagentsmd/      # Core tool
│   │   ├── cli.py                     # CLI entry point
│   │   ├── model_config.py            # LLM provider config
│   │   ├── signatures.py              # DSPy signatures for analysis
│   │   ├── modules.py                 # DSPy modules & pipeline
│   │   └── utils.py                   # Utilities (clone, tree, compile)
│   ├── projects/                      # Generated AGENTS.md outputs
│   │   ├── n8n-mcp/                  # n8n-MCP agent schema
│   │   ├── n8n-workflows/            # Workflow patterns
│   │   └── agents/                   # Agent persona schemas
│   ├── pyproject.toml                # Dependencies (DSPy, litellm, dspy)
│   ├── .env                          # API keys (Gemini, OpenAI, Anthropic)
│   └── uv.lock                       # Reproducible lock file
│
├── agents/                            # EXISTING: Agent implementations
│   ├── document_manager.py
│   ├── sample_agent.py
│   ├── AGENTS.md                     # AUTO-GENERATED (from GenerateAgents)
│   └── schemas/                      # NEW: Generated schemas
│       ├── workflow_schema.json
│       ├── agent_schema.json
│       └── mcp_tool_schema.json
│
├── Knowledge/                         # EXISTING: Knowledge management
│   ├── observability/
│   │   └── n8n_execution_logger_workflow.json
│   └── schemas/                      # NEW: Generated schemas
│       └── knowledge_schema.md
│
├── n8n-data/                          # EXISTING: n8n workflows
│   └── databases/
│
├── .env                               # UPDATED: New API keys for GenerateAgents
├── package.json                       # EXISTING: n8n dependency
└── pyproject.toml                    # NEW: Python project (agents + GenerateAgents)
```

### 1.2 API Keys Required

Update your `.env` file to include:

```bash
# GenerateAgents.md API Keys
GEMINI_API_KEY="your-gemini-key"        # Optional: Gemini 2.5 Pro (default)
OPENAI_API_KEY="your-openai-key"        # Optional: GPT-5.2
ANTHROPIC_API_KEY="your-anthropic-key"  # Optional: Claude Sonnet 4.6

# n8n Configuration (existing)
DB_TYPE=sqlite
N8N_PROTOCOL=http
N8N_HOST=localhost
N8N_PORT=5678
N8N_USER_DATA_DIR=./n8n-data

# Traceability (existing)
POSTGRESQL_USER=n8n_user
POSTGRESQL_PASSWORD=your_password_here
```

---

## 🔧 Phase 2: Installation & Configuration

### 2.1 Installation Steps

```bash
# Step 1: Clone GenerateAgents.md into your project
cd c:\Users\dylan.a.thomas\Projects\VSCode_March26
git clone https://github.com/originalankur/GenerateAgents.md GenerateAgents
cd GenerateAgents

# Step 2: Install dependencies with uv (fast package manager)
# If uv not installed: curl -LsSf https://astral.sh/uv/install.sh | sh
uv sync --extra dev

# Step 3: Return to project root and verify
cd ..
python -m autogenerateagentsmd --help
```

### 2.2 Configuration File

Create `GenerateAgents/.env`:

```bash
# LLM Provider (use one)
GEMINI_API_KEY=sk-...                 # Primary (fastest, free tier)
OPENAI_API_KEY=sk-...                 # Fallback
ANTHROPIC_API_KEY=sk-...              # Fallback

# Model selection (optional - defaults to Gemini 2.5 Pro)
# AUTOSKILL_MODEL=openai/gpt-5.2       # Override default
# AUTOSKILL_MODEL=anthropic/claude-sonnet-4.6

# Analysis depth (optional)
ANALYSIS_DEPTH=comprehensive           # strict, comprehensive (default), strict
```

---

## 📊 Phase 3: Schema Design for Agent Generation

### 3.1 N8N Workflow Agent Schema

**Purpose**: Auto-generate n8n workflow documentation and validation schemas.

**Generated File**: `projects/n8n-workflows/AGENTS.md`

**Content Structure**:

```markdown
# AGENTS.md — n8n Workflow Patterns

## Project Overview
- Workflow automation platform with 2,709+ templates
- Node-based visual programming model
- Data flow: trigger → processors → outputs
- Error handling via IF nodes

## Tech Stack
- Runtime: Node.js-based n8n
- n8n-MCP: Model Context Protocol server
- Execution: SQLite/PostgreSQL backend
- Validation: JSON Schema

## Architecture
- **Workflows**: Visual DAGs with nodes and connections
- **Nodes**: Pre-built integrations (HTTP, Slack, Webhook, etc.)
- **Data Flow**: $json output → next node input
- **Error Routes**: IF node branching for error handling

## Code Style
- Explicit parameters (no defaults)
- IF node routing for error paths
- Expression syntax: $json, $node["Name"].json
- Connection format: source → target routing

## Testing Commands
- Validate: mcp_n8n-mcp_validate_workflow
- Search: mcp_n8n-mcp_search_templates
- Deploy: mcp_n8n-mcp_n8n_deploy_template

## Agent Workflow / SOP
1. Search templates first: search_templates for 90% of use cases
2. Get node details: get_node for configuration
3. Validate early: validate_node in "minimal" mode
4. Build explicitly: Set ALL parameters
5. Test: validate_workflow before deployment

## Few-Shot Examples
...
```

### 3.2 Agents Schema

**Purpose**: Document your agent personalities, MCP tools, and interaction patterns.

**Generated File**: `projects/agents/AGENTS.md`

**Schema Example for Your Agents**:

```markdown
# AGENTS.md — VSCode_March26 Agents

## Agent Personas

### 1. Document Manager Agent
- **Role**: Manages knowledge base documents
- **MCP Tools**: file operations, search, versioning
- **Capabilities**: Document registration, change tracking
- **Integration**: PostgreSQL audit tables

### 2. Workflow Observer Agent
- **Role**: Monitors n8n workflow execution
- **MCP Tools**: n8n-mcp tools, query API
- **Capabilities**: Execution logging, error detection
- **Integration**: SQLite/PostgreSQL backend

### 3. Traceability Agent
- **Role**: Links AI execution with knowledge & workflows
- **MCP Tools**: Database operations, span creation
- **Capabilities**: Cross-domain linking, trace reporting
- **Integration**: OpenTelemetry spans

## MCP Tool Integration
- mcp_n8n-mcp_*: Workflow management
- file operations: Document handling
- Database queries: PostgreSQL/SQLite

...
```

### 3.3 Knowledge Schema

**Purpose**: Auto-generate validation schemas for knowledge management.

**Generated File**: `Knowledge/schemas/knowledge_schema.md`

**Contents**:

```json
{
  "document_types": [
    {
      "type": "workflow_blueprint",
      "required_fields": ["name", "trigger", "nodes", "connections"],
      "validation_rules": "Must have valid node types from n8n-mcp",
      "generated_by": "GenerateAgents"
    },
    {
      "type": "agent_profile",
      "required_fields": ["name", "role", "mcp_tools", "capabilities"],
      "validation_rules": "Role must match predefined personas",
      "generated_by": "GenerateAgents"
    }
  ]
}
```

---

## 🔗 Phase 4: n8n-MCP Integration

### 4.1 Workflow Generation Schema

Use GenerateAgents output to auto-generate n8n workflow node configurations:

```python
# agents/workflow_generator.py (NEW)

from GenerateAgents.src.autogenerateagentsmd.signatures import ExtractAgentsSections
import dspy

class WorkflowFromAgentsSchema(dspy.Signature):
    """Generate n8n workflow config from AGENTS.md schema"""
    agents_schema: str = dspy.InputField(desc="AGENTS.md content")
    workflow_json: str = dspy.OutputField(
        desc="n8n workflow JSON with nodes and connections"
    )

# Usage:
# 1. Generate AGENTS.md for existing code
# 2. Parse it to extract workflow requirements
# 3. Use mcp_n8n-mcp_n8n_create_workflow to deploy
```

### 4.2 Validation Pipeline

```
AGENTS.md Output
    ↓
Extract N8N Requirements
    ↓
Build Workflow JSON
    ↓
mcp_n8n-mcp_validate_workflow
    ↓
Auto-fix (optional)
    ↓
Deploy: mcp_n8n-mcp_n8n_deploy_template
```

---

## 📝 Phase 5: Documentation & Operations

### 5.1 Generated Outputs Structure

After running `uv run autogenerateagentsmd`:

```
GenerateAgents/projects/
├── n8n-workflows/
│   ├── AGENTS.md                    # Comprehensive workflow guide
│   ├── AGENTS_strict.md             # Strict rules only
│   └── schemas/
│       ├── node_schema.json
│       ├── workflow_schema.json
│       └── error_handling_schema.json
│
├── agents/
│   ├── AGENTS.md                    # Agent personas and MCP tools
│   ├── agent_schema.json            # Structured agent definitions
│   └── mcp_mappings.json            # Tool-to-MCP mappings
│
└── knowledge/
    ├── AGENTS.md                    # Knowledge mgmt best practices
    └── validation_schema.json        # Document validation rules
```

### 5.2 Running GenerateAgents

```bash
# Analyze local repository (your agents/)
uv run autogenerateagentsmd .

# Analyze public GitHub repo
uv run autogenerateagentsmd --github-repository https://github.com/originalankur/n8n-mcp

# With specific model
uv run autogenerateagentsmd --model openai/gpt-5.2 .

# Output formats
uv run autogenerateagentsmd --output-style strict .      # Strict rules
uv run autogenerateagentsmd --output-style comprehensive . # Full guide
```

---

## 🎯 Phase 6: Integration Workflow

### 6.1 Recommended Workflow

```
1. Create new agent/workflow
   ↓
2. Implement code in agents/ or n8n-data/
   ↓
3. Run: uv run autogenerateagentsmd ./agents/
   ↓
4. AGENTS.md auto-generated in GenerateAgents/projects/agents/
   ↓
5. Review and refine schema
   ↓
6. Deploy workflow via mcp_n8n-mcp_n8n_create_workflow
   ↓
7. Link to knowledge base via document_manager agent
   ↓
8. Log execution via tracing_config.py
```

### 6.2 CI/CD Integration (Future)

```bash
# .github/workflows/generate-agents.yml
name: Generate Agent Documentation

on: push

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup uv
        run: curl -LsSf https://astral.sh/uv/install.sh | sh
      - name: Generate AGENTS.md
        run: uv run autogenerateagentsmd .
      - name: Validate schemas
        run: python scripts/validate_schemas.py
      - name: Commit & Push
        run: git add -A && git commit -m "Auto-generate AGENTS.md" || true
```

---

## 🛠️ Phase 7: Troubleshooting & Maintenance

### 7.1 Common Issues

| Issue | Solution |
|-------|----------|
| `ModuleNotFoundError: dspy` | Run `uv sync --extra dev` in GenerateAgents/ |
| API key not found | Ensure `.env` in GenerateAgents/ has API keys |
| Workflow validation fails | Use `mcp_n8n-mcp_validate_workflow` to debug |
| Schema mismatch | Regenerate with `--output-style strict` |

### 7.2 Regular Maintenance

```bash
# Monthly: Update schemas as codebase evolves
uv run autogenerateagentsmd --force-refresh ./agents/

# Quarterly: Validate against n8n-mcp tool changes
uv run autogenerateagentsmd --github-repository https://github.com/n8n-io/n8n-mcp

# Yearly: Review and audit all agent personas
python scripts/audit_agents.py
```

---

## 📚 Appendix: Resource Links

- **GenerateAgents.md Repo**: https://github.com/originalankur/GenerateAgents.md
- **DSPy Docs**: https://github.com/stanfordnlp/dspy
- **n8n-MCP Integration**: https://github.com/n8n-io/n8n-mcp
- **LiteLLM Docs**: https://docs.litellm.ai
- **Context7**: https://context7.io (for documentation lookup)

---

## ✅ Next Steps

1. **Install GenerateAgents** (Phase 2)
2. **Configure API keys** (Phase 2.2)
3. **Generate initial schemas** (Phase 5.2)
4. **Integrate with n8n workflows** (Phase 4)
5. **Document operations** (Phase 5)
6. **Set up CI/CD** (Phase 6.2, optional)

---

**Status**: Ready for Phase 2 installation  
**Owner**: Dylan  
**Last Updated**: March 5, 2026
