import { useTranslation } from '@/i18n/LanguageContext';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { BUSINESS } from '@/seo/businessData';

const COPY = {
  de: {
    heading: '404',
    title: 'Seite nicht gefunden',
    body: 'Die gesuchte Seite existiert nicht oder wurde verschoben.',
    cta: 'Zur Startseite',
    hint: 'Haben Sie Fragen? Kontaktieren Sie uns:',
  },
  en: {
    heading: '404',
    title: 'Page Not Found',
    body: 'The page you are looking for does not exist or has been moved.',
    cta: 'Go to Homepage',
    hint: 'Any questions? Contact us:',
  },
  fr: {
    heading: '404',
    title: 'Page introuvable',
    body: "La page que vous recherchez n'existe pas ou a été déplacée.",
    cta: "Aller à l'accueil",
    hint: 'Des questions ? Contactez-nous :',
  },
};

export default function NotFound() {
  const { lang, getLangRoute } = useTranslation();
  const copy = COPY[lang];
  const homePath = getLangRoute('home');

  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-primary/30 selection:text-foreground">
      <Navigation />
      <main className="flex min-h-[80vh] flex-col items-center justify-center px-6 py-32 text-center">
        <div className="mb-3 flex items-center gap-3">
          <span className="h-px w-10 bg-primary" />
          <span className="text-[10px] uppercase tracking-[0.32em] text-primary">RCC Royal Car Cleaning</span>
          <span className="h-px w-10 bg-primary" />
        </div>

        <p className="mb-2 font-mono text-[6rem] font-semibold leading-none tracking-tight text-foreground/10 md:text-[10rem]">
          {copy.heading}
        </p>

        <h1 className="mb-4 text-3xl font-semibold uppercase tracking-[-0.04em] text-foreground md:text-4xl">
          {copy.title}
        </h1>

        <p className="mb-10 max-w-md text-sm font-light leading-relaxed text-foreground/50">
          {copy.body}
        </p>

        <a
          href={homePath}
          className="btn-gold-luxury mb-12 inline-flex items-center justify-center px-10 py-4 text-xs font-semibold uppercase tracking-widest text-background"
        >
          {copy.cta}
        </a>

        <div className="border-t border-white/10 pt-10">
          <p className="mb-4 text-[10px] uppercase tracking-[0.22em] text-foreground/40">{copy.hint}</p>
          <div className="flex flex-col items-center gap-2 text-sm text-foreground/50">
            <a href={BUSINESS.phone.href} className="hover:text-primary transition-colors">
              {BUSINESS.phone.display}
            </a>
            <a href={BUSINESS.email.href} className="hover:text-primary transition-colors">
              {BUSINESS.email.display}
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
