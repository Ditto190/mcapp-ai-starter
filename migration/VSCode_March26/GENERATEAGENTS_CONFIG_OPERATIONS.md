# GenerateAgents Configuration & Operations Guide
# ===============================================
# Complete setup, configuration, and operational procedures for your n8n + AI traceability system

## 📦 Installation Status

✅ **GenerateAgents.md**: Cloned to `/GenerateAgents`  
✅ **Configuration**: `.env` file configured with API keys  
⏳ **Dependencies**: Installing via `uv sync --extra dev`  

---

## 🔑 API Key Configuration

### Current Setup

Your `.env.sample` provides credentials for multiple LLM providers:

| Provider | API Key | Status | Default? |
|----------|---------|--------|----------|
| **Gemini** | `AIzaSyBGrnwDgT-8orWmcKQjRvITP7eYwvXCqls` | ✅ Active | **Yes** |
| **OpenAI** | `sk-proj-owZKPL5Lj_...` | ✅ Active | Fallback |
| **Anthropic** | `sk-c311a2205b49...` | ✅ Active | Fallback |

### Priority Order for Model Selection

```
1. GEMINI (Fastest, free tier, recommended)
   - gemini/gemini-2.5-pro (default)
   - 2M free credits/month
   
2. OpenAI (GPT-5.2)
   - More expensive but very powerful
   - Useful for complex analysis
   
3. Anthropic (Claude Sonnet 4.6)
   - Via DeepSeek API (economical)
   - Good for code understanding
```

### Configuration File Location

```
GenerateAgents/.env
├── GEMINI_API_KEY=...
├── OPENAI_API_KEY=...
├── ANTHROPIC_API_KEY=...
├── AUTOSKILL_MODEL=gemini/gemini-2.5-pro (optional override)
└── ANALYSIS_STYLE=comprehensive (default)
```

---

## 🚀 Running GenerateAgents

### Basic Commands

```bash
# Navigate to GenerateAgents directory
cd c:\Users\dylan.a.thomas\Projects\VSCode_March26\GenerateAgents

# Command 1: Analyze local repository (your code)
uv run autogenerateagentsmd ../agents/
# Output: GenerateAgents/projects/agents/AGENTS.md

# Command 2: Analyze GitHub repository
uv run autogenerateagentsmd --github-repository https://github.com/n8n-io/n8n
# Output: GenerateAgents/projects/n8n/AGENTS.md

# Command 3: Specify model
uv run autogenerateagentsmd --model openai/gpt-5.2 ../agents/
# Uses OpenAI instead of default Gemini

# Command 4: Strict output (rules only, no narrative)
uv run autogenerateagentsmd --output-style strict ../agents/
# Output: GenerateAgents/projects/agents/AGENTS_strict.md

# Command 5: With repository cloning
uv run autogenerateagentsmd --github-repository https://github.com/originalankur/GenerateAgents.md
# Clones repo and analyzes it
```

### Command Reference

```
Usage: uv run autogenerateagentsmd [OPTIONS] [REPO_PATH]

Positional Arguments:
  REPO_PATH                     Path to local repository (default: analyze GitHub)

Options:
  --github-repository URL       Analyze public GitHub repository
  --model MODEL                 Specify LLM model (defaults to Gemini 2.5 Pro)
  --output-style {comprehensive|strict}
                               Documentation style
  --force-refresh              Bypass cache and re-analyze
  -v, --verbose                Debug output
  --help                       Show this help message
```

---

## 📊 Generated Output Structure

### Directory Layout

```
GenerateAgents/
├── projects/
│   ├── agents/
│   │   ├── AGENTS.md                      # Comprehensive guide
│   │   ├── AGENTS_strict.md               # Strict rules only
│   │   └── schemas/
│   │       ├── agent_schema.json          # Structured definitions
│   │       ├── mcp_tool_schema.json       # Tool mappings
│   │       └── workflow_schema.json       # n8n workflow patterns
│   │
│   ├── n8n-workflows/
│   │   ├── AGENTS.md                      # n8n best practices
│   │   └── node_types_schema.json
│   │
│   ├── n8n-mcp/
│   │   ├── AGENTS.md                      # n8n-MCP agent guide
│   │   └── mcp_tool_registry.json         # Available tools
│   │
│   └── n8n/
│       ├── AGENTS.md                      # n8n framework analysis
│       └── ...
│
└── projects.json                          # Index of all analyses
```

### AGENTS.md Sections

Each generated `AGENTS.md` contains these sections:

```markdown
# AGENTS.md — [Project Name]

## Project Overview
- Brief description of what the system does
- Primary purpose and use cases

## Agent Persona
- How an AI should interact with the codebase
- Key contexts and constraints

## Tech Stack
- Programming languages, frameworks, tools
- Versions and compatibility

## Architecture
- Directory structure
- Component relationships
- Data flow

## Code Style
- Naming conventions (snake_case, PascalCase, etc.)
- Type hints, docstrings
- Formatting rules

## Anti-Patterns & Restrictions
- What NOT to do
- Forbidden practices

## Database & State Management
- How data is stored
- State management patterns

## Error Handling & Logging
- Exception handling patterns
- Logging standards

## Testing Commands
- How to run tests
- Commands for validation

## Testing Guidelines
- Testing framework and patterns
- File organization

## Security & Compliance
- Security guardrails
- Compliance requirements

## Dependencies & Environment
- Package management
- Environment variable setup

## PR & Git Rules
- Commit message format
- Branching strategy

## Documentation Standards
- How to write code comments
- Documentation tools

## Common Patterns
- Reusable code patterns
- Best practices

## Agent Workflow / SOP
- Step-by-step procedures for tasks
- Standard operating procedures

## Few-Shot Examples
- Good vs. bad code examples
- Real patterns from codebase
```

---

## 🔄 Analysis Pipeline

### How GenerateAgents Works

```
Input Repository
    ↓
[Shallow Git Clone (if GitHub)]
    ↓
Load Repository Structure
    ├─ Directory mapping
    ├─ File enumeration
    └─ Codebase tree
    ↓
[DSPy Pipeline Execution]
    ├─ RLM: ExtractCodebaseInfo (LLM analyzes structure)
    ├─ CoT: CompileConventionsMarkdown (Format extracted data)
    └─ CoT: ExtractAgentsSections (Generate 17 AGENTS.md sections)
    ↓
Compile Markdown Output
    ↓
Save to Projects Directory
    ↓
Output AGENTS.md (+ optional JSON schemas)
```

### Expected Processing Time

| Repository Size | Processing Time | Model |
|-----------------|-----------------|-------|
| Small (< 50 files) | 1-2 minutes | Gemini |
| Medium (50-500 files) | 3-5 minutes | Gemini |
| Large (500+ files) | 5-10 minutes | Gemini |
| Very Large (enterprise) | 10-15 minutes | GPT-5.2 |

**Note**: Times vary based on API latency and LLM complexity.

---

## 📋 Workflow: Generate Agents Schema for Your Project

### Step-by-Step Procedure

#### 1. Prepare Your Code

```bash
cd c:\Users\dylan.a.thomas\Projects\VSCode_March26

# Ensure all agent code is committed (helps with git history analysis)
git add agents/
git commit -m "Agents for analysis"

# Optional: Create summary document
# This helps GenerateAgents understand your project better
```

#### 2. Run GenerateAgents for Your Agents

```bash
cd GenerateAgents

# Analyze local agents/ directory
uv run autogenerateagentsmd ../agents/

# Monitor output
# Look for: "✓ AGENTS.md generated successfully"
```

#### 3. Review Generated Documentation

```bash
# Open the generated file
code projects/agents/AGENTS.md

# Key sections to review:
# - Agent Persona (matches your design?)
# - Tech Stack (accurate?)
# - Common Patterns (follows your actual code?)
# - Few-Shot Examples (representative of your style?)
```

#### 4. Extract Structured Schema

```bash
cd ..

# Run schema extraction
python agents/extract_agent_schema.py

# Check output
# Generated: agents/schemas/agent_schema.json
# Generated: agents/schemas/mcp_tool_mappings.json
```

#### 5. Generate n8n Workflows

```bash
# Generate workflows from agent schemas
python agents/workflow_generator_from_schema.py

# Use n8n-MCP tools to validate:
# - mcp_n8n-mcp_validate_workflow(workflow_json)
# - mcp_n8n-mcp_n8n_autofix_workflow()
# - mcp_n8n-mcp_n8n_create_workflow()
```

#### 6. Validate & Deploy

```bash
# Test the workflow
mcp_n8n-mcp_n8n_test_workflow(id="workflow-id")

# Once valid, deploy to n8n
mcp_n8n-mcp_n8n_deploy_template(id="workflow-id")

# Monitor execution
# Visit: http://localhost:5678
```

#### 7. Link to Knowledge Base

```bash
# Record schema generation in PostgreSQL
python agents/link_generation_to_knowledge.py

# This creates audit trail:
# - When schema was generated
# - Which model was used
# - Which workflows were created
# - What agents are involved
```

---

## 🛠️ Troubleshooting

### Issue 1: "ModuleNotFoundError: dspy"

**Cause**: Dependencies not installed

**Solution**:
```bash
cd GenerateAgents
uv sync --extra dev
```

### Issue 2: "API key not configured"

**Cause**: `.env` file missing or incomplete

**Solution**:
```bash
# Copy template
cp .env.sample .env

# Edit with your keys
code .env

# Verify:
python -c "from dotenv import load_dotenv; import os; load_dotenv(); print('OK' if os.getenv('GEMINI_API_KEY') else 'Missing API key')"
```

### Issue 3: "Rate limit exceeded"

**Cause**: Too many concurrent API calls

**Solution**:
```bash
# Use different model (lower cost)
uv run autogenerateagentsmd --model openai/gpt-5.2 ../agents/

# Or wait 1 hour before retrying

# Check quota: https://console.cloud.google.com/apis/quotas
```

### Issue 4: "Repository is too large"

**Cause**: Analyzing enterprise codebase

**Solution**:
```bash
# Increase timeout (default 600 seconds)
uv run autogenerateagentsmd --timeout 1800 ../agents/

# Or use GitHub analysis (more efficient)
uv run autogenerateagentsmd --github-repository https://github.com/your-org/repo
```

### Issue 5: "Workflow validation fails in n8n-MCP"

**Cause**: Generated workflow has configuration issues

**Solution**:
```python
# Use auto-fix feature
mcp_n8n-mcp_n8n_autofix_workflow(
    id="workflow-id",
    applyFixes=True,
    confidenceThreshold="high"
)

# Or check each node individually
mcp_n8n-mcp_validate_node(
    nodeType="n8n-nodes-base.slack",
    config=node_config,
    mode="full"
)
```

---

## 📈 Operations & Maintenance

### Daily Operations

```bash
# Check if schemas are up-to-date
python agents/check_schema_freshness.py

# Expected output: "✓ Schema generated today"
# If stale: "⚠ Schema is 7 days old - regenerate?"
```

### Weekly Tasks

```bash
# Regenerate schemas if code changed significantly
uv run autogenerateagentsmd --force-refresh ../agents/

# Review generated patterns
code GenerateAgents/projects/agents/AGENTS.md

# Update n8n workflows if needed
python agents/sync_workflows_with_schema.py
```

### Monthly Tasks

```bash
# Analyze latest n8n features
uv run autogenerateagentsmd --github-repository https://github.com/n8n-io/n8n

# Update n8n workflow patterns
code GenerateAgents/projects/n8n/AGENTS.md

# Review and audit all agent schemas
python agents/audit_all_schemas.py
```

### Quarterly Tasks

```bash
# Full system audit
python scripts/full_system_audit.py

# Check for deprecated patterns
python agents/find_deprecated_patterns.py

# Update documentation templates
uv run autogenerateagentsmd --output-style comprehensive ../agents/
```

---

## 🎯 Integration with CI/CD

### GitHub Actions Example

```yaml
# .github/workflows/generate-agents.yml
name: Generate Agent Schemas

on:
  push:
    paths:
      - 'agents/**'
      - 'Knowledge/**'
      - 'GenerateAgents/.env'

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install uv
        run: curl -LsSf https://astral.sh/uv/install.sh | sh
      
      - name: Install Python 3.12
        uses: actions/setup-python@v4
        with:
          python-version: '3.12'
      
      - name: Configure GenerateAgents
        env:
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: |
          cd GenerateAgents
          cp ../.env.example .env
          echo "GEMINI_API_KEY=$GEMINI_API_KEY" >> .env
      
      - name: Generate AGENTS.md
        run: |
          cd GenerateAgents
          uv sync --extra dev
          uv run autogenerateagentsmd ../agents/
      
      - name: Extract Schema
        run: |
          cd agents
          python extract_agent_schema.py
      
      - name: Commit & Push
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add -A
          git commit -m "Auto-generate AGENTS.md schemas" || true
          git push
```

---

## 📚 Key Resources

### GenerateAgents Documentation
- **Repository**: https://github.com/originalankur/GenerateAgents.md
- **README**: Installation, quick start, command reference
- **AGENTS.md**: Auto-generated guide for GenerateAgents itself

### n8n Integration
- **n8n MCP Tools**: Available via `mcp_n8n-mcp_*` functions
- **n8n Editor**: http://localhost:5678 (run n8n first)
- **Template Library**: 2,709+ templates available

### LLM Documentation
- **DSPy**: Framework for prompt optimization
- **LiteLLM**: Unified API for multiple LLM providers
- **Gemini**: https://aistudio.google.com

### Your System Documentation
- **Traceability System**: `README.md`
- **n8n Setup**: `N8N_SETUP.md`
- **Workflow Schema Guide**: `N8N_WORKFLOW_AGENT_SCHEMA.md`
- **Agent Implementation**: `AGENT_SCHEMA_IMPLEMENTATION.md`

---

## 🔐 Security Notes

### API Key Safety

```bash
# ✅ DO: Add to .env (gitignored)
echo "GEMINI_API_KEY=sk-..." >> .env

# ❌ DON'T: Commit API keys to git
git add .env  # Will fail - .env is in .gitignore

# ✅ DO: Use environment variables in CI/CD
# GitHub Secrets → Environment Variables
env:
  GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
```

### Cost Control

```bash
# Gemini (Google AI Studio)
# - Free: 60 requests/minute, 1M tokens/month
# - No cost for standard use
# - Monitor: https://aistudio.google.com/account

# OpenAI (GPT-5.2)
# - ~$0.15 per 1K input tokens
# - ~$0.60 per 1K output tokens
# - Set spending limits: https://platform.openai.com/account/billing/limits

# Anthropic (via DeepSeek)
# - ~$0.50 per 1M input tokens
# - ~$2.00 per 1M output tokens
# - Most economical for long documents
```

---

## 📞 Getting Help

### If Analysis Fails

1. Check API key: `python -c "import os; from dotenv import load_dotenv; load_dotenv('GenerateAgents/.env'); print(os.getenv('GEMINI_API_KEY')[:10])"`
2. Test API: Use Gemini directly at https://aistudio.google.com
3. Check logs: `uv run autogenerateagentsmd --verbose ../agents/`
4. Review errors in terminal output

### If n8n Workflow Generation Fails

1. Validate workflow JSON: `mcp_n8n-mcp_validate_workflow(workflow)`
2. Check individual nodes: `mcp_n8n-mcp_validate_node(nodeType, config)`
3. Use auto-fix: `mcp_n8n-mcp_n8n_autofix_workflow(id, applyFixes=True)`
4. Consult n8n docs: `mcp_n8n-mcp_get_node(nodeType='...', mode='docs')`

### Documentation Issues

1. Check generated AGENTS.md: `GenerateAgents/projects/agents/AGENTS.md`
2. Review agent code comments
3. Regenerate with `--verbose` flag
4. Check project's `.github/copilot-instructions.md`

---

## ✅ Setup Completion Checklist

- [x] GenerateAgents cloned to `/GenerateAgents`
- [x] `.env` file configured with API keys
- [x] Dependencies installing via `uv sync`
- [x] Integration plan documented
- [x] n8n workflow schema defined
- [x] Agent schema implementation guide created
- [x] Configuration & operations guide ready
- [ ] First `AGENTS.md` generated
- [ ] Initial schema extraction completed
- [ ] n8n workflows auto-generated
- [ ] Knowledge base linked
- [ ] CI/CD pipeline set up (optional)

---

**Status**: Ready for production use  
**Last Updated**: March 5, 2026  
**Owner**: Dylan  
**Next Step**: Run first analysis with `uv run autogenerateagentsmd ../agents/`
