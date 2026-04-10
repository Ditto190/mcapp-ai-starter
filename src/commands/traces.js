/**
 * Traces Command
 *
 * Query and analyze OpenTelemetry traces stored in SQLite.
 *
 * @module src/commands/traces
 */

import { Command } from 'commander';
import { SQLiteTraceQuery } from '../exporters/sqlite-query.js';
import logger from '../ui/logger.js';
import chalk from 'chalk';
import { homedir } from 'os';
import { join } from 'path';
import { existsSync } from 'fs';
import { 
  getTraceDbSize, 
  checkResourceHealth, 
  getSystemMemory, 
  getDiskUsage 
} from '../utils/resource-monitor.js';

/**
 * Traces command - query and analyze trace data
 */
export const tracesCommand = new Command('traces')
  .description('Query and analyze OpenTelemetry traces')
  .option('-d, --database <path>', 'Path to SQLite trace database', join(process.env.HOME || homedir(), '.apm', 'traces.db'))
  .option('-l, --list', 'List recent traces')
  .option('-t, --trace <traceId>', 'Show details for a specific trace')
  .option('-e, --errors', 'Show recent error spans')
  .option('-s, --stats', 'Show database statistics')
  .option('--search <key=value>', 'Search spans by attribute (e.g., command.name=init)')
  .option('--limit <n>', 'Limit number of results', '20')
  .action(async (options) => {
    try {
      const dbPath = options.database;

      // Check if database exists
      if (!existsSync(dbPath)) {
        logger.error(`Trace database not found: ${dbPath}`);
        logger.info('Run some commands with tracing enabled to populate the database.');
        logger.info(`Set OTEL_ENABLED=true and OTEL_EXPORTER_TYPE=sqlite`);
        process.exit(1);
      }

      const query = new SQLiteTraceQuery(dbPath);
      const limit = parseInt(options.limit, 10);

      // List traces
      if (options.list || (!options.trace && !options.errors && !options.stats && !options.search)) {
        logger.info(chalk.bold.cyan('\n📊 Recent Traces\n'));
        const traces = query.getTraces({ limit });

        if (traces.length === 0) {
          logger.info('No traces found.');
          query.close();
          return;
        }

        console.log(chalk.gray('┌─────────────────────────────────────────────────────────────────────┐'));
        for (const trace of traces) {
          const startTime = new Date(trace.start_time).toISOString();
          const duration = trace.end_time - trace.start_time;
          const hasErrors = trace.error_count > 0;

          console.log(chalk.gray('│'));
          console.log(
            chalk.gray('│ ') +
            (hasErrors ? chalk.red('❌') : chalk.green('✓')) + ' ' +
            chalk.bold(trace.trace_id.substring(0, 16)) +
            chalk.gray(' │ ') +
            chalk.cyan(`${trace.span_count} spans`) +
            chalk.gray(' │ ') +
            chalk.yellow(`${duration.toFixed(0)}ms`) +
            chalk.gray(' │ ') +
            chalk.blue(trace.service_name)
          );
          console.log(chalk.gray('│   ') + chalk.gray(`Started: ${startTime}`));
          if (hasErrors) {
            console.log(chalk.gray('│   ') + chalk.red(`Errors: ${trace.error_count}`));
          }
        }
        console.log(chalk.gray('└─────────────────────────────────────────────────────────────────────┘'));
        console.log();
      }

      // Show trace details
      if (options.trace) {
        logger.info(chalk.bold.cyan(`\n🔍 Trace Details: ${options.trace}\n`));
        const spans = query.getSpansByTrace(options.trace);

        if (spans.length === 0) {
          logger.warn('Trace not found.');
          query.close();
          return;
        }

        for (const span of spans) {
          const indent = '  '.repeat((span.parent_span_id ? 1 : 0));
          const duration = span.duration_ms.toFixed(2);
          const hasError = span.status_code === 2;

          console.log(
            indent +
            (hasError ? chalk.red('❌') : chalk.green('✓')) + ' ' +
            chalk.bold(span.name) +
            chalk.gray(` [${span.span_id.substring(0, 8)}]`) +
            chalk.yellow(` ${duration}ms`)
          );

          // Show attributes
          if (Object.keys(span.attributes).length > 0) {
            for (const [key, value] of Object.entries(span.attributes)) {
              const displayValue = typeof value === 'string' && value.length > 50 
                ? value.substring(0, 50) + '...' 
                : value;
              console.log(indent + '  ' + chalk.gray(`${key}: `) + chalk.white(displayValue));
            }
          }

          // Show error details
          if (hasError && span.status_message) {
            console.log(indent + '  ' + chalk.red(`Error: ${span.status_message}`));
          }

          // Show events
          if (span.events && span.events.length > 0) {
            for (const event of span.events) {
              console.log(indent + '  ' + chalk.magenta(`📌 ${event.name}`));
            }
          }

          console.log();
        }
      }

      // Show errors
      if (options.errors) {
        logger.info(chalk.bold.red('\n❌ Recent Errors\n'));
        const errors = query.getErrors({ limit });

        if (errors.length === 0) {
          logger.info('No errors found.');
          query.close();
          return;
        }

        for (const span of errors) {
          const startTime = new Date(span.start_time).toISOString();
          console.log(chalk.red('❌') + ' ' + chalk.bold(span.name));
          console.log('   ' + chalk.gray(`Trace: ${span.trace_id}`));
          console.log('   ' + chalk.gray(`Span: ${span.span_id}`));
          console.log('   ' + chalk.gray(`Time: ${startTime}`));
          if (span.status_message) {
            console.log('   ' + chalk.red(`Error: ${span.status_message}`));
          }

          // Show error attributes
          const errorMsg = span.attributes['error.message'];
          const errorType = span.attributes['error.type'];
          if (errorMsg) {
            console.log('   ' + chalk.red(`Message: ${errorMsg}`));
          }
          if (errorType) {
            console.log('   ' + chalk.red(`Type: ${errorType}`));
          }

          console.log();
        }
      }

      // Show statistics
      if (options.stats) {
        logger.info(chalk.bold.cyan('\n📈 Database Statistics\n'));
        const stats = query.getStats();

        console.log(chalk.cyan('Total Spans:      ') + chalk.white(stats.totalSpans.toLocaleString()));
        console.log(chalk.cyan('Total Traces:     ') + chalk.white(stats.totalTraces.toLocaleString()));
        console.log(chalk.cyan('Total Attributes: ') + chalk.white(stats.totalAttributes.toLocaleString()));
        console.log(chalk.cyan('Total Events:     ') + chalk.white(stats.totalEvents.toLocaleString()));
        console.log(chalk.cyan('Database Size:    ') + chalk.white(`${stats.databaseSizeMB} MB`));
        
        // Show resource health
        const dbSize = getTraceDbSize(dbPath);
        if (dbSize) {
          console.log(chalk.cyan('Last Modified:    ') + chalk.white(dbSize.modified.toISOString()));
        }
        
        console.log();
        
        logger.info(chalk.bold.cyan('🔧 Resource Health\n'));
        const health = checkResourceHealth();
        
        if (health.metrics.systemMemory) {
          const mem = health.metrics.systemMemory;
          const memColor = parseFloat(mem.usedPercent) > 80 ? chalk.red : chalk.green;
          console.log(chalk.cyan('System Memory:    ') + memColor(`${mem.usedMB}/${mem.totalMB} MB (${mem.usedPercent}%)`));
        }
        
        if (health.metrics.disk) {
          const disk = health.metrics.disk;
          const diskColor = parseFloat(disk.usedPercent) > 80 ? chalk.red : chalk.green;
          console.log(chalk.cyan('Disk Usage:       ') + diskColor(`${disk.usedMB}/${disk.totalMB} MB (${disk.usedPercent})`));
        }
        
        if (!health.healthy) {
          console.log();
          logger.warn(chalk.yellow('⚠️  Resource Warnings:'));
          for (const warning of health.warnings) {
            console.log(chalk.yellow('  - ' + warning));
          }
        }
        
        console.log();

        logger.info(chalk.bold.cyan('📊 Performance Statistics\n'));
        const perfStats = query.getPerformanceStats();

        for (const stat of perfStats) {
          console.log(chalk.bold(stat.service_name));
          console.log('  ' + chalk.gray('Spans:        ') + stat.total_spans.toLocaleString());
          console.log('  ' + chalk.gray('Avg Duration: ') + stat.avg_duration_ms.toFixed(2) + 'ms');
          console.log('  ' + chalk.gray('Min Duration: ') + stat.min_duration_ms.toFixed(2) + 'ms');
          console.log('  ' + chalk.gray('Max Duration: ') + stat.max_duration_ms.toFixed(2) + 'ms');
          if (stat.error_count > 0) {
            console.log('  ' + chalk.red('Errors:       ') + stat.error_count);
          }
          console.log();
        }
      }

      // Search by attributes
      if (options.search) {
        const [key, value] = options.search.split('=');
        if (!key || !value) {
          logger.error('Invalid search format. Use: --search key=value');
          query.close();
          process.exit(1);
        }

        logger.info(chalk.bold.cyan(`\n🔍 Search Results: ${key}=${value}\n`));
        const results = query.searchByAttributes({ [key]: value }, { limit });

        if (results.length === 0) {
          logger.info('No matching spans found.');
          query.close();
          return;
        }

        for (const span of results) {
          const startTime = new Date(span.start_time).toISOString();
          const hasError = span.status_code === 2;

          console.log(
            (hasError ? chalk.red('❌') : chalk.green('✓')) + ' ' +
            chalk.bold(span.name) +
            chalk.gray(` [${span.trace_id.substring(0, 16)}]`) +
            chalk.yellow(` ${span.duration_ms.toFixed(2)}ms`)
          );
          console.log('   ' + chalk.gray(`Time: ${startTime}`));
          console.log();
        }
      }

      query.close();
    } catch (error) {
      logger.error('Failed to query traces', { error });
      process.exit(1);
    }
  });

export default tracesCommand;
