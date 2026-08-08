/**
 * Shared template for all Ratgeber / Guide article pages.
 *
 * Renders Article schema, breadcrumbs, structured H2/H3 sections,
 * internal links to RCC services, and a CTA.
 */

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { FloatingAssistant } from '@/components/FloatingAssistant';
import { Breadcrumb } from '@/components/Breadcrumb';
import type { BreadcrumbItem } from '@/components/Breadcrumb';
import { formatGuideDate, getGuideArticleMetadata, type GuideArticleKey } from '@/seo/articleMetadata';
import type { Lang } from '@/seo/routes';

export interface GuideSection {
  heading: string;
  /** h2 (default) or h3 */
  level?: 'h2' | 'h3';
  paragraphs: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface InternalLink {
  label: string;
  href: string;
}

export interface GuidePageConfig {
  breadcrumbs: BreadcrumbItem[];
  eyebrow: string;
  h1: string;
  /** Short answer / lead paragraph — appears before the first H2 */
  lead: string;
  articleKey: GuideArticleKey;
  language: Lang;
  sections: GuideSection[];
  faqs?: FaqItem[];
  /** Localised FAQ section heading (defaults to 'Häufige Fragen') */
  faqHeading?: string;
  internalLinks: InternalLink[];
  ctaHeading: string;
  ctaText: string;
  ctaLabel: string;
  ctaHref: string;
}

interface Props {
  config: GuidePageConfig;
}

export function GuidePageTemplate({ config }: Props) {
  const {
    breadcrumbs,
    eyebrow,
    h1,
    lead,
    articleKey,
    language,
    sections,
    faqs,
    internalLinks,
    ctaHeading,
    ctaText,
    ctaLabel,
    ctaHref,
  } = config;
  const article = getGuideArticleMetadata(articleKey, language);

  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-primary/30 selection:text-foreground">
      <Navigation />

      <main className="pt-32 pb-20 container mx-auto px-5 sm:px-6 lg:px-12">
        <Breadcrumb items={breadcrumbs} />

        {/* Article header */}
        <header className="mb-12 max-w-2xl">
          <span className="mb-4 block text-[10px] uppercase tracking-[0.32em] text-primary">
            {eyebrow}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold uppercase leading-[0.95] tracking-[-0.04em] text-foreground mb-6">
            {article.title}
          </h1>
          {/* Lead — clear answer up top */}
          <p className="text-sm md:text-base font-light text-foreground/65 leading-relaxed border-l-2 border-primary/50 pl-4">
            {lead}
          </p>
          <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-foreground/35">
            <time dateTime={article.datePublished}>{formatGuideDate(article.datePublished, language)}</time>
          </p>
        </header>

        <div className="grid lg:grid-cols-[1fr_280px] gap-12 lg:gap-16 items-start">
          {/* Main article body */}
          <article className="prose prose-invert prose-sm md:prose-base max-w-none prose-headings:font-semibold prose-headings:uppercase prose-headings:tracking-[-0.025em] prose-headings:text-foreground prose-p:text-foreground/65 prose-p:leading-relaxed prose-li:text-foreground/65">
            {sections.map((section, idx) => {
              const Tag = section.level ?? 'h2';
              return (
                <section key={idx}>
                  <Tag className={`mt-10 mb-4 ${Tag === 'h2' ? 'text-xl md:text-2xl' : 'text-lg md:text-xl'} font-semibold uppercase tracking-[-0.025em] text-foreground`}>
                    {section.heading}
                  </Tag>
                  {section.paragraphs.map((p, pidx) => (
                    <p key={pidx} className="text-sm md:text-base font-light text-foreground/65 leading-relaxed mb-4">
                      {p}
                    </p>
                  ))}
                </section>
              );
            })}

            {faqs && faqs.length > 0 && (
              <section>
                <h2 className="mt-10 mb-6 text-xl md:text-2xl font-semibold uppercase tracking-[-0.025em] text-foreground">
                  {config.faqHeading ?? 'Häufige Fragen'}
                </h2>
                <div className="space-y-1 not-prose">
                  {faqs.map((faq) => (
                    <details key={faq.question} className="group border border-white/10 bg-[#090909]">
                      <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-sm font-medium text-foreground list-none">
                        <span>{faq.question}</span>
                        <span className="ml-4 shrink-0 text-primary text-lg leading-none group-open:rotate-45 transition-transform">+</span>
                      </summary>
                      <div className="px-6 pb-5 text-sm font-light leading-relaxed text-foreground/60 border-t border-white/5 pt-4">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* Sidebar */}
          <aside className="space-y-8 lg:sticky lg:top-32">
            {/* Internal links */}
            <div className="border border-white/10 bg-[#090909] p-6">
              <h3 className="mb-4 text-[9px] uppercase tracking-[0.22em] text-primary">
                RCC Leistungen
              </h3>
              <ul className="space-y-2">
                {internalLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="flex items-center gap-2 text-sm font-light text-foreground/60 hover:text-primary transition-colors group"
                    >
                      <span className="h-px w-4 bg-primary/40 shrink-0 group-hover:bg-primary transition-colors" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA card */}
            <div className="border border-primary/30 bg-primary/[0.04] p-6">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[-0.01em] text-foreground">
                {ctaHeading}
              </h3>
              <p className="mb-5 text-xs font-light leading-relaxed text-foreground/50">
                {ctaText}
              </p>
              <a
                href={ctaHref}
                className="inline-flex w-full items-center justify-center gap-2 bg-primary px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-background hover:bg-[#ebcc7b] transition-colors"
              >
                {ctaLabel}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
      <FloatingAssistant />
    </div>
  );
}
