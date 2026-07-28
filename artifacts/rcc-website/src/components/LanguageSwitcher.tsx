import React from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { lang, setLang } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button data-testid="button-language-switcher" variant="ghost" size="sm" className="text-white hover:bg-white/10 hover:text-primary transition-colors border-none focus-visible:ring-0 px-2 gap-2">
          <Globe className="w-4 h-4" />
          <span className="uppercase text-xs font-semibold tracking-wider">{lang}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-[#1A1A1A] border-border text-white">
        <DropdownMenuItem data-testid="button-lang-de" onClick={() => setLang('de')} className="cursor-pointer hover:bg-primary/20 hover:text-primary focus:bg-primary/20 focus:text-primary">
          Deutsch
        </DropdownMenuItem>
        <DropdownMenuItem data-testid="button-lang-fr" onClick={() => setLang('fr')} className="cursor-pointer hover:bg-primary/20 hover:text-primary focus:bg-primary/20 focus:text-primary">
          Français
        </DropdownMenuItem>
        <DropdownMenuItem data-testid="button-lang-en" onClick={() => setLang('en')} className="cursor-pointer hover:bg-primary/20 hover:text-primary focus:bg-primary/20 focus:text-primary">
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
