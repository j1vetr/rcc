# RCC Mobile Autopflege

Mobile car detailing website for Switzerland — premium luxury brand, dark gold theme. Three languages: Swiss German (DE, primary), French (FR), English (EN).

## Run & Operate

- `pnpm --filter @workspace/rcc-website run dev` — frontend (port auto-assigned)
- `pnpm --filter @workspace/api-server run dev` — API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Framer Motion, Tailwind CSS v4, wouter
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (zod/v4), drizzle-zod
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/rcc-website/` — frontend (React + Vite)
- `artifacts/api-server/` — backend API (Express 5)
- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth)
- `lib/db/src/schema/quotes.ts` — quotes DB table
- `artifacts/api-server/src/routes/quotes.ts` — POST /api/quotes
- `artifacts/api-server/src/routes/services.ts` — GET /api/services (static data)
- `attached_assets/` — brand logos (dark and white variants)
- `artifacts/rcc-website/src/i18n/` — translation strings (DE/FR/EN)

## Architecture decisions

- Services are served as hardcoded static data (no DB table needed for initial build)
- Quote submissions are persisted to PostgreSQL via Drizzle
- Language switching is handled client-side via React context (LanguageContext)
- The Switzerland canton selector is an interactive SVG map that pre-fills the quote form
- Dark/gold theme is enforced globally; light mode is not supported

## Product

A multi-section marketing + lead generation site for RCC Mobile Autopflege:
1. Hero with large RCC logo and CTA
2. How it works (3-step process)
3. Interactive Switzerland canton map for location selection
4. Compact services introduction that links to the detailed care-programs page
5. Quote request form (submits to backend, pre-filled from map/services)
6. Testimonials
7. Value proposition grid
8. Footer with language switcher

## User preferences

- No em dashes (—) anywhere in copy
- No semicolons (;) anywhere in copy
- No emojis in the UI
- Dark design, always — light mode not needed
- Swiss German is the primary/default language
- Use Goks for display typography when a licensed webfont file is supplied. Until then use the geometric Syne and Space Grotesk fallback stack

## Gotchas

- `type: integer` in OpenAPI spec generates `zod.int()` which breaks in Zod v3. Use `type: number` instead.
- Logo files are in `attached_assets/` and accessible via `@assets/` alias in Vite config.
- Services data is static in `routes/services.ts` — not from DB.
