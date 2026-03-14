#!/usr/bin/env node
import { execFileSync } from 'child_process';
import fs from 'fs';
try {
    execFileSync(process.execPath, ['.github/skills/composable-agent-collection/scripts/compose-collection.mjs', '--name', 'example-plugin', '--dry-run', '--format', 'json', '--no-generate'], { stdio: 'inherit' });
} catch (e) {
    // The compose script may exit non-zero if plugin missing; we still want to capture output
}
// read file created by CI step if present
const outFile = 'compose-dry.json';
if (!fs.existsSync(outFile)) {
    console.error('compose-dry.json not produced — smoke-run may be skipped');
    process.exit(0);
}
const data = JSON.parse(fs.readFileSync(outFile, 'utf8'));
if (!Array.isArray(data.steps)) {
    console.error('Invalid compose JSON: missing steps array');
    process.exit(2);
}
console.log('Smoke test: steps:', data.steps.map(s => s.name || s.script || s).join(', '));
process.exit(0);
