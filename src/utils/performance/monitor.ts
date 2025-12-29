/**
 * Performance Monitoring Utilities
 *
 * Provides tools to measure and log performance metrics during build time.
 *
 * @module utils/performance
 */

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
   */
  start(name: string): void {
    this.metrics.set(name, {
      name,
      startTime: Date.now(),
    });
  }

  /**
   * End measuring a named operation
   */
  end(name: string): number | null {
    const metric = this.metrics.get(name);
    if (!metric) {
      console.warn(`[Performance] No start time found for: ${name}`);
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
   * Measure an async operation
   */
  async measure<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.start(name);
    try {
      const result = await fn();
      return result;
    } finally {
      const duration = this.end(name);
      console.log(`[Performance] ${name}: ${duration}ms`);
    }
  }

  /**
   * Measure a sync operation
   */
  measureSync<T>(name: string, fn: () => T): T {
    this.start(name);
    try {
      const result = fn();
      return result;
    } finally {
      const duration = this.end(name);
      console.log(`[Performance] ${name}: ${duration}ms`);
    }
  }

  /**
   * Get all metrics
   */
  getMetrics(): PerformanceMetrics[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Get total duration of all measured operations
   */
  getTotalDuration(): number {
    return Array.from(this.metrics.values()).reduce((total, metric) => {
      return total + (metric.duration || 0);
    }, 0);
  }

  /**
   * Print a summary of all metrics
   */
  printSummary(): void {
    const metrics = this.getMetrics().filter((m) => m.duration !== undefined);

    if (metrics.length === 0) {
      console.log("[Performance] No metrics recorded");
      return;
    }

    console.log("\n[Performance] Summary:");
    console.log("━".repeat(60));

    // Sort by duration (longest first)
    metrics.sort((a, b) => (b.duration || 0) - (a.duration || 0));

    metrics.forEach((metric) => {
      const duration = metric.duration?.toFixed(2) || "N/A";
      console.log(`  ${metric.name.padEnd(40)} ${duration.padStart(8)}ms`);
    });

    console.log("━".repeat(60));
    console.log(`  ${"TOTAL".padEnd(40)} ${this.getTotalDuration().toFixed(2).padStart(8)}ms`);
    console.log("");
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear();
  }
}

/**
 * Global performance monitor instance
 */
export const performanceMonitor = new PerformanceMonitor();
