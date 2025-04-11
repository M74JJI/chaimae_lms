import { DefaultSession } from "next-auth";
import { User as NextAuthUser } from "next-auth";
import { JWT } from "next-auth/jwt";

type SessionUser = DefaultSession["user"] & {
  firstName: string;
  lastName?: string;
};
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: SessionUser;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    firstName: string;
    lastName: string;
  }
}
