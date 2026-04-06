# Technical Specifications - AI Agent Traceability System

**Version**: 1.0.0  
**Date**: March 5, 2026  
**Status**: Production Ready (Phases 1-4 Complete)

---

## 📋 Table of Contents

1. [System Architecture](#system-architecture)
2. [Component Specifications](#component-specifications)
3. [Data Models](#data-models)
4. [API Reference](#api-reference)
5. [Integration Points](#integration-points)
6. [OpenTelemetry Configuration](#opentelemetry-configuration)
7. [n8n Workflow Specifications](#n8n-workflow-specifications)
8. [Security & Data Privacy](#security--data-privacy)
9. [Performance Requirements](#performance-requirements)

---

## System Architecture

### Three-Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 1: Observation Layer                                │
│  ┌───────────────┬──────────────┬──────────────────────┐   │
│  │ Agent Runs    │ MCP Tools    │ Agent Decisions      │   │
│  │ (execution)   │ (invocation) │ (reasoning)          │   │
│  └───────────────┴──────────────┴──────────────────────┘   │
│         ↓                ↓                  ↓                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ OpenTelemetry OTEL (localhost:4317 gRPC)            │   │
│  │ ├─ Span Creation                                    │   │
│  │ ├─ Attribute Tagging (trace_id, run_id)            │   │
│  │ └─ VSCode Inspector Visualization                  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Layer 2: Tracking Layer                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Document Management System                           │   │
│  │ ├─ SHA256 Content Hashing                           │   │
│  │ ├─ Change Detection                                 │   │
│  │ └─ Trace_ID Linking to Agent Runs                   │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Cross-System Linking                                 │   │
│  │ ├─ Agent ↔ Document (ai_generated documents)        │   │
│  │ ├─ n8n ↔ Agent (workflow-triggered agents)          │   │
│  │ ├─ Document ↔ n8n (generated via workflows)         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Layer 3: Storage Layer                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ PostgreSQL Database                                  │   │
│  │ ├─ Agent Execution Tables (agent_runs, mcp_tools)  │   │
│  │ ├─ Document Tables (documents, document_changes)   │   │
│  │ ├─ n8n Tables (n8n_executions, n8n_node_logs)      │   │
│  │ ├─ Linking Tables (trace_links)                    │   │
│  │ └─ OTEL Span Storage (otel_spans)                  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Component Interactions

```
User Input
    ↓
[SampleAgent] (agents/sample_agent.py, 248 lines)
    ├─ Calls Agent Framework with tools
    ├─ Emits OpenTelemetry spans (100% automatic)
    └─ Logs to TraceDatabase
         ↓
    [TraceDatabase] (agents/trace_database.py, 440 lines)
         ├─ log_agent_run() → agent_runs table
         ├─ log_mcp_tool_call() → mcp_tool_calls table
         ├─ log_agent_decision() → agent_decisions table
         └─ Generates trace_id for linking
             ↓
    [DocumentManager] (agents/document_manager.py, 405 lines)
         ├─ register_document() → documents table
         ├─ log_change() → document_changes table
         └─ Links via trace_id
             ↓
    [VSCode Inspector] (OpenTelemetry listener)
         ├─ Receives spans on localhost:4317
         ├─ Visualizes flamegraph
         └─ Links to database via trace_id
             ↓
    [PostgreSQL] (schema.sql, 565 lines)
         ├─ Persists all events
         ├─ Maintains audit trails
         └─ Powers analytics views
```

---

## Component Specifications

### 1. Tracing Configuration Module

**File**: `agents/tracing_config.py` (145 lines)

**Purpose**: Configure OpenTelemetry for Agent Framework integration with VSCode Inspector

**Key Functions**:
- `configure_tracing()` - Initialize OTEL TracerProvider with gRPC exporter
- `setup_agent_framework_observability()` - Enable Agent Framework SDK instrumentation
- `get_tracer()` - Retrieve tracer instance for manual span creation (optional)

**Configuration**:
```python
# Automatic with Agent Framework
from agent_framework.observability import configure_otel_providers

configure_otel_providers(
    vs_code_extension_port=4317,  # gRPC OTLP endpoint
    enable_sensitive_data=True      # Capture prompts/completions
)
```

**Exported Spans**:
- Agent execution start/end
- Chat completion invocations
- Tool usage (automatic)
- Custom spans via tracer

---

### 2. Trace Database Module

**File**: `agents/trace_database.py` (440 lines)

**Purpose**: Provide Python API for logging agent execution events to PostgreSQL

**Class**: `TraceDatabase`

**Constructor**:
```python
db = TraceDatabase(database_url="postgresql://user:pass@localhost:5432/n8n_traceability")
```

**Methods**:

#### log_agent_run()
```python
run_id = db.log_agent_run(
    agent_name: str,           # e.g., "weather-agent"
    trace_id: str,             # UUID, links to OTEL spans
    input_data: dict,          # {"user_input": "What's the weather?"}
    output_data: dict,         # {"response": "Sunny, 72°F"}
    execution_status: str,     # "started", "completed", "failed"
    duration_ms: int,          # 1234 milliseconds
    model_used: str = None,    # "gpt-4o-mini"
    error_message: str = None  # Only if status="failed"
) -> UUID
# Returns: run_id for linking tool calls
```

**Table**: `agent_runs` (columns: id, agent_name, trace_id, input_data, output_data, status, duration_ms, created_at, updated_at)

---

#### log_mcp_tool_call()
```python
db.log_mcp_tool_call(
    run_id: UUID,              # From log_agent_run()
    tool_name: str,            # "get_weather", "register_document"
    input_params: dict,        # {"location": "SF"}
    output_data: dict,         # {"forecast": "sunny"}
    execution_status: str,     # "started", "completed", "failed"
    duration_ms: int,          # 150
    error_message: str = None  # Tool error details
)
```

**Table**: `mcp_tool_calls` (columns: id, run_id, tool_name, input_params, output_data, status, duration_ms, created_at)

**Indexing**: Foreign key on run_id for fast querying

---

#### log_agent_decision()
```python
db.log_agent_decision(
    run_id: UUID,
    decision_type: str,              # "response_generation", "tool_selection"
    reasoning: str,                  # Why this decision was made
    options_considered: list[str],   # [  "weather", "document_registration"]
    selected_choice: str,            # "weather"
    confidence_score: float          # 0.85
)
```

**Table**: `agent_decisions` (columns: id, run_id, decision_type, reasoning, options_considered, selected, confidence, created_at)

---

#### log_trace_link()
```python
db.log_trace_link(
    source_type: str,    # "agent_run"
    source_id: UUID,     # run_id
    target_type: str,    # "document"
    target_id: UUID,     # doc_id
    relationship: str    # "generated", "modified", "triggered_by"
)
```

**Table**: `trace_links` (columns: id, source_type, source_id, target_type, target_id, relationship, created_at)

---

#### query_traces()
```python
traces = db.query_traces(trace_id: str) -> dict
# Returns:
# {
#   "agent_run": {...},
#   "mcp_tool_calls": [...],
#   "agent_decisions": [...],
#   "otel_spans": [...]
# }
```

**Query**: Joins agent_runs + mcp_tool_calls + agent_decisions using run_id and trace_id matching

---

#### get_agent_statistics()
```python
stats = db.get_agent_statistics(agent_name: str = None) -> dict
# Returns:
# {
#   "total_runs": 47,
#   "success_rate": 0.98,
#   "avg_duration_ms": 2341,
#   "total_tokens": 125000,
#   "avg_tokens": 2659
# }
```

**Source**: `v_agent_activity` view

---

### 3. Document Manager Module

**File**: `agents/document_manager.py` (405 lines)

**Purpose**: Track knowledge system documents with automatic change detection and audit trails

**Class**: `DocumentManager`

**Constructor**:
```python
doc_mgr = DocumentManager(knowledge_dir="./Knowledge")
```

**Methods**:

#### register_document()
```python
doc_id = doc_mgr.register_document(
    name: str,                    # "project_overview.md"
    path: str,                    # "./Knowledge/project_overview.md"
    doc_type: str,               # "note", "guide", "specification"
    tags: list[str] = None,      # ["project", "architecture"]
    ai_generated: bool = False   # True if created by agent
) -> UUID
```

**Table**: `documents` (columns: id, name, path, doc_type, content_hash, tags, ai_generated, created_at, updated_at)

**Hash Computation**: SHA256(file_content.encode())

---

#### log_change()
```python
db_entry = doc_mgr.log_change(
    document_path: str,          # "./Knowledge/project_overview.md"
    change_type: str,            # "created", "modified", "deleted"
    change_reason: str,          # "Updated by weather agent"
    trace_id: str = None,        # Links to agent run
    prev_hash: str = None,       # Auto-computed if not provided
    new_hash: str = None         # Auto-computed from current content
)
```

**Table**: `document_changes` (columns: id, document_id, change_type, reason, trace_id, prev_hash, new_hash, created_at)

**Trigger**: Auto-computed hash comparison prevents duplicate logging

---

#### track_file_changes()
```python
changes = doc_mgr.track_file_changes() -> list[dict]
# Scans KNOWLEDGE_DIR
# Compares file hashes to database
# Auto-logs any new/modified files
# Returns: list of detected changes
```

---

#### get_document_history()
```python
history = doc_mgr.get_document_history(doc_id: UUID) -> list[dict]
# Returns: [{
#   "created_at": "2026-03-05T14:30:00Z",
#   "change_type": "modified",
#   "change_reason": "Updated by weather agent",
#   "prev_hash": "abc123...",
#   "new_hash": "def456...",
#   "trace_id": "trace-uuid"
# }, ...]
```

---

#### export_audit_report()
```python
report = doc_mgr.export_audit_report(
    doc_id: UUID,
    output_format: str = "csv"  # "csv", "json", "html"
) -> str
# Returns: formatted audit trail
# Includes: timestamps, changes, reasons, trace links, user info
```

---

### 4. Sample Agent Module

**File**: `agents/sample_agent.py` (248 lines)

**Purpose**: Example AI agent demonstrating full integration with tracing and database logging

**Key Components**:

#### SampleAgent Class
```python
agent = SampleAgent()
# Initializes:
# - OpenTelemetry tracing (via Agent Framework SDK)
# - TraceDatabase connection
# - DocumentManager connection
# - Agent Framework OpenAIChatClient

response = await agent.run("What's the weather in San Francisco?")
# Logs: agent_run, mcp_tool_calls, agent_decisions
# Emits: OTEL spans (automatic)
# Tracks: document changes if applicable
```

#### Built-in Tools
1. **get_weather(location)** - Example tool for weather queries
2. **register_document(doc_name, doc_type)** - Document registration tool

#### Tracing Flow
1. `SampleAgent.__init__()` → calls `configure_otel_providers()` (auto-instruments)
2. `agent.run(input)` → Agent Framework creates spans automatically
3. Tool invocations → OTEL auto-instrumentation captures timing
4. `log_mcp_tool_call()` → TraceDatabase logs to PostgreSQL
5. Trace_ID → Links OTEL spans to database records

---

## Data Models

### PostgreSQL Schema Overview

**16 Tables across 8 Groups**:

#### Audit Group (1 table)
- `users` - Agent/service identities with auto-timestamp triggers

#### Knowledge Management (2 tables)
- `documents` - Document registry with SHA256 content hashing
- `document_changes` - Full audit trail with previous/new hashes

#### Agent Execution (3 tables)
- `agent_runs` - High-level agent invocations with metrics
- `mcp_tool_calls` - Individual tool invocations with I/O parameters
- `agent_decisions` - Reasoning, options considered, confidence

#### n8n Observability (3 tables)
- `n8n_executions` - Workflow run records
- `n8n_node_logs` - Per-node execution details
- `n8n_execution_context` - Variable snapshots at execution time

#### Cross-System Linking (1 table)
- `trace_links` - Relationships (agent→document, n8n→agent, etc.)

#### OpenTelemetry (1 table)
- `otel_spans` - Native span storage for advanced OTEL queries

#### Analytics Views (3 views)
- `v_agent_activity` - Agent statistics (runs, tokens, success rate)
- `v_document_activity` - Document modification tracking
- `v_workflow_stats` - n8n performance metrics

**File**: `Knowledge/observability/schema.sql` (565 lines)

---

## API Reference

### OpenTelemetry Tracing API

**Setup**:
```python
from agent_framework.observability import configure_otel_providers

configure_otel_providers(
    vs_code_extension_port=4317,  # localhost:4317 for gRPC
    enable_sensitive_data=True     # Capture prompts/completions
)
```

**Auto-Instrumented Events** (no code required):
- Chat completions (model calls)
- Tool usage
- Agent execution start/end
- Stream events

**Custom Spans** (optional):
```python
from opentelemetry import trace

tracer = trace.get_tracer(__name__)

with tracer.start_as_current_span("my_operation") as span:
    span.set_attribute("trace_id", trace_id)
    span.set_attribute("custom_field", value)
    # Do work...
```

---

### Database API

**Connection**:
```python
from trace_database import TraceDatabase
db = TraceDatabase(os.getenv("DATABASE_URL"))
```

**Logging Flow** (typical usage):
```python
# 1. Start agent run
run_id = db.log_agent_run(
    agent_name="my-agent",
    trace_id=uuid.uuid4().hex,
    input_data={"user_input": input_text},
    output_data={},
    execution_status="started",
    duration_ms=0,
    model_used="gpt-4o-mini"
)

# 2. Log tool invocations during execution
db.log_mcp_tool_call(
    run_id=run_id,
    tool_name="my_tool",
    input_params={...},
    output_data={...},
    execution_status="completed",
    duration_ms=150
)

# 3. Log decisions
db.log_agent_decision(
    run_id=run_id,
    decision_type="tool_selection",
    reasoning="Selected tool based on user query",
    options_considered=["tool1", "tool2"],
    selected_choice="tool1",
    confidence_score=0.92
)

# 4. Query complete trace
traces = db.query_traces(run_id.hex)
print(f"Agent run: {traces['agent_run']}")
print(f"Tools used: {len(traces['mcp_tool_calls'])}")
```

---

### Document Management API

**Typical Flow**:
```python
from document_manager import DocumentManager

doc_mgr = DocumentManager(knowledge_dir="./Knowledge")

# 1. Register new document
doc_id = doc_mgr.register_document(
    name="analysis_results.md",
    path="./Knowledge/analysis_results.md",
    doc_type="analysis",
    tags=["ai-generated"],
    ai_generated=True
)

# 2. When document is updated, log the change
with open("./Knowledge/analysis_results.md", "w") as f:
    f.write(new_content)

doc_mgr.log_change(
    document_path="./Knowledge/analysis_results.md",
    change_type="modified",
    change_reason="Updated with latest analysis from agent run",
    trace_id=trace_id  # Link to agent execution
)

# 3. Retrieve audit trail
history = doc_mgr.get_document_history(doc_id)
for change in history:
    print(f"{change['created_at']}: {change['change_type']} - {change['change_reason']}")

# 4. Export for compliance
report = doc_mgr.export_audit_report(doc_id, output_format="csv")
```

---

## Integration Points

### Agent → Database Integration

**Capture Point**: After agent execution completes
```python
async def run_agent(user_input):
    trace_id = uuid.uuid4().hex
    
    # Log start
    run_id = db.log_agent_run(
        agent_name="my-agent",
        trace_id=trace_id,
        input_data={"user_input": user_input},
        output_data={},
        execution_status="started",
        duration_ms=0
    )
    
    try:
        # Run agent (auto-emits OTEL spans)
        response = await agent.run(user_input)
        
        # Log completion
        db.log_agent_run(
            agent_name="my-agent",
            trace_id=trace_id,
            input_data={"user_input": user_input},
            output_data={"response": response},
            execution_status="completed",
            duration_ms=elapsed
        )
    except Exception as e:
        # Log failure
        db.log_agent_run(
            agent_name="my-agent",
            trace_id=trace_id,
            input_data={"user_input": user_input},
            output_data={},
            execution_status="failed",
            duration_ms=elapsed,
            error_message=str(e)
        )
```

### Document Tracking Integration

**Capture Point**: Inside agent tools that modify documents
```python
@tool
def create_analysis_document(analysis_content: str) -> str:
    # 1. Write document
    doc_path = "./Knowledge/analysis_results.md"
    with open(doc_path, "w") as f:
        f.write(analysis_content)
    
    # 2. Register with document manager
    doc_id = doc_mgr.register_document(
        name="analysis_results.md",
        path=doc_path,
        doc_type="analysis",
        ai_generated=True
    )
    
    # 3. Log change with trace_id link
    doc_mgr.log_change(
        document_path=doc_path,
        change_type="created",
        change_reason="AI-generated analysis",
        trace_id=current_trace_id  # Pass from agent context
    )
    
    return f"Document {doc_id} created"
```

### n8n Workflow Integration

**Capture Point**: n8n webhook endpoint
```json
{
  "id": "webhook_trigger",
  "type": "n8n-nodes-base.webhook",
  "parameters": {
    "path": "n8n/execution-webhook",
    "method": "POST"
  }
}
```

**Payload Structure**:
```json
{
  "workflow_id": "wf-123",
  "execution_id": "exec-456",
  "status": "success",
  "duration_ms": 2345,
  "nodes": [
    {
      "id": "node-1",
      "type": "trigger",
      "status": "success",
      "duration_ms": 100
    }
  ]
}
```

**Flow → PostgreSQL**:
1. Webhook receives execution event
2. Function node parses payload
3. Postgres node inserts to `n8n_executions`
4. Loop: for each node, insert to `n8n_node_logs`

---

## OpenTelemetry Configuration

### VSCode Inspector Integration

**Endpoint**: `http://localhost:4317` (gRPC OTLP)

**Export Path**:
```
Agent Framework Request
    ↓
[OpenTelemetry SDK]
    ├─ TracerProvider creates spans
    ├─ Spans batched
    └─ gRPC OTLP Exporter ships to localhost:4317
         ↓
[VSCode AI Toolkit Inspector]
    ├─ Receives Protocol Buffers
    ├─ Renders flamegraph visualization
    └─ Links spans to database via trace_id attribute
```

### Span Attributes

**Standard Attributes** (Agent Framework auto-sets):
- `trace_id` - UUID matching database `agent_runs.trace_id`
- `span_id` - Unique span identifier
- `service.name` - AI agent system
- `service.version` - 1.0.0
- `deployment.environment` - development/production

**Custom Attributes** (optional in tools/agents):
```python
span.set_attribute("agent_name", "weather-agent")
span.set_attribute("run_id", run_id)
span.set_attribute("tool_name", "get_weather")
span.set_attribute("location", "san_francisco")
```

### Performance Metrics

**Frame Rate**: ~30-60 FPS in VSCode Inspector (spans arrive ~100ms latency)
**Payload Size**: ~1KB per span
**Export Frequency**: Batch every 5 seconds or 512 spans

---

## n8n Workflow Specifications

### Execution Logger Workflow

**File**: `Knowledge/observability/n8n_execution_logger_workflow.json`

**Purpose**: Automatically log n8n workflow executions to PostgreSQL

**Node Flow**:
1. **Webhook Trigger** - Receives POST `/n8n/execution-webhook`
2. **Function: Parse Data** - Extracts execution metadata
3. **Postgres: Log Execution** - Inserts to `n8n_executions` table
4. **Function: Parse Node Logs** - Transforms per-node data
5. **Postgres: Log Node Executions** - Batch inserts to `n8n_node_logs`
6. **Function: Success Response** - Confirms logging complete
7. **Respond to Webhook** - Returns 200 OK

**Credential Required**: PostgreSQL connection string
- Host: localhost
- Database: n8n_traceability
- User: postgres
- Password: (from .env)

**Execution Parameters** (webhook payload):
```json
{
  "workflow_id": "string",
  "workflow_name": "string",
  "execution_id": "string",
  "status": "success|failed|waiting",
  "started_at": "ISO8601 timestamp",
  "completed_at": "ISO8601 timestamp",
  "duration_ms": "milliseconds",
  "triggered_by": "webhook|schedule|manual",
  "nodes": [
    {
      "id": "node_id",
      "name": "node_name",
      "type": "node_type",
      "status": "success|failed",
      "duration_ms": "milliseconds",
      "input": {},
      "output": {},
      "error_message": "null or error string"
    }
  ]
}
```

---

## Security & Data Privacy

### Data Classification

| Data | Security Level | Storage | Access Control |
|------|----------------|---------|-----------------|
| Agent prompts/completions | PII | otel_spans (optional) | Disabled by default |
| Agent inputs/outputs | Confidential | agent_runs | Authenticated users |
| Document content | Confidential | documents | File permissions + DB ACL |
| Tool parameters | Internal | mcp_tool_calls | Agent service account |
| Database credentials | Secret | .env (gitignored) | Environment variables only |

### Privacy Controls

**Sensitive Data Filtering** (enabled by default):
```python
# Don't enable if handling sensitive prompts
configure_otel_providers(
    vs_code_extension_port=4317,
    enable_sensitive_data=False  # Redacts prompts/completions
)
```

### Database Security

**PostgreSQL**:
- User isolation via role-based access
- Database password in `.env` (not committed)
- All connections via local socket (localhost only) in development
- Prepared statements prevent SQL injection

**File Security**:
- Document audit trail immutable (no UPDATE on `document_changes`)
- Triggers auto-populate timestamps (no user manipulation)

---

## Performance Requirements

### Response Times

| Operation | Target | Tolerance |
|-----------|--------|-----------|
| Agent execution (excluding model latency) | < 5s | ±2s |
| Tool logging to database | < 100ms | ±50ms |
| Document change logging | < 100ms | ±50ms |
| Query traces by trace_id | < 500ms | ±200ms |
| Export audit report (100 changes) | < 2s | ±1s |
| n8n batch logging (100 nodes) | < 1s | ±500ms |

### Database Indexes

**Indexed Columns**:
- `agent_runs(trace_id, created_at, agent_name)`
- `mcp_tool_calls(run_id, created_at, tool_name)`
- `documents(path, created_at)`
- `document_changes(document_id, trace_id, created_at)`
- `trace_links(source_id, target_id)`
- `otel_spans(trace_id, created_at)`

**Index Maintenance**:
- Automatic vacuum on PostgreSQL (default)
- Annual reindexing recommended for large deployments (>1M spans)

### Capacity Planning

**Current Sizing** (single PostgreSQL instance):
- 10,000 agent runs/day → ~300MB/month
- 50,000 tool calls/day → ~500MB/month
- 1,000 documents/day changes → ~100MB/month
- **Total**: ~1GB/month operational data

**Scaling**:
- Monthly archival to separate DB if >10GB
- Table partitioning by date for multi-year retention
- Read replicas for analytics queries

---

**Document Version**: 1.0.0  
**Last Updated**: 2026-03-05  
**Approval Status**: Review Pending  
**Maintenance Owner**: AI Infrastructure Team
