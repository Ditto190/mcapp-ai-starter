#!/usr/bin/env node
/**
 * discover-agents.mjs
 *
 * Auto-discovers agent definitions, tool definitions, instruction files,
 * skills, and plugins across the entire repository.  The results are written
 * to `.github/agents/_discovered.json` so that build-catalog.mjs can merge
 * them into the main catalog.
 *
 * Patterns searched:
 *   - Agents:       *.agent.md (any depth), agents/ directory
 *   - Tools:        mcp*.json, tool-*.json
 *   - Instructions: *.instructions.md (any depth)
 *   - Skills:       SKILL.md files (any depth)
 *   - Plugins:      plugin.json files (any depth)
 *
 * Usage:
 *   node .github/scripts/discover-agents.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../..");
const AGENTS_DIR = path.join(REPO_ROOT, ".github", "agents");
const OUTPUT_PATH = path.join(AGENTS_DIR, "_discovered.json");

// Directories to skip entirely (build artifacts, deps, hidden git internals)
const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  "coverage",
  "__pycache__",
  ".cache",
  ".turbo",
]);

// ─────────────────────────────────────────────────────────────────────────────
// Recursive file walker
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Walk `dir` recursively and yield all file paths.
 * @param {string} dir
 * @returns {Generator<string>}
 */
function* walk(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (entry.isFile()) {
      yield full;
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Parsers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Safely parse JSON, returning null on failure.
 * @param {string} text
 * @returns {object|null}
 */
function tryParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/**
 * Extract a short description from a markdown file's body (first non-empty
 * non-heading line that appears after any YAML frontmatter block).
 * @param {string} content
 * @returns {string}
 */
function extractMarkdownDescription(content) {
  const lines = content.split("\n");
  let inFrontmatter = false;
  let frontmatterClosed = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Detect opening/closing frontmatter delimiter
    if (trimmed === "---") {
      if (!inFrontmatter && !frontmatterClosed) {
        inFrontmatter = true;
        continue;
      }
      if (inFrontmatter) {
        inFrontmatter = false;
        frontmatterClosed = true;
        continue;
      }
    }

    if (inFrontmatter) continue;

    if (trimmed && !trimmed.startsWith("#")) {
      return trimmed.slice(0, 120);
    }
  }
  return "";
}

// ─────────────────────────────────────────────────────────────────────────────
// Discovery functions
// ─────────────────────────────────────────────────────────────────────────────

/** Discover *.agent.md files outside the .github/agents directory. */
function discoverAgents(allFiles) {
  return allFiles
    .filter((f) => f.endsWith(".agent.md"))
    .map((filepath) => {
      const raw = fs.readFileSync(filepath, "utf8");
      const { data: fm } = matter(raw);
      const slug = path.basename(filepath, ".agent.md");
      return {
        name: fm.name || slug,
        slug,
        description: fm.description || extractMarkdownDescription(raw),
        model: fm.model || "",
        tools: fm.tools || [],
        tags: fm.tags || [],
        source: path.relative(REPO_ROOT, filepath),
        discoveredBy: "discover-agents",
      };
    });
}

/** Discover *.instructions.md files. */
function discoverInstructions(allFiles) {
  return allFiles
    .filter((f) => f.endsWith(".instructions.md"))
    .map((filepath) => {
      const raw = fs.readFileSync(filepath, "utf8");
      const { data: fm } = matter(raw);
      const slug = path.basename(filepath, ".instructions.md");
      return {
        name: fm.name || slug,
        slug,
        description: fm.description || extractMarkdownDescription(raw),
        applyTo: fm.applyTo || "",
        source: path.relative(REPO_ROOT, filepath),
        discoveredBy: "discover-agents",
      };
    });
}

/** Discover SKILL.md files. */
function discoverSkills(allFiles) {
  return allFiles
    .filter((f) => path.basename(f) === "SKILL.md")
    .map((filepath) => {
      const raw = fs.readFileSync(filepath, "utf8");
      const { data: fm } = matter(raw);
      const skillDir = path.basename(path.dirname(filepath));
      return {
        name: fm.name || skillDir,
        slug: skillDir,
        description: fm.description || extractMarkdownDescription(raw),
        source: path.relative(REPO_ROOT, filepath),
        discoveredBy: "discover-agents",
      };
    });
}

/** Discover plugin.json files. */
function discoverPlugins(allFiles) {
  return allFiles
    .filter((f) => path.basename(f) === "plugin.json")
    .flatMap((filepath) => {
      const raw = fs.readFileSync(filepath, "utf8");
      const data = tryParseJson(raw);
      if (!data) return [];
      return [
        {
          name: data.name || path.basename(path.dirname(filepath)),
          description: data.description || "",
          version: data.version || "",
          source: path.relative(REPO_ROOT, filepath),
          discoveredBy: "discover-agents",
        },
      ];
    });
}

/**
 * Discover MCP / tool configuration files.
 * Looks for JSON/YAML files whose name or content suggests MCP/tool definitions.
 */
function discoverTools(allFiles) {
  const toolFiles = allFiles.filter((f) => {
    const base = path.basename(f).toLowerCase();
    return (
      (base.includes("mcp") ||
        base.includes("tool") ||
        base.startsWith("tools")) &&
      (f.endsWith(".json") || f.endsWith(".yaml") || f.endsWith(".yml"))
    );
  });

  const tools = [];
  for (const filepath of toolFiles) {
    const raw = fs.readFileSync(filepath, "utf8");
    const data = tryParseJson(raw);
    if (!data) continue;

    // MCP server manifest pattern: { "mcpServers": {...} }
    if (data.mcpServers && typeof data.mcpServers === "object") {
      for (const [serverName, serverConfig] of Object.entries(data.mcpServers)) {
        tools.push({
          name: serverName,
          type: "mcp-server",
          command: serverConfig.command || "",
          description: serverConfig.description || `MCP server: ${serverName}`,
          source: path.relative(REPO_ROOT, filepath),
          discoveredBy: "discover-agents",
        });
      }
      continue;
    }

    // Generic tool schema pattern: { "tools": [...] } or { "name": "...", "description": "..." }
    if (Array.isArray(data.tools)) {
      for (const tool of data.tools) {
        if (tool.name) {
          tools.push({
            name: tool.name,
            type: "tool-schema",
            description: tool.description || "",
            source: path.relative(REPO_ROOT, filepath),
            discoveredBy: "discover-agents",
          });
        }
      }
      continue;
    }

    if (data.name && data.description) {
      tools.push({
        name: data.name,
        type: "tool-config",
        description: data.description,
        source: path.relative(REPO_ROOT, filepath),
        discoveredBy: "discover-agents",
      });
    }
  }
  return tools;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  console.log("Scanning repository for agent-like resources…");
  console.log(`  Root: ${REPO_ROOT}`);

  // Collect all files once, then pass to each discoverer
  const allFiles = [...walk(REPO_ROOT)];
  console.log(`  Total files scanned: ${allFiles.length}`);

  const agents = discoverAgents(allFiles);
  const instructions = discoverInstructions(allFiles);
  const skills = discoverSkills(allFiles);
  const plugins = discoverPlugins(allFiles);
  const tools = discoverTools(allFiles);

  console.log(
    `  Found: agents=${agents.length}, instructions=${instructions.length}, ` +
      `skills=${skills.length}, plugins=${plugins.length}, tools=${tools.length}`,
  );

  const discovered = {
    discoveredAt: new Date().toISOString(),
    agents,
    tools,
    instructions,
    skills,
    plugins,
  };

  fs.mkdirSync(AGENTS_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(discovered, null, 2) + "\n");
  console.log(`Discovery results written to ${path.relative(REPO_ROOT, OUTPUT_PATH)}`);
}

main();
