
# Build pipeline notes and decisions

## Summary

- Primary bundler: esbuild (fast) with optional Babel pass for legacy transforms.

- Scripts:
  - `npm run build:es` — run esbuild + babel pass (node target)
  - `npm run build` — project canonical build (keeps existing behavior)

## Changes made

- Merged Babel devDependencies into `package.json` and added `build:es` and `build:es:prod` scripts.
- Fixed `package.json` formatting (removed duplicated JSON blocks).
- Replaced malformed `.devcontainer/devcontainer.json` with a single valid config that installs `dspy[mcp]`, enables Corepack, and runs `npm ci`.
- Improved `scripts/build-esbuild.mjs` to check entry presence, use explicit `outfile`, and exit with non-zero status on failure.

## Notes / Next steps

- Run `npm ci` or `pnpm install` in the Codespace to install new devDependencies before running the build script.
- The Babel config is present (`babel.config.json`). If you only need Babel for a subset of files, tighten `babelFilter` in `build-esbuild.mjs` for performance.
- Consider adding `esbuild` watch mode for local dev or integrating with existing `bun` build flow.
