import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import carSmall from '@assets/optimized/car-small.webp';
import carMedium from '@assets/optimized/car-medium.webp';
import carVan from '@assets/optimized/car-van.webp';

interface CarTypePickerProps {
  value: string;
  onChange: (value: string) => void;
  options: Record<string, string>;
  prices?: Record<string, string | undefined>;
}

const carImages: Record<string, string> = {
  small: carSmall,
  medium: carMedium,
  xl: carVan,
};

function splitLabel(label: string) {
  const match = label.match(/^(.*?)\s*\((.*)\)\s*$/);
  return match ? { title: match[1], detail: match[2] } : { title: label, detail: '' };
}

export function CarTypePicker({ value, onChange, options, prices }: CarTypePickerProps) {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3" role="radiogroup">
      {Object.entries(options).map(([key, label]) => {
        const isSelected = value === key;
        const { title, detail } = splitLabel(label);
        return (
          <motion.button
            key={key}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={label}
            onClick={() => onChange(key)}
            className={`car-type-card group relative flex items-center gap-4 p-3 text-left sm:flex-col sm:items-stretch sm:p-4 ${isSelected ? 'selected' : ''}`}
            whileTap={{ scale: 0.98 }}
            data-testid={`button-car-${key}`}
          >
            {isSelected && (
              <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-background">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
            )}
            <div className="flex aspect-[2.25/1] w-28 shrink-0 items-center justify-center overflow-hidden sm:w-full">
              <img
                src={carImages[key] || carMedium}
                alt=""
                width="560"
                height="560"
                loading="lazy"
                decoding="async"
                className={`h-full w-full object-contain transition-all duration-500 ${isSelected ? 'scale-105 opacity-100' : 'opacity-55 grayscale group-hover:opacity-90'}`}
              />
            </div>
            <div className="min-w-0 flex-1">
              <span className={`block text-xs font-semibold uppercase leading-snug tracking-[0.08em] transition-colors ${isSelected ? 'text-primary' : 'text-foreground/85'}`}>
                {title}
              </span>
              {detail && <span className="mt-1 block text-[11px] leading-snug text-foreground/50">{detail}</span>}
              {prices?.[key] && (
                <span className="mt-2 block text-[11px] font-medium tabular-nums text-primary/85">{prices[key]}</span>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
