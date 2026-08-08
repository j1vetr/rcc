/**
 * FAQ page — serves DE, EN, FR with visible FAQPage schema.
 * DE: /de/faq/
 * EN: /en/faq/
 * FR: /fr/faq/
 *
 * Content based on real operational facts only.
 * FAQPage JSON-LD is injected via metadata registry (SeoHead / prerender).
 */

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { FloatingAssistant } from '@/components/FloatingAssistant';
import { Breadcrumb } from '@/components/Breadcrumb';
import { useTranslation } from '@/i18n/LanguageContext';
import type { Lang } from '@/seo/routes';

// FAQ content per language — real operational questions only
const FAQ_CONTENT: Record<Lang, Array<{ question: string; answer: string }>> = {
  de: [
    { question: 'Was ist mobile Autoreinigung?', answer: 'Mobile Autoreinigung bedeutet, dass das RCC-Team mit dem professionellen Equipment direkt zu Ihrem Fahrzeug kommt — zu Hause, am Arbeitsplatz oder an einem anderen Ort in der Schweiz. Sie müssen Ihr Fahrzeug nirgendwo hinbringen.' },
    { question: 'In welchen Regionen der Schweiz ist RCC tätig?', answer: 'RCC ist vorwiegend im Kanton Zürich und der Umgebung tätig. Bitte nehmen Sie Kontakt auf oder nutzen Sie das Offertformular, damit wir Ihren Standort bestätigen können.' },
    { question: 'Welche Fahrzeugtypen werden gereinigt?', answer: 'RCC reinigt alle gängigen Fahrzeugtypen: Kleinwagen (S), Kompakt- und Mittelklassefahrzeuge (M), SUV (L) sowie grosse Fahrzeuge wie Vans und 7-Sitzer (XL). Die Fahrzeuggrösse bestimmt den Paketpreis.' },
    { question: 'Wie buche ich eine mobile Autoreinigung?', answer: 'Nutzen Sie das Offertformular auf unserer Website oder kontaktieren Sie uns direkt per Telefon, E-Mail oder WhatsApp. Wir melden uns umgehend und vereinbaren einen Termin.' },
    { question: 'Muss ich bei der Reinigung anwesend sein?', answer: 'Das ist nicht zwingend erforderlich. Bitte sprechen Sie die Details bei der Terminabsprache ab, damit wir den Ablauf optimal planen können.' },
    { question: 'Was ist im Basic-Paket und was im Premium-Paket enthalten?', answer: 'Basic umfasst alle wesentlichen Reinigungsschritte. Premium ergänzt diese mit intensiverer Pflege: z. B. Fussmatten shampoonieren, Cockpit und Türen mit Bürste detailliert reinigen und Reifenglanz. Die genauen Leistungen finden Sie auf der Paketseite.' },
    { question: 'Was kosten die Reinigungspakete?', answer: 'Die Preise richten sich nach Fahrzeuggrösse und gewähltem Paket. Beispiele: Innenreinigung Basic ab CHF 85, Innen & Aussen Premium ab CHF 200. Die vollständige Preistabelle finden Sie auf der Paketseite.' },
    { question: 'Wird eine Aufzahlung für weite Anfahrten erhoben?', answer: 'Für Informationen zu Anfahrtskosten kontaktieren Sie uns bitte direkt — wir geben Ihnen gerne Auskunft für Ihren genauen Standort.' },
  ],
  en: [
    { question: 'What is mobile car cleaning?', answer: 'Mobile car cleaning means the RCC team brings the full professional equipment directly to your vehicle — at home, at work, or at another location. You do not need to take your vehicle anywhere.' },
    { question: 'Which regions of Switzerland does RCC serve?', answer: 'RCC primarily operates in the canton of Zürich and surrounding areas. Please contact us or use the quote form so we can confirm your exact location.' },
    { question: 'Which vehicle types are cleaned?', answer: 'RCC cleans all common vehicle types: small cars (S), compact and mid-size vehicles (M), SUVs (L) and large vehicles such as vans and 7-seaters (XL). Vehicle size determines the package price.' },
    { question: 'How do I book mobile car cleaning?', answer: 'Use the quote form on our website or contact us directly by phone, email or WhatsApp. We respond promptly and arrange an appointment.' },
    { question: 'Do I need to be present during cleaning?', answer: 'It is not strictly required. Please discuss the details when arranging your appointment so we can plan the visit as conveniently as possible.' },
    { question: 'What is included in Basic vs. Premium?', answer: 'Basic covers all essential cleaning steps. Premium adds more intensive care: e.g. shampoo cleaning of floor mats, detailed brush cleaning of the cockpit and doors, and tyre shine. Full details are on the packages page.' },
    { question: 'What do the cleaning packages cost?', answer: 'Prices depend on vehicle size and chosen package. Examples: Interior Cleaning Basic from CHF 85, Interior & Exterior Premium from CHF 200. The full price table is on the packages page.' },
    { question: 'Is there a surcharge for remote locations?', answer: 'For information on travel charges please contact us directly — we are happy to advise for your specific location.' },
  ],
  fr: [
    { question: "Qu'est-ce que le nettoyage voiture mobile ?", answer: "Le nettoyage voiture mobile signifie que l'équipe RCC vient directement chez vous avec tout le matériel professionnel — à domicile, au bureau ou ailleurs en Suisse. Vous n'avez pas besoin de déplacer votre véhicule." },
    { question: 'Quelles régions de la Suisse RCC dessert-il ?', answer: 'RCC intervient principalement dans le canton de Zurich et ses environs. Contactez-nous ou utilisez le formulaire de devis pour que nous puissions confirmer votre emplacement exact.' },
    { question: 'Quels types de véhicules sont nettoyés ?', answer: 'RCC nettoie tous les types de véhicules courants : petites voitures (S), compactes et berlines (M), SUV (L) et grands véhicules comme les vans et 7 places (XL). La taille du véhicule détermine le prix du forfait.' },
    { question: 'Comment réserver un nettoyage automobile mobile ?', answer: 'Utilisez le formulaire de devis sur notre site ou contactez-nous directement par téléphone, e-mail ou WhatsApp. Nous répondons rapidement et convenons d\'un rendez-vous.' },
    { question: 'Dois-je être présent pendant le nettoyage ?', answer: "Ce n'est pas strictement obligatoire. Veuillez discuter des détails lors de la prise de rendez-vous afin que nous puissions planifier la visite le plus commodément possible." },
    { question: "Qu'est-ce qui est inclus dans Basic et Premium ?", answer: "Basic couvre toutes les étapes essentielles du nettoyage. Premium ajoute un entretien plus intensif : nettoyage des tapis au shampooing, nettoyage détaillé du cockpit et des portes à la brosse, finition brillante des pneus. Les détails complets sont sur la page des forfaits." },
    { question: 'Quel est le coût des forfaits de nettoyage ?', answer: 'Les prix varient selon la taille du véhicule et le forfait choisi. Exemples : Nettoyage intérieur Basic à partir de CHF 85, Intérieur & Extérieur Premium à partir de CHF 200. Le tableau de prix complet est sur la page des forfaits.' },
    { question: 'Y a-t-il un supplément pour les lieux éloignés ?', answer: 'Pour les informations sur les frais de déplacement, contactez-nous directement — nous sommes heureux de vous conseiller pour votre emplacement spécifique.' },
  ],
};

export default function FaqPage() {
  const { t, lang, getLangRoute } = useTranslation();
  const fp = t.faqPage;
  const faqs = FAQ_CONTENT[lang];

  const contactPath: Record<Lang, string> = {
    de: '/de/kontakt/',
    en: '/en/contact/',
    fr: '/fr/contact/',
  };

  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-primary/30 selection:text-foreground">
      <Navigation />

      <main className="pt-32 pb-20 container mx-auto px-5 sm:px-6 lg:px-12 max-w-4xl">
        <Breadcrumb
          items={[
            { label: 'RCC Royal Car Cleaning', href: `/${lang}/` },
            { label: 'FAQ' },
          ]}
        />

        <header className="mb-16 max-w-2xl">
          <span className="mb-4 block text-[10px] uppercase tracking-[0.32em] text-primary">
            {fp.eyebrow}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold uppercase leading-[0.95] tracking-[-0.04em] text-foreground mb-6">
            {fp.h1}
          </h1>
          <p className="text-sm md:text-base font-light text-foreground/55 leading-relaxed max-w-xl">
            {fp.intro}
          </p>
        </header>

        {/* FAQ list — rendered as visible HTML for indexing */}
        <section className="mb-16">
          <div className="space-y-1">
            {faqs.map((faq, idx) => (
              <details key={idx} className="group border border-white/10 bg-[#090909]" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-sm font-medium text-foreground list-none" itemProp="name">
                  <span>{faq.question}</span>
                  <span className="ml-4 shrink-0 text-primary text-lg leading-none group-open:rotate-45 transition-transform" aria-hidden="true">
                    +
                  </span>
                </summary>
                <div
                  className="px-6 pb-5 text-sm font-light leading-relaxed text-foreground/60 border-t border-white/5 pt-4"
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                >
                  <span itemProp="text">{faq.answer}</span>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA to packages */}
        <section className="mb-8">
          <a
            href={getLangRoute('packages')}
            className="inline-flex items-center gap-2 border border-white/20 px-6 py-3 text-xs font-medium uppercase tracking-[0.16em] text-foreground/60 hover:border-primary/50 hover:text-primary transition-colors"
          >
            {t.nav.packages}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </section>

        {/* Contact CTA */}
        <section className="border border-primary/20 bg-primary/[0.04] px-8 py-10 text-center">
          <h2 className="text-2xl font-semibold uppercase tracking-[-0.03em] text-foreground mb-4">
            {fp.ctaTitle}
          </h2>
          <p className="text-sm font-light text-foreground/50 mb-8 max-w-md mx-auto">
            {fp.ctaDesc}
          </p>
          <a
            href={contactPath[lang]}
            className="inline-flex items-center gap-3 bg-primary px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-background hover:bg-[#ebcc7b] transition-colors"
          >
            {fp.ctaButton}
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </section>
      </main>

      <Footer />
      <FloatingAssistant />
    </div>
  );
}
