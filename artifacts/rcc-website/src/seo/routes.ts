/**
 * SEO route definitions — canonical URL map for all indexable pages.
 *
 * Each route key maps to localized slugs for de/en/fr.
 * Use getLangPath() to build URLs. Never hardcode /de/ /en/ /fr/ paths in components.
 *
 * For German-only pages (Phase 2), en/fr slugs are omitted.
 * hreflang is generated only for languages that have a slug.
 * Phase 3: EN/FR equivalents for all pages + contact/about/faq.
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
  | 'mobile-autoreinigung/zuerich'
  | 'mobile-autoreinigung/winterthur'
  | 'mobile-autoreinigung/zug'
  | 'mobile-autoreinigung/luzern'
  | 'mobile-autoreinigung/basel'
  | 'mobile-autoreinigung/bern'
  | 'mobile-autoreinigung/st-gallen'
  | 'mobile-autoreinigung/geneve'
  | 'mobile-autoreinigung/lausanne'
  | 'firmenkunden'
  | 'kontakt'
  | 'ueber-uns'
  | 'faq'
  | 'ratgeber'
  | 'ratgeber/auto-innenreinigung'
  | 'ratgeber/autoaufbereitung-kosten-schweiz'
  | 'ratgeber/auto-vor-leasingrueckgabe-reinigen'
  | 'ratgeber/autopflege-im-winter-schweiz'
  | 'ratgeber/innenreinigung-leder-stoff'
  | 'ratgeber/wie-oft-auto-reinigen';

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
  leistungen:                              { de: 'leistungen', en: 'services', fr: 'prestations' },
  'leistungen/mobile-autoreinigung':       { de: 'leistungen/mobile-autoreinigung', en: 'services/mobile-car-cleaning', fr: 'prestations/nettoyage-voiture-mobile' },
  'leistungen/innenreinigung':             { de: 'leistungen/innenreinigung', en: 'services/interior-cleaning', fr: 'prestations/nettoyage-interieur' },
  'leistungen/aussenreinigung':            { de: 'leistungen/aussenreinigung', en: 'services/exterior-cleaning', fr: 'prestations/nettoyage-exterieur' },
  'leistungen/fahrzeugaufbereitung':       { de: 'leistungen/fahrzeugaufbereitung', en: 'services/car-detailing', fr: 'prestations/preparation-vehicule' },
  einsatzgebiet:                           { de: 'einsatzgebiet', en: 'service-area', fr: 'zones-desservies' },
  'mobile-autoreinigung/zuerich':          { de: 'mobile-autoreinigung/zuerich', en: 'mobile-car-cleaning/zurich', fr: 'nettoyage-voiture-mobile/zurich' },
  'mobile-autoreinigung/winterthur':      { de: 'mobile-autoreinigung/winterthur', en: 'mobile-car-cleaning/winterthur' },
  'mobile-autoreinigung/zug':             { de: 'mobile-autoreinigung/zug', en: 'mobile-car-cleaning/zug' },
  'mobile-autoreinigung/luzern':          { de: 'mobile-autoreinigung/luzern', en: 'mobile-car-cleaning/lucerne' },
  'mobile-autoreinigung/basel':           { de: 'mobile-autoreinigung/basel', en: 'mobile-car-cleaning/basel' },
  'mobile-autoreinigung/bern':            { de: 'mobile-autoreinigung/bern', en: 'mobile-car-cleaning/bern' },
  'mobile-autoreinigung/st-gallen':       { de: 'mobile-autoreinigung/st-gallen' },
  'mobile-autoreinigung/geneve':          { en: 'mobile-car-cleaning/geneva', fr: 'nettoyage-voiture-mobile/geneve' },
  'mobile-autoreinigung/lausanne':        { en: 'mobile-car-cleaning/lausanne', fr: 'nettoyage-voiture-mobile/lausanne' },
  firmenkunden:                             { de: 'firmenkunden', en: 'business-customers', fr: 'clients-professionnels' },
  kontakt:                                 { de: 'kontakt', en: 'contact', fr: 'contact' },
  'ueber-uns':                             { de: 'ueber-uns', en: 'about', fr: 'a-propos' },
  faq:                                     { de: 'faq', en: 'faq', fr: 'faq' },

  // Ratgeber / Guide hub
  ratgeber:                                { de: 'ratgeber', en: 'guides', fr: 'guides' },

  // German guides — top 3 have EN/FR translations; others DE-only
  'ratgeber/auto-innenreinigung':                  { de: 'ratgeber/auto-innenreinigung', en: 'guides/car-interior-cleaning', fr: 'guides/nettoyage-interieur-voiture' },
  'ratgeber/autopflege-im-winter-schweiz':         { de: 'ratgeber/autopflege-im-winter-schweiz', en: 'guides/car-care-winter-switzerland', fr: 'guides/entretien-voiture-hiver-suisse' },
  'ratgeber/wie-oft-auto-reinigen':                { de: 'ratgeber/wie-oft-auto-reinigen', en: 'guides/how-often-clean-car', fr: 'guides/frequence-nettoyage-voiture' },

  // DE-only guides (no EN/FR yet — hreflang alternates omitted)
  'ratgeber/autoaufbereitung-kosten-schweiz':      { de: 'ratgeber/autoaufbereitung-kosten-schweiz' },
  'ratgeber/auto-vor-leasingrueckgabe-reinigen':   { de: 'ratgeber/auto-vor-leasingrueckgabe-reinigen' },
  'ratgeber/innenreinigung-leder-stoff':           { de: 'ratgeber/innenreinigung-leder-stoff' },
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

  // Packages
  if (/^\/(de\/pakete|en\/packages|fr\/forfaits)$/.test(p))                                         return 'packages';

  // Services hub
  if (/^\/(de\/leistungen|en\/services|fr\/prestations)$/.test(p))                                  return 'leistungen';

  // Service detail: mobile car cleaning
  if (/^\/(de\/leistungen\/mobile-autoreinigung|en\/services\/mobile-car-cleaning|fr\/prestations\/nettoyage-voiture-mobile)$/.test(p))
    return 'leistungen/mobile-autoreinigung';

  // Service detail: interior cleaning
  if (/^\/(de\/leistungen\/innenreinigung|en\/services\/interior-cleaning|fr\/prestations\/nettoyage-interieur)$/.test(p))
    return 'leistungen/innenreinigung';

  // Service detail: exterior cleaning
  if (/^\/(de\/leistungen\/aussenreinigung|en\/services\/exterior-cleaning|fr\/prestations\/nettoyage-exterieur)$/.test(p))
    return 'leistungen/aussenreinigung';

  // Service detail: car detailing
  if (/^\/(de\/leistungen\/fahrzeugaufbereitung|en\/services\/car-detailing|fr\/prestations\/preparation-vehicule)$/.test(p))
    return 'leistungen/fahrzeugaufbereitung';

  // Service area
  if (/^\/(de\/einsatzgebiet|en\/service-area|fr\/zones-desservies)$/.test(p))                       return 'einsatzgebiet';

  // City: Zurich
  if (/^\/(de\/mobile-autoreinigung\/zuerich|en\/mobile-car-cleaning\/zurich|fr\/nettoyage-voiture-mobile\/zurich)$/.test(p))
    return 'mobile-autoreinigung/zuerich';

  // City landing pages
  const cityRoutes: RouteKey[] = [
    'mobile-autoreinigung/winterthur',
    'mobile-autoreinigung/zug',
    'mobile-autoreinigung/luzern',
    'mobile-autoreinigung/basel',
    'mobile-autoreinigung/bern',
    'mobile-autoreinigung/st-gallen',
    'mobile-autoreinigung/geneve',
    'mobile-autoreinigung/lausanne',
  ];
  for (const cityRoute of cityRoutes) {
    const citySlugs = ROUTE_SLUGS[cityRoute];
    if (Object.entries(citySlugs).some(([lang, slug]) => slug !== undefined && `/${lang}/${slug}` === p)) {
      return cityRoute;
    }
  }

  // Business customers
  if (/^\/(de\/firmenkunden|en\/business-customers|fr\/clients-professionnels)$/.test(p))
    return 'firmenkunden';

  // Contact
  if (/^\/(de\/kontakt|en\/contact|fr\/contact)$/.test(p))                                           return 'kontakt';

  // About
  if (/^\/(de\/ueber-uns|en\/about|fr\/a-propos)$/.test(p))                                          return 'ueber-uns';

  // FAQ
  if (/^\/(de\/faq|en\/faq|fr\/faq)$/.test(p))                                                       return 'faq';

  // Ratgeber / Guides hub
  if (/^\/(de\/ratgeber|en\/guides|fr\/guides)$/.test(p))                                             return 'ratgeber';

  // Guide: interior cleaning
  if (/^\/(de\/ratgeber\/auto-innenreinigung|en\/guides\/car-interior-cleaning|fr\/guides\/nettoyage-interieur-voiture)$/.test(p))
    return 'ratgeber/auto-innenreinigung';

  // Guide: autoaufbereitung costs
  if (/^\/de\/ratgeber\/autoaufbereitung-kosten-schweiz$/.test(p))
    return 'ratgeber/autoaufbereitung-kosten-schweiz';

  // Guide: leasing return
  if (/^\/de\/ratgeber\/auto-vor-leasingrueckgabe-reinigen$/.test(p))
    return 'ratgeber/auto-vor-leasingrueckgabe-reinigen';

  // Guide: winter car care
  if (/^\/(de\/ratgeber\/autopflege-im-winter-schweiz|en\/guides\/car-care-winter-switzerland|fr\/guides\/entretien-voiture-hiver-suisse)$/.test(p))
    return 'ratgeber/autopflege-im-winter-schweiz';

  // Guide: leather vs fabric
  if (/^\/de\/ratgeber\/innenreinigung-leder-stoff$/.test(p))
    return 'ratgeber/innenreinigung-leder-stoff';

  // Guide: how often
  if (/^\/(de\/ratgeber\/wie-oft-auto-reinigen|en\/guides\/how-often-clean-car|fr\/guides\/frequence-nettoyage-voiture)$/.test(p))
    return 'ratgeber/wie-oft-auto-reinigen';

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
