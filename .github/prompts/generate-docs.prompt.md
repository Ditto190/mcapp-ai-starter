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
description: "Generate or update documentation pages for a feature or module"
---

Ask for the target module and produce a short README-style doc: purpose, usage, configuration, and examples. Keep docs concise and link to source files.
