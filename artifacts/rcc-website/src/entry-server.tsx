/**
 * SSR entry point — used by scripts/prerender.mjs to render each route to a HTML string.
 * Not imported by the browser bundle (vite.config.ssr.ts is a separate build).
 *
 * IMPORTANT: No lazy() imports here — lazy is client-only. All SSR components must be
 * imported directly and rendered synchronously.
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
import { Check, ArrowUpRight, MapPin, ChevronRight } from 'lucide-react';
import { BUSINESS } from '@/seo/businessData';

// Actual page components — lang-aware via LanguageProvider/useLocation.
// These are safe in SSR because none of them use lazy() directly.
// (EinsatzgebietPage uses a lazy-wrapped map but the Suspense fallback is rendered in SSR.)
import HomePage from '@/pages/HomePage';
import ServicesPage from '@/pages/ServicesPage';
import LeistungenPage from '@/pages/LeistungenPage';
import MobileAutoreinigungPage from '@/pages/MobileAutoreinigungPage';
import InnenreinigungPage from '@/pages/InnenreinigungPage';
import AussenreinigungPage from '@/pages/AussenreinigungPage';
import FahrzeugaufbereitungPage from '@/pages/FahrzeugaufbereitungPage';
import EinsatzgebietPage from '@/pages/EinsatzgebietPage';
import ZuerichPage from '@/pages/ZuerichPage';
import ContactPage from '@/pages/ContactPage';
import AboutPage from '@/pages/AboutPage';
import FaqPage from '@/pages/FaqPage';

// ─── Shared SSR primitives ────────────────────────────────────────────────────

function SSRBreadcrumb({ items }: { items: Array<{ label: string; href?: string }> }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-foreground/40">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight className="h-3 w-3 shrink-0 text-foreground/25" aria-hidden="true" />
              )}
              {isLast || !item.href ? (
                <span aria-current={isLast ? 'page' : undefined} className={isLast ? 'text-primary' : ''}>
                  {item.label}
                </span>
              ) : (
                <a href={item.href} className="hover:text-primary transition-colors">{item.label}</a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ─── Homepage SSR ─────────────────────────────────────────────────────────────

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

/** German-only SEO section with internal links + FAQ (crawler-visible) */
function SSRHomeSeoSection() {
  return (
    <section className="py-16 px-6 bg-[#060606]">
      <div className="max-w-4xl mx-auto">
        {/* Service links */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold uppercase tracking-tight text-white mb-6">
            Unsere Leistungen
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'Mobile Autoreinigung', href: '/de/leistungen/mobile-autoreinigung/' },
              { label: 'Innenreinigung', href: '/de/leistungen/innenreinigung/' },
              { label: 'Aussenreinigung', href: '/de/leistungen/aussenreinigung/' },
              { label: 'Fahrzeugaufbereitung', href: '/de/leistungen/fahrzeugaufbereitung/' },
              { label: 'Pakete & Preise', href: '/de/pakete/' },
              { label: 'Einsatzgebiet', href: '/de/einsatzgebiet/' },
            ].map((link) => (
              <li key={link.href}>
                <a href={link.href} className="flex items-center gap-2 border border-white/10 px-4 py-3 text-sm font-light text-white/70 hover:text-[#c9a553]">
                  <span className="h-px w-4 bg-[#c9a553]/50 shrink-0" />
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* City links */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold uppercase tracking-tight text-white mb-6">
            Mobile Autoreinigung nach Stadt
          </h2>
          <div className="flex flex-wrap gap-3">
            <a href="/de/mobile-autoreinigung/zuerich/" className="border border-white/10 px-4 py-2 text-sm font-light text-white/70 hover:text-[#c9a553]">
              Zürich
            </a>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-xl font-semibold uppercase tracking-tight text-white mb-6">
            Häufige Fragen zur mobilen Autoreinigung
          </h2>
          <dl className="space-y-6">
            {[
              {
                q: 'Was ist mobile Autoreinigung Schweiz?',
                a: 'Mobile Autoreinigung bedeutet, dass das RCC-Team mit dem professionellen Reinigungsequipment direkt zu Ihrem Fahrzeug kommt — in der ganzen Schweiz. Sie müssen Ihr Fahrzeug nicht irgendwo hinbringen.',
              },
              {
                q: 'In welchen Kantonen bietet RCC mobile Autopflege an?',
                a: 'RCC ist in allen 26 Kantonen der Schweiz im Einsatz. Kontaktieren Sie uns für eine Terminabsprache für Ihren genauen Standort.',
              },
              {
                q: 'Welche Fahrzeuggrössen werden gereinigt?',
                a: 'Wir reinigen Kleinwagen, Kompakt- und Mittelklassefahrzeuge, SUV sowie grosse Fahrzeuge wie Vans und 7-Sitzer. Die Grösse bestimmt den genauen Paketpreis.',
              },
              {
                q: 'Wie kann ich eine Offerte anfragen?',
                a: 'Nutzen Sie das Offertformular auf dieser Seite oder kontaktieren Sie uns direkt per Telefon oder WhatsApp. Wir melden uns umgehend.',
              },
            ].map((faq) => (
              <div key={faq.q}>
                <dt className="text-sm font-medium text-white mb-2">{faq.q}</dt>
                <dd className="text-sm font-light text-white/60 leading-relaxed">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function SSRHomePage({ lang }: { lang: Lang }) {
  return (
    <div className="bg-background min-h-screen text-foreground">
      <Navigation />
      <main>
        <SSRHeroContent lang={lang} />
        <SSRWhyContent lang={lang} />
        {lang === 'de' && <SSRHomeSeoSection />}
      </main>
      <Footer />
    </div>
  );
}

// ─── Packages page SSR ────────────────────────────────────────────────────────

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
            const intFeatures = getLangField(service, 'interiorFeatures') as unknown as string[];
            const extFeatures = getLangField(service, 'exteriorFeatures') as unknown as string[];
            const allFeatures = [...(Array.isArray(intFeatures) ? intFeatures : []), ...(Array.isArray(extFeatures) ? extFeatures : [])];
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
                <ul className="mb-4 space-y-1">
                  {allFeatures.slice(0, 6).map((f: string) => (
                    <li key={f} className="flex items-start gap-2 text-xs font-light text-white/60">
                      <Check className="h-3 w-3 text-[#c9a553] shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
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

// ─── German-only SEO pages SSR ────────────────────────────────────────────────

function SSRLeistungenPage() {
  return (
    <div className="bg-background min-h-screen text-foreground">
      <Navigation />
      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
        <SSRBreadcrumb items={[{ label: 'RCC Royal Car Cleaning', href: '/de/' }, { label: 'Leistungen' }]} />
        <header className="mb-12">
          <p className="mb-3 text-xs uppercase tracking-widest text-[#c9a553]">Mobile Autopflege Schweiz</p>
          <h1 className="text-3xl font-semibold uppercase text-white mb-4">Mobile Autoreinigung in der Schweiz</h1>
          <p className="text-sm font-light text-white/60 leading-relaxed max-w-xl">
            RCC bietet professionelle mobile Fahrzeugreinigung in der ganzen Schweiz. Wählen Sie den Bereich, der für Ihr Fahrzeug jetzt zählt.
          </p>
        </header>
        <nav aria-label="Leistungsübersicht">
          <ul className="grid gap-4 sm:grid-cols-2">
            {[
              { href: '/de/leistungen/mobile-autoreinigung/', label: 'Mobile Autoreinigung', desc: 'Reinigung direkt bei Ihnen vor Ort in der Schweiz.' },
              { href: '/de/leistungen/innenreinigung/', label: 'Innenreinigung', desc: 'Fahrgastraum, Sitze, Armaturenbrett und mehr.' },
              { href: '/de/leistungen/aussenreinigung/', label: 'Aussenreinigung', desc: 'Handwäsche, Felgen, Scheiben und Karosseriepflege.' },
              { href: '/de/leistungen/fahrzeugaufbereitung/', label: 'Fahrzeugaufbereitung', desc: 'Komplettreinigung Innen & Aussen.' },
            ].map((item) => (
              <li key={item.href}>
                <a href={item.href} className="block border border-white/10 bg-[#090909] p-6 hover:border-[#c9a553]/50">
                  <h2 className="text-base font-semibold uppercase text-white mb-2">{item.label}</h2>
                  <p className="text-sm font-light text-white/55">{item.desc}</p>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-8">
          <a href="/de/pakete/" className="inline-flex items-center gap-2 border border-[#c9a553]/50 px-6 py-3 text-xs uppercase tracking-widest text-[#c9a553]">
            Pakete & Preise ansehen <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function SSRServiceDetailPage({
  breadcrumb,
  h1,
  eyebrow,
  lead,
  coverage,
  category,
  faqs,
}: {
  breadcrumb: Array<{ label: string; href?: string }>;
  h1: string;
  eyebrow: string;
  lead: string;
  coverage: string[];
  category: 'inside-outside' | 'interior' | 'exterior';
  faqs: Array<{ q: string; a: string }>;
}) {
  const services = STATIC_SERVICES.filter((s) => s.category === category);
  return (
    <div className="bg-background min-h-screen text-foreground">
      <Navigation />
      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
        <SSRBreadcrumb items={breadcrumb} />
        <header className="mb-12 max-w-2xl">
          <p className="mb-3 text-xs uppercase tracking-widest text-[#c9a553]">{eyebrow}</p>
          <h1 className="text-3xl font-semibold uppercase text-white mb-4 whitespace-pre-line">{h1}</h1>
          <p className="text-sm font-light text-white/60 leading-relaxed">{lead}</p>
        </header>

        <section className="mb-10">
          <h2 className="text-lg font-semibold uppercase text-white mb-4">Was ist enthalten</h2>
          <ul className="grid sm:grid-cols-2 gap-2">
            {coverage.map((item) => (
              <li key={item} className="flex items-center gap-2 border border-white/10 bg-[#090909] px-4 py-3 text-sm font-light text-white/70">
                <Check className="h-3.5 w-3.5 text-[#c9a553] shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold uppercase text-white mb-4">Unsere Pakete</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {services.map((service) => {
              const allFeatures = [
                ...(service.interiorFeaturesDE as readonly string[]),
                ...(service.exteriorFeaturesDE as readonly string[]),
              ];
              return (
                <article key={service.id} className={`border p-6 ${service.level === 'premium' ? 'border-[#c9a553]/50' : 'border-white/10'} bg-[#090909]`}>
                  <h3 className="text-base font-semibold uppercase text-white mb-2">{service.nameDE}</h3>
                  <p className="text-sm font-light text-white/55 mb-4">{service.descriptionDE}</p>
                  <ul className="space-y-1 mb-4">
                    {allFeatures.slice(0, 6).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs font-light text-white/60">
                        <Check className="h-3 w-3 text-[#c9a553] shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-[#c9a553]">Ab CHF {Math.min(...Object.values(service.prices))}</p>
                </article>
              );
            })}
          </div>
        </section>

        {faqs.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold uppercase text-white mb-4">Häufige Fragen</h2>
            <dl className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.q} className="border border-white/10 bg-[#090909] px-6 py-5">
                  <dt className="text-sm font-medium text-white mb-2">{faq.q}</dt>
                  <dd className="text-sm font-light text-white/60 leading-relaxed">{faq.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <a href="/de/#quote" className="inline-flex items-center gap-2 bg-[#c9a553] text-black px-8 py-4 text-xs font-bold uppercase tracking-widest">
            Offerte anfragen <ArrowUpRight className="w-4 h-4" />
          </a>
          <a href="/de/pakete/" className="inline-flex items-center gap-2 border border-white/20 text-white/70 px-8 py-4 text-xs font-medium uppercase tracking-widest">
            Alle Pakete ansehen
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function SSRMobileAutoreinigungPage() {
  return (
    <SSRServiceDetailPage
      breadcrumb={[
        { label: 'RCC Royal Car Cleaning', href: '/de/' },
        { label: 'Leistungen', href: '/de/leistungen/' },
        { label: 'Mobile Autoreinigung' },
      ]}
      h1={'Mobile Autoreinigung\nin der Schweiz'}
      eyebrow="RCC Mobile Autopflege Schweiz"
      lead="RCC kommt mit dem vollständigen Reinigungsequipment direkt zu Ihrem Fahrzeug — ob zu Hause, am Arbeitsplatz oder an einem anderen Ort in der Schweiz."
      coverage={['Reinigung direkt bei Ihnen vor Ort', 'Innenreinigung und Aussenreinigung', 'Komplettreinigung Innen & Aussen', 'Alle Fahrzeugtypen', 'Equipment wird mitgebracht']}
      category="inside-outside"
      faqs={[
        { q: 'Was ist mobile Autoreinigung?', a: 'Das RCC-Team kommt mit dem gesamten professionellen Equipment direkt zu Ihrem Fahrzeug — zu Ihnen nach Hause, an Ihren Arbeitsplatz oder einen anderen Ort.' },
        { q: 'In welchen Regionen ist RCC tätig?', a: 'RCC ist in der ganzen Schweiz im Einsatz. Bitte kontaktieren Sie uns für eine Bestätigung Ihres Standorts.' },
        { q: 'Welche Fahrzeugtypen werden gereinigt?', a: 'Kleinwagen, Kompakt- und Mittelklassefahrzeuge, SUV sowie Vans und 7-Sitzer.' },
      ]}
    />
  );
}

function SSRInnenreinigungPage() {
  return (
    <SSRServiceDetailPage
      breadcrumb={[
        { label: 'RCC Royal Car Cleaning', href: '/de/' },
        { label: 'Leistungen', href: '/de/leistungen/' },
        { label: 'Innenreinigung' },
      ]}
      h1={'Innenreinigung\nfür Ihr Fahrzeug'}
      eyebrow="Autoinnenreinigung Schweiz"
      lead="Professionelle Innenreinigung für Ihren Fahrzeuginnenraum. RCC reinigt Fahrgastraum, Sitze, Armaturenbrett, Türverkleidungen und Fussmatten — mobil in der Schweiz."
      coverage={['Fahrgastraum und Kofferraum saugen', 'Fussmatten saugen', 'Armaturenbrett feucht abwischen', 'Türen und Türinnenkanten reinigen', 'Lederausstattung feucht abwischen', 'Scheiben innen reinigen', 'Fussmatten shampoonieren (Premium)']}
      category="interior"
      faqs={[
        { q: 'Was umfasst die Innenreinigung?', a: 'Saugen des Fahrgastraums, Reinigen der Scheiben innen, Abwischen von Armaturenbrett, Türverkleidungen und Lederausstattung sowie Reinigung der Fussmatten.' },
        { q: 'Was bietet das Premium-Paket zusätzlich?', a: 'Intensive Fussmattenreinigung mit Shampoo sowie detaillierte Reinigung von Cockpit und Türen mit Bürste.' },
      ]}
    />
  );
}

function SSRAussenreinigungPage() {
  return (
    <SSRServiceDetailPage
      breadcrumb={[
        { label: 'RCC Royal Car Cleaning', href: '/de/' },
        { label: 'Leistungen', href: '/de/leistungen/' },
        { label: 'Aussenreinigung' },
      ]}
      h1={'Professionelle\nAussenreinigung'}
      eyebrow="Autoaussenreinigung Schweiz"
      lead="Sorgfältige Aussenpflege für Ihr Fahrzeug: detaillierte Handwäsche, Glanzpolitur, Felgenreinigung und Scheibenreinigung von Hand — mobil in der Schweiz."
      coverage={['Detaillierte Handwäsche', 'Glanzpolitur von Hand', 'Seitenscheiben aussen reinigen', 'Felgen reinigen', 'Tankdeckel reinigen', 'Reifen reinigen (Premium)', 'Insektenreste entfernen (Premium)']}
      category="exterior"
      faqs={[
        { q: 'Was umfasst die Aussenreinigung?', a: 'Detaillierte Handwäsche, Glanzpolitur von Hand, Reinigung der Seitenscheiben aussen, Felgenreinigung, Reinigung des Tankdeckels und sorgfältiges Trocknen.' },
        { q: 'Was bietet das Premium-Paket zusätzlich?', a: 'Reifenreinigung, Reifenglanzpflege und Entfernen von anhaftenden Insektenresten vom Lack.' },
      ]}
    />
  );
}

function SSRFahrzeugaufbereitungPage() {
  return (
    <SSRServiceDetailPage
      breadcrumb={[
        { label: 'RCC Royal Car Cleaning', href: '/de/' },
        { label: 'Leistungen', href: '/de/leistungen/' },
        { label: 'Fahrzeugaufbereitung' },
      ]}
      h1={'Professionelle\nFahrzeugaufbereitung'}
      eyebrow="Komplettreinigung Schweiz"
      lead="Vollständige Fahrzeugaufbereitung von RCC: Innen- und Aussenreinigung in einem kombinierten Paket — professionelle Rundum-Pflege mobil in der Schweiz."
      coverage={['Komplette Innenreinigung', 'Komplette Aussenreinigung', 'Handwäsche und Glanzpolitur', 'Fahrgastraum und Kofferraum', 'Felgen und Scheiben', 'Intensive Fussmattenreinigung (Premium)']}
      category="inside-outside"
      faqs={[
        { q: 'Was ist Fahrzeugaufbereitung?', a: 'Die Fahrzeugaufbereitung umfasst die vollständige Innen- und Aussenreinigung in einem kombinierten Paket.' },
        { q: 'Was kostet eine Komplettaufbereitung?', a: 'Innen & Aussen Basic: CHF 170 bis 320. Innen & Aussen Premium: CHF 200 bis 400. Je nach Fahrzeuggrösse.' },
      ]}
    />
  );
}

function SSREinsatzgebietPage() {
  const CANTONS = [
    'Aargau', 'Appenzell Ausserrhoden', 'Appenzell Innerrhoden',
    'Basel-Landschaft', 'Basel-Stadt', 'Bern',
    'Fribourg', 'Genève', 'Glarus',
    'Graubünden', 'Jura', 'Luzern',
    'Neuchâtel', 'Nidwalden', 'Obwalden',
    'Schaffhausen', 'Schwyz', 'Solothurn',
    'St. Gallen', 'Thurgau', 'Ticino',
    'Uri', 'Valais', 'Vaud',
    'Zug', 'Zürich',
  ];
  return (
    <div className="bg-background min-h-screen text-foreground">
      <Navigation />
      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
        <SSRBreadcrumb items={[{ label: 'RCC Royal Car Cleaning', href: '/de/' }, { label: 'Einsatzgebiet' }]} />
        <header className="mb-12 max-w-2xl">
          <p className="mb-3 text-xs uppercase tracking-widest text-[#c9a553]">Mobile Autopflege Schweiz</p>
          <h1 className="text-3xl font-semibold uppercase text-white mb-4">Unser Einsatzgebiet</h1>
          <p className="text-sm font-light text-white/60 leading-relaxed">
            RCC Mobile Autopflege ist in der ganzen Schweiz im Einsatz. Wir kommen in alle 26 Kantone direkt zu Ihrem Fahrzeug.
          </p>
        </header>
        <section className="mb-12">
          <h2 className="text-lg font-semibold uppercase text-white mb-6">Alle 26 Kantone</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {CANTONS.map((canton) => (
              <li key={canton} className="flex items-center gap-2 border border-white/10 bg-[#090909] px-3 py-2 text-xs font-light text-white/55">
                <MapPin className="h-3 w-3 text-[#c9a553]/60 shrink-0" />
                {canton}
              </li>
            ))}
          </ul>
        </section>
        <section className="mb-12 border border-[#c9a553]/20 bg-[#c9a553]/[0.04] px-8 py-8">
          <h2 className="text-xl font-semibold uppercase text-white mb-3">Mobile Autoreinigung Zürich</h2>
          <p className="text-sm font-light text-white/60 mb-6">Zürich ist eines unserer Haupteinsatzgebiete.</p>
          <a href="/de/mobile-autoreinigung/zuerich/" className="inline-flex items-center gap-2 bg-[#c9a553] text-black px-6 py-3 text-xs font-bold uppercase tracking-widest">
            Zürich-Seite <ArrowUpRight className="w-4 h-4" />
          </a>
        </section>
        <div>
          <a href="/de/#quote" className="inline-flex items-center gap-2 bg-[#c9a553] text-black px-8 py-4 text-xs font-bold uppercase tracking-widest">
            Offerte anfragen <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function SSRZuerichPage() {
  const services = STATIC_SERVICES.filter((s) => s.category === 'inside-outside');
  const faqs = [
    { q: 'Bietet RCC mobile Autoreinigung in Zürich an?', a: 'Ja, RCC bietet professionelle mobile Autoreinigung im Raum Zürich an.' },
    { q: 'Welche Pakete sind in Zürich verfügbar?', a: 'Alle RCC-Pakete: Innenreinigung, Aussenreinigung und Komplettreinigung, jeweils Basic und Premium.' },
    { q: 'Wie buche ich eine Autoreinigung in Zürich?', a: 'Nutzen Sie das Offertformular oder kontaktieren Sie uns per Telefon oder WhatsApp.' },
    { q: 'Welche Stadtteile in Zürich werden bedient?', a: 'Wir sind im gesamten Stadtgebiet Zürich sowie in der Agglomeration tätig.' },
  ];
  return (
    <div className="bg-background min-h-screen text-foreground">
      <Navigation />
      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
        <SSRBreadcrumb items={[
          { label: 'RCC Royal Car Cleaning', href: '/de/' },
          { label: 'Mobile Autoreinigung', href: '/de/leistungen/mobile-autoreinigung/' },
          { label: 'Zürich' },
        ]} />
        <header className="mb-12 max-w-2xl">
          <p className="mb-3 text-xs uppercase tracking-widest text-[#c9a553]">Autopflege Zürich</p>
          <h1 className="text-3xl font-semibold uppercase text-white mb-4">Mobile Autoreinigung in Zürich</h1>
          <p className="text-sm font-light text-white/60 leading-relaxed max-w-xl">
            Professionelle mobile Autoreinigung, Fahrzeugpflege und Autopflege im Raum Zürich. RCC kommt direkt zu Ihnen.
          </p>
        </header>

        <section className="mb-10">
          <h2 className="text-lg font-semibold uppercase text-white mb-4">Pakete für Zürich</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {services.map((service) => {
              const allFeatures = [
                ...(service.interiorFeaturesDE as readonly string[]),
                ...(service.exteriorFeaturesDE as readonly string[]),
              ];
              return (
                <article key={service.id} className={`border p-6 ${service.level === 'premium' ? 'border-[#c9a553]/50' : 'border-white/10'} bg-[#090909]`}>
                  <h3 className="text-base font-semibold uppercase text-white mb-2">{service.nameDE}</h3>
                  <p className="text-sm font-light text-white/55 mb-4">{service.descriptionDE}</p>
                  <ul className="space-y-1 mb-4">
                    {allFeatures.slice(0, 6).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs font-light text-white/60">
                        <Check className="h-3 w-3 text-[#c9a553] shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-[#c9a553]">Ab CHF {Math.min(...Object.values(service.prices))}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold uppercase text-white mb-4">Häufige Fragen — Autoreinigung Zürich</h2>
          <dl className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="border border-white/10 bg-[#090909] px-6 py-5">
                <dt className="text-sm font-medium text-white mb-2">{faq.q}</dt>
                <dd className="text-sm font-light text-white/60 leading-relaxed">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="flex flex-col sm:flex-row gap-4">
          <a href="/de/#quote" className="inline-flex items-center gap-2 bg-[#c9a553] text-black px-8 py-4 text-xs font-bold uppercase tracking-widest">
            Offerte anfragen <ArrowUpRight className="w-4 h-4" />
          </a>
          <a href="/de/pakete/" className="inline-flex items-center gap-2 border border-white/20 text-white/70 px-8 py-4 text-xs font-medium uppercase tracking-widest">
            Alle Pakete ansehen
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ─── SSR stubs for corporate pages ───────────────────────────────────────────

function SSRContactPage() {
  return (
    <div className="bg-background min-h-screen text-foreground">
      <Navigation />
      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
        <header className="mb-12">
          <p className="mb-3 text-xs uppercase tracking-widest text-[#c9a553]">Kontakt / Contact</p>
          <h1 className="text-3xl font-semibold uppercase text-white mb-4">RCC Royal Car Cleaning</h1>
          <p className="text-sm font-light text-white/60 leading-relaxed">
            {BUSINESS.phone.display} — {BUSINESS.email.display}
          </p>
          <p className="text-sm font-light text-white/60 mt-2">{BUSINESS.address.formatted}</p>
        </header>
      </main>
      <Footer />
    </div>
  );
}

function SSRAboutPage() {
  return (
    <div className="bg-background min-h-screen text-foreground">
      <Navigation />
      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
        <header className="mb-12">
          <p className="mb-3 text-xs uppercase tracking-widest text-[#c9a553]">About / Über uns</p>
          <h1 className="text-3xl font-semibold uppercase text-white mb-4">RCC Royal Car Cleaning</h1>
          <p className="text-sm font-light text-white/60 leading-relaxed max-w-xl">
            Professioneller mobiler Fahrzeugreinigungsservice in der Schweiz. Service de nettoyage automobile mobile professionnel en Suisse.
          </p>
        </header>
      </main>
      <Footer />
    </div>
  );
}

function SSRFaqPage() {
  const faqs = [
    { q: 'Was ist mobile Autoreinigung? / What is mobile car cleaning?', a: 'RCC kommt mit dem Equipment direkt zu Ihrem Fahrzeug — zu Hause, am Arbeitsplatz oder an einem anderen Ort in der Schweiz.' },
    { q: 'In welchen Regionen ist RCC tätig?', a: 'RCC ist in der ganzen Schweiz im Einsatz und bedient alle 26 Kantone.' },
    { q: 'Wie buche ich?', a: 'Nutzen Sie das Offertformular auf unserer Website oder kontaktieren Sie uns direkt per Telefon oder WhatsApp.' },
  ];
  return (
    <div className="bg-background min-h-screen text-foreground">
      <Navigation />
      <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto" itemScope itemType="https://schema.org/FAQPage">
        <header className="mb-12">
          <h1 className="text-3xl font-semibold uppercase text-white mb-4">FAQ</h1>
        </header>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-white/10 bg-[#090909] p-6" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h2 className="text-sm font-semibold text-white mb-3" itemProp="name">{faq.q}</h2>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p className="text-sm font-light text-white/60" itemProp="text">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ─── SSR App router ───────────────────────────────────────────────────────────

/**
 * SSRApp renders the correct localized page component for each URL.
 *
 * All components imported above use useTranslation() which reads lang from
 * LanguageProvider → useLocation() → Wouter's hook (which is set to the
 * current URL by the prerender `render(url)` call).
 *
 * This means every EN/FR route automatically renders in its declared language
 * without any hardcoded German content.
 */
function SSRApp({ lang: _lang }: { lang: Lang }) {
  return (
    <Switch>
      {/* ── German ── */}
      <Route path="/de/"                                      component={HomePage} />
      <Route path="/de/pakete/"                               component={ServicesPage} />
      <Route path="/de/leistungen/"                           component={LeistungenPage} />
      <Route path="/de/leistungen/mobile-autoreinigung/"      component={MobileAutoreinigungPage} />
      <Route path="/de/leistungen/innenreinigung/"            component={InnenreinigungPage} />
      <Route path="/de/leistungen/aussenreinigung/"           component={AussenreinigungPage} />
      <Route path="/de/leistungen/fahrzeugaufbereitung/"      component={FahrzeugaufbereitungPage} />
      <Route path="/de/einsatzgebiet/"                        component={EinsatzgebietPage} />
      <Route path="/de/mobile-autoreinigung/zuerich/"         component={ZuerichPage} />
      <Route path="/de/kontakt/"                              component={ContactPage} />
      <Route path="/de/ueber-uns/"                            component={AboutPage} />
      <Route path="/de/faq/"                                  component={FaqPage} />

      {/* ── English ── */}
      <Route path="/en/"                                      component={HomePage} />
      <Route path="/en/packages/"                             component={ServicesPage} />
      <Route path="/en/services/"                             component={LeistungenPage} />
      <Route path="/en/services/mobile-car-cleaning/"         component={MobileAutoreinigungPage} />
      <Route path="/en/services/interior-cleaning/"           component={InnenreinigungPage} />
      <Route path="/en/services/exterior-cleaning/"           component={AussenreinigungPage} />
      <Route path="/en/services/car-detailing/"               component={FahrzeugaufbereitungPage} />
      <Route path="/en/service-area/"                         component={EinsatzgebietPage} />
      <Route path="/en/mobile-car-cleaning/zurich/"           component={ZuerichPage} />
      <Route path="/en/contact/"                              component={ContactPage} />
      <Route path="/en/about/"                                component={AboutPage} />
      <Route path="/en/faq/"                                  component={FaqPage} />

      {/* ── French ── */}
      <Route path="/fr/"                                      component={HomePage} />
      <Route path="/fr/forfaits/"                             component={ServicesPage} />
      <Route path="/fr/prestations/"                          component={LeistungenPage} />
      <Route path="/fr/prestations/nettoyage-voiture-mobile/" component={MobileAutoreinigungPage} />
      <Route path="/fr/prestations/nettoyage-interieur/"      component={InnenreinigungPage} />
      <Route path="/fr/prestations/nettoyage-exterieur/"      component={AussenreinigungPage} />
      <Route path="/fr/prestations/preparation-vehicule/"     component={FahrzeugaufbereitungPage} />
      <Route path="/fr/zones-desservies/"                     component={EinsatzgebietPage} />
      <Route path="/fr/nettoyage-voiture-mobile/zurich/"      component={ZuerichPage} />
      <Route path="/fr/contact/"                              component={ContactPage} />
      <Route path="/fr/a-propos/"                             component={AboutPage} />
      <Route path="/fr/faq/"                                  component={FaqPage} />

      {/* Fallback */}
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
  const lang = detectLangFromPath(url);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { staleTime: Infinity, retry: false, refetchOnMount: false },
    },
  });

  queryClient.setQueryData(['services'], STATIC_SERVICES);

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
