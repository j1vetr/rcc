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
import CityPage from '@/pages/CityPage';
import FirmenkundenPage from '@/pages/FirmenkundenPage';
import ContactPage from '@/pages/ContactPage';
import AboutPage from '@/pages/AboutPage';
import FaqPage from '@/pages/FaqPage';
import RatgeberHubPage from '@/pages/RatgeberHubPage';
import AutoInnenreinigungPage from '@/pages/guides/AutoInnenreinigungPage';
import AutoaufbereitungKostenPage from '@/pages/guides/AutoaufbereitungKostenPage';
import AutoLeasingRueckgabePage from '@/pages/guides/AutoLeasingRueckgabePage';
import AutopflegeWinterPage from '@/pages/guides/AutopflegeWinterPage';
import InnenreinigungLederStoffPage from '@/pages/guides/InnenreinigungLederStoffPage';
import WieOftAutoReinigenPage from '@/pages/guides/WieOftAutoReinigenPage';
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
        <Route path="/de/mobile-autoreinigung/zuerich/">{() => <CityPage cityRouteKey="mobile-autoreinigung/zuerich" />}</Route>
        <Route path="/de/mobile-autoreinigung/winterthur/">{() => <CityPage cityRouteKey="mobile-autoreinigung/winterthur" />}</Route>
        <Route path="/de/mobile-autoreinigung/zug/">{() => <CityPage cityRouteKey="mobile-autoreinigung/zug" />}</Route>
        <Route path="/de/mobile-autoreinigung/luzern/">{() => <CityPage cityRouteKey="mobile-autoreinigung/luzern" />}</Route>
        <Route path="/de/mobile-autoreinigung/basel/">{() => <CityPage cityRouteKey="mobile-autoreinigung/basel" />}</Route>
        <Route path="/de/mobile-autoreinigung/bern/">{() => <CityPage cityRouteKey="mobile-autoreinigung/bern" />}</Route>
        <Route path="/de/mobile-autoreinigung/st-gallen/">{() => <CityPage cityRouteKey="mobile-autoreinigung/st-gallen" />}</Route>
        <Route path="/de/firmenkunden/" component={FirmenkundenPage} />
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
        <Route path="/en/mobile-car-cleaning/zurich/">{() => <CityPage cityRouteKey="mobile-autoreinigung/zuerich" />}</Route>
        <Route path="/en/mobile-car-cleaning/winterthur/">{() => <CityPage cityRouteKey="mobile-autoreinigung/winterthur" />}</Route>
        <Route path="/en/mobile-car-cleaning/zug/">{() => <CityPage cityRouteKey="mobile-autoreinigung/zug" />}</Route>
        <Route path="/en/mobile-car-cleaning/lucerne/">{() => <CityPage cityRouteKey="mobile-autoreinigung/luzern" />}</Route>
        <Route path="/en/mobile-car-cleaning/basel/">{() => <CityPage cityRouteKey="mobile-autoreinigung/basel" />}</Route>
        <Route path="/en/mobile-car-cleaning/bern/">{() => <CityPage cityRouteKey="mobile-autoreinigung/bern" />}</Route>
        <Route path="/en/mobile-car-cleaning/geneva/">{() => <CityPage cityRouteKey="mobile-autoreinigung/geneve" />}</Route>
        <Route path="/en/mobile-car-cleaning/lausanne/">{() => <CityPage cityRouteKey="mobile-autoreinigung/lausanne" />}</Route>
        <Route path="/en/business-customers/" component={FirmenkundenPage} />
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
        <Route path="/fr/nettoyage-voiture-mobile/zurich/">{() => <CityPage cityRouteKey="mobile-autoreinigung/zuerich" />}</Route>
        <Route path="/fr/nettoyage-voiture-mobile/geneve/">{() => <CityPage cityRouteKey="mobile-autoreinigung/geneve" />}</Route>
        <Route path="/fr/nettoyage-voiture-mobile/lausanne/">{() => <CityPage cityRouteKey="mobile-autoreinigung/lausanne" />}</Route>
        <Route path="/fr/clients-professionnels/" component={FirmenkundenPage} />
        <Route path="/fr/contact/" component={ContactPage} />
        <Route path="/fr/a-propos/" component={AboutPage} />
        <Route path="/fr/faq/" component={FaqPage} />

        {/* ── Ratgeber / Guides hub (trilingual) ── */}
        <Route path="/de/ratgeber/" component={RatgeberHubPage} />
        <Route path="/en/guides/" component={RatgeberHubPage} />
        <Route path="/fr/guides/" component={RatgeberHubPage} />

        {/* ── Guide: interior cleaning (trilingual) ── */}
        <Route path="/de/ratgeber/auto-innenreinigung/" component={AutoInnenreinigungPage} />
        <Route path="/en/guides/car-interior-cleaning/" component={AutoInnenreinigungPage} />
        <Route path="/fr/guides/nettoyage-interieur-voiture/" component={AutoInnenreinigungPage} />

        {/* ── Guide: winter care (trilingual) ── */}
        <Route path="/de/ratgeber/autopflege-im-winter-schweiz/" component={AutopflegeWinterPage} />
        <Route path="/en/guides/car-care-winter-switzerland/" component={AutopflegeWinterPage} />
        <Route path="/fr/guides/entretien-voiture-hiver-suisse/" component={AutopflegeWinterPage} />

        {/* ── Guide: how often (trilingual) ── */}
        <Route path="/de/ratgeber/wie-oft-auto-reinigen/" component={WieOftAutoReinigenPage} />
        <Route path="/en/guides/how-often-clean-car/" component={WieOftAutoReinigenPage} />
        <Route path="/fr/guides/frequence-nettoyage-voiture/" component={WieOftAutoReinigenPage} />

        {/* ── Guide: costs DE only ── */}
        <Route path="/de/ratgeber/autoaufbereitung-kosten-schweiz/" component={AutoaufbereitungKostenPage} />

        {/* ── Guide: leasing return DE only ── */}
        <Route path="/de/ratgeber/auto-vor-leasingrueckgabe-reinigen/" component={AutoLeasingRueckgabePage} />

        {/* ── Guide: leather and fabric DE only ── */}
        <Route path="/de/ratgeber/innenreinigung-leder-stoff/" component={InnenreinigungLederStoffPage} />

        {/* Legacy redirect ,  old German-only URL */}
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
