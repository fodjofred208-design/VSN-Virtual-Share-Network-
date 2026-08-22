// VSN — Language provider (i18n)
// Provides `t(key)` + language state to the whole app. Persists to localStorage.
"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
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

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(DEFAULT_LANGUAGE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("vsn-lang") as Language | null;
    if (stored && DICTS[stored]) setLangState(stored);
  }, []);

  const setLang = useCallback((l: Language) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("vsn-lang", l);
  }, []);

  const t = useCallback(
    (key: string) => DICTS[lang][key] ?? DICTS[DEFAULT_LANGUAGE][key] ?? key,
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  if (!mounted) return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
