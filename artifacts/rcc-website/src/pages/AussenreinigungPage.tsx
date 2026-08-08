import ServiceDetailPage from './ServiceDetailPage';

const config = {
  slug: 'leistungen/aussenreinigung',
  breadcrumbLabel: 'Aussenreinigung',
  h1: 'Professionelle\nAussenreinigung',
  eyebrow: 'Autoaussenreinigung Schweiz',
  lead: 'Sorgfältige Aussenpflege für Ihr Fahrzeug: detaillierte Handwäsche, Glanzpolitur, Felgenreinigung und Scheibenreinigung von Hand — mobil direkt bei Ihnen in der Schweiz.',
  coverage: [
    'Detaillierte Handwäsche',
    'Glanzpolitur von Hand',
    'Seitenscheiben aussen reinigen',
    'Felgen reinigen',
    'Tankdeckel reinigen',
    'Sorgfältiges Trocknen',
    'Reifen reinigen (Premium)',
    'Insektenreste vom Lack entfernen (Premium)',
  ],
  packageCategories: ['exterior'] as const,
  vehicles: ['Klein (Smart, Mini, Fiat 500)', 'Mittel (VW Golf, Passat)', 'Gross (SUV)', 'Extra (Van, 7-Sitzer)'],
  faqs: [
    {
      question: 'Was umfasst die Aussenreinigung bei RCC?',
      answer: 'Die Aussenreinigung umfasst eine detaillierte Handwäsche, Glanzpolitur von Hand, Reinigung der Seitenscheiben aussen, Felgenreinigung, Reinigung des Tankdeckels und sorgfältiges Trocknen.',
    },
    {
      question: 'Was bietet das Premium Aussen-Paket zusätzlich?',
      answer: 'Das Premium-Paket umfasst zusätzlich Reifenreinigung, Reifenglanzpflege und das Entfernen von anhaftenden Insektenresten vom Lack.',
    },
    {
      question: 'Wird die Aussenreinigung von Hand durchgeführt?',
      answer: 'Ja, RCC führt alle Aussenreinigungen von Hand durch. Handwäsche und Glanzpolitur gehören zum Standardumfang jedes Aussenreinigungspakets.',
    },
    {
      question: 'Kann die Aussenreinigung mit einer Innenreinigung kombiniert werden?',
      answer: 'Ja, mit den Innen & Aussen Paketen erhalten Sie beide Leistungen in einem kombinierten Programm. Besuchen Sie unsere Paketseite für alle verfügbaren Kombinationen.',
    },
  ],
};

export default function AussenreinigungPage() {
  return <ServiceDetailPage config={config} />;
}
