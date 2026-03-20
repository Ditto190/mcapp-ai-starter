# Devcontainer Env Setup

Purpose:
- Keep a sanitized `.env.codespaces` in repo (no secrets).
- Generate runtime `.env` from `.env.codespaces` using environment variables present at runtime (Codespaces repository secrets, workspace secrets, or local env).

Local usage:
- Generate `.env`:

```bash
bash scripts/generate-env.sh .env.codespaces .env
```

- Quick wrapper:

```bash
bash scripts/update-env.sh
```

Devcontainer behavior:
- The devcontainer is updated to run the generator on `postStartCommand`, then run `.devcontainer/post-create.sh`. The post-create script is also updated to call the generator so `.env` exists during initial setup.

Security:
- Never commit real secrets. Populate secrets using GitHub repository secrets, Codespaces secrets, or local environment variables. The generator only copies runtime values; if not set, variables are left empty.

Notes:
- After applying these files, run `chmod +x scripts/*.sh`.
- If secrets exist in git history, pushes may be blocked by GitHub secret scanning — coordinate history cleanup or create a fork/branch to open a PR.
