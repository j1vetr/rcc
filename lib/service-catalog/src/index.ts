export type CatalogLanguage = 'de' | 'en' | 'fr';
export type VehicleCategory = 'small' | 'medium' | 'xl';
export type ServiceCategory = 'inside-outside' | 'interior' | 'exterior';
export type ServiceLevel = 'basic' | 'premium';

export const vehicleCategoryOrder: VehicleCategory[] = ['small', 'medium', 'xl'];

export const vehicleCategories: Record<CatalogLanguage, Record<VehicleCategory, string>> = {
  de: {
    small: 'Kleinwagen (Kompaktwagen & Coupés)',
    medium: 'Mittelklasse (Limousinen & SUVs)',
    xl: 'Extra grosse Autos (7-Sitzer, Vans, Lieferwagen)',
  },
  en: {
    small: 'Small cars (compact cars & coupés)',
    medium: 'Mid-size (saloons & SUVs)',
    xl: 'Extra large vehicles (7-seaters, vans, delivery vans)',
  },
  fr: {
    small: 'Petites voitures (compactes & coupés)',
    medium: 'Catégorie moyenne (berlines & SUV)',
    xl: 'Très grands véhicules (7 places, monospaces, utilitaires)',
  },
};

export interface CatalogService {
  id: string;
  category: ServiceCategory;
  level: ServiceLevel;
  nameDE: string;
  nameFR: string;
  nameEN: string;
  descriptionDE: string;
  descriptionFR: string;
  descriptionEN: string;
  prices: Record<VehicleCategory, number>;
  exteriorFeaturesDE: string[];
  exteriorFeaturesFR: string[];
  exteriorFeaturesEN: string[];
  interiorFeaturesDE: string[];
  interiorFeaturesFR: string[];
  interiorFeaturesEN: string[];
}

const STD_EXT = {
  DE: [
    'Felgen von aussen gründlich reinigen',
    'Reifen sorgfältig reinigen',
    'Tankdeckel und den inneren Bereich gründlich reinigen',
    'Die gesamte Karosserie lackschonend von Hand waschen',
    'Seitenfenster von aussen streifenfrei reinigen',
    'Das Fahrzeug anschliessend sorgfältig und lackschonend trocknen',
  ],
  EN: [
    'Thoroughly clean the outside of the wheel rims',
    'Carefully clean the tyres',
    'Thoroughly clean the fuel flap and its inner area',
    'Hand wash the entire body in a paint-safe way',
    'Clean the side windows streak-free from the outside',
    'Then dry the vehicle carefully and in a paint-safe way',
  ],
  FR: [
    "Nettoyer soigneusement l'extérieur des jantes",
    'Nettoyer les pneus avec soin',
    'Nettoyer soigneusement la trappe à carburant et sa zone intérieure',
    "Laver toute la carrosserie à la main en préservant la peinture",
    "Nettoyer les vitres latérales à l'extérieur sans traces",
    'Sécher ensuite le véhicule avec soin en préservant la peinture',
  ],
};

const STD_INT = {
  DE: [
    'Zwischenräume, Ritzen und schwer erreichbare Stellen mit Druckluft gründlich ausblasen',
    'Fahrgastraum sorgfältig absaugen',
    'Kofferraum vollständig absaugen',
    'Armaturenbrett gründlich reinigen',
    'Türverkleidungen sorgfältig reinigen',
    'Türfalze gründlich reinigen',
    'Seitenfenster von innen streifenfrei reinigen',
  ],
  EN: [
    'Thoroughly blow out gaps, crevices and hard-to-reach areas with compressed air',
    'Carefully vacuum the passenger compartment',
    'Fully vacuum the boot',
    'Thoroughly clean the dashboard',
    'Carefully clean the door panels',
    'Thoroughly clean the door jambs',
    'Clean the side windows streak-free from the inside',
  ],
  FR: [
    "Souffler soigneusement à l'air comprimé les interstices, fentes et zones difficiles d'accès",
    "Aspirer soigneusement l'habitacle",
    'Aspirer entièrement le coffre',
    'Nettoyer soigneusement le tableau de bord',
    'Nettoyer soigneusement les panneaux de porte',
    'Nettoyer soigneusement les feuillures de porte',
    "Nettoyer les vitres latérales à l'intérieur sans traces",
  ],
};

const PREM_EXT = {
  DE: [
    'Hochdruck-Vorreinigung zum schonenden Lösen von grobem Schmutz',
    'Hartnäckige Insektenrückstände auf dem Lack gezielt vorbehandeln und entfernen',
    'Flugrost materialschonend vom Lack entfernen',
    'Felgen detailliert und mit geeigneten Reinigungsmitteln reinigen',
    'Reifen gründlich reinigen',
    'Tankdeckel und den umliegenden Bereich sorgfältig reinigen',
    'Die gesamte Karosserie gründlich und lackschonend von Hand waschen',
    'Seitenfenster von aussen streifenfrei reinigen',
    'Front- und Heckscheibe von aussen gründlich reinigen',
    'Das Fahrzeug sorgfältig und lackschonend trocknen',
    'Reifen abschliessend pflegen und schwärzen',
  ],
  EN: [
    'High-pressure pre-wash to gently loosen coarse dirt',
    'Pre-treat and remove stubborn insect residue on the paint',
    'Remove flash rust from the paint in a material-safe way',
    'Clean the wheel rims in detail with suitable cleaning products',
    'Thoroughly clean the tyres',
    'Carefully clean the fuel flap and the surrounding area',
    'Hand wash the entire body thoroughly and in a paint-safe way',
    'Clean the side windows streak-free from the outside',
    'Thoroughly clean the windscreen and rear window from the outside',
    'Dry the vehicle carefully and in a paint-safe way',
    'Finally condition and blacken the tyres',
  ],
  FR: [
    'Prélavage haute pression pour détacher en douceur la saleté grossière',
    'Prétraiter et éliminer de manière ciblée les résidus d’insectes tenaces sur la peinture',
    'Éliminer la rouille volante de la peinture en préservant les matériaux',
    'Nettoyer les jantes en détail avec des produits adaptés',
    'Nettoyer soigneusement les pneus',
    'Nettoyer avec soin la trappe à carburant et la zone environnante',
    'Laver toute la carrosserie à la main, en profondeur et en préservant la peinture',
    "Nettoyer les vitres latérales à l'extérieur sans traces",
    "Nettoyer soigneusement le pare-brise et la lunette arrière à l'extérieur",
    'Sécher le véhicule avec soin en préservant la peinture',
    'Pour finir, entretenir et noircir les pneus',
  ],
};

const PREM_INT = {
  DE: [
    'Fussmatten entnehmen und für die gründliche Reinigung vorbereiten',
    'Zwischenräume, Ritzen und schwer erreichbare Stellen mit Druckluft gründlich ausblasen',
    'Lüftungsdüsen sorgfältig reinigen',
    'Fahrgastraum gründlich absaugen',
    'Kofferraum vollständig absaugen',
    'Armaturenbrett materialgerecht reinigen',
    'Cockpit und Türen inklusive kleiner Details mit Pinseln tiefenreinigen',
    'Türverkleidungen gründlich reinigen und pflegen',
    'Lederausstattung im gesamten Fahrzeug schonend und gründlich reinigen',
    'Türfalze sorgfältig reinigen',
    'Fussmatten intensiv shampoonieren und mit dem Sprühextraktor tiefenreinigen',
    'Seitenfenster von innen streifenfrei reinigen',
  ],
  EN: [
    'Remove the floor mats and prepare them for thorough cleaning',
    'Thoroughly blow out gaps, crevices and hard-to-reach areas with compressed air',
    'Carefully clean the air vents',
    'Thoroughly vacuum the passenger compartment',
    'Fully vacuum the boot',
    'Clean the dashboard with material-appropriate care',
    'Deep clean the cockpit and doors including small details with brushes',
    'Thoroughly clean and condition the door panels',
    'Gently and thoroughly clean the leather upholstery throughout the vehicle',
    'Carefully clean the door jambs',
    'Intensively shampoo the floor mats and deep clean them with the spray extractor',
    'Clean the side windows streak-free from the inside',
  ],
  FR: [
    'Retirer les tapis de sol et les préparer pour un nettoyage approfondi',
    "Souffler soigneusement à l'air comprimé les interstices, fentes et zones difficiles d'accès",
    "Nettoyer avec soin les bouches d'aération",
    "Aspirer soigneusement l'habitacle",
    'Aspirer entièrement le coffre',
    'Nettoyer le tableau de bord de manière adaptée aux matériaux',
    'Nettoyer en profondeur au pinceau le cockpit et les portes, petits détails compris',
    'Nettoyer et entretenir soigneusement les panneaux de porte',
    "Nettoyer en douceur et en profondeur le cuir dans tout le véhicule",
    'Nettoyer avec soin les feuillures de porte',
    "Shampouiner intensivement les tapis de sol et les nettoyer en profondeur à l'injecteur-extracteur",
    "Nettoyer les vitres latérales à l'intérieur sans traces",
  ],
};

const none = { DE: [] as string[], EN: [] as string[], FR: [] as string[] };

function feats(ext: typeof none, int: typeof none) {
  return {
    exteriorFeaturesDE: [...ext.DE],
    exteriorFeaturesFR: [...ext.FR],
    exteriorFeaturesEN: [...ext.EN],
    interiorFeaturesDE: [...int.DE],
    interiorFeaturesFR: [...int.FR],
    interiorFeaturesEN: [...int.EN],
  };
}

export const services: CatalogService[] = [
  {
    id: 'inside-outside-basic',
    category: 'inside-outside',
    level: 'basic',
    nameDE: 'Standard Paket',
    nameFR: 'Forfait Standard',
    nameEN: 'Standard Package',
    descriptionDE: 'Gründliche Innen- und Aussenreinigung für ein gepflegtes Fahrzeug.',
    descriptionFR: "Nettoyage soigné de l'intérieur et de l'extérieur pour un véhicule entretenu.",
    descriptionEN: 'Thorough interior and exterior cleaning for a well-kept vehicle.',
    prices: { small: 150, medium: 219, xl: 279 },
    ...feats(STD_EXT, STD_INT),
  },
  {
    id: 'inside-outside-premium',
    category: 'inside-outside',
    level: 'premium',
    nameDE: 'Premium Aufbereitung Paket',
    nameFR: 'Forfait Préparation Premium',
    nameEN: 'Premium Detailing Package',
    descriptionDE: 'Intensive Aufbereitung innen und aussen bis ins kleinste Detail.',
    descriptionFR: "Préparation intensive de l'intérieur et de l'extérieur jusque dans les moindres détails.",
    descriptionEN: 'Intensive detailing inside and out down to the smallest detail.',
    prices: { small: 279, medium: 329, xl: 400 },
    ...feats(PREM_EXT, PREM_INT),
  },
  {
    id: 'interior-basic',
    category: 'interior',
    level: 'basic',
    nameDE: 'Innenreinigung Standard',
    nameFR: 'Nettoyage intérieur Standard',
    nameEN: 'Interior Cleaning Standard',
    descriptionDE: 'Sorgfältige Reinigung des Innenraums für ein frisches Fahrgefühl.',
    descriptionFR: "Nettoyage soigné de l'habitacle pour une sensation de fraîcheur.",
    descriptionEN: 'Careful interior cleaning for a fresh driving feel.',
    prices: { small: 100, medium: 120, xl: 140 },
    ...feats(none, STD_INT),
  },
  {
    id: 'interior-premium',
    category: 'interior',
    level: 'premium',
    nameDE: 'Innenreinigung Premium (Aufbereitung)',
    nameFR: 'Nettoyage intérieur Premium (préparation)',
    nameEN: 'Interior Cleaning Premium (Detailing)',
    descriptionDE: 'Tiefenreinigung und Pflege des gesamten Innenraums.',
    descriptionFR: "Nettoyage en profondeur et entretien de tout l'habitacle.",
    descriptionEN: 'Deep cleaning and care for the entire interior.',
    prices: { small: 199, medium: 239, xl: 289 },
    ...feats(none, PREM_INT),
  },
  {
    id: 'exterior-basic',
    category: 'exterior',
    level: 'basic',
    nameDE: 'Aussenreinigung Standard',
    nameFR: 'Nettoyage extérieur Standard',
    nameEN: 'Exterior Cleaning Standard',
    descriptionDE: 'Lackschonende Handwäsche für einen sauberen Auftritt.',
    descriptionFR: 'Lavage à la main respectueux de la peinture pour une allure soignée.',
    descriptionEN: 'Paint-safe hand wash for a clean appearance.',
    prices: { small: 95, medium: 129, xl: 169 },
    ...feats(STD_EXT, none),
  },
  {
    id: 'exterior-premium',
    category: 'exterior',
    level: 'premium',
    nameDE: 'Aussenreinigung Premium',
    nameFR: 'Nettoyage extérieur Premium',
    nameEN: 'Exterior Cleaning Premium',
    descriptionDE: 'Intensive Aussenaufbereitung mit Vorreinigung und Reifenpflege.',
    descriptionFR: 'Préparation extérieure intensive avec prélavage et soin des pneus.',
    descriptionEN: 'Intensive exterior detailing with pre-wash and tyre care.',
    prices: { small: 109, medium: 149, xl: 159 },
    ...feats(PREM_EXT, none),
  },
];

export interface ExtraVariant {
  id: string;
  label: Record<CatalogLanguage, string>;
  price: number;
}

export interface CatalogExtra {
  id: string;
  category: 'interior' | 'exterior';
  name: Record<CatalogLanguage, string>;
  description: Record<CatalogLanguage, string>;
  variablePrice: boolean;
  variants: ExtraVariant[];
}

const std = (price: number): ExtraVariant[] => [
  { id: 'default', label: { de: 'Standard', en: 'Standard', fr: 'Standard' }, price },
];

export const variablePriceNotice: Record<CatalogLanguage, string> = {
  de: 'Hinweis: Preis kann je nach Situation des Fahrzeugs abweichen.',
  en: 'Note: The price may vary depending on the condition of the vehicle.',
  fr: "Remarque : le prix peut varier selon l'état du véhicule.",
};

export const extras: CatalogExtra[] = [
  {
    id: 'carpet-deep-cleaning',
    category: 'interior',
    name: { de: 'Teppich-Tiefenreinigung', en: 'Carpet deep cleaning', fr: 'Nettoyage en profondeur des moquettes' },
    description: {
      de: 'Teppiche werden shampooniert und mit dem Nasssauger gründlich tiefengereinigt.',
      en: 'Carpets are shampooed and thoroughly deep cleaned with a wet vacuum.',
      fr: 'Les moquettes sont shampouinées et nettoyées en profondeur avec un aspirateur eau.',
    },
    variablePrice: false,
    variants: std(45),
  },
  {
    id: 'cloth-seat-deep-cleaning',
    category: 'interior',
    name: { de: 'Stoffsitz-Tiefenreinigung', en: 'Fabric seat deep cleaning', fr: 'Nettoyage en profondeur des sièges en tissu' },
    description: {
      de: 'Stoffsitze werden nass gereinigt und Flecken gezielt behandelt.',
      en: 'Fabric seats are wet cleaned and stains are treated specifically.',
      fr: 'Les sièges en tissu sont nettoyés à l’humide et les taches traitées de manière ciblée.',
    },
    variablePrice: false,
    variants: [
      { id: 'single', label: { de: 'Fahrer- oder Beifahrersitz', en: 'Driver or passenger seat', fr: 'Siège conducteur ou passager' }, price: 89 },
      { id: 'five', label: { de: '5 Sitze', en: '5 seats', fr: '5 sièges' }, price: 159 },
    ],
  },
  {
    id: 'leather-care',
    category: 'interior',
    name: { de: 'Lederpflege', en: 'Leather care', fr: 'Entretien du cuir' },
    description: {
      de: 'Ledersitze werden schonend gepflegt und aufgefrischt.',
      en: 'Leather seats are gently conditioned and refreshed.',
      fr: 'Les sièges en cuir sont entretenus en douceur et ravivés.',
    },
    variablePrice: false,
    variants: std(100),
  },
  {
    id: 'pet-hair-removal',
    category: 'interior',
    name: { de: 'Tierhaarentfernung', en: 'Pet hair removal', fr: 'Élimination des poils d’animaux' },
    description: {
      de: 'Gründliche Entfernung von Tierhaaren aus Sitzen, Teppichen und Zwischenräumen.',
      en: 'Thorough removal of pet hair from seats, carpets and gaps.',
      fr: 'Élimination minutieuse des poils d’animaux des sièges, moquettes et interstices.',
    },
    variablePrice: true,
    variants: std(80),
  },
  {
    id: 'interior-plastic-rubber-care',
    category: 'interior',
    name: { de: 'Pflege von Kunststoff- und Gummiteilen', en: 'Plastic and rubber care', fr: 'Entretien des pièces en plastique et caoutchouc' },
    description: {
      de: 'Kunststoff- und Gummiflächen werden gereinigt, aufgefrischt und gepflegt.',
      en: 'Plastic and rubber surfaces are cleaned, refreshed and conditioned.',
      fr: 'Les surfaces en plastique et caoutchouc sont nettoyées, ravivées et entretenues.',
    },
    variablePrice: false,
    variants: std(25),
  },
  {
    id: 'headliner-cleaning',
    category: 'interior',
    name: { de: 'Dachhimmelreinigung', en: 'Headliner cleaning', fr: 'Nettoyage du ciel de toit' },
    description: {
      de: 'Schonende Reinigung des Dachhimmels und seiner Oberflächen.',
      en: 'Gentle cleaning of the headliner and its surfaces.',
      fr: 'Nettoyage en douceur du ciel de toit et de ses surfaces.',
    },
    variablePrice: true,
    variants: std(89),
  },
  {
    id: 'wax-coating',
    category: 'exterior',
    name: { de: 'Wachsbeschichtung', en: 'Wax coating', fr: 'Revêtement à la cire' },
    description: {
      de: 'Lackschutz für mehr Glanz und eine wasserabweisende Oberfläche.',
      en: 'Paint protection for more shine and a water-repellent surface.',
      fr: 'Protection de la peinture pour plus de brillance et une surface déperlante.',
    },
    variablePrice: false,
    variants: std(25),
  },
  {
    id: 'exterior-plastic-rubber-care',
    category: 'exterior',
    name: { de: 'Pflege von Kunststoff- und Gummiteilen', en: 'Plastic and rubber care', fr: 'Entretien des pièces en plastique et caoutchouc' },
    description: {
      de: 'Auffrischung und Schutz der äusseren Kunststoff- und Gummiflächen.',
      en: 'Refreshing and protecting the exterior plastic and rubber surfaces.',
      fr: 'Ravivage et protection des surfaces extérieures en plastique et caoutchouc.',
    },
    variablePrice: false,
    variants: std(25),
  },
  {
    id: 'wheel-arch-cleaning',
    category: 'exterior',
    name: { de: 'Radschalenreinigung', en: 'Wheel arch cleaning', fr: 'Nettoyage des passages de roue' },
    description: {
      de: 'Gründliche Reinigung der Radschalen und schwer erreichbarer Bereiche.',
      en: 'Thorough cleaning of the wheel arches and hard-to-reach areas.',
      fr: 'Nettoyage minutieux des passages de roue et des zones difficiles d’accès.',
    },
    variablePrice: false,
    variants: std(35),
  },
  {
    id: 'flash-rust-removal',
    category: 'exterior',
    name: { de: 'Flugrostentfernung', en: 'Flash rust removal', fr: 'Élimination de la rouille volante' },
    description: {
      de: 'Materialschonende Entfernung von Flugrost auf dem Lack.',
      en: 'Material-safe removal of flash rust on the paint.',
      fr: 'Élimination de la rouille volante sur la peinture en préservant les matériaux.',
    },
    variablePrice: false,
    variants: std(50),
  },
  {
    id: 'windscreen-sealing',
    category: 'exterior',
    name: { de: 'Frontscheibenversiegelung', en: 'Windscreen sealing', fr: 'Scellement du pare-brise' },
    description: {
      de: 'Wasserabweisende Versiegelung für bessere Sicht bei Regen.',
      en: 'Water-repellent sealing for better visibility in the rain.',
      fr: 'Scellement déperlant pour une meilleure visibilité sous la pluie.',
    },
    variablePrice: false,
    variants: std(40),
  },
  {
    id: 'insect-residue-removal',
    category: 'exterior',
    name: { de: 'Entfernung hartnäckiger Insektenreste', en: 'Stubborn insect residue removal', fr: 'Élimination des résidus d’insectes tenaces' },
    description: {
      de: 'Eingebrannte Insektenrückstände werden gezielt vom Lack entfernt.',
      en: 'Baked-on insect residue is removed from the paint in a targeted way.',
      fr: 'Les résidus d’insectes incrustés sont retirés de la peinture de manière ciblée.',
    },
    variablePrice: false,
    variants: std(25),
  },
  {
    id: 'tyre-care-blackening',
    category: 'exterior',
    name: { de: 'Reifenpflege & Reifenschwärzung', en: 'Tyre care & tyre blackening', fr: 'Entretien & noircissement des pneus' },
    description: {
      de: 'Pflege für ein sauberes und gleichmässig dunkles Erscheinungsbild.',
      en: 'Care for a clean and evenly dark appearance.',
      fr: 'Entretien pour un aspect propre et uniformément foncé.',
    },
    variablePrice: false,
    variants: std(15),
  },
  {
    id: 'rim-deep-cleaning',
    category: 'exterior',
    name: { de: 'Felgen-Tiefenreinigung', en: 'Rim deep cleaning', fr: 'Nettoyage en profondeur des jantes' },
    description: {
      de: 'Intensive Reinigung der Felgen zur Entfernung hartnäckiger Verschmutzungen und Ablagerungen.',
      en: 'Intensive rim cleaning to remove stubborn dirt and deposits.',
      fr: 'Nettoyage intensif des jantes pour éliminer les salissures et dépôts tenaces.',
    },
    variablePrice: false,
    variants: std(25),
  },
];

export type ExtraSelection = { id: string; variantId: string };

export function getServiceById(id: string): CatalogService | undefined {
  return services.find((s) => s.id === id);
}

export function getExtraById(id: string): CatalogExtra | undefined {
  return extras.find((e) => e.id === id);
}

export function isVehicleCategory(value: unknown): value is VehicleCategory {
  return value === 'small' || value === 'medium' || value === 'xl';
}

export function calculatePrice(
  serviceId: string,
  carType: string,
  selections: ExtraSelection[] = [],
): { packagePrice: number; extrasPrice: number; total: number; variablePrice: boolean } {
  const service = getServiceById(serviceId);
  if (!service) throw new Error(`Unknown service: ${serviceId}`);
  if (!isVehicleCategory(carType)) throw new Error(`Invalid car type: ${carType}`);
  const seen = new Set<string>();
  let extrasPrice = 0;
  let variablePrice = false;
  for (const sel of selections) {
    if (seen.has(sel.id)) throw new Error(`Duplicate extra: ${sel.id}`);
    seen.add(sel.id);
    const extra = getExtraById(sel.id);
    if (!extra) throw new Error(`Unknown extra: ${sel.id}`);
    const variant = extra.variants.find((v) => v.id === sel.variantId);
    if (!variant) throw new Error(`Invalid variant ${sel.variantId} for extra ${sel.id}`);
    extrasPrice += variant.price;
    if (extra.variablePrice) variablePrice = true;
  }
  const packagePrice = service.prices[carType];
  return { packagePrice, extrasPrice, total: packagePrice + extrasPrice, variablePrice };
}

/** Sanitize arbitrary input (e.g. URL JSON) into valid, de-duplicated selections. */
export function sanitizeExtraSelections(input: unknown): ExtraSelection[] {
  if (!Array.isArray(input)) return [];
  const out: ExtraSelection[] = [];
  for (const raw of input) {
    if (!raw || typeof raw !== 'object') continue;
    const { id, variantId } = raw as Record<string, unknown>;
    if (typeof id !== 'string' || typeof variantId !== 'string') continue;
    const extra = getExtraById(id);
    if (!extra || !extra.variants.some((v) => v.id === variantId)) continue;
    if (out.some((s) => s.id === id)) continue;
    out.push({ id, variantId });
  }
  return out;
}
