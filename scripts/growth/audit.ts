/**
 * growth:audit — Growth OS scoreboard (PR12 foundation, REPORT-ONLY).
 *
 * Inventories the real content surface and states honestly what the system can and cannot yet
 * measure. No page writes, no network, no fabricated analytics.
 *
 * Output: scripts/reports/growth-audit.json + console summary. Exit 0 (not a gate).
 *
 * Run: npx tsx scripts/growth/audit.ts   (npm run growth:audit)
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { truckingAdapter } from '../../src/lib/growth/adapters/trucking';
import type { ContentItem } from '../../src/lib/growth/types';

const MIN_WORDS: Record<ContentItem['kind'], number> = {
  'accident-type': 3000, state: 2500, city: 2000, blog: 800,
};
const MIN_FAQS = 5;

function main() {
  const adapter = truckingAdapter();
  const items = adapter.listContent();
  const dupMap = adapter.duplicateMap?.() ?? {};

  const byKind: Record<string, { count: number; belowWordFloor: number; faqGaps: number }> = {};
  for (const it of items) {
    const b = (byKind[it.kind] ??= { count: 0, belowWordFloor: 0, faqGaps: 0 });
    b.count++;
    if (it.wordCount < MIN_WORDS[it.kind]) b.belowWordFloor++;
    if (it.kind !== 'blog' && it.faqCount < MIN_FAQS) b.faqGaps++;
  }
  const nearDuplicates = Object.values(dupMap).filter((s) => s === 'near-duplicate').length;

  const report = {
    generatedAt: new Date().toISOString(),
    mode: 'report-only',
    writesPages: false,
    config: adapter.config(),
    inventory: { totalItems: items.length, byKind },
    quality: { nearDuplicateItems: nearDuplicates },
    scoreboard: {
      structuralMetadata: 'available (repo)',
      duplicateAudit: Object.keys(dupMap).length ? 'available (audit:quality)' : 'not run (run audit:quality first)',
      searchDemand: 'NOT CONNECTED (GSC)',
      traffic: 'NOT CONNECTED (GA)',
      leadsOutcomes: 'NOT CONNECTED (CRM/forms)',
    },
    workflowStates: ['proposed', 'approved', 'drafted', 'gated', 'published', 'measured'],
    note: 'Foundation: the system observes and proposes only. It cannot learn from outcomes until GSC/GA/CRM are wired, and it cannot publish without human approval and passing quality gates.',
  };

  mkdirSync(join(process.cwd(), 'scripts/reports'), { recursive: true });
  const out = join(process.cwd(), 'scripts/reports/growth-audit.json');
  writeFileSync(out, JSON.stringify(report, null, 2));

  console.log('=== GROWTH OS — AUDIT / SCOREBOARD (report-only) ===');
  console.log(`total content items: ${items.length}`);
  for (const [kind, b] of Object.entries(byKind)) {
    console.log(`  ${kind}: ${b.count} | below word floor: ${b.belowWordFloor} | FAQ gaps: ${b.faqGaps}`);
  }
  console.log(`near-duplicate items (from audit:quality): ${nearDuplicates}`);
  console.log('signal sources — demand: NOT CONNECTED | traffic: NOT CONNECTED | leads: NOT CONNECTED');
  console.log(`\nWrote ${out}. No pages written.`);
}
main();
