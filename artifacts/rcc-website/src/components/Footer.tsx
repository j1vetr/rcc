import React from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import logo from '@assets/optimized/rcc-logo.webp';
import { Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';
import { Link } from 'wouter';

const CONTACT = {
  email: 'Info@royalcarcleaning.ch',
  phone: '+41 78 880 38 84',
  phoneHref: 'tel:+41788803884',
  address: 'Wechselächerstrasse 25, 8103 Zürich',
  mapsHref: 'https://www.google.com/maps/search/?api=1&query=Wechsel%C3%A4cherstrasse%2025%2C%208103%20Z%C3%BCrich',
};

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-background pt-16 pb-10 border-t border-primary/10 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px gold-divider" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
          <div className="md:col-span-5">
            <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
              <img src={logo} alt="RCC Mobile Autopflege Logo" width="900" height="360" loading="lazy" decoding="async" className="h-16 w-auto mb-6 opacity-90" />
            </Link>
            <p className="text-foreground/40 max-w-md font-light leading-relaxed text-sm mb-6">
              {t.hero.subheadline}
            </p>
            <Link href="/dienstleistungen" className="text-primary hover:text-[#ebcc7b] text-sm uppercase tracking-widest font-medium transition-colors">
              {t.nav.services}
            </Link>
          </div>
          
          <div className="md:col-span-4">
            <h4 className="text-foreground font-serif text-lg mb-6 tracking-tight font-light">Contact</h4>
            <ul className="space-y-4 text-foreground/50 text-sm">
              <li>
                <a href={CONTACT.phoneHref} className="flex items-center gap-3 hover:text-primary transition-colors group">
                  <Phone className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                  <span className="font-light">{CONTACT.phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-3 hover:text-primary transition-colors group">
                  <Mail className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                  <span className="font-light break-all">{CONTACT.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.mapsHref}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3 hover:text-primary transition-colors group"
                >
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                  <span className="font-light leading-relaxed">{CONTACT.address}</span>
                </a>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-3">
            <h4 className="text-foreground font-serif text-lg mb-6 tracking-tight font-light">Social</h4>
            <div className="flex gap-3">
              <a 
                href="https://www.instagram.com/royalcarcleaning.ch/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram: @royalcarcleaning.ch"
                className="w-10 h-10 border border-border flex items-center justify-center text-foreground/40 hover:bg-primary hover:text-background hover:border-primary transition-all duration-300 group"
              >
                <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              </a>
              <a 
                href="https://www.tiktok.com/@royalcarcleaning.ch"
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
