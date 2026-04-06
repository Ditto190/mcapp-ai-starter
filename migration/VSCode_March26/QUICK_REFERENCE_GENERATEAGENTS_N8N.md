# GenerateAgents n8n Integration - Quick Reference

## 📋 Overview

This quick reference provides everything needed to integrate GenerateAgents.md Python pipeline with n8n workflows using Ollama LLM.

---

## 🚀 Quick Start

### Option 1: Import Pre-built Workflow

1. **Import workflow JSON:**
   ```
   File: Knowledge/workflows/generateagents_basic_workflow.json
   ```

2. **In n8n UI:**
   - Click **"Import from File"**
   - Select `generateagents_basic_workflow.json`
   - Activate workflow

3. **Configure:**
   - Update Ollama endpoint if needed (default: `http://localhost:11434`)
   - Test with small repo: `https://github.com/kennethreitz/requests`

### Option 2: Manual Configuration

Follow detailed instructions in:
- **Architecture:** `GENERATEAGENTS_N8N_MAPPING.md`
- **Node Config:** `N8N_WORKFLOW_NODE_CONFIG.md`

---

## 📂 Project Files

| File | Purpose | Status |
|------|---------|--------|
| `GENERATEAGENTS_N8N_MAPPING.md` | High-level architecture & planning | ✅ Complete |
| `N8N_WORKFLOW_NODE_CONFIG.md` | Detailed node-by-node configuration | ✅ Complete |
| `Knowledge/workflows/generateagents_basic_workflow.json` | Importable n8n workflow | ✅ Ready to import |
| `GenerateAgents/` | Original Python codebase (fork) | ✅ Cloned |

---

## 🔧 Workflow Components

### 10-Node Pipeline

```
[1] Manual Trigger → Input: github_url, style, analyze_git_history
[2] Set Variables → Extract repo name, prepare paths
[3] Git Clone → Clone repository to /tmp/
[4] IF Node → Check git history flag
[5] Git History → Extract reverted commits (optional branch)
[6] Load Source Tree → Read all source files (Python)
[7] Prepare LLM Context → Format prompt for Ollama
[8] Ollama Request → Convention extraction (llama3.2)
[9] Compile AGENTS.md → Format final document
[10] Save File → Write to ./projects/{repo_name}/AGENTS.md
```

### Key Technologies

- **n8n Nodes:**
  - `n8n-nodes-base.git` (v1.1) - Repository cloning
  - `n8n-nodes-base.code` (v2) - Python/JavaScript execution
  - `n8n-nodes-base.httpRequest` (v4.2) - Ollama API calls
  - `n8n-nodes-base.executeCommand` (v1) - Shell commands
  - `n8n-nodes-base.if` (v2.2) - Conditional routing

- **LLM Integration:**
  - Ollama llama3.2 model
  - Endpoint: `http://localhost:11434/api/generate`
  - Context window: ~8K tokens
  - Temperature: 0.7

---

## ⚙️ Configuration

### Ollama Setup

```bash
# Check Ollama is running
curl http://localhost:11434/api/tags

# Expected response:
{
  "models": [
    {"name": "llama3.2:latest", ...}
  ]
}

# Pull model if needed
ollama pull llama3.2
```

### Environment Variables

Create `.env` in n8n working directory:

```bash
# Ollama
OLLAMA_API_BASE=http://localhost:11434

# n8n Configuration (optional)
N8N_PAYLOAD_SIZE_MAX=104857600  # 100MB
N8N_LOG_LEVEL=info
```

### Workflow Parameters

**Input (Manual Trigger):**

```json
{
  "github_url": "https://github.com/pallets/flask",
  "style": "comprehensive",  // or "strict"
  "analyze_git_history": false
}
```

**Output:**

```
File: ./projects/flask/AGENTS.md
Format: Markdown
Sections: 8-10 (depending on style)
Size: ~10-50 KB
```

---

## 🧪 Testing Strategy

### Phase 1: Component Testing

**Tasks 4-5: Repository Operations**
```bash
# Test repository: https://github.com/kennethreitz/requests
# Expected: ~100 files cloned to /tmp/repo_*
```

**Tasks 6-7: Source Tree Loading**
```bash
# Expected: Dictionary with 50-100 Python files
# Validation: Check for setup.py, requests/__init__.py
```

### Phase 2: LLM Integration

**Tasks 8-10: Ollama Convention Extraction**
```bash
# Test with small codebase (5-10 files)
# Expected: Tech stack, architecture, code style extracted
# Validation: Manual review of conventions quality
```

### Phase 3: End-to-End

**Tasks 11-12: Full Pipeline**
```bash
# Input: https://github.com/pallets/flask
# Expected: Complete AGENTS.md in ~10-15 minutes
# Validation:
#   ✓ File exists at ./projects/flask/AGENTS.md
#   ✓ Contains all required sections
#   ✓ Tech stack correctly identified (Python, Flask, Jinja2, etc.)
```

### Phase 4: Production

**Tasks 13-15: Advanced Features**
```bash
# Git history analysis enabled
# Large repo (Django): https://github.com/django/django
# Expected: Workflow completes within 30-60 minutes
```

---

## ✅ Validation Checklist

### Before First Run

- [ ] Ollama running on `http://localhost:11434`
- [ ] llama3.2 model downloaded: `ollama list`
- [ ] n8n has write permissions to `./projects/` directory
- [ ] Git installed and accessible: `git --version`
- [ ] Python 3.12+ available for Code nodes: `python3 --version`
- [ ] Workflow imported and activated in n8n

### After Each Test

- [ ] Repository cloned successfully to `/tmp/`
- [ ] Source files loaded (check file_count in output)
- [ ] Ollama response received (check HTTP 200 status)
- [ ] AGENTS.md file created in `./projects/{repo_name}/`
- [ ] Generated content is valid markdown
- [ ] All sections present (comprehensive: 8+ sections, strict: 4+ sections)

---

## 🐛 Troubleshooting

### Issue: Git Clone Fails

**Symptoms:** "fatal: could not create work tree dir"

**Solutions:**
1. Check `/tmp/` write permissions
2. Use alternative path: `/var/n8n/repos/`
3. Verify Git installed: `git --version`

### Issue: Ollama Timeout

**Symptoms:** HTTP 504 or request timeout after 5 minutes

**Solutions:**
1. Increase timeout in Node 8 to 600 seconds (10 minutes)
2. Check Ollama logs: `docker logs ollama`
3. Use smaller model: `llama3.2:1b`
4. Reduce context in Node 7 (fewer files in prompt)

### Issue: Python Code Node Fails

**Symptoms:** "Python execution failed"

**Solutions:**
1. Verify Python 3.12+ installed
2. Check for missing libraries
3. Review error logs in n8n execution view
4. Test Python code locally first

### Issue: Empty AGENTS.md

**Symptoms:** File created but empty or truncated

**Solutions:**
1. Check Node 8 output for Ollama response
2. Verify prompt doesn't exceed context window (8K tokens)
3. Check n8n payload size limit
4. Review Node 9 compilation logic

---

## 📊 Performance Expectations

| Repository Size | Files | Execution Time | Memory Usage |
|-----------------|-------|----------------|--------------|
| Small (requests) | ~100 | 5-10 minutes | 2 GB |
| Medium (flask) | ~300 | 10-20 minutes | 3 GB |
| Large (django) | ~1000 | 30-60 minutes | 4-5 GB |

**Bottlenecks:**
- Git clone: 1-2 minutes (network dependent)
- File loading: 10-30 seconds
- Ollama inference: 5-30 minutes (model dependent)
- File save: < 1 second

**Optimization Tips:**
1. Use local repos when possible (skip clone)
2. Implement chunking for large repos (>500 files)
3. Use llama3.2:1b for faster inference (lower quality)
4. Cache results to avoid re-analyzing same repos

---

## 🔄 TODO List Status

| ID | Task | Status | Validation |
|----|------|--------|------------|
| 1 | Document pipeline architecture | ✅ Complete | [GENERATEAGENTS_N8N_MAPPING.md](GENERATEAGENTS_N8N_MAPPING.md) |
| 2 | Map pipeline steps to nodes | ✅ Complete | [N8N_WORKFLOW_NODE_CONFIG.md](N8N_WORKFLOW_NODE_CONFIG.md) |
| 3 | Create workflow structure | ✅ Complete | [generateagents_basic_workflow.json](Knowledge/workflows/generateagents_basic_workflow.json) |
| 4 | Implement repository acquisition | ⏳ Ready | Test with Node 3 (Git Clone) |
| 5 | Test repository cloning | ⏳ Ready | Run workflow with test repo |
| 6 | Implement source tree loader | ⏳ Ready | Python code in Node 6 |
| 7 | Test source tree loading | ⏳ Ready | Validate file_count output |
| 8 | Configure Ollama Model node | ⏳ Ready | Node 8 HTTP Request configured |
| 9 | Implement convention extraction | ⏳ Ready | Node 7 prompt template |
| 10 | Test convention extraction | ⏳ Ready | Manual validation required |
| 11 | Implement AGENTS.md generation | ⏳ Ready | Node 9 compilation logic |
| 12 | Test full pipeline | ⏳ Ready | End-to-end test needed |
| 13 | Add git history analysis | ⏳ Ready | Node 5 branch implemented |
| 14 | Implement file save | ⏳ Ready | Node 10 command configured |
| 15 | Test end-to-end | ⏳ Ready | Full validation needed |
| 16 | Document configuration | ✅ Complete | This file + others |

**Next Action:** Import workflow and run Task 5 (test repository cloning)

---

## 📖 Additional Resources

### Documentation Files

1. **[GENERATEAGENTS_N8N_MAPPING.md](GENERATEAGENTS_N8N_MAPPING.md)**
   - Complete architecture overview
   - Alternative implementation approaches
   - Challenge mitigations
   - Success metrics

2. **[N8N_WORKFLOW_NODE_CONFIG.md](N8N_WORKFLOW_NODE_CONFIG.md)**
   - Exact node configurations
   - Python code for each node
   - Environment setup
   - Testing procedures

3. **[GenerateAgents README](GenerateAgents/README.md)**
   - Original Python CLI documentation
   - Model support (100+ LLM providers)
   - Style options (comprehensive vs strict)
   - Git history analysis feature

### External References

- **n8n Documentation:** https://docs.n8n.io/
- **Ollama API:** https://github.com/ollama/ollama/blob/main/docs/api.md
- **GenerateAgents GitHub:** https://github.com/originalankur/GenerateAgents.md
- **Our Fork:** https://github.com/Ditto190/GenerateAgents.md

---

## 🎯 Success Criteria

The GenerateAgents→n8n integration is **production-ready** when:

✅ **Functional:**
- [ ] Analyzes any public GitHub repository
- [ ] Generates valid AGENTS.md with all sections
- [ ] Supports "comprehensive" and "strict" styles
- [ ] Git history analysis works correctly

✅ **Quality:**
- [ ] 5+ test repos analyzed successfully
- [ ] Output quality matches Python CLI
- [ ] Execution time < 30 minutes for 500-file repos
- [ ] Error handling covers edge cases

✅ **Documentation:**
- [ ] Configuration documented (this file ✓)
- [ ] Testing procedures defined (this file ✓)
- [ ] Troubleshooting guide available (this file ✓)
- [ ] Example outputs provided

---

## 🚦 Getting Started Checklist

### Initial Setup (5 minutes)

1. [ ] Start Ollama: `ollama serve`
2. [ ] Verify llama3.2: `ollama list`
3. [ ] Import workflow: n8n UI → Import from File
4. [ ] Review input parameters in Node 1

### First Test Run (10-15 minutes)

1. [ ] Set test input:
   ```json
   {
     "github_url": "https://github.com/kennethreitz/requests",
     "style": "comprehensive",
     "analyze_git_history": false
   }
   ```

2. [ ] Execute workflow (click "Execute Workflow" button)

3. [ ] Monitor progress:
   - Watch Node 3 (Git Clone) - should take 1-2 minutes
   - Watch Node 8 (Ollama) - should take 5-10 minutes
   - Watch Node 10 (Save) - check for success

4. [ ] Verify output:
   ```bash
   ls -lh ./projects/requests/AGENTS.md
   cat ./projects/requests/AGENTS.md | head -50
   ```

### Production Deployment (1-2 hours)

1. [ ] Test with 3-5 different repositories
2. [ ] Document any errors or edge cases
3. [ ] Adjust prompts in Node 7 if needed
4. [ ] Configure webhook trigger for API access
5. [ ] Set up error notifications (Slack/email)
6. [ ] Create monitoring dashboard (optional)

---

## 💡 Pro Tips

### Prompt Engineering

**Node 7 (Prepare LLM Context)** contains the prompt template. Customize for better results:

- **For specific domains:** Add domain keywords to prioritize (e.g., "microservices", "ML pipeline")
- **For specific languages:** Adjust file filtering in Node 6
- **For better quality:** Increase key_files limit from 10 to 20 (slower but more accurate)

### Performance Tuning

**For large repositories:**
1. Implement batching in Node 6 (process 50 files at a time)
2. Use parallel Ollama calls with Split In Batches node
3. Cache analyzed files to avoid re-processing

**For faster results:**
1. Use llama3.2:1b model (faster, lower quality)
2. Reduce num_predict from 4096 to 2048 in Node 8
3. Skip git history analysis (set flag to false)

### Quality Improvements

**Better convention extraction:**
1. Add domain-specific examples to prompt
2. Increase temperature to 0.9 for more creative insights
3. Use multiple LLM calls for different aspects (tech stack, architecture, etc.)

**Better AGENTS.md format:**
1. Customize template in Node 9 (Compile AGENTS.md)
2. Add table of contents
3. Include mermaid diagrams for architecture

---

## 📞 Support & Contributions

### Questions or Issues?

1. Review troubleshooting section above
2. Check n8n execution logs
3. Test individual nodes in isolation
4. Review original GenerateAgents.md documentation

### Future Enhancements

Potential improvements:
- [ ] Web UI for workflow management
- [ ] Webhook API with authentication
- [ ] Support for private repositories (GitHub token)
- [ ] Multi-model support (GPT-4, Claude, Gemini)
- [ ] Vector database integration for codebase search
- [ ] Automatic AGENTS.md updates on repository changes

---

**Version:** 1.0  
**Created:** March 5, 2026  
**Last Updated:** March 5, 2026  
**Maintained By:** AI Agent + User Collaboration
