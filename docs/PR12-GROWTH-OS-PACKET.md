# PR12 — Growth OS foundation (recommendation-only)

Branch: `repair/pr1-restore-pr2-gate` (local, unpushed). Built only after PR11D went clean.

## TL;DR
A niche-agnostic adaptive content-growth skeleton: a **brain** (schemas + engine) and a
**scoreboard** (audit), with its **hands off** the website. It observes the real content surface
and emits approval-gated recommendations. It does not generate or write content, makes no network
calls, and fabricates no analytics. Demand/conversion signals are reported as UNAVAILABLE until
GSC/GA/CRM are wired.

## What shipped
| File | Role |
|---|---|
| `src/lib/growth/types.ts` | All schemas: `SiteConfig`, `ContentItem`, `PerformanceEvent`, `LeadOutcome`, `Opportunity`, `Recommendation`, `Experiment`, `GateResult`, plus `SiteAdapter`, `Signal`, `RiskAssessment`, and the `WorkflowState` lifecycle. |
| `src/lib/growth/engine.ts` | Deterministic engine: `proposeOpportunities()` + `recommend()`. Structural signals only; demand/conversion stay UNAVAILABLE; source confidence capped at `low` without outcome data. |
| `src/lib/growth/adapters/trucking.ts` | `SiteAdapter` over real repo metadata — enumerates city/state/accident/blog routes, derives word/FAQ counts from source prose, reuses `audit:quality` output for duplicate status. No analytics/CRM. |
| `scripts/growth/recommend.ts` (`npm run growth:recommend`) | Report-only proposals → `scripts/reports/growth-recommendations.json` + console. No page writes. |
| `scripts/growth/audit.ts` (`npm run growth:audit`) | Report-only scoreboard → `scripts/reports/growth-audit.json` + console. No page writes. |

Generated reports (`growth-recommendations.json`, `growth-audit.json`) are git-ignored — they are
outputs, not source.

## Workflow lifecycle
`proposed → approved → drafted → gated → published → measured`. The foundation only ever emits
`proposed`, and every `Recommendation` carries `requiredApproval: 'approved'`. Nothing
auto-advances; nothing publishes without human approval and passing the quality gates listed in
`SiteConfig.qualityGates` (`audit:legaltone`, `audit:quality`, `audit:localdata`, `audit:damage`).

## Recommendation contents (every record explains)
evidence (real structural facts) · demand (`Signal`, UNAVAILABLE) · conversionProxy (`Signal`,
UNAVAILABLE) · risk (`level` + `flags`, incl. `legal-tone-gate-required`) · duplicateStatus
(`unknown`/`unique`/`near-duplicate`) · sourceConfidence · requiredApproval · workflow state.

## Proof (run live this session, report-only, exit 0)
`npm run growth:audit`:
- 1,695 content items — city 1,613 / state 52 / accident-type 22 / blog 8.
- Below word floor: city 1,325, state 52, accident 22, blog 1. FAQ gaps: city 255, state 52, accident 22.
- near-duplicate items (from `audit:quality`): 68.
- Signal sources — demand: NOT CONNECTED (GSC) · traffic: NOT CONNECTED (GA) · leads: NOT CONNECTED (CRM).

`npm run growth:recommend`:
- 1,432 recommendations — 1,364 `improve`, 68 `consolidate`. (No `new`-page proposals: net-new
  pages need demand data that isn't measurable yet, and the system stays off content generation.)
- Every record: `sourceConfidence=low`, `requiredApproval=approved`, `state=proposed`.
- "No pages written, no content drafted."

Code quality: `npx tsc --noEmit` → 0 errors; `npx eslint src/lib/growth scripts/growth` → exit 0 (clean).

## Honesty / guardrails (what it deliberately CANNOT do)
- No network, no GSC/GA/CRM calls, no fabricated metrics — `performance()` and `leads()` return `[]`.
- No content drafts, no page writes — only JSON reports + console.
- `wordCount` is a structural proxy (word tokens inside source string/template literals), not the
  rendered SEO word count — flagged as structural; not a substitute for the real audits.
- Recommendations are proposals; the engine cannot approve, draft, or publish anything.

## Remaining risks / next steps (in order)
1. Clean the preserved-dirty files (legal-tone blockers from PR11C/PR11D) before any publish path.
2. Resolve `audit:quality` city-page duplication (68 near-duplicate items surfaced here).
3. Wire **read-only** real signals next: GSC (demand), GA (traffic), leads/CRM (conversion) →
   populate `PerformanceEvent`/`LeadOutcome`, raising source confidence above `low`.
4. Only after the feedback loop is real and gates are solid: add a drafting stage that still stops
   at `gated` for human approval before `published`.
- Fable / human review required before connecting any external data source or enabling drafting.
