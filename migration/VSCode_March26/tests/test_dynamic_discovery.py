"""
Test script for Dynamic Agent Discovery system

Demonstrates template-based agent discovery WITHOUT LLM generation.
Verifies that the collection_builder.py module works correctly.
"""

import sys
from pathlib import Path

# Add Knowledge/tools to path
sys.path.insert(0, str(Path(__file__).parent.parent / "Knowledge" / "tools"))

from collection_builder import (
    match_intent_to_collection,
    build_agent_instructions_from_schema,
    load_tool_schema,
    create_collection_from_tools,
)


def test_pattern_matching():
    """Test that keyword/regex pattern matching works."""

    print("=" * 60)
    print("TEST 1: Pattern Matching")
    print("=" * 60)

    # Mock collections (simulating awesome-copilot registry)
    mock_collections = [
        {
            "id": "web-dev",
            "name": "Web Development",
            "description": "Frontend and backend web development tools",
            "tags": ["web", "frontend", "backend", "react", "api"],
        },
        {
            "id": "data-science",
            "name": "Data Science",
            "description": "Data analysis and machine learning tools",
            "tags": ["data", "analytics", "ml", "python", "pandas"],
        },
        {
            "id": "devops",
            "name": "DevOps",
            "description": "CI/CD and infrastructure automation",
            "tags": ["devops", "docker", "kubernetes", "ci-cd", "terraform"],
        },
    ]

    # Test cases
    test_cases = [
        ("I need help with web scraping", ["web-dev"]),
        ("Set up CI/CD pipeline", ["devops"]),
        ("Analyze sales data", ["data-science"]),
        ("Build a React app", ["web-dev"]),
        ("Deploy to Kubernetes", ["devops"]),
    ]

    for query, expected_collections in test_cases:
        print(f'\nQuery: "{query}"')
        matches = match_intent_to_collection(query, mock_collections)

        if matches:
            print(f"  ✓ Found {len(matches)} matches:")
            for match in matches:
                print(f"    - {match['name']} ({match['id']})")

            # Check if expected collection is in results
            matched_ids = [m["id"] for m in matches]
            if expected_collections[0] in matched_ids:
                print(f"  ✓ Correctly matched to {expected_collections[0]}")
            else:
                print(f"  ✗ Expected {expected_collections[0]}, got {matched_ids}")
        else:
            print("  ✗ No matches found")

    print("\n" + "=" * 60)
    print("Pattern matching test complete!")
    print("=" * 60 + "\n")


def test_schema_parsing():
    """Test that tool schemas can be parsed into agent instructions."""

    print("=" * 60)
    print("TEST 2: Schema Parsing")
    print("=" * 60)

    # Path to tool schemas
    tools_dir = Path(__file__).parent.parent / "mcp-tools"

    if not tools_dir.exists():
        print(f"✗ Tools directory not found: {tools_dir}")
        return

    tool_files = list(tools_dir.glob("*.tool.json"))

    print(f"\nFound {len(tool_files)} tool schemas")

    for tool_file in tool_files:
        tool_name = tool_file.stem.replace(".tool", "")
        print(f"\n  Processing: {tool_name}")

        try:
            # Load schema
            schema = load_tool_schema(tool_file)

            # Generate instructions
            instructions = build_agent_instructions_from_schema(schema, tool_name)

            # Verify output
            if len(instructions) > 100:
                print(f"    ✓ Generated {len(instructions)} chars of instructions")

                # Show preview
                preview = instructions.split("\n")[:5]
                for line in preview:
                    print(f"      {line}")
                print("      ...")
            else:
                print(f"    ✗ Instructions too short: {len(instructions)} chars")

        except Exception as e:
            print(f"    ✗ Error: {e}")

    print("\n" + "=" * 60)
    print("Schema parsing test complete!")
    print("=" * 60 + "\n")


def test_collection_generation():
    """Test that collections can be generated from tool schemas."""

    print("=" * 60)
    print("TEST 3: Collection Generation")
    print("=" * 60)

    # Path to tool schemas
    tools_dir = Path(__file__).parent.parent / "mcp-tools"
    output_dir = Path(__file__).parent.parent / "Knowledge" / "agents"

    if not tools_dir.exists():
        print(f"✗ Tools directory not found: {tools_dir}")
        return

    tool_files = [str(f) for f in tools_dir.glob("*.tool.json")]

    print(f"\nCreating collection from {len(tool_files)} tools")

    try:
        collection = create_collection_from_tools(
            tool_files=tool_files,
            collection_id="test-collection",
            collection_name="Test Collection",
            collection_description="Test collection generated from tool schemas",
            output_dir=output_dir,
            tags=["test", "generated"],
        )

        print(f"\n✓ Collection created successfully!")
        print(f"  ID: {collection['id']}")
        print(f"  Name: {collection['name']}")
        print(f"  Items: {len(collection['items'])}")

        # Show items
        print("\n  Agents created:")
        for item in collection["items"]:
            print(f"    - {item['path']}")

        # Show output directory
        if output_dir.exists():
            agent_files = list(output_dir.glob("*.agent.md"))
            print(f"\n  Agent files in {output_dir}:")
            for agent_file in agent_files:
                size = agent_file.stat().st_size
                print(f"    - {agent_file.name} ({size} bytes)")

    except Exception as e:
        print(f"✗ Error creating collection: {e}")
        import traceback

        traceback.print_exc()

    print("\n" + "=" * 60)
    print("Collection generation test complete!")
    print("=" * 60 + "\n")


def run_all_tests():
    """Run all tests."""

    print("\n" + "=" * 70)
    print(" " * 15 + "DYNAMIC AGENT DISCOVERY TEST SUITE")
    print("=" * 70 + "\n")

    print("This test suite verifies that agent discovery works WITHOUT LLMs.")
    print("All operations use templates, schemas, and pattern matching.\n")

    # Run tests
    test_pattern_matching()
    test_schema_parsing()
    test_collection_generation()

    print("\n" + "=" * 70)
    print(" " * 20 + "ALL TESTS COMPLETE!")
    print("=" * 70 + "\n")

    print("Next steps:")
    print("1. Review generated agents in Knowledge/agents/")
    print("2. Try discovery via: @workspace /dynamic-agent-discovery.prompt.md")
    print("3. Test with awesome-copilot MCP tools")
    print("")


if __name__ == "__main__":
    run_all_tests()
