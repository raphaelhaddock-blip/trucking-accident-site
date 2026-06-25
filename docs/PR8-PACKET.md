# PR8 Packet — First VERIFIED Local-Data Slice (Courts)

Branch: `repair/pr1-restore-pr2-gate` (local, unpushed). Base for PR8: `a40594d` (end of PR7).
Commit: `a0789d7` (15 court records). Build: PASS (exit 0). tsc 0. lint 0. `audit:localdata` PASS.
**Outcome: 15 VERIFIED court records added from official sources; roads + hospitals deferred NEEDS_SOURCE (sources interactive/blocked); SOL untouched (Fable+Raphy gated). Pipeline proven end-to-end; nothing renders.**

## What was approved vs what was done
Read-only network was approved for official roads/courts/hospitals sources. Courts proved
cleanly sourceable from official `.gov`/court sites; **roads and hospitals did not** (see §Rejected).
No forms, logins, scraping behind auth, or external writes. No SOL network work.

## Step 1 — Verify (done)
Branch `repair/pr1-restore-pr2-gate`, base `a40594d`. 21 dirty = 19 preserved + 2 progress JSONs
(no others). `audit:localdata` PASS, `audit:quality` 1,467, 0 placeholders. No in-repo official
courts/hospitals/freight dataset existed, so records required network.

## Step 2 — Target slice
**15 California cities across 4 counties** whose official Superior Court I confirmed verbatim from
official sources. CA chosen because: (1) high clone volume (82 CA candidates), (2) the Judicial
Branch of California is an authoritative, well-structured source, (3) the validator's county
cross-check (FARS) gives an automatic guard. Cities (all in the remaining-clone set, none
protected/preserved/PR5–6-written):
- **Los Angeles County** (lacourt.org): los-angeles, long-beach, glendale, burbank, lancaster, palmdale, compton
- **San Diego County** (sdcourt.ca.gov): san-diego, el-cajon, oceanside, carlsbad
- **Alameda County** (alameda.courts.ca.gov): oakland, berkeley, fremont
- **Solano County** (solano.courts.ca.gov): fairfield

## Step 3/4 — Sources used + records added

### Courts — 15 records (`scripts/data/city-courts.json`)
| County | Official source (sourceUrl) | trialCourtName | cities |
|---|---|---|---|
| Los Angeles | https://www.lacourt.org/ | Superior Court of California, County of Los Angeles | 7 |
| San Diego | https://www.sdcourt.ca.gov/ | Superior Court of California, County of San Diego | 4 |
| Alameda | https://alameda.courts.ca.gov/ | Superior Court of California, County of Alameda | 3 |
| Solano | https://solano.courts.ca.gov/ | Superior Court of California, County of Solano | 1 |

Each record: `confidence: VERIFIED`, `county` (matches FARS), `courtType: "Superior Court"`,
`sourceName`, `sourceUrl`, `verifiedDate: 2026-06-24`. The LA record carries a `note` that it
operates publicly as "Superior Court of Los Angeles County" while the Judicial Branch lists the
constitutional name used in the field. **Method:** official court names were taken verbatim from
each court's official site title (its own `<title>`), not from an AI summary. A key safety finding:
naming is **not** uniform (LA brands itself differently) — inferring would have produced a wrong
name; reading the official source mattered.

### Roads/corridors — 0 records (deferred NEEDS_SOURCE)
Source targets (Caltrans Freight Mobility Plan, FHWA NHFN/FAF) are GIS maps / interpretation-heavy.
Naming a corridor "serving" a city without a clean machine-readable official statement risks the
exact error that disabled `dangerousRoads`. Left empty; documented in `docs/PR7-SOURCE-PLAN.md`.

### Hospitals/trauma — 0 records (deferred NEEDS_SOURCE)
Trauma-center designations live in state EMS/DOH registries and the ACS verified list — typically
PDFs / interactive maps. A wrong trauma level is a specifically-wrong medical claim, so these were
not extracted autonomously. Left empty.

## Records rejected / left NEEDS_SOURCE and why
- **All roads + hospitals**: official sources were interactive (JS "Find Your Court"–style tools),
  GIS, PDF, or access-blocked (the legacy CA court directory `www4.courts.ca.gov/superiorcourts.htm`
  returned **HTTP 403**). Faithful verbatim extraction was not reliably achievable autonomously, and
  WebFetch's output is an AI summary (banned as a source). Per the stop conditions, nothing was guessed.
- **SOL / negligence / state-law**: not touched — Fable + Raphy gated. `getVerifiedLegalFacts` returns
  `null` for every state (verified: SOL VERIFIED count = 0).

## Step 5 — Safety proof (all pass)
- `npm run audit:localdata`: structure 0 errors, **render-safety proof 17/17 pass**.
- The 15 real records pass the validator, including the **county cross-check** (FARS).
- Negative control: flipping one record's county to "Orange" → validator FAILS
  (`county "Orange" != FARS county "Los Angeles"`), exit 1. Restored → PASS.
- **Non-rendering proof:** `getVerifiedCourt('california','los-angeles',…)` returns the court and
  `profile.venueCourt`/`provenance.courthouse` flip to VERIFIED, **but** the court name does NOT
  appear in the composed hub (`compose` does not consume `venueCourt`); `dangerousRoads` stays `[]`.
- `audit:quality` unchanged at **1,467** (court data does not affect rendered content).

## Step 6 — No page rendering
No page prose changed. The verified slice is data-only, gated, and inert until a later PR wires it
into presence-aware slots.

## Proof: no SOL/state-law populated
`getVerifiedLegalFacts` over CA/FL/TX/NY/ME/WV → 0 VERIFIED. `correct-legal-data.json` untouched.

## Proof: no preserved dirty files touched
Working tree after PR8: 21 dirty files, all `cities-content|progress.json` (19 preserved + 2 progress).
The only file changed by PR8 is `scripts/data/city-courts.json` (the data slice).

## Build / lint / audit
`npm run build` PASS (exit 0). `tsc --noEmit` 0 errors. `eslint` 0 errors. `audit:localdata` PASS.
`audit:quality` 1,467 (unchanged). `audit:damage` clean. placeholders 0.

## Remaining risks
- **Courts data is inert** until PR9 renders it — and rendering court names is a factual claim that
  should get a human/Fable spot-check before going live (the LA branded-name nuance is the example).
- **Roads + hospitals remain unsourced** — the dominant gap; needs a human reading GIS/PDF/registry
  sources (network approval + careful verbatim entry), not autonomous extraction.
- Court slice is CA-only and 15 cities — extending to the other ~67 CA candidates in these 4 counties
  is trivial (same county facts); other states each need their own court-naming convention verified.

## Next PR plan
1. **PR8.1 (optional, human-assisted):** extend courts to more states/counties by reading each state's
   official judicial-branch directory verbatim; and populate roads/hospitals from official sources
   with a human reading the GIS/PDF/registry pages. Each record must pass `audit:localdata`.
2. **PR9 — render the verified slice.** Wire `compose.ts`/`modules.ts` presence-aware slots to consume
   `venueCourt` (and later corridors/traumaCenters) — verified branch + existing hedge as the
   NEEDS_SOURCE branch. Spot-check rendered court claims with Raphy/Fable before merge.
3. **PR10 — new gated tranches.** With per-city verified facts injected, re-run `batch-preview`; the
   conflict-free pool should grow past the prose ceiling, reopening tranches over the remaining clones.

## Stop conditions honored
Network used read-only on official sources only. Roads/hospitals sources unavailable/ambiguous →
stopped, marked NEEDS_SOURCE, reported. SOL/state-law → not touched (Fable + Raphy). No page generation.
