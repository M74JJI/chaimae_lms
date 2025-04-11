import { RateLimitError } from "./errors";
import { getRedisClient } from "./redis";
import storage from "node-persist";

// Initialize node-persist storage
await storage.init({
  dir:
    process.env.NODE_ENV === "production"
      ? "/tmp/ratelimit"
      : "./.ratelimit-cache",
  ttl: false,
});

export type RateLimitWindow = `${number}${"s" | "m" | "h"}`;
export type RateLimitKey = string;

export class RateLimiter {
  private static readonly FALLBACK_LIMITS: Record<"s" | "m" | "h", number> = {
    s: 5,
    m: 30,
    h: 100,
  };

  private static readonly localCache = new Map<
    string,
    { count: number; expiresAt: number }
  >();

  static async check(
    identifier: RateLimitKey,
    limit: number,
    window: RateLimitWindow,
    customMessage?: string,
    useRedis: boolean = true,
    cost: number = 1
  ): Promise<void> {
    const now = Date.now();
    const ttl = this.parseWindowToSeconds(window);
    const windowSuffix = this.getWindowSuffix(window);
    const redisKey = `rl:${identifier}:${window}`;

    console.log(`Checking rate limit for identifier: ${identifier}`);

    // --- In-memory Map Cache ---
    const { limited: localLimited, count: localCount } = this.checkLocal(
      redisKey,
      limit,
      ttl,
      now,
      cost
    );

    if (localLimited) {
      throw new RateLimitError(identifier, limit, window, customMessage);
    }

    // --- Redis Check ---
    try {
      if (useRedis) {
        const redis = getRedisClient();
        const [current, redisTTL] = await Promise.all([
          redis.incrby(redisKey, cost),
          redis.ttl(redisKey),
        ]);

        if (current === cost && redisTTL === -1) {
          await redis.expire(redisKey, ttl);
        }

        // Sync In-memory Map
        this.updateLocal(redisKey, current, now, ttl);

        if (current > limit) {
          console.log(
            `Rate limit exceeded in Redis for identifier: ${identifier}`
          );
          throw new RateLimitError(identifier, limit, window, customMessage);
        }

        return;
      }
    } catch (err) {
      console.warn("Redis error, fallback to file cache", err);
    }

    // --- node-persist File-Based Fallback ---

    const fallbackKey = redisKey;
    const data = (await storage.getItem(fallbackKey)) as {
      count: number;
      expiresAt: number;
    } | null;

    const expired = !data || data.expiresAt <= now;
    const fileCount = expired ? 0 : data.count;
    const newCount = fileCount + cost;

    const fallbackLimit = this.FALLBACK_LIMITS[windowSuffix];

    if (newCount > fallbackLimit) {
      console.log(`Fallback rate limit exceeded for identifier: ${identifier}`);
      throw new RateLimitError(
        identifier,
        fallbackLimit,
        window,
        customMessage ?? "Rate limited (fallback mode)"
      );
    }

    await storage.setItem(fallbackKey, {
      count: newCount,
      expiresAt: expired ? now + ttl * 1000 : data!.expiresAt,
    });

    this.updateLocal(fallbackKey, newCount, now, ttl); // keep local map in sync
  }

  // ----- Limit Profiles -----
  static async limitApi(
    userId: string,
    limit = 60,
    window: RateLimitWindow = "1m"
  ) {
    await this.check(`user:${userId}:api`, limit, window);
    await this.check(`global:api`, 1000, window);
  }

  static async limitDbWrite(
    userId: string,
    cost = 3,
    limit = 30,
    window: RateLimitWindow = "1m"
  ) {
    await this.check(`global:db:writes`, 1000, window, undefined, true, cost);
    await this.check(
      `user:${userId}:db:writes`,
      limit,
      window,
      undefined,
      true,
      cost
    );
  }

  static async limitUpload(
    userId: string,
    cost = 5,
    limit = 10,
    window: RateLimitWindow = "10m"
  ) {
    await this.check(
      `user:${userId}:upload`,
      limit,
      window,
      "Too many uploads",
      true,
      cost
    );
  }

  static async limitSearch(
    userId: string,
    cost = 1,
    limit = 20,
    window: RateLimitWindow = "30s"
  ) {
    await this.check(
      `user:${userId}:search`,
      limit,
      window,
      "Too many searches",
      true,
      cost
    );
  }

  // ----- Utils -----
  private static checkLocal(
    key: string,
    limit: number,
    ttl: number,
    now: number,
    cost: number
  ) {
    const entry = this.localCache.get(key);
    if (entry && entry.expiresAt <= now) {
      this.localCache.delete(key);
      return { count: 0, limited: false };
    }

    const currentCount = entry?.count ?? 0;
    const limited = currentCount + cost > limit;
    console.log(
      `Local check for key ${key}: current count is ${currentCount}, is limited: ${limited}`
    );
    return { count: currentCount, limited };
  }

  private static updateLocal(
    key: string,
    count: number,
    now: number,
    ttl: number
  ) {
    console.log(
      `Updating local cache for key ${key}: count ${count}, expiresAt ${
        now + ttl * 1000
      }`
    );
    this.localCache.set(key, { count, expiresAt: now + ttl * 1000 });
  }

  private static parseWindowToSeconds(window: RateLimitWindow): number {
    const match = window.match(/^(\d+)([smh])$/);
    if (!match) throw new Error(`Invalid window format: ${window}`);
    const [, value, unit] = match;
    const num = parseInt(value, 10);
    return unit === "s" ? num : unit === "m" ? num * 60 : num * 3600;
  }

  private static getWindowSuffix(window: RateLimitWindow): "s" | "m" | "h" {
    const unit = window.slice(-1);
    if (unit === "s" || unit === "m" || unit === "h") return unit;
    throw new Error(`Invalid window suffix: ${window}`);
  }
}
