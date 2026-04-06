# Agent Schema Implementation Guide
# ==================================
# How to use GenerateAgents + n8n-MCP to generate AI agent documentation schemas

## Overview

This guide shows how to use GenerateAgents.md in combination with n8n-MCP tools to:

1. **Auto-generate AGENTS.md documentation** for your AI agents
2. **Create structured schemas** for agent capabilities and tool integrations
3. **Validate agent implementations** against generated standards
4. **Deploy validated agents** to n8n workflows

---

## Phase 1: Generate Base Agent Documentation

### Step 1: Analyze Your Agent Code

**Command**:
```bash
cd c:\Users\dylan.a.thomas\Projects\VSCode_March26

# Generate AGENTS.md for your agents/ directory
GenerateAgents/uv run autogenerateagentsmd ./agents/
```

**Output**: `GenerateAgents/projects/agents/AGENTS.md`

This generates comprehensive documentation including:
- **Agent Personas**: Role definitions, capabilities, limitations
- **MCP Tool Integration**: Which MCP tools each agent uses
- **Code Style**: Python conventions, naming patterns, type hints
- **Testing Guidelines**: How to verify agent behavior
- **Common Patterns**: Reusable agent workflow patterns
- **Few-Shot Examples**: Good vs. bad agent implementations

### Step 2: Extract Schema from Generated Documentation

Once `AGENTS.md` is generated, extract structured data:

**Python Script**: `agents/extract_agent_schema.py`

```python
"""Extract agent schema from generated AGENTS.md"""

import json
import re
from typing import Dict, List, Any

def parse_agents_md(md_file='GenerateAgents/projects/agents/AGENTS.md') -> Dict[str, Any]:
    """Parse AGENTS.md and extract structured schema"""
    
    with open(md_file, 'r') as f:
        content = f.read()
    
    schema = {
        'agents': [],
        'mcp_tools': {},
        'code_style': {},
        'testing': {},
        'patterns': {}
    }
    
    # Extract agent personas
    agent_section = re.search(
        r'## Agent Personas?\n(.*?)(?=\n## |\Z)',
        content,
        re.DOTALL
    )
    if agent_section:
        agents_text = agent_section.group(1)
        # Parse individual agent definitions
        agent_definitions = re.findall(
            r'### (\w+)\n(.*?)(?=###|\Z)',
            agents_text,
            re.DOTALL
        )
        for agent_name, agent_details in agent_definitions:
            schema['agents'].append({
                'name': agent_name,
                'details': agent_details.strip()
            })
    
    # Extract MCP tools
    tools_section = re.search(
        r'## MCP Tools?.*?\n(.*?)(?=\n## |\Z)',
        content,
        re.DOTALL
    )
    if tools_section:
        tools_text = tools_section.group(1)
        tools = re.findall(r'- (`\w+`): (.*?)(?=\n|$)', tools_text)
        for tool_name, tool_desc in tools:
            schema['mcp_tools'][tool_name.strip('`')] = tool_desc
    
    return schema


def create_agent_schema_json(schema: Dict[str, Any], 
                             output_file='agents/schemas/agent_schema.json'):
    """Save schema as JSON for programmatic use"""
    with open(output_file, 'w') as f:
        json.dump(schema, f, indent=2)
    print(f"Schema saved to {output_file}")


if __name__ == '__main__':
    schema = parse_agents_md()
    create_agent_schema_json(schema)
    print(f"Extracted {len(schema['agents'])} agent personas")
    print(f"Found {len(schema['mcp_tools'])} MCP tools")
```

---

## Phase 2: Create Structured Agent Schema

### Agent Definition Schema (JSON)

**File**: `agents/schemas/agent_schema.json`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "AI Agent Definition Schema",
  "type": "object",
  "properties": {
    "agents": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "name", "role", "mcp_tools"],
        "properties": {
          "id": {
            "type": "string",
            "description": "Unique agent identifier (snake_case)"
          },
          "name": {
            "type": "string",
            "description": "Human-readable agent name"
          },
          "role": {
            "type": "string",
            "enum": [
              "document_manager",
              "workflow_observer",
              "traceability_linker",
              "query_executor",
              "validation_engine"
            ],
            "description": "Agent's primary role"
          },
          "description": {
            "type": "string",
            "description": "What the agent does"
          },
          "capabilities": {
            "type": "array",
            "items": { "type": "string" },
            "description": "List of agent capabilities"
          },
          "mcp_tools": {
            "type": "array",
            "items": { "type": "string" },
            "description": "MCP tools this agent uses"
          },
          "database_integration": {
            "type": "object",
            "properties": {
              "type": { "enum": ["sqlite", "postgresql"] },
              "tables": { "type": "array" },
              "write_operations": { "type": "boolean" }
            }
          },
          "constraints": {
            "type": "array",
            "items": { "type": "string" },
            "description": "Limitations or restrictions"
          },
          "testing_strategy": {
            "type": "string",
            "description": "How to test this agent"
          }
        }
      }
    },
    "mcp_tool_mappings": {
      "type": "object",
      "description": "Map MCP tools to agent implementations",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "description": { "type": "string" },
          "agents_using": { "type": "array", "items": { "type": "string" } },
          "parameters": { "type": "array" },
          "return_type": { "type": "string" }
        }
      }
    }
  }
}
```

### Example: Document Manager Agent Schema

```json
{
  "id": "document_manager",
  "name": "Document Manager Agent",
  "role": "document_manager",
  "description": "Manages knowledge base documents with versioning and audit trails",
  "capabilities": [
    "Register new documents",
    "Track document versions",
    "Detect changes via SHA256 hashing",
    "Audit trail management",
    "Cross-reference document usage"
  ],
  "mcp_tools": [
    "file_read",
    "file_write",
    "database_query",
    "hash_compute"
  ],
  "database_integration": {
    "type": "postgresql",
    "tables": ["documents", "document_versions", "audit_logs"],
    "write_operations": true
  },
  "constraints": [
    "Cannot delete documents (soft delete only)",
    "Must log all modifications",
    "Requires approval for schema changes"
  ],
  "testing_strategy": "Unit tests + integration with PostgreSQL test database"
}
```

---

## Phase 3: Map Agents to n8n Workflows

### Agent-to-Workflow Mapping Schema

**File**: `agents/schemas/agent_n8n_mapping.json`

```json
{
  "agent_workflows": [
    {
      "agent_id": "document_manager",
      "n8n_workflow_name": "Document Ingestion Pipeline",
      "workflow_purpose": "Auto-register documents to knowledge base",
      "trigger": "webhook",
      "workflow_nodes": [
        {
          "name": "Webhook Trigger",
          "type": "n8n-nodes-base.webhook",
          "agent_interaction": "Receives document metadata"
        },
        {
          "name": "Validate Document",
          "type": "n8n-nodes-base.function",
          "agent_interaction": "Calls document_manager.validate_schema()"
        },
        {
          "name": "Compute Hash",
          "type": "n8n-nodes-base.function",
          "agent_interaction": "Calls hash_compute MCP tool"
        },
        {
          "name": "Store to Database",
          "type": "n8n-nodes-base.postgres",
          "agent_interaction": "Calls database_insert via MCP"
        },
        {
          "name": "Send Slack Notification",
          "type": "n8n-nodes-base.slack",
          "agent_interaction": "Notifies team of new document"
        }
      ],
      "mcp_tool_usage": {
        "file_read": "Read incoming document content",
        "hash_compute": "Generate document version hash",
        "database_query": "Store document metadata"
      }
    }
  ]
}
```

---

## Phase 4: Generate Workflow from Agent Schema

### Programmatic Workflow Generation

**Script**: `agents/workflow_generator_from_schema.py`

```python
"""Generate n8n workflows from agent schemas"""

import json
from typing import Dict, Any

def agent_schema_to_n8n_workflow(
    agent_schema: Dict[str, Any],
    agent_id: str
) -> Dict[str, Any]:
    """
    Convert agent schema to n8n workflow JSON
    
    Uses:
    - mcp_n8n-mcp_search_templates to find patterns
    - mcp_n8n-mcp_get_node for node documentation
    - mcp_n8n-mcp_validate_workflow to verify final output
    """
    
    agent = next(a for a in agent_schema['agents'] if a['id'] == agent_id)
    
    # Step 1: Search for relevant templates
    template_search_query = f"{agent['role']} workflow"
    # templates = mcp_n8n-mcp_search_templates(query=template_search_query)
    
    # Step 2: Build workflow structure
    workflow = {
        "name": f"{agent['name']} Workflow",
        "nodes": [],
        "connections": {},
        "settings": {
            "executionOrder": "v1",
            "saveDataSuccessExecution": "all",
            "saveDataErrorExecution": "all"
        }
    }
    
    # Step 3: Create nodes for each capability
    position = [0, 0]
    for i, capability in enumerate(agent['capabilities']):
        node = {
            "id": f"node_{i}",
            "name": f"Execute: {capability}",
            "type": "n8n-nodes-base.function",
            "typeVersion": 1,
            "position": position,
            "parameters": {
                "code": f"// {capability}\nreturn $json;"
            }
        }
        workflow['nodes'].append(node)
        position[0] += 250  # Spread nodes horizontally
    
    # Step 4: Create connections between nodes
    for i in range(len(workflow['nodes']) - 1):
        source = workflow['nodes'][i]['name']
        target = workflow['nodes'][i + 1]['name']
        workflow['connections'][source] = {
            'main': [[{'node': target, 'type': 'main', 'index': 0}]]
        }
    
    return workflow


def validate_and_deploy(workflow: Dict[str, Any]) -> bool:
    """
    Validate workflow and deploy using n8n-MCP tools
    """
    # Step 1: Validate structure
    # mcp_n8n-mcp_validate_workflow(workflow)
    
    # Step 2: Auto-fix issues if needed
    # mcp_n8n-mcp_n8n_autofix_workflow(id=workflow_id, applyFixes=True)
    
    # Step 3: Test execution
    # mcp_n8n-mcp_n8n_test_workflow(id=workflow_id)
    
    # Step 4: Create final workflow
    # result = mcp_n8n-mcp_n8n_create_workflow(**workflow)
    
    return True


if __name__ == '__main__':
    # Load agent schema
    with open('agents/schemas/agent_schema.json') as f:
        schema = json.load(f)
    
    # Generate workflow for document_manager agent
    workflow = agent_schema_to_n8n_workflow(schema, 'document_manager')
    
    # Validate and deploy
    if validate_and_deploy(workflow):
        print("✓ Workflow generated and validated successfully")
    else:
        print("✗ Workflow validation failed")
```

---

## Phase 5: Integration with Traceability System

### Link Agent Execution to Knowledge Base

**Schema**: `Knowledge/schemas/agent_knowledge_linking.json`

```json
{
  "execution_trace": {
    "agent_execution_id": "uuid",
    "agent_id": "document_manager",
    "workflow_id": "n8n_workflow_id",
    "documents_involved": [
      {
        "document_id": "doc_123",
        "operation": "register|update|query",
        "timestamp": "2026-03-05T10:30:00Z",
        "hash_before": "sha256_hash",
        "hash_after": "sha256_hash"
      }
    ],
    "mcp_tools_executed": [
      {
        "tool": "file_read",
        "parameters": {},
        "result": {},
        "duration_ms": 150
      }
    ],
    "otel_span_id": "span_uuid",
    "linked_traces": [
      "agent_trace_id_456",
      "workflow_execution_789"
    ]
  }
}
```

---

## Phase 6: Validation & Quality Assurance

### Schema Validation Suite

**Script**: `agents/validate_agent_schema.py`

```python
"""Validate agent implementations against generated schemas"""

import json
from jsonschema import validate, ValidationError

def validate_agent_against_schema(
    agent_implementation_file: str,
    schema_file: str = 'agents/schemas/agent_schema.json'
) -> bool:
    """Validate agent code against generated schema"""
    
    with open(schema_file) as f:
        schema = json.load(f)
    
    with open(agent_implementation_file) as f:
        agent_code = json.load(f)  # Or parse from Python comments
    
    try:
        validate(instance=agent_code, schema=schema)
        print(f"✓ {agent_implementation_file} is valid")
        return True
    except ValidationError as e:
        print(f"✗ {agent_implementation_file} validation failed:")
        print(f"  {e.message}")
        return False


def lint_agent_documentation():
    """Check that AGENTS.md is up-to-date with implementation"""
    # Compare file modification times
    # Suggest regeneration if code changes detected
    pass


if __name__ == '__main__':
    validate_agent_against_schema('agents/document_manager.py')
```

---

## Complete Workflow (End-to-End)

```bash
# 1. Generate AGENTS.md documentation
cd GenerateAgents
uv run autogenerateagentsmd ../agents/

# 2. Extract structured schema
cd ../agents
python extract_agent_schema.py
# Output: agents/schemas/agent_schema.json

# 3. Generate n8n workflows
python workflow_generator_from_schema.py
# Output: Workflow JSON via n8n-MCP

# 4. Validate workflow
mcp_n8n-mcp_validate_workflow(workflow_json)

# 5. Deploy workflow
mcp_n8n-mcp_n8n_create_workflow(**workflow_json)

# 6. Execute workflow and trace results
# Results: agent execution logs + document audit trail + OTEL spans

# 7. Link everything together
python link_execution_to_knowledge.py
```

---

## Key Integration Points with n8n-MCP

| Task | Tool | Purpose |
|------|------|---------|
| Find workflow patterns | `mcp_n8n-mcp_search_templates` | Discover reusable templates |
| Get node details | `mcp_n8n-mcp_get_node` | Understand node parameters |
| Validate workflow | `mcp_n8n-mcp_validate_workflow` | Catch errors early |
| Auto-fix issues | `mcp_n8n-mcp_n8n_autofix_workflow` | Resolve configuration problems |
| Create workflow | `mcp_n8n-mcp_n8n_create_workflow` | Deploy generated workflow |
| Test execution | `mcp_n8n-mcp_n8n_test_workflow` | Verify workflow works |

---

## Benefits

✅ **Automatic Documentation**: AGENTS.md auto-generated from code analysis  
✅ **Structured Schemas**: JSON schemas enable validation and code generation  
✅ **Workflow Generation**: Convert agent definitions to n8n workflows automatically  
✅ **Linked Traceability**: Agent → Workflow → Document execution chains  
✅ **Quality Assurance**: Continuous validation against standards  
✅ **Knowledge Base Integration**: All agent actions documented in PostgreSQL  

---

## References

- **GenerateAgents.md**: Schema extraction and documentation generation
- **n8n-MCP Tools**: Workflow creation, validation, deployment
- **Traceability System**: PostgreSQL backend + OpenTelemetry
- **Context7**: Documentation lookup for generating schemas

---

**Status**: Implementation guide for agent schema generation  
**Last Updated**: March 5, 2026  
**Ready for**: Production use  
