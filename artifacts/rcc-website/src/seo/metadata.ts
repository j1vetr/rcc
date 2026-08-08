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
import { FAQ_CONTENT } from '@/data/faq-content';
import { getGuideArticleMetadata, type GuideArticleKey } from './articleMetadata';
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
        'Professionelle mobile Autoreinigung in der Schweiz. RCC reinigt Ihr Fahrzeug direkt vor Ort — Innenreinigung, Aussenreinigung und Fahrzeugaufbereitung.',
    },
    en: {
      title: 'Mobile Car Cleaning Switzerland | RCC Royal Car Cleaning',
      description:
        'Professional mobile car cleaning in Switzerland. RCC cleans and cares for your vehicle on location — interior, exterior and full detailing.',
    },
    fr: {
      title: 'Lavage Auto Mobile Suisse | RCC Royal Car Cleaning',
      description:
        'Nettoyage automobile mobile professionnel en Suisse. RCC nettoie et entretient votre véhicule directement chez vous.',
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
    en: {
      title: 'Mobile Car Cleaning Services Switzerland | RCC',
      description:
        'All RCC services at a glance: mobile car cleaning, interior cleaning, exterior cleaning and vehicle detailing — we come directly to your location.',
    },
    fr: {
      title: 'Services Nettoyage Voiture Mobile Suisse | RCC',
      description:
        'Tous les services RCC : nettoyage voiture mobile, nettoyage intérieur, nettoyage extérieur et préparation du véhicule — directement chez vous.',
    },
  },
  'leistungen/mobile-autoreinigung': {
    de: {
      title: 'Mobile Autoreinigung Schweiz | RCC Royal Car Cleaning',
      description:
        'RCC bietet professionelle mobile Autoreinigung in der Schweiz. Wir kommen mit dem vollständigen Equipment direkt zu Ihrem Fahrzeug.',
    },
    en: {
      title: 'Mobile Car Cleaning Switzerland | RCC Royal Car Cleaning',
      description:
        'RCC provides professional mobile car cleaning in Switzerland. We bring the full professional setup directly to your vehicle — at home, at work, or at your location.',
    },
    fr: {
      title: 'Nettoyage Voiture Mobile Suisse | RCC Royal Car Cleaning',
      description:
        'RCC propose un nettoyage automobile mobile professionnel en Suisse. Nous venons directement chez vous avec tout le matériel professionnel.',
    },
  },
  'leistungen/innenreinigung': {
    de: {
      title: 'Innenreinigung Auto Zürich & Schweiz | RCC',
      description:
        'Professionelle Autoinnenreinigung von RCC. Innenraum, Sitze, Armaturenbrett und Türen werden gründlich gereinigt — direkt bei Ihnen vor Ort in der Schweiz.',
    },
    en: {
      title: 'Interior Car Cleaning Switzerland | RCC Royal Car Cleaning',
      description:
        'Professional car interior cleaning by RCC. Passenger compartment, seats, dashboard and door panels cleaned thoroughly — mobile service in Switzerland.',
    },
    fr: {
      title: 'Nettoyage Intérieur Voiture Suisse | RCC Royal Car Cleaning',
      description:
        "Nettoyage professionnel de l'habitacle par RCC. Aspirateur, tableau de bord, vitres et garnitures nettoyés avec soin — service mobile en Suisse.",
    },
  },
  'leistungen/aussenreinigung': {
    de: {
      title: 'Aussenreinigung Auto Schweiz | RCC Mobile Autopflege',
      description:
        'Professionelle Aussenreinigung Ihres Fahrzeugs durch RCC. Handwäsche, Felgen, Scheiben und Karosseriepflege — mobiler Service in der Schweiz.',
    },
    en: {
      title: 'Exterior Car Cleaning Switzerland | RCC Mobile Car Care',
      description:
        'Professional exterior car cleaning by RCC. Hand wash, wheel cleaning, window cleaning and bodywork care — mobile service in Switzerland.',
    },
    fr: {
      title: 'Nettoyage Extérieur Voiture Suisse | RCC Mobile Autopflege',
      description:
        'Nettoyage extérieur professionnel de votre véhicule par RCC. Lavage à la main, jantes, vitres et carrosserie — service mobile en Suisse.',
    },
  },
  'leistungen/fahrzeugaufbereitung': {
    de: {
      title: 'Fahrzeugaufbereitung Zürich & Schweiz | RCC',
      description:
        'Komplette Fahrzeugaufbereitung von RCC: Innen- und Aussenreinigung in einem Paket. Professionelle Rundum-Pflege — mobiler Service in der Schweiz.',
    },
    en: {
      title: 'Complete Car Detailing Switzerland | RCC Royal Car Cleaning',
      description:
        'Complete vehicle detailing by RCC: interior and exterior cleaning in one package. Professional full-service care, mobile in Switzerland.',
    },
    fr: {
      title: 'Préparation Complète Véhicule Suisse | RCC Royal Car Cleaning',
      description:
        "Préparation complète du véhicule par RCC : nettoyage intérieur et extérieur en un seul forfait. Service professionnel mobile en Suisse.",
    },
  },
  einsatzgebiet: {
    de: {
      title: 'Einsatzgebiet Schweiz | RCC Mobile Autopflege',
      description:
        'RCC ist in Zürich zuhause und bietet mobile Autopflege in der ganzen Schweiz. Erfahren Sie mehr über unser Einsatzgebiet.',
    },
    en: {
      title: 'Service Area Switzerland | RCC Mobile Car Cleaning',
      description:
        'Based in Zurich, RCC provides mobile car cleaning throughout Switzerland. Learn more about the service area and request a quote.',
    },
    fr: {
      title: 'Zone de Service Suisse | RCC Nettoyage Voiture Mobile',
      description:
        'Basé à Zurich, RCC propose un nettoyage automobile mobile dans toute la Suisse. Découvrez la zone de service et demandez un devis.',
    },
  },
  'mobile-autoreinigung/zuerich': {
    de: {
      title: 'Mobile Autoreinigung Zürich | RCC Royal Car Cleaning',
      description:
        'Professionelle mobile Autoreinigung in Zürich. RCC reinigt Ihr Fahrzeug direkt bei Ihnen — Innenreinigung, Aussenreinigung und Komplettreinigung im Raum Zürich.',
    },
    en: {
      title: 'Mobile Car Cleaning Zurich | RCC Royal Car Cleaning',
      description:
        'Professional mobile car cleaning in Zurich. RCC cleans your vehicle at your location — interior, exterior and complete car cleaning across the Zurich area.',
    },
    fr: {
      title: 'Nettoyage Voiture Mobile Zurich | RCC Royal Car Cleaning',
      description:
        'Nettoyage automobile mobile professionnel à Zurich. RCC nettoie votre véhicule chez vous — nettoyage intérieur, extérieur et complet dans la région de Zurich.',
    },
  },
  firmenkunden: {
    de: {
      title: 'Fahrzeugreinigung für Firmen & Fuhrparks | RCC Schweiz',
      description:
        'Mobile Fahrzeugreinigung für Firmen, Geschäftsfahrzeuge, Firmenwagen und Fuhrparks in der Schweiz. Individuelle Firmenofferte von RCC anfragen.',
    },
    en: {
      title: 'Mobile Vehicle Cleaning for Businesses | RCC Switzerland',
      description:
        'Mobile vehicle cleaning for companies, business vehicles, company cars and fleets in Switzerland. Request an individual business quote from RCC.',
    },
    fr: {
      title: 'Nettoyage Automobile pour Entreprises | RCC Suisse',
      description:
        'Nettoyage automobile mobile pour entreprises, véhicules professionnels, voitures de société et flottes en Suisse. Demandez une offre entreprise RCC.',
    },
  },
  kontakt: {
    de: {
      title: 'Kontakt | RCC Mobile Autopflege Schweiz',
      description:
        'Kontaktieren Sie RCC Mobile Autopflege: Telefon, E-Mail, WhatsApp oder Online-Offerte. Wir melden uns umgehend für Ihre mobile Autoreinigung in der Schweiz.',
    },
    en: {
      title: 'Contact | RCC Mobile Car Cleaning Switzerland',
      description:
        'Contact RCC Mobile Car Cleaning by phone, email, WhatsApp or online quote. Based in Zurich, we serve customers throughout Switzerland.',
    },
    fr: {
      title: 'Contact | RCC Nettoyage Voiture Mobile Suisse',
      description:
        'Contactez RCC Nettoyage Voiture Mobile : téléphone, e-mail, WhatsApp ou devis en ligne. Nous répondons rapidement pour votre nettoyage automobile mobile en Suisse.',
    },
  },
  'ueber-uns': {
    de: {
      title: 'Über uns | RCC Royal Car Cleaning Schweiz',
      description:
        'RCC Royal Car Cleaning — professioneller mobiler Autopflege-Service in der Schweiz. Erfahren Sie mehr über unser Konzept, unsere Werte und unsere Dienstleistungen.',
    },
    en: {
      title: 'About Us | RCC Royal Car Cleaning Switzerland',
      description:
        'RCC Royal Car Cleaning — professional mobile car care service in Switzerland. Learn about our concept, our values and what makes our mobile service different.',
    },
    fr: {
      title: 'À Propos | RCC Royal Car Cleaning Suisse',
      description:
        "RCC Royal Car Cleaning — service de nettoyage automobile mobile professionnel en Suisse. Découvrez notre concept, nos valeurs et ce qui rend notre service unique.",
    },
  },
  faq: {
    de: {
      title: 'Häufige Fragen | RCC Mobile Autopflege Schweiz',
      description:
        'Antworten auf häufige Fragen zur mobilen Autoreinigung von RCC: Buchung, Pakete, Preise, Fahrzeugtypen, Einsatzgebiet und Ablauf.',
    },
    en: {
      title: 'FAQ | RCC Mobile Car Cleaning Switzerland',
      description:
        'Answers to frequently asked questions about RCC mobile car cleaning: booking, packages, pricing, vehicle types, service area and how it works.',
    },
    fr: {
      title: 'FAQ | RCC Nettoyage Voiture Mobile Suisse',
      description:
        'Réponses aux questions fréquentes sur le nettoyage automobile mobile RCC : réservation, forfaits, tarifs, types de véhicules, zone de service et déroulement.',
    },
  },

  // ── Ratgeber / Guides hub ──────────────────────────────────────────────────
  ratgeber: {
    de: {
      title: 'Ratgeber Autopflege Schweiz | RCC Royal Car Cleaning',
      description:
        'Praxisratgeber rund um Autopflege in der Schweiz: Innenreinigung, Winterpflege, Pflegerhythmus, Leder und Stoff, Leasingrückgabe. Von RCC Mobile Autopflege.',
    },
    en: {
      title: 'Car Care Guides Switzerland | RCC Royal Car Cleaning',
      description:
        'Practical car care guides for Switzerland: interior cleaning, winter care, cleaning frequency, leather and fabric seats, lease returns. From RCC Mobile Car Cleaning.',
    },
    fr: {
      title: "Guides Entretien Voiture Suisse | RCC Royal Car Cleaning",
      description:
        "Guides pratiques entretien automobile en Suisse : nettoyage intérieur, soin hivernal, fréquence de nettoyage, sièges cuir et tissu. Par RCC Nettoyage Mobile.",
    },
  },

  // ── Guide: interior cleaning ───────────────────────────────────────────────
  'ratgeber/auto-innenreinigung': {
    de: {
      title: 'Auto Innenreinigung: Was wirklich zählt | RCC Ratgeber',
      description:
        'Schritt für Schritt durch die Autoinnenreinigung — Sitze, Teppiche, Cockpit, Scheiben. Wann ist Basic ausreichend, wann lohnt Premium? RCC Ratgeber Autopflege.',
    },
    en: {
      title: 'Car Interior Cleaning: What Really Matters | RCC Guide',
      description:
        'Step by step through car interior cleaning — seats, carpets, dashboard, windows. When is Basic enough, when is Premium worth it? RCC Car Care Guide.',
    },
    fr: {
      title: "Nettoyage Intérieur Voiture : l'essentiel | Guide RCC",
      description:
        "Étape par étape : nettoyage intérieur voiture — sièges, tapis, tableau de bord, vitres. Quand le Basic suffit-il, quand le Premium vaut-il la peine ? Guide RCC.",
    },
  },

  // ── Guide: Autoaufbereitung Kosten (DE only) ───────────────────────────────
  'ratgeber/autoaufbereitung-kosten-schweiz': {
    de: {
      title: 'Autoaufbereitung Schweiz: Was beeinflusst den Preis? | RCC',
      description:
        'Welche Faktoren bestimmen den Preis einer professionellen Autoaufbereitung in der Schweiz? Fahrzeuggrösse, Reinigungsumfang, mobiler Service. RCC Ratgeber.',
    },
  },

  // ── Guide: Leasingrückgabe (DE only) ──────────────────────────────────────
  'ratgeber/auto-vor-leasingrueckgabe-reinigen': {
    de: {
      title: 'Auto vor der Leasingrückgabe reinigen | RCC Ratgeber',
      description:
        'Was Reinigung vor der Leasingrückgabe leisten kann — ohne rechtliche Einschätzungen. Praktische Hinweise zu Innen- und Aussenreinigung. RCC Mobile Autopflege.',
    },
  },

  // ── Guide: winter care ─────────────────────────────────────────────────────
  'ratgeber/autopflege-im-winter-schweiz': {
    de: {
      title: 'Autopflege im Winter Schweiz: Streusalz & Feuchtigkeit | RCC',
      description:
        'Streusalz, Feuchtigkeit und Temperaturschwankungen: Was Schweizer Autofahrer im Winter über Aussen- und Innenreinigung wissen sollten. RCC Ratgeber.',
    },
    en: {
      title: 'Car Care in Winter Switzerland: Salt & Moisture | RCC Guide',
      description:
        'Road salt, moisture and temperature swings: what Swiss drivers should know about exterior and interior cleaning in winter. RCC Car Care Guide.',
    },
    fr: {
      title: "Entretien Voiture Hiver Suisse : Sel & Humidité | Guide RCC",
      description:
        "Sel de déneigement, humidité et températures : ce que les conducteurs suisses doivent savoir sur le nettoyage en hiver. Guide RCC Nettoyage Mobile.",
    },
  },

  // ── Guide: leather and fabric (DE only) ───────────────────────────────────
  'ratgeber/innenreinigung-leder-stoff': {
    de: {
      title: 'Innenreinigung Leder und Stoff: Unterschiede | RCC Ratgeber',
      description:
        'Ledersitze und Stoffpolster brauchen unterschiedliche Pflege. Was bei der Innenreinigung zu beachten ist und wie professionelle Reinigung den Unterschied macht.',
    },
  },

  // ── Guide: how often ──────────────────────────────────────────────────────
  'ratgeber/wie-oft-auto-reinigen': {
    de: {
      title: 'Wie oft Auto reinigen? Richtig­er Pflegerhythmus | RCC',
      description:
        'Keine Pauschalantwort: Nutzungsintensität, Jahreszeit, Fahrzeugtyp und Standort bestimmen den optimalen Reinigungsrhythmus. RCC Ratgeber Autopflege Schweiz.',
    },
    en: {
      title: 'How Often Should You Clean Your Car? | RCC Guide',
      description:
        'No blanket answer: usage intensity, season, vehicle type and location determine the optimal cleaning frequency. RCC Car Care Guide Switzerland.',
    },
    fr: {
      title: "À quelle fréquence nettoyer sa voiture ? | Guide RCC",
      description:
        "Pas de réponse unique : intensité d'utilisation, saison, type de véhicule et lieu déterminent la bonne fréquence. Guide RCC Nettoyage Auto Suisse.",
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

/** @deprecated replaced by buildServicesHubJsonLd — kept for internal reference */
function _buildLeistungenJsonLd_unused(canonical: string): object {
  return buildServicesHubJsonLd('de', canonical);
}

function buildServicesHubJsonLd(lang: Lang, canonical: string): object {
  const labels: Record<Lang, { name: string; desc: string }> = {
    de: { name: 'Mobile Autoreinigung Schweiz', desc: 'Professionelle mobile Fahrzeugreinigung und Autopflege in der Schweiz.' },
    en: { name: 'Mobile Car Cleaning Switzerland', desc: 'Professional mobile car cleaning and detailing in Switzerland.' },
    fr: { name: 'Nettoyage Voiture Mobile Suisse', desc: 'Nettoyage automobile mobile professionnel et entretien en Suisse.' },
  };
  const homeName: Record<Lang, string> = { de: 'Leistungen', en: 'Services', fr: 'Services' };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildBusinessNode(),
      buildBreadcrumb([
        { name: 'RCC Royal Car Cleaning', url: `${BUSINESS.domain}/${lang}/` },
        { name: homeName[lang], url: canonical },
      ]),
      {
        '@type': 'Service',
        '@id': `${canonical}#service`,
        name: labels[lang].name,
        description: labels[lang].desc,
        provider: { '@id': `${BUSINESS.domain}/#business` },
        areaServed: { '@type': 'Country', name: 'Switzerland' },
      },
    ],
  };
}

function buildContactJsonLd(lang: Lang, canonical: string): object {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildBusinessNode(),
      buildBreadcrumb([
        { name: 'RCC Royal Car Cleaning', url: `${BUSINESS.domain}/${lang}/` },
        { name: lang === 'de' ? 'Kontakt' : 'Contact', url: canonical },
      ]),
    ],
  };
}

function buildAboutJsonLd(lang: Lang, canonical: string): object {
  const labels: Record<Lang, string> = { de: 'Über uns', en: 'About', fr: 'À propos' };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildBusinessNode(),
      buildBreadcrumb([
        { name: 'RCC Royal Car Cleaning', url: `${BUSINESS.domain}/${lang}/` },
        { name: labels[lang], url: canonical },
      ]),
    ],
  };
}

function buildFaqPageJsonLd(
  lang: Lang,
  canonical: string,
  faqs: Array<{ question: string; answer: string }>,
): object {
  const labels: Record<Lang, string> = { de: 'FAQ', en: 'FAQ', fr: 'FAQ' };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildBusinessNode(),
      buildBreadcrumb([
        { name: 'RCC Royal Car Cleaning', url: `${BUSINESS.domain}/${lang}/` },
        { name: labels[lang], url: canonical },
      ]),
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

function buildServiceDetailJsonLd(
  lang: Lang,
  canonical: string,
  serviceName: string,
  serviceDescription: string,
  breadcrumbLabel: string,
  faqs?: Array<{ question: string; answer: string }>,
): object {
  const servicesHubLabel: Record<Lang, string> = { de: 'Leistungen', en: 'Services', fr: 'Services' };
  const servicesHubPath: Record<Lang, string> = {
    de: `${BUSINESS.domain}/de/leistungen/`,
    en: `${BUSINESS.domain}/en/services/`,
    fr: `${BUSINESS.domain}/fr/prestations/`,
  };
  const graph: object[] = [
    buildBusinessNode(),
    buildBreadcrumb([
      { name: 'RCC Royal Car Cleaning', url: `${BUSINESS.domain}/${lang}/` },
      { name: servicesHubLabel[lang], url: servicesHubPath[lang] },
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

// Multilingual service data for JSON-LD
const SERVICE_JSONLD: Record<'leistungen/mobile-autoreinigung' | 'leistungen/innenreinigung' | 'leistungen/aussenreinigung' | 'leistungen/fahrzeugaufbereitung', Record<Lang, { name: string; desc: string; breadcrumb: string; faqs: Array<{ question: string; answer: string }> }>> = {
  'leistungen/mobile-autoreinigung': {
    de: {
      name: 'Mobile Autoreinigung Schweiz',
      desc: 'Professionelle mobile Autoreinigung in der Schweiz. RCC kommt mit dem vollständigen Equipment direkt zu Ihrem Fahrzeug.',
      breadcrumb: 'Mobile Autoreinigung',
      faqs: [
        { question: 'Was ist mobile Autoreinigung?', answer: 'Bei der mobilen Autoreinigung kommt das RCC-Team mit dem professionellen Equipment direkt zu Ihrem Fahrzeug — ob zu Hause, am Arbeitsplatz oder an einem anderen Ort.' },
        { question: 'Wo bietet RCC mobile Autoreinigung an?', answer: 'RCC ist in Zürich zuhause und als mobiler Service in der ganzen Schweiz für Sie im Einsatz. Kontaktieren Sie uns für Ihren gewünschten Termin und Standort.' },
        { question: 'Welche Fahrzeugtypen werden gereinigt?', answer: 'RCC reinigt Klein- und Kompaktwagen, Mittelklasse, SUV und grössere Fahrzeuge wie Vans und 7-Sitzer. Die Grösse bestimmt den Paketpreis.' },
      ],
    },
    en: {
      name: 'Mobile Car Cleaning Switzerland',
      desc: 'Professional mobile car cleaning in Switzerland. RCC brings the full professional setup directly to your vehicle.',
      breadcrumb: 'Mobile Car Cleaning',
      faqs: [
        { question: 'What is mobile car cleaning?', answer: 'Mobile car cleaning means the RCC team brings the full professional equipment directly to your vehicle — at home, at work, or at your location.' },
        { question: 'Where does RCC offer mobile car cleaning?', answer: 'Based in Zurich, RCC provides mobile car cleaning throughout Switzerland. Contact us to arrange your preferred appointment and location.' },
        { question: 'Which vehicle types are cleaned?', answer: 'RCC cleans small cars, compact and mid-size vehicles, SUVs and larger vehicles such as vans and 7-seaters. Vehicle size determines the exact package price.' },
      ],
    },
    fr: {
      name: 'Nettoyage Voiture Mobile Suisse',
      desc: 'Nettoyage automobile mobile professionnel en Suisse. RCC vient directement chez vous avec tout le matériel.',
      breadcrumb: 'Nettoyage voiture mobile',
      faqs: [
        { question: "Qu'est-ce que le nettoyage voiture mobile ?", answer: "Le nettoyage voiture mobile signifie que l'équipe RCC vient directement chez vous avec tout le matériel professionnel — à domicile, au bureau ou ailleurs." },
        { question: 'Où RCC propose-t-il le nettoyage voiture mobile ?', answer: 'Basé à Zurich, RCC propose un nettoyage automobile mobile dans toute la Suisse. Contactez-nous pour convenir du lieu et du rendez-vous souhaités.' },
        { question: 'Quels types de véhicules sont nettoyés ?', answer: 'RCC nettoie les petites voitures, les compactes et berlines, les SUV ainsi que les grands véhicules comme les vans et 7 places. La taille du véhicule détermine le prix exact.' },
      ],
    },
  },
  'leistungen/innenreinigung': {
    de: {
      name: 'Innenreinigung Auto Schweiz',
      desc: 'Professionelle Autoinnenreinigung durch RCC: Fahrgastraum, Sitze, Armaturenbrett und Türen — mobiler Service in der Schweiz.',
      breadcrumb: 'Innenreinigung',
      faqs: [
        { question: 'Was umfasst die Innenreinigung bei RCC?', answer: 'Die Innenreinigung umfasst das Saugen des Fahrgastraums, Reinigen der Scheiben innen, Abwischen des Armaturenbretts, der Türverkleidungen und der Lederausstattung sowie das Reinigen der Fussmatten.' },
        { question: 'Was bietet das Premium-Paket zusätzlich?', answer: 'Das Premium-Paket beinhaltet zusätzlich intensive Fussmattenreinigung mit Shampoo, detaillierte Reinigung von Cockpit und Türen mit Bürste sowie die Reinigung der Auspuffenden.' },
      ],
    },
    en: {
      name: 'Interior Car Cleaning Switzerland',
      desc: 'Professional car interior cleaning by RCC: passenger compartment, seats, dashboard and door panels — mobile service in Switzerland.',
      breadcrumb: 'Interior Cleaning',
      faqs: [
        { question: 'What does interior cleaning include at RCC?', answer: 'Interior cleaning includes vacuuming the passenger compartment, cleaning interior windows, wiping the dashboard, door panels and leather trim, and cleaning floor mats.' },
        { question: 'What does the Premium package add?', answer: 'The Premium package adds intensive shampoo cleaning of floor mats, detailed brush cleaning of the cockpit and doors, and cleaning of exhaust tips.' },
      ],
    },
    fr: {
      name: 'Nettoyage Intérieur Voiture Suisse',
      desc: "Nettoyage professionnel de l'habitacle par RCC : siège, tableau de bord, vitres et garnitures — service mobile en Suisse.",
      breadcrumb: "Nettoyage intérieur",
      faqs: [
        { question: "Que comprend le nettoyage intérieur chez RCC ?", answer: "Le nettoyage intérieur comprend l'aspiration de l'habitacle, le nettoyage des vitres intérieures, l'essuyage du tableau de bord, des portes et des garnitures en cuir, ainsi que le nettoyage des tapis." },
        { question: "Qu'apporte le forfait Premium en plus ?", answer: "Le forfait Premium ajoute le nettoyage intensif des tapis au shampooing, le nettoyage détaillé du cockpit et des portes à la brosse, et le nettoyage des embouts d'échappement." },
      ],
    },
  },
  'leistungen/aussenreinigung': {
    de: {
      name: 'Aussenreinigung Auto Schweiz',
      desc: 'Professionelle Aussenreinigung durch RCC: Handwäsche, Felgen, Scheiben und Karosseriepflege — mobiler Service in der Schweiz.',
      breadcrumb: 'Aussenreinigung',
      faqs: [
        { question: 'Was umfasst die Aussenreinigung bei RCC?', answer: 'Detaillierte Handwäsche, Glanzpolitur von Hand, Reinigung der Seitenscheiben aussen, Felgenreinigung, Reinigung des Tankdeckels und sorgfältiges Trocknen.' },
        { question: 'Was bietet das Premium Aussen-Paket zusätzlich?', answer: 'Das Premium-Paket umfasst zusätzlich Reifenreinigung, Reifenglanzpflege sowie das Entfernen von anhaftenden Insektenresten vom Lack.' },
      ],
    },
    en: {
      name: 'Exterior Car Cleaning Switzerland',
      desc: 'Professional exterior car cleaning by RCC: hand wash, wheels, windows and bodywork care — mobile service in Switzerland.',
      breadcrumb: 'Exterior Cleaning',
      faqs: [
        { question: 'What does exterior cleaning include at RCC?', answer: 'Detailed hand wash, hand-applied gloss polish, exterior window cleaning, wheel cleaning, fuel flap cleaning and careful drying.' },
        { question: 'What does the Premium exterior package add?', answer: 'The Premium package additionally includes tyre cleaning, tyre shine and removal of bonded insect residue from the paintwork.' },
      ],
    },
    fr: {
      name: 'Nettoyage Extérieur Voiture Suisse',
      desc: 'Nettoyage extérieur professionnel par RCC : lavage à la main, jantes, vitres et carrosserie — service mobile en Suisse.',
      breadcrumb: 'Nettoyage extérieur',
      faqs: [
        { question: 'Que comprend le nettoyage extérieur chez RCC ?', answer: 'Lavage à la main détaillé, polissage brillant à la main, nettoyage extérieur des vitres latérales, nettoyage des jantes, nettoyage de la trappe à carburant et séchage soigné.' },
        { question: "Qu'apporte le forfait Premium Extérieur en plus ?", answer: 'Le forfait Premium ajoute le nettoyage des pneus, la finition brillante des pneus et l\'élimination des résidus d\'insectes sur la peinture.' },
      ],
    },
  },
  'leistungen/fahrzeugaufbereitung': {
    de: {
      name: 'Fahrzeugaufbereitung Schweiz',
      desc: 'Komplette Fahrzeugaufbereitung von RCC: Innen- und Aussenreinigung in einem Paket — Rundum-Pflege mobil in der Schweiz.',
      breadcrumb: 'Fahrzeugaufbereitung',
      faqs: [
        { question: 'Was ist Fahrzeugaufbereitung?', answer: 'Die Fahrzeugaufbereitung umfasst die vollständige Innen- und Aussenreinigung Ihres Fahrzeugs in einem kombinierten Paket. RCC pflegt Innenraum und Karosserie gleichzeitig.' },
        { question: 'Welche Pakete gibt es für die Komplettaufbereitung?', answer: 'RCC bietet Innen & Aussen Basic (CHF 170–320) und Innen & Aussen Premium (CHF 200–400) an. Der genaue Preis richtet sich nach Ihrer Fahrzeuggrösse.' },
      ],
    },
    en: {
      name: 'Complete Car Detailing Switzerland',
      desc: 'Complete vehicle detailing by RCC: interior and exterior cleaning in one package — professional full-service care, mobile in Switzerland.',
      breadcrumb: 'Car Detailing',
      faqs: [
        { question: 'What is car detailing?', answer: 'Car detailing means a complete interior and exterior cleaning of your vehicle in one combined package. RCC cares for the interior and bodywork at the same time.' },
        { question: 'What packages are available for complete detailing?', answer: 'RCC offers Interior & Exterior Basic (CHF 170–320) and Interior & Exterior Premium (CHF 200–400). The exact price depends on your vehicle size.' },
      ],
    },
    fr: {
      name: 'Préparation Complète Véhicule Suisse',
      desc: "Préparation complète du véhicule par RCC : nettoyage intérieur et extérieur en un seul forfait — service mobile professionnel en Suisse.",
      breadcrumb: 'Préparation véhicule',
      faqs: [
        { question: 'Qu\'est-ce que la préparation du véhicule ?', answer: "La préparation du véhicule comprend le nettoyage complet de l'intérieur et de l'extérieur en un seul forfait combiné. RCC s'occupe de l'habitacle et de la carrosserie en même temps." },
        { question: 'Quels forfaits existent pour la préparation complète ?', answer: 'RCC propose Intérieur & Extérieur Basic (CHF 170–320) et Intérieur & Extérieur Premium (CHF 200–400). Le prix exact dépend de la taille de votre véhicule.' },
      ],
    },
  },
};

// Multilingual Zurich page JSON-LD
const ZURICH_JSONLD: Record<Lang, { name: string; desc: string; cityName: string; mobileName: string; faqs: Array<{ question: string; answer: string }> }> = {
  de: {
    name: 'Mobile Autoreinigung Zürich',
    desc: 'Professionelle mobile Autoreinigung und Fahrzeugpflege im Raum Zürich durch RCC Royal Car Cleaning.',
    cityName: 'Zürich',
    mobileName: 'Mobile Autoreinigung',
    faqs: [
      { question: 'Bietet RCC mobile Autoreinigung in Zürich an?', answer: 'Ja, RCC bietet professionelle mobile Autoreinigung im Raum Zürich an. Wir kommen mit dem vollständigen Equipment direkt zu Ihrem Fahrzeug.' },
      { question: 'Welche Reinigungspakete sind in Zürich verfügbar?', answer: 'In Zürich sind alle RCC-Pakete verfügbar: Innenreinigung, Aussenreinigung und Komplettreinigung — jeweils in Basic und Premium.' },
      { question: 'Wie lange dauert eine mobile Autoreinigung in Zürich?', answer: 'Die Dauer variiert je nach gewähltem Paket und Fahrzeuggrösse. Bitte fragen Sie bei der Offertanfrage nach der genauen Zeitdauer.' },
      { question: 'Wie buche ich eine Autoreinigung in Zürich?', answer: 'Nutzen Sie das Offertformular auf unserer Website oder kontaktieren Sie uns direkt per Telefon oder WhatsApp. Wir melden uns umgehend.' },
    ],
  },
  en: {
    name: 'Mobile Car Cleaning Zurich',
    desc: 'Professional mobile car cleaning and vehicle care in the Zurich area by RCC Royal Car Cleaning.',
    cityName: 'Zurich',
    mobileName: 'Mobile Car Cleaning',
    faqs: [
      { question: 'Does RCC offer mobile car cleaning in Zurich?', answer: 'Yes, RCC offers professional mobile car cleaning in the Zurich area. We come with the full professional setup directly to your vehicle.' },
      { question: 'Which cleaning packages are available in Zurich?', answer: 'All RCC packages are available in Zurich: interior cleaning, exterior cleaning and complete cleaning — in Basic and Premium.' },
      { question: 'How long does mobile car cleaning take in Zurich?', answer: 'Duration varies by package and vehicle size. Please ask when requesting your quote for the exact time estimate for your vehicle.' },
      { question: 'How do I book car cleaning in Zurich?', answer: 'Use the quote form on our website or contact us directly by phone or WhatsApp. We respond promptly with an appointment proposal.' },
    ],
  },
  fr: {
    name: 'Nettoyage Voiture Mobile Zurich',
    desc: 'Nettoyage automobile mobile professionnel dans la région de Zurich par RCC Royal Car Cleaning.',
    cityName: 'Zurich',
    mobileName: 'Nettoyage voiture mobile',
    faqs: [
      { question: 'RCC propose-t-il le nettoyage voiture mobile à Zurich ?', answer: 'Oui, RCC propose un nettoyage automobile mobile professionnel dans la région de Zurich. Nous venons directement chez vous avec tout le matériel.' },
      { question: 'Quels forfaits sont disponibles à Zurich ?', answer: 'Tous les forfaits RCC sont disponibles à Zurich : nettoyage intérieur, extérieur et complet — en Basic et Premium.' },
      { question: 'Combien de temps dure un nettoyage automobile mobile à Zurich ?', answer: 'La durée varie selon le forfait et la taille du véhicule. Veuillez nous demander lors de votre devis pour une estimation précise.' },
      { question: 'Comment réserver un nettoyage à Zurich ?', answer: 'Utilisez le formulaire de devis sur notre site ou contactez-nous directement par téléphone ou WhatsApp. Nous répondons rapidement avec une proposition de rendez-vous.' },
    ],
  },
};

function buildEinsatzgebietJsonLdLang(lang: Lang, canonical: string): object {
  const labels: Record<Lang, { name: string; breadcrumb: string }> = {
    de: { name: 'Einsatzgebiet', breadcrumb: 'Einsatzgebiet' },
    en: { name: 'Service Area', breadcrumb: 'Service Area' },
    fr: { name: 'Zone de service', breadcrumb: 'Zones desservies' },
  };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildBusinessNode(),
      buildBreadcrumb([
        { name: 'RCC Royal Car Cleaning', url: `${BUSINESS.domain}/${lang}/` },
        { name: labels[lang].breadcrumb, url: canonical },
      ]),
      {
        '@type': 'Service',
        '@id': `${canonical}#service`,
        name: labels[lang].name,
        provider: { '@id': `${BUSINESS.domain}/#business` },
        areaServed: { '@type': 'Country', name: 'Switzerland' },
      },
    ],
  };
}

function buildBusinessCustomersJsonLd(lang: Lang, canonical: string): object {
  const labels: Record<Lang, { name: string; description: string; breadcrumb: string }> = {
    de: {
      name: 'Mobile Fahrzeugreinigung für Firmenkunden',
      description: 'Mobile Fahrzeugreinigung für Unternehmen, Geschäftsfahrzeuge, Firmenwagen, Mitarbeiterfahrzeuge und Fuhrparks in der Schweiz.',
      breadcrumb: 'Firmenkunden',
    },
    en: {
      name: 'Mobile Vehicle Cleaning for Business Customers',
      description: 'Mobile vehicle cleaning for companies, business vehicles, company cars, employee vehicles and fleets in Switzerland.',
      breadcrumb: 'Business Customers',
    },
    fr: {
      name: 'Nettoyage Automobile Mobile pour Clients Professionnels',
      description: 'Nettoyage automobile mobile pour entreprises, véhicules professionnels, voitures de société, véhicules des collaborateurs et flottes en Suisse.',
      breadcrumb: 'Clients professionnels',
    },
  };
  const data = labels[lang];
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildBusinessNode(),
      buildBreadcrumb([
        { name: 'RCC Royal Car Cleaning', url: `${BUSINESS.domain}/${lang}/` },
        { name: data.breadcrumb, url: canonical },
      ]),
      {
        '@type': 'Service',
        '@id': `${canonical}#service`,
        name: data.name,
        description: data.description,
        provider: { '@id': `${BUSINESS.domain}/#business` },
        areaServed: { '@type': 'Country', name: 'Switzerland' },
      },
    ],
  };
}

function buildZuerichJsonLdLang(lang: Lang, canonical: string): object {
  const d = ZURICH_JSONLD[lang];
  const mobilePath: Record<Lang, string> = {
    de: `${BUSINESS.domain}/de/leistungen/mobile-autoreinigung/`,
    en: `${BUSINESS.domain}/en/services/mobile-car-cleaning/`,
    fr: `${BUSINESS.domain}/fr/prestations/nettoyage-voiture-mobile/`,
  };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildBusinessNode(),
      buildBreadcrumb([
        { name: 'RCC Royal Car Cleaning', url: `${BUSINESS.domain}/${lang}/` },
        { name: d.mobileName, url: mobilePath[lang] },
        { name: d.cityName, url: canonical },
      ]),
      {
        '@type': 'Service',
        '@id': `${canonical}#service`,
        name: d.name,
        description: d.desc,
        provider: { '@id': `${BUSINESS.domain}/#business` },
        areaServed: {
          '@type': 'City',
          name: d.cityName,
          containedInPlace: { '@type': 'Country', name: 'Switzerland' },
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${canonical}#faq`,
        mainEntity: d.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
    ],
  };
}

// Guide Article/BlogPosting schema builder
function buildGuideArticleJsonLd(
  lang: Lang,
  canonical: string,
  headline: string,
  description: string,
  datePublished: string,
  dateModified: string,
  breadcrumbItems: Array<{ name: string; url: string }>,
): object {
  const ratgeberHubPath: Record<Lang, string> = {
    de: `${BUSINESS.domain}/de/ratgeber/`,
    en: `${BUSINESS.domain}/en/guides/`,
    fr: `${BUSINESS.domain}/fr/guides/`,
  };
  const ratgeberHubName: Record<Lang, string> = {
    de: 'Ratgeber',
    en: 'Guides',
    fr: 'Guides',
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildBusinessNode(),
      buildBreadcrumb(breadcrumbItems),
      {
        '@type': 'Article',
        '@id': `${canonical}#article`,
        headline,
        description,
        datePublished,
        dateModified,
        inLanguage: LANG_LOCALES[lang],
        url: canonical,
        isPartOf: {
          '@type': 'WebPage',
          url: canonical,
        },
        publisher: { '@id': `${BUSINESS.domain}/#business` },
        author: { '@id': `${BUSINESS.domain}/#business` },
      },
    ],
  };
}

function buildRatgeberHubJsonLd(lang: Lang, canonical: string): object {
  const labels: Record<Lang, string> = { de: 'Ratgeber', en: 'Guides', fr: 'Guides' };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildBusinessNode(),
      buildBreadcrumb([
        { name: 'RCC Royal Car Cleaning', url: `${BUSINESS.domain}/${lang}/` },
        { name: labels[lang], url: canonical },
      ]),
      {
        '@type': 'CollectionPage',
        '@id': `${canonical}#collection`,
        url: canonical,
        name: labels[lang],
        inLanguage: LANG_LOCALES[lang],
        publisher: { '@id': `${BUSINESS.domain}/#business` },
      },
    ],
  };
}

function buildJsonLd(routeKey: RouteKey, lang: Lang, canonical: string): object {
  switch (routeKey) {
    case 'home':
      return buildHomeJsonLd(lang, canonical);

    case 'packages':
      return buildPackagesJsonLd(lang, canonical);

    case 'leistungen':
      return buildServicesHubJsonLd(lang, canonical);

    case 'leistungen/mobile-autoreinigung':
    case 'leistungen/innenreinigung':
    case 'leistungen/aussenreinigung':
    case 'leistungen/fahrzeugaufbereitung': {
      const d = SERVICE_JSONLD[routeKey][lang];
      return buildServiceDetailJsonLd(lang, canonical, d.name, d.desc, d.breadcrumb, d.faqs);
    }

    case 'einsatzgebiet':
      return buildEinsatzgebietJsonLdLang(lang, canonical);

    case 'mobile-autoreinigung/zuerich':
      return buildZuerichJsonLdLang(lang, canonical);

    case 'firmenkunden':
      return buildBusinessCustomersJsonLd(lang, canonical);

    case 'kontakt':
      return buildContactJsonLd(lang, canonical);

    case 'ueber-uns':
      return buildAboutJsonLd(lang, canonical);

    case 'faq':
      return buildFaqPageJsonLd(lang, canonical, FAQ_CONTENT[lang]);

    case 'ratgeber':
      return buildRatgeberHubJsonLd(lang, canonical);

    case 'ratgeber/auto-innenreinigung':
    case 'ratgeber/autoaufbereitung-kosten-schweiz':
    case 'ratgeber/auto-vor-leasingrueckgabe-reinigen':
    case 'ratgeber/autopflege-im-winter-schweiz':
    case 'ratgeber/innenreinigung-leder-stoff':
    case 'ratgeber/wie-oft-auto-reinigen': {
      const guideData = getGuideArticleMetadata(
        routeKey.replace('ratgeber/', '') as GuideArticleKey,
        lang,
      );
      const ratgeberPath: Record<Lang, string> = {
        de: `${BUSINESS.domain}/de/ratgeber/`,
        en: `${BUSINESS.domain}/en/guides/`,
        fr: `${BUSINESS.domain}/fr/guides/`,
      };
      const ratgeberName: Record<Lang, string> = { de: 'Ratgeber', en: 'Guides', fr: 'Guides' };
      return buildGuideArticleJsonLd(
        lang,
        canonical,
        guideData.title,
        guideData.description,
        guideData.datePublished,
        guideData.dateModified,
        [
          { name: 'RCC Royal Car Cleaning', url: `${BUSINESS.domain}/${lang}/` },
          { name: ratgeberName[lang], url: ratgeberPath[lang] },
          { name: guideData.title, url: canonical },
        ],
      );
    }

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
