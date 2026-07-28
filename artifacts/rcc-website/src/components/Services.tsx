import React from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { useListServices } from '@workspace/api-client-react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
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
    <section id="services" className="py-24 bg-[#0A0A0A] border-b border-white/5">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">{t.services.title}</h2>
          <p className="text-white/60 mb-6">{t.services.subtitle}</p>
          <div className="w-16 h-1 bg-primary mx-auto" />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-[500px] bg-white/5 rounded-none" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {services?.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`flex flex-col p-8 bg-[#141414] border transition-all hover:border-primary/50 relative ${
                  service.popular ? 'border-primary shadow-[0_0_30px_rgba(201,168,76,0.1)]' : 'border-white/5'
                }`}
              >
                {service.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-black text-xs font-bold px-4 py-1 uppercase tracking-widest">
                    {t.services.popular}
                  </div>
                )}
                
                <h3 className="text-2xl font-serif text-white mb-2">{getLocalizedField(service, 'name')}</h3>
                <p className="text-white/60 text-sm mb-6 min-h-[40px]">{getLocalizedField(service, 'description')}</p>
                
                <div className="mb-6 flex items-baseline gap-2">
                  <span className="text-white/60 text-sm">{t.services.priceFrom}</span>
                  <span className="text-4xl font-light text-primary">CHF {service.priceFrom}</span>
                </div>
                
                <div className="text-white/50 text-sm mb-6 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {service.duration}
                </div>
                
                <div className="w-full h-px bg-white/10 mb-6" />
                
                <ul className="flex-grow space-y-4 mb-8">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/80 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  data-testid={`button-book-${service.id}`}
                  onClick={() => scrollToQuote(service.id)}
                  className={`w-full py-3 text-sm font-semibold uppercase tracking-widest transition-colors border ${
                    service.popular 
                      ? 'bg-primary text-black border-primary hover:bg-primary/90' 
                      : 'bg-transparent text-white border-white/20 hover:border-primary hover:text-primary'
                  }`}
                >
                  {t.services.bookNow}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
