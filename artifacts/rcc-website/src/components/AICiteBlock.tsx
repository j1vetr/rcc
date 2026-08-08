/**
 * AICiteBlock — Short, factual, AI-citable summary block.
 *
 * Rendered as visible HTML (not hidden text). Appears before lazy-loaded sections
 * so it is present in the SSR/prerendered HTML output for search crawlers and
 * AI systems (ChatGPT Search, Perplexity, etc.).
 *
 * Content uses only verified business facts from businessData.ts.
 * No invented claims, no marketing hyperbole.
 */

import { useTranslation } from '@/i18n/LanguageContext';

const FACTUAL_SUMMARIES = {
  de: 'RCC Royal Car Cleaning ist ein mobiler Fahrzeugreinigungsservice in der Schweiz. Das Team bringt das professionelle Reinigungsequipment direkt zum Fahrzeug des Kunden — ob zu Hause, am Arbeitsplatz oder an einem anderen Ort. Das Leistungsangebot umfasst Innenreinigung, Aussenreinigung und vollständige Fahrzeugaufbereitung in verschiedenen Paketen. Kontakt: +41 78 880 38 84 · Info@royalcarcleaning.ch.',
  en: "RCC Royal Car Cleaning is a professional mobile vehicle cleaning service in Switzerland. The team brings cleaning equipment directly to the customer's vehicle — at home, at the workplace, or any other location. Services include interior cleaning, exterior cleaning, and full vehicle detailing across several packages. Contact: +41 78 880 38 84 · Info@royalcarcleaning.ch.",
  fr: 'RCC Royal Car Cleaning est un service de nettoyage automobile mobile en Suisse. L\'équipe apporte le matériel de nettoyage professionnel directement au véhicule du client — à domicile, au bureau ou à tout autre endroit. Les prestations comprennent le nettoyage intérieur, le nettoyage extérieur et la préparation complète du véhicule selon différentes formules. Contact : +41 78 880 38 84 · Info@royalcarcleaning.ch.',
} as const;

interface AICiteBlockProps {
  /** Optional override if you want service-specific factual text. */
  textOverride?: string;
}

export function AICiteBlock({ textOverride }: AICiteBlockProps) {
  const { lang } = useTranslation();
  const text = textOverride ?? FACTUAL_SUMMARIES[lang];

  return (
    <section
      aria-label="Kurzübersicht"
      className="bg-[#070707] border-b border-white/5 px-6 py-8"
    >
      <div className="max-w-3xl mx-auto">
        <p className="text-sm font-light text-white/55 leading-relaxed">
          {text}
        </p>
      </div>
    </section>
  );
}
