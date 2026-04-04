#!/usr/bin/env node
/**
 * build-catalog.mjs
 *
 * Scans `.github/agents/*.agent.md` files, parses their YAML frontmatter,
 * and writes (or updates) `.github/agents/catalog.json`.
 *
 * Usage:
 *   node .github/scripts/build-catalog.mjs
 *
 * The script also reads the output of discover-agents.mjs (if it ran first)
 * and merges any discovered items that are not already present.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../..");
const AGENTS_DIR = path.join(REPO_ROOT, ".github", "agents");
const CATALOG_PATH = path.join(AGENTS_DIR, "catalog.json");
const DISCOVERED_PATH = path.join(AGENTS_DIR, "_discovered.json");

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Load existing catalog from disk, or return a fresh skeleton.
 * @returns {object} catalog
 */
function loadCatalog() {
  if (fs.existsSync(CATALOG_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
    } catch {
      console.warn("Existing catalog is corrupt — starting fresh.");
    }
  }
  return {
    version: "1.0.0",
    lastUpdated: new Date().toISOString(),
    agents: [],
    tools: [],
    instructions: [],
    skills: [],
    plugins: [],
  };
}

/**
 * Merge a source array into a target array, keying on `name`.
 * Items from `source` that are not already in `target` are appended.
 * @param {object[]} target
 * @param {object[]} source
 * @returns {object[]} merged array
 */
function mergeByName(target, source) {
  const names = new Set(target.map((item) => item.name));
  for (const item of source) {
    if (!names.has(item.name)) {
      target.push(item);
      names.add(item.name);
    }
  }
  return target;
}

// ─────────────────────────────────────────────────────────────────────────────
// Build agents list from .agent.md files
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Scan AGENTS_DIR for `*.agent.md` files and parse their frontmatter.
 * @returns {object[]} agent metadata objects
 */
function scanAgentFiles() {
  if (!fs.existsSync(AGENTS_DIR)) return [];

  return fs
    .readdirSync(AGENTS_DIR)
    .filter((f) => f.endsWith(".agent.md"))
    .map((filename) => {
      const filepath = path.join(AGENTS_DIR, filename);
      const raw = fs.readFileSync(filepath, "utf8");
      const { data: frontmatter } = matter(raw);
      const slug = filename.replace(/\.agent\.md$/, "");

      return {
        name: frontmatter.name || slug,
        slug,
        description: frontmatter.description || "",
        model: frontmatter.model || "",
        tools: frontmatter.tools || [],
        tags: frontmatter.tags || [],
        source: path.relative(REPO_ROOT, filepath),
        addedAt: frontmatter.addedAt || new Date().toISOString(),
      };
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const catalog = loadCatalog();

  // 1. Add/update agents from .agent.md files
  const scannedAgents = scanAgentFiles();
  catalog.agents = mergeByName(catalog.agents, scannedAgents);
  console.log(`Scanned ${scannedAgents.length} agent file(s).`);

  // 2. Merge items from discovery script (if available)
  if (fs.existsSync(DISCOVERED_PATH)) {
    const discovered = JSON.parse(fs.readFileSync(DISCOVERED_PATH, "utf8"));
    const keys = ["agents", "tools", "instructions", "skills", "plugins"];
    for (const key of keys) {
      if (Array.isArray(discovered[key]) && discovered[key].length > 0) {
        catalog[key] = mergeByName(catalog[key] || [], discovered[key]);
        console.log(
          `Merged ${discovered[key].length} discovered ${key} item(s).`,
        );
      }
    }
  } else {
    console.log(
      "No _discovered.json found — skipping discovery merge (run discover-agents.mjs first).",
    );
  }

  // 3. Update timestamp and write
  catalog.lastUpdated = new Date().toISOString();

  fs.mkdirSync(AGENTS_DIR, { recursive: true });
  fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2) + "\n");
  console.log(`Catalog written to ${path.relative(REPO_ROOT, CATALOG_PATH)}`);
  console.log(
    `  agents: ${catalog.agents.length}, tools: ${catalog.tools.length}, ` +
      `instructions: ${catalog.instructions.length}, skills: ${catalog.skills.length}, ` +
      `plugins: ${catalog.plugins.length}`,
  );
}

main();
