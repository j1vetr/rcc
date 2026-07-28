import React, { useState } from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { motion } from 'framer-motion';
import imgVan from '@assets/generated_images/why_van.jpg';
import imgEquip from '@assets/generated_images/why_equipment.jpg';
import imgDiscreet from '@assets/generated_images/why_discreet.jpg';
import imgEco from '@assets/generated_images/why_eco.jpg';

export function WhyRcc() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  
  const images = [imgVan, imgEquip, imgDiscreet, imgEco];

  return (
    <section className="py-24 bg-background relative border-b border-border/30">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">

        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-light text-foreground mb-6">
              {t.why.title}
            </h2>
            <div className="w-12 h-px bg-primary" />
          </motion.div>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:grid grid-cols-12 gap-16 items-stretch min-h-[500px]">
          <div className="col-span-5 flex flex-col justify-center py-4 gap-2">
            {t.why.points.map((point, index) => {
              const isActive = activeIndex === index;
              return (
                <div
                  key={index}
                  className="group cursor-pointer flex flex-col py-4 border-b border-border/30 last:border-0 relative"
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                >
                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 bg-primary transition-all duration-300 ${isActive ? 'h-full' : 'h-0'}`} />

                  <div className={`flex items-center gap-6 pl-6 transition-transform duration-500 ${isActive ? 'translate-x-2' : ''}`}>
                    <span className={`text-[10px] font-mono tracking-[0.2em] transition-colors duration-300 ${isActive ? 'text-primary' : 'text-foreground/20'}`}>
                      0{index + 1}
                    </span>
                    <h3 className={`text-2xl font-serif transition-colors duration-300 ${isActive ? 'text-foreground' : 'text-foreground/40 group-hover:text-foreground/70'}`}>
                      {point.title}
                    </h3>
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-500 pl-16 ${isActive ? 'max-h-32 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}
                  >
                    <p className="text-foreground/50 text-xs font-light leading-relaxed uppercase tracking-widest max-w-sm">
                      {point.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="col-span-7 relative h-full min-h-[500px] bg-card/20 border border-border/40 overflow-hidden">
            <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-primary/60 z-20" />
            <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-primary/60 z-20" />

            {images.map((img, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${activeIndex === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                <div
                  className={`absolute inset-0 bg-cover bg-center transition-transform duration-[10s] ease-out ${activeIndex === index ? 'scale-100' : 'scale-105'}`}
                  style={{ backgroundImage: `url(${img})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                   <div className="text-[9px] text-primary uppercase tracking-[0.3em] mb-2 opacity-80">
                     Fig. 0{index + 1}
                   </div>
                   <div className="w-full h-px bg-gradient-to-r from-primary/50 to-transparent" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden flex flex-col gap-3">
          {t.why.points.map((point, index) => {
            const isActive = activeIndex === index;
            return (
              <div 
                key={index}
                className={`border transition-colors duration-300 overflow-hidden ${isActive ? 'bg-card/20 border-primary/30' : 'bg-transparent border-border/40'}`}
              >
                <button
                  className="w-full flex items-center justify-between p-5 text-left"
                  onClick={() => setActiveIndex(isActive ? -1 : index)}
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-[10px] font-mono tracking-[0.2em] ${isActive ? 'text-primary' : 'text-foreground/40'}`}>
                      0{index + 1}
                    </span>
                    <h3 className={`text-lg font-serif ${isActive ? 'text-foreground' : 'text-foreground/70'}`}>
                      {point.title}
                    </h3>
                  </div>
                  <div className={`w-3 h-3 relative transition-transform duration-500 ${isActive ? 'rotate-180' : ''}`}>
                    <div className="absolute top-1/2 left-0 w-full h-px bg-current -translate-y-1/2 text-primary" />
                    <div className={`absolute top-0 left-1/2 w-px h-full bg-current -translate-x-1/2 text-primary transition-transform duration-300 ${isActive ? 'scale-y-0' : 'scale-y-100'}`} />
                  </div>
                </button>

                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${isActive ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="px-5 pb-5">
                    <p className="text-foreground/60 text-xs font-light leading-relaxed uppercase tracking-widest mb-6">
                      {point.desc}
                    </p>
                    <div className="relative h-48 w-full overflow-hidden border border-border/40">
                       <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${images[index]})` }} />
                       <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                       <div className="absolute bottom-3 left-3">
                          <span className="text-[8px] text-primary uppercase tracking-[0.2em]">Fig. 0{index + 1}</span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
