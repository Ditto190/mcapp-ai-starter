import { build } from 'esbuild';
import babel from 'esbuild-plugin-babel';
import path from 'path';
import fs from 'fs';

const root = process.cwd();

// Configure these to match your repo layout
const entryPoints = [
  'src/index.ts' // change to your real entry(s), e.g. 'packages/foo/src/index.ts'
];

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
    plugins: [
      babel({
        // apply Babel to JS/TS files; tighten to a narrower filter for better perf
        filter: babelFilter,
        // point to the root babel config
        configFile: path.join(root, 'babel.config.json')
        // Alternatively you can inline babel config via "config" property.
      })
    ]
  });

  console.log('esbuild + babel build complete');
} catch (err) {
  console.error('Build failed:', err);
  process.exit(2);
}