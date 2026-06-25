# PR5 Packet — Hub Differentiation Engine Redesign + Gated 50-Page Batch

Branch: `repair/pr1-restore-pr2-gate` (local, unpushed). Base for PR5: `108a966` (end of PR4).
Commits: `229173e` (engine v2 + gated selection), `8995233` (50-page gated batch).
Build: `npm run build` passes (exit 0, 1,616 city routes prerender). tsc 0 errors. lint 0 errors.
**Outcome: SUCCESS — engine redesigned, 50-page batch preview PASSES with margin, batch WRITTEN and gate-verified.**

---

## Mission result vs success bar

| Success bar | Result |
|---|---|
| 50-page preview PASS, no rendered pair >30% | **PASS** — worst 26.9% (margin-selected <27%) |
| 80-page stress near-pass or explained | **PASS** — worst 27.0% |
| 6 pilots still pass | **PASS** — 9–17% max partner |
| Rendered words ≥500 | **PASS** — min 570 |
| No preserved enhanced dirty pages touched | **PASS** — 0 overlap with the 21 preserved / 6 pilots / 4 controls |
| No fake roads/courts/hospitals/SOL/brands | **PASS** — `dangerousRoads: []`, no SOL numbers, no named courts/hospitals |
| `audit:quality` remains model-aware | **PASS** — unchanged 0.30 rendered-only gate |
| lint / type / build | **PASS** |

## What ran in parallel
- **Workstream D (read-only design agent, background):** verified-local-data source schema →
  `docs/PR5-LOCAL-DATA-SCHEMA.md`. Surfaced that `correct-legal-data.json` already holds SOL but
  lacks per-field provenance (the reason SOL stays `NEEDS_SOURCE`).
- **Coordinator (this session):** Workstream A (empirical collision decomposition), B/C (engine +
  FAQ redesign), E (stress harness). A/B/C/E were interdependent edits to the same engine files, so
  they ran serially under measurement rather than as separate write-agents (more reliable than
  re-reading files via subagents).

## Engine changes (`229173e`)

**Workstream A — collision decomposition (`scripts/quality/collision-decomp.ts`, new).**
Decomposed the PR4 worst pair (cromwell↔la-grange, 53%): **74% of shared shingles were FAQ**,
14% trucking, 9% hero. Root cause confirmed: the gate masks city/state/numbers, so any slot or FAQ
answer whose only variable is a masked token normalizes to a **byte-identical** 5-word-shingle
string. Two false starts were measured and reverted (self-corrected):
1. Fixed 6-FAQ skeleton → 51–61% (forced *sameness*).
2. Forcing two "high-signal" FAQs into every hub (a PR4 idea) → 47% (same failure).

**Workstreams B/C — entropy redesign (`faq.ts`, `modules.ts`).**
- **FAQs:** replaced the flat pool (one phrasing/answer) with **12 hub topics × 3 genuinely
  different phrasings** (different sentences, same true points — not token-swaps). Topics 0–5 weave
  HIGH-CARDINALITY unmasked facts (county, nearby-city names, region, dominant mechanism) that
  survive normalization; 6–11 are general-legal, carried by phrasing entropy. `buildHubFaqs`
  disperse-selects a local-leaning subset + a per-seed variant (~C(12,6)·3⁶ ≈ 674k combinations).
- **Hero + trucking:** `h-fact`, `h-close`, and `t-mix` slots (previously masked name/number-only →
  identical on collision) now weave county/nearby/region into every option.
- **No spin, nothing unsourced:** no SOL numbers, no court/hospital/road names, no per-city legal
  claims. Local facts are county (FARS `countyName`, VERIFIED) and nearby cities (FARS coords).

## Before / after worst pairs

| Metric | PR4 (start of PR5) | PR5 engine v2 |
|---|---|---|
| 80-hub pairs >30% | **8.2%** (260/3160) | **1.8%** (57/3160) |
| 80-hub distribution | — | <20%: 90% · 20–25%: 5.7% · 25–30%: 2.7% · >30%: 1.8% |
| PR4 worst pair cromwell↔la-grange | 53.1% | **12.0%** |
| 6 pilots max-partner | 18–25% | **9–17.7%** |
| Pilot rendered words | 543–588 | 540–595 |

The residual 1.8% is the **birthday-paradox tail**: across 1,225 pairs in a 50-city set, the
unluckiest pair shares enough topics+variants to exceed 30%. Hand-written prose pools *reduce* but
cannot *eliminate* this — a 1–2 word token breaks only ~4 of ~60 shingles in an answer.

## The gating breakthrough — conflict-aware greedy selection (`batch-preview.ts`)

Instead of writing arbitrary clones (where the tail bites), the gate now **selects a mutually-safe
set**: a clone is admitted only if its hub stays under `0.30 − margin` (default margin 0.03 → admit
<27%) vs **every already-chosen hub AND the full corpus of pages not being rewritten**. The written
batch is therefore conflict-free by construction. `--greedy=0` disables it to expose the raw rate.

## 50 / 80 / stress results (all greedy, margin 0.03)

| Stress set | kept | worst batch↔batch | worst batch↔corpus | verdict |
|---|---|---|---|---|
| 50-page (per-state cap 4) | 50/50 | 26.9% | 26.8% | **PASS** |
| 80-page (cap 6) | 80/80 | 27.0% | 26.9% | **PASS** |
| same-state-dense (cap 8) | 50/50 | 27.0% | 26.9% | **PASS** |
| same-region-dense (cap 5) | 40/40 | 27.0% | 27.0% | **PASS** |
| raw, greedy OFF (reference) | 50 | 44.2% | 46.1% | FAIL (shows what selection avoids) |

**Scaling limit (honest):** the conflict-free pool thins as the batch grows — finding 80 safe pages
considered ~660 candidates (rejected ~580); finding 40 under a tight per-state cap considered ~1,377
(rejected ~1,337). The engine comfortably supports **gated batches up to ~80 pages per pass**.
Rewriting *all* ~1,340 remaining clones is NOT achievable with prose alone — it needs either much
larger divergent pools or the sourced per-city data designed in `PR5-LOCAL-DATA-SCHEMA.md`.

## Pages written — YES, 50 (`8995233`)

50 currently-cloned city pages rewritten as differentiated hubs from the margin-selected list
(`scripts/data/pr5-batch-targets.json`), via `scripts/quality/write-batch.ts` (overwrites only
existing clone files, hard protected-set guard, never creates routes). **Verified after write:**
- pilot-probe over all 50: **0 have a >30% rendered partner** across the full corpus.
- `audit:quality`: `renderedDocsWithDupPartner` 1575 → **1525 (−50)**; `renderedPairsOver30pct`
  868,649 → 810,950; `renderedBelowFloor` 0; placeholders 0.
- `npm run build` passes; lint/tsc clean.

## Files changed (PR5)
- `src/lib/content-engine/faq.ts` — 12-topic × 3-variant local-data hub FAQ system.
- `src/lib/content-engine/modules.ts` — hero/trucking slot entropy (county/nearby/region).
- `src/lib/content-engine/{compose,nearby}.ts` — unchanged this PR (touched in PR4).
- `scripts/quality/collision-decomp.ts` (new) — per-component shared-shingle diagnostic.
- `scripts/quality/batch-preview.ts` — conflict-aware greedy selection + margin.
- `scripts/quality/write-batch.ts` (new) — gated batch writer.
- `scripts/data/pr5-batch-targets.json` (new) — the 50 validated targets.
- 6 pilots regenerated; 50 batch city files written.
- `docs/PR5-LOCAL-DATA-SCHEMA.md` (new, Workstream D), `docs/PR5-PACKET.md` (this).

## Remaining dirty files (working tree)
Only the **21 preserved** files from PR4 remain uncommitted (19 enhanced city pages + 2 progress
JSONs) — untouched, exactly as required.

## Risks
- **~1,340 clones still publish near-duplicate content.** PR5 fixed 50 + the engine; the rest await
  more gated tranches (≤~80/pass) or the sourced-data path. Highest remaining SEO risk.
- **`audit:damage` flags the 50 hubs as REVIEW** via its stale 2,000-word floor (non-gating, exit 0).
  The model-aware 500-word hub floor is authoritative; consider teaching damage-scan the hub model.
- **Greedy selection is order-dependent** (deterministic, but a different iteration order yields a
  different safe-50). Acceptable — every admitted set is gate-valid; this is selection, not content.
- **Same hardcoded "Why Hire Local" bullets / `defaultFaqs`** in the city route remain (PR4 risk,
  unchanged) — generic unsourced local-authority phrasing worth a compliance pass.
- No state-law content written; SOL/roads/courts/hospitals remain `NEEDS_SOURCE`.

## Next PR plan
1. **PR6 — more gated tranches.** Run `batch-preview --emit` + `write-batch` in ≤80-page passes over
   the remaining clones until the conflict-free pool is exhausted; gate each with `audit:quality`.
2. **PR7 — sourced local data (FABLE + Raphy).** Build the `PR5-LOCAL-DATA-SCHEMA.md` files
   (roads/corridors, courts, hospitals, per-state SOL provenance) so the engine renders genuinely
   per-city facts — the only path to differentiate ALL clones and to re-enable `dangerousRoads`.
3. **PR8 — route copy compliance.** Gate/soften the hardcoded "Why Hire Local" bullets and
   `defaultFaqs` for unsourced local-authority claims; teach `audit:damage` the hub word floor.

## FABLE note
The prose-only ceiling (1.8% irreducible tail; cannot guarantee zero >30% across *all* clones) is a
load-bearing finding. The robust path past it is sourced per-city data (PR7), which touches
state-law (SOL) and local-fact verification — that belongs in a Fable window with Raphy. PR5 itself
stayed within verified-general content and shipped a safe, gated, reversible result.
