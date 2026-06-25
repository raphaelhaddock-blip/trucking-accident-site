# PR11B — Court/jury/venue persuasion cleanup + gate repair

Branch: `repair/pr1-restore-pr2-gate` (local, unpushed). Follows PR11 (commit `ec498fc`).

## TL;DR
PR11 shipped an `audit:legaltone` gate that was **silently checking nothing**, and ~50 state
pages still rendered court/jury/venue persuasion language ("the judges who will hear your case",
"juries evaluate", "jury pools", "judicial tendencies", "local fact-finders"). PR11B fixes the
gate so it actually runs, expands its banned set to cover this persuasion language, and
neutralizes the offending state-page copy into public-process wording. Three city FAQ answers
whose neutralization needs legal judgment are deferred to PR13/Fable.

## Root-cause finding — the gate was a no-op
`scripts/quality/audit-legaltone.ts` called `execSync(...)` inside `grepFiles()` but **never
imported it**. Every call threw `ReferenceError: execSync is not defined`, which the surrounding
`try/catch` swallowed, returning `[]`. Result: the gate found 0 offenders on **every** run
regardless of content — it passed PR11 review while checking nothing.

Fix: `import { execSync } from 'node:child_process'`, plus a rewrite of the scan to a single
fast `grep -rIlEi` file-list pass with a labeled `grep -IohEi` second pass run **only** on real
(non-allowlisted) offenders — so the scan stays fast even over the 1,600-page `.next` tree.
(The naive `grep -rIoEi` first pass took long enough over `.next` to look like a hang.)

## Banned phrases/patterns added (8 new regexes)
Added to `BANNED_REGEX` in `scripts/quality/audit-legaltone.ts` (ERE, case-insensitive,
covering singular/plural/possessive):

| Pattern | Catches |
|---|---|
| `judges? who will hear (your\|the) case` | "judges/judge who will hear your/the case" |
| `juries evaluate` | "juries evaluate" |
| `jury pools?` | "jury pool", "jury pools", "jury pool's" |
| `judicial tendenc(y\|ies)` | "judicial tendency", "judicial tendencies" |
| `local fact-?finders?` | "local fact-finder(s)", "local factfinders" |
| `local juries?` | "local jury", "local juries" |
| `what evidence resonates` | "what evidence resonates" |
| `choosing the right venue` | "choosing the right venue" |

The 20 prior fixed-string bans are retained (now ERE-escaped and folded into one combined
pattern). The gate now scans **both** source (`src/lib/{cities,states,accidents,blog}-content`,
`src/app`) **and** built output (`.next/server/app`).

## Offender counts — before / after

**Source (committed HEAD → working tree):**
- Before: **53** distinct offender files — 50 state pages + `cities-content/texas/austin.ts`,
  `cities-content/texas/houston.ts`, `cities-content/pennsylvania/philadelphia.ts`.
  (Per-phrase, each appeared on all 50 state pages: judges-who-will-hear ×50, juries-evaluate
  ×50, judicial-tendencies ×50, local-fact-finders ×50, jury-pools ×51, local-jury ×50.)
- After: **0 actionable**. 50 state pages + the austin venue clause neutralized; 3 city FAQ
  files deferred (PR13, allowlisted); 2 preserved files carry phrases in the working tree only
  (allowlisted).

**Built output (`.next/server/app`):**
- Stale pre-fix build (prior session): **203** offender files.
- Fresh post-fix build (`rm -rf .next && npm run build`): **16** built artifacts, all compiled
  from allowlisted city sources (san-francisco / philadelphia / austin / houston). The gate now
  derives a `states/<state>/<city>` built-path needle for every allowlisted city source, so
  these render artifacts are excluded too. **0 actionable** built offenders.

Final gate: `source offenders: 0 | built offenders: 0` → **PASS** (exit 0).

## What was neutralized (tone/safety only — no legal numbers/facts changed)

All 50 `src/lib/states-content/*.ts` files, three uniform persuasion→process swaps:

1. **courtInfo venue sentence**
   - was: *"Choosing the right venue can impact case outcomes based on local jury pools and judicial tendencies."*
   - now: *"Venue is governed by state statute and court procedure based on where the crash occurred and where the parties are located."*
2. **whyHireLocal — court-knowledge clause**
   - was: *"…local procedures, and the judges who will hear your case."*
   - now: *"…local procedures, and the procedural rules that govern each case."*
3. **whyHireLocal — jury-prediction sentence**
   - was: *"They understand how <State> juries evaluate trucking company negligence and what evidence resonates with local fact-finders."*
   - now: *"They understand how state law applies to trucking-company negligence and how to preserve and present evidence — driver logs, ELD data, and maintenance records — through proper court procedure."*

Plus one city clause, `src/lib/cities-content/texas/austin.ts` (a discrete, removable clause):
   - was: *"Legal strategies must account for Austin's educated, tech-savvy jury pool that expects companies to utilize available technology…"*
   - now: *"Legal strategies must account for the standard of care expected of carriers operating in a technology-intensive region, where available technology…"* (reframed to standard-of-care; drops jury prediction).

Done deterministically via a scripted exact-string / single-regex replacement — no per-file
hand edits, no template existed to fix once (the 50 strings are literal copies with the state
name baked in).

## Routes / files changed
- `scripts/quality/audit-legaltone.ts` — gate repair + expansion (execSync import, combined
  regex scan, two-pass speed fix, 8 new patterns, built-path allowlist derivation, PR13 set).
- `src/lib/states-content/*.ts` — **50 files**, three swaps each (renders `/states/<slug>`).
- `src/lib/cities-content/texas/austin.ts` — one venue clause (renders `/states/texas/austin`).

Rendered routes affected: all 50 `/states/<slug>` pages + `/states/texas/austin`.

## Deferred to PR13 (legal judgment required — STOP condition)
These are **whole FAQ answers** built on predicting local jury sympathy / verdict tendencies,
not single-clause swaps. Neutralizing them is a judgment call about permissible
attorney-advertising claims and would substantially rewrite or remove the answers — that is a
Fable + Raphy decision, not a mechanical swap. Allowlisted in the gate so the suite stays green
while the work is tracked:

- `src/lib/cities-content/texas/austin.ts` (line ~145) — *"Travis County juries understand intimately, often resulting in higher damage awards…"*, *"making them sympathetic to victims"*. (The separate venue clause WAS neutralized; this FAQ answer is deferred.)
- `src/lib/cities-content/texas/houston.ts` — *"Local juries are generally familiar with…"*, *"Harris County juries have awarded substantial verdicts…"*.
- `src/lib/cities-content/pennsylvania/philadelphia.ts` — *"Philadelphia juries tend to be more sympathetic…"*, *"the court's reputation for substantial verdicts…"*, venue-shopping framing throughout.

## Preserved-file findings (flagged, NOT edited)
The PR1/PR2 preserved-enhancement files (held uncommitted on this branch, out of scope) carry
court/jury persuasion in the working tree and must be cleaned when they are separately
addressed:
- `src/lib/cities-content/washington/seattle.ts` — "jury pool", "jury pools".
- `src/lib/cities-content/california/san-francisco.ts` — "jury pool".
Both are allowlisted in the gate (preserved set). Their built artifacts are excluded via the
same built-path needle mechanism.

## Verification (all run live this session)
- `audit:legaltone` → PASS (source 0, built 0; excl. preserved/docs/PR13).
- `audit:localdata` → PASS (structure errors 0; render-safety 27 passed, 0 failed).
- `audit:damage` → KEEP_WT 20 (the preserved enhanced files; informational).
- `audit:quality` → pre-existing city-pair duplication (e.g. coral-springs↔pompano-beach);
  **unchanged by PR11B** — PR11B touched state pages + the austin clause, none of those city pairs.
- placeholder scan (`[NEEDS ENHANCEMENT]` in cities-content) → 0.
- `npx tsc --noEmit` → 0 errors.
- `npm run lint` → exit 0; 60 pre-existing eslint errors remain (module-assign in
  `cities-content/index.ts`, unused vars in `page.tsx`/`faq.ts`) — none in any file PR11B
  touched; `next build` ignores them.
- `npm run build` → exit 0 (full 1,600+ page build).

## Remaining SOL / provenance risk
- **No SOL or legal-fact changes** were made — all edits are tone/venue persuasion → neutral
  process wording. Statutes of limitations, comparative-negligence rules, damage caps, FMCSA
  citations untouched.
- The 3 PR13 city FAQ answers + 2 preserved city files still contain jury/venue persuasion;
  they are gated-out, not fixed, and need Fable + Raphy review before production.
- Fable / human review is still required before any production use of this branch.
