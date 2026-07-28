import React from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { motion } from 'framer-motion';
import imgVan from '@assets/generated_images/why_van.jpg';
import imgEquip from '@assets/generated_images/why_equipment.jpg';
import imgDiscreet from '@assets/generated_images/why_discreet.jpg';
import imgEco from '@assets/generated_images/why_eco.jpg';

export function WhyRcc() {
  const { t } = useTranslation();
  
  const images = [imgVan, imgEquip, imgDiscreet, imgEco];

  return (
    <section className="py-20 bg-card/30 relative section-border">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-foreground mb-4">
            {t.why.title}
          </h2>
          <div className="w-20 h-px gold-divider mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
          {t.why.points.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group relative h-[280px] md:h-[320px] overflow-hidden border border-border hover:border-primary/30 transition-all duration-500"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[1500ms] group-hover:scale-110"
                style={{ backgroundImage: `url(${images[index]})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 + 0.2 }}
                >
                  <h3 className="text-xl md:text-2xl font-serif font-light text-foreground mb-3 tracking-tight">
                    {point.title}
                  </h3>
                  <div className="w-12 h-px bg-primary mb-3 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 delay-100" />
                  <p className="text-foreground/60 text-sm max-w-md leading-relaxed font-light transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-150">
                    {point.desc}
                  </p>
                </motion.div>
              </div>
              
              {/* Gold corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-primary/0 group-hover:border-primary/50 transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
