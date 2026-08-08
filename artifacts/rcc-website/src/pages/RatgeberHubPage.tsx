/**
 * Ratgeber / Guides hub page — serves DE, EN, FR.
 * DE: /de/ratgeber/
 * EN: /en/guides/
 * FR: /fr/guides/
 *
 * Lists all published guide articles with localized titles and descriptions.
 * Only shows guides that have a translation for the current language.
 */

import { ArrowUpRight, BookOpen } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { FloatingAssistant } from '@/components/FloatingAssistant';
import { Breadcrumb } from '@/components/Breadcrumb';
import { useTranslation } from '@/i18n/LanguageContext';
import type { Lang } from '@/seo/routes';

interface GuideEntry {
  /** DE slug — always present */
  slugDe: string;
  /** EN slug — present only when EN version is published */
  slugEn?: string;
  /** FR slug — present only when FR version is published */
  slugFr?: string;
  title: Record<Lang, string | null>;
  description: Record<Lang, string | null>;
  /** Visible date for the article */
  dateIso: string;
  dateDisplay: string;
}

const GUIDES: GuideEntry[] = [
  {
    slugDe: 'auto-innenreinigung',
    slugEn: 'car-interior-cleaning',
    slugFr: 'nettoyage-interieur-voiture',
    title: {
      de: 'Auto Innenreinigung: Was wirklich zählt',
      en: 'Car Interior Cleaning: What Really Matters',
      fr: "Nettoyage intérieur voiture : l'essentiel à savoir",
    },
    description: {
      de: 'Schritt für Schritt durch eine gründliche Autoinnenreinigung — von Sitzen und Teppichen bis zu Cockpit und Scheiben. Wann reicht Basic, wann lohnt Premium?',
      en: 'Step by step through a thorough car interior clean — from seats and carpets to dashboard and windows. When is Basic enough, when is Premium worth it?',
      fr: "Étape par étape pour un nettoyage intérieur complet — des sièges aux tapis, du tableau de bord aux vitres. Quand le Basic suffit-il, quand le Premium vaut-il la peine ?",
    },
    dateIso: '2025-01-15',
    dateDisplay: '15. Januar 2025',
  },
  {
    slugDe: 'autopflege-im-winter-schweiz',
    slugEn: 'car-care-winter-switzerland',
    slugFr: 'entretien-voiture-hiver-suisse',
    title: {
      de: 'Autopflege im Winter in der Schweiz',
      en: 'Car Care in Winter in Switzerland',
      fr: "Entretien voiture en hiver en Suisse",
    },
    description: {
      de: 'Streusalz, Nässe und Temperaturen unter null: Was Schweizer Autofahrer im Winter wissen sollten, um Lack, Unterboden und Innenraum zu schützen.',
      en: 'Road salt, moisture and temperatures below zero: what Swiss drivers should know to protect the paintwork, undercarriage and interior in winter.',
      fr: "Sel de déneigement, humidité et températures négatives : ce que les conducteurs suisses doivent savoir pour protéger la carrosserie, le dessous de caisse et l'habitacle en hiver.",
    },
    dateIso: '2025-01-22',
    dateDisplay: '22. Januar 2025',
  },
  {
    slugDe: 'wie-oft-auto-reinigen',
    slugEn: 'how-often-clean-car',
    slugFr: 'frequence-nettoyage-voiture',
    title: {
      de: 'Wie oft soll man das Auto reinigen?',
      en: 'How Often Should You Clean Your Car?',
      fr: "À quelle fréquence faut-il nettoyer sa voiture ?",
    },
    description: {
      de: 'Keine pauschale Antwort, sondern klare Faktoren: Nutzung, Jahreszeit, Fahrzeugtyp und Standort bestimmen den richtigen Rhythmus für Innen- und Aussenreinigung.',
      en: 'No blanket answer — clear factors: usage, season, vehicle type and location determine the right cleaning rhythm for interior and exterior.',
      fr: "Pas de réponse uniforme — des facteurs clairs : utilisation, saison, type de véhicule et lieu déterminent le bon rythme de nettoyage intérieur et extérieur.",
    },
    dateIso: '2025-01-29',
    dateDisplay: '29. Januar 2025',
  },
  {
    slugDe: 'autoaufbereitung-kosten-schweiz',
    title: {
      de: 'Autoaufbereitung Schweiz: Was kostet die Reinigung?',
      en: null,
      fr: null,
    },
    description: {
      de: 'Welche Faktoren beeinflussen den Preis einer professionellen Autoaufbereitung in der Schweiz? Fahrzeuggrösse, Reinigungsumfang und mobiler Service im Vergleich.',
      en: null,
      fr: null,
    },
    dateIso: '2025-02-05',
    dateDisplay: '5. Februar 2025',
  },
  {
    slugDe: 'auto-vor-leasingrueckgabe-reinigen',
    title: {
      de: 'Auto vor der Leasingrückgabe reinigen',
      en: null,
      fr: null,
    },
    description: {
      de: 'Was ist bei der Rückgabe eines Leasingfahrzeugs in Bezug auf Sauberkeit zu beachten? Praktische Hinweise zur Vorbereitung und was RCC dabei leisten kann.',
      en: null,
      fr: null,
    },
    dateIso: '2025-02-12',
    dateDisplay: '12. Februar 2025',
  },
  {
    slugDe: 'innenreinigung-leder-stoff',
    title: {
      de: 'Innenreinigung: Leder oder Stoff richtig reinigen',
      en: null,
      fr: null,
    },
    description: {
      de: 'Ledersitze und Stoffpolster brauchen unterschiedliche Pflege. Was bei der Innenreinigung zu beachten ist und wie professionelle Reinigung den Unterschied macht.',
      en: null,
      fr: null,
    },
    dateIso: '2025-02-19',
    dateDisplay: '19. Februar 2025',
  },
];

const SLUG_PATHS: Record<Lang, (g: GuideEntry) => string | null> = {
  de: (g) => `/de/ratgeber/${g.slugDe}/`,
  en: (g) => g.slugEn ? `/en/guides/${g.slugEn}/` : null,
  fr: (g) => g.slugFr ? `/fr/guides/${g.slugFr}/` : null,
};

const HUB_COPY: Record<Lang, { breadcrumb: string; eyebrow: string; h1: string; lead: string; readMore: string }> = {
  de: {
    breadcrumb: 'Ratgeber',
    eyebrow: 'RCC Ratgeber',
    h1: 'Ratgeber:\nAutopflege in der Schweiz',
    lead: 'Praxisnah, ohne Fülltext: Antworten auf häufige Fragen rund um Autopflege, Reinigungsrhythmus, Leder- und Stoffpflege, Winterbetrieb und Leasingrückgabe.',
    readMore: 'Weiterlesen',
  },
  en: {
    breadcrumb: 'Guides',
    eyebrow: 'RCC Guides',
    h1: 'Car Care Guides\nfor Switzerland',
    lead: 'Practical, no filler: answers to common questions about car care, cleaning frequency, leather and fabric seats, winter driving and lease returns.',
    readMore: 'Read guide',
  },
  fr: {
    breadcrumb: 'Guides',
    eyebrow: 'Guides RCC',
    h1: "Guides entretien\nvoiture en Suisse",
    lead: "Pratique, sans remplissage : réponses aux questions fréquentes sur l'entretien automobile, la fréquence de nettoyage, les sièges cuir et tissu, l'hiver et la restitution de leasing.",
    readMore: 'Lire le guide',
  },
};

export default function RatgeberHubPage() {
  const { lang } = useTranslation();
  const copy = HUB_COPY[lang];

  // For the current language, only show guides that have a translated version
  const visibleGuides = GUIDES.filter((g) => {
    if (lang === 'de') return true;
    if (lang === 'en') return !!g.slugEn;
    if (lang === 'fr') return !!g.slugFr;
    return false;
  });

  const homePath = `/${lang}/`;
  const breadcrumbHome =
    lang === 'de' ? 'RCC Royal Car Cleaning' : lang === 'en' ? 'RCC Royal Car Cleaning' : 'RCC Royal Car Cleaning';

  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-primary/30 selection:text-foreground">
      <Navigation />

      <main className="pt-32 pb-20 container mx-auto px-5 sm:px-6 lg:px-12">
        <Breadcrumb
          items={[
            { label: breadcrumbHome, href: homePath },
            { label: copy.breadcrumb },
          ]}
        />

        <header className="mb-16 max-w-2xl">
          <span className="mb-4 block text-[10px] uppercase tracking-[0.32em] text-primary">
            {copy.eyebrow}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold uppercase leading-[0.95] tracking-[-0.04em] text-foreground mb-6 whitespace-pre-line">
            {copy.h1}
          </h1>
          <p className="text-sm md:text-base font-light text-foreground/55 leading-relaxed max-w-xl">
            {copy.lead}
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleGuides.map((guide) => {
            const title = guide.title[lang] ?? guide.title.de!;
            const description = guide.description[lang] ?? guide.description.de!;
            const href = SLUG_PATHS[lang](guide);
            if (!href) return null;

            return (
              <article key={guide.slugDe} className="group relative flex flex-col border border-white/10 bg-[#090909] hover:border-white/20 transition-colors">
                <div className="flex-1 p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
                    <time dateTime={guide.dateIso} className="text-[10px] uppercase tracking-[0.18em] text-foreground/40">
                      {guide.dateDisplay}
                    </time>
                  </div>
                  <h2 className="text-base font-semibold uppercase tracking-[-0.015em] text-foreground mb-3 leading-snug group-hover:text-primary transition-colors">
                    {title}
                  </h2>
                  <p className="text-sm font-light leading-relaxed text-foreground/55 mb-6">
                    {description}
                  </p>
                </div>
                <div className="border-t border-white/8 px-6 py-4 md:px-8">
                  <a
                    href={href}
                    className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-primary hover:text-foreground transition-colors"
                  >
                    {copy.readMore}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
                <span className="absolute bottom-0 left-0 h-px w-0 bg-primary/60 transition-all duration-500 group-hover:w-full" />
              </article>
            );
          })}
        </div>

        {/* CTA */}
        <section className="mt-20 border border-primary/20 bg-primary/[0.04] px-8 py-10 text-center">
          <h2 className="text-2xl font-semibold uppercase tracking-[-0.03em] text-foreground mb-4">
            {lang === 'de'
              ? 'Direkt eine Offerte anfragen'
              : lang === 'fr'
              ? 'Demander un devis directement'
              : 'Request a Quote Directly'}
          </h2>
          <p className="text-sm font-light text-foreground/50 mb-8 max-w-md mx-auto">
            {lang === 'de'
              ? 'RCC Mobile Autopflege kommt direkt zu Ihrem Fahrzeug in der Schweiz.'
              : lang === 'fr'
              ? 'RCC nettoyage mobile vient directement à votre véhicule en Suisse.'
              : 'RCC mobile car cleaning comes directly to your vehicle in Switzerland.'}
          </p>
          <a
            href={`/${lang}/#quote`}
            className="inline-flex items-center gap-3 bg-primary px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-background hover:bg-[#ebcc7b] transition-colors"
          >
            {lang === 'de' ? 'Jetzt Offerte anfragen' : lang === 'fr' ? 'Demander un devis' : 'Request a Quote'}
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </section>
      </main>

      <Footer />
      <FloatingAssistant />
    </div>
  );
}
