import { ArrowUpRight, Check } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { FloatingAssistant } from '@/components/FloatingAssistant';
import { Breadcrumb } from '@/components/Breadcrumb';
import { TravelCostNotice } from '@/components/TravelCostNotice';
import { useTranslation } from '@/i18n/LanguageContext';

export default function FirmenkundenPage() {
  const { t, lang, getLangRoute } = useTranslation();
  const page = t.businessPage;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-foreground">
      <Navigation />
      <main className="container mx-auto px-5 pb-20 pt-32 sm:px-6 lg:px-12">
        <Breadcrumb
          items={[
            { label: 'RCC Royal Car Cleaning', href: getLangRoute('home') },
            { label: lang === 'de' ? 'Firmenkunden' : lang === 'fr' ? 'Clients professionnels' : 'Business Customers' },
          ]}
        />

        <header className="mb-16 max-w-3xl">
          <span className="mb-4 block text-[10px] uppercase tracking-[0.32em] text-primary">{page.eyebrow}</span>
          <h1 className="mb-6 text-3xl font-semibold uppercase leading-[0.95] tracking-[-0.04em] text-foreground sm:text-4xl md:text-5xl">
            {page.h1Line1}<br />{page.h1Line2}
          </h1>
          <p className="max-w-2xl text-sm font-light leading-relaxed text-foreground/60 md:text-base">{page.intro}</p>
        </header>

        <section className="mb-16">
          <h2 className="mb-3 text-xl font-semibold uppercase tracking-[-0.025em] text-foreground">{page.audienceTitle}</h2>
          <p className="mb-8 max-w-2xl text-sm font-light leading-relaxed text-foreground/55">{page.audienceIntro}</p>
          <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
            {page.audiences.map((item) => (
              <article key={item.title} className="bg-[#090909] p-7">
                <h3 className="mb-3 text-base font-semibold uppercase tracking-[-0.02em] text-foreground">{item.title}</h3>
                <p className="text-sm font-light leading-relaxed text-foreground/55">{item.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="mb-8 text-xl font-semibold uppercase tracking-[-0.025em] text-foreground">{page.benefitsTitle}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {page.benefits.map((item) => (
              <article key={item.title} className="border border-white/10 bg-[#090909] p-6">
                <div className="mb-4 flex items-center gap-3">
                  <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <h3 className="text-sm font-semibold uppercase tracking-[0.04em] text-foreground">{item.title}</h3>
                </div>
                <p className="text-sm font-light leading-relaxed text-foreground/55">{item.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <TravelCostNotice variant="business" />
        </section>

        <section className="mb-16">
          <h2 className="mb-8 text-xl font-semibold uppercase tracking-[-0.025em] text-foreground">{page.processTitle}</h2>
          <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">
            {page.process.map((item) => (
              <article key={item.step} className="bg-[#090909] px-6 py-8">
                <span className="mb-4 block font-mono text-[10px] text-primary/60">{item.step}</span>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.06em] text-foreground">{item.title}</h3>
                <p className="text-sm font-light leading-relaxed text-foreground/55">{item.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border border-primary/25 bg-primary/[0.045] px-7 py-9 sm:px-10">
          <h2 className="mb-3 text-xl font-semibold uppercase tracking-[-0.025em] text-foreground">{page.ctaTitle}</h2>
          <p className="mb-6 max-w-2xl text-sm font-light leading-relaxed text-foreground/60">{page.ctaDesc}</p>
          <a
            href={`${getLangRoute('kontakt')}#quote`}
            className="inline-flex items-center gap-3 bg-primary px-7 py-4 text-xs font-bold uppercase tracking-[0.16em] text-background transition-colors hover:bg-[#ebcc7b]"
          >
            {page.ctaButton}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </section>
      </main>
      <Footer />
      <FloatingAssistant />
    </div>
  );
}