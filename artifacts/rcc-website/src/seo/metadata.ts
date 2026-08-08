/**
 * Centralised metadata registry.
 *
 * Every indexable route has a canonical title, description, and robots directive.
 * Head injection uses this registry — no per-component ad-hoc meta manipulation.
 *
 * Schema graph uses stable @id anchors:
 *   #business  — AutoWash (provider reference for all Service nodes)
 *   #website   — WebSite
 * Per-page nodes: Service, BreadcrumbList, FAQPage, OfferCatalog
 */

import { BUSINESS } from './businessData';
import {
  type Lang,
  type RouteKey,
  LANG_LOCALES,
  detectLangFromPath,
  detectRouteKeyFromPath,
  isKnownPath,
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

// ─── Meta copy ────────────────────────────────────────────────────────────────

type MetaCopy = Pick<PageMetadata, 'title' | 'description'>;
type MetaMap = Record<RouteKey, Partial<Record<Lang, MetaCopy>>>;

const META: MetaMap = {
  home: {
    de: {
      title: 'Mobile Autoreinigung Schweiz | RCC Royal Car Cleaning',
      description:
        'Professionelle mobile Autoreinigung in der ganzen Schweiz. RCC reinigt und pflegt Ihr Fahrzeug direkt bei Ihnen — Innen- und Aussenreinigung, Komplettreinigung und Fahrzeugaufbereitung.',
    },
    en: {
      title: 'Mobile Car Cleaning Switzerland | RCC Royal Car Cleaning',
      description:
        'Professional mobile car cleaning across Switzerland. RCC cleans and cares for your vehicle on location — interior, exterior and full detailing.',
    },
    fr: {
      title: 'Lavage Auto Mobile Suisse | RCC Royal Car Cleaning',
      description:
        'Nettoyage automobile mobile professionnel dans toute la Suisse. RCC nettoie et entretient votre véhicule directement chez vous.',
    },
  },
  packages: {
    de: {
      title: 'Autoreinigung Pakete & Preise | RCC Schweiz',
      description:
        'Alle Reinigungspakete von RCC mit genauen Preisen nach Fahrzeuggrösse. Innen-, Aussen- und Komplettreinigung — wählen Sie Ihr Programm.',
    },
    en: {
      title: 'Car Cleaning Packages & Prices | RCC Switzerland',
      description:
        'All RCC cleaning packages with exact prices by vehicle size. Interior, exterior and complete cleaning — choose your programme.',
    },
    fr: {
      title: 'Forfaits Nettoyage Auto & Prix | RCC Suisse',
      description:
        "Tous les forfaits RCC avec prix exacts selon la taille du véhicule. Nettoyage intérieur, extérieur et complet — choisissez votre programme.",
    },
  },
  leistungen: {
    de: {
      title: 'Mobile Autoreinigung Schweiz – Leistungen | RCC',
      description:
        'Übersicht aller Leistungen von RCC Mobile Autopflege: mobile Autoreinigung, Innenreinigung, Aussenreinigung und Fahrzeugaufbereitung — direkt bei Ihnen vor Ort.',
    },
  },
  'leistungen/mobile-autoreinigung': {
    de: {
      title: 'Mobile Autoreinigung Schweiz | RCC Royal Car Cleaning',
      description:
        'RCC bietet professionelle mobile Autoreinigung in der ganzen Schweiz. Wir kommen mit dem vollständigen Equipment direkt zu Ihrem Fahrzeug.',
    },
  },
  'leistungen/innenreinigung': {
    de: {
      title: 'Innenreinigung Auto Zürich & Schweiz | RCC',
      description:
        'Professionelle Autoinnenreinigung von RCC. Innenraum, Sitze, Armaturenbrett und Türen werden gründlich gereinigt — direkt bei Ihnen vor Ort in der Schweiz.',
    },
  },
  'leistungen/aussenreinigung': {
    de: {
      title: 'Aussenreinigung Auto Schweiz | RCC Mobile Autopflege',
      description:
        'Professionelle Aussenreinigung Ihres Fahrzeugs durch RCC. Handwäsche, Felgen, Scheiben und Karosseriepflege — mobil in der ganzen Schweiz.',
    },
  },
  'leistungen/fahrzeugaufbereitung': {
    de: {
      title: 'Fahrzeugaufbereitung Zürich & Schweiz | RCC',
      description:
        'Komplette Fahrzeugaufbereitung von RCC: Innen- und Aussenreinigung in einem Paket. Professionelle Rundum-Pflege mobil in der ganzen Schweiz.',
    },
  },
  einsatzgebiet: {
    de: {
      title: 'Einsatzgebiet Schweiz | RCC Mobile Autopflege',
      description:
        'RCC Mobile Autopflege ist in der ganzen Schweiz im Einsatz. Erfahren Sie, in welchen Kantonen und Städten wir Ihr Fahrzeug vor Ort reinigen.',
    },
  },
  'mobile-autoreinigung/zuerich': {
    de: {
      title: 'Mobile Autoreinigung Zürich | RCC Royal Car Cleaning',
      description:
        'Professionelle mobile Autoreinigung in Zürich. RCC reinigt Ihr Fahrzeug direkt bei Ihnen — Innenreinigung, Aussenreinigung und Komplettreinigung im Raum Zürich.',
    },
  },
};

// ─── Schema builders ──────────────────────────────────────────────────────────

function buildBusinessNode() {
  return {
    '@type': 'AutoWash',
    '@id': `${BUSINESS.domain}/#business`,
    name: BUSINESS.name,
    alternateName: BUSINESS.alternateName,
    image: `${BUSINESS.domain}${BUSINESS.images.ogImage}`,
    url: `${BUSINESS.domain}/de/`,
    telephone: BUSINESS.phone.e164,
    email: BUSINESS.email.display,
    priceRange: BUSINESS.priceRange,
    currenciesAccepted: BUSINESS.currenciesAccepted,
    areaServed: { '@type': 'Country', name: 'Switzerland' },
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.address.streetAddress,
      postalCode: BUSINESS.address.postalCode,
      addressLocality: BUSINESS.address.addressLocality,
      addressRegion: BUSINESS.address.addressRegion,
      addressCountry: BUSINESS.address.addressCountry,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: BUSINESS.phone.e164,
      contactType: 'customer service',
      availableLanguage: ['German', 'French', 'English'],
    },
    sameAs: [BUSINESS.social.instagram, BUSINESS.social.tiktok],
  };
}

function buildWebSiteNode(lang: Lang, canonical: string) {
  return {
    '@type': 'WebSite',
    '@id': `${BUSINESS.domain}/#website`,
    url: canonical,
    name: BUSINESS.name,
    inLanguage: LANG_LOCALES[lang],
    publisher: { '@id': `${BUSINESS.domain}/#business` },
  };
}

function buildBreadcrumb(items: Array<{ name: string; url: string }>) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function buildHomeJsonLd(lang: Lang, canonical: string): object {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildBusinessNode(),
      buildWebSiteNode(lang, canonical),
    ],
  };
}

function buildPackagesJsonLd(lang: Lang, canonical: string): object {
  const breadcrumb = buildBreadcrumb([
    { name: 'RCC Royal Car Cleaning', url: `${BUSINESS.domain}/${lang}/` },
    { name: lang === 'de' ? 'Pakete & Preise' : lang === 'fr' ? 'Forfaits & Prix' : 'Packages & Pricing', url: canonical },
  ]);

  // OfferCatalog with verified real prices from package data
  const offerCatalog = {
    '@type': 'OfferCatalog',
    '@id': `${canonical}#offer-catalog`,
    name: lang === 'de' ? 'Autoreinigung Pakete' : lang === 'fr' ? 'Forfaits de nettoyage' : 'Car Cleaning Packages',
    provider: { '@id': `${BUSINESS.domain}/#business` },
    itemListElement: [
      {
        '@type': 'Offer',
        name: lang === 'de' ? 'Innen & Aussen Basic' : lang === 'fr' ? 'Intérieur & Extérieur Basic' : 'Interior & Exterior Basic',
        priceRange: 'CHF 170–320',
        priceCurrency: 'CHF',
      },
      {
        '@type': 'Offer',
        name: lang === 'de' ? 'Innen & Aussen Premium' : lang === 'fr' ? 'Intérieur & Extérieur Premium' : 'Interior & Exterior Premium',
        priceRange: 'CHF 200–400',
        priceCurrency: 'CHF',
      },
      {
        '@type': 'Offer',
        name: lang === 'de' ? 'Innenreinigung Basic' : lang === 'fr' ? 'Nettoyage intérieur Basic' : 'Interior Cleaning Basic',
        priceRange: 'CHF 85–165',
        priceCurrency: 'CHF',
      },
      {
        '@type': 'Offer',
        name: lang === 'de' ? 'Innenreinigung Premium' : lang === 'fr' ? 'Nettoyage intérieur Premium' : 'Interior Cleaning Premium',
        priceRange: 'CHF 100–230',
        priceCurrency: 'CHF',
      },
      {
        '@type': 'Offer',
        name: lang === 'de' ? 'Aussenreinigung Basic' : lang === 'fr' ? 'Nettoyage extérieur Basic' : 'Exterior Cleaning Basic',
        priceRange: 'CHF 85–165',
        priceCurrency: 'CHF',
      },
      {
        '@type': 'Offer',
        name: lang === 'de' ? 'Aussenreinigung Premium' : lang === 'fr' ? 'Nettoyage extérieur Premium' : 'Exterior Cleaning Premium',
        priceRange: 'CHF 110–190',
        priceCurrency: 'CHF',
      },
    ],
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildBusinessNode(),
      breadcrumb,
      offerCatalog,
    ],
  };
}

function buildLeistungenJsonLd(canonical: string): object {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildBusinessNode(),
      buildBreadcrumb([
        { name: 'RCC Royal Car Cleaning', url: `${BUSINESS.domain}/de/` },
        { name: 'Leistungen', url: canonical },
      ]),
      {
        '@type': 'Service',
        '@id': `${canonical}#service`,
        name: 'Mobile Autoreinigung Schweiz',
        description: 'Professionelle mobile Fahrzeugreinigung und Autopflege in der ganzen Schweiz.',
        provider: { '@id': `${BUSINESS.domain}/#business` },
        areaServed: { '@type': 'Country', name: 'Switzerland' },
      },
    ],
  };
}

function buildServiceDetailJsonLd(
  canonical: string,
  serviceName: string,
  serviceDescription: string,
  breadcrumbLabel: string,
  faqs?: Array<{ question: string; answer: string }>,
): object {
  const graph: object[] = [
    buildBusinessNode(),
    buildBreadcrumb([
      { name: 'RCC Royal Car Cleaning', url: `${BUSINESS.domain}/de/` },
      { name: 'Leistungen', url: `${BUSINESS.domain}/de/leistungen/` },
      { name: breadcrumbLabel, url: canonical },
    ]),
    {
      '@type': 'Service',
      '@id': `${canonical}#service`,
      name: serviceName,
      description: serviceDescription,
      provider: { '@id': `${BUSINESS.domain}/#business` },
      areaServed: { '@type': 'Country', name: 'Switzerland' },
    },
  ];

  if (faqs && faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${canonical}#faq`,
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

function buildEinsatzgebietJsonLd(canonical: string): object {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildBusinessNode(),
      buildBreadcrumb([
        { name: 'RCC Royal Car Cleaning', url: `${BUSINESS.domain}/de/` },
        { name: 'Einsatzgebiet', url: canonical },
      ]),
    ],
  };
}

function buildZuerichJsonLd(canonical: string): object {
  const faqs = [
    {
      question: 'Bietet RCC mobile Autoreinigung in Zürich an?',
      answer: 'Ja, RCC bietet professionelle mobile Autoreinigung im Raum Zürich an. Wir kommen mit dem vollständigen Equipment direkt zu Ihrem Fahrzeug.',
    },
    {
      question: 'Welche Reinigungspakete sind in Zürich verfügbar?',
      answer: 'In Zürich sind alle RCC-Pakete verfügbar: Innenreinigung, Aussenreinigung und Komplettreinigung (Innen & Aussen) — jeweils in Basic und Premium.',
    },
    {
      question: 'Wie lange dauert eine mobile Autoreinigung in Zürich?',
      answer: 'Die Dauer variiert je nach gewähltem Paket und Fahrzeuggrösse. Bitte fragen Sie bei der Offertanfrage nach der genauen Zeitdauer für Ihr Fahrzeug.',
    },
    {
      question: 'Wie kann ich eine Autoreinigung in Zürich buchen?',
      answer: 'Nutzen Sie das Offertformular auf unserer Website oder kontaktieren Sie uns direkt per Telefon oder WhatsApp. Wir melden uns umgehend für einen Terminvorschlag.',
    },
  ];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildBusinessNode(),
      buildBreadcrumb([
        { name: 'RCC Royal Car Cleaning', url: `${BUSINESS.domain}/de/` },
        { name: 'Mobile Autoreinigung', url: `${BUSINESS.domain}/de/leistungen/mobile-autoreinigung/` },
        { name: 'Zürich', url: canonical },
      ]),
      {
        '@type': 'Service',
        '@id': `${canonical}#service`,
        name: 'Mobile Autoreinigung Zürich',
        description: 'Professionelle mobile Autoreinigung und Fahrzeugpflege im Raum Zürich durch RCC Royal Car Cleaning.',
        provider: { '@id': `${BUSINESS.domain}/#business` },
        areaServed: {
          '@type': 'City',
          name: 'Zürich',
          containedInPlace: { '@type': 'Country', name: 'Switzerland' },
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${canonical}#faq`,
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
    ],
  };
}

// ─── Route → JSON-LD dispatch ─────────────────────────────────────────────────

function buildJsonLd(routeKey: RouteKey, lang: Lang, canonical: string): object {
  switch (routeKey) {
    case 'home':
      return buildHomeJsonLd(lang, canonical);

    case 'packages':
      return buildPackagesJsonLd(lang, canonical);

    case 'leistungen':
      return buildLeistungenJsonLd(canonical);

    case 'leistungen/mobile-autoreinigung':
      return buildServiceDetailJsonLd(
        canonical,
        'Mobile Autoreinigung Schweiz',
        'Professionelle mobile Autoreinigung in der ganzen Schweiz. RCC kommt mit dem vollständigen Equipment direkt zu Ihrem Fahrzeug.',
        'Mobile Autoreinigung',
        [
          {
            question: 'Was ist mobile Autoreinigung?',
            answer: 'Bei der mobilen Autoreinigung kommt das Reinigungsteam mit dem gesamten Equipment direkt zu Ihrem Fahrzeug — ob zu Hause, am Arbeitsplatz oder anderswo.',
          },
          {
            question: 'Wo bietet RCC mobile Autoreinigung an?',
            answer: 'RCC ist in der ganzen Schweiz im Einsatz. Bitte kontaktieren Sie uns für eine Bestätigung Ihres genauen Standorts.',
          },
          {
            question: 'Welche Fahrzeugtypen werden gereinigt?',
            answer: 'RCC reinigt Klein- und Kompaktwagen, Mittelklasse, SUV und grössere Fahrzeuge wie Vans und 7-Sitzer. Die Grösse bestimmt den Paketpreis.',
          },
        ],
      );

    case 'leistungen/innenreinigung':
      return buildServiceDetailJsonLd(
        canonical,
        'Innenreinigung Auto Schweiz',
        'Professionelle Autoinnenreinigung durch RCC: Fahrgastraum, Sitze, Armaturenbrett und Türen werden gründlich gereinigt — mobil in der ganzen Schweiz.',
        'Innenreinigung',
        [
          {
            question: 'Was umfasst die Innenreinigung bei RCC?',
            answer: 'Die Innenreinigung umfasst das Saugen des Fahrgastraums, Reinigen der Scheiben innen, Abwischen des Armaturenbretts, der Türverkleidungen und der Lederausstattung sowie das Reinigen der Fussmatten.',
          },
          {
            question: 'Was ist der Unterschied zwischen Basic und Premium Innenreinigung?',
            answer: 'Das Premium-Paket beinhaltet zusätzlich intensive Fussmattenreinigung mit Shampoo, detaillierte Reinigung von Cockpit und Türen mit Bürste sowie die Reinigung der Auspuffenden.',
          },
        ],
      );

    case 'leistungen/aussenreinigung':
      return buildServiceDetailJsonLd(
        canonical,
        'Aussenreinigung Auto Schweiz',
        'Professionelle Aussenreinigung Ihres Fahrzeugs durch RCC: Handwäsche, Felgen, Scheiben und Karosseriepflege — mobil in der ganzen Schweiz.',
        'Aussenreinigung',
        [
          {
            question: 'Was umfasst die Aussenreinigung bei RCC?',
            answer: 'Die Aussenreinigung umfasst detaillierte Handwäsche, Glanzpolitur von Hand, Reinigung der Seitenscheiben aussen, Felgenreinigung, Reinigung des Tankdeckels und sorgfältiges Trocknen.',
          },
          {
            question: 'Was bietet das Premium Aussen-Paket zusätzlich?',
            answer: 'Das Premium-Paket umfasst zusätzlich Reifenreinigung, Reifenglanzpflege sowie das Entfernen von anhaftenden Insektenresten vom Lack.',
          },
        ],
      );

    case 'leistungen/fahrzeugaufbereitung':
      return buildServiceDetailJsonLd(
        canonical,
        'Fahrzeugaufbereitung Schweiz',
        'Komplette Fahrzeugaufbereitung von RCC: Innen- und Aussenreinigung in einem Paket — professionelle Rundum-Pflege mobil in der ganzen Schweiz.',
        'Fahrzeugaufbereitung',
        [
          {
            question: 'Was ist Fahrzeugaufbereitung?',
            answer: 'Die Fahrzeugaufbereitung umfasst die vollständige Innen- und Aussenreinigung Ihres Fahrzeugs in einem kombinierten Paket. RCC pflegt Innenraum und Karosserie gleichzeitig.',
          },
          {
            question: 'Welche Pakete gibt es für die Komplettaufbereitung?',
            answer: 'RCC bietet Innen & Aussen Basic (CHF 170 bis 320) und Innen & Aussen Premium (CHF 200 bis 400) an. Der genaue Preis richtet sich nach Ihrer Fahrzeuggrösse.',
          },
        ],
      );

    case 'einsatzgebiet':
      return buildEinsatzgebietJsonLd(canonical);

    case 'mobile-autoreinigung/zuerich':
      return buildZuerichJsonLd(canonical);

    default:
      return {};
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Get full page metadata for a given route key + language. */
export function getRouteMetadata(routeKey: RouteKey, lang: Lang): PageMetadata {
  // Fall back to DE if this language has no copy for this route
  const copy = META[routeKey][lang] ?? META[routeKey]['de']!;
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
    jsonLd: buildJsonLd(routeKey, lang, canonical),
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

// Re-export isKnownPath for SeoHead
export { isKnownPath };
