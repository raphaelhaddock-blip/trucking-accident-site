# PR9 Packet — Render the VERIFIED Court Slice (neutral sourced context)

Branch: `repair/pr1-restore-pr2-gate` (local, unpushed). Base for PR9: `5f3a75b` (end of PR8).
Commit: `795ae27` (+ docs commit). Build PASS (exit 0). tsc 0. lint 0. `audit:localdata` PASS.
**Outcome: the 15 VERIFIED CA court records now render as neutral, sourced "Court context" — not venue/legal advice. Gated on VERIFIED + FARS-county match + sourceUrl. SOL/roads/hospitals render nowhere; `dangerousRoads` stays `[]`.**

## Step 1 — Verify (done)
Branch `repair/pr1-restore-pr2-gate`, base `5f3a75b`. 21 dirty = 19 preserved + 2 progress JSONs.
`audit:localdata` PASS, `audit:quality` 1,467, 0 placeholders.

## Step 2 — Court-name safety (displayName pass)
Audited `city-courts.json` for the branding nuance Raphy flagged. Only **Los Angeles** differs from
the canonical Judicial-Branch name, so only LA got a `displayName`:

| County | `trialCourtName` (canonical/legal) | `displayName` (public) | `sourceUrl` |
|---|---|---|---|
| Los Angeles | Superior Court of California, County of Los Angeles | **Superior Court of Los Angeles County** | https://www.lacourt.ca.gov/ |
| San Diego | Superior Court of California, County of San Diego | — (same) | https://www.sdcourt.ca.gov/ |
| Alameda | Superior Court of California, County of Alameda | — (same) | https://www.alameda.courts.ca.gov/ |
| Solano | Superior Court of California, County of Solano | — (same) | https://solano.courts.ca.gov/ |

- LA `sourceUrl` corrected to the canonical `.ca.gov` and Alameda to the `www` form — both
  Raphy-verified this session. `trialCourtName` kept as the canonical legal-style name; render uses
  `displayName ?? trialCourtName`. No names inferred. (`local-data.ts` `VenueCourt` gained optional
  `displayName`, flowing through the resolver unchanged.)

## Step 3 — Rendered fields + exact wording
Rendered in the city route (`src/app/states/[slug]/[city]/page.tsx`) only when
`buildCityProfile(slug,city).venueCourt` resolves (VERIFIED **and** county matches FARS **and**
`sourceUrl` present). Exact text:

> **Court context:** {City} is located in {County} County, {State}. The trial court that serves
> {County} County is the [{displayName ?? trialCourtName}]({sourceUrl}) — see the official court
> website for locations, hours, and filing information. This is general public-record information,
> not legal advice.

The court name links to the official `.gov` source. The provenance "About this page" note now drops
"courts" from its unsourced list when a court is shown.

**Deliberately NOT said** (per the goal): "your case will be filed there", "this is the right venue",
"local judges/juries", any SOL/deadline/outcome claim. The wording states a public structural fact
(which court serves the county) + a source link, framed explicitly as "not legal advice."

## Step 4 — Negative controls (all pass)
| Case | Result |
|---|---|
| VERIFIED + matching county (los-angeles, san-diego, oakland, fairfield) | **renders** correct court + source |
| LA display-name nuance | renders **"Superior Court of Los Angeles County"** (displayName), not canonical |
| CA city w/o record (sacramento) | **no court block** |
| Other-state city (texas/houston) | no court block |
| Protected city w/o record (california/fresno) | no court block |
| County mismatch (PR8 control: county→"Orange") | validator FAILS; resolver returns null → no render |
| SOL (CA/FL/TX) | `getVerifiedLegalFacts` → null everywhere; renders nowhere |
| Roads / hospitals (LA) | `getVerifiedCorridors`/`getVerifiedTraumaCenters` → 0; render nowhere |
| `dangerousRoads` | stays `[]` |

## Step 5 — Verification + built-HTML spot-check
- `npm run build` PASS (exit 0). `tsc --noEmit` 0. `eslint` 0 errors. `audit:localdata` PASS.
  `audit:quality` **1,467 (unchanged)**. `audit:damage` clean (0 REVIEW). placeholders 0.
- Built static HTML inspected:
  - `los-angeles.html` → "Superior Court of Los Angeles County" + `lacourt.ca.gov`
  - `san-diego.html` → "Superior Court of California, County of San Diego" + `sdcourt.ca.gov`
  - `oakland.html` → "...County of Alameda" + `alameda.courts.ca.gov`
  - `fairfield.html` → "...County of Solano" + `solano.courts.ca.gov`
  - `sacramento.html` → **0** court blocks (negative control)

## Source links used (Raphy-verified)
- [LA Court](https://www.lacourt.ca.gov/) · [San Diego Superior Court](https://www.sdcourt.ca.gov/) ·
  [Alameda Superior Court](https://www.alameda.courts.ca.gov/) · [Solano Superior Court](https://solano.courts.ca.gov/)

## Proof: preserved dirty files untouched
Working tree after PR9: 21 dirty files, all `cities-content|progress.json` (19 preserved + 2 progress).
PR9 changed only `city-courts.json`, `local-data.ts`, and the city route — 0 preserved files.

## Remaining risks
- **Gate alignment:** the court block is route-injected (not in `cityContent`), so `audit:quality`
  does not measure it. It is small, neutral, and *increases* per-county differentiation, so it can only
  help — but when these 15 cities are regenerated as hubs (PR10), the court data should flow into
  `composeCityContentHub` + the gate's `renderedText` so the gate measures what ships.
- **Same-county pages share the identical block** (e.g. 7 LA cities) — ~30 words; negligible and only
  on pages that are already clones. Resolved naturally once they become differentiated hubs.
- **Legal-tone review:** wording is framed as public-record context + "not legal advice"; a human/Fable
  read before any production deploy is still advisable since this is the first court-fact rendering.
- Roads/hospitals/SOL remain unsourced/ungated-off — unchanged.

## Next PR plan
1. **PR10 — fold court data into hubs + reopen tranches.** When (re)generating these CA cities as hubs,
   set `composeCityContentHub.venueCourt` and add it to the gate's `renderedText`; the county/court text
   adds real per-county differentiation, growing the conflict-free pool. Re-run `batch-preview`.
2. **PR11 — extend the verified slice (human-assisted).** More counties/states' courts (verbatim from
   each judicial branch), then roads/hospitals from official GIS/registry sources with human reading.
3. **SOL — Fable + Raphy only.** Provenance extension to `correct-legal-data.json`, then render with
   citation, never autonomously.

## Stop conditions honored
No ambiguous name rendered (LA display-name nuance handled explicitly). Wording stayed public-record
context, not legal advice. No network, no SOL/state-law, no roads/hospitals, no batch generation.
