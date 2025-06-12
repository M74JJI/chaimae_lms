import { db } from "@/lib/db";
import { RateLimitError } from "@/lib/errors"; // Import the RateLimitError
import { ErrorMessages } from "@/types/common";

// user.service.ts
export class UserService {
  static async getUserByEmail(email: string) {
    const user = await db.user.findUnique({
      where: { email },
    });

    return user;
  }

  static async getUserById(id: string) {
    const user = await db.user.findUnique({
      where: { id },
    });

    return user;
  }
}
