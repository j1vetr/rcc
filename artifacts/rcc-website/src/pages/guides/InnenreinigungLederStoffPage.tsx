/**
 * Guide: Innenreinigung Leder und Stoff (DE only)
 * DE: /de/ratgeber/innenreinigung-leder-stoff/
 */

import { GuidePageTemplate, type GuidePageConfig } from './GuidePageTemplate';

const CONFIG: GuidePageConfig = {
  breadcrumbs: [
    { label: 'RCC Royal Car Cleaning', href: '/de/' },
    { label: 'Ratgeber', href: '/de/ratgeber/' },
    { label: 'Leder und Stoff reinigen' },
  ],
  eyebrow: 'RCC Ratgeber · Innenreinigung',
  h1: 'Innenreinigung: Leder oder Stoff richtig reinigen',
  lead: 'Ledersitze und Stoffpolster reagieren unterschiedlich auf Reinigungsmittel und Feuchtigkeit. Wer den Unterschied kennt, kann Schäden vermeiden und die Lebensdauer der Polster verlängern.',
  publishDate: '2025-02-19',
  displayDate: '19. Februar 2025',
  sections: [
    {
      heading: 'Ledersitze: Empfindlich, aber pflegbar',
      paragraphs: [
        'Leder ist ein Naturmaterial, das auf falsche Pflege reagiert. Zu feuchte Reinigung oder aggressive Mittel entziehen dem Leder Feuchtigkeit und können zu Rissen und Farbveränderungen führen. Gleichzeitig ist Leder langlebig, wenn es regelmässig und richtig gepflegt wird.',
        'Für die Reinigung von Ledersitzen verwenden Profis pH-neutrale Lederpfleger, die das Material nicht angreifen. Ein feuchtes Tuch genügt für leichte Verschmutzungen. Eingetrocknete Flecken erfordern mehr Geduld und den richtigen Reiniger — auf keinen Fall Haushaltsmittel wie Spülmittel oder Scheuermittel.',
      ],
    },
    {
      heading: 'Was Leder besonders belastet',
      level: 'h2',
      paragraphs: [
        'Sonneneinstrahlung trocknet Leder aus. Bei Fahrzeugen, die regelmässig in der prallen Sonne stehen, ist häufigere Pflege sinnvoll. Auch Körperschweiiss und Hautpflegeprodukte hinterlassen langfristig Spuren.',
        'Nahtbereiche und Perforierungen sind empfindliche Stellen, an denen sich Schmutz besonders absetzt. Professionelle Reinigung achtet auf diese Details.',
      ],
    },
    {
      heading: 'Stoffsitze und Velours: Absaugen ist der erste Schritt',
      level: 'h2',
      paragraphs: [
        'Stoff und Velours nehmen Schmutzpartikel tiefer auf als Leder. Regelmässiges, gründliches Saugen ist daher besonders wichtig — und der effektivste erste Schritt zur Sauberhaltung. Je länger Schmutz im Gewebe verbleibt, desto schwieriger wird seine Entfernung.',
        'Für Flecken auf Stoff eignen sich Polsterreiniger auf Wasserbasis. Das Material muss dabei nicht durchnässt werden — zu viel Feuchtigkeit kann zu Schimmel führen. Professionelle Reinigung arbeitet mit der richtigen Menge Feuchtigkeit und gründlichem Nachtrocknen.',
      ],
    },
    {
      heading: 'Gerüche: Woher sie kommen und was hilft',
      level: 'h2',
      paragraphs: [
        'Gerüche entstehen durch eingesaugte Feuchtigkeit, organische Rückstände (Lebensmittel, Tiere) und Bakterien im Polstermaterial. Einfaches Saugen beseitigt die Geruchsquelle oft nicht.',
        'Professionelle Innenreinigung entfernt die Grundlage für Gerüche: Schmutz und Feuchtigkeit werden aus dem Material gezogen. Für stark belastete Fahrzeuge — etwa nach längerem Tierrücktransport oder Lebensmittelgerüchen — kann eine intensivere Behandlung nötig sein.',
      ],
    },
    {
      heading: 'RCC Innenreinigung: Was wir tun',
      level: 'h2',
      paragraphs: [
        'RCC reinigt Innenräume mit geeigneten Mitteln für die jeweils vorhandenen Materialien. Basic umfasst Saugen, Scheiben, Cockpit und Türen abwischen sowie Fussmatten säubern. Premium ergänzt Fussmatten shampoonieren und detaillierteres Ausbürsten.',
        'Das Angebot ist ein mobiler Service — RCC kommt direkt zu Ihrem Fahrzeugstandort in der Schweiz.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Kann ich Ledersitze mit Haushaltsmitteln reinigen?',
      answer: 'Empfohlen ist das nicht. Haushaltsmittel wie Spülmittel, Essigreiniger oder Scheuermittel sind zu aggressiv für Leder und können die Oberfläche beschädigen. Verwenden Sie pH-neutrale Lederpfleger oder lassen Sie professionell reinigen.',
    },
    {
      question: 'Wie entferne ich Flecken aus Stoffsitzen?',
      answer: 'Tupfen — nicht reiben. Polsterreiniger auf Wasserbasis eignet sich für die meisten Flecken. Das Material nicht durchnässen. Gründliches Absaugen vorher hilft, lose Partikel zu entfernen, bevor Feuchtigkeit eingesetzt wird.',
    },
    {
      question: 'Reinigt RCC Leder- und Stoffsitze?',
      answer: 'Ja. RCC reinigt Innenräume mit Leder- und Stoffpolstern — je nach Material mit geeigneten Mitteln. Anfrage über das Formular auf der Website oder per Telefon/WhatsApp.',
    },
  ],
  internalLinks: [
    { label: 'Innenreinigung Pakete', href: '/de/pakete/' },
    { label: 'Innenreinigung Leistungsseite', href: '/de/leistungen/innenreinigung/' },
    { label: 'Komplettreinigung Innen & Aussen', href: '/de/leistungen/fahrzeugaufbereitung/' },
    { label: 'Ratgeber: Auto Innenreinigung', href: '/de/ratgeber/auto-innenreinigung/' },
    { label: 'Kontakt', href: '/de/kontakt/' },
  ],
  ctaHeading: 'Professionelle Innenreinigung anfragen',
  ctaText: 'RCC kommt mit dem Equipment direkt zu Ihrem Fahrzeug in der Schweiz.',
  ctaLabel: 'Jetzt Offerte anfragen',
  ctaHref: '/de/#quote',
};

export default function InnenreinigungLederStoffPage() {
  return <GuidePageTemplate config={CONFIG} />;
}
