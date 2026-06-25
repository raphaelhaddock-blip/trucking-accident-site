# Redesign Working Notes — internal (feeds REDESIGN-PACKET.md)

Worktree: `/Users/raphyhaddock/trucking-redesign` · branch `redesign/next-gen-legal-platform` (from `repair/pr1-restore-pr2-gate` @ 883727d). Local-only, never push.

## Stack (verified)
- Next.js 16.1.1 App Router, React 19.2, Tailwind v4 (CSS-config in `globals.css` via `@theme inline`), TS 5, Zod 4.
- Fonts: Geist + Geist_Mono (next/font/google) — the Vercel default = generic tell. **Replace.**
- Images: Sanity CDN (`cdn.sanity.io/images/54bwni5t/...`), 107+ hardcoded URLs. `next.config.ts` remotePatterns allows only `cdn.sanity.io/images/**`.
- ~603 pages: 6 static, 20 accident, 50 state, ~520 city, 7 blog.
- Form → server action `src/app/contact/actions.ts` (`submitContactForm`, useActionState) → Sanity `lead` create. Zod schema `src/lib/validation/contact-schema.ts` (6 fields: name, phone, email, state, accidentType, description).

## DO-NOT-BREAK SEO/technical inventory (verified by audit agents, file:line)
- **sitemap** `src/app/sitemap.ts` — pulls ACCIDENT_SLUGS, getAvailableStateSlugs, getAllCityParams, BLOG_SLUGS. baseUrl hardcoded.
- **robots** `public/robots.txt` — disallows /api/ /studio/ /_next/; Sitemap line.
- **generateStaticParams**: accidents (20), states (50), cities (~520), blog (7). Must keep slug sources intact.
- **generateMetadata** (dynamic): `/accidents/[slug]`, `/states/[slug]`, `/states/[slug]/[city]`, `/blog/[slug]`. Canonical = relative path `/states/${slug}` etc. (do NOT change).
- **Static metadata**: layout.tsx (metadataBase, robots index/follow, default OG, keywords), each static page.
- **JSON-LD** (preserve all `<script type="application/ld+json">`):
  - layout.tsx: WebSite
  - home page.tsx: @graph LegalService + WebPage + WebSite
  - accidents/[slug]: FAQPage + LegalService
  - states/[slug]: FAQPage + LegalService + Article
  - states/[slug]/[city]: LegalService(+PostalAddress) + Article + FAQPage
  - blog/[slug]: Article + FAQPage
  - fmcsa-regulations: FAQPage + Article
  - contact: @graph ContactPage + FAQPage
  - Breadcrumb.tsx: BreadcrumbList (lines 13-23)
- **Images**: hero uses next/image `fill priority object-cover sizes="100vw"`; OG images per-page (Sanity URLs). HeroImage.tsx has `src,alt,priority,overlay,overlayOpacity,children` API + SectionImage.
- **Data types** (don't rename fields): StateContent, CityContent, AccidentContent, FAQ, SettlementRange (`SETTLEMENT_DISCLAIMER`), CityAccidentStats, DangerousRoad, CommonAccidentType.
- City page special logic: MECHANISM_TO_SLUG map + mechanismSlug(), isHub detection (truckingIndustry && 0 dangerousRoads), venueCourt null-gating, dangerouslySetInnerHTML for truckingIndustry prose. Keep all.
- Phone placeholder `1-800-555-0123` everywhere (NOT real — keep as placeholder; flag for Raphy).

## BLUNT UI/UX AUDIT (AI-slop / trust / conversion / mobile)
AI-SLOP TELLS:
1. Geist font = "this is a Next.js starter." Instant generic read.
2. Emoji trust icons ⚖️📞💰🏆 (page.tsx:66-71) — cheap, inconsistent across OS, unprofessional for "national platform."
3. Navy+amber = the default legal-template palette. Flat single-accent.
4. Cloned card grids: accident types (3-col), "why specialized" (6 identical gray cards), trust row, states grid — same rounded-card pattern repeated, no hierarchy.
5. Copy-pasted inline SVG arrow ~8x; no icon system.
6. Monotonous section rhythm: nearly every section `py-16/py-20`, alternating white / gray-50 / navy-900 bands. No cinematic variation, no overlap, no asymmetry.
7. Generic stat panels (centered amber number + gray label) — not "command center."

TRUST:
8. Placeholder phone 1-800-555-0123 + "Truck Injury Lawyers" generic brand. No real firm, no credentials shown (honest constraint — it's a referral platform; lean into "national response network" framing, data/authority not fake firm cred).
9. Hero photo is a stock-y dusk truck (Sanity) — exactly the "generic lawyer stock" the brief says avoid.

CONVERSION:
10. No sticky mobile CTA (header is sticky but no persistent call/case-review bar on mobile).
11. Hero CTA fine but visual urgency is low; stats not tied to a narrative.
12. Form is plain; trust signals around it are thin.

MOBILE:
13. Header sticky OK; mobile menu OK. But emoji row + dense card grids stack into long monotony.
14. Long pages (state/city/accident) have no in-page nav / progress.

## DESIGN DIRECTION (locked) — "National Truck Accident Response"
- **Type**: Display = **Newsreader** (editorial/records serif, gravitas) for H1/H2; Body/UI = **Inter** (tabular nums for data); Eyebrow/label/stat-unit = mono (**Geist Mono**, already loaded — reuse for command-center feel). Headline serif, never body serif.
- **Color**: keep navy-*/amber-* tokens (backward compat, 100+ usages) + ADD semantic layer: `--ink` (deep midnight), `--surface`/`--surface-2`/`--paper` (warm bone for light sections, not pure white), `--line` (hairline border), `--signal` (safety orange-red, urgent, sparing), `--accent`=amber (signage), text-primary/secondary/muted. Cinematic dark hero on ink, not flat navy-900.
- **Motifs (honest, no photos/fake evidence)**: SVG interstate/freight-network line map, road-lane perspective lines, hazard/mile-marker accents, document/records grid abstraction, hairline section dividers, subtle grain. Builds "command center" without stock imagery.
- **Components to add** (src/components/ui/ or similar): Section wrapper (rhythm + eyebrow), StatPanel (instrument style, tabular mono), brand Logo, Hero treatment (local SVG/gradient, optional photo slot), MobileStickyCTA, FAQ accordion styling, finder.
- **Brand assets** `/public/brand/`: logo (SVG), wordmark, favicon, interstate-network.svg, road-texture.svg, records-grid.svg, section-divider.svg, og fallback (keep Sanity OG in metadata for now — localizing OG needs raster gen; flag as follow-up). Photographic hero = exact gen prompts + designed SVG placeholder (no fake photo).

## EXECUTION PLAN
1. globals.css design system + fonts in layout.tsx (drop Geist sans→keep mono; add Newsreader+Inter).
2. /public/brand SVG assets + brand README (prompts).
3. Header + Footer + MobileStickyCTA.
4. Homepage (reference impl).
5. Templates: state, city, accident + contact/form — apply locked system, preserve all SEO.
6. Verify: build, tsc, eslint, after-screenshots (local server, transient), packet.

OG-image + phone localization = Raphy-gated follow-ups.

## VERIFICATION LOG
- Build #1: exit 0 — 50 states + 1616 city + 20 accident + 7 blog + statics + sitemap.xml all prerendered. tsc clean. eslint: 44 errors ALL pre-existing in untouched files (fmcsa-regulations, blog, scripts/*, cities-content/index.ts, content-engine/faq.ts); 0 new from redesign (Next 16 doesn't run eslint in build). git diff = only the 10 intended files.
- Template agents (state/city/accident) returned: schema/metadata/generateStaticParams byte-exact, isHub/venueCourt/mechanismSlug/prose-transform preserved, 0 inline svg, 0 emoji. Spot-verified counts live.
- BUG FOUND + FIXED (R7): base `h1,h2{color:--text-strong}` was UNLAYERED → overrode Tailwind `text-white` → white headings rendered dark-on-dark on ALL ink heroes/sections (caught on mobile home H1). Fix: wrapped base element styles in `@layer base`. Rebuild #2 + re-screenshot to confirm.
- Mobile sticky CTA: confirmed rendering (Call Now / Free Case Review bar).
- after-screenshots: docs/redesign-assets/after/ (home/state/city/accident/contact desktop + home/city mobile). Captured via transient `next start` on :3006, server killed after.
- ROOT CAUSE (was 2 bugs, 1 cause): `@theme inline` does NOT emit --font-sans/display/mono as real :root vars → every `var(--font-*)` in base/.eyebrow/.stat fell back to sans; AND unlayered base `h1{color}` beat `.text-white`. FIX: define --font-* on `body` (next/font vars live there); remove color from base h1/h2/h3-h6 (inherit instead); `.bg-command{color:--text-on-ink}` defensive light default; Section light title `text-ink-strong`.
- Build #3 exit 0. COMPUTED-STYLE VERIFIED (ground truth via browser_evaluate): hero H1 = rgb(255,255,255) white + Newsreader serif; light h2 = rgb(12,22,38) strong; eyebrow = IBM Plex Mono. Home desktop+mobile visually confirmed: cinematic command hero, dark sections legible, sticky mobile CTA, no emoji, no Sanity photos. tsc still clean, no new lint errors.

## PR2 LOG (asset pass + conversion polish)
- Breadcrumb contrast bug (text-gray-600/900 dark on dark hero → invisible) FIXED: dark-tone aware (steel-300/white/amber) + tap padding; JSON-LD unchanged. Visually confirmed legible on accident mobile.
- CommandHero mobile density tightened (smaller padding/subtitle, breadcrumb spacing, full-width CTAs on mobile). Sticky CTA still always-present = action always reachable regardless of hero length.
- .prose-legal: 68ch measure cap + lead first-paragraph (presentation only, no content change).
- og-default.png (1200x630) rasterized from brand kit via headless browser (real, on-brand, NOT stock) → public/brand/og-default.png. Default Sanity OG URL replaced in 15 files with https://trucking-accident-site.vercel.app/brand/og-default.png (0 old remaining). Per-page state/accident OG still Sanity (need per-image rasters = prompts).
- Favicon wired: src/app/icon.svg.
- Build #4 exit 0; tsc clean; eslint clean on changed files. after-pr2 shots: docs/redesign-assets/after-pr2/ (5 desktop + 3 mobile). REMAINING BLOCKER: photoreal per-page hero/header images (no generator in-session) + legal-tone preserved-dirty blockers (production-path, out of UI scope).
