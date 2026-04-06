#!/usr/bin/env python3
"""
Discover AIFunction and handler patterns in agent-framework
"""

print("=" * 80)
print("AIFUNCTION AND HANDLER DISCOVERY")
print("=" * 80)

# 1. AIFunction details
print("\n1. AIFUNCTION CLASS:")
print("-" * 80)
try:
    from agent_framework import AIFunction
    import inspect
    
    # Constructor
    sig = inspect.signature(AIFunction.__init__)
    print(f"  __init__ signature:")
    print(f"  {sig}")
    
    # Public methods
    print(f"\n  Public methods:")
    methods = [m for m in dir(AIFunction) if not m.startswith("_") and callable(getattr(AIFunction, m))]
    for method in sorted(methods):
        print(f"    - {method}")
    
    # Docstring
    if AIFunction.__doc__:
        print(f"\n  Docstring (first 500 chars):")
        print(f"  {AIFunction.__doc__[:500]}")
        
except Exception as e:
    print(f"  ERROR: {e}")

# 2. @ai_function decorator
print("\n2. @ai_function DECORATOR:")
print("-" * 80)
try:
    from agent_framework import ai_function
    import inspect
    
    sig = inspect.signature(ai_function)
    print(f"  Signature: {sig}")
    
    if ai_function.__doc__:
        print(f"\n  Docstring:")
        print(f"  {ai_function.__doc__[:800]}")
        
except Exception as e:
    print(f"  ERROR: {e}")

# 3. @handler decorator
print("\n3. @handler DECORATOR:")
print("-" * 80)
try:
    from agent_framework import handler
    import inspect
    
    sig = inspect.signature(handler)
    print(f"  Signature: {sig}")
    
    if handler.__doc__:
        print(f"\n  Docstring:")
        print(f"  {handler.__doc__[:800]}")
        
except Exception as e:
    print(f"  ERROR: {e}")

# 4. Sample of creating tools/functions with AIFunction
print("\n4. TOOL CREATION PATTERN:")
print("-" * 80)
print("  Testing AIFunction usage pattern...")
try:
    from agent_framework import AIFunction
    
    # Create a sample tool
    def get_weather(location: str) -> str:
        return f"Weather in {location}: Sunny"
    
    # Try creating with AIFunction
    tool = AIFunction.from_function(
        func=get_weather,
        name="get_weather",
        description="Get weather for a location"
    )
    print(f"  [OK] AIFunction.from_function() works")
    print(f"      Name: {tool.name if hasattr(tool, 'name') else 'N/A'}")
    print(f"      Description: {tool.description if hasattr(tool, 'description') else 'N/A'}")
    
except AttributeError as e:
    print(f"  [ERROR] from_function not available: {e}")
    print(f"  Trying direct instantiation...")
    try:
        from agent_framework import AIFunction
        tool = AIFunction(
            name="get_weather",
            description="Get weather for a location",
            func=lambda location: f"Weather: {location}",
        )
        print(f"  [OK] Direct AIFunction instantiation works")
    except Exception as e2:
        print(f"  [ERROR] {e2}")
except Exception as e:
    print(f"  [ERROR] {e}")

# 5. ChatAgent or BaseAgent details
print("\n5. CHATCLIENT-BASED AGENT SETUP:")
print("-" * 80)
try:
    from agent_framework import ChatAgent
    import inspect
    
    sig = inspect.signature(ChatAgent.__init__)
    print(f"  ChatAgent.__init__ signature:")
    print(f"  {sig}")
    
except Exception as e:
    print(f"  ERROR: {e}")

# 6. Using agents with functions
print("\n6. AGENT WITH FUNCTIONS PATTERN:")
print("-" * 80)
try:
    from agent_framework import ChatAgent, AIFunction
    import inspect
    
    # Check if ChatAgent accepts functions parameter
    sig = inspect.signature(ChatAgent.__init__)
    params = list(sig.parameters.keys())
    
    if 'functions' in params:
        print(f"  [OK] ChatAgent accepts 'functions' parameter")
    elif 'tools' in params:
        print(f"  [OK] ChatAgent accepts 'tools' parameter")
    else:
        print(f"  ChatAgent parameters: {params}")
        
except Exception as e:
    print(f"  ERROR: {e}")

# 7. Execution patterns for agents
print("\n7. AGENT EXECUTION PATTERNS:")
print("-" * 80)
try:
    from agent_framework import AgentExecutor
    import inspect
    
    # Check run method
    sig = inspect.signature(AgentExecutor.run)
    print(f"  AgentExecutor.run signature:")
    print(f"  {sig}")
    
except Exception as e:
    print(f"  ERROR: {e}")

print("\n" + "=" * 80)
print("DISCOVERY COMPLETE")
print("=" * 80)
