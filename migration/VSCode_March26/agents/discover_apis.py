#!/usr/bin/env python3
"""
Discover available APIs in agent-framework-core v1.0.0b260107
"""

print("=" * 80)
print("AGENT FRAMEWORK API DISCOVERY")
print("=" * 80)

# 1. Discover core module exports
print("\n1. CORE MODULE EXPORTS:")
print("-" * 80)
try:
    from agent_framework import core
    exports = [x for x in dir(core) if not x.startswith("_")]
    for export in sorted(exports):
        print(f"  - {export}")
except Exception as e:
    print(f"  ERROR: {e}")

# 2. Discover Agent-related classes
print("\n2. AGENT-RELATED CLASSES:")
print("-" * 80)
try:
    import agent_framework.core as core
    agent_classes = [x for x in dir(core) if "Agent" in x and not x.startswith("_")]
    for cls in agent_classes:
        print(f"  - {cls}")
        try:
            klass = getattr(core, cls)
            if hasattr(klass, "__init__"):
                import inspect
                sig = inspect.signature(klass.__init__)
                print(f"    Signature: {sig}")
        except Exception as e:
            print(f"    (Could not get signature: {e})")
except Exception as e:
    print(f"  ERROR: {e}")

# 3. Discover Tool-related classes
print("\n3. TOOL-RELATED CLASSES:")
print("-" * 80)
try:
    import agent_framework.core as core
    tool_classes = [x for x in dir(core) if "Tool" in x and not x.startswith("_")]
    for cls in tool_classes:
        print(f"  - {cls}")
except Exception as e:
    print(f"  ERROR: {e}")

# 4. Check for OpenAI integration
print("\n4. OPENAI INTEGRATION MODULE:")
print("-" * 80)
try:
    from agent_framework import openai as openai_module
    exports = [x for x in dir(openai_module) if not x.startswith("_")]
    for export in sorted(exports):
        print(f"  - {export}")
except ImportError as e:
    print(f"  NOT FOUND: {e}")
except Exception as e:
    print(f"  ERROR: {e}")

# 5. Check for Azure AI integration
print("\n5. AZURE AI INTEGRATION MODULE:")
print("-" * 80)
try:
    from agent_framework import azure_ai as azure_ai_module
    exports = [x for x in dir(azure_ai_module) if not x.startswith("_")]
    for export in sorted(exports):
        print(f"  - {export}")
except ImportError as e:
    print(f"  NOT FOUND: {e}")
except Exception as e:
    print(f"  ERROR: {e}")

# 6. Try importing Agent directly
print("\n6. DIRECT AGENT IMPORT ATTEMPTS:")
print("-" * 80)
try:
    from agent_framework import Agent
    print("  [OK] from agent_framework import Agent")
except ImportError as e:
    print(f"  [NO] from agent_framework import Agent - {e}")

try:
    from agent_framework.core import Agent
    print("  [OK] from agent_framework.core import Agent")
except ImportError as e:
    print(f"  [NO] from agent_framework.core import Agent - {e}")

try:
    from agent_framework import AgentExecutor
    print("  [OK] from agent_framework import AgentExecutor")
except ImportError as e:
    print(f"  [NO] from agent_framework import AgentExecutor - {e}")

try:
    from agent_framework.core import AgentExecutor
    print("  [OK] from agent_framework.core import AgentExecutor")
except ImportError as e:
    print(f"  [NO] from agent_framework.core import AgentExecutor - {e}")

# 7. Try importing Tool directly
print("\n7. DIRECT TOOL IMPORT ATTEMPTS:")
print("-" * 80)
try:
    from agent_framework import Tool
    print("  [OK] from agent_framework import Tool")
except ImportError as e:
    print(f"  [NO] from agent_framework import Tool - {e}")

try:
    from agent_framework.core import Tool
    print("  [OK] from agent_framework.core import Tool")
except ImportError as e:
    print(f"  [NO] from agent_framework.core import Tool - {e}")

try:
    from agent_framework.core.tool import Tool
    print("  [OK] from agent_framework.core.tool import Tool")
except ImportError as e:
    print(f"  [NO] from agent_framework.core.tool import Tool - {e}")

# 8. OpenAI client options
print("\n8. OPENAI CLIENT OPTIONS:")
print("-" * 80)
try:
    from agent_framework.openai import OpenAIChatClient
    print("  [OK] from agent_framework.openai import OpenAIChatClient")
    import inspect
    sig = inspect.signature(OpenAIChatClient.__init__)
    print(f"    __init__ signature: {sig}")
except ImportError as e:
    print(f"  [NO] OpenAIChatClient: {e}")
except Exception as e:
    print(f"  ERROR: {e}")

try:
    from agent_framework.openai import OpenAIClient
    print("  [OK] from agent_framework.openai import OpenAIClient")
except ImportError as e:
    print(f"  [NO] from agent_framework.openai import OpenAIClient - {e}")

# 9. Check version
print("\n9. VERSION INFO:")
print("-" * 80)
try:
    import agent_framework
    if hasattr(agent_framework, "__version__"):
        print(f"  agent_framework version: {agent_framework.__version__}")
    else:
        print("  agent_framework version: (not available)")
except Exception as e:
    print(f"  ERROR: {e}")

print("\n" + "=" * 80)
print("DISCOVERY COMPLETE")
print("=" * 80)
