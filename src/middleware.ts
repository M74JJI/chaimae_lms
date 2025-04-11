import NextAuth from "next-auth";
import authConfig from "@/auth/lib/auth.config";
import {
  publicApiRoutes,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from "./routes";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { auth, nextUrl } = req;
  const isLoggedIn = Boolean(auth?.user);
  const currentPath = nextUrl.pathname;

  // Handle API routes
  if (currentPath.startsWith("/api")) {
    const isPublic = Array.from(publicApiRoutes).some((route) =>
      currentPath.startsWith(route)
    );
    if (!isPublic && !isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Handle auth routes for authenticated users
  if (authRoutes.has(currentPath)) {
    if (isLoggedIn) {
      // Redirect logged-in users away from auth pages to the default page
      return NextResponse.redirect(
        new URL(DEFAULT_LOGIN_REDIRECT, req.nextUrl)
      );
    }
    return NextResponse.next();
  }

  // Redirect unauthenticated users
  if (!isLoggedIn && !publicRoutes.has(currentPath)) {
    const redirectUrl = new URL("/auth/signin", nextUrl);
    redirectUrl.searchParams.set("callbackUrl", currentPath);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
