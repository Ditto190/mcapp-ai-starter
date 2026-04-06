# End-to-End Flow Documentation

**Version**: 1.0.0  
**Date**: March 5, 2026  
**Target Audience**: Developers, DevOps, System Architects

---

## 📍 Table of Contents

1. [Happy Path Flow](#happy-path-flow)
2. [Detailed Message Sequences](#detailed-message-sequences)
3. [Data Flow Swimlanes](#data-flow-swimlanes)
4. [Error Handling Flows](#error-handling-flows)
5. [Cross-System Integration](#cross-system-integration)
6. [Timeline & Latency Analysis](#timeline--latency-analysis)

---

## Happy Path Flow

### Complete Agent Execution with Full Traceability

```
┌─────────────────────────────────────────────────────────────────────┐
│ User Input Phase                                                    │
└─────────────────────────────────────────────────────────────────────┘

  User Input: "What's the weather in San Francisco?"
         ↓
    [SampleAgent.run()]
         ↓
         │
    ┌────┴────────────────────────────────────────┐
    │                                             │
    ↓                                             ↓
[OTEL Span Start]                         [DB: log_agent_run()]
"agent.execution"                          INSERT INTO agent_runs
    ↓                                       └─ run_id, trace_id, input
    │                                             ↓
    │                                        [PostgreSQL runs]
    │                                             ↓
    └─────────────────────────────────────────────┘
                    ↓

┌─────────────────────────────────────────────────────────────────────┐
│ Agent Processing Phase (Agent Framework Auto-Instrumented)          │
└─────────────────────────────────────────────────────────────────────┘

    [Agent Framework]
         ↓
    [Chat Completion Call]
    (OpenAI API)
         ↓
    [Response with tool selection]
    Returns: "get_weather" tool needed
         ↓
    [Span: chat_completion]
    (auto-created by SDK)
         ↓
    get_weather(location="San Francisco")
         ↓
    [Span: tool.get_weather]
    (auto-instrumented)
         ↓

┌─────────────────────────────────────────────────────────────────────┐
│ Tool Execution & Logging Phase                                      │
└─────────────────────────────────────────────────────────────────────┘

    [Tool returns: "Sunny, 72°F"]
         ↓
         │
    ┌────┴──────────────┐
    │                   │
    ↓                   ↓
[Python Code]      [OTEL Span]
log_mcp_tool_call()   tool.end
    ↓                   ↓
INSERT mcp_tool_calls  [gRPC export]
└─────────┬─────┬──────┘
          │     │
          ↓     ↓
    [PostgreSQL]  [Collector]
     tool logged    →4317
          ↓         ↓
        Row:      [VSCode Inspector]
    run_id,        Flamegraph renders
    tool_name,     Trace visible
    input_params,
    output_data,
    duration_ms
          ↓

┌─────────────────────────────────────────────────────────────────────┐
│ Response & Decision Logging Phase                                   │
└─────────────────────────────────────────────────────────────────────┘

    [Agent generates response]
    "The weather in San Francisco is Sunny, 72°F"
         ↓
    [DB: log_agent_decision()]
    INSERT INTO agent_decisions
    └─ reasoning, selected_choice, confidence
         ↓
    [PostgreSQL runs]
         ↓
    [Update agent_run to completed]
    UPDATE agent_runs SET status='completed'
         ↓
    
┌─────────────────────────────────────────────────────────────────────┐
│ Finalization & Visualization Phase                                  │
└─────────────────────────────────────────────────────────────────────┘

    [Agent execution completes]
         ↓
    [OTEL Span End]
    Tags: trace_id matching DB
         ↓
    [gRPC OTLP Export]
    Endpoint: localhost:4317
         ↓
    [VSCode Inspector]
    Flamegraph shows:
    ├─ Agent execution (main span)
    ├─ Chat completion timing
    ├─ Tool invocation (get_weather)
    ├─ PostgreSQL insert duration
    └─ Total latency
         ↓
    [Click trace_id link]
    Opens PostgreSQL query results
    Shows: run_id, tool_calls, decisions
         ↓
         DONE!

```

---

## Detailed Message Sequences

### Sequence Diagram: Agent → Database → Visualization

```
     Agent         OTEL SDK        PostgreSQL      VSCode Inspector
       │                │                │                │
       │                │                │                │
       ├──run()─────────┤                │                │
       │                │                │                │
       ├──────start_span('agent.exec')───┤                │
       │                │                │                │
       ├──call_tool────────────────────────────┐          │
       │  (with trace_id)          │           │          │
       │                │           │           │          │
       │         set_attribute      │           │          │
       │         (trace_id, run_id) │           │          │
       │                │           │           │          │
       │                ├──batch span──────────────────────┤
       │                │    (gRPC) │           │          │
       │                │           │           │    render flamegraph
       │                │           │           │    show trace_id
       │                │           │           │    ↓
       ├──log_mcp_tool_call─────────┤           │    [hoverable spans]
       │    INSERT mcp_tool_calls   │           │
       │                │     ──────┤           │
       │                │    ↓ commit          │
       │                │      ✓ OK            │
       │                │           │           │
       ├──log_agent_decision────────┤           │
       │    INSERT agent_decisions  │           │
       │                │     ──────┤           │
       │                │    ↓ commit          │
       │                │      ✓ OK            │
       │                │           │           │
       ├──end_span──────┤           │           │
       │    (marks end) │           │           │
       │                │           │           │
       │         export batch       │           │
       │         (to gRPC)          │           │
       │                ├─────send──────────────┤
       │                │           │       received
       │                │           │           │
       │                │           │    Inspector now shows
       │                │           │    linked database rows
       │                │           │           │
       ├─query_traces('trace_id')───┤           │
       │    SELECT * FROM ...       │           │
       │                │     ──────┤           │
       │                │    ↓ rows  │           │
       │           [run_id, tool #1, │       User clicks trace_id
       │            tool #2, decisions] ─────┐  in Inspector
       │                │           │        │
       │                │           │        ├──request traces
       │                │           │        │  from DB
       │                │           │        ├──show modal
       │                │           │        │  with query results
       │                │           │        ↓
       └────────────────┴───────────┴────────── Complete Flow Done
```

---

## Data Flow Swimlanes

### Swimlane Diagram: Four Parallel Systems

```
┌─────────────────────────────────────────────────────────────────────┐
│ AGENT LAYER                                                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  SampleAgent                                                        │
│      │                                                               │
│      ├─ Input: "What's the weather in SF?"                          │
│      │                                                               │
│      ├─ Agent Framework                                             │
│      │    ├─ Chat completion (OpenAI)                               │
│      │    ├─ Tool selection (get_weather)                           │
│      │    └─ Response generation                                    │
│      │                                                               │
│      └─ Output: "Sunny, 72°F"                                       │
│                                                                      │
└────────────────┬─────────────────────────────────────────────────────┘
                  │ trace_id propagated down
         ┌────────┴──────────┐
         ↓                   ↓

┌──────────────────────┐  ┌──────────────────────┐
│ TRACING LAYER        │  │ TRACKING LAYER       │
├──────────────────────┤  ├──────────────────────┤
│                      │  │                      │
│ OpenTelemetry SDK    │  │ Document Manager     │
│   (automatic)        │  │   (optional)         │
│                      │  │                      │
│ Spans created:       │  │ Track documents:     │
│ ├─ agent.execution   │  │ ├─ register_doc()   │
│ ├─ chat.completion   │  │ ├─ log_change()     │
│ ├─ tool.get_weather  │  │ └─ audit trail      │
│ └─ attributes:       │  │                      │
│    └─ trace_id       │  │ Link via:            │
│                      │  │ └─ trace_id (FK)     │
│ Sends to:            │  │                      │
│ localhost:4317       │  │ Logs to:             │
│ (gRPC OTLP)          │  │ PostgreSQL           │
│                      │  │                      │
└──────────┬───────────┘  └────────┬─────────────┘
           │                       │
           │  ┌────────────────────┘
           │  │
           ↓  ↓

┌──────────────────────────────┐
│ STORAGE LAYER                │
├──────────────────────────────┤
│                              │
│ PostgreSQL Database          │
│   (n8n_traceability)        │
│                              │
│ Tables receiving data:       │
│ ├─ agent_runs (1 row)        │
│ │   ├─ trace_id UUID         │
│ │   ├─ input_data            │
│ │   ├─ output_data           │
│ │   └─ status: completed     │
│ │                            │
│ ├─ mcp_tool_calls (1 row)    │
│ │   ├─ run_id FK             │
│ │   ├─ tool_name             │
│ │   ├─ input_params          │
│ │   ├─ output_data           │
│ │   └─ duration_ms           │
│ │                            │
│ ├─ agent_decisions (1 row)   │
│ │   ├─ run_id FK             │
│ │   ├─ reasoning             │
│ │   └─ confidence_score      │
│ │                            │
│ └─ document_changes (if any) │
│    ├─ document_id            │
│    ├─ trace_id FK            │
│    └─ change details         │
│                              │
│ Indexes enable:              │
│ └─ Instant queries by        │
│    trace_id, run_id, etc.    │
│                              │
└──────────────────┬───────────┘
                   │

┌──────────────────────────────┐
│ VISUALIZATION LAYER          │
├──────────────────────────────┤
│                              │
│ VSCode AI Toolkit Inspector  │
│   (localhost:4317)           │
│                              │
│ Receives:                    │
│ ├─ OTLP spans (gRPC)        │
│ ├─ Trace ID matching DB     │
│ └─ Span attributes          │
│                              │
│ Renders:                     │
│ ├─ Flamegraph visualization │
│ ├─ Timing breakdown         │
│ ├─ Tool invocations         │
│ └─ Link to query results    │
│                              │
│ User can:                    │
│ ├─ Click trace_id           │
│ ├─ View database results    │
│ └─ See full audit trail     │
│                              │
└──────────────────────────────┘
```

---

## Error Handling Flows

### Error Flow 1: Tool Invocation Failure

```
Agent Tool Call
    ↓
[Tool Execution Error]
(e.g., API timeout)
    ↓
┌────┴─────────────────────┐
│                          │
↓                          ↓
[Catch Exception]    [Error Span]
    ↓                   ↓
[log_mcp_tool_call]  [set_attribute]
  execution_status:    error=true
  "failed"             message=str(e)
  error_message:str(e)  ↓
    ↓             [Export to 4317]
[INSERT]              ↓
  mcp_tool_calls   [VSCode Inspector]
  status='failed'   Shows RED indicator
    ↓                   ↓
[PostgreSQL]       User sees:
  row recorded     ├─ Tool failed
    ↓              ├─ Error type
[Continue/Retry    ├─ Timestamp
or Abort]          └─ Duration ms
```

### Error Flow 2: Database Connection Lost

```
[log_agent_run()]
    ↓
[DB Connection Error]
  (PostgreSQL unreachable)
    ↓
┌─────────────────────────┐
│ Fallback Strategy       │
└─────────────────────────┘
    ↓
[Queue to Memory]
  Defer inserts to
  in-memory queue
    ↓
[Log Warning]
  "Database unavailable"
  OTEL span still exported
    ↓
[Retry Loop]
  Background task
  Attempts reconnect
  every 5 seconds
    ↓
[On Reconnect]
  Flush queued inserts
  Transaction rollback
  if partial
```

### Error Flow 3: OTEL Export Failure

```
[Spans Batched]
    ↓
[gRPC Send to 4317]
    ↓
[Connection Refused]
  (Inspector not running)
    ↓
┌──────────────────────────────┐
│ OTEL SDK Handles Gracefully  │
└──────────────────────────────┘
    ↓
[3 Retry Attempts]
  (SDK built-in)
    ↓
[Drop Batch]
  (Silent fail - tracing
   is observational, not
   critical path)
    ↓
[Agent Continues]
  Still logs to DB
  Still returns response
  No user impact
    ↓
[When Inspector Starts]
  Starts capturing
  new spans immediately
  (no buffering for offline)
```

---

## Cross-System Integration

### Use Case 1: Agent → Document → Database

```
┌────────────────┐
│ Agent Tool:    │
│ create_report  │
└────────────────┘
       ↓
   Creates file:
   ./Knowledge/reports/
     analysis_2026.md
       ↓
  ┌─────────────────────┐
  │ Inside Tool Code:   │
  │                     │
  │ doc_mgr.register_   │
  │ document(          │
  │   "analysis_2026...",│
  │   "./Knowledge/...",│
  │   doc_type="report",│
  │   ai_generated=True │
  │ )                   │
  │ → returns doc_id    │
  │                     │
  │ [INSERT documents]  │
  │  tables            │
  │   name             │
  │   path             │
  │   doc_type         │
  │   content_hash     │
  │   ai_generated     │
  │   created_at       │
  └─────────────────────┘
       ↓
  [PostgreSQL runs]
       ↓
  ┌─────────────────────┐
  │ log_change():       │
  │                     │
  │ doc_mgr.log_change( │
  │   document_path,    │
  │   "created",        │
  │   "AI-generated",   │
  │   trace_id=trace_id │
  │ )                   │
  │                     │
  │ [INSERT document_   │
  │  changes]          │
  │   document_id FK   │
  │   change_type      │
  │   change_reason    │
  │   trace_id FK      │
  │   new_hash         │
  │   created_at       │
  └─────────────────────┘
       ↓
  [PostgreSQL runs]
       ↓
  [Query Unified View]
  
  SELECT * FROM trace_links
  WHERE source_id = trace_id
    → Shows: agent_run
             ↓ generated
             document change
             ↓ has
             audit trail
```

### Use Case 2: n8n Workflow → Agent Run → Document

```
n8n Workflow 1:
  (e.g., "Process Customer Data")
       ↓
   [Webhook Node]
   Calls agent API
   Passes workflow_id
       ↓
   ┌─────────────────────┐
   │ SampleAgent.run()   │
   │ input: customer_data│
   │                     │
   │ Creates trace_id    │
   │ Calls agent tools   │
   │ Generates documents │
   │ (ai_generated=true) │
   │                     │
   │ Returns response    │
   │ + trace_id          │
   └─────────────────────┘
       ↓
   [logs agent_run]
   [logs mcp_tool_calls]
   [logs document_changes]
       ↓
   [Return to n8n]
       ↓
   [n8n Continues]
   [Optional: Call Agent API again
    if multiple steps needed]
       ↓
   [n8n Completion]
       ↓
   [n8n Webhook Trigger]
   (Calls /n8n/execution-webhook)
   with workflow_id, execution_id
       ↓
   ┌──────────────────┐
   │ PostgreSQL       │
   │ [INSERT n8n_     │
   │  executions]     │
   │                  │
   │ Optional: Link   │
   │ [INSERT trace_   │
   │  links]          │
   │  source: n8n_..  │
   │  target: agent_..│
   │  relationship:   │
   │  "triggered_by"  │
   └──────────────────┘
       ↓
   ┌─────────────────────────────┐
   │ Complete Trace Now Shows:   │
   │                             │
   │ n8n_execution               │
   │   ↓ triggered_by            │
   │ agent_run (trace_id)        │
   │   ↓ generated               │
   │ document_set (+audit trail) │
   │   ↓ contains                │
   │ customer_data_analysis.md   │
   │                             │
   │ Query: trace_links          │
   │ Shows complete flow!        │
   └─────────────────────────────┘
```

---

## Timeline & Latency Analysis

### Typical Execution Timeline (Sample: "What's the weather?")

```
0 ms    ├─ Agent.run() called
        │  input: "What's the weather in SF?"
        │
10 ms   ├─ OpenAI Chat Completion
        │  (network call to OpenAI)
        │  │
        │  ├─ Request: prompt + tools available
        │  │
        │  └─ Response: "use get_weather tool"
        │
500 ms  │  (model latency - excluded from target)
        │
510 ms  ├─ Tool: get_weather("San Francisco")
        │  execution_status: "started"
        │  [OTEL span creation: start]
        │
660 ms  ├─ Tool returns: {"forecast": "Sunny", "temp": 72}
        │  [OTEL span creation: end]
        │
665 ms  ├─ TraceDatabase.log_mcp_tool_call()
        │  INSERT INTO mcp_tool_calls
        │  duration_ms: 150
        │
667 ms  ├─ PostgreSQL commit ✓
        │  [~2ms latency for local DB]
        │
669 ms  ├─ Agent generates response text
        │  "The weather in SF is sunny, 72°F"
        │
675 ms  ├─ log_agent_decision()
        │  INSERT INTO agent_decisions
        │
676 ms  ├─ PostgreSQL commit ✓
        │
678 ms  ├─ final_response = response
        │
680 ms  ├─ [OTEL Span batch + export]
        │  gRPC to localhost:4317
        │  (~5ms for local connection)
        │
685 ms  ├─ VSCode Inspector receives batch
        │  Renders flamegraph
        │
687 ms  ├─ User sees response
        │  + trace_id clickable in Inspector
        │
        └─ [TOTAL TIME EXCLUDING MODEL]
           ~185 ms (target: <5 seconds ✓)
```

### Span Timing Breakdown

```
Tool Execution:
  ├─ get_weather span
  │   ├─ duration: 155ms
  │   │   ├─ actual tool: 145ms
  │   │   └─ OTEL overhead: 10ms
  │   └─ attributes:
  │       ├─ trace_id: 12345...
  │       ├─ tool_name: get_weather
  │       └─ location: San Francisco

Database Logging:
  ├─ log_mcp_tool_call span
  │   ├─ duration: 3ms
  │   │   ├─ serialization: 1ms
  │   │   └─ INSERT + commit: 2ms
  │   └─ attributes:
  │       └─ run_id: 67890...

Total Agent Run:
  ├─ agent.execution span
  │   ├─ duration: 685ms
  │   │   ├─ model latency: 500ms (not counted)
  │   │   ├─ tool execution: 155ms
  │   │   ├─ database ops: 6ms
  │   │   ├─ response gen: 6ms
  │   │   └─ otel export: 18ms
  │   └─ attributes:
  │       ├─ trace_id: (root)
  │       └─ agent_name: sample-agent
```

---

### Concurrent Operations

```
Timeline showing parallelizability:

      Agent         Database      OTEL Export
        │              │               │
0 ms    ├─run()─────────┤──────────────┤
        │               │               │
10 ms   ├─tool start────┤               │
        │ │             │               │
        │ │ (parallel)  │               │
155 ms  │ ├─tool end    │               │
        │ │             │               │
165 ms  │ │  ├───log_call──────┤       │
        │ │  │          │      │       │
167 ms  │ │  │   commit ✓──────┤       │
        │ │  │          │      │       │
170 ms  │ │  └─returns──┤      │       │
        │ │             │      │       │
185 ms  │ ├─log_decision────┤ │       │
        │ │             │  │ │       │
187 ms  │ │      commit ──┤ │       │
        │ │             │  │ │       │
190 ms  │ └─generate────┴──┤ │       │
        │                 │ │       │
215 ms  │              export ────────┤
        │                 │          │
220 ms  │                 │    4317 received
        │                 │          │
        └─────────────────┴──────────┘
               Complete

Note: Operations within agent are sequential
      (can't parallelize tool calls in single agent).
      Database and OTEL can proceed in background.
      Main path is agent → database logging → response.
```

---

**Document Version**: 1.0.0  
**Last Updated**: 2026-03-05  
**Target Audience**: Technical Implementation, Debugging, Performance Analysis
