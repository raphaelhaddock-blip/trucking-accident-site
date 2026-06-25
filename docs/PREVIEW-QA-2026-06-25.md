# Preview QA — 2026-06-25

Live QA of the Vercel preview for PR #1, via a logged-in Vercel browser session (preview is behind Vercel SSO, so unauthenticated curl sees only the login wall).

- **Preview:** `https://trucking-accident-site-2pp2w9nk6-raphy.vercel.app`
- **Project:** `trucking-accident-site` (confirmed via PR bot payload — NOT `-814t`)
- **Branch/commit:** `redesign/next-gen-legal-platform` @ `4c17d35`
- **Production:** NOT merged, NOT deployed.

## Workstream results

| WS | Area | Result |
|---|---|---|
| 5 | Fresh build | ✅ exit 0 (1613 city pages SSG) |
| 5 | `audit:legaltone` after build | ✅ PASS — no banned phrasing |
| 5 | Secrets | ✅ none tracked; `.env.local` gitignored + untracked |
| 4 | SEO/technical | ✅ see table below |
| 3 | Visual (desktop, 7 pages) | ✅ 0 broken images, 0 horizontal overflow, footer + breadcrumbs present, heroes render + legible |
| 2 | Mobile pixel | ⛔ BLOCKED (reason below); responsive layer DOM-verified |
| 1 | Contact placeholders | ⏸ Phone deferred by Raphy 2026-06-25 — placeholder kept for this review round; HARD pre-production gate (scope below) |

## WS4 — SEO/technical (per page, from rendered preview HTML)
All 7 sampled pages: `robots: index, follow`; canonical absolute → `trucking-accident-site.vercel.app`; **0 `cdn.sanity.io` refs** (no Sanity hero/OG fallback); title 40–52 chars; meta description 122–155 chars.

- Schema present and correct per type: Home `WebSite + LegalService + WebPage`; State `LegalService + Article + FAQPage + BreadcrumbList`; City same; Accident `FAQPage + LegalService + BreadcrumbList`; Contact `ContactPage + FAQPage + BreadcrumbList`.
- OG image: state/city/accident use `/brand/photo/*`; home + contact use the designed `og-default.png` (not Sanity).
- `sitemap.xml` → 200, 1699 `<loc>` URLs. `robots.txt` → 200, allows all, disallows `/api/`, `/studio/`, `/_next/`.

## WS3 — Visual (desktop) — viewed pages
Home, Texas state, NYC city, Chicago city, Phoenix city, Jackknife accident, Contact. All clean: serif command-heroes with darkened image + legible white overlay text, instrument-panel stats, trust bar, collision-type cards, footer with hazard strip. No overlap, no missing images, no spacing breakage. Tier A (Phoenix desert) and Tier B (NYC bridge, Chicago rail) city heroes render correctly; the multi-word slug fix is confirmed live (NYC).

## WS2 — Mobile pixel QA — BLOCKED (honest)
**Reason:** the Chrome MCP browser window will not shrink below ~1512px viewport (two resize attempts confirmed `innerWidth` stayed 1512), and the headless Playwright MCP cannot be used because the preview is behind Vercel SSO (no logged-in session). So a true 390px render could not be captured here.

**Substitute — responsive layer DOM-verified at the CSS-rule level:**
- Sticky mobile CTA present: `fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 … md:hidden` → "Call Now / Free Case Review" (mobile-only).
- Mobile menu (hamburger) button exists; desktop nav gated `md:`; 28 responsive-utility elements; responsive grids collapse (`grid-cols-1 … md:grid-cols-N`).
- No horizontal overflow at desktop; no fixed-width overflow culprits.

**Recommended:** a 60-second human eyeball on a real phone or Chrome DevTools device mode before production. Risk is low — the responsive layer is wired and no overflow exists.

## WS1 — Contact placeholders — BLOCKED on real number
**Only placeholder contact value is the phone** (no fake emails or addresses; schema `addressLocality` uses real city names; stat sources are real NHTSA FARS URLs).

Placeholder phone `1-800-555-0123` / display `(800) 555-0123` appears as:
- a per-file `const PHONE_NUMBER = '1-800-555-0123'` in **14 files** (no single source of truth), and
- **26 inline display-string lines** across 17 files (Header, Footer, MobileStickyCTA, home, contact, states, state, city, accidents, accident, blog, about, terms, privacy, disclaimer, not-found).

**Fix-ready plan (executes once Raphy gives the real number):** two literal replacements — `1-800-555-0123` (tel/raw) and `(800) 555-0123` (display) — across the 17 files; optionally centralize into one `src/lib/site.ts` export. Then build → audit:legaltone → push PR branch only → re-verify preview. **No number will be invented.**

## Production approval steps (unchanged — human-gated)
1. Resolve the phone number (WS1) and land the fix on the PR branch.
2. Human visual review on the preview, incl. a mobile pass (WS2).
3. Confirm the Vercel target is `trucking-accident-site` (it is — git-connected, production = `main`).
4. Merge PR #1 → `main` (this triggers the **production** deploy). Separate explicit go.

## Stop conditions hit this pass
- **Need real phone number** (WS1) — surfaced; Raphy elected 2026-06-25 to keep the placeholder for this review round. Hard pre-production gate; no number invented.
