/**
 * Services hub page — serves DE, EN, FR via lang-aware content.
 * DE: /de/leistungen/
 * EN: /en/services/
 * FR: /fr/prestations/
 */

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { FloatingAssistant } from '@/components/FloatingAssistant';
import { Breadcrumb } from '@/components/Breadcrumb';
import { AICiteBlock } from '@/components/AICiteBlock';
import { useTranslation } from '@/i18n/LanguageContext';
import type { Lang } from '@/seo/routes';

type ServiceSlug = string;

interface ServiceItem {
  slug: ServiceSlug;
  title: string;
  description: string;
  priceFrom: number;
  tags: string[];
}

const SERVICE_SLUGS: Record<Lang, Record<string, string>> = {
  de: {
    'mobile-autoreinigung': '/de/leistungen/mobile-autoreinigung/',
    'innenreinigung': '/de/leistungen/innenreinigung/',
    'aussenreinigung': '/de/leistungen/aussenreinigung/',
    'fahrzeugaufbereitung': '/de/leistungen/fahrzeugaufbereitung/',
  },
  en: {
    'mobile-car-cleaning': '/en/services/mobile-car-cleaning/',
    'interior-cleaning': '/en/services/interior-cleaning/',
    'exterior-cleaning': '/en/services/exterior-cleaning/',
    'car-detailing': '/en/services/car-detailing/',
  },
  fr: {
    'nettoyage-voiture-mobile': '/fr/prestations/nettoyage-voiture-mobile/',
    'nettoyage-interieur': '/fr/prestations/nettoyage-interieur/',
    'nettoyage-exterieur': '/fr/prestations/nettoyage-exterieur/',
    'preparation-vehicule': '/fr/prestations/preparation-vehicule/',
  },
};

export default function LeistungenPage() {
  const { t, lang, getLangRoute } = useTranslation();
  const hub = t.servicesHub;
  const services = hub.services as ServiceItem[];
  const slugMap = SERVICE_SLUGS[lang];
  const slugKeys = Object.keys(slugMap);

  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-primary/30 selection:text-foreground">
      <Navigation />

      <main className="pt-32 pb-20 container mx-auto px-5 sm:px-6 lg:px-12">
        <Breadcrumb
          items={[
            { label: 'RCC Royal Car Cleaning', href: `/${lang}/` },
            { label: lang === 'de' ? 'Leistungen' : lang === 'fr' ? 'Services' : 'Services' },
          ]}
        />

        {/* AI-citable factual block — present in SSR/prerendered HTML */}
        <div className="-mx-5 sm:-mx-6 lg:-mx-12 mb-10">
          <AICiteBlock />
        </div>

        <header className="mb-16 max-w-2xl">
          <span className="mb-4 block text-[10px] uppercase tracking-[0.32em] text-primary">
            {hub.eyebrow}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold uppercase leading-[0.95] tracking-[-0.04em] text-foreground mb-6">
            {hub.h1Line1}<br />{hub.h1Line2}
          </h1>
          <p className="text-sm md:text-base font-light text-foreground/55 leading-relaxed max-w-xl">
            {hub.intro}
          </p>
        </header>

        {/* Service cards */}
        <section aria-label={hub.sectionTitle} className="mb-20">
          <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-2">
            {services.map((service, idx) => {
              const slugKey = slugKeys[idx];
              const href = slugMap[slugKey] ?? `/${lang}/`;
              return (
                <a
                  key={service.slug}
                  href={href}
                  className="group relative flex flex-col bg-[#090909] p-8 hover:bg-white/[0.025] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <span className="absolute bottom-0 left-0 h-px w-0 bg-primary/60 transition-all duration-500 group-hover:w-full" />

                  <div className="mb-6 flex items-start justify-between gap-4">
                    <h2 className="text-xl font-semibold uppercase tracking-[-0.025em] text-foreground sm:text-2xl group-hover:text-primary transition-colors">
                      {service.title}
                    </h2>
                    <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-foreground/30 transition-colors group-hover:text-primary" />
                  </div>

                  <p className="text-sm font-light leading-relaxed text-foreground/55 mb-6 flex-1">
                    {service.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block border border-white/10 px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-foreground/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-white/[0.06] pt-5">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-foreground/30">
                      {t.servicesPage.from} CHF {service.priceFrom}
                    </span>
                    <span className="text-[10px] font-medium text-primary uppercase tracking-[0.14em] group-hover:underline">
                      {lang === 'de' ? 'Mehr erfahren' : lang === 'fr' ? 'En savoir plus' : 'Learn more'}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* Packages CTA */}
        <section className="border border-primary/20 bg-primary/[0.04] px-8 py-10 text-center">
          <p className="text-sm font-light text-foreground/50 mb-6 max-w-lg mx-auto">
            {hub.footerText}
          </p>
          <a
            href={getLangRoute('packages')}
            className="inline-flex items-center gap-3 bg-primary px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-background hover:bg-[#ebcc7b] transition-colors"
          >
            {hub.packagesLink}
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </section>

        <section className="mt-6 border border-white/10 bg-[#090909] px-8 py-9">
          <h2 className="text-lg font-semibold uppercase tracking-[-0.025em] text-foreground">
            {lang === 'de' ? 'Fahrzeugreinigung für Unternehmen' : lang === 'fr' ? 'Nettoyage pour les entreprises' : 'Vehicle cleaning for businesses'}
          </h2>
          <p className="mt-3 max-w-2xl text-sm font-light leading-relaxed text-foreground/55">
            {lang === 'de'
              ? 'RCC reinigt Geschäftsfahrzeuge, Firmenwagen, Mitarbeiterfahrzeuge und Fuhrparks mobil am vereinbarten Standort.'
              : lang === 'fr'
                ? 'RCC nettoie les véhicules professionnels, voitures de société, véhicules des collaborateurs et flottes sur le lieu convenu.'
                : 'RCC cleans business vehicles, company cars, employee vehicles and fleets at an agreed location.'}
          </p>
          <a href={getLangRoute('firmenkunden')} className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary hover:underline">
            {lang === 'de' ? 'Mehr für Firmenkunden' : lang === 'fr' ? 'En savoir plus pour les entreprises' : 'Learn more for businesses'}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </section>
      </main>

      <Footer />
      <FloatingAssistant />
    </div>
  );
}
