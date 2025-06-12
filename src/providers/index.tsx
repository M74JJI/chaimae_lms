"use client";

import { SessionProvider } from "next-auth/react";
import AppThemeProvider from "./theme-provider";
import ModalProvider from "./modal-provider";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AppThemeProvider>
        <ModalProvider>{children}</ModalProvider>
      </AppThemeProvider>
    </SessionProvider>
  );
}
