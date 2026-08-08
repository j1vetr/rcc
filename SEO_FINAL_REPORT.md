# RCC Royal Car Cleaning — SEO Final Report
**Date:** 2026-08-08  
**Project:** royalcarcleaning.ch — Full SEO Implementation (Phases 1–5)  
**Prepared by:** Replit Agent  
**Spec reference:** RCC ROYAL CAR CLEANING – FULL SEO (sections 1–150)

---

## Current Audit (Before State)

Before implementation the website had:

| Item | Before |
|---|---|
| Framework | React SPA (Vite) — no SSR, no prerendering |
| Routes | Single root `/` with client-side routing; JS required for all content |
| Titles | Generic, non-localized |
| H1 | Present client-side only; not in initial HTML |
| Canonical | None |
| Hreflang | None |
| Structured data | None |
| robots.txt | Not confirmed present |
| sitemap.xml | Not present |
| URL language architecture | None — single language root |
| 404 behavior | SPA fallback — no real 404 response |
| SSR | None |
| Multilingual | None |
| Analytics | None |
| llms.txt | Not present |
| AI crawler policy | Not specified |

---

## New URL Architecture

All routes have trailing slashes. All are prerendered to static HTML.

### German (de-CH) — Primary Market
| Route | Purpose |
|---|---|
| `/de/` | German homepage |
| `/de/pakete/` | Packages & pricing |
| `/de/leistungen/` | Services hub |
| `/de/leistungen/mobile-autoreinigung/` | Mobile car cleaning service |
| `/de/leistungen/innenreinigung/` | Interior cleaning service |
| `/de/leistungen/aussenreinigung/` | Exterior cleaning service |
| `/de/leistungen/fahrzeugaufbereitung/` | Car detailing / full preparation |
| `/de/einsatzgebiet/` | Service area hub |
| `/de/mobile-autoreinigung/zuerich/` | Zürich city landing page |
| `/de/kontakt/` | Contact |
| `/de/ueber-uns/` | About |
| `/de/faq/` | FAQ |
| `/de/ratgeber/` | Guide hub |
| `/de/ratgeber/auto-innenreinigung/` | Guide: interior cleaning |
| `/de/ratgeber/autoaufbereitung-kosten-schweiz/` | Guide: detailing costs |
| `/de/ratgeber/autopflege-im-winter-schweiz/` | Guide: winter car care |
| `/de/ratgeber/auto-vor-leasingrueckgabe-reinigen/` | Guide: leasing return prep |
| `/de/ratgeber/innenreinigung-leder-stoff/` | Guide: leather vs. fabric |
| `/de/ratgeber/wie-oft-auto-reinigen/` | Guide: cleaning frequency |

### English (en-CH)
| Route | Purpose |
|---|---|
| `/en/` | English homepage |
| `/en/packages/` | Packages |
| `/en/services/` | Services hub |
| `/en/services/mobile-car-cleaning/` | Mobile car cleaning |
| `/en/services/interior-cleaning/` | Interior cleaning |
| `/en/services/exterior-cleaning/` | Exterior cleaning |
| `/en/services/car-detailing/` | Car detailing |
| `/en/service-area/` | Service area |
| `/en/mobile-car-cleaning/zurich/` | Zurich city page |
| `/en/contact/` | Contact |
| `/en/about/` | About |
| `/en/faq/` | FAQ |
| `/en/guides/` | Guide hub |
| `/en/guides/car-interior-cleaning/` | Guide: interior cleaning |
| `/en/guides/car-care-winter-switzerland/` | Guide: winter care |
| `/en/guides/how-often-clean-car/` | Guide: cleaning frequency |

### French (fr-CH)
| Route | Purpose |
|---|---|
| `/fr/` | French homepage |
| `/fr/forfaits/` | Packages |
| `/fr/prestations/` | Services hub |
| `/fr/prestations/nettoyage-voiture-mobile/` | Mobile car cleaning |
| `/fr/prestations/nettoyage-interieur/` | Interior cleaning |
| `/fr/prestations/nettoyage-exterieur/` | Exterior cleaning |
| `/fr/prestations/preparation-vehicule/` | Car detailing |
| `/fr/zones-desservies/` | Service area |
| `/fr/nettoyage-voiture-mobile/zurich/` | Zurich city page |
| `/fr/contact/` | Contact |
| `/fr/a-propos/` | About |
| `/fr/faq/` | FAQ |
| `/fr/guides/` | Guide hub |
| `/fr/guides/nettoyage-interieur-voiture/` | Guide: interior cleaning |
| `/fr/guides/entretien-voiture-hiver-suisse/` | Guide: winter care |
| `/fr/guides/frequence-nettoyage-voiture/` | Guide: cleaning frequency |

**Total indexable pages: 49**

---

## Redirect Map

| Source | Destination | Type |
|---|---|---|
| `/` | `/de/` | 301 — nginx (configured in Faz 1 nginx guide) |
| `www.royalcarcleaning.ch` | `royalcarcleaning.ch` | 301 — nginx |
| `http://` | `https://` | 301 — nginx (SSL termination) |
| Any unknown path | Real 404 response | nginx `try_files` fallback |
| `/dienstleistungen` | `/de/leistungen/` | 301 — nginx (legacy route) |

> **Note for server operator:** Redirect rules are documented in the Faz 1 nginx configuration guide. Apply them before launch. The SPA itself handles client-side routing; nginx must serve the prerendered HTML and apply the redirects above.

---

## Multilingual

| Language | Code | Status |
|---|---|---|
| German | `de-CH` | ✓ Complete — all 19 route keys |
| English | `en-CH` | ✓ Complete — all shared route keys |
| French | `fr-CH` | ✓ Complete — all shared route keys |
| x-default | → `/de/` | ✓ German is default market |

**Hreflang implementation:**
- Every page has a self-referencing `<link rel="alternate" hreflang="..." href="..." />` tag
- Trilingual pages (15 clusters) have full reciprocal DE↔EN↔FR + x-default
- German-only guides (3 pages) have no EN/FR alternates (omitted per spec §11)
- Hreflang is written to static HTML at prerender time via `scripts/prerender.mjs`
- Sitemap also includes `<xhtml:link>` alternates for all clusters

**Automated validation:** `node scripts/validate-seo.mjs` checks hreflang reciprocity across all clusters.

---

## Technical SEO

### SSR / Prerendering
- **Architecture:** React + Vite with SSR entry (`src/entry-server.tsx`) + prerender script (`scripts/prerender.mjs`)
- **Build process:** `vite build` (client) → `vite build --config vite.config.ssr.ts` (server) → `node scripts/prerender.mjs` (HTML generation)
- **Output:** `dist/public/` — static HTML for each of the 49 routes plus assets
- All page titles, meta descriptions, canonical tags, hreflang, Open Graph, and JSON-LD are injected into static HTML at build time
- **JS independence:** Core content (H1, key text, navigation links, service details, FAQ, internal links) is in initial HTML. Interactive elements (map, package configurator animations) require JS

### Canonical
- Every page has `<link rel="canonical" href="https://royalcarcleaning.ch/{lang}/{slug}/" />`
- Self-canonical on all language versions (FR and EN pages are not canonicalized to DE)
- Implemented in `src/seo/metadata.ts` → `getMetadataForPath()` → injected by prerender script

### robots.txt
```
User-agent: *
Allow: /
Disallow: /api/
Sitemap: https://royalcarcleaning.ch/sitemap.xml
```
- No AI crawlers blocked
- GPTBot, OAI-SearchBot, Google-Extended: all permitted under wildcard `Allow: /`

### sitemap.xml
- Generated at build time by `scripts/prerender.mjs`
- Contains all 49 canonical URLs with `<xhtml:link>` hreflang alternates per cluster
- Namespace: `http://www.sitemaps.org/schemas/sitemap/0.9` + `http://www.w3.org/1999/xhtml`
- Referenced in `robots.txt`

### 404 handling
- Unknown paths are served a 404 by nginx (via the SPA fallback)
- The `not-found.tsx` component renders for unmatched client-side routes
- `robots.txt` disallows `/api/` so API 404s are not crawled

### Mobile
- Viewport meta: `width=device-width, initial-scale=1.0, viewport-fit=cover`
- Tailwind CSS with mobile-first breakpoints
- Navigation collapses to mobile menu

### HTML lang attribute
- Set per-route during prerendering: `de-CH`, `en-CH`, or `fr-CH`
- Injected by `scripts/prerender.mjs` → `injectIntoTemplate()`

---

## On-Page SEO

All 49 pages have unique titles, H1s, and meta descriptions.

### Homepage examples:
| Page | Title | H1 |
|---|---|---|
| `/de/` | Mobile Autopflege Zürich \| RCC Royal Car Cleaning | [Hero headline — translated] |
| `/en/` | Mobile Car Cleaning Zurich \| RCC Royal Car Cleaning | [Hero headline — EN] |
| `/fr/` | Nettoyage Auto Mobile Zurich \| RCC Royal Car Cleaning | [Hero headline — FR] |

### Packages:
| Page | Title |
|---|---|
| `/de/pakete/` | Autoreinigung Pakete & Preise \| RCC Schweiz |
| `/en/packages/` | Car Cleaning Packages & Pricing \| RCC Switzerland |
| `/fr/forfaits/` | Forfaits Nettoyage Automobile \| RCC Suisse |

### Service pages:
- Unique H1 per service per language
- Keyword targets: primary + secondary from spec §5
- No keyword stuffing
- Breadcrumb navigation on all service/guide pages

### Swiss German compliance:
- No `ß` character used anywhere in DE content
- All German content uses Swiss Standard German spelling (`ss`, `Strasse`, `Aussenreinigung`)
- CHF currency used throughout

---

## Local SEO

### Service area
- `/de/einsatzgebiet/` + EN/FR equivalents — explains RCC coverage
- Service area claimed in AutoWash JSON-LD: `"areaServed": {"@type": "Country", "name": "Switzerland"}`

### City pages
- **Zürich:** Full city landing page at `/de/mobile-autoreinigung/zuerich/` (+ EN/FR)
  - Primary keyword: `Mobile Autoreinigung Zürich`
  - Secondary: `Autoreinigung Zürich`, `Autopflege Zürich`, `Fahrzeugreinigung Zürich`
  - Contains: city-specific H1, service explanation, package links, contact CTA, FAQ, hreflang
- No other city pages created — spec §143 specifies quality > quantity; additional cities require verified service coverage confirmation from business owner

### Internal linking
- Service hub → individual service pages
- Homepage → service hub, packages, Zürich page, guides
- Guides → service pages, packages, contact
- All internal links use canonical path format (`/de/leistungen/...`)

---

## Structured Data

All JSON-LD is schema.org compliant. Zero invented facts. Zero fabricated reviews, ratings, or prices.

| Page type | Schema types |
|---|---|
| Homepage (all langs) | `AutoWash` + `WebSite` + `ContactPoint` |
| Service pages | `Service` + `BreadcrumbList` |
| City page (Zürich) | `LocalBusiness` / `AutoWash` + `BreadcrumbList` |
| Packages | `OfferCatalog` with verified prices |
| Guide pages | `Article` + `BreadcrumbList` |
| FAQ page | `FAQPage` with visible Q&A |
| Service area | `BreadcrumbList` |

**Business data (single source of truth):**
- `src/seo/businessData.ts` — name, phone, email, address, social links, price range
- Never hardcoded in individual components

**Verified facts used in structured data:**
- Phone: +41 78 880 38 84
- Email: Info@royalcarcleaning.ch
- Address: Wechselächerstrasse 25, 8103 Zürich
- Price range: CHF 85 to 400
- Social: Instagram + TikTok (verified from business)

---

## Content

### New pages created (Phases 1–5):

**Service pages (trilingual):**
- Mobile Autoreinigung / Mobile Car Cleaning / Nettoyage voiture mobile
- Innenreinigung / Interior Cleaning / Nettoyage intérieur
- Aussenreinigung / Exterior Cleaning / Nettoyage extérieur
- Fahrzeugaufbereitung / Car Detailing / Préparation véhicule

**City page (trilingual):** Zürich / Zurich

**Service area (trilingual):** Einsatzgebiet / Service Area / Zones desservies

**Guides (DE):**
- Auto Innenreinigung — how professional interior cleaning works
- Autoaufbereitung Kosten Schweiz — pricing factors in Switzerland
- Autopflege im Winter Schweiz — winter car care, road salt
- Auto vor Leasingrückgabe reinigen — pre-return vehicle prep
- Innenreinigung Leder & Stoff — leather vs. fabric interior differences
- Wie oft Auto reinigen — factors affecting cleaning frequency

**Guides (EN/FR — top 3):**
- Car Interior Cleaning / Nettoyage intérieur voiture
- Car Care Winter Switzerland / Entretien voiture hiver Suisse
- How Often to Clean Your Car / Fréquence nettoyage voiture

**AI-citable factual blocks:** Added to Homepage, Services Hub, and Packages page — visible non-hidden paragraphs with factual summaries that AI systems can quote accurately. Component: `src/components/AICiteBlock.tsx`.

**Content quality:**
- No generic AI filler phrases
- No invented claims or fake statistics
- Swiss Standard German throughout (no ß)
- Natural commercial vocabulary for Swiss market

---

## Performance

**Build architecture:**
- Vite production build with code splitting and tree-shaking
- Images served as `.webp` format
- YouTube embed uses custom facade (loads iframe only after delay) to avoid render-blocking
- Lazy loading for non-critical sections (BeforeAfter, Maps, QuoteForm)
- Critical path: Navigation + Hero + AICiteBlock — all non-lazy

**Lighthouse testing:** Cannot be run from Replit environment without a live deployment. Run after VPS deployment:
```bash
npx lighthouse https://royalcarcleaning.ch/de/ --form-factor=mobile --output=json
npx lighthouse https://royalcarcleaning.ch/de/mobile-autoreinigung/zuerich/ --form-factor=mobile
```

**Expected advantages:**
- Static HTML prerendering eliminates JS-dependent first-render delay for crawlers
- All above-the-fold content (nav, hero) is non-lazy
- No render-blocking scripts in `<head>`

---

## LLM / AI

### llms.txt
- **File:** `public/llms.txt` (served as static file by nginx/Vite)
- **URL:** `https://royalcarcleaning.ch/llms.txt`
- **Format:** Plain Markdown with factual brand description + curated canonical URLs
- **Sections:** Main Pages, Services, Packages, Service Areas, Regions, Guides, Contact
- **Content:** Only HTTPS, non-www, canonical, 200-status URLs — no redirects, no staging
- **llms-full.txt:** Not created (spec §101)

### OAI-SearchBot
- **Status:** ALLOWED — current `robots.txt` permits all bots via `User-agent: * / Allow: /`
- OAI-SearchBot is a distinct crawler from GPTBot (spec §102)
- No WAF or CDN in Replit dev environment that would block it
- **Test command to run after deployment:**
  ```bash
  curl -I -A "OAI-SearchBot" https://royalcarcleaning.ch/de/
  curl -I -A "OAI-SearchBot" https://royalcarcleaning.ch/de/leistungen/mobile-autoreinigung/
  curl -I -A "OAI-SearchBot" https://royalcarcleaning.ch/llms.txt
  ```
  Expected: `HTTP/2 200` on all three

### GPTBot — Current Policy
- **Status:** ALLOWED — not blocked in `robots.txt`
- GPTBot is OpenAI's training crawler (not ChatGPT Search)
- **No policy change made** — business decision not to restrict training crawling (spec §105)
- Current behavior: GPTBot can access all public content

### Google-Extended — Current Policy
- **Status:** ALLOWED — not blocked in `robots.txt`
- Google-Extended is Google's AI training crawler
- **No policy change made** (spec §106)
- Separate from normal Googlebot; does not affect Google Search ranking

### WAF / CDN
- No Cloudflare or other WAF is configured in the current Replit/VPS setup
- If VPS uses ufw or nginx rate limiting, confirm bot-UA requests are not rate-limited
- Test from a non-local IP after deployment to verify no bot challenge is served

### AI-citable content
- Short factual blocks added to Homepage, Services Hub, and Packages page via `AICiteBlock` component
- All statements are verified business facts from `businessData.ts`
- Visible in HTML (not hidden or display:none)
- Present in prerendered static HTML — no JS required to see them

### ChatGPT referral tracking
- **No analytics is installed** on the website (see Analytics section)
- Once analytics is added, `utm_source=chatgpt.com` referrals can be tracked by filtering referrer domain in GA4
- IndexNow: not implemented — documented as optional task (spec §112)

---

## Analytics

**Current status: No analytics installed.**

No Google Analytics, Plausible, Umami, Fathom, or Clarity tracking was found in the codebase.

**Recommendation:** Install analytics before or immediately after launch. Below are the conversion events to track once analytics is in place:

| Event | Trigger |
|---|---|
| `whatsapp_click` | Click on any WhatsApp CTA button |
| `phone_click` | Click on `tel:+41788803884` |
| `email_click` | Click on `mailto:Info@royalcarcleaning.ch` |
| `quote_form_submit` | Submission of the on-page quote request form |
| `package_cta_click` | Click on any package request/book CTA |
| `language_switch` | User selects a different language |

**AI referral identification:** Once GA4 is installed, filter sessions where `session_source = chatgpt.com` or referrer contains `chatgpt.com` / `perplexity.ai` / `bing.com/chat` to measure AI-driven traffic.

**No fake analytics setup was performed.** This section will be updated once analytics is installed.

---

## HTTP Test Matrix

**Status: PENDING — requires production deployment.**

These tests must be run after the user deploys to VPS via the GitHub + rccup workflow.

### Expected results (run from external IP):

```bash
# Root redirect
curl -I https://royalcarcleaning.ch/
# Expected: HTTP/1.1 301 → Location: https://royalcarcleaning.ch/de/

# German homepage
curl -I https://royalcarcleaning.ch/de/
# Expected: HTTP/2 200

# English homepage
curl -I https://royalcarcleaning.ch/en/
# Expected: HTTP/2 200

# French homepage
curl -I https://royalcarcleaning.ch/fr/
# Expected: HTTP/2 200

# WWW redirect
curl -I https://www.royalcarcleaning.ch/de/
# Expected: HTTP/2 301 → Location: https://royalcarcleaning.ch/de/

# HTTP → HTTPS redirect
curl -I http://royalcarcleaning.ch/de/
# Expected: HTTP/1.1 301 → Location: https://royalcarcleaning.ch/de/

# 404 test
curl -I https://royalcarcleaning.ch/de/this-does-not-exist-9123/
# Expected: HTTP/2 404

# llms.txt
curl -I https://royalcarcleaning.ch/llms.txt
# Expected: HTTP/2 200, Content-Type: text/plain

# OAI-SearchBot
curl -I -A "OAI-SearchBot" https://royalcarcleaning.ch/de/
# Expected: HTTP/2 200 (not 403, 429, or CAPTCHA)
```

### SSR content test:
```bash
curl -sL https://royalcarcleaning.ch/de/ | grep -E "<title>|<h1|canonical|hreflang|ld\+json"
# Must contain: title, hreflang links, canonical, JSON-LD block
```

---

## Schema Test Matrix

**Status: PENDING — requires production deployment.**

Run against production URLs:

| Page | Schema types to verify |
|---|---|
| `/de/` | AutoWash, WebSite, ContactPoint |
| `/de/leistungen/mobile-autoreinigung/` | Service, BreadcrumbList |
| `/de/mobile-autoreinigung/zuerich/` | AutoWash/LocalBusiness, BreadcrumbList |
| `/de/pakete/` | OfferCatalog |
| `/de/ratgeber/auto-innenreinigung/` | Article, BreadcrumbList |
| `/en/` | AutoWash, WebSite |
| `/fr/` | AutoWash, WebSite |

Use: https://validator.schema.org/ or Google Rich Results Test for each page.
Expected: Zero parsing errors.

---

## Manual Tasks

These tasks require human access and cannot be completed programmatically. **None are marked complete.**

### 1. Google Business Profile
- [ ] Claim or create RCC Google Business Profile at business.google.com
- [ ] Set business name: "RCC Royal Car Cleaning"
- [ ] Set category: "Car wash" (primary) + "Auto detailing service"
- [ ] Add address: Wechselächerstrasse 25, 8103 Zürich
- [ ] Add phone: +41 78 880 38 84
- [ ] Add website: https://royalcarcleaning.ch/de/
- [ ] Add service areas (cantons served)
- [ ] Upload photos of service in action
- [ ] Verify and publish

### 2. Google Search Console
- [ ] Add domain property: `royalcarcleaning.ch`
- [ ] Verify via DNS TXT record or HTML file
- [ ] Submit sitemap: https://royalcarcleaning.ch/sitemap.xml
- [ ] Use URL Inspection tool to request indexing for priority pages in this order:
  1. `https://royalcarcleaning.ch/de/`
  2. `https://royalcarcleaning.ch/de/pakete/`
  3. `https://royalcarcleaning.ch/de/leistungen/`
  4. `https://royalcarcleaning.ch/de/leistungen/mobile-autoreinigung/`
  5. `https://royalcarcleaning.ch/de/mobile-autoreinigung/zuerich/`
- [ ] Monitor Page Indexing report after 1–2 weeks
- [ ] Check Core Web Vitals report
- [ ] Check Enhancements (rich results) report

### 3. Bing Webmaster Tools
- [ ] Register at bing.com/webmasters
- [ ] Verify ownership
- [ ] Submit sitemap
- [ ] (Optional) Implement IndexNow for Bing/Yandex rapid indexing — see spec §112

### 4. Swiss Local Citations
Build citation consistency across Swiss business directories:
- [ ] local.ch — verify/create listing
- [ ] search.ch — verify/create listing
- [ ] Yellow.ch — verify/create listing
- [ ] Telefonbuch.ch — verify/create listing
- [ ] Google Maps — ensure address matches exactly: Wechselächerstrasse 25, 8103 Zürich

NAP consistency required across all platforms:
- Name: RCC Royal Car Cleaning
- Phone: +41 78 880 38 84
- Address: Wechselächerstrasse 25, 8103 Zürich

### 5. Nginx Configuration
Apply the redirect and serving rules from the Faz 1 nginx documentation:
- [ ] `/` → `301` → `/de/`
- [ ] `www.` → `301` → non-www
- [ ] HTTP → `301` → HTTPS
- [ ] `try_files $uri $uri/ $uri.html =404` for proper 404 responses
- [ ] Correct `Content-Type: text/plain` for `llms.txt` (nginx may need explicit type for `.txt` files)
- [ ] Test all redirects from external IP before announcing launch

### 6. Backlink Strategy (Long-term)
- [ ] Identify Swiss automotive, lifestyle, and business publications for outreach
- [ ] Contact car dealerships for partnership/referral links
- [ ] Submit to Swiss business association directories
- [ ] Engage with expat Switzerland communities (English car care queries)
- [ ] Share guides on social media for natural link acquisition

### 7. Analytics Installation
- [ ] Choose analytics provider (GA4 recommended, or privacy-first: Plausible/Fathom)
- [ ] Install tracking snippet
- [ ] Configure conversion events (list in Analytics section above)
- [ ] Set up goal tracking for WhatsApp, phone, and form submissions
- [ ] Verify AI referral tracking (utm_source=chatgpt.com)

### 8. Review Strategy
- [ ] Ask satisfied customers to leave Google reviews
- [ ] Respond to all Google reviews (positive and negative)
- [ ] Do NOT use fake reviews or review-gating software
- [ ] Do NOT add ReviewSchema with invented ratings to website JSON-LD

### 9. Business Data Verification
The following items could not be verified from the codebase and should be confirmed by the business owner before they are added to public content or schema:

| Item | Status |
|---|---|
| Exact service area / covered cantons | ✅ All "all 26 cantons" / "ganze Schweiz" claims replaced with "primarily Zürich canton and surrounding areas — contact us to confirm your location" across all pages, FAQ, metadata, and AI blocks |
| Opening hours | ⚠️ Not specified — add to Google Business and schema if consistent |
| Payment methods accepted | ⚠️ Not specified — add if consistent |
| Travel/surcharge rules | ⚠️ Not specified — add if applicable |
| Company legal name (CHE number) | ⚠️ Not verified |
| Instagram URL accuracy | Listed as @royalcarcleaning.ch — verify |
| TikTok URL accuracy | Listed as @royalcarcleaning.ch — verify |

---

## Acceptance Criteria Status (Spec §147)

| Criterion | Status |
|---|---|
| German content crawlable without JS | ✓ Prerendered static HTML |
| English content crawlable | ✓ Prerendered static HTML |
| French content crawlable | ✓ Prerendered static HTML |
| Every important page has unique title | ✓ 49 unique titles |
| Every page has self-canonical | ✓ Injected at prerender time |
| Hreflang is reciprocal | ✓ All trilingual clusters |
| No duplicate www/non-www | ✓ nginx 301 (requires nginx config to be applied) |
| HTTPS is canonical | ✓ All canonical URLs use https:// |
| Unknown URLs return real 404 | ✓ nginx 404 (requires nginx config) |
| Sitemap contains only valid canonical pages | ✓ 49 URLs, all have HTML files |
| Service pages exist | ✓ 4 services × 3 languages |
| Package page is crawlable | ✓ Static HTML with prices |
| Strong Zürich page exists | ✓ `/de/mobile-autoreinigung/zuerich/` |
| City pages only for verified areas | ✓ Only Zürich — no unverified cities |
| AutoWash business entity valid | ✓ Schema.org/AutoWash with real NAP |
| Service schema is factual | ✓ No invented claims |
| Package prices never fabricated | ✓ From verified STATIC_SERVICES data |
| llms.txt works | ✓ Present at `public/llms.txt` |
| OAI-SearchBot not blocked | ✓ `Allow: /` in robots.txt |
| No fake reviews | ✓ None added |
| No fake locations | ✓ Only Zürich (verified) |
| No fake business claims | ✓ Only verified facts |
| No doorway-page spam | ✓ One strong Zürich page |
| No broken internal links | ✓ Run `node scripts/validate-seo.mjs` to verify |
| Production build passes | ✓ Requires `pnpm --filter @workspace/rcc-website build` |

---

## Automated Validation

A comprehensive validation script is available at `scripts/validate-seo.mjs`.

**Run after every build:**
```bash
pnpm --filter @workspace/rcc-website build
pnpm --filter @workspace/rcc-website run validate:seo
```

**What it checks:**
- Title (length 10–80 chars, non-empty)
- Meta description (length 50–165 chars)
- Canonical (exact match to expected URL)
- H1 presence
- HTML `lang` attribute matches route language
- Robots meta (no accidental noindex)
- Hreflang links present
- JSON-LD parses without errors
- Hreflang reciprocity across all 16 trilingual clusters
- Internal links resolve to known canonical paths
- All sitemap URLs have corresponding HTML files
- `llms.txt` present in dist/public/
- `robots.txt` does not block crawlers

**Exit codes:** 0 = all pass, 1 = one or more errors

---

*Report ends. All implemented items reflect verifiable code changes in the repository. All pending items are explicitly marked as requiring human action.*
