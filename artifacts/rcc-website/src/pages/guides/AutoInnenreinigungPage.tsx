/**
 * Guide: Auto Innenreinigung ,  serves DE, EN, FR.
 * DE: /de/ratgeber/auto-innenreinigung/
 * EN: /en/guides/car-interior-cleaning/
 * FR: /fr/guides/nettoyage-interieur-voiture/
 */

import { GuidePageTemplate, type GuidePageConfig } from './GuidePageTemplate';
import { useTranslation } from '@/i18n/LanguageContext';
import type { Lang } from '@/seo/routes';

const CONFIGS: Record<Lang, GuidePageConfig> = {
  de: {
    breadcrumbs: [
      { label: 'RCC Royal Car Cleaning', href: '/de/' },
      { label: 'Ratgeber', href: '/de/ratgeber/' },
      { label: 'Auto Innenreinigung' },
    ],
    eyebrow: 'RCC Ratgeber · Innenreinigung',
    h1: 'Auto Innenreinigung: Was wirklich zählt',
    lead: 'Eine saubere Fahrzeugkabine bedeutet mehr als ein aufgeräumter Eindruck. Gründliche Innenreinigung beseitigt Schmutz, der sich in Polstern, Teppichen und Lüftungsschlitzen festsetzt ,  und den man oft nicht auf den ersten Blick sieht.',
    articleKey: 'auto-innenreinigung',
    language: 'de',
    sections: [
      {
        heading: 'Was gehört zur Autoinnenreinigung?',
        paragraphs: [
          'Die Innenreinigung eines Fahrzeugs umfasst alle Oberflächen und Bereiche im Fahrgastraum: Sitze und Polster, Fussmatten und Teppichboden, Armaturenbrett und Türverkleidungen, Innenverglasungen sowie schwer zugängliche Stellen wie Lüftungsschlitze, Türtaschen und Schaltmulden.',
          'Wer regelmässig reinigt, verhindert, dass Schmutz einzieht und die Oberflächen dauerhaft verändert. Gerade bei Ledersitzen spielt das eine Rolle: Eingetrockneter Schmutz arbeitet sich in das Material und macht spätere Pflege aufwändiger.',
        ],
      },
      {
        heading: 'Schritt für Schritt: Professionelle Vorgehensweise',
        level: 'h2',
        paragraphs: [
          'Eine professionelle Innenreinigung folgt einer klaren Reihenfolge: Zuerst wird der gesamte Innenraum gründlich gesaugt ,  Sitze, Teppich, Fussmatten, Kofferraum. Dann folgen die Hartflächen: Armaturenbrett, Türverkleidungen, Mittelkonsole und Dachhimmel werden mit geeigneten Reinigungsmitteln abgewischt.',
          'Die Scheiben werden von innen gereinigt, um Schlieren und Ablagerungen zu entfernen. Abschliessend werden Fussmatten entweder ausgeschüttelt und gesaugt oder ,  bei intensiverer Reinigung ,  mit Shampoo behandelt.',
        ],
      },
      {
        heading: 'Basic oder Premium: Wann lohnt was?',
        level: 'h2',
        paragraphs: [
          'Das RCC Basic-Paket für die Innenreinigung umfasst Saugen, Scheiben innen, Cockpit und Türen abwischen sowie Fussmatten saugen. Das ist für regelmässige Pflege in den meisten Fällen ausreichend.',
          'Das Premium-Paket ergänzt Shampoo-Reinigung der Fussmatten, detailliertes Ausbürsten von Cockpit und Türen sowie die Reinigung der Auspuffenden. Sinnvoll bei stärker verschmutzten Fahrzeugen oder wenn seit längerer Zeit keine intensive Reinigung stattgefunden hat.',
          'Den genauen Preisunterschied nach Fahrzeuggrösse finden Sie auf der Paketseite.',
        ],
      },
      {
        heading: 'Leder und Stoff: Unterschiedliche Anforderungen',
        level: 'h2',
        paragraphs: [
          'Ledersitze reagieren empfindlich auf falsche Reinigungsmittel. Zu aggressive Substanzen entziehen dem Leder Feuchtigkeit und führen langfristig zu Rissen. Professionelle Lederreinigung verwendet pH-neutrale Mittel und schont die Oberfläche.',
          'Stoff- und Velourssitze saugen Schmutzpartikel tiefer auf. Hier hilft regelmässiges Saugen, um einziehendem Dreck vorzubeugen. Bei eingetrockneten Flecken ist eine Nassreinigung mit Polsterreiniger nötig.',
          'Mehr zum Unterschied bei der Pflege erklären wir im Ratgeber zu Leder- und Stoffsitzen.',
        ],
      },
      {
        heading: 'Wie oft sollte der Innenraum gereinigt werden?',
        level: 'h2',
        paragraphs: [
          'Das hängt von der Nutzung ab. Ein Fahrzeug, das täglich mit Kindern oder Haustieren genutzt wird, braucht häufigere Pflege als ein Dienstwagen, der hauptsächlich Solo-Fahrten absolviert. Als grobe Orientierung: Eine gründliche Innenreinigung alle drei bis sechs Monate ist für die meisten Fahrzeuge sinnvoll.',
          'Zwischendurch helfen einfache Massnahmen: Fussmatten ausschütteln, Oberflächen abwischen und Getränkehalter reinigen.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Was umfasst die Innenreinigung bei RCC?',
        answer: 'Die Innenreinigung umfasst das Saugen des Fahrgastraums inklusive Fussmatten, Reinigen der Scheiben von innen, Abwischen von Armaturenbrett, Türverkleidungen und Cockpit. Das Premium-Paket ergänzt Shampoo-Reinigung der Fussmatten und detailliertes Ausbürsten des Innenraums.',
      },
      {
        question: 'Kommt RCC für die Innenreinigung zu mir?',
        answer: 'Ja ,  RCC ist ein mobiler Service und kommt mit dem vollständigen Equipment direkt zu Ihrem Fahrzeugstandort in der Schweiz. Offerte über das Formular oder per Telefon/WhatsApp anfragen.',
      },
      {
        question: 'Wie lange dauert eine Innenreinigung?',
        answer: 'Die Dauer hängt von Fahrzeuggrösse und gewähltem Paket ab. Genaue Zeitangaben erhalten Sie bei der Offertanfrage.',
      },
      {
        question: 'Was kostet die Innenreinigung?',
        answer: 'Die Preise richten sich nach Fahrzeuggrösse: Innenreinigung Basic beginnt ab CHF 85, Premium ab CHF 100. Den vollständigen Preisüberblick finden Sie auf der Paketseite.',
      },
    ],
    internalLinks: [
      { label: 'Innenreinigung Pakete & Preise', href: '/de/pakete/' },
      { label: 'Innenreinigung Leistungsseite', href: '/de/leistungen/innenreinigung/' },
      { label: 'Komplettreinigung Innen & Aussen', href: '/de/leistungen/fahrzeugaufbereitung/' },
      { label: 'Ratgeber: Leder und Stoff', href: '/de/ratgeber/innenreinigung-leder-stoff/' },
      { label: 'Einsatzgebiet Schweiz', href: '/de/einsatzgebiet/' },
    ],
    ctaHeading: 'Innenreinigung anfragen',
    ctaText: 'RCC kommt mit dem vollständigen Equipment direkt zu Ihrem Fahrzeug in der Schweiz.',
    ctaLabel: 'Jetzt Offerte anfragen',
    ctaHref: '/de/#quote',
  },

  en: {
    breadcrumbs: [
      { label: 'RCC Royal Car Cleaning', href: '/en/' },
      { label: 'Guides', href: '/en/guides/' },
      { label: 'Car Interior Cleaning' },
    ],
    eyebrow: 'RCC Guides · Interior Cleaning',
    h1: 'Car Interior Cleaning: What Really Matters',
    lead: 'A clean passenger compartment is more than a tidy first impression. Thorough interior cleaning removes dirt embedded in upholstery, carpets and air vents ,  the kind you often cannot see at first glance.',
    articleKey: 'auto-innenreinigung',
    language: 'en',
    sections: [
      {
        heading: 'What Does Car Interior Cleaning Include?',
        paragraphs: [
          'Interior cleaning covers all surfaces and areas inside the vehicle: seats and upholstery, floor mats and carpet, dashboard and door panels, interior windows and hard-to-reach spots such as air vents, door pockets and gear surrounds.',
          'Regular cleaning prevents dirt from penetrating and permanently altering surfaces. For leather seats in particular this matters: dried-in dirt works its way into the material and makes later care more demanding.',
        ],
      },
      {
        heading: 'Step by Step: The Professional Approach',
        level: 'h2',
        paragraphs: [
          'A professional interior clean follows a clear sequence: the entire interior is thoroughly vacuumed first ,  seats, carpet, floor mats, boot. Then hard surfaces follow: dashboard, door panels, centre console and headliner are wiped with appropriate cleaners.',
          'Windows are cleaned from the inside to remove streaks and deposits. Finally, floor mats are either shaken out and vacuumed or ,  for deeper cleaning ,  treated with shampoo.',
        ],
      },
      {
        heading: 'Basic or Premium: When Does Each Make Sense?',
        level: 'h2',
        paragraphs: [
          'The RCC Basic interior package includes vacuuming, interior windows, wiping the cockpit and door panels, and vacuuming floor mats. For regular maintenance this is sufficient in most cases.',
          'The Premium package adds shampoo cleaning of floor mats, detailed brush cleaning of the cockpit and doors, and cleaning of exhaust tips. Appropriate for more heavily soiled vehicles or when no intensive clean has taken place for some time.',
          'Exact prices by vehicle size are on the packages page.',
        ],
      },
      {
        heading: 'Leather and Fabric: Different Requirements',
        level: 'h2',
        paragraphs: [
          'Leather seats react sensitively to wrong cleaning products. Overly aggressive substances strip the leather of moisture and lead to cracks over time. Professional leather cleaning uses pH-neutral products that protect the surface.',
          'Fabric and suede seats absorb dirt particles more deeply. Regular vacuuming prevents dirt from working in. Dried-in stains require wet cleaning with an upholstery cleaner.',
        ],
      },
      {
        heading: 'How Often Should the Interior Be Cleaned?',
        level: 'h2',
        paragraphs: [
          'This depends on usage. A vehicle used daily with children or pets needs more frequent attention than a company car that mainly sees solo commutes. As a rough guide: a thorough interior clean every three to six months makes sense for most vehicles.',
          'In between, simple steps help: shaking out floor mats, wiping surfaces and cleaning cup holders.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What does interior cleaning include at RCC?',
        answer: 'Interior cleaning includes vacuuming the passenger compartment including floor mats, cleaning windows from the inside, wiping the dashboard, door panels and cockpit. The Premium package adds shampoo cleaning of floor mats and detailed brush cleaning of the interior.',
      },
      {
        question: 'Does RCC come to me for interior cleaning?',
        answer: 'RCC is a mobile service and comes with the full professional equipment directly to your vehicle location. Based in Zurich, RCC provides mobile car cleaning throughout Switzerland.',
      },
      {
        question: 'What does interior cleaning cost?',
        answer: 'Prices depend on vehicle size: Interior Cleaning Basic starts from CHF 85, Premium from CHF 100. The full price overview is on the packages page.',
      },
    ],
    internalLinks: [
      { label: 'Interior Cleaning Packages & Prices', href: '/en/packages/' },
      { label: 'Interior Cleaning Service', href: '/en/services/interior-cleaning/' },
      { label: 'Complete Interior & Exterior', href: '/en/services/car-detailing/' },
      { label: 'Service Area Switzerland', href: '/en/service-area/' },
    ],
    ctaHeading: 'Request Interior Cleaning',
    ctaText: 'RCC brings the full professional equipment directly to your vehicle in Switzerland.',
    ctaLabel: 'Request a Quote',
    ctaHref: '/en/#quote',
  },

  fr: {
    breadcrumbs: [
      { label: 'RCC Royal Car Cleaning', href: '/fr/' },
      { label: 'Guides', href: '/fr/guides/' },
      { label: 'Nettoyage intérieur voiture' },
    ],
    eyebrow: 'Guides RCC · Nettoyage intérieur',
    h1: "Nettoyage intérieur voiture : l'essentiel",
    lead: "Un habitacle propre va bien au-delà d'une première impression soignée. Un nettoyage intérieur complet élimine la saleté incrustée dans les tissus, les tapis et les aérations ,  celle que l'on ne voit souvent pas au premier regard.",
    articleKey: 'auto-innenreinigung',
    language: 'fr',
    sections: [
      {
        heading: "Que comprend le nettoyage intérieur d'une voiture ?",
        paragraphs: [
          "Le nettoyage intérieur couvre toutes les surfaces et zones de l'habitacle : sièges et revêtements, tapis et moquette, tableau de bord et panneaux de porte, vitres intérieures et endroits difficiles d'accès comme les aérations, vide-poches et pourtour du levier de vitesse.",
          "Un nettoyage régulier évite que la saleté ne s'incruste et n'altère durablement les surfaces. Pour les sièges en cuir notamment : la saleté séchée pénètre dans le matériau et rend l'entretien ultérieur plus exigeant.",
        ],
      },
      {
        heading: "Étape par étape : la démarche professionnelle",
        level: 'h2',
        paragraphs: [
          "Un nettoyage intérieur professionnel suit une séquence claire : l'intégralité de l'habitacle est d'abord aspirée ,  sièges, moquette, tapis, coffre. Viennent ensuite les surfaces dures : tableau de bord, panneaux de porte, console centrale et ciel de toit sont essuyés avec des produits adaptés.",
          "Les vitres sont nettoyées de l'intérieur pour éliminer les traces et dépôts. Enfin, les tapis sont soit secoués et aspirés, soit ,  pour un nettoyage plus poussé ,  traités au shampooing.",
        ],
      },
      {
        heading: "Basic ou Premium : lequel choisir ?",
        level: 'h2',
        paragraphs: [
          "Le forfait Basic RCC comprend l'aspiration, le nettoyage des vitres intérieures, l'essuyage du cockpit et des portes, et l'aspiration des tapis. Pour un entretien régulier, c'est suffisant dans la plupart des cas.",
          "Le forfait Premium ajoute le nettoyage des tapis au shampooing, le nettoyage détaillé du cockpit et des portes à la brosse. Recommandé pour les véhicules plus sales ou lorsqu'aucun nettoyage intensif n'a eu lieu depuis un certain temps.",
          "Les prix exacts selon la taille du véhicule sont sur la page des forfaits.",
        ],
      },
      {
        heading: "Cuir et tissu : des exigences différentes",
        level: 'h2',
        paragraphs: [
          "Les sièges en cuir réagissent sensiblement aux mauvais produits. Des produits trop agressifs dessèchent le cuir et provoquent des craquelures à long terme. Le nettoyage professionnel utilise des produits à pH neutre qui ménagent la surface.",
          "Les sièges en tissu et en velours absorbent les particules de saleté plus en profondeur. Un aspiration régulière empêche la saleté de s'incruster. Les taches séchées nécessitent un nettoyage humide avec un nettoyant pour tissu.",
        ],
      },
    ],
    faqs: [
      {
        question: "Que comprend le nettoyage intérieur chez RCC ?",
        answer: "Le nettoyage intérieur comprend l'aspiration de l'habitacle y compris les tapis, le nettoyage des vitres de l'intérieur, l'essuyage du tableau de bord, des portes et du cockpit. Le forfait Premium ajoute le nettoyage des tapis au shampooing et le nettoyage détaillé à la brosse.",
      },
      {
        question: "RCC vient-il chez moi pour le nettoyage intérieur ?",
        answer: "Oui ,  RCC est un service mobile et vient avec tout le matériel professionnel directement à l'emplacement de votre véhicule en Suisse. Demandez un devis via le formulaire ou par téléphone/WhatsApp.",
      },
      {
        question: "Quel est le prix du nettoyage intérieur ?",
        answer: "Les prix varient selon la taille du véhicule : Nettoyage intérieur Basic à partir de CHF 85, Premium à partir de CHF 100. La vue d'ensemble complète des prix est sur la page des forfaits.",
      },
    ],
    internalLinks: [
      { label: 'Forfaits nettoyage intérieur', href: '/fr/forfaits/' },
      { label: 'Service nettoyage intérieur', href: '/fr/prestations/nettoyage-interieur/' },
      { label: 'Nettoyage complet intérieur & extérieur', href: '/fr/prestations/preparation-vehicule/' },
      { label: 'Zone de service Suisse', href: '/fr/zones-desservies/' },
    ],
    ctaHeading: 'Demander un nettoyage intérieur',
    ctaText: "RCC vient avec tout le matériel professionnel directement à votre véhicule en Suisse.",
    ctaLabel: 'Demander un devis',
    ctaHref: '/fr/#quote',
  },
};

export default function AutoInnenreinigungPage() {
  const { lang } = useTranslation();
  return <GuidePageTemplate config={CONFIGS[lang]} />;
}
