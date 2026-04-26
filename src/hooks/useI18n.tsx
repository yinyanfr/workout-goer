import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Locale, LocaleDict } from "@/locales/index";
import { localeNames } from "@/locales/index";

const LOCALE_KEY = "wg-locale";

function loadLocale(): Locale {
  try {
    const stored = localStorage.getItem(LOCALE_KEY);
    if (stored && (stored === "zh-CN" || stored === "en-US" || stored === "fr-FR" || stored === "ja-JP")) {
      return stored;
    }
  } catch { /* localStorage unavailable */ }
  return "zh-CN";
}

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: keyof LocaleDict, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(loadLocale);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try { localStorage.setItem(LOCALE_KEY, l); } catch { /* noop */ }
  }, []);

  const t = useCallback(
    (key: keyof LocaleDict, params?: Record<string, string | number>): string => {
      const dict: Record<Locale, string> = localeCache[key];
      if (!dict) return key;

      let text = dict[locale] ?? key;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          text = text.replace(`{${k}}`, String(v));
        }
      }
      return text;
    },
    [locale],
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

// -- lazy load locale dictionaries --

type LocaleDictModule = { default: LocaleDict };

const localeCache: Record<keyof LocaleDict, Record<Locale, string>> = {} as any;

async function preloadLocale(locale: Locale): Promise<LocaleDict> {
  let mod: LocaleDictModule;
  switch (locale) {
    case "zh-CN": mod = await import("@/locales/zh-CN"); break;
    case "en-US": mod = await import("@/locales/en-US"); break;
    case "fr-FR": mod = await import("@/locales/fr-FR"); break;
    case "ja-JP": mod = await import("@/locales/ja-JP"); break;
  }
  const dict = mod.default;
  for (const key of Object.keys(dict) as (keyof LocaleDict)[]) {
    if (!localeCache[key]) localeCache[key] = {} as any;
    localeCache[key][locale] = dict[key];
  }
  return dict;
}

// eager: preload default locale
preloadLocale(loadLocale());
// also preload the rest in the background
for (const l of ["en-US", "fr-FR", "ja-JP"] as Locale[]) {
  if (l !== loadLocale()) preloadLocale(l);
}
