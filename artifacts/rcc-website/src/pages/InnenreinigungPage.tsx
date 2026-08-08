import ServiceDetailPage from './ServiceDetailPage';

const config = {
  slug: 'leistungen/innenreinigung',
  breadcrumbLabel: 'Innenreinigung',
  h1: 'Innenreinigung\nfür Ihr Fahrzeug',
  eyebrow: 'Autoinnenreinigung Schweiz',
  lead: 'Professionelle Innenreinigung für Ihren Fahrzeuginnenraum. RCC reinigt Fahrgastraum, Sitze, Armaturenbrett, Türverkleidungen und Fussmatten — mobil direkt bei Ihnen in der Schweiz.',
  coverage: [
    'Fahrgastraum und Kofferraum saugen',
    'Fussmatten saugen',
    'Armaturenbrett feucht abwischen',
    'Türen und Türinnenkanten reinigen',
    'Lederinnenausstattung feucht abwischen',
    'Seitenscheiben innen reinigen',
    'Zwischenräume mit Druckluft reinigen',
    'Fussmatten shampoonieren (Premium)',
  ],
  packageCategories: ['interior'] as const,
  vehicles: ['Klein (Smart, Mini, Fiat 500)', 'Mittel (VW Golf, Passat)', 'Gross (SUV)', 'Extra (Van, 7-Sitzer)'],
  faqs: [
    {
      question: 'Was umfasst die Innenreinigung bei RCC?',
      answer: 'Die Innenreinigung umfasst das Saugen des gesamten Fahrgastraums und Kofferraums, Reinigen der Scheiben innen, Abwischen von Armaturenbrett, Türverkleidungen und Lederausstattung sowie das Reinigen der Fussmatten und Türinnenkanten. Zwischenräume werden mit Druckluft gereinigt.',
    },
    {
      question: 'Was bietet das Premium-Paket bei der Innenreinigung zusätzlich?',
      answer: 'Das Premium-Paket beinhaltet zusätzlich intensive Fussmattenreinigung mit Shampoo sowie eine detaillierte Reinigung von Cockpit und Türen mit Bürste.',
    },
    {
      question: 'Wie lange dauert eine Innenreinigung?',
      answer: 'Die Dauer variiert je nach Fahrzeuggrösse und gewähltem Paket. Die genaue Zeitangabe erhalten Sie bei der Offertanfrage.',
    },
    {
      question: 'Ist die Innenreinigung für alle Fahrzeugtypen geeignet?',
      answer: 'Ja, RCC reinigt alle gängigen Fahrzeugtypen. Die Fahrzeuggrösse bestimmt den Paketpreis — von Kleinwagen bis zu Vans und 7-Sitzern.',
    },
  ],
};

export default function InnenreinigungPage() {
  return <ServiceDetailPage config={config} />;
}
