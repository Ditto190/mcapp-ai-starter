# n8n Workflow Node Configuration Guide

## GenerateAgents AGENTS.md Generator Workflow

This document provides **exact node configurations** for implementing the GenerateAgents pipeline in n8n.

---

## Workflow Overview

**Total Nodes:** 10  
**Estimated Execution Time:** 10-30 minutes (depending on repository size)  
**Ollama Model:** llama3.2  
**Output:** `./projects/{repo_name}/AGENTS.md`

---

## Node-by-Node Configuration

### Node 1: Manual Trigger

**Type:** `n8n-nodes-base.manualTrigger`  
**Version:** 1  
**Position:** [250, 300]

**Configuration:**

```json
{
  "parameters": {
    "values": {
      "string": [
        {
          "name": "github_url",
          "value": "https://github.com/pallets/flask"
        },
        {
          "name": "style",
          "value": "comprehensive"
        },
        {
          "name": "repo_name",
          "value": ""
        }
      ],
      "boolean": [
        {
          "name": "analyze_git_history",
          "value": false
        }
      ]
    }
  }
}
```

**Purpose:** Trigger workflow with input parameters

**Outputs:**
- `github_url`: GitHub repository URL
- `style`: "comprehensive" or "strict"
- `analyze_git_history`: true/false flag
- `repo_name`: Auto-extracted from URL (empty = auto-detect)

---

### Node 2: Set Variables

**Type:** `n8n-nodes-base.set`  
**Version:** 3.4  
**Position:** [450, 300]

**Configuration:**

```json
{
  "parameters": {
    "mode": "manual",
    "duplicateItem": false,
    "assignments": {
      "assignments": [
        {
          "id": "1",
          "name": "repo_name",
          "value": "={{ $json.github_url.split('/').pop().replace('.git', '') }}",
          "type": "string"
        },
        {
          "id": "2",
          "name": "repo_path",
          "value": "=/tmp/repo_{{ $now.toUnixInteger() }}",
          "type": "string"
        },
        {
          "id": "3",
          "name": "timestamp",
          "value": "={{ $now.toISO() }}",
          "type": "string"
        }
      ]
    }
  }
}
```

**Purpose:** Extract repository name and prepare paths

**Outputs:**
- `repo_name`: Extracted from URL (e.g., "flask")
- `repo_path`: Temporary clone directory
- `timestamp`: ISO timestamp for this run

---

### Node 3: Git Clone

**Type:** `n8n-nodes-base.git`  
**Version:** 1.1  
**Position:** [650, 300]

**Configuration:**

```json
{
  "parameters": {
    "authentication": "none",
    "operation": "clone",
    "sourceRepository": "={{ $json.github_url }}",
    "repositoryPath": "={{ $json.repo_path }}"
  }
}
```

**Purpose:** Clone GitHub repository to temporary directory

**Credentials:** None required for public repos

**Error Handling:** 
- Add "Continue On Fail" toggle: true
- Connect to error handling branch (optional)

---

### Node 4: IF - Check Git History Flag

**Type:** `n8n-nodes-base.if`  
**Version:** 2.2  
**Position:** [850, 300]

**Configuration:**

```json
{
  "parameters": {
    "conditions": {
      "boolean": [
        {
          "value1": "={{ $json.analyze_git_history }}",
          "value2": true
        }
      ]
    }
  }
}
```

**Purpose:** Route workflow based on git history analysis flag

**Connections:**
- **TRUE branch** → Node 5 (Git History Extraction)
- **FALSE branch** → Node 6 (Source Tree Loading)

---

### Node 5: Execute Command - Git History

**Type:** `n8n-nodes-base.executeCommand`  
**Version:** 1  
**Position:** [1050, 200]  
**Connected From:** Node 4 (TRUE branch)

**Configuration:**

```json
{
  "parameters": {
    "command": "cd {{ $json.repo_path }} && git log --grep=revert -n 500 --format='%H|%ai|%s|%an' --name-status"
  }
}
```

**Purpose:** Extract reverted commits from git history

**Output Format:**
```
commit_hash|date|subject|author
M       file1.py
D       file2.py
```

**Error Handling:** Continue on fail (no reverted commits found is acceptable)

---

### Node 6: Code (Python) - Load Source Tree

**Type:** `n8n-nodes-base.code`  
**Version:** 2  
**Position:** [1050, 400]  
**Connected From:** Node 4 (FALSE branch) AND Node 5

**Configuration:**

```json
{
  "parameters": {
    "language": "pythonNative",
    "mode": "runOnceForAllItems",
    "pythonCode": "# See Python code below"
  }
}
```

**Python Code:**

```python
import os
from pathlib import Path

def load_source_tree(repo_path):
    """
    Load all relevant source files into a dictionary.
    Returns: {relative_path: file_content}
    """
    
    # File extensions to include
    EXTENSIONS = {
        '.py', '.js', '.ts', '.tsx', '.jsx', 
        '.java', '.go', '.rs', '.cpp', '.c', '.h',
        '.md', '.yaml', '.yml', '.json', '.toml',
        '.css', '.html', '.vue', '.rb', '.php',
        '.sql', '.sh', '.bash'
    }
    
    # Directories to exclude
    EXCLUDE_DIRS = {
        'node_modules', '.git', '__pycache__', 
        'venv', '.venv', 'env', '.env',
        'build', 'dist', 'target', 'out',
        '.pytest_cache', '.mypy_cache', '.tox',
        'coverage', '.coverage', 'htmlcov',
        'vendor', 'bower_components'
    }
    
    # Files to exclude by name
    EXCLUDE_FILES = {
        'package-lock.json', 'yarn.lock', 
        'Cargo.lock', 'poetry.lock',
        '.DS_Store', 'Thumbs.db'
    }
    
    source_tree = {}
    repo_path = Path(repo_path)
    
    if not repo_path.exists():
        raise FileNotFoundError(f"Repository path does not exist: {repo_path}")
    
    total_files = 0
    loaded_files = 0
    skipped_files = 0
    
    for root, dirs, files in os.walk(repo_path):
        # Filter out excluded directories in-place
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS and not d.startswith('.')]
        
        for file in files:
            total_files += 1
            file_path = Path(root) / file
            
            # Skip excluded files
            if file in EXCLUDE_FILES or file.startswith('.'):
                skipped_files += 1
                continue
            
            # Check if file extension is in our list
            if file_path.suffix.lower() not in EXTENSIONS:
                skipped_files += 1
                continue
            
            # Skip files larger than 1MB (likely binary or generated)
            try:
                if file_path.stat().st_size > 1_000_000:
                    skipped_files += 1
                    continue
            except:
                skipped_files += 1
                continue
            
            # Read file content
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                # Store relative path and content
                rel_path = file_path.relative_to(repo_path)
                source_tree[str(rel_path)] = content
                loaded_files += 1
                
            except Exception as e:
                # Skip files that can't be read
                skipped_files += 1
                continue
    
    return source_tree, {
        'total_files': total_files,
        'loaded_files': loaded_files,
        'skipped_files': skipped_files
    }

# n8n execution context
items = $input.all()
item = items[0].json

repo_path = item.get('repo_path')
repo_name = item.get('repo_name')
style = item.get('style', 'comprehensive')
analyze_git_history = item.get('analyze_git_history', False)

# Load source tree
source_tree, stats = load_source_tree(repo_path)

# Check if we have git history data
git_history_raw = item.get('stdout', '')  # From Execute Command node

# Return consolidated result
return [{
    'json': {
        'source_tree': source_tree,
        'repo_path': repo_path,
        'repo_name': repo_name,
        'style': style,
        'git_history_raw': git_history_raw,
        'stats': stats,
        'file_count': len(source_tree)
    }
}]
```

**Purpose:** Load all source files and prepare for LLM analysis

**Outputs:**
- `source_tree`: Dictionary of {filepath: content}
- `stats`: File loading statistics
- `file_count`: Total files loaded

---

### Node 7: Code (Python) - Prepare LLM Context

**Type:** `n8n-nodes-base.code`  
**Version:** 2  
**Position:** [1250, 400]

**Configuration:**

```json
{
  "parameters": {
    "language": "pythonNative",
    "mode": "runOnceForAllItems",
    "pythonCode": "# See Python code below"
  }
}
```

**Python Code:**

```python
import json

def chunk_source_tree(source_tree, max_chunk_size=50):
    """
    Split source tree into manageable chunks for LLM processing.
    Groups files by directory to maintain context.
    """
    chunks = []
    current_chunk = {}
    current_size = 0
    
    # Sort files by directory
    sorted_files = sorted(source_tree.items())
    
    for filepath, content in sorted_files:
        file_size = len(content)
        
        # If adding this file exceeds chunk size, start new chunk
        if current_size + file_size > max_chunk_size * 1024 and current_chunk:
            chunks.append(current_chunk)
            current_chunk = {}
            current_size = 0
        
        current_chunk[filepath] = content
        current_size += file_size
    
    # Add final chunk
    if current_chunk:
        chunks.append(current_chunk)
    
    return chunks

def create_analysis_prompt(source_tree, repo_name, style):
    """
    Create prompt for LLM convention extraction.
    """
    
    # Create file tree structure
    file_list = "\n".join([f"- {path}" for path in sorted(source_tree.keys())])
    
    # Select representative files for detailed analysis
    key_files = {}
    for path, content in source_tree.items():
        # Prioritize important files
        if any(name in path.lower() for name in [
            'readme', 'setup', 'package.json', 'pyproject.toml',
            'cargo.toml', 'go.mod', '__init__', 'main', 'index'
        ]):
            key_files[path] = content
        
        # Stop at 10 key files to avoid overwhelming LLM
        if len(key_files) >= 10:
            break
    
    # Add sample of regular files
    remaining = [item for item in source_tree.items() if item[0] not in key_files]
    for path, content in remaining[:5]:
        key_files[path] = content
    
    # Format files for prompt
    files_content = ""
    for path, content in key_files.items():
        # Truncate very long files
        truncated = content[:2000] + "...(truncated)" if len(content) > 2000 else content
        files_content += f"\n\n### File: {path}\n```\n{truncated}\n```"
    
    if style == "strict":
        prompt_template = f"""Analyze this codebase and extract ONLY critical constraints, anti-patterns, and undocumented quirks.

**Repository:** {repo_name}
**Total Files:** {len(source_tree)}

**File Structure:**
{file_list}

**Sample Files for Analysis:**
{files_content}

**TASK:** Extract information that an AI coding agent CANNOT easily determine by reading the code itself. Focus on:

1. **CRITICAL CONSTRAINTS:** Things that MUST be true or MUST NOT be done
2. **ANTI-PATTERNS:** Specific patterns to avoid, deprecated approaches, security concerns
3. **UNDOCUMENTED QUIRKS:** Hidden gotchas, implicit assumptions, edge cases
4. **TESTING REQUIREMENTS:** Mandatory tests, testing conventions that must be followed

**OUTPUT FORMAT:** Structured markdown with clear sections. Be specific and actionable.

Begin analysis:"""
    else:
        prompt_template = f"""Analyze this codebase and extract comprehensive documentation for an AI coding agent.

**Repository:** {repo_name}
**Total Files:** {len(source_tree)}

**File Structure:**
{file_list}

**Sample Files for Analysis:**
{files_content}

**TASK:** Extract the following information:

1. **Project Overview:** Purpose, domain, key features
2. **Tech Stack:** Languages, frameworks, libraries, tools (be specific with versions if visible)
3. **Architecture:** High-level patterns, module organization, data flow
4. **Code Style:** Naming conventions, formatting, import ordering, documentation style
5. **Anti-Patterns & Restrictions:** Things to avoid, deprecated patterns, security concerns
6. **Database & State:** Data storage, state management, schema conventions
7. **Error Handling:** Exception patterns, logging conventions
8. **Testing:** Test frameworks, commands, coverage requirements

**OUTPUT FORMAT:** Structured markdown with clear sections. Include specific examples from the code.

Begin analysis:"""
    
    return prompt_template

# n8n execution
items = $input.all()
item = items[0].json

source_tree = item['source_tree']
repo_name = item['repo_name']
style = item['style']

# Create analysis prompt
prompt = create_analysis_prompt(source_tree, repo_name, style)

# Prepare chunks if needed (for very large repos)
# For now, we'll process as single batch
# Future enhancement: implement chunking strategy

return [{
    'json': {
        'prompt': prompt,
        'source_tree': source_tree,
        'repo_name': repo_name,
        'style': style,
        'repo_path': item['repo_path'],
        'file_count': item['file_count'],
        'stats': item['stats']
    }
}]
```

**Purpose:** Prepare optimized prompt for Ollama LLM analysis

**Outputs:**
- `prompt`: Formatted prompt for convention extraction
- All previous context preserved

---

### Node 8: HTTP Request - Ollama Convention Extraction

**Type:** `n8n-nodes-base.httpRequest`  
**Version:** 4.2  
**Position:** [1450, 400]

**Configuration:**

```json
{
  "parameters": {
    "method": "POST",
    "url": "http://localhost:11434/api/generate",
    "authentication": "none",
    "sendBody": true,
    "bodyParameters": {
      "parameters": [
        {
          "name": "model",
          "value": "llama3.2"
        },
        {
          "name": "prompt",
          "value": "={{ $json.prompt }}"
        },
        {
          "name": "stream",
          "value": false
        },
        {
          "name": "options",
          "value": {
            "temperature": 0.7,
            "top_p": 0.9,
            "num_predict": 4096
          }
        }
      ]
    },
    "options": {
      "timeout": 300000
    }
  }
}
```

**Purpose:** Send prompt to Ollama and extract conventions

**Timeout:** 5 minutes (300 seconds)

**Error Handling:**
- Retry on failure: 2 attempts
- Wait between retries: 30 seconds

**Expected Output:**
```json
{
  "model": "llama3.2",
  "created_at": "2026-03-05T...",
  "response": "# Tech Stack\n\n- Python 3.12+\n- Flask 3.0...",
  "done": true
}
```

---

### Node 9: Code (Python) - Compile AGENTS.md

**Type:** `n8n-nodes-base.code`  
**Version:** 2  
**Position:** [1650, 400]

**Configuration:**

```json
{
  "parameters": {
    "language": "pythonNative",
    "mode": "runOnceForAllItems",
    "pythonCode": "# See Python code below"
  }
}
```

**Python Code:**

```python
import json
from datetime import datetime

def compile_agents_md(conventions_text, repo_name, style, stats):
    """
    Compile extracted conventions into final AGENTS.md format.
    """
    
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    header = f"""# AGENTS.md — {repo_name}

> **Generated:** {timestamp}  
> **Style:** {style}  
> **Files Analyzed:** {stats['loaded_files']} / {stats['total_files']}  
> **Generator:** n8n + Ollama (llama3.2)

---
"""
    
    # Add conventions from LLM
    body = conventions_text
    
    # Add footer with metadata
    footer = f"""

---

## Generation Metadata

**Source Repository:** {repo_name}  
**Analysis Date:** {timestamp}  
**Style Mode:** {style}  
**Total Files:** {stats['total_files']}  
**Analyzed Files:** {stats['loaded_files']}  
**Skipped Files:** {stats['skipped_files']}  
**LLM Model:** Ollama llama3.2  
**Generator:** n8n workflow automation  

---

*This document was automatically generated. Review and adjust as needed for your specific use case.*
"""
    
    agents_md = header + body + footer
    return agents_md

# n8n execution
items = $input.all()
item = items[0].json

# Extract LLM response
ollama_response = item.get('response', '')
if not ollama_response:
    ollama_response = item.get('body', {}).get('response', '')

repo_name = item['repo_name']
style = item['style']
stats = item.get('stats', {})

# Compile final AGENTS.md
agents_md_content = compile_agents_md(ollama_response, repo_name, style, stats)

return [{
    'json': {
        'agents_md_content': agents_md_content,
        'repo_name': repo_name,
        'style': style,
        'file_count': item['file_count'],
        'output_path': f"./projects/{repo_name}/AGENTS.md"
    }
}]
```

**Purpose:** Format LLM output into final AGENTS.md document

**Outputs:**
- `agents_md_content`: Complete AGENTS.md content
- `output_path`: Target file path

---

### Node 10: Execute Command - Save File

**Type:** `n8n-nodes-base.executeCommand`  
**Version:** 1  
**Position:** [1850, 400]

**Configuration:**

```json
{
  "parameters": {
    "command": "mkdir -p ./projects/{{ $json.repo_name }} && cat > ./projects/{{ $json.repo_name }}/AGENTS.md << 'AGENTS_EOF'\n{{ $json.agents_md_content }}\nAGENTS_EOF"
  }
}
```

**Purpose:** Create output directory and save AGENTS.md file

**Alternative (PowerShell for Windows):**

```json
{
  "parameters": {
    "command": "New-Item -Path './projects/{{ $json.repo_name }}' -ItemType Directory -Force; Set-Content -Path './projects/{{ $json.repo_name }}/AGENTS.md' -Value @'\n{{ $json.agents_md_content }}\n'@"
  }
}
```

**Outputs:**
- Command exit code
- File path verification

---

## Workflow Connections

**Connection Map:**

```
Node 1 (Manual Trigger)
  └─> Node 2 (Set Variables)
       └─> Node 3 (Git Clone)
            └─> Node 4 (IF - Git History)
                 ├─> TRUE:  Node 5 (Git History)
                 │           └─> Node 6 (Load Source Tree)
                 └─> FALSE: Node 6 (Load Source Tree)
                             └─> Node 7 (Prepare LLM Context)
                                  └─> Node 8 (Ollama Request)
                                       └─> Node 9 (Compile AGENTS.md)
                                            └─> Node 10 (Save File)
```

---

## Environment Configuration

### Required Environment Variables

Create `.env` file in n8n working directory:

```bash
# Ollama Configuration
OLLAMA_API_BASE=http://localhost:11434

# Optional: n8n Configuration
N8N_PAYLOAD_SIZE_MAX=104857600  # 100MB for large repos
N8N_LOG_LEVEL=info
```

### Ollama Configuration

Ensure Ollama is running and llama3.2 is available:

```bash
# Check Ollama health
curl http://localhost:11434/api/tags

# Expected response:
{
  "models": [
    {"name": "llama3.2:latest", ...}
  ]
}

# Pull model if not available
ollama pull llama3.2
```

---

## Testing Checklist

### Pre-Flight Checks

- [ ] Ollama is running on `http://localhost:11434`
- [ ] llama3.2 model is downloaded
- [ ] n8n has write permissions to `./projects/` directory
- [ ] Git is installed and accessible from n8n environment
- [ ] Workflow is saved and activated

### Test Execution

**Test Case 1: Small Repository**

Input:
```json
{
  "github_url": "https://github.com/kennethreitz/requests",
  "style": "comprehensive",
  "analyze_git_history": false
}
```

Expected Result:
- ✅ Repository cloned successfully
- ✅ ~50-100 files loaded
- ✅ Ollama responds within 2-3 minutes
- ✅ `./projects/requests/AGENTS.md` created
- ✅ File contains all required sections

**Test Case 2: Style Variant**

Input:
```json
{
  "github_url": "https://github.com/pallets/flask",
  "style": "strict",
  "analyze_git_history": false
}
```

Expected Result:
- ✅ Output focuses on constraints and anti-patterns only
- ✅ Sections: CRITICAL CONSTRAINTS, ANTI-PATTERNS, QUIRKS, TESTING

---

## Troubleshooting

### Issue 1: Git Clone Fails

**Symptoms:** "fatal: could not create work tree dir"

**Solution:**
- Check write permissions for `/tmp/` directory
- Use alternative path: `/var/n8n/repos/{{ $now.toUnixInteger() }}`
- Verify Git is installed: `git --version`

### Issue 2: Ollama Timeout

**Symptoms:** HTTP 504 or request timeout

**Solution:**
- Increase timeout in Node 8 to 600 seconds (10 minutes)
- Check Ollama logs: `docker logs ollama`
- Restart Ollama service
- Use smaller model: `llama3.2:1b` instead of `llama3.2`

### Issue 3: Empty AGENTS.md

**Symptoms:** File created but content is empty or truncated

**Solution:**
- Check Node 8 output for Ollama response
- Verify prompt length doesn't exceed model context window
- Implement chunking strategy in Node 7
- Check n8n payload size limit

### Issue 4: Python Code Node Fails

**Symptoms:** "Python execution failed"

**Solution:**
- Verify Python is installed in n8n environment
- Check Python version: `python3 --version` (requires 3.12+)
- Install missing libraries if needed
- Use JavaScript alternative for simple logic

---

## Performance Optimization

### Large Repository Handling

For repositories with >500 files:

1. **Implement Chunking:**
   - Split source tree into batches of 50 files
   - Process each chunk with separate Ollama calls
   - Merge results in final compilation step

2. **Parallel Processing:**
   - Use n8n Split In Batches node
   - Process multiple chunks in parallel (max 3 concurrent)
   - Aggregate results with Merge node

3. **Selective File Loading:**
   - Prioritize important files (README, setup files, main modules)
   - Skip test files and documentation for "strict" style
   - Use file size limits (skip files > 1MB)

---

## Next Steps

After completing this workflow configuration:

1. ✅ **Test with 3-5 sample repositories** of varying sizes
2. ✅ **Document any edge cases** encountered
3. ✅ **Create sub-workflow variants** for different repo types (Python, JavaScript, Go, etc.)
4. ✅ **Add webhook trigger** for API-based workflow invocation
5. ✅ **Implement error notifications** (Slack, email, etc.)

---

**Document Version:** 1.0  
**Created:** March 5, 2026  
**Author:** AI Agent Configuration Generator
