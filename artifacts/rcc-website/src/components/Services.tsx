import React from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { useListServices } from '@workspace/api-client-react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function Services() {
  const { t, lang } = useTranslation();
  
  const { data: services, isLoading } = useListServices({
    query: { queryKey: ['services'] }
  });

  const getLocalizedField = (service: any, field: 'name' | 'description') => {
    const key = `${field}${lang.toUpperCase()}` as keyof typeof service;
    return service[key];
  };

  const scrollToQuote = (serviceId: string) => {
    const event = new CustomEvent('select-service', { detail: serviceId });
    window.dispatchEvent(event);
    document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="py-24 bg-card/30 relative border-y border-border/30">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary text-[10px] uppercase tracking-[0.3em] mb-4 block">
              {t.services.subtitle}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-foreground">
              {t.services.title}
            </h2>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-48 w-full bg-card/50" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-w-6xl">
            {services?.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative bg-background border transition-all duration-500 p-6 md:p-8 lg:p-10 flex flex-col lg:flex-row gap-8 lg:gap-12 lg:items-center ${
                  service.popular ? 'border-primary/40 shadow-[0_0_30px_rgba(201,165,83,0.05)]' : 'border-border/40 hover:border-border/80'
                }`}
              >
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/40 opacity-0 group-hover:opacity-100 transition-opacity" />

                {service.popular && (
                  <div className="absolute top-0 left-8 -translate-y-1/2 bg-primary text-background text-[9px] font-bold px-4 py-1 uppercase tracking-[0.2em]">
                    {t.services.popular}
                  </div>
                )}

                <div className="lg:w-[35%] flex flex-col">
                  <h3 className="text-2xl md:text-3xl font-serif text-foreground mb-3 tracking-tight">
                    {getLocalizedField(service, 'name')}
                  </h3>
                  <p className="text-foreground/50 text-xs leading-relaxed font-light uppercase tracking-widest max-w-sm">
                    {getLocalizedField(service, 'description')}
                  </p>
                </div>

                <div className="lg:w-[40%] flex flex-col justify-center">
                  <div className="flex flex-wrap gap-x-2 gap-y-1.5 leading-snug">
                    {service.features.map((feature, i) => (
                      <React.Fragment key={i}>
                        <span className="text-[11px] text-foreground/70 uppercase tracking-widest">{feature}</span>
                        {i < service.features.length - 1 && <span className="text-primary/40 text-[11px]">/</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="lg:w-[25%] flex flex-col sm:flex-row lg:flex-col justify-between sm:items-center lg:items-end gap-6 border-t lg:border-t-0 lg:border-l border-border/30 pt-6 lg:pt-0 lg:pl-8">
                  <div className="flex flex-col lg:items-end">
                    <span className="text-foreground/40 text-[9px] uppercase tracking-[0.2em] mb-1">
                      {t.services.priceFrom}
                    </span>
                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span className="text-3xl font-serif text-foreground tracking-tight">{service.priceFrom}</span>
                      <span className="text-[10px] text-primary uppercase tracking-widest">CHF</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-foreground/40 text-[10px] uppercase tracking-[0.2em]">
                      <Clock className="w-3 h-3" />
                      {service.duration}
                    </div>
                  </div>
                  
                  <button
                    data-testid={`button-book-${service.id}`}
                    onClick={() => scrollToQuote(service.id)}
                    className={`w-full sm:w-auto lg:w-full px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 border ${
                      service.popular 
                        ? 'bg-primary border-primary text-background hover:bg-primary/90'
                        : 'bg-transparent border-border/50 text-foreground hover:border-primary hover:text-primary'
                    }`}
                  >
                    {t.services.bookNow}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
