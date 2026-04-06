# Quick Reference Card - GenerateAgents Integration
# ==================================================

## 🚀 First Run (Copy & Paste)

```bash
# Navigate to GenerateAgents
cd c:\Users\dylan.a.thomas\Projects\VSCode_March26\GenerateAgents

# Install dependencies (if not done)
uv sync --extra dev

# Generate AGENTS.md for your agents
uv run autogenerateagentsmd ../agents/

# Check output
code projects/agents/AGENTS.md
```

---

## 📚 Documentation Index

| Document | Purpose | Time to Read |
|----------|---------|--------------|
| `GENERATEAGENTS_INTEGRATION_SUMMARY.md` | **START HERE** - Overview & quick start | 10 min |
| `GENERATEAGENTS_INTEGRATION_PLAN.md` | Complete 7-phase roadmap | 15 min |
| `GENERATEAGENTS_CONFIG_OPERATIONS.md` | Day-to-day operations & troubleshooting | 20 min |
| `AGENT_SCHEMA_IMPLEMENTATION.md` | Step-by-step implementation guide | 25 min |
| `N8N_WORKFLOW_AGENT_SCHEMA.md` | n8n workflow schema definitions | 15 min |

---

## 🔑 API Keys (Already Configured)

```bash
GEMINI_API_KEY=AIzaSyBGrnwDgT-8orWmcKQjRvITP7eYwvXCqls    ✅ Primary
OPENAI_API_KEY=sk-proj-owZKPL5Lj_im9pPkuY...              ✅ Fallback
ANTHROPIC_API_KEY=sk-c311a2205b4946d18e...                ✅ Fallback
```

Location: `GenerateAgents/.env` (already configured)

---

## 🛠️ Essential Commands

### Generate Documentation
```bash
# Local repository
uv run autogenerateagentsmd ../agents/

# GitHub repository
uv run autogenerateagentsmd --github-repository https://github.com/n8n-io/n8n

# Specific model
uv run autogenerateagentsmd --model openai/gpt-5.2 ../agents/

# Strict mode (rules only)
uv run autogenerateagentsmd --output-style strict ../agents/
```

### Extract Schema
```bash
cd ../agents
python extract_agent_schema.py
# Output: schemas/agent_schema.json
```

### Validate Workflow
```python
# In your Python script
mcp_n8n-mcp_validate_workflow(workflow_json)
mcp_n8n-mcp_n8n_autofix_workflow(id='workflow-id', applyFixes=True)
```

### Deploy Workflow
```python
mcp_n8n-mcp_n8n_create_workflow(
    name='My Workflow',
    nodes=[...],
    connections={...}
)
```

---

## 🎯 Workflow Template

```
1. Generate AGENTS.md
   └─ uv run autogenerateagentsmd ../agents/

2. Extract Schema
   └─ python agents/extract_agent_schema.py

3. Generate Workflow
   └─ python agents/workflow_generator_from_schema.py

4. Validate
   └─ mcp_n8n-mcp_validate_workflow(workflow_json)

5. Deploy
   └─ mcp_n8n-mcp_n8n_create_workflow(**workflow_json)

6. Track
   └─ Link to PostgreSQL audit trail
```

---

## 📁 Key Directories

```
GenerateAgents/
├─ src/autogenerateagentsmd/     # Core tool code
├─ projects/                      # Generated outputs
│  ├─ agents/                     # Your agent AGENTS.md
│  ├─ n8n-workflows/              # Workflow patterns
│  └─ n8n/                        # n8n framework analysis
├─ .env                           # API keys
└─ pyproject.toml                 # Dependencies

agents/                           # Your agent implementations
├─ schemas/                       # Generated schemas
├─ extract_agent_schema.py        # Schema extraction script
├─ workflow_generator_...py       # Workflow generation
└─ validate_agent_schema.py       # Validation script
```

---

## 🔍 Troubleshooting Quick Links

| Problem | Solution | Reference |
|---------|----------|-----------|
| "ModuleNotFoundError: dspy" | `uv sync --extra dev` | CONFIG_OPS.md → Issue 1 |
| "API key not found" | Check `.env` file | CONFIG_OPS.md → Issue 2 |
| "Rate limit exceeded" | Wait 1 hour or change model | CONFIG_OPS.md → Issue 3 |
| "Repository too large" | Increase timeout | CONFIG_OPS.md → Issue 4 |
| "Workflow validation fails" | Use `autofix_workflow()` | CONFIG_OPS.md → Issue 5 |

---

## 📊 Expected Outputs

After running `uv run autogenerateagentsmd ../agents/`:

```
GenerateAgents/projects/agents/
├── AGENTS.md                    ← Read this for full documentation
├── AGENTS_strict.md             ← Rules only (concise)
└── schemas/
    ├── agent_schema.json        ← Use for validation
    ├── workflow_schema.json     ← Use for workflow generation
    └── mcp_tool_mappings.json   ← MCP tool references
```

---

## ✅ Pre-Deployment Checklist

- [ ] GenerateAgents installed (`GenerateAgents/*.py` exists)
- [ ] `.env` configured with API keys
- [ ] `uv sync --extra dev` completed
- [ ] First test: `uv run autogenerateagentsmd ../agents/`
- [ ] AGENTS.md generated in projects/agents/
- [ ] Schema extracted to agents/schemas/
- [ ] Workflow generated and validated
- [ ] n8n-MCP tools accessible
- [ ] Can deploy with `create_workflow()`

---

## 🎓 Learning Path (Newcomers)

**If you're new to this system**, follow this sequence:

1. **Read**: `GENERATEAGENTS_INTEGRATION_SUMMARY.md` (10 min)
2. **Understand**: How `GenerateAgents` works (5 min)
3. **Run**: First generation command (5 min)
4. **Review**: Generated `AGENTS.md` file (10 min)
5. **Learn**: `GENERATEAGENTS_CONFIG_OPERATIONS.md` (20 min)
6. **Implement**: Extract schema and generate workflow (30 min)
7. **Deploy**: Use n8n-MCP tools to create workflow (15 min)

**Total time**: ~95 minutes to productive use

---

## 🔗 Integration Points

```
Your Code
    ↓
[GenerateAgents]
    ↓
AGENTS.md + Schemas
    ↓
[agents/workflow_generator.py]
    ↓
Workflow JSON
    ↓
[mcp_n8n-mcp_validate_workflow]
    ↓
[mcp_n8n-mcp_create_workflow]
    ↓
n8n Production
    ↓
[Traceability System - PostgreSQL]
```

---

## 📞 Get Help

**Issue with GenerateAgents itself?**
- Check: `GENERATEAGENTS_CONFIG_OPERATIONS.md` → Troubleshooting
- Or: https://github.com/originalankur/GenerateAgents.md/issues

**Issue with n8n workflows?**
- Check: `N8N_WORKFLOW_AGENT_SCHEMA.md` → Validation section
- Or: http://localhost:5678 (n8n UI)

**Issue with agent schema?**
- Check: `AGENT_SCHEMA_IMPLEMENTATION.md` → Validation section
- Test: `agents/validate_agent_schema.py`

**Issue with integration?**
- Check: `GENERATEAGENTS_INTEGRATION_PLAN.md` → Phase-by-phase
- Review: `GENERATEAGENTS_INTEGRATION_SUMMARY.md` → Support section

---

## 🎯 Common Use Cases

### Use Case 1: Document New Agent
```bash
# 1. Write your agent code in agents/
# 2. Generate documentation
uv run autogenerateagentsmd ../agents/
# 3. Review: GenerateAgents/projects/agents/AGENTS.md
# 4. Extract schema
python agents/extract_agent_schema.py
```

### Use Case 2: Create n8n Workflow from Agent
```bash
# 1. Have agent schema (from above)
# 2. Generate workflow
python agents/workflow_generator_from_schema.py
# 3. Validate
mcp_n8n-mcp_validate_workflow(workflow)
# 4. Deploy
mcp_n8n-mcp_create_workflow(**workflow)
```

### Use Case 3: Update Workflow Patterns
```bash
# Analyze latest n8n features
uv run autogenerateagentsmd --github-repository https://github.com/n8n-io/n8n
# Review: GenerateAgents/projects/n8n/AGENTS.md
# Update your workflow templates accordingly
```

### Use Case 4: Audit All Agents
```bash
# Generate fresh AGENTS.md
uv run autogenerateagentsmd --force-refresh ../agents/
# Review generated documentation
# Compare with actual implementation
# Update code if patterns diverged
```

---

## 📈 Maintenance Schedule

| Frequency | Task | Command |
|-----------|------|---------|
| Daily | Check if schemas are fresh | `python agents/check_schema_freshness.py` |
| Weekly | Regenerate if code changed | `uv run autogenerateagentsmd --force-refresh ../agents/` |
| Monthly | Analyze latest n8n | `uv run autogenerateagentsmd --github-repository https://github.com/n8n-io/n8n` |
| Quarterly | Full system audit | `python scripts/full_system_audit.py` |

---

## 🎁 Bonus Resources

- **GenerateAgents GitHub**: https://github.com/originalankur/GenerateAgents.md
- **DSPy Docs**: https://github.com/stanfordnlp/dspy
- **n8n Editor**: http://localhost:5678
- **Gemini API**: https://aistudio.google.com
- **Context7**: https://context7.io

---

**Created**: March 5, 2026  
**For**: Quick reference during daily operations  
**Keep**: Bookmarked or printed for easy access  

🚀 **Ready to go!**
