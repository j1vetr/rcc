import React from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { type Lang, LANG_LABELS } from '@/seo/routes';
import flagDe from '@/assets/flags/de.svg';
import flagFr from '@/assets/flags/fr.svg';
import flagEn from '@/assets/flags/en.svg';

const flags: Record<Lang, string> = { de: flagDe, fr: flagFr, en: flagEn };

/**
 * Language switcher ,  uses real <a> HTML links so search engines can follow them.
 * Navigating to the equivalent page in another language preserves the user's context.
 */
export function LanguageSwitcher() {
  const { lang, switchLangPath } = useTranslation();

  return (
    <div className="flex items-center gap-1">
      {(['de', 'en', 'fr'] as Lang[]).map((l) => {
        const isCurrent = l === lang;
        return (
          <a
            key={l}
            href={switchLangPath(l)}
            aria-label={LANG_LABELS[l]}
            aria-current={isCurrent ? 'true' : undefined}
            data-testid={`button-lang-${l}`}
            className={`inline-flex h-8 w-9 items-center justify-center rounded-[2px] border transition-all duration-200 ${
              isCurrent
                ? 'border-primary/60 bg-primary/10'
                : 'border-transparent bg-transparent hover:bg-white/10'
            }`}
          >
            <img
              src={flags[l]}
              alt={LANG_LABELS[l]}
              width="24"
              height="16"
              className={`h-[16px] w-6 rounded-[2px] object-cover shadow-sm transition-opacity ${
                isCurrent ? 'opacity-100' : 'opacity-60 hover:opacity-100'
              }`}
            />
          </a>
        );
      })}
    </div>
  );
}
