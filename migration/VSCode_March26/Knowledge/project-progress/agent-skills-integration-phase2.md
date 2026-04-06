# Agent Skills + AgentSpec Integration - Phase 2 Foundation

**Session Date**: March 5, 2026  
**Status**: Repository analyzed - integration plan ready  
**Output**: agent-skills/ cloned & documented

## 🎯 Key Discovery: Universal Skill Format

Agent Skills (by Anthropic) provides the **industry-standard skill definition format**:
- YAML frontmatter in SKILL.md files
- `name`, `description`, `license`, `compatibility`, `allowed_tools`, `metadata`
- XML prompt format: `<available_skills>` blocks
- Reference implementation: skills-ref (Python library)

## 📦 Cloned Repositories

```
VSCode_March26/
├── agent-skills/                    ← Main repo (Anthropic)
│   ├── skills-ref/                  ← Reference Python SDK
│   │   ├── src/skills_ref/
│   │   │   ├── models.py            ← SkillProperties dataclass
│   │   │   ├── parser.py            ← YAML frontmatter parser
│   │   │   ├── validator.py         ← Validation rules
│   │   │   ├── prompt.py            ← XML generation
│   │   │   └── cli.py               ← Commands: validate, read-properties, to-prompt
│   │   └── tests/                   ← Validation test suite
│   ├── docs/                        ← Full specification
│   └── README.md                    ← Overview
```

## 🏗️ Agent Skills Structure (SKILL.md Format)

**File**: SKILL.md (in skill directory)

```yaml
---
name: skill-name                    # Required: kebab-case
description: What skill does        # Required: agent prompt text
license: Apache-2.0                 # Optional
compatibility: Claude 3.5+          # Optional: model compatibility
allowed-tools: python,bash          # Experimental: tool patterns
metadata:                           # Optional: custom key-value pairs
  category: data-processing
  version: "1.0"
---
# Skill Instructions

Full markdown instructions for using this skill.
Agents read this to understand how to use the skill.
```

## 💡 Integration Strategy

### Phase 2 New Tasks (T8 → T12)

**T8 Modified**: Build MCP Python Emitter
- Generate both: MCP server code + SKILL.md
- Follow Agent Skills format for skill definitions

**T12 NEW**: Skill Library Emitter  
- Create `SkillLibraryEmitter` class
- Inputs: AgentSpec skill definitions
- Outputs: SKILL.md files with YAML frontmatter
- Validates using skills-ref rules

**T13 NEW**: Skill Validation Pipeline
- Reuse skills-ref validator logic
- Integrate skill-specific error reporting
- Auto-fix common issues

**T14 NEW**: Skill-to-Prompt Integration
- Generate `<available_skills>` XML blocks
- Use skills-ref `prompt.py` logic
- Support multi-skill aggregation

### Architecture Diagram

```
AgentSpec Input
     ↓
Parse Agent + Skills
     ↓
Emit Multiple Formats:
  ├→ VSCode Agent (.agent.md)
  ├→ MCP Python (server.py + SKILL.md)
  ├→ MCP TypeScript (server.ts + SKILL.md)
  ├→ n8n Workflow (.json)
  └→ Agent Skills Library (SKILL.md + XML)
     ↓
Validate with skills-ref
     ↓
Generate Prompt XML
```

## 📋 Critical Implementation Details

### From skills-ref source code:

**1. SkillProperties dataclass** (models.py):
- `name` & `description` → REQUIRED
- `license`, `compatibility`, `allowed_tools`, `metadata` → OPTIONAL
- Method: `to_dict()` - excludes None, includes metadata only if non-empty

**2. Parser** (parser.py):
- Splits SKILL.md on `---` delimiters
- Extracts YAML frontmatter (strict validation)
- Returns (metadata_dict, markdown_body)
- Errors: ParseError (missing/invalid), ValidationError (missing required fields)

**3. Validator** (validator.py): [TO EXAMINE]
- Name must be kebab-case
- Description cannot be empty
- License/compatibility format checking
- Metadata key-value validation

**4. Prompt Generation** (prompt.py): [TO EXAMINE]
- Converts skills → XML `<available_skills>` blocks
- Each skill gets: `<location>` path pointing to SKILL.md
- Used by agent system prompts

**5. CLI Commands** (cli.py):
```bash
skills-ref validate path/to/skill           # Check validity
skills-ref read-properties path/to/skill    # Output JSON properties
skills-ref to-prompt skill-a/ skill-b/      # Generate XML prompt
```

## 🔗 AgentSpec Extension Proposal

**New AgentSpec Syntax** (TypeScript-like):

```typescript
@skillName("data-processor")
@description("Process CSV/JSON files")
@license("Apache-2.0")
@compatibility("Claude 3.5+")
@tools(["python:pandas", "bash:jq"])
skill DataProcessor {
  instructions: "Use this skill to transform data...";
  inputs: ["csv", "json"];
  outputs: ["processed-data"];
}
```

**Maps to SKILL.md**:
```yaml
---
name: data-processor
description: Process CSV/JSON files
license: Apache-2.0
compatibility: Claude 3.5+
allowed-tools: python:pandas,bash:jq
metadata:
  inputs: csv,json
  outputs: processed-data
---
Use this skill to transform data...
```

## 🚀 Next Actions (Immediate)

1. **Examine remaining files**:
   - `skills-ref/src/skills_ref/validator.py` - validation rules
   - `skills-ref/src/skills_ref/prompt.py` - XML generation logic

2. **Create Skill Emitter**:
   - `agentspec/src/emitters/skill-library.ts`
   - Generates SKILL.md with proper YAML frontmatter
   - Follows Agent Skills specification exactly

3. **Integrate Validator**:
   - Call skills-ref validator on generated skills
   - Report errors in AgentSpec compiler output

4. **Test Multi-Format Output**:
   - Generate skill from single AgentSpec definition
   - Validate output matches Agent Skills spec
   - Compare with existing skills-ref examples

## 📚 Documentation Created

- ✅ `Knowledge/integration/agent-skills-analysis.md` - Full technical analysis
- ✅ Repository cloned to `agent-skills/`
- ✅ Source code examined: models.py, parser.py, CLI interface

## ✅ Readiness Assessment

**What We Know**:
- Agent Skills format (YAML frontmatter + markdown)
- skills-ref library structure and capabilities
- Parser and validator architecture

**What We Need**:
- Details from validator.py (validation rules)
- Details from prompt.py (XML generation algorithm)
- Real skill examples from agent-skills/examples/

**Blockers**: None - proceed to Phase 2 immediately

---

**Phase 1 Completion**: ✅ Complete  
**Phase 2 Readiness**: ✅ Ready - Skills integration foundation laid  
**Next Milestone**: Skill Library Emitter (T12) implementation
