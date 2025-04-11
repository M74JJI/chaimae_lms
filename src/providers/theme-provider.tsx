import { ThemeProvider } from "next-themes";

export default function AppThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      defaultTheme="system"
      enableSystem
      attribute="class"
      disableTransitionOnChange
    >
      <>{children}</>
    </ThemeProvider>
  );
}
