"use client";

import { SessionProvider } from "next-auth/react";
import AppThemeProvider from "./theme-provider";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <AppThemeProvider>
      <SessionProvider>{children}</SessionProvider>
    </AppThemeProvider>
  );
}
