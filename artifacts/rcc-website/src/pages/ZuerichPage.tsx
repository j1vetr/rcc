/**
 * Zurich city landing page ,  serves DE, EN, FR.
 * DE: /de/mobile-autoreinigung/zuerich/
 * EN: /en/mobile-car-cleaning/zurich/
 * FR: /fr/nettoyage-voiture-mobile/zurich/
 *
 * Unique Zurich-specific content ,  not a doorway page.
 * Content derived only from verified package data.
 */

import { ArrowUpRight, Check, MapPin } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { FloatingAssistant } from '@/components/FloatingAssistant';
import { Breadcrumb } from '@/components/Breadcrumb';
import { STATIC_SERVICES } from '@/data/services-static';
import { useTranslation } from '@/i18n/LanguageContext';
import type { Lang } from '@/seo/routes';

const MOBILE_CLEANING_PATH: Record<Lang, string> = {
  de: '/de/leistungen/mobile-autoreinigung/',
  en: '/en/services/mobile-car-cleaning/',
  fr: '/fr/prestations/nettoyage-voiture-mobile/',
};

const FEATURE_KEY: Record<Lang, 'DE' | 'EN' | 'FR'> = { de: 'DE', en: 'EN', fr: 'FR' };

// Show 2 featured packages (inside-outside)
const FEATURED = STATIC_SERVICES.filter((s) => s.category === 'inside-outside');

export default function ZuerichPage() {
  const { t, lang, getLangRoute } = useTranslation();
  const cp = t.cityPage;
  const featKey = FEATURE_KEY[lang];

  const serviceItems = (cp.services as Array<{ routeKey: string; title: string; desc: string; from: number }>);
  const servicePaths: Record<string, Record<Lang, string>> = {
    'leistungen/innenreinigung': { de: '/de/leistungen/innenreinigung/', en: '/en/services/interior-cleaning/', fr: '/fr/prestations/nettoyage-interieur/' },
    'leistungen/aussenreinigung': { de: '/de/leistungen/aussenreinigung/', en: '/en/services/exterior-cleaning/', fr: '/fr/prestations/nettoyage-exterieur/' },
    'leistungen/fahrzeugaufbereitung': { de: '/de/leistungen/fahrzeugaufbereitung/', en: '/en/services/car-detailing/', fr: '/fr/prestations/preparation-vehicule/' },
  };

  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-primary/30 selection:text-foreground">
      <Navigation />

      <main className="pt-32 pb-20 container mx-auto px-5 sm:px-6 lg:px-12">
        <Breadcrumb
          items={[
            { label: 'RCC Royal Car Cleaning', href: `/${lang}/` },
            { label: lang === 'de' ? 'Mobile Autoreinigung' : lang === 'fr' ? 'Nettoyage voiture mobile' : 'Mobile Car Cleaning', href: MOBILE_CLEANING_PATH[lang] },
            { label: lang === 'de' ? 'Zürich' : 'Zurich' },
          ]}
        />

        {/* Hero */}
        <header className="mb-16 max-w-2xl">
          <span className="mb-4 block text-[10px] uppercase tracking-[0.32em] text-primary">
            {cp.eyebrow}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold uppercase leading-[0.95] tracking-[-0.04em] text-foreground mb-6">
            {cp.h1Line1}<br />{cp.h1Line2}
          </h1>
          <p className="text-sm md:text-base font-light text-foreground/55 leading-relaxed max-w-xl">
            {cp.intro}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <a
              href={`${getLangRoute('home')}#quote`}
              className="inline-flex items-center justify-center gap-3 bg-primary px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-background hover:bg-[#ebcc7b] transition-colors"
            >
              {cp.ctaButton}
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <a
              href={getLangRoute('packages')}
              className="inline-flex items-center justify-center gap-3 border border-white/20 px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-foreground/70 hover:border-primary/50 hover:text-primary transition-colors"
            >
              {cp.packagesButton}
            </a>
          </div>
        </header>

        {/* What we offer in Zurich */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold uppercase tracking-[-0.025em] text-foreground mb-8">
            {cp.servicesTitle}
          </h2>
          <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-3">
            {serviceItems.map((item) => {
              const href = servicePaths[item.routeKey]?.[lang] ?? `/${lang}/`;
              return (
                <a
                  key={item.routeKey}
                  href={href}
                  className="group relative bg-[#090909] px-6 py-8 hover:bg-white/[0.025] transition-colors block"
                >
                  <span className="absolute bottom-0 left-0 h-px w-0 bg-primary/60 transition-all duration-500 group-hover:w-full" />
                  <h3 className="text-sm font-semibold uppercase tracking-[0.06em] text-foreground mb-3 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm font-light leading-relaxed text-foreground/55 mb-4">{item.desc}</p>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-foreground/40">
                    {cp.priceFromLabel}{' '}
                    <span className="text-primary font-medium text-sm">{item.from} CHF</span>
                  </p>
                </a>
              );
            })}
          </div>
        </section>

        {/* Featured packages */}
        <section className="mb-16" aria-label={cp.packagesTitle}>
          <h2 className="text-xl font-semibold uppercase tracking-[-0.025em] text-foreground mb-4">
            {cp.packagesTitle}
          </h2>
          <p className="text-sm font-light text-foreground/50 mb-8">
            {cp.packagesPriceNote}
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {FEATURED.map((service) => {
              const isPremium = service.level === 'premium';
              const intKey = `interiorFeatures${featKey}` as keyof typeof service;
              const extKey = `exteriorFeatures${featKey}` as keyof typeof service;
              const nameKey = `name${featKey}` as keyof typeof service;
              const features = [
                ...(service[intKey] as readonly string[]),
                ...(service[extKey] as readonly string[]),
              ].slice(0, 6);
              return (
                <div
                  key={service.id}
                  className={`relative border p-6 md:p-8 ${
                    isPremium
                      ? 'border-primary/50 bg-gradient-to-b from-primary/[0.06] to-[#090909]'
                      : 'border-white/10 bg-[#090909]'
                  }`}
                >
                  <h3 className="text-lg font-semibold uppercase tracking-[-0.02em] text-foreground mb-1">
                    {service[nameKey] as string}
                  </h3>
                  <div className="mb-4">
                    <span className="text-[9px] uppercase tracking-widest text-foreground/40">{cp.priceFromLabel} </span>
                    <span className="text-2xl font-medium text-primary">{service.prices.small}</span>
                    <span className="ml-1 text-xs text-primary/60">CHF</span>
                  </div>
                  <ul className="mb-6 space-y-1.5">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm font-light text-foreground/65">
                        <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={getLangRoute('packages')}
                    className="inline-flex items-center gap-2 border border-primary/50 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-primary hover:bg-primary hover:text-background transition-colors"
                  >
                    {lang === 'de' ? 'Offerte anfragen' : lang === 'fr' ? 'Demander un devis' : 'Request quote'}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-xs font-light text-foreground/40">
            {lang === 'de'
              ? 'Für genaue Angaben zu Ihrem Standort kontaktieren Sie uns bitte direkt.'
              : lang === 'fr'
              ? 'Pour des informations précises sur votre emplacement, contactez-nous directement.'
              : 'For exact information for your location, please contact us directly.'}
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold uppercase tracking-[-0.025em] text-foreground mb-8">
            {cp.faqTitle}
          </h2>
          <div className="space-y-1">
            {(cp.faqs as Array<{ question: string; answer: string }>).map((faq) => (
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
            {cp.ctaTitle}
          </h2>
          <p className="text-sm font-light text-foreground/50 mb-8 max-w-md mx-auto">
            {cp.ctaDesc}
          </p>
          <a
            href={`${getLangRoute('home')}#quote`}
            className="inline-flex items-center gap-3 bg-primary px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-background hover:bg-[#ebcc7b] transition-colors"
          >
            {cp.ctaButton}
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </section>
      </main>

      <Footer />
      <FloatingAssistant />
    </div>
  );
}
