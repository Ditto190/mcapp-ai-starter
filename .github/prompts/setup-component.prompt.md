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
description: "Generate a new React/TS component scaffold"
---

Ask for component name and props if not provided. Produce a minimal component scaffold, a basic test file, and a short usage example. Follow project styling and testing conventions.
