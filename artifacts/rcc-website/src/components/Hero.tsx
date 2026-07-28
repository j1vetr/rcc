import React, { useEffect, useRef } from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { motion, useScroll, useTransform } from 'framer-motion';

export function Hero() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const scrollToQuote = () => {
    document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={ref} className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
      {/* YouTube Video Background */}
      <div className="absolute inset-0 z-0">
        <iframe
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          src="https://www.youtube.com/embed/RQ1YwgMtaGo?start=280&autoplay=1&mute=1&loop=1&playlist=RQ1YwgMtaGo&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3"
          title="RCC Mobile Autopflege"
          allow="autoplay; encrypted-media"
          allowFullScreen
          style={{ 
            width: '100vw', 
            height: '100vh',
            objectFit: 'cover',
            transform: 'scale(1.1)' // Slight zoom to hide edges
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/70 to-background" />
      </div>

      <motion.div 
        className="container relative z-10 mx-auto px-6 text-center flex flex-col items-center justify-center pt-24 pb-12"
        style={{ opacity }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-16 h-px gold-divider mb-6"
        />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-5xl lg:text-6xl font-serif font-light text-foreground max-w-4xl leading-tight mb-6"
        >
          {t.hero.headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          className="text-base md:text-lg text-foreground/60 max-w-2xl mx-auto mb-10 font-light leading-relaxed"
        >
          {t.hero.subheadline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            data-testid="button-quote-hero"
            onClick={scrollToQuote}
            className="btn-gold-luxury px-10 py-4 text-sm md:text-base font-medium uppercase tracking-[0.25em] text-background"
          >
            {t.hero.cta}
          </button>
        </motion.div>

        {/* Elegant scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div 
            className="flex flex-col items-center gap-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-primary to-transparent" />
            <div className="w-5 h-8 border border-primary/40 rounded-full flex items-start justify-center p-1.5">
              <motion.div 
                className="w-0.5 h-1.5 bg-primary rounded-full"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
