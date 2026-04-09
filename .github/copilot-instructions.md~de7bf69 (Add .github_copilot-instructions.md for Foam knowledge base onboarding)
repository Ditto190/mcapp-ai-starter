# Copilot Instructions

## Repository Overview

This is a **Foam** personal knowledge management workspace, forked from [`foambubble/foam-template`](https://github.com/foambubble/foam-template). Foam is a VS Code–based, Markdown-native knowledge base system that uses wikilinks, backlinks, graph visualization, daily notes, and templates. The repository is a **pure Markdown content repository** — there is no application code, no build system, and no test framework.

- **Languages**: Markdown, SCSS (one file), HTML (two Jekyll layout files)
- **Framework**: [Foam](https://foambubble.github.io/foam/) VS Code extension + optional Jekyll (GitHub Pages) publishing
- **Size**: ~70 files, primarily `.md` files
- **Runtime**: VS Code with the `foam.foam-vscode` extension; optional Jekyll for local publishing previews

## Build, Test, and Lint

**There are no build, test, or lint commands for this repository.** There is no `package.json`, `Makefile`, `Gemfile`, or CI workflow file. No automated test suite exists.

### Validation steps (always perform before finalizing changes)

1. **Check Markdown formatting** — Ensure all Markdown files are well-formed: headings, lists, code blocks, and front matter are properly structured.
2. **Verify wikilinks** — Internal links use `[[note-name]]` syntax (without `.md`). When creating a new note, ensure any wikilinks to it use the file's base name (without extension).
3. **Check YAML front matter** — Template files in `.foam/templates/` use YAML front matter with `foam_template` keys. Notes do not require front matter unless adding `tags` or `date` properties.
4. **Verify link reference definitions** — The file `getting-started.md` (and others) use Markdown link reference definitions at the bottom (`[wikilink]: path.md "Title"`). These are auto-managed by Foam's "Run Janitor" command; when editing manually, keep them consistent.

### Optional: Local Jekyll publishing preview

Only needed if testing GitHub Pages rendering. Requires Ruby and Bundler:

```bash
# From repo root — create Gemfile manually first (see docs/publishing/publish-to-github-pages.md)
bundle install
bundle exec jekyll serve
```

There is no `Gemfile` committed; it must be created if needed (not required for content changes).

## Repository Layout

```
<repo-root>/
├── readme.md                  # Entry point / welcome note
├── getting-started.md         # Onboarding guide with wikilinks
├── inbox.md                   # Quick-capture note
├── todo.md                    # Task tracking note
├── .foam/
│   └── templates/             # Note templates (foam_template YAML front matter)
│       ├── new-note.md        # Default new-note template
│       ├── daily-note.md      # Daily journal template (saves to /journal/)
│       └── your-first-template.md
├── .vscode/
│   ├── settings.json          # Foam + editor settings (linkReferenceDefinitions, etc.)
│   ├── extensions.json        # Recommended extensions (foam.foam-vscode, prettier, etc.)
│   ├── keybindings.json       # Workspace keyboard shortcuts
│   └── custom-tag-style.css   # CSS for tag rendering in Markdown preview
├── docs/
│   ├── index.md               # Docs table of contents (uses wikilinks)
│   ├── features/              # Feature docs: wikilinks, tags, embeds, daily-notes, etc.
│   ├── getting-started/       # Installation, VS Code setup, navigation guides
│   ├── publishing/            # GitHub Pages, Gatsby, Vercel, Netlify publishing guides
│   ├── recipes/               # Community patterns (web clipper, git sync, etc.)
│   └── tools/                 # CLI, janitor, orphans, logging docs
├── _layouts/
│   ├── home.html              # Jekyll home layout (strips .md from wikilinks via JS)
│   └── page.html              # Jekyll page layout
├── assets/
│   ├── css/style.scss         # GitHub Pages site stylesheet
│   └── images/                # Screenshots and demo GIFs referenced in docs
└── attachments/               # Binary attachments (e.g. foam-icon.png)
```

## Key Conventions

- **All notes are Markdown files** (`.md`). New notes go in the root or a relevant subdirectory.
- **Wikilinks** use `[[filename-without-extension]]` syntax. Foam resolves links by filename.
- **Link reference definitions** appear at the bottom of files to make wikilinks work on GitHub and non-Foam Markdown renderers. Example: `[note-name]: path/to/note.md "Title"`.
- **Tags** use `#tag` inline in notes. The Foam extension provides a Tag Explorer panel.
- **Templates** in `.foam/templates/` use `${FOAM_TITLE}`, `${FOAM_DATE_YEAR}`, etc. as variables.
- **Daily notes** are saved to `/journal/YYYY-MM-DD.md` per the daily-note template.
- **`.vscode/settings.json`** sets `"foam.edit.linkReferenceDefinitions": "withExtensions"` by default. For GitHub Pages publishing, this should be changed to `"withoutExtensions"`.

## CI / GitHub Actions

**There are no GitHub Actions workflows in this repository.** There is no `.github/workflows/` directory. No CI pipeline runs on pull requests or pushes.

Trust these instructions. Only search the codebase if something described here appears to be missing or incorrect.
