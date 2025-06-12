/**
 * Defines application route patterns with type safety and immutability
 * Using `as const` for strict type inference and Set for O(1) lookups
 */
export const publicApiRoutes = new Set([
  "/api/auth", // NextAuth endpoints
  "/api/metrics", // NextAuth endpoints
  "/api/examples/logging",
  "/api/examples/logging",
  // Add your public API routes here
]) as Readonly<Set<string>>;

export const publicRoutes = new Set([
  "/",
  "/error-trace",
  "/course",
  "/course/cybersecurity-soc-analyst",
  "/cart",
  "/browse",
]) as Readonly<Set<string>>;
export const authRoutes = new Set([
  "/auth/signin",
  "/auth/signup",
  "/auth/account-verification",
  "/auth/verify-request",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth-error",
]) as Readonly<Set<string>>;
export const DEFAULT_LOGIN_REDIRECT = "/" as const;
