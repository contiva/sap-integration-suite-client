/**
 * Structured logging utility for cache operations
 * 
 * Provides structured logging with log levels (INFO, DEBUG, WARN, ERROR)
 * and support for metrics (counts, durations, etc.)
 * 
 * @module cache-logger
 */

/**
 * Log levels
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

/**
 * Log entry structure
 */
export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: string;
  metrics?: Record<string, number | string | boolean>;
  error?: Error;
  timestamp: number;
}

/**
 * Logger configuration
 */
interface LoggerConfig {
  minLevel: LogLevel;
  enableStructured: boolean;
  enableConsole: boolean;
}

/**
 * Structured logger for cache operations
 */
class CacheLogger {
  private config: LoggerConfig;
  private readonly debugMode: boolean;

  constructor() {
    this.debugMode = process.env.DEBUG === 'true';
    this.config = {
      minLevel: this.debugMode ? LogLevel.DEBUG : LogLevel.INFO,
      enableStructured: true,
      enableConsole: true,
    };
  }

  /**
   * Logs a message with the specified level
   */
  private log(level: LogLevel, message: string, context?: string, metrics?: Record<string, any>, error?: Error): void {
    if (level < this.config.minLevel) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      context,
      metrics,
      error,
      timestamp: Date.now(),
    };

    // Console output (backward compatible)
    if (this.config.enableConsole) {
      this.logToConsole(entry);
    }

    // Structured output (JSON format)
    if (this.config.enableStructured && this.shouldLogStructured(level)) {
      this.logStructured(entry);
    }
  }

  /**
   * Logs to console in a human-readable format (backward compatible)
   */
  private logToConsole(entry: LogEntry): void {
    const prefix = entry.context ? `[${entry.context}]` : '[CacheLogger]';
    const metricsStr = entry.metrics ? ` ${JSON.stringify(entry.metrics)}` : '';
    const errorStr = entry.error ? ` Error: ${entry.error.message}` : '';

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(`${prefix} ${entry.message}${metricsStr}${errorStr}`);
        break;
      case LogLevel.INFO:
        console.log(`${prefix} ${entry.message}${metricsStr}${errorStr}`);
        break;
      case LogLevel.WARN:
        console.warn(`${prefix} ${entry.message}${metricsStr}${errorStr}`);
        break;
      case LogLevel.ERROR:
        console.error(`${prefix} ${entry.message}${metricsStr}${errorStr}`, entry.error || '');
        break;
    }
  }

  /**
   * Logs structured output (JSON format)
   */
  private logStructured(entry: LogEntry): void {
    const levelName = LogLevel[entry.level];
    const structured = {
      level: levelName,
      message: entry.message,
      context: entry.context,
      ...entry.metrics,
      timestamp: new Date(entry.timestamp).toISOString(),
      ...(entry.error && {
        error: {
          message: entry.error.message,
          stack: entry.error.stack,
        },
      }),
    };

    // Output as JSON (can be parsed by log aggregation tools)
    console.log(JSON.stringify(structured));
  }

  /**
   * Determines if structured logging should be used for this level
   */
  private shouldLogStructured(level: LogLevel): boolean {
    // Only log structured for INFO and above (DEBUG is too verbose)
    return level >= LogLevel.INFO;
  }

  /**
   * Logs a DEBUG message
   */
  debug(message: string, context?: string, metrics?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context, metrics);
  }

  /**
   * Logs an INFO message with optional metrics
   */
  info(message: string, context?: string, metrics?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context, metrics);
  }

  /**
   * Logs a WARN message
   */
  warn(message: string, context?: string, metrics?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context, metrics);
  }

  /**
   * Logs an ERROR message
   */
  error(message: string, context?: string, metrics?: Record<string, any>, error?: Error): void {
    this.log(LogLevel.ERROR, message, context, metrics, error);
  }
}

// Export singleton instance
export const cacheLogger = new CacheLogger();

