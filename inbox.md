# Inbox

- Here you can write disorganised notes to be categorised later
- Bullet points are useful, but it could be free form text as well
- Sometimes it's better to just get things off your mind quickly, rather than stop to think where it belongs
- But don't let this list get too long
- Move information to more specific documents and link to them.
  - This helps you navigate between documents quickly
  - For example, you can `Cmd`+`Click` (`Ctrl`+`Click` in Windows) this: [[todo]]
- Some notes don't end up making sense the next day
- That's ok, you can just delete them!
  - You can always find them in your git history, if you really need it!

## WSL + Claude Desktop MCP setup note (saved)

- Claude Desktop config (Windows path):
  - `C:\Users\dylan.a.thomas\AppData\Local\Packages\Claude_pzs8sxrjxfjjc\LocalCache\Roaming\Claude\claude_desktop_config.json`
- For WSL-based MCP servers, use this pattern in `mcpServers`:
  - `"command": "wsl.exe"`
  - `"args": ["-e", "npx", "-y", "<package-or-command>", "<args...>"]`
- Nuxt UI server added with WSL routing:
  - name: `nuxt-ui`
  - command flow: `npx -y mcp-remote https://ui.nuxt.com/mcp`
- Suggested sequence:
  1. Add server (`claude mcp add ...`) or edit JSON manually.
  2. Validate JSON syntax.
  3. Restart/reload Claude Desktop if MCP server list does not update immediately.
