import { lazy, Suspense, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { AICiteBlock } from '@/components/AICiteBlock';
import { FloatingAssistant } from '@/components/FloatingAssistant';

const HowItWorks = lazy(() => import('@/components/HowItWorks').then((module) => ({ default: module.HowItWorks })));
const BeforeAfter = lazy(() => import('@/components/BeforeAfter').then((module) => ({ default: module.BeforeAfter })));
const SwitzerlandMap = lazy(() => import('@/components/SwitzerlandMap').then((module) => ({ default: module.SwitzerlandMap })));
const Services = lazy(() => import('@/components/Services').then((module) => ({ default: module.Services })));
const WhyRcc = lazy(() => import('@/components/WhyRcc').then((module) => ({ default: module.WhyRcc })));
const QuoteForm = lazy(() => import('@/components/QuoteForm').then((module) => ({ default: module.QuoteForm })));
const Footer = lazy(() => import('@/components/Footer').then((module) => ({ default: module.Footer })));

function SectionFallback() {
  return <div className="min-h-52 animate-pulse bg-background" aria-hidden="true" />;
}

export default function HomePage() {
  useEffect(() => {
    if (window.location.hash !== '#quote') return;

    // QuoteForm is lazy-loaded and upstream sections may still change height.
    // Keep aligning the quote section briefly after it appears so the target
    // remains visible once the lazy content finishes laying out.
    let attempts = 0;
    const MAX = 50;
    let settledScrolls = 0;

    const tryScroll = () => {
      const el = document.getElementById('quote');
      if (el) {
        const navOffset = 96;
        window.scrollTo({
          top: Math.max(0, window.scrollY + el.getBoundingClientRect().top - navOffset),
          behavior: settledScrolls === 0 ? 'smooth' : 'auto',
        });
        settledScrolls += 1;
        if (settledScrolls < 8) {
          timerId = window.setTimeout(tryScroll, 200);
        }
        return;
      }
      if (++attempts < MAX) {
        timerId = window.setTimeout(tryScroll, 100);
      }
    };

    let timerId = window.setTimeout(tryScroll, 100);
    return () => window.clearTimeout(timerId);
  }, []);

  const handleSelectCanton = (id: string) => {
    const event = new CustomEvent('select-canton', { detail: id });
    window.dispatchEvent(event);
  };

  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-primary/30 selection:text-foreground">
      <Navigation />
      <main>
        <Hero />
        {/* AI-citable factual block — not lazy, present in SSR/prerendered HTML */}
        <AICiteBlock />
        <Suspense fallback={<SectionFallback />}>
          <BeforeAfter />
        </Suspense>
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
      <FloatingAssistant />
    </div>
  );
}
