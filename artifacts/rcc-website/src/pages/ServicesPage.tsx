import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  services as CATALOG_SERVICES,
  vehicleCategories,
  vehicleCategoryOrder,
  calculatePrice,
  getServiceById,
  isVehicleCategory,
  sanitizeExtraSelections,
  type CatalogService,
  type ExtraSelection,
  type ServiceCategory,
  type VehicleCategory,
} from '@workspace/service-catalog';
import { useTranslation } from '@/i18n/LanguageContext';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { FloatingAssistant } from '@/components/FloatingAssistant';
import { AICiteBlock } from '@/components/AICiteBlock';
import { TravelCostNotice } from '@/components/TravelCostNotice';
import { CarTypePicker } from '@/components/CarTypePicker';
import { ExtraSelector, PriceBreakdown } from '@/components/pricing/ExtraSelector';
import { PRICING_LABELS, asCatalogLang } from '@/data/pricing-labels';
import { ArrowUpRight, Check } from 'lucide-react';

import categoryKomplett from '@assets/generated_images/rcc-category-komplett.webp';
import categoryInterior from '@assets/generated_images/rcc-category-interior.webp';
import categoryExterior from '@assets/generated_images/rcc-category-exterior.webp';

const CATEGORY_ORDER: ServiceCategory[] = ['inside-outside', 'interior', 'exterior'];

const CATEGORY_IMAGES: Record<ServiceCategory, string> = {
  'inside-outside': categoryKomplett,
  interior: categoryInterior,
  exterior: categoryExterior,
};

type Lang = 'DE' | 'EN' | 'FR';

function localized(service: CatalogService, lang: Lang) {
  return {
    name: service[`name${lang}`],
    description: service[`description${lang}`],
    interior: service[`interiorFeatures${lang}`],
    exterior: service[`exteriorFeatures${lang}`],
  };
}

export default function ServicesPage() {
  const { t, lang, getLangRoute } = useTranslation();
  const cl = asCatalogLang(lang);
  const L = PRICING_LABELS[cl];
  const LU = cl.toUpperCase() as Lang;

  const [car, setCar] = useState<VehicleCategory | ''>('');
  const [serviceId, setServiceId] = useState<string>('');
  const [extras, setExtras] = useState<ExtraSelection[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const params = new URLSearchParams(window.location.search);
    const c = params.get('car');
    if (isVehicleCategory(c)) setCar(c);
    const s = params.get('service');
    if (s && getServiceById(s)) setServiceId(s);
    const raw = params.get('extras');
    if (raw) {
      try {
        setExtras(sanitizeExtraSelections(JSON.parse(raw)));
      } catch {
        /* ignore malformed extras */
      }
    }
    const hash = window.location.hash.replace('#', '');
    if ((CATEGORY_ORDER as string[]).includes(hash)) {
      window.setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
    }
  }, []);

  const pricing = useMemo(() => {
    if (!car || !serviceId) return undefined;
    try {
      return calculatePrice(serviceId, car, extras);
    } catch {
      return undefined;
    }
  }, [car, serviceId, extras]);

  const hasVariable = extras.some((s) => s.id === 'pet-hair-removal' || s.id === 'headliner-cleaning');
  const selectedService = serviceId ? getServiceById(serviceId) : undefined;

  const vehiclePriceHints = useMemo(() => {
    const out: Record<string, string> = {};
    vehicleCategoryOrder.forEach((v) => {
      out[v] = `${L.from} CHF ${Math.min(...CATALOG_SERVICES.map((s) => s.prices[v]))}`;
    });
    return out;
  }, [L.from]);

  const requestQuote = (id: string) => {
    const params = new URLSearchParams();
    params.set('service', id);
    if (car) params.set('car', car);
    if (extras.length) params.set('extras', JSON.stringify(extras));
    window.location.href = `${getLangRoute('kontakt')}?${params.toString()}#quote`;
  };

  const choosePackage = (id: string) => {
    setServiceId(id);
  };

  return (
    <div className="min-h-[100dvh] bg-[#050505] pb-20 text-foreground selection:bg-primary/30 selection:text-foreground">
      <Navigation />
      <main className="container relative z-10 mx-auto px-5 pb-20 pt-32 sm:px-6 lg:px-12">
        <div className="-mx-5 mb-8 sm:-mx-6 lg:-mx-12">
          <AICiteBlock />
        </div>

        <header className="mx-auto mb-14 max-w-2xl text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="mb-4 block text-[10px] uppercase tracking-[0.32em] text-primary">{t.servicesPage.eyebrow}</span>
            <h1 className="mb-6 text-3xl font-semibold uppercase leading-[0.95] tracking-[-0.04em] text-foreground sm:text-4xl md:text-5xl">
              {t.servicesPage.title}
            </h1>
            <p className="text-sm font-light text-foreground/50 md:text-base">{t.servicesPage.subtitle}</p>
          </motion.div>
        </header>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10">
          <div className="min-w-0 space-y-16 md:space-y-20">
            {/* Vehicle */}
            <section className="relative overflow-hidden border border-white/10 bg-[#090909] px-5 py-6 sm:px-8 sm:py-8">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_74%_0%,rgba(201,165,83,0.11),transparent_34%)]" />
              <div className="relative mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="mb-2 block text-[9px] uppercase tracking-[0.24em] text-primary">{L.vehicleEyebrow}</span>
                  <h2 className="text-2xl font-semibold uppercase leading-none tracking-[-0.04em] sm:text-3xl">{L.vehicleTitle}</h2>
                </div>
                <p className="max-w-xs text-xs font-light leading-relaxed text-foreground/50">{L.vehicleHelp}</p>
              </div>
              <div className="relative">
                <CarTypePicker
                  value={car}
                  onChange={(v) => isVehicleCategory(v) && setCar(v)}
                  options={vehicleCategories[cl]}
                  prices={vehiclePriceHints}
                />
              </div>
            </section>

            <TravelCostNotice variant="packages" />

            {/* Packages */}
            <section>
              <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="mb-2 block text-[9px] uppercase tracking-[0.24em] text-primary">{L.packagesEyebrow}</span>
                  <h2 className="text-2xl font-semibold uppercase leading-none tracking-[-0.04em] sm:text-3xl">{L.packagesTitle}</h2>
                </div>
                <p className="max-w-xs text-xs font-light leading-relaxed text-foreground/50">{L.packagesHelp}</p>
              </div>

              <div className="space-y-14">
                {CATEGORY_ORDER.map((category) => {
                  const list = CATALOG_SERVICES.filter((s) => s.category === category).sort((a) => (a.level === 'basic' ? -1 : 1));
                  return (
                    <section key={category} id={category} className="scroll-mt-32">
                      <header className="relative mb-6 flex h-24 items-end overflow-hidden border border-white/10 px-5 pb-4 sm:h-28">
                        <img src={CATEGORY_IMAGES[category]} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#070707] via-[#070707]/70 to-transparent" />
                        <div className="relative flex items-baseline gap-4">
                          <span className="font-serif text-3xl leading-none text-primary">{t.servicesPage.categoryPicker.marks[category]}</span>
                          <h3 className="text-lg font-semibold uppercase tracking-[0.04em] sm:text-xl">{t.servicesPage.categories[category]}</h3>
                        </div>
                      </header>

                      <div className="grid gap-5 xl:grid-cols-2">
                        {list.map((service) => {
                          const loc = localized(service, LU);
                          const isPremium = service.level === 'premium';
                          const isSelected = serviceId === service.id;
                          const count = loc.interior.length + loc.exterior.length;
                          const price = car ? service.prices[car] : Math.min(...Object.values(service.prices));
                          return (
                            <article
                              key={service.id}
                              data-testid={`card-service-${service.id}`}
                              className={`relative flex flex-col overflow-hidden border transition-all duration-500 ${
                                isSelected
                                  ? 'border-primary shadow-[0_0_0_1px_hsl(var(--primary)),0_18px_40px_-18px_rgba(201,165,83,0.45)]'
                                  : isPremium
                                    ? 'border-primary/45'
                                    : 'border-white/10 hover:border-white/25'
                              } ${isPremium ? 'bg-gradient-to-b from-primary/[0.09] via-[#0b0a07] to-[#090909]' : 'bg-[#090909]'}`}
                            >
                              {isPremium && (
                                <div className="flex items-center justify-between border-b border-primary/20 bg-primary/[0.1] px-6 py-2.5">
                                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-primary">{L.recommended}</span>
                                  <span className="text-[9px] uppercase tracking-[0.15em] text-primary/70">{count} {L.steps}</span>
                                </div>
                              )}
                              <div className="flex-1 p-6">
                                <div className="mb-5 flex items-start justify-between gap-4">
                                  <div className="min-w-0">
                                    <span className={`mb-3 inline-block px-2.5 py-1 text-[9px] uppercase tracking-widest ${isPremium ? 'bg-primary text-background' : 'bg-white/5 text-foreground/60'}`}>
                                      {isPremium ? L.premium : L.standard}
                                    </span>
                                    <h4 className="text-lg font-semibold uppercase leading-tight tracking-[-0.02em] sm:text-xl">{loc.name}</h4>
                                  </div>
                                  <div className="shrink-0 text-right">
                                    {!car && <span className="mb-1 block text-[9px] uppercase tracking-widest text-foreground/40">{L.from}</span>}
                                    <motion.div key={`${service.id}-${price}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex items-end gap-1.5">
                                      <span className="text-3xl font-medium leading-none tracking-tight text-primary tabular-nums" data-testid={`text-price-${service.id}`}>{price}</span>
                                      <span className="pb-0.5 text-xs font-semibold text-primary/60">CHF</span>
                                    </motion.div>
                                  </div>
                                </div>
                                <p className="mb-6 text-sm font-light leading-relaxed text-foreground/55">{loc.description}</p>

                                <div className={`grid gap-6 ${loc.interior.length && loc.exterior.length ? 'md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2' : ''}`}>
                                  {[
                                    { key: 'int', title: L.interior, items: loc.interior },
                                    { key: 'ext', title: L.exterior, items: loc.exterior },
                                  ].filter((g) => g.items.length).map((g) => (
                                    <div key={g.key}>
                                      <h5 className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-foreground/45">
                                        <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                                        {g.title} <span className="text-foreground/30">{g.items.length}</span>
                                      </h5>
                                      <ul className="space-y-2.5">
                                        {g.items.map((f) => (
                                          <li key={f} className="flex items-start gap-3 text-xs text-foreground/75">
                                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                                            <span className="leading-snug">{f}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="grid grid-cols-2 border-t border-white/10">
                                <button
                                  type="button"
                                  onClick={() => choosePackage(service.id)}
                                  aria-pressed={isSelected}
                                  data-testid={`button-select-${service.id}`}
                                  className={`flex items-center justify-center gap-2 py-4 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors duration-300 ${isSelected ? 'bg-primary/15 text-primary' : 'text-foreground/70 hover:bg-white/[0.03] hover:text-primary'}`}
                                >
                                  {isSelected && <Check className="h-3.5 w-3.5" />}
                                  {isSelected ? L.selected : L.selectPackage}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => requestQuote(service.id)}
                                  data-testid={`button-request-${service.id}`}
                                  className={`group flex items-center justify-center gap-2 py-4 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors ${isPremium ? 'bg-primary text-background hover:bg-[#ebcc7b]' : 'bg-primary/10 text-primary hover:bg-primary hover:text-background'}`}
                                >
                                  {L.request}
                                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                </button>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
              </div>
            </section>

            {/* Extras */}
            <section id="extras" className="scroll-mt-32 border border-white/10 bg-[#090909] px-5 py-6 sm:px-8 sm:py-8">
              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="mb-2 block text-[9px] uppercase tracking-[0.24em] text-primary">{L.extrasEyebrow}</span>
                  <h2 className="text-2xl font-semibold uppercase leading-none tracking-[-0.04em] sm:text-3xl">{L.extrasTitle}</h2>
                </div>
                <p className="max-w-xs text-xs font-light leading-relaxed text-foreground/50">{L.extrasHelp}</p>
              </div>
              <ExtraSelector lang={cl} value={extras} onChange={setExtras} />
            </section>

            <section className="border border-white/10 bg-[#090909] px-7 py-8">
              <h2 className="text-lg font-semibold uppercase tracking-[-0.025em] text-foreground">
                {lang === 'de' ? 'Reinigung für Firmenfahrzeuge' : lang === 'fr' ? 'Nettoyage pour véhicules professionnels' : 'Cleaning for business vehicles'}
              </h2>
              <p className="mt-3 max-w-2xl text-sm font-light leading-relaxed text-foreground/55">
                {lang === 'de'
                  ? 'Für Geschäftsfahrzeuge, Firmenwagen, Mitarbeiterfahrzeuge oder Fuhrparks erstellen wir gerne eine individuelle Firmenofferte.'
                  : lang === 'fr'
                    ? 'Pour les véhicules professionnels, voitures de société, véhicules des collaborateurs ou flottes, nous préparons volontiers une offre entreprise personnalisée.'
                    : 'For business vehicles, company cars, employee vehicles or fleets, we are happy to prepare an individual business quote.'}
              </p>
              <a href={getLangRoute('firmenkunden')} className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary hover:underline">
                {lang === 'de' ? 'Firmenkunden entdecken' : lang === 'fr' ? 'Découvrir les offres entreprises' : 'Explore business customers'}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </section>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-primary/30 bg-[#0a0907] p-6">
              <p className="mb-5 text-[9px] uppercase tracking-[0.24em] text-primary">{L.summaryTitle}</p>
              <PriceBreakdown
                lang={cl}
                vehicleLabel={car ? vehicleCategories[cl][car] : undefined}
                serviceName={selectedService ? localized(selectedService, LU).name : undefined}
                packagePrice={pricing?.packagePrice}
                selections={extras}
                total={pricing?.total}
                hasVariable={hasVariable}
              />
              <button
                type="button"
                disabled={!serviceId}
                onClick={() => serviceId && requestQuote(serviceId)}
                data-testid="button-request-selection"
                className="btn-gold-luxury mt-6 flex h-12 w-full items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-background disabled:cursor-not-allowed disabled:opacity-30"
              >
                {L.sendRequest}
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
      <FloatingAssistant />
    </div>
  );
}
