param(
    [string]$Query = "repo architect"
)

Write-Host "--- Search Awesome-Copilot Helper ---"
Write-Host "This script shows how to use the awesome-copilot search/load workflow from the repo."
Write-Host "Default query: $Query"
Write-Host ""
Write-Host "1) In Copilot Chat: type 'Search awesome-copilot for "$Query"'"
Write-Host "2) Or run the VS Code Task 'Search Awesome-Copilot' which executes this script."
Write-Host ""
Write-Host "If you have cached results in your VS Code workspace storage, locate them under the workspace storage path and open them for review."
Write-Host "Example saved results path (may vary):"
Write-Host "%APPDATA%\\Code\\User\\workspaceStorage\\<id>\\GitHub.copilot-chat\\chat-session-resources\\<session>\\content.json"
Write-Host ""
Write-Host "To load a specific instruction from the awesome-copilot index, in Copilot Chat ask: 'Load \"filename.agent.md\"' and then review before applying."
Write-Host ""
Write-Host "(This script is intentionally non-destructive. It documents the workflow and points you to the Copilot Chat entrypoints.)"

# If user wants to run a quick local preview (non-network), print out the awesome-copilot 'repo-architect' match we previously cached if it exists.
$cachePattern = Join-Path -Path $env:APPDATA -ChildPath "Code\User\workspaceStorage"
if (Test-Path $cachePattern) {
    $found = Get-ChildItem -Path $cachePattern -Recurse -Filter content.json -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($found) {
        Write-Host "Found a cached content.json at: $($found.FullName)"
        Write-Host "You can open it in the editor to inspect raw results."
    }
}
