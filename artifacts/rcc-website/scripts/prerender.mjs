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
  { url: '/de/',          lang: 'de-CH', routeKey: 'home' },
  { url: '/de/pakete/',   lang: 'de-CH', routeKey: 'packages' },
  { url: '/en/',          lang: 'en-CH', routeKey: 'home' },
  { url: '/en/packages/', lang: 'en-CH', routeKey: 'packages' },
  { url: '/fr/',          lang: 'fr-CH', routeKey: 'home' },
  { url: '/fr/forfaits/', lang: 'fr-CH', routeKey: 'packages' },
];

// Route clusters: pages that are translations of each other
const ROUTE_CLUSTERS = [
  ['/de/', '/en/', '/fr/'],
  ['/de/pakete/', '/en/packages/', '/fr/forfaits/'],
];

async function main() {
  console.log('[prerender] Starting static site generation…');

  // Load the SSR bundle
  const ssrBundlePath = join(root, 'dist/server/entry-server.js');
  const { render } = await import(ssrBundlePath);

  // Load the built client HTML template
  const templatePath = join(root, 'dist/public/index.html');
  const rawTemplate = readFileSync(templatePath, 'utf-8');

  // Render each route
  for (const route of ROUTES) {
    const { html, metadata } = await render(route.url);
    const finalHtml = injectIntoTemplate(rawTemplate, html, metadata);

    const outDir = join(root, 'dist/public', route.url.slice(1));
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'index.html'), finalHtml, 'utf-8');
    console.log(`  ✓ ${route.url}`);
  }

  // Generate sitemap.xml with hreflang alternates
  const sitemap = generateSitemap();
  writeFileSync(join(root, 'dist/public/sitemap.xml'), sitemap, 'utf-8');
  console.log('  ✓ /sitemap.xml');

  console.log('[prerender] Done.');
}

// ─── Head injection ───────────────────────────────────────────────────────────

/**
 * Build the per-route <head> content block that replaces the entire
 * <!--app-head-start-->...<!--app-head-end--> sentinel in index.html.
 * The result contains exactly one authoritative set of SEO tags — no fallbacks.
 */
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

  // 1. Replace the entire <!--app-head-start-->...<!--app-head-end--> sentinel
  //    with route-specific head content (removes any fallback/default meta).
  const headReplaced = template.replace(
    /<!--app-head-start-->[\s\S]*?<!--app-head-end-->/,
    headBlock,
  );

  // 2. Set the correct html[lang] attribute
  const langReplaced = headReplaced.replace(
    /(<html[^>]*lang=")[^"]*(")/i,
    `$1${metadata.locale}$2`,
  );

  // 3. Inject SSR-rendered body HTML
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
    '',
  ].join('\n');
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ─── Run ──────────────────────────────────────────────────────────────────────

main().catch((err) => {
  console.error('[prerender] Fatal error:', err);
  process.exit(1);
});
