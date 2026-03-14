# SkillKit — Workspace helper

This workspace includes a locally-built SkillKit CLI and a convenience helper so
`skillkit` is available in new terminals opened for this workspace.

Quick usage

- Use the workspace-local CLI: `skillkit --version` or `skillkit help`.

Automatic setup in VS Code terminals

- The workspace adds the workspace `node_modules/.bin` to the terminal PATH via
  .vscode/settings.json so terminal sessions started in VS Code will find
  `skillkit` automatically.

Manual setup for other terminals

- Source the helper script to add the workspace bin to your PATH:

  ```sh
  source .workspace/activate-skillkit.sh
  ```

What I added

- `.vscode/settings.json` — adds `${workspaceFolder}/node_modules/.bin` to
  `PATH` for Linux terminals
- `.workspace/activate-skillkit.sh` — workspace-local script to export PATH and
  `SKILLKIT_HOME` if you open terminals outside VS Code

Profiles and commands

- The workspace includes a small profile manager to control what helper features
  are enabled in new interactive shells. Use the following helpers from any
  terminal inside the workspace:

  - `skillkit_list_profiles` — lists available profiles
  - `skillkit_use_profile <name>` — set the active profile (`safe` or `full`)

  Profiles:
  - `safe` (default) — only configures `PATH` and `SKILLKIT_HOME` (no `.env` or
    logging).
  - `full` — additionally loads `.env` into the environment and enables the
    session command logger (writes `.workspace/session.log`).

Security note: the `full` profile exports values from `.env` and records
commands. Do not enable it if your `.env` contains sensitive keys you do not
want in your interactive shell history or logs.

If you want, I can also add a one-line snippet to your shell startup to source
the helper automatically for non-VS Code terminals.
