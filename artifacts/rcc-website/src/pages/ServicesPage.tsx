import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useListServices } from '@workspace/api-client-react';
import { useTranslation } from '@/i18n/LanguageContext';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { FloatingAssistant } from '@/components/FloatingAssistant';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpRight, Check } from 'lucide-react';
import { useLocation } from 'wouter';

import carSmall from '@assets/optimized/car-small.webp';
import carMedium from '@assets/optimized/car-medium.webp';
import carSuv from '@assets/optimized/car-suv.webp';
import carVan from '@assets/optimized/car-van.webp';

type SizeKey = 'small' | 'medium' | 'large' | 'xl';

const CAR_IMAGES: Record<SizeKey, string> = {
  small: carSmall,
  medium: carMedium,
  large: carSuv,
  xl: carVan,
};

export default function ServicesPage() {
  const { t, lang } = useTranslation();
  const [, setLocation] = useLocation();
  const [selectedSize, setSelectedSize] = useState<SizeKey | null>(null);

  const { data: services, isLoading } = useListServices({
    query: { queryKey: ['services'] },
  });

  const getLocalizedField = (
    service: NonNullable<typeof services>[number],
    field: 'name' | 'description' | 'exteriorFeatures' | 'interiorFeatures',
  ) => {
    const key = `${field}${lang.toUpperCase()}` as keyof typeof service;
    return service[key];
  };

  const getLowestPrice = (size: SizeKey) => {
    if (!services?.length) return 0;
    return Math.min(...services.map((s) => s.prices[size]));
  };

  const groupedServices = useMemo(() => {
    if (!services) return {};
    const groups: Record<string, typeof services> = {
      'inside-outside': [],
      interior: [],
      exterior: [],
    };
    services.forEach((s) => {
      if (groups[s.category]) {
        groups[s.category].push(s);
      }
    });
    // Sort each group so basic is first, premium second
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => (a.level === 'basic' ? -1 : 1));
    });
    return groups;
  }, [services]);

  const handleRequest = (serviceId: string) => {
    const params = new URLSearchParams();
    if (selectedSize) {
      params.set('car', selectedSize);
    }
    params.set('service', serviceId);
    
    setLocation(`/?${params.toString()}#quote`);
  };

  return (
    <div className="bg-[#050505] min-h-screen text-foreground selection:bg-primary/30 selection:text-foreground pb-20">
      <Navigation />
      
      <main className="pt-32 pb-20 container mx-auto px-5 sm:px-6 lg:px-12 relative z-10">
        <header className="mb-16 text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-4 block text-[10px] uppercase tracking-[0.32em] text-primary">
              {t.servicesPage.eyebrow}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold uppercase leading-[0.95] tracking-[-0.04em] text-foreground mb-6">
              {t.servicesPage.title}
            </h1>
            <p className="text-sm md:text-base font-light text-foreground/50">
              {t.servicesPage.subtitle}
            </p>
          </motion.div>
        </header>

        {isLoading ? (
          <div className="space-y-12">
            <Skeleton className="h-40 w-full bg-card/20" />
            <Skeleton className="h-96 w-full bg-card/20" />
          </div>
        ) : (
          <div className="space-y-20">
            {/* Size Picker */}
            <section>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(['small', 'medium', 'large', 'xl'] as SizeKey[]).map((size, i) => {
                  const isSelected = selectedSize === size;
                  return (
                    <motion.button
                      key={size}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      onClick={() => setSelectedSize(isSelected ? null : size)}
                      className={`relative flex flex-col items-center justify-between p-6 border transition-all duration-300 ${
                        isSelected 
                          ? 'border-primary bg-primary/[0.03]' 
                          : 'border-white/10 bg-black/40 hover:bg-white/[0.02] hover:border-white/20'
                      }`}
                    >
                      {/* Deselect indicator */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      <div className="h-24 md:h-28 w-full flex items-center justify-center mb-4">
                        <img 
                          src={CAR_IMAGES[size]} 
                          alt={t.servicesPage.sizes[size]} 
                          className={`max-h-full max-w-full object-contain transition-all duration-500 ${
                            isSelected ? 'opacity-100 scale-105' : 'opacity-50 grayscale group-hover:opacity-80'
                          }`}
                        />
                      </div>
                      
                      <div className="text-center w-full">
                        <h3 className={`text-xs md:text-sm font-semibold uppercase tracking-[0.15em] mb-1 ${
                          isSelected ? 'text-primary' : 'text-foreground/80'
                        }`}>
                          {t.servicesPage.sizes[size]}
                        </h3>
                        <p className="text-[10px] text-foreground/40 mb-3 line-clamp-1">
                          {t.servicesPage.sizeExamples[size]}
                        </p>
                        
                        <div className="pt-3 border-t border-white/10 flex items-center justify-center gap-1.5">
                          <span className="text-[9px] uppercase tracking-widest text-foreground/40">
                            {t.servicesPage.from}
                          </span>
                          <span className="text-sm font-medium tracking-wide">
                            {getLowestPrice(size)} CHF
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </section>

            {/* Packages List */}
            <div className="space-y-16">
              {['inside-outside', 'interior', 'exterior'].map((category) => {
                const categoryServices = groupedServices[category];
                if (!categoryServices?.length) return null;

                return (
                  <section key={category} className="scroll-mt-32">
                    <header className="mb-8 flex items-center gap-4">
                      <h2 className="text-xl md:text-2xl font-serif tracking-wide text-foreground">
                        {t.servicesPage.categories[category as keyof typeof t.servicesPage.categories]}
                      </h2>
                      <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
                    </header>

                    <div className="grid md:grid-cols-2 gap-6">
                      {categoryServices.map((service) => {
                        const price = selectedSize 
                          ? service.prices[selectedSize] 
                          : Math.min(...Object.values(service.prices));
                          
                        const extFeatures = getLocalizedField(service, 'exteriorFeatures') as string[];
                        const intFeatures = getLocalizedField(service, 'interiorFeatures') as string[];

                        return (
                          <div 
                            key={service.id} 
                            className="flex flex-col border border-white/10 bg-[#090909] overflow-hidden"
                          >
                            <div className="p-6 md:p-8 border-b border-white/10 flex-1">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <span className="inline-block px-2 py-1 bg-white/5 text-[9px] uppercase tracking-widest text-foreground/60 mb-3">
                                    {t.servicesPage.levels[service.level]}
                                  </span>
                                  <h3 className="text-2xl font-semibold uppercase tracking-[-0.02em] text-foreground">
                                    {getLocalizedField(service, 'name') as string}
                                  </h3>
                                </div>
                                <div className="text-right">
                                  {!selectedSize && (
                                    <span className="block text-[9px] uppercase tracking-widest text-foreground/40 mb-1">
                                      {t.servicesPage.from}
                                    </span>
                                  )}
                                  <div className="flex items-end gap-1.5">
                                    <span className="text-3xl font-medium tracking-tight text-primary leading-none">
                                      {price}
                                    </span>
                                    <span className="text-xs font-semibold text-primary/60 pb-0.5">
                                      {t.servicesPage.price}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <p className="text-sm text-foreground/50 font-light leading-relaxed mb-8">
                                {getLocalizedField(service, 'description') as string}
                              </p>

                              <div className="space-y-6">
                                {intFeatures && intFeatures.length > 0 && (
                                  <div>
                                    <h4 className="text-[10px] font-semibold uppercase tracking-widest text-foreground/40 mb-3 flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                      {t.servicesPage.features.interior}
                                    </h4>
                                    <ul className="space-y-2.5">
                                      {intFeatures.map((f, i) => (
                                        <li key={i} className="flex items-start gap-3 text-xs text-foreground/70">
                                          <Check className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                                          <span className="leading-snug">{f}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                
                                {extFeatures && extFeatures.length > 0 && (
                                  <div>
                                    <h4 className="text-[10px] font-semibold uppercase tracking-widest text-foreground/40 mb-3 flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                      {t.servicesPage.features.exterior}
                                    </h4>
                                    <ul className="space-y-2.5">
                                      {extFeatures.map((f, i) => (
                                        <li key={i} className="flex items-start gap-3 text-xs text-foreground/70">
                                          <Check className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                                          <span className="leading-snug">{f}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleRequest(service.id)}
                              className="group flex w-full items-center justify-center gap-2 bg-primary/10 hover:bg-primary py-4 md:py-5 text-xs font-bold uppercase tracking-[0.15em] text-primary hover:text-background transition-colors"
                            >
                              {t.servicesPage.request}
                              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        )}
      </main>
      <Footer />
      <FloatingAssistant />
    </div>
  );
}
