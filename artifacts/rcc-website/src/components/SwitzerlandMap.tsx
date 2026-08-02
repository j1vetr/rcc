import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { Check, MousePointer2 } from 'lucide-react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { feature } from 'topojson-client';
import { geoMercator } from 'd3-geo';
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
const CANTON_CODES = Object.values(CANTON_MAP).map((canton) => canton.code);

// Single source of truth for the map projection so the HUD overlay SVG
// lines up pixel-perfect with the rendered geography.
const MAP_CONFIG = {
  center: [8.05, 46.84] as [number, number],
  scale: 9300,
  width: 800,
  height: 500,
};

const hudProjection = geoMercator()
  .center(MAP_CONFIG.center)
  .scale(MAP_CONFIG.scale)
  .translate([MAP_CONFIG.width / 2, MAP_CONFIG.height / 2]);

function projectPoint(coordinates: [number, number]): [number, number] {
  const projected = hudProjection(coordinates);
  return projected ? [projected[0], projected[1]] : [400, 250];
}

const CANTON_ANCHORS = CANTON_LABELS.reduce<Record<string, [number, number]>>((acc, canton) => {
  acc[canton.code] = canton.coordinates;
  return acc;
}, {});

// RCC dispatch base: central Switzerland
const DISPATCH_ORIGIN: [number, number] = [8.53, 47.16];

function buildRoute(from: [number, number], to: [number, number]) {
  const [x0, y0] = projectPoint(from);
  const [x2, y2] = projectPoint(to);
  const dx = x2 - x0;
  const dy = y2 - y0;
  const length = Math.hypot(dx, dy);
  const curvature = Math.min(60, length * 0.22);
  const mx = (x0 + x2) / 2;
  const my = (y0 + y2) / 2;
  const nx = length === 0 ? 0 : -dy / length;
  const ny = length === 0 ? 0 : dx / length;
  const cx = mx + nx * curvature;
  const cy = my + ny * curvature;
  return { d: `M ${x0} ${y0} Q ${cx} ${cy} ${x2} ${y2}`, length };
}

function LockOnReticle({ point, reduceMotion }: { point: [number, number]; reduceMotion: boolean }) {
  const [x, y] = point;
  const halfWidth = 36;
  const halfHeight = 30;
  const tick = 11;
  const corners: Array<{ sx: number; sy: number }> = [
    { sx: -1, sy: -1 },
    { sx: 1, sy: -1 },
    { sx: -1, sy: 1 },
    { sx: 1, sy: 1 },
  ];

  return (
    <motion.g
      initial={reduceMotion ? false : { opacity: 0, scale: 1.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformOrigin: `${x}px ${y}px` }}
    >
      <path
        d={`M ${x - 7} ${y} H ${x + 7} M ${x} ${y - 7} V ${y + 7}`}
        stroke="hsl(43, 74%, 49%)"
        strokeWidth="1"
        strokeOpacity="0.9"
      />
      <circle cx={x} cy={y} r="1.8" fill="hsl(43, 74%, 49%)" />
      {corners.map(({ sx, sy }) => (
        <path
          key={`${sx}${sy}`}
          d={`M ${x + sx * halfWidth - sx * tick} ${y + sy * halfHeight} L ${x + sx * halfWidth} ${y + sy * halfHeight} L ${x + sx * halfWidth} ${y + sy * halfHeight - sy * tick}`}
          fill="none"
          stroke="hsl(43, 74%, 49%)"
          strokeWidth="1.6"
          strokeLinecap="square"
        />
      ))}
      <path
        d={`M ${x - halfWidth - 12} ${y} H ${x - halfWidth - 4} M ${x + halfWidth + 4} ${y} H ${x + halfWidth + 12}`}
        stroke="hsl(43, 74%, 49%)"
        strokeOpacity="0.55"
        strokeWidth="1"
      />
    </motion.g>
  );
}

export function SwitzerlandMap({ onSelectCanton }: { onSelectCanton: (id: string) => void }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string>(
    () => CANTON_CODES[Math.floor(Math.random() * CANTON_CODES.length)],
  );
  const [hoveredCanton, setHoveredCanton] = useState<number | null>(null);
  const [glowingCanton, setGlowingCanton] = useState<number>(GLOW_SEQUENCE[0]);
  const glowIndex = useRef(0);
  const initialSelectionDispatched = useRef(false);
  const reduceMotion = useReducedMotion();

  const frameRef = useRef<HTMLDivElement>(null);
  const inView = useInView(frameRef, { once: true, margin: '-18% 0px -18% 0px' });
  const [phase, setPhase] = useState<'idle' | 'scanning' | 'locked'>('idle');

  useEffect(() => {
    if (initialSelectionDispatched.current) return;
    initialSelectionDispatched.current = true;

    const timeout = window.setTimeout(() => onSelectCanton(selected), 0);
    return () => window.clearTimeout(timeout);
  }, [onSelectCanton, selected]);

  useEffect(() => {
    if (reduceMotion) return;

    const interval = window.setInterval(() => {
      glowIndex.current = (glowIndex.current + 1) % GLOW_SEQUENCE.length;
      setGlowingCanton(GLOW_SEQUENCE[glowIndex.current]);
    }, 620);

    return () => window.clearInterval(interval);
  }, [reduceMotion]);

  // Scan sweep once the map scrolls into view, then lock on
  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setPhase('locked');
      return;
    }
    setPhase('scanning');
    const timeout = window.setTimeout(() => setPhase('locked'), 1600);
    return () => window.clearTimeout(timeout);
  }, [inView, reduceMotion]);

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
    onSelectCanton(selected);
    document.getElementById('quote')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  const selectedInfo = Object.values(CANTON_MAP).find((canton) => canton.code === selected);
  const anchorGeo = CANTON_ANCHORS[selected];
  const anchorPoint = anchorGeo ? projectPoint(anchorGeo) : null;
  const originPoint = projectPoint(DISPATCH_ORIGIN);

  const route = useMemo(() => {
    if (!anchorGeo) return null;
    const built = buildRoute(DISPATCH_ORIGIN, anchorGeo);
    // Skip the route when the target sits on the dispatch base itself
    return built.length >= 28 ? built : null;
  }, [anchorGeo]);

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
          className="max-w-[52rem] lg:max-w-6xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
           <div
             ref={frameRef}
             className="relative bg-card border border-border p-1 sm:p-6 lg:p-6 shadow-2xl overflow-hidden"
           >
            {/* Real Switzerland Map using react-simple-maps */}
            <div className="relative w-full" style={{ filter: 'drop-shadow(0 0 30px rgba(201, 165, 83, 0.15))' }}>
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                  center: MAP_CONFIG.center,
                  scale: MAP_CONFIG.scale,
                }}
                width={MAP_CONFIG.width}
                height={MAP_CONFIG.height}
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

              {/* HUD overlay: scan sweep, lock-on reticle, dispatch route */}
              <svg
                viewBox={`0 0 ${MAP_CONFIG.width} ${MAP_CONFIG.height}`}
                className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="mapScanTrail" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(43, 74%, 49%)" stopOpacity="0" />
                    <stop offset="100%" stopColor="hsl(43, 74%, 49%)" stopOpacity="0.28" />
                  </linearGradient>
                </defs>

                {phase === 'scanning' && !reduceMotion && (
                  <g>
                    <motion.rect
                      initial={{ x: -90 }}
                      animate={{ x: 810 }}
                      transition={{ duration: 1.5, ease: 'easeInOut' }}
                      y={-10}
                      width={70}
                      height={520}
                      fill="url(#mapScanTrail)"
                    />
                    <motion.rect
                      initial={{ x: -20 }}
                      animate={{ x: 810 }}
                      transition={{ duration: 1.5, ease: 'easeInOut' }}
                      y={-10}
                      width={2.5}
                      height={520}
                      fill="hsl(43, 74%, 49%)"
                      style={{ filter: 'drop-shadow(0 0 6px rgba(201, 165, 83, 0.9))' }}
                    />
                  </g>
                )}

                {phase === 'locked' && route && (
                  <g>
                    {!reduceMotion && (
                      <motion.circle
                        cx={originPoint[0]}
                        cy={originPoint[1]}
                        fill="hsl(43, 74%, 49%)"
                        initial={{ r: 4, opacity: 0.7 }}
                        animate={{ r: 13, opacity: 0 }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                      />
                    )}
                    <circle cx={originPoint[0]} cy={originPoint[1]} r="3.2" fill="hsl(43, 74%, 49%)" />
                    <motion.path
                      key={`route-${selected}`}
                      d={route.d}
                      fill="none"
                      stroke="hsl(43, 74%, 49%)"
                      strokeWidth="1.4"
                      strokeOpacity="0.85"
                      strokeLinecap="round"
                      initial={reduceMotion ? false : { pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.9, ease: 'easeInOut' }}
                    />
                    {!reduceMotion && (
                      <circle
                        key={`dot-${selected}`}
                        cx={originPoint[0]}
                        cy={originPoint[1]}
                        r="3"
                        fill="hsl(43, 74%, 49%)"
                        style={{ filter: 'drop-shadow(0 0 6px rgba(201, 165, 83, 0.95))' }}
                      >
                        <animateMotion dur="1.05s" begin="0.3s" fill="freeze" path={route.d} />
                      </circle>
                    )}
                  </g>
                )}

                {phase === 'locked' && anchorPoint && (
                  <LockOnReticle key={selected} point={anchorPoint} reduceMotion={!!reduceMotion} />
                )}
              </svg>
            </div>

            {/* HUD dispatch readout */}
            {phase === 'locked' && selectedInfo && anchorGeo && (
              <motion.div
                key={`hud-${selected}`}
                initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute top-2 left-2 sm:top-5 sm:left-5 z-20 pointer-events-none border border-primary/25 bg-background/85 backdrop-blur-sm px-2.5 py-1.5 sm:px-4 sm:py-3"
              >
                <p className="mb-1.5 flex items-center gap-1.5 text-[9px] uppercase tracking-[0.24em] text-primary">
                  {t.map.dispatch.title}
                </p>
                <p className="text-[10px] sm:text-xs text-foreground/70">
                  {t.map.dispatch.target}:{' '}
                  <span className="text-primary">
                    {selectedInfo.name} ({selectedInfo.code})
                  </span>
                </p>
                <p className="text-[10px] sm:text-xs text-foreground/70">
                  {t.map.dispatch.status}: <span className="text-foreground">{t.map.dispatch.statusValue}</span>
                </p>
                <p className="mt-0.5 text-[9px] sm:text-[10px] tracking-wider text-foreground/40">
                  {anchorGeo[1].toFixed(2)}° N · {anchorGeo[0].toFixed(2)}° E
                </p>
              </motion.div>
            )}

            {/* Hover tooltip */}
            {hoveredCanton && CANTON_MAP[hoveredCanton] && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur-sm border border-primary/30 px-5 py-2 text-primary font-light tracking-wide pointer-events-none z-30 text-sm"
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
                        {selectedInfo?.name}
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
