import React from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import logo from '@assets/optimized/rcc-logo.webp';
import { Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';
import { BUSINESS } from '@/seo/businessData';

export function Footer() {
  const { t, getLangRoute } = useTranslation();
  const homePath = getLangRoute('home');
  const packagesPath = getLangRoute('packages');

  return (
    <footer className="bg-background pt-16 pb-10 border-t border-primary/10 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px gold-divider" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
          <div className="md:col-span-5">
            <a href={homePath} className="inline-block hover:opacity-80 transition-opacity">
              <img src={logo} alt="RCC Mobile Autopflege Logo" width="900" height="360" loading="lazy" decoding="async" className="h-16 w-auto mb-6 opacity-90" />
            </a>
            <p className="text-foreground/40 max-w-md font-light leading-relaxed text-sm mb-6">
              {t.hero.subheadline}
            </p>
            <a href={packagesPath} className="text-primary hover:text-[#ebcc7b] text-sm uppercase tracking-widest font-medium transition-colors">
              {t.nav.services}
            </a>
          </div>
          
          <div className="md:col-span-4">
            <h4 className="text-foreground font-serif text-lg mb-6 tracking-tight font-light">Contact</h4>
            <ul className="space-y-4 text-foreground/50 text-sm">
              <li>
                <a href={BUSINESS.phone.href} className="flex items-center gap-3 hover:text-primary transition-colors group">
                  <Phone className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                  <span className="font-light">{BUSINESS.phone.display}</span>
                </a>
              </li>
              <li>
                <a href={BUSINESS.email.href} className="flex items-center gap-3 hover:text-primary transition-colors group">
                  <Mail className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                  <span className="font-light break-all">{BUSINESS.email.display}</span>
                </a>
              </li>
              <li>
                <a
                  href={BUSINESS.address.mapsHref}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3 hover:text-primary transition-colors group"
                >
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                  <span className="font-light leading-relaxed">{BUSINESS.address.formatted}</span>
                </a>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-3">
            <h4 className="text-foreground font-serif text-lg mb-6 tracking-tight font-light">Social</h4>
            <div className="flex gap-3">
              <a 
                href={BUSINESS.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram: @royalcarcleaning.ch"
                className="w-10 h-10 border border-border flex items-center justify-center text-foreground/40 hover:bg-primary hover:text-background hover:border-primary transition-all duration-300 group"
              >
                <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              </a>
              <a 
                href={BUSINESS.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok: @royalcarcleaning.ch"
                className="w-10 h-10 border border-border flex items-center justify-center text-foreground/40 hover:bg-primary hover:text-background hover:border-primary transition-all duration-300 group"
              >
                <FaTiktok className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-foreground/5 pt-8 flex items-center justify-center">
          <p className="text-foreground/30 text-[10px] sm:text-xs tracking-[0.02em] sm:tracking-[0.1em] font-light normal-case sm:uppercase text-center">
            {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
