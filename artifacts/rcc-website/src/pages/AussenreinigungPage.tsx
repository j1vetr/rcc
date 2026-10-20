/**
 * Exterior cleaning service detail ,  serves DE, EN, FR.
 * DE: /de/leistungen/aussenreinigung/
 * EN: /en/services/exterior-cleaning/
 * FR: /fr/prestations/nettoyage-exterieur/
 */

import ServiceDetailPage, { type ServiceConfig } from './ServiceDetailPage';
import { getServiceById, vehicleCategories } from '@workspace/service-catalog';
import { useTranslation } from '@/i18n/LanguageContext';
import type { Lang } from '@/seo/routes';

const CONFIGS: Record<Lang, Omit<ServiceConfig, 'packagesRouteKey' | 'featuresLang'>> = {
  de: {
    eyebrow: 'RCC Aussenreinigung Schweiz',
    h1: 'Aussenreinigung\nAuto Schweiz',
    lead: 'Sorgfältige professionelle Aussenreinigung Ihres Fahrzeugs direkt bei Ihnen vor Ort. Lackschonende Handwäsche, Felgen, Reifen und Seitenfenster ,  von Meisterhand.',
    coverage: getServiceById('exterior-basic')!.exteriorFeaturesDE,
    packageCategories: ['exterior'],
    vehicles: Object.values(vehicleCategories.de),
    breadcrumbs: [
      { label: 'RCC Royal Car Cleaning', href: '/de/' },
      { label: 'Leistungen', href: '/de/leistungen/' },
      { label: 'Aussenreinigung' },
    ],
    faqs: [
      { question: 'Was umfasst die Aussenreinigung bei RCC?', answer: 'Die Aussenreinigung Standard umfasst lackschonende Handwäsche der gesamten Karosserie, gründliche Reinigung von Felgen, Reifen und Tankdeckel, Seitenfenster aussen und sorgfältiges Trocknen.' },
      { question: 'Was bietet das Premium Aussen-Paket zusätzlich?', answer: 'Das Premium-Paket umfasst zusätzlich Reifenreinigung, Reifenglanzpflege sowie das Entfernen von anhaftenden Insektenresten vom Lack.' },
      { question: 'Wie lange dauert eine Aussenreinigung?', answer: 'Die Dauer variiert je nach Fahrzeugkategorie und gewähltem Paket. Bitte fragen Sie bei der Offertanfrage nach der genauen Zeitdauer.' },
    ],
  },
  en: {
    eyebrow: 'RCC Exterior Cleaning Switzerland',
    h1: 'Exterior Car Cleaning\nin Switzerland',
    lead: 'Careful professional exterior cleaning of your vehicle directly at your location. Paint-safe hand wash, wheel rims, tyres and side windows ,  by skilled hands.',
    coverage: getServiceById('exterior-basic')!.exteriorFeaturesEN,
    packageCategories: ['exterior'],
    vehicles: Object.values(vehicleCategories.en),
    breadcrumbs: [
      { label: 'RCC Royal Car Cleaning', href: '/en/' },
      { label: 'Services', href: '/en/services/' },
      { label: 'Exterior Cleaning' },
    ],
    faqs: [
      { question: 'What does exterior cleaning include at RCC?', answer: 'Exterior Cleaning Standard includes a paint-safe hand wash of the entire body, thorough cleaning of wheel rims, tyres and fuel flap, exterior side windows and careful drying.' },
      { question: 'What does the Premium exterior package add?', answer: 'Exterior Cleaning Premium adds a high-pressure pre-wash, removal of stubborn insect residue and flash rust, detailed rim cleaning, exterior cleaning of the windscreen and rear window, and tyre care and blackening.' },
      { question: 'How long does exterior cleaning take?', answer: 'Duration varies by vehicle category and chosen package. Please ask when requesting your quote for the exact time estimate.' },
    ],
  },
  fr: {
    eyebrow: 'RCC Nettoyage Extérieur Suisse',
    h1: 'Nettoyage extérieur\nvoiture Suisse',
    lead: 'Nettoyage extérieur professionnel soigné de votre véhicule directement chez vous. Lavage à la main respectueux de la peinture, jantes, pneus et vitres latérales ,  par des professionnels.',
    coverage: getServiceById('exterior-basic')!.exteriorFeaturesFR,
    packageCategories: ['exterior'],
    vehicles: Object.values(vehicleCategories.fr),
    breadcrumbs: [
      { label: 'RCC Royal Car Cleaning', href: '/fr/' },
      { label: 'Services', href: '/fr/prestations/' },
      { label: 'Nettoyage extérieur' },
    ],
    faqs: [
      { question: 'Que comprend le nettoyage extérieur chez RCC ?', answer: 'Le nettoyage extérieur Standard comprend un lavage à la main de toute la carrosserie respectueux de la peinture, le nettoyage soigné des jantes, des pneus et de la trappe à carburant, les vitres latérales extérieures et un séchage soigné.' },
      { question: "Qu'apporte le forfait Premium Extérieur en plus ?", answer: "Le nettoyage extérieur Premium ajoute un prélavage haute pression, l'élimination des résidus d'insectes tenaces et de la rouille volante, le nettoyage détaillé des jantes, le nettoyage extérieur du pare-brise et de la lunette arrière, ainsi que le soin et le noircissement des pneus." },
      { question: 'Combien de temps dure le nettoyage extérieur ?', answer: 'La durée varie selon la catégorie du véhicule et le forfait choisi. Veuillez nous demander lors de votre demande de devis pour une estimation précise.' },
    ],
  },
};

const FEATURES_LANG: Record<Lang, 'DE' | 'EN' | 'FR'> = { de: 'DE', en: 'EN', fr: 'FR' };

export default function AussenreinigungPage() {
  const { lang } = useTranslation();
  const config: ServiceConfig = {
    ...CONFIGS[lang],
    packagesRouteKey: 'packages',
    featuresLang: FEATURES_LANG[lang],
  };
  return <ServiceDetailPage config={config} />;
}
