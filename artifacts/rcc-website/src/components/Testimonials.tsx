import React from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';

export function Testimonials() {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-[#0A0A0A] border-b border-white/5">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">{t.testimonials.title}</h2>
          <div className="w-16 h-1 bg-primary mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.testimonials.quotes.map((quote, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-[#141414] p-10 border border-white/5 relative"
            >
              <Quote className="w-10 h-10 text-primary/20 absolute top-6 right-6" />
              
              <div className="mb-6 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-4 h-4 text-primary fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              
              <p className="text-white/80 font-serif italic text-lg leading-relaxed mb-8">
                "{quote.text}"
              </p>
              
              <div>
                <div className="font-bold text-white tracking-wide">{quote.name}</div>
                <div className="text-primary text-sm">{quote.canton}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
