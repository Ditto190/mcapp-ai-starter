#!/usr/bin/env python3
"""
Smoke Test Suite - Verify environment and module functionality
Tests imports, basic instantiation, and API signatures
"""

import sys
import os
from pathlib import Path

# Add agents dir to path
sys.path.insert(0, str(Path(__file__).parent))

def test_imports():
    """Test all required imports."""
    print("\n[PKG] Testing Imports...")
    
    try:
        from agent_framework import Agent
        print("  [OK] agent_framework.Agent")
    except ImportError as e:
        print(f"  [ER] agent_framework.Agent: {e}")
        return False
    
    try:
        from agent_framework.openai import OpenAIChatClient
        print("  [OK] agent_framework.openai.OpenAIChatClient")
    except ImportError as e:
        print(f"  [ER] agent_framework.openai.OpenAIChatClient: {e}")
        return False
    
    try:
        from opentelemetry import trace
        print("  [OK] opentelemetry.trace")
    except ImportError as e:
        print(f"  [ER] opentelemetry.trace: {e}")
        return False
    
    try:
        import psycopg2
        print("  [OK] psycopg2")
    except ImportError as e:
        print(f"  [ER] psycopg2: {e}")
        return False
    
    return True


def test_tracing_config():
    """Test tracing configuration module."""
    print("\n[CFG] Testing Tracing Configuration...")
    
    try:
        from tracing_config import configure_tracing, get_tracer, setup_agent_framework_observability
        print("  [OK] All tracing_config functions importable")
        
        # Test basic tracer creation (without actual OTEL endpoint)
        tracer = get_tracer("smoke-test")
        print("  [OK] get_tracer() returns valid tracer")
        
        # Verify tracer has expected methods
        assert hasattr(tracer, 'start_as_current_span'), "Tracer missing start_as_current_span"
        print("  [OK] Tracer has start_as_current_span method")
        
        return True
    except Exception as e:
        print(f"  [ER] Tracing config error: {e}")
        return False


def test_trace_database():
    """Test trace database module structure."""
    print("\n[DB] Testing Trace Database...")
    
    try:
        from trace_database import TraceDatabase
        print("  [OK] TraceDatabase class importable")
        
        # Verify methods exist
        methods = [
            'log_agent_run',
            'log_mcp_tool_call',
            'log_agent_decision',
            'log_trace_link',
            'query_traces',
            'get_agent_statistics'
        ]
        
        for method in methods:
            assert hasattr(TraceDatabase, method), f"TraceDatabase missing {method}"
            print(f"  [OK] TraceDatabase.{method}() exists")
        
        return True
    except Exception as e:
        print(f"  [ER] Trace database error: {e}")
        return False


def test_document_manager():
    """Test document manager module."""
    print("\n[DOC] Testing Document Manager...")
    
    try:
        from document_manager import DocumentManager
        print("  [OK] DocumentManager class importable")
        
        # Verify methods exist
        methods = [
            'register_document',
            'log_change',
            'track_file_changes',
            'get_document_history',
            'export_audit_report'
        ]
        
        for method in methods:
            assert hasattr(DocumentManager, method), f"DocumentManager missing {method}"
            print(f"  [OK] DocumentManager.{method}() exists")
        
        return True
    except Exception as e:
        print(f"  [ER] Document manager error: {e}")
        return False


def test_sample_agent():
    """Test sample agent module structure."""
    print("\n[AGT] Testing Sample Agent...")
    
    try:
        from sample_agent import SampleAgent
        print("  [OK] SampleAgent class importable")
        
        # Verify SampleAgent has required methods
        methods = ['_setup_tracing', '_setup_agent', 'run']
        for method in methods:
            assert hasattr(SampleAgent, method), f"SampleAgent missing {method}"
            print(f"  [OK] SampleAgent.{method}() exists")
        
        return True
    except Exception as e:
        print(f"  [ER] Sample agent error: {e}")
        return False


def test_api_signatures():
    """Test that API signatures are correct."""
    print("\n[SIG] Testing API Signatures...")
    
    try:
        from trace_database import TraceDatabase
        import inspect
        
        # Check log_agent_run signature
        sig = inspect.signature(TraceDatabase.log_agent_run)
        params = list(sig.parameters.keys())
        
        required = ['self', 'agent_name', 'trace_id', 'input_data', 'output_data', 'execution_status', 'duration_ms']
        for param in required:
            assert param in params, f"log_agent_run missing parameter: {param}"
        print("  [OK] log_agent_run() has correct signature")
        
        # Check log_mcp_tool_call signature
        sig = inspect.signature(TraceDatabase.log_mcp_tool_call)
        params = list(sig.parameters.keys())
        
        required = ['self', 'run_id', 'tool_name', 'input_params', 'output_data', 'execution_status', 'duration_ms']
        for param in required:
            assert param in params, f"log_mcp_tool_call missing parameter: {param}"
        print("  [OK] log_mcp_tool_call() has correct signature")
        
        return True
    except Exception as e:
        print(f"  [ER] API signature error: {e}")
        return False


def test_environment_variables():
    """Test environment variable loading."""
    print("\n[ENV] Testing Environment Variables...")
    
    try:
        from dotenv import load_dotenv
        load_dotenv()
        
        # Check .env.example exists
        env_example = Path(__file__).parent.parent / ".env.example"
        if env_example.exists():
            print(f"  [OK] .env.example found at {env_example}")
        else:
            print(f"  [WN] .env.example not found at {env_example}")
        
        # Check DATABASE_URL can be set
        test_url = "postgresql://user:pass@localhost:5432/test_db"
        os.environ["DATABASE_URL"] = test_url
        loaded = os.getenv("DATABASE_URL")
        assert loaded == test_url, "Failed to set/get DATABASE_URL"
        print("  [OK] Environment variable handling works")
        
        return True
    except Exception as e:
        print(f"  [WN] Environment variable warning: {e}")
        return True  # Not critical


def main():
    """Run all smoke tests."""
    print("=" * 70)
    print("[TEST] SMOKE TEST SUITE - AI Agent Framework Environment")
    print("=" * 70)
    
    results = {
        "Imports": test_imports(),
        "Tracing Config": test_tracing_config(),
        "Trace Database": test_trace_database(),
        "Document Manager": test_document_manager(),
        "Sample Agent": test_sample_agent(),
        "API Signatures": test_api_signatures(),
        "Environment Variables": test_environment_variables(),
    }
    
    print("\n" + "=" * 70)
    print("[SUMMARY] TEST RESULTS")
    print("=" * 70)
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, result in results.items():
        status = "[PASS]" if result else "[FAIL]"
        print(f"{status:10} | {test_name}")
    
    print("=" * 70)
    print(f"\n🎯 Result: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n[SUCCESS] All smoke tests passed! Environment is ready for testing.")
        return 0
    else:
        print(f"\n[WARNING] {total - passed} test(s) failed. Review output above.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
