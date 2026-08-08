import type { Lang } from './routes';

export type GuideArticleKey =
  | 'auto-innenreinigung'
  | 'autopflege-im-winter-schweiz'
  | 'wie-oft-auto-reinigen'
  | 'autoaufbereitung-kosten-schweiz'
  | 'auto-vor-leasingrueckgabe-reinigen'
  | 'innenreinigung-leder-stoff';

export interface GuideArticleMetadata {
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  language: Lang;
  url: string;
}

const PUBLISHED_DATE = '2026-08-08';

const ARTICLES: Record<GuideArticleKey, Partial<Record<Lang, Omit<GuideArticleMetadata, 'language' | 'url'>>>> = {
  'auto-innenreinigung': {
    de: {
      title: 'Auto Innenreinigung: Was wirklich zählt',
      description: 'Schritt für Schritt durch eine gründliche Autoinnenreinigung. Von Sitzen und Teppichen bis zu Cockpit und Scheiben. Wann reicht Basic, wann lohnt Premium?',
      datePublished: PUBLISHED_DATE,
      dateModified: PUBLISHED_DATE,
    },
    en: {
      title: 'Car Interior Cleaning: What Really Matters',
      description: 'Step by step through a thorough car interior clean. From seats and carpets to dashboard and windows. When is Basic enough, when is Premium worth it?',
      datePublished: PUBLISHED_DATE,
      dateModified: PUBLISHED_DATE,
    },
    fr: {
      title: "Nettoyage intérieur voiture : l'essentiel à savoir",
      description: "Étape par étape pour un nettoyage intérieur complet. Des sièges aux tapis, du tableau de bord aux vitres. Quand le Basic suffit-il, quand le Premium vaut-il la peine ?",
      datePublished: PUBLISHED_DATE,
      dateModified: PUBLISHED_DATE,
    },
  },
  'autopflege-im-winter-schweiz': {
    de: {
      title: 'Autopflege im Winter in der Schweiz',
      description: 'Streusalz, Nässe und Temperaturen unter null. Was Schweizer Autofahrer im Winter wissen sollten, um Lack, Unterboden und Innenraum zu schützen.',
      datePublished: PUBLISHED_DATE,
      dateModified: PUBLISHED_DATE,
    },
    en: {
      title: 'Car Care in Winter in Switzerland',
      description: 'Road salt, moisture and temperatures below zero. What Swiss drivers should know to protect the paintwork, undercarriage and interior in winter.',
      datePublished: PUBLISHED_DATE,
      dateModified: PUBLISHED_DATE,
    },
    fr: {
      title: 'Entretien voiture en hiver en Suisse',
      description: "Sel de déneigement, humidité et températures négatives. Ce que les conducteurs suisses doivent savoir pour protéger la carrosserie, le dessous de caisse et l'habitacle en hiver.",
      datePublished: PUBLISHED_DATE,
      dateModified: PUBLISHED_DATE,
    },
  },
  'wie-oft-auto-reinigen': {
    de: {
      title: 'Wie oft soll man das Auto reinigen?',
      description: 'Keine pauschale Antwort, sondern klare Faktoren. Nutzung, Jahreszeit, Fahrzeugtyp und Standort bestimmen den richtigen Rhythmus für Innen- und Aussenreinigung.',
      datePublished: PUBLISHED_DATE,
      dateModified: PUBLISHED_DATE,
    },
    en: {
      title: 'How Often Should You Clean Your Car?',
      description: 'No blanket answer. Usage, season, vehicle type and location determine the right cleaning rhythm for interior and exterior.',
      datePublished: PUBLISHED_DATE,
      dateModified: PUBLISHED_DATE,
    },
    fr: {
      title: "À quelle fréquence faut-il nettoyer sa voiture ?",
      description: "Pas de réponse uniforme. L'utilisation, la saison, le type de véhicule et le lieu déterminent le bon rythme de nettoyage intérieur et extérieur.",
      datePublished: PUBLISHED_DATE,
      dateModified: PUBLISHED_DATE,
    },
  },
  'autoaufbereitung-kosten-schweiz': {
    de: {
      title: 'Autoaufbereitung Schweiz: Was kostet die Reinigung?',
      description: 'Welche Faktoren beeinflussen den Preis einer professionellen Autoaufbereitung in der Schweiz? Fahrzeuggrösse, Reinigungsumfang und mobiler Service im Vergleich.',
      datePublished: PUBLISHED_DATE,
      dateModified: PUBLISHED_DATE,
    },
  },
  'auto-vor-leasingrueckgabe-reinigen': {
    de: {
      title: 'Auto vor der Leasingrückgabe reinigen',
      description: 'Was Reinigung vor der Leasingrückgabe leisten kann, ohne rechtliche Einschätzungen. Praktische Hinweise zu Innen- und Aussenreinigung.',
      datePublished: PUBLISHED_DATE,
      dateModified: PUBLISHED_DATE,
    },
  },
  'innenreinigung-leder-stoff': {
    de: {
      title: 'Innenreinigung: Leder oder Stoff richtig reinigen',
      description: 'Ledersitze und Stoffpolster brauchen unterschiedliche Pflege. Was bei der Innenreinigung zu beachten ist und wie professionelle Reinigung den Unterschied macht.',
      datePublished: PUBLISHED_DATE,
      dateModified: PUBLISHED_DATE,
    },
  },
};

const SLUGS: Record<GuideArticleKey, Partial<Record<Lang, string>>> = {
  'auto-innenreinigung': {
    de: '/de/ratgeber/auto-innenreinigung/',
    en: '/en/guides/car-interior-cleaning/',
    fr: '/fr/guides/nettoyage-interieur-voiture/',
  },
  'autopflege-im-winter-schweiz': {
    de: '/de/ratgeber/autopflege-im-winter-schweiz/',
    en: '/en/guides/car-care-winter-switzerland/',
    fr: '/fr/guides/entretien-voiture-hiver-suisse/',
  },
  'wie-oft-auto-reinigen': {
    de: '/de/ratgeber/wie-oft-auto-reinigen/',
    en: '/en/guides/how-often-clean-car/',
    fr: '/fr/guides/frequence-nettoyage-voiture/',
  },
  'autoaufbereitung-kosten-schweiz': {
    de: '/de/ratgeber/autoaufbereitung-kosten-schweiz/',
  },
  'auto-vor-leasingrueckgabe-reinigen': {
    de: '/de/ratgeber/auto-vor-leasingrueckgabe-reinigen/',
  },
  'innenreinigung-leder-stoff': {
    de: '/de/ratgeber/innenreinigung-leder-stoff/',
  },
};

export function getGuideArticleMetadata(key: GuideArticleKey, language: Lang): GuideArticleMetadata {
  const localized = ARTICLES[key][language] ?? ARTICLES[key].de;
  const url = SLUGS[key][language] ?? SLUGS[key].de;
  if (!localized || !url) {
    throw new Error(`Missing guide metadata for ${key} (${language})`);
  }
  return { ...localized, language, url };
}

export function formatGuideDate(isoDate: string, language: Lang): string {
  return new Intl.DateTimeFormat(
    language === 'de' ? 'de-CH' : language === 'fr' ? 'fr-CH' : 'en-GB',
    { day: 'numeric', month: 'long', year: 'numeric' },
  ).format(new Date(`${isoDate}T00:00:00Z`));
}