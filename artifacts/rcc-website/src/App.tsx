import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import HomePage from '@/pages/HomePage';
import ServicesPage from '@/pages/ServicesPage';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { LanguageProvider } from '@/i18n/LanguageContext';
import { SeoHead } from '@/components/SeoHead';

const queryClient = new QueryClient();

/** Client-side redirect component. */
function Redirect({ to }: { to: string }) {
  if (typeof window !== 'undefined') {
    // Use replaceState so root / doesn't appear in history
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

        {/* German routes */}
        <Route path="/de/" component={HomePage} />
        <Route path="/de/pakete/" component={ServicesPage} />

        {/* English routes */}
        <Route path="/en/" component={HomePage} />
        <Route path="/en/packages/" component={ServicesPage} />

        {/* French routes */}
        <Route path="/fr/" component={HomePage} />
        <Route path="/fr/forfaits/" component={ServicesPage} />

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
