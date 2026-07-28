import React from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { motion } from 'framer-motion';

export function Testimonials() {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-background relative section-border">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-foreground mb-4">
            {t.testimonials.title}
          </h2>
          <div className="w-20 h-px gold-divider mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {t.testimonials.quotes.map((quote, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card p-8 border border-border relative hover:border-primary/30 transition-all duration-500 group"
            >
              {/* Quote mark */}
              <div className="absolute text-[80px] leading-none text-primary/8 font-serif top-4 left-4">"</div>
              
              {/* Star rating */}
              <div className="mb-5 flex gap-1 relative z-10">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-3.5 h-3.5 text-primary fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              
              <p className="text-foreground/70 font-serif italic text-base leading-relaxed mb-8 relative z-10 font-light">
                {quote.text}
              </p>
              
              <div className="w-10 h-px bg-primary/30 mb-5 group-hover:w-full transition-all duration-700" />
              
              <div className="relative z-10">
                <div className="font-serif text-foreground text-base mb-1">{quote.name}</div>
                <div className="text-primary text-xs font-light tracking-widest uppercase">{quote.canton}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
