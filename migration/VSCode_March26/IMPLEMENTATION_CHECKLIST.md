# Implementation Checklist - Comprehensive Traceability System

## Phase 1: PostgreSQL Setup ✅
- [x] Design unified schema (schema.sql)
- [x] Create 16 tables covering all three systems
- [x] Add indexes, triggers, and views
- [x] Plan: Run schema creation

### Verification Steps
```bash
# From TRACING_SETUP.md
psql -d n8n_traceability -f Knowledge/observability/schema.sql
\dt  # List all tables
\dv  # List all views
SELECT * FROM v_agent_activity;
```

---

## Phase 2: Python Infrastructure ✅
- [x] tracing_config.py - OpenTelemetry configuration
  - [x] configure_tracing() - Setup gRPC exporter
  - [x] setup_agent_framework_observability() - Agent Framework integration
  - [x] get_tracer() - Tracer instance getter
  
- [x] trace_database.py - Database logging API
  - [x] log_agent_run() - Record agent executions
  - [x] log_mcp_tool_call() - Log tool invocations
  - [x] log_agent_decision() - Record reasoning/choices
  - [x] log_trace_link() - Cross-system linking
  - [x] query_traces() - Retrieve unified traces
  - [x] get_agent_statistics() - Aggregate metrics
  
- [x] document_manager.py - Knowledge system integration
  - [x] register_document() - Add documents to tracking
  - [x] log_change() - Record modifications
  - [x] track_file_changes() - Auto-detect disk changes
  - [x] get_document_history() - Retrieve audit trail
  - [x] export_audit_report() - Generate compliance reports

### Verification Steps
```bash
# Test Python imports
python -c "from tracing_config import configure_tracing; print('✅ tracing_config')"
python -c "from trace_database import TraceDatabase; print('✅ trace_database')"
python -c "from document_manager import DocumentManager; print('✅ document_manager')"
```

---

## Phase 3: Dependencies & Environment ⏳
- [ ] Create virtual environment
  ```bash
  python -m venv venv
  # Windows: venv\Scripts\activate
  # Unix: source venv/bin/activate
  ```

- [ ] Install packages from requirements.txt
  ```bash
  pip install -r requirements.txt
  ```

- [ ] Configure .env (copy from .env.example)
  ```bash
  cp .env.example .env
  # Edit .env: Set DATABASE_URL, OPENAI_API_KEY, etc.
  ```

- [ ] Verify Python environment
  ```bash
  python -c "import agent_framework; print('✅ Agent Framework installed')"
  python -c "import opentelemetry; print('✅ OpenTelemetry installed')"
  python -c "import psycopg2; print('✅ psycopg2 installed')"
  ```

---

## Phase 4: Sample Agent Testing ⏳
- [ ] Run sample agent
  ```bash
  python agents/sample_agent.py
  ```

- [ ] Verify traces appear in VSCode Inspector
  - Open VSCode Inspector: `ai-mlstudio.tracing.open` command
  - Check traces at http://localhost:4317
  - View trace ID matching console output

- [ ] Verify database logging
  ```bash
  psql -d n8n_traceability
  SELECT * FROM agent_runs ORDER BY created_at DESC LIMIT 1;
  SELECT * FROM mcp_tool_calls WHERE run_id = <run_id>;
  ```

- [ ] Check document registration
  ```bash
  SELECT * FROM documents ORDER BY created_at DESC;
  SELECT * FROM document_changes ORDER BY created_at DESC;
  ```

---

## Phase 5: n8n Integration ⏳
- [ ] Copy n8n workflow template
  - File: Knowledge/observability/n8n_execution_logger_workflow.json
  - Instructions: Import into n8n UI at http://localhost:5678

- [ ] Configure PostgreSQL credentials in n8n
  - Connection name: postgres_connection
  - Host: localhost
  - Database: n8n_traceability
  - User: postgres
  - Password: (from .env)

- [ ] Test workflow manually
  ```bash
  curl -X POST http://localhost:5678/webhook/n8n/execution-webhook \
    -H "Content-Type: application/json" \
    -d '{
      "workflow_id": "test-wf",
      "execution_id": "exec-123",
      "status": "success",
      "duration_ms": 1500,
      "nodes": [
        {"id": "node-1", "name": "trigger", "status": "success"}
      ]
    }'
  ```

- [ ] Verify n8n execution logging
  ```bash
  psql -d n8n_traceability
  SELECT * FROM n8n_executions ORDER BY created_at DESC LIMIT 1;
  SELECT * FROM n8n_node_logs WHERE execution_id = '<id>';
  ```

---

## Phase 6: Cross-System Linking ⏳
- [ ] Create trace links from agent runs to documents
  ```python
  db.log_trace_link(
      source_type="agent_run",
      source_id=run_id,
      target_type="document",
      target_id=doc_id,
      relationship="generated"
  )
  ```

- [ ] Link n8n executions to agent runs
  ```python
  db.log_trace_link(
      source_type="n8n_execution",
      source_id=exec_id,
      target_type="agent_run",
      target_id=run_id,
      relationship="triggered_by"
  )
  ```

- [ ] Query unified traces across systems
  ```bash
  psql -d n8n_traceability
  SELECT * FROM trace_links WHERE source_id = '<trace_id>';
  ```

---

## Phase 7: Analytics & Observability ⏳
- [ ] Create agent performance dashboard
  ```sql
  SELECT * FROM v_agent_activity WHERE agent_name = 'sample-agent';
  ```

- [ ] Document modification tracking
  ```sql
  SELECT * FROM v_document_activity 
  WHERE created_at > now() - interval '24 hours';
  ```

- [ ] n8n workflow statistics
  ```sql
  SELECT * FROM v_workflow_stats 
  WHERE workflow_id = 'execution-logger';
  ```

- [ ] Set up automated reports
  - Daily email digest of agent runs
  - Week document change summaries
  - Monthly n8n performance analysis

---

## Phase 8: VSCode Integration ⏳
- [ ] Create .vscode/launch.json for debugging agent
  ```json
  {
    "version": "0.2.0",
    "configurations": [
      {
        "name": "Python: Sample Agent",
        "type": "python",
        "request": "launch",
        "program": "${workspaceFolder}/agents/sample_agent.py",
        "console": "integratedTerminal",
        "preLaunchTask": "Start n8n"
      }
    ]
  }
  ```

- [ ] Enable VSCode Inspector trace viewer
  - F5 to start debugging
  - Command: `ai-mlstudio.tracing.open`
  - Monitor traces in real-time

---

## Phase 9: Testing & Validation ✅
Items to test after each phase:

### Unit Tests
- [ ] TraceDatabase connection
- [ ] DocumentManager file operations
- [ ] OpenTelemetry span creation
- [ ] PostgreSQL insert/update operations

### Integration Tests
- [ ] Agent run → Database logging → Query retrieval
- [ ] Document change → Audit trail → Report export
- [ ] n8n webhook → Postgres insertion → View query
- [ ] Trace link → Cross-system query

### End-to-End Tests
- [ ] Full agent execution with tracing
- [ ] Agent tool call logging and retrieval
- [ ] Document registration and history
- [ ] n8n workflow execution logging
- [ ] VSCode Inspector trace visualization

### Performance Tests
- [ ] Agent run under 5 seconds (excluding model latency)
- [ ] Document change logging under 100ms
- [ ] Database query (query_traces) under 500ms
- [ ] n8n workflow logging batch insert under 1 second

---

## Key Files Reference

### Configuration
- `.env` - Environment variables (copy from .env.example)
- `requirements.txt` - Python dependencies
- `.vscode/launch.json` - Debugger configuration

### Database
- `Knowledge/observability/schema.sql` - PostgreSQL schema
- `Knowledge/observability/TRACING_SETUP.md` - Installation guide

### Python Modules (agents/)
- `tracing_config.py` - OpenTelemetry setup
- `trace_database.py` - Database logging API
- `document_manager.py` - Knowledge system integration
- `sample_agent.py` - Example agent with tracing

### n8n
- `Knowledge/observability/n8n_execution_logger_workflow.json` - Workflow template

---

## Troubleshooting Guide

### PostgreSQL Connection Error
```
ERROR: "connection to database failed"
```
**Solution**: Check DATABASE_URL in .env
```bash
psql -U postgres -h localhost -d n8n_traceability
```

### OpenTelemetry Not Exporting Traces
```
ERROR: "No spans visible in VSCode Inspector"
```
**Solution**: Verify OTEL_EXPORTER_OTLP_ENDPOINT in .env
```bash
# Check endpoint is running
curl -v http://localhost:4317
```

### Agent Framework Import Error
```
ERROR: "ModuleNotFoundError: No module named 'agent_framework'"
```
**Solution**: Install correct version
```bash
pip install agent-framework-azure-ai==1.0.0b260107
pip install agent-framework-core==1.0.0b260107
```

### Document Manager File Not Found
```
ERROR: "FileNotFoundError: [Errno 2] No such file or directory"
```
**Solution**: Ensure KNOWLEDGE_DIR exists
```bash
mkdir -p Knowledge/documents
```

### n8n Postgres Node Connection Failed
```
ERROR: "Database connection error in Postgres node"
```
**Solution**: Verify credentials in n8n UI
- Settings → Credentials → Manage
- Check host, port, user, password, database name

---

## Next Steps

### Immediate (This week)
1. Run database schema setup
2. Install Python dependencies
3. Execute sample agent
4. Verify VSCode Inspector traces

### Short-term (Next 1-2 weeks)  
1. Set up n8n workflow
2. Test cross-system linking
3. Create example analytics queries
4. Document operational procedures

### Medium-term (Month 1-2)
1. Implement automated reporting
2. Build observability dashboard
3. Create runbooks for common scenarios
4. Performance optimization (archiving, partitioning)

### Long-term (Ongoing)
1. Integrate additional agents/workflows
2. Expand knowledge management features
3. Advanced analytics (anomaly detection, cost tracking)
4. Multi-user audit trail compliance

---

## Success Criteria

✅ **Phase 1 Complete**: PostgreSQL database contains all 16 tables with correct schema
✅ **Phase 2 Complete**: Python modules importable and functions testable
✅ **Phase 3 Complete**: Virtual environment set up, dependencies installed, .env configured
✅ **Phase 4 Complete**: Sample agent runs successfully, traces visible in VSCode Inspector
✅ **Phase 5 Complete**: n8n workflow imported, credentials configured, test webhook succeeds
✅ **Phase 6 Complete**: Cross-system trace links created, unified queries work
✅ **Phase 7 Complete**: Analytics views return meaningful data
✅ **Phase 8 Complete**: VSCode debugging configured, Inspector displays traces in real-time
✅ **Phase 9 Complete**: All unit and integration tests pass

---

Last Updated: 2024-01-XX
Status: In Progress (Phase 1-2 Complete, Phase 3-9 Pending)
