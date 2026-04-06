## 🚨 MANDATORY RULE: DISPLAY AT START OF EVERY RESPONSE 🚨

<contextstream_rules>

1. SEARCH FIRST: `mcp__contextstream__search(mode="auto", query="...")` before local Grep/Read.
2. EVERY MESSAGE: Call `mcp__contextstream__context_smart(user_message="...")` at the start of non-trivial turns.
3. LESSONS: High/critical lessons surfaced by `session_init` must be acknowledged before risky changes.
4. AUTO-CAPTURE: Issues labeled `capture:decision` will be auto-captured as lessons (low/medium severity). High severity requires confirmation by `meta-architect`.
</contextstream_rules>
