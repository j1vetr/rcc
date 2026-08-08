/**
 * FAQ page — serves DE, EN, FR with visible FAQPage schema.
 * DE: /de/faq/
 * EN: /en/faq/
 * FR: /fr/faq/
 *
 * Content based on real operational facts only.
 * FAQPage JSON-LD is injected via metadata registry (SeoHead / prerender).
 */

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { FloatingAssistant } from '@/components/FloatingAssistant';
import { Breadcrumb } from '@/components/Breadcrumb';
import { TravelCostNotice } from '@/components/TravelCostNotice';
import { useTranslation } from '@/i18n/LanguageContext';
import type { Lang } from '@/seo/routes';
import { FAQ_CONTENT } from '@/data/faq-content';

export default function FaqPage() {
  const { t, lang, getLangRoute } = useTranslation();
  const fp = t.faqPage;
  const faqs = FAQ_CONTENT[lang];

  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-primary/30 selection:text-foreground">
      <Navigation />

      <main className="pt-32 pb-20 container mx-auto px-5 sm:px-6 lg:px-12 max-w-4xl">
        <Breadcrumb
          items={[
            { label: 'RCC Royal Car Cleaning', href: `/${lang}/` },
            { label: 'FAQ' },
          ]}
        />

        <header className="mb-16 max-w-2xl">
          <span className="mb-4 block text-[10px] uppercase tracking-[0.32em] text-primary">
            {fp.eyebrow}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold uppercase leading-[0.95] tracking-[-0.04em] text-foreground mb-6">
            {fp.h1}
          </h1>
          <p className="text-sm md:text-base font-light text-foreground/55 leading-relaxed max-w-xl">
            {fp.intro}
          </p>
        </header>

        {/* FAQ list — rendered as visible HTML for indexing */}
        <section className="mb-16">
          <div className="space-y-1">
            {faqs.map((faq, idx) => (
              <details key={idx} className="group border border-white/10 bg-[#090909]" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-sm font-medium text-foreground list-none" itemProp="name">
                  <span>{faq.question}</span>
                  <span className="ml-4 shrink-0 text-primary text-lg leading-none group-open:rotate-45 transition-transform" aria-hidden="true">
                    +
                  </span>
                </summary>
                <div
                  className="px-6 pb-5 text-sm font-light leading-relaxed text-foreground/60 border-t border-white/5 pt-4"
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                >
                  <span itemProp="text">{faq.answer}</span>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <TravelCostNotice variant="faq" />
        </section>

        {/* CTA to packages */}
        <section className="mb-8">
          <a
            href={getLangRoute('packages')}
            className="inline-flex items-center gap-2 border border-white/20 px-6 py-3 text-xs font-medium uppercase tracking-[0.16em] text-foreground/60 hover:border-primary/50 hover:text-primary transition-colors"
          >
            {t.nav.packages}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </section>

        {/* Contact CTA */}
        <section className="border border-primary/20 bg-primary/[0.04] px-8 py-10 text-center">
          <h2 className="text-2xl font-semibold uppercase tracking-[-0.03em] text-foreground mb-4">
            {fp.ctaTitle}
          </h2>
          <p className="text-sm font-light text-foreground/50 mb-8 max-w-md mx-auto">
            {fp.ctaDesc}
          </p>
          <a
            href={getLangRoute('kontakt')}
            className="inline-flex items-center gap-3 bg-primary px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-background hover:bg-[#ebcc7b] transition-colors"
          >
            {fp.ctaButton}
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </section>
      </main>

      <Footer />
      <FloatingAssistant />
    </div>
  );
}
