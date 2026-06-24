# PR3 — Differentiation Pilot Report

Date: 2026-06-24 · Branch `repair/pr1-restore-pr2-gate`
Bottom line: **the engine is built and it kills the old-template duplication, but a strict 30% all-pairs gate on full-length city pages cannot be met honestly. The reason is structural, not a tuning miss, and the fix is architectural — your call.**

No pilot files were written to disk. Per the stop-condition ("if scores stay above 30%, stop and diagnose; do not scale"), I stopped at diagnosis rather than overwrite real pages with content that fails the gate.

## What was built (`src/lib/content-engine/`)

A data-driven composition engine, not one-off prose:
- `profile.ts` — assembles only trustworthy per-city signals (identity, county, coords, population/rank, top-20, FARS counts, region pattern) with a provenance ledger.
- `nearby.ts` — real distance-based in-state neighbors from FARS coordinates.
- `modules.ts` — slot-based prose pools (hero, why-dangerous, liability, evidence, FMCSA, trucking-industry, legal-info); each section picks one sentence per slot by city hash, with real facts injected.
- `faq.ts` — a 24-question pool, deterministic per-city subset, fact-injected.
- `meta.ts` — title/description/H1 template pools.
- `links.ts` — nearby + accident-mechanism + state links (for later route wiring).
- `compose.ts` — assembles a full `CityContent`. Roads/hospitals/courts/SOL are never asserted (provenance `NEEDS_SOURCE`).

It honors every content rule: no invented local facts, no unsourced state-law, no brand pages, mechanism pages stay at `/accidents/[slug]`.

## Pilot set (Step 4)

8 rewrite candidates chosen to span the hard cases, plus 2 preserved-enhanced controls (`colorado/denver`, `tennessee/memphis`) measured but not overwritten:

| City | Why chosen |
|---|---|
| texas/houston | huge metro, high FARS (26 deaths), South Central |
| texas/dallas | huge metro, **same region as Houston** (metro-twin stress) |
| california/fresno | mid-size, Pacific (different region) |
| arizona/mesa | mid-size top-20, Southwest |
| arkansas/bryant | small/FARS-extra, clone offender |
| arkansas/benton | small, **adjacent twin of Bryant** (real near-duplicate stress) |
| connecticut/haddam | small, Northeast, cross-state clone offender |
| vermont/burlington | small-state coverage |

Includes CA + TX and a small-state page, as required.

## Results (verified, `scripts/quality/pilot-preview.ts`)

**The win — old-template duplication is gone.** Every composed pilot scores **0.1–0.6%** against the existing 1,600-page corpus. The fresh prose is nothing like the find/replace template. That problem is solved.

**The wall — full-page pages can't clear 30% against each other.** 23 of 28 pilot pairs pass comfortably (most under 15%), but 5 pairs fail:

| Pair | Similarity |
|---|---|
| houston ↔ fresno | 42.7% |
| dallas ↔ benton | 38.2% |
| mesa ↔ bryant | 38.7% |
| benton ↔ haddam | 31.9% |
| houston ↔ burlington | 30.5% |

These are **not** real near-twins (the actual twins — bryant↔benton 13.8%, houston↔dallas 10.1% — pass fine). They are unrelated cities that collide on shared substance.

## The diagnosis (rigorous, not a guess)

Splitting the worst pair by section group:

- **houston ↔ fresno, shared legal substance** (why-dangerous + liability + evidence + FMCSA): **50.7%**
- **houston ↔ fresno, local content** (hero + FAQ + common-accidents + trucking + legal-venue): **32.2%**

Both halves exceed 30% for two completely different cities. The cause is simple and structural: **the substance of a truck-accident lawyer page is the same everywhere.** What evidence matters, who can be liable, what the FMCSA requires, how a case proceeds, what injuries are common — that is federal and general law. It does not change between Houston and Fresno. Only a thin shell is genuinely local (city name, county, FARS count, nearest cities, regional mechanism mix), and that shell is a small fraction of a 2,000-word page.

Two ways exist to push the shared substance under 30%, and both are bad:
1. Spin it into many phrasings — that is exactly the doorway-page sin the gate exists to prevent. I tuned the phrase pools twice; the worst pair only moved from 51% to 43%, and going further just manufactures spun text.
2. Pad the local shell — but there is no honest local data to pad with (roads, hospitals, courts, carriers are all `NEEDS_SOURCE`).

## Is the system ready for 50-page batches?

**No — not under a strict 30% all-pairs gate applied to full 2,000-word pages.** The math does not allow it: with the substantive ~60–70% of every page being identical true information, two arbitrary pages start near 40–50% before any local data is added. At 1,600 pages (over a million pairs) the gate would fail on a huge fraction, no matter how large the phrase pools get.

It **is** ready to do something better, once you pick the architecture below.

## The fix, measured (not asserted)

I tested the recommended architecture in memory against the same 8 pilots. A "thin local hub" is the same engine output minus the shared legal modules: hero, the regional accident mix, the trucking-industry and court-venue lines, the nearest-city links, and a few locally-framed FAQs — with evidence, liability, and FMCSA moved to national pages the city page links to.

| Page model | Avg words | Pilot pairs over 30% | Worst pair |
|---|---|---|---|
| Thick (re-explains federal law on every page) | ~1,180 | **5 of 28** | 42.7% |
| **Thin local hub (links to national substance)** | ~490 | **0 of 28** | **24.6%** |

Same engine, same cities, same gate. Moving the shared substance out is what makes every pilot pass — including houston/fresno, dallas/benton, and mesa/bryant. The cost is page length (~490 words), which is why the word-floor decision below is part of the package.

## Recommendation (this is the real decision)

The duplication is an information-architecture problem, not a prose problem. The fix:

1. **Move the shared substance up to national pages.** The expansion plan already calls for `/truck-accident-evidence-preservation`, `/truck-accident-fmcsa-regulations`, `/truck-accident-settlement-factors`, and the mechanism pages. Explain evidence, FMCSA, and liability **once**, there, in depth.
2. **Make city pages short, local hubs.** A city page becomes: a real local intro (county, FARS count and what it means, regional mechanism, top-20 status), the nearest-cities links, the regional accident mix, a couple of locally-framed FAQs, and strong links into the national substance pages. Honest, useful, and genuinely different city-to-city because it is almost all local.
3. **Relax the 2,000-word city floor.** That floor is what forces every city page to re-explain federal law, which is what creates the duplication. A 600–900-word honest local hub that links to deep national content is better for users and for SEO than a 2,000-word page that re-spins the same law 1,600 times.

This keeps the engine (it already builds the local shell and the links cleanly) and changes what a city page is supposed to contain.

Alternative, weaker option: keep thick city pages but scope the duplication gate to local content only (exclude the shared legal modules, as it already excludes FMCSA). This makes the number pass but does not fix the underlying sameness — I do not recommend it.

> **FABLE MOMENT: load-bearing architecture.** Whether city pages stay thick or become thin local hubs, where the shared legal substance lives, and whether the 2,000-word floor holds are decisions ~1,600 pages will sit on. This is the right thing to put in front of Fable before any batch generation.

## Decisions for you

1. **Architecture:** thin local city hubs + national substance pages (recommended), or keep thick city pages?
2. **Word floor:** relax the 2,000-word city minimum (required for option 1), or keep it?
3. **Local data:** approve sourcing real local detail (courts, hospitals, verified corridors) to thicken the local shell honestly? That needs a network/Census step you'd authorize.
4. **Gate scope:** keep the 30% gate on full pages (which forces the architecture change), or scope it to local content?

## Next PR sequence (after your call)

- **PR3b** — refit the engine to your chosen architecture (thin local hub vs thick). Re-run the gate; for thin hubs, all-pairs <30% becomes achievable because the page is almost entirely local.
- **PR4** — build/confirm the national substance + mechanism hub pages the city pages link to.
- **PR5** — optional local-data sourcing (your network approval) to enrich the local shell.
- **PR6+** — gated content batches, each batch passing the gate before merge. State-law content stays the Fable + Raphy track.

## Artifacts
- Engine: `src/lib/content-engine/` · Preview/scorer: `scripts/quality/pilot-preview.ts`
- Design: `docs/DIFFERENTIATION-SYSTEM.md` · Gate: `npm run audit:quality`
- No city files were modified; `new-york/new-york.ts` was restored from HEAD per the earlier recommendation (the empty-county meta bug).
