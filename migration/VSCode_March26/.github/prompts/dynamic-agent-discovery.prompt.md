---
description: "Dynamically discover and suggest agents from awesome-copilot collections using regex/keyword matching. No LLM generation required."
agent: "agent"
tools:
  [
    "mcp_awesome-copil_list_collections",
    "mcp_awesome-copil_load_collection",
    "mcp_awesome-copil_search_instructions",
  ]
model: "gpt-4o"
---

# Dynamic Agent Discovery

**Purpose**: Find and suggest relevant agents from awesome-copilot collections based on user's natural language request WITHOUT generating new agents via LLM.

## How It Works

1. **User provides request** (e.g., "I need help with web scraping")
2. **Keyword/regex matching** identifies relevant domain (web, data, devops, etc.)
3. **Load matching collections** from awesome-copilot registry
4. **Return agent instructions** from existing collections

**NO LLM GENERATION** - Pure template and pattern matching!

## Workflow

### Step 1: Parse User Intent

Extract keywords and patterns from user's request:

```python
# Example patterns
patterns = {
    'web_dev': r'\b(web|frontend|backend|api|rest|html|css|javascript|react|vue)\b',
    'data': r'\b(data|database|sql|nosql|analytics|pipeline)\b',
    'devops': r'\b(deploy|docker|kubernetes|ci/cd|infrastructure)\b',
    'testing': r'\b(test|testing|unit test|integration|e2e|qa)\b',
    'code_analysis': r'\b(analyze|scan|review|audit|inspect)\s+(code|codebase)\b',
}
```

### Step 2: Search Collections

Use awesome-copilot MCP tools:

```javascript
// List all available collections
const collections = await mcp_awesome_copil_list_collections();

// Filter collections by keyword match
const relevantCollections = collections.filter((collection) => {
  const searchText = `${collection.name} ${collection.description} ${collection.tags.join(" ")}`;
  return pattern.test(searchText.toLowerCase());
});
```

### Step 3: Load Matching Agents

For each relevant collection:

```javascript
// Load collection details
const collectionData = await mcp_awesome_copil_load_collection(collection.id);

// Extract agents
const agents = collectionData.items.filter((item) => item.kind === "agent");
```

### Step 4: Return Curated List

Present agents to user with:

- **Agent name** and description
- **Required tools/MCP servers**
- **Usage instructions**
- **Installation link**

## Pattern Matching Rules

### Priority Scoring

Collections/agents are scored by relevance:

| Match Type             | Score |
| ---------------------- | ----- |
| Exact tag match        | +20   |
| Keyword in name        | +15   |
| Keyword in description | +10   |
| Partial keyword match  | +5    |

### Domain Keywords

**Web Development**:

- Keywords: `web`, `frontend`, `backend`, `api`, `rest`, `graphql`, `html`, `css`, `javascript`, `typescript`, `react`, `vue`, `angular`
- Collections: `frontend-web-dev`, `api-dev`, `full-stack`

**Data & Analytics**:

- Keywords: `data`, `database`, `sql`, `nosql`, `analytics`, `etl`, `pipeline`, `spark`, `pandas`
- Collections: `data-engineering`, `data-science`, `analytics`

**DevOps & Infrastructure**:

- Keywords: `deploy`, `docker`, `kubernetes`, `ci/cd`, `terraform`, `ansible`, `jenkins`, `github-actions`
- Collections: `devops`, `infrastructure`, `cloud-engineering`

**Testing & QA**:

- Keywords: `test`, `testing`, `unit test`, `integration test`, `e2e`, `qa`, `selenium`, `jest`, `pytest`
- Collections: `testing`, `qa-automation`

**Code Analysis**:

- Keywords: `analyze`, `scan`, `review`, `audit`, `inspect`, `lint`, `security scan`
- Collections: `code-quality`, `security`, `code-review`

## Example Usage

### Example 1: Web Scraping Request

**User**: "I need an agent to help with web scraping"

**Process**:

1. Extract keywords: `web`, `scraping`
2. Match pattern: `web_dev` pattern matches
3. Search collections with tags: `web` collections with tags: `web`, `scraping`, `automation`
4. Find agents:
   - `web-scraper.agent.md` (if exists)
   - `automation.agent.md` (generic)

**Result**: Return agent instructions + installation command

### Example 2: Database Optimization

**User**: "How can I optimize my SQL queries?"

**Process**:

1. Extract keywords: `optimize`, `sql`, `queries`
2. Match pattern: `data` pattern matches
3. Search collections with tags: `database`, `sql`, `performance`
4. Find agents:
   - `database-optimizer.agent.md`
   - `sql-advisor.agent.md`

**Result**: Return relevant database agents

### Example 3: CI/CD Pipeline

**User**: "Set up GitHub Actions CI/CD for my Python project"

**Process**:

1. Extract keywords: `github actions`, `ci/cd`, `python`
2. Match pattern: `devops` pattern matches
3. Search collections with tags: `ci-cd`, `github-actions`, `python`
4. Find agents:
   - `cicd-specialist.agent.md`
   - `github-actions-helper.agent.md`

**Result**: Return DevOps agents

## Implementation Pattern

Use the `collection_builder.py` module:

```python
from Knowledge.tools.collection_builder import match_intent_to_collection
from mcp_awesome_copil import list_collections, load_collection

# Get user request
user_request = "I need help with API testing"

# Fetch all collections
all_collections = list_collections()

# Match to relevant collections (NO LLM!)
relevant_collections = match_intent_to_collection(user_request, all_collections)

# Load agents from top 3 collections
for collection in relevant_collections[:3]:
    collection_data = load_collection(collection['id'])

    # Filter for agents
    agents = [item for item in collection_data['items'] if item['kind'] == 'agent']

    # Present to user
    for agent in agents:
        print(f"Agent: {agent['path']}")
        print(f"Install: https://aka.ms/awesome-copilot/install/agent?path={agent['path']}")
```

## Fallback Strategy

If no exact matches found:

1. **Broaden search**: Try parent categories (e.g., `web_dev` → `general_dev`)
2. **Suggest generic agents**: Load multi-purpose agents (architect, reviewer, debugger)
3. **Offer to search instructions**: Use `mcp_awesome-copil_search_instructions` for guidance

## Key Principles

✅ **Template-based**: All agent definitions come from existing collections  
✅ **Pattern matching**: Use regex and keyword matching, NOT LLM generation  
✅ **Fast**: No API calls to LLM providers, just local pattern matching  
✅ **Accurate**: Return proven agents from awesome-copilot registry  
✅ **Composable**: Agents can reference other agents/instructions

❌ **Never use LLM to generate agents** - only discover existing ones  
❌ **Never create agent files dynamically** - return existing agent paths  
❌ **Never invent capabilities** - only return what's in schema

## Output Format

For each matched agent, provide:

```markdown
### Agent: {agent_name}

**Description**: {agent_description}

**Required Tools**: {mcp_servers_list}

**Installation**:
[Install in VS Code](https://aka.ms/awesome-copilot/install/agent?path={agent_path})

**Usage**:
Select agent from GitHub Copilot agent picker (@{agent_name})
```

## Integration with VSCode

Agents are automatically available in GitHub Copilot after installation:

1. Click install link
2. Agent appears in `@agent-name` picker
3. No restart required
4. Works with all Copilot features
