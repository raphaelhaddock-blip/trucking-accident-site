# PR5 — Image Expansion Plan (PLAN ONLY — no spend yet)

Bounded plan to extend the Flux Pro brand-image set beyond the PR4B proof of 6. **Nothing generated here.** Awaiting an explicit go before any batch run. Also gated by the Growth OS taxonomy/ontology requirement ([GROWTH-OS-TAXONOMY-ONTOLOGY.md](GROWTH-OS-TAXONOMY-ONTOLOGY.md)) for *content* — images are brand/UI infrastructure, so they may proceed once approved, but not as content expansion.

## Already done (PR4B — do NOT regenerate)
`hero-interstate` · `network-corridor` · `evidence-records` · `state-texas` · `city-texas-houston` · `accident-header-jackknife-accidents`

## How the fallback changes the math
Because `hero-interstate` already exists as the global fallback, **every page already has a photo hero today.** Specific per-page images are an *upgrade*, not a fix. So we generate by value, and we do **not** need an image for all 1,613 cities — a city with no image cleanly falls back to its state image, then to the global hero.

## Tiers, counts, render targets, cost (≈$0.05/image, Flux Pro v1.1)

| Tier | Set | Count | Renders at | Est. cost |
|------|-----|-------|-----------|-----------|
| P2 | Accident-type headers (19 remaining) | 19 | `/accidents/{slug}` hero + OG | ~$0.95 |
| P3a | Priority states (homepage 10, minus Texas) | 9 | `/states/{slug}` hero + OG (+ fallback for that state's cities) | ~$0.45 |
| P3b | Remaining states | 40 | same | ~$2.00 |
| P4 | Top city hubs (verified-existing) | ~10 | `/states/{state}/{city}` hero + OG | ~$0.50 |
| — | **Bounded total** | **~78** | — | **~$4.00** |

Full per-city coverage (1,613) ≈ **$80** and is **not recommended** — low marginal value over the state/global fallback. Excluded by design.

### P2 — accident-type slugs (19)
`rollover-accidents · underride-accidents · rear-end-collisions · head-on-collisions · t-bone-accidents · wide-turn-accidents · blind-spot-accidents · sideswipe-accidents · override-accidents · brake-failure · tire-blowout · driver-fatigue · distracted-driving · speeding-accidents · cargo-spill-accidents · hazmat-accidents · drunk-driving · runaway-truck · improper-maintenance`
→ prefix each with `accident-header-`. Per-slug scenes already defined in `scripts/generate-brand-images.ts` (`ACCIDENT_SCENE`).

### P3a — priority states (9)
`california · florida · georgia · pennsylvania · ohio · illinois · north-carolina · tennessee · indiana` → prefix `state-`.
### P3b — remaining 40 states
All other `getAvailableStateSlugs()` → `state-{slug}`.

### P4 — city hubs (verified to exist in `cities-content/`)
`city-texas-dallas · city-texas-san-antonio · city-illinois-chicago · city-arizona-phoenix · city-california-los-angeles · city-florida-miami · city-georgia-atlanta · city-pennsylvania-philadelphia · city-new-york-new-york-city · city-ohio-columbus`

## Run commands (when approved — recommend a checkpoint after P2)
```
npm run images:generate -- --only accident-header-rollover-accidents,accident-header-underride-accidents, …   # P2
npm run build            # wire + review quality at scale BEFORE P3/P4
```
Then P3a → P3b → P4 the same way, `npm run build` after each tier.

## No duplicate / low-value prompts
- The script builds exactly one prompt per basename; the 6 done are skipped (different slugs).
- No city beyond the hub list — fallbacks cover the rest.
- Each slug maps to exactly one render target.

## Compliance (unchanged, enforced in every prompt)
No people, faces, victims, crash wreckage, courtrooms, gavels, readable signs, license plates, brand logos, documents/personal data, or stock-photo legal clichés. `enable_safety_checker: true`. Each generated image is eyeballed before it ships.

## STOP
Plan only. **No images generated. Awaiting go.** On approval I recommend: run **P2 first → build → review quality at scale → report → then P3/P4.**
