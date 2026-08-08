/**
 * SSR entry point — used by scripts/prerender.mjs to render each route to a HTML string.
 * Not imported by the browser bundle (vite.config.ssr.ts is a separate build).
 */

import React from 'react';
import { renderToString } from 'react-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Router, Switch, Route } from 'wouter';
import { LanguageProvider } from '@/i18n/LanguageContext';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { STATIC_SERVICES } from '@/data/services-static';
import { getMetadataForPath } from '@/seo/metadata';
import { getLangPath, detectLangFromPath, type Lang } from '@/seo/routes';
import { translations } from '@/i18n/translations';

// ─── Lightweight SSR page components ─────────────────────────────────────────
// Lang is always passed explicitly — never read from window/browser APIs.

/** Hero section with H1 and subheadline — rendered in SSR for crawler visibility. */
function SSRHeroContent({ lang }: { lang: Lang }) {
  const t = translations[lang];
  return (
    <section className="bg-black min-h-[50vh] flex items-center justify-center px-6 py-24 text-center">
      <div className="max-w-2xl">
        <p className="mb-3 text-xs uppercase tracking-widest text-[#c9a553]">{t.hero.eyebrow}</p>
        <h1 className="mb-4 text-4xl font-semibold uppercase leading-tight text-white">{t.hero.headline}</h1>
        <p className="mb-8 text-base font-light text-white/75 leading-relaxed">{t.hero.subheadline}</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a
            href={`${getLangPath(lang, 'home')}#quote`}
            className="bg-[#c9a553] text-black px-8 py-3 text-sm font-semibold uppercase tracking-widest"
          >
            {t.hero.cta}
          </a>
          <a
            href={getLangPath(lang, 'packages')}
            className="border border-white/30 bg-black/40 text-white px-8 py-3 text-sm font-semibold uppercase tracking-widest"
          >
            {t.nav.packages}
          </a>
        </div>
      </div>
    </section>
  );
}

/** Why-RCC section — service points in SSR. */
function SSRWhyContent({ lang }: { lang: Lang }) {
  const t = translations[lang];
  return (
    <section className="py-16 px-6 bg-[#080808]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold uppercase tracking-tight text-white mb-8 text-center">
          {t.why.title}
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {t.why.points.map((p) => (
            <li key={p.title} className="border border-white/10 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[#c9a553] mb-2">{p.title}</h3>
              <p className="text-sm font-light text-white/60 leading-relaxed">{p.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Services list for packages page — embedded for crawler. */
function SSRServicesContent({ lang }: { lang: Lang }) {
  const t = translations[lang];
  const getLangField = (service: (typeof STATIC_SERVICES)[number], field: string) => {
    const key = `${field}${lang.toUpperCase()}` as keyof typeof service;
    return service[key] as string;
  };
  return (
    <section className="py-16 px-6 bg-[#080808]">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 text-center">
          <p className="text-xs uppercase tracking-widest text-[#c9a553] mb-3">{t.servicesPage.eyebrow}</p>
          <h1 className="text-3xl font-semibold uppercase text-white mb-4">{t.servicesPage.title}</h1>
          <p className="text-sm font-light text-white/50">{t.servicesPage.subtitle}</p>
        </header>
        <div className="grid gap-6 md:grid-cols-2">
          {[...STATIC_SERVICES].map((service) => {
            const name = getLangField(service, 'name');
            const desc = getLangField(service, 'description');
            const isPremium = service.level === 'premium';
            return (
              <article
                key={service.id}
                className={`border p-6 ${isPremium ? 'border-[#c9a553]/50' : 'border-white/10'} bg-[#090909]`}
              >
                <span
                  className={`mb-3 inline-block px-2 py-0.5 text-[9px] uppercase tracking-widest ${isPremium ? 'bg-[#c9a553] text-black' : 'bg-white/5 text-white/60'}`}
                >
                  {t.servicesPage.levels[service.level]}
                </span>
                <h2 className="text-xl font-semibold uppercase text-white mb-2">{name}</h2>
                <p className="text-sm font-light text-white/55 leading-relaxed mb-4">{desc}</p>
                <p className="text-sm text-[#c9a553]">
                  {t.servicesPage.from} CHF {Math.min(...Object.values(service.prices))}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── SSR page shells — lang always supplied as prop ───────────────────────────

function SSRHomePage({ lang }: { lang: Lang }) {
  return (
    <div className="bg-background min-h-screen text-foreground">
      <Navigation />
      <main>
        <SSRHeroContent lang={lang} />
        <SSRWhyContent lang={lang} />
      </main>
      <Footer />
    </div>
  );
}

function SSRPackagesPage({ lang }: { lang: Lang }) {
  return (
    <div className="bg-background min-h-screen text-foreground">
      <Navigation />
      <main className="pt-32">
        <SSRServicesContent lang={lang} />
      </main>
      <Footer />
    </div>
  );
}

/** Route tree for SSR. lang is injected by the render() function and passed down. */
function SSRApp({ lang }: { lang: Lang }) {
  return (
    <Switch>
      <Route path="/de/"         component={() => <SSRHomePage lang={lang} />} />
      <Route path="/de/pakete/"  component={() => <SSRPackagesPage lang={lang} />} />
      <Route path="/en/"         component={() => <SSRHomePage lang={lang} />} />
      <Route path="/en/packages/" component={() => <SSRPackagesPage lang={lang} />} />
      <Route path="/fr/"         component={() => <SSRHomePage lang={lang} />} />
      <Route path="/fr/forfaits/" component={() => <SSRPackagesPage lang={lang} />} />
      <Route>
        {() => (
          <div className="bg-background min-h-screen text-foreground">
            <Navigation />
            <main className="flex items-center justify-center min-h-[60vh]" />
            <Footer />
          </div>
        )}
      </Route>
    </Switch>
  );
}

// ─── render export ────────────────────────────────────────────────────────────

export interface RenderResult {
  html: string;
  metadata: ReturnType<typeof getMetadataForPath>;
}

export async function render(url: string): Promise<RenderResult> {
  // Derive language from URL — never read window/browser APIs in SSR context.
  const lang = detectLangFromPath(url);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { staleTime: Infinity, retry: false, refetchOnMount: false },
    },
  });

  // Pre-populate services cache so any query resolves synchronously
  queryClient.setQueryData(['services'], STATIC_SERVICES);

  // Custom wouter hook: returns the provided URL as the current location
  const hook = () => [url, (() => {}) as (to: string) => void] as const;

  let html = '';
  try {
    html = renderToString(
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Router hook={hook as Parameters<typeof Router>[0]['hook']}>
            <LanguageProvider>
              <SSRApp lang={lang} />
            </LanguageProvider>
          </Router>
        </TooltipProvider>
      </QueryClientProvider>,
    );
  } catch (err) {
    console.error(`[prerender] SSR render error for "${url}":`, err);
    html = '';
  }

  const metadata = getMetadataForPath(url);
  return { html, metadata };
}
