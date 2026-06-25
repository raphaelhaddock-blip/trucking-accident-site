# Differentiation System (PR3 design)

Date: 2026-06-24 · Branch `repair/pr1-restore-pr2-gate`
Status: design + pilot. Not wired for scale until the pilot passes the 30% gate and the scaling decision is reviewed.

## The problem this has to solve

The duplication gate fails because ~1,600 city pages were built from one find/replace template. To pass (no page pair >30% similar after name/number masking), each page's prose has to be genuinely different — not fact-swapped. The catch: you can only differentiate honestly with inputs you actually have. So the first job is an honest inventory of what's real.

## Honest data inventory (what we can build on)

| Signal | Real? | Source | Use |
|---|---|---|---|
| City / state / slug identity | ✅ | content files | spine |
| County name | ✅ | `city-accident-data.json` `.countyName` (e.g. Houston→Harris) | local framing, court venue (name only) |
| Lat / lng | ✅ | `city-accident-data.json` `.lat/.lng` | **distance-based nearby cities** |
| Population + in-state rank | ✅ | `city-populations.json` (Census 2022) | size tier, rank framing |
| Top-20 status | ✅ | `scripts/data/top-20-cities.json` (PR2) | priority + framing |
| FARS truck fatalities / crashes / year | ✅ | `city-accident-data.json` | real stat, severity tier |
| Region + accident-pattern mix | ◑ sourced-ish | `regional-accident-patterns.json` (12 regions, e.g. Northeast rear-end 32% / jackknife 18% + localFactor) | **mechanism angle**, climate framing |
| FAQ pool | ✅ structure | `faq-variations.json` (60 Qs, 10 categories) | deterministic FAQ subset |
| Statute of limitations / negligence rule | ⚠️ **UNVERIFIED** | `correct-legal-data.json` — same file the audit flagged wrong for FL/ME/WV | **NEEDS_SOURCE / Fable** — never asserted as fact in generated prose |
| Dangerous roads / corridors | ⚠️ **UNVERIFIED** | content files & FARS file, but demonstrably wrong (Houston lists I-35; Bryant AR lists I-55) | **NEEDS_SOURCE** — not stated unless verified |
| Hospitals / court addresses / local carriers | ❌ absent | — | **NEEDS_SOURCE** — never invented |

**The hard truth:** there are about **seven** trustworthy per-city signals (identity, county, coords, population/rank, top-20, FARS, region-pattern). Everything a local lawyer page usually leans on — named highways with mile markers, the trauma center, the courthouse address, local carriers — is either wrong in the current data or missing. We differentiate on the seven, write honest general content for the rest, and mark the gaps `NEEDS_SOURCE`. We do not paper over the gaps with invented specifics. That's what produced the duplication and the false claims in the first place.

## How a page becomes unique (the axes)

Each axis is driven by a real signal, so variation tracks reality instead of a random shuffle:

1. **Size tier** (from population rank): `metro` / `mid` / `small` / `farsExtra`. Drives structure, depth, and which questions a reader in that place actually has.
2. **Severity tier** (from FARS counts): `none` / `low` / `elevated` / `high`. A city with 26 truck deaths reads differently from one with 0 — and we state the real number and what it does/doesn't mean.
3. **Mechanism angle** (from region pattern): the page leads with the collision type its region over-indexes on (Northeast → rear-end/jackknife; Plains → rollover; etc.), using the sourced regional localFactor.
4. **Geographic neighbors** (from coords): real nearest in-state cities, computed by distance, for internal links — not a hardcoded list.
5. **Module variant** (hash of profile): evidence, liability, and FMCSA each have a pool of freshly written, genuinely different explanations; a city's hash picks a combination, and neighbors are nudged off the same pick.
6. **FAQ subset** (hash + category weights): a different mix of the 60 questions per city, answered with that city's real numbers.
7. **Meta/title/H1** (template pool × real numbers): varied SEO surface, no two identical.

## Provenance discipline (non-negotiable)

Every generated fact carries a provenance tag. Three states:
- `VERIFIED` — from a trusted dataset (FARS, Census, county name, coords).
- `GENERAL` — true everywhere, not city-specific (federal FMCSA rules, what evidence matters). Allowed, written fresh, varied.
- `NEEDS_SOURCE` — would require local sourcing we don't have (roads, hospitals, courts, carriers, exact SOL). **Rendered as an honest gap or omitted — never asserted.**

A page may never upgrade a `NEEDS_SOURCE` fact to a stated claim. State-law specifics stay `NEEDS_SOURCE` and route to the Fable + Raphy legal track.

## Components (built in `src/lib/content-engine/`)

- `profile.ts` — `buildCityProfile(state, city)` → the real-signal bundle (identity, county, coords, pop/rank, top-20, FARS, region, tiers, provenance).
- `nearby.ts` — distance-based in-state neighbors from coords.
- `modules/{evidence,liability,fmcsa}.ts` — fresh variant pools, hash-selected.
- `faq.ts` — deterministic FAQ subset from `faq-variations.json`, filled with real numbers.
- `meta.ts` — title/description/H1 builder (varied templates × real data).
- `links.ts` — nearby + top-city + accident-mechanism internal links.
- `compose.ts` — assembles a full `CityContent` from the above (so existing route + duplicate-audit work unchanged).

Mechanism pages stay at `/accidents/[slug]`. No brand pages.

## Honest limits + the scaling question

This system can make **distinct** pages where cities have distinct real data — big metros, different regions, different FARS profiles. For **near-identical small towns** (two same-region towns, both 1 FARS death, similar population, no known unique local detail), sub-30% prose without inventing facts depends entirely on the size of the module-variant pools. Pools big enough for 1,600 cities are real work, and even then two truly-similar towns may sit at a borderline score. The pilot exists to measure exactly where that line falls.

> **FABLE MOMENT: load-bearing architecture + safety.** This system is what ~1,600 pages and the state-law content will sit on. The *design* and the *scale decision* (and all SOL/negligence wording) deserve a Fable review before the 50-page batches run. The pilot build and gate can proceed on Opus; the verdict to scale should not.

## Pilot success criteria (Step 6)

Each pilot page must show: 0 placeholders, no broken metadata, no duplicate H1/title/meta, **<30% similarity to every other pilot**, and **<30% to the existing corpus** — or an explained, unavoidable borderline. If scores stay above 30%, stop and diagnose; do not scale.
