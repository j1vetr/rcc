import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageContext';
import { Link } from 'wouter';

export function Services() {
  const { t } = useTranslation();

  return (
    <section id="services" className="relative overflow-hidden bg-[#050505] py-20 md:py-32">
      <div
        className="absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(211,175,94,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(211,175,94,.8) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)',
        }}
      />
      <div className="absolute left-1/2 top-1/2 h-[540px] w-[540px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.055] blur-[110px]" />

      <div className="container relative z-10 mx-auto px-5 sm:px-6 lg:px-12 text-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="mb-4 block text-[10px] uppercase tracking-[0.32em] text-primary">
            03 / {t.servicesPage.teaser.title}
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold uppercase leading-[0.95] tracking-[-0.04em] text-foreground mb-6">
            {t.services.title}
          </h2>
          <p className="text-sm md:text-base font-light text-foreground/50 mb-12">
            {t.servicesPage.teaser.text}
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-14 text-left">
            {(['inside-outside', 'interior', 'exterior'] as const).map((cat, i) => (
              <div key={cat} className="border border-white/10 bg-black/40 p-6">
                <span className="font-mono text-[9px] opacity-70 block mb-2">0{i + 1}</span>
                <h3 className="text-lg font-semibold text-foreground uppercase tracking-wider mb-2">
                  {t.servicesPage.categories[cat]}
                </h3>
                <div className="w-8 h-px bg-primary/40" />
              </div>
            ))}
          </div>

          <Link href="/dienstleistungen" className="inline-flex items-center gap-3 bg-primary px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-background transition-colors hover:bg-[#ebcc7b]">
            {t.servicesPage.teaser.viewAll}
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
