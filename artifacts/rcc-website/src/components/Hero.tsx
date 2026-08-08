import React, { useRef } from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { BUSINESS } from '@/seo/businessData';

export function Hero() {
  const { t, lang, getLangRoute } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.07]);

  const scrollToQuote = () => {
    document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' });
  };

  const whatsappUrl = `${BUSINESS.whatsapp.url}?text=${encodeURIComponent(BUSINESS.whatsapp.messages[lang])}`;

  return (
    <section ref={ref} className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-black">
      <motion.div className="absolute inset-0 hero-video-stage" style={{ scale: videoScale }} aria-hidden="true">
        <iframe
          className="hero-video hero-video-desktop pointer-events-none"
          src="https://www.youtube-nocookie.com/embed/RQ1YwgMtaGo?start=280&autoplay=1&mute=1&loop=1&playlist=RQ1YwgMtaGo&controls=0&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&fs=0&playsinline=1"
          title="RCC Mobile Autopflege desktop video"
          allow="autoplay; encrypted-media"
          tabIndex={-1}
        />
        <iframe
          className="hero-video hero-video-mobile pointer-events-none"
          src="https://www.youtube-nocookie.com/embed/uG1G1HuXKOw?autoplay=1&mute=1&loop=1&playlist=uG1G1HuXKOw&controls=0&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&fs=0&playsinline=1"
          title="RCC Mobile Autopflege mobile video"
          allow="autoplay; encrypted-media"
          tabIndex={-1}
        />
        <div className="youtube-chrome-mask youtube-chrome-mask-top" />
        <div className="youtube-chrome-mask youtube-chrome-mask-bottom" />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,4,4,.2)_0%,rgba(4,4,4,.08)_32%,rgba(4,4,4,.82)_100%)] md:bg-[linear-gradient(90deg,rgba(4,4,4,.74)_0%,rgba(4,4,4,.18)_58%,rgba(4,4,4,.38)_100%)]" />
      </motion.div>

      <motion.div
        className="container relative z-10 mx-auto flex min-h-[100svh] items-center justify-center px-5 py-20 sm:px-6 md:justify-start md:py-28 lg:px-12"
        style={{ opacity }}
      >
        <div className="mx-auto max-w-3xl text-center md:mx-0 md:max-w-2xl md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-5 flex items-center justify-center gap-3 md:justify-start"
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
            className="mx-auto mb-7 max-w-xl text-sm font-light leading-relaxed text-foreground/75 sm:text-base md:mx-0 md:text-lg"
          >
            {t.hero.subheadline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="flex w-full flex-col justify-center gap-3 sm:flex-row md:w-auto md:justify-start"
          >
            <a
              data-testid="button-quote-hero"
              href="#quote"
              onClick={(e) => {
                e.preventDefault();
                scrollToQuote();
              }}
              className="btn-gold-luxury inline-flex items-center justify-center min-h-12 px-6 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-background"
            >
              {t.hero.cta}
            </a>
            <a
              data-testid="button-whatsapp-hero"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-12 px-6 py-3.5 border border-white/25 bg-black/45 backdrop-blur-md text-xs sm:text-sm font-semibold uppercase tracking-[0.13em] text-white gap-2.5 hover:bg-[#25D366] hover:border-[#25D366] hover:text-black transition-all"
            >
              <FaWhatsapp className="w-5 h-5 shrink-0" aria-hidden="true" />
              {t.hero.whatsapp}
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
