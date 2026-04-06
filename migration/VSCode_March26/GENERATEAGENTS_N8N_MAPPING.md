# GenerateAgents to n8n Workflow Mapping

## Project Overview

This document maps the **GenerateAgents.md** Python pipeline to **n8n workflows**, enabling automated AGENTS.md generation for any GitHub or local repository using n8n's visual workflow builder integrated with Ollama LLM.

---

## GenerateAgents Pipeline Architecture

### Core Pipeline Steps

```
1. Repository Acquisition
   ├─ GitHub: Clone via URL
   └─ Local: Use absolute path

2. Source Tree Loading
   ├─ Read all source files
   ├─ Filter relevant file types (.py, .js, .ts, .md, etc.)
   └─ Build dictionary: {filepath: content}

3. Convention Extraction (dspy.RLM)
   ├─ Recursively analyze codebase with LLM
   ├─ Extract: tech stack, architecture, code style, anti-patterns
   └─ Output: Structured markdown document

4. Optional: Git History Analysis
   ├─ Extract reverted commits (git log --grep=revert)
   ├─ Analyze diff patches with LLM
   └─ Extract: lessons learned, anti-patterns

5. AGENTS.md Generation
   ├─ Transform conventions into sections
   ├─ Apply style: comprehensive vs strict
   └─ Output: Final AGENTS.md content

6. Save to Disk
   └─ Write to: ./projects/{repo_name}/AGENTS.md
```

### Key Technologies
- **Python 3.12+** with dspy framework
- **LiteLLM**: 100+ LLM provider support (Gemini, Anthropic, OpenAI, **Ollama**)
- **dspy.RLM**: Recursive Language Models for deep codebase analysis
- **Git operations**: Repository cloning, history analysis

---

## n8n Node Mapping

### Available n8n Nodes for Implementation

| GenerateAgents Step | n8n Node Type | Node Package | Purpose |
|---------------------|---------------|--------------|---------|
| **Trigger** | Manual Trigger / Webhook | `n8n-nodes-base.manualTrigger` | Start workflow |
| **Repository Clone** | Git | `n8n-nodes-base.git` | Clone GitHub repo |
| **Alt: GitHub API** | GitHub Tool | `n8n-nodes-base.githubTool` | Fetch repo files via API |
| **Source Tree Loading** | Code (Python) | `n8n-nodes-base.code` | Read files recursively |
| **LLM Inference** | Ollama Model | `@n8n/n8n-nodes-langchain.lmOllama` | Convention extraction with Ollama |
| **Git History** | Execute Command | `n8n-nodes-base.executeCommand` | Run `git log --grep=revert` |
| **Data Transform** | Code (JavaScript/Python) | `n8n-nodes-base.code` | Format data, compile markdown |
| **File Write** | Execute Command / Code | `n8n-nodes-base.executeCommand` | Save AGENTS.md to disk |
| **HTTP Calls** | HTTP Request | `n8n-nodes-base.httpRequest` | Alternative GitHub API access |
| **Conditional Logic** | IF | `n8n-nodes-base.if` | Route based on style, git history flag |

---

## Detailed Workflow Design

### Workflow 1: Basic AGENTS.md Generation (GitHub)

**Input Parameters:**
- `github_url` (string): GitHub repository URL
- `style` (dropdown): "comprehensive" or "strict"
- `analyze_git_history` (boolean): Enable git history analysis

**Node Flow:**

```
1. Manual Trigger
   └─ Input Fields: github_url, style, analyze_git_history

2. Git Clone Node
   ├─ Operation: "clone"
   ├─ Source Repository: {{ $json.github_url }}
   ├─ New Repository Path: "/tmp/repo_{{ $now.toUnixInteger() }}"
   └─ Output: repo_path

3. IF Node: Check analyze_git_history
   ├─ TRUE → Go to Git History Analysis (Node 4)
   └─ FALSE → Skip to Source Tree Loading (Node 5)

4. Execute Command: Git History
   ├─ Command: "cd {{ $node["Git Clone"].json.repo_path }} && git log --grep=revert -n 500 --format='%H|%ai|%s' --name-status"
   └─ Output: git_history_raw

5. Code Node (Python): Load Source Tree
   ├─ Language: Python
   ├─ Mode: Run Once for All Items
   ├─ Code: (See implementation below)
   └─ Output: source_tree (dict)

6. Code Node (Python): Extract Conventions
   ├─ Language: Python
   ├─ Input: source_tree, style
   ├─ LLM Calls: Use HTTP Request to Ollama API
   ├─ Recursive processing logic
   └─ Output: conventions_markdown

7. Ollama Model Node: Convention Extraction
   ├─ Model: llama3.2
   ├─ Prompt: (See prompt template below)
   ├─ Input: source_tree chunks
   └─ Output: extracted_conventions

8. Code Node (Python): Compile AGENTS.md
   ├─ Input: conventions_markdown, repository_name, style
   ├─ Logic: Format sections, apply template
   └─ Output: agents_md_content

9. Execute Command: Save File
   ├─ Command: "mkdir -p ./projects/{{ $json.repo_name }} && echo '{{ $json.agents_md_content }}' > ./projects/{{ $json.repo_name }}/AGENTS.md"
   └─ Output: file_path

10. Webhook Response / Notification
    └─ Return: Success message with file path
```

---

## Implementation Details

### Node 5: Source Tree Loader (Python Code)

```python
import os
import json
from pathlib import Path

def load_source_tree(repo_path):
    """Load all relevant source files into a dictionary."""
    
    # File extensions to include
    EXTENSIONS = {
        '.py', '.js', '.ts', '.tsx', '.jsx', 
        '.java', '.go', '.rs', '.cpp', '.c', 
        '.md', '.yaml', '.yml', '.json', '.toml'
    }
    
    # Directories to exclude
    EXCLUDE_DIRS = {
        'node_modules', '.git', '__pycache__', 
        'venv', '.venv', 'build', 'dist', 
        '.pytest_cache', '.mypy_cache'
    }
    
    source_tree = {}
    repo_path = Path(repo_path)
    
    for root, dirs, files in os.walk(repo_path):
        # Filter out excluded directories
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        
        for file in files:
            file_path = Path(root) / file
            
            # Check if file extension is in our list
            if file_path.suffix.lower() in EXTENSIONS:
                try:
                    # Read file content
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Store relative path and content
                    rel_path = file_path.relative_to(repo_path)
                    source_tree[str(rel_path)] = content
                except Exception as e:
                    # Skip files that can't be read
                    continue
    
    return source_tree

# n8n execution
items = $input.all()
repo_path = items[0].json.repo_path

source_tree = load_source_tree(repo_path)

# Return result
return [{
    'json': {
        'source_tree': source_tree,
        'file_count': len(source_tree),
        'repo_path': repo_path
    }
}]
```

### Node 7: Convention Extraction Prompt Template

```
You are a technical documentation analyst. Analyze the provided codebase and extract:

**Source Tree:**
{source_tree_json}

**Repository Name:** {repo_name}

**Style:** {style}

Extract the following information:

1. **Tech Stack**: All programming languages, frameworks, libraries, and tools used
2. **Architecture**: High-level architectural patterns (MVC, microservices, monolith, etc.)
3. **Code Style**: Naming conventions, formatting rules, import ordering
4. **Anti-Patterns**: Things to avoid, deprecated patterns, security concerns
5. **Database & State**: Data storage solutions, state management approaches
6. **Testing**: Testing frameworks, commands, conventions

Output Format: Structured markdown with clear sections.

Style Guide:
- "comprehensive": Include detailed overviews, architecture diagrams, comprehensive examples
- "strict": Focus ONLY on constraints, anti-patterns, undocumented quirks, things the agent must never do

Begin analysis:
```

### Node 8: AGENTS.md Compilation Logic

```python
def compile_agents_md(sections, repo_name, style="comprehensive"):
    """Compile extracted sections into final AGENTS.md format."""
    
    if style == "strict":
        template = f"""# AGENTS.md — {repo_name}

## CRITICAL CONSTRAINTS

{sections.get('constraints', 'No specific constraints identified.')}

## ANTI-PATTERNS & RESTRICTIONS

{sections.get('anti_patterns', 'No anti-patterns documented.')}

## UNDOCUMENTED QUIRKS

{sections.get('quirks', 'No undocumented quirks identified.')}

## TESTING REQUIREMENTS

{sections.get('testing', 'Standard testing practices apply.')}
"""
    else:
        template = f"""# AGENTS.md — {repo_name}

## Project Overview

{sections.get('overview', 'Project overview pending.')}

## Tech Stack

{sections.get('tech_stack', 'Tech stack information pending.')}

## Architecture

{sections.get('architecture', 'Architecture details pending.')}

## Code Style

{sections.get('code_style', 'Code style guidelines pending.')}

## Anti-Patterns & Restrictions

{sections.get('anti_patterns', 'No anti-patterns documented.')}

## Database & State Management

{sections.get('database', 'No database information available.')}

## Error Handling & Logging

{sections.get('error_handling', 'Standard error handling applies.')}

## Testing Commands

{sections.get('testing', 'No testing commands documented.')}
"""
    
    return template

# n8n execution
items = $input.all()
sections = items[0].json.sections
repo_name = items[0].json.repo_name
style = items[0].json.style

agents_md = compile_agents_md(sections, repo_name, style)

return [{
    'json': {
        'agents_md_content': agents_md,
        'repo_name': repo_name,
        'timestamp': new Date().toISOString()
    }
}]
```

---

## Ollama Integration Strategy

### Configuration

Since we have **Ollama running in the n8n Codespace** (confirmed from memory):

**Ollama Endpoint:** `http://ollama:11434` (Docker network) or `http://localhost:11434` (local)

**Models Available:**
- llama3.2 (pre-loaded)
- Supports: llama3.2:1b, llama3.2:3b, codellama, mistral, etc.

### Ollama Model Node Configuration

```json
{
  "parameters": {
    "model": "llama3.2",
    "options": {
      "temperature": 0.7,
      "top_p": 0.9
    }
  },
  "credentials": {
    "ollamaApi": {
      "baseUrl": "http://ollama:11434"
    }
  }
}
```

### Alternative: HTTP Request to Ollama API

If Ollama Model node has issues, use direct HTTP requests:

```javascript
// Node: HTTP Request to Ollama
{
  "url": "http://ollama:11434/api/generate",
  "method": "POST",
  "body": {
    "model": "llama3.2",
    "prompt": "{{ $json.prompt }}",
    "stream": false,
    "options": {
      "temperature": 0.7
    }
  },
  "options": {
    "timeout": 120000
  }
}
```

---

## Testing Strategy

### Phase 1: Component Testing (Tasks 4-7)

**Test Case 1: Repository Cloning**
- Input: `https://github.com/pallets/flask`
- Expected: `/tmp/repo_*/` contains cloned Flask repository
- Validation: Check for `setup.py`, `src/`, `tests/` directories

**Test Case 2: Source Tree Loading**
- Input: Cloned Flask repository path
- Expected: Dictionary with ~200-300 files
- Validation: 
  - Check for key files: `src/flask/__init__.py`, `setup.py`
  - Verify file content is loaded
  - Exclude `node_modules`, `.git`, etc.

### Phase 2: LLM Integration Testing (Tasks 8-10)

**Test Case 3: Ollama Connectivity**
- Endpoint: `http://localhost:11434/api/generate`
- Payload: Simple prompt ("Hello world")
- Expected: Valid response from llama3.2
- Validation: Response contains `model`, `response` fields

**Test Case 4: Convention Extraction**
- Input: Small sample codebase (5-10 files)
- Prompt: Tech stack extraction
- Expected: Markdown with identified languages, frameworks
- Validation: Manually review extracted conventions

### Phase 3: Integration Testing (Tasks 11-12)

**Test Case 5: End-to-End Small Repo**
- Input: `https://github.com/kennethreitz/requests` (small Python lib)
- Style: "comprehensive"
- Expected: Complete AGENTS.md generated in ~5-10 minutes
- Validation:
  - File saved to `./projects/requests/AGENTS.md`
  - Contains all required sections
  - Tech stack correctly identified (Python, pytest, etc.)
  - No errors in workflow execution

### Phase 4: Advanced Features (Tasks 13-15)

**Test Case 6: Git History Analysis**
- Input: Repository with reverted commits
- Flag: `analyze_git_history: true`
- Expected: Additional "Lessons Learned" section in AGENTS.md
- Validation: Manually review extracted anti-patterns

**Test Case 7: Large Repository**
- Input: `https://github.com/django/django` (large codebase)
- Expected: Workflow completes successfully (may take 30-60 minutes)
- Validation:
  - Monitor for timeouts
  - Check memory usage
  - Verify output quality

---

## Validation Checkpoints

### Before Moving to Next Task

Each task must pass its validation criteria:

✅ **Task 4-5 (Git Operations)**
- [ ] Can clone GitHub repository successfully
- [ ] Repository path is accessible to subsequent nodes
- [ ] Git credentials (if needed) are configured

✅ **Task 6-7 (Source Tree Loading)**
- [ ] All relevant file types are loaded
- [ ] Excluded directories are properly filtered
- [ ] File content is correctly parsed (UTF-8 encoding)
- [ ] Dictionary structure matches expected format

✅ **Task 8-10 (Ollama Integration)**
- [ ] Ollama endpoint responds to health check
- [ ] llama3.2 model is available
- [ ] Can successfully send prompts and receive responses
- [ ] Responses are properly formatted

✅ **Task 11-12 (Full Pipeline)**
- [ ] All nodes execute in correct order
- [ ] Data passes correctly between nodes
- [ ] AGENTS.md is generated with all required sections
- [ ] Output file is saved to correct location

✅ **Task 13-15 (Production Readiness)**
- [ ] Git history analysis branch works correctly
- [ ] Error handling covers edge cases (empty repo, network failures, LLM timeouts)
- [ ] Workflow can be triggered via webhook with parameters
- [ ] Performance is acceptable for repos with 100-500 files

---

## Alternative Approaches

### Approach 1: Modular Sub-workflows

Break the main workflow into smaller, reusable sub-workflows:

1. **Repository Acquisition Workflow**
   - Input: github_url or local_path
   - Output: repo_path

2. **Source Tree Extraction Workflow**
   - Input: repo_path
   - Output: source_tree dictionary

3. **Convention Extraction Workflow** (with Ollama)
   - Input: source_tree, style
   - Output: conventions_markdown

4. **AGENTS.md Generation Workflow**
   - Input: conventions_markdown, repo_name, style
   - Output: agents_md_content

5. **File Save Workflow**
   - Input: agents_md_content, repo_name
   - Output: file_path

**Benefit:** Easier testing, debugging, and reusability

### Approach 2: Direct Python Code Node Implementation

Instead of distributing logic across multiple nodes, implement the entire GenerateAgents logic in a single Code (Python) node:

- **Pros:**
  - Leverage existing GenerateAgents codebase directly
  - Simpler workflow structure
  - Easier to port Python logic
  
- **Cons:**
  - Less visual clarity
  - Harder to debug individual steps
  - Requires Python dependencies (dspy, litellm) installed in n8n environment

### Approach 3: HTTP API Wrapper

Create a FastAPI/Flask wrapper around GenerateAgents Python CLI and call it from n8n:

- **n8n Workflow:**
  1. HTTP Request → POST to API with repo_url, style
  2. Wait for completion (webhook callback or polling)
  3. Retrieve generated AGENTS.md

- **External API:**
  - Runs GenerateAgents Python directly
  - Handles all LLM interactions
  - Returns AGENTS.md content

**Benefit:** Minimal changes to existing GenerateAgents code

---

## Next Steps & Recommendations

### Recommended Starting Point

**Start with Approach 1 (Modular Sub-workflows)** because:
1. Aligns with n8n best practices (visual, modular)
2. Easier to test individual components
3. Can reuse sub-workflows for other projects
4. Good learning path for n8n workflow design

### Priority Implementation Order

1. **Tasks 1-3**: Documentation and architecture planning ✅ (This document)
2. **Tasks 4-5**: Git operations (foundation for all testing)
3. **Tasks 6-7**: Source tree loading (validates data pipeline)
4. **Tasks 8-10**: Ollama integration (critical path for LLM features)
5. **Tasks 11-12**: Basic pipeline integration (MVP)
6. **Tasks 13-15**: Advanced features and production hardening

### Key Decision Points

**Decision 1: Python Code Node vs Pre-built Nodes**
- **Recommendation:** Use Code nodes for custom logic (source tree loading, markdown compilation)
- **Rationale:** GenerateAgents has domain-specific logic that doesn't map cleanly to pre-built nodes

**Decision 2: Ollama Direct vs LangChain Integration**
- **Recommendation:** Start with Ollama Model node, fallback to HTTP Request if needed
- **Rationale:** Ollama Model node provides better integration with n8n AI features

**Decision 3: Git Node vs Execute Command for Git Operations**
- **Recommendation:** Use Git node for clone, Execute Command for git history
- **Rationale:** Git node has better error handling; git log requires custom flags

---

## Expected Challenges & Mitigations

### Challenge 1: Large Codebases
**Issue:** Repositories with 1000+ files may overwhelm Ollama context window

**Mitigation:**
- Implement chunking strategy: split source_tree into batches
- Process top-level files first, then dive into subdirectories
- Use dspy.RLM pattern: recursive summarization

### Challenge 2: LLM Timeouts
**Issue:** Convention extraction may take 5-10 minutes per LLM call

**Mitigation:**
- Increase n8n node timeout to 300 seconds
- Implement retry logic with exponential backoff
- Add progress notifications (webhook callbacks)

### Challenge 3: File Encoding Issues
**Issue:** Some source files may have non-UTF-8 encoding

**Mitigation:**
- Add try-except in file reading logic
- Skip problematic files with logging
- Support chardet library for encoding detection

### Challenge 4: Ollama Memory Constraints
**Issue:** Running multiple concurrent LLM calls may exhaust Ollama memory

**Mitigation:**
- Serialize LLM calls (avoid parallel processing)
- Monitor Ollama container memory usage
- Use smaller models (llama3.2:1b) for testing

---

## Success Metrics

### Definition of Done

The GenerateAgents→n8n mapping is complete when:

✅ **Functional Requirements**
- [ ] Can analyze any public GitHub repository
- [ ] Generates valid AGENTS.md with all required sections
- [ ] Supports both "comprehensive" and "strict" styles
- [ ] Optional git history analysis works correctly

✅ **Quality Requirements**
- [ ] Workflow executes without errors for 5 different test repositories
- [ ] Generated AGENTS.md matches quality of Python CLI output
- [ ] Execution time is acceptable (< 30 minutes for repos with < 500 files)

✅ **Documentation Requirements**
- [ ] Workflow configuration is documented
- [ ] Testing procedures are documented
- [ ] Troubleshooting guide is created
- [ ] Example outputs are provided

---

## Resources & References

### n8n Documentation
- [Code Node Documentation](https://docs.n8n.io/code/builtin/)
- [Git Node Documentation](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.git/)
- [Ollama Model Node](https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.lmollama/)

### GenerateAgents Resources
- Repository: https://github.com/originalankur/GenerateAgents.md
- Fork: https://github.com/Ditto190/GenerateAgents.md
- Local Path: `C:\Users\dylan.a.thomas\Projects\VSCode_March26\GenerateAgents`

### Ollama Resources
- Codespace Endpoint: http://ollama:11434
- Available Models: llama3.2, codellama, mistral
- API Documentation: https://github.com/ollama/ollama/blob/main/docs/api.md

---

## Appendix: Workflow JSON Skeleton

```json
{
  "name": "GenerateAgents - AGENTS.md Generator",
  "nodes": [
    {
      "parameters": {
        "values": {
          "string": [
            {"name": "github_url", "value": ""},
            {"name": "style", "value": "comprehensive"}
          ],
          "boolean": [
            {"name": "analyze_git_history", "value": false}
          ]
        }
      },
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [250, 300]
    },
    {
      "parameters": {
        "operation": "clone",
        "sourceRepository": "={{ $json.github_url }}",
        "repositoryPath": "/tmp/repo_{{ $now.toUnixInteger() }}"
      },
      "name": "Git Clone",
      "type": "n8n-nodes-base.git",
      "typeVersion": 1.1,
      "position": [450, 300]
    }
  ],
  "connections": {
    "Manual Trigger": {
      "main": [[{"node": "Git Clone", "type": "main", "index": 0}]]
    }
  }
}
```

---

**Document Version:** 1.0  
**Created:** March 5, 2026  
**Last Updated:** March 5, 2026  
**Author:** AI Agent + User Collaboration
