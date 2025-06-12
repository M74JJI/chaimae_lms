"use client";
import { motion } from "framer-motion";

import { useEffect, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

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
    >
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        className="p-2 cursor-pointer rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all"
        aria-label="Toggle theme"
      >
        {!isDarkMode ? (
          <Moon className="w-5 h-5 text-gray-700" />
        ) : (
          <Sun className="w-5 h-5 text-yellow-400" />
        )}
      </motion.button>
    </button>
  );
}
