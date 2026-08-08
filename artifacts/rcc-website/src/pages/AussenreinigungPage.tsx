/**
 * Exterior cleaning service detail — serves DE, EN, FR.
 * DE: /de/leistungen/aussenreinigung/
 * EN: /en/services/exterior-cleaning/
 * FR: /fr/prestations/nettoyage-exterieur/
 */

import ServiceDetailPage, { type ServiceConfig } from './ServiceDetailPage';
import { useTranslation } from '@/i18n/LanguageContext';
import type { Lang } from '@/seo/routes';

const CONFIGS: Record<Lang, Omit<ServiceConfig, 'packagesRouteKey' | 'featuresLang'>> = {
  de: {
    eyebrow: 'RCC Aussenreinigung Schweiz',
    h1: 'Aussenreinigung\nAuto Schweiz',
    lead: 'Sorgfältige professionelle Aussenreinigung Ihres Fahrzeugs direkt bei Ihnen vor Ort. Handwäsche, Glanzpolitur, Felgenreinigung und Scheibenreinigung — von Meisterhand.',
    coverage: [
      'Detaillierte Handwäsche',
      'Glanzpolitur von Hand',
      'Seitenscheiben aussen reinigen',
      'Felgen reinigen',
      'Tankdeckel reinigen',
      'Trocknen',
    ],
    packageCategories: ['exterior'],
    vehicles: ['Klein (Smart, Mini, Fiat 500)', 'Mittel (VW Golf, Passat)', 'Gross (SUV)', 'Extra (Van, 7-Sitzer)'],
    breadcrumbs: [
      { label: 'RCC Royal Car Cleaning', href: '/de/' },
      { label: 'Leistungen', href: '/de/leistungen/' },
      { label: 'Aussenreinigung' },
    ],
    faqs: [
      { question: 'Was umfasst die Aussenreinigung bei RCC?', answer: 'Detaillierte Handwäsche, Glanzpolitur von Hand, Reinigung der Seitenscheiben aussen, Felgenreinigung, Reinigung des Tankdeckels und sorgfältiges Trocknen.' },
      { question: 'Was bietet das Premium Aussen-Paket zusätzlich?', answer: 'Das Premium-Paket umfasst zusätzlich Reifenreinigung, Reifenglanzpflege sowie das Entfernen von anhaftenden Insektenresten vom Lack.' },
      { question: 'Wie lange dauert eine Aussenreinigung?', answer: 'Die Dauer variiert je nach Fahrzeuggrösse und gewähltem Paket. Bitte fragen Sie bei der Offertanfrage nach der genauen Zeitdauer.' },
    ],
  },
  en: {
    eyebrow: 'RCC Exterior Cleaning Switzerland',
    h1: 'Exterior Car Cleaning\nin Switzerland',
    lead: 'Careful professional exterior cleaning of your vehicle directly at your location. Hand wash, gloss polish, wheel cleaning and window cleaning — by skilled hands.',
    coverage: [
      'Detailed hand wash',
      'Hand-applied gloss polish',
      'Exterior side window cleaning',
      'Wheel cleaning',
      'Fuel flap cleaning',
      'Drying',
    ],
    packageCategories: ['exterior'],
    vehicles: ['Small (Smart, Mini, Fiat 500)', 'Medium (VW Golf, Passat)', 'Large (SUV)', 'XL (Van, 7-seater)'],
    breadcrumbs: [
      { label: 'RCC Royal Car Cleaning', href: '/en/' },
      { label: 'Services', href: '/en/services/' },
      { label: 'Exterior Cleaning' },
    ],
    faqs: [
      { question: 'What does exterior cleaning include at RCC?', answer: 'Detailed hand wash, hand-applied gloss polish, exterior window cleaning, wheel cleaning, fuel flap cleaning and careful drying.' },
      { question: 'What does the Premium exterior package add?', answer: 'The Premium package additionally includes tyre cleaning, tyre shine and removal of bonded insect residue from the paintwork.' },
      { question: 'How long does exterior cleaning take?', answer: 'Duration varies by vehicle size and chosen package. Please ask when requesting your quote for the exact time estimate.' },
    ],
  },
  fr: {
    eyebrow: 'RCC Nettoyage Extérieur Suisse',
    h1: 'Nettoyage extérieur\nvoiture Suisse',
    lead: 'Nettoyage extérieur professionnel soigné de votre véhicule directement chez vous. Lavage à la main, polissage brillant, nettoyage des jantes et des vitres — par des professionnels.',
    coverage: [
      'Lavage à la main détaillé',
      'Polissage brillant à la main',
      'Nettoyage extérieur des vitres latérales',
      'Nettoyage des jantes',
      'Nettoyage de la trappe à carburant',
      'Séchage',
    ],
    packageCategories: ['exterior'],
    vehicles: ['Petite (Smart, Mini, Fiat 500)', 'Moyenne (VW Golf, Passat)', 'Grande (SUV)', 'XL (Van, 7 places)'],
    breadcrumbs: [
      { label: 'RCC Royal Car Cleaning', href: '/fr/' },
      { label: 'Services', href: '/fr/prestations/' },
      { label: 'Nettoyage extérieur' },
    ],
    faqs: [
      { question: 'Que comprend le nettoyage extérieur chez RCC ?', answer: 'Lavage à la main détaillé, polissage brillant à la main, nettoyage extérieur des vitres latérales, nettoyage des jantes, nettoyage de la trappe à carburant et séchage soigné.' },
      { question: "Qu'apporte le forfait Premium Extérieur en plus ?", answer: "Le forfait Premium ajoute le nettoyage des pneus, la finition brillante des pneus et l'élimination des résidus d'insectes sur la peinture." },
      { question: 'Combien de temps dure le nettoyage extérieur ?', answer: 'La durée varie selon la taille du véhicule et le forfait choisi. Veuillez nous demander lors de votre demande de devis pour une estimation précise.' },
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
