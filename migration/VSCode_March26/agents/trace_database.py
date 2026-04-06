"""
Database Handler for Tracing
Logs agent runs, MCP tool calls, and decisions to PostgreSQL
"""

import contextlib
import psycopg2
import psycopg2.pool
from psycopg2.extras import Json
from datetime import datetime
from typing import Optional, Dict, Any
import logging
import json

logger = logging.getLogger(__name__)

_MIN_POOL_CONNECTIONS = 2
_MAX_POOL_CONNECTIONS = 10


class TraceDatabase:
    """
    Database handler for logging traces from agents and workflows.

    Uses a ThreadedConnectionPool so that concurrent agent runs share a
    bounded set of connections rather than opening a new one per call.
    """

    def __init__(self, connection_string: str):
        """
        Initialize database handler.

        Args:
            connection_string: PostgreSQL connection string
                Format: postgresql://user:password@localhost:5432/dbname
        """
        self.conn_string = connection_string
        self.logger = logging.getLogger(f"{__name__}.TraceDatabase")

        try:
            self._pool = psycopg2.pool.ThreadedConnectionPool(
                _MIN_POOL_CONNECTIONS,
                _MAX_POOL_CONNECTIONS,
                dsn=self.conn_string,
            )
            # Verify the pool works on startup
            with self._get_conn() as conn:
                with conn.cursor() as cur:
                    cur.execute("SELECT 1")
            self.logger.info("✅ Database connection pool established")
        except psycopg2.Error as e:
            self.logger.error(f"❌ Database connection pool failed: {e}")
            raise

    @contextlib.contextmanager
    def _get_conn(self):
        """Acquire a connection from the pool and return it when done."""
        conn = self._pool.getconn()
        try:
            yield conn
        except Exception:
            conn.rollback()
            raise
        finally:
            self._pool.putconn(conn)

    def close(self) -> None:
        """Close all connections in the pool."""
        self._pool.closeall()
        self.logger.info("Database connection pool closed")

    def __del__(self) -> None:
        try:
            self.close()
        except Exception:
            pass

    def log_agent_run(
        self,
        agent_name: str,
        trace_id: str,
        input_data: Dict[str, Any],
        output_data: Dict[str, Any],
        execution_status: str,
        duration_ms: int,
        tokens_used: Optional[Dict[str, int]] = None,
        model_used: Optional[str] = None,
        session_id: Optional[str] = None,
        error_message: Optional[str] = None,
    ) -> Optional[int]:
        """
        Log an agent run execution.

        Args:
            agent_name: Name of the agent
            trace_id: OpenTelemetry trace ID
            input_data: Input to the agent
            output_data: Output from the agent
            execution_status: 'completed', 'failed', 'started', 'cancelled'
            duration_ms: Execution duration in milliseconds
            tokens_used: Token usage dict {'prompt': N, 'completion': N, 'total': N}
            model_used: Model name if available
            session_id: Session ID for multi-turn conversations
            error_message: Error message if failed

        Returns:
            Agent run ID or None if failed
        """
        try:
            with self._get_conn() as conn:
                with conn.cursor() as cur:
                    # Get agent ID from user table
                    cur.execute(
                        "SELECT id FROM users WHERE identifier = %s AND type = 'agent'",
                        (agent_name,),
                    )
                    result = cur.fetchone()

                    if not result:
                        # Create agent user if doesn't exist
                        cur.execute(
                            """
                            INSERT INTO users (name, type, identifier, metadata)
                            VALUES (%s, 'agent', %s, %s)
                            RETURNING id
                        """,
                            (
                                agent_name,
                                agent_name,
                                Json({"created_at": datetime.now().isoformat()}),
                            ),
                        )
                        agent_id = cur.fetchone()[0]
                    else:
                        agent_id = result[0]

                    # Insert agent run
                    cur.execute(
                        """
                        INSERT INTO agent_runs
                        (agent_id, trace_id, session_id, input_data, output_data,
                         execution_status, error_message, execution_start,
                         duration_ms, tokens_used, model_used)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, NOW(), %s, %s, %s)
                        RETURNING id
                    """,
                        (
                            agent_id,
                            trace_id,
                            session_id,
                            Json(input_data),
                            Json(output_data),
                            execution_status,
                            error_message,
                            duration_ms,
                            Json(tokens_used) if tokens_used else None,
                            model_used,
                        ),
                    )

                    run_id = cur.fetchone()[0]
                    conn.commit()

                    self.logger.info(
                        f"✅ Logged agent run: {agent_name} "
                        f"(trace_id: {trace_id}, run_id: {run_id})"
                    )
                    return run_id

        except psycopg2.Error as e:
            self.logger.error(f"❌ Error logging agent run: {e}")
            return None

    def log_mcp_tool_call(
        self,
        run_id: int,
        tool_name: str,
        input_params: Dict[str, Any],
        output_data: Dict[str, Any],
        execution_status: str,
        duration_ms: int,
        mcp_server_name: Optional[str] = None,
        tool_call_id: Optional[str] = None,
        error_message: Optional[str] = None,
    ) -> Optional[int]:
        """
        Log an MCP tool call.

        Args:
            run_id: Agent run ID (foreign key)
            tool_name: Name of the tool
            input_params: Input parameters to tool
            output_data: Output from tool
            execution_status: 'completed', 'failed', 'started'
            duration_ms: Execution duration in milliseconds
            mcp_server_name: Name of MCP server providing the tool
            tool_call_id: Tool call ID for tracing
            error_message: Error message if failed

        Returns:
            Tool call log ID or None if failed
        """
        try:
            with self._get_conn() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        INSERT INTO mcp_tool_calls
                        (run_id, tool_name, tool_call_id, input_params,
                         output_data, execution_status, error_message,
                         call_start, duration_ms, mcp_server_name)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, NOW(), %s, %s)
                        RETURNING id
                    """,
                        (
                            run_id,
                            tool_name,
                            tool_call_id,
                            Json(input_params),
                            Json(output_data),
                            execution_status,
                            error_message,
                            duration_ms,
                            mcp_server_name,
                        ),
                    )

                    tool_call_id_db = cur.fetchone()[0]
                    conn.commit()

                    self.logger.debug(
                        f"✅ Logged tool call: {tool_name} (run_id: {run_id})"
                    )
                    return tool_call_id_db

        except psycopg2.Error as e:
            self.logger.error(f"❌ Error logging MCP tool call: {e}")
            return None

    def log_agent_decision(
        self,
        run_id: int,
        decision_type: str,
        reasoning: str,
        options_considered: list,
        selected_option: str,
        confidence_score: Optional[float] = None,
        next_step: Optional[str] = None,
    ) -> Optional[int]:
        """
        Log an agent decision.

        Args:
            run_id: Agent run ID
            decision_type: Type of decision (tool_selection, output_choice, retry, escalation)
            reasoning: Reasoning for the decision
            options_considered: List of options considered
            selected_option: Which option was selected
            confidence_score: Confidence score (0-1)
            next_step: What the next step will be

        Returns:
            Decision log ID or None if failed
        """
        try:
            with self._get_conn() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        INSERT INTO agent_decisions
                        (run_id, decision_type, reasoning, options_considered,
                         selected_option, confidence_score, next_step)
                        VALUES (%s, %s, %s, %s, %s, %s, %s)
                        RETURNING id
                    """,
                        (
                            run_id,
                            decision_type,
                            reasoning,
                            Json(options_considered),
                            selected_option,
                            confidence_score,
                            next_step,
                        ),
                    )

                    decision_id = cur.fetchone()[0]
                    conn.commit()

                    return decision_id

        except psycopg2.Error as e:
            self.logger.error(f"❌ Error logging agent decision: {e}")
            return None

    def log_trace_link(
        self,
        source_system: str,  # 'agent', 'n8n', 'document'
        source_id: str,
        target_system: str,
        target_id: str,
        relationship_type: str,  # 'modified', 'triggered', 'referenced'
        metadata: Optional[Dict] = None,
    ) -> Optional[int]:
        """
        Log a link between systems for cross-traceability.

        Args:
            source_system: Source system type
            source_id: Source ID
            target_system: Target system type
            target_id: Target ID
            relationship_type: Type of relationship
            metadata: Additional metadata

        Returns:
            Link ID or None
        """
        try:
            with self._get_conn() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        INSERT INTO trace_links
                        (source_system, source_id, target_system,
                         target_id, relationship_type, metadata)
                        VALUES (%s, %s, %s, %s, %s, %s)
                        RETURNING id
                    """,
                        (
                            source_system,
                            source_id,
                            target_system,
                            target_id,
                            relationship_type,
                            Json(metadata) if metadata else None,
                        ),
                    )

                    link_id = cur.fetchone()[0]
                    conn.commit()

                    return link_id

        except psycopg2.Error as e:
            self.logger.error(f"❌ Error logging trace link: {e}")
            return None

    def get_agent_statistics(self, agent_name: Optional[str] = None) -> list:
        """
        Get agent activity statistics.

        Args:
            agent_name: Optional specific agent (returns all if None)

        Returns:
            List of statistics dictionaries
        """
        try:
            with self._get_conn() as conn:
                with conn.cursor() as cur:
                    if agent_name:
                        cur.execute(
                            """
                            SELECT * FROM v_agent_activity
                            WHERE agent_name = %s
                        """,
                            (agent_name,),
                        )
                    else:
                        cur.execute("SELECT * FROM v_agent_activity")

                    columns = [desc[0] for desc in cur.description]
                    return [dict(zip(columns, row)) for row in cur.fetchall()]

        except psycopg2.Error as e:
            self.logger.error(f"Error retrieving agent statistics: {e}")
            return []

    def query_traces(self, trace_id: str) -> Dict[str, Any]:
        """
        Retrieve all data related to a trace ID.

        Args:
            trace_id: OpenTelemetry trace ID

        Returns:
            Dictionary with runs, tool calls, decisions, and spans
        """
        try:
            with self._get_conn() as conn:
                with conn.cursor() as cur:
                    # Get agent run
                    cur.execute(
                        "SELECT * FROM agent_runs WHERE trace_id = %s", (trace_id,)
                    )

                    run_result = cur.fetchone()
                    if not run_result:
                        return {"trace_id": trace_id, "not_found": True}

                    run_id = run_result[0]
                    run_columns = [desc[0] for desc in cur.description]
                    agent_run = dict(zip(run_columns, run_result))

                    # Get tool calls
                    cur.execute(
                        "SELECT * FROM mcp_tool_calls WHERE run_id = %s", (run_id,)
                    )
                    tool_columns = [desc[0] for desc in cur.description]
                    tool_calls = [
                        dict(zip(tool_columns, row)) for row in cur.fetchall()
                    ]

                    # Get decisions
                    cur.execute(
                        "SELECT * FROM agent_decisions WHERE run_id = %s", (run_id,)
                    )
                    decision_columns = [desc[0] for desc in cur.description]
                    decisions = [
                        dict(zip(decision_columns, row)) for row in cur.fetchall()
                    ]

                    # Get OpenTelemetry spans
                    cur.execute(
                        "SELECT * FROM otel_spans WHERE trace_id = %s ORDER BY start_timestamp",
                        (trace_id,),
                    )
                    span_columns = [desc[0] for desc in cur.description]
                    spans = [dict(zip(span_columns, row)) for row in cur.fetchall()]

                    return {
                        "trace_id": trace_id,
                        "agent_run": agent_run,
                        "tool_calls": tool_calls,
                        "decisions": decisions,
                        "spans": spans,
                    }

        except psycopg2.Error as e:
            self.logger.error(f"Error querying traces: {e}")
            return {"trace_id": trace_id, "error": str(e)}


def create_database(connection_string: str) -> TraceDatabase:
    """Factory function to create database handler."""
    return TraceDatabase(connection_string)
