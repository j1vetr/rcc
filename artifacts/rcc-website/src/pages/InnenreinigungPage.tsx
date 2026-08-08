/**
 * Interior cleaning service detail — serves DE, EN, FR.
 * DE: /de/leistungen/innenreinigung/
 * EN: /en/services/interior-cleaning/
 * FR: /fr/prestations/nettoyage-interieur/
 */

import ServiceDetailPage, { type ServiceConfig } from './ServiceDetailPage';
import { useTranslation } from '@/i18n/LanguageContext';
import type { Lang } from '@/seo/routes';

const CONFIGS: Record<Lang, Omit<ServiceConfig, 'packagesRouteKey' | 'featuresLang'>> = {
  de: {
    eyebrow: 'RCC Innenreinigung Schweiz',
    h1: 'Innenreinigung\nAuto Schweiz',
    lead: 'Gründliche professionelle Reinigung des Fahrzeuginnenraums direkt bei Ihnen vor Ort. RCC kümmert sich um Fahrgastraum, Sitze, Armaturenbrett, Türverkleidungen und Fussmatten.',
    coverage: [
      'Fahrgastraum und Kofferraum saugen',
      'Seitenscheiben innen reinigen',
      'Armaturenbrett feucht abwischen',
      'Türen feucht abwischen',
      'Lederinnenausstattung feucht abwischen',
      'Fussmatten saugen',
      'Türinnenkanten reinigen',
      'Zwischenräume mit Druckluft reinigen',
    ],
    packageCategories: ['interior'],
    vehicles: ['Klein (Smart, Mini, Fiat 500)', 'Mittel (VW Golf, Passat)', 'Gross (SUV)', 'Extra (Van, 7-Sitzer)'],
    breadcrumbs: [
      { label: 'RCC Royal Car Cleaning', href: '/de/' },
      { label: 'Leistungen', href: '/de/leistungen/' },
      { label: 'Innenreinigung' },
    ],
    faqs: [
      { question: 'Was umfasst die Innenreinigung bei RCC?', answer: 'Die Innenreinigung umfasst das Saugen des Fahrgastraums, Reinigen der Scheiben innen, Abwischen des Armaturenbretts, der Türverkleidungen und der Lederausstattung sowie das Reinigen der Fussmatten.' },
      { question: 'Was ist der Unterschied zwischen Basic und Premium Innenreinigung?', answer: 'Das Premium-Paket beinhaltet zusätzlich intensive Fussmattenreinigung mit Shampoo, detaillierte Reinigung von Cockpit und Türen mit Bürste sowie die Reinigung der Auspuffenden.' },
      { question: 'Wie lange dauert eine Innenreinigung?', answer: 'Die Dauer variiert je nach Fahrzeuggrösse und gewähltem Paket. Bitte fragen Sie bei der Offertanfrage nach der genauen Zeitdauer.' },
    ],
  },
  en: {
    eyebrow: 'RCC Interior Cleaning Switzerland',
    h1: 'Interior Car Cleaning\nin Switzerland',
    lead: 'Thorough professional cleaning of the vehicle interior directly at your location. RCC takes care of the passenger compartment, seats, dashboard, door panels and floor mats.',
    coverage: [
      'Vacuuming passenger compartment and boot',
      'Interior side window cleaning',
      'Damp wipe of dashboard',
      'Damp wipe of doors',
      'Damp wipe of leather interior trim',
      'Vacuuming floor mats',
      'Cleaning inner door edges',
      'Compressed-air cleaning of gaps',
    ],
    packageCategories: ['interior'],
    vehicles: ['Small (Smart, Mini, Fiat 500)', 'Medium (VW Golf, Passat)', 'Large (SUV)', 'XL (Van, 7-seater)'],
    breadcrumbs: [
      { label: 'RCC Royal Car Cleaning', href: '/en/' },
      { label: 'Services', href: '/en/services/' },
      { label: 'Interior Cleaning' },
    ],
    faqs: [
      { question: 'What does interior cleaning include at RCC?', answer: 'Interior cleaning includes vacuuming the passenger compartment, cleaning interior windows, wiping the dashboard, door panels and leather trim, and cleaning floor mats.' },
      { question: 'What does the Premium package add?', answer: 'The Premium package adds intensive shampoo cleaning of floor mats, detailed brush cleaning of the cockpit and doors, and cleaning of exhaust tips.' },
      { question: 'How long does interior cleaning take?', answer: 'Duration varies by vehicle size and chosen package. Please ask when requesting your quote for the exact time estimate.' },
    ],
  },
  fr: {
    eyebrow: "RCC Nettoyage Intérieur Suisse",
    h1: "Nettoyage intérieur\nvoiture Suisse",
    lead: "Nettoyage professionnel complet de l'habitacle directement chez vous. RCC s'occupe de l'habitacle, des sièges, du tableau de bord, des garnitures de portes et des tapis.",
    coverage: [
      "Aspiration de l'habitacle et du coffre",
      'Nettoyage intérieur des vitres latérales',
      'Essuyage humide du tableau de bord',
      'Essuyage humide des portes',
      'Essuyage humide des garnitures en cuir',
      'Aspiration des tapis',
      'Nettoyage des rebords intérieurs des portes',
      "Nettoyage des interstices à l'air comprimé",
    ],
    packageCategories: ['interior'],
    vehicles: ['Petite (Smart, Mini, Fiat 500)', 'Moyenne (VW Golf, Passat)', 'Grande (SUV)', 'XL (Van, 7 places)'],
    breadcrumbs: [
      { label: 'RCC Royal Car Cleaning', href: '/fr/' },
      { label: 'Services', href: '/fr/prestations/' },
      { label: 'Nettoyage intérieur' },
    ],
    faqs: [
      { question: "Que comprend le nettoyage intérieur chez RCC ?", answer: "Le nettoyage intérieur comprend l'aspiration de l'habitacle, le nettoyage des vitres intérieures, l'essuyage du tableau de bord, des portes et des garnitures en cuir, ainsi que le nettoyage des tapis." },
      { question: "Qu'apporte le forfait Premium ?", answer: "Le forfait Premium ajoute le nettoyage intensif des tapis au shampooing, le nettoyage détaillé du cockpit et des portes à la brosse, et le nettoyage des embouts d'échappement." },
      { question: 'Combien de temps dure le nettoyage intérieur ?', answer: 'La durée varie selon la taille du véhicule et le forfait choisi. Veuillez nous demander lors de votre demande de devis pour une estimation précise.' },
    ],
  },
};

const FEATURES_LANG: Record<Lang, 'DE' | 'EN' | 'FR'> = { de: 'DE', en: 'EN', fr: 'FR' };

export default function InnenreinigungPage() {
  const { lang } = useTranslation();
  const config: ServiceConfig = {
    ...CONFIGS[lang],
    packagesRouteKey: 'packages',
    featuresLang: FEATURES_LANG[lang],
  };
  return <ServiceDetailPage config={config} />;
}
