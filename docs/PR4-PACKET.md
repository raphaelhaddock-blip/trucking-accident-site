# PR4 Packet — Model-Aware Gate, Engine Hardening, Hub→National Linking

Branch: `repair/pr1-restore-pr2-gate` (local, unpushed). Base: `038bddc`.
Commits: `49f8ef5` (Steps 2–3), `8b7b387` (Steps 4–5), `4a67b15` (Step 6 tooling).
Build: `npm run build` passes (exit 0, all 1,616 city routes + accidents + states prerender).
Status: **Steps 1–5 shipped. Step 6 (50-page batch) NOT written — engine cannot guarantee <30% at scale; see §6. Step 7 verification below.**

---

## What changed (files)

| File | Change |
|------|--------|
| `scripts/quality/duplicate-audit.ts` | Rewrote the gate to be **model-aware**: city similarity + word floor measured on RENDERED fields only; dead fields reported separately, non-gating. |
| `src/lib/content-engine/modules.ts` | Inject VERIFIED `county` into the trucking-industry provenance note (county survives the gate's normalization). |
| `src/lib/content-engine/faq.ts` | Inject `county` into the evidence FAQ; add `buildHubFaqs` (dispersed draw from the non-pure-evergreen subset). |
| `src/lib/content-engine/compose.ts` | Hub uses `buildHubFaqs(p, 6)`. |
| `src/lib/content-engine/nearby.ts` | Narrow `lat/lng` nulls so the production build type-checks (pre-existing error that blocked `npm run build`). |
| `src/app/states/[slug]/[city]/page.tsx` | Mechanism cards deep-link to `/accidents/[slug]`; new "How a [City] Truck Accident Case Works" section links mechanisms + FMCSA + accidents index; hub-only provenance note. |
| 6 pilot content files | Regenerated through the hardened engine (mesa, bryant, benton, fresno, haddam, burlington). |
| `scripts/quality/pilot-probe.ts`, `batch-preview.ts` | New rendered-only diagnostics. |

No file in the 21-file preserved set was touched. The 4 enhanced controls (houston, dallas, denver, memphis) were not touched.

---

## Step 1 — Verify (done)
- Branch/HEAD confirmed; 21 preserved files + 2 progress JSONs dirty as expected.
- `new-york/new-york.ts` present (156 lines); **0** `[NEEDS ENHANCEMENT]` placeholders across `src/lib/cities-content`.
- `audit:damage`: 0 stubbed, 0 head-broken, all KEEP_WT. `audit:quality` baseline captured (see §below).
- 30% threshold **unchanged** throughout.

## Step 2 — Model-aware gate (done)
Ground truth (verified in `src/app/states/[slug]/[city]/page.tsx`): the city route renders only
`heroText, truckingIndustry, dangerousRoads, commonAccidents, faqs` (+ `metaDescription` fallback,
FARS numbers, images). **H1 and meta title are computed in the route from the city name** — so
`cityContent.h1` / `cityContent.metaTitle` are never rendered, and `whyDangerous / liability /
evidence / fmcsa / legalInfo` are never rendered on city pages.

The gate now:
- measures similarity + word floor on RENDERED fields only (the published surface);
- reports dead-field similarity, stored-H1/title dupes, and FMCSA-identical groups **separately, non-gating**;
- keeps the **0.30** threshold; hub word floor = **500** (advisory band 500–900).

This explains away the old "121 duplicate H1 groups / 35 title groups" as a dead-field artifact (the route never renders them).

## Step 3 — Engine hardening (done, target met)
Real-fact levers (no phrasing spin):
1. **County injection** into the trucking-industry provenance note + the evidence FAQ. County text ("Maricopa" vs "Saline") is **not masked** by the gate's normalizer, so it differentiates.
2. **FAQ dispersion** (`buildHubFaqs`): draw from every POOL entry *except* the pure-evergreen answers (#13/#15/#16/#18/#20/#21) that normalize to byte-identical strings across cities. Selection diversity, not spin.
3. **6 hub FAQs** to clear the 500-word floor.

Result on the mesa↔bryant borderline and all pilots (rendered-only max-partner similarity):

| pilot | before | after | words |
|-------|--------|-------|-------|
| mesa | 35.0% (vs bryant) | **21.5%** | 569 |
| bryant | 35.0% | **21.5%** | 543 |
| benton | — | 24.7% | 588 |
| haddam | — | 24.7% | 575 |
| fresno | — | 18.6% | 560 |
| burlington | — | 23.0% | 574 |

All 6 pilots <30% rendered and ≥500 words. (A first structural attempt — *forcing* the two high-signal FAQs into every hub — **backfired** to 47.5% by creating sameness; reverted to dispersion. Logged as a self-correction.)

## Step 4 — National substance (audited; no new pages)
The substance the hubs need **already exists and is deep**:
- 20 `/accidents/[slug]` mechanism pages, each carrying structured `fmcsaRegulations`, `liableParties`, `evidence`, `compensation`, `whatToDo` sections;
- a 739-line `/fmcsa-regulations` page;
- an `/accidents` index.

Scaffolding standalone evidence/liability/settlement pages would create the exact thin/duplicate content PR4 is fixing. **Decision: improve linking only; scaffold nothing.** No state-specific legal content was written.

## Step 5 — Route integration (done)
On the shared city route (safe for templated, hub, and enhanced pages alike):
- regional accident-mechanism cards deep-link to their national page (`Rear End → /accidents/rear-end-collisions`, etc.); unmapped mechanisms render as plain text (graceful);
- a "How a [City] Truck Accident Case Works" section links the city's mechanisms + FMCSA + the accidents index;
- a provenance note renders **only on engine hubs** (trucking-industry present AND no sourced roads), stating the figures are FARS-derived and that local specifics/state-law deadlines need a licensed attorney.

Verified in built HTML (`mesa.html`): renders deep-links to rear-end/rollover/jackknife/sideswipe pages, the FMCSA link, and the provenance note.

## Step 6 — Gated 50-page batch: **NOT WRITTEN (failed the gate)**
`scripts/quality/batch-preview.ts` selects genuine clones (excluding all protected sets), composes hub
replacements in memory, and scores RENDERED similarity all-pairs + vs the full corpus before writing anything.

**Preview FAILED.** Evidence (deterministic):
- 50-target preview (per-state cap 4): worst batch-vs-batch **53.1%** (connecticut/cromwell ↔ georgia/la-grange — *different regions*), worst batch-vs-corpus **49.3%** (california/san-bernardino ↔ the fresno pilot).
- 80-hub stress test: **8.2% of all pairs >30%**, **every one of the 80 cities has at least one >30% partner**, worst **56.8%**.

**Root cause (engine capacity, not selection):** rendered hub content = hero + trucking + regional mechanism mix + 6 FAQs. The regional mechanism mix is *identical within a region*. Most hero/trucking slot sentences and FAQ answers carry only **masked** tokens (city name, state name, numbers), so two cities that select the same slot/FAQ index produce **byte-identical** normalized text. The only normalization-surviving differentiators — county, region name, nearby-city names — appear in too few positions to overcome a 4–6 position collision. The 6 pilots cleared 30% partly by hash luck of their (mostly cross-region) selections; that does not generalize.

**This is a load-bearing-architecture failure → FABLE.** The differentiation engine underpins every future city page, and the differentiation approach has now failed at batch scale after the Step-3 fixes. Do not brute-force it. Engine redesign options (any/combination), for a Fable window with Raphy:
1. Much larger, more varied slot pools (≥12 options/slot) to drop collision probability.
2. Weave **unmasked** real facts (county, region name, nearby cities, population/rank, size tier) into *every* slot sentence and most FAQ answers — without spammy phrasing.
3. Source genuinely city-specific facts (real roads/corridors, courts, hospitals) — currently NEEDS_SOURCE / walled to Fable+Raphy — for natural per-city differentiation.
4. Shift weight off the shared FAQ block toward a longer, more-differentiated body.

## Step 7 — Verification
| Check | Result |
|-------|--------|
| `audit:damage` | 0 stubbed, 0 head-broken; 25 KEEP_WT |
| placeholder scan | **0** files with `[NEEDS ENHANCEMENT]` |
| rendered city quality audit (`audit:quality`) | placeholders 0, renderedBelowFloor **0**, PASS=false (corpus clones remain — expected) |
| `audit:top20` | 453/744 sourced top-20 cities exist as routes; 291 missing; 1,163 extra. Informational. |
| lint (changed files) | 0 errors (pre-existing `p`-unused / import warnings only) |
| `tsc --noEmit` | **0 errors** |
| `npm run build` | **passes**, 1,616 city routes prerender |

### Before / after duplicate counts
- Old gate (all stored fields): 884,762 pairs >30%, 1,575 docs with a dup partner.
- Model-aware gate (rendered-only): 868,649 pairs >30%, 1,575 docs with a dup partner — **dead-field similarity (885,109 pairs) is now reported separately and excluded from the gate**.
- Corpus PASS remains **false** by design: ~1,390 untouched template clones still fail. PR4 fixed the gate's correctness and 6 pilots; it did not (and could not, see §6) mass-fix the clones.

---

## Remaining SEO / legal risks
- **~1,390 city clones still publish near-duplicate rendered content.** Highest SEO risk on the site; unresolved until the engine can differentiate at scale (§6) or pages are sourced/hand-written.
- City route still renders **two hardcoded generic "Why Hire Local" bullets** ("knowledge of [State] trucking laws", "familiarity with local courts") for every city — borderline unsourced local-authority claims. Consider gating or softening.
- `defaultFaqs` fallback (route lines ~175–196) asserts generic SOL/liability language for cities without a content file. General, not state-specific, but worth a compliance pass.
- No state-law content was written or modified this pass. Any state-specific SOL / comparative-negligence / damage-cap copy remains **NEEDS_SOURCE → Fable + Raphy**.

## Exact next PR sequence
1. **PR5 — Engine redesign (FABLE).** Lift the differentiation engine so arbitrary hub pairs clear <30% rendered (larger pools + per-sentence unmasked-fact injection). Gate: `batch-preview.ts` PASS at size 50, per-state cap 4. *Blocks the batch.*
2. **PR6 — Sourced local facts (FABLE + Raphy).** Stand up verified roads/corridors, courts, hospitals, and state SOL data; wire into the engine as natural per-city differentiation and re-enable `dangerousRoads`.
3. **PR7 — Gated batch rollout.** With PR5/PR6 landed, run `batch-preview.ts --emit`, write in 50-page tranches, each gated by the model-aware audit (rendered <30% all-pairs + vs corpus, no meta dupes, no placeholders, no fake roads).
4. **PR8 — Route copy compliance.** Gate/soften the hardcoded "Why Hire Local" bullets and `defaultFaqs` for unsourced local-authority claims.
