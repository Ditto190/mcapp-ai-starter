// scripts/health-check.js
//
// PURPOSE: Tell you immediately whether the project is healthy.
//
// NOVICE USAGE:  node scripts/health-check.js
// AGENT USAGE:   node scripts/health-check.js --json
// EXIT CODE:     0 = healthy, 1 = broken (at least one FAIL)
//
// ⚠️  If this script prints FAIL, the project is broken.
//     Do NOT commit or open a pull request until all checks show PASS.
//     Run the "AGENT FIX HINT" commands shown at the bottom to auto-fix
//     the most common problems.
//
// CHECKS:
//   1. TypeScript compiles without errors
//   2. ESLint passes
//   3. Prettier format check (warning only)
//   4. Test TypeScript compiles (compile-tests)
//   5. Unit tests pass
//   6. All AGENTS.md guidance files present

"use strict";
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const IS_JSON = process.argv.includes("--json");
const ROOT = path.resolve(__dirname, "..");
const results = [];
let overallPass = true;

function run(label, cmd, { optional = false, timeout = 120_000 } = {}) {
  try {
    execSync(cmd, { cwd: ROOT, stdio: "pipe", timeout });
    results.push({ label, status: "PASS" });
    if (!IS_JSON) console.log(`  ✅  PASS  ${label}`);
  } catch (err) {
    const status = optional ? "WARN" : "FAIL";
    const stderr = err.stderr?.toString().trim();
    const stdout = err.stdout?.toString().trim();
    const detail = (stderr || stdout || err.message).split("\n")[0];
    results.push({ label, status, detail });
    if (status === "FAIL") overallPass = false;
    if (!IS_JSON) {
      console.log(`  ${optional ? "⚠️ " : "❌"} ${status}  ${label}`);
      if (detail) console.log(`         ${detail}`);
    }
  }
}

if (!IS_JSON) {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Prompt Registry — Project Health Check");
  console.log(`  ${new Date().toISOString()}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

// 1. TypeScript (src) compiles without errors
run("TypeScript (src) compiles without errors", "npx tsc --noEmit");

// 2. ESLint passes on src
run("ESLint passes on src", "npm run lint");

// 3. Prettier check (warning only — novice may not have formatted yet)
run("Prettier format check", "npm run format:check", { optional: true });

// 4. Test TypeScript compiles (compile-tests)
run("Test TypeScript compiles (compile-tests)", "npm run compile-tests", {
  timeout: 60_000,
});

// 5. Unit tests pass
run("Unit tests pass", "npm run test:unit", { timeout: 180_000 });

// 6. AGENTS.md presence check
// Without these files, AI agents skip critical guidance and introduce regressions.
const agentsMdPaths = [
  "AGENTS.md",
  "test/AGENTS.md",
  "test/e2e/AGENTS.md",
  "src/adapters/AGENTS.md",
  "src/services/AGENTS.md",
  "docs/AGENTS.md",
];
const missing = agentsMdPaths.filter((p) => !fs.existsSync(path.join(ROOT, p)));
if (missing.length === 0) {
  results.push({
    label: "All AGENTS.md guidance files present",
    status: "PASS",
  });
  if (!IS_JSON) console.log("  ✅  PASS  All AGENTS.md guidance files present");
} else {
  results.push({
    label: "AGENTS.md guidance files present",
    status: "WARN",
    detail: `Missing: ${missing.join(", ")}`,
  });
  if (!IS_JSON) {
    console.log("  ⚠️  WARN  AGENTS.md guidance files missing");
    console.log(`         Missing: ${missing.join(", ")}`);
  }
}

// ── Summary ──────────────────────────────────────────────────────────────────

if (IS_JSON) {
  console.log(JSON.stringify({ pass: overallPass, checks: results }, null, 2));
} else {
  const failCount = results.filter((r) => r.status === "FAIL").length;
  const warnCount = results.filter((r) => r.status === "WARN").length;
  const passCount = results.filter((r) => r.status === "PASS").length;

  console.log("\n" + "─".repeat(56));
  console.log(`  PASS: ${passCount}  WARN: ${warnCount}  FAIL: ${failCount}`);
  console.log("─".repeat(56));

  if (overallPass) {
    console.log("\n  🟢  Project is HEALTHY — safe to commit and open a PR.\n");
  } else {
    console.log("\n  🔴  Project is BROKEN — fix the FAIL items above.\n");
    console.log("  💡  AGENT FIX HINTS:");
    console.log(
      "      TypeScript errors:  npx tsc --noEmit  (read each error)",
    );
    console.log("      ESLint errors:      npm run lint:fix");
    console.log("      Format errors:      npm run format");
    console.log(
      "      Test failures:      npm run test:unit  (read first failure)",
    );
    console.log(
      "      AGENTS.md missing:  copy the nearest existing AGENTS.md\n",
    );
  }
}

process.exit(overallPass ? 0 : 1);
