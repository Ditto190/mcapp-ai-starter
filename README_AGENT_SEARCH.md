Agent Search Utility

This repository includes a lightweight agent search utility that indexes the awesome-copilot agentspec and returns ranked agent/skill candidates for a natural language query.

Quick start

1. Package plugins (optional):
   bash scripts/install-plugins.sh

2. Run agent search:
   python generateagents-mcp/agent_search.py --spec generateagents-mcp/agentspec/generated/awesome-copilot.agentspec.json --query "ci workflow" --top 5

3. GitHub Actions: A workflow (.github/workflows/ci-agent-search.yml) runs the agent search on PRs and posts the top candidates as a PR comment.

Notes

- The search utility is intentionally dependency-free for portability on CI runners.
- For more advanced ranking, replace the simple scoring with an embedding-based retrieval and a small reranker.
