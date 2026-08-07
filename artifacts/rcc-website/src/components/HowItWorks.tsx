import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { motion, useReducedMotion } from 'framer-motion';

export function HowItWorks() {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const reduceMotion = useReducedMotion();
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll-linked: each step activates when it crosses the reading line
  useEffect(() => {
    if (reduceMotion) return;
    const observers = stepRefs.current.map((el, index) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveStep(index); },
        { threshold: 0.55 },
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((obs) => obs?.disconnect());
  }, [reduceMotion, t.howItWorks.steps.length]);

  return (
    <section id="how-it-works" className="py-16 md:py-20 bg-background relative section-border overflow-hidden">
      <div className="absolute inset-0 opacity-[0.045] process-grid" />
      <div className="container mx-auto px-5 sm:px-6 lg:px-12 relative z-10">
        <motion.div 
          className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-20 items-start"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="lg:sticky lg:top-32">
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-4">{t.howItWorks.eyebrow}</p>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-semibold uppercase leading-[0.98] tracking-[-0.04em] max-w-lg">
              {t.howItWorks.title}
            </h2>
            <p className="mt-6 text-sm sm:text-base text-foreground/55 max-w-md leading-relaxed">{t.howItWorks.intro}</p>
            <div className="mt-8 flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-foreground/35">
              <span>01</span><span className="h-px flex-1 max-w-32 bg-primary/35" /><span>03</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-[23px] sm:left-[31px] top-8 bottom-8 w-px bg-gradient-to-b from-primary via-primary/35 to-transparent" />
            {t.howItWorks.steps.map((step, index) => {
              const isActive = activeStep === index;

              return (
              <motion.div 
                key={index}
                ref={(el) => { stepRefs.current[index] = el; }}
                initial={{ opacity: 0, x: 25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: index * 0.12 }}
                onMouseEnter={() => setActiveStep(index)}
                className="group relative grid grid-cols-[48px_1fr] sm:grid-cols-[64px_1fr] gap-4 sm:gap-6 pb-9 last:pb-0"
                data-testid={`process-step-${index + 1}`}
                data-active={isActive}
              >
                <motion.div
                  animate={{
                    backgroundColor: isActive ? 'hsl(43, 74%, 49%)' : 'hsl(0, 0%, 3%)',
                    borderColor: isActive ? 'hsl(43, 74%, 49%)' : 'hsla(43, 74%, 49%, 0.4)',
                    boxShadow: isActive ? '0 0 28px rgba(201, 165, 83, 0.25)' : '0 0 0 rgba(201, 165, 83, 0)',
                  }}
                  transition={{ duration: 0.45 }}
                  className="relative z-10 w-12 h-12 sm:w-16 sm:h-16 border flex items-center justify-center"
                >
                  <motion.span
                    animate={{ color: isActive ? 'hsl(0, 0%, 3%)' : 'hsl(43, 74%, 49%)' }}
                    className="text-sm sm:text-base font-semibold"
                  >
                    0{index + 1}
                  </motion.span>
                </motion.div>
                <div className={`border-t pt-4 sm:pt-5 transition-colors duration-500 ${isActive ? 'border-primary/70' : 'border-white/10'}`}>
                  <h3 className={`text-lg sm:text-xl font-semibold uppercase tracking-[-0.02em] mb-2 transition-colors duration-500 ${isActive ? 'text-primary' : 'text-foreground'}`}>
                    {step.title}
                  </h3>
                  <p className="text-foreground/50 leading-relaxed max-w-md font-light text-sm">{step.desc}</p>
                </div>
              </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
