# Growth OS — Adding a New Site

The Growth OS is niche-agnostic. To grow a *different* site (construction, another vertical), you implement **two adapters** and reuse everything else — engine, rankability gate, ledger, interlink, daily report, and tests all work unchanged.

## What you implement (2 files)

### 1. `SiteAdapter` — the data source (`src/lib/growth/adapters/<site>.ts`)
Turns the site's real content into `ContentItem[]` from repo metadata only. Copy `adapters/trucking.ts` and change:
- `config()` — siteId, niche, domain, routeKinds, qualityGates.
- `listContent()` — enumerate the site's content modules → `{ id, kind, route, filePath, wordCount, faqCount, source:'repo-metadata' }`.
- `performance()` / `leads()` — return `[]` until real sources are wired. **Never fabricate.**
- `duplicateMap()` — optional, from the site's quality audit.

### 2. `TaxonomyAdapter` — classification + ontology (`src/lib/growth/adapters/<site>-taxonomy.ts`)
Copy `adapters/trucking-taxonomy.ts` and define:
- `classify(item)` — derive geo/topic/intent/funnelStage from id/route (deterministic, no guessing).
- `ontologyRules()` — the typed edge rules + caps for the niche.
- `neighbors(item, index)` — resolve bounded parent/siblings/relatedTopics.

## What you reuse unchanged
- `engine.ts` — opportunities + recommendations from your thresholds.
- `rankability.ts` — evidence requirements + net-new refusal.
- `ledger.ts` — learning ledger schema.
- `interlink.ts` — ontology-driven link plans.
- `sources.ts` — source/evidence registry (mark a connector `available` only when truly wired).
- `scripts/growth/daily-report.ts` + `selftest.ts` — point them at your adapters.

## Wiring
1. Add scripts: `growth:daily`, `growth:test`, `growth:recommend` pointing at your adapter imports.
2. Gitignore the report dir: `scripts/reports/growth/`.
3. Run `npm run growth:test` (invariants must pass) then `npm run growth:daily` (dry-run report).

## Invariants every site inherits
- 100% taxonomy coverage; bounded ontology (caps enforced).
- Net-new content **refused** until a real demand source is connected.
- Ledger outcomes stay `planned`/`UNAVAILABLE` — no fabricated analytics.
- Recommendation-only: nothing past `proposed`, no content drafted, no network, no deploy.

## Order of operations (per site)
Make the system smart (taxonomy/ontology/gates/tests) → launch the site → *then* connect live data (GSC/GA/CRM). Connecting demand before a site is live and indexed yields no usable signal.
