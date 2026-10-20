import type { CatalogLanguage } from '@workspace/service-catalog';

export const PRICING_LABELS: Record<CatalogLanguage, {
  vehicleEyebrow: string;
  vehicleTitle: string;
  vehicleHelp: string;
  packagesEyebrow: string;
  packagesTitle: string;
  packagesHelp: string;
  standard: string;
  premium: string;
  recommended: string;
  interior: string;
  exterior: string;
  steps: string;
  selectPackage: string;
  selected: string;
  request: string;
  from: string;
  extrasEyebrow: string;
  extrasTitle: string;
  extrasHelp: string;
  interiorExtras: string;
  exteriorExtras: string;
  chooseVariant: string;
  summaryTitle: string;
  package: string;
  vehicle: string;
  extras: string;
  noExtras: string;
  total: string;
  notSelected: string;
  chooseVehicle: string;
  choosePackage: string;
  estimateNote: string;
  variableNote: string;
  sendRequest: string;
}> = {
  de: {
    vehicleEyebrow: 'Schritt 01',
    vehicleTitle: 'Fahrzeugkategorie wählen',
    vehicleHelp: 'Alle Preise passen sich sofort Ihrer Fahrzeugkategorie an.',
    packagesEyebrow: 'Schritt 02',
    packagesTitle: 'Paket wählen',
    packagesHelp: 'Sechs Pakete in drei Kategorien. Jeder Arbeitsschritt ist vollständig aufgeführt.',
    standard: 'Standard',
    premium: 'Premium',
    recommended: 'Empfohlen',
    interior: 'Innen',
    exterior: 'Aussen',
    steps: 'Arbeitsschritte',
    selectPackage: 'Paket wählen',
    selected: 'Ausgewählt',
    request: 'Offerte anfragen',
    from: 'ab',
    extrasEyebrow: 'Schritt 03',
    extrasTitle: 'Extras hinzufügen',
    extrasHelp: 'Optional. Wählen Sie beliebig viele Zusatzleistungen.',
    interiorExtras: 'Extras Innen',
    exteriorExtras: 'Extras Aussen',
    chooseVariant: 'Umfang wählen',
    summaryTitle: 'Ihre Auswahl',
    package: 'Paket',
    vehicle: 'Fahrzeug',
    extras: 'Extras',
    noExtras: 'Keine Extras',
    total: 'Total',
    notSelected: 'Noch nicht gewählt',
    chooseVehicle: 'Bitte Fahrzeugkategorie wählen',
    choosePackage: 'Bitte Paket wählen',
    estimateNote: 'Richtpreis in CHF inkl. Extras. Anfahrtskosten separat.',
    variableNote: 'Mindestens ein Extra mit variablem Preis gewählt.',
    sendRequest: 'Auswahl anfragen',
  },
  en: {
    vehicleEyebrow: 'Step 01',
    vehicleTitle: 'Choose vehicle category',
    vehicleHelp: 'All prices adjust instantly to your vehicle category.',
    packagesEyebrow: 'Step 02',
    packagesTitle: 'Choose a package',
    packagesHelp: 'Six packages in three categories. Every work step is listed in full.',
    standard: 'Standard',
    premium: 'Premium',
    recommended: 'Recommended',
    interior: 'Interior',
    exterior: 'Exterior',
    steps: 'work steps',
    selectPackage: 'Select package',
    selected: 'Selected',
    request: 'Request a quote',
    from: 'from',
    extrasEyebrow: 'Step 03',
    extrasTitle: 'Add extras',
    extrasHelp: 'Optional. Choose as many add-ons as you like.',
    interiorExtras: 'Interior extras',
    exteriorExtras: 'Exterior extras',
    chooseVariant: 'Choose scope',
    summaryTitle: 'Your selection',
    package: 'Package',
    vehicle: 'Vehicle',
    extras: 'Extras',
    noExtras: 'No extras',
    total: 'Total',
    notSelected: 'Not selected yet',
    chooseVehicle: 'Please choose a vehicle category',
    choosePackage: 'Please choose a package',
    estimateNote: 'Guide price in CHF incl. extras. Travel costs charged separately.',
    variableNote: 'At least one extra with a variable price is selected.',
    sendRequest: 'Request this selection',
  },
  fr: {
    vehicleEyebrow: 'Étape 01',
    vehicleTitle: 'Choisir la catégorie de véhicule',
    vehicleHelp: 'Tous les prix s’adaptent instantanément à votre catégorie de véhicule.',
    packagesEyebrow: 'Étape 02',
    packagesTitle: 'Choisir un forfait',
    packagesHelp: 'Six forfaits en trois catégories. Chaque étape de travail est détaillée.',
    standard: 'Standard',
    premium: 'Premium',
    recommended: 'Recommandé',
    interior: 'Intérieur',
    exterior: 'Extérieur',
    steps: 'étapes',
    selectPackage: 'Choisir ce forfait',
    selected: 'Sélectionné',
    request: 'Demander une offre',
    from: 'dès',
    extrasEyebrow: 'Étape 03',
    extrasTitle: 'Ajouter des options',
    extrasHelp: 'Facultatif. Choisissez autant d’options que vous le souhaitez.',
    interiorExtras: 'Options intérieur',
    exteriorExtras: 'Options extérieur',
    chooseVariant: 'Choisir l’étendue',
    summaryTitle: 'Votre sélection',
    package: 'Forfait',
    vehicle: 'Véhicule',
    extras: 'Options',
    noExtras: 'Aucune option',
    total: 'Total',
    notSelected: 'Pas encore choisi',
    chooseVehicle: 'Veuillez choisir une catégorie de véhicule',
    choosePackage: 'Veuillez choisir un forfait',
    estimateNote: 'Prix indicatif en CHF options comprises. Frais de déplacement en sus.',
    variableNote: 'Au moins une option à prix variable est sélectionnée.',
    sendRequest: 'Demander cette sélection',
  },
};

export function asCatalogLang(lang: string): CatalogLanguage {
  return lang === 'en' || lang === 'fr' ? lang : 'de';
}
