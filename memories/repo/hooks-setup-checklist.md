# Hooks Setup Checklist

1. Create hook config: Add a JSON config for your hook and place it under `.github/hooks/` as `<name>.json` (or for repo docs, use a folder `hooks/<name>/hooks.json`).

2. Define events & commands: In `hooks.json` set `version` and map events to commands (e.g., `preToolUse`, `postToolUse`, `sessionStart`, `sessionEnd`) with fields: `type`, `bash` (or `powershell`), `cwd`, `timeoutSec`, and optional `env`.

3. Bundle complex logic in scripts: Put reusable scripts in a `scripts/` folder (e.g., `.github/hooks/my-hook/scripts/security-check.sh`) and reference them from `hooks.json`.

4. Make scripts robust: Start scripts with `#!/usr/bin/env bash` and `set -euo pipefail`; fail fast on errors; keep one responsibility per script.

5. Make executable & test locally: Run `chmod +x scripts/*.sh` and execute scripts manually to verify behaviour before adding to `hooks.json`. Use non-zero exit codes to block actions.

6. Use `preToolUse` for gating: For security or approval flows, implement `preToolUse` scripts which receive JSON input about the tool and can exit non-zero to deny execution.

7. Set timeouts & env: Use `timeoutSec` to limit hook runtime; pass required env vars via `env` in `hooks.json`.

8. Document and bundle: Add a `README.md` (with frontmatter) in the hook folder describing setup, required tools, and commands.

9. Integrate with repo build: After adding hooks/scripts, run project build tasks (e.g., `npm run build`) so generated READMEs and indexes include the new hook; make sure CI checks pass (validate manifests if applicable).

10. Best practices: Keep hooks fast, layer simple checks (multiple hooks) rather than one big script, document dependencies (formatters/linters), and test with realistic timeouts.
