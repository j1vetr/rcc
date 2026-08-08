/**
 * Complete car detailing / Fahrzeugaufbereitung — serves DE, EN, FR.
 * DE: /de/leistungen/fahrzeugaufbereitung/
 * EN: /en/services/car-detailing/
 * FR: /fr/prestations/preparation-vehicule/
 */

import ServiceDetailPage, { type ServiceConfig } from './ServiceDetailPage';
import { useTranslation } from '@/i18n/LanguageContext';
import type { Lang } from '@/seo/routes';

const CONFIGS: Record<Lang, Omit<ServiceConfig, 'packagesRouteKey' | 'featuresLang'>> = {
  de: {
    eyebrow: 'RCC Fahrzeugaufbereitung Schweiz',
    h1: 'Fahrzeugaufbereitung\nSchweiz',
    lead: 'Komplette Rundum-Pflege Ihres Fahrzeugs in einem Paket: Innen- und Aussenreinigung, gleichzeitig und professionell — direkt bei Ihnen vor Ort in der Schweiz.',
    coverage: [
      'Innenreinigung: Saugen, Scheiben, Armaturenbrett',
      'Innenreinigung: Türen, Leder, Fussmatten',
      'Aussenreinigung: Detaillierte Handwäsche',
      'Aussenreinigung: Glanzpolitur von Hand',
      'Aussenreinigung: Felgenreinigung',
      'Komplettreinigung in einem Paket',
    ],
    packageCategories: ['inside-outside'],
    vehicles: ['Klein (Smart, Mini, Fiat 500)', 'Mittel (VW Golf, Passat)', 'Gross (SUV)', 'Extra (Van, 7-Sitzer)'],
    breadcrumbs: [
      { label: 'RCC Royal Car Cleaning', href: '/de/' },
      { label: 'Leistungen', href: '/de/leistungen/' },
      { label: 'Fahrzeugaufbereitung' },
    ],
    faqs: [
      { question: 'Was ist Fahrzeugaufbereitung?', answer: 'Die Fahrzeugaufbereitung umfasst die vollständige Innen- und Aussenreinigung Ihres Fahrzeugs in einem kombinierten Paket. RCC pflegt Innenraum und Karosserie gleichzeitig.' },
      { question: 'Welche Pakete gibt es für die Komplettaufbereitung?', answer: 'RCC bietet Innen & Aussen Basic (CHF 170–320) und Innen & Aussen Premium (CHF 200–400) an. Der genaue Preis richtet sich nach Ihrer Fahrzeuggrösse.' },
      { question: 'Wie lange dauert eine Fahrzeugaufbereitung?', answer: 'Die Dauer variiert je nach gewähltem Paket und Fahrzeuggrösse. Bitte fragen Sie bei der Offertanfrage nach der genauen Zeitdauer.' },
    ],
  },
  en: {
    eyebrow: 'RCC Car Detailing Switzerland',
    h1: 'Complete Car Detailing\nin Switzerland',
    lead: 'Complete all-round care for your vehicle in one package: interior and exterior cleaning, simultaneously and professionally — directly at your location across Switzerland.',
    coverage: [
      'Interior: vacuuming, windows, dashboard',
      'Interior: doors, leather, floor mats',
      'Exterior: detailed hand wash',
      'Exterior: hand-applied gloss polish',
      'Exterior: wheel cleaning',
      'Full cleaning in a single package',
    ],
    packageCategories: ['inside-outside'],
    vehicles: ['Small (Smart, Mini, Fiat 500)', 'Medium (VW Golf, Passat)', 'Large (SUV)', 'XL (Van, 7-seater)'],
    breadcrumbs: [
      { label: 'RCC Royal Car Cleaning', href: '/en/' },
      { label: 'Services', href: '/en/services/' },
      { label: 'Car Detailing' },
    ],
    faqs: [
      { question: 'What is car detailing?', answer: 'Car detailing means a complete interior and exterior cleaning of your vehicle in one combined package. RCC cares for the interior and bodywork at the same time.' },
      { question: 'Which packages are available for complete detailing?', answer: 'RCC offers Interior & Exterior Basic (CHF 170–320) and Interior & Exterior Premium (CHF 200–400). The exact price depends on your vehicle size.' },
      { question: 'How long does a full detailing take?', answer: 'Duration varies by chosen package and vehicle size. Please ask when requesting your quote for the exact time estimate.' },
    ],
  },
  fr: {
    eyebrow: 'RCC Préparation Véhicule Suisse',
    h1: 'Préparation complète\nvéhicule Suisse',
    lead: "Entretien complet de votre véhicule en un seul forfait : nettoyage intérieur et extérieur, simultanément et professionnellement — directement chez vous en Suisse.",
    coverage: [
      "Intérieur : aspiration, vitres, tableau de bord",
      "Intérieur : portes, cuir, tapis",
      'Extérieur : lavage à la main détaillé',
      'Extérieur : polissage brillant à la main',
      'Extérieur : nettoyage des jantes',
      'Nettoyage complet en un seul forfait',
    ],
    packageCategories: ['inside-outside'],
    vehicles: ['Petite (Smart, Mini, Fiat 500)', 'Moyenne (VW Golf, Passat)', 'Grande (SUV)', 'XL (Van, 7 places)'],
    breadcrumbs: [
      { label: 'RCC Royal Car Cleaning', href: '/fr/' },
      { label: 'Services', href: '/fr/prestations/' },
      { label: 'Préparation véhicule' },
    ],
    faqs: [
      { question: 'Qu\'est-ce que la préparation du véhicule ?', answer: "La préparation du véhicule comprend le nettoyage complet de l'intérieur et de l'extérieur en un seul forfait combiné. RCC s'occupe de l'habitacle et de la carrosserie en même temps." },
      { question: 'Quels forfaits existent pour la préparation complète ?', answer: 'RCC propose Intérieur & Extérieur Basic (CHF 170–320) et Intérieur & Extérieur Premium (CHF 200–400). Le prix exact dépend de la taille de votre véhicule.' },
      { question: 'Combien de temps dure une préparation complète ?', answer: 'La durée varie selon le forfait choisi et la taille du véhicule. Veuillez nous demander lors de votre demande de devis pour une estimation précise.' },
    ],
  },
};

const FEATURES_LANG: Record<Lang, 'DE' | 'EN' | 'FR'> = { de: 'DE', en: 'EN', fr: 'FR' };

export default function FahrzeugaufbereitungPage() {
  const { lang } = useTranslation();
  const config: ServiceConfig = {
    ...CONFIGS[lang],
    packagesRouteKey: 'packages',
    featuresLang: FEATURES_LANG[lang],
  };
  return <ServiceDetailPage config={config} />;
}
