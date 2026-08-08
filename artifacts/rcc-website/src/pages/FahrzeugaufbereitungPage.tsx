import ServiceDetailPage from './ServiceDetailPage';

const config = {
  slug: 'leistungen/fahrzeugaufbereitung',
  breadcrumbLabel: 'Fahrzeugaufbereitung',
  h1: 'Professionelle\nFahrzeugaufbereitung',
  eyebrow: 'Komplettreinigung Schweiz',
  lead: 'Vollständige Fahrzeugaufbereitung von RCC: Innen- und Aussenreinigung in einem kombinierten Paket. Professionelle Rundum-Pflege mobil in der ganzen Schweiz.',
  coverage: [
    'Komplette Innenreinigung',
    'Komplette Aussenreinigung',
    'Handwäsche und Glanzpolitur',
    'Fahrgastraum und Kofferraum saugen',
    'Armaturenbrett und Türverkleidungen',
    'Felgen und Scheiben',
    'Intensive Fussmattenreinigung (Premium)',
    'Detaillierte Cockpitreinigung (Premium)',
  ],
  packageCategories: ['inside-outside'] as const,
  vehicles: ['Klein (Smart, Mini, Fiat 500)', 'Mittel (VW Golf, Passat)', 'Gross (SUV)', 'Extra (Van, 7-Sitzer)'],
  faqs: [
    {
      question: 'Was ist der Unterschied zwischen Fahrzeugaufbereitung und Einzelreinigung?',
      answer: 'Die Fahrzeugaufbereitung (Innen & Aussen) kombiniert vollständige Innen- und Aussenreinigung in einem Paket. Im Gegensatz zur Einzelreinigung profitieren Sie von einer vollständigen Rundumpflege Ihres Fahrzeugs.',
    },
    {
      question: 'Was kostet eine Fahrzeugaufbereitung bei RCC?',
      answer: 'Die Pakete Innen & Aussen Basic kosten CHF 170 bis 320 je nach Fahrzeuggrösse. Das Premium-Paket kostet CHF 200 bis 400. Den genauen Preis für Ihre Fahrzeuggrösse sehen Sie auf der Paketseite.',
    },
    {
      question: 'Was umfasst die komplette Fahrzeugaufbereitung?',
      answer: 'Die Komplettreinigung umfasst Handwäsche, Glanzpolitur, Felgen- und Scheibenreinigung sowie vollständige Innenreinigung mit Saugen, Abwischen aller Oberflächen und Reinigung der Fussmatten. Das Premium-Paket beinhaltet zusätzliche Schritte wie Shampoonieren der Fussmatten und detaillierte Cockpitreinigung.',
    },
    {
      question: 'Für welche Fahrzeuge ist die Komplettaufbereitung geeignet?',
      answer: 'Für alle Fahrzeugtypen von Kleinwagen bis zu Vans und 7-Sitzern. Der Preis variiert je nach Fahrzeuggrösse.',
    },
  ],
};

export default function FahrzeugaufbereitungPage() {
  return <ServiceDetailPage config={config} />;
}
