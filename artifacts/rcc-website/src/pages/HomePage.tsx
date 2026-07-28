import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { SwitzerlandMap } from '@/components/SwitzerlandMap';
import { Services } from '@/components/Services';
import { QuoteForm } from '@/components/QuoteForm';
import { Testimonials } from '@/components/Testimonials';
import { WhyRcc } from '@/components/WhyRcc';
import { Footer } from '@/components/Footer';
import { LanguageProvider } from '@/i18n/LanguageContext';

export default function HomePage() {
  const handleSelectCanton = (id: string) => {
    const event = new CustomEvent('select-canton', { detail: id });
    window.dispatchEvent(event);
  };

  return (
    <LanguageProvider>
      <div className="bg-background min-h-screen text-foreground selection:bg-primary/30 selection:text-foreground">
        <Navigation />
        <main>
          <Hero />
          <HowItWorks />
          <SwitzerlandMap onSelectCanton={handleSelectCanton} />
          <Services />
          <WhyRcc />
          <Testimonials />
          <QuoteForm />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
