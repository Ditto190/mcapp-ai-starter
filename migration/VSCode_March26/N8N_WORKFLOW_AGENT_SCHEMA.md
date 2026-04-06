# n8n Workflow Agent Schema Generator
# ====================================
# Configuration for auto-generating n8n workflow documentation and validation schemas

## Overview

This schema generator uses GenerateAgents.md to automatically produce comprehensive documentation
and validation rules for n8n workflows in your environment.

## Schema Generation Pipeline

```
Input: Existing n8n workflows, patterns, best practices
  ↓
[GenerateAgents.md Analysis]
  ├─ Extract workflow architecture patterns
  ├─ Identify node types and configurations
  ├─ Document data flow and error handling
  └─ Generate reusable schemas
  ↓
Output: JSON/Markdown schemas for validation and generation
```

## Generated Schema Outputs

### 1. Workflow Structure Schema (JSON)

**File**: `GenerateAgents/projects/n8n-workflows/workflow_schema.json`

**Purpose**: Define the valid structure for n8n workflows

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "n8n Workflow Schema",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique workflow identifier"
    },
    "name": {
      "type": "string",
      "description": "Workflow name (human-readable)"
    },
    "nodes": {
      "type": "array",
      "description": "Array of workflow nodes",
      "items": {
        "type": "object",
        "required": ["id", "name", "type", "typeVersion", "position"],
        "properties": {
          "id": { "type": "string" },
          "name": { "type": "string" },
          "type": { "type": "string" },
          "typeVersion": { "type": "number" },
          "position": {
            "type": "array",
            "minItems": 2,
            "maxItems": 2,
            "items": { "type": "number" }
          },
          "parameters": { "type": "object" },
          "credentials": { "type": "object" },
          "disabled": { "type": "boolean" }
        }
      }
    },
    "connections": {
      "type": "object",
      "description": "Node connections (source → targets)",
      "additionalProperties": {
        "type": "object"
      }
    },
    "settings": {
      "type": "object",
      "description": "Workflow-level settings",
      "properties": {
        "executionOrder": { "enum": ["v0", "v1"] },
        "timezone": { "type": "string" },
        "saveDataErrorExecution": { "enum": ["all", "none"] },
        "saveDataSuccessExecution": { "enum": ["all", "none"] }
      }
    }
  },
  "required": ["name", "nodes", "connections"]
}
```

### 2. Node Type Schema

**File**: `GenerateAgents/projects/n8n-workflows/node_types_schema.json`

**Purpose**: Define allowed node types and their required parameters

```json
{
  "nodeTypes": [
    {
      "type": "n8n-nodes-base.webhook",
      "description": "Trigger node: Receive HTTP webhooks",
      "requiredParameters": ["httpMethod", "path"],
      "optionalParameters": ["nodeCredentialType"],
      "exemplaryExpressions": [
        "$json.body",
        "$json.headers['Authorization']"
      ]
    },
    {
      "type": "n8n-nodes-base.httpRequest",
      "description": "HTTP client: Make REST API calls",
      "requiredParameters": ["url", "method"],
      "optionalParameters": ["headers", "body", "authentication"],
      "exemplaryExpressions": [
        "$node[\"Previous\"].json.id",
        "${new Date().toISOString()}"
      ]
    },
    {
      "type": "n8n-nodes-base.slack",
      "description": "Send messages to Slack",
      "requiredParameters": ["resource", "operation", "channel"],
      "optionalParameters": ["text", "blocks"],
      "exemplaryExpressions": [
        "$json.message",
        "$json.timestamp"
      ]
    },
    {
      "type": "n8n-nodes-base.if",
      "description": "Conditional branching",
      "requiredParameters": ["conditions"],
      "optionalParameters": ["combineOperation"],
      "exemplaryExpressions": [
        "$json.status === 'success'",
        "$json.count > 10"
      ]
    },
    {
      "type": "n8n-nodes-base.set",
      "description": "Set/transform field values",
      "requiredParameters": ["values"],
      "optionalParameters": ["keepOnlySet"],
      "exemplaryExpressions": [
        "$json.timestamp | $now",
        "$node[\"Step1\"].json.data | merge($json.override)"
      ]
    },
    {
      "type": "n8n-nodes-base.respondToWebhook",
      "description": "Send HTTP response to webhook",
      "requiredParameters": ["responseCode"],
      "optionalParameters": ["responseBody"],
      "exemplaryExpressions": [
        "{ \"status\": \"ok\", \"data\": $json.result }",
        "$json | with_entries(select(.value != null))"
      ]
    }
  ]
}
```

### 3. Data Flow & Expression Schema

**File**: `GenerateAgents/projects/n8n-workflows/expressions_schema.json`

**Purpose**: Document valid expression patterns for n8n

```json
{
  "expressionPatterns": {
    "accessPreviousNodeOutput": {
      "pattern": "$json.<field>",
      "example": "$json.message",
      "description": "Access output from immediately previous node"
    },
    "accessSpecificNodeOutput": {
      "pattern": "$node[\"<NodeName>\"].json.<field>",
      "example": "$node[\"API Call\"].json.responseCode",
      "description": "Access output from a specific named node"
    },
    "dateTimeExpressions": {
      "pattern": "$now, $now.toISOString(), etc.",
      "example": "$now.toISOString()",
      "description": "Current timestamp functions"
    },
    "conditionalLogic": {
      "pattern": "$json.<field> === <value> || $json.<field> > <number>",
      "example": "$json.status === 'error' || $json.retryCount > 3",
      "description": "Boolean expressions for IF nodes"
    },
    "arrayOperations": {
      "pattern": "$json | map(.<field>), $json | select(.<field>), etc.",
      "example": "$json.items | map(.name) | join(', ')",
      "description": "Array transformation operations"
    }
  },
  "forbiddenPatterns": [
    "Direct file system access",
    "Environment variable injection without sanitization",
    "Raw SQL without parameterization"
  ]
}
```

### 4. Error Handling Schema

**File**: `GenerateAgents/projects/n8n-workflows/error_handling_schema.json`

**Purpose**: Define error handling patterns and recovery flows

```json
{
  "errorHandlingPatterns": [
    {
      "name": "IF Node Error Routing",
      "description": "Route errors using IF node TRUE/FALSE branches",
      "pattern": {
        "triggerNode": "API Call",
        "processNode": "Data Transform",
        "ifNode": "Check Status",
        "errorBranch": "Handle Error",
        "successBranch": "Process Success"
      }
    },
    {
      "name": "Try-Catch with Slack Notification",
      "description": "Catch errors and notify via Slack",
      "pattern": {
        "errorTrigger": "Error Trigger (catch all)",
        "errorNode": "Slack: Send Error"
      }
    },
    {
      "name": "Retry with Exponential Backoff",
      "description": "Retry failed API calls with backoff",
      "pattern": {
        "httpNode": {
          "retryOnFail": true,
          "maxTries": 3,
          "waitBetweenTries": 3000
        },
        "exponentialBackoff": "multiply wait by 2 each retry"
      }
    }
  ]
}
```

### 5. Workflow Templates Catalog

**File**: `GenerateAgents/projects/n8n-workflows/templates_catalog.json`

**Purpose**: Index all validated workflow templates

```json
{
  "templates": [
    {
      "id": "simple-webhook-slack",
      "name": "Webhook to Slack Notification",
      "description": "Receive webhook and send Slack message",
      "nodes": ["Webhook", "Slack"],
      "complexity": "simple",
      "estSetupMinutes": 5,
      "validatedBy": "GenerateAgents",
      "schemaVersion": "1.0"
    },
    {
      "id": "api-polling-error-handler",
      "name": "Poll API with Error Handling",
      "description": "Poll external API and route errors to retry queue",
      "nodes": ["Schedule", "HTTP Request", "IF", "Queue", "Error Slack"],
      "complexity": "medium",
      "estSetupMinutes": 30,
      "validatedBy": "GenerateAgents",
      "schemaVersion": "1.0"
    }
  ]
}
```

## Integration with GenerateAgents

### Command to Generate Schemas

```bash
# From project root
cd GenerateAgents

# Generate comprehensive n8n workflow documentation
uv run autogenerateagentsmd --github-repository https://github.com/n8n-io/n8n --output-style comprehensive

# Generate strict rules only
uv run autogenerateagentsmd --github-repository https://github.com/n8n-io/n8n --output-style strict

# Analyze your local n8n patterns
uv run autogenerateagentsmd ../n8n-data/

# Custom model
uv run autogenerateagentsmd --model openai/gpt-5.2 ../n8n-data/
```

## Schema Validation Workflow

```python
# agents/n8n_schema_validator.py (NEW)
import json
from jsonschema import validate, ValidationError

def validate_workflow(workflow_json):
    """Validate n8n workflow against generated schema"""
    with open('GenerateAgents/projects/n8n-workflows/workflow_schema.json') as f:
        schema = json.load(f)
    
    try:
        validate(instance=workflow_json, schema=schema)
        print("✓ Workflow valid")
        return True
    except ValidationError as e:
        print(f"✗ Validation error: {e.message}")
        # Auto-suggest fixes using mcp_n8n-mcp_n8n_autofix_workflow
        return False
```

## n8n-MCP Integration Points

### 1. Template Search & Generation

```python
# Step 1: Search templates
mcp_n8n-mcp_search_templates(
    searchMode='by_metadata', 
    complexity='simple',
    requiredService='slack'
)

# Step 2: Get template details
mcp_n8n-mcp_get_template(templateId=12345, mode='full')

# Step 3: Build workflow from template
mcp_n8n-mcp_n8n_create_workflow(
    name='My Slack Notifier',
    nodes=[...],
    connections={...}
)
```

### 2. Node Configuration & Validation

```python
# Get node documentation
mcp_n8n-mcp_get_node(
    nodeType='n8n-nodes-base.slack',
    detail='standard',
    includeExamples=True
)

# Validate node config
mcp_n8n-mcp_validate_node(
    nodeType='n8n-nodes-base.slack',
    config={'resource': 'channel', 'operation': 'get'},
    mode='full'
)
```

### 3. Workflow Validation & Deployment

```python
# Validate complete workflow
mcp_n8n-mcp_validate_workflow(workflow)

# Auto-fix issues
mcp_n8n-mcp_n8n_autofix_workflow(
    id='workflow-id',
    applyFixes=True
)

# Deploy
mcp_n8n-mcp_n8n_test_workflow(id='workflow-id')
```

## Best Practices

### Schema Maintenance

- **Monthly**: Regenerate schemas as n8n updates its nodes
- **Quarterly**: Review generated patterns against n8n official best practices
- **Annually**: Audit entire template library for evolution

### Workflow Development

1. Search GenerateAgents templates first (covers 90% of use cases)
2. Get detailed node documentation via n8n-MCP
3. Validate node config early in development
4. Test workflow in n8n UI before CI/CD deployment
5. Link workflow to knowledge management system

### Error Handling Standards

- Every workflow **must** have error paths
- Use IF nodes for conditional routing
- Connect errors to Slack/logging nodes
- Document error scenarios in AGENTS.md

## References

- **GenerateAgents.md**: https://github.com/originalankur/GenerateAgents.md
- **n8n-MCP Tools**: Available via `mcp_n8n-mcp_*` functions
- **n8n Templates**: 2,709+ templates available
- **Context7**: Documentation lookup and integration

---

**Status**: Schema definition guidelines  
**Last Updated**: March 5, 2026  
**Owner**: Dylan  
**Integration Level**: Planned for Phase 4
