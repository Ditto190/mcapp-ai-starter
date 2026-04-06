Write-Host "--- Search Awesome-Copilot Hook Simulation ---"
Write-Host "This script simulates a hook invocation: it prints guidance and points to the instructions file and helper script."
Write-Host "Run the helper script or open the Copilot Chat and run the search as described in .github/instructions/search-awesome-copilot.instructions.md"
Write-Host "To run the helper now: pwsh -NoProfile -ExecutionPolicy Bypass -File scripts/run_search_instructions.ps1"

# Build/update index on each hook run so new/edited agents are tracked.
python "scripts/build_agent_index.py" --reason "hook-run" --changed-path "scripts/search_hook.ps1"
