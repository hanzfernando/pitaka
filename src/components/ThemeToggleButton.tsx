"use client";

import { useTheme } from "@/hooks/useTheme";
import { Moon, Sun } from "lucide-react"; // Optional: install `lucide-react` or replace with emojis

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Dark Mode"
      className={`
        fixed bottom-4 right-4 z-50
        w-12 h-12 rounded-full shadow-lg border
        flex items-center justify-center
        bg-white text-black dark:bg-black dark:text-white
        transition-colors duration-300
      `}
    >
      {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
