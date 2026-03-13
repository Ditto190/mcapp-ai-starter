## ContextStream Rules (OpenCode)

Use this project rule for OpenCode/CLI tools.

<contextstream_rules>
1. **SEARCH FIRST:** Call `search(mode="hybrid", query="...")` before local grep/read.
2. **EVERY MESSAGE:** On first message run `session_init(folder_path="${PWD}", context_hint="Initialize workspace context")` then `context_smart(user_message="...")`.
3. **LOCAL TOOLS:** Only use local tools if ContextStream returns no results.
</contextstream_rules>

Notes:
- OpenCode uses raw tool names (`session_init`, `search`, `context_smart`).
- Place under `.opencode/rules/` to make it discoverable by OpenCode workflows.
