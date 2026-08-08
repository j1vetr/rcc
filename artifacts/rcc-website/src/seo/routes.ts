/**
 * SEO route definitions — canonical URL map for all indexable pages.
 *
 * Each route key maps to localized slugs for de/en/fr.
 * Use getLangPath() to build URLs. Never hardcode /de/ /en/ /fr/ paths in components.
 *
 * For German-only pages (Phase 2), en/fr slugs are omitted.
 * hreflang is generated only for languages that have a slug.
 * Phase 3 will add EN/FR equivalents.
 */

import { BUSINESS } from './businessData';

export type Lang = 'de' | 'en' | 'fr';

export type RouteKey =
  | 'home'
  | 'packages'
  | 'leistungen'
  | 'leistungen/mobile-autoreinigung'
  | 'leistungen/innenreinigung'
  | 'leistungen/aussenreinigung'
  | 'leistungen/fahrzeugaufbereitung'
  | 'einsatzgebiet'
  | 'mobile-autoreinigung/zuerich';

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

/**
 * Slug map — only the languages where a real page exists.
 * Missing entry = no page in that language yet.
 */
export const ROUTE_SLUGS: Record<RouteKey, Partial<Record<Lang, string>>> = {
  home:                                    { de: '', en: '', fr: '' },
  packages:                                { de: 'pakete', en: 'packages', fr: 'forfaits' },
  leistungen:                              { de: 'leistungen' },
  'leistungen/mobile-autoreinigung':       { de: 'leistungen/mobile-autoreinigung' },
  'leistungen/innenreinigung':             { de: 'leistungen/innenreinigung' },
  'leistungen/aussenreinigung':            { de: 'leistungen/aussenreinigung' },
  'leistungen/fahrzeugaufbereitung':       { de: 'leistungen/fahrzeugaufbereitung' },
  einsatzgebiet:                           { de: 'einsatzgebiet' },
  'mobile-autoreinigung/zuerich':          { de: 'mobile-autoreinigung/zuerich' },
};

/**
 * Returns the canonical path for a given lang + route key, always with trailing slash.
 * If the route has no slug for the requested language, falls back to the lang homepage.
 */
export function getLangPath(lang: Lang, routeKey: RouteKey): string {
  const slugs = ROUTE_SLUGS[routeKey];
  const slug = slugs[lang];
  if (slug === undefined) {
    // No equivalent page in this language — fall back to the language homepage
    return `/${lang}/`;
  }
  return `/${lang}/${slug ? slug + '/' : ''}`;
}

/** Returns the canonical absolute URL for a given lang + route key. */
export function getCanonicalUrl(lang: Lang, routeKey: RouteKey): string {
  return `${BUSINESS.domain}${getLangPath(lang, routeKey)}`;
}

/** All indexable routes as a flat array. */
export const ALL_ROUTES: Array<{ lang: Lang; routeKey: RouteKey; path: string }> =
  (Object.keys(ROUTE_SLUGS) as RouteKey[]).flatMap((routeKey) =>
    (['de', 'en', 'fr'] as Lang[]).flatMap((lang) => {
      const slugs = ROUTE_SLUGS[routeKey];
      if (slugs[lang] === undefined) return [];
      return [{ lang, routeKey, path: getLangPath(lang, routeKey) }];
    }),
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
  // Strip trailing slash for matching
  const p = path.replace(/\/$/, '');

  if (/^\/(de\/pakete|en\/packages|fr\/forfaits)$/.test(p))        return 'packages';
  if (/^\/de\/leistungen\/mobile-autoreinigung$/.test(p))           return 'leistungen/mobile-autoreinigung';
  if (/^\/de\/leistungen\/innenreinigung$/.test(p))                 return 'leistungen/innenreinigung';
  if (/^\/de\/leistungen\/aussenreinigung$/.test(p))                return 'leistungen/aussenreinigung';
  if (/^\/de\/leistungen\/fahrzeugaufbereitung$/.test(p))           return 'leistungen/fahrzeugaufbereitung';
  if (/^\/de\/leistungen$/.test(p))                                 return 'leistungen';
  if (/^\/de\/einsatzgebiet$/.test(p))                              return 'einsatzgebiet';
  if (/^\/de\/mobile-autoreinigung\/zuerich$/.test(p))              return 'mobile-autoreinigung/zuerich';
  return 'home';
}

/** Returns true if a given path corresponds to a known indexable route. */
export function isKnownPath(path: string): boolean {
  const lang = detectLangFromPath(path);
  const routeKey = detectRouteKeyFromPath(path);
  // Home always exists; for other routes check slug exists for this lang
  if (routeKey === 'home') return true;
  return ROUTE_SLUGS[routeKey][lang] !== undefined;
}

/**
 * Build hreflang entries for a given route key.
 * Only emits entries for languages that have a slug (no invented alternates).
 * Includes x-default pointing to the German version.
 */
export function buildHreflang(
  routeKey: RouteKey,
): Array<{ hreflang: string; href: string }> {
  const slugs = ROUTE_SLUGS[routeKey];
  const entries: Array<{ hreflang: string; href: string }> = [];

  for (const lang of ['de', 'en', 'fr'] as Lang[]) {
    if (slugs[lang] !== undefined) {
      entries.push({
        hreflang: LANG_LOCALES[lang],
        href: getCanonicalUrl(lang, routeKey),
      });
    }
  }

  // x-default points to the German (primary market) version
  if (slugs['de'] !== undefined) {
    entries.push({
      hreflang: 'x-default',
      href: getCanonicalUrl('de', routeKey),
    });
  }

  return entries;
}
