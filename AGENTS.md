<!-- CLAUDE.md: Claude Agent Onboarding & Next.js DevTools Auto-Init -->

# Claude Agent Onboarding

## 1. Mandatory: Context-First

- Always follow the contextstream rules in [.github/copilot-instructions.md](.github/copilot-instructions.md)
- On every new session, call `init()` and then `context(user_message="<msg>")` before any other tool

## 2. Next.js DevTools Auto-Init

- At the start of every Next.js session, always call the Next DevTools `init` tool to set up context and documentation
- This ensures runtime diagnostics, route structure, and logs are available to the agent

## 3. Example Prompts

- “Next Devtools, what errors are in my Next.js application?”
- “Next Devtools, show me the structure of my routes”
- “Next Devtools, what's in the development server logs?”

## 4. Customizations & Next Steps

- If not already present, create a `/create-instruction` for Next.js auto-init to enforce this pattern
- See [agent-customization skill](../.vscode-server-insiders/bin/47add6dfa59e9d89115b53c74511f03db9575dd0/extensions/copilot/assets/prompts/skills/agent-customization/workspace-instructions.md) for more
| `standard` | Feature PRs, infra changes — steps 1–3 |
| `lightweight` | Hotfixes, minor config changes — step 1 (security/secrets) only |

### Priority Levels

- 🔴 **CRITICAL** — Block deploy (exposed secrets, broken auth, state corruption, wildcard IAM)
- 🟡 **IMPORTANT** — Fix before production (no rate limits, no DR plan, unencrypted storage)
- 🟢 **SUGGESTION** — Non-blocking improvement (cost optimization, tagging conventions)

### Integration with Dev Quality Lead

The `cloud-reviewer` agent can be invoked as part of the `dev-quality-lead` gate sequence before any cloud infrastructure deployment, in addition to the existing code quality and test gates.

**Agent file:** `.github/agents/cloud-reviewer.agent.md`
**Report output:** `docs/cloud-reviews/`
**ADR output:** `docs/architecture/`
