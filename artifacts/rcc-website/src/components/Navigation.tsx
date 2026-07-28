import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import logo from '@assets/rcc_white_1785267163228.png';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navigation() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileOpen(false);
    }
  };

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={mobile ? "flex flex-col gap-6" : "flex items-center gap-10"}>
      <button 
        data-testid="link-how-it-works" 
        onClick={() => scrollTo('how-it-works')} 
        className="text-sm font-light tracking-wide text-foreground/70 hover:text-primary transition-colors duration-300 uppercase"
      >
        {t.nav.howItWorks}
      </button>
      <button 
        data-testid="link-locations" 
        onClick={() => scrollTo('locations')} 
        className="text-sm font-light tracking-wide text-foreground/70 hover:text-primary transition-colors duration-300 uppercase"
      >
        {t.nav.locations}
      </button>
      <button 
        data-testid="link-services" 
        onClick={() => scrollTo('services')} 
        className="text-sm font-light tracking-wide text-foreground/70 hover:text-primary transition-colors duration-300 uppercase"
      >
        {t.nav.services}
      </button>
      <button 
        data-testid="button-quote-nav"
        onClick={() => scrollTo('quote')} 
        className="btn-gold-luxury text-sm font-medium px-8 py-3 text-background uppercase tracking-widest"
      >
        {t.nav.quote}
      </button>
    </div>
  );

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass-nav py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
        <motion.div 
          className="cursor-pointer" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <img 
            src={logo} 
            alt="RCC Mobile Autopflege" 
            className={`w-auto transition-all duration-500 ${scrolled ? 'h-14' : 'h-16 md:h-20'}`} 
          />
        </motion.div>
        
        <div className="hidden lg:flex items-center gap-8">
          <NavLinks />
          <div className="w-px h-8 bg-foreground/10" />
          <LanguageSwitcher />
        </div>

        <div className="lg:hidden flex items-center gap-4">
          <LanguageSwitcher />
          <button 
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-foreground p-2 hover:text-primary transition-colors"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden glass-nav border-t border-foreground/10 mt-4"
          >
            <div className="container mx-auto px-6 py-8">
              <NavLinks mobile />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
