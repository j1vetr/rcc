import React from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { motion } from 'framer-motion';
import { MapPin, CalendarCheck, Car } from 'lucide-react';

export function HowItWorks() {
  const { t } = useTranslation();
  
  const icons = [MapPin, CalendarCheck, Car];

  return (
    <section id="how-it-works" className="py-24 bg-[#0A0A0A] relative border-b border-white/5">
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">{t.howItWorks.title}</h2>
          <div className="w-16 h-1 bg-primary mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
          {t.howItWorks.steps.map((step, index) => {
            const Icon = icons[index];
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 rounded-full border border-primary/30 flex items-center justify-center mb-6 relative group-hover:border-primary transition-colors duration-500 bg-[#141414]">
                  <Icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-500" />
                  {/* Connection line for desktop */}
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 left-full w-[calc(100%+3rem)] lg:w-[calc(100%+5rem)] h-[1px] bg-gradient-to-r from-primary/30 to-transparent -translate-y-1/2 z-[-1]" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wide text-sm">{step.title}</h3>
                <p className="text-white/60 leading-relaxed max-w-xs">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
