# Phase 3 - Additional Emitters & Enhanced Workflow: PLAN

**Phase**: 3 of 4  
**Status**: 🚀 PLANNED  
**Start Date**: March 5, 2026  
**Estimated Duration**: 6-8 hours across 1-2 sessions  
**Major Deliverables**: 3 new emitters + batch processing + GitHub integration

---

## Phase 3 Overview

Phase 3 extends the AgentSpec compiler with **additional output formats** and **enhanced automation capabilities**.

### High-Level Goals
1. ✅ Implement MCP Server emitter (TypeScript code generation)
2. ✅ Implement Workflow emitter (n8n JSON generation)
3. ✅ Implement Collection emitter (awesome-copilot YAML generation)
4. ✅ Add batch processing to n8n workflow
5. ✅ Create GitHub integration workflow
6. ✅ Fix CLI dependencies and document setup

---

## Deliverables Breakdown

### 1. MCPServerEmitter (NEW) [Priority: HIGH]

**Purpose**: Generate TypeScript MCP server boilerplate from AgentSpec  
**Output**: `project-name/server.ts` + `package.json` + `tsconfig.json`  
**Size Estimate**: 300-400 lines

**Features to Implement**:
```typescript
✅ class MCPServerEmitter implements Emitter
✅ extractServerId(agent: Agent): string
✅ generatePackageJson(agent: Agent): string
✅ generateTsConfig(): string
✅ generateServerCode(agent: Agent): string
✅ generateToolDefinitions(agent: Agent): ToolDefinition[]
✅ validateServerName(name: string): void
```

**Output Structure**:
```
project-name/
├── src/
│   └── server.ts (MCP server implementation)
├── package.json (dependencies)
├── tsconfig.json (TypeScript config)
└── README.md (server documentation)
```

**Integration Points**:
- CLI flag: `--emit mcp-server`
- Type system: Extend `OutputFile.kind` to include 'mcp-server'
- n8n workflow: Add MCP server generation step

### 2. WorkflowEmitter (NEW) [Priority: HIGH]

**Purpose**: Generate n8n workflow JSON from AgentSpec  
**Output**: `project-name/workflow.json`  
**Size Estimate**: 200-300 lines

**Features to Implement**:
```typescript
✅ class WorkflowEmitter implements Emitter
✅ extractWorkflowId(agent: Agent): string
✅ generateWorkflowJSON(agent: Agent): object
✅ createTriggerNode(agent: Agent): WorkflowNode
✅ createProcessingNodes(agent: Agent): WorkflowNode[]
✅ createOutputNode(agent: Agent): WorkflowNode
✅ buildConnections(nodes: WorkflowNode[]): object
```

**Output Structure**:
```json
{
  "name": "agent-workflow",
  "nodes": [...],
  "connections": {...},
  "settings": {...}
}
```

**Use Cases**:
- Auto-generate workflow for agent execution
- Create automation pipeline from agent definition
- Enable n8n-based deployment

### 3. CollectionEmitter (NEW) [Priority: MEDIUM]

**Purpose**: Generate awesome-copilot collection YAML from AgentSpec  
**Output**: `project-name/collection.yml`  
**Size Estimate**: 150-200 lines

**Features to Implement**:
```typescript
✅ class CollectionEmitter implements Emitter
✅ generateCollectionYAML(agent: Agent): string
✅ extractCollectionMetadata(agent: Agent): CollectionMetadata
✅ buildItemList(agent: Agent): CollectionItem[]
✅ validateCollectionName(name: string): void
```

**Output Structure**:
```yaml
name: agent-collection
id: unique-id-here
description: ...
tags:
  - agent
  - automation
items:
  - name: agent-name
    type: agent
    description: ...
```

**Integration Points**:
- awesome-copilot registry
- Agent discovery system
- Documentation indexing

### 4. Batch Processing in n8n [Priority: MEDIUM]

**Purpose**: Process multiple AgentSpecs in a single workflow run  
**Features**:
```
✅ INPUT: Array of agentspec files
✅ LOOP: Process each file independently
✅ PARALLEL: Run multiple compilations simultaneously
✅ OUTPUT: Array of generated artifacts
✅ VALIDATION: Validate all outputs before returning
```

**Workflow Changes**:
1. Add "Iterate over AgentSpecs" loop node
2. Parallel compiler execution (3-5 concurrent)
3. Aggregate results
4. Batch validation
5. Consolidated error reporting

**n8n Integration**:
- Change input: Single POST → Batch processing
- Add split/merge nodes for parallelization
- Implement progress tracking
- Return formatted batch results

### 5. GitHub Integration Workflow [Priority: LOW]

**Purpose**: Auto-publish generated artifacts to GitHub repos  
**Features**:
```
✅ INPUT: Generated AgentSpec artifacts
✅ GITHUB: Create/update pull requests
✅ PUBLISH: Commit to main branch
✅ RELEASE: Create GitHub release
✅ NOTIFY: Post to issues/discussions
```

**Use Cases**:
- Auto-publish SKILL.md to agent repositories
- Create PR with generated code
- Publish MCP server to npm
- Create release notes

**Implementation Details**:
```
1. GitHub API authentication (token-based or OAuth)
2. PR creation workflow
3. Auto-merge capability (with approvals)
4. Release generation
5. Notification system
```

### 6. CLI Dependency Resolution [Priority: HIGH]

**Purpose**: Fix runtime issues and document proper setup  
**Tasks**:
```
✅ npm install --legacy-peer-deps in agentspec/
✅ Rebuild dist/ from source
✅ Test full compilation pipeline
✅ Document setup in QUICKSTART.md
✅ Create automated setup script
```

**Files to Update**:
- `QUICKSTART.md`: Add CLI setup section
- `package.json`: Document all dependencies
- `agentspec/package.json`: Fix peer dependencies
- Create: `agentspec/SETUP.md`

---

## Implementation Roadmap

### Session 1: Emitters Implementation (3-4 hours)

**Task 1.1: MCPServerEmitter** [45 min]
```
1. Create agentspec/src/emitters/mcp-server.ts
2. Implement all methods
3. Add to CLI: --emit mcp-server
4. Update types.ts: Add 'mcp-server' kind
5. Test with example agent
```

**Task 1.2: WorkflowEmitter** [45 min]
```
1. Create agentspec/src/emitters/workflow.ts
2. Implement workflow generation
3. Add to CLI: --emit workflow
4. Update types.ts: Add 'workflow' kind
5. Validate output JSON structure
```

**Task 1.3: CollectionEmitter** [30 min]
```
1. Create agentspec/src/emitters/collection.ts
2. Implement collection generation
3. Add to CLI: --emit collection
4. Update types.ts: Add 'collection' kind
5. Test with example agent
```

**Task 1.4: Rebuild & Test** [30 min]
```
1. npm run build (verify 0 errors)
2. Test all three emitters end-to-end
3. Document any issues
4. Prepare for next phase
```

### Session 2: Batch Processing & Integration (2-3 hours)

**Task 2.1: Batch Processing in n8n** [1 hour]
```
1. Update n8n workflow with batch input handling
2. Add parallelization logic
3. Implement result aggregation
4. Add comprehensive error handling
5. Test with 3+ concurrent agents
```

**Task 2.2: GitHub Integration Workflow** [1 hour]
```
1. Create separate GitHub publication workflow
2. Implement PR creation
3. Add release generation
4. Set up notification system
5. Test with sample repository
```

**Task 2.3: CLI Setup & Documentation** [30 min]
```
1. Fix npm dependencies in agentspec/
2. Create automated setup script
3. Update QUICKSTART.md
4. Create SETUP.md documentation
5. Test full pipeline end-to-end
```

### Optional Phase 3+ Tasks (Future)

**Phase 3+: Advanced Features**
- [ ] Skill registry database
- [ ] Agent marketplace UI
- [ ] Automated testing for generated code
- [ ] Performance optimization
- [ ] Distributed processing (multiple n8n instances)

---

## Technical Specifications

### Emitter Interface (Consistent Across All)

```typescript
interface Emitter {
  emit(agent: Agent): OutputFile | OutputFile[];
  validate(output: OutputFile): ValidationResult;
  getName(): string;
  getKind(): OutputFile['kind'];
}

interface OutputFile {
  path: string;
  content: string;
  kind: 'agent' | 'server' | 'workflow' | 'collection' | 'docs' | 'skill' | 'mcp-server';
}
```

### Type System Extensions

```typescript
// types.ts updates needed:
type OutputFileKind = 
  | 'agent' 
  | 'server' 
  | 'workflow' 
  | 'collection' 
  | 'docs' 
  | 'skill'
  | 'mcp-server'        // NEW
  | 'workflow'          // Already exists
  | 'collection';       // Already exists
```

### CLI Updates

```bash
# New commands to support:
agentspec compile input.agentspec --emit mcp-server --output ./server
agentspec compile input.agentspec --emit workflow --output ./workflows
agentspec compile input.agentspec --emit collection --output ./registry
agentspec compile input.agentspec --emit all --output ./artifacts
```

---

## Quality Assurance Plan

### Testing Strategy

**Unit Tests**:
- [ ] Each emitter independently
- [ ] Validation logic
- [ ] Output format compliance

**Integration Tests**:
- [ ] CLI with all emitters
- [ ] n8n workflows
- [ ] GitHub integration

**End-to-End Tests**:
- [ ] Full pipeline: AgentSpec → All artifacts
- [ ] Batch processing
- [ ] GitHub publication

### Validation Checkpoints

| Checkpoint | When | What to Verify |
|-----------|------|----------------|
| **Build Success** | After each emitter | 0 TypeScript errors |
| **Output Format** | After generation | Valid JSON/YAML/TS |
| **Type Safety** | After integration | All types defined |
| **CLI Execution** | After CLI update | Flags work correctly |
| **n8n Validation** | After workflow update | JSON valid, runs |
| **End-to-End** | Phase 3 end | All artifacts generated |

---

## Known Constraints & Dependencies

### External Dependencies
- **n8n**: Version 1.x (workflow engine)
- **TypeScript**: 4.9+ (type checking)
- **Node.js**: 18+ (runtime)
- **GitHub API**: For integration features
- **awesome-copilot**: For collection registry

### Internal Dependencies
- SkillLibraryEmitter (Phase 2) ✅ Available
- AgentSpec Parser (Phase 1) ✅ Available
- Existing type system ✅ Available

### Potential Issues & Mitigations

| Issue | Impact | Mitigation |
|-------|--------|-----------|
| CLI deps conflict | HIGH | npm install --legacy-peer-deps |
| n8n XML parsing | MEDIUM | Test with latest n8n version |
| GitHub rate limits | LOW | Batch requests, wait between calls |
| TS compilation | MEDIUM | Use existing build process |
| Output file conflicts | LOW | Use unique naming scheme |

---

## Success Criteria

### Phase 3 Completion Checklist

- [ ] MCPServerEmitter implemented (300-400 lines)
- [ ] WorkflowEmitter implemented (200-300 lines)
- [ ] CollectionEmitter implemented (150-200 lines)
- [ ] All emitters integrated into CLI
- [ ] Type system extended (0 TypeScript errors)
- [ ] Batch processing in n8n (tested with 3+ agents)
- [ ] GitHub integration workflow created
- [ ] CLI dependencies fixed
- [ ] Full pipeline tested end-to-end
- [ ] Documentation updated (QUICKSTART, SETUP)
- [ ] All artifacts generate successfully
- [ ] Zero validation failures

### Metrics Target

| Metric | Target | Status |
|--------|--------|--------|
| **Code Quality** | 0 TS errors | TBD |
| **Test Coverage** | 80%+ | TBD |
| **Documentation** | 100% | TBD |
| **Performance** | <5s per agent | TBD |
| **Throughput** | 10+ agents/batch | TBD |

---

## Risk Assessment

### High Risk Items
1. **CLI Dependencies**: May have version conflicts (Mitigation: npm install --legacy-peer-deps)
2. **n8n Batch Processing**: Complex workflow logic (Mitigation: Start simple, iterate)
3. **GitHub Integration**: Rate limits and auth (Mitigation: Implement error handling)

### Medium Risk Items
1. **Type Safety**: Multiple new emitters (Mitigation: Test incrementally)
2. **Performance**: Large batch processing (Mitigation: Profile and optimize)
3. **Output Conflicts**: File naming collisions (Mitigation: Use UUIDs/timestamps)

### Low Risk Items
1. **Documentation**: Updates to existing docs (Mitigation: Straightforward changes)
2. **Testing**: Incremental validation (Mitigation: Test as we go)

---

## Phase 3 Timeline

```
Wednesday (Session 1):
├─ 14:00-14:45: MCPServerEmitter implementation
├─ 14:45-15:30: WorkflowEmitter implementation
├─ 15:30-16:00: CollectionEmitter implementation
└─ 16:00-16:30: Rebuild & initial testing

Thursday/Friday (Session 2):
├─ 14:00-15:00: Batch processing in n8n
├─ 15:00-16:00: GitHub integration workflow
└─ 16:00-16:30: CLI fixes & documentation
```

**Total Estimated Time**: 6-8 hours  
**Completion Target**: End of this week

---

## Next Steps

1. ✅ Create Phase 3 todo list (separate from Phase 2)
2. ✅ Begin Task 1.1: MCPServerEmitter implementation
3. 📋 Follow implementation roadmap above
4. 🧪 Validate at each checkpoint
5. 📖 Update documentation as we go

---

## References

- **SkillLibraryEmitter Reference**: `agentspec/src/emitters/skill-library.ts`
- **Parser Implementation**: `agentspec/src/parser/index.ts`
- **Type Definitions**: `agentspec/src/compiler/types.ts`
- **CLI Entry Point**: `agentspec/src/cli/index.ts`
- **n8n Workflow**: `n8n-workflows/generate-agents-agentspec.json`

---

**Phase 3 Plan Created**: March 5, 2026  
**Planned By**: GitHub Copilot (Claude Sonnet 4.5)  
**Ready for Implementation**: ✅ YES

---
