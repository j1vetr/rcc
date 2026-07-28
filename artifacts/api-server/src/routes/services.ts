import { Router, type IRouter } from "express";

const router: IRouter = Router();

const services = [
  {
    id: "basic",
    nameDE: "Basic Wash",
    nameFR: "Lavage Basic",
    nameEN: "Basic Wash",
    descriptionDE: "Grundreinigung von Aussen und Innen fuer alltaegliche Pflege.",
    descriptionFR: "Nettoyage de base exterieur et interieur pour un entretien quotidien.",
    descriptionEN: "Basic exterior and interior cleaning for everyday maintenance.",
    priceFrom: 89,
    duration: "60-90 min",
    features: [
      "Handwaesche Aussen",
      "Felgen reinigen",
      "Fenster innen und aussen",
      "Staubsaugen Innenraum",
      "Armaturenbrett abwischen",
    ],
    popular: false,
  },
  {
    id: "premium",
    nameDE: "Premium Detail",
    nameFR: "Detail Premium",
    nameEN: "Premium Detail",
    descriptionDE: "Professionelle Aufbereitung mit Lack- und Innenraumschutz fuer anspruchsvolle Fahrzeugbesitzer.",
    descriptionFR: "Preparation professionnelle avec protection laque et habitacle pour les proprietaires exigeants.",
    descriptionEN: "Professional detailing with paint and interior protection for demanding car owners.",
    priceFrom: 249,
    duration: "3-4 Std",
    features: [
      "Alles aus Basic Wash",
      "Lackpolitur Hand",
      "Wachsversiegelung",
      "Lederreinigung und Pflege",
      "Motorraumreinigung",
      "Reifenglanz",
    ],
    popular: true,
  },
  {
    id: "elite",
    nameDE: "Elite Protect",
    nameFR: "Protection Elite",
    nameEN: "Elite Protect",
    descriptionDE: "Komplettaufbereitung mit Keramikversiegelung fuer maximalen Schutz und Langzeitglanz.",
    descriptionFR: "Preparation complete avec revetement ceramique pour une protection maximale et un brillant durable.",
    descriptionEN: "Full detailing with ceramic coating for maximum protection and long-lasting shine.",
    priceFrom: 499,
    duration: "6-8 Std",
    features: [
      "Alles aus Premium Detail",
      "Keramikversiegelung",
      "Scheinwerfer aufbereitung",
      "Felgenversiegelung",
      "Geruchsneutralisierung",
      "12 Monate Garantie",
    ],
    popular: false,
  },
];

router.get("/services", async (_req, res): Promise<void> => {
  res.json(services);
});

export default router;
