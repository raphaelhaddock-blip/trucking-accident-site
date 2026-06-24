# Content Quality Audit & Repair Plan

Date: 2026-06-24
Gate script: `scripts/quality/duplicate-audit.ts` → `scripts/reports/quality-audit.json`
Run: `npx tsx scripts/quality/duplicate-audit.ts` (exits non-zero when the gate fails — wire it into CI)

This replaces the stale Jan-10 audit report. Every number below was produced this session by the deterministic gate, then spot-verified by hand.

## How the gate works (so you can trust the numbers)

It does not run the site (the repo forbids `npm run dev`). It imports the `CityContent` data modules directly and measures the fields that are *supposed* to be locally unique — hero, why-dangerous, liability, evidence, trucking-industry, legal, FAQs, road and accident blurbs. It **excludes** the FMCSA federal text (legitimately the same everywhere) and never sees nav/footer/schema/CTA (those live in the page template, not the data).

Before comparing, it **masks the city name, state name, slugs, and all numbers**. So a page that's just a find/replace of another city scores ~100%. That's the "swap test" from `DIFFERENTIATION_RULES.md`, made mechanical.

Method: 5-word shingles → 64-hash MinHash → LSH banding to find candidate pairs → exact Jaccard. Deterministic (no random seeds), ~36s over 1,613 pages. Threshold: **any pair > 30% similar fails.**

## Findings (verified)

| Check | Result |
|---|---|
| City routes scanned | 1,616 (1,613 with a content file, 3 FARS-only) |
| Pages still showing `[NEEDS ENHANCEMENT]` | **30** |
| Pages below the 2,000-word floor | **1,401** |
| Pages with a >30%-duplicate partner | **1,581 of 1,613 (98%)** |
| Total page pairs over 30% (after normalization) | **853,311** |
| Duplicate H1 groups | **122** |
| Duplicate meta-title groups | **35** |
| Duplicate meta-description groups | **6** |
| Pages missing local signals (no city mention / road / FARS source) | 0 |
| Identical FMCSA-text groups | 82 (largest shared by 30 cities — informational, federal text) |
| **Gate verdict** | **FAIL** |

## Proof it's real, not a tool artifact

Two flagged 100% pairs, read by hand:

- **`arkansas/bryant` vs `arkansas/benton`** — heroText and whyDangerous are byte-identical except the city name. Both 2,145 words.
- **`connecticut/haddam` vs `new-jersey/north-brunswick`** — different states, yet the same skeleton: "manufacturing and agriculture industries generate substantial truck traffic," "Winter ice and snow creates additional hazards during December and January," only city/state/highway/fatality-count swapped.

Two things this proves:
1. **Word count is not quality.** Both Arkansas pages clear the 2,000-word floor and are still spun garbage. The duplication gate, not the word count, is the real signal.
2. **The template invents local facts.** Calling Haddam, CT — a town of a few thousand — "a significant commercial trucking corridor" with "manufacturing and agriculture industries" is unsourced and probably false. The same sentence on a different state's page confirms it's filler, not research. This is the doorway-page pattern that earns a Google penalty, and it trips the "no fake local facts" rule.

## What the gate does NOT catch (scope honesty)

- It can't tell whether a *sourced* fact is *true* — only whether prose is duplicated. Factual legal accuracy (state SOL, negligence rule) is a separate track (`legal-accuracy` agent flagged Florida, Maine, West Virginia in the old run; re-verify and source).
- 30% on normalized shingles is strict. Genuinely different legal pages still share trucking/legal vocabulary and may land in the 30–45% band. Treat 30% as the target and read the *distribution* in `quality-audit.json` once real differentiated samples exist — calibrate from data, don't loosen the gate to make a bad template pass.

## Repair strategy

Order matters. Stop the bleeding, build the gate, then earn the right to generate.

1. **Restore, don't regenerate, what git already has.** Per the damage report: restore the 30 stubs from HEAD, keep the 19 enhancements, commit the 2 working-tree fixes, review the 1. This removes every `[NEEDS ENHANCEMENT]` stub without writing a word of new content. Restoring is reversible and discards nothing real.
2. **Never overwrite good content with a stub.** The damage scanner enforces this in its verdicts; any future enhancement run must diff against the current file and refuse to shrink a real page into a placeholder.
3. **Regenerate only the genuinely unrecoverable.** Right now that's zero files (no `REGEN` verdicts). The two committed-broken files are already fixed in the working tree.
4. **Differentiate before you scale.** The ~1,400 templated/thin pages and the 291 missing top-20 pages must be (re)built through a differentiation system that varies real, sourced substance — FARS county data, ranked population context, named corridors *only where sourced* — not a find/replace template. No batch merges unless the batch passes the 30% gate.
5. **Keep `/accidents/[slug]`** for mechanism pages (your call #2). No root-level accident routes.
6. **No brand pages.** Skip Amazon/FedEx/UPS (your call #3). If delivery/commercial-vehicle pages are wanted, they stay generic — explain contractor/broker/carrier liability, never name or accuse a specific company, never invent a settlement.

## Proposed PR sequence

Each PR is small, independently reviewable, and gated. Nothing generates content until PR3's system exists and PR2's gate is green.

- **PR1 — Repair the tree (git only, no new prose).** Restore the approved 30; commit the 2 fixes; resolve the 1 review. Result: zero placeholder stubs, `main` stops shipping the two broken pages. *Blocked on your "restore the 30" approval.*
- **PR2 — Land the quality gate.** Commit the three `scripts/quality/` tools and `scripts/data/top-20-cities.json`; add `audit:quality` to `package.json`; wire `duplicate-audit.ts` into the audit suite so a >30% pair or any placeholder fails the check. Now regressions can't merge.
- **PR3 — Differentiation system (design + helpers, still no bulk content).** Build the per-page content helpers that compose real variance from sourced data, plus the shared section components the expansion plan lists (EvidencePreservationBlock, FMCSABlock, LiabilityPartiesBlock, FAQ/schema builders). Prove it on ~10 pilot cities that each pass the 30% gate against each other and against the existing corpus.
- **PR4 — Complete the city dataset.** Add a static Census place file to fill the 28 short states (needs your network OK or your file); regenerate `top-20-cities.json`; decide the 1,163 extra-route question (keep vs prune).
- **PR5+ — Repair content in gated batches.** Re-generate the templated/thin pages and the 291 missing top-20 pages through PR3's system, in batches of ~50, each batch required to pass the gate before merge. Track progress in a real tracker, not a reset-prone JSON.
- **Parallel legal track (Fable + you).** Re-verify and source the per-state SOL / negligence content (Florida, Maine, West Virginia first). This is published legal advice — it does not ride the content batches and does not merge on green CI alone.

## Decisions that unblock execution

1. Restore the 30 stubs? (damage report §1)
2. Network OK for the Census place file, or will you supply it? (coverage audit)
3. Extra routes — keep all 1,163 or prune the pure clones?
4. Who sources/signs off the state-law content (Fable review)?
