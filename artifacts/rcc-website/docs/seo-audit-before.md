# SEO Technical Audit — Before State

**Audited:** 2026-08-08  
**Domain:** https://royalcarcleaning.ch  
**Prepared for:** SEO Phase 1 implementation baseline

---

## 1. Framework & Architecture

| Property | Value |
|---|---|
| Framework | React 18 + Vite (SPA — no SSR/prerender) |
| Router | Wouter v3 |
| Rendering | 100% client-side JavaScript |
| Language system | Client-side context (no URL language prefix) |
| Build output | `dist/public/index.html` (single SPA shell) |

---

## 2. Route Inventory (Before)

| Route | Component | HTTP Status |
|---|---|---|
| `/` | HomePage | 200 (SPA shell only) |
| `/dienstleistungen` | ServicesPage | 200 (SPA shell only) |
| `/does-not-exist` (any unknown) | NotFound (client-rendered) | **200** (incorrect — should be 404) |

---

## 3. JavaScript Dependence

**Critical issue:** All meaningful content requires JavaScript execution.

```bash
curl https://royalcarcleaning.ch/
# Returns:
# <html lang="de-CH">
# <head>...</head>
# <body>
#   <div id="root"></div>  ← EMPTY, no content without JS
#   <script ...></script>
# </body>
```

Search engines and AI crawlers that do not execute JavaScript see no content.

---

## 4. Metadata (Before)

### Current Implementation
- All meta tags are static and hardcoded in `index.html`
- No canonical tag
- No hreflang tags
- Title and description are manipulated via `document.title` / `querySelector` in a `useEffect` — **invisible to crawlers**

### Title
```
Mobile Autopflege Zürich | RCC Royal Car Cleaning
```
*Same title for all routes and all languages.*

### Description
```
Premium mobile Autopflege und Fahrzeugaufbereitung in Zürich. RCC reinigt...
```
*Same description for all routes and all languages.*

### Canonical
❌ **Missing** — no `<link rel="canonical">` anywhere

### Hreflang
❌ **Missing** — no hreflang alternates

### `<html lang>`
Set statically to `de-CH` in index.html. Changed via `document.documentElement.lang` in JS (not visible to crawlers).

---

## 5. URL Architecture (Before)

| Aspect | Status |
|---|---|
| Language in URL | ❌ No — language is JS-state only |
| German route | `/` (no language prefix) |
| Services route | `/dienstleistungen` (German-only, not localized) |
| English/French routes | ❌ None |
| Trailing slash policy | Inconsistent |

---

## 6. HTTP Redirects (Before)

| Redirect | Status |
|---|---|
| `http://` → `https://` | ✅ Configured |
| `www.` → non-www | ❌ **Missing** — www serves content independently |
| `/` → `/de/` | ❌ Missing |
| `/dienstleistungen` → canonical | ❌ No redirect infrastructure |

*Source: live pre-audit `curl -I` checks on 2026-08-08*

---

## 7. 404 Handling (Before)

| URL | HTTP Status |
|---|---|
| `/does-not-exist` | **200** (nginx serves SPA index; client renders NotFound component) |
| `/api/nonexistent` | 404 (API responds correctly) |

**Issue:** Nginx serves HTTP 200 for every unknown URL because `try_files` falls back to `index.html`. Search engines cannot distinguish valid pages from 404s.

---

## 8. Sitemap

❌ **Missing** — `/sitemap.xml` returns HTTP 200 with the SPA shell (nginx fallback), not a proper XML sitemap.

---

## 9. robots.txt (Before)

```
User-agent: *
Allow: /
Disallow: /api/
```

*Missing:* Sitemap reference (`Sitemap:` directive).  
*Allowed:* All CSS/JS/images — correct.

---

## 10. Contact Information / NAP (Before)

Contact data was hardcoded in **three separate locations**, not from a single source:

| Location | Data |
|---|---|
| `Footer.tsx` | `const CONTACT = { email, phone, phoneHref, address, mapsHref }` |
| `Navigation.tsx` | `const WHATSAPP_URL = 'https://wa.me/41788803884'` |
| `Hero.tsx` | `const WHATSAPP_URL = 'https://wa.me/41788803884'` |
| `index.html` | JSON-LD schema with phone, email, address hardcoded |
| `QuoteForm.tsx` | Phone, email, address links hardcoded in JSX |

**Risk:** Data inconsistency if any single location is updated without updating all others.

### Verified NAP Data
- **Phone:** +41 78 880 38 84 (`+41788803884`)
- **Email:** Info@royalcarcleaning.ch
- **Address:** Wechselächerstrasse 25, 8103 Zürich
- **Instagram:** https://www.instagram.com/royalcarcleaning.ch/
- **TikTok:** https://www.tiktok.com/@royalcarcleaning.ch
- **WhatsApp:** https://wa.me/41788803884

---

## 11. Structured Data / JSON-LD (Before)

One `AutoWash` schema block in `index.html`:
- ✅ Present
- ❌ Static (same for all routes and all languages)
- ❌ Missing `sameAs` social profiles
- ❌ `addressRegion` missing
- ❌ `url` property missing

---

## 12. Social (OG / Twitter) (Before)

- OG tags present in index.html
- Twitter card present
- ❌ Static — same for all routes and languages
- ❌ `og:locale:alternate` missing for multilingual
- ❌ OG image URL is relative (`/og-image.webp`) — should be absolute

---

## 13. Images

- OG image: `/og-image.webp` (relative URL — should be absolute in meta)
- Logo: WebP format ✅
- Car/category images: WebP format ✅
- No alt text issues identified in main navigation logo

---

## 14. Language Switcher (Before)

The language switcher used `onClick` JavaScript button handlers to set language state. These are **not real HTML links**, so:
- Search engines cannot follow them to discover alternate-language pages
- Screen readers and keyboards are less usable

---

## 15. Performance Indicators (Before)

- All components lazy-loaded except Navigation and Hero
- No prerendering → full JS required for any LCP content
- YouTube iframes used for hero background video

---

## Summary of Critical Issues (Addressed in Phase 1)

| Issue | Priority | Status After Phase 1 |
|---|---|---|
| No SSR/prerendering — crawlers see empty HTML | P0 | ✅ Fixed (SSG prerender) |
| No language in URL | P0 | ✅ Fixed (/de/ /en/ /fr/) |
| Missing canonical | P0 | ✅ Fixed |
| Missing hreflang | P0 | ✅ Fixed |
| Unknown URLs return HTTP 200 | P0 | ✅ Fixed (nginx config provided) |
| No sitemap.xml | P0 | ✅ Fixed (auto-generated) |
| www→non-www missing | P1 | ✅ nginx config provided |
| Root `/` no redirect | P1 | ✅ nginx config provided |
| Contact data fragmented across components | P1 | ✅ Fixed (central businessData.ts) |
| Language switcher uses JS buttons (no links) | P1 | ✅ Fixed (real `<a>` tags) |
| robots.txt missing Sitemap directive | P2 | ✅ Fixed |
| JSON-LD static / same for all routes | P2 | ✅ Fixed (per-route schema) |
