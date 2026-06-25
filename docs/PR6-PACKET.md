# PR6 Packet — Additional Gated Hub Tranches

Branch: `repair/pr1-restore-pr2-gate` (local, unpushed). Base for PR6: `eb8c4b9` (end of PR5).
Commits: `8237b13` (tranche 1), `aecc50f` (tranche 2), `31d5d71` (route compliance).
Build: `npm run build` passes (exit 0, 1,616 routes prerender). tsc 0 errors. lint 0 errors.
**Outcome: 2 tranches written (58 pages), safe pool exhausted at headroom margin, route compliance softened. No 3rd tranche — see §Stop.**

## Tranches attempted / written / skipped

| Tranche | Margin (admit) | Preview | Worst batch↔batch | Worst batch↔corpus | Written |
|---|---|---|---|---|---|
| 1 | 0.03 (<27%) | PASS | 27.0% | 27.0% | **42** |
| 2 | 0.02 (<28%) | PASS | 24.7% | 27.9% | **16** |
| 3 (probe) | 0.02 (<28%) | FAIL (kept 0) | — | — | **0 — skipped** |
| 3 (probe) | 0.01 (<29%) | PASS (18) | 28.0% | 28.9% | **deferred, not written** |

The conflict-aware greedy selector (PR5) was reused; a written manifest
(`scripts/data/pr-written-manifest.json`) now excludes already-written pages so tranches never
re-select. Margin is internal headroom below the **unchanged 0.30 gate** — not a gate change.

## Pages rewritten
- **58 cloned city pages** rewritten as differentiated hubs (42 + 16).
- Targets: `scripts/data/pr6-tranche1-targets.json`, `scripts/data/pr6-tranche2-targets.json`.
- Every page verified post-write: **0 of 58 have a >30% rendered partner** (pilot-probe vs full corpus); no duplicate metaDescription; `dangerousRoads: []`; 0 placeholders. No fake roads/courts/hospitals/SOL/brands.

## Before / after duplicate counts (model-aware `audit:quality`)

| Stage | `renderedDocsWithDupPartner` | `renderedPairsOver30pct` |
|---|---|---|
| PR4 end | 1,575 | 868,649 |
| PR5 end (+50) | 1,525 | 810,950 |
| PR6 tranche 1 (+42) | 1,483 | 770,240 |
| PR6 tranche 2 (+16) | **1,467** | **753,827** |

PR6 net: **1,525 → 1,467 (−58 pages with a duplicate partner).** Cumulative PR5+PR6: **1,575 → 1,467 (−108).**
`renderedBelowFloor` 0, `placeholders` 0 throughout. Gate PASS remains false by design (the ~1,467
untouched clones still fail — that is the remaining work, not a regression).

## Worst pairs before / after
- Pre-PR5 engine, raw 80-hub: 8.2% of pairs >30%, worst ~57%.
- PR6 written tranches (gated): worst pair 27.0% (t1), 27.9% (t2) — all under the 0.30 gate with headroom.

## Preserved dirty files untouched — proof
- Working tree: **21 dirty files**, all matching `cities-content|progress.json` (the 19 preserved enhancements + 2 progress JSONs). `git status --porcelain | grep -v` of that pattern returns **nothing**.
- Each tranche commit was staged from its explicit target list; a grep guard confirmed **0 preserved files staged** in every commit.
- The 6 pilots, 4 enhanced controls, and 50 PR5 pages were excluded via the protected set + manifest (verified 0 overlap before each write).

## Build / lint / audit results
- `npm run build`: **PASS** (exit 0), all 1,616 city routes prerender (covers both tranches + the route compliance edit).
- `tsc --noEmit`: **0 errors**. `eslint` on changed files: **0 errors** (pre-existing slot-signature warnings only).
- `audit:damage`: 0 stubbed, 0 head-broken; the new hubs land as **REVIEW** only via the stale 2,000-word floor (non-gating, exit 0). The model-aware 500-word hub floor is authoritative.
- `audit:quality`: placeholders 0, renderedBelowFloor 0 (figures above).

## Route compliance (Lane D, `31d5d71`)
Softened unsourced local-authority claims in the shared city route:
- "Knowledge of {state} trucking laws" → "Preserving the evidence — organizing the trucking company's records, the driver's logs, and the federal compliance trail…"
- "Familiarity with local courts / how {city} judges and juries handle cases" → "Tracking the deadlines — keeping the filing deadline and evidence-preservation steps on schedule…"
- Closing CTA "attorneys who know {city} and {state} trucking laws" → neutral "knows how to preserve the trucking company's records, meet the deadlines, and hold carriers accountable under the federal safety rules."
No state-specific legal advice; no unsourced court/judge claims. Build + lint clean.

## Remaining clone count & safe-pool status
- **~1,467 city pages still have a >30% rendered partner** (genuine near-duplicate clones).
- **Safe pool is EXHAUSTED at the headroom margin (0.02):** tranche-3 probe at margin 0.02 found **0** pages; only ~18 remain at margin 0.01, all at **28.9%** (within ~1pt of the gate). Those are intentionally **not written** — they are near-gate, marginally-differentiated pages whose quality does not justify squeezing under the threshold.
- **Root cause (confirmed from PR5):** prose-only differentiation has a ceiling. After ~108 differentiated pages "occupy" the normalized-content space, new candidates collide with an existing hub. Closing the remaining ~1,467 needs genuinely per-city DATA, not more prose.

## Risks
- **~1,467 clones remain near-duplicate** — the dominant remaining SEO risk; not solvable with the current prose engine alone.
- `audit:damage` REVIEW noise on hub pages (stale 2,000-word floor) — cosmetic, non-gating; teach damage-scan the hub floor in a later pass.
- Greedy selection is deterministic but order-dependent (a different iteration order yields a different safe set); every admitted set is gate-valid.
- No state-law content written; roads/courts/hospitals/SOL remain `NEEDS_SOURCE`.

## Next PR plan
1. **PR7 — sourced local data (FABLE + Raphy).** Build the `docs/PR5-LOCAL-DATA-SCHEMA.md` files
   (roads/corridors, courts, hospitals, per-state SOL provenance). Genuine per-city facts are the
   only path to differentiate the remaining ~1,467 clones and to re-enable `dangerousRoads`. Touches
   state-law → Fable window with Raphy.
2. **PR8 — engine pool expansion (optional, prose).** If more prose tranches are wanted before PR7,
   expand the FAQ/hero/trucking variant pools (e.g. 5–6 phrasings/topic) to enlarge the conflict-free
   pool by a few dozen more — diminishing returns, will not reach full coverage.
3. **Housekeeping:** teach `audit:damage` the hub word floor; consider folding `defaultFaqs`
   (route fallback for cityless pages) through the same compliance pass.

## FABLE note
The safe pool exhausting at ~108 pages is the load-bearing finding from PR5, now confirmed at tranche
scale: prose cannot close the remaining clones. The robust path is sourced per-city data (PR7), which
involves state-law (SOL) and local-fact verification — that belongs in a Fable window with Raphy. PR6
stayed entirely within verified-general content and shipped safe, gated, reversible tranches.
