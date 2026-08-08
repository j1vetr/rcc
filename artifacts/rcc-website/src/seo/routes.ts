/**
 * SEO route definitions — canonical URL map for all indexable pages.
 *
 * Each route key maps to localized slugs for de/en/fr.
 * Use getLangPath() to build URLs. Never hardcode /de/ /en/ /fr/ paths in components.
 */

import { BUSINESS } from './businessData';

export type Lang = 'de' | 'en' | 'fr';
export type RouteKey = 'home' | 'packages';

export const LANG_LOCALES: Record<Lang, string> = {
  de: 'de-CH',
  en: 'en-CH',
  fr: 'fr-CH',
};

export const LANG_LABELS: Record<Lang, string> = {
  de: 'Deutsch',
  en: 'English',
  fr: 'Français',
};

export const ROUTE_SLUGS: Record<RouteKey, Record<Lang, string>> = {
  home: { de: '', en: '', fr: '' },
  packages: { de: 'pakete', en: 'packages', fr: 'forfaits' },
};

/** Returns the canonical path for a given lang + route key, always with trailing slash. */
export function getLangPath(lang: Lang, routeKey: RouteKey): string {
  const slug = ROUTE_SLUGS[routeKey][lang];
  return `/${lang}/${slug ? slug + '/' : ''}`;
}

/** Returns the canonical absolute URL for a given lang + route key. */
export function getCanonicalUrl(lang: Lang, routeKey: RouteKey): string {
  return `${BUSINESS.domain}${getLangPath(lang, routeKey)}`;
}

/** All indexable routes as a flat array. */
export const ALL_ROUTES: Array<{ lang: Lang; routeKey: RouteKey; path: string }> =
  (Object.keys(ROUTE_SLUGS) as RouteKey[]).flatMap((routeKey) =>
    (['de', 'en', 'fr'] as Lang[]).map((lang) => ({
      lang,
      routeKey,
      path: getLangPath(lang, routeKey),
    })),
  );

/**
 * Detect the language from a URL path.
 * Defaults to 'de' if no valid prefix found.
 */
export function detectLangFromPath(path: string): Lang {
  if (path.startsWith('/en')) return 'en';
  if (path.startsWith('/fr')) return 'fr';
  return 'de';
}

/**
 * Detect the route key from a URL path.
 */
export function detectRouteKeyFromPath(path: string): RouteKey {
  if (/^\/(de\/pakete|en\/packages|fr\/forfaits)\//.test(path)) {
    return 'packages';
  }
  return 'home';
}

/**
 * Build hreflang entries for a given route key.
 * Returns reciprocal hreflang alternates including x-default (→ de).
 */
export function buildHreflang(
  routeKey: RouteKey,
): Array<{ hreflang: string; href: string }> {
  const entries: Array<{ hreflang: string; href: string }> = [];

  for (const lang of ['de', 'en', 'fr'] as Lang[]) {
    entries.push({
      hreflang: LANG_LOCALES[lang],
      href: getCanonicalUrl(lang, routeKey),
    });
  }

  // x-default points to the German (primary) version
  entries.push({
    hreflang: 'x-default',
    href: getCanonicalUrl('de', routeKey),
  });

  return entries;
}
