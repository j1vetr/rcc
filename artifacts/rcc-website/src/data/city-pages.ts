import type { Lang, RouteKey } from '@/seo/routes';

export type CityRouteKey =
  | 'mobile-autoreinigung/zuerich'
  | 'mobile-autoreinigung/winterthur'
  | 'mobile-autoreinigung/zug'
  | 'mobile-autoreinigung/luzern'
  | 'mobile-autoreinigung/basel'
  | 'mobile-autoreinigung/bern'
  | 'mobile-autoreinigung/st-gallen'
  | 'mobile-autoreinigung/geneve'
  | 'mobile-autoreinigung/lausanne';

export interface CityFaq {
  question: string;
  answer: string;
}

export interface CityTravelCopy {
  title: string;
  description: string;
  detail: string;
}

export interface CityPageCopy {
  cityName: string;
  eyebrow: string;
  h1: string;
  intro: string;
  localDetail: string;
  servicesTitle: string;
  servicesIntro: string;
  howTitle: string;
  steps: ReadonlyArray<{ title: string; description: string }>;
  packagesTitle: string;
  packagesDescription: string;
  businessTitle: string;
  businessText: string;
  businessCta: string;
  faqTitle: string;
  faqs: CityFaq[];
  ctaTitle: string;
  ctaDescription: string;
  ctaButton: string;
  packagesButton: string;
  travel?: CityTravelCopy;
  metaTitle: string;
  metaDescription: string;
}

export const CITY_ROUTE_KEYS: CityRouteKey[] = [
  'mobile-autoreinigung/zuerich',
  'mobile-autoreinigung/winterthur',
  'mobile-autoreinigung/zug',
  'mobile-autoreinigung/luzern',
  'mobile-autoreinigung/basel',
  'mobile-autoreinigung/bern',
  'mobile-autoreinigung/st-gallen',
  'mobile-autoreinigung/geneve',
  'mobile-autoreinigung/lausanne',
];

export function isCityRouteKey(routeKey: RouteKey): routeKey is CityRouteKey {
  return CITY_ROUTE_KEYS.includes(routeKey as CityRouteKey);
}

const DE_COMMON = {
  servicesTitle: 'Leistungen für Ihr Fahrzeug',
  servicesIntro: 'Von der mobilen Autoreinigung bis zur vollständigen Fahrzeugaufbereitung wählen Sie die Leistung, die zu Ihrem Fahrzeug und Ihrem Standort passt.',
  howTitle: 'So funktioniert die mobile Autoreinigung',
  steps: [
    { title: 'Offerte anfragen', description: 'Teilen Sie uns Stadt, Fahrzeug und Ihren gewünschten Reinigungsumfang mit.' },
    { title: 'Paket wählen', description: 'Wählen Sie das passende Paket für Innen, Aussen oder die komplette Pflege.' },
    { title: 'Ort und Zeit abstimmen', description: 'Wir klären den Einsatzort und einen passenden Termin mit Ihnen.' },
    { title: 'RCC kommt zum Fahrzeug', description: 'Wir bringen das professionelle Equipment mit und reinigen Ihr Fahrzeug vor Ort.' },
  ],
  packagesTitle: 'Pakete und Preise',
  packagesButton: 'Alle Pakete ansehen',
  businessTitle: 'Auch für Firmenkunden',
  businessCta: 'Firmenkunden entdecken',
  ctaButton: 'Offerte anfragen',
} as const;

const EN_COMMON = {
  servicesTitle: 'Services for your vehicle',
  servicesIntro: 'From mobile car cleaning to complete detailing, choose the service that fits your vehicle, schedule and location.',
  howTitle: 'How mobile car cleaning works',
  steps: [
    { title: 'Request a quote', description: 'Tell us your city, vehicle and preferred cleaning scope.' },
    { title: 'Choose a package', description: 'Select interior, exterior or complete care for your vehicle.' },
    { title: 'Agree location and time', description: 'We confirm the service location and a suitable appointment with you.' },
    { title: 'RCC comes to your vehicle', description: 'We bring the professional equipment and clean your vehicle on location.' },
  ],
  packagesTitle: 'Packages and pricing',
  packagesButton: 'View all packages',
  businessTitle: 'For business customers too',
  businessCta: 'Explore business customers',
  ctaButton: 'Request a quote',
} as const;

const FR_COMMON = {
  servicesTitle: 'Prestations pour votre véhicule',
  servicesIntro: 'Du nettoyage voiture mobile à la préparation complète, choisissez la prestation adaptée à votre véhicule et à votre lieu d’intervention.',
  howTitle: 'Comment fonctionne le nettoyage mobile',
  steps: [
    { title: 'Demander un devis', description: 'Indiquez-nous votre ville, votre véhicule et la prestation souhaitée.' },
    { title: 'Choisir un forfait', description: 'Choisissez le nettoyage intérieur, extérieur ou complet.' },
    { title: 'Convenir du lieu et de l’heure', description: 'Nous définissons avec vous le lieu d’intervention et un rendez-vous.' },
    { title: 'RCC vient au véhicule', description: 'Nous apportons le matériel professionnel et nettoyons votre véhicule sur place.' },
  ],
  packagesTitle: 'Forfaits et tarifs',
  packagesButton: 'Voir tous les forfaits',
  businessTitle: 'Également pour les entreprises',
  businessCta: 'Découvrir les offres entreprises',
  ctaButton: 'Demander un devis',
} as const;

export const CITY_PAGES: Record<CityRouteKey, Partial<Record<Lang, CityPageCopy>>> = {
  'mobile-autoreinigung/zuerich': {
    de: {
      ...DE_COMMON,
      cityName: 'Zürich',
      eyebrow: 'Autopflege Zürich',
      h1: 'Mobile Autoreinigung in Zürich',
      intro: 'RCC bietet professionelle mobile Autoreinigung, Autopflege und Fahrzeugreinigung in Zürich. Wir kommen direkt zum vereinbarten Standort, ob zu Hause, am Arbeitsplatz oder an einem anderen Ort im Stadtgebiet.',
      localDetail: 'Unsere mobile Autoreinigung ist im ganzen Stadtgebiet und in der Agglomeration möglich. Dazu gehören unter anderem Oerlikon, Altstetten, Wiedikon, Enge, Seefeld und Schwamendingen. Geben Sie bei Ihrer Anfrage den genauen Standort an, damit wir den Einsatz passend planen können.',
      packagesDescription: 'Die Pakete für Innenreinigung, Aussenreinigung und Komplettreinigung sind nach Fahrzeuggrösse gestaffelt. Die genauen Basispreise finden Sie auf der Paketseite.',
      businessText: 'Für Geschäftsfahrzeuge, Firmenwagen, Mitarbeiterfahrzeuge und Fuhrparks stimmen wir den Bedarf direkt mit Ihnen ab und erstellen eine individuelle Firmenofferte.',
      faqTitle: 'Häufige Fragen zur Autoreinigung in Zürich',
      faqs: [
        { question: 'Bietet RCC mobile Autoreinigung in Zürich an?', answer: 'Ja. RCC kommt mit dem vollständigen professionellen Equipment direkt zu Ihrem Fahrzeug im Stadtgebiet Zürich und in der Agglomeration.' },
        { question: 'Welche Zürcher Stadtteile werden bedient?', answer: 'Wir planen mobile Einsätze im gesamten Stadtgebiet, unter anderem in Oerlikon, Altstetten, Wiedikon, Enge, Seefeld und Schwamendingen. Bitte nennen Sie uns Ihren genauen Standort.' },
        { question: 'Welche Pakete kann ich in Zürich buchen?', answer: 'Sie können zwischen Innenreinigung, Aussenreinigung und Komplettreinigung wählen. Jede Kategorie ist als Basic oder Premium und für verschiedene Fahrzeuggrössen verfügbar.' },
        { question: 'Wie vereinbare ich einen Termin in Zürich?', answer: 'Senden Sie uns eine Offertanfrage mit Fahrzeug, gewünschtem Paket und Standort. Danach stimmen wir den passenden Ort und Termin mit Ihnen ab.' },
      ],
      ctaTitle: 'Autopflege direkt in Zürich anfragen',
      ctaDescription: 'Beschreiben Sie uns kurz Ihr Fahrzeug und Ihren gewünschten Standort. Wir melden uns mit einer unverbindlichen Offerte.',
      metaTitle: 'Mobile Autoreinigung Zürich | RCC Royal Car Cleaning',
      metaDescription: 'Professionelle mobile Autoreinigung in Zürich. RCC reinigt Ihr Fahrzeug direkt bei Ihnen, von Oerlikon bis Altstetten und in der Agglomeration.',
    },
    en: {
      ...EN_COMMON,
      cityName: 'Zurich',
      eyebrow: 'Mobile car care in Zurich',
      h1: 'Mobile Car Cleaning in Zurich',
      intro: 'RCC provides professional mobile car cleaning and detailing in Zurich. We bring the complete setup to your agreed location, whether that is home, work or another suitable place in the city.',
      localDetail: 'The mobile service covers the Zurich city area and surrounding region. Customers in Oerlikon, Altstetten, Wiedikon, Enge, Seefeld and Schwamendingen can include their exact location in the quote request so we can plan the visit properly.',
      packagesDescription: 'Interior, exterior and complete cleaning packages are priced by vehicle size. See the packages page for the verified base prices.',
      businessText: 'Companies can request an individual quote for business vehicles, company cars, employee vehicles or fleets at an agreed location.',
      faqTitle: 'Zurich mobile car cleaning FAQ',
      faqs: [
        { question: 'Does RCC offer mobile car cleaning in Zurich?', answer: 'Yes. RCC brings the full professional setup directly to vehicles across the Zurich city area and surrounding region.' },
        { question: 'Which parts of Zurich can you visit?', answer: 'We plan mobile appointments across the city, including Oerlikon, Altstetten, Wiedikon, Enge, Seefeld and Schwamendingen. Include your exact location in the request.' },
        { question: 'Which packages are available in Zurich?', answer: 'You can choose interior, exterior or complete cleaning. Each category is available in Basic and Premium for different vehicle sizes.' },
        { question: 'How do I arrange an appointment in Zurich?', answer: 'Send a quote request with your vehicle, preferred package and location. We then agree the service location and appointment with you.' },
      ],
      ctaTitle: 'Request car care in Zurich',
      ctaDescription: 'Tell us about your vehicle and preferred location. We will reply with a no-obligation quote.',
      packagesButton: 'View all packages',
      metaTitle: 'Mobile Car Cleaning Zurich | RCC Royal Car Cleaning',
      metaDescription: 'Professional mobile car cleaning in Zurich. RCC comes to your location from Oerlikon to Altstetten and across the surrounding Zurich area.',
    },
    fr: {
      ...FR_COMMON,
      cityName: 'Zurich',
      eyebrow: 'Entretien automobile à Zurich',
      h1: 'Nettoyage voiture mobile à Zurich',
      intro: 'RCC propose un nettoyage automobile mobile professionnel à Zurich. Nous venons directement au lieu convenu, à domicile, au bureau ou à un autre emplacement adapté.',
      localDetail: 'Le service mobile est disponible dans toute la ville et l’agglomération de Zurich. Vous pouvez notamment nous indiquer Oerlikon, Altstetten, Wiedikon, Enge, Seefeld ou Schwamendingen dans votre demande afin de préparer l’intervention.',
      packagesDescription: 'Les forfaits intérieur, extérieur et complet varient selon la taille du véhicule. Les tarifs de base vérifiés figurent sur la page des forfaits.',
      businessText: 'Les entreprises peuvent demander une offre personnalisée pour leurs véhicules professionnels, voitures de société, véhicules des collaborateurs ou flottes.',
      faqTitle: 'Questions fréquentes sur le nettoyage à Zurich',
      faqs: [
        { question: 'RCC propose-t-il le nettoyage voiture mobile à Zurich ?', answer: 'Oui. RCC vient directement avec tout le matériel professionnel dans la ville et l’agglomération de Zurich.' },
        { question: 'Dans quels quartiers de Zurich intervenez-vous ?', answer: 'Nous organisons des rendez-vous dans toute la ville, notamment à Oerlikon, Altstetten, Wiedikon, Enge, Seefeld et Schwamendingen. Indiquez votre lieu exact dans la demande.' },
        { question: 'Quels forfaits sont disponibles à Zurich ?', answer: 'Vous pouvez choisir le nettoyage intérieur, extérieur ou complet. Chaque catégorie existe en Basic et Premium selon la taille du véhicule.' },
        { question: 'Comment prendre rendez-vous à Zurich ?', answer: 'Envoyez une demande avec votre véhicule, le forfait souhaité et le lieu. Nous convenons ensuite avec vous du lieu et de l’heure.' },
      ],
      ctaTitle: 'Demander un entretien automobile à Zurich',
      ctaDescription: 'Décrivez-nous votre véhicule et votre lieu souhaité. Nous vous répondons avec un devis sans engagement.',
      metaTitle: 'Nettoyage Voiture Mobile Zurich | RCC Royal Car Cleaning',
      metaDescription: 'Nettoyage automobile mobile professionnel à Zurich. RCC vient chez vous, d’Oerlikon à Altstetten et dans toute l’agglomération.',
    },
  },
  'mobile-autoreinigung/winterthur': {
    de: {
      ...DE_COMMON,
      cityName: 'Winterthur',
      eyebrow: 'Mobile Autopflege Winterthur',
      h1: 'Mobile Autoreinigung in Winterthur',
      intro: 'In Winterthur kommt RCC mit professioneller Fahrzeugreinigung direkt zu Ihnen. Die mobile Autopflege passt zu privaten Stellplätzen, Arbeitsorten und anderen vereinbarten Standorten in der Stadt.',
      localDetail: 'Winterthur verbindet dichte Quartiere, Arbeitsplätze und ein weitläufiges Stadtgebiet. Mit einer genauen Standortangabe können wir die Reinigung von Innenraum, Karosserie oder das komplette Fahrzeug passend vorbereiten.',
      packagesDescription: 'Wählen Sie ein Paket nach Fahrzeuggrösse und gewünschtem Umfang. Die Basispreise für Innen, Aussen und Innen & Aussen stehen übersichtlich auf der Paketseite.',
      businessText: 'Für Unternehmen in Winterthur ist die mobile Reinigung von Geschäftsfahrzeugen, Firmenwagen, Mitarbeiterfahrzeugen und Fuhrparks möglich. Für den konkreten Bedarf fragen Sie bitte eine individuelle Offerte an.',
      faqTitle: 'Häufige Fragen zur Autoreinigung in Winterthur',
      faqs: [
        { question: 'Kommt RCC für eine Autoreinigung nach Winterthur?', answer: 'Ja. RCC bietet mobile Autoreinigung in Winterthur an und bringt das benötigte Equipment direkt zum vereinbarten Standort.' },
        { question: 'Ist eine Innenreinigung vor Ort in Winterthur möglich?', answer: 'Ja. Innenreinigung, Aussenreinigung und Komplettreinigung können als mobile Leistung angefragt werden. Den Standort klären wir vor dem Termin.' },
        { question: 'Wie erhalte ich den Preis für mein Fahrzeug?', answer: 'Die Paketpreise richten sich nach Fahrzeuggrösse und Paket. Senden Sie uns Ihre Angaben, damit wir das passende Programm und die Basispreise einordnen können.' },
        { question: 'Kann RCC auch Firmenfahrzeuge in Winterthur reinigen?', answer: 'Ja. Unternehmen können für Geschäftsfahrzeuge und Fuhrparks eine individuelle Firmenofferte anfragen.' },
      ],
      ctaTitle: 'Mobile Autoreinigung in Winterthur anfragen',
      ctaDescription: 'Nennen Sie uns Fahrzeug, Paketwunsch und Einsatzort in Winterthur. Wir klären die nächsten Schritte mit Ihnen.',
      metaTitle: 'Mobile Autoreinigung Winterthur | RCC Royal Car Cleaning',
      metaDescription: 'Mobile Autoreinigung in Winterthur direkt vor Ort. RCC bietet Innenreinigung, Aussenreinigung und Fahrzeugaufbereitung für Ihr Fahrzeug.',
    },
    en: {
      ...EN_COMMON,
      cityName: 'Winterthur',
      eyebrow: 'Mobile car care in Winterthur',
      h1: 'Mobile Car Cleaning in Winterthur',
      intro: 'RCC brings professional mobile car cleaning to your location in Winterthur. The service works for private parking areas, workplaces and other agreed locations across the city.',
      localDetail: 'Winterthur combines residential neighbourhoods, workplaces and a broad urban area. Include the exact location in your request so we can prepare the right interior, exterior or complete cleaning service.',
      packagesDescription: 'Choose a package based on vehicle size and cleaning scope. The packages page lists the base prices for interior, exterior and combined cleaning.',
      businessText: 'Companies in Winterthur can request mobile cleaning for business vehicles, company cars, employee vehicles and fleets. The right option is confirmed through an individual quote.',
      faqTitle: 'Winterthur mobile car cleaning FAQ',
      faqs: [
        { question: 'Does RCC come to Winterthur for car cleaning?', answer: 'Yes. RCC offers mobile car cleaning in Winterthur and brings the required equipment to the agreed location.' },
        { question: 'Can my car be cleaned at my workplace in Winterthur?', answer: 'Yes. Workplace appointments can be requested alongside home or other suitable locations. We confirm the details before the appointment.' },
        { question: 'How is the price for my vehicle determined?', answer: 'Package pricing depends on vehicle size and the selected service. Share your details with us and we will help identify the right package.' },
        { question: 'Can businesses request cleaning for vehicles in Winterthur?', answer: 'Yes. Businesses can request an individual quote for company vehicles and fleets.' },
      ],
      ctaTitle: 'Request mobile car cleaning in Winterthur',
      ctaDescription: 'Tell us your vehicle, preferred package and location in Winterthur. We will clarify the next steps with you.',
      metaTitle: 'Mobile Car Cleaning Winterthur | RCC Royal Car Cleaning',
      metaDescription: 'Professional mobile car cleaning in Winterthur at your location. RCC offers interior, exterior and complete vehicle cleaning.',
    },
  },
  'mobile-autoreinigung/zug': {
    de: {
      ...DE_COMMON,
      cityName: 'Zug',
      eyebrow: 'Mobile Autopflege Zug',
      h1: 'Mobile Autoreinigung in Zug',
      intro: 'RCC reinigt Ihr Fahrzeug mobil in Zug und kommt direkt zum vereinbarten Standort. So lässt sich die Autopflege in den Alltag zwischen Wohnort, Arbeitsplatz und Terminen integrieren.',
      localDetail: 'Für Einsätze in Zug stimmen wir den genauen Ort vorab mit Ihnen ab. Ob Innenraum, Aussenbereich oder eine komplette Fahrzeugpflege, wir bringen das professionelle Equipment zum Fahrzeug.',
      packagesDescription: 'Die Paketseite zeigt die Basispreise nach Fahrzeuggrösse. Wählen Sie zwischen Innenreinigung, Aussenreinigung sowie Innen & Aussen in Basic oder Premium.',
      businessText: 'Geschäftskunden in Zug können mobile Reinigung für Firmenwagen, Geschäftsfahrzeuge, Mitarbeiterfahrzeuge oder Fuhrparks anfragen und eine individuelle Offerte erhalten.',
      faqTitle: 'Häufige Fragen zur Autoreinigung in Zug',
      faqs: [
        { question: 'Bietet RCC mobile Autoreinigung in Zug an?', answer: 'Ja. RCC kommt für die vereinbarte Fahrzeugreinigung direkt zu Ihrem Standort in Zug und bringt das vollständige Equipment mit.' },
        { question: 'Kann ich den Standort in Zug frei angeben?', answer: 'Nennen Sie uns bei der Anfrage den gewünschten Standort. Wir prüfen die Angaben und stimmen den Einsatzort und Termin mit Ihnen ab.' },
        { question: 'Welche Fahrzeugpflege kann ich in Zug buchen?', answer: 'Anfragbar sind Innenreinigung, Aussenreinigung und die kombinierte Komplettreinigung. Die Auswahl richtet sich nach Ihrem Fahrzeug und dem gewünschten Ergebnis.' },
        { question: 'Gibt es mobile Fahrzeugreinigung für Zuger Unternehmen?', answer: 'Ja. Unternehmen können eine individuelle Offerte für Geschäftsfahrzeuge, Firmenwagen, Mitarbeiterfahrzeuge und Fuhrparks anfragen.' },
      ],
      ctaTitle: 'Autoreinigung in Zug anfragen',
      ctaDescription: 'Senden Sie uns Ihren Standort in Zug und den gewünschten Reinigungsumfang. Wir besprechen das passende Paket mit Ihnen.',
      metaTitle: 'Mobile Autoreinigung Zug | RCC Royal Car Cleaning',
      metaDescription: 'Mobile Autoreinigung in Zug direkt am vereinbarten Standort. RCC bietet Innenreinigung, Aussenreinigung und Fahrzeugaufbereitung.',
    },
    en: {
      ...EN_COMMON,
      cityName: 'Zug',
      eyebrow: 'Mobile car care in Zug',
      h1: 'Mobile Car Cleaning in Zug',
      intro: 'RCC cleans your vehicle on location in Zug. A mobile appointment can fit around home, work and other commitments because the professional setup comes directly to the agreed place.',
      localDetail: 'For appointments in Zug, we confirm the exact location with you in advance. Request interior, exterior or complete cleaning and we will bring the appropriate professional equipment to your vehicle.',
      packagesDescription: 'The packages page lists base prices by vehicle size. Choose interior, exterior or combined interior and exterior care in Basic or Premium.',
      businessText: 'Business customers in Zug can request mobile cleaning for company cars, business vehicles, employee vehicles or fleets and receive an individual quote.',
      faqTitle: 'Zug mobile car cleaning FAQ',
      faqs: [
        { question: 'Does RCC offer mobile car cleaning in Zug?', answer: 'Yes. RCC comes directly to your agreed location in Zug with the complete professional setup.' },
        { question: 'Can I specify the service location in Zug?', answer: 'Yes. Include your preferred location in the request and we will confirm the service place and appointment with you.' },
        { question: 'Which vehicle care services are available in Zug?', answer: 'You can request interior cleaning, exterior cleaning or combined complete cleaning, depending on your vehicle and preferred scope.' },
        { question: 'Can Zug businesses request vehicle cleaning?', answer: 'Yes. Companies can request an individual quote for business vehicles, company cars, employee vehicles and fleets.' },
      ],
      ctaTitle: 'Request car cleaning in Zug',
      ctaDescription: 'Send us your Zug location and preferred cleaning scope. We will help you choose the right package.',
      metaTitle: 'Mobile Car Cleaning Zug | RCC Royal Car Cleaning',
      metaDescription: 'Mobile car cleaning in Zug at your agreed location. RCC provides interior, exterior and complete vehicle cleaning.',
    },
  },
  'mobile-autoreinigung/luzern': {
    de: {
      ...DE_COMMON,
      cityName: 'Luzern',
      eyebrow: 'Mobile Autopflege Luzern',
      h1: 'Mobile Autoreinigung in Luzern',
      intro: 'RCC bietet mobile Autoreinigung in Luzern und kommt mit dem professionellen Equipment direkt zu Ihrem Fahrzeug. So erhalten Sie Fahrzeugpflege am gewünschten Ort, ohne Ihr Auto zu einer festen Station zu bringen.',
      localDetail: 'Für Luzern und die umliegenden Einsatzorte planen wir den Termin anhand Ihres genauen Standorts. Das ist praktisch für Fahrzeuge am Wohnort, am Arbeitsplatz oder an einem anderen geeigneten Ort.',
      packagesDescription: 'Die Preise auf der Paketseite sind nach Fahrzeuggrösse und Paket aufgebaut. Für Luzern können Sie Innen, Aussen oder die komplette Reinigung als Basic oder Premium anfragen.',
      businessText: 'Für Luzerner Unternehmen reinigt RCC Geschäftsfahrzeuge, Firmenwagen, Mitarbeiterfahrzeuge und Fuhrparks mobil. Unternehmen erhalten auf Anfrage eine individuelle Firmenofferte.',
      faqTitle: 'Häufige Fragen zur Autoreinigung in Luzern',
      faqs: [
        { question: 'Kommt RCC für mobile Autoreinigung nach Luzern?', answer: 'Ja. RCC ist schweizweit mobil im Einsatz und kommt für die vereinbarte Reinigung direkt zu Ihrem Fahrzeug in Luzern.' },
        { question: 'Fallen für einen Einsatz in Luzern zusätzliche Anfahrtskosten an?', answer: 'Da Luzern ausserhalb eines Radius von 30 km ab Zürich liegt, kann zusätzlich zum Paketpreis eine Anfahrtspauschale anfallen. Die genaue Höhe teilen wir vor der Terminbestätigung mit.' },
        { question: 'Kann die Reinigung am Arbeitsplatz in Luzern stattfinden?', answer: 'Ja, ein Arbeitsplatz oder ein anderer geeigneter Standort ist möglich. Bitte geben Sie den Ort bei der Offertanfrage an.' },
        { question: 'Welche Pakete sind für mein Auto in Luzern verfügbar?', answer: 'Sie können Innenreinigung, Aussenreinigung oder Komplettreinigung wählen. Basic und Premium sind für die verschiedenen Fahrzeuggrössen verfügbar.' },
      ],
      ctaTitle: 'Mobile Autoreinigung in Luzern anfragen',
      ctaDescription: 'Übermitteln Sie uns Fahrzeug, Paketwunsch und Standort. Wir erstellen die passende Offerte inklusive allfälliger Anfahrt.',
      travel: {
        title: 'Anfahrt nach Luzern transparent klären',
        description: 'Luzern liegt ausserhalb des Radius von 30 km ab Zürich. Zusätzlich zum gewählten Reinigungspaket kann deshalb eine Anfahrtspauschale anfallen.',
        detail: 'Die genaue Höhe richtet sich nach dem Einsatzort und wird vor der Terminbestätigung transparent kommuniziert. Fragen Sie gerne eine individuelle Offerte an.',
      },
      metaTitle: 'Mobile Autoreinigung Luzern | RCC Royal Car Cleaning',
      metaDescription: 'Mobile Autoreinigung in Luzern direkt vor Ort. RCC bietet Innenreinigung, Aussenreinigung und Fahrzeugaufbereitung mit transparenter Offerte.',
    },
    en: {
      ...EN_COMMON,
      cityName: 'Lucerne',
      eyebrow: 'Mobile car care in Lucerne',
      h1: 'Mobile Car Cleaning in Lucerne',
      intro: 'RCC provides mobile car cleaning in Lucerne and brings the professional setup directly to your vehicle. You can arrange cleaning at home, at work or at another agreed location.',
      localDetail: 'For Lucerne and nearby service locations, we plan the appointment around your exact address or meeting point. This keeps the process practical for private customers and people arranging care around work.',
      packagesDescription: 'Prices on the packages page are organised by vehicle size and service. Request interior, exterior or complete cleaning in Basic or Premium for Lucerne.',
      businessText: 'RCC also works with Lucerne businesses that need cleaning for business vehicles, company cars, employee vehicles or fleets. Business customers can request an individual quote.',
      faqTitle: 'Lucerne mobile car cleaning FAQ',
      faqs: [
        { question: 'Does RCC offer mobile car cleaning in Lucerne?', answer: 'Yes. RCC provides mobile service throughout Switzerland and comes directly to your vehicle in Lucerne for the agreed cleaning.' },
        { question: 'Can an additional travel fee apply in Lucerne?', answer: 'Lucerne is more than 30 km from Zurich, so an additional travel fee may apply on top of the package price. The exact amount is explained before the appointment is confirmed.' },
        { question: 'Can cleaning take place at a workplace in Lucerne?', answer: 'Yes. A workplace or another suitable location can be requested. Include the location when asking for your quote.' },
        { question: 'Which packages are available for a car in Lucerne?', answer: 'You can choose interior, exterior or complete cleaning. Basic and Premium options are available across the vehicle sizes.' },
      ],
      ctaTitle: 'Request mobile car cleaning in Lucerne',
      ctaDescription: 'Send us your vehicle, preferred package and location. We will prepare the right quote including any applicable travel fee.',
      travel: {
        title: 'Travel to Lucerne, explained clearly',
        description: 'Lucerne is outside the 30 km radius from Zurich. An additional travel fee may therefore apply on top of the selected cleaning package.',
        detail: 'The amount depends on the service location and is communicated transparently before the appointment is confirmed. Request an individual quote for your location.',
      },
      metaTitle: 'Mobile Car Cleaning Lucerne | RCC Royal Car Cleaning',
      metaDescription: 'Professional mobile car cleaning in Lucerne at your location. Request interior, exterior or complete vehicle cleaning from RCC.',
    },
  },
  'mobile-autoreinigung/basel': {
    de: {
      ...DE_COMMON,
      cityName: 'Basel',
      eyebrow: 'Mobile Autopflege Basel',
      h1: 'Mobile Autoreinigung in Basel',
      intro: 'Mit RCC erhalten Sie mobile Autoreinigung in Basel direkt am vereinbarten Standort. Wir reinigen den Innenraum, die Aussenflächen oder das komplette Fahrzeug und bringen das Equipment mit.',
      localDetail: 'Basel ist ein wichtiger Arbeits- und Wirtschaftsstandort mit privaten und geschäftlichen Fahrzeugen. Geben Sie uns den gewünschten Standort und den Zustand Ihres Fahrzeugs an, damit wir die mobile Reinigung passend einordnen können.',
      packagesDescription: 'Für Basel stehen die geprüften RCC-Paketpreise nach Fahrzeuggrösse zur Verfügung. Wählen Sie Innenreinigung, Aussenreinigung oder Innen & Aussen als Basic oder Premium.',
      businessText: 'Unternehmen in Basel können die Reinigung von Geschäftsfahrzeugen, Firmenwagen, Mitarbeiterfahrzeugen oder Fuhrparks anfragen. Für den konkreten Umfang erstellen wir eine individuelle Firmenofferte.',
      faqTitle: 'Häufige Fragen zur Autoreinigung in Basel',
      faqs: [
        { question: 'Bietet RCC mobile Autoreinigung in Basel an?', answer: 'Ja. RCC ist in der ganzen Schweiz mobil tätig und kommt mit dem professionellen Equipment direkt zu Ihrem Fahrzeug in Basel.' },
        { question: 'Was kostet eine mobile Autoreinigung in Basel?', answer: 'Der Paketpreis richtet sich nach Fahrzeuggrösse und gewählter Leistung. Weil Basel mehr als 30 km von Zürich entfernt liegt, kann zusätzlich eine Anfahrtspauschale anfallen.' },
        { question: 'Kann RCC ein Firmenfahrzeug in Basel reinigen?', answer: 'Ja. Geschäftsfahrzeuge, Firmenwagen, Mitarbeiterfahrzeuge und Fuhrparks können für eine individuelle Firmenofferte angefragt werden.' },
        { question: 'Wie kläre ich die Anfahrt nach Basel?', answer: 'Senden Sie uns den genauen Standort mit Ihren Fahrzeugangaben. Die anwendbare Anfahrt wird vor der Terminbestätigung transparent kommuniziert.' },
      ],
      ctaTitle: 'Autoreinigung in Basel anfragen',
      ctaDescription: 'Fordern Sie eine unverbindliche Offerte für Ihr Fahrzeug und Ihren Basler Standort an.',
      travel: {
        title: 'Anfahrt nach Basel vorab besprechen',
        description: 'Basel liegt ausserhalb eines Radius von 30 km ab Zürich. Zusätzlich zum gewählten Paket kann daher ein Wegzuschlag anfallen.',
        detail: 'Die genaue Höhe richtet sich nach dem Einsatzort und wird vor der Terminbestätigung transparent mitgeteilt. So erhalten Sie eine klare Grundlage für Ihre Anfrage.',
      },
      metaTitle: 'Mobile Autoreinigung Basel | RCC Royal Car Cleaning',
      metaDescription: 'Mobile Autoreinigung in Basel direkt vor Ort. RCC bietet Autopflege, Innenreinigung, Aussenreinigung und Fahrzeugaufbereitung.',
    },
    en: {
      ...EN_COMMON,
      cityName: 'Basel',
      eyebrow: 'Mobile car care in Basel',
      h1: 'Mobile Car Cleaning in Basel',
      intro: 'RCC provides mobile car cleaning in Basel at your agreed location. We clean the interior, exterior or complete vehicle and bring the professional equipment to you.',
      localDetail: 'Basel is an important business and working city with private and company vehicles. Share your location and the condition of your vehicle so we can understand the right mobile service for your request.',
      packagesDescription: 'Verified RCC package prices are organised by vehicle size. Choose interior, exterior or combined cleaning in Basic or Premium for your Basel vehicle.',
      businessText: 'Basel companies can request cleaning for business vehicles, company cars, employee vehicles or fleets. We prepare an individual business quote for the specific scope.',
      faqTitle: 'Basel mobile car cleaning FAQ',
      faqs: [
        { question: 'Does RCC offer mobile car cleaning in Basel?', answer: 'Yes. RCC provides mobile service throughout Switzerland and brings the professional setup directly to your vehicle in Basel.' },
        { question: 'What does mobile car cleaning in Basel cost?', answer: 'The package price depends on vehicle size and selected service. Basel is more than 30 km from Zurich, so an additional travel fee may also apply.' },
        { question: 'Can RCC clean a company vehicle in Basel?', answer: 'Yes. Businesses can request an individual quote for business vehicles, company cars, employee vehicles and fleets.' },
        { question: 'How do I clarify travel to Basel?', answer: 'Send us the exact location and vehicle details. Any applicable travel fee is explained transparently before the appointment is confirmed.' },
      ],
      ctaTitle: 'Request car cleaning in Basel',
      ctaDescription: 'Request a no-obligation quote for your vehicle and Basel service location.',
      travel: {
        title: 'Travel to Basel, discussed in advance',
        description: 'Basel is outside the 30 km radius from Zurich. A travel surcharge may therefore apply in addition to the selected package.',
        detail: 'The amount depends on the service location and is communicated transparently before the appointment is confirmed. This gives you a clear basis for your request.',
      },
      metaTitle: 'Mobile Car Cleaning Basel | RCC Royal Car Cleaning',
      metaDescription: 'Professional mobile car cleaning in Basel at your location. RCC offers interior, exterior and complete vehicle care.',
    },
  },
  'mobile-autoreinigung/bern': {
    de: {
      ...DE_COMMON,
      cityName: 'Bern',
      eyebrow: 'Mobile Autopflege Bern',
      h1: 'Mobile Autoreinigung in Bern',
      intro: 'RCC kommt für die mobile Autoreinigung direkt zu Ihrem Fahrzeug in Bern. Sie erhalten professionelle Innenreinigung, Aussenreinigung oder Fahrzeugaufbereitung am vereinbarten Ort.',
      localDetail: 'Für Bern stimmen wir den Einsatzort individuell ab. Das eignet sich für private Fahrzeuge ebenso wie für Fahrzeuge, die während des Arbeitstags an einem Firmenstandort stehen.',
      packagesDescription: 'Die Paketpreise richten sich nach Fahrzeuggrösse und Reinigungsumfang. Auf der Paketseite finden Sie die Basispreise für Innen, Aussen und Komplettreinigung.',
      businessText: 'Bern ist auch für Geschäftskunden relevant. RCC erstellt auf Anfrage eine individuelle Offerte für Firmenfahrzeuge, Geschäftsfahrzeuge, Mitarbeiterfahrzeuge oder Fuhrparks.',
      faqTitle: 'Häufige Fragen zur Autoreinigung in Bern',
      faqs: [
        { question: 'Reinigt RCC Fahrzeuge mobil in Bern?', answer: 'Ja. RCC kommt mit dem professionellen Equipment zu Ihrem vereinbarten Standort in Bern und reinigt das Fahrzeug vor Ort.' },
        { question: 'Kann ich eine Autoreinigung in Bern am Arbeitsplatz buchen?', answer: 'Ein Arbeitsplatz kann als Einsatzort angefragt werden. Wir klären vorab, ob der gewünschte Standort für die Reinigung geeignet ist.' },
        { question: 'Gibt es in Bern einen Zuschlag für die Anfahrt?', answer: 'Bern liegt mehr als 30 km von Zürich entfernt. Zusätzlich zum Paketpreis kann deshalb eine Anfahrtspauschale anfallen. Die genaue Höhe wird vor der Bestätigung mitgeteilt.' },
        { question: 'Welche Leistungen sind in Bern verfügbar?', answer: 'Verfügbar sind Innenreinigung, Aussenreinigung und Komplettreinigung in Basic oder Premium für verschiedene Fahrzeuggrössen.' },
      ],
      ctaTitle: 'Mobile Autoreinigung in Bern anfragen',
      ctaDescription: 'Nennen Sie uns Ihren Standort in Bern und das gewünschte Paket. Wir senden Ihnen eine passende Offerte.',
      travel: {
        title: 'Anfahrt nach Bern transparent einplanen',
        description: 'Bern liegt mehr als 30 km von Zürich entfernt. Neben dem gewählten Reinigungspaket kann deshalb eine Anfahrtspauschale anfallen.',
        detail: 'Die genaue Höhe hängt vom Einsatzort ab und wird vor der Terminbestätigung transparent kommuniziert. Fragen Sie für Ihren Standort eine individuelle Offerte an.',
      },
      metaTitle: 'Mobile Autoreinigung Bern | RCC Royal Car Cleaning',
      metaDescription: 'Mobile Autoreinigung in Bern am vereinbarten Standort. RCC bietet Innenreinigung, Aussenreinigung und Fahrzeugaufbereitung.',
    },
    en: {
      ...EN_COMMON,
      cityName: 'Bern',
      eyebrow: 'Mobile car care in Bern',
      h1: 'Mobile Car Cleaning in Bern',
      intro: 'RCC comes directly to your vehicle in Bern for professional mobile car cleaning. Request interior cleaning, exterior care or complete detailing at an agreed location.',
      localDetail: 'For Bern appointments, we agree the service location with you individually. This can suit private vehicles as well as cars kept at a workplace during the day.',
      packagesDescription: 'Package pricing depends on vehicle size and cleaning scope. The packages page shows base prices for interior, exterior and complete cleaning.',
      businessText: 'Bern business customers can request an individual quote for company vehicles, business vehicles, employee vehicles or fleets at an agreed site.',
      faqTitle: 'Bern mobile car cleaning FAQ',
      faqs: [
        { question: 'Does RCC clean vehicles on location in Bern?', answer: 'Yes. RCC brings the professional setup to your agreed Bern location and cleans the vehicle there.' },
        { question: 'Can I book car cleaning at my workplace in Bern?', answer: 'A workplace can be requested as the service location. We confirm that the location is suitable before the appointment.' },
        { question: 'Does travel to Bern add a fee?', answer: 'Bern is more than 30 km from Zurich, so an additional travel fee may apply on top of the package price. The exact amount is shared before confirmation.' },
        { question: 'Which services are available in Bern?', answer: 'Interior, exterior and complete cleaning are available in Basic or Premium for different vehicle sizes.' },
      ],
      ctaTitle: 'Request mobile car cleaning in Bern',
      ctaDescription: 'Tell us your Bern location and preferred package. We will send a quote tailored to your request.',
      travel: {
        title: 'Planning travel to Bern clearly',
        description: 'Bern is more than 30 km from Zurich. An additional travel fee may therefore apply alongside the selected cleaning package.',
        detail: 'The amount depends on the service location and is communicated transparently before the appointment is confirmed. Request an individual quote for your location.',
      },
      metaTitle: 'Mobile Car Cleaning Bern | RCC Royal Car Cleaning',
      metaDescription: 'Professional mobile car cleaning in Bern at your agreed location. Request interior, exterior or complete vehicle cleaning.',
    },
  },
  'mobile-autoreinigung/st-gallen': {
    de: {
      ...DE_COMMON,
      cityName: 'St. Gallen',
      eyebrow: 'Mobile Autopflege St. Gallen',
      h1: 'Mobile Autoreinigung in St. Gallen',
      intro: 'RCC bietet mobile Autoreinigung in St. Gallen und kommt direkt zu Ihrem Fahrzeug. Innenraum, Aussenflächen oder die komplette Fahrzeugpflege werden am vereinbarten Standort ausgeführt.',
      localDetail: 'St. Gallen liegt im Osten der Schweiz und ist mit seinem Stadtgebiet und den umliegenden Wohn- und Arbeitsorten ein eigener Einsatzmarkt. Senden Sie uns den genauen Standort, damit wir die Anfrage verlässlich planen können.',
      packagesDescription: 'Die RCC-Pakete für St. Gallen richten sich nach Fahrzeuggrösse und Umfang. Alle Basispreise für Innen, Aussen und Innen & Aussen finden Sie auf der Paketseite.',
      businessText: 'Auch Firmen in St. Gallen können mobile Reinigung für Geschäftsfahrzeuge, Firmenwagen, Mitarbeiterfahrzeuge und Fuhrparks anfragen. Der genaue Bedarf wird in einer individuellen Firmenofferte geklärt.',
      faqTitle: 'Häufige Fragen zur Autoreinigung in St. Gallen',
      faqs: [
        { question: 'Ist mobile Autoreinigung in St. Gallen möglich?', answer: 'Ja. RCC kommt mit dem professionellen Reinigungsequipment zu Ihrem vereinbarten Standort in St. Gallen.' },
        { question: 'Gilt für St. Gallen eine zusätzliche Anfahrt?', answer: 'St. Gallen liegt mehr als 30 km von Zürich entfernt. Zusätzlich zum gewählten Paket kann eine Anfahrtspauschale anfallen. Die genaue Höhe wird vor der Terminbestätigung kommuniziert.' },
        { question: 'Welche Autopflege kann ich in St. Gallen wählen?', answer: 'Sie können Innenreinigung, Aussenreinigung oder eine komplette Innen- und Aussenreinigung in Basic oder Premium anfragen.' },
        { question: 'Reinigt RCC auch mehrere Firmenfahrzeuge?', answer: 'Unternehmen können eine individuelle Firmenofferte für Geschäftsfahrzeuge, Mitarbeiterfahrzeuge oder Fuhrparks anfragen.' },
      ],
      ctaTitle: 'Autoreinigung in St. Gallen anfragen',
      ctaDescription: 'Übermitteln Sie uns Fahrzeug, Paket und Einsatzort in St. Gallen. Wir klären die Offerte und die Anfahrt mit Ihnen.',
      travel: {
        title: 'Anfahrt nach St. Gallen klären',
        description: 'St. Gallen liegt ausserhalb eines Radius von 30 km ab Zürich. Zusätzlich zum gewählten Paket kann ein Wegzuschlag anfallen.',
        detail: 'Die genaue Höhe richtet sich nach dem Einsatzort und wird vor der Terminbestätigung transparent mitgeteilt. Eine individuelle Offerte schafft Klarheit.',
      },
      metaTitle: 'Mobile Autoreinigung St. Gallen | RCC Royal Car Cleaning',
      metaDescription: 'Mobile Autoreinigung in St. Gallen direkt am vereinbarten Standort. RCC bietet Innen-, Aussen- und Komplettreinigung.',
    },
  },
  'mobile-autoreinigung/geneve': {
    fr: {
      ...FR_COMMON,
      cityName: 'Genève',
      eyebrow: 'Nettoyage automobile mobile à Genève',
      h1: 'Nettoyage voiture mobile à Genève',
      intro: 'RCC propose un nettoyage automobile mobile professionnel à Genève. Nous venons au lieu convenu avec le matériel nécessaire pour l’intérieur, l’extérieur ou la préparation complète de votre véhicule.',
      localDetail: 'Pour Genève, nous organisons l’intervention selon votre lieu exact, à domicile, sur votre lieu de travail ou à un autre emplacement adapté. Cette approche convient aussi bien aux habitants qu’aux personnes qui travaillent dans le canton.',
      packagesDescription: 'Les forfaits RCC sont calculés selon la taille du véhicule et la prestation choisie. Consultez les tarifs de base pour l’intérieur, l’extérieur et le nettoyage complet.',
      businessText: 'Les entreprises genevoises peuvent demander une offre personnalisée pour les véhicules professionnels, voitures de société, véhicules des collaborateurs ou flottes.',
      faqTitle: 'Questions fréquentes sur le nettoyage à Genève',
      faqs: [
        { question: 'RCC se déplace-t-il à Genève pour nettoyer une voiture ?', answer: 'Oui. RCC intervient dans toute la Suisse et vient directement au lieu convenu à Genève avec le matériel professionnel.' },
        { question: 'Des frais de déplacement peuvent-ils s’appliquer à Genève ?', answer: 'Genève se trouve à plus de 30 km de Zurich. Des frais de déplacement peuvent donc s’ajouter au forfait choisi. Le montant exact est communiqué avant la confirmation du rendez-vous.' },
        { question: 'Puis-je demander un nettoyage sur mon lieu de travail à Genève ?', answer: 'Oui, vous pouvez indiquer votre lieu de travail ou un autre emplacement adapté dans votre demande de devis.' },
        { question: 'Quels forfaits sont proposés à Genève ?', answer: 'RCC propose le nettoyage intérieur, extérieur et complet, en Basic ou Premium selon la taille du véhicule.' },
      ],
      ctaTitle: 'Demander un nettoyage mobile à Genève',
      ctaDescription: 'Indiquez votre véhicule, le lieu souhaité et le forfait qui vous intéresse. Nous vous répondons avec une offre claire.',
      travel: {
        title: 'Déplacement jusqu’à Genève',
        description: 'Genève se situe en dehors du rayon de 30 km à partir de Zurich. Des frais de déplacement peuvent s’ajouter au forfait de nettoyage choisi.',
        detail: 'Le montant dépend du lieu d’intervention et vous est communiqué de manière transparente avant la confirmation du rendez-vous. Demandez votre devis personnalisé.',
      },
      metaTitle: 'Nettoyage Voiture Mobile Genève | RCC Royal Car Cleaning',
      metaDescription: 'Nettoyage voiture mobile professionnel à Genève. RCC vient à votre emplacement pour l’intérieur, l’extérieur ou la préparation complète.',
    },
    en: {
      ...EN_COMMON,
      cityName: 'Geneva',
      eyebrow: 'Mobile car care in Geneva',
      h1: 'Mobile Car Cleaning in Geneva',
      intro: 'RCC provides professional mobile car cleaning in Geneva. We bring the required setup to your agreed location for interior, exterior or complete vehicle care.',
      localDetail: 'For Geneva, we plan the appointment around your exact location, whether you are arranging care at home, at work or at another suitable place. This is designed for international residents as well as business customers in the canton.',
      packagesDescription: 'RCC packages are priced by vehicle size and selected service. Check the base prices for interior, exterior and complete cleaning on the packages page.',
      businessText: 'Geneva companies can request an individual quote for business vehicles, company cars, employee vehicles or fleets at an agreed location.',
      faqTitle: 'Geneva mobile car cleaning FAQ',
      faqs: [
        { question: 'Does RCC travel to Geneva for car cleaning?', answer: 'Yes. RCC serves customers throughout Switzerland and comes directly to the agreed Geneva location with the professional equipment.' },
        { question: 'Can a travel fee apply for Geneva?', answer: 'Geneva is more than 30 km from Zurich, so an additional travel fee may apply on top of the selected package. The exact amount is shared before the appointment is confirmed.' },
        { question: 'Can I request cleaning at my workplace in Geneva?', answer: 'Yes. Include your workplace or another suitable location in the quote request and we will confirm the details.' },
        { question: 'Which packages are available in Geneva?', answer: 'RCC offers interior, exterior and complete cleaning in Basic or Premium, depending on vehicle size.' },
      ],
      ctaTitle: 'Request mobile car cleaning in Geneva',
      ctaDescription: 'Share your vehicle, preferred location and package. We will reply with a clear quote for your request.',
      travel: {
        title: 'Travel to Geneva',
        description: 'Geneva is outside the 30 km radius from Zurich. An additional travel fee may apply alongside the selected cleaning package.',
        detail: 'The amount depends on the service location and is communicated transparently before the appointment is confirmed. Request your individual quote.',
      },
      metaTitle: 'Mobile Car Cleaning Geneva | RCC Royal Car Cleaning',
      metaDescription: 'Professional mobile car cleaning in Geneva at your location. RCC offers interior, exterior and complete vehicle care for residents and businesses.',
    },
  },
  'mobile-autoreinigung/lausanne': {
    fr: {
      ...FR_COMMON,
      cityName: 'Lausanne',
      eyebrow: 'Nettoyage automobile mobile à Lausanne',
      h1: 'Nettoyage voiture mobile à Lausanne',
      intro: 'RCC vient directement à Lausanne pour nettoyer votre véhicule sur place. Demandez un nettoyage intérieur, extérieur ou une préparation complète au lieu qui vous convient.',
      localDetail: 'À Lausanne, nous convenons du lieu d’intervention selon votre organisation, à domicile, au bureau ou à un autre endroit approprié. Indiquez l’emplacement exact pour que nous puissions préparer la prestation.',
      packagesDescription: 'Les tarifs de base sont présentés selon la taille du véhicule et le forfait choisi. La page des forfaits détaille les prestations intérieur, extérieur et complète.',
      businessText: 'RCC accompagne aussi les entreprises de Lausanne pour leurs véhicules professionnels, voitures de société, véhicules des collaborateurs et flottes, sur demande d’offre personnalisée.',
      faqTitle: 'Questions fréquentes sur le nettoyage à Lausanne',
      faqs: [
        { question: 'Le nettoyage voiture mobile est-il disponible à Lausanne ?', answer: 'Oui. RCC se déplace dans toute la Suisse et vient directement au lieu convenu à Lausanne.' },
        { question: 'Les frais de déplacement sont-ils indiqués à l’avance ?', answer: 'Lausanne se trouve à plus de 30 km de Zurich. Des frais de déplacement peuvent s’ajouter au forfait. Le montant exact est communiqué de façon transparente avant la confirmation.' },
        { question: 'Puis-je faire nettoyer ma voiture pendant ma journée de travail ?', answer: 'Oui, un lieu de travail peut être proposé s’il convient à l’intervention. Indiquez-le dans votre demande de devis.' },
        { question: 'Quelle prestation choisir pour une voiture très utilisée ?', answer: 'Le nettoyage intérieur convient à l’habitacle, le nettoyage extérieur à la carrosserie et le forfait complet combine les deux. Nous pouvons vous orienter dans votre demande.' },
      ],
      ctaTitle: 'Demander un nettoyage mobile à Lausanne',
      ctaDescription: 'Envoyez-nous les détails de votre véhicule et le lieu souhaité à Lausanne. Nous vous préparons une offre personnalisée.',
      travel: {
        title: 'Déplacement jusqu’à Lausanne',
        description: 'Lausanne est située au-delà du rayon de 30 km depuis Zurich. Des frais de déplacement peuvent donc s’ajouter au forfait choisi.',
        detail: 'Le montant dépend du lieu d’intervention et vous est communiqué avant la confirmation du rendez-vous. Une demande de devis permet de le clarifier.',
      },
      metaTitle: 'Nettoyage Voiture Mobile Lausanne | RCC Royal Car Cleaning',
      metaDescription: 'Nettoyage voiture mobile professionnel à Lausanne. RCC intervient à votre emplacement pour l’intérieur, l’extérieur ou le forfait complet.',
    },
    en: {
      ...EN_COMMON,
      cityName: 'Lausanne',
      eyebrow: 'Mobile car care in Lausanne',
      h1: 'Mobile Car Cleaning in Lausanne',
      intro: 'RCC comes directly to Lausanne to clean your vehicle on location. Request interior cleaning, exterior care or complete detailing at a place that works for you.',
      localDetail: 'In Lausanne, we agree the service location around your schedule, whether that is home, work or another suitable place. Include the exact location so we can prepare the appointment properly.',
      packagesDescription: 'Base prices are organised by vehicle size and selected package. The packages page explains the interior, exterior and complete cleaning options.',
      businessText: 'Lausanne companies can request an individual quote for business vehicles, company cars, employee vehicles and fleets at an agreed location.',
      faqTitle: 'Lausanne mobile car cleaning FAQ',
      faqs: [
        { question: 'Is mobile car cleaning available in Lausanne?', answer: 'Yes. RCC serves customers throughout Switzerland and comes directly to the agreed location in Lausanne.' },
        { question: 'Are travel fees explained before an appointment in Lausanne?', answer: 'Lausanne is more than 30 km from Zurich. An additional travel fee may apply, and the exact amount is explained transparently before confirmation.' },
        { question: 'Can my car be cleaned while I am at work in Lausanne?', answer: 'Yes, a workplace can be proposed if it is suitable for the service. Include it in your quote request.' },
        { question: 'Which service should I choose for a heavily used car?', answer: 'Interior cleaning focuses on the cabin, exterior cleaning on the bodywork and complete cleaning combines both. We can help you choose in the request.' },
      ],
      ctaTitle: 'Request mobile car cleaning in Lausanne',
      ctaDescription: 'Send us your vehicle details and preferred Lausanne location. We will prepare an individual quote.',
      travel: {
        title: 'Travel to Lausanne',
        description: 'Lausanne is beyond the 30 km radius from Zurich. An additional travel fee may therefore apply on top of the selected package.',
        detail: 'The amount depends on the service location and is shared before the appointment is confirmed. A quote request makes this clear for your location.',
      },
      metaTitle: 'Mobile Car Cleaning Lausanne | RCC Royal Car Cleaning',
      metaDescription: 'Professional mobile car cleaning in Lausanne at your location. RCC offers interior, exterior and complete vehicle care.',
    },
  },
};

export function getCityPageContent(routeKey: CityRouteKey, lang: Lang): CityPageCopy {
  const content = CITY_PAGES[routeKey]?.[lang];
  if (!content) {
    throw new Error(`Missing city page content for ${routeKey} in ${lang}`);
  }
  return content;
}