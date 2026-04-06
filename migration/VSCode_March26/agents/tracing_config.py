"""
OpenTelemetry Configuration for AI Agents
Configures tracing for VSCode AI Toolkit Inspector integration
"""

import os
from typing import Optional
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import Resource
import logging

logger = logging.getLogger(__name__)


def configure_tracing(
    vs_code_port: int = 4317,
    service_name: str = "ai-agent-system",
    service_version: str = "1.0.0",
    environment: str = "development",
    enable_logging: bool = True,
    otel_endpoint: Optional[str] = None,
    enable_sensitive_data: bool = False,
) -> TracerProvider:
    """
    Configure OpenTelemetry for AI Toolkit Inspector.

    This sets up tracing to send spans to VSCode AI Toolkit Inspector
    at the specified port (default: 4317 for gRPC, 4318 for HTTP).

    Args:
        vs_code_port: Port for AI Toolkit Inspector (default: 4317)
        service_name: Service name for tracing
        service_version: Service version
        environment: Environment name (development, staging, production)
        enable_logging: Enable debug logging

    Returns:
        Configured TracerProvider instance

    Example:
        >>> tracer_provider = configure_tracing()
        >>> trace.set_tracer_provider(tracer_provider)
        >>> tracer = trace.get_tracer(__name__)
    """

    if enable_logging:
        logger.setLevel(logging.DEBUG)

    # Create resource with service information
    resource = Resource.create(
        {
            "service.name": service_name,
            "service.version": service_version,
            "environment": environment,
            "deployment.environment": environment,
            "service.telemetry.sensitive_data": str(enable_sensitive_data).lower(),
        }
    )

    logger.info(f"Creating TracerProvider for {service_name} v{service_version}")

    # Create TracerProvider
    tracer_provider = TracerProvider(resource=resource)

    # Create OTLP exporter for gRPC (default for AI Toolkit)
    try:
        endpoint = otel_endpoint or f"http://localhost:{vs_code_port}"
        logger.info(f"Configuring OTLP exporter to {endpoint}")

        otlp_exporter = OTLPSpanExporter(
            endpoint=endpoint,
            insecure=True,  # Local development
            headers=(("Authorization", os.getenv("OTEL_EXPORTER_OTLP_HEADERS", "")),)
            if os.getenv("OTEL_EXPORTER_OTLP_HEADERS")
            else None,
        )

        # Add BatchSpanProcessor
        tracer_provider.add_span_processor(BatchSpanProcessor(otlp_exporter))

        logger.info("OTLP exporter configured successfully")

    except Exception as e:
        logger.warning(f"Failed to configure OTLP exporter: {e}")
        # Tracing will continue with no-op exporter

    return tracer_provider


def setup_agent_framework_observability(
    enable_sensitive_data: bool = False, vs_code_port: int = 4317
) -> None:
    """
    Configure Agent Framework observability.

    This must be called once at application startup before creating agents.

    Args:
        enable_sensitive_data: Enable capturing prompts and completions
        vs_code_port: Port for AI Toolkit Inspector

    Example:
        >>> setup_agent_framework_observability(enable_sensitive_data=True)
        >>> # Now create and use agents - they will be automatically instrumented
    """
    from agent_framework.observability import configure_otel_providers

    logger.info("Configuring Agent Framework observability...")

    try:
        configure_otel_providers(
            enable_sensitive_data=enable_sensitive_data,
            vs_code_extension_port=vs_code_port,
        )
        logger.info("Agent Framework observability configured")

    except Exception as e:
        logger.error(f"Failed to configure Agent Framework observability: {e}")
        raise


def get_tracer(name: str = "agent-app") -> trace.Tracer:
    """
    Get a tracer instance.

    Args:
        name: Tracer name (typically module name)

    Returns:
        Tracer instance for creating spans

    Example:
        >>> tracer = get_tracer(__name__)
        >>> with tracer.start_as_current_span("operation_name") as span:
        >>>     span.set_attribute("user.id", "12345")
        >>>     # Your code here
    """
    return trace.get_tracer(name)


def log_trace_id(trace_id_str: str) -> None:
    """
    Log current trace ID for debugging.

    Args:
        trace_id_str: Formatted trace ID string
    """
    logger.info(f"🔗 Trace ID: {trace_id_str}")
    print(f"🔗 Trace ID: {trace_id_str}")


# Quick setup function
def quick_setup() -> None:
    """One-line setup for development. Configures everything needed."""
    # Configure local tracing
    tracer_provider = configure_tracing(vs_code_port=4317, environment="development")
    trace.set_tracer_provider(tracer_provider)

    # Configure Agent Framework
    setup_agent_framework_observability(enable_sensitive_data=True)

    logger.info("✅ Tracing configured successfully")
    logger.info("📊 VSCode AI Toolkit Inspector ready at http://localhost:4317")
    logger.info("💡 Run 'ai-mlstudio.tracing.open' in VSCode Command Palette")
