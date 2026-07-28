import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { CantonMap } from '@/components/CantonMap';
import { Services } from '@/components/Services';
import { QuoteForm } from '@/components/QuoteForm';
import { Testimonials } from '@/components/Testimonials';
import { WhyRcc } from '@/components/WhyRcc';
import { Footer } from '@/components/Footer';
import { LanguageProvider } from '@/i18n/LanguageContext';

export default function HomePage() {
  const handleSelectCanton = (id: string) => {
    // We already handled scrolling inside CantonMap.
    // However, if we needed to pass the canton down directly without CustomEvent we could store it here.
    // The quote form uses react-hook-form, so passing via a global store or custom event is cleaner.
    const event = new CustomEvent('select-canton', { detail: id });
    window.dispatchEvent(event);
  };

  React.useEffect(() => {
    // Connect map clicks to form prefill
    const handleCantonEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      // We will handle this in QuoteForm directly instead to avoid re-rendering whole page
    };
    window.addEventListener('select-canton', handleCantonEvent);
    return () => window.removeEventListener('select-canton', handleCantonEvent);
  }, []);

  return (
    <LanguageProvider>
      <div className="bg-[#0A0A0A] min-h-screen text-foreground selection:bg-primary selection:text-black">
        <Navigation />
        <main>
          <Hero />
          <HowItWorks />
          <CantonMap onSelectCanton={handleSelectCanton} />
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
