import { UserRole } from "@prisma/client";

export interface CreateUserType {
  username: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified?: Date | null;
  image?: string | null;
  phoneNumber?: string | null;
  role: UserRole;
  password?: string;
}
