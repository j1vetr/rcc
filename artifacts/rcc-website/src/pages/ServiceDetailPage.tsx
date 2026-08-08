/**
 * ServiceDetailPage ,  shared template for all service detail pages.
 *
 * Parametric config: passed from each language-specific wrapper.
 * UI strings are fully localized via useTranslation.
 * Links use getLangRoute for correct language paths.
 * Phase 3: trilingual (DE/EN/FR).
 */

import React from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { FloatingAssistant } from '@/components/FloatingAssistant';
import { Breadcrumb, type BreadcrumbItem } from '@/components/Breadcrumb';
import { STATIC_SERVICES } from '@/data/services-static';
import { useTranslation } from '@/i18n/LanguageContext';
import type { RouteKey } from '@/seo/routes';

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceConfig {
  /** Page H1 (may contain newlines) */
  h1: string;
  /** Eyebrow text above H1 */
  eyebrow: string;
  /** Lead paragraph */
  lead: string;
  /** What does this service cover? Short list of included areas */
  coverage: string[];
  /** Which service categories (from API data) to show packages for */
  packageCategories: ReadonlyArray<'inside-outside' | 'interior' | 'exterior'>;
  /** Suitable vehicle types */
  vehicles: string[];
  /** FAQ items */
  faqs: ServiceFaq[];
  /** Breadcrumb items */
  breadcrumbs: BreadcrumbItem[];
  /** Lang-specific packages route key for the CTA link */
  packagesRouteKey: RouteKey;
  /** Lang-specific features accessor key ('DE' | 'EN' | 'FR') for interiorFeatures/exteriorFeatures */
  featuresLang: 'DE' | 'EN' | 'FR';
}

function ServicePackageCard({
  serviceId,
  name,
  description,
  level,
  features,
  fromPrice,
  requestLabel,
  fromLabel,
  packagesPath,
  recommendedLabel,
}: {
  serviceId: string;
  name: string;
  description: string;
  level: 'basic' | 'premium';
  features: string[];
  fromPrice: number;
  requestLabel: string;
  fromLabel: string;
  packagesPath: string;
  recommendedLabel: string;
}) {
  const isPremium = level === 'premium';
  return (
    <div
      className={`relative flex flex-col border p-6 md:p-8 ${
        isPremium
          ? 'border-primary/50 bg-gradient-to-b from-primary/[0.08] via-[#0b0a07] to-[#090909]'
          : 'border-white/10 bg-[#090909]'
      }`}
    >
      {isPremium && (
        <span className="mb-4 inline-block text-[9px] font-semibold uppercase tracking-[0.18em] text-primary">
          {recommendedLabel}
        </span>
      )}
      <div className="mb-2 flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold uppercase tracking-[-0.02em] text-foreground sm:text-xl">
          {name}
        </h3>
        <div className="text-right shrink-0">
          <span className="block text-[9px] uppercase tracking-widest text-foreground/40 mb-1">{fromLabel}</span>
          <span className="text-2xl font-medium text-primary leading-none">{fromPrice}</span>
          <span className="ml-1 text-xs text-primary/60">CHF</span>
        </div>
      </div>
      <p className="mb-6 text-sm font-light leading-relaxed text-foreground/55">
        {description}
      </p>
      <ul className="mb-8 space-y-2 flex-1">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm font-light text-foreground/65">
            <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <a
        href={packagesPath}
        className="inline-flex items-center gap-2 border border-primary/50 px-6 py-3 text-xs font-medium uppercase tracking-[0.16em] text-primary hover:bg-primary hover:text-background transition-colors w-full justify-center"
      >
        {requestLabel}
        <ArrowUpRight className="h-4 w-4" />
      </a>
    </div>
  );
}

export default function ServiceDetailPage({ config }: { config: ServiceConfig }) {
  const { t, getLangRoute } = useTranslation();
  const sd = t.serviceDetail;
  const packagesPath = getLangRoute(config.packagesRouteKey);

  // Filter packages by relevant categories
  const relevantServices = STATIC_SERVICES.filter((s) =>
    (config.packageCategories as string[]).includes(s.category),
  );

  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-primary/30 selection:text-foreground">
      <Navigation />

      <main className="pt-32 pb-20 container mx-auto px-5 sm:px-6 lg:px-12">
        <Breadcrumb items={config.breadcrumbs} />

        {/* Hero */}
        <header className="mb-16 max-w-2xl">
          <span className="mb-4 block text-[10px] uppercase tracking-[0.32em] text-primary">
            {config.eyebrow}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold uppercase leading-[0.95] tracking-[-0.04em] text-foreground mb-6 whitespace-pre-line">
            {config.h1}
          </h1>
          <p className="text-sm md:text-base font-light text-foreground/55 leading-relaxed max-w-xl">
            {config.lead}
          </p>
        </header>

        {/* Coverage */}
        <section className="mb-16" aria-label={sd.coverageTitle}>
          <h2 className="text-xl font-semibold uppercase tracking-[-0.025em] text-foreground mb-8">
            {sd.coverageTitle}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px border border-white/10 bg-white/10">
            {config.coverage.map((item) => (
              <div key={item} className="flex items-center gap-3 bg-[#090909] px-5 py-4">
                <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="text-sm font-light text-foreground/70">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Packages */}
        {relevantServices.length > 0 && (
          <section className="mb-16" aria-label={sd.packagesTitle}>
            <h2 className="text-xl font-semibold uppercase tracking-[-0.025em] text-foreground mb-8">
              {sd.packagesTitle}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relevantServices.map((service) => {
                const lang = config.featuresLang;
                const intKey = `interiorFeatures${lang}` as keyof typeof service;
                const extKey = `exteriorFeatures${lang}` as keyof typeof service;
                const nameKey = `name${lang}` as keyof typeof service;
                const descKey = `description${lang}` as keyof typeof service;
                const features = [
                  ...(service[intKey] as readonly string[]),
                  ...(service[extKey] as readonly string[]),
                ];
                return (
                  <ServicePackageCard
                    key={service.id}
                    serviceId={service.id}
                    name={service[nameKey] as string}
                    description={service[descKey] as string}
                    level={service.level as 'basic' | 'premium'}
                    features={features}
                    fromPrice={service.prices.small}
                    requestLabel={sd.requestPackage}
                    fromLabel={sd.fromLabel}
                    packagesPath={packagesPath}
                    recommendedLabel={sd.recommended}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* FAQ */}
        {config.faqs.length > 0 && (
          <section className="mb-16">
            <h2 className="text-xl font-semibold uppercase tracking-[-0.025em] text-foreground mb-8">
              {sd.faqTitle}
            </h2>
            <div className="space-y-1">
              {config.faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group border border-white/10 bg-[#090909]"
                >
                  <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-sm font-medium text-foreground list-none">
                    <span>{faq.question}</span>
                    <span className="ml-4 shrink-0 text-primary text-lg leading-none group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <div className="px-6 pb-5 text-sm font-light leading-relaxed text-foreground/60 border-t border-white/5 pt-4">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="border border-primary/20 bg-primary/[0.04] px-8 py-10 text-center">
          <h2 className="text-2xl font-semibold uppercase tracking-[-0.03em] text-foreground mb-4">
            {sd.ctaTitle}
          </h2>
          <p className="text-sm font-light text-foreground/50 mb-8 max-w-md mx-auto">
            {sd.ctaDesc}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`${getLangRoute('home')}#quote`}
              className="inline-flex items-center gap-3 bg-primary px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-background hover:bg-[#ebcc7b] transition-colors"
            >
              {sd.ctaTitle}
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <a
              href={packagesPath}
              className="inline-flex items-center gap-3 border border-white/20 px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-foreground/70 hover:border-primary/50 hover:text-primary transition-colors"
            >
              {sd.viewAllPackages}
            </a>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingAssistant />
    </div>
  );
}
