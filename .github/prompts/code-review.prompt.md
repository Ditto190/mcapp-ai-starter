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
description: "Assist with code review commentary and checklist"
---

Provide a structured review checklist for the supplied diff, pointing out security, correctness, readability, and test gaps. Suggest small, actionable improvements.
