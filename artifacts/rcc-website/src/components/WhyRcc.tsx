import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageContext';
import imgMobile from '@assets/optimized/why-mobile-studio-pro.webp';
import imgTools from '@assets/optimized/why-tools-pro.webp';
import imgPrivate from '@assets/optimized/why-private-pro.webp';
import imgEco from '@assets/optimized/why-eco-pro.webp';

const images = [imgMobile, imgTools, imgPrivate, imgEco];

export function WhyRcc() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const activePoint = t.why.points[activeIndex];
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 3600);

    return () => window.clearInterval(interval);
  }, [reduceMotion]);

  return (
    <section className="relative overflow-hidden bg-[#070707] py-16 md:py-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="container relative z-10 mx-auto px-5 sm:px-6 lg:px-12">
        <header className="mb-10 grid gap-5 md:mb-14 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <span className="mb-3 block text-[10px] uppercase tracking-[0.3em] text-primary">
              RCC Standard
            </span>
            <h2 className="max-w-3xl text-4xl font-semibold uppercase leading-[0.94] tracking-[-0.045em] text-foreground md:text-5xl">
              {t.why.title}
            </h2>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/35">
            04 qualities / one standard
          </span>
        </header>

        <div className="grid overflow-hidden border border-white/10 bg-black lg:grid-cols-[1.45fr_.55fr]">
          <div
            className="relative h-[min(128vw,540px)] min-h-[420px] overflow-hidden sm:h-[520px] lg:h-auto lg:min-h-[590px]"
            data-testid="why-rcc-cinematic-image"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={images[activeIndex]}
                src={images[activeIndex]}
                alt={`${activePoint.title} bei RCC Mobile Autopflege`}
                width="1400"
                height="1400"
                loading="lazy"
                decoding="async"
                initial={{ opacity: 0, scale: 1.045 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 h-full w-full object-cover"
                data-testid={`why-rcc-image-${activeIndex}`}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-black/15 lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-black/30" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9 lg:p-12">
              <motion.div
                key={activePoint.title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16, duration: 0.45 }}
                className="max-w-xl border-l border-primary pl-5"
              >
                <span className="mb-2 block font-mono text-[9px] uppercase tracking-[0.25em] text-primary">
                  Feature 0{activeIndex + 1}
                </span>
                <h3 className="text-2xl font-semibold uppercase tracking-[-0.025em] text-white sm:text-3xl">
                  {activePoint.title}
                </h3>
                <p className="mt-3 max-w-md text-sm font-light leading-relaxed text-white/68">
                  {activePoint.desc}
                </p>
              </motion.div>
            </div>
          </div>

          <div className="grid grid-cols-2 border-t border-white/10 lg:grid-cols-1 lg:border-l lg:border-t-0">
            {t.why.points.map((point, index) => {
              const isActive = activeIndex === index;
              return (
                <button
                  key={point.title}
                  type="button"
                  data-testid={`button-why-${index}`}
                  onClick={() => setActiveIndex(index)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`group relative min-h-32 border-b border-r border-white/10 p-4 text-left transition-colors last:border-b-0 even:border-r-0 sm:min-h-36 sm:p-6 lg:border-r-0 lg:even:border-r-0 ${
                    isActive ? 'bg-primary text-background' : 'bg-[#0b0b0b] text-foreground hover:bg-white/[0.045]'
                  }`}
                >
                  <div className="flex h-full flex-col justify-between gap-5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-[9px] opacity-55">0{index + 1}</span>
                      <ArrowUpRight className={`h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${isActive ? 'opacity-100' : 'opacity-30'}`} />
                    </div>
                    <span className="text-xs font-semibold uppercase leading-tight tracking-[0.08em] sm:text-sm">
                      {point.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}