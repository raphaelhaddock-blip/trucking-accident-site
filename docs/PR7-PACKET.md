# PR7 Packet — Verified-Local-Data Foundation (no page generation)

Branch: `repair/pr1-restore-pr2-gate` (local, unpushed). Base for PR7: `86230c8` (end of PR6).
Commits: `17b06e8` (foundation), `e326266` (damage-scan compliance), + docs commit.
Build: `npm run build` passes (exit 0). tsc 0 errors. lint 0 errors. `npm run audit:localdata` PASS (17/17 safety proof).
**Outcome: foundation built and proven safe. NO city pages generated. NO data values invented. Engine output byte-identical. Next real unlock is source approval, not code.**

## Mission
Build the sourced-local-data foundation (schema, validators, safe wiring) to eventually
differentiate the remaining ~1,467 city clones with REAL facts. PR7 ships the rails empty.

## Step 1 — Verify (done)
- Branch `repair/pr1-restore-pr2-gate`, base `86230c8`. 21 dirty files = the 19 preserved
  enhancements + 2 progress JSONs (no other dirty). 0 placeholders.
- `audit:quality` baseline: `renderedDocsWithDupPartner` 1,467, `renderedBelowFloor` 0.
- No preserved file touched (proof below).

## Files changed / created
| File | Type | What |
|---|---|---|
| `scripts/data/city-roads.json` | new (empty) | `roads[state][city]` corridor schema, provenanced header |
| `scripts/data/city-courts.json` | new (empty) | `courts[state][city]` venue schema |
| `scripts/data/city-hospitals.json` | new (empty) | `hospitals[state][city]` trauma schema |
| `src/lib/content-engine/local-data.ts` | new | pure resolvers + file getters; VERIFIED-only gate |
| `src/lib/content-engine/profile.ts` | edit | reads the verified-data layer (all []/null today); ledger driven by it |
| `scripts/quality/local-data-validate.ts` | new | structure validator + 17-assertion render-safety proof |
| `scripts/quality/damage-scan.ts` | edit | hub-aware word floor (Step 5 compliance) |
| `package.json` | edit | `audit:localdata` script |
| `docs/PR7-SOURCE-PLAN.md` | new | official source targets (Step 2) |
| `docs/PR7-PACKET.md` | new | this |

## Schema created (Step 3)
Every leaf record carries `sourceName`, `sourceUrl`, `verifiedDate`, `confidence`
(`VERIFIED|GENERAL|NEEDS_SOURCE`). Files ship EMPTY (`roads/courts/hospitals: {}`). Types +
resolvers live in `local-data.ts`. Legal (`correct-legal-data.json`) is treated as `NEEDS_SOURCE`
until a Fable+Raphy-approved per-field provenance extension lands (plan in `PR7-SOURCE-PLAN.md`).

## Validators created (Step 3) — `npm run audit:localdata`
- **Structure:** any `VERIFIED` record missing `sourceName/sourceUrl/verifiedDate/confidence` fails;
  bad `confidence` enum fails; a road `crashStat` (danger claim) that is not fully sourced fails;
  a court whose `county` ≠ the FARS county fails; a `VERIFIED` trauma center without name+level fails.
- **Render-safety proof (17 assertions, all pass):** missing / NEEDS_SOURCE / GENERAL records and
  county mismatches resolve to `null`/`[]`; a VERIFIED corridor with an unsourced `crashStat` keeps
  its neutral name but **strips the stat** (no danger claim); SOL needs the two-key (SOL+negligence
  both VERIFIED); and the live empty files + provenance-less legal file expose nothing.

## Engine wiring — SAFE ONLY (Step 4)
`profile.ts` now reads `getVerifiedCorridors/Court/TraumaCenters/LegalFacts` and exposes
`corridors/venueCourt/traumaCenters/legalFacts` on `CityProfile`. With the empty PR7 files these are
all `[]`/`null`, and `compose.ts` does not consume them, so:
- **Engine output is byte-identical** — regenerating the 6 pilots produced **0 file changes**.
- `dangerousRoads` stays `[]`. No SOL/court/hospital/road name renders.
- `audit:quality` unchanged (`renderedDocsWithDupPartner` 1,467, before == after).

## Sample records (Step 6) — NONE added
No official, provenanced roads/courts/hospitals source exists in the repo to copy from, and the
legal data is state-law (Fable+Raphy gated). Per the rules, nothing was invented — all categories
remain `NEEDS_SOURCE`. The pipeline is proven instead by the 17-assertion safety proof (including a
positive control showing a fully-VERIFIED+sourced record WOULD render).

## Proof unverified data does not render
- `npm run audit:localdata` → "render-safety proof: 17 passed, 0 failed".
- Live getters on a real city return empty: `getVerifiedCorridors('texas','houston') == []`,
  `getVerifiedCourt(...) == null`, `getVerifiedTraumaCenters(...) == []`,
  `getVerifiedLegalFacts('florida') == null`.
- Regenerating pilots after wiring: **0 diff** (no fact leaked into rendered content).

## Proof no preserved dirty files touched
- Working tree after PR7: 21 dirty files, all matching `cities-content|progress.json`
  (the 19 preserved enhancements + 2 progress JSONs). `git status | grep -v` of that pattern returns
  nothing but the new untracked docs. Each PR7 commit was staged from an explicit file list — 0
  preserved files staged.

## Build / lint / audit results
- `npm run build`: PASS (exit 0), all routes prerender. `tsc --noEmit`: 0 errors. `eslint`: 0 errors.
- `npm run audit:localdata`: PASS. `audit:quality`: unchanged (1,467). `audit:damage`: 0 stubbed,
  0 head-broken, 0 REVIEW (hub-aware); placeholders 0.

## Remaining risks
- **~1,467 clones still duplicate** — unchanged by PR7 (foundation only). Differentiating them needs
  VERIFIED records, which need official sources a human must add.
- **SOL / state-law is the gated frontier** — `correct-legal-data.json` holds numbers but no
  provenance and is flagged wrong for FL/ME/WV; it must not render until Fable+Raphy verify per state.
- The verified-data layer is wired but **not yet consumed by `compose.ts`** — intentional; rendering
  is a later PR once real data exists and is approved.

## Exact next PR plan
1. **PR8 — source & populate (HUMAN + Fable/Raphy).** Add VERIFIED roads/courts/hospitals records
   from the §sources in `PR7-SOURCE-PLAN.md` (network approval required to read sources). SOL only
   after Fable+Raphy. Each record must pass `npm run audit:localdata`.
2. **PR9 — render the verified slice.** Wire `compose.ts`/`modules.ts` to consume `corridors/
   venueCourt/traumaCenters/legalFacts` in presence-aware slots (verified branch + existing hedge as
   the NEEDS_SOURCE branch). Re-enable `dangerousRoads` from `corridors` only where sourced.
3. **PR10 — new gated tranches.** With real per-city facts injected, re-run `batch-preview`; the
   conflict-free pool should grow well past the prose ceiling, enabling tranches over the remaining clones.

## Stop conditions honored
Network not used (no fetch). SOL/state-law not written (Fable+Raphy gated). No ambiguous/unofficial
source added — everything stays `NEEDS_SOURCE`. No page generation.
