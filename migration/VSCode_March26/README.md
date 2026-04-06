# Comprehensive AI Traceability System

Complete observability solution integrating AI agent execution tracing, knowledge management document auditing, and n8n workflow observability into a unified PostgreSQL backend with OpenTelemetry.

## 🎯 System Overview

This system enables **end-to-end tracking** across three interconnected domains:

```
┌─────────────────────────────────────────────────────────┐
│   AI Agent Execution Tracing                            │
│   • Agent runs with detailed metrics                    │
│   • MCP tool calls with timing/parameters               │
│   • Agent reasoning and decision logs                   │
│   • Token usage and model invocations                   │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│   Knowledge Management System                           │
│   • Document registration & versioning                  │
│   • Automatic change detection (SHA256)                 │
│   • Audit trail of modifications                        │
│   • Cross-reference to agent runs                       │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│   n8n Workflow Observability                            │
│   • Workflow execution logs                             │
│   • Per-node execution tracking                         │
│   • Data flow inspection                                │
│   • Error capture and routing                           │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
           ┌───────────────────────┐
           │  PostgreSQL Database  │
           │  (Unified Backend)    │
           │                       │
           │ • 16 tables           │
           │ • 3 views             │
           │ • Trace linking       │
           │ • OpenTelemetry spans │
           └────────┬──────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
  VSCode         Analytics  Compliance
  Inspector      Queries    Audits
  (4317)        (SQL)       (Reports)
```

---

## 📁 Project Structure

```
VSCode_March26/
├── agents/
│   ├── sample_agent.py           # Example agent with full tracing
│   ├── tracing_config.py          # OpenTelemetry configuration
│   ├── trace_database.py          # Database logging API
│   └── document_manager.py        # Knowledge system integration
│
├── Knowledge/
│   └── observability/
│       ├── schema.sql                        # PostgreSQL schema (565 lines)
│       ├── TRACING_SETUP.md                  # Installation guide
│       └── n8n_execution_logger_workflow.json # n8n workflow template
│
├── .env.example                  # Environment template (copy to .env)
├── requirements.txt              # Python dependencies
├── IMPLEMENTATION_CHECKLIST.md   # Phase-by-phase checklist
└── README.md                     # This file
```

---

## 🚀 Quick Start

### 1. Database Setup
```bash
# Create n8n_traceability database
createdb -U postgres n8n_traceability

# Load schema
psql -U postgres -d n8n_traceability -f Knowledge/observability/schema.sql

# Verify
psql -d n8n_traceability -c "\dt"  # Lists all tables
```

### 2. Python Environment
```bash
# Create virtual environment
python -m venv venv

# Activate
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env: DATABASE_URL, OPENAI_API_KEY, etc.
```

### 3. Run Sample Agent
```bash
# Verify imports work
python -c "from agents.tracing_config import configure_tracing; print('✅ Ready')"

# Run agent with tracing
python agents/sample_agent.py

# Expected output:
# ===============================================================
# Agent Run ID: <uuid>
# Trace ID: <uuid>
# Input: What's the weather in San Francisco? Also, register...
# ===============================================================
#
# Agent Response:
# Weather in San Francisco: Sunny, 72°F
# Document registered: doc-123
#
# ✅ Trace ID 12345678... logged to database
# 📊 View traces in VSCode Inspector: http://localhost:4317
```

### 4. View Traces in VSCode
1. Open VSCode command palette (Ctrl+Shift+P)
2. Run: `ai-mlstudio.tracing.open`
3. Inspector opens → http://localhost:4317
4. Traces from sample agent visible in real-time

### 5. Verify Database Logging
```bash
# Connect to database
psql -d n8n_traceability

# Query agent run
SELECT id, agent_name, status, created_at FROM agent_runs 
ORDER BY created_at DESC LIMIT 1;

# Query tool calls from that run
SELECT tool_name, duration_ms FROM mcp_tool_calls 
WHERE run_id = '<run_id>' 
ORDER BY created_at;

# Query document changes
SELECT * FROM document_changes 
ORDER BY created_at DESC LIMIT 5;
```

---

## 🔧 Core Components

### tracing_config.py
Configures OpenTelemetry for agent tracing.

**Key Functions:**
- `configure_tracing(service_name, service_version, otel_endpoint, enable_sensitive_data)`
  - Sets up gRPC OTLP exporter
  - Creates TracerProvider
  - Configures resource metadata
  
- `setup_agent_framework_observability(enable_sensitive_data)`
  - Calls Agent Framework's `configure_otel_providers()`
  - Enables automatic span creation
  
- `get_tracer(name)`
  - Returns tracer for creating spans
  - Enables `span.set_attribute()` for custom data

**Example:**
```python
from tracing_config import configure_tracing, get_tracer

configure_tracing(service_name="my-agent")
tracer = get_tracer(__name__)

with tracer.start_as_current_span("my_operation") as span:
    span.set_attribute("user_id", "123")
    # Do work...
```

### trace_database.py
Logs agent activity to PostgreSQL.

**Key Methods:**
- `log_agent_run(agent_name, trace_id, user_input, model, status, error_message=None)`
  - Creates agent_runs record
  - Returns run_id for tool call linking
  
- `log_mcp_tool_call(run_id, tool_name, input_params, output_params, duration_ms)`
  - Logs individual tool invocations
  - Records parameters and timing
  
- `log_agent_decision(run_id, decision_type, reasoning, options_considered, selected_choice, confidence_score)`
  - Logs reasoning process
  - Tracks decision alternatives
  
- `query_traces(trace_id)`
  - Returns unified view: agent_run, mcp_tool_calls, agent_decisions, otel_spans
  - Single function to retrieve entire trace

**Example:**
```python
from trace_database import TraceDatabase

db = TraceDatabase(os.getenv("DATABASE_URL"))

# Log a run
run_id = db.log_agent_run(
    agent_name="weather-agent",
    trace_id=trace_id,
    user_input="What's the weather?",
    model="gpt-4o-mini",
    status="running"
)

# Log tool call
db.log_mcp_tool_call(
    run_id=run_id,
    tool_name="get_weather",
    input_params={"location": "San Francisco"},
    output_params={"forecast": "Sunny", "temp": 72},
    duration_ms=150
)

# Retrieve complete trace
traces = db.query_traces(trace_id)
print(f"Run: {traces['agent_run']}")
print(f"Tools: {traces['mcp_tool_calls']}")
print(f"Decisions: {traces['agent_decisions']}")
```

### document_manager.py
Tracks knowledge system documents.

**Key Methods:**
- `register_document(name, path, doc_type, tags=None, ai_generated=False)`
  - Creates document entry
  - Computes content hash
  - Returns doc_id
  
- `log_change(document_path, change_type, change_reason, trace_id=None)`
  - Records modification
  - Compares current hash to previous
  - Links to agent run via trace_id
  
- `track_file_changes()`
  - Auto-detects changes on disk
  - Logs differences
  
- `get_document_history(doc_id)`
  - Returns full change log
  
- `export_audit_report(doc_id, output_format="csv")`
  - Generates compliance report

**Example:**
```python
from document_manager import DocumentManager

doc_mgr = DocumentManager(knowledge_dir="./Knowledge")

# Register document
doc_id = doc_mgr.register_document(
    name="project_notes.md",
    path="./Knowledge/project_notes.md",
    doc_type="note",
    tags=["project", "ai-generated"],
    ai_generated=True
)

# Track change with trace link
doc_mgr.log_change(
    document_path="./Knowledge/project_notes.md",
    change_type="modified",
    change_reason="Updated by weather agent",
    trace_id=trace_id  # Links to agent run!
)

# Get history
history = doc_mgr.get_document_history(doc_id)
for change in history:
    print(f"{change['created_at']}: {change['change_type']} - {change['change_reason']}")

# Export for audit
doc_mgr.export_audit_report(doc_id, output_format="csv")
```

### sample_agent.py
Complete example demonstrating all three systems.

**Features:**
- Agent Framework with OpenAI client
- Two example tools: `get_weather`, `register_document`
- Full tracing with span attributes
- Database logging for runs & decisions
- Document management integration
- Query results back from database

**Run:**
```bash
python agents/sample_agent.py
```

---

## 📊 Database Schema

**8 Table Groups:**

1. **Audit** (1 table)
   - `users` - Agent/user identities with timestamp tracking

2. **Knowledge Management** (2 tables)
   - `documents` - Document registry with content hashes
   - `document_changes` - Full audit trail of modifications

3. **Agent Execution** (3 tables)
   - `agent_runs` - High-level agent invocations
   - `mcp_tool_calls` - Individual tool invocations with timing
   - `agent_decisions` - Reasoning and choice logs

4. **n8n Observability** (3 tables)
   - `n8n_executions` - Workflow runs
   - `n8n_node_logs` - Per-node execution details
   - `n8n_execution_context` - Variable snapshots

5. **Cross-System Linking** (1 table)
   - `trace_links` - Relationships between systems (agent→document, n8n→agent, etc.)

6. **OpenTelemetry** (1 table)
   - `otel_spans` - Native span storage for advanced queries

7. **Views** (3 views for analytics)
   - `v_agent_activity` - Agent statistics (runs, tokens, success rate)
   - `v_document_activity` - Document modifications
   - `v_workflow_stats` - n8n performance metrics

8. **Indexes & Triggers** (Full coverage)
   - Indexes on all join columns, timestamps, IDs
   - Triggers for automatic `updated_at` management

See [Knowledge/observability/schema.sql](Knowledge/observability/schema.sql) for complete DDL.

---

## 🔗 Integration Points

### Agent ↔ Database
```python
# 1. Agent logs run
run_id = db.log_agent_run(agent_name, trace_id, user_input, model="gpt-4o-mini", status="running")

# 2. Agent completes
db.log_agent_decision(run_id, "response_generated", reasoning="...", selected_choice="weather")

# 3. Query later
traces = db.query_traces(trace_id)
```

### Document ↔ Agent
```python
# When agent generates/modifies document
doc_mgr.register_document(name, path, doc_type, ai_generated=True)

# Link to agent run via trace_id
doc_mgr.log_change(
    document_path, 
    change_type="created",
    change_reason="Generated by agent",
    trace_id=trace_id  # Connects to agent_runs.trace_id
)

# Query unified view
SELECT * FROM trace_links WHERE source_id = trace_id;
```

### n8n ↔ Database
```json
{
  "nodes": [
    {
      "id": "webhook",
      "name": "Workflow Trigger",
      "type": "n8n-nodes-base.webhook",
      "config": { "path": "n8n/execution-webhook" }
    },
    {
      "id": "postgres_insert",
      "name": "Log to Database",
      "type": "n8n-nodes-base.postgres",
      "config": {
        "operation": "insert",
        "table": "n8n_executions",
        "columns": "workflow_id,execution_id,status,duration_ms"
      }
    }
  ]
}
```

Import [n8n_execution_logger_workflow.json](Knowledge/observability/n8n_execution_logger_workflow.json) to n8n UI.

---

## 📈 Analytics Examples

### Agent Performance
```sql
SELECT * FROM v_agent_activity 
WHERE agent_name = 'sample-agent'
  AND created_at > now() - interval '24 hours';

-- Returns: total_runs, success_rate, avg_duration_ms, total_tokens, avg_tokens
```

### Document Audit Trail
```sql
SELECT * FROM v_document_activity 
WHERE document_id = <doc_id>
ORDER BY created_at;

-- Shows: who changed what, when, why (reason)
```

### Workflow Metrics
```sql
SELECT * FROM v_workflow_stats 
WHERE workflow_id = 'execution-logger'
AND created_at > now() - interval '7 days';

-- Returns: total_executions, success_rate, avg_node_duration_ms, bottleneck nodes
```

### Cross-System Dependencies
```sql
SELECT 
    source_type, source_id,
    target_type, target_id,
    relationship
FROM trace_links
WHERE source_id = '<trace_id>' OR target_id = '<trace_id>';

-- Maps agent→documents, n8n→agents, etc.
```

---

## 🔍 Debugging

### VSCode AI Toolkit Inspector
1. **Enable automatic tracing** (sample_agent.py does this)
2. **Open Inspector**: Command Palette → `ai-mlstudio.tracing.open`
3. **View traces**: http://localhost:4317 in Inspector
4. **Visualize**: Flamegraph shows span timing and nesting

### Database Queries
```bash
psql -d n8n_traceability

-- Recent agent runs
SELECT created_at, agent_name, status FROM agent_runs 
ORDER BY created_at DESC LIMIT 10;

-- Tool invocations for a run
SELECT tool_name, duration_ms, input_params 
FROM mcp_tool_calls 
WHERE run_id = '<run_id>';

-- Document modifications
SELECT created_at, document_id, change_type, change_reason 
FROM document_changes 
WHERE trace_id = '<trace_id>';

-- Full trace
SELECT * FROM otel_spans WHERE trace_id = '<trace_id>';
```

### Logs
```bash
# Agent logs (from sample_agent.py print statements)
tail -f logs/agents.log

# PostgreSQL logs
tail -f /var/log/postgresql/postgresql.log  # Linux path varies

# n8n workflow logs
tail -f ./n8n-data/logs/n8n.log  # If n8n is running locally
```

---

## ⚙️ Configuration

### Environment Variables (.env)
```bash
# PostgreSQL
DATABASE_URL=postgresql://postgres:password@localhost:5432/n8n_traceability

# OpenTelemetry
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
OTEL_EXISTS_ENABLED=true

# Agent Framework
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini

# Knowledge Management
KNOWLEDGE_DIR=./Knowledge

# Logging
LOG_LEVEL=DEBUG
```

See [.env.example](.env.example) for full reference.

---

## 🧪 Testing

### Unit Tests (Phase 3 checklist)
```bash
# Test individual modules
pytest tests/test_tracing_config.py
pytest tests/test_trace_database.py
pytest tests/test_document_manager.py
```

### Integration Tests
```bash
# Test agent ↔ database
pytest tests/test_agent_integration.py

# Test end-to-end flow
python agents/sample_agent.py
psql -d n8n_traceability -c "SELECT COUNT(*) FROM agent_runs;"
```

### Performance Tests (Target metrics)
- Agent run: < 5 seconds (model latency excluded)
- Document change logging: < 100ms
- Query traces: < 500ms
- Batch n8n logging: < 1 second

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| [TRACING_SETUP.md](Knowledge/observability/TRACING_SETUP.md) | Installation instructions & code examples |
| [schema.sql](Knowledge/observability/schema.sql) | Complete PostgreSQL DDL |
| [IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md) | Phase-by-phase implementation guide |
| [.env.example](.env.example) | Environment variable template |
| [requirements.txt](requirements.txt) | Python dependencies |

---

## 🐛 Troubleshooting

### PostgreSQL Connection Error
```
ERROR: connection to database failed
```
✅ **Fix**: Verify DATABASE_URL, test connection:
```bash
psql -U postgres -h localhost -d n8n_traceability -c "SELECT 1;"
```

### Traces Not Appearing
```
No spans visible in VSCode Inspector
```
✅ **Fix**: Verify OTEL endpoint is running, check .env:
```bash
curl -v http://localhost:4317
# Should connect (even if Collector not running, connection should be possible)
```

### Agent Framework Import Error
```
ModuleNotFoundError: No module named 'agent_framework'
```
✅ **Fix**: Install exact version:
```bash
pip install agent-framework-azure-ai==1.0.0b260107 agent-framework-core==1.0.0b260107
```

### Document Manager File Not Found
```
FileNotFoundError: [Errno 2] No such file or directory
```
✅ **Fix**: Ensure knowledge directory exists:
```bash
mkdir -p Knowledge/documents
```

See [IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md#troubleshooting-guide) for more.

---

## 📋 Next Steps

### This Week
- [ ] Run PostgreSQL schema setup
- [ ] Install Python dependencies
- [ ] Execute sample agent
- [ ] Verify VSCode Inspector traces

### Next 1-2 Weeks
- [ ] Import n8n workflow
- [ ] Test cross-system linking
- [ ] Create analytics queries
- [ ] Document operational procedures

### Ongoing
- [ ] Integrate additional agents
- [ ] Expand knowledge management
- [ ] Build compliance dashboards
- [ ] Performance optimization

See [IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md) for detailed checklist.

---

## 📞 Support

**Issues?** Check:
1. [IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md#troubleshooting-guide) - Troubleshooting
2. [TRACING_SETUP.md](Knowledge/observability/TRACING_SETUP.md) - Setup guide
3. Database logs: `psql -d n8n_traceability -c "SELECT * FROM agent_runs LIMIT 1;"`
4. Environment: `python -c "import agent_framework; print('OK')"`

---

**Status**: ✅ Infrastructure Complete | ⏳ Integration Testing Pending

**Created**: January 2024
**Last Updated**: 2024-01-XX
