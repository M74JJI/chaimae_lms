"use client";

import { SessionProvider } from "next-auth/react";
import AppThemeProvider from "./theme-provider";
import ModalProvider from "./modal-provider";
import { auth } from "@/auth";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AppThemeProvider>
        <ModalProvider>{children}</ModalProvider>
      </AppThemeProvider>
    </SessionProvider>
  );
}
