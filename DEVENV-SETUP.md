# Development Environment Setup Guide

This guide explains how to use the Docker-free development environment for the foam-modme project using Nix and devenv.

## Overview

Your development setup consists of three components:

1. **Nix** - Package manager for reproducible builds
2. **devenv** - Declarative development environments using Nix
3. **NixOS MCP Server** - For configuration queries (already configured)

## Quick Start

### 1. Complete Initial Setup

Run the setup script (only needed once):

```bash
cd /home/wsl-vm
chmod +x setup-devenv.sh
./setup-devenv.sh
```

After completion, **restart your shell** or run:

```bash
source ~/.zshrc
```

### 2. Enter the Development Environment

Navigate to your project and activate the environment:

```bash
cd ~/projects/foam-modme
devenv shell
```

You'll see a welcome message with available commands.

### 3. Use the Environment

Once inside the devenv shell, you have access to:

#### Custom Commands

```bash
# Show project status
status

# Search through your notes
search "keyword"
search "project management"

# Create a new note
new-note my-topic

# Open project in VS Code
code
```

#### Standard Tools

- `git` - Version control
- `gh` - GitHub CLI
- `node` / `npm` / `yarn` - JavaScript tooling
- `rg` (ripgrep) - Fast text search
- `fd` - Fast file finder
- `jq` - JSON processor

### 4. Start Services (Optional)

If you configure services in `devenv.nix`, start them with:

```bash
devenv up
```

Press `Ctrl+C` to stop all services.

## Configuration Files

### `devenv.nix`

Main configuration file defining:
- **Packages** - Tools available in the environment
- **Scripts** - Custom commands
- **Environment variables**
- **Shell hooks** - Actions on environment entry
- **Services** - Background processes (optional)

Example: Add a new package

```nix
packages = with pkgs; [
  git
  nodejs_20
  python3  # Add this line
];
```

### `devenv.yaml`

Project metadata and settings:
- Nixpkgs version/channel
- Global settings
- Permissions (unfree packages, etc.)

## Common Workflows

### Working on the Project

```bash
# 1. Enter environment
cd ~/projects/foam-modme
devenv shell

# 2. Check status
status

# 3. Make changes to your notes
# ... edit files ...

# 4. Search and validate
search "todo"

# 5. Commit changes
git add .
git commit -m "Update notes"
git push
```

### Adding New Tools

Edit `devenv.nix` and add to the `packages` list:

```nix
packages = with pkgs; [
  git
  nodejs_20
  # Add new tools here:
  hugo        # Static site generator
  mdbook      # Markdown book builder
  pandoc      # Document converter
];
```

Then reload the environment:

```bash
exit                # Exit current shell
devenv shell        # Re-enter with new packages
```

### Creating Custom Scripts

Add to the `scripts` section in `devenv.nix`:

```nix
scripts = {
  my-command.exec = ''
    echo "Running my custom command"
    # Your shell commands here
  '';
};
```

## NixOS MCP Server

Your MCP server is configured in `.vscode/mcp.json` (or similar):

```json
{
  "mcpServers": {
    "nixos": {
      "command": "nix",
      "args": ["run", "github:utensils/mcp-nixos", "--"]
    }
  }
}
```

This provides Nix configuration queries and documentation without requiring manual searches.

## Optional: Podman Setup

If you chose to install Podman during setup, you can use it for container needs:

```bash
# Run containers
podman run -it ubuntu:latest bash

# Use with Docker Compose files
podman-compose up

# Build images
podman build -t my-image .
```

Podman is Docker-compatible and runs without a daemon (rootless).

## Troubleshooting

### "command not found: devenv"

Make sure you've sourced your shell profile:

```bash
source ~/.zshrc
# or
exec zsh
```

### "Nix not in PATH"

Add to your `~/.zshrc`:

```bash
if [ -e /nix/var/nix/profiles/default/etc/profile.d/nix-daemon.sh ]; then
    . /nix/var/nix/profiles/default/etc/profile.d/nix-daemon.sh
fi
```

### Packages not available

Make sure you're inside the devenv shell:

```bash
cd ~/projects/foam-modme
devenv shell
```

### Need to update devenv

```bash
nix-env -iA cachix -f https://cachix.org/api/v1/install
cachix use devenv
nix-env -if https://github.com/cachix/devenv/tarball/latest
```

## Advanced Usage

### Using Nix Flakes Directly

For maximum portability, you can define a `flake.nix`:

```nix
{
  description = "Foam knowledge base";
  
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
  };
  
  outputs = { self, nixpkgs, ... }: 
  let
    system = "x86_64-linux";
    pkgs = import nixpkgs { inherit system; };
  in {
    devShells."${system}".default = pkgs.mkShell {
      packages = with pkgs; [ git nodejs_20 ripgrep ];
    };
  };
}
```

Then use `nix develop` instead of `devenv shell`.

### Sharing the Environment

Commit `devenv.nix` and `devenv.yaml` to your repository. Anyone with Nix and devenv installed can replicate your exact environment with:

```bash
git clone <your-repo>
cd <your-repo>
devenv shell
```

## Benefits of This Setup

✅ **No Docker required** - Pure Nix-based isolation  
✅ **Reproducible** - Same environment every time  
✅ **Fast** - Binary caches prevent rebuilding  
✅ **Portable** - Works on any Linux, macOS, WSL  
✅ **Declarative** - Environment as code  
✅ **Lightweight** - No heavy container images  

## Resources

- [devenv Documentation](https://devenv.sh/)
- [Nix Manual](https://nixos.org/manual/nix/stable/)
- [NixOS Wiki](https://wiki.nixos.org/)
- [Nix Package Search](https://search.nixos.org/packages)

## Next Steps

1. ✅ Complete setup with `./setup-devenv.sh`
2. ✅ Restart shell
3. ✅ Navigate to project: `cd ~/projects/foam-modme`
4. ✅ Enter environment: `devenv shell`
5. ✅ Run `status` to see everything working
6. 🎯 Customize `devenv.nix` for your specific needs
7. 🎯 Commit configuration to version control
