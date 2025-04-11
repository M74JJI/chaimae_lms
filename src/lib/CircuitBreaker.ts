type BreakerOptions = {
  threshold: number;
  fallback: () => never;
};

export class CircuitBreaker {
  private static failures = new Map<string, number>();
  private static lastReset = new Map<string, number>();

  static async execute<T>(
    service: string,
    options: BreakerOptions,
    fn: () => Promise<T>
  ): Promise<T> {
    if (this.isOpen(service, options.threshold)) {
      return options.fallback();
    }

    try {
      const result = await fn();
      this.recordSuccess(service);
      return result;
    } catch (err) {
      this.recordFailure(service);
      throw err;
    }
  }

  private static isOpen(service: string, threshold: number): boolean {
    const failures = this.failures.get(service) || 0;
    return failures > threshold;
  }

  private static recordFailure(service: string): void {
    const count = this.failures.get(service) || 0;
    this.failures.set(service, count + 1);
  }

  private static recordSuccess(service: string): void {
    this.failures.delete(service);
  }
}
