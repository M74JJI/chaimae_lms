import { unstable_cache } from "next/cache";
import { getRedisClient } from "./redis";

export class CacheOrchestrator {
  private static nextJsCacheHits = new Map<string, boolean>();

  static async checkCache<T>(key: string, storage: "redis" | "next") {
    if (storage === "redis") {
      const redis = getRedisClient();
      const start = Date.now();
      try {
        const cached = await redis.get(key);
        const duration = Date.now() - start;

        if (duration > 50) {
          console.warn(`Slow Redis GET (${duration}ms) for key: ${key}`);
        }

        return {
          exists: !!cached,
          value: cached ? this.safeJsonParse<T>(cached) : undefined,
        };
      } catch (err) {
        console.error(`Redis GET failed for ${key}:`, err);
        return { exists: false, value: undefined };
      }
    }

    return { exists: this.nextJsCacheHits.has(key) };
  }

  static async execute<T>(
    key: string,
    fn: () => Promise<T>,
    options: {
      storage: "redis" | "next";
      ttl: number;
      costWeight?: number;
    }
  ): Promise<{ result: T; fromCache: boolean }> {
    switch (options.storage) {
      case "redis": {
        const redis = getRedisClient();

        const checkStart = Date.now();
        const cached = await redis.get(key);
        const getDuration = Date.now() - checkStart;

        if (cached) {
          if (getDuration > 50) {
            console.warn(`Slow Cache HIT (${getDuration}ms) for key: ${key}`);
          }
          return {
            result: this.safeJsonParse<T>(cached),
            fromCache: true,
          };
        }

        const execStart = Date.now();
        const result = await fn();
        const execDuration = Date.now() - execStart;

        const effectiveTTL = Math.min(
          options.costWeight
            ? Math.floor(options.ttl * (1 + options.costWeight * 0.1))
            : options.ttl,
          86400
        );

        this.setCache(key, result, effectiveTTL).catch((err) => {
          console.error(`Async cache set failed for ${key}:`, err);
        });

        if (execDuration > 100) {
          console.warn(`Slow DB Operation (${execDuration}ms) for key: ${key}`);
        }

        return { result, fromCache: false };
      }

      case "next": {
        const isCacheHit = this.nextJsCacheHits.has(key);
        this.nextJsCacheHits.set(key, true);

        const cachedFn = unstable_cache(fn, [key], {
          revalidate: options.ttl,
        });

        try {
          const result = await cachedFn();
          return {
            result,
            fromCache: isCacheHit,
          };
        } catch (error) {
          this.nextJsCacheHits.delete(key);
          return { result: await fn(), fromCache: false };
        }
      }

      default:
        return { result: await fn(), fromCache: false };
    }
  }

  private static async setCache(
    key: string,
    value: any,
    ttl: number
  ): Promise<void> {
    const redis = getRedisClient();
    try {
      const start = Date.now();
      await redis.set(key, JSON.stringify(value), "EX", ttl);
      const duration = Date.now() - start;

      if (duration > 100) {
        console.warn(`Slow Redis SET (${duration}ms) for key: ${key}`);
      }
    } catch (err) {
      console.error(`Redis SET failed for ${key}:`, err);
      throw err;
    }
  }

  private static safeJsonParse<T>(data: string): T {
    try {
      return JSON.parse(data);
    } catch (err) {
      console.error("Failed to parse cached data:", err);
      throw err;
    }
  }
}
