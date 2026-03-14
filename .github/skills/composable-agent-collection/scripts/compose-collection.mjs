#!/usr/bin/env node
/**
 * compose-collection.mjs
 *
 * Guided end-to-end pipeline for creating a composable plugin collection from
 * the local awesome-copilot library:
 *
 *   scaffold → write manifest → materialize → validate → generate marketplace
 *
 * Usage (run from anywhere in the workspace):
 *   node .github/skills/composable-agent-collection/scripts/compose-collection.mjs \
 *     --name my-collection \
 *     --description "My team plugin" \
 *     --agents "devops-expert,debug,api-architect" \
 *     --skills "git-commit,gh-cli" \
 *     --keywords "mcp,typescript"
 *
 * Flags:
 *   --name, -n          Collection name (lowercase, hyphens only) [required]
 *   --description, -d   Short description for plugin.json
 *   --agents, -a        Comma-separated list of agent base-names (without .agent.md)
 *   --skills, -s        Comma-separated list of skill folder names
 *   --keywords, -k      Comma-separated list of tags (lowercase)
 *   --dry-run           Print what would happen without writing files
 *   --list-agents       List available agents and exit
 *   --list-skills       List available skills and exit
 */

import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path resolution:
// This script lives at  .github/skills/composable-agent-collection/scripts/
// Workspace root is 4 levels up, awesome-copilot root is workspace/plugins/awesome-copilot
const WORKSPACE_ROOT = path.resolve(__dirname, "..", "..", "..", "..");
const AC_ROOT = path.join(WORKSPACE_ROOT, "plugins", "awesome-copilot");
const PLUGINS_DIR = path.join(AC_ROOT, "plugins");
const AGENTS_DIR = path.join(AC_ROOT, "agents");
const SKILLS_DIR = path.join(AC_ROOT, "skills");
const ENG_DIR = path.join(AC_ROOT, "eng");

// ── CLI argument parsing ────────────────────────────────────────────────────

function parseArgs() {
    const args = process.argv.slice(2);
    const out = {
        name: undefined,
        description: undefined,
        agents: [],
        skills: [],
        keywords: [],
        dryRun: false,
        format: undefined,
        noMaterialize: false,
        noValidate: false,
        noGenerate: false,
        listAgents: false,
        listSkills: false,
    };
    out.plugin = undefined;

    for (let i = 0; i < args.length; i++) {
        const a = args[i];
        const next = () => args[++i];

        if (a === "--list-agents") { out.listAgents = true; }
        else if (a === "--list-skills") { out.listSkills = true; }
        else if (a === "--dry-run") { out.dryRun = true; }
        else if (a === "--format" || a.startsWith("--format=")) {
            if (a === "--format") out.format = next(); else out.format = a.split("=")[1];
        }
        else if (a === "--no-materialize") { out.noMaterialize = true; }
        else if (a === "--no-validate") { out.noValidate = true; }
        else if (a === "--no-generate") { out.noGenerate = true; }
        else if (a === "--name" || a === "-n") { out.name = next(); }
        else if (a.startsWith("--name=")) { out.name = a.split("=")[1]; }
        else if (a === "--description" || a === "-d") { out.description = next(); }
        else if (a.startsWith("--description=")) { out.description = a.split("=")[1]; }
        else if (a === "--agents" || a === "-a") { out.agents = next().split(",").map(s => s.trim()).filter(Boolean); }
        else if (a.startsWith("--agents=")) { out.agents = a.split("=")[1].split(",").map(s => s.trim()).filter(Boolean); }
        else if (a === "--skills" || a === "-s") { out.skills = next().split(",").map(s => s.trim()).filter(Boolean); }
        else if (a.startsWith("--skills=")) { out.skills = a.split("=")[1].split(",").map(s => s.trim()).filter(Boolean); }
        else if (a === "--keywords" || a === "-k") { out.keywords = next().split(",").map(s => s.trim()).filter(Boolean); }
        else if (a.startsWith("--keywords=")) { out.keywords = a.split("=")[1].split(",").map(s => s.trim()).filter(Boolean); }
        else if (a === "--plugin") { out.plugin = next(); }
        else if (a.startsWith("--plugin=")) { out.plugin = a.split("=")[1]; }
    }

    return out;
}

// ── Discovery helpers ─────────────────────────────────────────────────────

function listAvailableAgents() {
    if (!fs.existsSync(AGENTS_DIR)) return [];
    return fs.readdirSync(AGENTS_DIR)
        .filter(f => f.endsWith(".agent.md"))
        .map(f => f.replace(/\.agent\.md$/, ""))
        .sort();
}

function listAvailableSkills() {
    if (!fs.existsSync(SKILLS_DIR)) return [];
    return fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
        .filter(e => e.isDirectory() && fs.existsSync(path.join(SKILLS_DIR, e.name, "SKILL.md")))
        .map(e => e.name)
        .sort();
}

// ── Validation helpers ────────────────────────────────────────────────────

function validateName(name) {
    if (!name) return "name is required";
    if (!/^[a-z0-9-]+$/.test(name)) return "name must be lowercase alphanumeric + hyphens only";
    if (name.length < 1 || name.length > 50) return "name must be 1–50 characters";
    return null;
}

function validateAgents(agents) {
    const available = new Set(listAvailableAgents());
    return agents.filter(a => !available.has(a));
}

function validateSkills(skills) {
    const available = new Set(listAvailableSkills());
    return skills.filter(s => !available.has(s));
}

// ── Scaffolding ───────────────────────────────────────────────────────────

function scaffoldPlugin(name, description, agents, skills, keywords, dryRun) {
    const pluginDir = path.join(PLUGINS_DIR, name);
    const githubPluginDir = path.join(pluginDir, ".github", "plugin");

    const displayName = name.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    const pluginDescription = description || `Composable agent collection for ${displayName.toLowerCase()}.`;

    const pluginJson = {
        name,
        description: pluginDescription,
        version: "1.0.0",
        author: { name: "Awesome Copilot Community" },
        repository: "https://github.com/Ditto190/mcapp-ai-starter.git#session-autosave-20260314T025102",
        license: "MIT",
        keywords: keywords.length > 0 ? keywords : name.split("-").slice(0, 3),
        ...(agents.length > 0 && { agents: agents.map(a => `./agents/${a}.md`) }),
        ...(skills.length > 0 && { skills: skills.map(s => `./skills/${s}/`) }),
    };

    const agentRows = agents.length > 0
        ? "| Agent | |\n|-------|---|\n" + agents.map(a => `| \`${a}\` | [source](../../agents/${a}.agent.md) |`).join("\n")
        : "_No agents included._";

    const skillRows = skills.length > 0
        ? "| Skill | |\n|-------|---|\n" + skills.map(s => `| \`${s}\` | [source](../../skills/${s}/SKILL.md) |`).join("\n")
        : "_No skills included._";

    const readmeContent = `# ${displayName} Plugin

${pluginDescription}

## Included Agents

${agentRows}

## Included Skills

${skillRows}

## Installation

\`\`\`bash
copilot plugin install ${name}@awesome-copilot
\`\`\`

## Source

This plugin is part of the local workspace mirror: [mcapp-ai-starter](https://github.com/Ditto190/mcapp-ai-starter/tree/session-autosave-20260314T025102).

## License

MIT
`;

    if (dryRun) {
        console.log("\n📋 DRY RUN — would create:");
        console.log(`  ${path.join(githubPluginDir, "plugin.json")}`);
        console.log(`  ${path.join(pluginDir, "README.md")}`);
        console.log("\n📄 plugin.json content:");
        console.log(JSON.stringify(pluginJson, null, 2));
        return;
    }

    if (fs.existsSync(pluginDir)) {
        console.warn(`⚠️  Plugin folder already exists: ${pluginDir}`);
        console.warn("   Updating plugin.json and README.md in-place.");
    }

    fs.mkdirSync(githubPluginDir, { recursive: true });
    fs.writeFileSync(path.join(githubPluginDir, "plugin.json"), JSON.stringify(pluginJson, null, 2) + "\n");
    fs.writeFileSync(path.join(pluginDir, "README.md"), readmeContent);

    console.log(`✅ Scaffolded: ${pluginDir}`);
}

// ── Eng pipeline helpers ──────────────────────────────────────────────────

function runEngScript(scriptName, dryRun, extraArgs = []) {
    const scriptPath = path.join(ENG_DIR, scriptName);
    if (!fs.existsSync(scriptPath)) {
        console.error(`❌ Eng script not found: ${scriptPath}`);
        process.exit(1);
    }
    const rel = path.relative(WORKSPACE_ROOT, scriptPath);
    if (dryRun) {
        console.log(`  [dry-run] would run: node ${rel} ${extraArgs.join(" ")}`);
        return;
    }
    console.log(`\n▶ node ${rel} ${extraArgs.join(" ")}`);
    const args = [scriptPath, ...extraArgs];
    execFileSync(process.execPath, args, { stdio: "inherit", cwd: AC_ROOT });
}

// ── Main ─────────────────────────────────────────────────────────────────

async function main() {
    const opts = parseArgs();

    // Verify the awesome-copilot tree is present
    if (!fs.existsSync(AC_ROOT)) {
        console.error(`❌ awesome-copilot not found at: ${AC_ROOT}`);
        console.error("   Ensure plugins/awesome-copilot/ exists in your workspace.");
        process.exit(1);
    }

    // List modes
    if (opts.listAgents) {
        const agents = listAvailableAgents();
        console.log(`\n📦 Available agents (${agents.length}):\n`);
        agents.forEach(a => console.log(`  ${a}`));
        process.exit(0);
    }

    if (opts.listSkills) {
        const skills = listAvailableSkills();
        console.log(`\n🎯 Available skills (${skills.length}):\n`);
        skills.forEach(s => console.log(`  ${s}`));
        process.exit(0);
    }

    // Validate name
    const nameError = validateName(opts.name);
    if (nameError) {
        console.error(`❌ ${nameError}`);
        console.error("\nUsage:");
        console.error("  node compose-collection.mjs --name <name> [--agents a,b] [--skills x,y] [--dry-run]");
        console.error("  node compose-collection.mjs --list-agents");
        console.error("  node compose-collection.mjs --list-skills");
        process.exit(1);
    }

    // Validate referenced content exists locally
    const missingAgents = validateAgents(opts.agents);
    if (missingAgents.length > 0) {
        console.error(`❌ Agents not found in plugins/awesome-copilot/agents/: ${missingAgents.join(", ")}`);
        console.error("   Run --list-agents to see what is available.");
        process.exit(1);
    }

    const missingSkills = validateSkills(opts.skills);
    if (missingSkills.length > 0) {
        console.error(`❌ Skills not found in plugins/awesome-copilot/skills/: ${missingSkills.join(", ")}`);
        console.error("   Run --list-skills to see what is available.");
        process.exit(1);
    }

    console.log(`\n🔌 Composing collection: ${opts.name}`);
    if (opts.agents.length) console.log(`   Agents:  ${opts.agents.join(", ")}`);
    if (opts.skills.length) console.log(`   Skills:  ${opts.skills.join(", ")}`);
    if (opts.dryRun) console.log("   Mode:    DRY RUN");

    // If user asked for machine-readable dry-run output, prepare JSON and exit
    if (opts.dryRun && opts.format === "json") {
        const pluginDir = path.join(PLUGINS_DIR, opts.name);
        const githubPluginDir = path.join(pluginDir, ".github", "plugin");
        const planned = {
            action: "compose",
            name: opts.name,
            steps: []
        };
        planned.steps.push({ name: "scaffold", files: [path.join(githubPluginDir, "plugin.json"), path.join(pluginDir, "README.md")] });
        if (!opts.noMaterialize) planned.steps.push({ name: "materialize", script: "materialize-plugins.mjs" });
        if (!opts.noValidate) planned.steps.push({ name: "validate", script: "validate-plugins.mjs" });
        if (!opts.noGenerate) planned.steps.push({ name: "generate", script: "generate-marketplace.mjs" });
        console.log(JSON.stringify(planned, null, 2));
        return;
    }

    // 1. Scaffold manifest + README
    scaffoldPlugin(opts.name, opts.description, opts.agents, opts.skills, opts.keywords, opts.dryRun);

    // 2. Materialize (copy resolved agent + skill files into plugin folder)
    if (!opts.noMaterialize) {
        const extra = [];
        if (opts.plugin) extra.push('--plugin', opts.plugin);
        if (opts.format) extra.push('--format', opts.format);
        runEngScript("materialize-plugins.mjs", opts.dryRun, extra);
    }

    // 3. Validate all plugin manifests
    if (!opts.noValidate) {
        const extra = [];
        if (opts.plugin) extra.push('--plugin', opts.plugin);
        runEngScript("validate-plugins.mjs", opts.dryRun, extra);
    }

    // 4. Regenerate marketplace index
    if (!opts.noGenerate) {
        const extra = [];
        if (opts.plugin) extra.push('--plugin', opts.plugin);
        runEngScript("generate-marketplace.mjs", opts.dryRun, extra);
    }

    if (!opts.dryRun) {
        console.log(`\n✅ Collection '${opts.name}' is ready at:`);
        console.log(`   ${path.relative(WORKSPACE_ROOT, path.join(PLUGINS_DIR, opts.name))}`);
        console.log("\n   Next: commit the plugin folder and submit a PR.");
    }
}

main().catch(err => {
    console.error(`❌ Unexpected error: ${err.message}`);
    process.exit(1);
});
