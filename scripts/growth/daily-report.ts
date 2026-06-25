/**
 * growth:daily — Autonomous Growth OS daily DRY-RUN report (recommendation-only).
 *
 * Composes the whole foundation against the REAL site, deterministically, with zero side effects on
 * content: inventory → taxonomy classification → ontology mapping → rankability gate → structural
 * recommendations → ontology-driven interlink plan → learning-ledger PLAN.
 *
 * Guarantees: no network, no analytics fabrication, no content drafted, no pages written, no deploy.
 * Net-new content is REFUSED (no demand source wired). Demand/conversion stay UNAVAILABLE.
 *
 * Output: scripts/reports/growth/daily-<date>.json + ledger-<date>.jsonl + console summary. Exit 0.
 * Run: npx tsx scripts/growth/daily-report.ts   (npm run growth:daily)
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { truckingAdapter } from '../../src/lib/growth/adapters/trucking';
import { truckingTaxonomy } from '../../src/lib/growth/adapters/trucking-taxonomy';
import { buildIndex } from '../../src/lib/growth/taxonomy';
import { proposeOpportunities, recommend } from '../../src/lib/growth/engine';
import { assessRankability } from '../../src/lib/growth/rankability';
import { deriveLinkPlan } from '../../src/lib/growth/interlink';
import { planEntry, toJsonl, type LedgerEntry, type MoveType } from '../../src/lib/growth/ledger';
import { UNAVAILABLE } from '../../src/lib/growth/types';

const TOP_N = 15;

function tally<T>(arr: T[], key: (t: T) => string): Record<string, number> {
  return arr.reduce<Record<string, number>>((a, x) => { const k = key(x); a[k] = (a[k] ?? 0) + 1; return a; }, {});
}

function main() {
  const generatedAt = new Date().toISOString();
  const date = generatedAt.slice(0, 10);
  const adapter = truckingAdapter();
  const tax = truckingTaxonomy();

  // 1) INVENTORY (real repo metadata)
  const items = adapter.listContent();
  const index = buildIndex(items, tax);

  // 2) CLASSIFY into taxonomy
  const classifications = items.map((it) => tax.classify(it));
  const taxonomy = {
    byKind: tally(classifications, (c) => c.routeKind),
    byIntent: tally(classifications, (c) => c.intent),
    byFunnel: tally(classifications, (c) => c.funnelStage),
    byGeoLevel: tally(classifications, (c) => c.geo.level),
    dimensions: tax.dimensions,
    version: tax.taxonomyVersion,
  };

  // 3) ONTOLOGY mapping (bounded neighbors + graph-integrity stats)
  const cities = items.filter((i) => i.kind === 'city');
  let cityOrphans = 0;
  for (const c of cities) if (!tax.neighbors(c, index).parent) cityOrphans++;
  const ontology = {
    rules: tax.ontologyRules(),
    statesWithPages: index.stateBySlug.size,
    statesWithCities: index.citiesByState.size,
    cityCount: cities.length,
    cityOrphans, // cities whose parent state page is missing → graph gap
    sampleNeighbors: ['city:texas/houston', 'state:texas', 'accident:jackknife-accidents']
      .filter((id) => index.byId.has(id))
      .map((id) => ({ id, neighbors: tax.neighbors(index.byId.get(id)!, index) })),
  };

  // 4) STRUCTURAL OPPORTUNITIES + RECOMMENDATIONS (existing engine — real thresholds)
  const opportunities = proposeOpportunities(adapter);
  const recommendations = recommend(opportunities);

  // 5) RANKABILITY gate over each opportunity (+ explicit net-new refusal probe)
  const dupMap = adapter.duplicateMap?.() ?? {};
  const verdicts = opportunities.map((o) => {
    const item = o.contentId ? index.byId.get(o.contentId) : undefined;
    const classification = item ? tax.classify(item) : undefined;
    const neighbors = item ? tax.neighbors(item, index) : undefined;
    const meetsStructuralThresholds = !o.risk.flags.includes('thin-content') && !o.risk.flags.includes('insufficient-faqs');
    return assessRankability({
      contentId: o.contentId ?? 'site',
      moveKind: o.kind,
      classification, neighbors,
      demand: o.demand, conversionProxy: o.conversionProxy,
      duplicateStatus: (o.contentId && dupMap[o.contentId]) || 'unknown',
      meetsStructuralThresholds,
    });
  });
  // Net-new probe: even a perfectly-placed new page is refused without demand evidence.
  const probeItem = cities[0];
  const newRefusalProbe = probeItem ? assessRankability({
    contentId: 'city:<hypothetical-new>',
    moveKind: 'new',
    classification: tax.classify(probeItem),
    neighbors: tax.neighbors(probeItem, index),
    demand: UNAVAILABLE, conversionProxy: UNAVAILABLE,
    duplicateStatus: 'unique', meetsStructuralThresholds: true,
  }) : null;
  const refusedDrafts = verdicts.filter((v) => v.refusesDraft).length;

  // 6) INTERLINK plans (ontology-driven) — sample + graph-gap count
  const linkSamples = ontology.sampleNeighbors.map((s) => {
    const it = index.byId.get(s.id)!;
    return deriveLinkPlan(it, tax.classify(it), s.neighbors, index);
  });

  // 7) DAILY MOVES (top N), each with why + evidence + missing-evidence
  const verdictById = new Map(verdicts.map((v) => [v.contentId, v]));
  const moves = recommendations.slice(0, TOP_N).map((r) => {
    const v = verdictById.get(r.opportunityId.replace(/^opp:[a-z]+:/, ''));
    return {
      action: r.action,
      why: r.risk.flags.join(', '),
      evidence: r.evidence,
      missingEvidence: v?.missingEvidence ?? ['(no rankability verdict)'],
      rankable: v?.rankable ?? false,
      sourceConfidence: r.sourceConfidence,
      requiredApproval: r.requiredApproval,
      state: r.state,
    };
  });

  // 8) LEARNING LEDGER — PLAN only (outcomes 'planned', metrics UNAVAILABLE)
  const ledger: LedgerEntry[] = recommendations.slice(0, TOP_N).map((r) =>
    planEntry({
      ts: generatedAt,
      moveType: (r.opportunityId.split(':')[1] as MoveType) ?? 'fix',
      contentId: r.opportunityId.replace(/^opp:[a-z]+:/, ''),
      decision: r.action,
      evidenceRefs: r.evidence,
    }));
  if (newRefusalProbe) ledger.push(planEntry({
    ts: generatedAt, moveType: 'new-refused',
    decision: 'Net-new page generation refused — no demand evidence wired.',
    evidenceRefs: newRefusalProbe.missingEvidence.map((m) => `missing:${m}`),
  }));

  const report = {
    generatedAt, date, mode: 'dry-run / recommendation-only',
    guarantees: { writesContent: false, network: false, fabricatesAnalytics: false, deploys: false, draftsNetNew: false },
    config: adapter.config(),
    inventory: { contentItems: items.length, byKind: taxonomy.byKind },
    taxonomy,
    ontology,
    signals: { demand: UNAVAILABLE, conversion: UNAVAILABLE, structural: 'available (repo metadata + audit:quality)' },
    rankability: {
      opportunities: opportunities.length,
      refusedDrafts,
      netNewRefusal: newRefusalProbe,
    },
    interlink: { graphGaps_cityOrphans: cityOrphans, samplePlans: linkSamples },
    moves,
    ledgerPlanned: ledger.length,
  };

  const dir = join(process.cwd(), 'scripts/reports/growth');
  mkdirSync(dir, { recursive: true });
  const reportPath = join(dir, `daily-${date}.json`);
  const ledgerPath = join(dir, `ledger-${date}.jsonl`);
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  writeFileSync(ledgerPath, toJsonl(ledger));

  // Console summary
  console.log('=== AUTONOMOUS GROWTH OS — DAILY DRY-RUN ===');
  console.log(`generatedAt: ${generatedAt}`);
  console.log(`inventory: ${items.length} pages | byKind ${JSON.stringify(taxonomy.byKind)}`);
  console.log(`taxonomy: intent ${JSON.stringify(taxonomy.byIntent)} | funnel ${JSON.stringify(taxonomy.byFunnel)}`);
  console.log(`ontology: ${ontology.statesWithCities} states-with-cities, ${ontology.cityCount} cities, ${ontology.cityOrphans} orphan cities (graph gap)`);
  console.log(`rankability: ${opportunities.length} opportunities | ${refusedDrafts} draft-refusals`);
  console.log(`net-new drafting: ${newRefusalProbe ? (newRefusalProbe.refusesDraft ? 'REFUSED' : 'allowed') : 'n/a'} — missing: ${newRefusalProbe?.missingEvidence.join(', ')}`);
  console.log(`signals: demand=UNAVAILABLE conversion=UNAVAILABLE (no analytics/CRM wired) — nothing fabricated`);
  console.log(`\nTop moves (${moves.length}):`);
  moves.slice(0, 8).forEach((m) => {
    console.log(`• ${m.action}`);
    console.log(`    why: ${m.why} | missing-evidence: ${m.missingEvidence.join(', ')} | approval: ${m.requiredApproval}`);
  });
  console.log(`\nWrote ${reportPath}`);
  console.log(`Wrote ${ledgerPath} (${ledger.length} PLANNED entries, outcomes UNAVAILABLE — no analytics fabricated)`);
  console.log('No content drafted. No pages written. No network. No deploy.');
}
main();
