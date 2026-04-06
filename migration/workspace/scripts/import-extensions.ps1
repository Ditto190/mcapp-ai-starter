#!/usr/bin/env pwsh
# Install extensions listed in extensions.txt
$path = Join-Path -Path (Get-Location) -ChildPath 'extensions.txt'
if (-not (Test-Path $path)) {
    Write-Error "extensions.txt not found in the current directory. Run export-extensions.ps1 on the source machine first."
    exit 1
}
if (-not (Get-Command code -ErrorAction SilentlyContinue)) {
    Write-Error "'code' CLI not found. Make sure VS Code is installed and 'code' is in PATH."
    exit 1
}

Get-Content $path | ForEach-Object {
    if ($_ -and ($_ -notmatch '^\s*$')) {
        Write-Output "Installing extension: $_"
        code --install-extension $_
    }
}

Write-Output "Import complete."
