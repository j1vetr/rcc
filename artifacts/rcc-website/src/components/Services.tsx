import React from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { useListServices } from '@workspace/api-client-react';
import { motion } from 'framer-motion';
import { Check, Clock } from 'lucide-react';
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
    <section id="services" className="py-20 bg-card/30 relative section-border">
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-foreground mb-4">
            {t.services.title}
          </h2>
          <div className="w-20 h-px gold-divider mx-auto mb-5" />
          <p className="text-foreground/60 text-base md:text-lg max-w-xl mx-auto font-light">
            {t.services.subtitle}
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-[500px] bg-card/50" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {services?.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className={`service-card-glow h-full flex flex-col bg-card border p-8 transition-all duration-500 hover:border-primary/50 ${
                  service.popular ? 'border-primary/50 shadow-[0_0_30px_rgba(201,165,83,0.12)]' : 'border-border'
                }`}>
                  {service.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-background text-xs font-medium px-5 py-1.5 uppercase tracking-[0.2em]">
                      {t.services.popular}
                    </div>
                  )}
                  
                  <h3 className="text-2xl font-serif font-light text-foreground mb-2 tracking-tight">
                    {getLocalizedField(service, 'name')}
                  </h3>
                  
                  <p className="text-foreground/50 text-sm mb-6 min-h-[50px] leading-relaxed font-light">
                    {getLocalizedField(service, 'description')}
                  </p>
                  
                  <div className="mb-5">
                    <span className="text-foreground/50 text-xs uppercase tracking-widest block mb-1">
                      {t.services.priceFrom}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-serif font-light text-primary tracking-tight">
                        {service.priceFrom}
                      </span>
                      <span className="text-foreground/50 text-base font-light">CHF</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-foreground/40 text-sm mb-6 font-light">
                    <Clock className="w-4 h-4" strokeWidth={1.5} />
                    <span className="tracking-wide">{service.duration}</span>
                  </div>
                  
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6" />
                  
                  <ul className="flex-grow space-y-3 mb-8">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-foreground/70 text-sm font-light leading-relaxed">
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" strokeWidth={1.5} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    data-testid={`button-book-${service.id}`}
                    onClick={() => scrollToQuote(service.id)}
                    className={`w-full py-3 text-xs font-medium uppercase tracking-[0.2em] transition-all duration-300 border ${
                      service.popular 
                        ? 'btn-gold-luxury text-background' 
                        : 'bg-transparent text-foreground border-border hover:border-primary hover:text-primary hover:shadow-[0_0_15px_rgba(201,165,83,0.15)]'
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
