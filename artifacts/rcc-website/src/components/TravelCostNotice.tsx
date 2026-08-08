import { ArrowUpRight, Route } from 'lucide-react';
import { useTranslation } from '@/i18n/LanguageContext';

type TravelCostNoticeVariant = 'serviceArea' | 'packages' | 'faq' | 'business';

export function TravelCostNotice({ variant = 'serviceArea' }: { variant?: TravelCostNoticeVariant }) {
  const { t, getLangRoute } = useTranslation();
  const copy = t.travelCosts[variant];

  return (
    <section className="border border-primary/25 bg-primary/[0.045] px-6 py-7 sm:px-8" aria-labelledby={`travel-cost-${variant}`}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <Route className="mt-1 h-5 w-5 shrink-0 text-primary" strokeWidth={1.5} aria-hidden="true" />
          <div className="max-w-2xl">
            <h2 id={`travel-cost-${variant}`} className="text-lg font-semibold uppercase tracking-[-0.025em] text-foreground">
              {copy.title}
            </h2>
            <p className="mt-3 text-sm font-light leading-relaxed text-foreground/65">
              {copy.description}
            </p>
            <p className="mt-2 text-sm font-light leading-relaxed text-foreground/65">
              {copy.detail}
            </p>
          </div>
        </div>
        <a
          href={`${getLangRoute('kontakt')}#quote`}
          className="inline-flex shrink-0 items-center gap-2 self-start border border-primary/50 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-primary transition-colors hover:bg-primary hover:text-background"
        >
          {copy.cta}
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}