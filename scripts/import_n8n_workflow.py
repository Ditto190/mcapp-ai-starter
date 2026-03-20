#!/usr/bin/env python3
"""Import n8n workflow into the Codespace n8n instance using CodespaceN8nClient.

Usage:
  export CODESPACE_NAME="<your-codespace-name>"
  export N8N_API_KEY="<your_api_key>"
  python3 scripts/import_n8n_workflow.py \
      --file n8n/workflows/n8n-docs-agent-workflow.json
"""

import argparse
import json
import os
import sys

from codespace_agent import CodespaceN8nClient


def load_workflow(path: str) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def find_existing(client: CodespaceN8nClient, name: str):
    for wf in client.list_workflows(limit=500):
        if wf.get("name") == name:
            return wf
    return None


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--file", required=True)
    parser.add_argument("--codespace", default=os.getenv("CODESPACE_NAME"))
    parser.add_argument("--api-key", default=os.getenv("N8N_API_KEY"))
    args = parser.parse_args()

    if not args.codespace:
        print("ERROR: CODESPACE_NAME not provided", file=sys.stderr)
        return 2
    if not args.api_key:
        print("ERROR: N8N_API_KEY not provided", file=sys.stderr)
        return 2

    payload = load_workflow(args.file)
    name = payload.get("name") or payload.get("workflowName") or os.path.basename(args.file)

    client = CodespaceN8nClient(codespace_name=args.codespace, api_key=args.api_key)

    existing = find_existing(client, name)
    if existing:
        print(f"Updating existing workflow: {name} (id={existing.get('id')})")
        resp = client.update_workflow(existing.get("id"), nodes=payload.get("nodes", []), connections=payload.get("connections", {}), active=payload.get("active", False))
    else:
        print(f"Creating workflow: {name}")
        resp = client.create_workflow(name=name, nodes=payload.get("nodes", []), connections=payload.get("connections", {}), active=payload.get("active", False))

    print("Result:")
    print(json.dumps(resp, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
