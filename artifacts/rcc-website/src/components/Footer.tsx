import React from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import logo from '@assets/rcc_white_1785267163228.png';
import { Instagram, Facebook, Mail, Phone } from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-background pt-16 pb-10 border-t border-primary/10 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px gold-divider" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
          <div className="md:col-span-5">
            <img src={logo} alt="RCC Logo" className="h-16 w-auto mb-6 opacity-90" />
            <p className="text-foreground/40 max-w-md font-light leading-relaxed text-sm">
              {t.hero.subheadline}
            </p>
          </div>
          
          <div className="md:col-span-4">
            <h4 className="text-foreground font-serif text-lg mb-6 tracking-tight font-light">Contact</h4>
            <ul className="space-y-4 text-foreground/50 text-sm">
              <li className="flex items-center gap-3 hover:text-primary transition-colors cursor-pointer group">
                <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                <span className="font-light">+41 44 000 00 00</span>
              </li>
              <li className="flex items-center gap-3 hover:text-primary transition-colors cursor-pointer group">
                <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                <span className="font-light">info@rcc-autopflege.ch</span>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-3">
            <h4 className="text-foreground font-serif text-lg mb-6 tracking-tight font-light">Social</h4>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="w-10 h-10 border border-border flex items-center justify-center text-foreground/40 hover:bg-primary hover:text-background hover:border-primary transition-all duration-300 group"
              >
                <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 border border-border flex items-center justify-center text-foreground/40 hover:bg-primary hover:text-background hover:border-primary transition-all duration-300 group"
              >
                <Facebook className="w-4 h-4 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-foreground/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-foreground/30 text-xs tracking-[0.1em] font-light uppercase">
            {t.footer.copyright}
          </p>
          <p className="text-primary/50 text-xs tracking-[0.1em] font-light uppercase">
            {t.footer.coverage}
          </p>
        </div>
      </div>
    </footer>
  );
}
