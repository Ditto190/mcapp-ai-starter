/**
 * Resource Monitoring Utilities
 *
 * Monitor system resources and trace database health for VM environments.
 *
 * @module src/utils/resource-monitor
 */

import { existsSync, statSync } from 'fs';
import { execSync } from 'child_process';
import logger from '../ui/logger.js';

/**
 * Get memory usage statistics.
 *
 * @returns {Object} Memory usage information.
 */
export function getMemoryUsage() {
  const usage = process.memoryUsage();
  return {
    heapUsedMB: (usage.heapUsed / 1024 / 1024).toFixed(2),
    heapTotalMB: (usage.heapTotal / 1024 / 1024).toFixed(2),
    rssMB: (usage.rss / 1024 / 1024).toFixed(2),
    externalMB: (usage.external / 1024 / 1024).toFixed(2),
  };
}

/**
 * Get system memory information (Linux only).
 *
 * @returns {Object|null} System memory information or null if unavailable.
 */
export function getSystemMemory() {
  try {
    if (process.platform === 'linux') {
      const meminfo = execSync('cat /proc/meminfo', { encoding: 'utf8' });
      const lines = meminfo.split('\n');
      
      const getValue = (label) => {
        const line = lines.find(l => l.startsWith(label));
        if (line) {
          const match = line.match(/(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        }
        return 0;
      };

      const totalKB = getValue('MemTotal:');
      const availableKB = getValue('MemAvailable:') || getValue('MemFree:');
      const usedKB = totalKB - availableKB;

      return {
        totalMB: (totalKB / 1024).toFixed(0),
        usedMB: (usedKB / 1024).toFixed(0),
        availableMB: (availableKB / 1024).toFixed(0),
        usedPercent: ((usedKB / totalKB) * 100).toFixed(1),
      };
    }
  } catch (error) {
    logger.debug('Could not read system memory', { error: error.message });
  }
  return null;
}

/**
 * Get disk usage for a path.
 *
 * @param {string} path - Path to check.
 * @returns {Object|null} Disk usage information or null if unavailable.
 */
export function getDiskUsage(path) {
  try {
    if (process.platform === 'linux' && existsSync(path)) {
      const df = execSync(`df -k "${path}" | tail -1`, { encoding: 'utf8' });
      const parts = df.trim().split(/\s+/);
      
      if (parts.length >= 5) {
        const totalKB = parseInt(parts[1], 10);
        const usedKB = parseInt(parts[2], 10);
        const availableKB = parseInt(parts[3], 10);
        
        return {
          totalMB: (totalKB / 1024).toFixed(0),
          usedMB: (usedKB / 1024).toFixed(0),
          availableMB: (availableKB / 1024).toFixed(0),
          usedPercent: parts[4],
        };
      }
    }
  } catch (error) {
    logger.debug('Could not read disk usage', { error: error.message });
  }
  return null;
}

/**
 * Get trace database file size.
 *
 * @param {string} dbPath - Path to trace database.
 * @returns {Object|null} Database file information.
 */
export function getTraceDbSize(dbPath) {
  try {
    if (existsSync(dbPath)) {
      const stats = statSync(dbPath);
      return {
        sizeMB: (stats.size / 1024 / 1024).toFixed(2),
        sizeBytes: stats.size,
        modified: stats.mtime,
      };
    }
  } catch (error) {
    logger.debug('Could not read trace database size', { error: error.message });
  }
  return null;
}

/**
 * Check if system resources are healthy.
 *
 * @param {Object} options - Check options.
 * @param {number} [options.memoryThresholdPercent=90] - Memory usage threshold.
 * @param {number} [options.diskThresholdPercent=90] - Disk usage threshold.
 * @returns {Object} Health check results.
 */
export function checkResourceHealth(options = {}) {
  const {
    memoryThresholdPercent = 90,
    diskThresholdPercent = 90,
  } = options;

  const health = {
    healthy: true,
    warnings: [],
    metrics: {},
  };

  // Check process memory
  const procMemory = getMemoryUsage();
  health.metrics.processMemory = procMemory;

  // Check system memory
  const sysMemory = getSystemMemory();
  if (sysMemory) {
    health.metrics.systemMemory = sysMemory;
    const usedPercent = parseFloat(sysMemory.usedPercent);
    
    if (usedPercent > memoryThresholdPercent) {
      health.healthy = false;
      health.warnings.push(
        `System memory usage high: ${usedPercent.toFixed(1)}% (threshold: ${memoryThresholdPercent}%)`
      );
    }
  }

  // Check disk usage
  const diskUsage = getDiskUsage(process.cwd());
  if (diskUsage) {
    health.metrics.disk = diskUsage;
    const usedPercent = parseFloat(diskUsage.usedPercent);
    
    if (usedPercent > diskThresholdPercent) {
      health.healthy = false;
      health.warnings.push(
        `Disk usage high: ${usedPercent.toFixed(1)}% (threshold: ${diskThresholdPercent}%)`
      );
    }
  }

  return health;
}

/**
 * Log resource usage information.
 *
 * @param {Object} options - Logging options.
 */
export function logResourceUsage(options = {}) {
  const { verbose = false } = options;

  if (!verbose && process.env.DEBUG !== 'true') {
    return;
  }

  const procMemory = getMemoryUsage();
  logger.debug('Process Memory:', procMemory);

  const sysMemory = getSystemMemory();
  if (sysMemory) {
    logger.debug('System Memory:', sysMemory);
  }

  const diskUsage = getDiskUsage(process.cwd());
  if (diskUsage) {
    logger.debug('Disk Usage:', diskUsage);
  }
}

export default {
  getMemoryUsage,
  getSystemMemory,
  getDiskUsage,
  getTraceDbSize,
  checkResourceHealth,
  logResourceUsage,
};
