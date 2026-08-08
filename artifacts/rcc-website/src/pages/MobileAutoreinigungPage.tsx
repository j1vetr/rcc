/**
 * Mobile car cleaning service detail — serves DE, EN, FR via lang-aware config.
 * DE: /de/leistungen/mobile-autoreinigung/
 * EN: /en/services/mobile-car-cleaning/
 * FR: /fr/prestations/nettoyage-voiture-mobile/
 */

import ServiceDetailPage, { type ServiceConfig } from './ServiceDetailPage';
import { useTranslation } from '@/i18n/LanguageContext';
import type { Lang } from '@/seo/routes';

const CONFIGS: Record<Lang, Omit<ServiceConfig, 'packagesRouteKey' | 'featuresLang'>> = {
  de: {
    eyebrow: 'RCC Mobile Autopflege Schweiz',
    h1: 'Mobile Autoreinigung\nin der Schweiz',
    lead: 'RCC kommt mit dem vollständigen Reinigungsequipment direkt zu Ihrem Fahrzeug — ob zu Hause, am Arbeitsplatz oder an einem anderen Ort in der Schweiz. Kein Fahrtweg, kein Zeitverlust.',
    coverage: [
      'Reinigung direkt bei Ihnen vor Ort',
      'Keine Anreise zum Reinigungsstandort nötig',
      'Innenreinigung und Aussenreinigung',
      'Komplettreinigung Innen & Aussen',
      'Klein- bis Grossfahrzeuge und Vans',
      'Professionelles Equipment wird mitgebracht',
    ],
    packageCategories: ['inside-outside', 'interior', 'exterior'],
    vehicles: ['Klein (Smart, Mini, Fiat 500)', 'Mittel (VW Golf, Passat)', 'Gross (SUV)', 'Extra (Van, 7-Sitzer)'],
    breadcrumbs: [
      { label: 'RCC Royal Car Cleaning', href: '/de/' },
      { label: 'Leistungen', href: '/de/leistungen/' },
      { label: 'Mobile Autoreinigung' },
    ],
    faqs: [
      { question: 'Was ist mobile Autoreinigung?', answer: 'Bei der mobilen Autoreinigung kommt das RCC-Team mit dem gesamten professionellen Equipment direkt zu Ihrem Fahrzeug — zu Ihnen nach Hause, an Ihren Arbeitsplatz oder einen anderen Ort. Sie müssen Ihr Fahrzeug nicht irgendwo hinbringen.' },
      { question: 'In welchen Regionen der Schweiz ist RCC tätig?', answer: 'RCC ist in Zürich zuhause und als mobiler Service in der ganzen Schweiz für Sie im Einsatz. Bitte nehmen Sie Kontakt auf oder nutzen Sie das Offertformular für Ihren gewünschten Termin und Standort.' },
      { question: 'Welche Fahrzeugtypen werden gereinigt?', answer: 'RCC reinigt alle gängigen Fahrzeugtypen: Kleinwagen, Kompakt- und Mittelklassefahrzeuge, SUV sowie grosse Fahrzeuge wie Vans und 7-Sitzer. Die Fahrzeuggrösse bestimmt den Paketpreis.' },
      { question: 'Wie buche ich eine mobile Autoreinigung?', answer: 'Nutzen Sie das Offertformular auf unserer Website oder kontaktieren Sie uns direkt per Telefon oder WhatsApp. Wir melden uns umgehend und vereinbaren einen Termin.' },
      { question: 'Muss ich bei der Reinigung anwesend sein?', answer: 'Das ist nicht zwingend erforderlich. Bitte sprechen Sie die Details bei der Terminabsprache ab, damit wir den Ablauf optimal für Sie planen können.' },
    ],
  },
  en: {
    eyebrow: 'RCC Mobile Car Care Switzerland',
    h1: 'Mobile Car Cleaning\nin Switzerland',
    lead: 'RCC brings the full professional cleaning equipment directly to your vehicle — at home, at work, or at your location. No driving, no time lost.',
    coverage: [
      'Cleaning directly at your location',
      'No need to bring the vehicle anywhere',
      'Interior and exterior cleaning',
      'Complete cleaning Interior & Exterior',
      'Small to large vehicles and vans',
      'Professional equipment brought to you',
    ],
    packageCategories: ['inside-outside', 'interior', 'exterior'],
    vehicles: ['Small (Smart, Mini, Fiat 500)', 'Medium (VW Golf, Passat)', 'Large (SUV)', 'XL (Van, 7-seater)'],
    breadcrumbs: [
      { label: 'RCC Royal Car Cleaning', href: '/en/' },
      { label: 'Services', href: '/en/services/' },
      { label: 'Mobile Car Cleaning' },
    ],
    faqs: [
      { question: 'What is mobile car cleaning?', answer: 'Mobile car cleaning means the RCC team brings the full professional equipment directly to your vehicle — at home, at work, or at your location. You do not need to take your vehicle anywhere.' },
      { question: 'Which regions of Switzerland does RCC serve?', answer: 'Based in Zurich, RCC provides mobile car cleaning throughout Switzerland. Please contact us or use the quote form to arrange your preferred appointment and location.' },
      { question: 'Which vehicle types are cleaned?', answer: 'RCC cleans all common vehicle types: small cars, compact and mid-size vehicles, SUVs and larger vehicles such as vans and 7-seaters. Vehicle size determines the package price.' },
      { question: 'How do I book mobile car cleaning?', answer: 'Use the quote form on our website or contact us directly by phone or WhatsApp. We respond promptly and arrange an appointment.' },
      { question: 'Do I need to be present during cleaning?', answer: 'It is not strictly required. Please discuss the details when arranging your appointment so we can plan as conveniently as possible.' },
    ],
  },
  fr: {
    eyebrow: 'RCC Nettoyage Voiture Mobile Suisse',
    h1: 'Nettoyage voiture mobile\nen Suisse',
    lead: "RCC vient avec tout le matériel de nettoyage professionnel directement chez vous — à domicile, au bureau ou ailleurs en Suisse. Sans déplacement de votre part, sans perte de temps.",
    coverage: [
      'Nettoyage directement chez vous',
      "Pas besoin de déplacer le véhicule",
      'Nettoyage intérieur et extérieur',
      'Nettoyage complet Intérieur & Extérieur',
      'Petits à grands véhicules et vans',
      'Matériel professionnel apporté sur place',
    ],
    packageCategories: ['inside-outside', 'interior', 'exterior'],
    vehicles: ['Petite (Smart, Mini, Fiat 500)', 'Moyenne (VW Golf, Passat)', 'Grande (SUV)', 'XL (Van, 7 places)'],
    breadcrumbs: [
      { label: 'RCC Royal Car Cleaning', href: '/fr/' },
      { label: 'Services', href: '/fr/prestations/' },
      { label: 'Nettoyage voiture mobile' },
    ],
    faqs: [
      { question: "Qu'est-ce que le nettoyage voiture mobile ?", answer: "Le nettoyage voiture mobile signifie que l'équipe RCC vient avec tout le matériel professionnel directement chez vous — à domicile, au bureau ou ailleurs en Suisse. Vous n'avez pas besoin de déplacer votre véhicule." },
      { question: 'Quelles régions de la Suisse RCC dessert-il ?', answer: 'Basé à Zurich, RCC propose un nettoyage automobile mobile dans toute la Suisse. Contactez-nous ou utilisez le formulaire de devis pour convenir du lieu et du rendez-vous souhaités.' },
      { question: 'Quels types de véhicules sont nettoyés ?', answer: 'RCC nettoie tous les types courants : petites voitures, compactes et berlines, SUV et grands véhicules comme les vans et 7 places. La taille du véhicule détermine le prix du forfait.' },
      { question: 'Comment réserver un nettoyage voiture mobile ?', answer: 'Utilisez le formulaire de devis sur notre site ou contactez-nous directement par téléphone ou WhatsApp. Nous répondons rapidement et convenons d\'un rendez-vous.' },
      { question: 'Dois-je être présent pendant le nettoyage ?', answer: "Ce n'est pas strictement obligatoire. Veuillez discuter des détails lors de la prise de rendez-vous afin que nous puissions planifier au mieux." },
    ],
  },
};

const FEATURES_LANG: Record<Lang, 'DE' | 'EN' | 'FR'> = { de: 'DE', en: 'EN', fr: 'FR' };

export default function MobileAutoreinigungPage() {
  const { lang } = useTranslation();
  const config: ServiceConfig = {
    ...CONFIGS[lang],
    packagesRouteKey: 'packages',
    featuresLang: FEATURES_LANG[lang],
  };
  return <ServiceDetailPage config={config} />;
}
