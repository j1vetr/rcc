import React from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import logo from '@assets/optimized/rcc-logo.webp';
import { Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';
import { BUSINESS } from '@/seo/businessData';

// Language-specific footer link definitions
const FOOTER_SERVICE_LINKS: Record<string, { label: string; href: string; lang: string[] }[]> = {
  de: [
    { label: 'Mobile Autoreinigung', href: '/de/leistungen/mobile-autoreinigung/', lang: ['de'] },
    { label: 'Innenreinigung', href: '/de/leistungen/innenreinigung/', lang: ['de'] },
    { label: 'Aussenreinigung', href: '/de/leistungen/aussenreinigung/', lang: ['de'] },
    { label: 'Fahrzeugaufbereitung', href: '/de/leistungen/fahrzeugaufbereitung/', lang: ['de'] },
    { label: 'Pakete & Preise', href: '/de/pakete/', lang: ['de'] },
  ],
  en: [
    { label: 'Mobile Car Cleaning', href: '/en/services/mobile-car-cleaning/', lang: ['en'] },
    { label: 'Interior Cleaning', href: '/en/services/interior-cleaning/', lang: ['en'] },
    { label: 'Exterior Cleaning', href: '/en/services/exterior-cleaning/', lang: ['en'] },
    { label: 'Car Detailing', href: '/en/services/car-detailing/', lang: ['en'] },
    { label: 'Packages & Pricing', href: '/en/packages/', lang: ['en'] },
  ],
  fr: [
    { label: 'Nettoyage voiture mobile', href: '/fr/prestations/nettoyage-voiture-mobile/', lang: ['fr'] },
    { label: 'Nettoyage intérieur', href: '/fr/prestations/nettoyage-interieur/', lang: ['fr'] },
    { label: 'Nettoyage extérieur', href: '/fr/prestations/nettoyage-exterieur/', lang: ['fr'] },
    { label: 'Préparation véhicule', href: '/fr/prestations/preparation-vehicule/', lang: ['fr'] },
    { label: 'Forfaits & tarifs', href: '/fr/forfaits/', lang: ['fr'] },
  ],
};

const FOOTER_LOCATION_LINKS: Record<string, { label: string; href: string }[]> = {
  de: [
    { label: 'Zürich', href: '/de/mobile-autoreinigung/zuerich/' },
    { label: 'Einsatzgebiet Schweiz', href: '/de/einsatzgebiet/' },
  ],
  en: [
    { label: 'Zurich', href: '/en/mobile-car-cleaning/zurich/' },
    { label: 'Service Area Switzerland', href: '/en/service-area/' },
  ],
  fr: [
    { label: 'Zurich', href: '/fr/nettoyage-voiture-mobile/zurich/' },
    { label: 'Zones desservies Suisse', href: '/fr/zones-desservies/' },
  ],
};

const FOOTER_COMPANY_LINKS: Record<string, { label: string; href: string }[]> = {
  de: [
    { label: 'Über uns', href: '/de/ueber-uns/' },
    { label: 'Kontakt', href: '/de/kontakt/' },
    { label: 'FAQ', href: '/de/faq/' },
    { label: 'Ratgeber', href: '/de/ratgeber/' },
  ],
  en: [
    { label: 'About', href: '/en/about/' },
    { label: 'Contact', href: '/en/contact/' },
    { label: 'FAQ', href: '/en/faq/' },
    { label: 'Guides', href: '/en/guides/' },
  ],
  fr: [
    { label: 'À propos', href: '/fr/a-propos/' },
    { label: 'Contact', href: '/fr/contact/' },
    { label: 'FAQ', href: '/fr/faq/' },
    { label: 'Guides', href: '/fr/guides/' },
  ],
};

const SERVICES_TITLE: Record<string, string> = {
  de: 'Leistungen',
  en: 'Services',
  fr: 'Services',
};

const LOCATIONS_TITLE: Record<string, string> = {
  de: 'Standorte',
  en: 'Locations',
  fr: 'Zones',
};

const COMPANY_TITLE: Record<string, string> = {
  de: 'Unternehmen',
  en: 'Company',
  fr: 'Entreprise',
};

const CONTACT_TITLE: Record<string, string> = {
  de: 'Kontakt',
  en: 'Contact',
  fr: 'Contact',
};

const LANG_TITLE: Record<string, string> = {
  de: 'Sprache',
  en: 'Language',
  fr: 'Langue',
};

export function Footer() {
  const { t, lang, getLangRoute } = useTranslation();
  const homePath = getLangRoute('home');
  const packagesPath = getLangRoute('packages');

  const serviceLinks = FOOTER_SERVICE_LINKS[lang] ?? FOOTER_SERVICE_LINKS.de;
  const locationLinks = FOOTER_LOCATION_LINKS[lang] ?? FOOTER_LOCATION_LINKS.de;
  const companyLinks = FOOTER_COMPANY_LINKS[lang] ?? FOOTER_COMPANY_LINKS.de;

  return (
    <footer className="bg-background pt-16 pb-10 border-t border-primary/10 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px gold-divider" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          {/* Brand column */}
          <div className="md:col-span-3">
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

          {/* Services column */}
          <div className="md:col-span-2">
            <h4 className="text-foreground/70 font-medium text-xs uppercase tracking-[0.18em] mb-5">
              {SERVICES_TITLE[lang]}
            </h4>
            <ul className="space-y-3 text-foreground/45 text-sm">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-primary transition-colors font-light">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations column */}
          <div className="md:col-span-2">
            <h4 className="text-foreground/70 font-medium text-xs uppercase tracking-[0.18em] mb-5">
              {LOCATIONS_TITLE[lang]}
            </h4>
            <ul className="space-y-3 text-foreground/45 text-sm">
              {locationLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-primary transition-colors font-light">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div className="md:col-span-2">
            <h4 className="text-foreground/70 font-medium text-xs uppercase tracking-[0.18em] mb-5">
              {COMPANY_TITLE[lang]}
            </h4>
            <ul className="space-y-3 text-foreground/45 text-sm">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-primary transition-colors font-light">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div className="md:col-span-2">
            <h4 className="text-foreground/70 font-medium text-xs uppercase tracking-[0.18em] mb-5">
              {CONTACT_TITLE[lang]}
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

          {/* Social + Language column */}
          <div className="md:col-span-1">
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
              {LANG_TITLE[lang]}
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
