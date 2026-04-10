/**
 * SQLite Trace Query Utilities
 *
 * Utilities for querying and analyzing traces stored in SQLite.
 *
 * @module src/exporters/sqlite-query
 */

import Database from 'better-sqlite3';
import { existsSync } from 'fs';

/**
 * Query interface for SQLite trace database.
 */
export class SQLiteTraceQuery {
  /**
   * Create a new query interface.
   *
   * @param {string} dbPath - Path to SQLite database.
   */
  constructor(dbPath) {
    if (!existsSync(dbPath)) {
      throw new Error(`Database not found: ${dbPath}`);
    }
    this.db = new Database(dbPath, { readonly: true });
  }

  /**
   * Get all traces (unique trace IDs).
   *
   * @param {Object} options - Query options.
   * @param {number} [options.limit=100] - Maximum number of traces.
   * @returns {Array} Array of trace summaries.
   */
  getTraces(options = {}) {
    const { limit = 100 } = options;

    const query = `
      SELECT 
        trace_id,
        MIN(start_time) as start_time,
        MAX(end_time) as end_time,
        COUNT(*) as span_count,
        SUM(CASE WHEN status_code = 2 THEN 1 ELSE 0 END) as error_count,
        service_name
      FROM spans
      GROUP BY trace_id
      ORDER BY start_time DESC
      LIMIT ?
    `;

    return this.db.prepare(query).all(limit);
  }

  /**
   * Get spans for a specific trace.
   *
   * @param {string} traceId - Trace ID.
   * @returns {Array} Array of spans.
   */
  getSpansByTrace(traceId) {
    const query = `
      SELECT * FROM spans
      WHERE trace_id = ?
      ORDER BY start_time ASC
    `;

    const spans = this.db.prepare(query).all(traceId);

    // Enrich with attributes
    for (const span of spans) {
      span.attributes = this.getSpanAttributes(span.span_id);
      span.events = this.getSpanEvents(span.span_id);
      span.links = this.getSpanLinks(span.span_id);
    }

    return spans;
  }

  /**
   * Get attributes for a specific span.
   *
   * @param {string} spanId - Span ID.
   * @returns {Object} Attributes object.
   */
  getSpanAttributes(spanId) {
    const query = `
      SELECT key, value, value_type
      FROM span_attributes
      WHERE span_id = ?
    `;

    const rows = this.db.prepare(query).all(spanId);
    const attributes = {};

    for (const row of rows) {
      // Parse value based on type
      let value = row.value;
      if (row.value_type === 'number') {
        value = parseFloat(value);
      } else if (row.value_type === 'boolean') {
        value = value === 'true';
      } else if (row.value_type === 'object') {
        try {
          value = JSON.parse(value);
        } catch (e) {
          // Keep as string if parsing fails
        }
      }
      attributes[row.key] = value;
    }

    return attributes;
  }

  /**
   * Get events for a specific span.
   *
   * @param {string} spanId - Span ID.
   * @returns {Array} Array of events.
   */
  getSpanEvents(spanId) {
    const query = `
      SELECT name, timestamp, attributes
      FROM span_events
      WHERE span_id = ?
      ORDER BY timestamp ASC
    `;

    const events = this.db.prepare(query).all(spanId);
    return events.map(event => ({
      ...event,
      attributes: JSON.parse(event.attributes),
    }));
  }

  /**
   * Get links for a specific span.
   *
   * @param {string} spanId - Span ID.
   * @returns {Array} Array of links.
   */
  getSpanLinks(spanId) {
    const query = `
      SELECT trace_id, span_id_linked, attributes
      FROM span_links
      WHERE span_id = ?
    `;

    const links = this.db.prepare(query).all(spanId);
    return links.map(link => ({
      ...link,
      attributes: JSON.parse(link.attributes),
    }));
  }

  /**
   * Search spans by attributes.
   *
   * @param {Object} attributeFilters - Key-value filters.
   * @param {Object} options - Query options.
   * @returns {Array} Matching spans.
   */
  searchByAttributes(attributeFilters, options = {}) {
    const { limit = 100 } = options;
    const conditions = [];
    const params = [];

    for (const [key, value] of Object.entries(attributeFilters)) {
      conditions.push(`
        span_id IN (
          SELECT span_id FROM span_attributes
          WHERE key = ? AND value LIKE ?
        )
      `);
      params.push(key, `%${value}%`);
    }

    const query = `
      SELECT * FROM spans
      WHERE ${conditions.join(' AND ')}
      ORDER BY start_time DESC
      LIMIT ?
    `;

    params.push(limit);
    return this.db.prepare(query).all(...params);
  }

  /**
   * Get performance statistics.
   *
   * @param {Object} options - Query options.
   * @returns {Object} Performance statistics.
   */
  getPerformanceStats(options = {}) {
    const { serviceName = null, timeRange = null } = options;
    let query = `
      SELECT 
        service_name,
        COUNT(*) as total_spans,
        AVG(duration_ms) as avg_duration_ms,
        MIN(duration_ms) as min_duration_ms,
        MAX(duration_ms) as max_duration_ms,
        PERCENTILE(duration_ms, 0.5) as p50_duration_ms,
        PERCENTILE(duration_ms, 0.95) as p95_duration_ms,
        PERCENTILE(duration_ms, 0.99) as p99_duration_ms,
        SUM(CASE WHEN status_code = 2 THEN 1 ELSE 0 END) as error_count
      FROM spans
      WHERE 1=1
    `;

    const params = [];
    if (serviceName) {
      query += ' AND service_name = ?';
      params.push(serviceName);
    }

    if (timeRange) {
      query += ' AND start_time >= ?';
      params.push(timeRange);
    }

    query += ' GROUP BY service_name';

    return this.db.prepare(query).all(...params);
  }

  /**
   * Get error spans.
   *
   * @param {Object} options - Query options.
   * @returns {Array} Error spans.
   */
  getErrors(options = {}) {
    const { limit = 50 } = options;

    const query = `
      SELECT * FROM spans
      WHERE status_code = 2
      ORDER BY start_time DESC
      LIMIT ?
    `;

    const spans = this.db.prepare(query).all(limit);

    // Enrich with attributes
    for (const span of spans) {
      span.attributes = this.getSpanAttributes(span.span_id);
    }

    return spans;
  }

  /**
   * Get database statistics.
   *
   * @returns {Object} Database statistics.
   */
  getStats() {
    const stats = {};

    stats.totalSpans = this.db.prepare('SELECT COUNT(*) as count FROM spans').get().count;
    stats.totalTraces = this.db.prepare('SELECT COUNT(DISTINCT trace_id) as count FROM spans').get().count;
    stats.totalAttributes = this.db.prepare('SELECT COUNT(*) as count FROM span_attributes').get().count;
    stats.totalEvents = this.db.prepare('SELECT COUNT(*) as count FROM span_events').get().count;
    
    const dbSize = this.db.prepare("SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()").get();
    stats.databaseSizeBytes = dbSize.size;
    stats.databaseSizeMB = (dbSize.size / 1024 / 1024).toFixed(2);

    return stats;
  }

  /**
   * Close database connection.
   */
  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

export default SQLiteTraceQuery;
