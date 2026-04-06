#!/usr/bin/env node
// scripts/ci/update-context.js
// Usage: node scripts/ci/update-context.js --message "session start" --metadata '{"branch":"feature"}'
const axios = require("axios");
const { execSync } = require("child_process");

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
  const message = args.message || `Session update: ${new Date().toISOString()}`;
  const dryRun = !!args.dryrun || !!args["dry-run"];
  let metadata = {};
  try {
    metadata = args.metadata ? JSON.parse(args.metadata) : {};
  } catch {
    metadata = {};
  }
  const contextUrl = process.env.CONTEXT7_API_URL;
  const token = process.env.CONTEXT7_TOKEN;
  const project = process.env.CONTEXT7_PROJECT || "default";

  if (!contextUrl || !token) {
    if (!dryRun) {
      console.error("CONTEXT7_API_URL and CONTEXT7_TOKEN must be set.");
      process.exit(1);
    }
    console.warn("Running in dry-run mode without CONTEXT7 credentials.");
  }

  try {
    const payload = {
      project,
      title: message,
      content: {
        message,
        metadata,
        branch:
          (process.env.GITHUB_REF || "").replace("refs/heads/", "") ||
          execSync("git rev-parse --abbrev-ref HEAD").toString().trim(),
      },
    };
    if (dryRun) {
      console.log("Dry-run payload:", JSON.stringify(payload, null, 2));
    } else {
      const res = await axios.post(`${contextUrl}/contextstream`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(
        "Context update response:",
        res.status,
        res.data && res.data.id ? res.data.id : "no-id",
      );
    }
  } catch (err) {
    console.error(
      "Failed to update Context7:",
      err.response ? err.response.data : err.message || err,
    );
    process.exit(1);
  }
})();
