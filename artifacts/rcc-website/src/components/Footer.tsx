import React from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import logo from '@assets/optimized/rcc-logo.webp';
import { Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';
import { BUSINESS } from '@/seo/businessData';

export function Footer() {
  const { t, lang, getLangRoute } = useTranslation();
  const homePath = getLangRoute('home');
  const packagesPath = getLangRoute('packages');

  // German-only SEO section links (de only, Phase 2)
  const isDE = lang === 'de';

  return (
    <footer className="bg-background pt-16 pb-10 border-t border-primary/10 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px gold-divider" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          {/* Brand column */}
          <div className="md:col-span-4">
            <a href={homePath} className="inline-block hover:opacity-80 transition-opacity">
              <img
                src={logo}
                alt="RCC Mobile Autopflege Logo"
                width="900"
                height="360"
                loading="lazy"
                decoding="async"
                className="h-16 w-auto mb-6 opacity-90"
              />
            </a>
            <p className="text-foreground/40 max-w-md font-light leading-relaxed text-sm mb-6">
              {t.hero.subheadline}
            </p>
            <a
              href={packagesPath}
              className="text-primary hover:text-[#ebcc7b] text-sm uppercase tracking-widest font-medium transition-colors"
            >
              {t.nav.packages}
            </a>
          </div>

          {/* Services column — German-only SEO links */}
          {isDE && (
            <div className="md:col-span-2">
              <h4 className="text-foreground/70 font-medium text-xs uppercase tracking-[0.18em] mb-5">
                Leistungen
              </h4>
              <ul className="space-y-3 text-foreground/45 text-sm">
                <li>
                  <a href="/de/leistungen/mobile-autoreinigung/" className="hover:text-primary transition-colors font-light">
                    Mobile Autoreinigung
                  </a>
                </li>
                <li>
                  <a href="/de/leistungen/innenreinigung/" className="hover:text-primary transition-colors font-light">
                    Innenreinigung
                  </a>
                </li>
                <li>
                  <a href="/de/leistungen/aussenreinigung/" className="hover:text-primary transition-colors font-light">
                    Aussenreinigung
                  </a>
                </li>
                <li>
                  <a href="/de/leistungen/fahrzeugaufbereitung/" className="hover:text-primary transition-colors font-light">
                    Fahrzeugaufbereitung
                  </a>
                </li>
                <li>
                  <a href={packagesPath} className="hover:text-primary transition-colors font-light">
                    Pakete & Preise
                  </a>
                </li>
              </ul>
            </div>
          )}

          {/* Regions column — German-only SEO links */}
          {isDE && (
            <div className="md:col-span-2">
              <h4 className="text-foreground/70 font-medium text-xs uppercase tracking-[0.18em] mb-5">
                Standorte
              </h4>
              <ul className="space-y-3 text-foreground/45 text-sm">
                <li>
                  <a href="/de/mobile-autoreinigung/zuerich/" className="hover:text-primary transition-colors font-light">
                    Zürich
                  </a>
                </li>
                <li>
                  <a href="/de/einsatzgebiet/" className="hover:text-primary transition-colors font-light">
                    Einsatzgebiet Schweiz
                  </a>
                </li>
              </ul>
            </div>
          )}

          {/* Contact column */}
          <div className={isDE ? 'md:col-span-2' : 'md:col-span-4'}>
            <h4 className="text-foreground/70 font-medium text-xs uppercase tracking-[0.18em] mb-5">
              Kontakt
            </h4>
            <ul className="space-y-4 text-foreground/50 text-sm">
              <li>
                <a
                  href={BUSINESS.phone.href}
                  className="flex items-center gap-3 hover:text-primary transition-colors group"
                >
                  <Phone className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                  <span className="font-light">{BUSINESS.phone.display}</span>
                </a>
              </li>
              <li>
                <a
                  href={BUSINESS.email.href}
                  className="flex items-center gap-3 hover:text-primary transition-colors group"
                >
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

          {/* Social column */}
          <div className="md:col-span-2">
            <h4 className="text-foreground/70 font-medium text-xs uppercase tracking-[0.18em] mb-5">
              Social
            </h4>
            <div className="flex gap-3 mb-6">
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

            {/* Language links */}
            <h4 className="text-foreground/70 font-medium text-xs uppercase tracking-[0.18em] mb-3">
              Sprache
            </h4>
            <ul className="space-y-2 text-foreground/45 text-sm">
              <li>
                <a href="/de/" className={`hover:text-primary transition-colors font-light ${lang === 'de' ? 'text-primary' : ''}`}>
                  Deutsch
                </a>
              </li>
              <li>
                <a href="/en/" className={`hover:text-primary transition-colors font-light ${lang === 'en' ? 'text-primary' : ''}`}>
                  English
                </a>
              </li>
              <li>
                <a href="/fr/" className={`hover:text-primary transition-colors font-light ${lang === 'fr' ? 'text-primary' : ''}`}>
                  Français
                </a>
              </li>
            </ul>
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
