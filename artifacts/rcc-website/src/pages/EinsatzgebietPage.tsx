/**
 * Service area hub ,  serves DE, EN, FR.
 * DE: /de/einsatzgebiet/
 * EN: /en/service-area/
 * FR: /fr/zones-desservies/
 *
 * Shows the Swiss canton map. RCC provides mobile service throughout Switzerland.
 * Reuses the SwitzerlandMap component (wrapped to avoid SSR lazy issues).
 * Links to the Zurich city page and the quote form.
 */

import { lazy, Suspense } from 'react';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { FloatingAssistant } from '@/components/FloatingAssistant';
import { Breadcrumb } from '@/components/Breadcrumb';
import { TravelCostNotice } from '@/components/TravelCostNotice';
import { useTranslation } from '@/i18n/LanguageContext';
import type { Lang } from '@/seo/routes';

const SwitzerlandMap = lazy(() =>
  import('@/components/SwitzerlandMap').then((m) => ({ default: m.SwitzerlandMap })),
);

// Swiss cantons ,  shown for location selection; contact RCC to confirm service at your canton
const CANTONS = [
  'Aargau', 'Appenzell Ausserrhoden', 'Appenzell Innerrhoden',
  'Basel-Landschaft', 'Basel-Stadt', 'Bern',
  'Fribourg', 'Genève', 'Glarus',
  'Graubünden', 'Jura', 'Luzern',
  'Neuchâtel', 'Nidwalden', 'Obwalden',
  'Schaffhausen', 'Schwyz', 'Solothurn',
  'St. Gallen', 'Thurgau', 'Ticino',
  'Uri', 'Valais', 'Vaud',
  'Zug', 'Zürich',
];

const CITY_LINKS: Record<Lang, Array<{ label: string; href: string }>> = {
  de: [
    { label: 'Zürich', href: '/de/mobile-autoreinigung/zuerich/' },
    { label: 'Winterthur', href: '/de/mobile-autoreinigung/winterthur/' },
    { label: 'Zug', href: '/de/mobile-autoreinigung/zug/' },
    { label: 'Luzern', href: '/de/mobile-autoreinigung/luzern/' },
    { label: 'Basel', href: '/de/mobile-autoreinigung/basel/' },
    { label: 'Bern', href: '/de/mobile-autoreinigung/bern/' },
    { label: 'St. Gallen', href: '/de/mobile-autoreinigung/st-gallen/' },
  ],
  en: [
    { label: 'Zurich', href: '/en/mobile-car-cleaning/zurich/' },
    { label: 'Winterthur', href: '/en/mobile-car-cleaning/winterthur/' },
    { label: 'Zug', href: '/en/mobile-car-cleaning/zug/' },
    { label: 'Lucerne', href: '/en/mobile-car-cleaning/lucerne/' },
    { label: 'Basel', href: '/en/mobile-car-cleaning/basel/' },
    { label: 'Bern', href: '/en/mobile-car-cleaning/bern/' },
    { label: 'Geneva', href: '/en/mobile-car-cleaning/geneva/' },
    { label: 'Lausanne', href: '/en/mobile-car-cleaning/lausanne/' },
  ],
  fr: [
    { label: 'Zurich', href: '/fr/nettoyage-voiture-mobile/zurich/' },
    { label: 'Genève', href: '/fr/nettoyage-voiture-mobile/geneve/' },
    { label: 'Lausanne', href: '/fr/nettoyage-voiture-mobile/lausanne/' },
  ],
};

function MapFallback() {
  return <div className="min-h-[400px] animate-pulse bg-card/20 rounded" aria-hidden="true" />;
}

export default function EinsatzgebietPage() {
  const { t, lang, getLangRoute } = useTranslation();
  const sa = t.serviceArea;
  const cityLinks = CITY_LINKS[lang];

  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-primary/30 selection:text-foreground">
      <Navigation />

      <main className="pt-32 pb-20 container mx-auto px-5 sm:px-6 lg:px-12">
        <Breadcrumb
          items={[
            { label: 'RCC Royal Car Cleaning', href: `/${lang}/` },
            { label: lang === 'de' ? 'Einsatzgebiet' : lang === 'fr' ? 'Zones desservies' : 'Service Area' },
          ]}
        />

        <header className="mb-16 max-w-2xl">
          <span className="mb-4 block text-[10px] uppercase tracking-[0.32em] text-primary">
            {sa.eyebrow}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold uppercase leading-[0.95] tracking-[-0.04em] text-foreground mb-6 whitespace-pre-line">
            {sa.h1}
          </h1>
          <p className="text-sm md:text-base font-light text-foreground/55 leading-relaxed max-w-xl">
            {sa.intro}
          </p>
        </header>

        {/* Map */}
        <section className="mb-16" aria-label={sa.cantonsTitle}>
          <Suspense fallback={<MapFallback />}>
            <SwitzerlandMap
              onSelectCanton={() => {}}
            />
          </Suspense>
        </section>

        {/* Canton grid */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold uppercase tracking-[-0.025em] text-foreground mb-8">
            {sa.cantonsTitle}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px border border-white/10 bg-white/10">
            {CANTONS.map((canton) => (
              <div
                key={canton}
                className="flex items-center gap-2 bg-[#090909] px-4 py-3"
              >
                <MapPin className="h-3 w-3 text-primary/60 shrink-0" strokeWidth={1.5} />
                <span className="text-sm font-light text-foreground/60">{canton}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <TravelCostNotice variant="serviceArea" />
        </section>

        {/* City landing pages */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold uppercase tracking-[-0.025em] text-foreground mb-8">
            {sa.featuredCityTitle}
          </h2>
          <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {cityLinks.map((city) => (
              <a
                key={city.href}
                href={city.href}
                className="group flex items-center justify-between bg-[#090909] px-5 py-5 transition-colors hover:bg-white/[0.025]"
              >
                <span className="text-sm font-semibold uppercase tracking-[0.04em] text-foreground transition-colors group-hover:text-primary">
                  {city.label}
                </span>
                <ArrowUpRight className="h-4 w-4 text-foreground/30 transition-colors group-hover:text-primary" />
              </a>
            ))}
          </div>
        </section>

        <section className="mb-16 grid gap-4 sm:grid-cols-2">
          <a
            href={getLangRoute('packages')}
            className="group border border-white/10 bg-[#090909] px-6 py-6 transition-colors hover:border-primary/40 hover:bg-white/[0.025]"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.06em] text-foreground transition-colors group-hover:text-primary">
              {t.nav.packages}
            </p>
            <p className="mt-2 text-sm font-light leading-relaxed text-foreground/55">
              {lang === 'de'
                ? 'Wählen Sie Ihr Reinigungspaket und sehen Sie die Basispreise nach Fahrzeuggrösse.'
                : lang === 'fr'
                  ? 'Choisissez votre forfait de nettoyage et consultez les prix de base selon la taille du véhicule.'
                  : 'Choose your cleaning package and view base prices by vehicle size.'}
            </p>
          </a>
          <a
            href={getLangRoute('firmenkunden')}
            className="group border border-white/10 bg-[#090909] px-6 py-6 transition-colors hover:border-primary/40 hover:bg-white/[0.025]"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.06em] text-foreground transition-colors group-hover:text-primary">
              {lang === 'de' ? 'Firmenkunden' : lang === 'fr' ? 'Clients professionnels' : 'Business Customers'}
            </p>
            <p className="mt-2 text-sm font-light leading-relaxed text-foreground/55">
              {lang === 'de'
                ? 'Mobile Fahrzeugreinigung für Geschäftsfahrzeuge, Firmenwagen und Fuhrparks.'
                : lang === 'fr'
                  ? 'Nettoyage mobile pour véhicules professionnels, voitures de société et flottes.'
                  : 'Mobile vehicle cleaning for business vehicles, company cars and fleets.'}
            </p>
          </a>
        </section>

        {/* How it works */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold uppercase tracking-[-0.025em] text-foreground mb-8">
            {sa.howTitle}
          </h2>
          <div className="grid sm:grid-cols-3 gap-px border border-white/10 bg-white/10">
            {sa.steps.map((item) => (
              <div key={item.step} className="bg-[#090909] px-6 py-8">
                <span className="mb-4 block font-mono text-[10px] text-primary/60">{item.step}</span>
                <h3 className="text-sm font-semibold uppercase tracking-[0.06em] text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-sm font-light leading-relaxed text-foreground/55">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-white/10 pt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-sm font-light text-foreground/55">
              {sa.ctaText}
            </p>
          </div>
          <a
            href={`${getLangRoute('home')}#quote`}
            className="inline-flex items-center gap-3 bg-primary px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-background hover:bg-[#ebcc7b] transition-colors shrink-0"
          >
            {sa.ctaButton}
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </section>
      </main>

      <Footer />
      <FloatingAssistant />
    </div>
  );
}
