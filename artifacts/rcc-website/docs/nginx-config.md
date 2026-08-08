# Nginx Configuration — RCC Royal Car Cleaning

**VPS:** royalcarcleaning.ch  
**Static files served from:** `/var/www/rcc/artifacts/rcc-website/dist/public`  
**Deploy:** `git pull && rccup` — no nginx changes needed for new pages.

---

## How routing works

The prerender build script generates a real `index.html` for every route:

```
dist/public/
  de/index.html
  de/pakete/index.html
  de/leistungen/index.html
  de/ratgeber/auto-innenreinigung/index.html
  ...
  en/index.html
  fr/index.html
```

Nginx checks the filesystem with `try_files $uri $uri/index.html =404;`:

| Request | Filesystem check | Result |
|---|---|---|
| `/de/` | `dist/public/de/index.html` exists | HTTP 200 |
| `/de/mobile-autoreinigung/winterthur/` | `dist/public/de/mobile-autoreinigung/winterthur/index.html` exists after build | HTTP 200 |
| `/de/unknown-page/` | no such file | HTTP 404 |
| `/assets/main.abc123.js` | `dist/public/assets/main.abc123.js` exists | HTTP 200 |

**Adding a new city, guide, or language page requires only `git pull && rccup`. No nginx changes.**

---

## Complete configuration

Replace the current vhost file with this content:

```nginx
# ── 1. HTTP → HTTPS (Certbot — keep as-is) ───────────────────────────────────
server {
    listen 80;
    listen [::]:80;
    server_name royalcarcleaning.ch www.royalcarcleaning.ch;

    if ($host = www.royalcarcleaning.ch) {
        return 301 https://royalcarcleaning.ch$request_uri;
    }

    if ($host = royalcarcleaning.ch) {
        return 301 https://royalcarcleaning.ch$request_uri;
    }

    return 404;
}

# ── 2. www → non-www HTTPS (NEW — was missing) ───────────────────────────────
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name www.royalcarcleaning.ch;

    ssl_certificate     /etc/letsencrypt/live/royalcarcleaning.ch/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/royalcarcleaning.ch/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    return 301 https://royalcarcleaning.ch$request_uri;
}

# ── 3. Main HTTPS ─────────────────────────────────────────────────────────────
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name royalcarcleaning.ch;

    ssl_certificate     /etc/letsencrypt/live/royalcarcleaning.ch/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/royalcarcleaning.ch/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    root /var/www/rcc/artifacts/rcc-website/dist/public;

    access_log /var/log/nginx/royalcarcleaning.ch.access.log;
    error_log  /var/log/nginx/royalcarcleaning.ch.error.log;

    client_max_body_size 10M;

    # ── API proxy ─────────────────────────────────────────────────────────────
    location /api/ {
        proxy_pass http://127.0.0.1:3883;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 30s;
        proxy_send_timeout    30s;
        proxy_read_timeout    30s;
    }

    # ── Permanent redirects ───────────────────────────────────────────────────
    location = / {
        return 301 https://royalcarcleaning.ch/de/;
    }

    location = /dienstleistungen {
        return 301 https://royalcarcleaning.ch/de/pakete/;
    }

    location = /dienstleistungen/ {
        return 301 https://royalcarcleaning.ch/de/pakete/;
    }

    # ── Vite-hashed assets (JS, CSS, fonts, images) ───────────────────────────
    # Long cache — filenames change on every build, so immutable is safe.
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # ── Generic prerendered-page routing ─────────────────────────────────────
    # This single block handles ALL current and future prerendered routes.
    # Nginx checks whether dist/public/<path>/index.html exists on disk:
    #   exists  → HTTP 200 (prerendered page)
    #   missing → HTTP 404 (real 404, no SPA fallback)
    # Adding a new city/guide/language page needs only build + deploy.
    location / {
        add_header Cache-Control "public, max-age=900, must-revalidate";
        try_files $uri $uri/index.html =404;
    }
}
```

---

## Apply

```bash
# 1. Backup
sudo cp /etc/nginx/sites-available/royalcarcleaning.ch \
        /etc/nginx/sites-available/royalcarcleaning.ch.bak

# 2. Paste the config above into the file
sudo nano /etc/nginx/sites-available/royalcarcleaning.ch

# 3. Test
sudo nginx -t

# 4. Reload (zero downtime)
sudo systemctl reload nginx
```

---

## Verify

```bash
# www → non-www (301)
curl -I https://www.royalcarcleaning.ch/

# Root → /de/ (301)
curl -I https://royalcarcleaning.ch/

# German homepage (200 + real HTML, not empty SPA shell)
curl -s https://royalcarcleaning.ch/de/ | grep '<title>'

# English homepage (200)
curl -I https://royalcarcleaning.ch/en/

# French homepage (200)
curl -I https://royalcarcleaning.ch/fr/

# Legacy redirect (301)
curl -I https://royalcarcleaning.ch/dienstleistungen

# Unknown URL — must be true 404, NOT 200
curl -I https://royalcarcleaning.ch/does-not-exist

# API proxy (should reach the API server)
curl -I https://royalcarcleaning.ch/api/services

# Sitemap and robots
curl -s https://royalcarcleaning.ch/sitemap.xml | head -3
curl https://royalcarcleaning.ch/robots.txt

# Canonical and hreflang present in prerendered HTML
curl -s https://royalcarcleaning.ch/de/ | grep -E 'canonical|hreflang'
```

---

## Adding new pages in the future

1. Create the page component in `src/pages/`
2. Add the route to `App.tsx`
3. Add the URL to `scripts/prerender.mjs`
4. `git push` → `rccup` on the VPS

**No nginx changes. No `location` blocks to add. The filesystem is the route registry.**
