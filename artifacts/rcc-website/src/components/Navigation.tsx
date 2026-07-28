import React from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import logo from '@assets/rcc_dark_1785267163225.png';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function Navigation() {
  const { t } = useTranslation();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const NavLinks = () => (
    <>
      <button data-testid="link-how-it-works" onClick={() => scrollTo('how-it-works')} className="text-sm font-medium text-white/80 hover:text-primary transition-colors">
        {t.nav.howItWorks}
      </button>
      <button data-testid="link-locations" onClick={() => scrollTo('locations')} className="text-sm font-medium text-white/80 hover:text-primary transition-colors">
        {t.nav.locations}
      </button>
      <button data-testid="link-services" onClick={() => scrollTo('services')} className="text-sm font-medium text-white/80 hover:text-primary transition-colors">
        {t.nav.services}
      </button>
      <button 
        data-testid="button-quote-nav"
        onClick={() => scrollTo('quote')} 
        className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90 transition-all uppercase tracking-wider text-xs"
      >
        {t.nav.quote}
      </button>
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        <div className="cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src={logo} alt="RCC Mobile Autopflege" className="h-10 md:h-12 w-auto" />
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <NavLinks />
          <div className="w-px h-6 bg-white/20" />
          <LanguageSwitcher />
        </div>

        <div className="md:hidden flex items-center gap-4">
          <LanguageSwitcher />
          <Sheet>
            <SheetTrigger asChild>
              <button className="text-white p-2">
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent className="bg-[#0A0A0A] border-l-border p-8 flex flex-col gap-6">
              <NavLinks />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
