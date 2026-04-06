# Agent Collection Generator Workflow

**Purpose**: Enable GitHub Copilot agents to programmatically create agent collections as a reusable MCP tool.

**Architecture Pattern**: Meta-automation (Copilot Agents → n8n Workflow → awesome-copilot Collections → Agents)

---

## System Architecture

### High-Level Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ GitHub Copilot Agent                                             │
│ "Create a collection for ML ops automation workflows"            │
└──────────────────────┬──────────────────────────────────────────┘
                       │ Invoke Workflow (mcp_n8n-mcp_n8n_test_workflow)
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ n8n Workflow: Agent Collection Generator (webhook POST)         │
│                                                                  │
│  1. Receive Collection Request (Webhook Trigger)                │
│  2. Validate Payload (Required fields: name, items)             │
│  3. Sanitize & Prepare Variables (ID, filename, timestamp)      │
│  4. Generate Collection YAML (From JSON input)                  │
│  5. Write to awesome-copilot/collections/ (PowerShell File I/O) │
│  6. Update Collection Registry (JSON metadata)                  │
│  7. Generate Documentation (Markdown guide)                     │
│  8. Return Success Response (Collection ID + command)           │
│  9. Log Event (Audit trail)                                     │
└──────────────────────┬──────────────────────────────────────────┘
                       │ JSON response { collectionId, status, command }
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ awesome-copilot Repository (File System)                        │
│                                                                  │
│  └── collections/                                               │
│      ├── ml-ops-automation.collection.yml (NEW)                 │
│      ├── registry.json (UPDATED)                                │
│      └── docs/                                                  │
│          └── ml-ops-automation.md (NEW)                         │
└──────────────────────┬──────────────────────────────────────────┘
                       │ MCP server reloads collections
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ GitHub Copilot Agents (All)                                     │
│                                                                  │
│ Can now discover & use:                                          │
│  mcp_awesome-copil_load_collection({ id: "ml-ops-automation" }) │
└─────────────────────────────────────────────────────────────────┘
```

### MCP Ecosystem Integration

```
                    GitHub Copilot Agents
                    ├── Collection Creator
                    ├── Collection Discoverer
                    └── Multi-Agent Orchestrator
                            │
                    ┌───────┴────────┐
                    │                │
            ┌──────▼─────┐   ┌──────▼─────┐
            │ n8n-MCP    │   │  awesome-  │
            │ Server     │   │  copilot   │
            │            │   │  MCP Server│
            │ Tools:     │   │            │
            │ - test     │   │ Tools:     │
            │ - create   │   │ - list     │
            │ - validate │   │ - search   │
            └──────┬─────┘   │ - load     │
                   │         └────────────┘
                   │ POST webhook request
                   ▼
        ┌──────────────────────────┐
        │ Agent Collection          │
        │ Generator Workflow        │
        │ (n8n - 12 nodes)          │
        └──────────┬───────────────┘
                   │ Write & Register
                   ▼
        ┌──────────────────────────┐
        │ awesome-copilot/          │
        │ collections/ (YAML files) │
        └──────────────────────────┘
```

---

## Input/Output Contracts

### Webhook Input (POST /webhook/agent-collection-generator)

```json
{
  "collectionName": "ml-ops-automation",
  "description": "Machine learning operations automation patterns and workflows for model training, evaluation, and deployment.",
  "tags": ["ml", "automation", "devops", "mlops"],
  "items": [
    {
      "path": "agents/model-trainer.agent.md",
      "kind": "agents",
      "title": "Model Training Agent"
    },
    {
      "path": "agents/model-evaluator.agent.md",
      "kind": "agents",
      "title": "Model Evaluation Agent"
    },
    {
      "path": "prompts/generate-training-pipeline.prompt.md",
      "kind": "prompts",
      "title": "Generate ML Training Pipeline"
    },
    {
      "path": "prompts/optimize-hyperparameters.prompt.md",
      "kind": "prompts",
      "title": "Hyperparameter Optimization"
    }
  ],
  "author": "CopilotAgent",
  "authorId": "github-copilot-agent-01"
}
```

### Webhook Response (Success - HTTP 201)

```json
{
  "status": "success",
  "collectionId": "ml-ops-automation",
  "message": "Collection created successfully. Available via mcp_awesome-copil_load_collection",
  "timestamp": "2026-03-05T18:45:00.000Z",
  "itemCount": 4,
  "command": "mcp_awesome-copil_load_collection({ id: 'ml-ops-automation' })",
  "filePath": "C:\\Users\\dylan.a.thomas\\ProjectFolder\\mcp-dotnet-samples\\awesome-copilot\\collections\\ml-ops-automation.collection.yml"
}
```

### Webhook Response (Error - HTTP 400)

```json
{
  "status": "error",
  "message": "Missing required fields: collectionName, items",
  "receivedFields": ["collectionName", "tags"],
  "requiredFields": ["collectionName", "description", "items"],
  "timestamp": "2026-03-05T18:45:00.000Z"
}
```

---

## Generated Collection YAML Format

```yaml
name: ML Ops Automation
description: |
  Machine learning operations automation patterns and workflows for 
  model training, evaluation, and deployment.
tags:
  - ml
  - automation
  - devops
  - mlops
author: CopilotAgent
createdAt: 2026-03-05T18:45:00.000Z
items:
  - path: agents/model-trainer.agent.md
    kind: agents
    title: Model Training Agent
  - path: agents/model-evaluator.agent.md
    kind: agents
    title: Model Evaluation Agent
  - path: prompts/generate-training-pipeline.prompt.md
    kind: prompts
    title: Generate ML Training Pipeline
  - path: prompts/optimize-hyperparameters.prompt.md
    kind: prompts
    title: Hyperparameter Optimization
```

---

## Workflow Node Specifications

### Node 1: Webhook Trigger
- **Type**: Webhook (n8n_nodes_base.webhook)
- **Method**: POST
- **Path**: `/agent-collection-generator`
- **Response Mode**: Wait for Webhook Call
- **Data Mapping**: Passes full JSON payload to next node

### Node 2: Validate Payload
- **Type**: IF Condition
- **Rules**: 
  - `collectionName` exists AND is string
  - `items` exists AND is array
  - `items.length > 0`
- **True Branch**: Continue processing
- **False Branch**: Return 400 error response

### Node 3-9: Process & Write
- **Sanitize**: Convert name to kebab-case ID
- **Generate YAML**: Build collection YAML content
- **Write File**: PowerShell Execute Command
- **Update Registry**: Add collection metadata to registry.json
- **Document**: Generate markdown guide
- **Prepare Response**: Build success response JSON
- **Log Event**: Record creation event

### Node 10-11: Response
- **Success**: HTTP 201 + JSON response
- **Error**: HTTP 400 + error details
- **Header**: Content-Type: application/json

---

## Copilot Agent Integration

### Capability: "Collection Creator"

**When to Use**: User asks agent to "create a collection" or "make a collection for X"

**Agent Workflow**:
```
1. Parse User Request
   - Extract collection name, description, tags, items
   
2. Invoke Workflow
   mcp_n8n-mcp_n8n_test_workflow({
     workflowId: "agent-collection-generator",
     data: { collection definition... },
     triggerType: "webhook"
   })
   
3. Process Response
   - Extract collectionId from response.collectionId
   - Extract command from response.command
   
4. Verify Collection
   mcp_awesome-copil_load_collection({ id: response.collectionId })
   
5. Report Success
   "Collection '{name}' created! Try this: {command}"
```

### Example Agent Prompt

```markdown
# Collection Creator Agent

You can create custom awesome-copilot collections on demand.

## How it Works

When a user asks you to "create a collection" for any topic:

1. **Understand the requirement**: What's the collection for? What items should it include?
2. **Design the collection**:
   - collectionName: Clear, hyphenated (e.g., "ml-ops-automation")
   - description: 2-3 sentence summary of purpose
   - tags: 3-5 relevant keywords
   - items: List agents/prompts with paths and titles
3. **Invoke the workflow**:

```typescript
mcp_n8n-mcp_n8n_test_workflow({
  workflowId: "agent-collection-generator",
  data: {
    collectionName: "user-desired-name",
    description: "Clear description of what this collection is for",
    tags: ["tag1", "tag2", "tag3"],
    items: [
      {
        path: "agents/example.agent.md",
        kind: "agents",
        title: "Agent Title"
      },
      {
        path: "prompts/example.prompt.md",
        kind: "prompts",
        title: "Prompt Title"
      }
    ],
    author: "Collection Creator Agent"
  },
  triggerType: "webhook"
})
```

4. **Verify the collection was created**:

```typescript
mcp_awesome-copil_load_collection({
  id: "response-collectionId"
})
```

5. **Report back** with the ready-to-use command

## Example Interaction

**User**: "Create a DevOps automation collection with agents for CI/CD, monitoring, and deployment"

**Agent**:
- Generates collection name: "devops-automation"
- Designs 3 agents + 2 prompts
- Invokes workflow
- Receives response: { status: "success", collectionId: "devops-automation" }
- Verifies collection loads successfully
- Reports: "✅ Collection 'devops-automation' created! Use: mcp_awesome-copil_load_collection({ id: 'devops-automation' })"
```

---

## Multi-Agent Pattern

### Orchestrator → Specialists → Collection

```
User: "Build a complete data pipeline solution"
       │
       ▼
Orchestrator Agent
       │
       ├─→ Specialist 1: Create Extraction Agent
       │   └─→ agents/data-extractor.agent.md
       │
       ├─→ Specialist 2: Create Transform Agent
       │   └─→ agents/data-transformee.agent.md
       │
       └─→ Specialist 3: Create Load Agent
           └─→ agents/data-loader.agent.md
       │
       ▼ (All agents created)
       │
       ▼ Invoke Collection Generator
       ├─ Collection Name: "data-pipeline-suite"
       ├─ Items: [3 agents above + 4 prompts]
       └─ Author: "Orchestrator Agent"
       │
       ▼
    Workflow executes
       │
       ▼
Response: { collectionId: "data-pipeline-suite", ... }
       │
       ▼
Report: "Data pipeline collection created with 3 agents and 4 prompts!"
```

---

## Implementation Steps

### Step 1: Deploy Workflow to n8n

1. Open n8n Codespace: https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev
2. Click "+ New" → "Create new workflow"
3. Copy nodes from `agent-collection-generator-workflow.json`
4. Activate workflow
5. Get webhook URL from Webhook trigger node:
   ```
   https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev/webhook/agent-collection-generator
   ```

### Step 2: Update n8n-MCP Configuration

Ensure `mcp.json` has correct n8n details:
```json
{
  "n8n-mcp": {
    "type": "stdio",
    "command": "npx",
    "args": ["n8n-mcp"],
    "env": {
      "N8N_API_URL": "https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev",
      "N8N_API_KEY": "n8n_api_4567aef5f325db695de6c9e7d5eeb6b99c3638ddc9c8fa5b1fb73662ea25ee1a"
    }
  }
}
```

### Step 3: Test Workflow Manually

```bash
# curl test
curl -X POST https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev/webhook/agent-collection-generator \
  -H "Content-Type: application/json" \
  -d '{
    "collectionName": "test-collection",
    "description": "Test collection for validating generator workflow",
    "tags": ["test"],
    "items": [
      {
        "path": "agents/test.agent.md",
        "kind": "agents",
        "title": "Test Agent"
      }
    ],
    "author": "Manual Test"
  }'
```

Expected Response:
```json
{
  "status": "success",
  "collectionId": "test-collection",
  "message": "Collection created successfully",
  "timestamp": "2026-03-05T...",
  "command": "mcp_awesome-copil_load_collection({ id: 'test-collection' })"
}
```

### Step 4: Verify Collection in awesome-copilot

```typescript
mcp_awesome-copil_load_collection({ id: "test-collection" })
// Should return collection metadata with 1 item
```

### Step 5: Add to Copilot Agent Instructions

Update agent system prompt to include collection creator capability (see template above).

### Step 6: Test Agent-Driven Creation

```
User: "Create a test collection with automated workflow"
Agent: [Invokes workflow via mcp_n8n-mcp_n8n_test_workflow]
Agent: [Verifies via mcp_awesome-copil_load_collection]
Agent: "✅ Collection created!"
```

---

## Configuration Requirements

### n8n Codespace Setup
- ✅ URL: https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev
- ✅ API Key: From .env (N8N_API_KEY)
- ✅ Webhook Base: https://curly-space-spork-v9rg679gpqw3rj6-5678.app.github.dev

### awesome-copilot Repository
- ✅ Path: C:\Users\dylan.a.thomas\ProjectFolder\mcp-dotnet-samples\awesome-copilot
- ✅ Collections Dir: `.../awesome-copilot/collections/`
- ✅ Registry File: `.../awesome-copilot/collections/registry.json`

### Copilot Agent Access
- ✅ n8n-MCP tool: `mcp_n8n-mcp_n8n_test_workflow`
- ✅ awesome-copilot tools: `mcp_awesome-copil_load_collection`, `mcp_awesome-copil_search_instructions`

---

## Security Considerations

### Input Validation
- ✅ collectionName: alphanumeric + hyphens, max 50 chars
- ✅ description: max 500 chars
- ✅ tags: max 10 tags, each max 20 chars
- ✅ items: max 50 items, validate path format
- ✅ No directory traversal (".." in paths)

### File System Protection
- ✅ Write only to designated collections directory
- ✅ Validate PowerShell command input
- ✅ Use Set-Content with UTF8 encoding
- ✅ Create backups before modifying registry

### Rate Limiting
- ⏳ Implement webhook rate limiting (e.g., 10/minute per agent)
- ⏳ Track quota per collection creator

### Audit Trail
- ✅ Log all requests with timestamp, author, collection ID
- ✅ Store in n8n execution history
- ✅ Create separate audit log file

---

## Troubleshooting

### Issue: Webhook returns 400 "Missing required fields"
**Solution**: Verify JSON payload includes all required fields (collectionName, description, items)

### Issue: File not written to awesome-copilot directory
**Solution**: Check PowerShell execution policy, directory permissions, path correctness

### Issue: Collection appears in n8n response but not in mcp_awesome-copil_load_collection
**Solution**: MCP server caches collections. Restart awesome-copilot MCP server or wait 30 seconds for refresh

### Issue: Registry.json becomes corrupted
**Solution**: Restore from backup, use JSON validation before write

---

## Related Files

- **Workflow JSON**: `agent-collection-generator-workflow.json`
- **Deployment Guide**: `AGENT_COLLECTION_GENERATOR_DEPLOYMENT.md`
- **awesome-copilot MCP**: [Validation Results](AWESOME_COPILOT_VALIDATION.md)
- **Health Monitor Example**: `health_monitor_workflow.json`

---

## Success Metrics

✅ Agent can invoke workflow with proper JSON payload  
✅ Workflow validates input and rejects invalid payloads  
✅ Collection YAML written to correct directory  
✅ awesome-copilot MCP server discovers new collection  
✅ mcp_awesome-copil_load_collection returns new collection metadata  
✅ End-to-end time: < 10 seconds from invocation to collection ready  
✅ Audit log records all creation events  

---

**Status**: 🟢 Designed & Ready for Implementation  
**Next**: Deploy workflow JSON to n8n Codespace  
**Owner**: Agent Collection Generator System  
**Last Updated**: 2026-03-05
