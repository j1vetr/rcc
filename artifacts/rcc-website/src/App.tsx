import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
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
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { LanguageProvider } from '@/i18n/LanguageContext';
import { SeoHead } from '@/components/SeoHead';

const queryClient = new QueryClient();

/** Client-side redirect component. */
function Redirect({ to }: { to: string }) {
  if (typeof window !== 'undefined') {
    window.history.replaceState(null, '', to);
    window.location.replace(to);
  }
  return null;
}

function Router() {
  return (
    <>
      <SeoHead />
      <Switch>
        {/* Root → /de/ (deterministic, no JS-detection) */}
        <Route path="/">
          <Redirect to="/de/" />
        </Route>

        {/* ── German routes ── */}
        <Route path="/de/" component={HomePage} />
        <Route path="/de/pakete/" component={ServicesPage} />
        <Route path="/de/leistungen/" component={LeistungenPage} />
        <Route path="/de/leistungen/mobile-autoreinigung/" component={MobileAutoreinigungPage} />
        <Route path="/de/leistungen/innenreinigung/" component={InnenreinigungPage} />
        <Route path="/de/leistungen/aussenreinigung/" component={AussenreinigungPage} />
        <Route path="/de/leistungen/fahrzeugaufbereitung/" component={FahrzeugaufbereitungPage} />
        <Route path="/de/einsatzgebiet/" component={EinsatzgebietPage} />
        <Route path="/de/mobile-autoreinigung/zuerich/" component={ZuerichPage} />
        <Route path="/de/kontakt/" component={ContactPage} />
        <Route path="/de/ueber-uns/" component={AboutPage} />
        <Route path="/de/faq/" component={FaqPage} />

        {/* ── English routes ── */}
        <Route path="/en/" component={HomePage} />
        <Route path="/en/packages/" component={ServicesPage} />
        <Route path="/en/services/" component={LeistungenPage} />
        <Route path="/en/services/mobile-car-cleaning/" component={MobileAutoreinigungPage} />
        <Route path="/en/services/interior-cleaning/" component={InnenreinigungPage} />
        <Route path="/en/services/exterior-cleaning/" component={AussenreinigungPage} />
        <Route path="/en/services/car-detailing/" component={FahrzeugaufbereitungPage} />
        <Route path="/en/service-area/" component={EinsatzgebietPage} />
        <Route path="/en/mobile-car-cleaning/zurich/" component={ZuerichPage} />
        <Route path="/en/contact/" component={ContactPage} />
        <Route path="/en/about/" component={AboutPage} />
        <Route path="/en/faq/" component={FaqPage} />

        {/* ── French routes ── */}
        <Route path="/fr/" component={HomePage} />
        <Route path="/fr/forfaits/" component={ServicesPage} />
        <Route path="/fr/prestations/" component={LeistungenPage} />
        <Route path="/fr/prestations/nettoyage-voiture-mobile/" component={MobileAutoreinigungPage} />
        <Route path="/fr/prestations/nettoyage-interieur/" component={InnenreinigungPage} />
        <Route path="/fr/prestations/nettoyage-exterieur/" component={AussenreinigungPage} />
        <Route path="/fr/prestations/preparation-vehicule/" component={FahrzeugaufbereitungPage} />
        <Route path="/fr/zones-desservies/" component={EinsatzgebietPage} />
        <Route path="/fr/nettoyage-voiture-mobile/zurich/" component={ZuerichPage} />
        <Route path="/fr/contact/" component={ContactPage} />
        <Route path="/fr/a-propos/" component={AboutPage} />
        <Route path="/fr/faq/" component={FaqPage} />

        {/* Legacy redirect — old German-only URL */}
        <Route path="/dienstleistungen">
          <Redirect to="/de/pakete/" />
        </Route>

        {/* 404 */}
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <LanguageProvider>
            <Router />
          </LanguageProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
