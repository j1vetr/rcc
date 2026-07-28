import { lazy, Suspense } from 'react';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { LanguageProvider } from '@/i18n/LanguageContext';

const HowItWorks = lazy(() => import('@/components/HowItWorks').then((module) => ({ default: module.HowItWorks })));
const SwitzerlandMap = lazy(() => import('@/components/SwitzerlandMap').then((module) => ({ default: module.SwitzerlandMap })));
const Services = lazy(() => import('@/components/Services').then((module) => ({ default: module.Services })));
const WhyRcc = lazy(() => import('@/components/WhyRcc').then((module) => ({ default: module.WhyRcc })));
const QuoteForm = lazy(() => import('@/components/QuoteForm').then((module) => ({ default: module.QuoteForm })));
const Footer = lazy(() => import('@/components/Footer').then((module) => ({ default: module.Footer })));

function SectionFallback() {
  return <div className="min-h-52 animate-pulse bg-background" aria-hidden="true" />;
}

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
          <Suspense fallback={<SectionFallback />}>
            <HowItWorks />
            <SwitzerlandMap onSelectCanton={handleSelectCanton} />
            <Services />
            <WhyRcc />
            <QuoteForm />
          </Suspense>
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    </LanguageProvider>
  );
}
