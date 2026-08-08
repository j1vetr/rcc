# Nginx Configuration — SEO & Redirects

**VPS Server:** royalcarcleaning.ch  
**Deployment:** GitHub push → rccup → PM2  
**Static files served from:** `/path/to/dist/public/`

Apply these blocks to the nginx vhost for `royalcarcleaning.ch`.  
**Do not implement www→non-www or root→/de/ redirects in application code** — these must be nginx 301s so crawlers and browsers receive the correct HTTP status codes.

---

## 1. www → non-www redirect (REQUIRED — currently missing)

```nginx
server {
    listen 80;
    listen 443 ssl;
    server_name www.royalcarcleaning.ch;

    ssl_certificate     /etc/letsencrypt/live/royalcarcleaning.ch/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/royalcarcleaning.ch/privkey.pem;

    return 301 https://royalcarcleaning.ch$request_uri;
}
```

---

## 2. HTTP → HTTPS redirect (verify already present)

```nginx
server {
    listen 80;
    server_name royalcarcleaning.ch;
    return 301 https://royalcarcleaning.ch$request_uri;
}
```

---

## 3. Primary server block (replace existing static-serving config)

This block enforces:
- Root `/` → `/de/` permanent redirect
- Legacy URLs → new canonical URLs
- Only the 6 known prerendered routes return HTTP 200
- **All other URLs return a true HTTP 404** — not the SPA shell

```nginx
server {
    listen 443 ssl http2;
    server_name royalcarcleaning.ch;

    ssl_certificate     /etc/letsencrypt/live/royalcarcleaning.ch/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/royalcarcleaning.ch/privkey.pem;

    root /path/to/dist/public;

    # ── 1. Permanent redirects ──────────────────────────────────────
    location = / {
        return 301 https://royalcarcleaning.ch/de/;
    }

    location = /dienstleistungen {
        return 301 https://royalcarcleaning.ch/de/pakete/;
    }

    location = /dienstleistungen/ {
        return 301 https://royalcarcleaning.ch/de/pakete/;
    }

    # ── 2. Known prerendered routes — serve their static index.html ─
    # Only these 6 paths return HTTP 200. Any other URL returns 404.

    location = /de/ {
        try_files /de/index.html =404;
        add_header Cache-Control "public, max-age=900, must-revalidate";
    }

    location = /de/pakete/ {
        try_files /de/pakete/index.html =404;
        add_header Cache-Control "public, max-age=900, must-revalidate";
    }

    location = /en/ {
        try_files /en/index.html =404;
        add_header Cache-Control "public, max-age=900, must-revalidate";
    }

    location = /en/packages/ {
        try_files /en/packages/index.html =404;
        add_header Cache-Control "public, max-age=900, must-revalidate";
    }

    location = /fr/ {
        try_files /fr/index.html =404;
        add_header Cache-Control "public, max-age=900, must-revalidate";
    }

    location = /fr/forfaits/ {
        try_files /fr/forfaits/index.html =404;
        add_header Cache-Control "public, max-age=900, must-revalidate";
    }

    # ── 3. Hashed static assets (JS/CSS/images from Vite build) ────
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # ── 4. Root-level static files ──────────────────────────────────
    location = /sitemap.xml  { try_files $uri =404; }
    location = /robots.txt   { try_files $uri =404; }
    location = /favicon.png  { try_files $uri =404; }
    location = /og-image.webp { try_files $uri =404; }

    # ── 5. True 404 for all other URLs ─────────────────────────────
    # The 404 page is not a generic nginx page — serve the prerendered
    # noindex 404 HTML (if available) or fall back to nginx default.
    # The HTTP status code is always 404.
    location / {
        return 404;
    }
}
```

---

## 4. Cache headers summary

| Resource | Cache-Control |
|---|---|
| Prerendered HTML (routes) | `public, max-age=900, must-revalidate` (15 min) |
| Vite-hashed assets `/assets/*` | `public, immutable` (1 year) |
| `/sitemap.xml`, `/robots.txt` | Default (short) |

---

## 5. Verification checklist

Run these after applying changes:

```bash
# www → non-www (301)
curl -I https://www.royalcarcleaning.ch/
# Expected: 301 Location: https://royalcarcleaning.ch/

# Root → /de/ (301)
curl -I https://royalcarcleaning.ch/
# Expected: 301 Location: https://royalcarcleaning.ch/de/

# German homepage — HTTP 200, full HTML with H1 and meta
curl -s https://royalcarcleaning.ch/de/ | grep -E '<title>|<h1|lang='
# Expected: route-specific title, German H1

# English homepage — HTTP 200, English content
curl -s https://royalcarcleaning.ch/en/ | grep -E '<title>|<h1'
# Expected: English title, English H1 (NOT the German fallback)

# French homepage — HTTP 200, French content
curl -s https://royalcarcleaning.ch/fr/ | grep -E '<title>|<h1'

# German packages page
curl -I https://royalcarcleaning.ch/de/pakete/
# Expected: 200

# English packages page
curl -I https://royalcarcleaning.ch/en/packages/
# Expected: 200

# French packages page
curl -I https://royalcarcleaning.ch/fr/forfaits/
# Expected: 200

# Legacy redirect
curl -I https://royalcarcleaning.ch/dienstleistungen
# Expected: 301 → https://royalcarcleaning.ch/de/pakete/

# Unknown URL — must be true 404, NOT 200
curl -I https://royalcarcleaning.ch/does-not-exist
# Expected: 404

# Unknown language-prefixed URL — also must be true 404
curl -I https://royalcarcleaning.ch/de/unknown-page/
# Expected: 404

# Sitemap and robots
curl -s https://royalcarcleaning.ch/sitemap.xml | head -5
# Expected: <?xml version="1.0"...> with <urlset>

curl https://royalcarcleaning.ch/robots.txt
# Expected: User-agent: * ... Sitemap: https://royalcarcleaning.ch/sitemap.xml

# Verify canonical and hreflang in prerendered pages
curl -s https://royalcarcleaning.ch/de/ | grep -E 'canonical|hreflang'
# Expected: 5 lines (canonical + 4 hreflang including x-default)
```
