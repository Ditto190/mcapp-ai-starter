# 📊 Unified Traceability System Setup

Complete guide for implementing traceability across AI Agents, n8n Workflows, and Knowledge Management.

---

## 🏗️ ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────┐
│                    TRACEABILITY LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐       │
│  │  AI Agents   │   │ n8n Workflows│   │  Documents   │       │
│  │              │   │              │   │ & Knowledge  │       │
│  │ • OpenTel.   │   │ • Exec Logs  │   │ • Change Log │       │
│  │ • Tool Calls │   │ • Node Data  │   │ • Metadata   │       │
│  │ • Runs       │   │ • Context    │   │ • Versions   │       │
│  └──────────────┘   └──────────────┘   └──────────────┘       │
│        │                   │                    │               │
│        └───────────────────┴────────────────────┘               │
│                           │                                     │
│                    ┌──────▼──────┐                             │
│                    │  PostgreSQL  │                             │
│                    │  (Local Db)  │                             │
│                    └──────────────┘                             │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  OpenTelemetry Integration (AI Toolkit Inspector)     │   │
│  │  - VSCode Trace Viewer (http://localhost:4317)        │   │
│  │  - Real-time span visualization                       │   │
│  │  - Performance metrics & flamegraphs                  │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1: Database Setup
- [ ] Install PostgreSQL locally (or use cloud instance)
- [ ] Create database: `n8n_traceability`
- [ ] Run `schema.sql` to create tables
- [ ] Verify tables and indexes created

### Phase 2: Python Agent Framework Tracing
- [ ] Create Python virtual environment
- [ ] Install `agent-framework` with OpenTelemetry
- [ ] Configure `configure_otel_providers()` for AI Toolkit
- [ ] Create sample agent with tracing enabled
- [ ] Test traces appear in VSCode Inspector

### Phase 3: Document Management System
- [ ] Create `Knowledge/docs_manager.py` module
- [ ] Implement automatic change detection & logging
- [ ] Set up git hooks for document versioning
- [ ] Create metadata indexing system

### Phase 4: n8n Observability
- [ ] Create n8n workflow: "Execution Logger"
- [ ] Add Function nodes for data serialization
- [ ] Connect Postgres nodes for logging
- [ ] Configure webhook for execution capture
- [ ] Test logging to PostgreSQL

### Phase 5: Integration & Dashboard
- [ ] Create SQL views for unified querying
- [ ] Build observability dashboard (optional: Grafana)
- [ ] Create CLI tools for trace analysis
- [ ] Write runbooks & troubleshooting guides

---

## 🗄️ DATABASE SETUP

### 1. PostgreSQL Installation

**Windows (via PowerShell):**
```powershell
# Using Chocolatey
choco install postgresql

# Or download from https://www.postgresql.org/download/windows/
```

**Linux/Mac:**
```bash
# macOS
brew install postgresql@15

# Ubuntu
sudo apt-get install postgresql postgresql-contrib
```

### 2. Create Database for Traceability

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE n8n_traceability;

# Create traceability user (optional, for security)
CREATE USER traceability_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE n8n_traceability TO traceability_user;
\q
```

### 3. Load Schema

```bash
# Run schema.sql
psql -U postgres -d n8n_traceability -f schema.sql

# Verify tables created
psql -U postgres -d n8n_traceability
\dt  # List tables
\q
```

### 4. Connection String

**For Python/n8n:**
```
postgresql://postgres:password@localhost:5432/n8n_traceability
```

---

## 🐍 PYTHON AGENT FRAMEWORK SETUP

### 1. Create Agent Project Structure

```
agents/
├── config/
│   ├── .env           # Environment variables
│   └── settings.py    # Configuration
├── tracing/
│   ├── __init__.py
│   ├── otel_config.py # OpenTelemetry setup
│   └── db_handler.py  # PostgreSQL logging
├── agents/
│   ├── __init__.py
│   └── weather_agent.py  # Example agent
├── mcp_tools/
│   ├── __init__.py
│   └── sample_tools.py
├── requirements.txt
├── .vscode/
│   ├── launch.json    # Debugging config
│   └── tasks.json     # Build tasks
└── main.py            # Entry point
```

### 2. Install Dependencies

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows

# Install agent framework + tracing
pip install agent-framework-azure-ai==1.0.0b260107
pip install agent-framework-core==1.0.0b260107
pip install opentelemetry-sdk opentelemetry-exporter-otlp-proto-grpc
pip install psycopg2-binary  # PostgreSQL client
pip install pydantic python-dotenv
```

### 3. Configure OpenTelemetry

**File: `tracing/otel_config.py`**

```python
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import Resource

def configure_tracing(vs_code_port=4317):
    """Configure OpenTelemetry for AI Toolkit Inspector."""
    
    # Create resource with service info
    resource = Resource.create({
        "service.name": "ai-agent-system",
        "service.version": "1.0.0",
        "environment": "development"
    })
    
    # Create tracer provider
    tracer_provider = TracerProvider(resource=resource)
    
    # Add exporter for AI Toolkit
    otlp_exporter = OTLPSpanExporter(
        endpoint=f"http://localhost:{vs_code_port}",
        insecure=True
    )
    
    tracer_provider.add_span_processor(
        BatchSpanProcessor(otlp_exporter)
    )
    
    trace.set_tracer_provider(tracer_provider)
    return tracer_provider
```

### 4. Configure Agent Framework Observability

**File: `agents/weather_agent.py`**

```python
from agent_framework import Agent, tool
from agent_framework.observability import configure_otel_providers, get_tracer
from agent_framework.openai import OpenAIResponsesClient
from opentelemetry import trace
from opentelemetry.trace.span import format_trace_id
from pydantic import Field
from typing_extensions import Annotated

# Configure observability (done once at startup)
configure_otel_providers(
    vs_code_extension_port=4317,
    enable_sensitive_data=True  # Capture prompts/responses
)

@tool(approval_mode="never_require")
async def get_weather(location: Annotated[str, Field(description="Location for weather")]) -> str:
    """Get weather for a location."""
    return f"Weather in {location}: Sunny, 72°F"

async def main():
    tracer = get_tracer()
    
    # Get current trace ID for linking
    with tracer.start_as_current_span("Weather Agent Demo", kind=trace.SpanKind.CLIENT) as span:
        trace_id = format_trace_id(span.get_span_context().trace_id)
        print(f"Trace ID: {trace_id}")
        
        # Create agent
        agent = Agent(
            name="WeatherAgent",
            client=OpenAIResponsesClient(),
            tools=[get_weather],
            instructions="You are a weather assistant.",
        )
        
        # Run agent - tracing happens automatically
        response = await agent.run("What's the weather in Paris?")
        print(f"Response: {response}")
        
        # Store trace_id in database for cross-system linking
        # (see db_handler.py below)
```

### 5. Database Handler

**File: `tracing/db_handler.py`**

```python
import psycopg2
from psycopg2.extras import Json
import json
from datetime import datetime

class TracingDatabase:
    def __init__(self, connection_string: str):
        self.conn_string = connection_string
    
    def log_agent_run(self, trace_id: str, agent_name: str, 
                     input_data: dict, output_data: dict, 
                     duration_ms: int, status: str):
        """Log agent execution to database."""
        with psycopg2.connect(self.conn_string) as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO agent_runs 
                    (agent_id, trace_id, input_data, output_data, 
                     execution_status, execution_start, duration_ms)
                    VALUES 
                    ((SELECT id FROM users WHERE identifier = %s),
                     %s, %s, %s, %s, NOW(), %s)
                """, (agent_name, trace_id, Json(input_data), 
                      Json(output_data), status, duration_ms))
                conn.commit()
    
    def log_mcp_tool_call(self, run_id: int, tool_name: str,
                         input_params: dict, output_data: dict,
                         duration_ms: int, status: str):
        """Log MCP tool call."""
        with psycopg2.connect(self.conn_string) as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO mcp_tool_calls
                    (run_id, tool_name, input_params, output_data,
                     execution_status, call_start, duration_ms)
                    VALUES (%s, %s, %s, %s, %s, NOW(), %s)
                """, (run_id, tool_name, Json(input_params),
                      Json(output_data), status, duration_ms))
                conn.commit()
```

---

## 📄 DOCUMENT MANAGEMENT SYSTEM

### 1. Document Change Tracker

**File: `Knowledge/docs_manager.py`**

```python
import hashlib
import os
from pathlib import Path
import psycopg2
from psycopg2.extras import Json
from datetime import datetime

class DocumentManager:
    def __init__(self, knowledge_dir: str, db_conn_string: str):
        self.knowledge_dir = Path(knowledge_dir)
        self.db_conn = db_conn_string
    
    def compute_hash(self, content: bytes) -> str:
        """Compute SHA256 hash of content."""
        return hashlib.sha256(content).hexdigest()
    
    def track_document(self, file_path: str, agent_id: int = None):
        """Register document in database."""
        full_path = self.knowledge_dir / file_path
        
        if not full_path.exists():
            raise FileNotFoundError(f"{full_path}")
        
        content = full_path.read_bytes()
        content_hash = self.compute_hash(content)
        
        with psycopg2.connect(self.db_conn) as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO documents
                    (name, path, type, content_hash, created_by, size_bytes)
                    VALUES (%s, %s, %s, %s, 
                           (SELECT id FROM users WHERE type='system'),
                           %s)
                    ON CONFLICT (path) DO UPDATE
                    SET content_hash = EXCLUDED.content_hash,
                        updated_at = NOW()
                    RETURNING id
                """, (full_path.name, str(file_path), 
                      full_path.suffix[1:], content_hash,
                      full_path.stat().st_size))
                return cur.fetchone()[0]
    
    def log_change(self, file_path: str, change_type: str, 
                  previous_hash: str, new_hash: str, 
                  trace_id: str = None):
        """Log document change."""
        with psycopg2.connect(self.db_conn) as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO document_changes
                    (document_id, change_type, previous_hash, new_hash,
                     changed_by, trace_id, change_timestamp)
                    SELECT 
                        (SELECT id FROM documents WHERE path = %s),
                        %s, %s, %s,
                        (SELECT id FROM users WHERE type='system'),
                        %s, NOW()
                """, (str(file_path), change_type, 
                      previous_hash, new_hash, trace_id))
                conn.commit()
```

---

## 🔄 n8n WORKFLOW OBSERVABILITY

### 1. Create "Execution Logger" Workflow

**n8n Workflow Template:**

```json
{
  "name": "Execution Logger",
  "nodes": [
    {
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [100, 300],
      "parameters": {
        "method": "POST",
        "path": "n8n/execution-log"
      }
    },
    {
      "name": "Function - Parse Data",
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [300, 300],
      "parameters": {
        "functionCode": "items[0].json.logged_at = new Date().toISOString();\nreturn items;"
      }
    },
    {
      "name": "Postgres - Log Execution",
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.6,
      "position": [500, 300],
      "parameters": {
        "operation": "insert",
        "table": "n8n_executions",
        "columns": [
          "workflow_id", "workflow_name", "execution_id",
          "execution_status", "started_at", "completed_at",
          "duration_ms", "execution_data"
        ]
      }
    }
  ]
}
```

---

## 🎯 TESTING & VERIFICATION

### 1. Test Agent Tracing

```bash
# Start AI Toolkit Inspector (VSCode command palette)
# Command: "AI Toolkit: Trace Viewer" or "ai-mlstudio.tracing.open"

# Run agent with Python
python main.py

# Check traces appear in VSCode Inspector at http://localhost:4317
```

### 2. Test Database Logging

```bash
# Connect to PostgreSQL
psql -d n8n_traceability

# Check tables populated
SELECT * FROM agent_runs;
SELECT * FROM document_changes;
SELECT * FROM n8n_executions;

# View activity summaries
SELECT * FROM v_agent_activity;
SELECT * FROM v_document_activity;
SELECT * FROM v_workflow_stats;
```

### 3. Test Document Tracking

```bash
# Run document manager
python -c "from tracing.db_handler import DocumentManager; \
           dm = DocumentManager('./Knowledge', 'postgresql://...'); \
           dm.track_document('observability/TRACING_SETUP.md')"
```

---

## 📊 QUERIES & ANALYTICS

### Get Agent Performance Over Time

```sql
SELECT 
    DATE(created_at) as date,
    agent_id,
    COUNT(*) as runs,
    AVG(duration_ms) as avg_duration,
    SUM(COALESCE((tokens_used->>'total')::int, 0)) as total_tokens
FROM agent_runs
GROUP BY DATE(created_at), agent_id
ORDER BY date DESC;
```

### Track Document Modifications

```sql
SELECT 
    d.name,
    dc.change_timestamp,
    u.name as modified_by,
    dc.change_type,
    ar.id as agent_run_id
FROM documents d
JOIN document_changes dc ON d.id = dc.document_id
LEFT JOIN users u ON dc.changed_by = u.id
LEFT JOIN agent_runs ar ON dc.trace_id = ar.trace_id
ORDER BY dc.change_timestamp DESC;
```

### n8n Workflow Bottlenecks

```sql
SELECT 
    workflow_name,
    node_name,
    COUNT(*) as executions,
    AVG(duration_ms) as avg_node_duration,
    MAX(duration_ms) as max_duration
FROM n8n_node_logs
WHERE completed_at > NOW() - interval '7 days'
GROUP BY workflow_name, node_name
ORDER BY avg_node_duration DESC;
```

---

## 🔗 CROSS-SYSTEM LINKING EXAMPLES

### When Agent Modifies Document

```python
# In agent code after modifying document
trace_link_db.insert_link(
    source_system='agent',
    source_id=agent_run_id,
    target_system='document',
    target_id=document_id,
    relationship_type='modified'
)
```

### When Workflow Triggers Agent

```sql
-- In n8n Function node
INSERT INTO trace_links 
(source_system, source_id, target_system, target_id, relationship_type)
VALUES ('n8n', $1, 'agent', $2, 'triggered');
```

---

## 🚀 PERFORMANCE OPTIMIZATION

### Archiving Old Data (Recommended: Monthly)

```sql
-- Archive logs older than 90 days
INSERT INTO agent_runs_archive 
SELECT * FROM agent_runs 
WHERE created_at < NOW() - interval '90 days';

DELETE FROM agent_runs 
WHERE created_at < NOW() - interval '90 days';

-- Same for other tables...
```

### Partitioning Large Tables

```sql
-- Partition agent_runs by month for large datasets
CREATE TABLE agent_runs_2025_01 PARTITION OF agent_runs
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
```

---

## 📚 ADDITIONAL RESOURCES

- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [AI Toolkit Agent Inspector](https://github.com/Azure/azure-ai-toolkit)
- [n8n Workflow Customization](https://docs.n8n.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Next Steps:**
1. Set up PostgreSQL locally
2. Run schema.sql
3. Create Python virtual environment
4. Implement agent with tracing
5. Test traces in VSCode Inspector
6. Build n8n logging workflow
7. Create dashboard queries
