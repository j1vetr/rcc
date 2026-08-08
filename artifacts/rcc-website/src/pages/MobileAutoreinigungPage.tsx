import ServiceDetailPage from './ServiceDetailPage';

const config = {
  slug: 'leistungen/mobile-autoreinigung',
  breadcrumbLabel: 'Mobile Autoreinigung',
  h1: 'Mobile Autoreinigung\nin der Schweiz',
  eyebrow: 'RCC Mobile Autopflege Schweiz',
  lead: 'RCC kommt mit dem vollständigen Reinigungsequipment direkt zu Ihrem Fahrzeug — ob zu Hause, am Arbeitsplatz oder an einem anderen Ort in der Schweiz. Kein Fahrtweg, kein Zeitverlust.',
  coverage: [
    'Reinigung direkt bei Ihnen vor Ort',
    'Keine Anreise zum Reinigungsstandort nötig',
    'Innenreinigung und Aussenreinigung',
    'Komplettreinigung Innen & Aussen',
    'Klein- bis Grossfahrzeuge und Vans',
    'Professionelles Equipment wird mitgebracht',
  ],
  packageCategories: ['inside-outside', 'interior', 'exterior'] as const,
  vehicles: ['Klein (Smart, Mini, Fiat 500)', 'Mittel (VW Golf, Passat)', 'Gross (SUV)', 'Extra (Van, 7-Sitzer)'],
  faqs: [
    {
      question: 'Was ist mobile Autoreinigung?',
      answer: 'Bei der mobilen Autoreinigung kommt das RCC-Team mit dem gesamten professionellen Equipment direkt zu Ihrem Fahrzeug — zu Ihnen nach Hause, an Ihren Arbeitsplatz oder einen anderen Ort. Sie müssen Ihr Fahrzeug nicht irgendwo hinbringen.',
    },
    {
      question: 'In welchen Regionen der Schweiz ist RCC tätig?',
      answer: 'RCC ist in der ganzen Schweiz im Einsatz. Bitte nehmen Sie Kontakt auf oder nutzen Sie das Offertformular, damit wir Ihren Standort bestätigen können.',
    },
    {
      question: 'Welche Fahrzeugtypen werden gereinigt?',
      answer: 'RCC reinigt alle gängigen Fahrzeugtypen: Kleinwagen, Kompakt- und Mittelklassefahrzeuge, SUV sowie grosse Fahrzeuge wie Vans und 7-Sitzer. Die Fahrzeuggrösse bestimmt den Paketpreis.',
    },
    {
      question: 'Wie buche ich eine mobile Autoreinigung?',
      answer: 'Nutzen Sie das Offertformular auf unserer Website oder kontaktieren Sie uns direkt per Telefon oder WhatsApp. Wir melden uns umgehend und vereinbaren einen Termin.',
    },
    {
      question: 'Muss ich bei der Reinigung anwesend sein?',
      answer: 'Das ist nicht zwingend erforderlich. Bitte sprechen Sie die Details bei der Terminabsprache ab, damit wir den Ablauf optimal für Sie planen können.',
    },
  ],
};

export default function MobileAutoreinigungPage() {
  return <ServiceDetailPage config={config} />;
}
