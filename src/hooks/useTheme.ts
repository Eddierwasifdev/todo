// src/hooks/useTheme.ts
import { useEffect } from "react";

export function useTheme() {
  useEffect(() => {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem("theme") || "system";

    if (savedTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(savedTheme);
    }
  }, []);
}
