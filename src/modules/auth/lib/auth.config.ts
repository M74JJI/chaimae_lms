import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import TwitterProvider from "next-auth/providers/twitter";
import DiscordProvider from "next-auth/providers/discord";
import Github from "next-auth/providers/github";
import { SignInSchema } from "../schemas";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
export default {
  trustHost: true,
  debug: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validate = await SignInSchema.parseAsync(credentials);
        if (!validate) return null;
        const { email, password } = validate;
        const user = await db.user.findUnique({ where: { email } });
        if (!user || !user.password) return null;
        const matched = await bcrypt.compare(password, user.password);
        if (matched)
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            emailVerified: user.emailVerified,
            role: user.role,
            firstName: user.firstName ?? undefined,
            lastName: user.lastName ?? undefined,
          };
        return null;
      },
    }),
    Google({
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      clientId: process.env.GOOGLE_CLIENT_ID,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
} satisfies NextAuthConfig;

const providersUsed = [
  "credentials",
  "google",
  "facebook",
  "twitter",
  "discord",
  "github",
] as const;

export type availableProviders = (typeof providersUsed)[number];
