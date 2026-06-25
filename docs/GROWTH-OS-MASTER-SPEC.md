# Autonomous Growth OS — Master Spec

The control system for growing this site's organic footprint **safely**: it inventories the site, classifies every page, maps how pages relate, and proposes the next best moves — but it drafts no content, invents no analytics, and ships nothing without a human. This spec is the source of truth; the taxonomy/ontology standard it enforces lives in [GROWTH-OS-TAXONOMY-ONTOLOGY.md](GROWTH-OS-TAXONOMY-ONTOLOGY.md).

Status: **foundation built, recommendation-only.** Verified on the real site (1695 pages) via `npm run growth:daily`.

> Phone note: the placeholder contact number remains; replace before production launch. Not Growth-OS work.

## Principles (non-negotiable)
1. **Evidence or it doesn't happen.** Every move states its evidence and what evidence is missing. No move proceeds past `proposed` without a human.
2. **Never fabricate a number.** Demand/conversion signals are `UNAVAILABLE` until a real source (GSC/GA/CRM) is wired. The engine reports `available:false` rather than guess.
3. **Refuse content without grounding.** Net-new page drafting is refused unless taxonomy + ontology placement + real demand evidence all exist. In the foundation that means net-new is always refused (no demand source yet) — by design.
4. **Recommendation-only.** Nothing here writes pages, edits templates, calls the network, connects paid APIs, or deploys.
5. **Deterministic.** Same repo state → same report. No randomness.

## Architecture (modules)
| Concern | File | Role |
|---|---|---|
| Core types + honest defaults | `src/lib/growth/types.ts` | ContentItem, Signal (`UNAVAILABLE`), Opportunity, Recommendation, SiteAdapter |
| Taxonomy + ontology model | `src/lib/growth/taxonomy.ts` | dimensions, `PageClassification`, `OntologyEdge`/rules, `ContentIndex`, `buildIndex` |
| Recommendation engine | `src/lib/growth/engine.ts` | structural opportunities + approval-gated recommendations |
| Rankability gate | `src/lib/growth/rankability.ts` | evidence requirements + **refusal** logic |
| Learning ledger | `src/lib/growth/ledger.ts` | append-only move/outcome schema; PLAN-only constructors |
| Interlink rules | `src/lib/growth/interlink.ts` | ontology-driven per-page link plan |
| Site adapter (data) | `src/lib/growth/adapters/trucking.ts` | real repo metadata → ContentItems |
| Taxonomy adapter (classify) | `src/lib/growth/adapters/trucking-taxonomy.ts` | classify + ontology neighbors |
| Source/evidence registry | `src/lib/growth/sources.ts` | declares which connectors are available vs FUTURE + what they gate |
| Daily report | `scripts/growth/daily-report.ts` (`npm run growth:daily`) | composes all → dry-run report + ledger plan |
| Invariant tests | `scripts/growth/selftest.ts` (`npm run growth:test`) | 10 checks: coverage, ontology caps, net-new refusal, ledger honesty, interlink, source rules |

A second site reuses everything except the two adapters: implement `SiteAdapter` (data) + `TaxonomyAdapter` (classification/ontology) for the new niche and the engine, rankability, ledger, interlink, and daily report work unchanged. Step-by-step: [GROWTH-OS-ADD-A-SITE.md](GROWTH-OS-ADD-A-SITE.md).

## Taxonomy (how a page is classified)
Four orthogonal dimensions, all **derived** from route/id (never guessed):
- **geo** — `national | state | city` (+ state/city slugs)
- **topic** — accident mechanism (`jackknife-accidents`…), `general-truck-accident`, or blog slug
- **intent** — `transactional` (city/state/accident) vs `informational` (blog)
- **funnelStage** — `decision` (local pages) · `consideration` (accident topics) · `awareness` (blog)

Live distribution (2026-06-25): 1613 city / 52 state / 22 accident / 8 blog; intent 1687 transactional / 8 informational.

## Ontology (how pages relate)
Typed edges with per-page caps so the graph never explodes (1,600 cities × 20 topics is never materialized):
- `child_of` — city → state, state → national hub
- `sibling` — same-state cities (cap 6); accident types to each other (cap 6)
- `related_topic` — geo page ↔ priority accident types (cap 4)
- `parent_of` / `hub_spoke` — state hub → its cities

Graph-integrity check in the daily report: **orphan cities** (a city whose parent state page is missing). Currently 0.

## Rankability gate (the enforcement point)
Evidence classes: `taxonomy-classification`, `ontology-placement`, `demand-signal`, `structural-quality`, `non-duplicate`. Requirements by move:
- **new** → taxonomy + ontology + **demand-signal** + non-duplicate → *refused* whenever any is missing (today: always, no demand source)
- **improve** → taxonomy + ontology + structural-quality
- **consolidate** → taxonomy + non-duplicate
- **fix** → taxonomy

The verdict lists `presentEvidence`, `missingEvidence`, `rankable`, and `refusesDraft`. `score` stays `null` until a real demand source exists.

## Source / evidence rules
| Signal | Source | Status | Effect |
|---|---|---|---|
| Structural (word/FAQ counts, routes) | repo metadata | available | drives improve/fix/consolidate |
| Duplicate status | `audit:quality` report | available when present | drives consolidate |
| Demand (impressions/clicks/position) | GSC/keywords | **UNAVAILABLE** | blocks net-new; caps confidence at `low` |
| Conversion (leads/qualified) | CRM/forms | **UNAVAILABLE** | blocks ranking by ROI |

Source confidence is bounded by the weakest input; with no demand/conversion data it can never exceed `low`, and the report says so.

## Learning ledger
Append-only JSONL (`scripts/reports/growth/ledger-<date>.jsonl`). Each entry: move type, contentId, decision, evidence refs, approval state (`proposed`), and an outcome. **Outcomes are `planned` with `UNAVAILABLE` metrics** until a real analytics source is connected — the ledger records intent, never invented results. When GSC/GA/CRM are wired, outcomes flip to `observed` with real metrics and the system can learn which move types pay off.

## Internal-link rules (from ontology)
Per page, `deriveLinkPlan` emits **required** links (graph integrity, e.g. city → state) and **suggested** links (siblings, related topics). It proposes links a template/human should ensure exist; it writes no anchors and authors no copy.

## Approval gates (workflow)
`proposed → approved → drafted → gated → published → measured`. The foundation only ever emits `proposed`. Before anything could reach `published` it must pass the site quality gates (`audit:legaltone`, `audit:quality`, `audit:localdata`, `audit:damage`) **and** explicit human approval. Net-new drafting is additionally blocked at the rankability gate.

## Daily growth moves (the dry-run)
`npm run growth:daily` → `scripts/reports/growth/daily-<date>.json` + console summary. Composes inventory → classify → ontology → rankability → recommend → interlink → ledger plan. Pure dry-run: no content, no network, no deploy, net-new refused.

## Definition-of-done → where satisfied
- Inventory the site → `truckingAdapter.listContent()` (1695)
- Classify into taxonomy → `truckingTaxonomy.classify()` + report distribution
- Map ontology relationships → `neighbors()` + orphan check + edge rules
- Dry-run daily report → `growth:daily`
- Say why a move is recommended → `Recommendation.rationale`/`risk.flags`/`evidence`
- Say what evidence is missing → `RankabilityVerdict.missingEvidence`
- Refuse drafting without taxonomy/ontology/rankability evidence → rankability gate (`refusesDraft`); net-new refusal proven in report
- Store/report-plan outcomes without fabricating analytics → ledger PLAN entries, `UNAVAILABLE` metrics

## Not built yet (deliberate) / next
- Wiring real demand (GSC) + conversion (CRM/forms) sources — these unlock net-new and ROI ranking. **Paid/real-source connection is a separate, approved step.**
- Content drafting remains gated behind the rankability gate even after sources are wired (human approval still required).
- **FABLE review recommended** for this taxonomy/ontology data model before it becomes load-bearing across multiple sites.
