#!/usr/bin/env python3
"""Find and execute an n8n workflow by name, then poll for execution status."""

import argparse
import json
import os
import sys
import time
from typing import Optional

from codespace_agent import CodespaceN8nClient


def find_workflow_id(client: CodespaceN8nClient, name: str) -> Optional[str]:
    for wf in client.list_workflows(limit=500):
        if wf.get("name") == name:
            return wf.get("id")
    return None


def extract_execution_id(resp: dict) -> Optional[str]:
    # Try common keys
    if not isinstance(resp, dict):
        return None
    for key in ("id", "executionId", "execution_id", "data"):
        if key in resp:
            if key == "data" and isinstance(resp["data"], dict) and "id" in resp["data"]:
                return resp["data"]["id"]
            if key != "data":
                return str(resp[key])
    return None


def poll_execution(client: CodespaceN8nClient, execution_id: str, timeout: int = 300, interval: int = 5):
    elapsed = 0
    while elapsed < timeout:
        try:
            status = client.get_execution(execution_id)
        except Exception as e:
            print(f"Error fetching execution {execution_id}: {e}", file=sys.stderr)
            time.sleep(interval)
            elapsed += interval
            continue

        print(json.dumps(status, indent=2))

        # Heuristic: look for known finished indicators
        text = json.dumps(status).lower()
        if any(s in text for s in ("finished", "success", "failed", "error", "stopped")):
            return status

        time.sleep(interval)
        elapsed += interval

    print(f"Timed out polling execution {execution_id}", file=sys.stderr)
    return None


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--name", default=os.getenv("WORKFLOW_NAME", "n8n-docs-agent-creator"))
    parser.add_argument("--codespace", default=os.getenv("CODESPACE_NAME"))
    parser.add_argument("--api-key", default=os.getenv("N8N_API_KEY"))
    parser.add_argument("--timeout", type=int, default=300)
    args = parser.parse_args()

    if not args.codespace or not args.api_key:
        print("ERROR: CODESPACE_NAME and N8N_API_KEY must be set (or passed via flags)", file=sys.stderr)
        return 2

    client = CodespaceN8nClient(codespace_name=args.codespace, api_key=args.api_key)

    wf_id = find_workflow_id(client, args.name)
    if not wf_id:
        print(f"Workflow named '{args.name}' not found. List workflows to verify.")
        return 1

    print(f"Executing workflow '{args.name}' (id={wf_id})")
    resp = client.execute_workflow(wf_id, params={})
    print("Execution response:")
    print(json.dumps(resp, indent=2))

    execution_id = extract_execution_id(resp)
    if not execution_id:
        print("Could not determine execution id from response; exiting.")
        return 1

    print(f"Polling execution id: {execution_id}")
    result = poll_execution(client, execution_id, timeout=args.timeout)
    if result is None:
        print("Execution polling timed out or failed", file=sys.stderr)
        return 1

    print("Final execution status:")
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
