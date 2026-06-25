# PR11D — Harden legal-tone gate against jury-verdict / damage-award prediction

Branch: `repair/pr1-restore-pr2-gate` (local, unpushed). Follows PR11C.

## TL;DR
PR11C's gate passed but missed a whole class of committed persuasion: claims about how a
*county's juries* decide and what they *award* ("Harris County juries…", "Dallas County juries
historically awarding significant verdicts", "substantial jury awards", "reputation for
significant verdicts", "high jury verdict trends", "awarded millions in damages"). PR11D adds 10
patterns for that class, neutralizes the 12 committed offender locations (across 8 files), and
leaves genuinely factual phrasing alone. Committed source/built offenders → 0; gate stays ~2.8s.

## Blind spot — proven live before the fix
`audit:legaltone` reported PASS, yet a non-protected committed scan found jury/verdict/award
prediction in 9 files / 12 locations (incl. `houston.ts` and `philadelphia.ts` `legalInfo`
fields, which sit OUTSIDE the FAQ answers PR11C fixed).

## Patterns added (10 new regexes, case-insensitive)
Scoped to PREDICTION/persuasion, deliberately NOT bare factual terms:
| Pattern | Catches | Does NOT catch |
|---|---|---|
| `county juries` | "Harris County juries", "Dallas County juries" | |
| `county jury (verdict\|award\|pool)` | "New York County jury verdicts" | |
| `juries (understand\|are (generally\|usually )?familiar\|have awarded)` | "juries understand…", "juries have awarded" | |
| `historically award` | "juries historically award(ing)" | |
| `(jury )?verdict trends?` | "jury verdict trends" | |
| `reputation for [a-z ]{0,30}verdicts?` | "reputation for significant verdicts" | |
| `substantial (jury )?awards?` | "substantial jury awards", "substantial awards" | "substantial damages/recovery" |
| `significant verdicts?` | "significant verdicts" | |
| `awarded (millions\|substantial)` | "have awarded millions/substantial" | bare "awarded"/"may be awarded" |
| `damage awards exceed` | "damage awards exceeding the average" | |

**Deliberately left in place** (factual, not persuasion): `specialized-attorneys.ts:175`
— *"Jury verdicts are public record in most jurisdictions"* — attorney-vetting advice, makes no
claim about local jury behavior or outcomes. The patterns above do not match it.

## Offender counts — before / after
**Committed source:** 12 offender locations across 8 files → **0**.
**Committed built** (fresh `rm -rf .next && npm run build`): stale build showed 24 artifacts
(from the 8 files) → after rebuild **0**.
Final gate: `committed source 0 | committed built 0` → **PASS** (exit 0), **2.81s**.

## What was neutralized (tone/safety only — no legal numbers/facts changed)
- `cities/texas/houston.ts` (legalInfo): "Harris County juries are generally familiar with commercial vehicle operations…" → "these courts regularly handle commercial vehicle litigation…".
- `cities/pennsylvania/philadelphia.ts` (legalInfo): "Philadelphia County juries having a reputation for significant verdicts…" → "damages are determined by the evidence and applicable Pennsylvania law".
- `cities/new-york/new-york.ts`: "familiar with New York County jury verdicts and settlement patterns" → "familiar with how New York wrongful-death law applies to the facts of each case".
- `cities/texas/fort-worth.ts` (×2): "substantial jury awards, particularly in Tarrant County where juries understand…" → "substantial recovery, with damages determined by the evidence of … loss".
- `cities/texas/dallas.ts` (×3): "Dallas juries have awarded" → "may apply"; "Dallas County juries historically awarding significant verdicts" → "with the amount determined by the evidence of loss"; "Dallas County courts have awarded substantial punitive damages" → "Punitive damages may be available".
- `cities/texas/san-antonio.ts` (×2): "have resulted in substantial awards due to…" → "are handled through established procedures…"; "have awarded millions in damages when…" → "damages may be awarded when…".
- `cities/california/san-jose.ts`: "reflect the region's high jury verdict trends" → "reflect the region's high cost of living".
- `blog/fmcsa-violations-truck-accidents.ts` (×2): "Courts and juries understand that a driver… is impaired" → "Research and expert testimony show…"; "When juries understand that a carrier knowingly violated safety rules, they're more likely to award substantial damages" → "Evidence that a carrier knowingly violated safety rules supports a claim for substantial damages".

## Preserved-dirty findings (reported, NOT edited — deployment blockers)
The new patterns also surface these protected/uncommitted dirty files (left exactly as-is):
`california/san-francisco`, `nevada/las-vegas`, `north-carolina/charlotte`, `oregon/portland`,
`tennessee/memphis`, `tennessee/nashville`, `washington/seattle` (+ 20 rendered artifacts). These
block production until the preserved enhancements are separately cleaned.

## Verification (run live this session)
- `audit:legaltone` → **PASS**, 2.81s (committed source 0 / built 0; preserved-dirty reported separately). Exit 0.
- `npx tsc --noEmit` → 0 errors.
- `npm run build` → exit 0 (full build; used as the built-scan surface).
- Scope: 8 content files + the gate; no protected dirty file edited.

## Remaining risks / next steps
- No SOL / legal-fact changes; statutes, caps, comparative-negligence, FMCSA citations untouched.
- Preserved-dirty files still carry banned phrasing — must be cleaned before production.
- `audit:quality` city-page duplication (pre-existing) still open.
- Gate matches text, not intent — new persuasion phrasings can still appear; treat the pattern
  list as living. Fable / human review still required before any production use.
