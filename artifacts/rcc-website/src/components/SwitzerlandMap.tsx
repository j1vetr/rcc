import React, { useState } from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { motion } from 'framer-motion';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import topoData from '@/data/swiss-cantons.json';

// react-simple-maps only reads the first object of a topology,
// so convert the cantons object to a FeatureCollection explicitly
const topology = topoData as unknown as Topology<{ cantons: GeometryCollection }>;
const cantonFeatures = feature(topology, topology.objects.cantons);

// Mapping BFS canton numbers to canton codes
const CANTON_MAP: Record<number, { code: string; name: string }> = {
  1: { code: 'ZH', name: 'Zürich' },
  2: { code: 'BE', name: 'Bern' },
  3: { code: 'LU', name: 'Luzern' },
  4: { code: 'UR', name: 'Uri' },
  5: { code: 'SZ', name: 'Schwyz' },
  6: { code: 'OW', name: 'Obwalden' },
  7: { code: 'NW', name: 'Nidwalden' },
  8: { code: 'GL', name: 'Glarus' },
  9: { code: 'ZG', name: 'Zug' },
  10: { code: 'FR', name: 'Fribourg' },
  11: { code: 'SO', name: 'Solothurn' },
  12: { code: 'BS', name: 'Basel-Stadt' },
  13: { code: 'BL', name: 'Basel-Landschaft' },
  14: { code: 'SH', name: 'Schaffhausen' },
  15: { code: 'AR', name: 'Appenzell Ausserrhoden' },
  16: { code: 'AI', name: 'Appenzell Innerrhoden' },
  17: { code: 'SG', name: 'St. Gallen' },
  18: { code: 'GR', name: 'Graubünden' },
  19: { code: 'AG', name: 'Aargau' },
  20: { code: 'TG', name: 'Thurgau' },
  21: { code: 'TI', name: 'Ticino' },
  22: { code: 'VD', name: 'Vaud' },
  23: { code: 'VS', name: 'Valais' },
  24: { code: 'NE', name: 'Neuchâtel' },
  25: { code: 'GE', name: 'Genève' },
  26: { code: 'JU', name: 'Jura' },
};

export function SwitzerlandMap({ onSelectCanton }: { onSelectCanton: (id: string) => void }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string | null>(null);
  const [hoveredCanton, setHoveredCanton] = useState<number | null>(null);

  const handleSelect = (cantonId: number) => {
    const canton = CANTON_MAP[cantonId];
    if (!canton) return;
    
    setSelected(canton.code);
    onSelectCanton(canton.code);
    
    setTimeout(() => {
      document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' });
    }, 600);
  };

  return (
    <section id="locations" className="py-20 bg-background relative overflow-hidden section-border">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-foreground mb-4">
            {t.map.title}
          </h2>
          <div className="w-20 h-px gold-divider mx-auto mb-5" />
          <p className="text-foreground/60 text-base md:text-lg max-w-xl mx-auto font-light">
            {t.map.subtitle}
          </p>
        </motion.div>

        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative bg-card border border-border p-8 lg:p-12 shadow-2xl">
            {/* Real Switzerland Map using react-simple-maps */}
            <div className="relative" style={{ filter: 'drop-shadow(0 0 30px rgba(201, 165, 83, 0.15))' }}>
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                  center: [8.23, 46.82],
                  scale: 11000,
                }}
                width={800}
                height={500}
                className="w-full h-auto"
              >
                <Geographies geography={cantonFeatures}>
                  {({ geographies }) => {
                    return geographies.map((geo) => {
                      const cantonId = geo.id as number;
                      const canton = CANTON_MAP[cantonId];
                      if (!canton) return null;
                      
                      const isSelected = selected === canton.code;
                      const isHovered = hoveredCanton === cantonId;

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onClick={() => handleSelect(cantonId)}
                          onMouseEnter={() => setHoveredCanton(cantonId)}
                          onMouseLeave={() => setHoveredCanton(null)}
                          data-testid={`button-canton-${canton.code}`}
                          style={{
                            default: {
                              fill: isSelected ? 'hsl(43, 74%, 49%)' : 'hsl(0, 0%, 6%)',
                              stroke: isSelected ? 'hsl(43, 74%, 49%)' : 'hsl(43, 74%, 49%, 0.3)',
                              strokeWidth: isSelected ? 1.2 : 0.5,
                              outline: 'none',
                              transition: 'all 0.3s ease',
                              cursor: 'pointer',
                            },
                            hover: {
                              fill: isSelected ? 'hsl(43, 74%, 49%)' : 'hsl(43, 74%, 49%, 0.15)',
                              stroke: 'hsl(43, 74%, 49%)',
                              strokeWidth: 1,
                              outline: 'none',
                              filter: 'drop-shadow(0 0 8px rgba(201, 165, 83, 0.5))',
                            },
                            pressed: {
                              fill: 'hsl(43, 74%, 49%)',
                              stroke: 'hsl(43, 74%, 49%)',
                              strokeWidth: 1.2,
                              outline: 'none',
                            },
                          }}
                        />
                      );
                    });
                  }}
                </Geographies>
              </ComposableMap>
            </div>
            
            {/* Hover tooltip */}
            {hoveredCanton && CANTON_MAP[hoveredCanton] && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur-sm border border-primary/30 px-5 py-2 text-primary font-light tracking-wide pointer-events-none z-20 text-sm"
              >
                {CANTON_MAP[hoveredCanton].name}
              </motion.div>
            )}
          </div>
          
          {selected && (
            <motion.div 
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="inline-block bg-primary/10 border border-primary/30 px-6 py-3">
                <span className="text-foreground/60 text-xs uppercase tracking-widest mr-2">{t.map.selected}</span>
                <span className="text-primary font-light text-base tracking-wide">
                  {Object.values(CANTON_MAP).find(c => c.code === selected)?.name}
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Canton list as elegant fallback/reference */}
        <motion.div 
          className="mt-12 max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-13 gap-2 text-center">
            {Object.values(CANTON_MAP).map((canton) => (
              <button
                key={canton.code}
                onClick={() => {
                  const cantonId = Object.entries(CANTON_MAP).find(([_, c]) => c.code === canton.code)?.[0];
                  if (cantonId) handleSelect(Number(cantonId));
                }}
                className={`py-2 px-1 text-xs font-light tracking-wider transition-all duration-300 border ${
                  selected === canton.code 
                    ? 'bg-primary/10 border-primary text-primary' 
                    : 'border-border/30 text-foreground/40 hover:text-primary hover:border-primary/30'
                }`}
              >
                {canton.code}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
