# Top-20 City Coverage Audit

Date: 2026-06-24
Source of truth: `scripts/reports/top20-coverage.json` and `scripts/data/top-20-cities.json`
Regenerate: `npx tsx scripts/quality/build-top20.ts`

## The rule being audited

"All 50 states and the **top 20 largest cities in every state**." That is 50 × 20 = **1,000** required city pages, decided by population — not by which cities happen to appear in NHTSA FARS crash data.

## The one honest constraint up front

The only population source already in this repo is `scripts/data/city-populations.json` (it declares its source as "US Census Bureau 2022 Population Estimates"). That file is the only ground I'll stand on. It has all 50 states, but **only 22 of them list 20+ cities**. For the other 28, the file simply doesn't contain enough cities to name a real top-20.

I did **not** fill those gaps from memory. Naming a city's rank or population I can't source is exactly the fabrication the rules forbid. So states under 20 are marked `NEEDS_SOURCING`, not padded.

## Headline numbers (verified)

| Metric | Value |
|---|---|
| Ideal required cities (50 × 20) | **1,000** |
| Required cities the sourced dataset can actually name | **744** |
| → already exist as a route | **453** |
| → **missing** (no route yet) | **291** |
| Existing routes that fall **outside** any top-20 (extra FARS towns) | **1,163** |
| States with 20+ cities in the dataset (`COMPLETE`) | **22** |
| States with fewer than 20 (`NEEDS_SOURCING`) | **28** |
| Additional cities needing Census sourcing to reach 1,000 | **256** |

## What this means

The site has 1,616 city routes, but they are **not the top-20-per-state set**. Three separate problems:

1. **291 top-20 cities have no page.** These are real, large cities (sourced and ranked) that the site should cover and doesn't.
2. **1,163 routes are off-target.** They're small FARS-data towns (e.g. the `bryant`/`benton` Arkansas pair, `haddam` CT) that exist because a crash was recorded there, not because they're significant cities. Many are the worst duplication offenders (see quality report). These aren't necessarily wrong to keep, but they are not the priority and they dilute the link graph.
3. **256 top-20 slots can't even be defined yet** because the population file is short for 28 states.

So "top 20 in every state" is currently **~45% covered** by the namable set (453 / 1,000), and the namable set itself is capped at 744 until the dataset is filled.

## The 28 states needing population sourcing

To define a real top-20 for these, the `city-populations.json` file needs more cities (from Census place data — a static download, not a runtime fetch). Until then, these states get `min(20, available)`.

| State | Have | Need | | State | Have | Need |
|---|---|---|---|---|---|---|
| minnesota | 19 | 1 | | maine | 8 | 12 |
| connecticut | 16 | 4 | | north-dakota | 8 | 12 |
| new-mexico | 16 | 4 | | rhode-island | 8 | 12 |
| south-carolina | 16 | 4 | | south-dakota | 8 | 12 |
| colorado | 15 | 5 | | hawaii | 7 | 13 |
| iowa | 15 | 5 | | nebraska | 6 | 14 |
| kentucky | 15 | 5 | | alaska | 5 | 15 |
| louisiana | 15 | 5 | | nevada | 5 | 15 |
| maryland | 15 | 5 | | montana | 4 | 16 |
| alabama | 14 | 6 | | delaware | 3 | 17 |
| kansas | 14 | 6 | | west-virginia | 10 | 10 |
| arkansas | 12 | 8 | | wyoming | 10 | 10 |
| mississippi | 12 | 8 | | new-hampshire | 11 | 9 |
| vermont | 9 | 11 | | idaho | 8 | 12 |

(Full machine-readable list in `scripts/reports/top20-coverage.json` → `needsSourcingDetail`. Small states like Delaware, Wyoming, the Dakotas, Vermont genuinely may not *have* 20 incorporated places worth a page — "top 20 where the state supports it" is the realistic target for those.)

## Recommended approach (no fabrication, no network without your OK)

1. **Treat `scripts/data/top-20-cities.json` as the canonical required-city universe** going forward — the city route generator and sitemap should be driven by an explicit, ranked, sourced list, not by whatever FARS recorded.
2. **Fill the 28-state gap from a static Census place file** (one download, committed as data, reviewable) — this needs your OK for the network fetch, or you can drop the file in and I'll wire it.
3. **Decide the 1,163 extra routes:** keep (they're real places with real FARS data) or prune to reduce duplication surface. My lean: keep the ones that clear the duplication gate after differentiation, retire the pure-clone thin ones. That's a quality call, handled in the repair plan.
4. **Generate the 291 missing top-20 pages last** — only through the differentiation system, never the find/replace template that produced the current duplication.

## Decisions for you

- **Network OK** to pull a static Census place dataset to fill the 28 states? (Or you supply the file.)
- **Extra routes:** keep all 1,163, or prune the pure-clone thin ones?
- **Small states:** accept "top N where N < 20" for genuinely small states (Delaware, the Dakotas, Wyoming, Vermont), or force a hard 20 with smaller towns?
