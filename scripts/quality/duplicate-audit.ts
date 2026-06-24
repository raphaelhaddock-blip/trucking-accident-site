/**
 * duplicate-audit.ts  (model-aware, PR4)
 *
 * Deterministic, local content-quality + duplication gate for CITY pages.
 * No network, no LLM, no running dev server — it imports the CityContent
 * data modules directly (the repo forbids `npm run dev`).
 *
 * MODEL-AWARE: the city route (src/app/states/[slug]/[city]/page.tsx) renders ONLY
 * these CityContent fields:
 *     heroText, truckingIndustry, dangerousRoads[], commonAccidents[], faqs[]
 *     (+ metaDescription as a fallback; accidentStats numbers; images)
 * The H1 and meta TITLE shown to users are COMPUTED in the route from the city
 * name ("{name} Truck Accident Lawyers" / "{name} 18-Wheeler Accident Attorney | {ST}"),
 * so cityContent.h1 / cityContent.metaTitle are NEVER rendered. Likewise
 * whyDangerous / liabilityExplanation / evidencePreservation / fmcsaRegulations /
 * legalInfo are NEVER rendered on city pages (that federal substance lives on
 * /accidents/[slug]).
 *
 * Therefore the GATE measures similarity + word-floor on RENDERED fields only, so
 * it reflects what Google actually indexes. The never-rendered "stored/dead" fields
 * are measured SEPARATELY and reported for visibility, but they DO NOT fail the gate
 * (sharing a federal boilerplate that no user ever sees is not a duplicate-content
 * problem). The 0.30 similarity threshold is UNCHANGED.
 *
 * Checks (gating):
 *   1. Placeholder scan      — rendered text still containing `[NEEDS ENHANCEMENT]`
 *   2. Hub word-floor        — rendered words < CITY_HUB_WORD_FLOOR (500)
 *   3. Rendered similarity   — MinHash/LSH over name/number-normalized 5-word
 *                              shingles of the RENDERED fields. Any pair > 0.30 FAILS.
 *
 * Reported (NON-gating, informational):
 *   - stored/dead-field similarity (the never-rendered modules)
 *   - duplicate stored h1 / metaTitle groups (dead — route computes its own)
 *   - duplicate rendered metaDescription groups (rendered as fallback — watch list)
 *   - identical FMCSA federal-text groups (legitimately shared baseline)
 *   - rendered words in the 500–900 hub advisory band
 *
 * Output: scripts/reports/quality-audit.json
 * Exit code: non-zero if the gate fails, so it can wire into CI / `npm run audit`.
 * Run: npx tsx scripts/quality/duplicate-audit.ts
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { getAllCityParams, getCityContent, getStateName } from '../../src/lib/cities-content/index';
import type { CityContent } from '../../src/lib/cities-content/types';

const CITY_HUB_WORD_FLOOR = 500; // hard fail below this many RENDERED words
const HUB_ADVISORY_MAX = 900; // 500–900 is the intended hub band (advisory only)
const SIM_THRESHOLD = 0.3; // UNCHANGED
const SHINGLE_K = 5;
const NUM_HASHES = 64;
const LSH_BANDS = 16; // bands * rows = NUM_HASHES
const LSH_ROWS = 4;
const WORST_N = 40;

// ---------- hash helpers ----------
function fnv1a(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}
// Deterministic MinHash coefficients (no Math.random — reproducible)
const PRIME = 4294967311; // > 2^32
const A: number[] = [];
const B: number[] = [];
for (let i = 0; i < NUM_HASHES; i++) {
  A.push((fnv1a('a' + i) % (PRIME - 1)) + 1);
  B.push(fnv1a('b' + i) % PRIME);
}

// ---------- field extractors ----------
// EXACTLY the CityContent fields the city route renders (the published surface).
function renderedText(c: CityContent): string {
  const parts: string[] = [
    c.heroText ?? '',
    c.truckingIndustry ?? '',
    ...(c.dangerousRoads ?? []).map((r) => `${r.name} ${r.description}`),
    ...(c.commonAccidents ?? []).map((a) => `${a.type} ${a.localFactor}`),
    ...(c.faqs ?? []).map((f) => `${f.question} ${f.answer}`),
  ];
  return parts.join(' \n ');
}

// Never rendered on city pages — measured only for visibility, never gates.
function storedDeadText(c: CityContent): string {
  const parts: string[] = [
    c.whyDangerous ?? '', c.liabilityExplanation ?? '', c.evidencePreservation ?? '',
    c.fmcsaRegulations ?? '', c.legalInfo ?? '',
  ];
  return parts.join(' \n ');
}

function normalize(text: string, c: CityContent): string {
  let t = text.toLowerCase();
  const stateName = (getStateName(c.stateSlug) || c.stateName || '').toLowerCase();
  const masks: Array<[string, string]> = [
    [c.name?.toLowerCase() ?? '', ' __city__ '],
    [c.slug?.replace(/-/g, ' ').toLowerCase() ?? '', ' __city__ '],
    [c.slug?.toLowerCase() ?? '', ' __city__ '],
    [stateName, ' __state__ '],
    [c.stateSlug?.replace(/-/g, ' ').toLowerCase() ?? '', ' __state__ '],
  ];
  for (const [needle, tok] of masks) {
    if (needle && needle.length > 1) t = t.split(needle).join(tok);
  }
  t = t.replace(/[0-9][0-9.,]*/g, ' __num__ '); // mask all numbers
  t = t.replace(/[^a-z_ ]+/g, ' ').replace(/\s+/g, ' ').trim();
  return t;
}

function shingles(normText: string): Set<string> {
  const words = normText.split(' ').filter(Boolean);
  const s = new Set<string>();
  for (let i = 0; i + SHINGLE_K <= words.length; i++) {
    s.add(words.slice(i, i + SHINGLE_K).join(' '));
  }
  if (s.size === 0 && words.length) s.add(words.join(' ')); // very short docs
  return s;
}

function minhash(sh: Set<string>): number[] {
  const sig = new Array(NUM_HASHES).fill(Number.MAX_SAFE_INTEGER);
  for (const tok of sh) {
    const x = fnv1a(tok);
    for (let i = 0; i < NUM_HASHES; i++) {
      const hv = Number((BigInt(A[i]) * BigInt(x) + BigInt(B[i])) % BigInt(PRIME));
      if (hv < sig[i]) sig[i] = hv;
    }
  }
  return sig;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  const [small, big] = a.size < b.size ? [a, b] : [b, a];
  let inter = 0;
  for (const x of small) if (big.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

// ---------- similarity analysis over a set of shingle-sets ----------
type SimDoc = { key: string; sh: Set<string>; sig: number[] };
type SimResult = {
  candidatePairs: number;
  pairsOver: number;
  docsWithDupPartner: number;
  worst: Array<{ a: string; b: string; sim: number }>;
};
function analyzeSimilarity(docs: SimDoc[]): SimResult {
  const buckets = new Map<string, number[]>();
  docs.forEach((d, idx) => {
    for (let band = 0; band < LSH_BANDS; band++) {
      const rows = d.sig.slice(band * LSH_ROWS, band * LSH_ROWS + LSH_ROWS).join(',');
      const key = `${band}:${fnv1a(rows)}`;
      (buckets.get(key) || buckets.set(key, []).get(key)!).push(idx);
    }
  });
  const candidate = new Set<string>();
  for (const idxs of buckets.values()) {
    if (idxs.length < 2) continue;
    for (let i = 0; i < idxs.length; i++)
      for (let j = i + 1; j < idxs.length; j++) {
        const a = Math.min(idxs[i], idxs[j]), b = Math.max(idxs[i], idxs[j]);
        candidate.add(`${a}:${b}`);
      }
  }
  const failing: Array<{ a: string; b: string; sim: number }> = [];
  const maxSimPerDoc = new Array(docs.length).fill(0);
  for (const pair of candidate) {
    const [ai, bi] = pair.split(':').map(Number);
    const sim = jaccard(docs[ai].sh, docs[bi].sh);
    if (sim > maxSimPerDoc[ai]) maxSimPerDoc[ai] = sim;
    if (sim > maxSimPerDoc[bi]) maxSimPerDoc[bi] = sim;
    if (sim > SIM_THRESHOLD) failing.push({ a: docs[ai].key, b: docs[bi].key, sim: +sim.toFixed(3) });
  }
  failing.sort((x, y) => y.sim - x.sim);
  return {
    candidatePairs: candidate.size,
    pairsOver: failing.length,
    docsWithDupPartner: maxSimPerDoc.filter((s) => s > SIM_THRESHOLD).length,
    worst: failing.slice(0, WORST_N),
  };
}

// ---------- load ----------
type Doc = {
  key: string; state: string; city: string;
  renderedWords: number; placeholder: boolean;
  h1: string; metaTitle: string; metaDescription: string;
  renderedSh: Set<string>; renderedSig: number[];
  deadSh: Set<string>; deadSig: number[];
  fmcsa: string;
};

async function main() {
  const params = getAllCityParams();
  const docs: Doc[] = [];
  let noContentFile = 0;

  for (const p of params) {
    const c = await getCityContent(p.slug, p.city);
    if (!c) { noContentFile++; continue; }
    const rendered = renderedText(c);
    const renderedNorm = normalize(rendered, c);
    const renderedSh = shingles(renderedNorm);
    const dead = storedDeadText(c);
    const deadSh = shingles(normalize(dead, c));
    docs.push({
      key: `${p.slug}/${p.city}`, state: p.slug, city: p.city,
      renderedWords: (rendered.match(/\S+/g) || []).length,
      placeholder: rendered.includes('[NEEDS ENHANCEMENT]'),
      h1: c.h1 ?? '', metaTitle: c.metaTitle ?? '', metaDescription: c.metaDescription ?? '',
      renderedSh, renderedSig: minhash(renderedSh),
      deadSh, deadSig: minhash(deadSh),
      fmcsa: (c.fmcsaRegulations ?? '').trim(),
    });
  }

  // ----- gating simple checks (RENDERED only) -----
  const placeholders = docs.filter((d) => d.placeholder).map((d) => d.key);
  const belowFloor = docs.filter((d) => d.renderedWords < CITY_HUB_WORD_FLOOR)
    .map((d) => ({ key: d.key, words: d.renderedWords })).sort((a, b) => a.words - b.words);
  const inAdvisoryBand = docs.filter(
    (d) => d.renderedWords >= CITY_HUB_WORD_FLOOR && d.renderedWords <= HUB_ADVISORY_MAX
  ).length;
  const aboveBand = docs.filter((d) => d.renderedWords > HUB_ADVISORY_MAX).length;

  // ----- duplicate exact groups -----
  function dupGroups(sel: (d: Doc) => string) {
    const m = new Map<string, string[]>();
    for (const d of docs) { const v = sel(d).trim().toLowerCase(); if (!v) continue; (m.get(v) || m.set(v, []).get(v)!).push(d.key); }
    return [...m.entries()].filter(([, ks]) => ks.length > 1)
      .map(([v, ks]) => ({ value: v.slice(0, 80), count: ks.length, sample: ks.slice(0, 6) }))
      .sort((a, b) => b.count - a.count);
  }
  const dupDescRendered = dupGroups((d) => d.metaDescription); // rendered fallback — watch list
  const dupH1Stored = dupGroups((d) => d.h1);                  // DEAD — route computes its own H1
  const dupTitleStored = dupGroups((d) => d.metaTitle);        // DEAD — route computes its own title
  const fmcsaGroups = dupGroups((d) => d.fmcsa).filter((g) => g.count > 1); // federal baseline

  // ----- similarity: rendered (GATING) and stored/dead (informational) -----
  const renderedSim = analyzeSimilarity(docs.map((d) => ({ key: d.key, sh: d.renderedSh, sig: d.renderedSig })));
  const deadDocs = docs.filter((d) => d.deadSh.size > 0); // many hubs leave dead fields empty
  const deadSim = analyzeSimilarity(deadDocs.map((d) => ({ key: d.key, sh: d.deadSh, sig: d.deadSig })));

  const PASS = placeholders.length === 0 && belowFloor.length === 0 && renderedSim.pairsOver === 0;

  const report = {
    config: {
      CITY_HUB_WORD_FLOOR, HUB_ADVISORY_MAX, SIM_THRESHOLD, SHINGLE_K, NUM_HASHES, LSH_BANDS, LSH_ROWS,
      note: 'model-aware: gate measures RENDERED city fields only (heroText, truckingIndustry, dangerousRoads, commonAccidents, faqs). h1/metaTitle/whyDangerous/liability/evidence/fmcsa/legalInfo are NEVER rendered on city pages and do not gate.',
    },
    totals: {
      routesScanned: params.length,
      withContentFile: docs.length,
      noContentFile,
      renderedCandidatePairs: renderedSim.candidatePairs,
    },
    gate: {
      placeholders: placeholders.length,
      renderedBelowFloor: belowFloor.length,
      renderedPairsOver30pct: renderedSim.pairsOver,
      renderedDocsWithDupPartner: renderedSim.docsWithDupPartner,
      PASS,
    },
    advisory: {
      renderedInHubBand_500_900: inAdvisoryBand,
      renderedAbove900: aboveBand,
      duplicateRenderedMetaDescGroups: dupDescRendered.length,
    },
    dead_nonGating: {
      note: 'these fields are NOT rendered on city pages; sharing them is not a duplicate-content problem',
      storedDeadPairsOver30pct: deadSim.pairsOver,
      storedDeadDocsWithDupPartner: deadSim.docsWithDupPartner,
      duplicateStoredH1Groups: dupH1Stored.length,
      duplicateStoredTitleGroups: dupTitleStored.length,
      fmcsaIdenticalGroups: { groups: fmcsaGroups.length, largest: fmcsaGroups[0]?.count ?? 0 },
    },
    worstRenderedPairs: renderedSim.worst,
    worstDeadPairs: deadSim.worst.slice(0, 10),
    duplicateRenderedMetaDesc: dupDescRendered.slice(0, 15),
    placeholdersSample: placeholders.slice(0, 40),
    renderedBelowFloorSample: belowFloor.slice(0, 40),
  };

  const repDir = join('scripts', 'reports');
  if (!existsSync(repDir)) mkdirSync(repDir, { recursive: true });
  writeFileSync(join(repDir, 'quality-audit.json'), JSON.stringify(report, null, 2));

  console.log('=== QUALITY / DUPLICATE AUDIT (model-aware, rendered-only gate) ===');
  console.log(JSON.stringify({ totals: report.totals, gate: report.gate, advisory: report.advisory, dead_nonGating: report.dead_nonGating }, null, 2));
  console.log(`\nWorst ${Math.min(15, renderedSim.worst.length)} RENDERED pairs (>30% after normalization):`);
  for (const p of renderedSim.worst.slice(0, 15)) console.log(`  ${(p.sim * 100).toFixed(1)}%  ${p.a}  <->  ${p.b}`);
  console.log('\nWrote scripts/reports/quality-audit.json');
  if (!PASS) process.exitCode = 1;
}
main();
