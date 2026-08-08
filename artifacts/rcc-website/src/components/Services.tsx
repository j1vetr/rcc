import { motion } from 'framer-motion';
import { ArrowUpRight, Check } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageContext';
import { useListServices } from '@workspace/api-client-react';
import packageDetailing from '@assets/generated_images/rcc-package-detailing.jpg';

const CATEGORY_ORDER = ['inside-outside', 'interior', 'exterior'] as const;

export function Services() {
  const { t, lang, getLangRoute } = useTranslation();
  const { data: services, isLoading } = useListServices({
    query: { queryKey: ['services'] },
  });

  const getLocalizedName = (service: NonNullable<typeof services>[number]) => {
    const key = `name${lang.toUpperCase()}` as keyof typeof service;
    return service[key] as string;
  };

  const featuredPackages = CATEGORY_ORDER.map((category) => {
    const premium = services?.find((service) => service.category === category && service.level === 'premium');
    const basic = services?.find((service) => service.category === category && service.level === 'basic');
    return premium ?? basic;
  }).filter((service): service is NonNullable<typeof services>[number] => Boolean(service));

  return (
    <section id="services" className="relative overflow-hidden bg-[#050505] py-20 md:py-32">
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
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="mb-4 block text-[10px] uppercase tracking-[0.32em] text-primary">
            03 / {t.servicesPage.teaser.title}
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold uppercase leading-[0.95] tracking-[-0.04em] text-foreground mb-6">
            {t.services.title}
          </h2>
          <p className="text-sm md:text-base font-light text-foreground/50 mb-12">
            {t.servicesPage.teaser.text}
          </p>
        </motion.div>

        <div className="mx-auto mb-10 grid max-w-6xl overflow-hidden border border-white/10 bg-[#090909] lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative min-h-[320px] overflow-hidden lg:min-h-full"
          >
            <img
              src={packageDetailing}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/15 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#090909]" />
            <div className="absolute inset-x-6 bottom-6">
              <div>
                <span className="mb-2 block text-[9px] uppercase tracking-[0.24em] text-primary">RCC Care</span>
                <p className="max-w-[14rem] text-sm font-light leading-relaxed text-white/70">
                  {t.servicesPage.teaser.imageCaption}
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid divide-y divide-white/10">
            {isLoading ? (
              <div className="grid min-h-[440px] place-items-center text-[10px] uppercase tracking-[0.2em] text-foreground/35">
                {t.servicesPage.teaser.loading}
              </div>
            ) : (
              featuredPackages.map((service, index) => {
                const category = service.category as (typeof CATEGORY_ORDER)[number];
                const fromPrice = Math.min(...Object.values(service.prices));

                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, x: -18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.11 }}
                  >
                  <a
                    href={`${getLangRoute('packages')}#${category}`}
                    className="group relative grid grid-cols-[1fr_auto] items-center gap-4 overflow-hidden px-5 py-5 transition-colors hover:bg-white/[0.025] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary sm:gap-6 sm:px-8 sm:py-7"
                  >
                    {/* Gold sweep border on hover */}
                    <span className="absolute bottom-0 left-0 h-px w-0 bg-primary/55 transition-all duration-500 group-hover:w-full" />
                    <div>
                      <span className="mb-1 block text-[9px] uppercase tracking-[0.18em] text-foreground/40">
                        {t.servicesPage.categories[category]}
                      </span>
                      <h3 className="text-base font-semibold uppercase tracking-[-0.02em] text-foreground sm:text-lg">
                        {getLocalizedName(service)}
                      </h3>
                      <span className="mt-2 flex items-center gap-1.5 text-[10px] text-foreground/50">
                        <Check className="h-3 w-3 text-primary" />
                        {t.servicesPage.levels[service.level]}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[8px] uppercase tracking-[0.16em] text-foreground/40">
                        {t.servicesPage.from}
                      </span>
                      <span className="font-serif text-2xl leading-none text-primary sm:text-3xl">
                        {fromPrice}
                      </span>
                      <span className="ml-1 text-[10px] text-primary/70">{t.servicesPage.price}</span>
                    </div>
                  </a>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-foreground/40">
            <span className="h-px w-8 bg-primary/50" />
            {t.servicesPage.teaser.priceHint}
          </div>
          <a href={getLangRoute('packages')} className="inline-flex items-center gap-3 bg-primary px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-background transition-colors hover:bg-[#ebcc7b]">
            {t.servicesPage.teaser.viewAll}
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
