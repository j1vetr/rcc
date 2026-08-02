import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Check, Clock } from 'lucide-react';
import { useListServices } from '@workspace/api-client-react';
import { useTranslation } from '@/i18n/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';

export function Services() {
  const { t, lang } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const { data: services, isLoading } = useListServices({
    query: { queryKey: ['services'] },
  });

  useEffect(() => {
    if (!services?.length) return;
    const popularIndex = services.findIndex((service) => service.popular);
    setActiveIndex(popularIndex >= 0 ? popularIndex : 0);
  }, [services]);

  const getLocalizedField = (
    service: NonNullable<typeof services>[number],
    field: 'name' | 'description',
  ) => {
    const key = `${field}${lang.toUpperCase()}` as keyof typeof service;
    return String(service[key]);
  };

  const scrollToQuote = (serviceId: string) => {
    window.dispatchEvent(new CustomEvent('select-service', { detail: serviceId }));
    document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <section id="services" className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-5 sm:px-6 lg:px-12">
          <Skeleton className="h-[620px] w-full bg-card/50" />
        </div>
      </section>
    );
  }

  if (!services?.length) return null;

  const activeService = services[activeIndex] ?? services[0];

  return (
    <section id="services" className="relative overflow-hidden bg-[#050505] py-16 md:py-20">
      <div
        className="absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(211,175,94,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(211,175,94,.8) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)',
        }}
      />
      <div className="absolute left-1/2 top-1/2 h-[540px] w-[540px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.055] blur-[110px]" />

      <div className="container relative z-10 mx-auto px-5 sm:px-6 lg:px-12">
        <header className="mb-10 flex flex-col gap-5 border-b border-white/10 pb-8 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="mb-3 block text-[10px] uppercase tracking-[0.32em] text-primary">
              {t.services.subtitle}
            </span>
            <h2 className="max-w-2xl text-4xl font-semibold uppercase leading-[0.95] tracking-[-0.04em] text-foreground md:text-5xl">
              {t.services.title}
            </h2>
          </div>
          <p className="max-w-xs text-xs uppercase leading-relaxed tracking-[0.16em] text-foreground/35">
            03 / RCC Treatment Programs
          </p>
        </header>

        <div
          className="mb-5 grid grid-cols-3 border border-white/10 bg-black/40"
          role="tablist"
          aria-label={t.services.title}
        >
          {services.map((service, index) => {
            const isActive = activeIndex === index;
            return (
              <button
                key={service.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveIndex(index)}
                className={`relative min-w-0 border-r border-white/10 px-2 py-4 text-left transition-colors last:border-r-0 sm:px-5 sm:py-5 ${
                  isActive ? 'bg-primary text-background' : 'text-foreground/45 hover:bg-white/[0.04] hover:text-foreground'
                }`}
              >
                <span className="mb-1 block font-mono text-[9px] opacity-70">0{index + 1}</span>
                <span className="block truncate text-[10px] font-semibold uppercase tracking-[0.08em] sm:text-xs sm:tracking-[0.14em]">
                  {getLocalizedField(service, 'name')}
                </span>
                {service.popular && (
                  <span className={`mt-1 hidden text-[8px] uppercase tracking-[0.15em] sm:block ${isActive ? 'text-background/65' : 'text-primary'}`}>
                    {t.services.popular}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="relative min-h-[560px] overflow-hidden border border-primary/25 bg-[#090909] md:min-h-[500px]">
          <div className="pointer-events-none absolute -right-3 top-0 select-none font-mono text-[clamp(9rem,28vw,24rem)] font-bold leading-none text-white/[0.025]">
            0{activeIndex + 1}
          </div>
          <div className="absolute left-0 top-0 h-px w-1/2 bg-gradient-to-r from-primary via-primary/45 to-transparent" />
          <div className="absolute bottom-0 right-0 h-px w-1/2 bg-gradient-to-l from-primary via-primary/45 to-transparent" />

          <AnimatePresence mode="wait">
            <motion.article
              key={activeService.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="relative grid min-h-[560px] md:min-h-[500px] md:grid-cols-[1.08fr_.92fr]"
            >
              <div className="flex flex-col justify-between border-b border-white/10 p-6 sm:p-9 md:border-b-0 md:border-r md:p-10 lg:p-12">
                <div>
                  <div className="mb-8 flex items-center gap-3">
                    <span className="h-px w-10 bg-primary" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">
                      Program 0{activeIndex + 1}
                    </span>
                  </div>
                  <h3 className="max-w-xl text-[clamp(2.5rem,6vw,5rem)] font-semibold uppercase leading-[0.84] tracking-[-0.055em] text-foreground">
                    {getLocalizedField(activeService, 'name')}
                  </h3>
                  <p className="mt-7 max-w-md text-sm font-light leading-relaxed text-foreground/55 md:text-base">
                    {getLocalizedField(activeService, 'description')}
                  </p>
                </div>

                <div className="mt-12 flex items-end justify-between gap-4">
                  <div>
                    <span className="mb-2 block text-[9px] uppercase tracking-[0.22em] text-foreground/35">
                      {t.services.priceFrom}
                    </span>
                    <div className="flex items-end gap-2">
                      <span className="text-5xl font-semibold leading-none tracking-[-0.05em] text-foreground sm:text-7xl">
                        {activeService.priceFrom}
                      </span>
                      <span className="pb-1 text-xs font-semibold tracking-[0.16em] text-primary">CHF</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pb-1 text-[10px] uppercase tracking-[0.16em] text-foreground/45">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    {activeService.duration}
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between p-6 sm:p-9 md:p-10 lg:p-12">
                <div>
                  <span className="mb-7 block text-[9px] uppercase tracking-[0.25em] text-foreground/35">
                    {t.services.included}
                  </span>
                  <div className="divide-y divide-white/10 border-y border-white/10">
                    {activeService.features.map((feature, index) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.08 + index * 0.055 }}
                        className="flex items-center gap-4 py-3.5"
                      >
                        <span className="font-mono text-[9px] text-primary/55">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="flex-1 text-[11px] uppercase tracking-[0.13em] text-foreground/72">
                          {feature}
                        </span>
                        <Check className="h-3.5 w-3.5 text-primary" />
                      </motion.div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  data-testid={`button-book-${activeService.id}`}
                  onClick={() => scrollToQuote(activeService.id)}
                  className="group mt-10 flex min-h-14 w-full items-center justify-between bg-primary px-5 text-left text-[11px] font-bold uppercase tracking-[0.2em] text-background transition-colors hover:bg-[#ebcc7b]"
                >
                  {t.services.bookNow}
                  <span className="flex h-9 w-9 items-center justify-center border border-background/25 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </button>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}