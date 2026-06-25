# PR10 Packet — Court-Aware Gate + Legal-Tone Hardening (no new tranche)

Branch: `repair/pr1-restore-pr2-gate` (local, unpushed). Base for PR10: `b8bee46` (end of PR9).
Commits: `123fcc0` (court-aware gate), `320aae6` (tone neutralization + regen), + docs.
Build PASS (exit 0). tsc 0. lint 0 errors. `audit:localdata` PASS (27 assertions). `audit:quality` 1,467.
**Outcome: the duplicate gate now measures the PR9 court block; old venue/SOL legal-advice phrasing neutralized and the 114 live hub pages regenerated; safe pool exhausted → ZERO new tranche pages.**

## Step 1 — Verify (done)
Branch `repair/pr1-restore-pr2-gate`, base `b8bee46`. 21 dirty = 19 preserved + 2 progress JSONs.
`audit:localdata` PASS, `audit:quality` 1,467, 0 placeholders.

## Read-only audits (A–C)
- **A (gate models):** rendered city text is modeled in `duplicate-audit.ts` (the gate),
  `batch-preview.ts` (selection), `pilot-probe.ts` (per-page), plus legacy `pilot-preview.ts`/
  `collision-decomp.ts`. The PR9 court block is route-injected, so none measured it.
- **B (legal-tone):** found venue/filing phrasing in `modules.ts` `g-venue` ("venue typically
  falls", "would ordinarily be filed"), a scare line in `g-sol`, the rendered deadline FAQ
  (`faq.ts` #10), and the route's `defaultFaqs` SOL answer ("losing your right forever").
- **C (pool probe):** with court-awareness, the conflict-free pool yields **0** safe candidates
  (margins 0.03 and 0.02) — exhausted.

## 1) Court-aware gate (`123fcc0`)
- New single source of truth `courtContextText(venueCourt, city, state)` in `local-data.ts` —
  the exact neutral sentence the route renders. Both the route and the gate use it, so the
  published surface and the similarity model never drift.
- `duplicate-audit.ts`, `batch-preview.ts`, `pilot-probe.ts` append the court block to each
  city's modeled `renderedText`, computed via `buildCityProfile().venueCourt` (the same resolver
  the route uses → appears exactly when/where the page shows it). Appended **once** (no double-count).
- Impact: `audit:quality` stays **1,467** (the 15 court cities are already clones; the block is
  small and adds cross-county differentiation); `renderedPairsOver30pct` 753,827 → 753,658; pilots
  still <30%. The gate now scores what crawlers see.
- `local-data-validate.ts`: +10 assertions (27 total) proving `courtContextText` carries
  "not legal advice" and omits "your case / will be filed / venue / judges / juries / statute of
  limitations" — guards the wording's safety even if it is ever edited.

## 2) Legal-tone neutralization + regen (`320aae6`)
Engine wording moved to public-record/process framing (keeps "not legal advice"):
| Location | Before | After |
|---|---|---|
| `modules.ts` g-venue | "Venue … typically falls / would ordinarily be filed in the {state} court serving {county} County" | "{City} sits within {County} County, part of the {state} court system; which specific court handles a matter depends on the facts / a licensed attorney can confirm" |
| `modules.ts` g-sol | "Miss the {state} deadline and the strongest case in the world is over" / "hard cutoff" | "{state} sets time limits that turn on the facts — confirm with a licensed attorney" |
| `faq.ts` deadline FAQ (rendered) | "missing it ends the case no matter how strong it is" / "a hard cutoff" / "strict" | lead with the real evidence clock; route the legal time-limit to a licensed attorney; "not legal advice" |
| route `defaultFaqs` SOL | "Missing this deadline means losing your right to compensation forever … ensure your claim is filed on time" | "{state} sets time limits that vary by claim type and facts; confirm with a licensed attorney … not legal advice" |

**Regeneration:** the engine fix only affects new generations, so the 114 already-written hubs were
deterministically regenerated (`write-batch --force` + `generate-pilot`). **41 pages changed; 0 retain
scary phrasing.** Built-HTML scan: **0** city pages contain "ends the case / losing your right forever /
hard cutoff" anywhere.

## 3) Stale PR7 labels
`local-data.ts` header comment refreshed: courts now hold VERIFIED records (rendered as neutral context);
roads/hospitals remain empty/NEEDS_SOURCE. (Validator labels already reflected reality.)

## 4) Tranche decision — **ZERO pages written**
Court-aware `batch-preview` keeps **0** candidates at margins 0.03 and 0.02 — the conflict-free pool is
exhausted (consistent with the PR5/PR6 prose-ceiling finding; the remaining ~1,467 clones need sourced
per-city facts, not more prose). Per the goal ("if safe pool is weak, write zero pages and stop"), no new
tranche was written.

## 5) Verification
| Check | Result |
|---|---|
| `npm run build` | PASS (exit 0) |
| `tsc --noEmit` | 0 errors |
| `eslint` (changed) | 0 errors (pre-existing slot-signature warnings only) |
| `audit:localdata` | PASS — render-safety proof **27/27** |
| `audit:quality` | renderedDocsWithDupPartner **1,467**, belowFloor 0, court-aware |
| `audit:damage` | 0 stubbed / 0 head-broken / 0 REVIEW |
| placeholder scan | 0 |

**Built-HTML spot-checks:**
- `los-angeles` → court block, **"Superior Court of Los Angeles County"** (displayName) + `lacourt.ca.gov`
- `san-diego` → "Superior Court of California, County of San Diego" + `sdcourt.ca.gov`
- `oakland` → "…County of Alameda" + `alameda.courts.ca.gov`
- `fairfield` → "…County of Solano" + `solano.courts.ca.gov`
- `sacramento` (negative control) → **0** court blocks
- Court block renders **once** visually (the 2nd match in HTML is Next's RSC payload).

## Proof: preserved dirty files untouched
Working tree after PR10: **21 dirty files**, all `cities-content|progress.json` (19 preserved + 2 progress).
Regeneration used the manifest + pilot lists only (PROTECTED set excludes preserved); a spot-check confirms
`texas/el-paso.ts` still holds its enhancement (0 hub markers), not a regenerated hub. 0 preserved files staged
in any PR10 commit.

## Remaining risks
- **~1,467 clones remain** — unchanged; need sourced per-city data (roads/hospitals/more courts), not prose.
- **Court rendering is live on 15 CA cities** — a human/Fable legal-tone read before any production deploy is
  still advisable (first court-fact rendering). Wording is framed as public-record context, not advice.
- **SOL/roads/hospitals** remain `NEEDS_SOURCE` / render nowhere (proven).
- Court block is identical across same-county cities (e.g. 7 LA) — now measured by the gate; when those become
  differentiated hubs it nets out, and it only adds cross-county differentiation today.

## Next PR plan
1. **PR11 — extend the verified slice (human-assisted).** More counties/states' courts verbatim from each
   judicial branch; roads/hospitals from official GIS/registry sources with a human reading them.
2. **PR12 — fold court data into the hub composer.** When the 15 CA court cities are regenerated as hubs, set
   `composeCityContentHub.venueCourt` so the block lives in the content file too (the gate already models it),
   tightening route/content alignment.
3. **SOL — Fable + Raphy only.** Provenance extension to `correct-legal-data.json`, then render with citation.

## Stop conditions honored
No ambiguous name rendered (LA display-name handled). All wording stayed public-record context, not legal
advice (asserted by the validator). No network, no SOL/state-law, no roads/hospitals, no batch generation
(safe pool exhausted → zero pages).
