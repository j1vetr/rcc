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
    <section className="py-24 bg-[#111] border-b border-white/5">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">{t.why.title}</h2>
          <div className="w-16 h-1 bg-primary mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto">
          {t.why.points.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative h-[300px] overflow-hidden"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                style={{ backgroundImage: `url(${images[index]})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h3 className="text-xl md:text-2xl font-serif text-white mb-2">{point.title}</h3>
                <p className="text-white/70 text-sm md:text-base max-w-md transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  {point.desc}
                </p>
                <div className="w-12 h-[2px] bg-primary mt-4 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
