import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useLocation } from 'wouter';
import { translations } from './translations';

export type Language = 'de' | 'fr' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations.de;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('de');
  const [location] = useLocation();

  useEffect(() => {
    const isServices = location.includes('/dienstleistungen');

    const seo = {
      de: {
        locale: 'de-CH',
        title: isServices
          ? 'Pflegeprogramme & Preise | RCC Royal Car Cleaning'
          : 'Mobile Autopflege Zürich | RCC Royal Car Cleaning',
        description: isServices
          ? 'Übersicht unserer exklusiven Autopflege-Pakete. Wählen Sie Ihre Fahrzeuggrösse und finden Sie das passende Programm.'
          : 'Premium mobile Autopflege und Fahrzeugaufbereitung in Zürich. RCC reinigt, pflegt und schützt Ihr Fahrzeug professionell direkt bei Ihnen vor Ort.',
      },
      fr: {
        locale: 'fr-CH',
        title: isServices
          ? 'Programmes de soin & Prix | RCC Royal Car Cleaning'
          : 'Lavage Auto Mobile Zurich | RCC Royal Car Cleaning',
        description: isServices
          ? 'Aperçu de nos forfaits exclusifs d\'entretien automobile. Sélectionnez la taille de votre véhicule pour trouver le programme idéal.'
          : 'Nettoyage et detailing automobile premium à Zurich. RCC entretient et protège votre véhicule professionnellement, directement chez vous.',
      },
      en: {
        locale: 'en-CH',
        title: isServices
          ? 'Care Programs & Pricing | RCC Royal Car Cleaning'
          : 'Mobile Car Detailing Zurich | RCC Royal Car Cleaning',
        description: isServices
          ? 'Overview of our exclusive car care packages. Select your vehicle size and find the perfect detailing program.'
          : 'Premium mobile car cleaning and detailing in Zurich. RCC professionally cleans, details and protects your vehicle at your location.',
      },
    }[lang];

    document.documentElement.lang = seo.locale;
    document.title = seo.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', seo.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', seo.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', seo.description);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', seo.title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', seo.description);
  }, [lang, location]);

  const value = {
    lang,
    setLang,
    t: translations[lang],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
