/**
 * Performance Monitoring System
 *
 * Provides simple, lightweight performance tracking for build-time operations.
 * Measures execution time of key operations to identify bottlenecks and
 * track optimization improvements.
 *
 * **Why We Need This:**
 * During development and optimization, we need to:
 * - Identify slow operations in the build process
 * - Measure impact of performance optimizations
 * - Track performance regressions
 * - Generate reports for documentation
 *
 * **Features:**
 * - Start/end timing with unique operation names
 * - Nested timing support (operations within operations)
 * - Automatic summary generation with breakdown
 * - Helper method for timing async operations
 * - Pretty-printed console output
 *
 * **Usage Pattern:**
 * ```ts
 * // Manual timing
 * performanceMonitor.start('my-operation');
 * await doSomething();
 * performanceMonitor.end('my-operation');
 *
 * // Automatic timing (recommended)
 * const result = await performanceMonitor.measure('my-operation', async () => {
 *   return await doSomething();
 * });
 *
 * // Print summary at end of build
 * performanceMonitor.logSummary();
 * ```
 *
 * **Output Example:**
 * ```
 * [Performance] Summary:
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *   books-es                                    42.00ms
 *   posts-es                                     8.00ms
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *   TOTAL                                      200.00ms
 * ```
 *
 * @module performance/monitor
 */

import { perfLogger } from "../logger";

interface PerformanceMetrics {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map();

  /**
   * Start measuring a named operation
   *
   * Records the start time for a performance measurement.
   * Call end() with the same name to complete the measurement.
   *
   * @param name - Unique identifier for this operation
   */
  start(name: string): void {
    this.metrics.set(name, {
      name,
      startTime: Date.now(),
    });
  }

  /**
   * End measuring a named operation
   *
   * Records the end time and calculates duration.
   * Returns null if no matching start() was found.
   *
   * @param name - Identifier of the operation to complete
   * @returns Duration in milliseconds, or null if operation not found
   */
  end(name: string): number | null {
    const metric = this.metrics.get(name);
    if (!metric) {
      perfLogger.warn(`No start time found for: ${name}`);
      return null;
    }

    const endTime = Date.now();
    const duration = endTime - metric.startTime;

    this.metrics.set(name, {
      ...metric,
      endTime,
      duration,
    });

    return duration;
  }

  /**
   * Measure execution time of an async function
   *
   * Convenience method that automatically handles start/end timing.
   * This is the recommended way to time operations as it ensures
   * proper cleanup even if the operation throws an error.
   *
   * @param name - Identifier for this operation
   * @param fn - Async function to measure
   * @returns The result of the measured function
   *
   * @example
   * ```ts
   * const books = await performanceMonitor.measure('fetch-books', async () => {
   *   return await getAllBooks();
   * });
   * // Timing is automatically recorded
   * ```
   */
  async measure<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.start(name);
    try {
      const result = await fn();
      return result;
    } finally {
      const duration = this.end(name);
      perfLogger.info(`${name}: ${duration}ms`);
    }
  }

  /**
   * Measure execution time of a sync function
   *
   * Like `measure()` but for synchronous operations.
   *
   * @param name - Identifier for this operation
   * @param fn - Synchronous function to measure
   * @returns The result of the measured function
   *
   * @example
   * ```ts
   * const result = performanceMonitor.measureSync('calculate', () => {
   *   return heavyCalculation();
   * });
   * ```
   */
  measureSync<T>(name: string, fn: () => T): T {
    this.start(name);
    try {
      const result = fn();
      return result;
    } finally {
      const duration = this.end(name);
      perfLogger.info(`${name}: ${duration}ms`);
    }
  }

  /**
   * Get all metrics
   *
   * Returns an array of all recorded performance metrics,
   * including both completed and in-progress measurements.
   *
   * @returns Array of performance metrics
   */
  getMetrics(): PerformanceMetrics[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Get total duration of all measured operations
   *
   * Sums up the duration of all completed operations.
   * Useful for getting an overall picture of build time.
   *
   * @returns Total duration in milliseconds
   */
  getTotalDuration(): number {
    return Array.from(this.metrics.values()).reduce((total, metric) => {
      return total + (metric.duration || 0);
    }, 0);
  }

  /**
   * Print a summary of all metrics
   *
   * Outputs a formatted table showing all measured operations,
   * sorted by duration (longest first), with a total at the bottom.
   *
   * Example output:
   * ```
   * [Performance] Summary:
   * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   *   total-route-generation                     64.00ms
   *   routes-es                                  35.00ms
   * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   *   TOTAL                                     192.00ms
   * ```
   */
  printSummary(): void {
    const metrics = this.getMetrics().filter((m) => m.duration !== undefined);

    if (metrics.length === 0) {
      perfLogger.info("No metrics recorded");
      return;
    }

    perfLogger.info("\nSummary:");
    perfLogger.info("━".repeat(60));

    // Sort by duration (longest first)
    metrics.sort((a, b) => (b.duration || 0) - (a.duration || 0));

    metrics.forEach((metric) => {
      const duration = metric.duration?.toFixed(2) || "N/A";
      perfLogger.info(`  ${metric.name.padEnd(40)} ${duration.padStart(8)}ms`);
    });

    perfLogger.info("━".repeat(60));
    perfLogger.info(`  ${"TOTAL".padEnd(40)} ${this.getTotalDuration().toFixed(2).padStart(8)}ms`);
    perfLogger.info("");
  }

  /**
   * Clear all metrics
   *
   * Resets the monitor to initial state, removing all recorded measurements.
   * Useful for starting a fresh measurement session or in test cleanup.
   */
  clear(): void {
    this.metrics.clear();
  }
}

/**
 * Global performance monitor instance
 *
 * Use this singleton instance throughout the application to track
 * performance metrics consistently.
 *
 * @example
 * ```ts
 * import { performanceMonitor } from '@/utils/performance/monitor';
 *
 * performanceMonitor.start('my-operation');
 * await doWork();
 * performanceMonitor.end('my-operation');
 * performanceMonitor.logSummary();
 * ```
 */
export const performanceMonitor = new PerformanceMonitor();
