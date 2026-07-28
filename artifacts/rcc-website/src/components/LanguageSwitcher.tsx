import React from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const languages = {
  de: { flag: '🇩🇪', label: 'Deutsch' },
  fr: { flag: '🇫🇷', label: 'Français' },
  en: { flag: '🇬🇧', label: 'English' },
} as const;

export function LanguageSwitcher() {
  const { lang, setLang } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button data-testid="button-language-switcher" variant="ghost" size="sm" className="text-white hover:bg-white/10 hover:text-primary transition-colors border-none focus-visible:ring-0 px-2 gap-2">
          <span className="text-xl leading-none" aria-hidden="true">{languages[lang].flag}</span>
          <span className="sr-only">{languages[lang].label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-[#1A1A1A] border-border text-white">
        <DropdownMenuItem data-testid="button-lang-de" onClick={() => setLang('de')} className="cursor-pointer hover:bg-primary/20 hover:text-primary focus:bg-primary/20 focus:text-primary">
          <span className="text-lg mr-2" aria-hidden="true">{languages.de.flag}</span>
          {languages.de.label}
        </DropdownMenuItem>
        <DropdownMenuItem data-testid="button-lang-fr" onClick={() => setLang('fr')} className="cursor-pointer hover:bg-primary/20 hover:text-primary focus:bg-primary/20 focus:text-primary">
          <span className="text-lg mr-2" aria-hidden="true">{languages.fr.flag}</span>
          {languages.fr.label}
        </DropdownMenuItem>
        <DropdownMenuItem data-testid="button-lang-en" onClick={() => setLang('en')} className="cursor-pointer hover:bg-primary/20 hover:text-primary focus:bg-primary/20 focus:text-primary">
          <span className="text-lg mr-2" aria-hidden="true">{languages.en.flag}</span>
          {languages.en.label}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
