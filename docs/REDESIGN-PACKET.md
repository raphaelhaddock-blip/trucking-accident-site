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

## 8. Before / after screenshots
- **Before** (old live site): `docs/redesign-assets/before/` — `before-home-desktop.png`, `before-state-texas-desktop.png`, `before-city-houston-desktop.png`, `before-accident-jackknife-desktop.png`, `before-contact-desktop.png`, `before-home-mobile.png`, `before-city-houston-mobile.png`.
- **After** (this redesign): `docs/redesign-assets/after/` — same 7 filenames (`after-*`).
- Working notes / full verification log: `docs/redesign-assets/AUDIT-NOTES.md`.
