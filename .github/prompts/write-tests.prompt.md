---
agent: "agent"
model: GPT-5 mini (copilot)
tools:
	- "edit"
	- "search/changes"
	- "read/problems"
	- "execute/getTerminalOutput"
	- "execute/runInTerminal"
	- "read/terminalLastCommand"
	- "read/terminalSelection"
	- "web/fetch"
description: "Generate unit and integration tests for a module"
---

Ask for the target file or module and generate tests that follow the repository's testing guidelines. Prefer small, focused tests and include mocking instructions where needed.
