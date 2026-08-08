# RCC Phase 2 — Manual Verification Checklist

Items that cannot be verified from the codebase and require manual confirmation by the business owner.

---

## 1. Service Area — Exact Coverage

**Status: UNVERIFIED — needs confirmation**

The website currently claims coverage in "alle 26 Kantone der Schweiz" (all 26 Swiss cantons) based on existing website copy and the interactive canton map.

**To confirm:**
- Does RCC actually serve all 26 cantons, or only specific cantons/regions?
- Are there distance or travel cost limits for certain cantons?
- Should specific cantons be marked as "on request" rather than standard service?

**Action:** Update the `EinsatzgebietPage.tsx` and `entry-server.tsx` SSR content to reflect actual coverage if it differs.

---

## 2. Business Address Role

**Status: UNVERIFIED — needs confirmation**

The schema uses the address `Wechselächerstrasse 25, 8103 Zürich` as the business address (PostalAddress in AutoWash schema).

**To confirm:**
- Is this address a registered business address, or a private/residential address?
- Should it be described as a "mobile service base" or "dispatch address" rather than a customer-facing location?
- Is this address published publicly (e.g. Google Business Profile, Canton business register)?

**Action:** If this is not a public business address, remove or adjust the PostalAddress schema node in `metadata.ts` and the `BUSINESS` data in `businessData.ts`.

---

## 3. Business Hours / Opening Times

**Status: NOT ADDED — data not available in codebase**

No opening hours are currently in the schema or on the website.

**To confirm:**
- What are the actual operating hours of RCC?
- Are appointments booked by request only (no fixed hours)?
- Should `openingHoursSpecification` be added to the AutoWash schema node?

**Action:** If hours are known and publicly stated, add `openingHoursSpecification` to `buildBusinessNode()` in `metadata.ts`. Do not invent hours.

---

## 4. Service Area Zurich — Specific Districts

**Status: UNVERIFIED — needs confirmation**

The Zurich page mentions nearby regions: Kanton Zürich, Zug, Aargau, Thurgau, Schaffhausen, St. Gallen.

**To confirm:**
- Are all these neighbouring cantons actually served from the Zurich base?
- Should any be removed or marked as "on request"?

**Action:** Update the "Auch in angrenzenden Gebieten" section in `ZuerichPage.tsx` if the list is incorrect.

---

## 5. Social Media Profiles

**Status: VERIFIED** (from existing code)

- Instagram: `https://www.instagram.com/royalcarcleaning.ch/`
- TikTok: `https://www.tiktok.com/@royalcarcleaning.ch`

**To confirm:**
- Are there additional verified social profiles (Facebook, LinkedIn, YouTube) that should be added to `sameAs` in the schema?

**Action:** Add verified social profiles to `BUSINESS.social` in `businessData.ts` and to the `sameAs` array in `buildBusinessNode()` in `metadata.ts`.

---

## 6. Phone Number

**Status: VERIFIED** (from existing code)

- Display: `+41 78 880 38 84`
- E.164: `+41788803884`

No confirmation needed unless the number has changed.

---

## 7. Email Address

**Status: VERIFIED** (from existing code)

- `Info@royalcarcleaning.ch`

No confirmation needed.

---

## 8. Ecological / Environmental Claims

**Status: CONDITIONALLY PRESENT**

The `why.points` translation includes "Umweltschonend" (eco-friendly) with the description "Modernste, wassersparende Techniken und umweltfreundliche Produkte."

**To confirm:**
- Is this claim accurate and provable?
- If specific products or techniques are used, can they be named?
- If this claim cannot be substantiated, it should be removed or softened.

**Action:** Review and confirm or remove the eco-claim in `translations.ts`.

---

## 9. Package Pricing — Currency and Tax

**Status: VERIFIED** (prices from API, display in CHF)

Prices are: 85–400 CHF depending on package and vehicle size. These match the API data exactly.

**To confirm:**
- Are these prices inclusive or exclusive of Swiss VAT (MWST/TVA)?
- Should "inkl. MwSt." or "exkl. MwSt." be added next to prices?

**Action:** Add VAT clarification to package page copy if applicable.

---

## 10. Google Business Profile

**Status: UNKNOWN**

**To confirm:**
- Does RCC have a verified Google Business Profile?
- If yes, the profile URL should be added to `BUSINESS.social` and to `sameAs` in schema.
- The name, address, and phone in the GBP must match the website exactly (NAP consistency).

---

## 11. Page Uniqueness — Zurich vs. National Homepage

The Zurich page (`/de/mobile-autoreinigung/zuerich/`) deliberately targets Zurich-specific queries and does not duplicate the national homepage (`/de/`).

**Review:** Confirm the Zurich page does not accidentally target the same keyword cluster as the national homepage. Both pages use different H1 and title targeting:
- `/de/` → national intent: "Mobile Autoreinigung Schweiz | RCC Royal Car Cleaning"
- `/de/mobile-autoreinigung/zuerich/` → city intent: "Mobile Autoreinigung Zürich | RCC Royal Car Cleaning"

No action needed unless there is a specific keyword overlap concern.

---

*This checklist was generated during Phase 2 SEO implementation. Items should be reviewed before site launch or publication of the new pages.*
