#!/usr/bin/env python3
"""
Deep dive into agent_framework top-level exports
"""

print("=" * 80)
print("AGENT FRAMEWORK TOP-LEVEL API DISCOVERY")
print("=" * 80)

# Get all exports from agent_framework
print("\n1. ALL EXPORTS FROM agent_framework:")
print("-" * 80)
try:
    import agent_framework
    exports = [x for x in dir(agent_framework) if not x.startswith("_")]
    for export in sorted(exports):
        obj = getattr(agent_framework, export)
        obj_type = type(obj).__name__
        print(f"  - {export:<30} ({obj_type})")
except Exception as e:
    print(f"  ERROR: {e}")

# Detailed AgentExecutor inspection
print("\n2. AGENTEXECUTOR DETAILS:")
print("-" * 80)
try:
    from agent_framework import AgentExecutor
    import inspect
    
    # Constructor signature
    sig = inspect.signature(AgentExecutor.__init__)
    print(f"  __init__ params:")
    for param_name, param in sig.parameters.items():
        if param_name != 'self':
            print(f"    - {param_name}: {param.annotation if param.annotation != inspect.Parameter.empty else 'Any'}")
            if param.default != inspect.Parameter.empty:
                print(f"      default: {param.default}")
    
    # Available methods
    print(f"\n  Public methods:")
    methods = [m for m in dir(AgentExecutor) if not m.startswith("_") and callable(getattr(AgentExecutor, m))]
    for method in sorted(methods):
        print(f"    - {method}")
    
except Exception as e:
    print(f"  ERROR: {e}")

# Check for Tool patterns
print("\n3. SEARCHING FOR TOOL PATTERNS:")
print("-" * 80)
try:
    import agent_framework
    potential_tool_classes = []
    for name in dir(agent_framework):
        if 'tool' in name.lower() and not name.startswith('_'):
            potential_tool_classes.append(name)
    
    if potential_tool_classes:
        for cls_name in potential_tool_classes:
            print(f"  - {cls_name}")
    else:
        print("  No Tool-related classes found at top level")
except Exception as e:
    print(f"  ERROR: {e}")

# Check for integration modules
print("\n4. AVAILABLE SUBMODULES:")
print("-" * 80)
try:
    import agent_framework
    import pkgutil
    import importlib
    
    for importer, modname, ispkg in pkgutil.iter_modules(agent_framework.__path__):
        print(f"  - {modname} (package: {ispkg})")
        
        # Try to get exports from each module
        try:
            module = importlib.import_module(f"agent_framework.{modname}")
            exports = [x for x in dir(module) if not x.startswith("_") and x[0].isupper()]
            if exports:
                for export in sorted(exports)[:5]:  # Show first 5
                    print(f"      - {export}")
                if len(exports) > 5:
                    print(f"      ... and {len(exports) - 5} more")
        except Exception as e:
            print(f"      (Could not inspect: {e})")
except Exception as e:
    print(f"  ERROR: {e}")

# Check OpenAIChatClient signature in detail
print("\n5. OPENAI CHAT CLIENT DETAILED SIGNATURE:")
print("-" * 80)
try:
    from agent_framework.openai import OpenAIChatClient
    import inspect
    
    sig = inspect.signature(OpenAIChatClient.__init__)
    print(f"  Full signature:")
    print(f"  {sig}")
    
except Exception as e:
    print(f"  ERROR: {e}")

# Check for handler/tool definition patterns
print("\n6. SEARCHING FOR HANDLER PATTERNS IN DOCS:")
print("-" * 80)
try:
    from agent_framework import AgentExecutor
    
    # Check if there's a __doc__
    if AgentExecutor.__doc__:
        lines = AgentExecutor.__doc__.split('\n')[:20]
        for line in lines:
            print(f"  {line}")
    else:
        print("  (No docstring available)")
except Exception as e:
    print(f"  ERROR: {e}")

print("\n" + "=" * 80)
print("DISCOVERY COMPLETE")
print("=" * 80)
