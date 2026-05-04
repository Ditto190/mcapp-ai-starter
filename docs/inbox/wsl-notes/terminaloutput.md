## Terminal Output
# Command 1
 wsl-vm   ~    TS="$(date +%Y%m%d-%H%M%S)"                                                    in zsh at 12:34:06
mkdir -p ~/archive-home/snapshots/"$TS"

# Copy key shell and login profiles (do not edit them)
cp -av ~/.zshrc ~/.zprofile ~/.bashrc ~/.profile ~/archive-home/snapshots/"$TS"/ 2>/dev/null || true

# Snapshot SSH folder (copy-only)
cp -av ~/.ssh ~/archive-home/snapshots/"$TS"/ 2>/dev/null || true

echo "Snapshot created at: ~/archive-home/snapshots/$TS"
'/home/wsl-vm/.zshrc' -> '/home/wsl-vm/archive-home/snapshots/20260503-131153/.zshrc'
'/home/wsl-vm/.zprofile' -> '/home/wsl-vm/archive-home/snapshots/20260503-131153/.zprofile'
'/home/wsl-vm/.bashrc' -> '/home/wsl-vm/archive-home/snapshots/20260503-131153/.bashrc'
'/home/wsl-vm/.profile' -> '/home/wsl-vm/archive-home/snapshots/20260503-131153/.profile'
'/home/wsl-vm/.ssh' -> '/home/wsl-vm/archive-home/snapshots/20260503-131153/.ssh'
'/home/wsl-vm/.ssh/known_hosts' -> '/home/wsl-vm/archive-home/snapshots/20260503-131153/.ssh/known_hosts'
'/home/wsl-vm/.ssh/known_hosts.old' -> '/home/wsl-vm/archive-home/snapshots/20260503-131153/.ssh/known_hosts.old'
'/home/wsl-vm/.ssh/authorized_keys' -> '/home/wsl-vm/archive-home/snapshots/20260503-131153/.ssh/authorized_keys'
Snapshot created at: ~/archive-home/snapshots/20260503-131153
 wsl-vm   ~    mkdir -p ~/archive-home/baselines/"$TS"                   

# Command 2
Snapshot created at: ~/archive-home/snapshots/20260503-131153
 wsl-vm   ~    mkdir -p ~/archive-home/baselines/"$TS"                                        in zsh at 13:11:53
{
  echo "### DATE"; date
  echo "### HOME"; echo "$HOME"
  echo "### PWD"; pwd
  echo "### NODE"; which node; node -v
  echo "### NPM"; which npm; npm -v
  echo "### NVM"; command -v nvm; nvm --version
  echo "### PATH"; echo "$PATH" | tr ':' '\n'
  echo "### ALIASES"; alias | egrep "health=|ws=|proj=|apm=|foam=|mcpws=" || true
} | tee ~/archive-home/baselines/"$TS"/baseline.txt
### DATE
Sun May  3 13:12:27 AEST 2026
### HOME
/home/wsl-vm
### PWD
/home/wsl-vm
### NODE
/home/wsl-vm/.nvm/versions/node/v24.14.1/bin/node
v24.14.1
### NPM
/home/wsl-vm/.nvm/versions/node/v24.14.1/bin/npm
11.11.0
### NVM
nvm
0.40.4
### PATH
/home/wsl-vm/.local/bin
/home/wsl-vm/.dotnet
/home/linuxbrew/.linuxbrew/bin
/home/linuxbrew/.linuxbrew/sbin
/home/wsl-vm/.nvm/versions/node/v24.14.1/bin
/home/wsl-vm/.nix-profile/bin
/nix/var/nix/profiles/default/bin
/home/linuxbrew/.linuxbrew/bin
/home/linuxbrew/.linuxbrew/sbin
/usr/local/sbin
/usr/local/bin
/usr/sbin
/usr/bin
/sbin
/bin
/usr/games
/usr/local/games
/usr/lib/wsl/lib
/mnt/c/Program Files/WindowsApps/MicrosoftCorporationII.WindowsSubsystemForLinux_2.6.3.0_x64__8wekyb3d8bbwe
/mnt/c/WINDOWS/system32
/mnt/c/WINDOWS
/mnt/c/WINDOWS/System32/Wbem
/mnt/c/WINDOWS/System32/WindowsPowerShell/v1.0/
/mnt/c/WINDOWS/System32/OpenSSH/
/mnt/c/Users/dylan.a.thomas/.local/bin
/mnt/c/Users/dylan.a.thomas/AppData/Local/Microsoft/WindowsApps
/mnt/c/Users/dylan.a.thomas/AppData/Local/Programs/Microsoft VS Code Insiders/bin
/mnt/c/Users/dylan.a.thomas/AppData/Local/Programs/Git/cmd
/home/wsl-vm/.local/bin
### ALIASES
apm='cd /home/wsl-vm/projects/agentic-project-management-modme'
foam='cd /home/wsl-vm/projects/foam-modme'
health=/home/wsl-vm/scripts/health-check.sh
mcpws='cd /home/wsl-vm/projects/mcp-github-review-workspace'
proj='cd /home/wsl-vm/projects'
ws='cd /home/wsl-vm'
 wsl-vm   ~         