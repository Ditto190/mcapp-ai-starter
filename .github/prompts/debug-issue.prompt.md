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
description: "Help diagnose and propose fixes for a failing test or bug"
---

Ask for failing test names or error output; reproduce minimal steps and propose targeted fixes. Include commands to run locally and quick checks to isolate cause.
