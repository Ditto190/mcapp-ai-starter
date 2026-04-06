#!/usr/bin/env node
// scripts/save_lesson.js
// Usage: DRY_RUN=true node scripts/save_lesson.js
const urlBase = process.env.CONTEXTSTREAM_API_URL || 'https://api.contextstream.io/v1';
const apiKey = process.env.CONTEXTSTREAM_API_KEY;
const projectId = process.env.CONTEXTSTREAM_PROJECT_ID;
const dryRun = (process.env.DRY_RUN || 'true').toLowerCase() === 'true';

const lesson = {
    title: "Example: CI Flakiness Captured",
    severity: "high",
    category: "ci",
    trigger: "Repeated failures in windows-integration job",
    impact: "Blocked release, increased triage time",
    prevention: "Isolate flaky tests, improve environment stability, add retries",
    keywords: ["ci", "flake", "windows", "tests"],
    metadata: { repo: process.env.GITHUB_REPOSITORY || 'owner/repo', workflow: process.env.GITHUB_WORKFLOW || 'local-test' }
};

async function run() {
    console.log('DRY_RUN:', dryRun);
    console.log('ContextStream API URL:', urlBase);
    console.log('Project ID:', projectId || '<none>');
    console.log('Payload:');
    console.log(JSON.stringify(lesson, null, 2));

    if (dryRun) {
        console.log('\n--- DRY RUN: not posting to ContextStream ---');
        process.exit(0);
    }

    if (!apiKey || !projectId) {
        console.error('Missing CONTEXTSTREAM_API_KEY or CONTEXTSTREAM_PROJECT_ID in environment. Aborting.');
        process.exit(2);
    }

    const endpoint = `${urlBase}/projects/${projectId}/events`;
    console.log('Posting to', endpoint);

    try {
        // Use global fetch (Node 18+). If not available, fallback to curl via child_process
        if (typeof fetch === 'function') {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(lesson)
            });
            const body = await res.text();
            console.log('Status:', res.status);
            console.log('Response:', body);
        } else {
            const { execSync } = require('child_process');
            const cmd = `curl -sS -X POST "${endpoint}" -H "Authorization: Bearer ${apiKey}" -H "Content-Type: application/json" -d '${JSON.stringify(lesson)}'`;
            console.log(execSync(cmd, { encoding: 'utf8' }));
        }
    } catch (err) {
        console.error('Post failed:', err);
        process.exit(3);
    }
}

run();
