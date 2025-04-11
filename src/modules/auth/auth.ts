import NextAuth from "next-auth";
import authConfig from "@/auth/lib/auth.config";
import { extractName, generateUniqueUsername } from "@/modules/auth/lib";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { AdapterUser } from "next-auth/adapters";
import { db } from "@/lib/db";
import { createUser } from "@/modules/auth/services/user.service";
import { sendVerificationRequest } from "./services";
import { UserService } from "./services/userr.servicee";

export const nextAuth = NextAuth({
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
    error: "/auth-error",
    signOut: "/signout",
  },
  //events: {},
  callbacks: {
    async signIn({ user, account }) {
      const provider = account?.provider;
      if (provider !== "credentials" && provider !== "http-email") return true;

      if (!user || !user.id) return false;
      const existingUser = await UserService.getUserById(user.id, {
        name: "getUserById",
      });

      if (
        !existingUser ||
        (provider === "credentials" && !existingUser.emailVerified)
      ) {
        if (provider === "http-email") return "/auth/signup";
        return false;
      }
      return true;
    },
    async jwt(jwt) {
      const { token } = jwt;

      if (!token.sub) return token;

      const { firstName, lastName } = extractName(token.name);
      token.firstName = firstName;
      token.lastName = lastName;

      return token;
    },
    async session({ session, user, token }) {
      if (session.user) {
        if (token.firstName) session.user.firstName = token.firstName;
        if (token.lastName) session.user.lastName = token.lastName;
      }

      return session;
    },
  },
  adapter: {
    ...PrismaAdapter(db),
    async createUser(profile) {
      const { name, email, image, emailVerified } = profile;

      const { firstName, lastName } = extractName(name);

      const username = await generateUniqueUsername(firstName, lastName);

      const user = await createUser({
        name: name || "",
        email,
        image,
        emailVerified,
        username,
        firstName,
        lastName,
        role: "USER",
      });

      return user as AdapterUser;
    },
  },
  session: { strategy: "jwt" },
  trustHost: authConfig.trustHost,
  providers: [
    ...authConfig.providers,
    {
      id: "http-email",
      name: "Email",
      sendVerificationRequest: sendVerificationRequest,
      options: {},
      maxAge: 60 * 60,
      from: "example@email.com",
      type: "email",
    },
  ],
});
