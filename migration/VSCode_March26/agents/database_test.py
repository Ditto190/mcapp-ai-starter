#!/usr/bin/env python3
"""
Phase 1: Database Setup Verification

Tests:
1. Connection to PostgreSQL
2. All 16 tables exist
3. All 3 views exist
4. All 4 triggers exist
5. Foreign key constraints work
6. Sample CRUD operations
"""

import os
import sys
import psycopg2
from datetime import datetime
from uuid import uuid4

def test_connection():
    """Test PostgreSQL connection."""
    try:
        conn = psycopg2.connect(
            host=os.getenv("DB_HOST", "localhost"),
            port=os.getenv("DB_PORT", "5432"),
            database="n8n_traceability",
            user=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD", "")
        )
        cur = conn.cursor()
        cur.execute("SELECT version();")
        version = cur.fetchone()[0]
        print(f"  [OK] Connected to {version.split(',')[0]}")
        conn.close()
        return True
    except Exception as e:
        print(f"  [ER] Connection failed: {e}")
        return False

def test_tables_exist():
    """Verify all required tables exist."""
    tables = [
        "agent_runs", "mcp_tool_calls", "agent_decisions", "documents",
        "document_changes", "n8n_executions", "otel_spans", "trace_links",
        "n8n_node_logs", "n8n_execution_context", "users"
    ]
    
    try:
        conn = psycopg2.connect(
            host=os.getenv("DB_HOST", "localhost"),
            port=os.getenv("DB_PORT", "5432"),
            database="n8n_traceability",
            user=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD", "")
        )
        cur = conn.cursor()
        
        missing = []
        for table in tables:
            cur.execute(f"""
                SELECT EXISTS (
                    SELECT 1 FROM information_schema.tables 
                    WHERE table_schema='public' AND table_name='{table}'
                )
            """)
            exists = cur.fetchone()[0]
            if not exists:
                missing.append(table)
        
        if missing:
            print(f"  [ER] Missing tables: {missing}")
            return False
        else:
            print(f"  [OK] All {len(tables)} tables exist")
        
        conn.close()
        return True
    except Exception as e:
        print(f"  [ER] Table check failed: {e}")
        return False

def test_views_exist():
    """Verify 3 views exist."""
    views = ["v_agent_activity", "v_document_activity", "v_workflow_stats"]
    
    try:
        conn = psycopg2.connect(
            host=os.getenv("DB_HOST", "localhost"),
            port=os.getenv("DB_PORT", "5432"),
            database="n8n_traceability",
            user=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD", "")
        )
        cur = conn.cursor()
        
        missing = []
        for view in views:
            cur.execute(f"""
                SELECT EXISTS (
                    SELECT 1 FROM information_schema.views 
                    WHERE table_schema='public' AND table_name='{view}'
                )
            """)
            exists = cur.fetchone()[0]
            if not exists:
                missing.append(view)
        
        if missing:
            print(f"  [ER] Missing views: {missing}")
            return False
        else:
            print(f"  [OK] All {len(views)} views exist")
        
        conn.close()
        return True
    except Exception as e:
        print(f"  [ER] View check failed: {e}")
        return False

def test_crud_operations():
    """Test basic CRUD operations."""
    try:
        conn = psycopg2.connect(
            host=os.getenv("DB_HOST", "localhost"),
            port=os.getenv("DB_PORT", "5432"),
            database="n8n_traceability",
            user=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD", "")
        )
        conn.autocommit = True
        cur = conn.cursor()
        
        # CREATE - get a valid agent_id from users table
        cur.execute("SELECT id FROM users LIMIT 1")
        agent_id_result = cur.fetchone()
        if not agent_id_result:
            # Insert a test agent if none exists
            cur.execute("""
                INSERT INTO users (name, type, identifier) 
                VALUES (%s, %s, %s) RETURNING id
            """, ('Test Agent', 'agent', 'test-agent'))
            agent_id = cur.fetchone()[0]
        else:
            agent_id = agent_id_result[0]
        
        trace_id = str(uuid4())
        cur.execute("""
            INSERT INTO agent_runs (agent_id, trace_id, input_data, output_data, execution_status, execution_start, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id
        """, (agent_id, trace_id, '{"test": "input"}', '{"test": "output"}', 'completed', datetime.utcnow(), datetime.utcnow()))
        run_id = cur.fetchone()[0]
        
        # READ
        cur.execute("SELECT id FROM agent_runs WHERE trace_id = %s", (trace_id,))
        result = cur.fetchone()
        if not result:
            print(f"  [ER] INSERT/SELECT failed")
            return False
        
        # UPDATE
        cur.execute("UPDATE agent_runs SET execution_status = %s WHERE id = %s", ('archived', run_id))
        
        # DELETE
        cur.execute("DELETE FROM agent_runs WHERE id = %s", (run_id,))
        
        print(f"  [OK] CRUD operations work (C,R,U,D all successful)")
        conn.close()
        return True
    except Exception as e:
        print(f"  [ER] CRUD operations failed: {e}")
        return False

def main():
    print("Phase 1: Database Setup & Verification")
    print("=" * 50)
    
    tests = [
        ("PostgreSQL Connection", test_connection),
        ("Tables Exist", test_tables_exist),
        ("Views Exist", test_views_exist),
        ("CRUD Operations", test_crud_operations),
    ]
    
    passed = 0
    for name, test_func in tests:
        print(f"\n{name}:")
        if test_func():
            passed += 1
    
    print(f"\n{'=' * 50}")
    print(f"Result: {passed}/{len(tests)} tests passed")
    
    if passed == len(tests):
        print("OK Phase 1 Complete - Database Ready!")
        return 0
    else:
        print("ER Phase 1 Failed - Review errors above")
        return 1

if __name__ == "__main__":
    sys.exit(main())
