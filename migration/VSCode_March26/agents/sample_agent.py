"""
Sample Agent with OpenTelemetry Tracing Integration
Demonstrates Agent Framework v1.0.0b260107 + document management + database logging

Usage:
    python agents/sample_agent.py

Expected Output:
    - Trace output visible in VSCode AI Toolkit Inspector (localhost:4317)
    - Agent run logged to PostgreSQL agents.agent_runs table
    - Tool calls logged with timing and parameters
    - Document changes tracked with agent trace_id
"""

import os
import uuid
from datetime import datetime
from dotenv import load_dotenv

# Agent Framework v1.0.0b260107
from agent_framework import (
    ChatAgent,
    AgentExecutor,
    AIFunction,
    ai_function,
)
from agent_framework._types import ChatMessage, Role
from agent_framework.openai import OpenAIChatClient

# Tracing modules (from our implementation)
from tracing_config import (
    configure_tracing,
    setup_agent_framework_observability,
    get_tracer,
)
from trace_database import TraceDatabase
from document_manager import DocumentManager

# OpenTelemetry
from opentelemetry import trace as otel_trace

# Load environment
load_dotenv()


class SampleAgent:
    """Sample agent demonstrating tracing integration."""

    def __init__(self):
        self.agent_name = "sample-agent"
        self.trace_id = str(uuid.uuid4())
        self.current_run_id = None

        # Initialize tracing
        self._setup_tracing()

        # Initialize database logging
        self.db = TraceDatabase(
            connection_string=os.getenv(
                "DATABASE_URL",
                "postgresql://postgres:postgres@localhost:5432/n8n_traceability",
            )
        )
        self.doc_manager = DocumentManager(
            knowledge_dir=os.getenv("KNOWLEDGE_DIR", "./Knowledge"),
            db_connection_string=os.getenv(
                "DATABASE_URL",
                "postgresql://postgres:postgres@localhost:5432/n8n_traceability",
            ),
        )

        # Get tracer
        self.tracer = get_tracer(__name__)

        # Initialize agent and executor
        self._setup_agent()

    def _setup_tracing(self):
        """Configure OpenTelemetry and Agent Framework observability."""
        print(f"[{self.agent_name}] Initializing tracing (trace_id={self.trace_id})")

        # Configure OpenTelemetry exporter
        configure_tracing(
            service_name=self.agent_name,
            service_version="1.0.0",
            otel_endpoint=os.getenv(
                "OTEL_EXPORTER_OTLP_ENDPOINT", "http://localhost:4317"
            ),
            enable_sensitive_data=os.getenv("ENABLE_SENSITIVE_DATA", "false").lower()
            == "true",
        )

        # Configure Agent Framework to use OpenTelemetry
        setup_agent_framework_observability(enable_sensitive_data=False)

    def _setup_agent(self):
        """Initialize ChatAgent with tools and wrap in AgentExecutor."""
        # FIXED: model_id parameter (not model)
        client = OpenAIChatClient(
            model_id=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            api_key=os.getenv("OPENAI_API_KEY"),
        )

        # Create tools using @ai_function pattern
        weather_tool = self._create_weather_tool()
        document_tool = self._create_document_tool()

        # FIXED: ChatAgent instead of Agent; chat_client not client
        self.agent = ChatAgent(
            chat_client=client,
            instructions="You are a helpful assistant with access to weather and document management tools.",
            tools=[weather_tool, document_tool],
            tool_choice="auto",
        )

        # Wrap in AgentExecutor for workflow integration
        self.executor = AgentExecutor(agent=self.agent)

    def _create_weather_tool(self) -> AIFunction:
        """Create weather forecast tool using AIFunction."""

        @ai_function(
            name="get_weather",
            description="Get weather forecast for a location",
        )
        def get_weather(location: str) -> str:
            """Get the current weather for a given location."""
            self.db.log_mcp_tool_call(
                run_id=self.current_run_id,
                tool_name="get_weather",
                input_params={"location": location},
                output_data={"forecast": "sunny", "temp": 72},
                execution_status="completed",
                duration_ms=150,
            )
            return f"Weather in {location}: Sunny, 72°F"

        return get_weather

    def _create_document_tool(self) -> AIFunction:
        """Create document registration tool using AIFunction."""

        @ai_function(
            name="register_document",
            description="Register a document in the knowledge management system",
        )
        def register_doc(doc_name: str, doc_type: str = "note") -> str:
            """Register a named document in the knowledge management system."""
            doc_id = self.doc_manager.register_document(
                name=doc_name,
                path=f"{os.getenv('KNOWLEDGE_DIR', './Knowledge')}/{doc_name}",
                doc_type=doc_type,
                tags=["ai-generated"],
                ai_generated=True,
            )

            self.db.log_mcp_tool_call(
                run_id=self.current_run_id,
                tool_name="register_document",
                input_params={"doc_name": doc_name, "doc_type": doc_type},
                output_data={"doc_id": doc_id},
                execution_status="completed",
                duration_ms=50,
            )

            self.doc_manager.log_change(
                document_path=f"{os.getenv('KNOWLEDGE_DIR', './Knowledge')}/{doc_name}",
                change_type="created",
                change_reason=f"Registered by agent {self.agent_name}",
                trace_id=self.trace_id,
            )

            return f"Document registered: {doc_id}"

        return register_doc

    async def run(self, user_input: str) -> str:
        """Run agent with tracing."""

        # Log agent run to database
        self.current_run_id = self.db.log_agent_run(
            agent_name=self.agent_name,
            trace_id=self.trace_id,
            input_data={"user_input": user_input},
            output_data={},
            execution_status="started",
            duration_ms=0,
            model_used=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        )

        print(f"\n{'=' * 60}")
        print(f"Agent Run ID: {self.current_run_id}")
        print(f"Trace ID: {self.trace_id}")
        print(f"Input: {user_input}")
        print(f"{'=' * 60}\n")

        try:
            with self.tracer.start_as_current_span("agent_execution") as span:
                # Add custom attributes for tracking
                span.set_attribute("trace_id", self.trace_id)
                span.set_attribute("run_id", self.current_run_id)
                span.set_attribute("agent_name", self.agent_name)

                # FIXED: Use agent.response() method instead of run()
                chat_response = await self.agent.response(
                    chat_messages=[ChatMessage(content=user_input, role=Role.USER)]
                )
                response = chat_response.content[0].text

                # Log agent decision
                self.db.log_agent_decision(
                    run_id=self.current_run_id,
                    decision_type="response_generation",
                    reasoning="Generated response using language model",
                    options_considered=["weather", "document_registration"],
                    selected_choice="weather",
                    confidence_score=0.85,
                )

                print(f"Agent Response:\n{response}\n")

                # Log success
                print(f"✅ Trace ID {self.trace_id[:8]}... logged to database")
                print(f"📊 View traces in VSCode Inspector: http://localhost:4317\n")

                return response

        except Exception as e:
            print(f"❌ Error: {e}")
            # Log failure
            self.db.log_agent_run(
                agent_name=self.agent_name,
                trace_id=self.trace_id,
                input_data={"user_input": user_input},
                output_data={"error": str(e)},
                execution_status="failed",
                duration_ms=0,
                model_used=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
                error_message=str(e),
            )
            raise


async def main():
    """Main entry point."""

    print("\n🚀 Starting Sample Agent with Tracing\n")

    agent = SampleAgent()

    # Example: Weather + document management
    await agent.run(
        "What's the weather in San Francisco? Also, register this conversation as a document."
    )

    # Query traces from database
    traces = agent.db.query_traces(agent.trace_id)
    print(f"\n📋 Database Query - Agent Run:")
    print(f"  - Run ID: {traces['agent_run']['id']}")
    print(f"  - Status: {traces['agent_run']['status']}")
    print(f"  - Tool Calls: {len(traces['mcp_tool_calls'])}")
    print(f"  - Decisions: {len(traces['agent_decisions'])}\n")

    # Get agent statistics
    stats = agent.db.get_agent_statistics(agent_name="sample-agent")
    print(f"📊 Agent Statistics:")
    print(f"  - Total Runs: {stats['total_runs']}")
    print(f"  - Success Rate: {stats['success_rate']:.1%}")
    print(f"  - Avg Tokens: {stats['avg_tokens']:.0f}\n")


if __name__ == "__main__":
    import asyncio

    asyncio.run(main())
