#!/usr/bin/env node
// scripts/ci/commit-with-mcp.js
// Usage: node scripts/ci/commit-with-mcp.js --message "My commit" --files "src/*" [--mcp]
const { execSync } = require("child_process");
const axios = require("axios");

function parseArgs() {
  const args = {};
  process.argv.slice(2).forEach((a, i, arr) => {
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = arr[i + 1];
      if (!next || next.startsWith("--")) args[key] = true;
      else args[key] = next;
    }
  });
  return args;
}

(async () => {
  const args = parseArgs();
  const message =
    args.message || `Automated commit at ${new Date().toISOString()}`;
  const files = args.files || ".";
  const useMcp = !!args.mcp;
  try {
    execSync(`git add ${files}`, { stdio: "inherit" });
    // Only commit if there are staged changes
    const status = execSync("git diff --cached --name-only").toString().trim();
    if (!status) {
      console.log("No staged changes to commit. Exiting.");
      process.exit(0);
    }
    execSync(`git commit -m "${message.replace(/"/g, '\\"')}"`, {
      stdio: "inherit",
    });
    console.log("Local git commit complete.");
    if (useMcp && process.env.MCP_GIT_API_URL && process.env.MCP_TOKEN) {
      console.log("Calling MCP git add/commit endpoint...");
      await axios.post(
        process.env.MCP_GIT_API_URL,
        {
          action: "add_or_commit",
          files: files,
          message,
        },
        { headers: { Authorization: `Bearer ${process.env.MCP_TOKEN}` } },
      );
      console.log("MCP git add/commit requested.");
    } else if (useMcp) {
      console.warn(
        "MCP call requested but MCP_GIT_API_URL or MCP_TOKEN not set.",
      );
    }
  } catch (err) {
    console.error("Error during commit wrapper:", err.message || err);
    process.exit(1);
  }
})();
