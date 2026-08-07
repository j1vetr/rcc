import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mail, MapPin, Menu, Phone, X } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useTranslation } from '@/i18n/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Link, useLocation } from 'wouter';
import logo from '@assets/optimized/rcc-logo.webp';

const WHATSAPP_URL = 'https://wa.me/41788803884';

export function Navigation() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const scrollTo = (id: string) => {
    if (id === 'quote' && location !== '/') {
      setLocation('/#quote');
      setMobileOpen(false);
      return;
    }

    if (location !== '/') {
      setLocation(`/#${id}`);
      setMobileOpen(false);
      return;
    }

    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  const navItems = [
    { id: 'how-it-works', label: t.nav.howItWorks, testId: 'link-how-it-works', path: '/#how-it-works' },
    { id: 'locations', label: t.nav.locations, testId: 'link-locations', path: '/#locations' },
    { id: 'services', label: t.nav.packages, testId: 'link-packages', path: '/dienstleistungen' },
  ];

  return (
    <nav
      aria-label="Hauptnavigation"
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || mobileOpen ? 'glass-nav py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6 lg:px-12">
        <Link
          href="/"
          onClick={() => {
            setMobileOpen(false);
            if (location === '/') window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="relative z-10 block transition-transform hover:scale-[1.04]"
        >
          <img
            src={logo}
            alt="RCC Mobile Autopflege"
            width="900"
            height="360"
            decoding="async"
            className={`w-auto transition-all duration-500 ${scrolled ? 'h-14' : 'h-16 md:h-20'}`}
          />
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          <div className="flex items-center gap-10">
            {navItems.map((item) => (
              item.id === 'services' ? (
                <Link
                  key={item.id}
                  href={item.path}
                  data-testid={item.testId}
                  className="border-b border-primary/50 pb-1 text-sm font-medium uppercase tracking-wide text-primary transition-colors hover:border-primary hover:text-primary"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.id}
                  href={item.path}
                  data-testid={item.testId}
                  onClick={(e) => {
                    if (location === '/') {
                      e.preventDefault();
                      scrollTo(item.id);
                    }
                  }}
                  className="text-sm font-light uppercase tracking-wide text-foreground/70 transition-colors hover:text-primary"
                >
                  {item.label}
                </a>
              )
            ))}
            <button
              data-testid="button-quote-nav"
              onClick={() => scrollTo('quote')}
              className="btn-gold-luxury px-8 py-3 text-sm font-medium uppercase tracking-widest text-background"
            >
              {t.nav.quote}
            </button>
          </div>
          <div className="h-8 w-px bg-foreground/10" />
          <LanguageSwitcher />
        </div>

        <div className="relative z-10 flex items-center gap-3 lg:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            aria-label={mobileOpen ? 'Menü schliessen' : 'Menü öffnen'}
            aria-expanded={mobileOpen}
            data-testid="button-mobile-menu"
            onClick={() => setMobileOpen((open) => !open)}
            className="grid h-10 w-10 place-items-center border border-white/10 text-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[-1] min-h-[100svh] overflow-y-auto bg-[#070707] pt-28 lg:hidden"
          >
            <div className="process-grid absolute inset-0 opacity-[0.035]" />
            <div className="container relative mx-auto flex min-h-[calc(100svh-7rem)] flex-col px-6 pb-8">
              <div className="border-y border-white/10 py-7">
                {navItems.map((item, index) => (
                  item.id === 'services' ? (
                    <Link
                      key={item.id}
                      href={item.path}
                      data-testid={`${item.testId}-mobile`}
                      onClick={() => setMobileOpen(false)}
                      className="group flex w-full items-center justify-between border-b border-white/[0.06] py-5 text-left last:border-0"
                    >
                      <span className="text-xl font-medium uppercase tracking-[-0.02em] text-white transition-colors group-hover:text-primary">
                        {item.label}
                      </span>
                      <span className="font-mono text-[10px] text-primary/60">0{index + 1}</span>
                    </Link>
                  ) : (
                    <a
                      key={item.id}
                      href={item.path}
                      data-testid={`${item.testId}-mobile`}
                      onClick={(e) => {
                        if (location === '/') {
                          e.preventDefault();
                          scrollTo(item.id);
                        } else {
                          setMobileOpen(false);
                        }
                      }}
                      className="group flex w-full items-center justify-between border-b border-white/[0.06] py-5 text-left last:border-0"
                    >
                      <span className="text-xl font-medium uppercase tracking-[-0.02em] text-white transition-colors group-hover:text-primary">
                        {item.label}
                      </span>
                      <span className="font-mono text-[10px] text-primary/60">0{index + 1}</span>
                    </a>
                  )
                ))}
              </div>

              <div className="mt-6 grid gap-3">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="button-whatsapp-mobile-menu"
                  className="flex min-h-14 items-center justify-center gap-3 bg-[#25D366] px-5 text-xs font-semibold uppercase tracking-[0.14em] text-black"
                >
                  <FaWhatsapp className="h-5 w-5" />
                  WhatsApp
                </a>
                <button
                  type="button"
                  data-testid="button-quote-mobile-menu"
                  onClick={() => scrollTo('quote')}
                  className="btn-gold-luxury min-h-14 px-5 text-xs font-semibold uppercase tracking-[0.14em] text-background"
                >
                  {t.nav.quote}
                </button>
              </div>

              <div className="mt-auto grid gap-4 border-t border-white/10 pt-7 text-sm text-white/50">
                <a href="tel:+41788803884" className="flex items-center gap-3 transition-colors hover:text-primary">
                  <Phone className="h-4 w-4 text-primary" />
                  +41 78 880 38 84
                </a>
                <a href="mailto:Info@royalcarcleaning.ch" className="flex items-center gap-3 transition-colors hover:text-primary">
                  <Mail className="h-4 w-4 text-primary" />
                  Info@royalcarcleaning.ch
                </a>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Wechsel%C3%A4cherstrasse%2025%2C%208103%20Z%C3%BCrich"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 transition-colors hover:text-primary"
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  Wechselächerstrasse 25, 8103 Zürich
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}