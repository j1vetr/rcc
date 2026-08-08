/**
 * Guide: Auto vor der Leasingrückgabe reinigen (DE only)
 * DE: /de/ratgeber/auto-vor-leasingrueckgabe-reinigen/
 *
 * IMPORTANT: No legal guarantees about lease return outcomes.
 * Practical cleaning advice only. Readers must consult their leasing contract.
 */

import { GuidePageTemplate, type GuidePageConfig } from './GuidePageTemplate';

const CONFIG: GuidePageConfig = {
  breadcrumbs: [
    { label: 'RCC Royal Car Cleaning', href: '/de/' },
    { label: 'Ratgeber', href: '/de/ratgeber/' },
    { label: 'Auto vor Leasingrückgabe reinigen' },
  ],
  eyebrow: 'RCC Ratgeber · Leasingrückgabe',
  h1: 'Auto vor der Leasingrückgabe reinigen',
  lead: 'Wer ein Leasingfahrzeug zurückgibt, steht beim Rückgabeprotokoll oft unter Beobachtung. Welchen Zustand das Fahrzeug sein muss und was Reinigung leisten kann — ohne rechtliche Einschätzungen, nur Praxis.',
  publishDate: '2025-02-12',
  displayDate: '12. Februar 2025',
  sections: [
    {
      heading: 'Was steht im Leasingvertrag?',
      paragraphs: [
        'Die konkreten Anforderungen an den Fahrzeugzustand bei Rückgabe sind im jeweiligen Leasingvertrag geregelt. Dort ist festgelegt, was als normaler Verschleiss gilt und was als Schaden eingestuft werden kann. Lesen Sie Ihren Vertrag, bevor Sie irgendwelche Annahmen treffen — die Konditionen unterscheiden sich je nach Leasinggeber.',
        'Dieser Ratgeber macht keine rechtlichen Aussagen darüber, was bei Ihrer Leasingrückgabe akzeptiert oder berechnet wird. Das hängt von Ihrem konkreten Vertrag und dem Leasinggeber ab.',
      ],
    },
    {
      heading: 'Was Reinigung leisten kann',
      level: 'h2',
      paragraphs: [
        'Eine professionelle Fahrzeugreinigung entfernt Verschmutzungen im Innenraum und an der Aussenoberfläche. Sie setzt das Fahrzeug in einen sauberen, gepflegten Zustand — was bei der Rückgabe einen besseren ersten Eindruck hinterlässt.',
        'Konkret: Gereinigter Innenraum ohne Geruch, saubere Sitze und Fussmatten, klare Scheiben, polierter Lack ohne Insektenreste — das ist der Zustand, den eine professionelle Reinigung liefern kann.',
        'Kratzer, Dellen, beschädigte Polster oder defekte Teile lassen sich durch Reinigung nicht beheben. Solche Schäden müssen separat und vertragsgemäss adressiert werden.',
      ],
    },
    {
      heading: 'Innenreinigung vor der Rückgabe',
      level: 'h2',
      paragraphs: [
        'Der Innenraum ist bei der Rückgabe eines Leasingfahrzeugs oft der erste Blick des Prüfers. Ein sauber gesaugter Fahrgastraum, gereinigte Fussmatten, kein Geruch, klare Scheiben von innen und ein gepflegtes Cockpit hinterlassen einen ordentlichen Eindruck.',
        'Vor allem bei Fahrzeugen, die intensiv genutzt wurden — mit Kindern, Haustieren oder regelmässigen Langstrecken — ist eine gründliche Innenreinigung vor der Rückgabe sinnvoll.',
      ],
    },
    {
      heading: 'Aussenreinigung vor der Rückgabe',
      level: 'h2',
      paragraphs: [
        'Ein sauberes Fahrzeug erlaubt es, den Lackzustand besser zu beurteilen. Das gilt für Sie selbst — um festzustellen, ob es Kratzer gibt, die Sie kennen sollten — und für den Prüfer. Eine Handwäsche mit sorgfältigem Trocknen, Felgenreinigung und Entfernung von Insektenresten und Harz gehört zur guten Vorbereitung.',
        'Dabei gilt: Die Reinigung macht Schäden sichtbar, verdeckt sie nicht. Wenn nach der Reinigung Kratzer oder Dellen sichtbar sind, die vorher durch Schmutz verdeckt waren, ist das ein Hinweis darauf, diese Punkte vor der Rückgabe anzusprechen.',
      ],
    },
    {
      heading: 'Zeitplanung: Wann reinigen?',
      level: 'h2',
      paragraphs: [
        'Idealerweise kurz vor dem Rückgabetermin — ein bis zwei Tage vorher. So bleibt der Innenraum sauber und der Lack zeigt sich in gutem Zustand. Eine Reinigung eine Woche vorher kann durch normale Nutzung wieder neutralisiert werden.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Was muss ich bei der Leasingrückgabe reinigungsmässig beachten?',
      answer: 'Das hängt von Ihrem Leasingvertrag ab. Lesen Sie die Rückgabebedingungen sorgfältig. Generell: Sauberkeit von Innenraum und Aussenbereich hinterlässt einen guten Eindruck und erleichtert die Zustandsbeurteilung.',
    },
    {
      question: 'Kann RCC das Fahrzeug vor der Leasingrückgabe reinigen?',
      answer: 'Ja. RCC bietet Innenreinigung, Aussenreinigung und Komplettreinigung als mobilen Service an — direkt bei Ihnen. Offerte anfragen über das Formular auf der Website oder per Telefon/WhatsApp.',
    },
    {
      question: 'Werden durch Reinigung Kratzer oder Schäden beseitigt?',
      answer: 'Nein. Reinigung entfernt Schmutz und Ablagerungen. Kratzer, Dellen oder Beschädigungen am Lack oder Polster lassen sich durch Reinigung nicht reparieren.',
    },
  ],
  internalLinks: [
    { label: 'Komplettreinigung Innen & Aussen', href: '/de/leistungen/fahrzeugaufbereitung/' },
    { label: 'Innenreinigung', href: '/de/leistungen/innenreinigung/' },
    { label: 'Aussenreinigung', href: '/de/leistungen/aussenreinigung/' },
    { label: 'Pakete & Preise', href: '/de/pakete/' },
    { label: 'Kontakt', href: '/de/kontakt/' },
  ],
  ctaHeading: 'Fahrzeug vor Rückgabe reinigen lassen',
  ctaText: 'RCC kommt mobil zu Ihrem Fahrzeug — auch kurzfristig vor Rückgabeterminen.',
  ctaLabel: 'Jetzt Offerte anfragen',
  ctaHref: '/de/#quote',
};

export default function AutoLeasingRueckgabePage() {
  return <GuidePageTemplate config={CONFIG} />;
}
