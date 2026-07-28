import React from 'react';
import { motion } from 'framer-motion';
import { TbCar, TbCarSuv } from 'react-icons/tb';
import { PiVanBold } from 'react-icons/pi';
import { IoCarSportSharp } from 'react-icons/io5';

interface CarTypePickerProps {
  value: string;
  onChange: (value: string) => void;
  options: Record<string, string>;
}

// Map car types to Tabler/Phosphor icons
const carIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  small: TbCar,
  medium: TbCar,
  suv: TbCarSuv,
  limousine: TbCar,
  sport: IoCarSportSharp,
  van: PiVanBold,
};

export function CarTypePicker({ value, onChange, options }: CarTypePickerProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {Object.entries(options).map(([key, label]) => {
        const isSelected = value === key;
        const Icon = carIcons[key] || TbCar;
        
        return (
          <motion.button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`car-type-card p-5 flex flex-col items-center gap-3 ${isSelected ? 'selected' : ''}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            data-testid={`button-car-${key}`}
          >
            <Icon 
              className={`w-12 h-12 md:w-14 md:h-14 car-icon transition-all ${
                isSelected ? 'text-primary' : 'text-foreground/30'
              }`}
            />
            <span className={`text-xs font-light tracking-wide uppercase transition-colors ${
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
