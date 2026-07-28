import React from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { motion } from 'framer-motion';
import { MapPin, CalendarCheck, Sparkles } from 'lucide-react';

export function HowItWorks() {
  const { t } = useTranslation();
  
  const icons = [MapPin, CalendarCheck, Sparkles];

  return (
    <section id="how-it-works" className="py-20 bg-background relative section-border">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-foreground mb-4">
            {t.howItWorks.title}
          </h2>
          <div className="w-20 h-px gold-divider mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 max-w-5xl mx-auto">
          {t.howItWorks.steps.map((step, index) => {
            const Icon = icons[index];
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="flex flex-col items-center text-center group relative"
              >
                {/* Connection line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-full h-px bg-gradient-to-r from-primary/30 to-transparent z-0" />
                )}
                
                {/* Step number badge */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-primary/10 blur-lg rounded-full" />
                  <div className="relative w-20 h-20 rounded-full border border-primary/40 flex items-center justify-center bg-card group-hover:border-primary transition-all duration-500">
                    <Icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-background font-serif text-xs">
                    {index + 1}
                  </div>
                </div>
                
                <h3 className="text-lg md:text-xl font-serif font-light text-foreground mb-3 tracking-tight">
                  {step.title}
                </h3>
                
                <div className="w-12 h-px bg-primary/30 mb-3" />
                
                <p className="text-foreground/50 leading-relaxed max-w-xs font-light text-sm">
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
