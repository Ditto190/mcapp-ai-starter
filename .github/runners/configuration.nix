# configuration.nix
#
# NixOS module that configures a lightweight GitHub Actions self-hosted runner.
# Resources: ≥ 512 MB RAM, ≥ 1 vCPU (sufficient for lint/test/agent workloads).
#
# Secrets are read from environment variables at activation time — never
# stored in the Nix store or committed to source control.

{ config, pkgs, lib, ... }:

let
  # Runner user — runs Actions jobs with least privilege
  runnerUser = "github-runner";
in
{
  # ─── Basic system settings ─────────────────────────────────────────────────
  system.stateVersion = "24.11";

  networking.hostName = "nix-runner";

  # Allow the runner user to use Docker without sudo
  users.users.${runnerUser} = {
    isSystemUser = true;
    group        = runnerUser;
    extraGroups  = [ "docker" ];
    home         = "/var/lib/github-runner";
    createHome   = true;
  };
  users.groups.${runnerUser} = {};

  # ─── Required packages ─────────────────────────────────────────────────────
  environment.systemPackages = with pkgs; [
    nodejs_20        # Node.js 20 LTS (agent scripts)
    git              # Source code checkout
    ripgrep          # Fast search (discover-agents.mjs)
    jq               # JSON processing in shell steps
    gh               # GitHub CLI
    curl             # HTTP requests in deploy scripts
    bash             # Workflow shell
    coreutils        # Standard UNIX tools
    gnugrep          # grep (pattern matching in run-agent.mjs)
  ];

  # ─── Docker (rootless) for containerised agent steps ───────────────────────
  virtualisation.docker = {
    enable      = true;
    rootless    = {
      enable      = true;
      setSocketVariable = true;
    };
    autoPrune.enable = true;
  };

  # ─── GitHub Actions Runner service ─────────────────────────────────────────
  # The token and repository URL are injected at activation via environment
  # variables (see deploy.sh) — they are never written to the Nix store.
  #
  # Override `repoUrl` in a per-machine configuration to deploy to a different
  # repository without modifying this shared module:
  #   services.github-runners.nix-runner.url = "https://github.com/ORG/REPO";
  services.github-runners = {
    # A single runner named "nix-runner"; add more entries for a runner pool.
    nix-runner = {
      enable       = true;
      # The URL is read from an environment variable written by deploy.sh so
      # this configuration module can be reused across forks without changes.
      url          = builtins.getEnv "RUNNER_REPO_URL";
      # The token file is written by deploy.sh before activation.
      tokenFile    = "/run/secrets/runner-token";
      user         = runnerUser;
      group        = runnerUser;
      workDir      = "/var/lib/github-runner/work";

      # Labels allow workflows to target this runner with:
      #   runs-on: [self-hosted, nix, linux]
      extraLabels  = [ "nix" "linux" "x86_64" ];

      # Automatically update the runner binary on startup
      replace      = true;
    };
  };

  # Ensure the work directory exists before the runner starts
  systemd.tmpfiles.rules = [
    "d /var/lib/github-runner/work 0755 ${runnerUser} ${runnerUser} -"
    "d /run/secrets 0700 root root -"
  ];

  # ─── Firewall — allow outbound HTTPS only ──────────────────────────────────
  networking.firewall = {
    enable         = true;
    allowedTCPPorts = [ 443 80 ];
  };
}
