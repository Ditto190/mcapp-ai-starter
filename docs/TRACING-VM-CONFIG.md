# OpenTelemetry Tracing Configuration for VMs

This guide explains how to configure OpenTelemetry tracing optimally for resource-constrained VM environments (e.g., Devpod with 2 CPUs, 4GB RAM, 20GB storage).

## VM-Optimized Settings

The tracing system is pre-configured with sensible defaults for VM environments:

### Memory Optimization
- **SQLite cache**: 2MB (reduced from default)
- **Memory-mapped I/O**: 4MB (minimal overhead)
- **Batch size**: 50 spans (smaller batches = less memory)
- **Queue size**: 100 spans max

### Storage Optimization
- **Max database size**: 100MB (auto-cleanup triggered)
- **Max spans**: 50,000 (reduced from 100,000)
- **Retention**: 7 days (automatic purging)
- **Auto-vacuum**: Enabled after cleanup

### Database Optimizations
- **Journal mode**: WAL (Write-Ahead Logging)
- **Synchronous mode**: NORMAL (balanced durability/performance)
- **Page size**: 4KB (standard, efficient)
- **Automatic cleanup**: Every 5 minutes

## Environment Variables

### Essential Settings

```bash
# Enable SQLite tracing (default)
export OTEL_ENABLED=true
export OTEL_EXPORTER_TYPE=sqlite
export OTEL_SQLITE_DB_PATH="$HOME/.apm/traces.db"
```

### Resource Tuning

Adjust these based on your VM capacity:

```bash
# For constrained VMs (2GB RAM, limit storage)
export OTEL_SQLITE_MAX_SPANS=25000        # Fewer spans
export OTEL_SQLITE_MAX_SIZE_MB=50         # 50MB limit
export OTEL_SQLITE_RETENTION_DAYS=3       # 3-day retention

# For comfortable VMs (4GB+ RAM, more storage)
export OTEL_SQLITE_MAX_SPANS=50000        # Default
export OTEL_SQLITE_MAX_SIZE_MB=100        # 100MB limit
export OTEL_SQLITE_RETENTION_DAYS=7       # 7-day retention

# For development/testing (minimal overhead)
export OTEL_SQLITE_MAX_SPANS=10000
export OTEL_SQLITE_MAX_SIZE_MB=25
export OTEL_SQLITE_RETENTION_DAYS=1
```

## Devpod Integration

The `.devcontainer/devcontainer.json` is configured to:

1. **Persist traces**: Mounts `~/.apm` directory from host
2. **Auto-configure**: Sets environment variables on container start
3. **Survive rebuilds**: Traces persist across container rebuilds

### Host Path Requirements

Ensure the host directory exists:

```bash
# On host machine (before starting Devpod)
mkdir -p ~/.apm
```

The container will write traces to this directory, making them accessible even after container recreation.

## Monitoring Resource Usage

Use the `apm traces --stats` command to monitor:

```bash
apm traces --stats
```

This shows:
- Database size and span count
- System memory usage and availability
- Disk usage and available space
- Resource health warnings

### Warning Thresholds

The system warns when:
- **Memory**: >90% system memory used
- **Disk**: >90% disk space used
- **Database**: Approaching max size limit

## Performance Tips

### Reduce Tracing Overhead

```bash
# Disable tracing for heavy operations
export OTEL_ENABLED=false
apm archive --clear  # No tracing overhead

# Re-enable after
export OTEL_ENABLED=true
```

### Console Export (Zero Storage)

For debugging without storage:

```bash
export OTEL_EXPORTER_TYPE=console
apm init  # Traces print to terminal only
```

### Disable Tracing Entirely

```bash
export OTEL_EXPORTER_TYPE=none
# Or
export OTEL_ENABLED=false
```

## Troubleshooting

### Database Too Large

If the database grows beyond limits:

```bash
# Check size
ls -lh ~/.apm/traces.db

# Manual cleanup (removes database)
rm ~/.apm/traces.db

# Or reduce limits
export OTEL_SQLITE_MAX_SIZE_MB=50
export OTEL_SQLITE_RETENTION_DAYS=3
```

### High Memory Usage

If the CLI process uses too much memory:

```bash
# Reduce batch sizes in code (already optimized)
# Or disable tracing temporarily
export OTEL_ENABLED=false
```

### Disk Space Issues

Monitor disk usage:

```bash
apm traces --stats  # Shows disk usage

# Or manually
df -h ~
```

## Best Practices

1. **Regular monitoring**: Run `apm traces --stats` weekly
2. **Adjust retention**: Reduce from 7 to 3 days if storage is tight
3. **Export important traces**: Use external tools before cleanup
4. **Test limits**: Start conservative, increase as needed
5. **Monitor warnings**: Act on resource health warnings promptly

## Production Deployment

For production environments:

```bash
# Use OTLP export to external collector
export OTEL_EXPORTER_TYPE=otlp
export OTEL_EXPORTER_OTLP_ENDPOINT=https://your-collector:4318/v1/traces

# Or disable local storage
export OTEL_EXPORTER_TYPE=none  # Only if external monitoring exists
```

## Example Configurations

### Minimal (Testing)
```bash
OTEL_SQLITE_MAX_SPANS=5000
OTEL_SQLITE_MAX_SIZE_MB=10
OTEL_SQLITE_RETENTION_DAYS=1
```

### Balanced (Default)
```bash
OTEL_SQLITE_MAX_SPANS=50000
OTEL_SQLITE_MAX_SIZE_MB=100
OTEL_SQLITE_RETENTION_DAYS=7
```

### Extended (Large VM)
```bash
OTEL_SQLITE_MAX_SPANS=100000
OTEL_SQLITE_MAX_SIZE_MB=250
OTEL_SQLITE_RETENTION_DAYS=14
```
