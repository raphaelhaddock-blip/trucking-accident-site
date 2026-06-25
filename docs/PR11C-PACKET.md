# PR11C — Fast legal-tone gate + removal of committed city-page deferrals

Branch: `repair/pr1-restore-pr2-gate` (local, unpushed). Follows PR11B.

## TL;DR
PR11B left two problems: the `audit:legaltone` gate took ~110s (too slow/fragile for CI), and
its green status depended on allowlisting three **committed** risky city pages
(austin/houston/philadelphia). PR11C fixes both: the gate is rewritten Node-native and now runs
in ~2s, the three committed city FAQ answers are neutralized so nothing committed is hidden
behind a deferral allowlist, and preserved-dirty offenders are reported separately as
deployment blockers instead of being silently swallowed by the allowlist.

## 1. Gate performance — 110s → ~2s

**Root cause of the slowness:** the gate shelled out to `grep`. The interactive shell's `grep`
is a fast `ugrep` function, but `execSync` runs under `/bin/sh`, which resolves to **BSD grep
2.6** — that takes ~35s to recurse the 18,831-file `.next/server/app` tree (~110s end-to-end).
`LC_ALL=C` helps real GNU grep but not enough here, and no `ggrep` is installed. Depending on a
non-portable fast binary (`ugrep`/`rg`/`ggrep`) would make CI fragile.

**Fix:** the scan is now **Node-native** — `fs.readdirSync` to enumerate + `fs.readFileSync` +
one combined `RegExp`. No subprocess.

Measured (this session, `/usr/bin/time -p npx tsx scripts/quality/audit-legaltone.ts`):
| Version | real | user |
|---|---|---|
| PR11B (BSD grep via execSync) | 110.7s | 107.6s |
| PR11C (Node-native fs+RegExp) | **2.12s** | 1.72s |

Enumerate 1,706 `.html`: 131ms. Scan `.html`+`.rsc` (16,956 files): ~1.1s. Source scan: <0.5s.

**No silent swallowing.** PR11's gate was a no-op because it called `execSync` without importing
it and a `try/catch` returned `[]` on the throw → "clean" while checking nothing. The Node-native
scan has no subprocess to swallow; an unreadable directory throws out of `scan()`, caught only at
the top of `main()`, which prints `ERROR … failing closed` and exits **2** (never "clean").
`grep` exit-code ambiguity (1 = no-match vs ≥2 = error) is gone entirely.

## 2. Committed city-page deferrals removed (PR13_DEFERRED now empty)

PR11B allowlisted three committed files as "needs legal judgment". The prompt sanctioned removal
of un-neutralizable answers, which resolved the earlier STOP condition — this is claim *removal*,
not legal advice. All three were neutralized (persuasion → public-process / evidence-preservation
/ standard-of-care), keeping each page at 7 FAQs:

- **`texas/houston.ts`** — two edits:
  - Q "petrochemical industry impact": *"…making local juries aware of the serious consequences…"* → *"…which are documented in public records and regulatory filings relevant to hazmat transportation cases."*
  - Q "How do Harris County courts handle cases": dropped *"Local juries are generally familiar with…"* and *"Harris County juries have awarded substantial verdicts…"*; reframed to court assignment, Texas discovery rules, pleading standards, and "the same public procedures for evidence, discovery, and trial."
- **`texas/austin.ts`** — Q reworded from *"…settlements and jury verdicts?"* → *"…settlements?"*; answer stripped of *"Travis County juries understand intimately, often resulting in higher damage awards"*, *"making them receptive"*, *"potential jurors"*, *"making them sympathetic"*, *"local juries expect"* — reframed around duty/standard of care and objective damage factors (cost of living, medical costs, lost earnings). (The separate venue clause was already fixed in PR11B.)
- **`pennsylvania/philadelphia.ts`** — Q "challenges in Court of Common Pleas": dropped *"jury pool characteristics"*, *"Philadelphia juries tend to be more sympathetic"*, *"diverse jury pool"*, and the venue-shopping close (*"prefer to resolve cases outside Philadelphia County due to the court's reputation for substantial verdicts, making venue selection… critical"*). Kept legitimate process content (Commerce Program, local filing rules, exhibit logistics, out-of-state discovery, standard voir dire, settlement-conference/ADR case management) and reframed venue to the same statute/court-rule wording used on the state pages.

## 3. Offender counts — before / after

**Committed source** (`.ts`/`.tsx` under cities/states/accidents/blog content + `src/app`):
- Before PR11C: **3** committed offender files (austin, houston, philadelphia).
- After: **0**.

**Committed built output** (`.html`+`.rsc` under `.next/server/app`, fresh `rm -rf .next && npm run build`):
- Before PR11C (with old austin/houston/philadelphia compiled): their render artifacts matched.
- After: **0** committed-route offenders.

**Final gate:** `committed source offenders: 0 | committed built offenders: 0` → **PASS** (exit 0), 2.12s.

## 4. Allowlist policy (what "PASS" does and does not mean)

- **PRESERVED** set (19 hard-coded uncommitted enhancement files) is the *only* remaining
  allowlist. Their source matches and their derived `.next` render artifacts (matched by a
  `states/<state>/<city>` path needle) are **excluded from the clean count** but **reported
  separately** as preserved-only deployment blockers — never silently passed.
- **PR13_DEFERRED is empty.** No committed file is hidden behind an allowlist.
- `docs/` and the two tone scripts remain allowlisted (they quote the phrases by design).

## 5. Preserved-dirty findings (reported, NOT edited — deployment blockers)
These are in the protected 21-file dirty set; left exactly as-is per instruction:
- `src/lib/cities-content/california/san-francisco.ts` — `jury pool` (line 107)
- `src/lib/cities-content/washington/seattle.ts` — `jury pools` (line 120)
- `src/lib/cities-content/north-carolina/charlotte.ts` — `local judges` (lines 49, 120)

Plus 4 rendered `.next` artifacts from the above (san-francisco/seattle). These must be cleaned
when the preserved enhancements are separately addressed; they block production until then.

## 6. Verification (run live this session)
- `audit:legaltone` → **PASS**, **2.12s** (committed source 0 / built 0; preserved-dirty reported separately). Exit 0.
- `audit:localdata` → PASS (structure errors 0; render-safety 27 passed, 0 failed).
- `audit:damage` → KEEP_WT 19 (preserved enhanced files; informational).
- `audit:quality` → exit 1, **pre-existing** city-pair duplication (e.g. coral-springs↔pompano-beach); confirmed none of austin/houston/philadelphia appear in the flagged pairs — not introduced by PR11C.
- placeholder scan (`[NEEDS ENHANCEMENT]`) → 0.
- `npx tsc --noEmit` → 0 errors.
- `npm run lint` → 60 pre-existing eslint errors / 2,272 warnings; **none in any file PR11C touched**; `next build` ignores them.
- `npm run build` → exit 0 (full 1,600+ page build, used as the built-scan surface).

## 7. Remaining SOL / provenance risk
- **No SOL / legal-fact changes** in PR11C — edits remove jury/venue persuasion and reframe to
  public-process wording. Statutes of limitations, comparative-negligence rules, damage caps,
  FMCSA citations untouched.
- `audit:quality` city-page duplication (pre-existing) is unrelated to legal tone and remains open.
- Preserved-dirty files (san-francisco/seattle/charlotte) still carry banned phrasing and block
  production until cleaned.
- Fable / human review still required before any production use of this branch.
