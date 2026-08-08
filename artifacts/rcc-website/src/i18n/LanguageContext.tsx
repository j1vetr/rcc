import React, {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import { useLocation } from 'wouter';
import { translations } from './translations';
import { type Lang, type RouteKey, detectLangFromPath, detectRouteKeyFromPath, getLangPath } from '@/seo/routes';

export type { Lang };

interface LanguageContextType {
  /** Current language derived from URL prefix (/de/, /en/, /fr/). */
  lang: Lang;
  /** Translations for the current language. */
  t: typeof translations.de;
  /** Current route key (home | packages). */
  routeKey: RouteKey;
  /** Builds a path in the given language for the current route. */
  switchLangPath: (targetLang: Lang) => string;
  /** Builds an in-language path for a given route key. */
  getLangRoute: (routeKey: RouteKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  const lang: Lang = useMemo(() => detectLangFromPath(location), [location]);
  const routeKey: RouteKey = useMemo(() => detectRouteKeyFromPath(location), [location]);

  const value: LanguageContextType = useMemo(
    () => ({
      lang,
      t: translations[lang],
      routeKey,
      switchLangPath: (targetLang: Lang) => getLangPath(targetLang, routeKey),
      getLangRoute: (key: RouteKey) => getLangPath(lang, key),
    }),
    [lang, routeKey],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
