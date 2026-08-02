---
name: RCC VPS deployment environment
description: RCC site is deployed on the user's own Ubuntu VPS (not Replit Deployments) via PM2 + Nginx; how updates ship and toolchain constraints.
---

The RCC production site (royalcarcleaning.ch) runs on the user's own Ubuntu VPS, deployed from GitHub repo `j1vetr/rcc`, NOT via Replit publishing.

- Architecture: Nginx serves built static frontend (`artifacts/rcc-website/dist/public`) and proxies `/api/` to the Express API on `127.0.0.1:3883`. API runs under PM2 as app `rcc-api` on the **root** PM2 list, alongside ~26 other unrelated customer apps — never run `pm2 update`, `pm2 kill`, or blind `pm2 save` there.
- Updates: user runs `rccup` (`/usr/local/bin/rccup`) on the server; it does git pull, install, builds, Drizzle push, PM2 restart, Nginx reload. We only need to push to GitHub `main`.
- Toolchain constraint: VPS has Node 20, so pnpm must stay on v10 (`corepack prepare pnpm@10 --activate`); pnpm 11 crashes with `node:sqlite` error. Port must stay 3883 (1024 and below needs privileges).
- Env lives in `/etc/rcc-api.env` (DATABASE_URL points to local PostgreSQL).

**Why:** the VPS hosts many production apps on one root PM2 daemon; one careless PM2 command once wiped the process list (recovered via dump.pm2 resurrect).
**How to apply:** when the user asks to ship RCC changes, commit+push to GitHub and tell them to run `rccup`; never suggest Node upgrades or PM2-level maintenance without dump backups.
