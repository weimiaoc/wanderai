"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { getTheme, setTheme } from "../lib/storage";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(getTheme() === "dark");
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    setTheme(next ? "dark" : "light");
  };

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggle}
      className="relative w-9 h-9 rounded-xl flex items-center justify-center bg-[var(--color-surface)] border border-[var(--color-border)] transition-colors hover:bg-[var(--color-border)]"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0, scale: isDark ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        className="absolute"
      >
        <Sun size={16} className="text-[var(--color-text-secondary)]" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : -180, scale: isDark ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="absolute"
      >
        <Moon size={16} className="text-[var(--color-text-secondary)]" />
      </motion.div>
    </motion.button>
  );
}
