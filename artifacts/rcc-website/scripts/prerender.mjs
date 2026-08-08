/**
 * Static site generation (SSG) prerender script.
 *
 * Run AFTER both vite builds:
 *   1. vite build                             → dist/public/  (client assets)
 *   2. vite build --config vite.config.ssr.ts → dist/server/  (SSR bundle)
 *   3. node scripts/prerender.mjs             → per-route HTML + sitemap.xml
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const domain = 'https://royalcarcleaning.ch';

const ROUTES = [
  // ── Trilingual homepage + packages ──
  { url: '/de/',          lang: 'de-CH', routeKey: 'home' },
  { url: '/de/pakete/',   lang: 'de-CH', routeKey: 'packages' },
  { url: '/en/',          lang: 'en-CH', routeKey: 'home' },
  { url: '/en/packages/', lang: 'en-CH', routeKey: 'packages' },
  { url: '/fr/',          lang: 'fr-CH', routeKey: 'home' },
  { url: '/fr/forfaits/', lang: 'fr-CH', routeKey: 'packages' },

  // ── Services hub (trilingual) ──
  { url: '/de/leistungen/',    lang: 'de-CH', routeKey: 'leistungen' },
  { url: '/en/services/',      lang: 'en-CH', routeKey: 'leistungen' },
  { url: '/fr/prestations/',   lang: 'fr-CH', routeKey: 'leistungen' },

  // ── Mobile car cleaning (trilingual) ──
  { url: '/de/leistungen/mobile-autoreinigung/',          lang: 'de-CH', routeKey: 'leistungen/mobile-autoreinigung' },
  { url: '/en/services/mobile-car-cleaning/',             lang: 'en-CH', routeKey: 'leistungen/mobile-autoreinigung' },
  { url: '/fr/prestations/nettoyage-voiture-mobile/',     lang: 'fr-CH', routeKey: 'leistungen/mobile-autoreinigung' },

  // ── Interior cleaning (trilingual) ──
  { url: '/de/leistungen/innenreinigung/',                lang: 'de-CH', routeKey: 'leistungen/innenreinigung' },
  { url: '/en/services/interior-cleaning/',               lang: 'en-CH', routeKey: 'leistungen/innenreinigung' },
  { url: '/fr/prestations/nettoyage-interieur/',          lang: 'fr-CH', routeKey: 'leistungen/innenreinigung' },

  // ── Exterior cleaning (trilingual) ──
  { url: '/de/leistungen/aussenreinigung/',               lang: 'de-CH', routeKey: 'leistungen/aussenreinigung' },
  { url: '/en/services/exterior-cleaning/',               lang: 'en-CH', routeKey: 'leistungen/aussenreinigung' },
  { url: '/fr/prestations/nettoyage-exterieur/',          lang: 'fr-CH', routeKey: 'leistungen/aussenreinigung' },

  // ── Car detailing (trilingual) ──
  { url: '/de/leistungen/fahrzeugaufbereitung/',          lang: 'de-CH', routeKey: 'leistungen/fahrzeugaufbereitung' },
  { url: '/en/services/car-detailing/',                   lang: 'en-CH', routeKey: 'leistungen/fahrzeugaufbereitung' },
  { url: '/fr/prestations/preparation-vehicule/',         lang: 'fr-CH', routeKey: 'leistungen/fahrzeugaufbereitung' },

  // ── Service area (trilingual) ──
  { url: '/de/einsatzgebiet/',                            lang: 'de-CH', routeKey: 'einsatzgebiet' },
  { url: '/en/service-area/',                             lang: 'en-CH', routeKey: 'einsatzgebiet' },
  { url: '/fr/zones-desservies/',                         lang: 'fr-CH', routeKey: 'einsatzgebiet' },

  // ── Zurich city page (trilingual) ──
  { url: '/de/mobile-autoreinigung/zuerich/',             lang: 'de-CH', routeKey: 'mobile-autoreinigung/zuerich' },
  { url: '/en/mobile-car-cleaning/zurich/',               lang: 'en-CH', routeKey: 'mobile-autoreinigung/zuerich' },
  { url: '/fr/nettoyage-voiture-mobile/zurich/',          lang: 'fr-CH', routeKey: 'mobile-autoreinigung/zuerich' },

  // ── Contact (trilingual) ──
  { url: '/de/kontakt/',  lang: 'de-CH', routeKey: 'kontakt' },
  { url: '/en/contact/',  lang: 'en-CH', routeKey: 'kontakt' },
  { url: '/fr/contact/',  lang: 'fr-CH', routeKey: 'kontakt' },

  // ── About (trilingual) ──
  { url: '/de/ueber-uns/', lang: 'de-CH', routeKey: 'ueber-uns' },
  { url: '/en/about/',     lang: 'en-CH', routeKey: 'ueber-uns' },
  { url: '/fr/a-propos/',  lang: 'fr-CH', routeKey: 'ueber-uns' },

  // ── FAQ (trilingual) ──
  { url: '/de/faq/',  lang: 'de-CH', routeKey: 'faq' },
  { url: '/en/faq/',  lang: 'en-CH', routeKey: 'faq' },
  { url: '/fr/faq/',  lang: 'fr-CH', routeKey: 'faq' },

  // ── Ratgeber / Guides hub (trilingual) ──
  { url: '/de/ratgeber/', lang: 'de-CH', routeKey: 'ratgeber' },
  { url: '/en/guides/',   lang: 'en-CH', routeKey: 'ratgeber' },
  { url: '/fr/guides/',   lang: 'fr-CH', routeKey: 'ratgeber' },

  // ── Guide: interior cleaning (trilingual) ──
  { url: '/de/ratgeber/auto-innenreinigung/',         lang: 'de-CH', routeKey: 'ratgeber/auto-innenreinigung' },
  { url: '/en/guides/car-interior-cleaning/',         lang: 'en-CH', routeKey: 'ratgeber/auto-innenreinigung' },
  { url: '/fr/guides/nettoyage-interieur-voiture/',   lang: 'fr-CH', routeKey: 'ratgeber/auto-innenreinigung' },

  // ── Guide: winter care (trilingual) ──
  { url: '/de/ratgeber/autopflege-im-winter-schweiz/',    lang: 'de-CH', routeKey: 'ratgeber/autopflege-im-winter-schweiz' },
  { url: '/en/guides/car-care-winter-switzerland/',       lang: 'en-CH', routeKey: 'ratgeber/autopflege-im-winter-schweiz' },
  { url: '/fr/guides/entretien-voiture-hiver-suisse/',    lang: 'fr-CH', routeKey: 'ratgeber/autopflege-im-winter-schweiz' },

  // ── Guide: how often (trilingual) ──
  { url: '/de/ratgeber/wie-oft-auto-reinigen/',       lang: 'de-CH', routeKey: 'ratgeber/wie-oft-auto-reinigen' },
  { url: '/en/guides/how-often-clean-car/',           lang: 'en-CH', routeKey: 'ratgeber/wie-oft-auto-reinigen' },
  { url: '/fr/guides/frequence-nettoyage-voiture/',   lang: 'fr-CH', routeKey: 'ratgeber/wie-oft-auto-reinigen' },

  // ── Guide: costs (DE only) ──
  { url: '/de/ratgeber/autoaufbereitung-kosten-schweiz/',    lang: 'de-CH', routeKey: 'ratgeber/autoaufbereitung-kosten-schweiz' },

  // ── Guide: leasing return (DE only) ──
  { url: '/de/ratgeber/auto-vor-leasingrueckgabe-reinigen/', lang: 'de-CH', routeKey: 'ratgeber/auto-vor-leasingrueckgabe-reinigen' },

  // ── Guide: leather and fabric (DE only) ──
  { url: '/de/ratgeber/innenreinigung-leder-stoff/',         lang: 'de-CH', routeKey: 'ratgeber/innenreinigung-leder-stoff' },
];

// Route clusters: pages that are translations of each other.
// All entries here get full hreflang alternates in the sitemap.
const ROUTE_CLUSTERS = [
  // Trilingual pages
  ['/de/', '/en/', '/fr/'],
  ['/de/pakete/', '/en/packages/', '/fr/forfaits/'],
  ['/de/leistungen/', '/en/services/', '/fr/prestations/'],
  ['/de/leistungen/mobile-autoreinigung/', '/en/services/mobile-car-cleaning/', '/fr/prestations/nettoyage-voiture-mobile/'],
  ['/de/leistungen/innenreinigung/', '/en/services/interior-cleaning/', '/fr/prestations/nettoyage-interieur/'],
  ['/de/leistungen/aussenreinigung/', '/en/services/exterior-cleaning/', '/fr/prestations/nettoyage-exterieur/'],
  ['/de/leistungen/fahrzeugaufbereitung/', '/en/services/car-detailing/', '/fr/prestations/preparation-vehicule/'],
  ['/de/einsatzgebiet/', '/en/service-area/', '/fr/zones-desservies/'],
  ['/de/mobile-autoreinigung/zuerich/', '/en/mobile-car-cleaning/zurich/', '/fr/nettoyage-voiture-mobile/zurich/'],
  ['/de/kontakt/', '/en/contact/', '/fr/contact/'],
  ['/de/ueber-uns/', '/en/about/', '/fr/a-propos/'],
  ['/de/faq/', '/en/faq/', '/fr/faq/'],

  // Ratgeber / Guides hub (trilingual)
  ['/de/ratgeber/', '/en/guides/', '/fr/guides/'],

  // Guide: interior cleaning (trilingual)
  ['/de/ratgeber/auto-innenreinigung/', '/en/guides/car-interior-cleaning/', '/fr/guides/nettoyage-interieur-voiture/'],

  // Guide: winter care (trilingual)
  ['/de/ratgeber/autopflege-im-winter-schweiz/', '/en/guides/car-care-winter-switzerland/', '/fr/guides/entretien-voiture-hiver-suisse/'],

  // Guide: how often (trilingual)
  ['/de/ratgeber/wie-oft-auto-reinigen/', '/en/guides/how-often-clean-car/', '/fr/guides/frequence-nettoyage-voiture/'],

  // DE-only guides — single-URL clusters (no alternates)
  ['/de/ratgeber/autoaufbereitung-kosten-schweiz/'],
  ['/de/ratgeber/auto-vor-leasingrueckgabe-reinigen/'],
  ['/de/ratgeber/innenreinigung-leder-stoff/'],
];

async function main() {
  console.log('[prerender] Starting static site generation…');

  const ssrBundlePath = join(root, 'dist/server/entry-server.js');
  const { render } = await import(ssrBundlePath);

  const templatePath = join(root, 'dist/public/index.html');
  const rawTemplate = readFileSync(templatePath, 'utf-8');

  for (const route of ROUTES) {
    const { html, metadata } = await render(route.url);
    // Copy-rule safeguard for the final HTML served to crawlers and visitors.
    // Source copy should follow the same rule, while this keeps static output
    // compliant if an overlooked em dash reaches SSR.
    const finalHtml = injectIntoTemplate(rawTemplate, html, metadata).replaceAll('—', ',');

    const outDir = join(root, 'dist/public', route.url.slice(1));
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'index.html'), finalHtml, 'utf-8');
    console.log(`  ✓ ${route.url}`);
  }

  const sitemap = generateSitemap();
  writeFileSync(join(root, 'dist/public/sitemap.xml'), sitemap, 'utf-8');
  console.log('  ✓ /sitemap.xml');

  console.log('[prerender] Done.');
}

// ─── Head injection ───────────────────────────────────────────────────────────

function buildHeadBlock(meta) {
  const hreflangLinks = meta.hreflang
    .map((h) => `  <link rel="alternate" hreflang="${h.hreflang}" href="${h.href}" />`)
    .join('\n');

  const jsonLdScript =
    meta.jsonLd && Object.keys(meta.jsonLd).length > 0
      ? `  <script type="application/ld+json" data-seo="page">\n    ${JSON.stringify(meta.jsonLd)}\n  </script>`
      : '';

  return [
    `  <title>${esc(meta.title)}</title>`,
    `  <meta name="description" content="${esc(meta.description)}" />`,
    `  <meta name="robots" content="${meta.robots}" />`,
    `  <link rel="canonical" href="${meta.canonical}" />`,
    hreflangLinks,
    `  <meta property="og:locale" content="${meta.ogLocale}" />`,
    `  <meta property="og:site_name" content="RCC Royal Car Cleaning" />`,
    `  <meta property="og:title" content="${esc(meta.ogTitle)}" />`,
    `  <meta property="og:description" content="${esc(meta.ogDescription)}" />`,
    `  <meta property="og:image" content="${meta.ogImage}" />`,
    `  <meta property="og:image:width" content="1200" />`,
    `  <meta property="og:image:height" content="630" />`,
    `  <meta property="og:type" content="website" />`,
    `  <meta name="twitter:card" content="summary_large_image" />`,
    `  <meta name="twitter:title" content="${esc(meta.twitterTitle)}" />`,
    `  <meta name="twitter:description" content="${esc(meta.twitterDescription)}" />`,
    `  <meta name="twitter:image" content="${meta.ogImage}" />`,
    jsonLdScript,
  ]
    .filter(Boolean)
    .join('\n');
}

function injectIntoTemplate(template, appHtml, metadata) {
  const headBlock = buildHeadBlock(metadata);

  const headReplaced = template.replace(
    /<!--app-head-start-->[\s\S]*?<!--app-head-end-->/,
    headBlock,
  );

  const langReplaced = headReplaced.replace(
    /(<html[^>]*lang=")[^"]*(")/i,
    `$1${metadata.locale}$2`,
  );

  return langReplaced.replace(
    '<div id="root"></div>',
    `<div id="root">${appHtml}</div>`,
  );
}

// ─── Sitemap ──────────────────────────────────────────────────────────────────

function generateSitemap() {
  const urlEntries = ROUTES.map((route) => {
    const cluster = ROUTE_CLUSTERS.find((c) => c.includes(route.url));
    const alternates = cluster
      ? [
          ...cluster.map((path) => {
            const r = ROUTES.find((x) => x.url === path);
            if (!r) return '';
            return `    <xhtml:link rel="alternate" hreflang="${r.lang}" href="${domain}${r.url}" />`;
          }),
          `    <xhtml:link rel="alternate" hreflang="x-default" href="${domain}${cluster[0]}" />`,
        ].join('\n')
      : '';

    return ['  <url>', `    <loc>${domain}${route.url}</loc>`, alternates, '  </url>']
      .filter(Boolean)
      .join('\n');
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urlEntries,
    '</urlset>',
  ].join('\n');
}

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

main().catch((err) => {
  console.error('[prerender] Fatal error:', err);
  process.exit(1);
});
