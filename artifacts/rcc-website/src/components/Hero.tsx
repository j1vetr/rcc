import React, { useRef } from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

const WHATSAPP_URL = 'https://wa.me/';

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

  const openWhatsApp = () => {
    const url = `${WHATSAPP_URL}?text=${encodeURIComponent(t.hero.whatsappMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section ref={ref} className="relative min-h-[100svh] flex items-end md:items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0 hero-video-stage" aria-hidden="true">
        <iframe
          className="hero-video hero-video-desktop pointer-events-none"
          src="https://www.youtube.com/embed/RQ1YwgMtaGo?start=280&autoplay=1&mute=1&loop=1&playlist=RQ1YwgMtaGo&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3"
          title="RCC Mobile Autopflege desktop video"
          allow="autoplay; encrypted-media"
        />
        <iframe
          className="hero-video hero-video-mobile pointer-events-none"
          src="https://www.youtube.com/embed/uG1G1HuXKOw?autoplay=1&mute=1&loop=1&playlist=uG1G1HuXKOw&controls=0&modestbranding=1&rel=0&playsinline=1"
          title="RCC Mobile Autopflege mobile video"
          allow="autoplay; encrypted-media"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,4,4,.35)_0%,rgba(4,4,4,.18)_35%,rgba(4,4,4,.88)_100%)] md:bg-[linear-gradient(90deg,rgba(4,4,4,.78)_0%,rgba(4,4,4,.36)_52%,rgba(4,4,4,.5)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      <motion.div 
        className="container relative z-10 mx-auto px-5 sm:px-6 lg:px-12 pb-16 pt-28 md:py-28"
        style={{ opacity }}
      >
        <div className="max-w-3xl md:max-w-2xl text-left">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-3 mb-5"
          >
            <span className="h-px w-10 bg-primary" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.26em] text-primary">{t.hero.eyebrow}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(2.35rem,8.5vw,4.8rem)] font-semibold text-foreground leading-[0.96] mb-5 uppercase tracking-[-0.045em]"
          >
            {t.hero.headline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-sm sm:text-base md:text-lg text-foreground/75 max-w-xl mb-7 font-light leading-relaxed"
          >
            {t.hero.subheadline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
          >
            <button
              data-testid="button-quote-hero"
              onClick={scrollToQuote}
              className="btn-gold-luxury min-h-12 px-6 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-background"
            >
              {t.hero.cta}
            </button>
            <button
              data-testid="button-whatsapp-hero"
              onClick={openWhatsApp}
              className="min-h-12 px-6 py-3.5 border border-white/25 bg-black/35 backdrop-blur-md text-xs sm:text-sm font-semibold uppercase tracking-[0.13em] text-white flex items-center justify-center gap-2.5 hover:bg-[#25D366] hover:border-[#25D366] hover:text-black transition-all"
            >
              <FaWhatsapp className="w-5 h-5 shrink-0" aria-hidden="true" />
              {t.hero.whatsapp}
            </button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
