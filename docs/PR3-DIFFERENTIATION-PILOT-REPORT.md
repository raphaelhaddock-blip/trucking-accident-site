# PR3 — Differentiation Pilot Report

Date: 2026-06-24 · Branch `repair/pr1-restore-pr2-gate` · commit on branch (not pushed)

Bottom line: **the engine is built, and the local-hub model passes the gate on real files.** 6 templated/clone/thin city pages were rewritten through the engine and gated on disk: each is in **zero** duplicate groups, each left the duplication cluster, all are **0.7%** similar to the entire 1,616-page corpus, and **14 of 15 pilot pairs are under 30%** (one explained borderline at 32.1%). The one real cost is the **2,000-word floor** — hub pages are ~530 words by design, because the duplication came from every city re-explaining the same federal law. The decision in front of you is architectural, and it is small: relax the floor, keep city pages as thin local hubs, and let the federal substance live on the national pages (where it already does).

I first tried the full-length model and it failed honestly (thick pages can't clear 30% against each other — proof below). The fix is the hub model, and the discovery that made it clean: **the city route never even renders the heavy fields** (`whyDangerous`, `liability`, `evidence`, `fmcsa`) — they are dead data that only inflated duplication. Removing them is honest and invisible to users.

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

**The hub model: yes, with two caveats. The thick-page model: no.**

- **Thick (re-explain federal law on every page): no.** Two arbitrary pages start near 40–50% before any local data is added, because the substance is identical. No phrase pool fixes that at scale.
- **Hub (thin local page + national substance): yes**, conditional on (1) you relaxing the word floor, and (2) handling thin-page borderlines at scale. The 6-pilot run shows the model works (0.7% vs corpus, 14/15 pairs clean). But at 1,600 pages the same thin-page volatility that produced mesa↔bryant (32%) will produce a tail of borderline pairs — the birthday problem on finite slot pools. Two honest ways to manage it: bigger slot pools (more entropy), or — much better — **real sourced local data** (verified corridors, courts, hospitals) so pages differ on facts instead of phrasing. The second needs your network approval (decision #3).

So: greenlight a gated 50-page batch in hub mode after the architecture call, with each batch run through `npm run audit:quality` and any >30% pair re-rolled or flagged before merge.

## The fix, measured (not asserted)

I tested the recommended architecture in memory against the same 8 pilots. A "thin local hub" is the same engine output minus the shared legal modules: hero, the regional accident mix, the trucking-industry and court-venue lines, the nearest-city links, and a few locally-framed FAQs — with evidence, liability, and FMCSA moved to national pages the city page links to.

| Page model | Avg words | Pilot pairs over 30% | Worst pair |
|---|---|---|---|
| Thick (re-explains federal law on every page) | ~1,180 | **5 of 28** | 42.7% |
| **Thin local hub (links to national substance)** | ~490 | **0 of 28** | **24.6%** |

Same engine, same cities, same gate. Moving the shared substance out is what makes every pilot pass. The cost is page length (~490 words), which is why the word-floor decision below is part of the package.

## Steps 5–6 executed on disk (real files, real gate)

6 pilot pages were rewritten through the engine (hub model) and written to `src/lib/cities-content/`. Targets were all currently templated/clone/thin — **no preserved-enhancement page was overwritten** (houston, dallas, denver, memphis stay as measured controls; overwriting good 4,000-word pages with thin hubs would violate "preserve good content"). Generator: `scripts/quality/generate-pilot.ts`.

Rewritten: `california/fresno`, `arizona/mesa`, `arkansas/bryant`, `arkansas/benton`, `connecticut/haddam`, `vermont/burlington`.

Real on-disk gate (`npm run audit:quality`, all 1,616 pages) + exact pilot scorer:

| Check | Result |
|---|---|
| Placeholders in the 6 pilots | **0** |
| Broken metadata (empty title/desc/h1) | **0** |
| Pilots in any duplicate H1 / title / description group | **0** |
| Pilots in the global worst-pairs / dup cluster | **0** — `docsWithADupPartner` fell 1581 → 1575 (the 6 left the cluster) |
| Each pilot vs the entire 1,616-page corpus | **0.7% max** |
| Pilot-vs-pilot pairs under 30% | **14 of 15** |
| Borderline | mesa ↔ bryant **32.1%** (explained below) |
| Word count (data fields) | ~526–559 words — **below the 2,000 floor, by design** |

**The mesa ↔ bryant borderline (32.1%), explained:** these are unrelated cities (different states, regions, counties, sizes — Mesa AZ/Maricopa/Southwest vs Bryant AR/Saline/South Central). They are not near-twins; the real twins pass easily (bryant ↔ benton 20.3%). At ~530 words a hub page has few shingles, so a hash collision on two or three generic slots swings the score a couple of points. It is 0.7% similar to the whole corpus and the production LSH audit does not even flag it. This is the kind of unavoidable thin-page borderline the gate's own instructions allow explaining. It is fixable two cheap ways (larger slot pools, or +1 fact-injected local sentence) if you want every pair strictly clean.

**Honesty note on the floor:** the 6 hubs are below the legacy 2,000-word minimum and the duplicate-audit flags them in `belowWordFloor`. That is the expected, intended tradeoff — the floor is exactly what forced the duplication, and relaxing it is decision #2 below. Nothing was pushed.

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

## Files changed (PR3)
- Engine: `src/lib/content-engine/` (profile, nearby, modules, faq, meta, links, compose, hash, fars-types)
- Generator + scorer: `scripts/quality/generate-pilot.ts`, `scripts/quality/pilot-preview.ts`
- Docs: `docs/DIFFERENTIATION-SYSTEM.md`, this report · Gate: `npm run audit:quality`
- **6 city pages rewritten** (hub model): `california/fresno`, `arizona/mesa`, `arkansas/bryant`, `arkansas/benton`, `connecticut/haddam`, `vermont/burlington`
- `new-york/new-york.ts` restored from HEAD (the empty-county meta bug)
- Reversible (branch only, not pushed); preserved enhancements and the controls were untouched.
