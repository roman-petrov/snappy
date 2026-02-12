import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { type LocaleKey, setCurrentLocale } from "./LocaleStore";

const STORAGE_KEY = `snappy-locale`;

const defaultLocale = (): LocaleKey => {
  if (typeof document === `undefined`) {
    return `ru`;
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === `en` || stored === `ru` ? stored : `ru`;
};

export type { LocaleKey } from "./LocaleStore";

type ContextValue = { locale: LocaleKey; setLocale: (next: LocaleKey) => void };

const LocaleContext = createContext<ContextValue | null>(null);

export const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocaleState] = useState<LocaleKey>(defaultLocale);
  useEffect(() => {
    setCurrentLocale(locale);
    document.documentElement.lang = locale;
  }, [locale]);
  const setLocale = useCallback((next: LocaleKey) => {
    setLocaleState(next);
    setCurrentLocale(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);
  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export const useLocale = (): ContextValue => {
  const ctx = useContext(LocaleContext);
  if (ctx === null) {
    throw new Error(`useLocale must be used within LocaleProvider`);
  }
  return ctx;
};
