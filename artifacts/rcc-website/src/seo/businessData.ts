/**
 * Central business data — single source of truth for NAP (Name, Address, Phone),
 * contact links, social profiles, and schema data.
 *
 * All components, schema blocks, and metadata must read from here.
 * Never hardcode phone, email, address, or social links in individual components.
 */

export const BUSINESS = {
  name: 'RCC Royal Car Cleaning',
  alternateName: 'RCC Mobile Autopflege',
  description: {
    de: 'Premium mobile Autopflege und Fahrzeugaufbereitung in der Schweiz. RCC reinigt, pflegt und schützt Ihr Fahrzeug professionell direkt bei Ihnen vor Ort.',
    fr: 'Nettoyage et detailing automobile premium en Suisse. RCC entretient et protège votre véhicule professionnellement, directement chez vous.',
    en: 'Premium mobile car cleaning and detailing in Switzerland. RCC professionally cleans, details and protects your vehicle at your location.',
  },
  phone: {
    display: '+41 78 880 38 84',
    e164: '+41788803884',
    href: 'tel:+41788803884',
  },
  email: {
    display: 'Info@royalcarcleaning.ch',
    href: 'mailto:Info@royalcarcleaning.ch',
  },
  address: {
    streetAddress: 'Wechselächerstrasse 25',
    postalCode: '8103',
    addressLocality: 'Zürich',
    addressRegion: 'ZH',
    addressCountry: 'CH',
    formatted: 'Wechselächerstrasse 25, 8103 Zürich',
    mapsHref:
      'https://www.google.com/maps/search/?api=1&query=Wechsel%C3%A4cherstrasse%2025%2C%208103%20Z%C3%BCrich',
  },
  social: {
    instagram: 'https://www.instagram.com/royalcarcleaning.ch/',
    tiktok: 'https://www.tiktok.com/@royalcarcleaning.ch',
  },
  whatsapp: {
    url: 'https://wa.me/41788803884',
    messages: {
      de: 'Hallo RCC Mobile Autopflege, ich möchte eine unverbindliche Offerte anfragen.',
      fr: 'Bonjour RCC Mobile Autopflege, je souhaite demander un devis sans engagement.',
      en: 'Hello RCC Mobile Autopflege, I would like to request a no-obligation quote.',
    },
  },
  domain: 'https://royalcarcleaning.ch',
  priceRange: 'CHF 85 to 400',
  currenciesAccepted: 'CHF',
  areaServed: 'Switzerland',
  geo: {
    region: 'CH-ZH',
    placename: 'Zürich',
  },
  images: {
    logo: '/og-image.webp',
    ogImage: '/og-image.webp',
  },
} as const;

export type BusinessData = typeof BUSINESS;
