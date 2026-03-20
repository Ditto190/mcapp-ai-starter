#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
const out = execSync('npm outdated --json || true', { encoding: 'utf8' }).trim();
if (!out) {
  console.log('No outdated packages');
  process.exit(0);
}
let outdated;
try { outdated = JSON.parse(out); } catch (e) { console.error('Failed to parse npm outdated output'); process.exit(2); }
const pkgs = Object.keys(outdated);
if (!pkgs.length) { console.log('No outdated packages'); process.exit(0); }
console.log('Outdated packages:', pkgs.join(', '));
// Filter safe updates (major version unchanged)
const semver = (v) => v.split('.').map(n=>parseInt(n||'0',10));
const safe = pkgs.filter(name => {
  const info = outdated[name];
  const current = semver(info.current);
  const latest = semver(info.latest);
  return current[0] === latest[0]; // same major
});
if (!safe.length) { console.log('No safe (same-major) updates to apply'); process.exit(0); }
console.log('Applying safe updates for:', safe.join(', '));
// Create branch
const branch = `deps/update-${new Date().toISOString().replace(/[:.]/g,'-')}`;
try { execSync(`git checkout -b ${branch}`); } catch (e) { console.error('Failed create branch:', e.message); }
for (const pkg of safe) {
  try {
    console.log(`Updating ${pkg} -> ${outdated[pkg].latest}`);
    execSync(`npm install ${pkg}@${outdated[pkg].latest}`, { stdio: 'inherit' });
  } catch (e) {
    console.error(`Failed to update ${pkg}:`, e.message);
  }
}
// Install and run tests + validate
try {
  execSync('npm ci', { stdio: 'inherit' });
  execSync('npm test', { stdio: 'inherit' });
  // run plugin validation if present
  try { execSync('npm run plugin:validate', { stdio: 'inherit' }); } catch(e) { console.warn('plugin:validate failed or not configured'); }
  // commit and push branch
  execSync('git add package.json package-lock.json', { stdio: 'inherit' });
  execSync(`git commit -m "chore(deps): bump safe dependencies [automation]" || echo "no changes to commit"`, { stdio: 'inherit' });
  try { execSync(`git push -u origin ${branch}`, { stdio: 'inherit' }); console.log('Pushed branch', branch); }
  catch(e) { console.warn('Failed to push branch — credential required to push PR'); }
  console.log('Update-deps completed — review branch and open PR as desired');
} catch (e) {
  console.error('Post-update checks failed:', e.message);
  process.exit(1);
}
