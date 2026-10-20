/**
 * Guide: Autoaufbereitung Kosten Schweiz (DE only)
 * DE: /de/ratgeber/autoaufbereitung-kosten-schweiz/
 */

import { GuidePageTemplate, type GuidePageConfig } from './GuidePageTemplate';

const CONFIG: GuidePageConfig = {
  breadcrumbs: [
    { label: 'RCC Royal Car Cleaning', href: '/de/' },
    { label: 'Ratgeber', href: '/de/ratgeber/' },
    { label: 'Autoaufbereitung Kosten Schweiz' },
  ],
  eyebrow: 'RCC Ratgeber · Kosten & Preise',
  h1: 'Autoaufbereitung Schweiz: Was beeinflusst den Preis?',
  lead: 'Der Preis einer professionellen Autoaufbereitung hängt von mehreren messbaren Faktoren ab ,  nicht von einer pauschalen Zahl. Wer die Einflussgrössen kennt, kann besser einschätzen, welches Paket für sein Fahrzeug passt.',
  articleKey: 'autoaufbereitung-kosten-schweiz',
  language: 'de',
  sections: [
    {
      heading: 'Was meint „Autoaufbereitung" konkret?',
      paragraphs: [
        'Der Begriff Autoaufbereitung wird unterschiedlich verwendet. Im weiteren Sinn umfasst er alles von einer einfachen Innenreinigung bis zu Lackpolitur und Versiegelung. Im engeren Sinn und im Kontext der RCC-Dienstleistungen meint Fahrzeugaufbereitung die Kombination aus Innen- und Aussenreinigung in einem Durchgang ,  was auch als Komplettreinigung bezeichnet wird.',
        'RCC bietet Autopflege ohne Lackbearbeitung oder Keramikreinigung an. Die angebotenen Leistungen umfassen professionelle Innenreinigung, Aussenreinigung (Handwäsche) und die Kombination beider ,  je nach gewähltem Paket.',
      ],
    },
    {
      heading: "Faktor 1: Fahrzeugkategorie",
      level: 'h2',
      paragraphs: [
        "Die Fahrzeugkategorie ist der wichtigste Preisfaktor bei RCC. Es gibt drei Kategorien: Kleinwagen (Kompaktwagen & Coupés), Mittelklasse (Limousinen & SUVs) sowie Extra grosse Autos (7-Sitzer, Vans, Lieferwagen).",
        'Grössere Fahrzeuge haben mehr zu reinigende Fläche ,  mehr Sitzflächen, grössere Teppichflächen, mehr Karosserie. Das schlägt sich direkt im Preis nieder.',
      ],
    },
    {
      heading: 'Faktor 2: Umfang der Reinigung',
      level: 'h2',
      paragraphs: [
        "Ob Innenreinigung, Aussenreinigung oder Komplettreinigung bestimmt den Preis erheblich. Die Aussenreinigung Standard beginnt bei CHF 95, die Innenreinigung Standard bei CHF 100 für Kleinwagen. Das Premium Aufbereitung Paket (Innen & Aussen) kostet je nach Kategorie CHF 279, 329 oder 400.",
        "Standard-Pakete umfassen die wesentlichen Reinigungsschritte. Premium-Pakete ergänzen intensivere Massnahmen wie Hochdruck-Vorreinigung, Flugrost- und Insektenentfernung, Reifenpflege, Tiefenreinigung von Cockpit und Türen mit Pinseln, schonende Lederreinigung und shampoonierte Fussmatten.",
      ],
    },
    {
      heading: 'Faktor 3: Mobiler Service versus Reinigungsanlage',
      level: 'h2',
      paragraphs: [
        'Ein mobiler Service wie RCC kommt mit dem Equipment direkt zum Fahrzeug ,  zu Hause, am Arbeitsplatz oder an einem anderen Ort. Das ist bequemer als eine Fahrt zur Reinigungsanlage, hat aber auch seinen Preis.',
        'Maschinenwaschstrassen sind günstiger, aber sie behandeln alle Fahrzeuge gleich und erreichen viele Stellen nicht. Die manuelle Handwäsche und Innenreinigung durch RCC ist aufwändiger und gründlicher.',
      ],
    },
    {
      heading: 'Faktor 4: Verschmutzungsgrad',
      level: 'h2',
      paragraphs: [
        'Ein stark verschmutztes Fahrzeug ,  mit eingetrockneten Flecken, vielen Tierhaaren oder hartnäckigem Belag auf Polstern ,  erfordert mehr Aufwand als ein regelmässig gepflegtes. Bei der Offertanfrage können Sie den Zustand Ihres Fahrzeugs angeben.',
      ],
    },
    {
      heading: 'RCC Preisbeispiele',
      level: 'h2',
      paragraphs: [
        "Zur Orientierung für Kleinwagen, Mittelklasse und Extra grosse Autos: Aussenreinigung Standard CHF 95, 129 oder 169, Premium CHF 109, 149 oder 159. Innenreinigung Standard CHF 100, 120 oder 140, Premium CHF 199, 239 oder 289. Standard Paket (Innen & Aussen) CHF 150, 219 oder 279, Premium Aufbereitung Paket CHF 279, 329 oder 400. Extras werden separat berechnet.",
        'Anfragen über das Kontaktformular oder direkt per Telefon und WhatsApp. Wir erstellen Ihnen eine unverbindliche Offerte.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Was kostet eine Autoaufbereitung bei RCC?',
      answer: "Die Preise richten sich nach Fahrzeugkategorie und Paket. Die Aussenreinigung Standard beginnt ab CHF 95, die Innenreinigung Standard ab CHF 100 und das Standard Paket (Innen & Aussen) ab CHF 150. Vollständige Preisübersicht auf der Paketseite.",
    },
    {
      question: 'Welche Leistungen sind nicht im Angebot?',
      answer: 'RCC bietet keine Lackpolitur, Keramikversiegelung oder Steinschlagreparatur an. Das Angebot umfasst professionelle Reinigung des Innenraums und der Aussenoberflächen.',
    },
    {
      question: 'Wie kann ich eine unverbindliche Offerte anfragen?',
      answer: 'Nutzen Sie das Offertformular auf der Website oder kontaktieren Sie uns direkt per Telefon oder WhatsApp. Wir melden uns umgehend.',
    },
  ],
  internalLinks: [
    { label: 'Alle Pakete & Preise', href: '/de/pakete/' },
    { label: 'Komplettreinigung Innen & Aussen', href: '/de/leistungen/fahrzeugaufbereitung/' },
    { label: 'Innenreinigung', href: '/de/leistungen/innenreinigung/' },
    { label: 'Aussenreinigung', href: '/de/leistungen/aussenreinigung/' },
    { label: 'Kontakt', href: '/de/kontakt/' },
  ],
  ctaHeading: 'Unverbindliche Offerte anfragen',
  ctaText: 'Wir erstellen Ihnen eine individuelle Offerte für Ihr Fahrzeug.',
  ctaLabel: 'Jetzt Offerte anfragen',
  ctaHref: '/de/#quote',
};

export default function AutoaufbereitungKostenPage() {
  return <GuidePageTemplate config={CONFIG} />;
}
