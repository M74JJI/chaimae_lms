declare global {
  var __dedupeMap: Map<string, Promise<any>> | undefined;
}

const pending = new Map<string, Promise<any>>();
const IS_VERCEL = process.env.VERCEL === "1";
const DEFAULT_TTL_MS = IS_VERCEL ? 10_000 : 30_000;

export class DedupeManager {
  static dedupe<T>(
    key: string,
    fn: () => Promise<T>,
    options: {
      ttlMs?: number;
      timeoutMs?: number;
      vercelEdge?: boolean;
    } = {}
  ): Promise<T> {
    const ttlMs = options.ttlMs ?? DEFAULT_TTL_MS;
    const timeoutMs = options.timeoutMs ?? (IS_VERCEL ? 5_000 : 10_000);
    const isEdge = options.vercelEdge ?? IS_VERCEL;

    // Edge case: synchronous errors won't trigger finally()
    const promise = Promise.resolve().then(fn);

    // Initialize global storage if needed
    if (isEdge && !globalThis.__dedupeMap) {
      globalThis.__dedupeMap = new Map();
    }
    const storage = isEdge ? globalThis.__dedupeMap! : pending;

    // Check for existing request
    if (storage.has(key)) {
      return storage.get(key) as Promise<T>;
    }

    // Apply timeout if specified
    const timedPromise =
      timeoutMs > 0
        ? Promise.race([
            promise,
            new Promise<T>((_, reject) =>
              setTimeout(
                () => reject(new Error(`Timeout after ${timeoutMs}ms`)),
                timeoutMs
              )
            ),
          ])
        : promise;

    // Store the promise
    storage.set(key, timedPromise);

    // Cleanup
    const cleanup = () => {
      setTimeout(() => {
        storage.delete(key);
        if (
          isEdge &&
          storage === globalThis.__dedupeMap &&
          storage.size === 0
        ) {
          globalThis.__dedupeMap = undefined;
        }
      }, ttlMs);
    };

    timedPromise.finally(cleanup);

    return timedPromise;
  }

  static clear(key: string) {
    const storage = IS_VERCEL ? globalThis.__dedupeMap ?? pending : pending;
    storage.delete(key);
  }

  static getPendingCount() {
    return IS_VERCEL ? globalThis.__dedupeMap?.size ?? 0 : pending.size;
  }
}
