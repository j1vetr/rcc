/**
 * Contact page ,  serves DE, EN, FR.
 * DE: /de/kontakt/
 * EN: /en/contact/
 * FR: /fr/contact/
 *
 * Uses verified business data only (BUSINESS constants).
 * Reuses QuoteForm for the quote request flow.
 */

import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { FloatingAssistant } from '@/components/FloatingAssistant';
import { Breadcrumb } from '@/components/Breadcrumb';
import { QuoteForm } from '@/components/QuoteForm';
import { useTranslation } from '@/i18n/LanguageContext';
import { BUSINESS } from '@/seo/businessData';

export default function ContactPage() {
  const { t, lang } = useTranslation();
  const c = t.contact;
  const whatsappUrl = `${BUSINESS.whatsapp.url}?text=${encodeURIComponent(BUSINESS.whatsapp.messages[lang])}`;

  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-primary/30 selection:text-foreground">
      <Navigation />

      <main className="pt-32 pb-20 container mx-auto px-5 sm:px-6 lg:px-12">
        <Breadcrumb
          items={[
            { label: 'RCC Royal Car Cleaning', href: `/${lang}/` },
            { label: lang === 'de' ? 'Kontakt' : 'Contact' },
          ]}
        />

        <header className="mb-16 max-w-2xl">
          <span className="mb-4 block text-[10px] uppercase tracking-[0.32em] text-primary">
            {c.eyebrow}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold uppercase leading-[0.95] tracking-[-0.04em] text-foreground mb-6">
            {c.h1}
          </h1>
          <p className="text-sm md:text-base font-light text-foreground/55 leading-relaxed max-w-xl">
            {c.intro}
          </p>
        </header>

        <div className="grid lg:grid-cols-[1fr_400px] gap-12 lg:gap-20 mb-20">
          {/* Direct contact info */}
          <section aria-label={c.directTitle}>
            <h2 className="text-xl font-semibold uppercase tracking-[-0.025em] text-foreground mb-8">
              {c.directTitle}
            </h2>

            <div className="space-y-6">
              {/* WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-5 border border-white/10 bg-[#090909] p-5 hover:border-primary/40 transition-colors group"
              >
                <div className="flex h-10 w-10 items-center justify-center bg-[#25D366]/10 border border-[#25D366]/30 shrink-0">
                  <FaWhatsapp className="h-5 w-5 text-[#25D366]" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-foreground/40 mb-1">{c.whatsappLabel}</p>
                  <p className="text-base font-light text-foreground group-hover:text-primary transition-colors">
                    {BUSINESS.phone.display}
                  </p>
                  <p className="text-xs font-light text-foreground/40 mt-1">{c.whatsappDesc}</p>
                </div>
              </a>

              {/* Phone */}
              <a
                href={BUSINESS.phone.href}
                className="flex items-start gap-5 border border-white/10 bg-[#090909] p-5 hover:border-primary/40 transition-colors group"
              >
                <div className="flex h-10 w-10 items-center justify-center bg-primary/10 border border-primary/20 shrink-0">
                  <Phone className="h-4 w-4 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-foreground/40 mb-1">{c.phoneDesc}</p>
                  <p className="text-base font-light text-foreground group-hover:text-primary transition-colors">
                    {BUSINESS.phone.display}
                  </p>
                </div>
              </a>

              {/* Email */}
              <a
                href={BUSINESS.email.href}
                className="flex items-start gap-5 border border-white/10 bg-[#090909] p-5 hover:border-primary/40 transition-colors group"
              >
                <div className="flex h-10 w-10 items-center justify-center bg-primary/10 border border-primary/20 shrink-0">
                  <Mail className="h-4 w-4 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-foreground/40 mb-1">{c.emailDesc}</p>
                  <p className="text-base font-light text-foreground group-hover:text-primary transition-colors break-all">
                    {BUSINESS.email.display}
                  </p>
                </div>
              </a>

              {/* Address */}
              <a
                href={BUSINESS.address.mapsHref}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-5 border border-white/10 bg-[#090909] p-5 hover:border-primary/40 transition-colors group"
              >
                <div className="flex h-10 w-10 items-center justify-center bg-primary/10 border border-primary/20 shrink-0">
                  <MapPin className="h-4 w-4 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-foreground/40 mb-1">{c.addressDesc}</p>
                  <p className="text-base font-light text-foreground group-hover:text-primary transition-colors leading-relaxed">
                    {BUSINESS.address.formatted}
                  </p>
                </div>
              </a>

              {/* Service area note */}
              <div className="border border-primary/20 bg-primary/[0.04] p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-primary mb-2">{c.serviceAreaLabel}</p>
                <p className="text-sm font-light text-foreground/60 leading-relaxed">{c.serviceAreaText}</p>
              </div>
            </div>
          </section>

          {/* Placeholder for form info */}
          <aside>
            <h2 className="text-xl font-semibold uppercase tracking-[-0.025em] text-foreground mb-8">
              {c.formTitle}
            </h2>
            <p className="text-sm font-light text-foreground/50 leading-relaxed mb-6">
              {t.quote.subtitle}
            </p>
            <a
              href={`/${lang}/#quote`}
              className="inline-flex items-center gap-3 bg-primary px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-background hover:bg-[#ebcc7b] transition-colors w-full justify-center"
            >
              {t.quote.form.submit}
            </a>
          </aside>
        </div>

        {/* Full quote form */}
        <QuoteForm />
      </main>

      <Footer />
      <FloatingAssistant />
    </div>
  );
}
