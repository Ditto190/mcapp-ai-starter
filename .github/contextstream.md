## ContextStream Rules (Repository)

Repository-level guidance for ContextStream-enabled assistants. These rules are intentionally concise — use the editor-specific files for tool-specific formats.

<contextstream_rules>
1. **SEARCH FIRST:** Prefer `search(mode="hybrid", query="...")` before local grep/read.
2. **EVERY MESSAGE:** Run `session_init(folder_path="${PWD}", context_hint="Initialize workspace context")` once per session, then `context_smart(user_message="...")` at the start of each assistant response.
3. **LOCAL TOOLS:** Use local tools only if ContextStream returns no results.
</contextstream_rules>

Place this file at `.github/contextstream.md` to make it visible to contributors reviewing how AI should behave in this repo.
