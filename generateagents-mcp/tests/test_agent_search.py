import json
from generateagents_mcp.agent_search import rank_agents
from pathlib import Path


def test_rank_agents_smoke():
    spec = Path('generateagents-mcp/agentspec/generated/awesome-copilot.agentspec.json')
    results = rank_agents(spec, 'ci workflow install copilot', top_n=3)
    assert isinstance(results, list)
    # Expect at least one result for this large agentspec
    assert len(results) >= 1
    for r in results:
        assert 'key' in r and 'score' in r and 'meta' in r
