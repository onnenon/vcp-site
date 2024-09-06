import { useState, useEffect, useCallback } from "react";

type Theme = "theme-light" | "dark" | "system";

const useTheme = () => {
  const getInitialTheme = useCallback((): Theme => {
    if (typeof window !== "undefined" && window.localStorage) {
      const savedTheme = localStorage.getItem("theme") as Theme | null;
      if (savedTheme) {
        return savedTheme;
      }
      const prefersDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      return prefersDarkMode ? "dark" : "theme-light";
    }
    return "theme-light";
  }, []);

  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("theme", theme);
      const isDark =
        theme === "dark" ||
        (theme === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.classList[isDark ? "add" : "remove"]("dark");
    }
  }, [theme]);

  useEffect(() => {
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        const isDark = e.matches;
        document.documentElement.classList[isDark ? "add" : "remove"]("dark");
      }
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [theme]);

  return { theme, setTheme };
};

export default useTheme;
