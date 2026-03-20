import { build } from 'esbuild';
import path from 'path';
import fs from 'fs';

// Try to load optional babel plugin. If it's not installed, continue without it.
let babelPlugin = null;
try {
  const mod = await import('esbuild-plugin-babel');
  babelPlugin = mod.default || mod;
} catch (err) {
  console.warn('Optional plugin esbuild-plugin-babel not installed; skipping Babel pass.');
}

const root = process.cwd();

// Auto-detect entry points from common candidates
const candidateEntries = [
  'src/index.ts',
  'src/index.tsx',
  'src/app.ts',
  'src/app.tsx',
  'src/main.ts',
  'src/main.tsx'
];
const entryPoints = candidateEntries.filter(p => fs.existsSync(path.join(root, p)));
if (entryPoints.length === 0) {
  console.warn('Warning: no entry points found among candidates:', candidateEntries.join(', '));
  console.warn('Skipping esbuild step. If you want to build, set `entryPoints` in scripts/build-esbuild.mjs to your entry files.');
  process.exit(0);
}

const outdir = 'dist';
const outfile = path.join(outdir, 'index.js');
const isProd = process.env.NODE_ENV === 'production';

// If you only need Babel for legacy code or particular directories, tighten this filter.
// Example: only run Babel for files under src/legacy:
//   const babelFilter = /src\/legacy\/.*\.[jt]sx?$/
// Use a broader filter to run Babel on all JS/TS: /\.[jt]sx?$/
const babelFilter = /\.(t|j)sx?$/;

if (!fs.existsSync(entryPoints[0])) {
  console.warn(`Warning: entry point ${entryPoints[0]} not found — skipping esbuild step.`);
  process.exit(0);
}

try {
  await build({
    entryPoints,
    bundle: true,
    platform: 'node', // change to 'browser' for web bundles
    outfile,
    sourcemap: true,
    minify: isProd,
    target: ['node18'],
    logLevel: 'info',
    plugins: babelPlugin ? [
      babelPlugin({
        filter: babelFilter,
        configFile: path.join(root, 'babel.config.json')
      })
    ] : []
  });

  console.log('esbuild + babel build complete');
} catch (err) {
  console.error('Build failed:', err);
  process.exit(2);
}