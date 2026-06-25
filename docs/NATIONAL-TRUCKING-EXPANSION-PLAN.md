# National Trucking Expansion — Plan & Diagnosis

Date: 2026-06-24
Author: Claude (read-only audit pass, no writes outside this doc)
Repo: `/Users/raphyhaddock/trucking-accident-site` · branch `main` · last commit `7a00a18`

---

## TL;DR

The national architecture you asked me to "build" is **already built**. This repo generates **50 state pages + 1,616 city pages + 20 accident-type pages**, all data-driven from a typed registry backed by real NHTSA FARS crash data. The "1,000 city pages, data-driven" definition-of-done is structurally met and then some.

So this is **not** a greenfield build. It's a **repair-and-extend** job. Two things block clean expansion, and both are decisions only you can make:

1. **P0 — the working tree is damaged.** A "City Enhancement Agent v2.0.0" run left **30+ city files reduced to `[NEEDS ENHANCEMENT]` placeholder stubs** (uncommitted), and **2 are already committed to `main`** (`california/san-jose.ts`, `texas/san-antonio.ts`). The good content still exists in git history. If we build/ship as-is, 30+ pages are thin-content garbage. I did **not** revert anything — that's your call (see §3).
2. **Taxonomy mismatch.** Your national page list (semi-truck, 18-wheeler, Amazon/FedEx/UPS, tanker, etc.) does **not** match what's built (20 *mechanism* pages: jackknife, rollover, underride…). Adding your list is easy in the existing data system, but the brand pages (Amazon/FedEx/UPS) carry a fabrication/defamation risk and need careful framing (see §6).

The repo has been **dormant since ~Jan 11, 2026 (~5 months)**. The latest audit report is from Jan 10 and predates the regression — **do not trust its numbers** (the 2,294-duplicate figure is stale and pre-damage).

**Recommendation: stop here at Phase 1.** Get your decisions on §3 (revert) and §6 (taxonomy + brand safety), then I execute Phases 2–8 in small PRs. The foundation is strong enough to do this safely — but not in one chaotic commit on top of a broken tree.

---

## 1. Ground-truth current state (verified this session)

All numbers below were produced by running the repo's own registry, not by reading comments or the stale audit.

| Thing | Reality | How verified |
|---|---|---|
| State pages | **50** (`getAvailableStateSlugs()`) | `tsx` eval against `states-content` |
| City static routes + sitemap entries | **1,616** (`getAllCityParams()`) | `tsx` eval; same function feeds both route gen and sitemap |
| City content files on disk | **1,614** `.ts` files across all 50 states | `find src/lib/cities-content` |
| Accident-type pages | **20** (`/accidents/[slug]`, mechanism-based) | 23 files − index/types/images |
| State content files | 50 + index + types | `src/lib/states-content` |
| Distinct states with ≥1 city | **50** | `tsx` eval |
| Real external data | NHTSA **FARS 2022** crash/fatality data, city populations, city geo | `scripts/city-accident-data.json`, `scripts/data/city-populations.json`, `scripts/city-geo-data.json` |
| Package manager / runtime | npm; Next.js **16.1.1**, React 19.2, TypeScript 5, Tailwind 4, Zod 4 | `package.json` |
| Audit tooling | `run-audit.ts` orchestrating ~10 content + ~20 technical agents | `scripts/run-audit.ts`, `scripts/content-audit/`, `scripts/technical-audit/` |

**City count per state is FARS-and-population-driven, not "top 20."** Big states have many (TX 158, CA 149, GA 118, NY 80); small states have few (SD 3, WY 3, RI 4, DE 4, ND 4). See §6 for the decision this forces.

### Route architecture (already correct)
- `src/app/states/[slug]/page.tsx` → `generateStaticParams()` from `getAvailableStateSlugs()` (50)
- `src/app/states/[slug]/[city]/page.tsx` → `generateStaticParams()` from `getAllCityParams()` (1,616)
- `src/app/accidents/[slug]/page.tsx` → 20 mechanism pages
- `src/app/sitemap.ts` → maps the **same** registry functions (consistent with route gen); the `// City pages (520 pages)` comment is **stale/wrong** — it emits 1,616
- `not-found.tsx` present; each dynamic route calls `notFound()` on invalid slug; each sets a `canonical`

This is exactly the data-driven, dynamic-routing shape the brief asks for. It exists.

---

## 2. What's already built vs the brief

| Brief requirement | Status |
|---|---|
| All 50 states, data-driven | ✅ Built |
| ~1,000 city pages via dynamic routing | ✅ Built (1,616, exceeds target) |
| Typed data model (`types.ts`) | ✅ Built |
| Real data, no runtime web fetch | ✅ FARS/population/geo as static JSON |
| Sitemap from canonical route data | ✅ Built (1 stale comment) |
| Per-page metadata + canonical | ✅ Built (`generateMetadata` in all 3 routes) |
| FMCSA national baseline page | ✅ `/fmcsa-regulations` (~7,900 words) |
| Validation / audit scripts | ✅ Extensive (10 content + 20 technical agents) |
| Differentiation rules | ⚠️ **Designed** (`docs/DIFFERENTIATION_RULES.md`) but only partially deployed, now regressed |
| Quality/attorney disclosure | ⚠️ Inline "attorney advertising" text in routes; **no reusable component**, no named attorney/credential (E-E-A-T gap) |
| National vehicle/brand pages (semi, 18-wheeler, Amazon…) | ❌ **Missing** (only mechanism pages exist) |
| Core `/truck-accident-lawyer` hub + evidence/settlement topic pages | ❌ Missing as distinct routes |

---

## 3. P0 — working-tree damage (decision required, I did not touch it)

**Evidence (verified, not recalled):**
- 52 city `.ts` files are dirty. **30 currently contain `[NEEDS ENHANCEMENT]`** placeholder stubs in the working tree.
- Representative: `california/fresno.ts` — a real 2,126-word FARS-grounded page was overwritten with `heroText: "[NEEDS ENHANCEMENT] Fresno hero text - 2 fatalities in 2022."` and stub `whyDangerous` / `liabilityExplanation` / `evidencePreservation` sections. Word count 2,126 → 227.
- The file header changed from "Enhancement Agent v1.0.0 / Word Count 2126" to "v2.0.0 / Word Count 227."
- `scripts/data/batch-progress.json` was **reset** from 13 tracked enhanced cities to empty.
- Net across the 52 files: **+2,417 / −3,044 lines** (net content loss).
- **2 files already committed broken on `main`:** `california/san-jose.ts`, `texas/san-antonio.ts` (the old "failed enhancement" pair noted in `docs/CONTENT_INVENTORY.md`).

**Reading:** this looks like a broken/interrupted v2.0.0 enhancement run that stubbed files for re-processing and never finished — not deliberate good work. But the brief says preserve uncommitted work, so **I will not revert without your word.**

**Options:**
- **(A) Restore the 30+ stubbed files from HEAD** (`git checkout HEAD -- <paths>`) — recovers the good v1.0.0 content instantly, loses nothing real. *Recommended.*
- **(B) Keep the stubs** and treat them as a re-enhancement work queue (only if v2.0.0 was intentional and you want those cities rebuilt richer).
- **(C) Leave the tree untouched**, branch from HEAD, and do all new work without resolving this (the stubs stay a latent landmine).

The 2 committed-broken files (`san-jose`, `san-antonio`) need a real re-enhancement regardless — restoring from HEAD won't help them (HEAD is already the broken version).

---

## 4. What's built well (keep, don't rebuild)

- **Registry pattern** (`cities-content/index.ts`): merges FARS-data cities + content-file cities, dedups, feeds both route gen and sitemap from one source. Clean.
- **Real crash data wired into pages**: FARS 2022 fatalities per city/state surface in hero/meta. This is genuine specificity, not invented.
- **Audit infrastructure**: `npm run audit` (all), `audit:content`, `audit:technical`. Content agents check thin content, duplicate fingerprinting, meta uniqueness, FAQ quality, schema validity, internal links, and a `legal-accuracy` agent that checks SOL/negligence per state.
- **Docs are strong**: `DIFFERENTIATION_RULES.md` (the "Swap Test" + testable rule IDs S1-S5/C1-C6/A1-A5/F1-F3), `CITY_CONTENT_SPEC.md`, `STATE_CONTENT_SPEC.md`, `INTERLINK_SPEC.md`. The rules are good; deployment is the gap.

---

## 5. Gaps vs the NY Construction benchmark

NY Construction is more mature in five transferable ways. Priority order for trucking:

1. **Deterministic meta-description template system** (`meta-descriptions.ts`, hash-routed, 8+10 templates, guaranteed no dupes). Trucking stores per-city meta inline → unique where enhanced, duplicated where templated/stubbed. **Port this.**
2. **A reusable quality/disclosure + lead component.** NY has `Breadcrumbs` (with BreadcrumbList JSON-LD), `InlineLeadForm`, and an inline "Attorney Advertising" + reviewer byline. Trucking has `CaseEvaluationForm` + `Breadcrumb` but no disclosure component and no E-E-A-T byline. **Add a truthful `QualityDisclosure` component** (no fake attorney names — generic, accurate wording only).
3. **A pre-build content validator that actually gates** duplicate H1 / title / meta / intro. Trucking's audit checks meta uniqueness but **has no H1/intro duplicate validator** and nothing runs on build. **Add it.**
4. **Schema helpers as shared builders** (FAQPage, LegalService, BreadcrumbList, LocalBusiness). Trucking emits schema inline per route; centralizing reduces drift.
5. **(Optional, not in brief)** NY has Spanish `/es` parallels + hreflang. Skip unless you want it.

NY's own weak spots to **not** copy: generic unnamed-attorney byline (fix, don't clone), hand-entered settlement ranges with no source (trucking must source or caveat).

---

## 6. The taxonomy decision (yours to make)

Your brief lists ~19 national pages at the **root** (`/truck-accident-lawyer`, `/semi-truck-accident-lawyer`, `/amazon-truck-accident-lawyer`…). The repo has 20 pages under **`/accidents/[slug]`**, organized by **mechanism** (jackknife, rollover, underride, driver-fatigue, improper-maintenance…).

Overlap and gaps:
- **Already exist** (as `/accidents/x`): jackknife, rollover, underride, driver-fatigue, maintenance-failure (`improper-maintenance`), plus `/fmcsa-regulations`.
- **Missing — vehicle/brand pages:** semi-truck, 18-wheeler, tractor-trailer, commercial-truck, delivery-truck, tanker, **Amazon / FedEx / UPS**.
- **Missing — topic/evidence pages:** core `/truck-accident-lawyer` hub, `/truck-black-box-evidence`, `/truck-accident-settlement-factors`, `/truck-accident-evidence-preservation`.

**Two decisions:**
- **D1 — Routing:** keep the clean `/accidents/[slug]` taxonomy and add the new pages there, OR add root-level routes to match your URLs exactly (better for exact-match head terms like "semi truck accident lawyer," more route sprawl). My lean: a new typed group (e.g. `vehicle-types-content` + `/truck-types/[slug]`, or fold into `accidents-content`) driven by the same data system — **not** 19 hand-built files.
- **D2 — Brand pages (Amazon/FedEx/UPS): genuine risk.** Naming a specific carrier on a "sue this company" page invites unsourced claims about that company's safety record and a defamation/advertising-compliance angle. These can be done safely (frame generally: "accidents involving delivery vehicles operated by or contracted to large carriers," explain contractor/broker liability, never assert a specific company's fault or fabricate a settlement) — but the wording needs review before publish.

> **FABLE MOMENT: one-way door + "is this safe, not does it work."** The brand pages (D2) and the per-state legal claims (§7, item 2) are published legal advice on a lawyer site — reputationally hard to reverse and legally sensitive. Recommend a Fable window to set the wording rules / review the state-law content before any of it ships. Architecture and page-plumbing can run on Opus/Sonnet; the legal/brand wording verdict should be Fable.

---

## 7. Risks

1. **P0 placeholder regression** (§3) — would ship 30+ thin pages; 2 already on `main`. Highest priority.
2. **Per-state legal accuracy.** The Jan-10 audit flagged `legal-accuracy` criticals for **Florida, Maine, West Virginia** (negligence/SOL). Stale, but state SOL/negligence claims are legal-critical and must be sourced or caveated per state. **Needs sourcing + the Fable/legal review above.**
3. **Stale audit numbers.** Everything in `scripts/reports/audit-report.*` is Jan 10 and predates the v2.0.0 damage. Re-run the audit on a *clean* tree (after §3) before trusting any duplicate/thin counts.
4. **No fresh build verification.** 1,616 pages have not been built clean this session. A `next build` of this size is slow; do it once on a clean tree as the Phase 8 gate.
5. **Small-state coverage** (SD/WY/RI/DE/ND have 3–4 cities). If you want literal "top 20 every state," small states need a population-seeded top-up; if FARS-driven counts are fine, leave them.
6. **Differentiation is real only where deployed.** The rules exist; enforcement at build time does not. Until a validator gates merges, new content can silently regress to spun duplicates.

---

## 8. Safe-to-automate vs needs-Raphy

**Safe to automate (I can do without further sign-off, in small PRs):**
- Re-run the audit suite on a clean tree (read-only) and produce current numbers.
- Fix the stale sitemap comment; add the missing static national/topic routes' *plumbing*.
- Build the missing reusable components (QualityDisclosure, schema builders, meta-description template system) ported from NY.
- Add the H1/title/meta/intro duplicate validator + wire it into `npm run audit`.
- Add the vehicle/topic page *scaffolding* in the data system (content filled per your D1/D2 ruling).

**Needs your decision first:**
- **§3** — revert the placeholder files? (A/B/C)
- **§6 D1** — `/accidents/[slug]` vs root-level routes for the new national pages.
- **§6 D2** — go/no-go + wording rules on Amazon/FedEx/UPS brand pages (Fable-reviewed).
- **§7 item 2** — who sources/approves the per-state SOL/negligence content (Fable + you).
- **§7 item 5** — "top 20 every state" vs current FARS-driven counts.

---

## 9. Phased plan (adapted to reality)

**Phase 1 — Audit & Plan (this doc).** Done.

**Phase 2 — Stabilize the tree.** Resolve §3. Restore good content from HEAD where applicable. Re-run audit, capture current baseline numbers. Verify a clean `tsx` route-count + a targeted `next build` of a few representative routes.

**Phase 3 — Data foundation hardening.** Add a validation script asserting: 50 states; every state has ≥1 city; no duplicate city slug within a state; unique state slugs; required `CityContent` fields present; expected route count. (Most data exists; this adds the guardrail.) Decide §7-item-5 (small-state top-up).

**Phase 4 — Missing national pages.** Per D1/D2: add the vehicle-type + topic/evidence pages through the data-driven system (one typed data group, one dynamic route, shared template), not hand-built files. Brand pages only after D2 wording is approved.

**Phase 5 — Reusable templates/components.** QualityDisclosure (truthful), shared schema builders (FAQPage/LegalService/BreadcrumbList), meta-description template system ported from NY, EvidencePreservationBlock / FMCSABlock / LiabilityPartiesBlock extracted as shared sections.

**Phase 6 — Content differentiation & repair.** Re-enhance the 2 committed-broken cities + any others below threshold, using FARS + the differentiation rules. Wire the differentiation validator into the audit so regressions can't merge.

**Phase 7 — Internal linking & technical SEO.** Verify state↔city↔accident link graph, nearby-city links, related-type links; fix the sitemap comment; confirm canonicals, breadcrumb schema, robots, no accidental noindex.

**Phase 8 — Audits & build gate.** Full `npm run audit`, lint, and one full `next build` on the clean tree. Spot-check: home, one big-state city (e.g. `texas/houston`), one small-state city (e.g. `wyoming/*`), one accident page, one new national page, one edge-case slug → `notFound()`.

---

## 10. Exact files likely to change (by phase)

- **Phase 2:** `src/lib/cities-content/<state>/<city>.ts` (restore ~30 from HEAD), `scripts/data/batch-progress.json`, `scripts/data/target-progress.json`.
- **Phase 3:** new `scripts/validate-data.ts`; possibly `src/lib/cities-content/types.ts`.
- **Phase 4:** new `src/lib/vehicle-types-content/` (or extend `src/lib/accidents-content/`); new route `src/app/truck-types/[slug]/page.tsx` (or root routes per D1); `src/app/sitemap.ts`; `src/lib/accidents-content/index.ts`.
- **Phase 5:** new `src/components/QualityDisclosure.tsx`, `src/lib/seo/schema.ts`, `src/lib/seo/meta-descriptions.ts`; edits to the 3 dynamic route files to consume shared builders.
- **Phase 6:** city/state content files; new `scripts/content-audit/h1-intro-uniqueness.ts`; `scripts/run-audit.ts`.
- **Phase 7:** `src/app/sitemap.ts` (fix comment + any missing route group), link components.
- **Phase 8:** none (verification only).

---

## 11. Verification commands

```bash
# Route counts (ground truth, no server needed)
npx tsx -e "import * as c from './src/lib/cities-content/index.ts'; import * as s from './src/lib/states-content/index.ts'; console.log('states', s.getAvailableStateSlugs().length, 'cities', c.getAllCityParams().length)"

# Damage scope
grep -rl "\[NEEDS ENHANCEMENT\]" src/lib/cities-content/ | wc -l
git grep -l "NEEDS ENHANCEMENT" HEAD -- 'src/lib/cities-content/**/*.ts'   # committed-broken files
git diff --shortstat -- 'src/lib/cities-content/**/*.ts'

# Audits (run AFTER stabilizing the tree — Jan-10 report is stale)
npm run audit:content
npm run audit:technical
npm run lint

# Build gate (slow at 1,616 pages — Phase 8 only)
npm run build
```

---

## 12. What I need from you to start Phase 2

Four one-word-ish answers:
1. **Revert?** §3 → A (restore from HEAD, recommended), B (keep stubs as queue), or C (leave it).
2. **Routing?** §6 D1 → keep `/accidents/[slug]` + new group, or root-level routes.
3. **Brand pages?** §6 D2 → go (with Fable-reviewed wording), skip, or generic-only (no Amazon/FedEx/UPS names).
4. **Small states?** §7-5 → top-up to 20 each, or leave FARS-driven counts.

Nothing was pushed, merged, reverted, deployed, or written outside this file.
