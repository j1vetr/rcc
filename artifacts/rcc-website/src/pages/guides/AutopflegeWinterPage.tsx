/**
 * Guide: Autopflege im Winter Schweiz — serves DE, EN, FR.
 * DE: /de/ratgeber/autopflege-im-winter-schweiz/
 * EN: /en/guides/car-care-winter-switzerland/
 * FR: /fr/guides/entretien-voiture-hiver-suisse/
 */

import { GuidePageTemplate, type GuidePageConfig } from './GuidePageTemplate';
import { useTranslation } from '@/i18n/LanguageContext';
import type { Lang } from '@/seo/routes';

const CONFIGS: Record<Lang, GuidePageConfig> = {
  de: {
    breadcrumbs: [
      { label: 'RCC Royal Car Cleaning', href: '/de/' },
      { label: 'Ratgeber', href: '/de/ratgeber/' },
      { label: 'Autopflege im Winter' },
    ],
    eyebrow: 'RCC Ratgeber · Winterpflege',
    h1: 'Autopflege im Winter in der Schweiz',
    lead: 'Schweizer Winter bedeuten Streusalz auf den Strassen, Feuchtigkeit unter dem Fahrzeug und häufige Temperaturwechsel. Das Fahrzeug braucht in dieser Jahreszeit andere Pflege als im Sommer.',
    articleKey: 'autopflege-im-winter-schweiz',
    language: 'de',
    sections: [
      {
        heading: 'Warum ist Autopflege im Winter wichtig?',
        paragraphs: [
          'Streusalz ist das grösste Winterproblem für Fahrzeuge. Es setzt sich am Unterboden, in Radkästen und an den Schwellern ab und fördert Korrosion. Das gilt auch für den Lack, wenn Salz über Spritzwasser auf die Karosserie gelangt.',
          'Feuchtigkeit im Innenraum — eingebrachter Schnee und nasse Schuhe — führt zu feuchten Teppichen und kann langfristig zu Schimmel führen. Regelmässige Innenreinigung im Winter hilft, das zu verhindern.',
        ],
      },
      {
        heading: 'Aussenreinigung im Winter: Was zu beachten ist',
        level: 'h2',
        paragraphs: [
          'Nach Fahrten auf gestreuten Strassen sollte das Fahrzeug möglichst zeitnah gereinigt werden, um Salz vom Lack und Unterboden zu entfernen. Bei der Aussenreinigung im Winter legt RCC besonderes Augenmerk auf Radkästen, Schweller und Türunterkanten — Bereiche, in denen sich Salz und Schmutz besonders absetzen.',
          'Die Aussenreinigung umfasst bei RCC Handwäsche der Karosserie, Felgenreinigung und sorgfältiges Trocknen. Das Premium-Paket ergänzt Reifenpflege und Insektenentfernung.',
        ],
      },
      {
        heading: 'Innenreinigung im Winter: Schutz vor Feuchtigkeit',
        level: 'h2',
        paragraphs: [
          'Im Winter bringen nasse Schuhe und feuchte Kleidung mehr Feuchtigkeit in den Innenraum als im Sommer. Gummi-Fussmatten als Wintermatten helfen, Nässe aufzufangen. Regelmässiges Absaugen entfernt Schmutzpartikel, bevor sie sich einarbeiten.',
          'Eine gründlichere Innenreinigung nach dem Winter — wenn Salz und Wintergriess aus Matten und Teppichen entfernt werden — ist sinnvoll, um die Fahrzeugsubstanz zu schützen.',
        ],
      },
      {
        heading: 'Wann ist der richtige Zeitpunkt für eine Winterreinigung?',
        level: 'h2',
        paragraphs: [
          'Zwei Zeitpunkte sind besonders sinnvoll: eine Reinigung zu Beginn des Winters, um das Fahrzeug sauber in die Saison zu nehmen, und eine Reinigung nach dem Ende der Salzstreuperiode im Frühjahr, um Salz vollständig zu entfernen.',
          'Zwischendurch — je nach Intensität der Strassenbehandlung und Fahrleistung — kann eine Aussenreinigung nach starkem Salzeinsatz sinnvoll sein.',
        ],
      },
      {
        heading: 'Mobilität: RCC kommt auch im Winter zu Ihnen',
        level: 'h2',
        paragraphs: [
          'RCC ist ein mobiler Service und kommt mit dem Equipment direkt zu Ihrem Fahrzeugstandort. Das gilt auch im Winter — auch wenn Fahrzeuge in der Tiefgarage oder unter einem Carport stehen.',
          'Für eine Offertanfrage nutzen Sie das Formular auf der Website oder kontaktieren Sie uns direkt per Telefon oder WhatsApp.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Ist eine Autopflege im Winter sinnvoll?',
        answer: 'Ja, gerade im Winter ist regelmässige Pflege wichtig. Streusalz greift Lack und Unterboden an und Feuchtigkeit im Innenraum kann langfristig zu Schimmel führen. Frühzeitige Reinigung schützt die Fahrzeugsubstanz.',
      },
      {
        question: 'Was sollte im Winter besonders gereinigt werden?',
        answer: 'Aussenbereich: Radkästen, Schweller, Türunterkanten und die gesamte Karosserie — um Salz zu entfernen. Innenraum: Fussmatten und Teppich, die im Winter besonders viel Schmutz und Feuchtigkeit aufnehmen.',
      },
      {
        question: 'Kommt RCC auch im Winter für eine mobile Reinigung?',
        answer: 'Ja. RCC ist ganzjährig im Einsatz. Bitte anfragen für einen Termin und genaue Standortbestätigung.',
      },
    ],
    internalLinks: [
      { label: 'Aussenreinigung Pakete', href: '/de/pakete/' },
      { label: 'Aussenreinigung Leistungsseite', href: '/de/leistungen/aussenreinigung/' },
      { label: 'Komplettreinigung Innen & Aussen', href: '/de/leistungen/fahrzeugaufbereitung/' },
      { label: 'Einsatzgebiet Schweiz', href: '/de/einsatzgebiet/' },
    ],
    ctaHeading: 'Winterreinigung anfragen',
    ctaText: 'RCC kommt mit dem Equipment direkt zu Ihrem Fahrzeug — auch im Winter.',
    ctaLabel: 'Jetzt Offerte anfragen',
    ctaHref: '/de/#quote',
  },

  en: {
    breadcrumbs: [
      { label: 'RCC Royal Car Cleaning', href: '/en/' },
      { label: 'Guides', href: '/en/guides/' },
      { label: 'Car Care in Winter' },
    ],
    eyebrow: 'RCC Guides · Winter Care',
    h1: 'Car Care in Winter in Switzerland',
    lead: 'Swiss winters mean road salt on the streets, moisture under the vehicle and frequent temperature swings. Your vehicle needs different care in this season than in summer.',
    articleKey: 'autopflege-im-winter-schweiz',
    language: 'en',
    sections: [
      {
        heading: 'Why Is Car Care Important in Winter?',
        paragraphs: [
          "Road salt is the biggest winter problem for vehicles. It settles on the undercarriage, in wheel arches and on the sills and accelerates corrosion. This also applies to paintwork when salt reaches the bodywork via splashwater.",
          'Moisture inside the vehicle — snow brought in on shoes and wet clothing — leads to damp carpets and can cause mould over time. Regular interior cleaning in winter helps prevent this.',
        ],
      },
      {
        heading: 'Exterior Cleaning in Winter: What to Watch For',
        level: 'h2',
        paragraphs: [
          'After driving on salted roads, cleaning the vehicle as soon as possible helps remove salt from the paintwork and undercarriage. RCC pays particular attention to wheel arches, sills and door bottom edges in winter — areas where salt and dirt accumulate most heavily.',
          'RCC exterior cleaning includes a hand wash of the bodywork, wheel cleaning and careful drying. The Premium package adds tyre care and insect removal.',
        ],
      },
      {
        heading: 'Interior Cleaning in Winter: Protection Against Moisture',
        level: 'h2',
        paragraphs: [
          'In winter, wet shoes and damp clothing bring more moisture into the interior than in summer. Rubber floor mats as winter mats help catch moisture. Regular vacuuming removes dirt particles before they work their way in.',
          'A thorough interior clean after winter — removing salt and grit from mats and carpets — is worthwhile to protect the vehicle.',
        ],
      },
      {
        heading: 'When Is the Right Time for a Winter Clean?',
        level: 'h2',
        paragraphs: [
          'Two moments make particular sense: a clean at the start of winter to take the vehicle into the season in good condition, and a clean after the end of the salting period in spring to remove salt completely.',
          'In between — depending on the intensity of road treatment and mileage — an exterior clean after heavy salting can make sense.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is car care worthwhile in winter?',
        answer: 'Yes, regular care is especially important in winter. Road salt attacks paintwork and the undercarriage, and moisture inside can lead to mould over time. Early cleaning protects the vehicle.',
      },
      {
        question: 'What should be cleaned especially in winter?',
        answer: 'Exterior: wheel arches, sills, door bottom edges and the entire bodywork — to remove salt. Interior: floor mats and carpet, which absorb significantly more dirt and moisture in winter.',
      },
      {
        question: 'Does RCC come for mobile cleaning in winter?',
        answer: 'Yes. RCC operates year-round. Please enquire for an appointment and exact location confirmation.',
      },
    ],
    internalLinks: [
      { label: 'Exterior Cleaning Packages', href: '/en/packages/' },
      { label: 'Exterior Cleaning Service', href: '/en/services/exterior-cleaning/' },
      { label: 'Complete Interior & Exterior', href: '/en/services/car-detailing/' },
      { label: 'Service Area Switzerland', href: '/en/service-area/' },
    ],
    ctaHeading: 'Request Winter Cleaning',
    ctaText: 'RCC brings the equipment directly to your vehicle — including in winter.',
    ctaLabel: 'Request a Quote',
    ctaHref: '/en/#quote',
  },

  fr: {
    breadcrumbs: [
      { label: 'RCC Royal Car Cleaning', href: '/fr/' },
      { label: 'Guides', href: '/fr/guides/' },
      { label: "Entretien voiture hiver" },
    ],
    eyebrow: "Guides RCC · Entretien hivernal",
    h1: "Entretien voiture en hiver en Suisse",
    lead: "Les hivers suisses signifient sel de déneigement sur les routes, humidité sous le véhicule et changements de température fréquents. Votre voiture a besoin d'un entretien différent en cette saison.",
    articleKey: 'autopflege-im-winter-schweiz',
    language: 'fr',
    sections: [
      {
        heading: "Pourquoi l'entretien est-il important en hiver ?",
        paragraphs: [
          "Le sel de déneigement est le principal problème hivernal pour les véhicules. Il se dépose sur le dessous de caisse, dans les passages de roues et sur les bas de caisse, favorisant la corrosion. La carrosserie est aussi touchée lorsque le sel atteint la peinture via les projections.",
          "L'humidité dans l'habitacle — neige ramenée par les chaussures, vêtements mouillés — entraîne des tapis humides et peut provoquer des moisissures à long terme. Un nettoyage intérieur régulier en hiver aide à l'éviter.",
        ],
      },
      {
        heading: "Nettoyage extérieur en hiver : ce qu'il faut surveiller",
        level: 'h2',
        paragraphs: [
          "Après des trajets sur des routes salées, nettoyer le véhicule le plus tôt possible aide à éliminer le sel de la peinture et du dessous de caisse. RCC porte une attention particulière aux passages de roues, bas de caisse et bords inférieurs des portes en hiver.",
          "Le nettoyage extérieur RCC comprend un lavage à la main de la carrosserie, le nettoyage des jantes et un séchage soigné. Le forfait Premium ajoute l'entretien des pneus et l'élimination des insectes.",
        ],
      },
      {
        heading: "Nettoyage intérieur en hiver : protection contre l'humidité",
        level: 'h2',
        paragraphs: [
          "En hiver, les chaussures mouillées et les vêtements humides apportent plus d'humidité dans l'habitacle. Des tapis en caoutchouc aident à retenir l'humidité. Un aspiration régulière retire les particules de saleté avant qu'elles ne s'incrustent.",
          "Un nettoyage intérieur complet après l'hiver — pour éliminer le sel et le gravier des tapis — est utile pour protéger le véhicule.",
        ],
      },
    ],
    faqs: [
      {
        question: "L'entretien de la voiture vaut-il la peine en hiver ?",
        answer: "Oui, un entretien régulier est particulièrement important en hiver. Le sel attaque la peinture et le dessous de caisse, et l'humidité peut provoquer des moisissures. Un nettoyage précoce protège le véhicule.",
      },
      {
        question: "Que faut-il nettoyer particulièrement en hiver ?",
        answer: "Extérieur : passages de roues, bas de caisse, bords inférieurs des portes et toute la carrosserie. Intérieur : tapis et moquette, qui absorbent beaucoup plus de saleté et d'humidité en hiver.",
      },
    ],
    internalLinks: [
      { label: 'Forfaits nettoyage extérieur', href: '/fr/forfaits/' },
      { label: 'Service nettoyage extérieur', href: '/fr/prestations/nettoyage-exterieur/' },
      { label: 'Nettoyage complet intérieur & extérieur', href: '/fr/prestations/preparation-vehicule/' },
      { label: 'Zone de service Suisse', href: '/fr/zones-desservies/' },
    ],
    ctaHeading: "Demander un nettoyage hivernal",
    ctaText: "RCC vient avec le matériel directement à votre véhicule — même en hiver.",
    ctaLabel: 'Demander un devis',
    ctaHref: '/fr/#quote',
  },
};

export default function AutopflegeWinterPage() {
  const { lang } = useTranslation();
  return <GuidePageTemplate config={CONFIGS[lang]} />;
}
