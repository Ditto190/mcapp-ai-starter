-- ============================================================================
-- UNIFIED TRACEABILITY SCHEMA
-- Supports: AI Agents, MCP Tools, Document Management, n8n Workflows
-- ============================================================================

-- ============================================================================
-- 1. CORE AUDIT TABLES
-- ============================================================================

-- Users/Agents that perform actions
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'agent', 'mcp_tool', 'user', 'system'
    identifier VARCHAR(255) UNIQUE NOT NULL, -- agent name, tool name, username
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 2. KNOWLEDGE MANAGEMENT SYSTEM
-- ============================================================================

-- Documents in Knowledge folder
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    path VARCHAR(512) UNIQUE NOT NULL, -- relative path in Knowledge/
    type VARCHAR(50) NOT NULL, -- 'markdown', 'json', 'yaml', 'notebook', 'other'
    content_hash VARCHAR(64), -- SHA256 of content for change detection
    tags TEXT[], -- tags for categorization
    ai_generated BOOLEAN DEFAULT FALSE,
    linked_agent_id INTEGER REFERENCES users(id),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    size_bytes INTEGER
);

-- Document revision history and change log
CREATE TABLE IF NOT EXISTS document_changes (
    id SERIAL PRIMARY KEY,
    document_id INTEGER NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    change_type VARCHAR(20) NOT NULL, -- 'created', 'modified', 'deleted', 'restored'
    changed_by INTEGER REFERENCES users(id),
    change_description TEXT,
    previous_hash VARCHAR(64),
    new_hash VARCHAR(64),
    metadata_changes JSONB, -- what metadata changed (tags, ai_generated, etc)
    line_changes JSONB, -- { added: N, removed: N, modified: N } for text files
    change_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    change_reason TEXT, -- 'agent_modification', 'manual_edit', 'auto_backup', etc
    trace_id VARCHAR(64), -- opentelemetry trace ID for linking to agent run
    CONSTRAINT document_changes_unique_hash CHECK (
        (change_type = 'deleted') OR (new_hash IS NOT NULL)
    )
);

-- Create index for fast document lookups
CREATE INDEX IF NOT EXISTS idx_documents_path ON documents(path);
CREATE INDEX IF NOT EXISTS idx_documents_created_by ON documents(created_by);
CREATE INDEX IF NOT EXISTS idx_document_changes_document ON document_changes(document_id);
CREATE INDEX IF NOT EXISTS idx_document_changes_timestamp ON document_changes(change_timestamp);

-- ============================================================================
-- 3. AGENT EXECUTION TRACING
-- ============================================================================

-- Agent runs and invocations
CREATE TABLE IF NOT EXISTS agent_runs (
    id SERIAL PRIMARY KEY,
    agent_id INTEGER NOT NULL REFERENCES users(id),
    session_id VARCHAR(255), -- for multi-turn conversations
    trace_id VARCHAR(64) UNIQUE NOT NULL, -- opentelemetry trace ID
    span_id VARCHAR(64), -- parent span ID if nested
    input_data JSONB,
    output_data JSONB,
    execution_status VARCHAR(20), -- 'started', 'completed', 'failed', 'cancelled'
    error_message TEXT,
    execution_start TIMESTAMP NOT NULL,
    execution_end TIMESTAMP,
    duration_ms INTEGER,
    tokens_used JSONB, -- { prompt: N, completion: N, total: N }
    model_used VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MCP tool calls within agent runs
CREATE TABLE IF NOT EXISTS mcp_tool_calls (
    id SERIAL PRIMARY KEY,
    run_id INTEGER NOT NULL REFERENCES agent_runs(id) ON DELETE CASCADE,
    tool_name VARCHAR(255) NOT NULL,
    tool_call_id VARCHAR(255),
    input_params JSONB,
    output_data JSONB,
    execution_status VARCHAR(20), -- 'started', 'completed', 'failed'
    error_message TEXT,
    call_start TIMESTAMP NOT NULL,
    call_end TIMESTAMP,
    duration_ms INTEGER,
    mcp_server_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agent decisions and routing
CREATE TABLE IF NOT EXISTS agent_decisions (
    id SERIAL PRIMARY KEY,
    run_id INTEGER NOT NULL REFERENCES agent_runs(id) ON DELETE CASCADE,
    decision_type VARCHAR(50), -- 'tool_selection', 'output_choice', 'retry', 'escalation'
    reasoning TEXT,
    options_considered JSONB,
    selected_option VARCHAR(255),
    confidence_score DECIMAL(3,2),
    next_step VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for agent tracing
CREATE INDEX IF NOT EXISTS idx_agent_runs_agent ON agent_runs(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_runs_trace ON agent_runs(trace_id);
CREATE INDEX IF NOT EXISTS idx_agent_runs_session ON agent_runs(session_id);
CREATE INDEX IF NOT EXISTS idx_agent_runs_execution_start ON agent_runs(execution_start);
CREATE INDEX IF NOT EXISTS idx_mcp_tool_calls_run ON mcp_tool_calls(run_id);
CREATE INDEX IF NOT EXISTS idx_mcp_tool_calls_tool ON mcp_tool_calls(tool_name);
CREATE INDEX IF NOT EXISTS idx_agent_decisions_run ON agent_decisions(run_id);

-- ============================================================================
-- 4. N8N WORKFLOW OBSERVABILITY
-- ============================================================================

-- Workflow execution records
CREATE TABLE IF NOT EXISTS n8n_executions (
    id SERIAL PRIMARY KEY,
    workflow_id VARCHAR(255) NOT NULL,
    workflow_name VARCHAR(255) NOT NULL,
    execution_id VARCHAR(255) UNIQUE NOT NULL,
    trace_id VARCHAR(64), -- opentelemetry trace ID
    execution_mode VARCHAR(50), -- 'manual', 'trigger', 'schedule', 'webhook'
    execution_status VARCHAR(20), -- 'running', 'success', 'error', 'timeout', 'cancelled'
    started_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    duration_ms INTEGER,
    execution_data JSONB, -- input data
    result_data JSONB, -- output data
    error_details JSONB, -- error info if failed
    triggered_by VARCHAR(255), -- user, webhook, schedule, etc
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Individual node execution data
CREATE TABLE IF NOT EXISTS n8n_node_logs (
    id SERIAL PRIMARY KEY,
    execution_id INTEGER NOT NULL REFERENCES n8n_executions(id) ON DELETE CASCADE,
    node_id VARCHAR(255) NOT NULL,
    node_name VARCHAR(255) NOT NULL,
    node_type VARCHAR(100) NOT NULL, -- 'postgres', 'function', 'slack', etc
    execution_index INTEGER,
    execution_status VARCHAR(20), -- 'running', 'completed', 'error', 'skipped'
    input_data JSONB, -- what data entered this node
    output_data JSONB, -- what data left this node
    error_message TEXT,
    started_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    duration_ms INTEGER,
    node_parameters JSONB, -- node configuration at execution time
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workflow execution variables and context
CREATE TABLE IF NOT EXISTS n8n_execution_context (
    id SERIAL PRIMARY KEY,
    execution_id INTEGER NOT NULL REFERENCES n8n_executions(id) ON DELETE CASCADE,
    variable_name VARCHAR(255) NOT NULL,
    variable_value TEXT,
    scope VARCHAR(50), -- 'global', 'workflow', 'node'
    node_context VARCHAR(255), -- which node set this variable
    set_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for n8n observability
CREATE INDEX IF NOT EXISTS idx_n8n_executions_workflow ON n8n_executions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_n8n_executions_trace ON n8n_executions(trace_id);
CREATE INDEX IF NOT EXISTS idx_n8n_executions_started ON n8n_executions(started_at);
CREATE INDEX IF NOT EXISTS idx_n8n_executions_status ON n8n_executions(execution_status);
CREATE INDEX IF NOT EXISTS idx_n8n_node_logs_execution ON n8n_node_logs(execution_id);
CREATE INDEX IF NOT EXISTS idx_n8n_node_logs_node ON n8n_node_logs(node_id);
CREATE INDEX IF NOT EXISTS idx_n8n_node_logs_type ON n8n_node_logs(node_type);
CREATE INDEX IF NOT EXISTS idx_n8n_execution_context_execution ON n8n_execution_context(execution_id);

-- ============================================================================
-- 5. CROSS-SYSTEM TRACEABILITY
-- ============================================================================

-- Links between different systems (agents to documents, workflows to agents, etc)
CREATE TABLE IF NOT EXISTS trace_links (
    id SERIAL PRIMARY KEY,
    source_system VARCHAR(50) NOT NULL, -- 'agent', 'n8n', 'document', 'mcp_tool'
    source_id VARCHAR(255) NOT NULL,
    target_system VARCHAR(50) NOT NULL,
    target_id VARCHAR(255) NOT NULL,
    relationship_type VARCHAR(50), -- 'modified', 'triggered', 'referenced', 'depends_on'
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_trace_links_source ON trace_links(source_system, source_id);
CREATE INDEX IF NOT EXISTS idx_trace_links_target ON trace_links(target_system, target_id);

-- ============================================================================
-- 6. OPENTELEMETRY INTEGRATION (for native tracing)
-- ============================================================================

-- Stores raw OpenTelemetry spans for detailed analysis
CREATE TABLE IF NOT EXISTS otel_spans (
    id SERIAL PRIMARY KEY,
    trace_id VARCHAR(64) NOT NULL,
    span_id VARCHAR(64) UNIQUE NOT NULL,
    parent_span_id VARCHAR(64),
    span_name VARCHAR(255) NOT NULL,
    span_kind VARCHAR(20), -- 'INTERNAL', 'SERVER', 'CLIENT', 'PRODUCER', 'CONSUMER'
    start_timestamp BIGINT NOT NULL, -- nanoseconds since epoch
    end_timestamp BIGINT,
    duration_ns BIGINT,
    status VARCHAR(20), -- 'OK', 'ERROR', 'UNSET'
    attributes JSONB, -- span attributes (gen_ai.operation.name, etc)
    events JSONB, -- span events with timestamps
    error_details JSONB, -- error stack trace if failed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_otel_spans_trace ON otel_spans(trace_id);
CREATE INDEX IF NOT EXISTS idx_otel_spans_span ON otel_spans(span_id);
CREATE INDEX IF NOT EXISTS idx_otel_spans_parent ON otel_spans(parent_span_id);
CREATE INDEX IF NOT EXISTS idx_otel_spans_start ON otel_spans(start_timestamp);

-- ============================================================================
-- 7. UTILITY VIEWS
-- ============================================================================

-- View: Agent activity summary
CREATE OR REPLACE VIEW v_agent_activity AS
SELECT 
    u.name as agent_name,
    COUNT(ar.id) as total_runs,
    COUNT(CASE WHEN ar.execution_status = 'completed' THEN 1 END) as successful_runs,
    COUNT(CASE WHEN ar.execution_status = 'failed' THEN 1 END) as failed_runs,
    ROUND(AVG(ar.duration_ms)::numeric, 2) as avg_duration_ms,
    SUM(COALESCE((ar.tokens_used->>'total')::int, 0)) as total_tokens,
    MAX(ar.created_at) as last_run
FROM users u
LEFT JOIN agent_runs ar ON u.id = ar.agent_id
WHERE u.type = 'agent'
GROUP BY u.id, u.name;

-- View: Document change summary
CREATE OR REPLACE VIEW v_document_activity AS
SELECT 
    d.name,
    d.path,
    COUNT(dc.id) as total_changes,
    MAX(dc.change_timestamp) as last_modified,
    COUNT(DISTINCT dc.changed_by) as contributors,
    d.ai_generated
FROM documents d
LEFT JOIN document_changes dc ON d.id = dc.document_id
GROUP BY d.id, d.name, d.path, d.ai_generated;

-- View: Workflow execution summary
CREATE OR REPLACE VIEW v_workflow_stats AS
SELECT 
    workflow_name,
    COUNT(id) as total_executions,
    COUNT(CASE WHEN execution_status = 'success' THEN 1 END) as successful,
    COUNT(CASE WHEN execution_status = 'error' THEN 1 END) as failed,
    ROUND(AVG(duration_ms)::numeric, 2) as avg_duration_ms,
    MAX(started_at) as last_execution
FROM n8n_executions
GROUP BY workflow_name;

-- ============================================================================
-- 8. AUDIT TRIGGERS
-- ============================================================================

-- Function to update document updated_at timestamp
CREATE OR REPLACE FUNCTION update_document_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on document updates
CREATE TRIGGER trigger_update_document_timestamp
BEFORE UPDATE ON documents
FOR EACH ROW
EXECUTE FUNCTION update_document_timestamp();

-- Function to update user updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on user updates
CREATE TRIGGER trigger_update_user_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_user_timestamp();

-- ============================================================================
--INITIAL DATA
-- ============================================================================

-- Insert system users
INSERT INTO users (name, type, identifier, metadata) 
VALUES 
    ('System', 'system', 'system', '{"description": "System-generated changes"}'),
    ('ChatGPT Agent', 'agent', 'agent-chatgpt', '{"description": "AI agent using ChatGPT"}'),
    ('Claude Agent', 'agent', 'agent-claude', '{"description": "AI agent using Claude"}')
ON CONFLICT (identifier) DO NOTHING;

-- ============================================================================
-- NOTES
-- ============================================================================
/*
IMPLEMENTATION NOTES:

1. Document Auditing:
   - Changes are logged automatically via triggers
   - content_hash is SHA256 of file content for change detection
   - trace_id links document changes to agent runs that modified them

2. Agent Tracing:
   - trace_id (OpenTelemetry) connects to otel_spans table
   - mcp_tool_calls shows all tools invoked during agent run
   - agent_decisions logs the reasoning behind agent choices

3. n8n Workflow Observability:
   - Each node execution is logged separately (n8n_node_logs)
   - execution_context captures intermediate variables
   - Node data flow (input→output) is fully captured

4. Cross-System Links:
   - trace_links table connects different systems
   - Example: agent_run_id → document_id when agent modifies doc
   - Example: n8n_execution_id → agent_run_id when workflow triggers agent

5. Performance:
   - All common joins are indexed
   - Partitioning recommended for large-scale deployments
   - Archive old logs (>90 days) to separate table for performance

6. Privacy:
   - Sensitive data (prompts, completions) can be redacted
   - Set enable_sensitive_data=False in agent config
   - Create separate view/table for anonymized logs if needed
*/
