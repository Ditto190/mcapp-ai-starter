# OpenTelemetry Tracing

The Agentic Project Management CLI includes comprehensive **OpenTelemetry tracing** support for monitoring AI agent operations, CLI commands, and service calls.

## Overview

Tracing provides visibility into:
- **CLI command execution** - Track every command invocation with arguments
- **GitHub operations** - Monitor API calls and asset downloads
- **Archive operations** - Trace session archiving and restoration
- **Service operations** - Track internal service calls and data flows
- **Error tracking** - Capture and trace errors with full context

## Quick Start

### Enable SQLite Tracing (Default)

Traces are automatically stored in SQLite for persistent, queryable storage:

```bash
# SQLite is enabled by default - just run commands
apm init

# Query your traces
apm traces --list
apm traces --stats
```

### Query Traces

The `apm traces` command provides powerful trace querying:

```bash
# List recent traces
apm traces --list

# Show trace details
apm traces --trace <trace-id>

# View recent errors
apm traces --errors

# Database and resource statistics
apm traces --stats

# Search by attribute
apm traces --search "command.name=init"
```

### Enable Console Tracing

To see traces in your terminal:

```bash
# Enable tracing with console output
export OTEL_EXPORTER_TYPE=console

# Run any command
apm status
```

### Enable OTLP Export

To send traces to an OpenTelemetry collector (e.g., Jaeger, Honeycomb, Grafana):

```bash
# Configure OTLP exporter
export OTEL_EXPORTER_TYPE=otlp
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318/v1/traces

# Run commands - traces will be sent to the endpoint
apm init
```

### Disable Tracing

```bash
# Disable tracing entirely
export OTEL_ENABLED=false

# Or unset the variable
unset OTEL_ENABLED
```

## Configuration

Tracing is configured via environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `OTEL_ENABLED` | Enable/disable tracing | `true` |
| `OTEL_EXPORTER_TYPE` | Exporter type (`sqlite`, `console`, `otlp`, `none`) | `sqlite` |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OTLP endpoint URL | `http://localhost:4318/v1/traces` |
| `OTEL_SQLITE_DB_PATH` | SQLite database path | `~/.apm/traces.db` |
| `OTEL_SQLITE_MAX_SPANS` | Maximum spans before cleanup | `50000` |
| `OTEL_SQLITE_MAX_SIZE_MB` | Maximum database size (MB) | `100` |
| `OTEL_SQLITE_RETENTION_DAYS` | Days to retain traces | `7` |
| `DEBUG` | Enable debug logging | `false` |

### Resource-Optimized Defaults

The SQLite exporter is optimized for resource-constrained environments (e.g., 2 CPU, 4GB RAM VMs):

- **Memory**: Uses 2MB cache, 4MB memory-mapped I/O
- **Storage**: Automatic cleanup at 100MB or 50,000 spans
- **Retention**: 7-day default with automatic purging
- **Batching**: Small batch sizes (50 spans) for low memory overhead

## Trace Attributes

### Command Spans

Every CLI command creates a span with these attributes:

- `agent.operation.type`: `cli_command`
- `apm.command.name`: Command name (e.g., `init`, `archive`)
- `apm.command.args`: Command arguments as JSON

### GitHub Operations

GitHub API calls include:

- `agent.operation.type`: `github_operation`
- `github.repository`: Repository name
- `http.url`: API endpoint URL
- `http.method`: HTTP method

### Archive Operations

Archive operations track:

- `agent.operation.type`: `archive_operation`
- `archive.path`: Archive directory path
- `archive.size_bytes`: Total archive size
- `archive.reason`: Reason for archival (e.g., `update`, `manual`)
- `archives.cleared_count`: Number of archives removed (for clear operations)

### Error Tracking

When errors occur, spans include:

- `error.type`: Error class name
- `error.message`: Error message
- `error.stack`: Full stack trace

## Span Events

Traces include detailed events marking key operations:

- `request.started` / `request.completed` / `request.failed`
- `download.started` / `download.completed` / `download.failed`
- `archive.name_generated`
- `archive.files_copied`
- `archive.cleanup_completed`
- And many more...

## Integration Examples

### Jaeger (Local Development)

Run Jaeger locally with Docker:

```bash
docker run -d --name jaeger \
  -e COLLECTOR_OTLP_ENABLED=true \
  -p 16686:16686 \
  -p 4318:4318 \
  jaegertracing/all-in-one:latest
```

Configure APM to send traces:

```bash
export OTEL_ENABLED=true
export OTEL_EXPORTER_TYPE=otlp
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318/v1/traces

# Run commands
apm init
apm archive

# View traces at http://localhost:16686
```

### Honeycomb

```bash
export OTEL_ENABLED=true
export OTEL_EXPORTER_TYPE=otlp
export OTEL_EXPORTER_OTLP_ENDPOINT=https://api.honeycomb.io:443/v1/traces
export OTEL_EXPORTER_OTLP_HEADERS="x-honeycomb-team=<your-api-key>"

apm status
```

### Grafana Cloud

```bash
export OTEL_ENABLED=true
export OTEL_EXPORTER_TYPE=otlp
export OTEL_EXPORTER_OTLP_ENDPOINT=https://tempo-<region>.grafana.net:443/v1/traces
export OTEL_EXPORTER_OTLP_HEADERS="Authorization=Basic <base64-encoded-creds>"

apm update
```

### Azure Monitor / Application Insights

For Azure Monitor integration, you can use the Azure Monitor OpenTelemetry exporter:

```bash
npm install @azure/monitor-opentelemetry-exporter
```

Then update the tracing service to include the Azure Monitor exporter option.

## Programmatic Usage

If you're extending APM or building on top of it, you can use the tracing API directly:

```javascript
import { 
  withSpan, 
  traceCommand,
  traceServiceOperation,
  AGENT_ATTRIBUTES 
} from './services/tracing.js';

// Trace a custom operation
await withSpan('my.operation', {
  [AGENT_ATTRIBUTES.OPERATION_TYPE]: 'custom',
  'my.custom.attribute': 'value'
}, async () => {
  // Your code here
  return result;
});

// Trace a service operation
await traceServiceOperation('myService', 'myOperation', {
  'custom.attribute': 'value'
}, async () => {
  // Service logic
});
```

## Semantic Conventions

APM follows OpenTelemetry semantic conventions and extends them with AI-specific attributes:

- `agent.name` - Agent identifier
- `agent.type` - Agent type (e.g., planner, manager, worker)
- `agent.role` - Agent role in the workflow
- `agent.operation.type` - Type of operation
- `agent.operation.status` - Operation status

See [src/services/tracing.js](src/services/tracing.js) for the complete list of attributes in `AGENT_ATTRIBUTES`.

## Performance Considerations

- **Console exporter**: Adds minimal overhead but can slow down output-heavy commands
- **OTLP exporter**: Uses batching to minimize performance impact
- **Disable in production**: For production CLI usage, disable tracing unless debugging
- **Sampling**: Currently all traces are sampled; add sampling configuration for high-volume scenarios

## Troubleshooting

### No traces appearing

1. Check that `OTEL_ENABLED=true` is set
2. Verify the exporter type is correct
3. For OTLP, ensure the endpoint is reachable
4. Enable debug logging: `DEBUG=true apm <command>`

### Console exporter too verbose

Switch to OTLP or disable tracing:

```bash
export OTEL_EXPORTER_TYPE=none
# or
export OTEL_ENABLED=false
```

### Connection errors with OTLP

Verify the collector is running and accessible:

```bash
curl -v http://localhost:4318/v1/traces
```

## Examples

### Trace a full workflow

```bash
# Enable tracing
export OTEL_ENABLED=true
export OTEL_EXPORTER_TYPE=console

# Initialize APM (traces init command + GitHub operations)
apm init -a claude

# Archive session (traces archive operations)
apm archive -n my-session

# Update (traces update + archive operations)
apm update

# View status (traces status command)
apm status
```

### Export traces to file

```bash
# Console exporter prints to stdout, redirect to file
export OTEL_EXPORTER_TYPE=console
apm init 2>&1 | tee traces.json
```

## Contributing

To add tracing to new operations:

1. Import tracing utilities:
   ```javascript
   import { traceServiceOperation, addSpanEvent } from './services/tracing.js';
   ```

2. Wrap operations with appropriate trace functions:
   ```javascript
   export async function myOperation() {
     return await traceServiceOperation('myService', 'operation', {}, async () => {
       addSpanEvent('operation.started');
       // ... your code
       addSpanEvent('operation.completed');
       return result;
     });
   }
   ```

3. Use semantic attributes from `AGENT_ATTRIBUTES`

See existing instrumentation in:
- [src/services/github.js](src/services/github.js)
- [src/services/archive.js](src/services/archive.js)
- [src/index.js](src/index.js)

## Learn More

- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [OpenTelemetry JavaScript SDK](https://github.com/open-telemetry/opentelemetry-js)
- [OpenTelemetry Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/)
- [Jaeger Tracing](https://www.jaegertracing.io/)
