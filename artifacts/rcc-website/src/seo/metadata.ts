/**
 * Centralised metadata registry.
 *
 * Every indexable route has a canonical title, description, and robots directive.
 * Head injection uses this registry — no per-component ad-hoc meta manipulation.
 */

import {
  BUSINESS,
  type BusinessData,
} from './businessData';
import {
  type Lang,
  type RouteKey,
  LANG_LOCALES,
  detectLangFromPath,
  detectRouteKeyFromPath,
  getCanonicalUrl,
  buildHreflang,
} from './routes';

export interface PageMetadata {
  title: string;
  description: string;
  lang: Lang;
  locale: string;
  canonical: string;
  hreflang: Array<{ hreflang: string; href: string }>;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogLocale: string;
  twitterTitle: string;
  twitterDescription: string;
  robots: string;
  noindex: boolean;
  jsonLd: object;
}

type MetadataMap = Record<RouteKey, Record<Lang, Pick<PageMetadata, 'title' | 'description'>>>;

const META: MetadataMap = {
  home: {
    de: {
      title: 'Mobile Autopflege Zürich & Schweiz | RCC Royal Car Cleaning',
      description:
        'Premium mobile Autopflege und Fahrzeugaufbereitung in Zürich und der ganzen Schweiz. RCC reinigt, pflegt und schützt Ihr Fahrzeug professionell direkt bei Ihnen vor Ort.',
    },
    en: {
      title: 'Mobile Car Detailing Zurich & Switzerland | RCC Royal Car Cleaning',
      description:
        'Premium mobile car cleaning and detailing in Zurich and across Switzerland. RCC professionally cleans, details and protects your vehicle at your location.',
    },
    fr: {
      title: 'Lavage Auto Mobile Zurich & Suisse | RCC Royal Car Cleaning',
      description:
        'Nettoyage et detailing automobile premium à Zurich et dans toute la Suisse. RCC entretient et protège votre véhicule professionnellement, directement chez vous.',
    },
  },
  packages: {
    de: {
      title: 'Autopflege Pakete & Preise Schweiz | RCC Royal Car Cleaning',
      description:
        'Übersicht unserer exklusiven Autopflege-Pakete für Innen-, Aussen- und Komplettreinigung. Wählen Sie Ihre Fahrzeuggrösse und finden Sie das passende Programm.',
    },
    en: {
      title: 'Car Care Packages & Pricing Switzerland | RCC Royal Car Cleaning',
      description:
        'Overview of our exclusive car care packages for interior, exterior and complete cleaning. Select your vehicle size and find the perfect detailing program.',
    },
    fr: {
      title: 'Forfaits Entretien Auto & Prix Suisse | RCC Royal Car Cleaning',
      description:
        "Aperçu de nos forfaits exclusifs d'entretien automobile pour intérieur, extérieur et nettoyage complet. Sélectionnez la taille de votre véhicule.",
    },
  },
};

function buildJsonLd(
  routeKey: RouteKey,
  lang: Lang,
  canonical: string,
  business: BusinessData,
): object {
  const base = {
    '@context': 'https://schema.org',
    '@type': 'AutoWash',
    name: business.name,
    alternateName: business.alternateName,
    description: business.description[lang],
    image: `${business.domain}${business.images.ogImage}`,
    url: canonical,
    telephone: business.phone.e164,
    email: business.email.display,
    priceRange: business.priceRange,
    currenciesAccepted: business.currenciesAccepted,
    areaServed: {
      '@type': 'Country',
      name: 'Switzerland',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.streetAddress,
      postalCode: business.address.postalCode,
      addressLocality: business.address.addressLocality,
      addressRegion: business.address.addressRegion,
      addressCountry: business.address.addressCountry,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: business.phone.e164,
      contactType: 'customer service',
      availableLanguage: ['German', 'French', 'English'],
    },
    sameAs: [business.social.instagram, business.social.tiktok],
  };

  return base;
}

/** Get full page metadata for a given route key + language. */
export function getRouteMetadata(routeKey: RouteKey, lang: Lang): PageMetadata {
  const copy = META[routeKey][lang];
  const canonical = getCanonicalUrl(lang, routeKey);
  const locale = LANG_LOCALES[lang];

  return {
    title: copy.title,
    description: copy.description,
    lang,
    locale,
    canonical,
    hreflang: buildHreflang(routeKey),
    ogTitle: copy.title,
    ogDescription: copy.description,
    ogImage: `${BUSINESS.domain}${BUSINESS.images.ogImage}`,
    ogLocale: locale.replace('-', '_'),
    twitterTitle: copy.title,
    twitterDescription: copy.description,
    robots: 'index, follow, max-image-preview:large',
    noindex: false,
    jsonLd: buildJsonLd(routeKey, lang, canonical, BUSINESS),
  };
}

/** Get metadata by URL path (auto-detects lang + route key). */
export function getMetadataForPath(path: string): PageMetadata {
  const lang = detectLangFromPath(path);
  const routeKey = detectRouteKeyFromPath(path);
  return getRouteMetadata(routeKey, lang);
}

/** Metadata for the 404 page (noindex). */
export function get404Metadata(lang: Lang = 'de'): PageMetadata {
  const titles: Record<Lang, string> = {
    de: 'Seite nicht gefunden | RCC Royal Car Cleaning',
    en: 'Page Not Found | RCC Royal Car Cleaning',
    fr: 'Page introuvable | RCC Royal Car Cleaning',
  };
  const descs: Record<Lang, string> = {
    de: 'Die gesuchte Seite konnte nicht gefunden werden.',
    en: 'The page you are looking for could not be found.',
    fr: "La page que vous recherchez est introuvable.",
  };

  return {
    title: titles[lang],
    description: descs[lang],
    lang,
    locale: LANG_LOCALES[lang],
    canonical: `${BUSINESS.domain}/${lang}/`,
    hreflang: [],
    ogTitle: titles[lang],
    ogDescription: descs[lang],
    ogImage: `${BUSINESS.domain}${BUSINESS.images.ogImage}`,
    ogLocale: LANG_LOCALES[lang].replace('-', '_'),
    twitterTitle: titles[lang],
    twitterDescription: descs[lang],
    robots: 'noindex, nofollow',
    noindex: true,
    jsonLd: {},
  };
}
