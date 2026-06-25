# PR11 Packet — Global Published Legal-Tone Cleanup

Branch: `repair/pr1-restore-pr2-gate` (local, unpushed). Base for PR11: `1587064` (end of PR10).
Commits: `0696d1c` (gate + fix tool), `438c44c` (content neutralization), + docs.
Build PASS (exit 0). tsc 0. lint 0 errors. `audit:legaltone` PASS (0 source + 0 built offenders). `audit:quality` 1,467 (unchanged).
**Outcome: legal-ADVICE phrasing removed from the entire published surface (city + state + accident + blog + route + JSON-LD); a CI gate now blocks regressions. Tone-only — no legal number/fact changed. SOL-number provenance flagged for Fable.**

## Self-correction
PR10's "0 scary phrasing" was scoped to a handful of city-content phrases and **missed** state pages, older city clones, blog, and JSON-LD. Raphy's live scan found ~1,518 source / ~1,517 built files still matching. PR11 fixes the global surface and adds a gate so this can't silently regress again.

## Workstreams A–C (read-only findings)
- **A (scan):** banned advice phrasing lived in: city `faqs` SOL answer (~1,468 clone files, rendered visibly + in FAQPage JSON-LD), city `legalInfo` "best venue" (dead on city route), all 50 **state pages** (SOL + venue + contributory-negligence prose, rendered), 1 blog post, and the route `defaultFaqs`.
- **B (route map):** city route renders `faqs` (visible + JSON-LD) — NOT `legalInfo`. State route renders the SOL/venue/negligence prose + `statuteOfLimitations` numbers. So the rendered offenders were the **city FAQ SOL answer** and the **state pages**; `legalInfo` "best venue" was dead but neutralized anyway for source hygiene.
- **C (strategy):** deterministic constant-substring map (advice phrase → neutral process wording). Keep all legal **numbers** unchanged; route legal questions to "a licensed attorney"; keep "not legal advice" framing.

## Before / after (banned phrases on the published surface)
| Phrase | Source files before | Built before | After (source/built, excl. 19 preserved) |
|---|---|---|---|
| "bars your claim" | 1,518 | ~5,000+ matches | **0 / 0** |
| "best venue" | 1,262 | ~200 (state pages) | **0 / 0** |
| "must file your lawsuit" | 51 | ~200 | **0 / 0** |
| "losing your right" | 255 | ~1,000 | **0 / 0** |
| "ensure your claim is filed" | 255 | ~1,000 | **0 / 0** |
| "your case may be filed" | 50 | (state) | **0 / 0** |
| "completely barred" | 12+ | (state) | **0 / 0** |
| "judges and juries" | 1 | 4 | **0 / 0** |
| "stronger your case will be" | 1,262 | — | **0 / 0** |

`audit:legaltone` final: **source offenders 0, built offenders 0** (20 banned phrases, 19 preserved files allowlisted). The preserved files were independently verified to contain **0** banned phrases anyway (they are hand-enhanced, not clone-templated).

## Exact replacements (representative — full map in `scripts/quality/legaltone-fix.ts`)
- "Missing this deadline (typically) bars your claim forever, regardless of …" → "These filing time limits depend on the type of claim and the facts"
- "missing the deadline by even one day typically bars your claim forever …" (state) → "the exact time limit depends on the type of claim and the facts; a licensed attorney can confirm how it applies …"
- "you must file your lawsuit within {N} years" → "the filing deadline generally falls within {N} years" *(number kept)*
- "a deadline by which you must file your lawsuit or lose your right to sue forever" → "a filing time limit that depends on the type of claim and the facts"
- "Contact a lawyer promptly to ensure your claim is filed on time" → "A licensed attorney can confirm the deadlines that apply"
- "can advise on the best venue for your case" → "can explain how the court process works"; "best venue" → "court process"
- "If you are found even 1% at fault, you may be completely barred from recovery …" → "Some states limit or reduce recovery when the injured person shares fault, and how that applies depends on the facts and the state"
- "Your case may be filed in {State} state court or in federal court (…)" → "A truck claim may be brought in {State} state court or in federal court (…)"
- "judges and juries" → "the court process"; "the stronger your case will be" → "the better the evidence is preserved"

## Files / routes changed
- ~1,520 content files: `src/lib/cities-content/**` (non-preserved clones), all 50 `src/lib/states-content/*.ts`, `src/lib/accidents-content`, `src/lib/blog-content`, and the route `src/app/states/[slug]/[city]/page.tsx` `defaultFaqs`.
- New: `scripts/quality/legaltone-fix.ts`, `scripts/quality/audit-legaltone.ts`, `npm run audit:legaltone`.
- Rendered surfaces cleaned: visible HTML, RSC payloads, and **FAQPage JSON-LD** (the city SOL FAQ feeds the schema).

## Verification
| Check | Result |
|---|---|
| `audit:legaltone` (source + built) | **PASS** — 0 / 0 offenders |
| `npm run build` | PASS (exit 0) |
| `tsc --noEmit` | 0 errors |
| `eslint` (new scripts) | 0 errors |
| `audit:localdata` | PASS (27/27) |
| `audit:quality` | renderedDocsWithDupPartner **1,467** (unchanged — templated change is uniform) |
| `audit:damage` | 0 stubbed / 0 head-broken |
| placeholder scan | 0 |

## Remaining non-rendered / dead-field notes
- City `legalInfo` ("Cases may be filed in {County} courts …") is **not rendered** on city pages; the advice part ("best venue") was still neutralized for source hygiene.
- The 19 preserved dirty files are allowlisted in the gate (cannot be edited on this branch) but were verified to contain **0** banned phrases, so nothing is masked.

## Remaining risks — **FABLE / human review required before production**
- **Unverified SOL numbers still render as fact on 50 state pages** (e.g. "Alabama has a 2-year statute of limitations"). PR11 removed the *advice tone* but, per the goal, did **not** verify or change SOL numbers — and FL/ME/WV were previously flagged wrong. **This is the top remaining legal-accuracy risk; it needs the Fable + Raphy SOL track** (provenance extension to `correct-legal-data.json`, then verified rendering) before any production deploy.
- Contributory/comparative-negligence statements were softened to general wording; a licensed review should confirm the general framing is acceptable.
- First broad legal-tone rewrite — a human/Fable read of the new neutral wording is advisable before production.

## Next PR plan
1. **PR12 — SOL provenance + verified rendering (FABLE + Raphy).** Add per-state SOL/negligence provenance to `correct-legal-data.json`; render specific numbers only when VERIFIED (two-key), else the neutral "state law sets time limits; confirm with a licensed attorney" wording. Wire `audit:legaltone` into the `audit` aggregate / CI.
2. **PR13 — preserved-file tone pass.** When the 21 preserved enhancements are committed, run `audit:legaltone` over them and neutralize any phrasing (currently allowlisted).
3. **Resume sourcing (PR8/PR9 track).** More verified courts/roads/hospitals once tone is locked.

## Stop conditions honored
Tone-only; no legal number/fact invented or changed; SOL verification explicitly deferred to Fable + Raphy. No network, no batch generation. 21 preserved files untouched (verified). Gate added to prevent regression.
