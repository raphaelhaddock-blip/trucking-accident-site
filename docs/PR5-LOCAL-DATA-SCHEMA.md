# Verified Local-Data Source Schema — Design (PR5 Workstream D)

**Status:** DESIGN ONLY — no data populated, no engine changes. This is the future-source
plan that would let the engine eventually render genuinely city-specific facts (roads,
courts, hospitals, state SOL) WITHOUT guessing. It is the robust path past the prose
ceiling documented in `PR5-PACKET.md`. Nothing here is enabled; everything stays
`NEEDS_SOURCE` until a human verifies a real source per record.

> Produced by a read-only design agent. It found that `scripts/data/correct-legal-data.json`
> already holds SOL + negligence rules but lacks per-field provenance — which is exactly
> why the engine still marks SOL `NEEDS_SOURCE`. The SOL design below EXTENDS that file
> rather than replacing it.

## 0. Why this shape (grounding in what exists)

1. **Provenance lives in the profile, not the prose.** `buildCityProfile()` builds a
   `provenance: Record<string, Provenance>` ledger; `roads`, `hospitals`, `courthouse`,
   `statuteOfLimitations` are already keys, hardcoded `'NEEDS_SOURCE'` (profile.ts ~102-105).
   This schema gives those keys a real source so they flip to `'VERIFIED'` per city/state.
2. **Data files are keyed `state → city`** (like `city-populations.json`), so `profile.ts`
   can `import` them and index by `(stateSlug, citySlug)` with no new infrastructure.
3. **The hedged slot text that exists today IS the `NEEDS_SOURCE` branch** — e.g. `g-venue`
   ("the ${stateName} courts that cover ${county} County"), `g-sol` ("treat any number you
   read online as a prompt to call a lawyer"). The schema lets those graduate to specific
   ONLY where a verified source backs it.

## 1. Proposed JSON files (all in `scripts/data/`)

Shared provenance envelope on every leaf record:
```jsonc
{ "sourceName": "...", "sourceUrl": "...", "verifiedDate": "YYYY-MM-DD",
  "confidence": "VERIFIED" | "GENERAL" | "NEEDS_SOURCE", "note": "" }
```
A record with `confidence !== 'VERIFIED'` is treated as ABSENT.

- **`city-roads.json`** — replaces the disabled `dangerousRoads` arrays. `roads[state][city]`
  with `corridors[]` of `{ name, designation, role, crashStat|null }`. `role` is neutral
  freight-function language ("primary freight corridor"); a DANGER claim requires a fully
  sourced `crashStat` object — absent that, name the corridor but never call it dangerous.
- **`city-courts.json`** — `courts[state][city]` = `{ county, trialCourtName, courtType, ... }`.
  Cross-check rule: `county` MUST match the FARS `countyName`; mismatch → `NEEDS_SOURCE`.
- **`city-hospitals.json`** — `hospitals[state][city].centers[]` = `{ name, traumaLevel, ... }`.
  Trauma-level designation only (objective, sourced); no ranking/recommendation.
- **Extend `correct-legal-data.json`** — add per-state `sourceUrl` + `confidence` to
  `statuteOfLimitations[state]` and a `negligenceRules[state]` block
  (`{ system, barThresholdPercent, summary, sourceUrl, confidence }`). FL/ME/WV stay
  `NEEDS_SOURCE` (already flagged wrong) until re-verified.

## 2. Mapping into `CityProfile` / `CityContent`

New profile fields (each `null`/`[]` when source absent): `corridors`, `venueCourt`,
`traumaCenters`, `solPersonalInjuryYears`, `negligenceSystem`, `negligenceBarThreshold`,
`solSourceUrl`. The existing ledger keys flip from hardcoded `NEEDS_SOURCE` to a lookup
(`roads: corridors.length ? 'VERIFIED' : 'NEEDS_SOURCE'`, etc.). New optional `CityContent`
types: `CityCorridor`, `CityVenueCourt`, `CityTraumaCenter`, `CityLegalFacts` — kept optional
so `composeCityContentHub` can omit them like it omits the federal-substance fields today.

Slots that would consume verified data: `t-local`/`w-local` (corridors, role language only),
`g-venue` (verified court name), a new trauma sentence in `whyDangerous` (renders only when
present), `g-sol`/`l-state` (verified SOL number + negligence system + citation, disclaimer kept).

## 3. NEEDS_SOURCE hook — engine never asserts unsourced facts

- **Absence is the default; presence requires `confidence === 'VERIFIED'`.** One resolver:
  `resolveVerified(rec) => rec?.confidence === 'VERIFIED' ? rec : null`.
- **Two-key requirement** for compound facts: SOL renders a number only if BOTH
  `statuteOfLimitations[state]` AND `negligenceRules[state]` are VERIFIED; venue renders only
  if the court record exists AND its `county` matches FARS.
- **Slot selection is presence-aware** (same pattern as `dominantMechanism` today): the
  verified branch is added; the existing hedged sentence remains the `NEEDS_SOURCE` branch.
- **Disclaimer survives verification** ("confirm with a licensed attorney for your situation").
- **The provenance ledger + `needsSource[]` stay the audit trail**; a validator can assert no
  rendered slot reads a `NEEDS_SOURCE` key.

## 4. Authoritative sources (names only — no fetching)

- Roads/corridors: state DOT freight network plans, FHWA National Highway Freight Network / FAF.
- Courts/venue: the state Judicial Branch courts directory; NCSC court-structure charts (cross-ref).
- Trauma hospitals: state DOH trauma registry; ACS verified-trauma-center list; American Trauma Society.
- SOL / comparative negligence: the state's codified statutes (primary-source only); NCSL summaries (cross-ref). FMCSA is NOT a source for state SOL.

## 5. What must NOT be enabled until sourced

1. `dangerousRoads` / any "dangerous road" claim — stays `[]`. Naming a corridor as freight
   infrastructure is allowed only via `corridors[]` with neutral `role`; "dangerous/deadliest/
   hotspot" requires a sourced `crashStat`.
2. SOL numbers — no "you have N years" until both SOL + negligence records are VERIFIED.
3. Court / courthouse names — none until a VERIFIED record whose county matches FARS.
4. Hospital / trauma-center names — none until a VERIFIED record (no hedged fallback; absence = omit).
5. Comparative-negligence statements — tied to the SOL two-key gate.

**Invariant (unchanged):** the page may be less specific, but never specifically wrong. A
`NEEDS_SOURCE` field renders the hedge or renders nothing — it never guesses.

### Build note
No engine logic change is required to STAY SAFE — the safe (hedged/empty) branches already
exist. The build work is purely additive and can ship per-category, city-by-city, because the
provenance gate is per-record.
