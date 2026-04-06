"""
Dynamic Agent Collection Builder - No LLMs Required

Programmatically builds agent collections from:
- MCP tool schemas (JSON files)
- YAML templates
- Keyword/regex pattern matching

Based on patterns from: https://github.com/Ditto190/modme-ui-01

Usage:
    from collection_builder import build_agent_from_schema, create_collection_from_tools

    # Build agent from MCP tool schema
    agent = build_agent_from_schema("generateagents.tool.json")

    # Create collection from multiple tools
    collection = create_collection_from_tools(["tool1.json", "tool2.json"])
"""

import json
from pathlib import Path
from typing import Dict, List, Any
import re
import yaml


def load_tool_schema(tool_path: Path) -> Dict[str, Any]:
    """Load MCP tool schema from JSON file."""
    with open(tool_path, "r", encoding="utf-8") as f:
        return json.load(f)


def extract_capabilities_from_schema(schema: Dict[str, Any]) -> List[str]:
    """Extract capabilities from tool schema parameters."""
    capabilities = []

    if "function" in schema:
        func = schema["function"]
        capabilities.append(func.get("description", "Tool function"))

        # Extract from parameters
        if "parameters" in func and "properties" in func["parameters"]:
            for param_name, param_info in func["parameters"]["properties"].items():
                if "description" in param_info:
                    capabilities.append(f"{param_name}: {param_info['description']}")

    return capabilities


def build_agent_instructions_from_schema(
    schema: Dict[str, Any], tool_name: str, style: str = "concise"
) -> str:
    """
    Build agent instructions from tool schema WITHOUT calling LLMs.
    Uses templates and schema data only.
    """

    # Extract metadata
    function = schema.get("function", {})
    func_description = function.get("description", f"{tool_name} agent")
    parameters = function.get("parameters", {}).get("properties", {})

    # Build instruction sections
    sections = []

    # Header
    sections.append(f"# {tool_name.replace('_', ' ').title()} Agent")
    sections.append("")
    sections.append("## Description")
    sections.append(func_description)
    sections.append("")

    # Capabilities (from parameters)
    if parameters:
        sections.append("## Capabilities")
        sections.append("")
        for param_name, param_info in parameters.items():
            param_desc = param_info.get("description", param_name)
            sections.append(f"- **{param_name}**: {param_desc}")
        sections.append("")

    # Usage pattern
    sections.append("## Usage Pattern")
    sections.append("")
    sections.append("```json")

    # Generate example from schema
    example = {"tool": tool_name, "parameters": {}}

    for param_name, param_info in parameters.items():
        param_type = param_info.get("type", "string")
        if param_type == "string":
            example["parameters"][param_name] = f"<{param_name}>"
        elif param_type == "boolean":
            example["parameters"][param_name] = False
        elif param_type == "array":
            example["parameters"][param_name] = []
        elif param_type == "object":
            example["parameters"][param_name] = {}

    sections.append(json.dumps(example, indent=2))
    sections.append("```")
    sections.append("")

    # Best practices (template-based)
    sections.append("## Best Practices")
    sections.append("")
    sections.append("- Always validate inputs before execution")
    sections.append("- Handle errors gracefully")
    sections.append("- Provide clear feedback to users")
    sections.append("")

    return "\n".join(sections)


def create_agent_frontmatter(
    agent_id: str,
    description: str,
    tools: List[str] | None = None,
    model: str = "gpt-4o",
) -> Dict[str, Any]:
    """Create agent frontmatter following awesome-copilot pattern."""

    frontmatter: Dict[str, Any] = {"description": description, "model": model}

    if tools:
        frontmatter["tools"] = tools

    return frontmatter


def build_agent_markdown(
    agent_id: str,
    description: str,
    instructions: str,
    tools: List[str] | None = None,
    model: str = "gpt-4o",
) -> str:
    """Build complete agent markdown file with frontmatter."""

    # Build frontmatter
    frontmatter = create_agent_frontmatter(agent_id, description, tools, model)

    # Convert to YAML
    yaml_str = yaml.dump(frontmatter, default_flow_style=False, sort_keys=False)

    # Build full markdown
    parts = ["---", yaml_str.strip(), "---", "", instructions]

    return "\n".join(parts)


def create_collection_from_tools(
    tool_files: List[str],
    collection_id: str,
    collection_name: str,
    collection_description: str,
    output_dir: Path,
    tags: List[str] | None = None,
) -> Dict[str, Any]:
    """
    Create agent collection from MCP tool schemas.

    Args:
        tool_files: List of tool JSON file paths
        collection_id: Unique collection ID
        collection_name: Display name
        collection_description: Collection description
        output_dir: Directory to write agents
        tags: Optional tags for discovery

    Returns:
        Collection metadata dictionary
    """

    output_dir.mkdir(parents=True, exist_ok=True)

    collection_items = []

    for tool_file in tool_files:
        tool_path = Path(tool_file)

        if not tool_path.exists():
            print(f"Warning: {tool_file} not found, skipping")
            continue

        # Load schema
        schema = load_tool_schema(tool_path)
        tool_name = tool_path.stem  # filename without extension

        # Generate agent instructions
        instructions = build_agent_instructions_from_schema(schema, tool_name)

        # Get description
        description = schema.get("function", {}).get(
            "description", f"{tool_name} agent"
        )

        # Build agent markdown
        agent_md = build_agent_markdown(
            agent_id=tool_name,
            description=description,
            instructions=instructions,
            tools=[tool_name],
            model="gpt-4o",
        )

        # Write agent file
        agent_filename = f"{tool_name}.agent.md"
        agent_path = output_dir / agent_filename
        agent_path.write_text(agent_md, encoding="utf-8")

        print(f"✓ Created agent: {agent_filename}")

        # Add to collection
        collection_items.append({"path": f"agents/{agent_filename}", "kind": "agent"})

    # Build collection YAML
    collection = {
        "id": collection_id,
        "name": collection_name,
        "description": collection_description,
        "items": collection_items,
        "display": {"ordering": "alpha"},
    }

    if tags:
        collection["tags"] = tags

    return collection


def match_intent_to_collection(
    user_prompt: str, collections: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """
    Match user prompt to relevant collections using keyword/regex matching.
    NO LLM CALLS - pure pattern matching.

    Args:
        user_prompt: User's natural language request
        collections: List of available collections

    Returns:
        List of matching collections sorted by relevance score
    """

    # Normalize prompt
    prompt_lower = user_prompt.lower()

    # Define keyword patterns for different domains
    patterns = {
        "code_analysis": r"\b(analyze|scan|review|audit|inspect)\s+(code|codebase|repository|repo)\b",
        "agent_generation": r"\b(generate|create|build|make)\s+(agent|chatmode|chat\s+mode)\b",
        "web_dev": r"\b(web|frontend|backend|api|rest|graphql|html|css|javascript|react|vue|angular)\b",
        "data": r"\b(data|database|sql|nosql|analytics|etl|pipeline)\b",
        "devops": r"\b(deploy|docker|kubernetes|ci\/cd|pipeline|infrastructure|terraform|ansible)\b",
        "testing": r"\b(test|testing|unit\s+test|integration\s+test|e2e|qa)\b",
        "documentation": r"\b(document|documentation|docs|readme|api\s+docs)\b",
    }

    # Score each collection
    scored_collections = []

    for collection in collections:
        score = 0

        # Check collection name
        if any(word in collection["name"].lower() for word in prompt_lower.split()):
            score += 10

        # Check description
        if any(
            word in collection.get("description", "").lower()
            for word in prompt_lower.split()
        ):
            score += 5

        # Check tags
        for tag in collection.get("tags", []):
            if tag.lower() in prompt_lower:
                score += 15

        # Check patterns
        for pattern_name, pattern in patterns.items():
            if re.search(pattern, prompt_lower):
                # Check if collection relates to this pattern
                collection_text = (
                    f"{collection['name']} {collection.get('description', '')}".lower()
                )
                if pattern_name.replace("_", " ") in collection_text or any(
                    word in collection_text for word in pattern_name.split("_")
                ):
                    score += 20

        if score > 0:
            scored_collections.append({"collection": collection, "score": score})

    # Sort by score descending
    scored_collections.sort(key=lambda x: x["score"], reverse=True)

    return [item["collection"] for item in scored_collections]


# CLI Usage
if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage:")
        print("  python collection_builder.py <command> [args]")
        print("")
        print("Commands:")
        print("  build-agents <tool_dir> <output_dir>")
        print("    - Build agents from all tool schemas in directory")
        print("")
        print(
            "  create-collection <tool_dir> <output_file> <collection_id> <collection_name>"
        )
        print("    - Create collection YAML from tools")
        print("")
        print("Example:")
        print("  python collection_builder.py build-agents ./mcp-tools ./agents")
        sys.exit(1)

    command = sys.argv[1]

    if command == "build-agents":
        tool_dir = Path(sys.argv[2])
        output_dir = Path(sys.argv[3])

        # Find all tool JSON files
        tool_files = list(tool_dir.glob("*.tool.json"))

        print(f"Found {len(tool_files)} tool schemas")
        print("")

        # Build agents
        for tool_file in tool_files:
            schema = load_tool_schema(tool_file)
            tool_name = tool_file.stem.replace(".tool", "")

            instructions = build_agent_instructions_from_schema(schema, tool_name)
            description = schema.get("function", {}).get(
                "description", f"{tool_name} agent"
            )

            agent_md = build_agent_markdown(
                agent_id=tool_name,
                description=description,
                instructions=instructions,
                tools=[tool_name],
            )

            output_dir.mkdir(parents=True, exist_ok=True)
            output_path = output_dir / f"{tool_name}.agent.md"
            output_path.write_text(agent_md, encoding="utf-8")

            print(f"✓ Created: {output_path}")

    elif command == "create-collection":
        tool_dir = Path(sys.argv[2])
        output_file = Path(sys.argv[3])
        collection_id = sys.argv[4]
        collection_name = sys.argv[5]

        # Find tool files
        tool_files = [str(f) for f in tool_dir.glob("*.tool.json")]

        collection = create_collection_from_tools(
            tool_files=tool_files,
            collection_id=collection_id,
            collection_name=collection_name,
            collection_description=f"Agent collection for {collection_name}",
            output_dir=output_file.parent / "agents",
            tags=["generated", "mcp-tools"],
        )

        # Write collection YAML
        output_file.parent.mkdir(parents=True, exist_ok=True)
        with open(output_file, "w", encoding="utf-8") as f:
            yaml.dump(collection, f, default_flow_style=False, sort_keys=False)

        print(f"✓ Collection created: {output_file}")

    else:
        print(f"Unknown command: {command}")
        sys.exit(1)
