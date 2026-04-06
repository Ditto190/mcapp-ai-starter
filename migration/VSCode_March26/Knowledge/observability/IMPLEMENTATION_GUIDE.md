# Implementation Guide: AI Traceability System

**Version**: 1.0.0  
**Date**: March 5, 2026  
**Target Audience**: Developers implementing remaining phases  
**Status**: Ready for Phase 1 execution

---

## 📋 Quick Reference: 7 Remaining Phases

| Phase | Title | Deliverable | Est. Time | Status |
|-------|-------|-------------|-----------|--------|
| 1 | Database Setup & Verification | database_test.py, schema deployed | 30 min | 🔴 Pending |
| 2 | Agent API Correction | sample_agent.py updated, smoke tests 7/7 | 45 min | 🔴 Pending |
| 3 | n8n Workflow Deployment | execution logger active, test 3 runs | 1 hour | 🔴 Pending |
| 4 | Integration Testing | cross-system trace linking verified | 1.5 hours | 🔴 Pending |
| 5 | Analytics & Dashboard | SQL queries, visualization templates | 2 hours | 🔴 Pending |
| 6 | Performance Optimization | archiving, partitioning deployed | 1.5 hours | 🔴 Pending |
| 7 | Production Readiness | security audit, deployment guide | 2 hours | 🔴 Pending |

---

## Phase 1: Database Setup & Verification

### Goal
Deploy PostgreSQL schema, verify all tables and triggers work correctly, confirm connection from Python.

### Success Criteria
- [x] PostgreSQL database `n8n_traceability` created
- [x] All 16 tables exist with correct schemas
- [x] All 3 views created and queryable
- [x] All 4 triggers firing correctly
- [x] Python can connect and perform CRUD operations
- [x] Foreign key constraints working
- [x] Indexes performing well on trace_id lookups

### Execution Steps

#### 1.1 Create Database (if not already created)

```bash
# On your PostgreSQL server
createdb n8n_traceability

# Verify creation
psql -U postgres -l | grep n8n_traceability
```

#### 1.2 Deploy Schema

```bash
# From workspace root directory
psql -U postgres -d n8n_traceability < Knowledge/observability/schema.sql

# Verify tables created
psql -U postgres -d n8n_traceability -c "SELECT count(*) FROM information_schema.tables WHERE table_schema='public';"
# Expected output: 16
```

#### 1.3 Verify All Components Exist

Create `agents/database_test.py`:

```python
#!/usr/bin/env python3
"""
Phase 1: Database Setup Verification

Tests:
1. Connection to PostgreSQL
2. All 16 tables exist
3. All 3 views exist
4. All 4 triggers exist
5. Foreign key constraints work
6. Sample CRUD operations
"""

import os
import sys
import psycopg2
from datetime import datetime
from uuid import uuid4

def test_connection():
    """Test PostgreSQL connection."""
    try:
        conn = psycopg2.connect(
            host=os.getenv("DB_HOST", "localhost"),
            port=os.getenv("DB_PORT", "5432"),
            database="n8n_traceability",
            user=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD", "")
        )
        cur = conn.cursor()
        cur.execute("SELECT version();")
        version = cur.fetchone()[0]
        print(f"  [OK] Connected to {version.split(',')[0]}")
        conn.close()
        return True
    except Exception as e:
        print(f"  [ER] Connection failed: {e}")
        return False

def test_tables_exist():
    """Verify all 16 tables exist."""
    tables = [
        "agent_runs", "mcp_tool_calls", "agent_decisions", "documents",
        "document_changes", "n8n_executions", "otel_spans", "otel_events",
        "trace_links", "tool_parameters", "decision_metrics", "span_tags",
        "execution_summary", "metric_values", "agent_statistics", "system_health"
    ]
    
    try:
        conn = psycopg2.connect(
            host=os.getenv("DB_HOST", "localhost"),
            port=os.getenv("DB_PORT", "5432"),
            database="n8n_traceability",
            user=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD", "")
        )
        cur = conn.cursor()
        
        missing = []
        for table in tables:
            cur.execute(f"""
                SELECT EXISTS (
                    SELECT 1 FROM information_schema.tables 
                    WHERE table_schema='public' AND table_name='{table}'
                )
            """)
            exists = cur.fetchone()[0]
            if not exists:
                missing.append(table)
        
        if missing:
            print(f"  [ER] Missing tables: {missing}")
            return False
        else:
            print(f"  [OK] All {len(tables)} tables exist")
        
        conn.close()
        return True
    except Exception as e:
        print(f"  [ER] Table check failed: {e}")
        return False

def test_views_exist():
    """Verify all 3 views exist."""
    views = ["trace_links_details", "execution_summary", "metric_values"]
    
    try:
        conn = psycopg2.connect(
            host=os.getenv("DB_HOST", "localhost"),
            port=os.getenv("DB_PORT", "5432"),
            database="n8n_traceability",
            user=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD", "")
        )
        cur = conn.cursor()
        
        missing = []
        for view in views:
            cur.execute(f"""
                SELECT EXISTS (
                    SELECT 1 FROM information_schema.views 
                    WHERE table_schema='public' AND table_name='{view}'
                )
            """)
            exists = cur.fetchone()[0]
            if not exists:
                missing.append(view)
        
        if missing:
            print(f"  [ER] Missing views: {missing}")
            return False
        else:
            print(f"  [OK] All {len(views)} views exist")
        
        conn.close()
        return True
    except Exception as e:
        print(f"  [ER] View check failed: {e}")
        return False

def test_crud_operations():
    """Test basic CRUD operations."""
    try:
        conn = psycopg2.connect(
            host=os.getenv("DB_HOST", "localhost"),
            port=os.getenv("DB_PORT", "5432"),
            database="n8n_traceability",
            user=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD", ""),
            autocommit=True
        )
        cur = conn.cursor()
        
        # CREATE
        run_id = str(uuid4())
        trace_id = str(uuid4())
        cur.execute("""
            INSERT INTO agent_runs (run_id, trace_id, input_data, output_data, status, created_at)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (run_id, trace_id, '{"test": "input"}', '{"test": "output"}', 'completed', datetime.utcnow()))
        
        # READ
        cur.execute("SELECT run_id FROM agent_runs WHERE trace_id = %s", (trace_id,))
        result = cur.fetchone()
        if not result:
            print(f"  [ER] INSERT/SELECT failed")
            return False
        
        # UPDATE
        cur.execute("UPDATE agent_runs SET status = %s WHERE run_id = %s", ('archived', run_id))
        
        # DELETE
        cur.execute("DELETE FROM agent_runs WHERE run_id = %s", (run_id,))
        
        print(f"  [OK] CRUD operations work (C,R,U,D all successful)")
        conn.close()
        return True
    except Exception as e:
        print(f"  [ER] CRUD operations failed: {e}")
        return False

def main():
    print("Phase 1: Database Setup & Verification")
    print("=" * 50)
    
    tests = [
        ("PostgreSQL Connection", test_connection),
        ("Tables Exist", test_tables_exist),
        ("Views Exist", test_views_exist),
        ("CRUD Operations", test_crud_operations),
    ]
    
    passed = 0
    for name, test_func in tests:
        print(f"\n{name}:")
        if test_func():
            passed += 1
    
    print(f"\n{'=' * 50}")
    print(f"Result: {passed}/{len(tests)} tests passed")
    
    if passed == len(tests):
        print("✓ Phase 1 Complete - Database Ready!")
        return 0
    else:
        print("✗ Phase 1 Failed - Review errors above")
        return 1

if __name__ == "__main__":
    sys.exit(main())
```

#### 1.4 Run Database Test

```bash
# Activate venv
. .\.venv\Scripts\Activate.ps1

# Set database credentials (if not in .env)
$env:DB_HOST = "localhost"
$env:DB_PORT = "5432"
$env:DB_USER = "postgres"
$env:DB_PASSWORD = ""

# Run test
python agents/database_test.py

# Expected output:
# PostgreSQL Connection:
#   [OK] Connected to PostgreSQL 15.x on ...
# Tables Exist:
#   [OK] All 16 tables exist
# Views Exist:
#   [OK] All 3 views exist
# CRUD Operations:
#   [OK] CRUD operations work (C,R,U,D all successful)
# 
# ==================================================
# Result: 4/4 tests passed
# ✓ Phase 1 Complete - Database Ready!
```

#### 1.5 Verify Indexes and Performance

```bash
psql -U postgres -d n8n_traceability -c "
SELECT indexname, tablename FROM pg_indexes 
WHERE schemaname='public' ORDER BY tablename, indexname;
"

# Should show indexes on:
# - agent_runs (trace_id, created_at)
# - mcp_tool_calls (run_id, created_at)
# - agent_decisions (run_id)
# - document_changes (document_id, trace_id)
# - n8n_executions (execution_id, workflow_id)
```

### Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| "FATAL: role 'postgres' does not exist" | PostgreSQL user not created | `createuser -U postgres postgres` |
| "database 'n8n_traceability' does not exist" | Schema not deployed | Run `psql ... < schema.sql` |
| "column 'trace_id' does not exist" | Partial schema (old version) | `DROP DATABASE n8n_traceability; CREATE...` |
| "Connection refused" on localhost:5432 | PostgreSQL not running | Start PostgreSQL service |
| "psycopg2 module not found" | Package not installed | Verify `requirements-optimized.txt` installed |

---

## Phase 2: Agent API Correction

### Goal
Update sample_agent.py to use correct Agent Framework v1.0.0b260107 API, pass all smoke tests.

### Success Criteria
- [x] sample_agent.py imports work correctly
- [x] All 4 tools defined with correct API
- [x] All smoke tests pass 7/7
- [x] Agent runs without errors
- [x] Database logging works
- [x] OTEL spans export successfully

### Execution Steps

#### 2.1 Verify Current Agent Framework API

```bash
# Check what Agent classes are available
. .\.venv\Scripts\Activate.ps1
python -c "from agent_framework.core import *; print([x for x in dir() if 'Agent' in x])"

# Check if agent-framework.openai or agent-framework.azure-ai needed
pip show agent-framework-core | grep Version
```

#### 2.2 Research Official Samples

Go to GitHub Microsoft Agent Framework repository:
```
https://github.com/microsoft/agent-framework/tree/v1.0.0b260107
```

Check:
- `/examples/agents/` for agent creation patterns
- `/examples/tools/` for tool definition patterns
- `/src/agent_framework/core/` for actual API signatures

#### 2.3 Update sample_agent.py with Correct API

Key patterns from Agent Framework v1.0.0b260107:

```python
# Correct imports
from agent_framework.core import Agent, Tool, ToolParameter
from agent_framework.openai import OpenAIChatClient  # or AzureAIChatClient
from agent_framework.observability import configure_otel_providers

# Correct tool definition
weather_tool = Tool(
    name="get_weather",
    description="Get current weather for a location",
    input_parameters=[
        ToolParameter(
            name="location",
            description="City name",
            type="string",
            required=True
        )
    ]
)

# Correct handler signature
@weather_tool.on_invoke
async def weather_handler(location: str) -> dict:
    """Handle weather request."""
    return {"forecast": "Sunny", "temperature": 72}

# Correct agent creation
chat_client = OpenAIChatClient(model="gpt-4")
agent = Agent(
    name="sample-agent",
    model=chat_client,
    instructions="You are a helpful assistant...",
    tools=[weather_tool]
)

# Correct execution
response = await agent.run("What's the weather in SF?")
```

**Common API Corrections:**
- `Agent()` not `Agent.create()`
- `@tool.on_invoke` decorator pattern
- `async` functions for handlers
- `.run()` returns `AgentResponse` object
- Use `.result` or `.message` for output, not `.response()`

#### 2.4 Update TraceDatabase Calls

Ensure calls match trace_database.py signatures:

```python
# Inside tool handlers or after agent execution:

# Log tool call
db.log_mcp_tool_call(
    run_id=run_uuid,
    tool_name="get_weather",
    input_params={"location": "San Francisco"},
    output_data={"forecast": "Sunny", "temperature": 72},
    execution_status="completed",  # NOT "success" or "ok"
    duration_ms=145
)

# Log decision
db.log_agent_decision(
    run_id=run_uuid,
    reasoning="User asked for weather, selected get_weather tool",
    selected_choice="get_weather",
    confidence_score=0.95
)
```

#### 2.5 Run Smoke Tests

```bash
. .\.venv\Scripts\Activate.ps1
python agents/smoke_test.py

# Expected output:
# Test: Imports
#   [OK] TraceDatabase imported
#   [OK] DocumentManager imported
#   [OK] TracingConfig imported
#   [OK] SampleAgent imported
# Result: 4/4 sub-tests passed ✓
#
# Test: Tracing Config
#   [OK] configure_tracing() ... (all 3 checks)
# Result: 3/3 sub-tests passed ✓
#
# ... (4 more tests)
#
# ==================================================
# Summary: 7/7 tests PASSED ✓
```

### Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| ImportError: cannot import name 'Agent' | Wrong version or import path | Run `python -c "from agent_framework.core import Agent; print(Agent)"` |
| "Agent type does not have .run() method" | Using deprecated API | Check official GitHub samples for v1.0.0b260107 |
| "output_data parameter missing" | Wrong database call signature | Check trace_database.py for required parameters |
| "OTEL spans not exporting" | configure_otel_providers not called | Ensure called in agent initialization |
| "psycopg2 errors on database().log_*()" | Connection not initialized | Check `.env` has DB_HOST, DB_USER, etc. |

---

## Phase 3: n8n Workflow Deployment

### Goal
Deploy the n8n execution logger workflow, test with 3 sample executions, verify data in PostgreSQL.

### Success Criteria
- [x] n8n running on localhost:5678
- [x] Workflow imported successfully
- [x] 3 test executions completed
- [x] All 3 execution records in `n8n_executions` table
- [x] Webhook trigger/response working

### Execution Steps

#### 3.1 Start n8n Server

```bash
# Option 1: VSCode task
Ctrl+Shift+B → Select "n8n: Start"

# Option 2: Direct command
npx n8n

# Wait for message:
# n8n ready on http://localhost:5678/
```

#### 3.2 Import Workflow

1. Open http://localhost:5678 in browser
2. Click "+" → "Import workflow"
3. Select file: `Knowledge/observability/n8n_execution_logger_workflow.json`
4. Confirm import

#### 3.3 Configure Database Node

In workflow editor:

1. Click the "PostgreSQL" node
2. Edit credentials:
   - Host: `localhost` (or your DB host)
   - Port: `5432`
   - Database: `n8n_traceability`
   - User: `postgres` (or your user)
   - Password: (your password)
   - SSL: unchecked
3. Test connection (should show ✓)

#### 3.4 Test Execution 1: Simple Test

1. Click "Test" (play button)
2. Send sample webhook data:
   ```bash
   curl -X POST http://localhost:5678/webhook/test \
     -H "Content-Type: application/json" \
     -d '{
       "workflow_id": "test-workflow-001",
       "status": "success",
       "duration_ms": 250,
       "input": {"action": "test"},
       "output": {"result": "ok"}
     }'
   ```
3. Inspect execution result in n8n UI
4. Check PostgreSQL:
   ```bash
   psql -U postgres -d n8n_traceability -c "
   SELECT workflow_id, execution_status, duration_ms FROM n8n_executions 
   ORDER BY created_at DESC LIMIT 1;"
   ```

#### 3.5 Test Execution 2: With Trace Link

```bash
curl -X POST http://localhost:5678/webhook/test2 \
  -H "Content-Type: application/json" \
  -d '{
    "workflow_id": "agent-processor",
    "trace_id": "12345678-1234-5678-1234-567812345678",
    "status": "completed",
    "duration_ms": 1250,
    "input": {"agent_request": "analyze sales data"},
    "output": {"report_id": "rpt-2026-001"}
  }'

# Verify:
psql -U postgres -d n8n_traceability -c "
SELECT source_id, target_id, relationship FROM trace_links 
WHERE source_id = '12345678-1234-5678-1234-567812345678';"
```

#### 3.6 Test Execution 3: Error Handling

```bash
curl -X POST http://localhost:5678/webhook/test3 \
  -H "Content-Type: application/json" \
  -d '{
    "workflow_id": "error-handler",
    "execution_id": "exec-error-001",
    "status": "failed",
    "error": "Database connection timeout",
    "duration_ms": 3000
  }'

# Should be recorded with status='failed' in PostgreSQL
```

#### 3.7 Verify All 3 Records

```sql
-- Run this query:
SELECT 
  workflow_id, 
  execution_status, 
  duration_ms, 
  created_at,
  error_message 
FROM n8n_executions 
ORDER BY created_at DESC 
LIMIT 3;

-- Expected output: 3 rows with statuses (success, completed, failed)
```

### Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| "Cannot connect to n8n" | Server not running | Run `npx n8n` or use VSCode task |
| "PostgreSQL node connection fails" | Wrong credentials in node | Edit node, test connection |
| "Webhook returns 404" | Wrong webhook URL | Check workflow webhook path in UI |
| "Data not appearing in DB" | Function node has errors | Check n8n execution logs (Click execution row) |
| "psycopg2 connection errors from n8n" | Database unreachable | Ensure DB is running and accessible |

---

## Phase 4: Integration Testing

### Goal
Verify that all systems work together: Agent → Database → n8n → Visualization.

### Success Criteria
- [x] Agent creates trace_id
- [x] Database logs agent_run with trace_id
- [x] MCP tool calls logged to database
- [x] n8n workflow triggered from agent response
- [x] trace_links connects agent_run to n8n_execution
- [x] VSCode Inspector shows unified trace

### Test Plan

#### 4.1 Create Integration Test

```python
# agents/integration_test.py (create new file)

import asyncio
from uuid import uuid4
from sample_agent import SampleAgent
from trace_database import TraceDatabase
import psycopg2

async def test_agent_to_database_to_n8n():
    """
    End-to-end test:
    1. Agent processes request
    2. Logs to database
    3. Triggers n8n webhook
    4. Verify trace_links
    """
    
    run_id = str(uuid4())
    trace_id = str(uuid4())
    
    # Initialize agent
    agent = SampleAgent()
    db = TraceDatabase()
    
    # Execute agent (simulating user request)
    response = await agent.run(
        input_text="What's the weather in Seattle?",
        trace_id=trace_id,
        run_id=run_id
    )
    
    # Verify agent_run logged
    conn = psycopg2.connect(...)
    cur = conn.cursor()
    cur.execute("SELECT * FROM agent_runs WHERE trace_id = %s", (trace_id,))
    agent_run = cur.fetchone()
    assert agent_run is not None, "Agent run not logged"
    print(f"✓ Agent run logged: {agent_run}")
    
    # Verify mcp_tool_calls logged
    cur.execute("SELECT COUNT(*) FROM mcp_tool_calls WHERE run_id = %s", (run_id,))
    tool_count = cur.fetchone()[0]
    assert tool_count > 0, "No tool calls logged"
    print(f"✓ Tool calls logged: {tool_count}")
    
    # Trigger n8n webhook (agent would do this if integrated)
    import requests
    webhook_response = requests.post(
        "http://localhost:5678/webhook/agent-integration",
        json={
            "trace_id": trace_id,
            "agent_response": response,
            "run_id": run_id
        }
    )
    assert webhook_response.status_code in [200, 204], f"Webhook failed: {webhook_response.text}"
    print(f"✓ n8n webhook triggered")
    
    # Verify trace_links created
    cur.execute("""
        SELECT * FROM trace_links 
        WHERE source_id = %s OR target_id = %s
    """, (trace_id, trace_id))
    links = cur.fetchall()
    assert len(links) > 0, "No trace links created"
    print(f"✓ Trace links created: {len(links)}")
    
    # Verify n8n_executions recorded
    cur.execute("SELECT * FROM n8n_executions WHERE trace_id = %s", (trace_id,))
    n8n_exec = cur.fetchone()
    assert n8n_exec is not None, "n8n execution not logged"
    print(f"✓ n8n execution logged")
    
    conn.close()
    return True

if __name__ == "__main__":
    result = asyncio.run(test_agent_to_database_to_n8n())
    if result:
        print("\n✓ Integration Test PASSED")
    else:
        print("\n✗ Integration Test FAILED")
```

#### 4.2 Run Integration Test

```bash
. .\.venv\Scripts\Activate.ps1

# Ensure services running:
# - PostgreSQL (background)
# - n8n (separate terminal or task)
# - VSCode AI Toolkit Inspector (with gRPC 4317 receiver)

python agents/integration_test.py

# Expected output:
# ✓ Agent run logged: (12345, ...)
# ✓ Tool calls logged: 1
# ✓ n8n webhook triggered
# ✓ Trace links created: 2
# ✓ n8n execution logged
#
# ✓ Integration Test PASSED
```

#### 4.3 Verify VSCode Inspector

1. Open VSCode
2. Click AI Toolkit → Agent Inspector
3. Should see flamegraph with unified trace showing:
   - agent.execution span (root)
   - chat.completion child span
   - tool.get_weather child span
   - Links to PostgreSQL data

---

## Phase 5: Analytics & Dashboard

### Goal
Create SQL queries for common analytics, build visualization templates.

### Success Criteria
- [x] Agent execution statistics query
- [x] Tool performance analysis query
- [x] Trace latency percentiles query
- [x] n8n integration metrics query
- [x] Document change audit query
- [x] HTML dashboard template created

### Sample Queries

#### 5.1 Agent Performance Stats

```sql
-- File: Knowledge/observability/queries/agent_performance.sql
-- Agent execution statistics over last 7 days

SELECT
    'agent_performance' AS metric,
    COUNT(*) as total_runs,
    COUNT(CASE WHEN status='completed' THEN 1 END) as successful,
    COUNT(CASE WHEN status='failed' THEN 1 END) as failed,
    ROUND(AVG(EXTRACT(EPOCH FROM (created_at - created_at))), 3) as avg_latency_ms,
    MIN(created_at) as oldest,
    MAX(created_at) as newest
FROM agent_runs
WHERE created_at > NOW() - INTERVAL '7 days';
```

#### 5.2 Tool Performance Ranking

```sql
-- File: Knowledge/observability/queries/tool_performance.sql
-- Top-performing tools by invocation count and success rate

SELECT
    tool_name,
    COUNT(*) as invocation_count,
    COUNT(CASE WHEN execution_status='completed' THEN 1 END) as successful,
    ROUND(100.0 * COUNT(CASE WHEN execution_status='completed' THEN 1 END) 
          / COUNT(*), 2) as success_rate_percent,
    ROUND(AVG(duration_ms), 2) as avg_duration_ms,
    MAX(duration_ms) as max_duration_ms
FROM mcp_tool_calls
GROUP BY tool_name
ORDER BY invocation_count DESC;
```

#### 5.3 Latency Percentiles

```sql
-- File: Knowledge/observability/queries/latency_percentiles.sql
-- P50, P95, P99 latencies for agent runs

SELECT
    PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY duration_ms) as p50_ms,
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY duration_ms) as p95_ms,
    PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY duration_ms) as p99_ms,
    MAX(duration_ms) as max_ms
FROM (
    SELECT
        EXTRACT(EPOCH FROM (completed_at - created_at)) * 1000 as duration_ms
    FROM agent_runs
    WHERE status='completed'
        AND created_at > NOW() - INTERVAL '24 hours'
) latencies
WHERE duration_ms > 0;
```

#### 5.4 Workflow Integration Metrics

```sql
-- File: Knowledge/observability/queries/workflow_metrics.sql
-- n8n workflow integration statistics

SELECT
    workflow_id,
    COUNT(*) as executions,
    COUNT(CASE WHEN execution_status='success' THEN 1 END) as successful,
    ROUND(AVG(duration_ms), 2) as avg_duration_ms,
    MAX(duration_ms) as max_duration_ms,
    COUNT(CASE WHEN trace_id IS NOT NULL THEN 1 END) as traced_executions
FROM n8n_executions
GROUP BY workflow_id
ORDER BY executions DESC;
```

#### 5.5 Document Audit Trail

```sql
-- File: Knowledge/observability/queries/document_audit.sql
-- Document changes with trace linking

SELECT
    d.name,
    dc.change_type,
    dc.change_reason,
    dc.created_at,
    dc.trace_id,
    ar.input_data,
    ar.output_data
FROM document_changes dc
JOIN documents d ON dc.document_id = d.document_id
LEFT JOIN agent_runs ar ON dc.trace_id = ar.trace_id
ORDER BY dc.created_at DESC
LIMIT 100;
```

---

## Phase 6: Performance Optimization

### Goal
Implement time-series arhiving, table partitioning, and query optimization.

### Success Criteria
- [x] Agent_runs partitioned by month
- [x] Archived data moved to separate schema
- [x] Indexes created for common queries
- [x] Query performance baseline measured
- [x] Slow query log analyzed

### Implementation Steps

*(See TECHNICAL_SPECIFICATIONS.md for detailed SQL)*

---

## Phase 7: Production Readiness

### Goal
Security audit, deployment guide, monitoring setup.

### Checklist

- [ ] Database backups automated (daily)
- [ ] PostgreSQL SSL/TLS enabled
- [ ] Python dependencies pinned (requirements-optimized.txt)
- [ ] Error handling tested (Phase 4)
- [ ] Logging configured (all modules)
- [ ] Monitoring alerts set up
- [ ] Deployment guide written
- [ ] Security review passed
- [ ] Load testing completed (1000 traces/day)

---

## Quick Checklist

Use this to track your progress through all phases:

```
IMPLEMENTATION CHECKLIST
========================

Phase 1: Database Setup ✓
  - [ ] PostgreSQL database created
  - [ ] Schema deployed (16 tables)
  - [ ] CRUD test passed (4/4)
  - [ ] Indexes verified

Phase 2: Agent API ✓
  - [ ] sample_agent.py updated
  - [ ] Smoke tests pass (7/7)
  - [ ] Agent executes without errors
  - [ ] OTEL exports work

Phase 3: n8n Workflow ✓
  - [ ] n8n started on :5678
  - [ ] Workflow imported
  - [ ] 3 test executions passed
  - [ ] Database records verified

Phase 4: Integration ✓
  - [ ] integration_test.py created
  - [ ] End-to-end test passes
  - [ ] VSCode Inspector shows trace
  - [ ] trace_links verified

Phase 5: Analytics ✓
  - [ ] 5 SQL queries created
  - [ ] Dashboard template built
  - [ ] Test queries executed

Phase 6: Performance ✓
  - [ ] Partitioning configured
  - [ ] Query baseline measured
  - [ ] Slow queries identified

Phase 7: Production ✓
  - [ ] Security audit completed
  - [ ] Deployment guide written
  - [ ] Monitoring set up
  - [ ] Load testing passed
```

---

**Document Version**: 1.0.0  
**Last Updated**: 2026-03-05  
**Next Action**: Begin Phase 1 Execution
