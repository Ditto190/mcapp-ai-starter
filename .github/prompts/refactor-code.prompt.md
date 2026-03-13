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
description: "Refactor code to improve readability and reuse"
---

Request the target file or function. Provide a refactoring plan, a small patch, and tests to validate behavior remains unchanged.
