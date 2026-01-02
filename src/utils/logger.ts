/**
 * Logging utility for environment-aware logging
 *
 * Features:
 * - Only logs in development mode by default
 * - Configurable log levels (debug, info, warn, error)
 * - Prefixed messages for better context
 * - Can be enabled in production via environment variable
 *
 * @example
 * ```typescript
 * import { routingLogger } from '@/utils/logger';
 *
 * routingLogger.info('Generated paths', paths.length);
 * routingLogger.error('Failed to generate routes', error);
 * ```
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LoggerConfig {
  enabled: boolean;
  level: LogLevel;
  prefix?: string;
}

class Logger {
  private config: LoggerConfig;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      enabled: import.meta.env.DEV || import.meta.env.PUBLIC_DEBUG === "true",
      level: (import.meta.env.PUBLIC_LOG_LEVEL as LogLevel) || "info",
      ...config,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) return false;

    const levels: LogLevel[] = ["debug", "info", "warn", "error"];
    const currentLevelIndex = levels.indexOf(this.config.level);
    const requestedLevelIndex = levels.indexOf(level);

    return requestedLevelIndex >= currentLevelIndex;
  }

  private formatMessage(message: string): string {
    return this.config.prefix ? `[${this.config.prefix}] ${message}` : message;
  }

  /**
   * Log a debug message
   * Only shown when log level is 'debug'
   */
  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog("debug")) {
      console.debug(this.formatMessage(message), ...args);
    }
  }

  /**
   * Log an informational message
   * Shown when log level is 'debug' or 'info'
   */
  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog("info")) {
      console.info(this.formatMessage(message), ...args);
    }
  }

  /**
   * Log a warning message
   * Shown when log level is 'debug', 'info', or 'warn'
   */
  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog("warn")) {
      console.warn(this.formatMessage(message), ...args);
    }
  }

  /**
   * Log an error message
   * Always shown (if logging is enabled)
   */
  error(message: string, ...args: unknown[]): void {
    if (this.shouldLog("error")) {
      console.error(this.formatMessage(message), ...args);
    }
  }

  /**
   * Create a child logger with an extended prefix
   */
  child(suffix: string): Logger {
    return new Logger({
      ...this.config,
      prefix: this.config.prefix ? `${this.config.prefix}:${suffix}` : suffix,
    });
  }
}

// Export specialized loggers for different modules
export const routingLogger = new Logger({ prefix: "Routing" });
export const imageLogger = new Logger({ prefix: "Images" });
export const perfLogger = new Logger({ prefix: "Performance" });
export const buildLogger = new Logger({ prefix: "Build" });
export const iconLogger = new Logger({ prefix: "Icons" });
export const themeLogger = new Logger({ prefix: "Theme" });

// Export the Logger class for custom loggers
export { Logger };
export type { LogLevel, LoggerConfig };
