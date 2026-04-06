# Agent Skills Analysis & Integration Plan

**Session**: March 5, 2026  
**Status**: Repository cloned & analyzed  
**Cloned From**: 
- https://github.com/agentskills/agentskills.git → `agent-skills/`
- skills-ref reference implementation included in main repo

---

## Executive Summary

Agent Skills is an **open format by Anthropic** for giving LLM agents new capabilities. The `skills-ref` library is a **reference Python implementation** with CLI and Python API for:
- **Validating** skill definitions
- **Parsing** SKILL.md frontmatter
- **Generating** XML prompt blocks for agent integration

### Key Finding: Skills use YAML frontmatter in SKILL.md files
```yaml
---
name: skill-name
description: What this skill does
license: Apache-2.0  # optional
compatibility: Claude 3.5+  # optional
allowed-tools: python,bash  # experimental
metadata:
  category: data-processing  # custom key-value pairs
---
[Skill instructions in Markdown]
```

---

## Repository Structure

### Main Repo (agent-skills/)
```
agent-skills/
├── README.md              → Overview of Agent Skills format
├── package.json           → JavaScript/TypeScript project setup
├── docs/                  → Full documentation
├── skills-ref/            → Reference Python implementation
└── .claude/               → Claude-specific configuration
```

### Skills-Ref Implementation (agent-skills/skills-ref/)
```
skills-ref/
├── src/skills_ref/
│   ├── models.py          → SkillProperties dataclass
│   ├── parser.py          → YAML frontmatter parser
│   ├── validator.py       → Validation rules
│   ├── prompt.py          → XML prompt generation
│   ├── cli.py             → CLI commands
│   └── errors.py          → Custom exceptions
├── tests/                 → Test suite
├── pyproject.toml         → Python project config
└── README.md              → Installation & usage
```

---

## Core Components Analysis

### 1. Data Model (models.py)

**SkillProperties** - Required & optional fields:

```python
@dataclass
class SkillProperties:
    # REQUIRED
    name: str                               # kebab-case
    description: str                        # When to use this skill
    
    # OPTIONAL
    license: Optional[str] = None           # Apache-2.0, MIT, etc.
    compatibility: Optional[str] = None     # Claude 3.5+, GPT-4, etc.
    allowed_tools: Optional[str] = None     # Tool patterns (experimental)
    metadata: dict[str, str] = {}           # Custom key-value pairs
```

**Key methods**:
- `to_dict()` - Exports as dict, excludes None values, includes metadata only if non-empty

### 2. Parser (parser.py)

**Responsibilities**:
- Find SKILL.md (or skill.md) in skill directory
- Extract YAML frontmatter (content between `---` markers)
- Parse YAML using `strictyaml` library
- Extract metadata dict + markdown body

**Key functions**:
- `find_skill_md(skill_dir)` - Locates SKILL.md file
- `parse_frontmatter(content)` - Splits YAML from markdown
- `read_properties(skill_dir)` - Returns SkillProperties object

**Error handling**:
- `ParseError` - SKILL.md missing or invalid YAML
- `ValidationError` - Missing required fields (name, description)

### 3. Validator (validator.py)

*Content to be explored - likely validates:*
- Name format (kebab-case required)
- Description length/content
- License validity
- Metadata key-value pairs
- File structure

### 4. Prompt Integration (prompt.py)

**Output Format**: XML block for agent system prompts

```xml
<available_skills>
  <skill>
    <name>skill-name</name>
    <description>What this skill does</description>
    <location>/path/to/skill/SKILL.md</location>
  </skill>
</available_skills>
```

This XML tells agents where to find full instructions (`<location>` is key).

### 5. CLI Interface (cli.py)

**Commands**:
```bash
# Validate a skill directory
skills-ref validate path/to/skill

# Read and output properties as JSON
skills-ref read-properties path/to/skill

# Generate XML prompt block for multiple skills
skills-ref to-prompt skill-a/ skill-b/
```

---

## Integration Points with AgentSpec Compiler

### Current AgentSpec Status (Phase 1 Complete)
- ✅ Parser: .agentspec → AST
- ✅ Emitter: AST → YAML+Markdown (VSCode agent format)
- ✅ CLI: compile, lint, watch, init commands
- ✅ POC: Successfully compiled python-mcp-expert.agentspec

### Proposed Integration (Phase 2+)

**1. Skill Definition Extension**
- Extend AgentSpec with `@skill` decorator blocks
- Map Agent Skills properties to AgentSpec syntax
- Example:
  ```typescript
  @skill
  @skillName("data-processor")
  @description("Process and transform data")
  @license("Apache-2.0")
  skill DataProcessor {
    instructions: "...";
    inputs: ["csv", "json"];
    outputs: ["processed-data"];
  }
  ```

**2. Skill Library Emitter**
- Create `SkillLibraryEmitter` class
- Generates standard SKILL.md files with YAML frontmatter
- Follows Agent Skills specification exactly
- Output: Valid skill directories compatible with skills-ref validator

**3. Validation Integration**
- Reuse skills-ref `validator.py` logic
- Extend AgentSpec validator with skill-specific rules
- Call `skills-ref validate` on generated skills
- Report errors back to CLI

**4. Prompt Generation**
- Extend VSCode emitter to generate XML blocks
- Reuse `prompt.py` from skills-ref
- Generate `<available_skills>` XML for agent system prompts

**5. Multi-Format Support**
```
AgentSpec Definition
    ↓
    ├→ VSCode Agent (.agent.md)
    ├→ MCP Python Server
    ├→ MCP TypeScript Server
    ├→ n8n Workflow
    └→ Agent Skills (SKILL.md + XML prompt)
```

---

## Technical Decisions

### Key Findings
1. **YAML frontmatter pattern**: Skills use strict YAML in `---` blocks
2. **Kebab-case naming**: skill-names must be lowercase with hyphens
3. **Markdown body**: Rest of SKILL.md is regular markdown instructions
4. **XML integration**: Skills exposed to agents via `<available_skills>` XML
5. **Validation-first**: skills-ref validates before prompt generation

### Recommended Approach
- **Short-term**: Create AgentSpec skill syntax + SkillLibraryEmitter
- **Medium-term**: Integrate validator pipeline with skills-ref
- **Long-term**: Support skill composition and inheritance

---

## Files to Examine Next

**Phase 2 Research Tasks**:
1. `agent-skills/skills-ref/src/skills_ref/validator.py`
   - Understanding full validation rules
   - Name format requirements
   - Metadata constraints

2. `agent-skills/skills-ref/src/skills_ref/prompt.py`
   - XML generation algorithm
   - How location paths are resolved
   - Multi-skill aggregation

3. `agent-skills/docs/`
   - Full Agent Skills specification
   - Allowed tools syntax
   - Compatibility field standardization

4. `agent-skills/examples/` (if present)
   - Real skill examples
   - Directory structure templates
   - Best practices

---

## Architecture Alignment

### Agent Skills → AgentSpec Compiler Mapping

| Agent Skills | AgentSpec | Output Format |
|---|---|---|
| SKILL.md YAML | @skill decorator block | SKILL.md file |
| name field | @skillName() | Kebab-case naming |
| description | @description() | Agent prompt text |
| license | @license() | Metadata field |
| compatibility | @compatibility() | Model targeting |
| allowed_tools | @tools() | Capability list |
| metadata | @metadata() | Custom properties |

---

## Next Steps (Week 2 - Phase 2)

### T8: Build MCP Python Emitter (PRIORITY: Adjust for Skills)
- Consider skills-ref integration early
- Map capabilities to skill inputs/outputs
- Generate FastMCP server + SKILL.md pair

### T13: Create Skill Library Emitter (NEW)
- Parse AgentSpec skill definitions
- Generate SKILL.md with proper YAML frontmatter
- Follow Agent Skills specification exactly
- Validate output with skills-ref validator

### T14: Skill Validation Pipeline (NEW)
- Integrate skills-ref validator
- Report skill-specific errors
- Auto-fix common issues (naming, format)

### T15: Skill-to-Prompt Integration (NEW)
- Generate `<available_skills>` XML blocks
- Support multi-skill aggregation
- Include location hints for agent navigation

---

## Code Examples to Explore

**From skills-ref**:
```python
from skills_ref import validate, read_properties, to_prompt
from pathlib import Path

# Validate skill
problems = validate(Path("my-skill"))

# Read properties
props = read_properties(Path("my-skill"))
print(f"{props.name}: {props.description}")

# Generate prompt
prompt = to_prompt([Path("skill-a"), Path("skill-b")])
```

**Proposed AgentSpec integration**:
```typescript
const skillEmitter = new SkillLibraryEmitter();
for (const skill of agent.skills) {
  const skillFile = skillEmitter.emit(skill);
  // Writes SKILL.md with YAML frontmatter
  fs.writeFileSync(skillFile.path, skillFile.content);
}
```

---

## Resources

- **Agent Skills Docs**: https://agentskills.io
- **Specification**: https://agentskills.io/specification
- **GitHub**: https://github.com/agentskills/agentskills
- **skills-ref**: https://github.com/agentskills/agentskills/tree/main/skills-ref
- **Example Skills**: https://github.com/anthropics/skills

---

**Status**: ✅ Analysis Complete - Ready for Phase 2 integration planning
**Next Session**: Examine validator.py and prompt.py in detail
