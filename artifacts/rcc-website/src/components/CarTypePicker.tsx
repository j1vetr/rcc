import React from 'react';
import { motion } from 'framer-motion';
import carSmall from '@assets/optimized/car-small.webp';
import carMedium from '@assets/optimized/car-medium.webp';
import carSuv from '@assets/optimized/car-suv.webp';
import carLimousine from '@assets/optimized/car-limousine.webp';
import carSport from '@assets/optimized/car-sport.webp';
import carVan from '@assets/optimized/car-van.webp';

interface CarTypePickerProps {
  value: string;
  onChange: (value: string) => void;
  options: Record<string, string>;
}

const carImages: Record<string, string> = {
  small: carSmall,
  medium: carMedium,
  suv: carSuv,
  limousine: carLimousine,
  sport: carSport,
  van: carVan,
};

export function CarTypePicker({ value, onChange, options }: CarTypePickerProps) {
  return (
    <div className="grid grid-cols-1 min-[390px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
      {Object.entries(options).map(([key, label]) => {
        const isSelected = value === key;
        const image = carImages[key] || carMedium;
        
        return (
          <motion.button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`car-type-card min-w-0 p-3 flex flex-col items-center gap-1.5 ${isSelected ? 'selected' : ''}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            data-testid={`button-car-${key}`}
          >
            <div className="w-full aspect-[2.25/1] flex items-center justify-center overflow-hidden">
              <img
                src={image}
                alt={label}
                width="560"
                height="560"
                loading="lazy"
                decoding="async"
                className={`w-full h-full object-contain transition-all duration-500 ${
                  isSelected ? 'opacity-100 scale-105' : 'opacity-55 grayscale group-hover:opacity-90'
                }`}
              />
            </div>
            <span className={`max-w-full text-center text-[10px] sm:text-xs font-medium tracking-[0.1em] uppercase transition-colors ${
              isSelected ? 'text-primary' : 'text-foreground/60'
            }`}>
              {label}
            </span>
            {isSelected && (
              <motion.div 
                layoutId="selected-indicator"
                className="w-full h-px bg-primary"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
