/**
 * growth:test — dependency-free invariant tests for the Growth OS foundation.
 *
 * Locks the guarantees that make the system safe: full taxonomy coverage, bounded ontology, the
 * net-new refusal, ledger honesty (no fabricated analytics), and ontology-driven up-links. Runs
 * against the REAL adapter + synthetic edge cases. Deterministic. Exit 1 on any failure.
 *
 * Run: npx tsx scripts/growth/selftest.ts   (npm run growth:test)
 */
import assert from 'node:assert/strict';
import { truckingAdapter } from '../../src/lib/growth/adapters/trucking';
import { truckingTaxonomy } from '../../src/lib/growth/adapters/trucking-taxonomy';
import { buildIndex } from '../../src/lib/growth/taxonomy';
import { proposeOpportunities, recommend } from '../../src/lib/growth/engine';
import { assessRankability } from '../../src/lib/growth/rankability';
import { planEntry, toJsonl } from '../../src/lib/growth/ledger';
import { deriveLinkPlan } from '../../src/lib/growth/interlink';
import { SOURCE_REGISTRY, isEvidenceAvailable } from '../../src/lib/growth/sources';
import { UNAVAILABLE, type Signal } from '../../src/lib/growth/types';

const INTENTS = new Set(['informational', 'transactional', 'navigational']);
const FUNNELS = new Set(['awareness', 'consideration', 'decision']);

let pass = 0;
const fails: string[] = [];
function check(name: string, fn: () => void) {
  try { fn(); pass++; console.log(`  PASS  ${name}`); }
  catch (e) { fails.push(name); console.log(`  FAIL  ${name}: ${e instanceof Error ? e.message : e}`); }
}

const adapter = truckingAdapter();
const tax = truckingTaxonomy();
const items = adapter.listContent();
const index = buildIndex(items, tax);

console.log(`Growth OS selftest — ${items.length} content items\n`);

// 1) Taxonomy coverage: every page classifies to valid, non-empty dimensions.
check('taxonomy: 100% classified with valid dimensions', () => {
  assert.ok(items.length > 100, 'expected a populated site');
  for (const it of items) {
    const c = tax.classify(it);
    assert.ok(c.taxonomyPath.length > 0, `${it.id} empty taxonomyPath`);
    assert.ok(INTENTS.has(c.intent), `${it.id} bad intent ${c.intent}`);
    assert.ok(FUNNELS.has(c.funnelStage), `${it.id} bad funnel ${c.funnelStage}`);
    assert.ok(['national', 'state', 'city'].includes(c.geo.level), `${it.id} bad geo`);
  }
});

// 2) Determinism: classify is pure.
check('taxonomy: classify is deterministic', () => {
  const a = JSON.stringify(tax.classify(items[0]));
  const b = JSON.stringify(tax.classify(items[0]));
  assert.equal(a, b);
});

// 3) Ontology: caps respected; cities with an existing state page resolve a parent.
check('ontology: neighbor caps + city parent resolution', () => {
  let checkedCity = false;
  for (const it of items) {
    const n = tax.neighbors(it, index);
    assert.ok(n.siblings.length <= 6, `${it.id} >6 siblings`);
    assert.ok(n.relatedTopics.length <= 4, `${it.id} >4 relatedTopics`);
    if (it.kind === 'city') {
      const st = it.id.replace('city:', '').split('/')[0];
      if (index.stateBySlug.has(st)) { assert.ok(n.parent, `${it.id} missing parent though state page exists`); checkedCity = true; }
    }
  }
  assert.ok(checkedCity, 'expected at least one city with a state page');
});

// 4) Rankability: net-new is REFUSED without demand, ALLOWED only when demand is real.
check('rankability: net-new refused without demand-signal', () => {
  const v = assessRankability({
    contentId: 'city:probe', moveKind: 'new',
    classification: tax.classify(items.find((i) => i.kind === 'city')!),
    neighbors: tax.neighbors(items.find((i) => i.kind === 'city')!, index),
    demand: UNAVAILABLE, conversionProxy: UNAVAILABLE,
    duplicateStatus: 'unique', meetsStructuralThresholds: true,
  });
  assert.equal(v.refusesDraft, true);
  assert.ok(v.missingEvidence.includes('demand-signal'));
  assert.equal(v.score, null); // never a fabricated number
});
check('rankability: net-new ALLOWED only with real demand evidence', () => {
  const realDemand: Signal = { available: true, value: 1200, confidence: 'high', note: 'test demand source' };
  const city = items.find((i) => i.kind === 'city')!;
  const v = assessRankability({
    contentId: 'city:probe', moveKind: 'new',
    classification: tax.classify(city), neighbors: tax.neighbors(city, index),
    demand: realDemand, conversionProxy: UNAVAILABLE,
    duplicateStatus: 'unique', meetsStructuralThresholds: true,
  });
  assert.equal(v.refusesDraft, false, 'should allow when all evidence present');
  assert.equal(v.rankable, true);
});
check('rankability: improve allowed with structure+ontology, fix needs only taxonomy', () => {
  const city = items.find((i) => i.kind === 'city')!;
  const imp = assessRankability({ contentId: city.id, moveKind: 'improve', classification: tax.classify(city), neighbors: tax.neighbors(city, index), demand: UNAVAILABLE, conversionProxy: UNAVAILABLE, duplicateStatus: 'unique', meetsStructuralThresholds: true });
  assert.equal(imp.refusesDraft, false);
  const fix = assessRankability({ contentId: city.id, moveKind: 'fix', classification: tax.classify(city), neighbors: tax.neighbors(city, index), demand: UNAVAILABLE, conversionProxy: UNAVAILABLE, duplicateStatus: 'unknown', meetsStructuralThresholds: false });
  assert.equal(fix.refusesDraft, false);
});

// 5) Ledger honesty: planned outcomes, UNAVAILABLE metrics, proposed approval, JSONL round-trips.
check('ledger: plans only, never fabricates metrics', () => {
  const e = planEntry({ ts: '2026-01-01T00:00:00.000Z', moveType: 'improve', contentId: 'city:x', decision: 'd', evidenceRefs: ['e'] });
  assert.equal(e.outcome.state, 'planned');
  assert.equal(e.approvalState, 'proposed');
  assert.ok(e.outcome.metrics.every((m) => m.available === false), 'metrics must be UNAVAILABLE');
  const parsed = toJsonl([e]).trim().split('\n').map((l) => JSON.parse(l));
  assert.equal(parsed[0].id, e.id);
});

// 6) Interlink: a city with a parent emits a required UP link to its state.
check('interlink: city emits required up-link to state', () => {
  const city = items.find((i) => i.kind === 'city' && index.stateBySlug.has(i.id.replace('city:', '').split('/')[0]))!;
  const plan = deriveLinkPlan(city, tax.classify(city), tax.neighbors(city, index), index);
  assert.ok(plan.required.some((l) => l.kind === 'up'), 'expected a required up-link');
});

// 7) Engine: recommendation-only — never past 'proposed', confidence capped without demand.
check('engine: recommendations are proposed-only, confidence capped at low', () => {
  const recs = recommend(proposeOpportunities(adapter));
  assert.ok(recs.length > 0);
  for (const r of recs) {
    assert.equal(r.state, 'proposed');
    assert.equal(r.requiredApproval, 'approved');
    assert.notEqual(r.sourceConfidence, 'high');
    assert.notEqual(r.sourceConfidence, 'medium'); // no demand → never above 'low'
  }
});

// 8) Source registry: demand/conversion are FUTURE and gate net-new.
check('sources: demand is future and gates net-new', () => {
  const demand = SOURCE_REGISTRY.find((s) => s.signal === 'demand')!;
  assert.equal(demand.status, 'future');
  assert.ok(demand.gates.includes('new'));
  assert.equal(isEvidenceAvailable('demand-signal'), false);
  assert.equal(isEvidenceAvailable('taxonomy-classification'), true);
});

console.log(`\n${pass} passed, ${fails.length} failed`);
if (fails.length) { console.error('FAILED: ' + fails.join('; ')); process.exit(1); }
console.log('All Growth OS invariants hold.');
