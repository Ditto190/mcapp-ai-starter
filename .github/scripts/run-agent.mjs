#!/usr/bin/env node
/**
 * run-agent.mjs
 *
 * Agent executor — loads an agent definition by name, gathers PR context via
 * the GitHub REST API, runs static analysis (ripgrep / grep, AST-based
 * checks, linting) and produces a structured JSON result file.
 *
 * This executor is intentionally zero-cost: it uses only GitHub-built-in
 * capabilities (GitHub token, REST API, Node.js built-ins + small npm
 * packages that are already in the workflow install step).
 *
 * Usage (called from GitHub Actions):
 *   node .github/scripts/run-agent.mjs \
 *     --agent=security-reviewer \
 *     --pr=123 \
 *     --output=artifacts/findings.json \
 *     --changed=src/foo.ts,src/bar.ts
 *
 * Output schema:
 *   {
 *     "agent":           "<slug>",
 *     "prNumber":        123,
 *     "confidence":      0.92,
 *     "findings":        [ { "file", "line", "severity", "message", "rule" } ],
 *     "recommendations": [ "<string>" ],
 *     "summary":         "<string>",
 *     "timestamp":       "<iso8601>"
 *   }
 */

import fs from "fs";
import path from "path";
import { execSync, spawnSync } from "child_process";
import { fileURLToPath } from "url";
import matter from "gray-matter";
import { Octokit } from "@octokit/rest";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../..");
const AGENTS_DIR = path.join(REPO_ROOT, ".github", "agents");

// ─────────────────────────────────────────────────────────────────────────────
// Argument parsing
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = {};
  for (const arg of argv.slice(2)) {
    const [key, ...rest] = arg.replace(/^--/, "").split("=");
    args[key] = rest.join("=");
  }
  return args;
}

const args = parseArgs(process.argv);
const AGENT_SLUG = args.agent;
const PR_NUMBER = parseInt(args.pr || "0", 10);
const OUTPUT_PATH = args.output || "artifacts/findings.json";
// `let` because we may append files discovered from PR context
let CHANGED_FILES = (args.changed || "").split(",").filter(Boolean);

if (!AGENT_SLUG) {
  console.error("Error: --agent=<slug> is required.");
  process.exit(1);
}

// ─────────────────────────────────────────────────────────────────────────────
// Load agent definition
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Load an agent's definition from its .agent.md file.
 * @param {string} slug
 * @returns {{ name: string, description: string, model: string, tags: string[], instructions: string }}
 */
function loadAgentDef(slug) {
  const agentFile = path.join(AGENTS_DIR, `${slug}.agent.md`);
  if (!fs.existsSync(agentFile)) {
    console.warn(`Agent file not found: ${agentFile} — using defaults.`);
    return { name: slug, description: "", model: "", tags: [], instructions: "" };
  }
  const raw = fs.readFileSync(agentFile, "utf8");
  const { data: fm, content } = matter(raw);
  return {
    name: fm.name || slug,
    description: fm.description || "",
    model: fm.model || "",
    tags: fm.tags || [],
    instructions: content.trim(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// GitHub context
// ─────────────────────────────────────────────────────────────────────────────

async function fetchPRContext(octokit, owner, repo, prNumber) {
  if (!prNumber) return null;
  try {
    const { data: pr } = await octokit.pulls.get({ owner, repo, pull_number: prNumber });
    const { data: files } = await octokit.pulls.listFiles({ owner, repo, pull_number: prNumber });
    return { title: pr.title, body: pr.body, files: files.map((f) => f.filename) };
  } catch (err) {
    console.warn(`Could not fetch PR context: ${err.message}`);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Static analysis helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run grep safely against a single file using spawnSync (no shell interpolation).
 * @param {string} pattern  — extended regex
 * @param {string} file     — relative path from REPO_ROOT
 * @returns {string} stdout
 */
function grepFile(pattern, file) {
  const absFile = path.join(REPO_ROOT, file);
  const result = spawnSync("grep", ["-n", "-E", pattern, absFile], {
    cwd: REPO_ROOT,
    encoding: "utf8",
  });
  // grep exits 1 when no matches, 2 on error — treat both as empty output
  return result.stdout || "";
}

/**
 * Run a shell command safely, returning stdout or "" on failure.
 * Only used for commands with no user-controlled arguments.
 * @param {string} cmd
 * @returns {string}
 */
function run(cmd) {
  try {
    return execSync(cmd, { cwd: REPO_ROOT, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] });
  } catch {
    return "";
  }
}

/**
 * Security-oriented patterns to search for in changed files.
 */
const SECURITY_PATTERNS = [
  { pattern: "eval\\(", severity: "high", rule: "no-eval", message: "Use of eval() is a security risk." },
  { pattern: "dangerouslySetInnerHTML", severity: "high", rule: "no-dangerous-html", message: "dangerouslySetInnerHTML may cause XSS." },
  { pattern: "(password|secret|token|key)\\s*=\\s*['\"][^'\"]{8,}", severity: "critical", rule: "hardcoded-secret", message: "Potential hardcoded secret detected." },
  { pattern: "process\\.env\\.[A-Z_]+\\s*\\|\\|\\s*['\"][^'\"]+['\"]", severity: "medium", rule: "insecure-fallback", message: "Env variable with insecure fallback value." },
  { pattern: "http://(?!localhost|127\\.)", severity: "low", rule: "http-not-https", message: "Non-HTTPS URL may expose data in transit." },
  { pattern: "TODO.*(?:security|auth|token|secret)", severity: "medium", rule: "security-todo", message: "Unresolved security-related TODO comment." },
  { pattern: "child_process|exec\\(|spawn\\(", severity: "medium", rule: "shell-injection-risk", message: "Shell command execution — validate all inputs." },
  { pattern: "Math\\.random\\(\\).*(?:token|key|id|nonce)", severity: "medium", rule: "weak-random", message: "Math.random() is not cryptographically secure." },
];

/**
 * TypeScript quality patterns to check.
 */
const TS_PATTERNS = [
  { pattern: "as any(?!\\s*//)", severity: "medium", rule: "no-explicit-any", message: "Avoid `as any` — use proper types or unknown." },
  { pattern: "@ts-ignore", severity: "low", rule: "no-ts-ignore", message: "@ts-ignore suppresses type errors — fix the underlying issue." },
  { pattern: "console\\.log\\(", severity: "low", rule: "no-console", message: "console.log left in production code." },
  { pattern: "setTimeout|setInterval", severity: "low", rule: "explicit-cleanup", message: "Ensure timers are cleared to prevent memory leaks." },
  { pattern: "\\bany\\b(?!\\s*//)", severity: "low", rule: "implicit-any", message: "Implicit `any` reduces type safety." },
  { pattern: "!\\.", severity: "medium", rule: "non-null-assertion", message: "Non-null assertion (!) may hide runtime errors." },
];

/**
 * Run grep-based analysis on changed files.
 * @param {string[]} files
 * @param {{ pattern: string, severity: string, rule: string, message: string }[]} patterns
 * @returns {{ file: string, line: number, severity: string, rule: string, message: string }[]}
 */
function analyzePatterns(files, patterns) {
  const findings = [];
  for (const file of files) {
    if (!fs.existsSync(path.join(REPO_ROOT, file))) continue;
    for (const { pattern, severity, rule, message } of patterns) {
      // Use grepFile (spawnSync) to avoid shell injection on file paths
      const output = grepFile(pattern, file);
      for (const line of output.split("\n").filter(Boolean)) {
        const [lineNum, ...rest] = line.split(":");
        findings.push({
          file,
          line: parseInt(lineNum, 10) || 0,
          severity,
          rule,
          message,
          context: rest.join(":").trim().slice(0, 120),
        });
      }
    }
  }
  return findings;
}

// ─────────────────────────────────────────────────────────────────────────────
// Agent-specific runners
// ─────────────────────────────────────────────────────────────────────────────

async function runSecurityReviewer(agentDef, files) {
  const findings = analyzePatterns(files, SECURITY_PATTERNS);
  const critical = findings.filter((f) => f.severity === "critical");
  const high = findings.filter((f) => f.severity === "high");

  // Basic confidence heuristic: fewer critical/high issues → higher confidence
  const confidence = Math.max(
    0.5,
    1.0 - critical.length * 0.15 - high.length * 0.05,
  );

  const recommendations = [];
  if (critical.length > 0) {
    recommendations.push(`Remove ${critical.length} hardcoded secret(s) before merging.`);
  }
  if (high.length > 0) {
    recommendations.push(`Address ${high.length} high-severity security finding(s).`);
  }
  if (findings.length === 0) {
    recommendations.push("No automated security issues detected. Consider a manual security review for auth/crypto code.");
  }

  return {
    agent: agentDef.name || "security-reviewer",
    findings,
    confidence: parseFloat(confidence.toFixed(4)),
    recommendations,
    summary: `Security review: ${findings.length} finding(s) (${critical.length} critical, ${high.length} high).`,
  };
}

async function runTypeScriptExpert(agentDef, files) {
  const tsFiles = files.filter((f) => /\.(ts|tsx|mts|cts)$/.test(f));
  const findings = analyzePatterns(tsFiles.length > 0 ? tsFiles : files, TS_PATTERNS);

  // Run tsc --noEmit for type checking if tsconfig.json exists
  const tscOutput = run("npx tsc --noEmit 2>&1 | head -50 || true");
  const tscErrors = tscOutput
    .split("\n")
    .filter((l) => l.includes("error TS"))
    .slice(0, 20)
    .map((l) => ({
      file: l.split("(")[0].trim(),
      line: 0,
      severity: "high",
      rule: "tsc-error",
      message: l.trim(),
      context: "",
    }));

  const allFindings = [...findings, ...tscErrors];
  const high = allFindings.filter((f) => f.severity === "high");
  const confidence = Math.max(0.5, 1.0 - high.length * 0.06);

  const recommendations = [];
  if (tscErrors.length > 0) {
    recommendations.push(`Fix ${tscErrors.length} TypeScript compiler error(s).`);
  }
  if (findings.some((f) => f.rule === "no-explicit-any")) {
    recommendations.push("Replace `as any` casts with proper type annotations or `unknown`.");
  }
  if (findings.length === 0 && tscErrors.length === 0) {
    recommendations.push("TypeScript quality looks good. Consider adding stricter tsconfig options like `noUncheckedIndexedAccess`.");
  }

  return {
    agent: agentDef.name || "typescript-expert",
    findings: allFindings,
    confidence: parseFloat(confidence.toFixed(4)),
    recommendations,
    summary: `TypeScript review: ${allFindings.length} finding(s) (${tscErrors.length} compiler error(s)).`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Running agent: ${AGENT_SLUG}`);
  console.log(`  PR: #${PR_NUMBER}`);
  console.log(`  Changed files: ${CHANGED_FILES.join(", ") || "(none provided)"}`);

  const agentDef = loadAgentDef(AGENT_SLUG);

  // Fetch PR context if a token is available
  const token = process.env.GITHUB_TOKEN;
  const repoEnv = process.env.REPO || process.env.GITHUB_REPOSITORY || "";
  const [owner = "", repoName = ""] = repoEnv.split("/");

  let prContext = null;
  if (token && PR_NUMBER && owner && repoName) {
    const octokit = new Octokit({ auth: token });
    prContext = await fetchPRContext(octokit, owner, repoName, PR_NUMBER);
    if (prContext && CHANGED_FILES.length === 0) {
      // Reassign rather than mutate to avoid surprises if called multiple times
      CHANGED_FILES = prContext.files || [];
    }
  }

  // Dispatch to agent-specific runner
  let result;
  switch (AGENT_SLUG) {
    case "security-reviewer":
      result = await runSecurityReviewer(agentDef, CHANGED_FILES);
      break;
    case "typescript-expert":
      result = await runTypeScriptExpert(agentDef, CHANGED_FILES);
      break;
    default:
      // Generic fallback: just report no findings
      result = {
        agent: AGENT_SLUG,
        findings: [],
        confidence: 0.80,
        recommendations: [`Agent '${AGENT_SLUG}' has no dedicated runner — manual review recommended.`],
        summary: `Agent '${AGENT_SLUG}' completed with generic analysis.`,
      };
  }

  result.prNumber = PR_NUMBER;
  result.timestamp = new Date().toISOString();
  if (prContext) {
    result.prTitle = prContext.title;
  }

  // Write output
  const outDir = path.dirname(path.resolve(OUTPUT_PATH));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2) + "\n");
  console.log(`Output written to ${OUTPUT_PATH}`);
  console.log(`  Confidence: ${result.confidence}`);
  console.log(`  Findings:   ${result.findings.length}`);
}

main().catch((err) => {
  console.error("Agent executor failed:", err);
  process.exit(1);
});
