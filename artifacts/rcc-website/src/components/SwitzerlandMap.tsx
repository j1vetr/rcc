import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, MousePointer2 } from 'lucide-react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
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

const CANTON_LABELS: Array<{ code: string; coordinates: [number, number]; offset?: [number, number] }> = [
  { code: 'ZH', coordinates: [8.65, 47.38] },
  { code: 'BE', coordinates: [7.62, 46.82] },
  { code: 'LU', coordinates: [8.12, 47.08] },
  { code: 'UR', coordinates: [8.63, 46.78] },
  { code: 'SZ', coordinates: [8.73, 47.06] },
  { code: 'OW', coordinates: [8.22, 46.86], offset: [-5, 5] },
  { code: 'NW', coordinates: [8.42, 46.96], offset: [5, -3] },
  { code: 'GL', coordinates: [9.05, 47.03] },
  { code: 'ZG', coordinates: [8.53, 47.16], offset: [0, -4] },
  { code: 'FR', coordinates: [7.08, 46.72] },
  { code: 'SO', coordinates: [7.62, 47.3] },
  { code: 'BS', coordinates: [7.59, 47.56], offset: [-7, -4] },
  { code: 'BL', coordinates: [7.73, 47.45], offset: [6, 3] },
  { code: 'SH', coordinates: [8.62, 47.7] },
  { code: 'AR', coordinates: [9.32, 47.37], offset: [5, -5] },
  { code: 'AI', coordinates: [9.42, 47.31], offset: [8, 5] },
  { code: 'SG', coordinates: [9.25, 47.23] },
  { code: 'GR', coordinates: [9.55, 46.65] },
  { code: 'AG', coordinates: [8.17, 47.42] },
  { code: 'TG', coordinates: [9.08, 47.57] },
  { code: 'TI', coordinates: [8.78, 46.28] },
  { code: 'VD', coordinates: [6.63, 46.62] },
  { code: 'VS', coordinates: [7.62, 46.23] },
  { code: 'NE', coordinates: [6.82, 47.02] },
  { code: 'GE', coordinates: [6.15, 46.21], offset: [8, 3] },
  { code: 'JU', coordinates: [7.16, 47.35] },
];

const GLOW_SEQUENCE = [1, 18, 10, 25, 8, 20, 3, 14, 23, 6, 17, 2, 21, 12, 26, 9, 4, 19, 15, 7, 24, 11, 5, 22, 16, 13];

export function SwitzerlandMap({ onSelectCanton }: { onSelectCanton: (id: string) => void }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string | null>(null);
  const [hoveredCanton, setHoveredCanton] = useState<number | null>(null);
  const [glowingCanton, setGlowingCanton] = useState<number>(GLOW_SEQUENCE[0]);
  const glowIndex = useRef(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    const interval = window.setInterval(() => {
      glowIndex.current = (glowIndex.current + 1) % GLOW_SEQUENCE.length;
      setGlowingCanton(GLOW_SEQUENCE[glowIndex.current]);
    }, 620);

    return () => window.clearInterval(interval);
  }, [reduceMotion]);

  const handleSelect = (cantonId: number) => {
    const canton = CANTON_MAP[cantonId];
    if (!canton) return;
    
    setSelected(canton.code);
    onSelectCanton(canton.code);
  };

  const selectByCode = (code: string) => {
    const entry = Object.entries(CANTON_MAP).find(([, canton]) => canton.code === code);
    if (entry) handleSelect(Number(entry[0]));
  };

  const confirmSelection = () => {
    document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="locations" className="py-16 md:py-20 bg-background relative overflow-hidden section-border">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      
      <div className="container mx-auto px-5 sm:px-6 lg:px-12 relative z-10">
        <motion.div 
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-[2.65rem] font-serif font-light text-foreground mb-4">
            {t.map.title}
          </h2>
          <div className="w-20 h-px gold-divider mx-auto mb-5" />
          <p className="text-foreground/60 text-base md:text-lg max-w-xl mx-auto font-light">
            {t.map.subtitle}
          </p>
          <div className="mt-5 inline-flex items-center gap-2 border border-primary/25 bg-primary/[0.06] px-4 py-2 text-[10px] sm:text-xs uppercase tracking-[0.16em] text-primary">
            <MousePointer2 className="w-3.5 h-3.5" aria-hidden="true" />
            {t.map.instruction}
          </div>
        </motion.div>

        <motion.div 
          className="max-w-[52rem] mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
           <div className="relative bg-card border border-border p-1 sm:p-6 lg:p-10 shadow-2xl overflow-hidden">
            {/* Real Switzerland Map using react-simple-maps */}
            <div className="relative w-full" style={{ filter: 'drop-shadow(0 0 30px rgba(201, 165, 83, 0.15))' }}>
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                  center: [8.05, 46.84],
                  scale: 9300,
                }}
                width={800}
                height={500}
              className="block w-full h-auto overflow-visible"
              >
                <Geographies geography={cantonFeatures}>
                  {({ geographies }) => {
                    return geographies.map((geo) => {
                      const cantonId = geo.id as number;
                      const canton = CANTON_MAP[cantonId];
                      if (!canton) return null;
                      
                      const isSelected = selected === canton.code;
                      const isHovered = hoveredCanton === cantonId;
                      const isGlowing = glowingCanton === cantonId && !isSelected;

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onClick={() => handleSelect(cantonId)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              handleSelect(cantonId);
                            }
                          }}
                          onMouseEnter={() => setHoveredCanton(cantonId)}
                          onMouseLeave={() => setHoveredCanton(null)}
                          tabIndex={0}
                          role="button"
                          aria-label={`${canton.name} ${t.map.selectAction}`}
                          aria-pressed={isSelected}
                          data-testid={`button-canton-${canton.code}`}
                          style={{
                            default: {
                              fill: isSelected ? 'hsl(43, 74%, 49%)' : isGlowing ? 'hsla(43, 74%, 49%, 0.3)' : 'hsl(0, 0%, 6%)',
                              stroke: isSelected || isGlowing ? 'hsl(43, 74%, 49%)' : 'hsl(43, 74%, 49%, 0.3)',
                              strokeWidth: isSelected ? 1.2 : isGlowing ? 1 : 0.5,
                              outline: 'none',
                              transition: 'fill 0.45s ease, stroke 0.45s ease, filter 0.45s ease',
                              cursor: 'pointer',
                              filter: isGlowing ? 'drop-shadow(0 0 7px rgba(201, 165, 83, 0.7))' : 'none',
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
                {CANTON_LABELS.map((canton) => (
                  <Marker
                    key={canton.code}
                    coordinates={canton.coordinates}
                    onClick={() => selectByCode(canton.code)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        selectByCode(canton.code);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`${CANTON_MAP[Number(Object.keys(CANTON_MAP).find((key) => CANTON_MAP[Number(key)].code === canton.code))]?.name ?? canton.code} ${t.map.selectAction}`}
                    className="cursor-pointer focus:outline-none"
                  >
                    <text
                      textAnchor="middle"
                      dx={canton.offset?.[0] ?? 0}
                      dy={canton.offset?.[1] ?? 0}
                      className="map-canton-label"
                    >
                      {canton.code}
                    </text>
                  </Marker>
                ))}
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
          
          <AnimatePresence mode="wait">
            {selected && (
              <motion.div
                key={selected}
                className="mt-4 sm:mt-6"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-primary/[0.07] border border-primary/35 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 shrink-0 bg-primary text-background flex items-center justify-center">
                      <Check className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] uppercase tracking-[0.18em] text-foreground/45 mb-1">{t.map.selected}</span>
                      <span className="block text-base sm:text-lg font-semibold text-primary truncate">
                        {Object.values(CANTON_MAP).find(c => c.code === selected)?.name}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    data-testid="button-confirm-canton"
                    onClick={confirmSelection}
                    className="btn-gold-luxury min-h-11 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-background shrink-0"
                  >
                    {t.map.confirm}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
