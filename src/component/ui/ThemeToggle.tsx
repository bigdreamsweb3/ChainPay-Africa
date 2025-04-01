"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { name: "Light", icon: Sun, value: "light" },
    { name: "Dark", icon: Moon, value: "dark" },
    { name: "System", icon: Monitor, value: "system" },
  ] as const;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-white dark:bg-background-dark-card hover:bg-background-medium dark:hover:bg-background-dark-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Moon className="w-5 h-5 text-brand-primary" />
        ) : (
          <Sun className="w-5 h-5 text-brand-primary" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-40 py-2 bg-white dark:bg-background-dark-card rounded-lg shadow-lg dark:shadow-xl dark:shadow-background-dark/20 z-50"
          >
            {themes.map(({ name, icon: Icon, value }) => (
              <button
                key={value}
                onClick={() => {
                  setTheme(value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors ${
                  theme === value
                    ? "text-brand-primary bg-brand-primary/5 dark:bg-brand-primary/10"
                    : "text-text-primary dark:text-text-light hover:bg-background-medium dark:hover:bg-background-dark-medium"
                }`}
              >
                <Icon className="w-4 h-4" />
                {name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 