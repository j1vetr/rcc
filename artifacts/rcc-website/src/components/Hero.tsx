import React from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { motion } from 'framer-motion';
import heroBg from '@assets/generated_images/hero_bg.jpg';
import logo from '@assets/rcc_dark_1785267163225.png';

export function Hero() {
  const { t } = useTranslation();

  const scrollToQuote = () => {
    document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/80 via-[#0A0A0A]/60 to-[#0A0A0A] backdrop-blur-[2px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center flex flex-col items-center justify-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <img src={logo} alt="RCC Logo" className="h-32 md:h-48 w-auto mx-auto drop-shadow-2xl" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-6xl lg:text-7xl font-serif text-white max-w-4xl leading-tight mb-6"
        >
          {t.hero.headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
          className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-12 font-light"
        >
          {t.hero.subheadline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            data-testid="button-quote-hero"
            onClick={scrollToQuote}
            className="btn-gold bg-primary text-primary-foreground px-8 py-4 text-sm md:text-base font-semibold uppercase tracking-widest hover:scale-105 transition-transform"
          >
            {t.hero.cta}
          </button>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-primary/0 via-primary to-primary/0" />
      </motion.div>
    </section>
  );
}
