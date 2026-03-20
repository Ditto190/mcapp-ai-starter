"""Agent search utility for awesome-copilot AgentSpec.

Provides a small CLI that loads the generated agentspec JSON, indexes agent names and descriptions,
and returns top-N matches for a natural language query. Designed to be dependency-free (stdlib only)
so it can run on GitHub Actions runners without extra installs.

Usage:
  python agent_search.py --spec path/to/agentespec.json --query "refactor tests" --top 5

Outputs JSON to stdout with ranked candidates.
"""

from __future__ import annotations

import argparse
import json
import math
import re
import sys
from collections import Counter
from pathlib import Path
from typing import Any, Dict, List, Tuple


def normalize_text(s: str) -> str:
    return re.sub(r"\s+", " ", s.strip().lower())


def simple_score(query_tokens: List[str], text: str) -> float:
    # Token overlap + term frequency scoring (very lightweight)
    t = normalize_text(text)
    tokens = t.split()
    tf = Counter(tokens)
    score = 0.0
    for q in query_tokens:
        score += tf.get(q, 0)
    # length normalization
    if len(tokens) > 0:
        score = score / math.log(len(tokens) + 1)
    return score


def rank_agents(spec_path: Path, query: str, top_n: int = 5) -> List[Dict[str, Any]]:
    with spec_path.open("r", encoding="utf-8") as f:
        spec = json.load(f)

    agents = spec.get("agents", {})
    q = normalize_text(query)
    q_tokens = [t for t in q.split() if len(t) > 1]

    candidates: List[Tuple[str, float, Dict[str, Any]]] = []

    for key, agent in agents.items():
        name = agent.get("name") or key
        desc = agent.get("description") or ""
        source = agent.get("source_file") or ""
        fields = f"{name} {desc} {source}"
        s = simple_score(q_tokens, fields)
        # small boost for exact token in name
        for t in q_tokens:
            if t in normalize_text(name):
                s += 0.5
        candidates.append((key, s, {"key": key, "name": name, "description": desc, "source_file": source}))

    # filter zeros and sort
    filtered = [c for c in candidates if c[1] > 0]
    filtered.sort(key=lambda x: x[1], reverse=True)

    # normalize scores to 0..1
    if filtered:
        max_score = filtered[0][1]
    else:
        max_score = 1.0

    results: List[Dict[str, Any]] = []
    for key, score, meta in filtered[:top_n]:
        results.append({"key": key, "score": round(float(score / max_score), 4), "meta": meta})

    return results


def main(argv: List[str] | None = None) -> int:
    parser = argparse.ArgumentParser("Agent search against awesome-copilot AgentSpec")
    parser.add_argument("--spec", required=True, help="Path to agentspec JSON")
    parser.add_argument("--query", required=True, help="Natural language query")
    parser.add_argument("--top", type=int, default=5, help="Top N results to return")
    parser.add_argument("--json", action="store_true", help="Output machine-friendly JSON only")
    args = parser.parse_args(argv)

    spec_path = Path(args.spec)
    if not spec_path.exists():
        print(json.dumps({"success": False, "error": f"Spec file not found: {spec_path}"}))
        return 2

    results = rank_agents(spec_path, args.query, top_n=args.top)
    out = {"success": True, "query": args.query, "results": results}
    if args.json:
        print(json.dumps(out, ensure_ascii=False))
    else:
        print("Agent search results for query:\n")
        for r in results:
            print(f"- {r['meta']['name']} ({r['key']}) score={r['score']}")
            print(f"  {r['meta']['description'][:200].strip()}\n  source: {r['meta']['source_file']}\n")
        print(json.dumps(out, ensure_ascii=False))

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
