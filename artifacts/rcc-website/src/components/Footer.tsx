import React from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import logo from '@assets/rcc_white_1785267163228.png';
import { Instagram, Facebook, Mail, Phone } from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#050505] pt-20 pb-10 border-t border-primary/20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <img src={logo} alt="RCC Logo" className="h-16 w-auto mb-6 opacity-90" />
            <p className="text-white/50 max-w-md font-light leading-relaxed">
              {t.hero.subheadline}
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-serif text-lg mb-6 tracking-wide">Contact</h4>
            <ul className="space-y-4 text-white/60 text-sm">
              <li className="flex items-center gap-3 hover:text-primary transition-colors cursor-pointer">
                <Phone className="w-4 h-4" />
                +41 44 000 00 00
              </li>
              <li className="flex items-center gap-3 hover:text-primary transition-colors cursor-pointer">
                <Mail className="w-4 h-4" />
                info@rcc-autopflege.ch
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-serif text-lg mb-6 tracking-wide">Social</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:bg-primary hover:text-black hover:border-primary transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:bg-primary hover:text-black hover:border-primary transition-all">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs tracking-wider">
            {t.footer.copyright}
          </p>
          <p className="text-primary/60 text-xs tracking-wider font-medium">
            {t.footer.coverage}
          </p>
        </div>
      </div>
    </footer>
  );
}
