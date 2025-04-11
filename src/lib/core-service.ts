import { CacheOrchestrator } from "./CacheOrchestrator";
import { DedupeManager } from "./DedupeManager";
import { RateLimiter } from "./rate-limiter";

const IS_VERCEL = process.env.VERCEL === "1";
const IS_EDGE =
  process.env.RUNTIME === "edge" || process.env.NEXT_PUBLIC_IS_EDGE === "true";

export type CacheProfile = {
  storage: "redis" | "next";
  key: string;
  ttl: number;
  costWeight?: number;
};

export type ServiceContext = {
  name: string;
  cache?: CacheProfile;
  rateLimit?: {
    identifier?: string;
    requests: number;
    window: "1s" | "1m" | "1h";
    errorMessage?: string;
    useRedis?: boolean;
    cost?: number;
  };
  circuitBreaker?: {
    failureThreshold: number;
  };
  environment?: {
    edgeOptimized?: boolean;
    dedupeTtlMs?: number;
    timeoutMs?: number;
  };
};

export abstract class CoreService {
  protected static async execute<T>(
    operation: () => Promise<T>,
    context: ServiceContext
  ): Promise<T> {
    const isEdge = context.environment?.edgeOptimized ?? IS_EDGE;
    const defaultDedupeTtl = isEdge ? 1000 : 5000;

    // 1. Cache check
    if (context.rateLimit) {
      const {
        identifier = context.name,
        requests,
        window,
        errorMessage,
        useRedis = true,
        cost = 1,
      } = context.rateLimit;

      await RateLimiter.check(
        identifier,
        requests,
        window,
        errorMessage,
        useRedis,
        cost
      );
    }

    if (context.cache) {
      const { exists, value } = await CacheOrchestrator.checkCache<T>(
        context.cache.key,
        context.cache.storage
      );
      if (exists && value) return value;
    }

    // 2. Rate limiting

    // 3. Deduplication and cache execution
    const dedupeKey = `${context.name}:${context.cache?.key || ""}`;
    return DedupeManager.dedupe(
      dedupeKey,
      async () => {
        if (!context.cache) return operation(); // No caching; just perform the operation

        // Cache orchestration: Storing and retrieving the result from Redis (or Next.js cache)
        const { result } = await CacheOrchestrator.execute(
          context.cache.key,
          operation,
          {
            storage: context.cache.storage,
            ttl: context.cache.ttl,
            costWeight: context.cache.costWeight,
          }
        );
        return result; // Return the result after performing the operation
      },
      {
        ttlMs: context.environment?.dedupeTtlMs ?? defaultDedupeTtl,
        vercelEdge: isEdge,
      }
    );
  }
}
