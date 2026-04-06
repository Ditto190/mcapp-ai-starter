param(
    [string]$RootPath = "."
)

$resolvedRoot = (Resolve-Path $RootPath).Path
Write-Host "[agent-index] watching workspace: $resolvedRoot"

$watchTargets = @(
    ".github\agents",
    ".github\instructions",
    ".github\prompts",
    ".github\hooks",
    ".agents\skills",
    ".agents\registry\awesome"
)

$watchers = @()

function Invoke-Reindex {
    param([string]$Reason, [string]$ChangedPath)
    Write-Host "[agent-index] reindex reason=$Reason changed=$ChangedPath"
    python "scripts/build_agent_index.py" --reason $Reason --changed-path $ChangedPath
}

foreach ($relative in $watchTargets) {
    $full = Join-Path $resolvedRoot $relative
    if (-not (Test-Path $full)) {
        continue
    }

    $watcher = New-Object System.IO.FileSystemWatcher
    $watcher.Path = $full
    $watcher.IncludeSubdirectories = $true
    $watcher.EnableRaisingEvents = $true

    $action = {
        $fullPath = $Event.SourceEventArgs.FullPath
        Invoke-Reindex -Reason "watch-change" -ChangedPath $fullPath
    }

    Register-ObjectEvent -InputObject $watcher -EventName Changed -Action $action | Out-Null
    Register-ObjectEvent -InputObject $watcher -EventName Created -Action $action | Out-Null
    Register-ObjectEvent -InputObject $watcher -EventName Deleted -Action $action | Out-Null
    Register-ObjectEvent -InputObject $watcher -EventName Renamed -Action $action | Out-Null

    $watchers += $watcher
    Write-Host "[agent-index] watching: $full"
}

# Initial index at startup
Invoke-Reindex -Reason "watch-start" -ChangedPath ""

Write-Host "[agent-index] watcher running. Press Ctrl+C to stop."
while ($true) {
    Wait-Event -Timeout 2 | Out-Null
}
