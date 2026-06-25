# PR7 Source Plan — Official Targets for Verified Local Data

**Purpose:** name the official, citable sources a human must use to populate the verified-
local-data files. Extends `docs/PR5-LOCAL-DATA-SCHEMA.md`. **No data was fetched.** Nothing
renders until a human verifies a real source per record and sets `confidence: 'VERIFIED'`.

**Hard rule (unchanged):** no fake roads/courts/hospitals/SOL/state-law/brands. A page may
be less specific, never specifically wrong. Network fetching requires explicit Raphy approval.

## Data files (created empty in PR7)
- `scripts/data/city-roads.json` → `roads[stateSlug][citySlug]`
- `scripts/data/city-courts.json` → `courts[stateSlug][citySlug]`
- `scripts/data/city-hospitals.json` → `hospitals[stateSlug][citySlug]`
- `scripts/data/correct-legal-data.json` → **provenance extension** (see §SOL)

Every record needs `sourceName`, `sourceUrl`, `verifiedDate`, `confidence`. Validator:
`npm run audit:localdata`.

## 1. Roads / corridors
Goal: name the actual freight corridors serving a city as **infrastructure** (neutral `role`).
A *danger* claim (`crashStat`) needs a separately-sourced fatal-crash statistic.

| Source | What it provides | Notes |
|---|---|---|
| State DOT freight network / freight mobility plans (e.g. TxDOT Texas Freight Network, Caltrans Freight Mobility Plan) | Designated truck/freight corridors by region | Primary source for `role` |
| FHWA National Highway Freight Network (NHFN) | Federally designated freight routes | National cross-reference |
| FHWA Freight Analysis Framework (FAF) | Corridor freight tonnage/flow | Supports "primary freight corridor" language |
| NHTSA FARS (already in repo) / state DOT crash records | Fatal-crash counts per route | REQUIRED for any `crashStat` danger claim |

**Do not** populate `dangerousRoads`; that legacy field stays `[]`. Corridors render via the new
`corridors[]` with neutral `role` only.

## 2. Courts / venue
Goal: name the trial court that serves the city's county. County is already VERIFIED from FARS.

| Source | What it provides |
|---|---|
| State Judicial Branch official courts directory (e.g. Texas Judicial Branch, California Courts, NY Unified Court System) | Trial court name + type per county |
| National Center for State Courts (NCSC) court-structure charts | Cross-reference for court-type naming |

**Cross-check enforced by the validator:** `courts[state][city].county` must equal the FARS
`countyName` for that city, or the record fails. Court names never render on a county mismatch.

## 3. Hospitals / trauma centers
Goal: state the verified trauma-center designation serving the area (objective, sourced).

| Source | What it provides |
|---|---|
| State DOH trauma registry / trauma-service-area designations | Trauma level per facility |
| American College of Surgeons (ACS) verified trauma center list | Independent verification |
| American Trauma Society (ATS) trauma-center directory | Cross-reference |

Trauma **level only** — no ranking, no recommendation, no "best hospital" language.

## 4. SOL / negligence — **Fable + Raphy review REQUIRED**
State statute-of-limitations and comparative-negligence rules are state-law. They are **not** in
scope for autonomous work.

| Source | What it provides |
|---|---|
| The state's codified statutes (cite the section, e.g. the PI limitations statute and the comparative-fault statute) | Primary, authoritative SOL + negligence rule |
| State legislature official statute portal | Where to read/cite the statute |
| NCSL comparative-negligence summaries | Secondary cross-reference only |

**FMCSA is NOT a source for state SOL.** A state may be marked `VERIFIED` only when BOTH its SOL
and negligence records carry a primary-statute `sourceUrl` and pass Fable + Raphy review. The
three states already flagged wrong in `profile.ts` (FL/ME/WV) stay `NEEDS_SOURCE` until re-verified.

### Provenance extension for `correct-legal-data.json` (plan only — not applied in PR7)
Add per-state, per-field provenance so the loader can flip SOL to VERIFIED state-by-state:
```jsonc
"statuteOfLimitations": {
  "<state>": { "personalInjury": N, "wrongfulDeath": N, "unit": "years",
    "sourceName": "<state> Stat. § ...", "sourceUrl": "...", "verifiedDate": "YYYY-MM-DD",
    "confidence": "VERIFIED" }
},
"negligenceRules": {
  "<state>": { "type": "modified-51|pure|...", "bar": N,
    "sourceName": "<state> Stat. § ...", "sourceUrl": "...", "verifiedDate": "YYYY-MM-DD",
    "confidence": "VERIFIED" }
}
```
Until applied, `getVerifiedLegalFacts` returns `null` for every state (proven by the safety test).

## Process to add a record (per category, per city/state)
1. Open the official source; copy the fact + the exact citable URL.
2. Add the record with full provenance and `confidence: 'VERIFIED'`.
3. Run `npm run audit:localdata` — it must pass (provenance complete, court county matches FARS,
   any road danger claim fully sourced).
4. (Roads/courts/hospitals only — SOL needs Fable + Raphy first.)
5. A later PR wires the verified slice into the rendered slots; until then it is data-only.

## Stop conditions
- Network needed to read a source → stop and ask Raphy.
- SOL / state-law → stop for Fable + Raphy review.
- Source unofficial or ambiguous → mark `NEEDS_SOURCE`, do not add.
