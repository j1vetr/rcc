/**
 * /de/leistungen/ — Service hub page
 *
 * Overview of all four service types offered by RCC.
 * Links to each service detail page and to the packages page.
 * Content derived only from verified package data.
 */

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { FloatingAssistant } from '@/components/FloatingAssistant';
import { Breadcrumb } from '@/components/Breadcrumb';

const SERVICES = [
  {
    slug: 'mobile-autoreinigung',
    title: 'Mobile Autoreinigung',
    description:
      'Professionelle Fahrzeugreinigung direkt bei Ihnen vor Ort — zu Hause, am Arbeitsplatz oder anderswo in der Schweiz. Kein Fahrtweg, kein Zeitverlust.',
    priceFrom: 85,
    tags: ['Handwäsche', 'Innenreinigung', 'Aussenreinigung'],
  },
  {
    slug: 'innenreinigung',
    title: 'Innenreinigung',
    description:
      'Gründliche Reinigung des Fahrzeuginnenraums: Saugen, Scheiben, Armaturenbrett, Türverkleidungen, Lederausstattung und Fussmatten.',
    priceFrom: 85,
    tags: ['Fahrgastraum', 'Fussmatten', 'Armaturenbrett', 'Türen'],
  },
  {
    slug: 'aussenreinigung',
    title: 'Aussenreinigung',
    description:
      'Sorgfältige Aussenpflege mit detaillierter Handwäsche, Glanzpolitur, Felgenreinigung und Scheibenreinigung von Hand.',
    priceFrom: 85,
    tags: ['Handwäsche', 'Felgen', 'Scheiben', 'Karosserie'],
  },
  {
    slug: 'fahrzeugaufbereitung',
    title: 'Fahrzeugaufbereitung',
    description:
      'Komplette Rundum-Pflege: Innen- und Aussenreinigung in einem Paket. Ideal für eine gründliche Gesamtpflege Ihres Fahrzeugs.',
    priceFrom: 170,
    tags: ['Komplettreinigung', 'Innen + Aussen', 'Basic & Premium'],
  },
];

export default function LeistungenPage() {
  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-primary/30 selection:text-foreground">
      <Navigation />

      <main className="pt-32 pb-20 container mx-auto px-5 sm:px-6 lg:px-12">
        <Breadcrumb
          items={[
            { label: 'RCC Royal Car Cleaning', href: '/de/' },
            { label: 'Leistungen' },
          ]}
        />

        <header className="mb-16 max-w-2xl">
          <span className="mb-4 block text-[10px] uppercase tracking-[0.32em] text-primary">
            Mobile Autopflege Schweiz
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold uppercase leading-[0.95] tracking-[-0.04em] text-foreground mb-6">
            Mobile Autoreinigung<br />in der Schweiz
          </h1>
          <p className="text-sm md:text-base font-light text-foreground/55 leading-relaxed max-w-xl">
            RCC bietet professionelle mobile Fahrzeugreinigung in der ganzen Schweiz.
            Wählen Sie den Bereich, der für Ihr Fahrzeug jetzt zählt — wir kommen direkt zu Ihnen.
          </p>
        </header>

        {/* Service cards */}
        <section aria-label="Leistungsübersicht" className="mb-20">
          <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-2">
            {SERVICES.map((service) => (
              <a
                key={service.slug}
                href={`/de/leistungen/${service.slug}/`}
                className="group relative flex flex-col bg-[#090909] p-8 hover:bg-white/[0.025] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              >
                <span className="absolute bottom-0 left-0 h-px w-0 bg-primary/60 transition-all duration-500 group-hover:w-full" />

                <div className="mb-6 flex items-start justify-between gap-4">
                  <h2 className="text-xl font-semibold uppercase tracking-[-0.025em] text-foreground sm:text-2xl group-hover:text-primary transition-colors">
                    {service.title}
                  </h2>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-primary/50 group-hover:text-primary transition-colors mt-1" />
                </div>

                <p className="mb-6 text-sm font-light leading-relaxed text-foreground/55 flex-1">
                  {service.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-[9px] uppercase tracking-[0.14em] border border-white/10 text-foreground/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-foreground/40">
                  <span>Ab</span>
                  <span className="text-sm font-medium text-primary">{service.priceFrom} CHF</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* CTA to packages */}
        <section className="mb-20 border border-primary/20 bg-primary/[0.04] px-8 py-10 text-center">
          <h2 className="text-2xl font-semibold uppercase tracking-[-0.03em] text-foreground mb-4">
            Alle Pakete mit genauen Preisen
          </h2>
          <p className="text-sm font-light text-foreground/50 mb-8 max-w-md mx-auto">
            Wählen Sie Ihre Fahrzeuggrösse und sehen Sie den exakten Paketpreis für Ihren Bedarf.
          </p>
          <a
            href="/de/pakete/"
            className="inline-flex items-center gap-3 bg-primary px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-background hover:bg-[#ebcc7b] transition-colors"
          >
            Pakete & Preise ansehen
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </section>

        {/* Service area link */}
        <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/10 pt-8">
          <div>
            <p className="text-sm font-light text-foreground/55">
              Wir sind in der ganzen Schweiz im Einsatz.
            </p>
          </div>
          <a
            href="/de/einsatzgebiet/"
            className="text-sm font-medium text-primary uppercase tracking-[0.14em] hover:text-[#ebcc7b] transition-colors inline-flex items-center gap-2"
          >
            Einsatzgebiet ansehen
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </section>
      </main>

      <Footer />
      <FloatingAssistant />
    </div>
  );
}
