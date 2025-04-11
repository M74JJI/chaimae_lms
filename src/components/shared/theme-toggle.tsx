"use client";

import { useEffect, useState, useCallback } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  // Define theme names for consistency
  const DARK_THEME = "dark";
  const LIGHT_THEME = "light";

  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);

  // Ensure component is mounted before accessing theme
  useEffect(() => {
    setMounted(true);
    if (resolvedTheme) {
      setIsDarkMode(resolvedTheme === DARK_THEME);
    }
  }, [resolvedTheme]);

  // Handle theme switching with a short delay for smooth animation
  const toggleTheme = useCallback(() => {
    if (isDarkMode === null) return;

    setIsDarkMode(!isDarkMode);

    setTimeout(() => {
      setTheme(isDarkMode ? LIGHT_THEME : DARK_THEME);
    }, 200); // Short delay ensures smooth UI animation
  }, [isDarkMode, setTheme]);

  if (!mounted || isDarkMode === null) {
    return <div className="w-20 h-10 bg-gray-300 rounded-full animate-pulse" />;
  }

  return (
    <button
      onClick={toggleTheme}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault(); // Prevent unwanted scrolling
          toggleTheme();
        }
      }}
      aria-label="Toggle dark mode"
      role="switch"
      aria-checked={isDarkMode}
      className={`relative inline-flex items-center w-20 h-10 rounded-full transition-all duration-500 
      focus:outline-none focus-visible:ring-2 ${
        isDarkMode
          ? "focus-visible:ring-indigo-500"
          : "focus-visible:ring-orange-400"
      }`}
    >
      {/* Background transition effect */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-500 ${
          isDarkMode
            ? "bg-gradient-to-r from-blue-400 to-indigo-500"
            : "bg-gradient-to-r from-yellow-300 to-orange-400"
        }`}
      />

      {/* Icon container (Moon/Sun) */}
      <div
        className={`absolute top-1 left-1 bg-white rounded-full h-8 w-8 flex items-center justify-center text-lg shadow-md 
        transition-transform duration-500 ease-in-out ${
          isDarkMode ? "translate-x-10" : "translate-x-0"
        }`}
      >
        {isDarkMode ? "🌙" : "☀️"}
      </div>
    </button>
  );
}
