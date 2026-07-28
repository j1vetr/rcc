import React from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import flagDe from '@/assets/flags/de.svg';
import flagFr from '@/assets/flags/fr.svg';
import flagEn from '@/assets/flags/en.svg';

const languages = {
  de: { flag: flagDe, label: 'Deutsch' },
  fr: { flag: flagFr, label: 'Français' },
  en: { flag: flagEn, label: 'English' },
} as const;

export function LanguageSwitcher() {
  const { lang, setLang } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button data-testid="button-language-switcher" variant="ghost" size="sm" className="text-white hover:bg-white/10 hover:text-primary transition-colors border-none focus-visible:ring-0 px-2 gap-2">
          <img src={languages[lang].flag} alt="" width="28" height="18" className="h-[18px] w-7 rounded-[2px] object-cover shadow-sm" />
          <span className="sr-only">{languages[lang].label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-[#1A1A1A] border-border text-white">
        <DropdownMenuItem data-testid="button-lang-de" onClick={() => setLang('de')} className="cursor-pointer hover:bg-primary/20 hover:text-primary focus:bg-primary/20 focus:text-primary">
          <img src={languages.de.flag} alt="" width="24" height="16" className="mr-2 h-4 w-6 rounded-[2px] object-cover" />
          {languages.de.label}
        </DropdownMenuItem>
        <DropdownMenuItem data-testid="button-lang-fr" onClick={() => setLang('fr')} className="cursor-pointer hover:bg-primary/20 hover:text-primary focus:bg-primary/20 focus:text-primary">
          <img src={languages.fr.flag} alt="" width="24" height="16" className="mr-2 h-4 w-6 rounded-[2px] object-cover" />
          {languages.fr.label}
        </DropdownMenuItem>
        <DropdownMenuItem data-testid="button-lang-en" onClick={() => setLang('en')} className="cursor-pointer hover:bg-primary/20 hover:text-primary focus:bg-primary/20 focus:text-primary">
          <img src={languages.en.flag} alt="" width="24" height="16" className="mr-2 h-4 w-6 rounded-[2px] object-cover" />
          {languages.en.label}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
