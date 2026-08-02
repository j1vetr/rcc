import { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Armchair, CarFront, MoveHorizontal } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageContext';
import exteriorDirtyImg from '@assets/optimized/beforeafter-exterior-dirty.webp';
import exteriorCleanImg from '@assets/optimized/beforeafter-exterior-clean.webp';
import interiorDirtyImg from '@assets/optimized/beforeafter-interior-dirty.webp';
import interiorCleanImg from '@assets/optimized/beforeafter-interior-clean.webp';

type CompareMode = 'exterior' | 'interior';

const MODE_IMAGES: Record<CompareMode, { dirty: string; clean: string }> = {
  exterior: { dirty: exteriorDirtyImg, clean: exteriorCleanImg },
  interior: { dirty: interiorDirtyImg, clean: interiorCleanImg },
};

export function BeforeAfter() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const activePointerId = useRef<number | null>(null);
  const [position, setPosition] = useState(58);
  const [mode, setMode] = useState<CompareMode>('exterior');

  const updateFromClientX = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const raw = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(96, Math.max(4, raw)));
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    activePointerId.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    updateFromClientX(event.clientX);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerId.current !== event.pointerId) return;
    updateFromClientX(event.clientX);
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerId.current === event.pointerId) {
      activePointerId.current = null;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setPosition((value) => Math.max(4, value - 4));
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      setPosition((value) => Math.min(96, value + 4));
    }
  };

  const tabs = [
    { id: 'exterior' as CompareMode, label: t.beforeAfter.tabs.exterior, icon: CarFront },
    { id: 'interior' as CompareMode, label: t.beforeAfter.tabs.interior, icon: Armchair },
  ];

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const current = tabs.findIndex((tab) => tab.id === mode);
    const next =
      event.key === 'ArrowRight'
        ? (current + 1) % tabs.length
        : (current - 1 + tabs.length) % tabs.length;
    setMode(tabs[next].id);
    const tabElement = document.getElementById(`beforeafter-tab-${tabs[next].id}`);
    tabElement?.focus();
  };

  const images = MODE_IMAGES[mode];

  return (
    <section className="bg-background py-16 md:py-20 section-border relative overflow-hidden">
      <div className="container mx-auto px-5 sm:px-6 lg:px-12 relative z-10">
        <motion.div
          className="text-center mb-8 md:mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-3">
            {t.beforeAfter.eyebrow}
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-[2.65rem] font-serif font-light text-foreground mb-4">
            {t.beforeAfter.title}
          </h2>
          <div className="w-20 h-px gold-divider mx-auto mb-5" />
          <p className="text-foreground/60 text-base md:text-lg max-w-xl mx-auto font-light">
            {t.beforeAfter.subtitle}
          </p>
        </motion.div>

        {/* Exterior / interior switch */}
        <div className="mb-6 flex justify-center">
          <div
            role="tablist"
            aria-label={t.beforeAfter.eyebrow}
            onKeyDown={handleTabKeyDown}
            className="inline-flex border border-white/10 bg-card/60 p-1 backdrop-blur-sm"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = mode === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`beforeafter-tab-${tab.id}`}
                  role="tab"
                  type="button"
                  onClick={() => setMode(tab.id)}
                  aria-selected={isActive}
                  aria-controls="beforeafter-panel"
                  tabIndex={isActive ? 0 : -1}
                  data-testid={`beforeafter-tab-${tab.id}`}
                  className={`flex items-center gap-2 px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
                    isActive
                      ? 'bg-primary/15 text-primary border border-primary/40'
                      : 'text-foreground/50 border border-transparent hover:text-foreground/80'
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="max-w-5xl mx-auto"
        >
          <div
            ref={containerRef}
            id="beforeafter-panel"
            role="slider"
            tabIndex={0}
            aria-label={t.beforeAfter.instruction}
            aria-valuemin={4}
            aria-valuemax={96}
            aria-valuenow={Math.round(position)}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
            onKeyDown={handleKeyDown}
            data-testid="beforeafter-slider"
            className="relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden border border-white/10 bg-card cursor-ew-resize select-none touch-none focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          >
            <motion.div
              key={mode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0"
            >
              {/* Clean result underneath */}
              <img
                src={images.clean}
                alt={t.beforeAfter.after}
                className="absolute inset-0 h-full w-full object-cover"
                draggable={false}
                loading="lazy"
                decoding="async"
              />

              {/* Dirty state on top, wiped away by the squeegee */}
              <div
                className="absolute inset-0"
                style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
              >
                <img
                  src={images.dirty}
                  alt={t.beforeAfter.before}
                  className="absolute inset-0 h-full w-full object-cover"
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </motion.div>

            {/* Foam edge along the wipe line */}
            <div
              className="absolute inset-y-0 w-10 -translate-x-1/2 pointer-events-none squeegee-foam"
              style={{ left: `${position}%` }}
            />

            {/* Squeegee handle */}
            <div
              className="absolute inset-y-0 -translate-x-1/2 pointer-events-none"
              style={{ left: `${position}%` }}
            >
              <div className="h-full w-px bg-primary/90 shadow-[0_0_12px_rgba(201,165,83,0.8)]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center border border-primary/60 bg-background/90 backdrop-blur-sm shadow-[0_0_24px_rgba(201,165,83,0.35)]">
                <MoveHorizontal className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
            </div>

            {/* Labels */}
            <span className="absolute left-4 top-4 border border-white/15 bg-background/70 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-foreground/70 backdrop-blur-sm">
              {t.beforeAfter.before}
            </span>
            <span className="absolute right-4 top-4 border border-primary/40 bg-background/70 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-primary backdrop-blur-sm">
              {t.beforeAfter.after}
            </span>
          </div>

          <p className="mt-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] text-foreground/40">
            <MoveHorizontal className="h-3.5 w-3.5 text-primary/70" aria-hidden="true" />
            {t.beforeAfter.instruction}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
