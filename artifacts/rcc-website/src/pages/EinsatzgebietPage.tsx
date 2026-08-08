/**
 * /de/einsatzgebiet/ — Service area hub
 *
 * Shows the real coverage area: all 26 Swiss cantons.
 * Reuses the SwitzerlandMap component (wrapped to avoid SSR lazy issues).
 * Links to the Zurich city page and the quote form.
 */

import { lazy, Suspense } from 'react';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { FloatingAssistant } from '@/components/FloatingAssistant';
import { Breadcrumb } from '@/components/Breadcrumb';

const SwitzerlandMap = lazy(() =>
  import('@/components/SwitzerlandMap').then((m) => ({ default: m.SwitzerlandMap })),
);

// Swiss cantons — all 26 cantons served nationwide
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

function MapFallback() {
  return <div className="min-h-[400px] animate-pulse bg-card/20 rounded" aria-hidden="true" />;
}

export default function EinsatzgebietPage() {
  const handleSelectCanton = (_id: string) => {
    // No-op on this standalone map — user navigates via links
  };

  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-primary/30 selection:text-foreground">
      <Navigation />

      <main className="pt-32 pb-20 container mx-auto px-5 sm:px-6 lg:px-12">
        <Breadcrumb
          items={[
            { label: 'RCC Royal Car Cleaning', href: '/de/' },
            { label: 'Einsatzgebiet' },
          ]}
        />

        <header className="mb-16 max-w-2xl">
          <span className="mb-4 block text-[10px] uppercase tracking-[0.32em] text-primary">
            Mobile Autopflege Schweiz
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold uppercase leading-[0.95] tracking-[-0.04em] text-foreground mb-6">
            Unser Einsatzgebiet
          </h1>
          <p className="text-sm md:text-base font-light text-foreground/55 leading-relaxed max-w-xl">
            RCC Mobile Autopflege ist in der ganzen Schweiz im Einsatz.
            Wir kommen mit dem vollständigen Reinigungsequipment direkt zu Ihrem Fahrzeug —
            in allen 26 Kantonen.
          </p>
        </header>

        {/* Interactive map */}
        <section className="mb-16" aria-label="Karte Einsatzgebiet Schweiz">
          <Suspense fallback={<MapFallback />}>
            <SwitzerlandMap onSelectCanton={handleSelectCanton} />
          </Suspense>
        </section>

        {/* Canton list */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold uppercase tracking-[-0.025em] text-foreground mb-8">
            Alle 26 Kantone
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {CANTONS.map((canton) => (
              <div
                key={canton}
                className="flex items-center gap-2 border border-white/10 bg-[#090909] px-3 py-2 text-xs font-light text-foreground/55"
              >
                <MapPin className="h-3 w-3 text-primary/60 shrink-0" />
                {canton}
              </div>
            ))}
          </div>
        </section>

        {/* Zurich featured */}
        <section className="mb-16 border border-primary/20 bg-primary/[0.04] px-8 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-primary">
                Stadt Zürich
              </span>
              <h2 className="text-2xl font-semibold uppercase tracking-[-0.03em] text-foreground mb-3">
                Mobile Autoreinigung Zürich
              </h2>
              <p className="text-sm font-light text-foreground/55 max-w-md">
                Zürich ist eines unserer Haupteinsatzgebiete. Erfahren Sie mehr über
                unsere mobilen Reinigungsleistungen im Raum Zürich.
              </p>
            </div>
            <a
              href="/de/mobile-autoreinigung/zuerich/"
              className="shrink-0 inline-flex items-center gap-3 bg-primary px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-background hover:bg-[#ebcc7b] transition-colors"
            >
              Zürich-Seite
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* How it works */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold uppercase tracking-[-0.025em] text-foreground mb-8">
            So funktioniert der mobile Service
          </h2>
          <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Standort mitteilen',
                desc: 'Geben Sie bei der Anfrage Ihren genauen Standort oder Kanton an.',
              },
              {
                step: '02',
                title: 'Paket wählen',
                desc: 'Wählen Sie Ihr Reinigungspaket und die Fahrzeuggrösse.',
              },
              {
                step: '03',
                title: 'Wir kommen zu Ihnen',
                desc: 'Wir bringen alles mit und reinigen Ihr Fahrzeug vor Ort.',
              },
            ].map((item) => (
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
              Bereit für Ihre mobile Autoreinigung in der Schweiz?
            </p>
          </div>
          <a
            href="/de/#quote"
            className="inline-flex items-center gap-3 bg-primary px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-background hover:bg-[#ebcc7b] transition-colors"
          >
            Offerte anfragen
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </section>
      </main>

      <Footer />
      <FloatingAssistant />
    </div>
  );
}
