# ContextStream MCP Beta Setup - Install or Update
# Usage: irm https://contextstream.io/scripts/setup-beta.ps1 | iex

$ErrorActionPreference = "Stop"

# Try to load System.Net.Http for HttpClient (needed for download progress)
try {
    Add-Type -AssemblyName System.Net.Http -ErrorAction SilentlyContinue
} catch {
    # Will fall back to WebClient if HttpClient isn't available
}

$R2BaseUrl = "https://pub-68429b9f7857416c9484b75bf1887b96.r2.dev/mcp"
$BinaryName = "contextstream-mcp"
$HookBinaryName = "contextstream-hook"

# Detect if running via pipe (irm url | iex)
$script:IsRunningFromPipe = -not $MyInvocation.MyCommand.Path

function Write-Banner {
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
    Write-Host "   ContextStream MCP Beta Setup"
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
    Write-Host ""
}

function Write-Success {
    param([string]$Message)
    Write-Host "[OK] " -ForegroundColor Green -NoNewline
    Write-Host $Message
}

function Write-WarnMsg {
    param([string]$Message)
    Write-Host "[!] " -ForegroundColor Yellow -NoNewline
    Write-Host $Message
}

function Write-ErrorMsg {
    param([string]$Message)
    Write-Host "[X] " -ForegroundColor Red -NoNewline
    Write-Host $Message
}

function Write-Info {
    param([string]$Message)
    Write-Host "[>] " -ForegroundColor Blue -NoNewline
    Write-Host $Message
}

# Remove npm-installed version to avoid PATH conflicts
function Remove-NpmVersion {
    # Check if contextstream-mcp exists and is an npm installation
    try {
        $binPath = (Get-Command contextstream-mcp -ErrorAction SilentlyContinue).Source
    } catch {
        return  # Not installed, nothing to do
    }

    if (-not $binPath) {
        return
    }

    # Check if it's in a node_modules, nvm, or npm global path
    if ($binPath -match "(node_modules|\.nvm|\.npm|\\npm\\|\\node\\|Roaming\\npm)") {
        Write-Info "Removing npm-installed version..."

        # Try npm uninstall globally
        if (Test-CommandExists "npm") {
            try {
                npm uninstall -g @contextstream/mcp-server 2>&1 | Out-Null
                npm uninstall -g contextstream-mcp 2>&1 | Out-Null
            } catch {
                # Ignore errors
            }
        }

        # Also try removing the file directly if npm uninstall didn't work
        try {
            $newPath = (Get-Command contextstream-mcp -ErrorAction SilentlyContinue).Source
            if ($newPath -and ($newPath -match "(node_modules|\.nvm|\.npm|\\npm\\|\\node\\|Roaming\\npm)")) {
                Remove-Item -Force $newPath -ErrorAction SilentlyContinue
                # Also remove the .cmd wrapper if it exists
                $cmdPath = $newPath -replace '\.exe$', '.cmd'
                if (Test-Path $cmdPath) {
                    Remove-Item -Force $cmdPath -ErrorAction SilentlyContinue
                }
            }
        } catch {
            # Ignore errors
        }

        Write-Success "npm version removed"
    }
}

# Configure hooks automatically (non-interactive)
function Configure-Hooks {
    # Verify API key silently
    try {
        $keyInfo = & contextstream-mcp verify-key --json 2>$null | ConvertFrom-Json
    } catch {
        $keyInfo = @{ valid = $false }
    }

    if ($keyInfo.valid) {
        # Update MCP configs for all editors
        Write-Info "Updating configurations..."
        try {
            & contextstream-mcp update-configs --scope=all 2>&1 | Out-Null
            Write-Success "Editor MCP configs updated"
        } catch {
            # Ignore errors
        }
        # Update hooks for all editors (no questions)
        try {
            & contextstream-mcp update-hooks --scope=all 2>&1 | Out-Null
            Write-Success "Editor hooks updated"
        } catch {
            # Ignore errors
        }
        # Update rules for all editors
        try {
            & contextstream-mcp update-rules --scope=all 2>&1 | Out-Null
            Write-Success "Editor rules updated"
        } catch {
            # Ignore errors
        }
        return $true
    } else {
        return $false
    }
}

function Get-OSArch {
    $arch = if ([Environment]::Is64BitOperatingSystem) { "x64" } else { "x86" }
    return $arch
}

function Get-LatestVersion {
    try {
        $headers = @{ "Cache-Control" = "no-cache" }
        $response = Invoke-RestMethod -Uri "$R2BaseUrl/latest/version.json" -Headers $headers -ErrorAction Stop
        return $response.version
    } catch {
        return $null
    }
}

function Get-CurrentVersion {
    try {
        $version = & contextstream-mcp --version 2>$null
        if ($version) {
            return ($version -replace '\s+','')
        }
    } catch {}
    return $null
}

function Test-CommandExists {
    param([string]$Command)
    try {
        $null = Get-Command $Command -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

function Test-IsInteractive {
    try {
        if ($script:IsRunningFromPipe) {
            return $false
        }
        return -not [Console]::IsInputRedirected
    } catch {
        return $false
    }
}

# Download file with progress display and timeout
function Download-FileWithProgress {
    param(
        [string]$Url,
        [string]$OutFile,
        [int]$TimeoutSec = 120
    )

    # Check if HttpClient is available
    $httpClientAvailable = $false
    try {
        $null = [System.Net.Http.HttpClientHandler]
        $httpClientAvailable = $true
    } catch {
        $httpClientAvailable = $false
    }

    if ($httpClientAvailable) {
        # Use .NET HttpClient for better control over redirects and progress
        try {
            $handler = New-Object System.Net.Http.HttpClientHandler
            $handler.AllowAutoRedirect = $true
            $client = New-Object System.Net.Http.HttpClient($handler)
            $client.Timeout = [TimeSpan]::FromSeconds($TimeoutSec)
            $client.DefaultRequestHeaders.Add("User-Agent", "ContextStream-Setup/1.0")

            Write-Host "    Connecting..." -ForegroundColor Gray -NoNewline

            $response = $client.GetAsync($Url, [System.Net.Http.HttpCompletionOption]::ResponseHeadersRead).Result

            if (-not $response.IsSuccessStatusCode) {
                Write-Host ""
                throw "HTTP $($response.StatusCode): $($response.ReasonPhrase)"
            }

            $totalBytes = $response.Content.Headers.ContentLength
            $stream = $response.Content.ReadAsStreamAsync().Result
            $fileStream = [System.IO.File]::Create($OutFile)

            try {
                $buffer = New-Object byte[] 8192
                $totalRead = 0
                $lastPercent = -1

                while (($read = $stream.Read($buffer, 0, $buffer.Length)) -gt 0) {
                    $fileStream.Write($buffer, 0, $read)
                    $totalRead += $read

                    if ($totalBytes -gt 0) {
                        $percent = [math]::Floor(($totalRead / $totalBytes) * 100)
                        if ($percent -ne $lastPercent -and $percent % 10 -eq 0) {
                            Write-Host "`r    Downloading... $percent% ($([math]::Round($totalRead / 1MB, 1)) MB)       " -ForegroundColor Gray -NoNewline
                            $lastPercent = $percent
                        }
                    } else {
                        # Unknown size - just show bytes
                        if ($totalRead % 100000 -lt 8192) {
                            Write-Host "`r    Downloading... $([math]::Round($totalRead / 1KB)) KB       " -ForegroundColor Gray -NoNewline
                        }
                    }
                }
                Write-Host "`r    Downloaded $([math]::Round($totalRead / 1MB, 2)) MB                    " -ForegroundColor Gray
            } finally {
                $fileStream.Close()
                $stream.Close()
            }

            $client.Dispose()
            return $true
        } catch [System.AggregateException] {
            # Handle timeout or cancellation
            $inner = $_.Exception.InnerException
            if ($inner -is [System.Threading.Tasks.TaskCanceledException]) {
                Write-Host ""
                throw "Download timed out after $TimeoutSec seconds"
            }
            Write-Host ""
            throw $inner.Message
        } catch {
            Write-Host ""
            throw $_
        }
    } else {
        # Fallback: Use WebClient (works on all PowerShell versions)
        try {
            Write-Host "    Downloading..." -ForegroundColor Gray -NoNewline

            # Use System.Net.WebClient which is available everywhere
            $webClient = New-Object System.Net.WebClient
            $webClient.Headers.Add("User-Agent", "ContextStream-Setup/1.0")

            # Download the file
            $webClient.DownloadFile($Url, $OutFile)

            $fileSize = (Get-Item $OutFile).Length
            Write-Host "`r    Downloaded $([math]::Round($fileSize / 1MB, 2)) MB                    " -ForegroundColor Gray

            $webClient.Dispose()
            return $true
        } catch {
            Write-Host ""
            throw $_
        }
    }
}

function Stop-RunningMcp {
    $processes = Get-Process -Name "contextstream-mcp" -ErrorAction SilentlyContinue
    if ($processes) {
        Write-Info "Stopping running MCP server for update..."
        $processes | Stop-Process -Force -ErrorAction SilentlyContinue
        # Wait for process to fully exit and release file handle
        $retries = 0
        while ($retries -lt 10) {
            $still = Get-Process -Name "contextstream-mcp" -ErrorAction SilentlyContinue
            if (-not $still) { break }
            Start-Sleep -Milliseconds 500
            $retries++
        }
        if ($retries -lt 10) {
            Write-Success "MCP server stopped"
        } else {
            Write-WarnMsg "MCP server may still be running"
        }
    }
}

function Replace-LockedBinary {
    param(
        [string]$TempPath,
        [string]$TargetPath
    )

    # First attempt: direct move
    try {
        if (Test-Path $TargetPath) {
            Remove-Item -Force $TargetPath -ErrorAction Stop
        }
        Move-Item -Path $TempPath -Destination $TargetPath -Force -ErrorAction Stop
        return $true
    } catch {
        # File likely locked — stop the process and retry
    }

    Stop-RunningMcp

    # Second attempt after stopping the process
    try {
        if (Test-Path $TargetPath) {
            Remove-Item -Force $TargetPath -ErrorAction Stop
        }
        Move-Item -Path $TempPath -Destination $TargetPath -Force -ErrorAction Stop
        return $true
    } catch {
        # Still locked — try rename trick (Windows allows renaming running exes)
    }

    # Third attempt: rename old binary out of the way, then move new one in
    $oldPath = "$TargetPath.old"
    try {
        if (Test-Path $oldPath) {
            Remove-Item -Force $oldPath -ErrorAction SilentlyContinue
        }
        Rename-Item -Path $TargetPath -NewName "$((Split-Path -Leaf $TargetPath)).old" -Force -ErrorAction Stop
        Move-Item -Path $TempPath -Destination $TargetPath -Force -ErrorAction Stop
        # Clean up old binary (may fail if still running, that's ok)
        Remove-Item -Force $oldPath -ErrorAction SilentlyContinue
        return $true
    } catch {
        # Clean up temp file on failure
        Remove-Item -Force $TempPath -ErrorAction SilentlyContinue
        throw "Could not replace binary — please close all AI editors and try again."
    }
}

function Install-Binary {
    param(
        [string]$Version
    )

    $arch = Get-OSArch
    $artifactName = "contextstream-mcp-win-${arch}.exe"
    $hookName = "contextstream-hook-win-${arch}.exe"
    $downloadUrl = "$R2BaseUrl/v${Version}/${artifactName}"
    $hookUrl = "$R2BaseUrl/v${Version}/${hookName}"

    # Install to user's local AppData (no admin required)
    $installDir = Join-Path $env:LOCALAPPDATA "ContextStream"
    if (-not (Test-Path $installDir)) {
        New-Item -ItemType Directory -Path $installDir -Force | Out-Null
    }

    $installPath = Join-Path $installDir "$BinaryName.exe"
    $hookPath = Join-Path $installDir "$HookBinaryName.exe"

    Write-Info "Downloading $artifactName..."

    try {
        # Download to temp files first to avoid locking issues with running binary
        $tempPath = "$installPath.new"
        $tempHookPath = "$hookPath.new"

        # Download main binary with progress and 2-minute timeout
        Download-FileWithProgress -Url $downloadUrl -OutFile $tempPath -TimeoutSec 120

        # Replace the running binary (handles locked file)
        Replace-LockedBinary -TempPath $tempPath -TargetPath $installPath

        # Try to download hook binary (optional, shorter timeout)
        try {
            Write-Info "Downloading $hookName..."
            Download-FileWithProgress -Url $hookUrl -OutFile $tempHookPath -TimeoutSec 60
            Replace-LockedBinary -TempPath $tempHookPath -TargetPath $hookPath
        } catch {
            # Hook binary is optional
            Remove-Item -Force $tempHookPath -ErrorAction SilentlyContinue
            Write-WarnMsg "Hook binary not available (optional)"
        }

        # Clean up any leftover .old files from previous updates
        Remove-Item -Force "$installPath.old" -ErrorAction SilentlyContinue
        Remove-Item -Force "$hookPath.old" -ErrorAction SilentlyContinue

        # Add to PATH if not already there
        $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
        if ($userPath -notlike "*$installDir*") {
            [Environment]::SetEnvironmentVariable("Path", "$userPath;$installDir", "User")
            Write-Info "Added $installDir to PATH"
        }

        # Prepend to current session PATH to ensure new binary is found first
        # This is important when updating - we want the new version to run, not the old one
        if ($env:Path -notlike "$installDir;*") {
            $env:Path = "$installDir;$env:Path"
        }

        return $true
    } catch {
        # Clean up temp files on failure
        Remove-Item -Force "$installPath.new" -ErrorAction SilentlyContinue
        Remove-Item -Force "$hookPath.new" -ErrorAction SilentlyContinue
        Write-WarnMsg "Binary download failed: $_"
        return $false
    }
}

function Install-ViaNpm {
    $allowLegacy = ($env:CONTEXTSTREAM_BETA_ALLOW_LEGACY_NPM -eq "1" -or $env:CONTEXTSTREAM_BETA_ALLOW_LEGACY_NPM -eq "true")
    if ($allowLegacy) {
        Write-WarnMsg "Using legacy npm fallback (@contextstream/mcp-server) because CONTEXTSTREAM_BETA_ALLOW_LEGACY_NPM is enabled."
        npm install -g @contextstream/mcp-server@latest
        return $LASTEXITCODE -eq 0
    }

    Write-ErrorMsg "Rust beta binary unavailable and legacy npm fallback is disabled."
    Write-Info "Enable legacy fallback temporarily with CONTEXTSTREAM_BETA_ALLOW_LEGACY_NPM=true"
    return $false
}

function Invoke-SetupWizard {
    # Get the full path to the binary (prefer the new install location)
    $installDir = Join-Path $env:LOCALAPPDATA "ContextStream"
    $binaryPath = Join-Path $installDir "$BinaryName.exe"

    # Use full path if it exists, otherwise fall back to PATH lookup
    if (Test-Path $binaryPath) {
        $setupCmd = "`"$binaryPath`" setup"
    } else {
        $setupCmd = "contextstream-mcp setup"
    }

    if (Test-IsInteractive) {
        if (Test-Path $binaryPath) {
            & $binaryPath setup
        } else {
            & contextstream-mcp setup
        }
        return $LASTEXITCODE -eq 0
    } else {
        # When piped (irm | iex), spawn a new window
        Write-Info "Launching setup wizard in a new window..."
        Write-Info "Please complete the setup in the new window that opens."
        Write-Host ""

        $cmd = "Write-Host 'ContextStream MCP Beta Setup Wizard' -ForegroundColor Cyan; Write-Host ''; & $setupCmd; Write-Host ''; Write-Host 'Press any key to close this window...' -ForegroundColor Yellow; `$null = `$Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')"

        $process = Start-Process powershell -ArgumentList "-Command", $cmd -PassThru -Wait

        return $process.ExitCode -eq 0
    }
}

function Main {
    Write-Banner

    $arch = Get-OSArch
    Write-Info "Detected: Windows ($arch)"
    Write-Host ""

    # Remove any npm-installed version to avoid PATH conflicts
    Remove-NpmVersion

    # Check versions
    $current = Get-CurrentVersion
    $latest = Get-LatestVersion

    if ($current) {
        Write-Info "Current version: $current"
    }

    if ($latest) {
        Write-Info "Latest version:  $latest"
    } else {
        Write-WarnMsg "Could not fetch latest version"
        $latest = "latest"
    }

    Write-Host ""

    # Check if already up to date
    if ($current -and ($current -eq $latest)) {
        Write-Success "Already up to date!"
        Write-Host ""
        # Still run setup to let user configure editors
        Write-Info "Running setup to configure editors..."
        Invoke-SetupWizard | Out-Null
        Write-Host ""
        return
    }

    # Determine action
    if ($current) {
        Write-Info "Updating ContextStream MCP Server..."
    } else {
        Write-Info "Installing ContextStream MCP Server..."
    }

    # Try binary installation first
    $binaryInstalled = $false

    if ($latest -ne "latest") {
        if (Install-Binary -Version $latest) {
            $binaryInstalled = $true
            Write-Success "Binary installed"

            # Configure hooks with API key verification
            Configure-Hooks | Out-Null
        }
    }

    # Optional legacy npm fallback if binary installation failed
    if (-not $binaryInstalled) {
        if (Install-ViaNpm) {
            Write-Success "Installed via legacy npm fallback"
        } else {
            Write-ErrorMsg "Installation failed for Rust MCP beta."
            Write-Info "Expected filename: contextstream-mcp-win-$arch.exe"
            exit 1
        }
    }

    Write-Host ""

    # For both updates and new installs: run setup wizard to let user configure editors
    # The wizard handles API key check and editor selection
    Write-Info "Running setup wizard..."
    Invoke-SetupWizard | Out-Null

    Write-Host ""
    Write-Success "Done!"
    Write-Host ""
    Write-Info "Next steps:"
    Write-Host "  - Restart your AI editor (Claude Code, Cursor, etc.)"
    Write-Host "  - Try: `"session summary`" in your AI tool"
    Write-Host "  - Docs: https://contextstream.io/docs/mcp"
    Write-Host ""
}

# Run main function
Main
