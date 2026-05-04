{ pkgs, lib, config, inputs, ... }:

{
  # Project metadata
  name = "foam-modme";
  
  # Environment variables
  env = {
    FOAM_PROJECT = "foam-modme";
    EDITOR = "code";
  };

  # Packages available in the development environment
  packages = with pkgs; [
    # Version control
    git
    gh  # GitHub CLI
    
    # Node.js ecosystem (for any build tools or extensions)
    nodejs_20  # includes npm — no separate nodePackages.npm needed
    bun        # fast JS package manager + runtime
    yarn       # top-level yarn (nodePackages.yarn was removed from nixpkgs)
    
    # Markdown tools
    mdl  # Markdown linter
    
    # Text processing
    ripgrep  # Fast grep alternative
    fd       # Fast find alternative
    jq       # JSON processor
    
    # Optional: Static site generators
    # jekyll  # Uncomment if using Jekyll
    # hugo    # Uncomment if using Hugo
  ];

  # Development scripts
  scripts = {
    # Quick status check
    status.exec = ''
      echo "📝 Foam Knowledge Base: $FOAM_PROJECT"
      echo "───────────────────────────────────────"
      echo "Git branch: $(git branch --show-current)"
      echo "Node version: $(node --version)"
      echo "Files: $(find docs -name '*.md' | wc -l) markdown documents"
    '';
    
    # Search notes
    search.exec = ''
      if [ -z "$1" ]; then
        echo "Usage: search <query>"
        echo "Example: search 'project management'"
      else
        echo "Searching for: $*"
        rg -i "$*" docs/ inbox.md todo.md getting-started.md || echo "No matches found"
      fi
    '';
    
    # Create new note
    new-note.exec = ''
      if [ -z "$1" ]; then
        echo "Usage: new-note <filename>"
        echo "Example: new-note my-new-note"
      else
        NOTE_FILE="docs/inbox/$1.md"
        echo "---" > "$NOTE_FILE"
        echo "title: $1" >> "$NOTE_FILE"
        echo "date: $(date +%Y-%m-%d)" >> "$NOTE_FILE"
        echo "---" >> "$NOTE_FILE"
        echo "" >> "$NOTE_FILE"
        echo "# $1" >> "$NOTE_FILE"
        echo "" >> "$NOTE_FILE"
        echo "Created: $NOTE_FILE"
      fi
    '';
    
    # Open in VS Code
    code.exec = ''
      command code . || echo "VS Code not in PATH"
    '';
  };

  # Git hooks (optional)
  # pre-commit = {
  #   hooks = {
  #     markdownlint.enable = true;
  #   };
  # };

  # Shell hook - runs when entering the environment
  enterShell = ''
    echo ""
    echo "╔════════════════════════════════════════╗"
    echo "║   📝 Foam Knowledge Base Environment  ║"
    echo "╚════════════════════════════════════════╝"
    echo ""
    echo "Available commands:"
    echo "  status     - Show project status"
    echo "  search     - Search through notes"
    echo "  new-note   - Create a new note"
    echo "  code       - Open in VS Code"
    echo ""
    echo "Tools available:"
    echo "  • Git: $(git --version | cut -d' ' -f3)"
    echo "  • Node.js: $(node --version)"
    echo "  • Ripgrep: $(rg --version | head -1 | cut -d' ' -f2)"
    echo ""
    echo "Type 'status' to see project information"
    echo ""
  '';

  # Languages configuration
  languages = {
    # Enable JavaScript/TypeScript support if needed
    javascript = {
      enable = true;
      package = pkgs.nodejs_20;
    };
  };

  # Process management (if you want to run services)
  # processes = {
  #   # Example: run a local web server
  #   web-server.exec = "python3 -m http.server 8000";
  # };
}
