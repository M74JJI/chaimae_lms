import { CoreService, ServiceContext } from "@/lib/core-service";
import { db } from "@/lib/db";
import { RateLimitError } from "@/lib/errors"; // Import the RateLimitError
import { ErrorMessages } from "@/types/common";

// user.service.ts
export class UserService extends CoreService {
  static async getUserByEmail(email: string, context: ServiceContext) {
    return this.execute(
      async () => {
        const user = await db.user.findUnique({
          where: { email },
        });

        return user;
      },
      {
        ...context,
        name: "UserService.getByEmail",
        cache: {
          storage: "redis",
          key: `user:email:${email}`,
          ttl: 60,
          costWeight: 7,
        },
        rateLimit: {
          identifier: "name_test",
          requests: 50,
          window: "1m",
          errorMessage: ErrorMessages.RATE_LIMITED,
          useRedis: true,
        },
        circuitBreaker: {
          failureThreshold: 5,
        },
      }
    ).catch((error) => {
      if (error instanceof RateLimitError) {
        // Handle rate-limiting error (e.g., log it, notify the user, etc.)
        throw error; // Rethrow or handle as necessary
      }
      throw error; // Rethrow other errors
    });
  }

  static async getUserById(id: string, context: ServiceContext) {
    return this.execute(
      async () => {
        const user = await db.user.findUnique({
          where: { id },
        });

        return user;
      },
      {
        ...context,
        name: "UserService.getUserById",
        rateLimit: {
          identifier: "name_id",
          requests: 20,
          window: "1m",
          errorMessage: "Too many attempts. Please try again later.",
          useRedis: false,
        },
        circuitBreaker: {
          failureThreshold: 5,
        },
      }
    ).catch((error) => {
      if (error instanceof RateLimitError) {
        // Handle rate-limiting error (e.g., log it, notify the user, etc.)
        throw error; // Rethrow or handle as necessary
      }
      throw error; // Rethrow other errors
    });
  }
}
