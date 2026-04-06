# Dynamic Agent Discovery - Quick Start

**Purpose**: Find existing agents from awesome-copilot collections WITHOUT generating new ones via LLM.

## How to Use

### Option 1: Via Prompt File

```markdown
@workspace Tell me what agents exist for API testing
```

The system will:
1. Extract keywords: `["api", "testing"]`
2. Search awesome-copilot collections
3. Return matching agents with install links

### Option 2: Via Python Script

```python
from Knowledge.tools.collection_builder import match_intent_to_collection

# User's request
user_request = "I need help with web scraping"

# Get collections (from awesome-copilot MCP)
collections = mcp_awesome_copil_list_collections()

# Find matches (NO LLM!)
relevant = match_intent_to_collection(user_request, collections)

# Show results
for collection in relevant[:3]:
    print(f"Collection: {collection['name']}")
    data = mcp_awesome_copil_load_collection(collection['id'])
    agents = [item for item in data['items'] if item['kind'] == 'agent']
    for agent in agents:
        print(f"  - {agent['path']}")
```

### Option 3: CLI Tool

```powershell
# Build agents from tool schemas
python Knowledge/tools/collection_builder.py build-agents ./mcp-tools ./Knowledge/agents

# Create collection YAML
python Knowledge/tools/collection_builder.py create-collection ./mcp-tools ./Knowledge/collections/test.collection.yml test-collection "Test Collection"
```

## Test the System

Run the test suite to verify everything works:

```powershell
cd c:\Users\dylan.a.thomas\Projects\VSCode_March26
python tests\test_dynamic_discovery.py
```

This will:
- ✅ Test pattern matching (web, data, devops keywords)
- ✅ Parse tool schemas into agent instructions
- ✅ Generate collection from mcp-tools/*.tool.json
- ✅ Create agent markdown files in Knowledge/agents/

## What Gets Created

After running tests:

```
Knowledge/
├── agents/                    # Generated agent files
│   ├── analyzecodebase.agent.md
│   ├── generateagents.agent.md
│   └── validateagent.agent.md
├── tools/
│   └── collection_builder.py  # Core module
└── collections/
    └── test.collection.yml    # Generated collection
```

## Key Files

- **`Knowledge/tools/collection_builder.py`** - Core module for template-based generation
- **`.github/prompts/dynamic-agent-discovery.prompt.md`** - Pre-built prompt for discovery
- **`tests/test_dynamic_discovery.py`** - Test suite to verify system works

## Example Queries

Try these queries with the system:

| Query | Expected Result |
|-------|----------------|
| "What agents exist for web development?" | Lists web-dev collection agents |
| "I need help with API testing" | Returns API testing agents |
| "Show me DevOps agents" | Returns devops collection |
| "Code review tools" | Returns code-quality agents |
| "Data analysis help" | Returns data-science agents |

## Pattern Matching Rules

The system uses regex patterns to match:

```python
patterns = {
    'web_dev': r'\b(web|frontend|backend|api|rest|react)\b',
    'data': r'\b(data|database|sql|analytics|pipeline)\b',
    'devops': r'\b(deploy|docker|kubernetes|ci/cd)\b',
    'testing': r'\b(test|testing|unit test|e2e|qa)\b',
    'code_quality': r'\b(analyze|review|audit|lint)\b',
}
```

**NO LLM CALLS** - Just string matching!

## Integration with GitHub Copilot

Once agents are discovered:

1. Click install link: `[Install in VS Code](...)`
2. Agent appears in `@agent-name` picker
3. Use immediately: `@api-testing-agent help me test this endpoint`

## Cost Comparison

| Method | API Cost | Time |
|--------|----------|------|
| **Dynamic Discovery** | $0 | <1 second |
| **GenerateAgents** | Free (GitHub Pro) | 2-5 minutes |
| **Manual Search** | $0 | 5-10 minutes |

## Troubleshooting

**Q: No matches found**  
**A**: Try broader keywords or check collection tags with `mcp_awesome_copil_list_collections()`

**Q: Agent file empty**  
**A**: Tool schema might be missing description. Check `mcp-tools/*.tool.json`

**Q: Import error for collection_builder**  
**A**: Ensure path is correct: `sys.path.insert(0, 'Knowledge/tools')`

## Next Steps

1. **Run tests**: `python tests\test_dynamic_discovery.py`
2. **Try discovery**: Use prompt file or MCP tools
3. **Generate collection**: Build from your mcp-tools schemas
4. **Install agents**: Click VS Code install links

## Reference

- **Module**: `Knowledge/tools/collection_builder.py`
- **Prompt**: `.github/prompts/dynamic-agent-discovery.prompt.md`
- **Tests**: `tests/test_dynamic_discovery.py`
- **Collections**: `Knowledge/collections/*.collection.yml`
