/**
 * SQLite Span Exporter for OpenTelemetry
 *
 * Custom exporter that stores telemetry spans in a SQLite database
 * for persistent, queryable trace storage in Devpod environments.
 *
 * @module src/exporters/sqlite-exporter
 */

import Database from 'better-sqlite3';
import { ExportResultCode } from '@opentelemetry/core';
import { hrTimeToMilliseconds } from '@opentelemetry/core';
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import logger from '../ui/logger.js';

/**
 * SQLite-based span exporter for persistent trace storage.
 */
export class SQLiteSpanExporter {
  /**
   * Create a new SQLite span exporter.
   *
   * @param {Object} options - Configuration options.
   * @param {string} [options.dbPath='./traces.db'] - Path to SQLite database file.
   * @param {boolean} [options.verbose=false] - Enable verbose logging.
   * @param {number} [options.maxSpans=50000] - Maximum number of spans to keep (auto-cleanup).
   * @param {number} [options.maxDatabaseSizeMB=100] - Maximum database size in MB before cleanup.
   * @param {number} [options.retentionDays=7] - Number of days to retain traces.
   */
  constructor(options = {}) {
    this.dbPath = options.dbPath || './traces.db';
    this.verbose = options.verbose || false;
    this.maxSpans = options.maxSpans || 50000; // Reduced for VM constraints
    this.maxDatabaseSizeMB = options.maxDatabaseSizeMB || 100; // 100MB limit
    this.retentionDays = options.retentionDays || 7; // 7 days retention
    this.db = null;
    this.initialized = false;
    this.lastCleanupTime = 0;
    this.cleanupIntervalMs = 5 * 60 * 1000; // Check every 5 minutes

    this._initialize();
  }

  /**
   * Initialize database and create schema.
   * @private
   */
  _initialize() {
    try {
      // Ensure directory exists
      const dir = dirname(this.dbPath);
      if (dir !== '.' && !existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }

      // Open database connection
      this.db = new Database(this.dbPath);
      
      // Optimize for low-memory VM environments
      this.db.pragma('journal_mode = WAL'); // Write-Ahead Logging for better concurrency
      this.db.pragma('synchronous = NORMAL'); // Balanced durability/performance
      this.db.pragma('cache_size = -2000'); // 2MB cache (negative = KB)
      this.db.pragma('temp_store = MEMORY'); // Use memory for temp storage
      this.db.pragma('mmap_size = 4194304'); // 4MB memory-mapped I/O
      this.db.pragma('page_size = 4096'); // Standard page size
      
      // Enable automatic index
      this.db.pragma('automatic_index = ON');

      // Create schema
      this._createSchema();
      this.initialized = true;

      if (this.verbose) {
        logger.debug(`SQLite trace database initialized: ${this.dbPath}`);
      }
    } catch (error) {
      logger.error('Failed to initialize SQLite exporter', { error });
      throw error;
    }
  }

  /**
   * Create database schema for storing spans.
   * @private
   */
  _createSchema() {
    // Spans table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS spans (
        span_id TEXT PRIMARY KEY,
        trace_id TEXT NOT NULL,
        parent_span_id TEXT,
        name TEXT NOT NULL,
        kind INTEGER NOT NULL,
        start_time INTEGER NOT NULL,
        end_time INTEGER NOT NULL,
        duration_ms REAL NOT NULL,
        status_code INTEGER,
        status_message TEXT,
        service_name TEXT,
        service_version TEXT,
        created_at INTEGER DEFAULT (strftime('%s', 'now'))
      );
    `);

    // Attributes table (normalized for better querying)
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS span_attributes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        span_id TEXT NOT NULL,
        key TEXT NOT NULL,
        value TEXT,
        value_type TEXT,
        FOREIGN KEY (span_id) REFERENCES spans(span_id) ON DELETE CASCADE
      );
    `);

    // Events table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS span_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        span_id TEXT NOT NULL,
        name TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        attributes TEXT,
        FOREIGN KEY (span_id) REFERENCES spans(span_id) ON DELETE CASCADE
      );
    `);

    // Links table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS span_links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        span_id TEXT NOT NULL,
        trace_id TEXT NOT NULL,
        span_id_linked TEXT NOT NULL,
        attributes TEXT,
        FOREIGN KEY (span_id) REFERENCES spans(span_id) ON DELETE CASCADE
      );
    `);

    // Create indexes for better query performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_spans_trace_id ON spans(trace_id);
      CREATE INDEX IF NOT EXISTS idx_spans_start_time ON spans(start_time);
      CREATE INDEX IF NOT EXISTS idx_spans_service_name ON spans(service_name);
      CREATE INDEX IF NOT EXISTS idx_span_attributes_key ON span_attributes(key);
      CREATE INDEX IF NOT EXISTS idx_span_attributes_span_id ON span_attributes(span_id);
    `);
  }

  /**
   * Export spans to SQLite database.
   *
   * @param {import('@opentelemetry/sdk-trace-base').ReadableSpan[]} spans - Spans to export.
   * @param {Function} resultCallback - Callback for export result.
   */
  export(spans, resultCallback) {
    if (!this.initialized || !this.db) {
      resultCallback({ code: ExportResultCode.FAILED, error: new Error('Exporter not initialized') });
      return;
    }

    try {
      // Use transaction for better performance
      const transaction = this.db.transaction((spans) => {
        for (const span of spans) {
          this._insertSpan(span);
        }
      });

      transaction(spans);

      // Auto-cleanup if needed
      this._autoCleanup();

      if (this.verbose) {
        logger.debug(`Exported ${spans.length} spans to SQLite`);
      }

      resultCallback({ code: ExportResultCode.SUCCESS });
    } catch (error) {
      logger.error('Failed to export spans to SQLite', { error });
      resultCallback({ code: ExportResultCode.FAILED, error });
    }
  }

  /**
   * Insert a single span into the database.
   * @private
   */
  _insertSpan(span) {
    const spanId = span.spanContext().spanId;
    const traceId = span.spanContext().traceId;
    const parentSpanId = span.parentSpanId || null;

    // Extract resource attributes
    const serviceName = span.resource.attributes['service.name'] || 'unknown';
    const serviceVersion = span.resource.attributes['service.version'] || null;

    // Calculate duration
    const startTimeMs = hrTimeToMilliseconds(span.startTime);
    const endTimeMs = hrTimeToMilliseconds(span.endTime);
    const durationMs = endTimeMs - startTimeMs;

    // Insert span
    const insertSpan = this.db.prepare(`
      INSERT INTO spans (
        span_id, trace_id, parent_span_id, name, kind,
        start_time, end_time, duration_ms,
        status_code, status_message,
        service_name, service_version
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(span_id) DO UPDATE SET
        end_time = excluded.end_time,
        duration_ms = excluded.duration_ms,
        status_code = excluded.status_code,
        status_message = excluded.status_message
    `);

    insertSpan.run(
      spanId,
      traceId,
      parentSpanId,
      span.name,
      span.kind,
      startTimeMs,
      endTimeMs,
      durationMs,
      span.status.code,
      span.status.message || null,
      serviceName,
      serviceVersion
    );

    // Insert attributes
    const insertAttribute = this.db.prepare(`
      INSERT INTO span_attributes (span_id, key, value, value_type)
      VALUES (?, ?, ?, ?)
    `);

    for (const [key, value] of Object.entries(span.attributes)) {
      const valueType = typeof value;
      const valueStr = valueType === 'object' ? JSON.stringify(value) : String(value);
      insertAttribute.run(spanId, key, valueStr, valueType);
    }

    // Insert events
    if (span.events && span.events.length > 0) {
      const insertEvent = this.db.prepare(`
        INSERT INTO span_events (span_id, name, timestamp, attributes)
        VALUES (?, ?, ?, ?)
      `);

      for (const event of span.events) {
        const eventTime = hrTimeToMilliseconds(event.time);
        const eventAttrs = JSON.stringify(event.attributes || {});
        insertEvent.run(spanId, event.name, eventTime, eventAttrs);
      }
    }

    // Insert links
    if (span.links && span.links.length > 0) {
      const insertLink = this.db.prepare(`
        INSERT INTO span_links (span_id, trace_id, span_id_linked, attributes)
        VALUES (?, ?, ?, ?)
      `);

      for (const link of span.links) {
        const linkAttrs = JSON.stringify(link.attributes || {});
        insertLink.run(
          spanId,
          link.context.traceId,
          link.context.spanId,
          linkAttrs
        );
      }
    }
  }

  /**
   * Auto-cleanup old spans if limits exceeded.
   * Checks both span count and database size, plus retention period.
   * @private
   */
  _autoCleanup() {
    // Rate-limit cleanup checks
    const now = Date.now();
    if (now - this.lastCleanupTime < this.cleanupIntervalMs) {
      return;
    }
    this.lastCleanupTime = now;

    try {
      let cleaned = false;

      // Check span count
      const count = this.db.prepare('SELECT COUNT(*) as count FROM spans').get();
      if (count.count > this.maxSpans) {
        const toDelete = Math.max(count.count - this.maxSpans, Math.floor(this.maxSpans * 0.2));
        this.db.prepare(`
          DELETE FROM spans
          WHERE span_id IN (
            SELECT span_id FROM spans
            ORDER BY start_time ASC
            LIMIT ?
          )
        `).run(toDelete);

        if (this.verbose) {
          logger.debug(`Cleaned up ${toDelete} old spans (count limit)`);
        }
        cleaned = true;
      }

      // Check database size
      const dbStats = this.db.prepare(
        "SELECT page_count * page_size / 1024.0 / 1024.0 as size_mb FROM pragma_page_count(), pragma_page_size()"
      ).get();

      if (dbStats.size_mb > this.maxDatabaseSizeMB) {
        const toDeleteBySize = Math.floor(count.count * 0.3); // Remove 30% of spans
        this.db.prepare(`
          DELETE FROM spans
          WHERE span_id IN (
            SELECT span_id FROM spans
            ORDER BY start_time ASC
            LIMIT ?
          )
        `).run(toDeleteBySize);

        if (this.verbose) {
          logger.debug(`Cleaned up ${toDeleteBySize} old spans (size limit: ${dbStats.size_mb.toFixed(2)}MB)`);
        }
        cleaned = true;
      }

      // Check retention period
      const retentionMs = this.retentionDays * 24 * 60 * 60 * 1000;
      const cutoffTime = Date.now() - retentionMs;
      const deleteByAge = this.db.prepare(`
        DELETE FROM spans
        WHERE start_time < ?
      `).run(cutoffTime);

      if (deleteByAge.changes > 0 && this.verbose) {
        logger.debug(`Cleaned up ${deleteByAge.changes} spans older than ${this.retentionDays} days`);
        cleaned = true;
      }

      // Optimize database after cleanup to reclaim space
      if (cleaned) {
        this.db.pragma('optimize');
        this.db.exec('VACUUM');
        
        if (this.verbose) {
          const newStats = this.db.prepare(
            "SELECT page_count * page_size / 1024.0 / 1024.0 as size_mb FROM pragma_page_count(), pragma_page_size()"
          ).get();
          logger.debug(`Database optimized: ${newStats.size_mb.toFixed(2)}MB`);
        }
      }
    } catch (error) {
      logger.error('Failed to auto-cleanup spans', { error });
    }
  }

  /**
   * Shutdown the exporter and close database connection.
   */
  async shutdown() {
    if (this.db) {
      try {
        this.db.close();
        if (this.verbose) {
          logger.debug('SQLite exporter shutdown complete');
        }
      } catch (error) {
        logger.error('Error closing SQLite database', { error });
      }
    }
  }

  /**
   * Force flush - no-op for SQLite as writes are immediate.
   */
  async forceFlush() {
    // SQLite writes are immediate in WAL mode
    return Promise.resolve();
  }
}

export default SQLiteSpanExporter;
