# Growth OS Standard — Taxonomy + Ontology Requirement

**Status: required standard for every site we build. Not yet implemented on this site.**
PR12 built the Growth OS brain skeleton (`src/lib/growth/`, recommendation-only, real repo-metadata only — see [PR12-GROWTH-OS-PACKET.md](PR12-GROWTH-OS-PACKET.md)). Taxonomy + ontology is the **next** Growth OS foundation, and it must exist **before** content is scaled.

> Hard rule: **new content must fit the taxonomy and ontology before anyone drafts it.** A page with no place in the map, or no defined relationships, does not get written. This gates content the same way `audit:legaltone` gates legal tone.

---

## Taxonomy — the organized category system
The named buckets the site is built from. For this trucking site:

| Axis | This site |
|------|-----------|
| Service categories | Truck-accident legal representation (one service; differentiated by accident mechanism + jurisdiction) |
| Topic clusters | accident-type · state law · city-local · FMCSA/regulation · evidence preservation · settlement/compensation · blog/news |
| Subtopics | per accident mechanism (jackknife, underride…), per state rule (SOL, comparative negligence), per corridor |
| Locations / markets | 50 states · ~1,613 cities · major freight corridors |
| Customer intent stages | just-injured (urgent) → researching liability/process → comparing options → ready to contact |
| Page types (`RouteKind`) | home · accidents index · accident-type · states index · state · city · blog index · blog · FMCSA · contact · legal/about |
| Evidence types | ELD/black-box · driver logs · maintenance records · FMCSA violations · police report · medical records |
| Conversion paths | hero CTA → case-eval form · sticky bar → call · in-content link → contact |
| Content actions | improve · new · consolidate · fix (matches PR12 `OpportunityKind`) |

## Ontology — the relationships between those things
How the buckets connect. For this trucking site:

- **Topics → money pages:** which accident-type / regulation topics support which state + city pages.
- **Services → problems:** each accident mechanism maps to the FMCSA violation(s) that prove negligence.
- **Locations → proof points:** each state page needs its SOL + comparative-negligence rule; each city its FARS data + corridors.
- **FAQs → entities:** which FAQ belongs under which page type (drives `FAQPage` schema placement).
- **Schema/entity rules:** which schema types apply per page type — LegalService, Article, FAQPage, BreadcrumbList, ContactPage, WebSite.
- **Internal-link rules:** city → parent state → accident-type deep pages; accident-type → related accidents + top states; nothing orphaned.
- **Content gaps → briefs:** a missing state, mechanism, or corridor becomes a proposed brief (PR12 `Opportunity` kind `new`).
- **Outcomes → scale decisions:** which topics/relationships actually produce traffic, leads, and clients (the learning ledger).

## Every site must have
1. A taxonomy map (the table above, as data the Growth OS can read).
2. An ontology map (the relationships above, as a graph the Growth OS can read).
3. Internal-link rules derived from the map.
4. Schema/entity rules derived from the map.
5. A **learning ledger** recording which topics + relationships produce traffic, leads, and customers.
6. The hard rule above: new content must fit the taxonomy/ontology before drafting.

## How this plugs into the existing PR12 brain
- Taxonomy classifies each `ContentItem` (PR12 already lists items from real repo metadata) onto the axes above.
- Ontology becomes the relationship graph the engine reads to generate `Opportunity` + `Recommendation` (gap → brief, orphan → link, thin → improve).
- The learning ledger is PR12's `PerformanceEvent` + `LeadOutcome` — **deliberately unwired today** (no GSC/GA/CRM). Until a real source is connected, outcome signals stay `available:false`. No fabricated analytics.
- Approval stays required: recommendations never auto-advance past `proposed`.

## Out of scope for the current redesign work
This document is the **standard**, not its implementation. The redesign track (`redesign/next-gen-legal-platform`) continues UI/image work only. Building the taxonomy/ontology data + wiring it into `src/lib/growth/` is a separate Growth OS task — and it must land before real content scaling.
