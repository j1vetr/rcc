import React, { useState } from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { motion } from 'framer-motion';

// Simplified representation of Swiss Cantons (Grid layout approach for the modern watch-precision vibe)
const CANTONS = [
  { id: 'SH', name: 'Schaffhausen', col: 5, row: 1 },
  { id: 'TG', name: 'Thurgau', col: 6, row: 1 },
  { id: 'BS', name: 'Basel-Stadt', col: 3, row: 1 },
  { id: 'BL', name: 'Basel-Landschaft', col: 3, row: 2 },
  { id: 'AG', name: 'Aargau', col: 4, row: 2 },
  { id: 'ZH', name: 'Zürich', col: 5, row: 2 },
  { id: 'AR', name: 'Appenzell Ausserrhoden', col: 7, row: 2 },
  { id: 'AI', name: 'Appenzell Innerrhoden', col: 8, row: 2 },
  { id: 'SG', name: 'St. Gallen', col: 6, row: 2 },
  { id: 'JU', name: 'Jura', col: 2, row: 2 },
  { id: 'SO', name: 'Solothurn', col: 3, row: 3 },
  { id: 'LU', name: 'Luzern', col: 4, row: 3 },
  { id: 'ZG', name: 'Zug', col: 5, row: 3 },
  { id: 'SZ', name: 'Schwyz', col: 6, row: 3 },
  { id: 'GL', name: 'Glarus', col: 7, row: 3 },
  { id: 'NE', name: 'Neuchâtel', col: 2, row: 3 },
  { id: 'BE', name: 'Bern', col: 3, row: 4 },
  { id: 'OW', name: 'Obwalden', col: 4, row: 4 },
  { id: 'NW', name: 'Nidwalden', col: 5, row: 4 },
  { id: 'UR', name: 'Uri', col: 6, row: 4 },
  { id: 'GR', name: 'Graubünden', col: 8, row: 4 },
  { id: 'VD', name: 'Vaud', col: 2, row: 5 },
  { id: 'FR', name: 'Fribourg', col: 3, row: 5 },
  { id: 'GE', name: 'Genève', col: 1, row: 6 },
  { id: 'VS', name: 'Valais', col: 4, row: 6 },
  { id: 'TI', name: 'Ticino', col: 6, row: 6 },
];

export function CantonMap({ onSelectCanton }: { onSelectCanton: (id: string) => void }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelected(id);
    onSelectCanton(id);
    
    // Slight delay to show selection before scrolling
    setTimeout(() => {
      document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  };

  return (
    <section id="locations" className="py-24 bg-[#111] border-b border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">{t.map.title}</h2>
          <p className="text-white/60 mb-6">{t.map.subtitle}</p>
          <div className="w-16 h-1 bg-primary mx-auto" />
        </div>

        <div className="max-w-4xl mx-auto bg-[#1A1A1A] border border-white/5 p-8 shadow-2xl relative">
          {/* Abstract Grid representation of Switzerland */}
          <div className="relative w-full aspect-[4/3] md:aspect-[2/1]">
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-1 sm:gap-2 p-2 sm:p-4">
              {CANTONS.map((canton) => {
                const isSelected = selected === canton.id;
                return (
                  <motion.button
                    key={canton.id}
                    data-testid={`button-canton-${canton.id}`}
                    onClick={() => handleSelect(canton.id)}
                    style={{
                      gridColumnStart: canton.col,
                      gridRowStart: canton.row,
                    }}
                    className={`
                      relative group flex flex-col items-center justify-center border transition-all duration-300
                      ${isSelected 
                        ? 'bg-primary border-primary text-black z-10 scale-110 shadow-[0_0_20px_rgba(201,168,76,0.4)]' 
                        : 'bg-[#141414] border-white/10 text-white/50 hover:bg-primary/20 hover:border-primary hover:text-primary hover:z-10'
                      }
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="font-bold text-xs sm:text-sm lg:text-base tracking-wider">{canton.id}</span>
                    <div className="absolute opacity-0 group-hover:opacity-100 bg-[#0A0A0A] text-white text-xs py-1 px-2 -top-8 whitespace-nowrap pointer-events-none transition-opacity border border-white/10 z-20">
                      {canton.name}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
          
          {selected && (
            <div className="mt-8 text-center text-primary font-medium animate-in fade-in slide-in-from-bottom-4">
              {t.map.selected} {CANTONS.find(c => c.id === selected)?.name}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
