// logger.ts
export enum LogLevel {
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

class Logger {
  private logLevel: LogLevel;

  constructor(logLevel: LogLevel = LogLevel.INFO) {
    this.logLevel = logLevel;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = Object.values(LogLevel);
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const logLevelIndex = levels.indexOf(level);
    return logLevelIndex >= currentLevelIndex;
  }

  private log(
    level: LogLevel,
    message: string,
    meta: Record<string, any> = {}
  ) {
    if (this.shouldLog(level)) {
      // Assuming `globalThis.logger` is an actual logger object (e.g., from Winston, Log4js, etc.)
      globalThis.logger?.[level]({ message, meta });
    }
  }

  info(message: string, meta: Record<string, any> = {}) {
    this.log(LogLevel.INFO, message, meta);
  }

  warn(message: string, meta: Record<string, any> = {}) {
    this.log(LogLevel.WARN, message, meta);
  }

  error(message: string, meta: Record<string, any> = {}) {
    this.log(LogLevel.ERROR, message, meta);
  }
}

// Example of usage in production vs. development:
const logger = new Logger(
  process.env.NODE_ENV === "production" ? LogLevel.WARN : LogLevel.INFO
);

export default logger;
