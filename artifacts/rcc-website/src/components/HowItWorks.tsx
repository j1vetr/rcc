import React from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { motion } from 'framer-motion';

export function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-background relative section-border overflow-hidden">
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
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold uppercase leading-[0.98] tracking-[-0.04em] max-w-lg">
              {t.howItWorks.title}
            </h2>
            <p className="mt-6 text-sm sm:text-base text-foreground/55 max-w-md leading-relaxed">{t.howItWorks.intro}</p>
            <div className="mt-8 flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-foreground/35">
              <span>01</span><span className="h-px flex-1 max-w-32 bg-primary/35" /><span>03</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-[23px] sm:left-[31px] top-8 bottom-8 w-px bg-gradient-to-b from-primary via-primary/35 to-transparent" />
            {t.howItWorks.steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: 25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: index * 0.12 }}
                className="group relative grid grid-cols-[48px_1fr] sm:grid-cols-[64px_1fr] gap-4 sm:gap-6 pb-9 last:pb-0"
              >
                <div className="relative z-10 w-12 h-12 sm:w-16 sm:h-16 bg-background border border-primary/40 flex items-center justify-center group-hover:bg-primary transition-colors duration-500">
                  <span className="text-sm sm:text-base text-primary group-hover:text-background font-semibold">0{index + 1}</span>
                </div>
                <div className="border-t border-white/10 pt-4 sm:pt-5 group-hover:border-primary/45 transition-colors">
                  <h3 className="text-lg sm:text-xl font-semibold uppercase tracking-[-0.02em] text-foreground mb-2">{step.title}</h3>
                  <p className="text-foreground/50 leading-relaxed max-w-md font-light text-sm">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
