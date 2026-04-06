#!/usr/bin/env python3
"""
Agent Installation Test Suite
Tests all installed agents and validates configuration
"""

import yaml
from pathlib import Path
from typing import List, Dict, Any


def test_agents() -> Dict[str, Any]:
    """Validate all agent files"""
    print("🧪 Testing Agents...")
    print("=" * 60)

    agents_dir = Path(".github/agents")
    results = {"agents": [], "errors": [], "valid_count": 0, "total_count": 0}

    agent_files = list(agents_dir.glob("*.agent.md"))
    results["total_count"] = len(agent_files)

    for agent_file in agent_files:
        content = agent_file.read_text(encoding="utf-8")

        # Check frontmatter
        if not content.startswith("---"):
            results["errors"].append(f"{agent_file.name}: Missing frontmatter")
            continue

        try:
            parts = content.split("---")
            if len(parts) < 3:
                results["errors"].append(
                    f"{agent_file.name}: Invalid frontmatter format"
                )
                continue

            frontmatter = parts[1]
            metadata = yaml.safe_load(frontmatter)

            # Validate required fields
            required = ["description", "model"]
            missing = [f for f in required if f not in metadata]

            if missing:
                results["errors"].append(f"{agent_file.name}: Missing fields {missing}")
                continue

            # Success
            results["agents"].append(
                {
                    "file": agent_file.name,
                    "name": agent_file.stem.replace("-", " ").title(),
                    "description": metadata["description"],
                    "model": metadata["model"],
                    "tools": metadata.get("tools", []),
                }
            )
            results["valid_count"] += 1

            print(f"✅ {agent_file.name}")
            print(f"   {metadata['description'][:70]}...")
            print()

        except Exception as e:
            results["errors"].append(f"{agent_file.name}: {str(e)}")

    return results


def test_collection() -> Dict[str, Any]:
    """Validate collection manifest"""
    print("\n📦 Testing Collection...")
    print("=" * 60)

    collection_file = Path(
        "Knowledge/collections/vscode-march26-workspace.collection.yml"
    )
    results = {"valid": False, "collection": None, "errors": []}

    try:
        collection = yaml.safe_load(collection_file.read_text(encoding="utf-8"))

        # Validate schema
        required = ["id", "name", "description", "items"]
        missing = [f for f in required if f not in collection]

        if missing:
            results["errors"].append(f"Missing fields: {missing}")
            return results

        # Validate items
        for item in collection["items"]:
            if "path" not in item or "kind" not in item:
                results["errors"].append(f"Invalid item: {item}")

        results["valid"] = True
        results["collection"] = collection

        print(f"✅ Collection Valid")
        print(f"   ID: {collection['id']}")
        print(f"   Name: {collection['name']}")
        print(f"   Agents: {len(collection['items'])}")
        print(f"   Tags: {', '.join(collection.get('tags', []))}")
        print()

    except Exception as e:
        results["errors"].append(str(e))

    return results


def test_documentation() -> Dict[str, Any]:
    """Check if documentation files exist"""
    print("\n📚 Testing Documentation...")
    print("=" * 60)

    docs = [
        (".github/agents/README.md", "Agent usage guide"),
        ("AGENT_INSTALLATION.md", "Installation guide"),
        ("AGENT_DEPLOYMENT_SUMMARY.md", "Deployment summary"),
        ("Knowledge/tools/collection_builder.py", "Collection builder tool"),
        (".github/prompts/dynamic-agent-discovery.prompt.md", "Discovery prompt"),
    ]

    results = {"found": [], "missing": []}

    for doc_path, description in docs:
        path = Path(doc_path)
        if path.exists():
            results["found"].append(doc_path)
            print(f"✅ {doc_path}")
            print(f"   {description}")
            print()
        else:
            results["missing"].append(doc_path)
            print(f"❌ {doc_path} - NOT FOUND")
            print()

    return results


def generate_report(agent_results, collection_results, doc_results):
    """Generate final test report"""
    print("\n" + "=" * 60)
    print("📊 TEST REPORT")
    print("=" * 60)

    # Agent summary
    print(
        f"\n✅ Agents: {agent_results['valid_count']}/{agent_results['total_count']} valid"
    )
    for agent in agent_results["agents"]:
        print(f"   • @{agent['file'].replace('.agent.md', '')}")

    # Collection summary
    if collection_results["valid"]:
        print(f"\n✅ Collection: Valid")
        print(f"   • {collection_results['collection']['id']}")
    else:
        print(f"\n❌ Collection: Invalid")

    # Documentation summary
    print(
        f"\n📚 Documentation: {len(doc_results['found'])}/{len(doc_results['found']) + len(doc_results['missing'])} found"
    )

    # Errors
    total_errors = len(agent_results["errors"]) + len(collection_results["errors"])
    print(f"\n❌ Total Errors: {total_errors}")

    if total_errors > 0:
        print("\nErrors:")
        for error in agent_results["errors"] + collection_results["errors"]:
            print(f"   • {error}")

    # Next steps
    print("\n" + "=" * 60)
    print("🚀 NEXT STEPS")
    print("=" * 60)
    print("\n1. Reload VSCode:")
    print("   Ctrl+Shift+P → 'Developer: Reload Window'")
    print("\n2. Open Copilot Chat:")
    print("   Ctrl+Shift+I")
    print("\n3. Test agents:")
    print("   Type @ to see agents, then try:")
    for agent in agent_results["agents"][:2]:  # Show first 2
        agent_name = agent["file"].replace(".agent.md", "")
        print(f"   @{agent_name} Help me with <your task>")

    print("\n4. Read documentation:")
    print("   • .github/agents/README.md - Usage examples")
    print("   • AGENT_INSTALLATION.md - Full installation guide")
    print("   • AGENT_DEPLOYMENT_SUMMARY.md - Summary report")

    # Success message
    if total_errors == 0:
        print("\n" + "✅" * 15)
        print("✅ ALL TESTS PASSED! Agents ready to use! ✅")
        print("✅" * 15)
    else:
        print("\n⚠️  Some tests failed. Review errors above.")

    print()


def main():
    """Run all tests"""
    print("\n" + "🧪" * 15)
    print("AGENT INSTALLATION TEST SUITE")
    print("🧪" * 15 + "\n")

    agent_results = test_agents()
    collection_results = test_collection()
    doc_results = test_documentation()

    generate_report(agent_results, collection_results, doc_results)


if __name__ == "__main__":
    main()
