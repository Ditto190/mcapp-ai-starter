/**
 * OpenTelemetry Tracing Service
 *
 * Provides distributed tracing capabilities for AI agent operations,
 * CLI commands, and service calls using OpenTelemetry.
 *
 * @module src/services/tracing
 */

import { trace, context, SpanStatusCode } from '@opentelemetry/api';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { Resource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { 
  BatchSpanProcessor,
  ConsoleSpanExporter,
  SimpleSpanProcessor 
} from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { SQLiteSpanExporter } from '../exporters/sqlite-exporter.js';
import logger from '../ui/logger.js';
import { homedir } from 'os';
import { join } from 'path';

/**
 * Semantic conventions for AI agent tracing
 */
export const AGENT_ATTRIBUTES = {
  // Agent identification
  AGENT_NAME: 'agent.name',
  AGENT_TYPE: 'agent.type',
  AGENT_ROLE: 'agent.role',
  
  // Operation details
  OPERATION_TYPE: 'agent.operation.type',
  OPERATION_STATUS: 'agent.operation.status',
  
  // Command tracking
  COMMAND_NAME: 'apm.command.name',
  COMMAND_ARGS: 'apm.command.args',
  
  // File operations
  FILE_PATH: 'file.path',
  FILE_OPERATION: 'file.operation',
  
  // GitHub operations
  GITHUB_REPO: 'github.repository',
  GITHUB_RELEASE: 'github.release',
  
  // Archive operations
  ARCHIVE_PATH: 'archive.path',
  ARCHIVE_SIZE: 'archive.size',
  
  // Service operations
  SERVICE_NAME: 'service.name',
  SERVICE_OPERATION: 'service.operation',
  
  // Error tracking
  ERROR_TYPE: 'error.type',
  ERROR_MESSAGE: 'error.message',
  ERROR_STACK: 'error.stack',
};

/**
 * Tracer instance
 */
let tracer = null;
let provider = null;
let isEnabled = false;

/**
 * Initialize OpenTelemetry tracing.
 *
 * @param {Object} options - Configuration options.
 * @param {string} [options.serviceName='agentic-pm'] - Service name for traces.
 * @param {string} [options.serviceVersion='1.0.1'] - Service version.
 * @param {string} [options.exporterType='sqlite'] - Type of exporter (console, otlp, sqlite, none).
 * @param {string} [options.otlpEndpoint] - OTLP endpoint URL (for exporterType=otlp).
 * @param {string} [options.sqliteDbPath] - SQLite database path (for exporterType=sqlite).
 * @param {boolean} [options.enabled=true] - Whether tracing is enabled.
 */
export function initializeTracing(options = {}) {
  const {
    serviceName = 'agentic-pm',
    serviceVersion = '1.0.1',
    exporterType = process.env.OTEL_EXPORTER_TYPE || 'sqlite',
    otlpEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
    sqliteDbPath = process.env.OTEL_SQLITE_DB_PATH || join(process.env.HOME || homedir(), '.apm', 'traces.db'),
    enabled = process.env.OTEL_ENABLED !== 'false'
  } = options;

  isEnabled = enabled;

  if (!isEnabled) {
    logger.debug('Tracing is disabled');
    return;
  }

  try {
    // Create resource with service information
    const resource = Resource.default().merge(
      new Resource({
        [ATTR_SERVICE_NAME]: serviceName,
        [ATTR_SERVICE_VERSION]: serviceVersion,
      })
    );

    // Create provider
    provider = new NodeTracerProvider({
      resource,
    });

    // Configure exporter based on type
    let exporter;
    switch (exporterType.toLowerCase()) {
      case 'sqlite':
        exporter = new SQLiteSpanExporter({
          dbPath: sqliteDbPath,
          verbose: process.env.DEBUG === 'true',
          maxSpans: parseInt(process.env.OTEL_SQLITE_MAX_SPANS || '50000', 10),
          maxDatabaseSizeMB: parseInt(process.env.OTEL_SQLITE_MAX_SIZE_MB || '100', 10),
          retentionDays: parseInt(process.env.OTEL_SQLITE_RETENTION_DAYS || '7', 10),
        });
        provider.addSpanProcessor(new BatchSpanProcessor(exporter, {
          maxQueueSize: 100, // Limit memory usage
          maxExportBatchSize: 50, // Smaller batches for constrained environments
          scheduledDelayMillis: 5000, // Export every 5 seconds
        }));
        logger.debug(`SQLite exporter configured: ${sqliteDbPath}`);
        break;

      case 'otlp':
        exporter = new OTLPTraceExporter({
          url: otlpEndpoint,
        });
        provider.addSpanProcessor(new BatchSpanProcessor(exporter));
        logger.debug(`OTLP exporter configured: ${otlpEndpoint}`);
        break;

      case 'console':
        exporter = new ConsoleSpanExporter();
        provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
        logger.debug('Console exporter configured');
        break;

      case 'none':
        logger.debug('No exporter configured (tracing to memory only)');
        break;

      default:
        logger.warn(`Unknown exporter type: ${exporterType}, using sqlite`);
        exporter = new SQLiteSpanExporter({
          dbPath: sqliteDbPath,
          verbose: process.env.DEBUG === 'true',
        });
        provider.addSpanProcessor(new BatchSpanProcessor(exporter));
    }

    // Register provider
    provider.register();

    // Get tracer instance
    tracer = trace.getTracer(serviceName, serviceVersion);

    logger.debug('OpenTelemetry tracing initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize tracing', { error });
    isEnabled = false;
  }
}

/**
 * Shutdown tracing and flush all pending spans.
 */
export async function shutdownTracing() {
  if (provider) {
    try {
      await provider.shutdown();
      logger.debug('Tracing shutdown complete');
    } catch (error) {
      logger.error('Error during tracing shutdown', { error });
    }
  }
}

/**
 * Get the tracer instance.
 *
 * @returns {import('@opentelemetry/api').Tracer} Tracer instance.
 */
export function getTracer() {
  if (!isEnabled || !tracer) {
    // Return a no-op tracer that does nothing
    return {
      startSpan: () => ({ end: () => {}, setAttribute: () => {}, setStatus: () => {} }),
      startActiveSpan: (name, fn) => fn({ end: () => {}, setAttribute: () => {}, setStatus: () => {} })
    };
  }
  return tracer;
}

/**
 * Execute a function within a traced span.
 *
 * @template T
 * @param {string} spanName - Name of the span.
 * @param {Object} attributes - Span attributes.
 * @param {() => T | Promise<T>} fn - Function to execute.
 * @returns {Promise<T>} Result of the function.
 */
export async function withSpan(spanName, attributes, fn) {
  if (!isEnabled) {
    return await fn();
  }

  return await tracer.startActiveSpan(spanName, async (span) => {
    try {
      // Set attributes
      for (const [key, value] of Object.entries(attributes)) {
        if (value !== undefined && value !== null) {
          span.setAttribute(key, value);
        }
      }

      // Execute function
      const result = await fn();

      // Mark as successful
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      // Record error
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message,
      });
      span.setAttribute(AGENT_ATTRIBUTES.ERROR_TYPE, error.constructor.name);
      span.setAttribute(AGENT_ATTRIBUTES.ERROR_MESSAGE, error.message);
      if (error.stack) {
        span.setAttribute(AGENT_ATTRIBUTES.ERROR_STACK, error.stack);
      }
      throw error;
    } finally {
      span.end();
    }
  });
}

/**
 * Trace a CLI command execution.
 *
 * @param {string} commandName - Name of the command.
 * @param {Object} commandArgs - Command arguments.
 * @param {Function} fn - Command function to execute.
 * @returns {Promise<any>} Result of the command.
 */
export async function traceCommand(commandName, commandArgs, fn) {
  return await withSpan(
    `command.${commandName}`,
    {
      [AGENT_ATTRIBUTES.COMMAND_NAME]: commandName,
      [AGENT_ATTRIBUTES.COMMAND_ARGS]: JSON.stringify(commandArgs),
      [AGENT_ATTRIBUTES.OPERATION_TYPE]: 'cli_command',
    },
    fn
  );
}

/**
 * Trace a service operation.
 *
 * @param {string} serviceName - Name of the service.
 * @param {string} operation - Operation name.
 * @param {Object} attributes - Additional attributes.
 * @param {Function} fn - Service function to execute.
 * @returns {Promise<any>} Result of the operation.
 */
export async function traceServiceOperation(serviceName, operation, attributes, fn) {
  return await withSpan(
    `service.${serviceName}.${operation}`,
    {
      [AGENT_ATTRIBUTES.SERVICE_NAME]: serviceName,
      [AGENT_ATTRIBUTES.SERVICE_OPERATION]: operation,
      [AGENT_ATTRIBUTES.OPERATION_TYPE]: 'service_operation',
      ...attributes,
    },
    fn
  );
}

/**
 * Trace a GitHub API operation.
 *
 * @param {string} operation - Operation name.
 * @param {string} repository - Repository name.
 * @param {Object} attributes - Additional attributes.
 * @param {Function} fn - GitHub operation function.
 * @returns {Promise<any>} Result of the operation.
 */
export async function traceGitHubOperation(operation, repository, attributes, fn) {
  return await withSpan(
    `github.${operation}`,
    {
      [AGENT_ATTRIBUTES.GITHUB_REPO]: repository,
      [AGENT_ATTRIBUTES.OPERATION_TYPE]: 'github_operation',
      ...attributes,
    },
    fn
  );
}

/**
 * Trace a file operation.
 *
 * @param {string} operation - Operation name (read, write, delete, etc.).
 * @param {string} filePath - File path.
 * @param {Object} attributes - Additional attributes.
 * @param {Function} fn - File operation function.
 * @returns {Promise<any>} Result of the operation.
 */
export async function traceFileOperation(operation, filePath, attributes, fn) {
  return await withSpan(
    `file.${operation}`,
    {
      [AGENT_ATTRIBUTES.FILE_PATH]: filePath,
      [AGENT_ATTRIBUTES.FILE_OPERATION]: operation,
      [AGENT_ATTRIBUTES.OPERATION_TYPE]: 'file_operation',
      ...attributes,
    },
    fn
  );
}

/**
 * Trace an archive operation.
 *
 * @param {string} operation - Operation name.
 * @param {string} archivePath - Archive path.
 * @param {Object} attributes - Additional attributes.
 * @param {Function} fn - Archive operation function.
 * @returns {Promise<any>} Result of the operation.
 */
export async function traceArchiveOperation(operation, archivePath, attributes, fn) {
  return await withSpan(
    `archive.${operation}`,
    {
      [AGENT_ATTRIBUTES.ARCHIVE_PATH]: archivePath,
      [AGENT_ATTRIBUTES.OPERATION_TYPE]: 'archive_operation',
      ...attributes,
    },
    fn
  );
}

/**
 * Add an event to the current span.
 *
 * @param {string} name - Event name.
 * @param {Object} attributes - Event attributes.
 */
export function addSpanEvent(name, attributes = {}) {
  if (!isEnabled) return;

  const span = trace.getActiveSpan();
  if (span) {
    span.addEvent(name, attributes);
  }
}

/**
 * Set an attribute on the current span.
 *
 * @param {string} key - Attribute key.
 * @param {any} value - Attribute value.
 */
export function setSpanAttribute(key, value) {
  if (!isEnabled) return;

  const span = trace.getActiveSpan();
  if (span && value !== undefined && value !== null) {
    span.setAttribute(key, value);
  }
}

export default {
  initializeTracing,
  shutdownTracing,
  getTracer,
  withSpan,
  traceCommand,
  traceServiceOperation,
  traceGitHubOperation,
  traceFileOperation,
  traceArchiveOperation,
  addSpanEvent,
  setSpanAttribute,
  AGENT_ATTRIBUTES,
};
