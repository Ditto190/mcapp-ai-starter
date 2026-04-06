#!/usr/bin/env pwsh
# Export installed VS Code extensions to extensions.txt
if (-not (Get-Command code -ErrorAction SilentlyContinue)) {
    Write-Error "'code' CLI not found. Make sure VS Code is installed and 'code' is in PATH."
    exit 1
}

code --list-extensions | Out-File -Encoding utf8 extensions.txt
Write-Output "Wrote extensions.txt (one extension id per line)."
