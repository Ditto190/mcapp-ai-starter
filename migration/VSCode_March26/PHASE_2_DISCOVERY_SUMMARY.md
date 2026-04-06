# Phase 2 API Discovery Summary - agent-framework-core v1.0.0b260107

## Critical API Differences from sample_agent.py Assumptions

### What DOESN'T Exist (Remove These)
1. ❌ `Agent` class - use `ChatAgent` instead
2. ❌ `Tool` class - use `AIFunction` instead  
3. ❌ `agent_framework.core` module - all classes at top level
4. ❌ `Agent.run()` method - use `ChatAgent.response()` instead
5. ❌ `model` parameter in OpenAIChatClient - use `model_id`

### What DOES Exist (Use These)

**Core Classes**:
- ✅ `ChatAgent` - Main agent class (requires chat_client parameter)
- ✅ `AgentExecutor` - Wraps agent for workflow execution
- ✅ `AIFunction` - Tool class (direct instantiation)
- ✅ `@ai_function` - Decorator for defining tools (preferred)

**Key Methods**:
- ✅ `ChatAgent.response()` - Get response from agent
- ✅ `AIFunction.invoke()` - Call a tool
- ✅ `@handler` - Decorator for executor handlers

**Parameters**:
- ✅ `ChatAgent(chat_client=..., tools=[...], instructions="...")`
- ✅ `OpenAIChatClient(model_id="...", api_key="...")`
- ✅ `AIFunction(name="...", description="...", func=...)`

## 8 Issues Found & Corrections

| # | Location | Issue | Fix |
|---|----------|-------|-----|
| 1 | Line 23 | `from agent_framework import Agent` | Use `ChatAgent` |
| 2 | Line 23 | `from agent_framework.core.tool import Tool` | Use `AIFunction` |
| 3 | Lines 72 | `model=` parameter | Change to `model_id=` |
| 4 | Lines 76-77 | `Agent(client=...)` | Use `ChatAgent(chat_client=...)` |
| 5 | Lines 85-139 | `Tool()` definitions | Convert to `@ai_function` decorator |
| 6 | Line 155 | `agent.run()` method | Use `agent.response()` |
| 7 | Full file | Missing `AgentExecutor` | Wrap agent: `AgentExecutor(agent=...)` |
| 8 | Lines 160-170 | (Database logging) | ✅ Already correct |

## Complete Code Template Provided

File: `PHASE_2_API_ANALYSIS_REPORT.md` (Section 4)
- Full corrected sample_agent.py structure
- All 7+ corrections applied
- Ready for copy-paste implementation

## Validation Plan

✅ Run: `python agents/smoke_test.py`  
✅ Expected: 7/7 tests PASSING (vs current 5/7)  
✅ Indicators: No ImportError, no AttributeError, database logging works

## Auto-Instrumentation Note

Good news: Agent Framework SDK **auto-instruments OTEL spans**.
- No additional span code needed in sample_agent.py
- `setup_agent_framework_observability()` call is sufficient
- Traces automatically sent to localhost:4317

## Reference URLs

- Discovery: `agents/discover_apis.py`, `agents/deep_discover_apis.py`, `agents/discover_aifunctions.py`
- Analysis: `PHASE_2_API_ANALYSIS_REPORT.md`  
- Implementation: Ready for Phase 2 coding (corrections step)
