/**
 * /de/mobile-autoreinigung/zuerich/ — Zurich city landing page
 *
 * Unique Zurich-specific content — not a doorway page.
 * Targets: mobile Autoreinigung Zürich, Autopflege Zürich, Fahrzeugreinigung Zürich,
 *          Auto waschen Zürich, Autoreinigung vor Ort Zürich.
 * Does NOT compete with /de/ (which targets national intent).
 * Content derived only from verified package data.
 */

import { ArrowUpRight, Check, MapPin } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { FloatingAssistant } from '@/components/FloatingAssistant';
import { Breadcrumb } from '@/components/Breadcrumb';
import { STATIC_SERVICES } from '@/data/services-static';

const ZURICH_FAQS = [
  {
    question: 'Bietet RCC mobile Autoreinigung in Zürich an?',
    answer:
      'Ja, RCC bietet professionelle mobile Autoreinigung im Raum Zürich an. Wir kommen mit dem vollständigen Equipment direkt zu Ihrem Fahrzeug.',
  },
  {
    question: 'Welche Reinigungspakete sind in Zürich verfügbar?',
    answer:
      'In Zürich sind alle RCC-Pakete verfügbar: Innenreinigung, Aussenreinigung und Komplettreinigung (Innen & Aussen) — jeweils in Basic und Premium, für alle Fahrzeugklassen.',
  },
  {
    question: 'Wie lange dauert eine mobile Autoreinigung in Zürich?',
    answer:
      'Die Dauer variiert je nach gewähltem Paket und Fahrzeuggrösse. Bitte fragen Sie bei der Offertanfrage nach der genauen Zeitdauer für Ihr Fahrzeug.',
  },
  {
    question: 'Wie buche ich eine Autoreinigung in Zürich?',
    answer:
      'Nutzen Sie das Offertformular auf unserer Website oder kontaktieren Sie uns direkt per Telefon oder WhatsApp. Wir melden uns umgehend für einen Terminvorschlag.',
  },
  {
    question: 'Welche Stadtteile in Zürich werden bedient?',
    answer:
      'Wir sind im gesamten Stadtgebiet Zürich sowie in der Agglomeration tätig. Bitte geben Sie bei der Anfrage Ihren genauen Standort an.',
  },
];

// Show 2 featured packages (inside-outside)
const FEATURED = STATIC_SERVICES.filter((s) => s.category === 'inside-outside');

export default function ZuerichPage() {
  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-primary/30 selection:text-foreground">
      <Navigation />

      <main className="pt-32 pb-20 container mx-auto px-5 sm:px-6 lg:px-12">
        <Breadcrumb
          items={[
            { label: 'RCC Royal Car Cleaning', href: '/de/' },
            { label: 'Mobile Autoreinigung', href: '/de/leistungen/mobile-autoreinigung/' },
            { label: 'Zürich' },
          ]}
        />

        {/* Hero */}
        <header className="mb-16 max-w-2xl">
          <span className="mb-4 block text-[10px] uppercase tracking-[0.32em] text-primary">
            Autopflege Zürich
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold uppercase leading-[0.95] tracking-[-0.04em] text-foreground mb-6">
            Mobile Autoreinigung<br />in Zürich
          </h1>
          <p className="text-sm md:text-base font-light text-foreground/55 leading-relaxed max-w-xl">
            RCC bietet professionelle mobile Autoreinigung, Fahrzeugpflege und Autopflege
            im Raum Zürich. Wir kommen direkt zu Ihnen — in die Stadt, in die Agglomeration
            oder an Ihren Arbeitsplatz.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <a
              href="/de/#quote"
              className="inline-flex items-center justify-center gap-3 bg-primary px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-background hover:bg-[#ebcc7b] transition-colors"
            >
              Offerte anfragen
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <a
              href="/de/pakete/"
              className="inline-flex items-center justify-center gap-3 border border-white/20 px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-foreground/70 hover:border-primary/50 hover:text-primary transition-colors"
            >
              Alle Pakete ansehen
            </a>
          </div>
        </header>

        {/* What we offer in Zurich */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold uppercase tracking-[-0.025em] text-foreground mb-8">
            Leistungen in Zürich
          </h2>
          <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-3">
            {[
              {
                href: '/de/leistungen/innenreinigung/',
                title: 'Innenreinigung',
                desc: 'Gründliche Reinigung von Fahrgastraum, Sitzen, Armaturenbrett und Türverkleidungen.',
                from: 85,
              },
              {
                href: '/de/leistungen/aussenreinigung/',
                title: 'Aussenreinigung',
                desc: 'Handwäsche, Glanzpolitur, Felgenreinigung und Scheibenreinigung — von Hand.',
                from: 85,
              },
              {
                href: '/de/leistungen/fahrzeugaufbereitung/',
                title: 'Komplettreinigung',
                desc: 'Vollständige Innen- und Aussenreinigung in einem Paket.',
                from: 170,
              },
            ].map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="group relative bg-[#090909] px-6 py-8 hover:bg-white/[0.025] transition-colors block"
              >
                <span className="absolute bottom-0 left-0 h-px w-0 bg-primary/60 transition-all duration-500 group-hover:w-full" />
                <h3 className="text-sm font-semibold uppercase tracking-[0.06em] text-foreground mb-3 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm font-light leading-relaxed text-foreground/55 mb-4">{item.desc}</p>
                <p className="text-[10px] uppercase tracking-[0.14em] text-foreground/40">
                  Ab{' '}
                  <span className="text-primary font-medium text-sm">{item.from} CHF</span>
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* Featured packages */}
        <section className="mb-16" aria-label="Empfohlene Pakete Zürich">
          <h2 className="text-xl font-semibold uppercase tracking-[-0.025em] text-foreground mb-4">
            Pakete für Zürich
          </h2>
          <p className="text-sm font-light text-foreground/50 mb-8">
            Preise variieren je nach Fahrzeuggrösse. Auf der Paketseite sehen Sie alle genauen Preise.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {FEATURED.map((service) => {
              const isPremium = service.level === 'premium';
              const features = [
                ...(service.interiorFeaturesDE as readonly string[]),
                ...(service.exteriorFeaturesDE as readonly string[]),
              ].slice(0, 8);
              const fromPrice = Math.min(...Object.values(service.prices));
              return (
                <div
                  key={service.id}
                  className={`border p-8 ${isPremium ? 'border-primary/50 bg-gradient-to-b from-primary/[0.08] to-[#090909]' : 'border-white/10 bg-[#090909]'}`}
                >
                  {isPremium && (
                    <span className="mb-4 inline-block text-[9px] font-semibold uppercase tracking-[0.18em] text-primary">
                      Unsere Empfehlung
                    </span>
                  )}
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <h3 className="text-lg font-semibold uppercase tracking-[-0.02em] text-foreground sm:text-xl">
                      {service.nameDE}
                    </h3>
                    <div className="shrink-0 text-right">
                      <span className="block text-[9px] uppercase tracking-widest text-foreground/40 mb-1">Ab</span>
                      <span className="text-2xl font-medium text-primary leading-none">{fromPrice}</span>
                      <span className="ml-1 text-xs text-primary/60">CHF</span>
                    </div>
                  </div>
                  <p className="mb-6 text-sm font-light leading-relaxed text-foreground/55">
                    {service.descriptionDE}
                  </p>
                  <ul className="mb-8 space-y-2">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm font-light text-foreground/65">
                        <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/de/#quote"
                    className="inline-flex w-full items-center justify-center gap-2 border border-primary/50 px-6 py-3 text-xs font-medium uppercase tracking-[0.16em] text-primary hover:bg-primary hover:text-background transition-colors"
                  >
                    Offerte anfragen
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              );
            })}
          </div>
        </section>

        {/* How it works in Zurich */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold uppercase tracking-[-0.025em] text-foreground mb-8">
            So läuft der Ablauf in Zürich ab
          </h2>
          <ol className="space-y-4">
            {[
              { n: '01', text: 'Offerte anfragen — mit Fahrzeuggrösse, Standort im Raum Zürich und gewünschtem Paket.' },
              { n: '02', text: 'Terminbestätigung — wir melden uns mit einem Terminvorschlag.' },
              { n: '03', text: 'Wir kommen zu Ihnen — mit dem vollständigen Equipment direkt zu Ihrem Fahrzeug in Zürich.' },
              { n: '04', text: 'Reinigung — professionelle Autopflege vor Ort, gemäss dem gebuchten Paket.' },
            ].map((step) => (
              <li key={step.n} className="flex gap-5 border-l-2 border-primary/20 pl-6">
                <span className="font-mono text-[10px] text-primary/60 shrink-0 mt-0.5">{step.n}</span>
                <p className="text-sm font-light leading-relaxed text-foreground/70">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Nearby regions */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold uppercase tracking-[-0.025em] text-foreground mb-6">
            Auch in angrenzenden Gebieten
          </h2>
          <div className="flex flex-wrap gap-3">
            {['Zürich', 'Kanton Zürich', 'Zug', 'Aargau', 'Thurgau', 'Schaffhausen', 'St. Gallen'].map((region) => (
              <span
                key={region}
                className="flex items-center gap-2 border border-white/10 bg-[#090909] px-4 py-2 text-xs font-light text-foreground/55"
              >
                <MapPin className="h-3 w-3 text-primary/60 shrink-0" />
                {region}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs font-light text-foreground/40">
            Für genaue Angaben zu Ihrem Standort kontaktieren Sie uns bitte direkt.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold uppercase tracking-[-0.025em] text-foreground mb-8">
            Häufige Fragen — Autoreinigung Zürich
          </h2>
          <div className="space-y-1">
            {ZURICH_FAQS.map((faq) => (
              <details key={faq.question} className="group border border-white/10 bg-[#090909]">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-sm font-medium text-foreground list-none">
                  <span>{faq.question}</span>
                  <span className="ml-4 shrink-0 text-primary text-lg leading-none group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-6 pb-5 text-sm font-light leading-relaxed text-foreground/60 border-t border-white/5 pt-4">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="border border-primary/20 bg-primary/[0.04] px-8 py-10 text-center">
          <h2 className="text-2xl font-semibold uppercase tracking-[-0.03em] text-foreground mb-4">
            Jetzt Autopflege in Zürich buchen
          </h2>
          <p className="text-sm font-light text-foreground/50 mb-8 max-w-md mx-auto">
            Unverbindliche Offerte anfordern — wir melden uns umgehend mit einem Terminvorschlag.
          </p>
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
