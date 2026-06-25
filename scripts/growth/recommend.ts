/**
 * growth:recommend — Growth OS recommendation report (PR12 foundation, RECOMMENDATION-ONLY).
 *
 * Emits proposals for humans. It does NOT write or draft any page/content, makes no network
 * calls, and fabricates no analytics. Every recommendation states its evidence, demand and
 * conversion signals (UNAVAILABLE until GSC/GA/CRM are wired), risk, duplicate status, source
 * confidence, required approval, and workflow state ('proposed').
 *
 * Output: scripts/reports/growth-recommendations.json + console summary. Exit 0 (not a gate).
 *
 * Run: npx tsx scripts/growth/recommend.ts   (npm run growth:recommend)
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { truckingAdapter } from '../../src/lib/growth/adapters/trucking';
import { proposeOpportunities, recommend } from '../../src/lib/growth/engine';

function main() {
  const adapter = truckingAdapter();
  const opportunities = proposeOpportunities(adapter);
  const recommendations = recommend(opportunities);
  const generatedAt = new Date().toISOString();

  const byKind = recommendations.reduce<Record<string, number>>((acc, r) => {
    const k = r.opportunityId.split(':')[1] ?? 'other';
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});

  const report = {
    generatedAt,
    mode: 'recommendation-only',
    writesPages: false,
    config: adapter.config(),
    totals: {
      contentItems: adapter.listContent().length,
      opportunities: opportunities.length,
      recommendations: recommendations.length,
      byKind,
    },
    signalSources: {
      demand: 'unavailable (no GSC/GA)',
      conversion: 'unavailable (no CRM/leads)',
      structural: 'available (repo metadata + audit:quality)',
    },
    recommendations,
  };

  mkdirSync(join(process.cwd(), 'scripts/reports'), { recursive: true });
  const out = join(process.cwd(), 'scripts/reports/growth-recommendations.json');
  writeFileSync(out, JSON.stringify(report, null, 2));

  console.log('=== GROWTH OS — RECOMMENDATIONS (recommendation-only) ===');
  console.log(`content items: ${report.totals.contentItems} | opportunities: ${opportunities.length} | recommendations: ${recommendations.length}`);
  console.log(`by kind: ${JSON.stringify(byKind)}`);
  console.log('demand/conversion signals: UNAVAILABLE (no analytics/CRM wired) — source confidence capped at "low"');
  recommendations.slice(0, 10).forEach((r) => {
    console.log(`\n• ${r.action}`);
    console.log(`    risk=${r.risk.level} [${r.risk.flags.join(', ')}] | duplicate=${r.duplicateStatus} | sourceConfidence=${r.sourceConfidence}`);
    console.log(`    evidence: ${r.evidence.join('; ')}`);
    console.log(`    requiredApproval=${r.requiredApproval} | state=${r.state}`);
  });
  if (recommendations.length > 10) console.log(`\n…and ${recommendations.length - 10} more in ${out}`);
  console.log(`\nWrote ${out}. No pages written, no content drafted.`);
}
main();
