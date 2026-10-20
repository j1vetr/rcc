/**
 * Complete car detailing / Fahrzeugaufbereitung ,  serves DE, EN, FR.
 * DE: /de/leistungen/fahrzeugaufbereitung/
 * EN: /en/services/car-detailing/
 * FR: /fr/prestations/preparation-vehicule/
 */

import ServiceDetailPage, { type ServiceConfig } from './ServiceDetailPage';
import { vehicleCategories } from '@workspace/service-catalog';
import { useTranslation } from '@/i18n/LanguageContext';
import type { Lang } from '@/seo/routes';

const CONFIGS: Record<Lang, Omit<ServiceConfig, 'packagesRouteKey' | 'featuresLang'>> = {
  de: {
    eyebrow: 'RCC Fahrzeugaufbereitung Schweiz',
    h1: 'Fahrzeugaufbereitung\nSchweiz',
    lead: 'Komplette Rundum-Pflege Ihres Fahrzeugs in einem Paket: Innen- und Aussenreinigung, gleichzeitig und professionell ,  direkt bei Ihnen vor Ort in der Schweiz.',
    coverage: [
      'Innen: Druckluft, Absaugen von Fahrgastraum und Kofferraum',
      'Innen: Armaturenbrett, Türverkleidungen, Türfalze, Seitenfenster',
      'Aussen: Lackschonende Handwäsche der gesamten Karosserie',
      'Aussen: Felgen, Reifen, Tankdeckel und Seitenfenster',
      'Premium: Lederreinigung, Pinsel-Tiefenreinigung, shampoonierte Fussmatten',
      'Komplettreinigung in einem Paket',
    ],
    packageCategories: ['inside-outside'],
    vehicles: Object.values(vehicleCategories.de),
    breadcrumbs: [
      { label: 'RCC Royal Car Cleaning', href: '/de/' },
      { label: 'Leistungen', href: '/de/leistungen/' },
      { label: 'Fahrzeugaufbereitung' },
    ],
    faqs: [
      { question: 'Was ist Fahrzeugaufbereitung?', answer: 'Die Fahrzeugaufbereitung umfasst die vollständige Innen- und Aussenreinigung Ihres Fahrzeugs in einem kombinierten Paket. RCC pflegt Innenraum und Karosserie gleichzeitig.' },
      { question: 'Welche Pakete gibt es für die Komplettaufbereitung?', answer: 'RCC bietet das Standard Paket (CHF 150, 219 oder 279) und das Premium Aufbereitung Paket (CHF 279, 329 oder 400) an. Der genaue Preis richtet sich nach einer von drei Fahrzeugkategorien. Extras werden separat berechnet.' },
      { question: 'Wie lange dauert eine Fahrzeugaufbereitung?', answer: 'Die Dauer variiert je nach gewähltem Paket und Fahrzeugkategorie. Bitte fragen Sie bei der Offertanfrage nach der genauen Zeitdauer.' },
    ],
  },
  en: {
    eyebrow: 'RCC Car Detailing Switzerland',
    h1: 'Complete Car Detailing\nin Switzerland',
    lead: 'Complete all-round care for your vehicle in one package: interior and exterior cleaning, simultaneously and professionally ,  directly at your location.',
    coverage: [
      'Interior: compressed air, vacuuming of passenger compartment and boot',
      'Interior: dashboard, door panels, door jambs, side windows',
      'Exterior: paint-safe hand wash of the entire body',
      'Exterior: wheel rims, tyres, fuel flap and side windows',
      'Premium: leather cleaning, deep brush cleaning, shampooed floor mats',
      'Complete cleaning in one package',
    ],
    packageCategories: ['inside-outside'],
    vehicles: Object.values(vehicleCategories.en),
    breadcrumbs: [
      { label: 'RCC Royal Car Cleaning', href: '/en/' },
      { label: 'Services', href: '/en/services/' },
      { label: 'Car Detailing' },
    ],
    faqs: [
      { question: 'What is car detailing?', answer: 'Car detailing means a complete interior and exterior cleaning of your vehicle in one combined package. RCC cares for the interior and bodywork at the same time.' },
      { question: 'Which packages are available for complete detailing?', answer: 'RCC offers the Standard Package (CHF 150, 219 or 279) and the Premium Detailing Package (CHF 279, 329 or 400). The exact price depends on one of three vehicle categories. Extras are charged separately.' },
      { question: 'How long does a full detailing take?', answer: 'Duration varies by chosen package and vehicle category. Please ask when requesting your quote for the exact time estimate.' },
    ],
  },
  fr: {
    eyebrow: 'RCC Préparation Véhicule Suisse',
    h1: 'Préparation complète\nvéhicule Suisse',
    lead: "Entretien complet de votre véhicule en un seul forfait : nettoyage intérieur et extérieur, simultanément et professionnellement ,  directement chez vous en Suisse.",
    coverage: [
      "Intérieur : air comprimé, aspiration de l'habitacle et du coffre",
      'Intérieur : tableau de bord, panneaux et feuillures de porte, vitres latérales',
      'Extérieur : lavage à la main de toute la carrosserie',
      'Extérieur : jantes, pneus, trappe à carburant et vitres latérales',
      'Premium : nettoyage du cuir, nettoyage au pinceau, tapis shampouinés',
      'Nettoyage complet en un forfait',
    ],
    packageCategories: ['inside-outside'],
    vehicles: Object.values(vehicleCategories.fr),
    breadcrumbs: [
      { label: 'RCC Royal Car Cleaning', href: '/fr/' },
      { label: 'Services', href: '/fr/prestations/' },
      { label: 'Préparation véhicule' },
    ],
    faqs: [
      { question: 'Qu\'est-ce que la préparation du véhicule ?', answer: "La préparation du véhicule comprend le nettoyage complet de l'intérieur et de l'extérieur en un seul forfait combiné. RCC s'occupe de l'habitacle et de la carrosserie en même temps." },
      { question: 'Quels forfaits existent pour la préparation complète ?', answer: 'RCC propose le forfait Standard (CHF 150, 219 ou 279) et le forfait Préparation Premium (CHF 279, 329 ou 400). Le prix exact dépend de l’une des trois catégories de véhicules. Les options sont facturées séparément.' },
      { question: 'Combien de temps dure une préparation complète ?', answer: 'La durée varie selon le forfait choisi et la catégorie du véhicule. Veuillez nous demander lors de votre demande de devis pour une estimation précise.' },
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
