{
  # Flake description shown by `nix flake metadata`
  description = "Deterministic GitHub Actions self-hosted runner (Determinate Nix)";

  inputs = {
    # Track nixos-unstable for latest packages; pin via `nix flake update`
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

    # Determinate Nix — flakes-first Nix with improved UX and binary caches
    determinate.url = "github:DeterminateSystems/determinate-nix";
  };

  outputs = { self, nixpkgs, determinate }:
    let
      system = "x86_64-linux";
      pkgs   = nixpkgs.legacyPackages.${system};
    in {
      # Full NixOS system — build with:
      #   nix build .#nixosConfigurations.runner.config.system.build.toplevel
      nixosConfigurations.runner = nixpkgs.lib.nixosSystem {
        inherit system;
        modules = [
          ./configuration.nix
          determinate.nixosModules.default
        ];
      };

      # Dev shell with all runner tools for local testing:
      #   nix develop
      devShells.${system}.default = pkgs.mkShell {
        packages = with pkgs; [
          nodejs_20
          git
          ripgrep
          jq
          docker
          gh
        ];
      };
    };
}
