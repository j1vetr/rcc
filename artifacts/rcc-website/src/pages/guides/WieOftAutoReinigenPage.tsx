/**
 * Guide: Wie oft Auto reinigen — serves DE, EN, FR.
 * DE: /de/ratgeber/wie-oft-auto-reinigen/
 * EN: /en/guides/how-often-clean-car/
 * FR: /fr/guides/frequence-nettoyage-voiture/
 */

import { GuidePageTemplate, type GuidePageConfig } from './GuidePageTemplate';
import { useTranslation } from '@/i18n/LanguageContext';
import type { Lang } from '@/seo/routes';

const CONFIGS: Record<Lang, GuidePageConfig> = {
  de: {
    breadcrumbs: [
      { label: 'RCC Royal Car Cleaning', href: '/de/' },
      { label: 'Ratgeber', href: '/de/ratgeber/' },
      { label: 'Wie oft Auto reinigen?' },
    ],
    eyebrow: 'RCC Ratgeber · Pflegerhythmus',
    h1: 'Wie oft soll man das Auto reinigen?',
    lead: 'Eine einheitliche Antwort gibt es nicht — der richtige Reinigungsrhythmus hängt von mehreren Faktoren ab: Nutzungsintensität, Jahreszeit, Fahrzeugtyp und wo das Fahrzeug steht.',
    articleKey: 'wie-oft-auto-reinigen',
    language: 'de',
    sections: [
      {
        heading: 'Vier Faktoren bestimmen den Rhythmus',
        paragraphs: [
          'Erstens die Nutzungsintensität: Ein Fahrzeug, das täglich viele Kilometer auf Autobahnen und Landstrassen zurücklegt, verschmutzt schneller als ein Stadtauto mit kurzen Strecken. Kinder und Tiere im Fahrzeug erhöhen den Innenreinigungsbedarf deutlich.',
          'Zweitens die Jahreszeit: Im Winter bringen Streusalz und Strassenschmutz mehr Verunreinigungen auf Lack und in den Innenraum. Im Frühling können Pollen und Baumharz Probleme bereiten. Im Sommer klebt Insektenreste auf dem Lack.',
          'Drittens der Abstellplatz: Fahrzeuge, die unter Bäumen stehen, sammeln Harz, Vogelkot und Blütenpollen schneller als solche in der Tiefgarage.',
          'Viertens der Fahrzeugtyp: Weisse und helle Fahrzeuge zeigen Dreck später als dunkle. SUV und Transporter verschmutzen an Radkästen und Schwellern stärker.',
        ],
      },
      {
        heading: 'Aussenreinigung: Wie oft ist sinnvoll?',
        level: 'h2',
        paragraphs: [
          'Als grobe Orientierung: Eine gründliche Aussenreinigung alle vier bis sechs Wochen ist für die meisten Fahrzeuge sinnvoll. Bei intensiver Nutzung, nach Fahrten auf gestreuten Winterstrassen oder nach langen Autobahnfahrten mit viel Insektenaufkommen kann kürzer sinnvoll sein.',
          'Nach Fahrten mit viel Streusalz empfiehlt sich eine Reinigung zeitnah, um Korrosion vorzubeugen.',
        ],
      },
      {
        heading: 'Innenreinigung: Wie oft ist sinnvoll?',
        level: 'h2',
        paragraphs: [
          'Eine gründliche Innenreinigung — Saugen, Scheiben, Cockpit abwischen — alle zwei bis drei Monate ist ein realistischer Richtwert für normale Nutzung. Bei regelmässiger Mitnahme von Kindern, Haustieren oder Sportausrüstung ist monatliche Innenreinigung sinnvoller.',
          'Kleinfussmatten regelmässig auszuschütteln und Hartflächen abzuwischen hilft, den Grundzustand zu halten und aufwändigere Reinigungen seltener nötig zu machen.',
        ],
      },
      {
        heading: 'Wann lohnt eine Komplettreinigung (Innen & Aussen)?',
        level: 'h2',
        paragraphs: [
          'Eine Komplettreinigung — Innen und Aussen in einem Durchgang — bietet sich zweimal jährlich an: einmal nach dem Winter (Salz von der Karosserie, Winterschmutz aus dem Innenraum) und einmal im Herbst (Laub, Feuchtigkeit, Reifenabrieb).',
          'Vor dem Verkauf, vor einer Leasingrückgabe oder nach einem grösseren Ereignis (Umzug, Camping, Tierrücktransport) ist eine Komplettreinigung ebenfalls sinnvoll.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Wie oft sollte man das Auto aussen reinigen?',
        answer: 'Als Richtwert: alle vier bis sechs Wochen für eine gründliche Aussenreinigung. Bei Winterbetrieb auf gestreuten Strassen kürzer, da Streusalz schnell Schäden anrichten kann.',
      },
      {
        question: 'Wie oft sollte man den Innenraum reinigen?',
        answer: 'Alle zwei bis drei Monate ist ein sinnvoller Rhythmus für normale Nutzung. Mit Kindern, Tieren oder viel Outdoor-Ausrüstung eher monatlich.',
      },
      {
        question: 'Kann RCC regelmässige Autopflege vor Ort übernehmen?',
        answer: 'Ja. RCC ist ein mobiler Service und kommt direkt zu Ihrem Fahrzeugstandort in der Schweiz. Anfrage über das Formular auf der Website.',
      },
    ],
    internalLinks: [
      { label: 'Alle Pakete & Preise', href: '/de/pakete/' },
      { label: 'Aussenreinigung', href: '/de/leistungen/aussenreinigung/' },
      { label: 'Innenreinigung', href: '/de/leistungen/innenreinigung/' },
      { label: 'Komplettreinigung', href: '/de/leistungen/fahrzeugaufbereitung/' },
      { label: 'Einsatzgebiet Schweiz', href: '/de/einsatzgebiet/' },
    ],
    ctaHeading: 'Pflege anfragen',
    ctaText: 'RCC kommt mit dem Equipment direkt zu Ihrem Fahrzeugstandort in der Schweiz.',
    ctaLabel: 'Jetzt Offerte anfragen',
    ctaHref: '/de/#quote',
  },

  en: {
    breadcrumbs: [
      { label: 'RCC Royal Car Cleaning', href: '/en/' },
      { label: 'Guides', href: '/en/guides/' },
      { label: 'How Often to Clean Your Car' },
    ],
    eyebrow: 'RCC Guides · Cleaning Frequency',
    h1: 'How Often Should You Clean Your Car?',
    lead: 'There is no single answer — the right cleaning frequency depends on several factors: how intensively you use the car, the season, vehicle type and where you park.',
    articleKey: 'wie-oft-auto-reinigen',
    language: 'en',
    sections: [
      {
        heading: 'Four Factors Determine the Rhythm',
        paragraphs: [
          "First, usage intensity: a vehicle that covers many kilometres daily on motorways and country roads gets dirty faster than a city car with short trips. Children and pets in the vehicle significantly increase interior cleaning needs.",
          "Second, the season: in winter, road salt and street grime bring more contamination to paintwork and the interior. In spring, pollen and tree resin can cause problems. In summer, insect remains stick to the paintwork.",
          "Third, where you park: vehicles parked under trees collect resin, bird droppings and pollen faster than those in underground garages.",
          "Fourth, vehicle type: white and light-coloured vehicles show dirt later than dark ones. SUVs and vans get dirtier around wheel arches and sills.",
        ],
      },
      {
        heading: 'Exterior Cleaning: How Often Makes Sense?',
        level: 'h2',
        paragraphs: [
          "As a rough guide: a thorough exterior clean every four to six weeks makes sense for most vehicles. With intensive use, after driving on salted winter roads, or after long motorway trips with many insects, shorter intervals may be needed.",
          "After heavy road salt exposure, cleaning promptly is advisable to prevent corrosion.",
        ],
      },
      {
        heading: 'Interior Cleaning: How Often Makes Sense?',
        level: 'h2',
        paragraphs: [
          "A thorough interior clean — vacuuming, windows, wiping the cockpit — every two to three months is a realistic benchmark for normal use. With regular passengers including children, pets or sports equipment, monthly interior cleaning makes more sense.",
          "Regularly shaking out small floor mats and wiping hard surfaces helps maintain the baseline condition and reduces the need for intensive cleans.",
        ],
      },
      {
        heading: 'When Is a Complete Clean (Inside & Outside) Worth It?',
        level: 'h2',
        paragraphs: [
          "A complete clean — inside and outside in one session — makes sense twice a year: once after winter (salt from bodywork, winter dirt from the interior) and once in autumn (leaves, moisture, tyre residue).",
          "Before selling, before returning a leased vehicle, or after a major event (moving, camping, transporting animals) a complete clean is also worthwhile.",
        ],
      },
    ],
    faqs: [
      {
        question: 'How often should I clean my car exterior?',
        answer: 'As a guide: every four to six weeks for a thorough exterior clean. In winter with salted roads, more frequently, as road salt can cause damage quickly.',
      },
      {
        question: 'How often should I clean the interior?',
        answer: 'Every two to three months is a sensible rhythm for normal use. With children, pets or lots of outdoor equipment, closer to monthly.',
      },
      {
        question: 'Can RCC take over regular on-site car care?',
        answer: 'Yes. RCC is a mobile service and comes directly to your vehicle location in Switzerland. Request via the form on the website.',
      },
    ],
    internalLinks: [
      { label: 'All Packages & Prices', href: '/en/packages/' },
      { label: 'Exterior Cleaning', href: '/en/services/exterior-cleaning/' },
      { label: 'Interior Cleaning', href: '/en/services/interior-cleaning/' },
      { label: 'Complete Detailing', href: '/en/services/car-detailing/' },
      { label: 'Service Area Switzerland', href: '/en/service-area/' },
    ],
    ctaHeading: 'Request Car Care',
    ctaText: 'RCC brings the equipment directly to your vehicle location in Switzerland.',
    ctaLabel: 'Request a Quote',
    ctaHref: '/en/#quote',
  },

  fr: {
    breadcrumbs: [
      { label: 'RCC Royal Car Cleaning', href: '/fr/' },
      { label: 'Guides', href: '/fr/guides/' },
      { label: 'Fréquence nettoyage voiture' },
    ],
    eyebrow: "Guides RCC · Fréquence d'entretien",
    h1: "À quelle fréquence faut-il nettoyer sa voiture ?",
    lead: "Il n'existe pas de réponse unique — la bonne fréquence de nettoyage dépend de plusieurs facteurs : l'intensité d'utilisation, la saison, le type de véhicule et l'endroit où vous garez votre voiture.",
    articleKey: 'wie-oft-auto-reinigen',
    language: 'fr',
    sections: [
      {
        heading: "Quatre facteurs déterminent le rythme",
        paragraphs: [
          "Premièrement, l'intensité d'utilisation : un véhicule qui parcourt de nombreux kilomètres quotidiennement se salit plus vite qu'une voiture de ville. Les enfants et les animaux de compagnie augmentent significativement le besoin de nettoyage intérieur.",
          "Deuxièmement, la saison : en hiver, le sel de déneigement apporte plus de contamination sur la carrosserie et dans l'habitacle. Au printemps, le pollen et la résine posent problème. En été, les insectes collent à la peinture.",
          "Troisièmement, l'emplacement de stationnement : les véhicules garés sous des arbres accumulent plus vite résine, fientes et pollen.",
          "Quatrièmement, le type de véhicule : les véhicules blancs et clairs montrent la saleté plus tard. Les SUV et utilitaires se salissent davantage aux passages de roues.",
        ],
      },
      {
        heading: "Nettoyage extérieur : quelle fréquence est judicieuse ?",
        level: 'h2',
        paragraphs: [
          "En règle générale : un nettoyage extérieur complet toutes les quatre à six semaines est judicieux pour la plupart des véhicules. Avec une utilisation intensive, après des trajets sur des routes salées ou de longs trajets autoroutiers avec beaucoup d'insectes, des intervalles plus courts peuvent s'imposer.",
          "Après une forte exposition au sel de déneigement, un nettoyage rapide est conseillé pour prévenir la corrosion.",
        ],
      },
      {
        heading: "Nettoyage intérieur : quelle fréquence est judicieuse ?",
        level: 'h2',
        paragraphs: [
          "Un nettoyage intérieur complet — aspiration, vitres, essuyage du cockpit — tous les deux à trois mois est un repère réaliste pour une utilisation normale. Avec des passagers réguliers incluant des enfants, animaux ou équipements sportifs, un nettoyage mensuel est plus adapté.",
          "Secouer régulièrement les petits tapis et essuyer les surfaces dures aide à maintenir l'état de base et réduit le besoin de nettoyages intensifs.",
        ],
      },
    ],
    faqs: [
      {
        question: "À quelle fréquence faut-il nettoyer l'extérieur de la voiture ?",
        answer: "En règle générale : toutes les quatre à six semaines pour un nettoyage extérieur complet. En hiver avec des routes salées, plus fréquemment, car le sel peut rapidement causer des dommages.",
      },
      {
        question: "À quelle fréquence faut-il nettoyer l'intérieur ?",
        answer: "Tous les deux à trois mois est un rythme judicieux pour une utilisation normale. Avec des enfants, animaux ou beaucoup d'équipements outdoor, plutôt mensuellement.",
      },
    ],
    internalLinks: [
      { label: 'Tous les forfaits & prix', href: '/fr/forfaits/' },
      { label: 'Nettoyage extérieur', href: '/fr/prestations/nettoyage-exterieur/' },
      { label: 'Nettoyage intérieur', href: '/fr/prestations/nettoyage-interieur/' },
      { label: 'Préparation complète', href: '/fr/prestations/preparation-vehicule/' },
      { label: 'Zone de service Suisse', href: '/fr/zones-desservies/' },
    ],
    ctaHeading: "Demander un entretien",
    ctaText: "RCC vient avec le matériel directement à votre véhicule en Suisse.",
    ctaLabel: 'Demander un devis',
    ctaHref: '/fr/#quote',
  },
};

export default function WieOftAutoReinigenPage() {
  const { lang } = useTranslation();
  return <GuidePageTemplate config={CONFIGS[lang]} />;
}
