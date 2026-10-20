/**
 * Interior cleaning service detail ,  serves DE, EN, FR.
 * DE: /de/leistungen/innenreinigung/
 * EN: /en/services/interior-cleaning/
 * FR: /fr/prestations/nettoyage-interieur/
 */

import ServiceDetailPage, { type ServiceConfig } from './ServiceDetailPage';
import { getServiceById, vehicleCategories } from '@workspace/service-catalog';
import { useTranslation } from '@/i18n/LanguageContext';
import type { Lang } from '@/seo/routes';

const CONFIGS: Record<Lang, Omit<ServiceConfig, 'packagesRouteKey' | 'featuresLang'>> = {
  de: {
    eyebrow: 'RCC Innenreinigung Schweiz',
    h1: 'Innenreinigung\nAuto Schweiz',
    lead: 'Gründliche professionelle Reinigung des Fahrzeuginnenraums direkt bei Ihnen vor Ort. RCC kümmert sich um Fahrgastraum, Kofferraum, Armaturenbrett, Türverkleidungen und Scheiben.',
    coverage: getServiceById('interior-basic')!.interiorFeaturesDE,
    packageCategories: ['interior'],
    vehicles: Object.values(vehicleCategories.de),
    breadcrumbs: [
      { label: 'RCC Royal Car Cleaning', href: '/de/' },
      { label: 'Leistungen', href: '/de/leistungen/' },
      { label: 'Innenreinigung' },
    ],
    faqs: [
      { question: 'Was umfasst die Innenreinigung bei RCC?', answer: 'Die Innenreinigung Standard umfasst Ausblasen mit Druckluft, Absaugen von Fahrgastraum und Kofferraum, Reinigung von Armaturenbrett, Türverkleidungen und Türfalzen sowie Seitenfenster innen.' },
      { question: 'Was ist der Unterschied zwischen Standard und Premium Innenreinigung?', answer: 'Die Innenreinigung Premium ergänzt die Reinigung der Lüftungsdüsen, Tiefenreinigung von Cockpit und Türen mit Pinseln, Pflege der Türverkleidungen, schonende Reinigung der Lederausstattung sowie shampoonierte und mit dem Sprühextraktor tiefengereinigte Fussmatten.' },
      { question: 'Wie lange dauert eine Innenreinigung?', answer: 'Die Dauer variiert je nach Fahrzeugkategorie und gewähltem Paket. Bitte fragen Sie bei der Offertanfrage nach der genauen Zeitdauer.' },
    ],
  },
  en: {
    eyebrow: 'RCC Interior Cleaning Switzerland',
    h1: 'Interior Car Cleaning\nin Switzerland',
    lead: 'Thorough professional cleaning of the vehicle interior directly at your location. RCC takes care of the passenger compartment, boot, dashboard, door panels and windows.',
    coverage: getServiceById('interior-basic')!.interiorFeaturesEN,
    packageCategories: ['interior'],
    vehicles: Object.values(vehicleCategories.en),
    breadcrumbs: [
      { label: 'RCC Royal Car Cleaning', href: '/en/' },
      { label: 'Services', href: '/en/services/' },
      { label: 'Interior Cleaning' },
    ],
    faqs: [
      { question: 'What does interior cleaning include at RCC?', answer: 'Interior Cleaning Standard includes compressed-air cleaning, vacuuming the passenger compartment and boot, cleaning the dashboard, door panels and door jambs, and interior side windows.' },
      { question: 'What does the Premium package add?', answer: 'Interior Cleaning Premium adds air vent cleaning, deep brush cleaning of the cockpit and doors, door panel care, gentle cleaning of the leather upholstery, and floor mats shampooed and deep cleaned with a spray extractor.' },
      { question: 'How long does interior cleaning take?', answer: 'Duration varies by vehicle category and chosen package. Please ask when requesting your quote for the exact time estimate.' },
    ],
  },
  fr: {
    eyebrow: "RCC Nettoyage Intérieur Suisse",
    h1: "Nettoyage intérieur\nvoiture Suisse",
    lead: "Nettoyage professionnel complet de l'habitacle directement chez vous. RCC s'occupe de l'habitacle, du coffre, du tableau de bord, des panneaux de porte et des vitres.",
    coverage: getServiceById('interior-basic')!.interiorFeaturesFR,
    packageCategories: ['interior'],
    vehicles: Object.values(vehicleCategories.fr),
    breadcrumbs: [
      { label: 'RCC Royal Car Cleaning', href: '/fr/' },
      { label: 'Services', href: '/fr/prestations/' },
      { label: 'Nettoyage intérieur' },
    ],
    faqs: [
      { question: "Que comprend le nettoyage intérieur chez RCC ?", answer: "Le nettoyage intérieur Standard comprend le soufflage à l'air comprimé, l'aspiration de l'habitacle et du coffre, le nettoyage du tableau de bord, des panneaux et des feuillures de porte, ainsi que des vitres latérales à l'intérieur." },
      { question: "Qu'apporte le forfait Premium ?", answer: "Le nettoyage intérieur Premium ajoute le nettoyage des bouches d'aération, le nettoyage en profondeur du cockpit et des portes au pinceau, l'entretien des panneaux de porte, le nettoyage en douceur du cuir, ainsi que les tapis de sol shampouinés et nettoyés à l'injecteur-extracteur." },
      { question: 'Combien de temps dure le nettoyage intérieur ?', answer: 'La durée varie selon la catégorie du véhicule et le forfait choisi. Veuillez nous demander lors de votre demande de devis pour une estimation précise.' },
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
