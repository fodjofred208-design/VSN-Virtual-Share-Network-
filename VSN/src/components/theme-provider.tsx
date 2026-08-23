// VSN — Virtual Share Network: Theme Provider

"use client";

import { createContext, useCallback, useContext, useEffect, useState, useSyncExternalStore } from "react";
import type { Theme } from "@/lib/types";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
});

const STORAGE_KEY = "vsn-theme";

const subscribeNoop = () => () => {};
const getTrue = () => true;
const getFalse = () => false;

function readStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Read once, lazily (no effect needed to persist the stored value).
  const [storedTheme, setStoredTheme] = useState<Theme>(readStoredTheme);
  // False during SSR + hydration, true on the client — no setState in an effect.
  const hasMounted = useSyncExternalStore(subscribeNoop, getTrue, getFalse);
  const theme = hasMounted ? storedTheme : "dark";

  useEffect(() => {
    if (!hasMounted) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, hasMounted]);

  const toggleTheme = useCallback(() => {
    setStoredTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setStoredTheme(t);
  }, []);

  if (!hasMounted) {
    return <div className="dark" style={{ visibility: "hidden" }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
