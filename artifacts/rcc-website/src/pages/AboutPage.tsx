/**
 * About page — serves DE, EN, FR.
 * DE: /de/ueber-uns/
 * EN: /en/about/
 * FR: /fr/a-propos/
 *
 * Only verified business facts. No invented history, employee counts, awards, etc.
 */

import React from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { FloatingAssistant } from '@/components/FloatingAssistant';
import { Breadcrumb } from '@/components/Breadcrumb';
import { useTranslation } from '@/i18n/LanguageContext';
import logo from '@assets/optimized/rcc-logo.webp';

export default function AboutPage() {
  const { t, lang, getLangRoute } = useTranslation();
  const a = t.about;

  const services = a.servicesList as string[];
  const values = a.values as Array<{ title: string; desc: string }>;

  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-primary/30 selection:text-foreground">
      <Navigation />

      <main className="pt-32 pb-20 container mx-auto px-5 sm:px-6 lg:px-12">
        <Breadcrumb
          items={[
            { label: 'RCC Royal Car Cleaning', href: `/${lang}/` },
            { label: lang === 'de' ? 'Über uns' : lang === 'fr' ? 'À propos' : 'About' },
          ]}
        />

        <header className="mb-16 max-w-2xl">
          <span className="mb-4 block text-[10px] uppercase tracking-[0.32em] text-primary">
            {a.eyebrow}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold uppercase leading-[0.95] tracking-[-0.04em] text-foreground mb-6">
            {a.h1}
          </h1>
          <p className="text-sm md:text-base font-light text-foreground/55 leading-relaxed max-w-xl">
            {a.intro}
          </p>
        </header>

        <div className="grid lg:grid-cols-[1fr_360px] gap-16 mb-20">
          <div className="space-y-16">
            {/* Concept */}
            <section>
              <h2 className="text-xl font-semibold uppercase tracking-[-0.025em] text-foreground mb-6">
                {a.conceptTitle}
              </h2>
              <p className="text-sm font-light leading-relaxed text-foreground/60 max-w-2xl">
                {a.conceptText}
              </p>
            </section>

            {/* Services */}
            <section>
              <h2 className="text-xl font-semibold uppercase tracking-[-0.025em] text-foreground mb-6">
                {a.servicesTitle}
              </h2>
              <ul className="grid sm:grid-cols-2 gap-px border border-white/10 bg-white/10">
                {services.map((item) => (
                  <li key={item} className="flex items-start gap-3 bg-[#090909] px-5 py-4">
                    <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm font-light text-foreground/65">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <a
                  href={getLangRoute('packages')}
                  className="text-primary hover:text-[#ebcc7b] text-sm uppercase tracking-[0.14em] font-medium transition-colors inline-flex items-center gap-2"
                >
                  {t.nav.packages}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </section>

            {/* Values */}
            <section>
              <h2 className="text-xl font-semibold uppercase tracking-[-0.025em] text-foreground mb-6">
                {a.valuesTitle}
              </h2>
              <div className="grid sm:grid-cols-2 gap-px border border-white/10 bg-white/10">
                {values.map((value) => (
                  <div key={value.title} className="bg-[#090909] px-6 py-6">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.06em] text-foreground mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm font-light leading-relaxed text-foreground/55">
                      {value.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Area */}
            <section>
              <h2 className="text-xl font-semibold uppercase tracking-[-0.025em] text-foreground mb-4">
                {a.areaTitle}
              </h2>
              <p className="text-sm font-light text-foreground/55 leading-relaxed">
                {a.areaText}
              </p>
            </section>
          </div>

          {/* Logo sidebar */}
          <aside className="hidden lg:flex flex-col items-center justify-start pt-8">
            <div className="sticky top-28 flex flex-col items-center gap-8">
              <img
                src={logo}
                alt="RCC Royal Car Cleaning"
                width="900"
                height="360"
                className="w-48 opacity-70"
                loading="lazy"
              />
              <div className="border border-primary/20 bg-primary/[0.04] p-6 text-center w-full">
                <p className="text-xs uppercase tracking-[0.18em] text-primary mb-3">{a.ctaTitle}</p>
                <p className="text-xs font-light text-foreground/50 mb-4">{a.ctaDesc}</p>
                <a
                  href={`/${lang}/#quote`}
                  className="inline-flex items-center gap-2 bg-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-background hover:bg-[#ebcc7b] transition-colors w-full justify-center"
                >
                  {a.ctaButton}
                </a>
              </div>
            </div>
          </aside>
        </div>

        {/* Mobile CTA */}
        <section className="lg:hidden border border-primary/20 bg-primary/[0.04] px-8 py-10 text-center">
          <h2 className="text-xl font-semibold uppercase tracking-[-0.03em] text-foreground mb-4">
            {a.ctaTitle}
          </h2>
          <p className="text-sm font-light text-foreground/50 mb-6 max-w-md mx-auto">
            {a.ctaDesc}
          </p>
          <a
            href={`/${lang}/#quote`}
            className="inline-flex items-center gap-3 bg-primary px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-background hover:bg-[#ebcc7b] transition-colors"
          >
            {a.ctaButton}
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </section>
      </main>

      <Footer />
      <FloatingAssistant />
    </div>
  );
}
