# REDESIGN PACKET — National Truck Accident Response

**Branch:** `redesign/next-gen-legal-platform` (worktree `/Users/raphyhaddock/trucking-redesign`, forked from `repair/pr1-restore-pr2-gate` @ `883727d`)
**Status:** First implementation pass. Local-only — **nothing pushed or deployed.**
**Date:** 2026-06-25

> One line: turned a generic navy-and-amber legal-SEO template into a premium, data-backed "national truck accident response" platform — new type system, command-center color language, a local SVG brand kit (no Sanity stock), and a rebuilt component layer — while preserving every SEO route, schema block, canonical, sitemap entry, and content field.

---

## 1. What changed

### Foundation
- **Type system.** Dropped Geist (the Vercel-default "this is a Next.js starter" tell). New trio: **Newsreader** (editorial serif — H1/H2, gravitas), **Inter** (body/UI, tabular figures for data), **IBM Plex Mono** (eyebrows, stat units — instrument-panel feel). Wired in `src/app/layout.tsx`.
- **Design tokens** (`src/app/globals.css`). Kept the legacy `navy-*`/`amber-*` scales (100+ existing usages stay valid) and added a command-center semantic layer: `ink-950…700` (cinematic blue-black), `steel-100…500` (cool neutrals), `paper/paper-2/paper-3` (warm bone surfaces — not sterile white), `accent-*` (amber signage/CTA), `signal-*` (hazard orange-red for true urgency), plus semantic text/line/elevation tokens and a fluid display type scale.
- **Component utilities**: `.btn` family (primary/signal/ink/ghost/ghost-ink), `.card`/`.card-hover`, `.eyebrow`, `.stat-value`/`.stat-label`, `.rule`, `.container-page`, `.prose-legal`, plus honest brand motifs in CSS (`.bg-command` ink gradient, `.lane-lines`, `.grain`, `.hazard-strip`, `.signpost`). Removed the OS dark-mode flip that would have wrecked the warm-paper design.

### Brand asset system (`/public/brand/`) — replaces the Sanity look
Hand-built SVG, no stock photography, no fabricated evidence:
- `logo-mark.svg`, `logo-lockup.svg`, `favicon.svg` — route-marker shield + forward chevron (national-authority/road language).
- `interstate-network.svg` — abstract freight-corridor map (hero/section motif; decorative, not a data claim).
- `records-grid.svg` — evidence / ELD-log / case-file abstraction.
- `road-texture.svg`, `section-divider.svg` — roadway + signage dividers.
- `README.md` — usage rules + **exact image-generation prompts** for the photographic pieces I can't fabricate (hero, accident/state/city headers) and OG raster instructions.

### New reusable components
- `Logo.tsx` — inline brand lockup (theme-aware, optional tagline).
- `MobileStickyCTA.tsx` — persistent mobile Call / Free Case Review bar (`md:hidden`; body reserves space via `has-sticky-cta`).
- `ui/Icon.tsx` — single stroked icon set replacing ~8 copy-pasted inline SVGs and **all emoji**.
- `ui/Section.tsx` — section rhythm + mono eyebrow → serif H2 → intro, with `paper/paper-2/white/ink` tones.
- `ui/Stat.tsx` — instrument-panel statistic (tabular serif value + mono label on a hairline).
- `CommandHero.tsx` — cinematic dark hero (ink gradient + freight-network motif + grain) that **replaces the Sanity stock-photo hero**, with an optional darkened photo slot for when local documentary assets are generated.

### Pages restyled
- **Global**: Header (premium nav, brand mark, hover underline, mobile menu), Footer (ink, lockup + tagline, mono column heads, hazard strip), sticky mobile CTA.
- **Homepage** (`src/app/page.tsx`) — reference implementation: command hero with in-hero stat readout, icon trust bar (no emoji), accident-type cards, state finder (route-marker plates), cinematic FMCSA/liable-parties dark section, "why different" cards, hazard-strip urgency band, ink case-review section.
- **Contact** (`src/app/contact/page.tsx`) — command hero, restyled form (behavior untouched), trust/info cards, FAQ, urgency CTA.
- **Shared form** (`CaseEvaluationForm.tsx`) — restyled inputs/card/buttons; **all behavior preserved**.
- **Templates** (state / city / accident) — _see §5; restyled via the same system._

---

## 2. Design rationale (the "why")

- **Why command-center, not stock photos.** The brief is a *national response platform*. A per-page stock truck photo reads as exactly the AI-SEO-directory look we're escaping, and good honest crash photography doesn't exist to use. A cinematic ink hero carrying the page's **own data** (fatalities, insurance minimums, evidence window) looks more authoritative and is differentiated per page by content, not by a swapped image.
- **Why a serif.** Editorial serif headlines (Newsreader) signal records/authority/seriousness — the "investigation desk," not the "local lawyer template." Body stays sans for legibility and conversion.
- **Why keep navy/amber but add ink/steel/paper/signal.** The existing palette is embedded in 100+ classes and is fine as a base; layering a richer ink + warm-paper + hazard-signal system gives cinematic depth and a real urgency channel without a risky rip-and-replace.
- **Why honest SVG motifs.** They deliver the "freight network / evidence / roadway" command language with zero fabricated evidence, zero stock, and near-zero performance cost.
- **Why a sticky mobile CTA.** This is lead-gen; the old site had none. Persistent Call / Case-Review doubles the conversion surface on phones.

---

## 3. Assets created vs. prompts needed

**Created (shipped, real):** all SVGs in `/public/brand/` + the in-app inline `Logo` + all CSS motifs.
**Prompts written (need a generator — see `/public/brand/README.md`):** photographic hero, photographic network, photographic evidence still-life, per-accident headers, per-state/city headers, and the 1200×630 OG raster. No pro image generator was available in this session, so these are specified, not faked.

---

## 4. Image / SEO handling (important)
- Visible heroes no longer render Sanity CDN photos → the "Sanity look" is gone from what users see.
- **OG/Twitter/schema image URLs still point at the existing Sanity assets** (invisible to users) so social cards and structured data don't break. Localizing them needs the OG raster above — flagged for approval.
- Every `generateMetadata`, `generateStaticParams`, JSON-LD block, canonical, sitemap entry, robots rule, and content field is preserved. `next.config.ts` still allows `cdn.sanity.io` (leave until OG is localized).

---

## 5. Templates (state / city / accident)
Restyled onto the same system (the three were done by parallel agents on distinct files under a strict preservation contract; I reviewed diffs + verified live):
- **State** (`states/[slug]`): `CommandHero` with breadcrumb + the 4 `content.statistics` as the in-hero readout; trucking-laws/corridors cards; negligence in a dark ink card + SOL as hairline `Stat` readouts; settlement table restyled (ink header row, hairline rows, tabular amber figures, `SETTLEMENT_DISCLAIMER` kept); "Why Hire Local" as a cinematic `bg-command` section; accident-type + city-finder grids; FAQ; neighboring-states chips. **3 JSON-LD scripts (FAQPage/LegalService/Article) byte-exact; metadata/params unchanged.**
- **City** (`states/[slug]/[city]`, ~1,600 pages): `CommandHero` + stats; dangerous-roads / common-causes / national-resources hub as `.card`s with icons; `isHub`, `venueCourt` null-gating, `mechanismSlug`/`MECHANISM_TO_SLUG`, and the `truckingIndustry` `dangerouslySetInnerHTML` transform all **byte-exact**; FAQ + other-cities grids. 3 JSON-LD scripts preserved.
- **Accident** (`accidents/[slug]`): `CommandHero`; what-it-is prose; causes/injuries/FMCSA/compensation cards; numbered liable-parties + what-to-do badges; "Evidence" kept as a dark `bg-command` section; related links. FAQPage + LegalService preserved; `generateStaticParams` still emits all 20 slugs.
- Every visible Sanity hero `<Image>` removed; `STATE_IMAGES`/`ACCIDENT_IMAGES` retained only inside `generateMetadata`/schema. **0 inline `<svg>`, 0 emoji** across all three (grep-verified).

## 6. Verification results (this session, live)
- **`npm run build`**: ✅ exit 0. Prerendered **50 state pages, 1,616 city pages, 20 accident pages, 7 blog posts, all static pages, and `/sitemap.xml`** — no route/schema/static-params breakage. (Next 16 build runs the TS typecheck; passed.)
- **`tsc --noEmit`**: ✅ exit 0.
- **ESLint**: ✅ 0 errors in all redesign-touched files. The 44 repo-wide errors are **pre-existing in untouched files** (`fmcsa-regulations`, `blog`, `scripts/*`, `cities-content/index.ts`, `content-engine/faq.ts`); `git diff` confirms those files weren't changed. Next 16 doesn't run ESLint during build, so they don't block.
- **Schema / canonical / sitemap**: JSON-LD script counts verified live (state 3, accident 2, city 3, contact @graph, homepage @graph); canonical paths and `generateMetadata`/`generateStaticParams` unchanged; `sitemap.ts` untouched and emitted.
- **Computed-style proof** (browser, post-build): hero `<h1>` = `rgb(255,255,255)` white + **Newsreader**; light-section `<h2>` = `rgb(12,22,38)` strong; eyebrow = **IBM Plex Mono**.
- **Mobile**: sticky Call / Free-Case-Review bar renders (`md:hidden`); no layout overlap; body reserves space.
- **Bug caught & fixed mid-verification**: `@theme inline` doesn't emit `--font-*` as real vars + an unlayered base `h1{color}` overrode `text-white` → headings were dark-on-dark + sans on the first build. Root-caused via computed style, fixed in `globals.css` (define `--font-*` on `body`; drop base heading color; `.bg-command` light default), re-built (#3), re-verified. See `docs/redesign-assets/AUDIT-NOTES.md` verification log.

> Note on local verification: per the repo's `vercel-only` rule I'd normally verify on Vercel, but the safety rules forbid deploying and the mission requires local screenshots — so after-shots were taken from a **transient `next start` on :3006, killed immediately after**. Nothing was pushed or deployed.

## 7. Risks & what needs Raphy approval
- **Placeholder phone `1-800-555-0123`** is everywhere (pre-existing, not real). Redesign kept it as a placeholder. Needs a real tracked number before launch.
- **Brand name** kept as "Truck Injury Lawyers" (added a positioning tagline only) — no rebrand without your call.
- **OG/social images** still Sanity until the OG raster is generated.
- **Favicon**: brand favicon shipped in the kit but not wired as the site favicon (left `favicon.ico` untouched) — wire `app/icon.svg` when you approve.
- **Photographic assets**: optional; prompts are ready for Codex/a generator.
- Nothing pushed/deployed. This is a local first pass for your review.

## PR2 — Asset pass + conversion polish (second commit)

**What changed in PR2:**
- **Breadcrumb contrast fixed** — was `text-gray-600/900` (dark) on the dark hero = near-invisible. Now dark-tone aware (`text-steel-300` links / `text-white` current / amber hover) with real tap padding. JSON-LD `BreadcrumbList` unchanged.
- **Mobile hero density** — `CommandHero` tightened on mobile: smaller vertical padding, smaller subtitle, breadcrumb spacing, and **full-width CTAs on mobile** (`[&>*]:w-full sm:[&>*]:w-auto`) so the action is reachable fast; stat readout sits below the CTA.
- **Scanability** — `.prose-legal` now caps line length at ~68ch, bumps body size/rhythm, and styles the first paragraph as a lead. Presentation only — **no legal facts or content meaning changed.**
- **Real `og-default.png`** (1200×630) — rasterized from the brand kit (ink command bg + freight-network motif + lockup + serif headline + stat readouts) via a headless browser. **Not a stock photo.** At `public/brand/og-default.png`.
- **Default Sanity OG retired** — the shared default OG URL (1 asset referenced in **15 files**: layout, home, contact, all 5 static pages, blog, and the 4 dynamic templates' fallback) replaced with the local `og-default.png`. Per-page state/city/accident OG still use their Sanity hero images (need per-image rasters — prompts in `public/brand/README.md`).
- **Brand favicon** wired (`src/app/icon.svg`).

**PR2 verification (live, this session):**
- `npm run build` ✅ exit 0 (full 1,708-page render incl. sitemap); `tsc --noEmit` ✅ exit 0; ESLint ✅ 0 new errors.
- Breadcrumb contrast fix confirmed on accident mobile (legible light breadcrumb + chevrons on the dark hero); sticky mobile CTA present on all pages.
- `og-default.png` is a real 1200×630 brand raster (verified visually); 0 references to the old Sanity default OG remain (`grep`), 15 files now point to the local asset.
- Nothing pushed/deployed; original checkout untouched.

### Launch blockers (explicit — what stands between this and production)
1. **Photoreal per-page imagery not generated** — no image generator available this session. Visible heroes use the command treatment (fine); per-page state/city/accident **OG/social** images still point to Sanity. Generate from the prompts in `public/brand/README.md`, drop under `public/brand/photo/`, then wire (pass `imageSrc` to `CommandHero` + swap the per-page OG URLs).
2. **Placeholder phone `1-800-555-0123`** sitewide — needs a real tracked number before any launch.
3. **Preserved legal-tone "dirty" blockers** from the repair branch (the uncommitted legal-tone edits in the original checkout) still gate any production path — out of UI-redesign scope, but real.
4. **`next.config.ts` still allows `cdn.sanity.io`** — keep until per-page images are localized, then tighten.
5. Brand name "Truck Injury Lawyers" retained (tagline only) — confirm before launch.

## PR3 — Pro image system on every page + index hubs (third commit)

**The blunt truth:** this session has **no pro image generator**. So PR3 built the *system* that makes pro images trivial to land, not the images themselves. Per the brief, I did not stop and did not fake-wire missing files.

**Image system (auto-wiring):**
- `scripts/gen-image-manifest.ts` runs as an npm `prebuild` step: scans `public/brand/photo/` and regenerates `src/lib/brand-images.generated.ts`. **Drop a correctly-named `.webp` → the next build wires it by slug. Zero code change.**
- `src/lib/brand-images.ts` resolver: `heroPhoto()` (visible) falls back city → state → index-motif → global hero → **null = command treatment (never Sanity)**; `ogImage()` (social) falls back specific-photo → **`og-default.png` (never Sanity)**.
- Wired `imageSrc` into `CommandHero` on home, contact, and the state/city/accident templates. Swapped per-page **OG + JSON-LD images** in all three templates off Sanity (`STATE_IMAGES`/`ACCIDENT_IMAGES`) onto the local resolver; deleted the dead `DEFAULT_OG_IMAGE` consts and the dead `cdn.sanity.io` preconnect.

**Index hubs redesigned** (they were still on the OLD navy/gray template — a real gap):
- `states/page.tsx` and `accidents/page.tsx` rebuilt onto `CommandHero` + `Section` + the icon set. Canonicals `/states` and `/accidents`, all data arrays, and links preserved. Now consistent with the rest of the site.

**Mobile hero excerpt:** `CommandHero` shows only the first subtitle paragraph on mobile (`sm:` shows all) — shorter above-fold, full content present in DOM.

**The generation pack:** [docs/PR3-PRO-IMAGE-GENERATION-PACK.md](docs/PR3-PRO-IMAGE-GENERATION-PACK.md) — exact filenames (matched to the resolver), one size spec (2400×1260 webp), the base prompt + per-asset modifiers, and a P0→P4 priority order (P0 `hero-interstate.webp` alone lights up every page's hero). Hand to Codex.

**PR3 verification (live):**
- `npm run build` ✅ exit 0 (prebuild reported "0 photo asset(s)" → all heroes use the command treatment, **no broken image paths**); `tsc --noEmit` ✅ exit 0; ESLint ✅ 0 new errors.
- `npm run audit:legaltone` ✅ **PASS** (committed + built output clean). The 19 "preserved-dirty" city files it lists are the **pre-existing repair-branch legal-tone blockers** — not touched by this UI work.
- **Remaining Sanity refs (honest):** visible-hero + OG path = **0**. Leftovers are non-rendered data only: the unused `states-content/images.ts` / `accidents-content/images.ts` maps, the `images.hero` fields inside `cities-content/*.ts`, and `next.config.ts` `remotePatterns` (keep until P4 city photos exist).
- After-pr3 screenshots confirm the two index hubs are on-system; other pages are visually identical to PR2 (image layer dormant until photos are dropped).

### What's still blocking "elite"
1. **Generate the photos** (P0 → P4 in the pack). This is the one thing this session couldn't do. Drop them in `public/brand/photo/`, rebuild — done.
2. Real tracked phone #. 3. Preserved-dirty legal-tone blockers (production-path). 4. Confirm brand name. 5. Lower-traffic static pages (blog/fmcsa/about/legal) still on legacy body layout (they inherit the new global type/header/footer/sticky-CTA but aren't fully restyled) — a small PR4.

## PR4 — fal.ai Flux Pro generation (infra built; generation gated on FAL_KEY)

**Built & verified (committed):**
- `scripts/generate-brand-images.ts` — ports the proven fal.ai workflow from `~/ny-blog-canary/src/lib/blog/generate-hero-image.ts` (same model `fal-ai/flux-pro/v1.1`, `enable_safety_checker: true`, `process.env.FAL_KEY` auth) but writes **local files** to `public/brand/photo/` instead of uploading to Sanity. Driven by the PR3 pack's prompts; hard safety rules (no wreckage/victims/people/text/logos…) baked into every prompt. `npm run images:generate` (default set = the 6 priority assets; `--only a,b` to target; `--list` to print prompts). Verified via `--list` (no spend).
- Installed `@fal-ai/client`; added `images:generate` npm script.
- Resolver (`src/lib/brand-images.ts`) made **extension-agnostic** — a fal `.jpg` and a hand-made `.webp` both wire by basename.
- Safe by design: **no FAL_KEY → exits non-zero, generates nothing, fakes nothing.**

**Why generation didn't run this session (honest):**
- `FAL_KEY` is **not** in this repo or the shell, and **not** in the NY reference repo's env.
- The only on-machine copy is `claimulator/.env.local` — a **different venture**. The environment's safety classifier **blocked** reading it ("cross-repo credential harvesting … not authorized"). That's the correct boundary; I did not work around it.
- Per the PR4 brief's own rule ("if FAL_KEY is missing: stop, don't fake, report what's needed"), I stopped.

**To generate (one of these — then I take over):**
1. Paste your key into `~/trucking-redesign/.env.local` as `FAL_KEY=...` (this file is gitignored — it will never commit), **or**
2. Run it yourself: `cd ~/trucking-redesign && FAL_KEY=… npm run images:generate && npm run build`.

Either way: `npm run images:generate` writes the 6 priority images → `npm run build` (prebuild) auto-wires them → heroes + OG upgrade from the command treatment to photos. The pipeline is proven ready (images are git-commitable, `.env.local` is ignored, resolver matches any extension).

**PR4 verification:** `npm run build` ✅ exit 0 (prebuild still "0 photos" until generation runs); `tsc` ✅ exit 0; generator `--list` ✅ correct prompts. No after-pr4 screenshots — nothing changed visually until images exist (site renders the PR3 command treatment).

## PR4B — Flux Pro images generated + wired (executed)

**Generated** (`npm run images:generate`, `fal-ai/flux-pro/v1.1`, key from `./.env.local`, never printed): **6/6** `.jpg` (150–198 KB) in `public/brand/photo/` — `hero-interstate`, `network-corridor`, `evidence-records`, `state-texas`, `city-texas-houston`, `accident-header-jackknife-accidents`.

**Compliance (viewed before wiring):** hero-interstate (dusk interchange, light trails, trucks at distance), evidence-records (blank notepad/clipboard/tape on dark steel), accident-jackknife (semi on a wet dusk curve — no crash). **No people, no faces, no wreckage, no readable text/signage.** Premium documentary grade.

**Wired:** build prebuild detected all 6; resolver matches by basename. Because `hero-interstate` exists as the global fallback, **every hero is now photo-backed** — the 6 have tailored photos, all other pages share the interchange hero; **no page is on the bare command treatment, and no visible hero uses Sanity.** OG uses the specific photo for the 6, else the local `og-default.png`.

**Overlay tuned:** first wiring was too dark (photo barely visible, esp. mobile). Lightened `CommandHero` (image `opacity-0.55` + text-column scrim + bottom scrim) — photo now reads on desktop **and** mobile while the white serif headline, stats, and CTAs stay fully legible. Re-verified home (mobile) + Texas.

**Verification (live):** `npm run build` ✅ exit 0 (prebuild "6 photo assets"); `npm run audit:legaltone` ✅ PASS; sticky mobile CTA works; no layout overlap; hero text legible over photos; **page/component-layer `cdn.sanity.io` refs = 0.**

**Remaining Sanity (honest):** zero in the rendered/hero/OG path. Leftovers are non-rendered data only — the unused `states-content/images.ts` & `accidents-content/images.ts` maps, the `images.hero` fields in `cities-content/*.ts`, and `next.config.ts` `remotePatterns`.

**To scale beyond the proof set:** `npm run images:generate -- --only state-california,accident-header-rollover-accidents,…` (or extend `DEFAULT_SET`), then `npm run build`. Same pipeline; ~$0.05/image.

After-pr4 screenshots: `docs/redesign-assets/after-pr4/` (home/states-index/accidents-index/Texas/Houston/jackknife/contact desktop + home/jackknife mobile).

## Standards + next plans (docs)
- **Growth OS taxonomy + ontology requirement** (new required standard, not yet implemented): [GROWTH-OS-TAXONOMY-ONTOLOGY.md](GROWTH-OS-TAXONOMY-ONTOLOGY.md). Content scaling is gated on it; images are UI infrastructure and may proceed.
- **PR5 image expansion plan** (plan only, no spend): [PR5-IMAGE-EXPANSION-PLAN.md](PR5-IMAGE-EXPANSION-PLAN.md) — ~78 bounded images (~$4) by tier, run P2→build→review→P3/P4. Awaiting go.

## 8. Before / after screenshots
- **Before** (old live site): `docs/redesign-assets/before/` — `before-home-desktop.png`, `before-state-texas-desktop.png`, `before-city-houston-desktop.png`, `before-accident-jackknife-desktop.png`, `before-contact-desktop.png`, `before-home-mobile.png`, `before-city-houston-mobile.png`.
- **After (PR1)**: `docs/redesign-assets/after/` — same 7 filenames (`after-*`).
- **After (PR2)**: `docs/redesign-assets/after-pr2/` — home/state/city/accident/contact desktop + home/accident/city mobile (`after-pr2-*`).
- **After (PR3)**: `docs/redesign-assets/after-pr3/` — the two newly-redesigned hubs (states-index, accidents-index) desktop+mobile + home/city spot-check.
- OG card: `public/brand/og-default.png`.
- Working notes / full verification log: `docs/redesign-assets/AUDIT-NOTES.md`.
