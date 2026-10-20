import { AnimatePresence, motion } from 'framer-motion';
import { Check, Info } from 'lucide-react';
import {
  extras as CATALOG_EXTRAS,
  variablePriceNotice,
  type CatalogLanguage,
  type ExtraSelection,
} from '@workspace/service-catalog';
import { PRICING_LABELS } from '@/data/pricing-labels';

interface ExtraSelectorProps {
  lang: CatalogLanguage;
  value: ExtraSelection[];
  onChange: (value: ExtraSelection[]) => void;
  compact?: boolean;
}

export function ExtraSelector({ lang, value, onChange, compact = false }: ExtraSelectorProps) {
  const L = PRICING_LABELS[lang];

  const toggle = (id: string, defaultVariant: string) => {
    if (value.some((s) => s.id === id)) onChange(value.filter((s) => s.id !== id));
    else onChange([...value, { id, variantId: defaultVariant }]);
  };

  const setVariant = (id: string, variantId: string) => {
    if (value.some((s) => s.id === id)) {
      onChange(value.map((s) => (s.id === id ? { ...s, variantId } : s)));
    } else {
      onChange([...value, { id, variantId }]);
    }
  };

  const groups: Array<{ key: 'interior' | 'exterior'; title: string }> = [
    { key: 'interior', title: L.interiorExtras },
    { key: 'exterior', title: L.exteriorExtras },
  ];

  return (
    <div className={`grid gap-8 ${compact ? '' : 'lg:grid-cols-2 lg:gap-6'}`}>
      {groups.map((group) => (
        <div key={group.key}>
          <h4 className="mb-3 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
            <span className="h-px w-6 bg-primary/60" />
            {group.title}
          </h4>
          <ul className="divide-y divide-white/[0.07] border-y border-white/10">
            {CATALOG_EXTRAS.filter((e) => e.category === group.key).map((extra) => {
              const sel = value.find((s) => s.id === extra.id);
              const checked = Boolean(sel);
              const multi = extra.variants.length > 1;
              const price = sel
                ? extra.variants.find((v) => v.id === sel.variantId)?.price ?? extra.variants[0].price
                : extra.variants[0].price;
              return (
                <li key={extra.id} className={`transition-colors duration-300 ${checked ? 'bg-primary/[0.06]' : 'hover:bg-white/[0.02]'}`}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    data-testid={`checkbox-extra-${extra.id}`}
                    onClick={() => toggle(extra.id, extra.variants[0].id)}
                    className="flex w-full items-start gap-3 px-3 py-3.5 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  >
                    <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border transition-all duration-300 ${checked ? 'border-primary bg-primary text-background' : 'border-white/25'}`}>
                      {checked && <Check className="h-3 w-3" strokeWidth={3} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block text-sm font-medium leading-snug ${checked ? 'text-primary' : 'text-foreground'}`}>
                        {extra.name[lang]}
                      </span>
                      <span className="mt-1 block text-xs font-light leading-relaxed text-foreground/50">
                        {extra.description[lang]}
                      </span>
                      {extra.variablePrice && (
                        <span className="mt-1.5 flex items-start gap-1.5 text-[11px] leading-snug text-primary/75">
                          <Info className="mt-px h-3 w-3 shrink-0" />
                          {variablePriceNotice[lang]}
                        </span>
                      )}
                    </span>
                    <span className="shrink-0 whitespace-nowrap text-sm font-medium tabular-nums text-foreground/80">
                      {multi && !checked ? `${L.from} ` : ''}CHF {price}
                    </span>
                  </button>
                  {multi && (
                    <div className="px-3 pb-3.5 pl-10" role="radiogroup" aria-label={L.chooseVariant}>
                      <div className="grid gap-1.5 sm:grid-cols-2">
                        {extra.variants.map((variant) => {
                          const active = sel?.variantId === variant.id;
                          return (
                            <button
                              key={variant.id}
                              type="button"
                              role="radio"
                              aria-checked={active}
                              data-testid={`radio-extra-${extra.id}-${variant.id}`}
                              onClick={() => setVariant(extra.id, variant.id)}
                              className={`flex items-center justify-between gap-2 border px-3 py-2 text-left text-xs transition-all duration-300 ${active ? 'border-primary text-primary' : 'border-white/10 text-foreground/60 hover:border-primary/40'}`}
                            >
                              <span>{variant.label[lang]}</span>
                              <span className="tabular-nums">CHF {variant.price}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function PriceBreakdown({
  lang,
  serviceName,
  vehicleLabel,
  packagePrice,
  selections,
  total,
  hasVariable,
}: {
  lang: CatalogLanguage;
  serviceName?: string;
  vehicleLabel?: string;
  packagePrice?: number;
  selections: ExtraSelection[];
  total?: number;
  hasVariable: boolean;
}) {
  const L = PRICING_LABELS[lang];
  const lines = selections.flatMap((s) => {
    const extra = CATALOG_EXTRAS.find((e) => e.id === s.id);
    const variant = extra?.variants.find((v) => v.id === s.variantId);
    if (!extra || !variant) return [];
    return [{
      key: s.id,
      label: extra.variants.length > 1 ? `${extra.name[lang]} (${variant.label[lang]})` : extra.name[lang],
      price: variant.price,
    }];
  });

  return (
    <div data-testid="summary-price-breakdown">
      <dl className="space-y-4">
        <div>
          <dt className="mb-1 text-[9px] uppercase tracking-[0.2em] text-foreground/40">{L.vehicle}</dt>
          <dd className={`text-sm font-light leading-snug ${vehicleLabel ? 'text-foreground' : 'text-foreground/30'}`}>{vehicleLabel ?? L.notSelected}</dd>
        </div>
        <div>
          <dt className="mb-1 text-[9px] uppercase tracking-[0.2em] text-foreground/40">{L.package}</dt>
          <dd className="flex items-baseline justify-between gap-3 text-sm font-light">
            <span className={serviceName ? 'text-foreground' : 'text-foreground/30'}>{serviceName ?? L.notSelected}</span>
            {packagePrice !== undefined && <span className="tabular-nums text-foreground/80">CHF {packagePrice}</span>}
          </dd>
        </div>
        <div>
          <dt className="mb-1 text-[9px] uppercase tracking-[0.2em] text-foreground/40">{L.extras}</dt>
          <dd>
            {lines.length === 0 ? (
              <span className="text-sm font-light text-foreground/30">{L.noExtras}</span>
            ) : (
              <ul className="space-y-1.5">
                <AnimatePresence initial={false}>
                  {lines.map((line) => (
                    <motion.li
                      key={line.key}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.22 }}
                      className="flex items-baseline justify-between gap-3 text-xs font-light text-foreground/75"
                    >
                      <span className="leading-snug">{line.label}</span>
                      <span className="shrink-0 tabular-nums">CHF {line.price}</span>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </dd>
        </div>
      </dl>
      <div className="mt-6 border-t border-primary/25 pt-5">
        <p className="mb-1.5 text-[9px] uppercase tracking-[0.2em] text-foreground/40">{L.total}</p>
        <AnimatePresence mode="wait">
          <motion.p
            key={total ?? 'empty'}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            data-testid="text-total-price"
            className={`font-serif text-3xl tabular-nums ${total !== undefined ? 'text-primary' : 'text-foreground/25'}`}
          >
            {total !== undefined ? `CHF ${total}` : 'CHF -'}
          </motion.p>
        </AnimatePresence>
        {total === undefined && (
          <p className="mt-1 text-[11px] text-foreground/45">{!vehicleLabel ? L.chooseVehicle : L.choosePackage}</p>
        )}
        {hasVariable && <p className="mt-2 text-[11px] leading-snug text-primary/75">{L.variableNote} {variablePriceNotice[lang]}</p>}
        <p className="mt-2 text-[10px] leading-relaxed text-foreground/35">{L.estimateNote}</p>
      </div>
    </div>
  );
}
