import { ArrowUpRight, Check } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { FloatingAssistant } from '@/components/FloatingAssistant';
import { Breadcrumb } from '@/components/Breadcrumb';
import { TravelCostNotice } from '@/components/TravelCostNotice';
import { STATIC_SERVICES } from '@/data/services-static';
import { getCityPageContent, type CityRouteKey } from '@/data/city-pages';
import { useTranslation } from '@/i18n/LanguageContext';
import type { Lang } from '@/seo/routes';

const MOBILE_CLEANING_PATH: Record<Lang, string> = {
  de: '/de/leistungen/mobile-autoreinigung/',
  en: '/en/services/mobile-car-cleaning/',
  fr: '/fr/prestations/nettoyage-voiture-mobile/',
};

const SERVICE_PATHS: Record<string, Record<Lang, string>> = {
  interior: {
    de: '/de/leistungen/innenreinigung/',
    en: '/en/services/interior-cleaning/',
    fr: '/fr/prestations/nettoyage-interieur/',
  },
  exterior: {
    de: '/de/leistungen/aussenreinigung/',
    en: '/en/services/exterior-cleaning/',
    fr: '/fr/prestations/nettoyage-exterieur/',
  },
  detailing: {
    de: '/de/leistungen/fahrzeugaufbereitung/',
    en: '/en/services/car-detailing/',
    fr: '/fr/prestations/preparation-vehicule/',
  },
};

const SERVICE_LABELS: Record<Lang, Array<{ key: string; title: string; description: string; from: number }>> = {
  de: [
    { key: 'mobile', title: 'Mobile Autoreinigung', description: 'Professionelle Reinigung direkt am vereinbarten Standort.', from: 85 },
    { key: 'interior', title: 'Innenreinigung', description: 'Fahrgastraum, Sitze, Armaturenbrett und Fussmatten.', from: 85 },
    { key: 'exterior', title: 'Aussenreinigung', description: 'Handwäsche, Felgen, Scheiben und Karosseriepflege.', from: 85 },
    { key: 'detailing', title: 'Fahrzeugaufbereitung', description: 'Komplette Pflege von Innenraum und Aussenflächen.', from: 170 },
  ],
  en: [
    { key: 'mobile', title: 'Mobile Car Cleaning', description: 'Professional cleaning at your agreed location.', from: 85 },
    { key: 'interior', title: 'Interior Cleaning', description: 'Cabin, seats, dashboard and floor mats.', from: 85 },
    { key: 'exterior', title: 'Exterior Cleaning', description: 'Hand wash, wheels, windows and bodywork care.', from: 85 },
    { key: 'detailing', title: 'Car Detailing', description: 'Complete care for the interior and exterior.', from: 170 },
  ],
  fr: [
    { key: 'mobile', title: 'Nettoyage voiture mobile', description: 'Nettoyage professionnel au lieu convenu.', from: 85 },
    { key: 'interior', title: 'Nettoyage intérieur', description: 'Habitacle, sièges, tableau de bord et tapis.', from: 85 },
    { key: 'exterior', title: 'Nettoyage extérieur', description: 'Lavage à la main, jantes, vitres et carrosserie.', from: 85 },
    { key: 'detailing', title: 'Préparation du véhicule', description: 'Entretien complet de l’intérieur et de l’extérieur.', from: 170 },
  ],
};

const QUOTE_PATHS: Record<Lang, string> = {
  de: '/de/kontakt/#quote',
  en: '/en/contact/#quote',
  fr: '/fr/contact/#quote',
};

export default function CityPage({ cityRouteKey }: { cityRouteKey: CityRouteKey }) {
  const { lang, getLangRoute } = useTranslation();
  const copy = getCityPageContent(cityRouteKey, lang);
  const services = SERVICE_LABELS[lang];
  const packages = STATIC_SERVICES.filter((service) => service.category === 'inside-outside');
  const mobileLabel = lang === 'de' ? 'Mobile Autoreinigung' : lang === 'fr' ? 'Nettoyage voiture mobile' : 'Mobile Car Cleaning';
  const businessLinkLabel = copy.businessCta;

  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-primary/30 selection:text-foreground">
      <Navigation />
      <main className="pt-32 pb-20 container mx-auto px-5 sm:px-6 lg:px-12">
        <Breadcrumb
          items={[
            { label: 'RCC Royal Car Cleaning', href: `/${lang}/` },
            { label: mobileLabel, href: MOBILE_CLEANING_PATH[lang] },
            { label: copy.cityName },
          ]}
        />

        <header className="mb-16 max-w-3xl">
          <span className="mb-4 block text-[10px] uppercase tracking-[0.32em] text-primary">{copy.eyebrow}</span>
          <h1 className="mb-6 text-3xl font-semibold uppercase leading-[0.95] tracking-[-0.04em] text-foreground sm:text-4xl md:text-5xl">
            {copy.h1}
          </h1>
          <p className="max-w-2xl text-sm font-light leading-relaxed text-foreground/60 md:text-base">{copy.intro}</p>
          <p className="mt-4 max-w-2xl text-sm font-light leading-relaxed text-foreground/50">{copy.localDetail}</p>
          <div className="mt-7 flex flex-col gap-4 sm:flex-row">
            <a href={QUOTE_PATHS[lang]} className="inline-flex items-center justify-center gap-3 bg-primary px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-background transition-colors hover:bg-[#ebcc7b]">
              {copy.ctaButton}
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a href={getLangRoute('packages')} className="inline-flex items-center justify-center gap-3 border border-white/20 px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-foreground/70 transition-colors hover:border-primary/50 hover:text-primary">
              {copy.packagesButton}
            </a>
          </div>
        </header>

        <section className="mb-16">
          <h2 className="mb-3 text-xl font-semibold uppercase tracking-[-0.025em] text-foreground">{copy.servicesTitle}</h2>
          <p className="mb-8 max-w-2xl text-sm font-light leading-relaxed text-foreground/55">{copy.servicesIntro}</p>
          <nav aria-label={copy.servicesTitle}>
            <ul className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => {
                const href = service.key === 'mobile' ? MOBILE_CLEANING_PATH[lang] : SERVICE_PATHS[service.key][lang];
                return (
                  <li key={service.key}>
                    <a href={href} className="group relative block h-full bg-[#090909] px-6 py-7 transition-colors hover:bg-white/[0.025]">
                      <span className="absolute bottom-0 left-0 h-px w-0 bg-primary/60 transition-all duration-500 group-hover:w-full" />
                      <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.06em] text-foreground transition-colors group-hover:text-primary">{service.title}</h3>
                      <p className="mb-4 text-sm font-light leading-relaxed text-foreground/55">{service.description}</p>
                      <p className="text-[10px] uppercase tracking-[0.14em] text-foreground/40">
                        {lang === 'de' ? 'Ab' : lang === 'fr' ? 'Dès' : 'From'} <span className="text-sm font-medium text-primary">{service.from} CHF</span>
                      </p>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </section>

        <section className="mb-16">
          <h2 className="mb-8 text-xl font-semibold uppercase tracking-[-0.025em] text-foreground">{copy.howTitle}</h2>
          <ol className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-4">
            {copy.steps.map((step, index) => (
              <li key={step.title} className="bg-[#090909] px-6 py-7">
                <span className="mb-5 block text-xs tracking-[0.2em] text-primary">0{index + 1}</span>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.04em] text-foreground">{step.title}</h3>
                <p className="text-sm font-light leading-relaxed text-foreground/55">{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        {copy.travel && (
          <div className="mb-16">
            <TravelCostNotice copy={copy.travel} />
          </div>
        )}

        <section className="mb-16">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold uppercase tracking-[-0.025em] text-foreground">{copy.packagesTitle}</h2>
              <p className="mt-3 max-w-2xl text-sm font-light leading-relaxed text-foreground/50">{copy.packagesDescription}</p>
            </div>
            <a href={getLangRoute('packages')} className="inline-flex shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
              {copy.packagesButton}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {packages.map((service) => {
              const nameKey = `name${lang.toUpperCase()}` as keyof typeof service;
              const descKey = `description${lang.toUpperCase()}` as keyof typeof service;
              const intKey = `interiorFeatures${lang.toUpperCase()}` as keyof typeof service;
              const extKey = `exteriorFeatures${lang.toUpperCase()}` as keyof typeof service;
              const features = [
                ...(service[intKey] as readonly string[]),
                ...(service[extKey] as readonly string[]),
              ].slice(0, 5);
              return (
                <article key={service.id} className={`relative border p-6 md:p-8 ${service.level === 'premium' ? 'border-primary/50 bg-primary/[0.04]' : 'border-white/10 bg-[#090909]'}`}>
                  <h3 className="mb-2 text-lg font-semibold uppercase tracking-[-0.02em] text-foreground">{service[nameKey] as string}</h3>
                  <p className="mb-4 text-sm font-light leading-relaxed text-foreground/55">{service[descKey] as string}</p>
                  <ul className="space-y-1.5">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm font-light text-foreground/65">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-xs uppercase tracking-[0.14em] text-foreground/40">
                    {lang === 'de' ? 'Ab' : lang === 'fr' ? 'Dès' : 'From'} <span className="text-lg font-medium text-primary">{Math.min(...Object.values(service.prices))} CHF</span>
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mb-16 border border-white/10 bg-[#090909] px-7 py-8">
          <h2 className="text-xl font-semibold uppercase tracking-[-0.025em] text-foreground">{copy.businessTitle}</h2>
          <p className="mt-3 max-w-2xl text-sm font-light leading-relaxed text-foreground/55">{copy.businessText}</p>
          <a href={getLangRoute('firmenkunden')} className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
            {businessLinkLabel}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </section>

        <section className="mb-16">
          <h2 className="mb-8 text-xl font-semibold uppercase tracking-[-0.025em] text-foreground">{copy.faqTitle}</h2>
          <div className="space-y-1">
            {copy.faqs.map((faq) => (
              <details key={faq.question} className="group border border-white/10 bg-[#090909]">
                <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-5 text-sm font-medium text-foreground">
                  <span>{faq.question}</span>
                  <span className="ml-4 shrink-0 text-lg leading-none text-primary transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="border-t border-white/5 px-6 pb-5 pt-4 text-sm font-light leading-relaxed text-foreground/60">{faq.answer}</div>
              </details>
            ))}
          </div>
        </section>

        <section className="border border-primary/20 bg-primary/[0.04] px-8 py-10 text-center">
          <h2 className="mb-4 text-2xl font-semibold uppercase tracking-[-0.03em] text-foreground">{copy.ctaTitle}</h2>
          <p className="mx-auto mb-8 max-w-md text-sm font-light text-foreground/50">{copy.ctaDescription}</p>
          <a href={QUOTE_PATHS[lang]} className="inline-flex items-center gap-3 bg-primary px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-background transition-colors hover:bg-[#ebcc7b]">
            {copy.ctaButton}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </section>
      </main>
      <Footer />
      <FloatingAssistant />
    </div>
  );
}