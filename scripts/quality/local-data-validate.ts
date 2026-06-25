/**
 * local-data-validate.ts — gate for the verified-local-data foundation (PR7).
 *
 * Part 1 (STRUCTURE): every record in city-roads/courts/hospitals.json is checked. A
 *   record may only be VERIFIED if it carries sourceName + sourceUrl + verifiedDate +
 *   confidence. Road danger claims (crashStat) require a fully-sourced stat. Court
 *   records' county must match the FARS county for that city. Violations FAIL (exit 1).
 *
 * Part 2 (RENDER SAFETY PROOF): exercises the PURE resolvers with crafted records and
 *   asserts that missing / NEEDS_SOURCE / GENERAL / cross-check-failing data resolves
 *   to null/[] — i.e. unverified facts never render. Also confirms the live files
 *   (empty in PR7, legal lacking provenance) expose NOTHING.
 *
 * Run: npx tsx scripts/quality/local-data-validate.ts   (npm run audit:localdata)
 */
import { readFileSync } from 'node:fs';
import farsRaw from '../../scripts/city-accident-data.json';
import {
  resolveCorridors, resolveCourt, resolveTrauma, resolveLegal,
  getVerifiedCorridors, getVerifiedCourt, getVerifiedTraumaCenters, getVerifiedLegalFacts,
  courtContextText, type Confidence,
} from '../../src/lib/content-engine/local-data';

const FARS = farsRaw as { states: Record<string, { cities: Array<{ slug: string; countyName?: string }> }> };
const PROV = ['sourceName', 'sourceUrl', 'verifiedDate', 'confidence'] as const;
const CONF: Confidence[] = ['VERIFIED', 'GENERAL', 'NEEDS_SOURCE'];

const errors: string[] = [];
const fail = (m: string) => errors.push(m);

function checkProvenance(path: string, rec: Record<string, unknown>) {
  if (rec.confidence !== undefined && !CONF.includes(rec.confidence as Confidence))
    fail(`${path}: confidence "${String(rec.confidence)}" not in ${CONF.join('|')}`);
  if (rec.confidence === 'VERIFIED')
    for (const k of PROV) if (!rec[k]) fail(`${path}: VERIFIED record missing ${k}`);
}

function farsCounty(state: string, city: string): string | null {
  return FARS.states[state]?.cities?.find((c) => c.slug === city)?.countyName ?? null;
}

// ---------- Part 1: structure ----------
function validateFiles() {
  const roads = JSON.parse(readFileSync('scripts/data/city-roads.json', 'utf8'));
  for (const [st, cities] of Object.entries(roads.roads ?? {}))
    for (const [city, rec] of Object.entries(cities as Record<string, Record<string, unknown>>)) {
      checkProvenance(`roads/${st}/${city}`, rec);
      for (const c of (rec.corridors as Array<Record<string, unknown>> ?? [])) {
        checkProvenance(`roads/${st}/${city}/${String(c.name)}`, c);
        if (c.confidence === 'VERIFIED' && (!c.name || !c.designation || !c.role))
          fail(`roads/${st}/${city}: VERIFIED corridor needs name+designation+role`);
        const cs = c.crashStat as Record<string, unknown> | undefined;
        if (cs && !(typeof cs.value === 'number' && cs.metric && typeof cs.year === 'number' && cs.sourceUrl && cs.confidence === 'VERIFIED'))
          fail(`roads/${st}/${city}/${String(c.name)}: crashStat (danger claim) must be fully sourced + VERIFIED`);
      }
    }

  const courts = JSON.parse(readFileSync('scripts/data/city-courts.json', 'utf8'));
  for (const [st, cities] of Object.entries(courts.courts ?? {}))
    for (const [city, rec] of Object.entries(cities as Record<string, Record<string, unknown>>)) {
      checkProvenance(`courts/${st}/${city}`, rec);
      if (rec.confidence === 'VERIFIED') {
        if (!rec.county || !rec.trialCourtName || !rec.courtType)
          fail(`courts/${st}/${city}: VERIFIED court needs county+trialCourtName+courtType`);
        const fc = farsCounty(st, city);
        if (fc && String(rec.county).trim().toLowerCase() !== fc.trim().toLowerCase())
          fail(`courts/${st}/${city}: county "${String(rec.county)}" != FARS county "${fc}"`);
      }
    }

  const hospitals = JSON.parse(readFileSync('scripts/data/city-hospitals.json', 'utf8'));
  for (const [st, cities] of Object.entries(hospitals.hospitals ?? {}))
    for (const [city, rec] of Object.entries(cities as Record<string, Record<string, unknown>>)) {
      checkProvenance(`hospitals/${st}/${city}`, rec);
      for (const c of (rec.centers as Array<Record<string, unknown>> ?? [])) {
        checkProvenance(`hospitals/${st}/${city}/${String(c.name)}`, c);
        if (c.confidence === 'VERIFIED' && (!c.name || !c.traumaLevel))
          fail(`hospitals/${st}/${city}: VERIFIED center needs name+traumaLevel`);
      }
    }
}

// ---------- Part 2: render-safety proof ----------
let proofPass = 0, proofFail = 0;
function assert(cond: boolean, label: string) {
  if (cond) proofPass++; else { proofFail++; fail(`PROOF FAILED: ${label}`); }
}

function safetyProof() {
  // corridors
  assert(resolveCorridors(undefined).length === 0, 'missing roads record → []');
  assert(resolveCorridors({ confidence: 'NEEDS_SOURCE', corridors: [{ name: 'I-10', designation: 'Interstate', role: 'freight', confidence: 'VERIFIED' }] }).length === 0, 'unverified city record → no corridors');
  assert(resolveCorridors({ confidence: 'VERIFIED', sourceName: 's', sourceUrl: 'u', verifiedDate: 'd', corridors: [{ name: 'I-10', designation: 'Interstate', role: 'freight', confidence: 'NEEDS_SOURCE' }] }).length === 0, 'unverified corridor → dropped');
  const withUnsourcedStat = resolveCorridors({ confidence: 'VERIFIED', sourceName: 's', sourceUrl: 'u', verifiedDate: 'd', corridors: [{ name: 'I-10', designation: 'Interstate', role: 'freight', confidence: 'VERIFIED', crashStat: { value: 9, metric: 'fatal', year: 2022, sourceUrl: '', confidence: 'NEEDS_SOURCE' } }] });
  assert(withUnsourcedStat.length === 1 && withUnsourcedStat[0].crashStat === null, 'VERIFIED corridor keeps name but STRIPS unsourced crashStat (no danger claim)');

  // courts
  const court = { confidence: 'VERIFIED' as Confidence, sourceName: 's', sourceUrl: 'u', verifiedDate: 'd', county: 'Harris', trialCourtName: 'Harris County District Courts', courtType: 'District Court' };
  assert(resolveCourt(court, 'Travis') === null, 'court county mismatch → null');
  assert(resolveCourt(court, null) === null, 'no FARS county → court null');
  assert(resolveCourt({ ...court, confidence: 'NEEDS_SOURCE' }, 'Harris') === null, 'unverified court → null');
  assert(resolveCourt(court, 'harris') !== null, 'VERIFIED court + matching county (case-insensitive) → renders');

  // hospitals
  assert(resolveTrauma({ confidence: 'VERIFIED', sourceName: 's', sourceUrl: 'u', verifiedDate: 'd', centers: [{ name: 'X', traumaLevel: 'I', confidence: 'NEEDS_SOURCE' }] }).length === 0, 'unverified trauma center → dropped');

  // legal (two-key)
  const sol = { personalInjury: 2, sourceUrl: 'u', confidence: 'VERIFIED' as Confidence };
  const neg = { type: 'modified-51', notes: 'n', sourceUrl: 'u', confidence: 'VERIFIED' as Confidence };
  assert(resolveLegal(sol, { ...neg, confidence: 'NEEDS_SOURCE' }) === null, 'SOL verified but negligence not → null (two-key)');
  assert(resolveLegal({ ...sol, confidence: 'NEEDS_SOURCE' }, neg) === null, 'negligence verified but SOL not → null (two-key)');
  assert(resolveLegal({ personalInjury: 2, confidence: 'VERIFIED' }, neg) === null, 'SOL verified but no sourceUrl → null');
  assert(resolveLegal(sol, neg) !== null, 'both VERIFIED + sourced → renders (positive control)');

  // live files (PR7 state): empty data + legal lacking provenance → nothing renders
  assert(getVerifiedCorridors('texas', 'houston').length === 0, 'live: empty roads file → []');
  assert(getVerifiedCourt('texas', 'houston', 'Harris') === null, 'live: empty courts file → null');
  assert(getVerifiedTraumaCenters('texas', 'houston').length === 0, 'live: empty hospitals file → []');
  assert(getVerifiedLegalFacts('florida') === null, 'live: correct-legal-data.json lacks provenance → SOL null (NEEDS_SOURCE)');

  // court-context wording is neutral public-record text, never legal advice (PR9/PR10)
  const sample = courtContextText(
    { confidence: 'VERIFIED', county: 'Los Angeles', trialCourtName: 'Superior Court of California, County of Los Angeles', displayName: 'Superior Court of Los Angeles County', courtType: 'Superior Court', sourceName: 's', sourceUrl: 'u', verifiedDate: 'd' },
    'Los Angeles', 'California');
  assert(sample.includes('not legal advice'), 'court context carries the not-legal-advice frame');
  assert(sample.includes('Superior Court of Los Angeles County'), 'court context renders displayName when present');
  const banned = ['your case', 'will be filed', 'venue', 'judges', 'juries', 'statute of limitations', 'you must file', 'right venue'];
  for (const b of banned) assert(!sample.toLowerCase().includes(b), `court context omits legal-advice phrase "${b}"`);
}

function main() {
  validateFiles();
  safetyProof();
  console.log('=== LOCAL-DATA VALIDATION (PR7) ===');
  console.log(`structure errors: ${errors.filter((e) => !e.startsWith('PROOF')).length}`);
  console.log(`render-safety proof: ${proofPass} passed, ${proofFail} failed`);
  if (errors.length) { console.log('\nFAILURES:'); errors.forEach((e) => console.log('  ✗', e)); process.exitCode = 1; }
  else console.log('\nPASS — all records provenance-valid; unverified data proven non-rendering.');
}
main();
