#!/usr/bin/env node
/**
 * RCC SEO Validation Script
 *
 * Validates all prerendered HTML pages in dist/public/ against SEO requirements.
 * Checks:
 *   - Title, meta description, canonical, robots, H1 presence
 *   - Correct lang attribute
 *   - Hreflang tags present and reciprocal
 *   - JSON-LD structured data parseable (no syntax errors)
 *   - Internal links resolve to known canonical routes
 *   - Sitemap URL audit (every sitemap URL has a corresponding HTML file)
 *
 * Usage:
 *   node scripts/validate-seo.mjs
 *
 * Run after full build:
 *   pnpm --filter @workspace/rcc-website build
 *   node scripts/validate-seo.mjs
 *
 * Exit code: 0 = all checks pass, 1 = one or more errors found.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const distDir = join(root, 'dist/public');
const domain = 'https://royalcarcleaning.ch';

// ─── Known canonical route paths (must match prerender.mjs) ───────────────────

const CANONICAL_PATHS = [
  '/de/', '/de/pakete/', '/en/', '/en/packages/', '/fr/', '/fr/forfaits/',
  '/de/leistungen/', '/en/services/', '/fr/prestations/',
  '/de/leistungen/mobile-autoreinigung/', '/en/services/mobile-car-cleaning/', '/fr/prestations/nettoyage-voiture-mobile/',
  '/de/leistungen/innenreinigung/', '/en/services/interior-cleaning/', '/fr/prestations/nettoyage-interieur/',
  '/de/leistungen/aussenreinigung/', '/en/services/exterior-cleaning/', '/fr/prestations/nettoyage-exterieur/',
  '/de/leistungen/fahrzeugaufbereitung/', '/en/services/car-detailing/', '/fr/prestations/preparation-vehicule/',
  '/de/einsatzgebiet/', '/en/service-area/', '/fr/zones-desservies/',
  '/de/mobile-autoreinigung/zuerich/', '/en/mobile-car-cleaning/zurich/', '/fr/nettoyage-voiture-mobile/zurich/',
  '/de/firmenkunden/', '/en/business-customers/', '/fr/clients-professionnels/',
  '/de/kontakt/', '/en/contact/', '/fr/contact/',
  '/de/ueber-uns/', '/en/about/', '/fr/a-propos/',
  '/de/faq/', '/en/faq/', '/fr/faq/',
  '/de/ratgeber/', '/en/guides/', '/fr/guides/',
  '/de/ratgeber/auto-innenreinigung/', '/en/guides/car-interior-cleaning/', '/fr/guides/nettoyage-interieur-voiture/',
  '/de/ratgeber/autopflege-im-winter-schweiz/', '/en/guides/car-care-winter-switzerland/', '/fr/guides/entretien-voiture-hiver-suisse/',
  '/de/ratgeber/wie-oft-auto-reinigen/', '/en/guides/how-often-clean-car/', '/fr/guides/frequence-nettoyage-voiture/',
  '/de/ratgeber/autoaufbereitung-kosten-schweiz/',
  '/de/ratgeber/auto-vor-leasingrueckgabe-reinigen/',
  '/de/ratgeber/innenreinigung-leder-stoff/',
];

// Hreflang clusters — pages that are translations of each other
const HREFLANG_CLUSTERS = [
  ['/de/', '/en/', '/fr/'],
  ['/de/pakete/', '/en/packages/', '/fr/forfaits/'],
  ['/de/leistungen/', '/en/services/', '/fr/prestations/'],
  ['/de/leistungen/mobile-autoreinigung/', '/en/services/mobile-car-cleaning/', '/fr/prestations/nettoyage-voiture-mobile/'],
  ['/de/leistungen/innenreinigung/', '/en/services/interior-cleaning/', '/fr/prestations/nettoyage-interieur/'],
  ['/de/leistungen/aussenreinigung/', '/en/services/exterior-cleaning/', '/fr/prestations/nettoyage-exterieur/'],
  ['/de/leistungen/fahrzeugaufbereitung/', '/en/services/car-detailing/', '/fr/prestations/preparation-vehicule/'],
  ['/de/einsatzgebiet/', '/en/service-area/', '/fr/zones-desservies/'],
  ['/de/mobile-autoreinigung/zuerich/', '/en/mobile-car-cleaning/zurich/', '/fr/nettoyage-voiture-mobile/zurich/'],
  ['/de/firmenkunden/', '/en/business-customers/', '/fr/clients-professionnels/'],
  ['/de/kontakt/', '/en/contact/', '/fr/contact/'],
  ['/de/ueber-uns/', '/en/about/', '/fr/a-propos/'],
  ['/de/faq/', '/en/faq/', '/fr/faq/'],
  ['/de/ratgeber/', '/en/guides/', '/fr/guides/'],
  ['/de/ratgeber/auto-innenreinigung/', '/en/guides/car-interior-cleaning/', '/fr/guides/nettoyage-interieur-voiture/'],
  ['/de/ratgeber/autopflege-im-winter-schweiz/', '/en/guides/car-care-winter-switzerland/', '/fr/guides/entretien-voiture-hiver-suisse/'],
  ['/de/ratgeber/wie-oft-auto-reinigen/', '/en/guides/how-often-clean-car/', '/fr/guides/frequence-nettoyage-voiture/'],
  // DE-only
  ['/de/ratgeber/autoaufbereitung-kosten-schweiz/'],
  ['/de/ratgeber/auto-vor-leasingrueckgabe-reinigen/'],
  ['/de/ratgeber/innenreinigung-leder-stoff/'],
];

// Expected lang attributes per path prefix
const LANG_FOR_PATH = (path) => {
  if (path.startsWith('/de/')) return 'de-CH';
  if (path.startsWith('/en/')) return 'en-CH';
  if (path.startsWith('/fr/')) return 'fr-CH';
  return null;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readHtml(routePath) {
  const filePath = join(distDir, routePath.slice(1), 'index.html');
  if (!existsSync(filePath)) return null;
  return readFileSync(filePath, 'utf-8');
}

function extractMeta(html, name) {
  const m = html.match(new RegExp(`<meta\\s+name="${name}"\\s+content="([^"]*)"`, 'i'))
    || html.match(new RegExp(`<meta\\s+content="([^"]*)"\\s+name="${name}"`, 'i'));
  return m ? m[1] : null;
}

function extractTitle(html) {
  const m = html.match(/<title>([^<]*)<\/title>/i);
  return m ? m[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim() : null;
}

function extractCanonical(html) {
  const m = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i)
    || html.match(/<link\s+href="([^"]*)"\s+rel="canonical"/i);
  return m ? m[1] : null;
}

function extractH1(html) {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!m) return null;
  return m[1].replace(/<[^>]+>/g, '').trim();
}

function extractHtmlLang(html) {
  const m = html.match(/<html[^>]*\slang="([^"]*)"/i);
  return m ? m[1] : null;
}

function extractHreflangLinks(html) {
  const re = /<link\s+rel="alternate"\s+hreflang="([^"]*)"\s+href="([^"]*)"/gi;
  const links = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    links.push({ hreflang: m[1], href: m[2] });
  }
  return links;
}

function extractJsonLd(html) {
  const re = /<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  const results = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(m[1]);
      results.push({ ok: true, data: parsed });
    } catch (e) {
      results.push({ ok: false, error: e.message, raw: m[1].slice(0, 80) });
    }
  }
  return results;
}

function extractInternalLinks(html, basePath) {
  const re = /href="(\/[^"#?]*)"/gi;
  const links = new Set();
  let m;
  while ((m = re.exec(html)) !== null) {
    const href = m[1];
    // Only include absolute-path internal links (not external, not assets)
    if (href.startsWith('/') && !href.match(/\.(png|jpg|jpeg|webp|svg|ico|css|js|woff|woff2|ttf|pdf)$/i)) {
      // Normalize trailing slash
      const normalized = href.endsWith('/') ? href : href + '/';
      links.add(normalized);
    }
  }
  return [...links];
}

function extractRobots(html) {
  return extractMeta(html, 'robots');
}

function extractRenderedText(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(?:#\d+|#x[\da-f]+|[a-z][a-z\d]+);/gi, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

// ─── Main validation ──────────────────────────────────────────────────────────

let errors = 0;
let warnings = 0;
let passed = 0;

function fail(msg) {
  console.error(`  ✗ ERROR: ${msg}`);
  errors++;
}

function warn(msg) {
  console.warn(`  ⚠ WARN:  ${msg}`);
  warnings++;
}

function ok(msg) {
  console.log(`  ✓ ${msg}`);
  passed++;
}

function checkDistExists() {
  if (!existsSync(distDir)) {
    console.error(`\n[validate-seo] dist/public/ not found.`);
    console.error('Run the full build first:');
    console.error('  pnpm --filter @workspace/rcc-website build\n');
    process.exit(1);
  }
}

// ─── 1. Per-page checks ───────────────────────────────────────────────────────

function checkAllPages() {
  console.log('\n━━━ 1. Per-page SEO checks ━━━\n');

  const pageResults = {};

  for (const routePath of CANONICAL_PATHS) {
    console.log(`[${routePath}]`);
    const html = readHtml(routePath);

    if (!html) {
      fail(`HTML file missing: dist/public${routePath}index.html`);
      console.log('');
      continue;
    }

    const title = extractTitle(html);
    const description = extractMeta(html, 'description');
    const canonical = extractCanonical(html);
    const h1 = extractH1(html);
    const lang = extractHtmlLang(html);
    const robots = extractRobots(html);
    const hreflangLinks = extractHreflangLinks(html);
    const jsonLds = extractJsonLd(html);
    const expectedLang = LANG_FOR_PATH(routePath);
    const expectedCanonical = `${domain}${routePath}`;

    // Title
    if (!title) fail('Missing <title>');
    else if (title.length < 10) fail(`Title too short: "${title}"`);
    else if (title.length > 80) warn(`Title may be too long (${title.length} chars): "${title}"`);
    else ok(`title: "${title}"`);

    // Description
    if (!description) fail('Missing meta description');
    else if (description.length < 50) fail(`Meta description too short (${description.length} chars, min 50)`);
    else if (description.length > 165) fail(`Meta description too long (${description.length} chars, max 165) — trim it`);
    else ok(`description: ${description.length} chars`);

    // Canonical
    if (!canonical) fail('Missing canonical');
    else if (canonical !== expectedCanonical) fail(`Canonical mismatch. Expected "${expectedCanonical}", got "${canonical}"`);
    else ok(`canonical: ${canonical}`);

    // H1
    if (!h1) fail('Missing H1');
    else ok(`H1: "${h1.replace(/\n/g, ' ')}"`);

    // Lang
    if (!lang) fail('Missing lang attribute on <html>');
    else if (expectedLang && lang !== expectedLang) fail(`lang="${lang}" but expected "${expectedLang}"`);
    else ok(`lang="${lang}"`);

    // Robots
    if (!robots) warn('Missing robots meta (defaults to index,follow — acceptable but verify)');
    else if (robots.toLowerCase().includes('noindex')) fail(`robots contains noindex: "${robots}"`);
    else ok(`robots: "${robots}"`);

    // Hreflang
    if (hreflangLinks.length === 0) warn('No hreflang links found');
    else ok(`hreflang: ${hreflangLinks.length} links`);

    // AI-citable block check for key pages
    const AI_CITE_ROUTES = [
      '/de/', '/en/', '/fr/',
      '/de/pakete/', '/en/packages/', '/fr/forfaits/',
      '/de/leistungen/', '/en/services/', '/fr/prestations/',
    ];
    if (AI_CITE_ROUTES.includes(routePath)) {
      if (!html.includes('data-ai-cite=')) {
        fail(`AI-citable block (data-ai-cite attribute) missing on key page: ${routePath}`);
      } else {
        ok('AI-citable block present (data-ai-cite)');
      }
    }

    // JSON-LD
    if (jsonLds.length === 0) warn('No JSON-LD structured data found');
    else {
      const badJsonLd = jsonLds.filter((j) => !j.ok);
      if (badJsonLd.length > 0) {
        for (const b of badJsonLd) {
          fail(`JSON-LD parse error: ${b.error} (raw: "${b.raw}")`);
        }
      } else {
        ok(`JSON-LD: ${jsonLds.length} block(s) valid`);
      }
    }

    pageResults[routePath] = { html, hreflangLinks };
    console.log('');
  }

  return pageResults;
}

// ─── 2. Hreflang reciprocity check ───────────────────────────────────────────

function checkHreflangReciprocity(pageResults) {
  console.log('\n━━━ 2. Hreflang reciprocity ━━━\n');

  for (const cluster of HREFLANG_CLUSTERS) {
    if (cluster.length < 2) {
      // Single-language page — no hreflang needed (but self-reference may appear)
      console.log(`[SINGLE-LANG cluster: ${cluster[0]}] — skipping reciprocity (DE-only page)`);
      continue;
    }

    console.log(`[cluster: ${cluster.join(' ↔ ')}]`);

    // For each page in cluster, build map of what hreflang alts it declares
    const clusterAlts = {}; // path → Set of declared href values
    for (const path of cluster) {
      const result = pageResults[path];
      if (!result) {
        warn(`Page data missing for ${path} — skipping reciprocity`);
        continue;
      }
      clusterAlts[path] = new Set(result.hreflangLinks.map((h) => h.href));
    }

    // Each page should declare alternates pointing to all other pages in the cluster
    for (const sourcePath of cluster) {
      const sourceAlts = clusterAlts[sourcePath];
      if (!sourceAlts) continue;
      for (const targetPath of cluster) {
        const targetAbsUrl = `${domain}${targetPath}`;
        if (!sourceAlts.has(targetAbsUrl)) {
          fail(`${sourcePath} missing hreflang pointing to ${targetAbsUrl}`);
        } else {
          ok(`${sourcePath} → ${targetAbsUrl}`);
        }
      }
      // Check x-default
      const xDefault = pageResults[sourcePath]?.hreflangLinks.find((h) => h.hreflang === 'x-default');
      if (!xDefault) {
        warn(`${sourcePath} missing x-default hreflang`);
      } else {
        ok(`${sourcePath} x-default → ${xDefault.href}`);
      }
    }
    console.log('');
  }
}

// ─── 3. Internal link audit ───────────────────────────────────────────────────

function checkInternalLinks(pageResults) {
  console.log('\n━━━ 3. Internal link audit ━━━\n');

  const knownPaths = new Set(CANONICAL_PATHS);
  // Explicit allowlist for paths that are valid but not individual page files:
  // root (redirects to /de/), hash/anchor-only fragments already stripped upstream.
  const allowedExternal = new Set([
    '/',
    // sitemap and static assets are filtered before reaching this point
  ]);

  let broken = 0;

  for (const routePath of CANONICAL_PATHS) {
    const result = pageResults[routePath];
    if (!result?.html) continue;

    const links = extractInternalLinks(result.html, routePath);
    for (const link of links) {
      // Skip non-page paths (static files, API, etc.)
      if (link.startsWith('/api/')) continue;
      if (link.match(/\.(xml|txt|png|jpg|webp|svg|ico)\/$/)) continue;

      // Require exact canonical-path membership — prefix matching is NOT used
      // because it would accept invented paths like /de/does-not-exist/.
      if (!knownPaths.has(link) && !allowedExternal.has(link)) {
        fail(`${routePath} has internal link to unknown path: ${link}`);
        broken++;
      }
    }
  }

  if (broken === 0) ok('No broken internal links found');
  console.log('');
}

// ─── 4. Sitemap file check ────────────────────────────────────────────────────

function checkSitemap() {
  console.log('\n━━━ 4. Sitemap validation ━━━\n');

  const sitemapPath = join(distDir, 'sitemap.xml');
  if (!existsSync(sitemapPath)) {
    fail('sitemap.xml not found in dist/public/');
    return;
  }

  const sitemap = readFileSync(sitemapPath, 'utf-8');
  const locRe = /<loc>([^<]+)<\/loc>/gi;
  const sitemapUrls = [];
  let m;
  while ((m = locRe.exec(sitemap)) !== null) {
    sitemapUrls.push(m[1]);
  }

  ok(`Sitemap contains ${sitemapUrls.length} URLs`);

  for (const url of sitemapUrls) {
    if (!url.startsWith(domain)) {
      fail(`Sitemap URL not on canonical domain: ${url}`);
      continue;
    }
    const path = url.replace(domain, '');
    const htmlFile = join(distDir, path.slice(1), 'index.html');
    if (!existsSync(htmlFile)) {
      fail(`Sitemap URL has no HTML file: ${url}`);
    } else {
      ok(`sitemap URL has HTML: ${url}`);
    }
  }

  // Check all canonical paths are in sitemap
  for (const path of CANONICAL_PATHS) {
    const expected = `${domain}${path}`;
    if (!sitemapUrls.includes(expected)) {
      fail(`Canonical path missing from sitemap: ${expected}`);
    }
  }

  console.log('');
}

// ─── 5. llms.txt check ───────────────────────────────────────────────────────

function checkLlmsTxt() {
  console.log('\n━━━ 5. llms.txt check ━━━\n');

  const llmsPath = join(distDir, 'llms.txt');
  if (!existsSync(llmsPath)) {
    fail('llms.txt not found in dist/public/');
    console.log('  (It should be copied from public/llms.txt during the Vite build.)');
  } else {
    const content = readFileSync(llmsPath, 'utf-8');
    if (content.length < 100) {
      fail('llms.txt seems too short or empty');
    } else {
      ok(`llms.txt found (${content.length} bytes)`);
    }
    // Check it's plain text and not HTML
    if (content.includes('<!DOCTYPE') || content.includes('<html')) {
      fail('llms.txt appears to contain HTML — should be plain text');
    }
  }
  console.log('');
}

// ─── 6. robots.txt check ─────────────────────────────────────────────────────

function checkRobotsTxt() {
  console.log('\n━━━ 6. robots.txt check ━━━\n');

  const robotsPath = join(distDir, 'robots.txt');
  if (!existsSync(robotsPath)) {
    fail('robots.txt not found in dist/public/');
    return;
  }
  const content = readFileSync(robotsPath, 'utf-8');

  if (content.includes('Disallow: /\n') && !content.includes('Allow: /')) {
    fail('robots.txt has blanket Disallow: / — blocks all crawlers');
  } else {
    ok('robots.txt does not block all crawlers');
  }

  if (!content.includes('Sitemap:')) {
    warn('robots.txt does not reference Sitemap URL');
  } else {
    ok('robots.txt references Sitemap');
  }

  if (content.toLowerCase().includes('disallow: /de/') || content.toLowerCase().includes('disallow: /en/') || content.toLowerCase().includes('disallow: /fr/')) {
    fail('robots.txt blocks language root paths');
  } else {
    ok('Language paths not blocked in robots.txt');
  }
  console.log('');
}

// ─── 8. Rendered copy-rule scan ──────────────────────────────────────────────

function checkRenderedCopyRules(pageResults) {
  console.log('\n━━━ 9. Rendered copy-rule scan ━━━\n');

  let found = 0;
  for (const [routePath, result] of Object.entries(pageResults)) {
    if (!result?.html) continue;
    const text = extractRenderedText(result.html);
    for (const [label, pattern] of [
      ['em dash', /—/g],
      ['semicolon', /;/g],
    ]) {
      const matches = text.match(pattern);
      if (matches) {
        fail(`${routePath} contains ${matches.length} prohibited ${label}${matches.length === 1 ? '' : 'es'} in rendered copy`);
        found += matches.length;
      }
    }
  }

  if (found === 0) ok('Rendered HTML copy contains no em dashes or semicolons');
  console.log('');
}

// ─── Main ─────────────────────────────────────────────────────────────────────

console.log('\n╔══════════════════════════════════════════╗');
console.log('║  RCC SEO Validation – validate-seo.mjs  ║');
console.log('╚══════════════════════════════════════════╝');

checkDistExists();

const pageResults = checkAllPages();
checkHreflangReciprocity(pageResults);
checkInternalLinks(pageResults);
checkSitemap();
checkLlmsTxt();
checkRobotsTxt();
checkRenderedCopyRules(pageResults);

// ─── Summary ──────────────────────────────────────────────────────────────────

console.log('\n━━━ Summary ━━━\n');
console.log(`  Passed:   ${passed}`);
console.log(`  Warnings: ${warnings}`);
console.log(`  Errors:   ${errors}`);

if (errors > 0) {
  console.error(`\n✗ ${errors} error(s) found. Fix before deployment.\n`);
  process.exit(1);
} else if (warnings > 0) {
  console.warn(`\n⚠ ${warnings} warning(s). Review before deployment.\n`);
  process.exit(0);
} else {
  console.log(`\n✓ All checks passed.\n`);
  process.exit(0);
}
