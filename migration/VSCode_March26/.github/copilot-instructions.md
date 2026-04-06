# Copilot Instructions: n8n Workflow Automation Project

## Quick actions for agents (read this first)

- Start the n8n server: prefer the VS Code task `n8n: Start` or run `npx n8n` (serves on http://localhost:5678).
- Start the n8n-MCP bridge when doing agent-driven work: run `npx n8n-mcp` or use the `n8n-mcp: Start (stdio)` task.
- Required environment hints: set `N8N_API_URL` (agent-first mode), `N8N_API_KEY` (when present), `MCP_MODE=stdio` (for local MCP), and `N8N_USER_DATA_DIR=./n8n-data`.
- What to read first: `CLAUDE.md` (ContextStream rules), `GenerateAgents/AGENTS.md` (GenerateAgents conventions), and `README.md` (project quickstart & observability).
- Use `search_templates()` → `get_node()` → `validate_workflow()` flow for building or fixing workflows.

## Project Overview

This workspace runs **n8n** (workflow automation platform) with **n8n-MCP** (Model Context Protocol integration for AI-assisted workflow building). AI agents help design, validate, and deploy automated workflows.

## Core Architecture

### n8n Execution Model

- **Trigger nodes** initiate workflows (e.g., webhooks, schedules, manual triggers)
- **Processing nodes** transform data (HTTP calls, conditionals, data mapping)
- **Output nodes** send results (Slack notifications, database writes, webhooks)
- **Data flow**: Each node receives `$json` input from previous nodes and outputs to next nodes
- **Error handling**: Connect IF nodes to route errors, use Error Trigger nodes for recovery

### n8n-MCP Integration

- **Purpose**: Agents use n8n-MCP tools to validate workflows, get node documentation, and discover templates
- **Key tools**: `search_templates()`, `search_nodes()`, `get_node()`, `validate_workflow()`
- **Mode**: Stdio (subprocess communication via environment variables)
- **Activation**: Agents have direct access; no explicit initialization needed

### Database & Storage

- **Current**: SQLite at `./n8n-data/database.sqlite` (no external setup required)
- **Upgrade path**: POSTGRESQL_SETUP.md provides PostgreSQL migration steps
- **Gitignoring**: `/n8n-data/` excluded (workflows are local, not versioned)
- **Data persistence**: `.env` sets `N8N_USER_DATA_DIR=./n8n-data`

## Starting the Workspace

### Run n8n Server

```powershell
# Option 1: VSCode Task (Ctrl+Shift+B → "n8n: Start")
npx n8n

# Option 2: Direct command (detached terminal)
npx n8n  # Runs on http://localhost:5678
```

### Connect n8n-MCP

- n8n MCP is consumed in **stdio mode** (`MCP_MODE=stdio`) for agent-driven workflow automation.
- For **agent-first (headless)** usage from local VS Code, point `N8N_API_URL` to a directly reachable n8n host (example: `https://dyldo190.app.n8n.cloud`).
- Codespace tunnel URLs like `https://<codespace>-5678.app.github.dev` are typically **UI-friendly** but may redirect API traffic to GitHub sign-in, which breaks headless MCP calls.
- Keep both modes documented in `.env` / `.env.example`:
  - **UI-first mode**: local/codespace UI editing
  - **Agent-first mode**: cloud/direct API endpoint for MCP tooling

## Project Conventions

## Workspace Agents

This workspace includes **4 custom GitHub Copilot agents** installed in `.github/agents/`:

### Available Agents

#### 1. @task-planner

- **Purpose**: Breaks down features into implementation tasks with clear scope and dependencies
- **Use when**: Planning features, creating implementation roadmaps, defining task dependencies
- **Example**: `@task-planner Help me plan the PostgreSQL migration`

#### 2. @python-mcp-expert

- **Purpose**: Expert in building Model Context Protocol servers with Python and FastMCP
- **Use when**: Developing Python MCP servers, using FastMCP decorators, implementing MCP tools
- **Example**: `@python-mcp-expert Create a FastMCP tool that queries a database`

- `N8N_API_URL`: API base used by n8n-mcp tools (agent-first mode)
- `N8N_API_KEY`: API key for workflow management tools
- `N8N_MCP_ENDPOINT` + `N8N_MCP_TOKEN`: optional instance-level MCP endpoint mode

#### 3. @typescript-mcp-expert

- **Purpose**: Expert in building Model Context Protocol servers with TypeScript/Node.js
- **Use when**: Developing n8n-mcp, using MCP TypeScript SDK, implementing type-safe handlers
- **Example**: `@typescript-mcp-expert Add a new tool to n8n-mcp for workflow validation`

#### 4. @n8n-workflow-expert

- **Purpose**: Expert in n8n workflow automation and integration
- **Use when**: Designing workflows, configuring nodes, debugging workflow execution
- **Example**: `@n8n-workflow-expert Design a workflow for GitHub webhook processing`

### Agent Documentation

- Full guide: See `.github/agents/README.md`
- Installation: See `AGENT_INSTALLATION.md` at workspace root
- Deployment summary: See `AGENT_DEPLOYMENT_SUMMARY.md` at workspace root

### Collection Manifest

- Location: `Knowledge/collections/vscode-march26-workspace.collection.yml`
- ID: `vscode-march26-workspace`
- Tags: n8n, mcp, workflow-automation, typescript, python

## Project Conventions

### Workflow Design Pattern

1. **Template-first approach**: 2,709+ templates available—search before building from scratch
2. **Explicit parameters**: Never rely on node defaults; set ALL control parameters
3. **Error handling**: Always add error paths using IF nodes (route to true/false branches)
4. **Expression syntax**: Use `$json` for previous node output, `$node["NodeName"].json` for specific nodes

### Configuration via Environment Variables

Edit `.env` to customize:

- `N8N_PORT`: Server port (default: 5678)
- `N8N_HOST`: Server hostname (default: localhost)
- `DB_TYPE`: Database backend (sqlite or postgresdb)
- `NODE_ENV`: Set to "development" for debugging

### File Structure

```
├── .env                    # Environment: DB type, port, paths (gitignored)
├── .github/
│   └── copilot-instructions.md  # This file
├── .vscode/
│   ├── mcp.json           # MCP server configuration (markitdown)
│   └── tasks.json         # VSCode tasks for n8n/n8n-mcp
├── Knowledge/             # Project analysis, code snippets, docs
│   ├── data/             # Raw/processed datasets
│   ├── analysis/         # Jupyter notebooks, reports
│   ├── code/             # Reusable modules
│   └── docs/             # Documentation
├── n8n-data/             # n8n workflows, credentials, DB (gitignored)
└── QUICKSTART.md          # User-facing quick start guide
```

## AI Agent Workflow (n8n-MCP Usage)

### When Helping Build/Fix Workflows

1. **Search templates first**: `search_templates({searchMode: 'by_metadata', complexity: 'simple'})`
2. **Get node details**: `get_node({nodeType: 'n8n-nodes-base.slack', detail: 'standard'})`
3. **Validate early**: `validate_node({nodeType, config, mode: 'minimal'})` for quick checks
4. **Build with explicit config**: Set ALL parameters—never omit optional fields
5. **Test workflow**: `validate_workflow(workflow)` before deployment

### Critical Patterns

- **IF Node Routing**: Use `branch: "true"` / `branch: "false"` parameters for connection routing
- **Expression Examples**: `$json.message` (text field), `$node["Previous"].json.id` (cross-node reference)
- **Parallel Execution**: Search/validate/configure multiple nodes simultaneously in tool calls
- **Attribution**: If recommending templates, cite author: "Based on template by **Name** (@user). View at: url"

### Common Integration Points

- **Slack**: `n8n-nodes-base.slack` (requires channel ID, explicit post parameters)
- **HTTP Requests**: `n8n-nodes-base.httpRequest` (set auth headers explicitly, parameterize URLs)
- **Webhooks**: Combine `n8n-nodes-base.webhook` (trigger) + `n8n-nodes-base.respondToWebhook` (response)
- **Email/Gmail**: `n8n-nodes-base.gmail` (requires OAuth setup via n8n UI)
- **Data Transform**: `n8n-nodes-base.set` for field mapping, `n8n-nodes-base.function` for custom JS

## GenerateAgents: Meta-Programming Framework

### Overview

**GenerateAgents** is a meta-agent factory that generates specialized Copilot agents from code analysis. It enables self-improving agent ecosystems where agents can generate other agents.

### Available Tools

#### 1. `generateAgent` - Generate Specialized Agents

**Purpose**: Create new Copilot agents from repository code analysis

**Usage Pattern**:

```
User: "Create an agent for REST API testing"
  ↓
You: Call generateAgent tool
  - repositoryUrl: the repo to analyze
  - agentPurpose: "api-agent" (or web, data, devops, etc.)
  - modelChoice: "gpt-4o" (recommended), "gpt-4o-mini", or "claude-3-5-sonnet"
  ↓
Tool executes n8n GenerateAgents workflow
  - Clones and analyzes repository
  - Extracts coding conventions and patterns
  - Uses GitHub Models API (free with Pro)
  ↓
Returns: AGENTS.md + tool schemas + integration instructions
  ↓
Agent immediately available for use
```

**Parameters**:

- `repositoryUrl` (required): GitHub URL or local path
- `codebaseContext` (required): What the codebase does
- `agentPurpose` (required): `web-agent`, `api-agent`, `data-agent`, `devops-agent`, `mlops-agent`, `custom`
- `modelChoice` (optional, default: `gpt-4o`):
  - **gpt-4o**: Best quality, 50/day limit, 2-3 min/analysis. **RECOMMENDED**
  - **gpt-4o-mini**: Fastest, 150/day limit, 30-60 sec/analysis. Use for iterations
  - **claude-3-5-sonnet**: Best prompt following, 50/day limit. Use for complex requirements
- `agentStyle` (optional): `concise`, `comprehensive`, `minimal`, `detailed`

**Example**:

```
generateAgent({
  repositoryUrl: "https://github.com/myorg/api-tester",
  codebaseContext: "Python Flask REST API testing framework",
  agentPurpose: "api-agent",
  modelChoice: "gpt-4o"
})
```

#### 2. `analyzeCodebase` - Extract Code Patterns

**Purpose**: Analyze code without generating full agent

**Parameters**:

- `repositoryUrl`: Repository to analyze
- `analysisDepth`: `shallow`, `standard`, `deep`
- `focusAreas`: Array of areas (architecture, patterns, testing, documentation)
- `includeGitHistory`: Analyze commit history for patterns

#### 3. `validateAgent` - Verify Configuration

**Purpose**: Check generated AGENTS.md for correctness

**Parameters**:

- `agentsMarkdown`: The AGENTS.md content
- `toolDefinitions`: Tool schemas to validate
- `validationLevel`: `basic`, `standard`, `strict`

### Composition Patterns

#### Pattern 1: Simple Agent Generation

```
User Request
  ↓
generateAgent(repo, purpose)
  ↓
Result: New agent available
```

#### Pattern 2: Recursive Generation (Self-Improving)

```
Copilot Agent (GenerateAgents)
  ↓ calls
  generateAgent()
  ↓
Agent B created (also has generateAgent)
  ↓ User asks "extend Agent B with X"
  ↓
Agent B calls generateAgent()
  ↓
Agent C created (enhanced version of B)
  ↓ Inherits + builds on A and B capabilities
```

#### Pattern 3: Specialization Chain

```
Round 1: generateAgent() → MLOpsAgent
Round 2: MLOpsAgent uses generateAgent() → ModelTrainingAgent
Round 3: ModelTrainingAgent uses generateAgent() → ModelValidationAgent
Round 4: ModelValidationAgent uses generateAgent() → DeploymentAgent

Result: 4-agent chain, each building on previous
```

### Best Practices

1. **Start with analyzing**: Use `analyzeCodebase` first to understand patterns
2. **Choose right model**:
   - Production agents: `gpt-4o` (best quality)
   - Iterating quickly: `gpt-4o-mini` (fastest, 150/day)
   - Complex requirements: `claude-3-5-sonnet` (best prompt following)
3. **Validate output**: Always run `validateAgent` before using generated agent
4. **Track lineage**: Note which agent generated which (for debugging)
5. **Combine tools**: Chain `analyzeCodebase` → `generateAgent` → `validateAgent`

### Real-World Examples

**Example 1: Generate Web Scraper Agent**

```
User: "Create an agent for web scraping"
You: generateAgent({
  repositoryUrl: "https://github.com/scrapy/scrapy",
  codebaseContext: "Scrapy web scraping framework",
  agentPurpose: "web-agent",
  modelChoice: "gpt-4o"
})
Result: WebScraperAgent with tool schemas for Copilot
Time: 2-3 minutes
```

**Example 2: Extend Agent with New Capability**

```
Copilot Agent B (API Testing)
User: "Add GraphQL support to Agent B"
Agent B calls: generateAgent({
  repositoryUrl: "https://github.com/graphql/graphql-js",
  codebaseContext: "GraphQL implementation",
  agentPurpose: "api-agent",
  customPurpose: "Extend Agent B with GraphQL support"
})
Result: Agent C (REST + GraphQL capable)
Time: 2-3 minutes
```

**Example 3: Batch Generate Multiple Agents**

```
User: "Build agents for my entire data platform"
Action 1: generateAgent() for data extraction → DataExtractorAgent
Action 2: DataExtractorAgent calls generateAgent() for transformation → DataTransformAgent
Action 3: DataTransformAgent calls generateAgent() for loading → DataLoaderAgent
Action 4: DataLoaderAgent calls generateAgent() for monitoring → MonitoringAgent
Result: 4-agent data platform, auto-generated and interconnected
Time: 8-15 minutes total (agents generated in parallel/sequence)
```

### Integration with awesome-copilot Collections

Generated agents are registered in the `GenerateAgents` awesome-copilot collection:

```yaml
# Knowledge/collections/generateagents.collection.yml
name: GenerateAgents Factory
generators:
  - GenerateAgents (base factory)
  - Agent B (generated agents also have factory capability)
  - Agent C (recursive generation)
  - Agent D (etc.)
```

Each generated agent:

- Appears in collection
- Can be discovered by other agents
- Inherits generateAgent tool
- Can generate more agents

### Key Differences from Manual Agent Creation

| Aspect               | Manual        | GenerateAgents    |
| -------------------- | ------------- | ----------------- |
| **Time per agent**   | 30-60 min     | 2-5 min           |
| **Consistency**      | Variable      | Guaranteed        |
| **Learning curve**   | Steep         | Gentle            |
| **Iteration**        | Slow          | Fast              |
| **Self-improvement** | Not possible  | Yes (recursive)   |
| **Cost**             | Manual effort | Free (GitHub Pro) |

## Dynamic Agent Discovery: Template-Based Approach

**CRITICAL**: When users ask for agent recommendations or Discovery, **DO NOT** use GenerateAgents to create new agents via LLM. Instead, use the template-based discovery system that finds existing agents from awesome-copilot collections.

### Philosophy

- **Discovery over Generation**: Find proven agents from registry first
- **Templates over LLMs**: Use existing schemas and templates (zero API costs)
- **Pattern Matching**: Regex/keyword matching to find relevant agents
- **Fast & Accurate**: Instant results from curated collections

### How It Works

```
User Request: "I need help with API testing"
  ↓
Keyword Matching: Extract ["api", "testing"]
  ↓
Pattern Detection: Matches "api-agent" + "testing" domains
  ↓
Search awesome-copilot: Query via mcp_awesome-copil_list_collections
  ↓
Load Relevant Collections: Filter by tags/keywords
  ↓
Return Existing Agents: Present agents from collections
  ↓
Installation: User installs via VS Code link
```

**NO LLM CALLS** - Pure template matching and YAML parsing!

### Available Tools

Use these MCP tools for discovery:

- **`mcp_awesome-copil_list_collections`**: List all available collections
- **`mcp_awesome-copil_load_collection`**: Load collection details with agents
- **`mcp_awesome-copil_search_instructions`**: Find related instructions
- **`mcp_awesome-copil_load_instruction`**: Load instruction content

### Pattern Matching Rules

Domain keywords automatically mapped to collections:

| Domain           | Keywords                                               | Collections                     |
| ---------------- | ------------------------------------------------------ | ------------------------------- |
| **Web Dev**      | `web`, `frontend`, `backend`, `api`, `rest`, `react`   | `frontend-web-dev`, `api-dev`   |
| **Data**         | `data`, `database`, `sql`, `analytics`, `pipeline`     | `data-engineering`, `analytics` |
| **DevOps**       | `deploy`, `docker`, `kubernetes`, `ci/cd`, `terraform` | `devops`, `infrastructure`      |
| **Testing**      | `test`, `unit test`, `e2e`, `qa`, `selenium`           | `testing`, `qa-automation`      |
| **Code Quality** | `analyze`, `review`, `audit`, `lint`, `security`       | `code-quality`, `security`      |

### Implementation Module

Use `Knowledge/tools/collection_builder.py` for pattern matching:

```python
from Knowledge.tools.collection_builder import match_intent_to_collection

# Get all collections via MCP
collections = mcp_awesome_copil_list_collections()

# Match user intent (NO LLM!)
user_request = "Help me with web scraping"
relevant = match_intent_to_collection(user_request, collections)

# Load top 3 collections
for collection in relevant[:3]:
    data = mcp_awesome_copil_load_collection(collection['id'])
    agents = [item for item in data['items'] if item['kind'] == 'agent']
    # Present to user
```

### When to Use Each Approach

| Scenario                                       | Use This          | Why                          |
| ---------------------------------------------- | ----------------- | ---------------------------- |
| User wants **existing proven agent**           | Dynamic Discovery | Instant, free, curated       |
| User wants **custom agent** for their codebase | GenerateAgents    | Tailored to project patterns |
| User asks **"what agents exist for X?"**       | Dynamic Discovery | Search registry              |
| User says **"create agent for my repo"**       | GenerateAgents    | Code analysis needed         |
| User needs **quick recommendation**            | Dynamic Discovery | Sub-second response          |
| User needs **project-specific tool**           | GenerateAgents    | Repository analysis          |

### Example Workflows

**Example 1: Quick Recommendation**

```
User: "What agents exist for web development?"
  ↓
Agent: Use Dynamic Discovery
  1. Extract keywords: ["web", "development"]
  2. Call: mcp_awesome_copil_list_collections()
  3. Filter collections by "web" tag
  4. Load "frontend-web-dev" collection
  5. Present agents: react-expert, vue-specialist, css-master
  6. Provide install links
Result: Instant agent recommendations (0.5 seconds)
```

**Example 2: Project-Specific Agent**

```
User: "Create agent for my custom Python microservices project"
  ↓
Agent: Use GenerateAgents
  1. Analyze repository structure
  2. Extract patterns (FastAPI, Docker, pytest)
  3. Generate custom AGENTS.md
  4. Create tool schemas
  5. Register in collection
Result: Tailored agent for project (2-5 minutes)
```

**Example 3: Hybrid Approach**

```
User: "I need API testing help for my GraphQL project"
  ↓
Agent: Try Dynamic Discovery First
  1. Search collections for "api-testing" + "graphql"
  2. If found: Return existing agents
  3. If not found: Suggest GenerateAgents
     "No exact match found. I can generate a custom GraphQL testing agent
      from your repo. Would you like me to analyze your codebase?"
```

### Prompt File

Use the pre-built prompt:

```markdown
@workspace /dynamic-agent-discovery.prompt.md
```

This prompt contains:

- Complete keyword/regex patterns
- Domain mappings
- MCP tool integration
- Scoring logic for relevance

### Best Practices

✅ **Always try discovery first** - Check registry before generating  
✅ **Use keyword scoring** - Rank collections by relevance  
✅ **Present top 3-5 matches** - Don't overwhelm users  
✅ **Include installation links** - Make it easy to adopt  
✅ **Fallback to generation** - Offer GenerateAgents if no match

❌ **Never generate when discovery works** - Wastes API credits  
❌ **Never invent agents** - Only return registered agents  
❌ **Never skip pattern matching** - Template system is fast enough

### Integration with VSCode

Discovered agents install instantly:

1. User clicks `[Install in VS Code]` link
2. Agent appears in `@agent-name` picker
3. Works immediately with Copilot
4. No configuration required

### Cost Comparison

| Approach              | API Costs         | Time          | Accuracy        |
| --------------------- | ----------------- | ------------- | --------------- |
| **Dynamic Discovery** | $0                | <1 second     | High (curated)  |
| **GenerateAgents**    | Free (GitHub Pro) | 2-5 minutes   | High (tailored) |
| **Manual Creation**   | $0                | 30-60 minutes | Variable        |

## Development Workflows

### Debugging Workflows

- **Real-time testing**: Use "Execute Workflow" button in n8n editor (http://localhost:5678)
- **Node execution logs**: Right-click node → "Execute node" to test single node
- **Error visibility**: Check IF node FALSE outputs and error-handling nodes
- **Variable inspection**: Use SET nodes to log `$json` contents mid-workflow

### Database Operations

- **SQLite default**: Zero configuration; file persists at `./n8n-data/database.sqlite`
- **Check status**: Open n8n editor → Workflows tab shows all stored workflows
- **Migration to PostgreSQL**: Set `DB_TYPE=postgresdb`, configure credentials in `.env`, restart n8n

### Knowledge Management

- **Store references**: Use `Knowledge/` directory for workflow patterns, external API docs, guides
- **Analysis notebooks**: `Knowledge/analysis/` contains Jupyter templates for data exploration
- **Code reuse**: `Knowledge/code/` for utility scripts, helper functions used across workflows

## Common Tasks

### "Help me create a workflow that sends Slack notifications when X happens"

1. Search: `search_templates({searchMode: 'by_task', task: 'slack_integration'})`
2. If found: Use template as base, customize trigger/message
3. If not: Chain `[Trigger] → [Process data] → [Slack node] → [Response]`
4. Validate: `validate_workflow()` and test in n8n UI

### "How do I connect to external API Y?"

1. Search: `search_nodes({query: 'api authentication'})`
2. Recommend: `n8n-nodes-base.httpRequest` with explicit auth headers
3. Example: Include `Authorization: Bearer token` in headers, parameterize URL via `$json` or environment

### "My workflow is failing with error Z"

1. **Ask**: Share error message and workflow description
2. **Check**: Validate node config with `validate_node({mode: 'full'})`
3. **Fix**: Likely missing required parameters (e.g., channel ID for Slack, auth token for HTTP)
4. **Re-test**: Run `validate_workflow()` after fixes

## Tools & Resources

- **n8n Editor**: http://localhost:5678 (run n8n server first)
- **n8n Docs**: Accessible via `get_node({mode: 'docs'})`
- **MCP Tools**: Search templates, validate workflows, get node configs
- **Templates**: 2,709+ examples available via `search_templates()`
- **Setup guides**: QUICKSTART.md (user), POSTGRESQL_SETUP.md (advanced)

## Critical Don'ts

❌ Don't trust node parameter defaults—always set required fields explicitly  
❌ Don't build workflows without template search first  
❌ Don't deploy without `validate_workflow()` check  
❌ Don't commit `/n8n-data/` directory to git (workflows are user-specific)  
❌ Don't skip error handling—every workflow needs error paths
