{
  description = "Portable development environment for agentic-project-management-modme";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.05";
  };

  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" ];
      forAllSystems = f: nixpkgs.lib.genAttrs systems (system: f (import nixpkgs { inherit system; }));
    in {
      devShells = forAllSystems (pkgs: {
        default = pkgs.mkShell {
          packages = with pkgs; [
            git
            nodejs_20
            python3
            zsh
          ];

          shellHook = ''
            export NODE_ENV=development
            export MCP_CONFIG_PATH=$PWD/.vscode/mcp.json
            echo "Dev shell ready. MCP config: $MCP_CONFIG_PATH"
          '';
        };
      });
    };
}
