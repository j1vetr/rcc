import React from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { FaWhatsapp } from 'react-icons/fa';

const WHATSAPP_URL = 'https://wa.me/';

export function Hero() {
  const { t } = useTranslation();

  const scrollToQuote = () => {
    document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    const url = `${WHATSAPP_URL}?text=${encodeURIComponent(t.hero.whatsappMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <section className="relative min-h-[100svh] overflow-hidden bg-black">
        <div className="absolute inset-0 hero-video-stage" aria-hidden="true">
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
        </div>
      </section>

      <aside className="relative z-10 bg-background border-y border-primary/20">
        <div className="container mx-auto px-5 sm:px-6 lg:px-12 py-4 sm:py-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-center">
            <button
              data-testid="button-quote-hero"
              onClick={scrollToQuote}
              className="btn-gold-luxury min-h-12 px-7 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-background"
            >
              {t.hero.cta}
            </button>
            <button
              data-testid="button-whatsapp-hero"
              onClick={openWhatsApp}
              className="min-h-12 px-7 py-3.5 border border-white/20 bg-card text-xs sm:text-sm font-semibold uppercase tracking-[0.13em] text-white flex items-center justify-center gap-2.5 hover:bg-[#25D366] hover:border-[#25D366] hover:text-black transition-all"
            >
              <FaWhatsapp className="w-5 h-5 shrink-0" aria-hidden="true" />
              {t.hero.whatsapp}
            </button>
        </div>
      </aside>
    </>
  );
}
