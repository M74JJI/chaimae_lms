import {
  createClient,
  type RedisClientType,
  type RedisClientOptions,
  type RedisFunctions,
  type RedisModules,
  type RedisScripts,
} from "redis";
//import { logger } from "./logger";

// Types for enhanced type safety
type RedisCommand = string;
type RedisValue = string | number | boolean | Buffer;
type RedisResponse<T = unknown> = T extends "GET"
  ? string | null
  : T extends "SET"
  ? "OK"
  : T extends "INCR" | "EXPIRE"
  ? number
  : T extends "SADD"
  ? number
  : unknown;

interface RedisPoolMetrics {
  totalConnections: number;
  activeConnections: number;
  idleConnections: number;
  connectionWaitTime: number;
}

interface CircuitBreakerState {
  failures: number;
  isOpen: boolean;
  lastFailure: number;
  resetTimeout: number;
}

interface RedisOperationMetrics {
  successCount: number;
  failureCount: number;
  latencyHistogram: {
    [range: string]: number;
  };
}

const config = {
  url: process.env.REDIS_URL!,
  tls: process.env.REDIS_TLS_ENABLED === "true",
  timeouts: {
    connect: parseInt(
      process.env.VERCEL_REDIS_CONNECT_TIMEOUT ||
        process.env.REDIS_CONNECT_TIMEOUT ||
        (process.env.VERCEL ? "1000" : "2000"),
      10
    ),
    command: parseInt(
      process.env.VERCEL_REDIS_CMD_TIMEOUT ||
        process.env.REDIS_CMD_TIMEOUT ||
        (process.env.VERCEL ? "2000" : "5000"),
      10
    ),
  },
  circuitBreaker: {
    threshold: parseInt(
      process.env.VERCEL_REDIS_CB_THRESHOLD ||
        process.env.REDIS_CB_THRESHOLD ||
        (process.env.VERCEL ? "20" : "60"),
      10
    ),
    resetTimeout: parseInt(
      process.env.VERCEL_REDIS_CB_RESET_TIMEOUT ||
        process.env.REDIS_CB_RESET_TIMEOUT ||
        (process.env.VERCEL ? "5000" : "15000"),
      10
    ),
    windowSize: parseInt(process.env.REDIS_CB_WINDOW_SIZE || "60000", 10),
  },
  performance: {
    maxRetries: parseInt(process.env.REDIS_MAX_RETRIES || "3", 10),
    autoPipeline: process.env.REDIS_AUTO_PIPELINING === "true",
    latencyThreshold: parseInt(
      process.env.REDIS_LATENCY_WARNING_THRESHOLD || "100",
      10
    ),
    poolSize: {
      min: parseInt(
        process.env.VERCEL_REDIS_POOL_MIN ||
          process.env.REDIS_POOL_MIN ||
          (process.env.VERCEL ? "2" : "3"),
        10
      ),
      max: parseInt(
        process.env.VERCEL_REDIS_POOL_MAX ||
          process.env.REDIS_POOL_MAX ||
          (process.env.VERCEL ? "5" : "10"),
        10
      ),
    },
    warmConnections: process.env.REDIS_WARM_CONNECTIONS === "true",
    backpressureThreshold: parseInt(
      process.env.REDIS_BACKPRESSURE_THRESHOLD || "1000",
      10
    ),
  },
  security: {
    caCert: process.env.REDIS_CA_CERT,
    validateCertificates: process.env.NODE_ENV === "production",
  },
};

// Validate configuration
function validateConfig() {
  if (!config.url) throw new Error("REDIS_URL is required");
  if (
    config.tls &&
    config.security.validateCertificates &&
    !config.security.caCert
  ) {
    throw new Error(
      "REDIS_CA_CERT is required when TLS and certificate validation are enabled"
    );
  }
}

validateConfig();

class RedisManager {
  private isConnectedFlag = false;
  private isConnectingFlag = false;
  private static instance: RedisManager | null = null;
  private client: RedisClientType<RedisModules, RedisFunctions, RedisScripts>;
  private circuitBreaker: CircuitBreakerState;
  private lastLatency = 0;
  private connectionAttempts = 0;
  private poolMetrics: RedisPoolMetrics = {
    totalConnections: 0,
    activeConnections: 0,
    idleConnections: 0,
    connectionWaitTime: 0,
  };
  private static hmrHandled = false;
  private operationMetrics: Record<string, RedisOperationMetrics> = {};
  private pendingOperations = 0;
  private isShuttingDown = false;

  private constructor() {
    this.circuitBreaker = {
      failures: 0,
      isOpen: false,
      lastFailure: 0,
      resetTimeout: config.circuitBreaker.resetTimeout,
    };

    // Update the TLS configuration in the constructor to:
    const tlsConfig = config.tls
      ? {
          rejectUnauthorized: config.security.validateCertificates,
          servername: new URL(config.url).hostname,
          sessionIdContext: process.env.VERCEL ? "vercel-edge" : undefined,
          ca: config.security.validateCertificates
            ? config.security.caCert // Use the cert content directly
            : undefined,
        }
      : undefined;

    this.client = createClient({
      url: config.url,
      socket: {
        connectTimeout: config.timeouts.connect,
        noDelay: true,
        keepAlive: process.env.VERCEL ? 15000 : 30000,
        tls: tlsConfig,
        writable: process.env.VERCEL ? false : true,
      } as any,
      pingInterval: process.env.VERCEL ? 10000 : 15000,
      disableOfflineQueue: true,
    });

    this.registerEventHandlers();
    this.applyPerformanceTuning();
    this.initializeMetrics();
  }

  public isConnected(): boolean {
    return this.isConnectedFlag;
  }

  public isConnecting(): boolean {
    return this.isConnectingFlag;
  }

  private initializeMetrics() {
    const commands = ["GET", "SET", "INCR", "EXPIRE", "SADD"];
    commands.forEach((cmd) => {
      this.operationMetrics[cmd] = {
        successCount: 0,
        failureCount: 0,
        latencyHistogram: {
          "0-100": 0,
          "100-500": 0,
          "500-1000": 0,
          "1000+": 0,
        },
      };
    });
  }
  public static handleHMR() {
    if (process.env.NODE_ENV === "development" && !this.hmrHandled) {
      this.hmrHandled = true;
      if (typeof module !== "undefined" && module.hot) {
        module.hot.dispose(async () => {
          await this.instance?.cleanup();
          (this as any).instance = null; // Temporary cast if needed
        });
      }
    }
  }
  private updateLatencyHistogram(command: string, latency: number) {
    const metrics = this.operationMetrics[command];
    if (!metrics) return;

    if (latency < 100) metrics.latencyHistogram["0-100"]++;
    else if (latency < 500) metrics.latencyHistogram["100-500"]++;
    else if (latency < 1000) metrics.latencyHistogram["500-1000"]++;
    else metrics.latencyHistogram["1000+"]++;
  }
  public async eval<T extends unknown[] = unknown[]>(
    script: string,
    numKeys: number,
    ...args: (string | number)[]
  ): Promise<T> {
    if (this.isShuttingDown) {
      throw new Error("Redis client is shutting down");
    }

    if (this.circuitBreaker.isOpen) {
      throw new Error("Redis circuit breaker open");
    }

    this.checkBackpressure();
    this.pendingOperations++;

    const start = Date.now();
    let attempt = 0;
    const maxAttempts = 3;
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    // Retry logic with exponential backoff
    while (attempt < maxAttempts) {
      try {
        const keys = args.slice(0, numKeys) as string[];
        const redisArgs = args.slice(numKeys).map(String); // Renamed from 'arguments'

        const result = (await this.client.eval(script, {
          keys,
          arguments: redisArgs,
        })) as unknown; // Treat result as unknown to handle further type checking

        // Handle the result based on type
        if (Array.isArray(result)) {
          // Handle array return type
          return result as T;
        } else if (typeof result === "string" || typeof result === "number") {
          // Handle string or number return types
          return [result] as T;
        } else {
          // If other types are returned, treat as unknown for fallback handling
          return [] as unknown as T; // Ensure type compatibility with T
        }
      } catch (err) {
        this.updateFailureMetrics("EVAL");
        this.recordFailure(err as Error);

        if (attempt < maxAttempts - 1) {
          attempt++;
          const backoffTime = Math.pow(2, attempt) * 100; // Exponential backoff
          console.warn(
            `Redis error, retrying... Attempt ${attempt} of ${maxAttempts}`
          );
          await delay(backoffTime);
        } else {
          console.error("Max retries reached. Redis operation failed.");
          throw err; // Ensure to throw the error after retries fail
        }
      } finally {
        this.pendingOperations--;
      }
    }

    // Fallback return statement to satisfy the return type requirement
    return [] as unknown as T;
  }

  private registerEventHandlers() {
    this.client.on("error", (err) => {
      this.recordFailure(err);
      this.logToVercel(`Redis error: ${err.message}`);
      /* logger.error(err, "Redis operation failed", {
        component: "redis",
        operation: "connection",
      });*/
    });

    this.client.on("connect", () => {
      this.resetCircuit();
      this.logToVercel("Redis connected");
      // logger.info("Redis connected");

      setTimeout(() => {
        Promise.allSettled([
          this.configureVercel(),
          this.warmConnections(),
        ]).then(([configResult, warmupResult]) => {
          if (configResult.status === "rejected") {
            /* logger.warn(
              configResult.reason instanceof Error
                ? configResult.reason
                : new Error(String(configResult.reason)),
              "Vercel configuration failed",
              {
                component: "vercel-config",
                severity: "warning",
              }
            );*/
          }

          /* if (warmupResult.status === "rejected") {
            logger.warn(
              warmupResult.reason instanceof Error
                ? warmupResult.reason
                : new Error(String(warmupResult.reason)),
              "Connection warmup completed with errors",
              {
                component: "db-connection",
                operation: "warmup",
                severity: "warning",
              }
            );
          }*/
        });
      }, 100);
    });

    this.client.on("ready", () => {
      this.poolMetrics.totalConnections = config.performance.poolSize.max;
      this.poolMetrics.idleConnections = config.performance.poolSize.max;
    });

    //  process.on("beforeExit", async () => await this.cleanup());
  }

  private async warmConnections(): Promise<void> {
    if (!config.performance.warmConnections || !this.client.isOpen) return;

    try {
      const warmupPromises = Array(config.performance.poolSize.min)
        .fill(null)
        .map(() => this.client.ping().catch(() => {})); // Silently handle individual ping failures

      await Promise.all(warmupPromises);
      //logger.info("Redis connections warmed up successfully");
    } catch (err) {
      /*logger.warn("Redis connection warmup completed with some failures", {
        error: err,
      });*/
    }
  }

  private logToVercel(message: string) {
    if (process.env.VERCEL) {
      fetch("/api/log", {
        method: "POST",
        body: JSON.stringify({ message, timestamp: Date.now() }),
      }).catch(() => {});
    }
  }

  private configureVercel() {
    if (!process.env.VERCEL) return;

    Promise.all([
      this.client.configSet("tcp-keepalive", "15"),
      this.client.configSet("timeout", "150"),
      this.client.configSet("maxmemory-policy", "volatile-ttl"),
      this.client.configSet("repl-backlog-size", "1048576"),
    ]).catch((err) => {
      this.logToVercel(`Vercel config failed: ${err.message}`);
    });
  }

  private applyPerformanceTuning() {
    if (config.performance.autoPipeline) {
      this.client
        .configSet("pipeline", process.env.VERCEL ? "always" : "enable")
        .catch((err) =>
          this.logToVercel(`Pipeline config failed: ${err.message}`)
        );
    }
  }

  private recordFailure(err: Error) {
    const now = Date.now();
    // Reset failure count if window has passed
    if (
      now - this.circuitBreaker.lastFailure >
      config.circuitBreaker.windowSize
    ) {
      this.circuitBreaker.failures = 0;
    }

    this.circuitBreaker.failures++;
    this.circuitBreaker.lastFailure = now;

    if (this.circuitBreaker.failures >= config.circuitBreaker.threshold) {
      this.circuitBreaker.isOpen = true;
      setTimeout(() => {
        this.circuitBreaker.isOpen = false;
        this.circuitBreaker.failures = 0;
      }, this.circuitBreaker.resetTimeout);
      this.logToVercel(`Circuit breaker opened`);
    }
  }

  private resetCircuit() {
    this.circuitBreaker.failures = 0;
    this.circuitBreaker.isOpen = false;
    this.circuitBreaker.lastFailure = 0;
  }

  private isTransientError(err: Error): boolean {
    const transientErrors = [
      "ECONNRESET",
      "ETIMEDOUT",
      "ECONNREFUSED",
      "EPIPE",
      "NR_CLOSED",
    ];
    return transientErrors.some((code) => err.message.includes(code));
  }

  public static getInstance(): RedisManager {
    if (!RedisManager.instance) {
      RedisManager.instance = new RedisManager();
    }
    return RedisManager.instance;
  }
  private async waitForConnection(): Promise<void> {
    if (this.client.isOpen) return;

    const maxWaitTime = config.timeouts.connect;
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
      if (this.client.isOpen) return;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    throw new Error("Redis connection timeout");
  }
  public async connect(): Promise<void> {
    if (this.isConnectedFlag || this.isConnectingFlag) return;
    if (this.client.isOpen || this.circuitBreaker.isOpen) return;
    if (process.env.VERCEL && this.connectionAttempts > 1) {
      throw new Error("Vercel cold start protection triggered");
    }

    const startTime = Date.now();
    this.connectionAttempts++;
    this.isConnectingFlag = true;
    try {
      await this.client.connect();
      this.isConnectedFlag = true;
      await this.configureProduction();

      // Wait for connection to be fully ready
      await this.waitForConnection();
    } catch (err) {
      if (process.env.VERCEL && Date.now() - startTime > 2000) {
        this.logToVercel("Vercel connection timeout");
      }
      this.recordFailure(err as Error);
      throw err;
    } finally {
      this.isConnectingFlag = false;
    }
  }

  private async configureProduction() {
    if (process.env.NODE_ENV !== "production") return;

    try {
      await this.client.configSet(
        "timeout",
        process.env.VERCEL ? "150" : "300"
      );
    } catch (err: any) {
      this.logToVercel(`Config failed: ${err.message}`);
      /* logger.warn("Failed to configure Redis:", err);*/
    }
  }

  private serializeValue(value: RedisValue): string {
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean")
      return value.toString();
    if (Buffer.isBuffer(value)) return value.toString("base64");
    return JSON.stringify(value);
  }

  private checkBackpressure(): void {
    if (this.pendingOperations >= config.performance.backpressureThreshold) {
      throw new Error(
        `Redis backpressure threshold reached (${this.pendingOperations} pending operations)`
      );
    }
  }
  private updateSuccessMetrics(command: string) {
    const metrics = this.operationMetrics[command];
    if (metrics) {
      metrics.successCount += 1; // Use += instead of ++
    }
  }

  private updateFailureMetrics(command: string) {
    const metrics = this.operationMetrics[command];
    if (metrics) {
      metrics.failureCount += 1; // Use += instead of ++
    }
  }
  public async execute<T extends RedisCommand>(
    command: T,
    ...args: RedisValue[]
  ): Promise<RedisResponse<T>> {
    if (this.isShuttingDown) {
      throw new Error("Redis client is shutting down");
    }

    if (this.circuitBreaker.isOpen) {
      throw new Error("Redis circuit breaker open");
    }

    this.checkBackpressure();
    this.pendingOperations++;

    const start = Date.now();
    try {
      const stringArgs = args.map((arg) => this.serializeValue(arg));
      const result = await this.client.sendCommand([command, ...stringArgs]);
      this.lastLatency = Date.now() - start;

      this.updateSuccessMetrics(command); // Use the new method
      this.updateLatencyHistogram(command, this.lastLatency);

      if (this.lastLatency > config.performance.latencyThreshold) {
        this.logToVercel(`Slow operation: ${command} (${this.lastLatency}ms)`);
        /*logger.warn("Slow Redis operation", {
          command,
          latency: this.lastLatency,
        });*/
      }

      // Type-safe response handling
      if (command === "INCR" || command === "EXPIRE") {
        return Number(result) as RedisResponse<T>;
      }
      if (command === "SET") {
        return result as RedisResponse<T>;
      }
      return result as RedisResponse<T>;
    } catch (err) {
      this.updateFailureMetrics(command);
      const error = err as Error;

      if (this.isTransientError(error)) {
        // logger.warn("Transient Redis error", { command, error: error.message });
      } else {
        /*logger.error("Permanent Redis error", {
          command,
          error: error.message,
        });*/
      }

      this.recordFailure(error);
      throw err;
    } finally {
      this.pendingOperations--;
    }
  }

  public async cleanup(): Promise<void> {
    if (!this.client.isOpen || this.isShuttingDown) return;

    this.isShuttingDown = true;
    try {
      this.isConnectedFlag = false;
      this.isConnectingFlag = false;
      await this.client.quit();
      this.logToVercel("Redis connection closed");
    } catch (err) {
      // logger.error("Failed to cleanly shutdown Redis:", err);
    }
  }

  public getClient(): RedisClientType<
    RedisModules,
    RedisFunctions,
    RedisScripts
  > {
    if (!this.client.isOpen) {
      throw new Error("Redis not connected");
    }
    return this.client;
  }

  public healthCheck() {
    return {
      status: this.circuitBreaker.isOpen
        ? "circuit_open"
        : this.client.isOpen
        ? "healthy"
        : "disconnected",
      latency: this.lastLatency,
      failures: this.circuitBreaker.failures,
      pool: this.poolMetrics,
      operations: this.operationMetrics,
      pendingOperations: this.pendingOperations,
      circuitBreakerWindow: config.circuitBreaker.windowSize,
      isShuttingDown: this.isShuttingDown,
    };
  }

  // Command Shortcuts with proper typing
  public async get(key: string): Promise<string | null> {
    return this.execute<"GET">("GET", key);
  }

  public async set(
    key: string,
    value: RedisValue,
    options?: { EX?: number }
  ): Promise<"OK"> {
    const serialized = this.serializeValue(value);
    if (options?.EX) {
      return this.execute<"SET">("SET", key, serialized, "EX", options.EX);
    }
    return this.execute<"SET">("SET", key, serialized);
  }

  public async sAdd(key: string, members: RedisValue[]): Promise<number> {
    return this.execute<"SADD">("SADD", key, ...members);
  }

  public async expire(key: string, seconds: number): Promise<number> {
    return this.execute<"EXPIRE">("EXPIRE", key, seconds);
  }
}

const redis = RedisManager.getInstance();
export default redis;
export { RedisManager };
