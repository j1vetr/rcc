import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useListServices } from '@workspace/api-client-react';
import { useTranslation } from '@/i18n/LanguageContext';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { FloatingAssistant } from '@/components/FloatingAssistant';
import { AICiteBlock } from '@/components/AICiteBlock';
import { TravelCostNotice } from '@/components/TravelCostNotice';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowDown, ArrowUpRight, Check, ChevronDown, Sparkles } from 'lucide-react';
import { useLocation } from 'wouter';

import carSmall from '@assets/optimized/car-small.webp';
import carMedium from '@assets/optimized/car-medium.webp';
import carSuv from '@assets/optimized/car-suv.webp';
import carVan from '@assets/optimized/car-van.webp';
import categoryKomplett from '@assets/generated_images/rcc-category-komplett.webp';
import categoryInterior from '@assets/generated_images/rcc-category-interior.webp';
import categoryExterior from '@assets/generated_images/rcc-category-exterior.webp';

type SizeKey = 'small' | 'medium' | 'large' | 'xl';
type CategoryKey = 'inside-outside' | 'interior' | 'exterior';

const CATEGORY_ORDER: CategoryKey[] = ['inside-outside', 'interior', 'exterior'];

const CAR_IMAGES: Record<SizeKey, string> = {
  small: carSmall,
  medium: carMedium,
  large: carSuv,
  xl: carVan,
};

const CATEGORY_IMAGES: Record<CategoryKey, string> = {
  'inside-outside': categoryKomplett,
  interior: categoryInterior,
  exterior: categoryExterior,
};

export default function ServicesPage() {
  const { t, lang, getLangRoute } = useTranslation();
  const [, setLocation] = useLocation();
  const [selectedSize, setSelectedSize] = useState<SizeKey | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryKey | null>(null);
  const [expandedPackages, setExpandedPackages] = useState<Record<string, boolean>>({});
  const [hasChosenCategory, setHasChosenCategory] = useState(false);
  const [showcasedCategory, setShowcasedCategory] = useState<CategoryKey>('inside-outside');
  const sizePickerRef = useRef<HTMLElement | null>(null);
  const categoryRefs = useRef<Record<CategoryKey, HTMLElement | null>>({
    'inside-outside': null,
    interior: null,
    exterior: null,
  });

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
    const homePath = getLangRoute('home');
    // Navigate to the home page (current language) with quote params + hash
    window.location.href = `${homePath}?${params.toString()}#quote`;
  };

  const selectCategory = (category: CategoryKey) => {
    setHasChosenCategory(true);
    setActiveCategory(category);
    sizePickerRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  useEffect(() => {
    if (hasChosenCategory) return;

    const intervalId = window.setInterval(() => {
      setShowcasedCategory((currentCategory) => {
        const currentIndex = CATEGORY_ORDER.indexOf(currentCategory);
        return CATEGORY_ORDER[(currentIndex + 1) % CATEGORY_ORDER.length];
      });
    }, 2600);

    return () => window.clearInterval(intervalId);
  }, [hasChosenCategory]);

  const selectSize = (size: SizeKey) => {
    setSelectedSize(size);
    if (activeCategory) {
      window.setTimeout(() => {
        categoryRefs.current[activeCategory]?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 180);
    }
  };

  const togglePackageDetails = (serviceId: string) => {
    setExpandedPackages((expanded) => ({
      ...expanded,
      [serviceId]: !expanded[serviceId],
    }));
  };

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    const scrollToHashCategory = () => {
      const hash = window.location.hash.replace('#', '') as CategoryKey;
      if (CATEGORY_ORDER.includes(hash)) {
        setHasChosenCategory(true);
        setActiveCategory(hash);
      }
    };

    scrollToHashCategory();
    window.addEventListener('hashchange', scrollToHashCategory);
    return () => window.removeEventListener('hashchange', scrollToHashCategory);
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen text-foreground selection:bg-primary/30 selection:text-foreground pb-20">
      <Navigation />
      <main className="pt-32 pb-20 container mx-auto px-5 sm:px-6 lg:px-12 relative z-10">
        {/* AI-citable factual block — present in SSR/prerendered HTML */}
        <div className="-mx-5 sm:-mx-6 lg:-mx-12 mb-8">
          <AICiteBlock />
        </div>
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
          <div className="space-y-16 md:space-y-20">
            <div className="mx-auto flex w-fit flex-col gap-4 border-l border-white/10 pl-6 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-x-5 sm:border-l-0 sm:pl-0">
              {[
                t.servicesPage.steps.category,
                t.servicesPage.steps.vehicle,
                t.servicesPage.steps.package,
              ].map((label, index) => {
                const isCurrent = (index === 0 && !activeCategory) || (index === 1 && activeCategory && !selectedSize) || (index === 2 && activeCategory && selectedSize);
                return (
                  <div key={label} className="flex items-center gap-3 sm:contents">
                    <span
                      className={`relative text-sm font-medium uppercase tracking-[0.16em] transition-colors sm:text-[11px] sm:tracking-[0.18em] ${
                        isCurrent ? 'text-primary' : 'text-foreground/35'
                      }`}
                    >
                      <span className={`absolute -left-[1.95rem] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border sm:static sm:mr-2 sm:inline-block sm:translate-y-0 ${
                        isCurrent ? 'border-primary bg-primary shadow-[0_0_10px_rgba(201,165,83,0.8)]' : 'border-white/25 bg-[#050505]'
                      }`} />
                      0{index + 1} {label}
                    </span>
                    {index < 2 && <span className="hidden h-px w-7 bg-white/15 sm:block" />}
                  </div>
                );
              })}
            </div>

            <section className="relative overflow-hidden border border-white/10 bg-[#090909] px-5 py-6 sm:px-8 sm:py-8">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_74%_0%,rgba(201,165,83,0.11),transparent_34%)]" />
              <div className="relative mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="mb-2 block text-[9px] uppercase tracking-[0.24em] text-primary">
                    {t.servicesPage.categoryPicker.eyebrow}
                  </span>
                  <h2 className="text-2xl font-semibold uppercase leading-none tracking-[-0.04em] text-foreground sm:text-3xl">
                    {t.servicesPage.categoryPicker.title}
                  </h2>
                </div>
                <p className="max-w-sm text-xs font-light leading-relaxed text-foreground/50">
                  {t.servicesPage.categoryPicker.text}
                </p>
              </div>
              <div className="mb-3 flex items-center justify-between sm:hidden">
                <span className="text-[9px] uppercase tracking-[0.16em] text-foreground/45">
                  {t.servicesPage.categoryPicker.swipeHint}
                </span>
                <motion.span
                  aria-hidden="true"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.25, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-sm text-primary"
                >
                  →
                </motion.span>
              </div>
              <div className="relative -mx-5 sm:mx-0">
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#090909] to-transparent sm:hidden" />
                <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 [scrollbar-width:none] sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
                {CATEGORY_ORDER.map((category) => {
                  const isSelected = activeCategory === category;
                  const isShowcased = !hasChosenCategory && showcasedCategory === category;
                  const isHighlighted = isSelected || isShowcased;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => selectCategory(category)}
                      className={`group relative min-w-[82vw] snap-start overflow-hidden border p-5 text-left transition-all duration-300 sm:min-w-0 ${
                        isHighlighted
                          ? 'border-primary bg-primary/[0.08]'
                          : 'border-white/10 bg-black/30 hover:border-primary/50 hover:bg-white/[0.025]'
                      }`}
                    >
                      <img
                        src={CATEGORY_IMAGES[category]}
                        alt=""
                        className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${isHighlighted ? 'scale-110 opacity-30 grayscale-0' : 'scale-100 opacity-[0.12] grayscale group-hover:scale-105 group-hover:opacity-25 group-hover:grayscale-0'}`}
                        style={{ objectPosition: category === 'interior' ? 'center 65%' : category === 'exterior' ? 'center center' : 'center center' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/55 to-[#070707]/10" />
                      <div className="relative flex min-h-[9.5rem] flex-col justify-end">
                         <span className={`mb-6 block font-serif text-5xl leading-none transition-colors duration-500 ${isHighlighted ? 'text-primary' : 'text-foreground/30 group-hover:text-primary/70'}`}>
                          {t.servicesPage.categoryPicker.marks[category]}
                        </span>
                         <span className={`block text-sm font-semibold uppercase tracking-[0.06em] transition-colors duration-500 ${isHighlighted ? 'text-primary' : 'text-foreground'}`}>
                          {t.servicesPage.categories[category]}
                        </span>
                        <span className="mt-2 block text-[10px] leading-relaxed text-foreground/60">
                          {t.servicesPage.categoryPicker.descriptions[category]}
                        </span>
                      </div>
                       <span className={`absolute bottom-0 left-0 h-px bg-primary transition-all duration-700 ${isHighlighted ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                    </button>
                  );
                })}
                </div>
                <div className="mx-5 flex gap-1.5 sm:hidden" aria-hidden="true">
                  {CATEGORY_ORDER.map((category) => (
                    <span
                      key={category}
                      className={`h-0.5 flex-1 transition-colors ${activeCategory === category ? 'bg-primary' : 'bg-white/15'}`}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Size Picker */}
            <section ref={sizePickerRef} className="scroll-mt-32">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="mb-2 block text-[9px] uppercase tracking-[0.24em] text-primary">
                    {t.servicesPage.vehiclePicker.eyebrow}
                  </span>
                  <h2 className="text-xl font-semibold uppercase tracking-[-0.03em] text-foreground sm:text-2xl">
                    {t.servicesPage.vehiclePicker.title}
                  </h2>
                </div>
                <p className="max-w-sm text-xs font-light leading-relaxed text-foreground/50">
                  {activeCategory ? t.servicesPage.vehiclePicker.selectedHelp : t.servicesPage.vehiclePicker.help}
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(['small', 'medium', 'large', 'xl'] as SizeKey[]).map((size, i) => {
                  const isSelected = selectedSize === size;
                  return (
                    <motion.button
                      key={size}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                       onClick={() => selectSize(size)}
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

            <TravelCostNotice variant="packages" />

            <div className="space-y-16">
              {activeCategory && (
                <div className="flex items-center justify-between border-y border-primary/20 bg-primary/[0.04] px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-xs font-medium uppercase tracking-[0.12em] text-foreground">
                      {t.servicesPage.categories[activeCategory]}
                    </span>
                  </div>
                  <span className="text-[9px] uppercase tracking-[0.16em] text-foreground/45">
                    {selectedSize ? t.servicesPage.packagePicker.ready : t.servicesPage.packagePicker.selectVehicle}
                  </span>
                </div>
              )}

              {[...CATEGORY_ORDER].sort((a, b) => {
                if (a === activeCategory) return -1;
                if (b === activeCategory) return 1;
                return 0;
              }).map((category) => {
                const categoryServices = groupedServices[category];
                if (!categoryServices?.length) return null;

                return (
                  <section
                    key={category}
                    id={category}
                    ref={(element) => {
                      categoryRefs.current[category] = element;
                    }}
                    className="scroll-mt-32"
                  >
                    <header className="mb-8 flex items-center gap-4">
                      <h2 className="text-xl md:text-2xl font-serif tracking-wide text-foreground">
                        {t.servicesPage.categories[category as keyof typeof t.servicesPage.categories]}
                      </h2>
                      {category === activeCategory && <ArrowDown className="h-4 w-4 text-primary" />}
                      <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
                    </header>

                    <div className="grid md:grid-cols-2 gap-6">
                      {categoryServices.map((service) => {
                        const price = selectedSize 
                          ? service.prices[selectedSize] 
                          : Math.min(...Object.values(service.prices));
                        const extFeatures = getLocalizedField(service, 'exteriorFeatures') as string[];
                        const intFeatures = getLocalizedField(service, 'interiorFeatures') as string[];
                        const featureCount = extFeatures.length + intFeatures.length;
                        const isPremium = service.level === 'premium';
                        const isExpanded = expandedPackages[service.id];
                        const selectedSizeLabel = selectedSize ? t.servicesPage.sizes[selectedSize] : null;

                        return (
                          <div 
                            key={service.id} 
                            className={`group relative flex flex-col overflow-hidden border transition-colors ${
                              isPremium
                                ? 'border-primary/50 bg-gradient-to-b from-primary/[0.09] via-[#0b0a07] to-[#090909]'
                                : 'border-white/10 bg-[#090909] hover:border-white/20'
                            }`}
                          >
                            {isPremium && (
                              <div className="flex items-center justify-between border-b border-primary/20 bg-primary/[0.09] px-6 py-3 md:px-8">
                                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-primary">
                                  {t.servicesPage.packageCard.recommended}
                                </span>
                                <span className="text-[9px] uppercase tracking-[0.15em] text-primary/70">
                                  + {featureCount} {t.servicesPage.packageCard.steps}
                                </span>
                              </div>
                            )}
                            <div className="flex-1 p-6 md:p-8">
                              <div className="mb-7 flex justify-between gap-4">
                                <div className="min-w-0">
                                  <span className={`mb-3 inline-flex items-center gap-2 px-2.5 py-1 text-[9px] uppercase tracking-widest ${
                                    isPremium ? 'bg-primary text-background' : 'bg-white/5 text-foreground/60'
                                  }`}>
                                    {t.servicesPage.levels[service.level]}
                                  </span>
                                  <h3 className="text-xl font-semibold uppercase tracking-[-0.025em] text-foreground sm:text-2xl">
                                    {getLocalizedField(service, 'name') as string}
                                  </h3>
                                  {selectedSizeLabel && (
                                    <span className="mt-2 block text-[9px] uppercase tracking-[0.14em] text-foreground/45">
                                      {t.servicesPage.packageCard.forVehicle} {selectedSizeLabel}
                                    </span>
                                  )}
                                </div>
                                <div className="shrink-0 text-right">
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
                              
                              <p className="mb-6 text-sm font-light leading-relaxed text-foreground/55">
                                {getLocalizedField(service, 'description') as string}
                              </p>

                              <div className="mb-6 grid grid-cols-2 divide-x divide-white/10 border-y border-white/10 bg-black/20">
                                <div className="px-3 py-3">
                                  <span className="block text-[9px] uppercase tracking-[0.14em] text-foreground/40">
                                    {t.servicesPage.packageCard.included}
                                  </span>
                                  <span className="mt-1 block text-sm font-medium text-foreground">{featureCount}</span>
                                </div>
                                <div className="px-3 py-3">
                                  <span className="block text-[9px] uppercase tracking-[0.14em] text-foreground/40">
                                    {t.servicesPage.packageCard.priceLabel}
                                  </span>
                                  <span className="mt-1 block text-sm font-medium text-primary">{price} {t.servicesPage.price}</span>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => togglePackageDetails(service.id)}
                                aria-expanded={isExpanded}
                                className="flex w-full items-center justify-between py-1 text-left text-[10px] font-semibold uppercase tracking-[0.13em] text-foreground/65 transition-colors hover:text-primary"
                              >
                                {isExpanded ? t.servicesPage.packageCard.hideDetails : t.servicesPage.packageCard.showDetails}
                                <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180 text-primary' : ''}`} />
                              </button>

                              <AnimatePresence initial={false}>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.28 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="space-y-6 pb-1 pt-6">
                                      {intFeatures.length > 0 && (
                                        <div>
                                          <h4 className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-foreground/40">
                                            <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                                            {t.servicesPage.features.interior}
                                          </h4>
                                          <ul className="space-y-2.5">
                                            {intFeatures.map((feature) => (
                                              <li key={feature} className="flex items-start gap-3 text-xs text-foreground/70">
                                                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                                                <span className="leading-snug">{feature}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                      {extFeatures.length > 0 && (
                                        <div>
                                          <h4 className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-foreground/40">
                                            <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                                            {t.servicesPage.features.exterior}
                                          </h4>
                                          <ul className="space-y-2.5">
                                            {extFeatures.map((feature) => (
                                              <li key={feature} className="flex items-start gap-3 text-xs text-foreground/70">
                                                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                                                <span className="leading-snug">{feature}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                            
                            <button
                              onClick={() => handleRequest(service.id)}
                              className={`group flex w-full items-center justify-center gap-2 py-4 text-xs font-bold uppercase tracking-[0.15em] transition-colors md:py-5 ${
                                isPremium
                                  ? 'bg-primary text-background hover:bg-[#ebcc7b]'
                                  : 'bg-primary/10 text-primary hover:bg-primary hover:text-background'
                              }`}
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
