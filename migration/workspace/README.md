**Workspace Transfer Guide**

This repository includes helper files to save and restore a VS Code workspace's extensions and workspace-level settings.

Files added:

- `workspace.code-workspace` — workspace file that opens this folder as a workspace.
- `.vscode/settings.json` — workspace-level settings (edit to match your preferences).
- `.vscode/extensions.json` — list of recommended extensions for the workspace.
- `scripts/export-extensions.ps1` — PowerShell script to export installed extensions to `extensions.txt`.
- `scripts/import-extensions.ps1` — PowerShell script to install extensions from `extensions.txt`.

Quick restore steps (on the target machine):

1. Install VS Code and ensure the `code` CLI is in your PATH.
2. Copy `extensions.txt` into the project root (if you exported previously).
3. Run the importer (PowerShell):

```powershell
# Install extensions listed in extensions.txt
Get-Content extensions.txt | ForEach-Object { code --install-extension $_ }
```

1. Open the workspace: `File → Open Workspace...` and choose `workspace.code-workspace`.
2. Review and adjust `.vscode/settings.json` as needed.

How to export your extensions from an existing machine:

PowerShell (Windows):

```powershell
# Save current extensions to extensions.txt
code --list-extensions | Out-File -Encoding utf8 extensions.txt
```

Or use the provided scripts in the `scripts/` folder.

Notes:

- VS Code Settings Sync (built-in) can also sync extensions/settings via your Microsoft/GitHub account.
- Add any workspace-recommended extensions to `.vscode/extensions.json` to prompt contributors to install them.

If you want, I can (1) export your current installed extensions into `extensions.txt` and (2) copy your current user settings into `.vscode/settings.json`. Authorize me to read those files and I'll populate them.
