// VSN — Language provider (i18n)
// Provides `t(key)` + language state to the whole app. Persists to localStorage.
"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from "react";
import { DICTS, DEFAULT_LANGUAGE, type Language } from "@/lib/i18n/locales";

interface I18nContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue>({
  lang: DEFAULT_LANGUAGE,
  setLang: () => {},
  t: (k) => k,
});

const STORAGE_KEY = "vsn-lang";

const subscribeNoop = () => () => {};
const getTrue = () => true;
const getFalse = () => false;

function readStoredLanguage(): Language {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  const stored = window.localStorage.getItem(STORAGE_KEY) as Language | null;
  return stored && DICTS[stored] ? stored : DEFAULT_LANGUAGE;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Read once, lazily (no effect needed to persist the stored value).
  const [storedLang, setStoredLang] = useState<Language>(readStoredLanguage);
  // False during SSR + hydration, true on the client — no setState in an effect.
  const hasMounted = useSyncExternalStore(subscribeNoop, getTrue, getFalse);
  // Before mount, render with the default language so server/client match.
  const lang = hasMounted ? storedLang : DEFAULT_LANGUAGE;

  const setLang = useCallback((l: Language) => {
    setStoredLang(l);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const t = useCallback(
    (key: string) => DICTS[lang][key] ?? DICTS[DEFAULT_LANGUAGE][key] ?? key,
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
