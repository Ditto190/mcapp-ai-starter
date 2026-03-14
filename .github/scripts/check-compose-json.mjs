#!/usr/bin/env node
import fs from 'fs';
const [, , file] = process.argv;
if (!file) {
    console.error('Usage: check-compose-json.mjs <file>');
    process.exit(2);
}
let data;
try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
} catch (e) {
    console.error('Invalid JSON:', e.message);
    process.exit(3);
}
if (!Array.isArray(data.steps)) {
    console.error('Missing steps array in compose output');
    process.exit(4);
}
const hasValidate = data.steps.some(s => s.name === 'validate' || (s.script && s.script.includes('validate')));
if (!hasValidate) {
    console.error('Validate step is missing from compose dry-run');
    process.exit(5);
}
// If materialize or validate provided errors in summary, fail
if (data.errors && data.errors > 0) {
    console.error(`Compose reported ${data.errors} error(s)`);
    process.exit(6);
}
console.log('Compose dry-run JSON looks good');
process.exit(0);
