/**
 * duplicate-audit.ts
 *
 * Deterministic, local content-quality + duplication gate for city pages.
 * No network, no LLM, no running dev server — it imports the CityContent
 * data modules directly (the repo forbids `npm run dev`).
 *
 * Checks:
 *   1. Placeholder scan        — pages still containing `[NEEDS ENHANCEMENT]`
 *   2. Word-count floor        — full page text < CITY_WORD_FLOOR (CLAUDE.md = 2000)
 *   3. Duplicate H1/title/desc — exact + name-normalized duplicate groups
 *   4. Local-signal detector   — page references its own city / a road / FARS source
 *   5. Boilerplate-excluded similarity — MinHash + LSH over name/number-normalized
 *      5-word shingles of the *differentiable* fields (FMCSA federal text excluded).
 *      Any page pair with Jaccard > SIM_THRESHOLD (0.30) FAILS the gate.
 *
 * Why normalization: we mask city name, city slug, state name, state slug and all
 * numbers BEFORE shingling, so a find/replace clone of another city scores ~1.0.
 * That is the "swap test" the differentiation rules require.
 *
 * Output: scripts/reports/quality-audit.json
 * Exit code: non-zero if the gate fails (placeholders, sub-floor, or >0.30 pairs)
 *            so it can be wired into CI / `npm run audit`.
 *
 * Run: npx tsx scripts/quality/duplicate-audit.ts
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { getAllCityParams, getCityContent, getStateName } from '../../src/lib/cities-content/index';
import type { CityContent } from '../../src/lib/cities-content/types';

const CITY_WORD_FLOOR = 2000;
const SIM_THRESHOLD = 0.3;
const SHINGLE_K = 5;
const NUM_HASHES = 64;
const LSH_BANDS = 16; // bands * rows = NUM_HASHES
const LSH_ROWS = 4;
const WORST_N = 40;

// ---------- helpers ----------
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

function differentiableText(c: CityContent): string {
  // Fields that are SUPPOSED to be locally unique. FMCSA federal text excluded
  // (legitimately shared baseline) and measured separately.
  const parts: string[] = [
    c.metaTitle, c.metaDescription, c.h1, c.heroText,
    c.whyDangerous ?? '', c.liabilityExplanation ?? '', c.evidencePreservation ?? '',
    c.truckingIndustry ?? '', c.legalInfo ?? '',
    ...(c.dangerousRoads ?? []).map((r) => `${r.name} ${r.description}`),
    ...(c.commonAccidents ?? []).map((a) => `${a.type} ${a.localFactor}`),
    ...(c.faqs ?? []).map((f) => `${f.question} ${f.answer}`),
  ];
  return parts.join(' \n ');
}

function fullText(c: CityContent): string {
  return differentiableText(c) + ' ' + (c.fmcsaRegulations ?? '');
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

// ---------- load ----------
type Doc = {
  key: string; state: string; city: string;
  fullWords: number; placeholder: boolean;
  h1: string; metaTitle: string; metaDescription: string;
  localScore: number; sh: Set<string>; sig: number[];
  fmcsa: string;
};

async function main() {
  const params = getAllCityParams();
  const docs: Doc[] = [];
  let noContentFile = 0;

  for (const p of params) {
    const c = await getCityContent(p.slug, p.city);
    if (!c) { noContentFile++; continue; }
    const diff = differentiableText(c);
    const norm = normalize(diff, c);
    const sh = shingles(norm);
    const cityNameLc = (c.name ?? '').toLowerCase();
    const localScore =
      (diff.toLowerCase().includes(cityNameLc) ? 1 : 0) +
      ((c.dangerousRoads?.length ?? 0) > 0 ? 1 : 0) +
      (c.accidentStats?.sourceUrl ? 1 : 0);
    docs.push({
      key: `${p.slug}/${p.city}`, state: p.slug, city: p.city,
      fullWords: (fullText(c).match(/\S+/g) || []).length,
      placeholder: fullText(c).includes('[NEEDS ENHANCEMENT]'),
      h1: c.h1 ?? '', metaTitle: c.metaTitle ?? '', metaDescription: c.metaDescription ?? '',
      localScore, sh, sig: minhash(sh), fmcsa: (c.fmcsaRegulations ?? '').trim(),
    });
  }

  // 1/2/4 simple checks
  const placeholders = docs.filter((d) => d.placeholder).map((d) => d.key);
  const belowFloor = docs.filter((d) => d.fullWords < CITY_WORD_FLOOR)
    .map((d) => ({ key: d.key, words: d.fullWords })).sort((a, b) => a.words - b.words);
  const lowLocalSignal = docs.filter((d) => d.localScore < 2).map((d) => ({ key: d.key, score: d.localScore }));

  // 3 duplicate exact groups
  function dupGroups(sel: (d: Doc) => string) {
    const m = new Map<string, string[]>();
    for (const d of docs) { const v = sel(d).trim().toLowerCase(); if (!v) continue; (m.get(v) || m.set(v, []).get(v)!).push(d.key); }
    return [...m.entries()].filter(([, ks]) => ks.length > 1)
      .map(([v, ks]) => ({ value: v.slice(0, 80), count: ks.length, sample: ks.slice(0, 6) }))
      .sort((a, b) => b.count - a.count);
  }
  const dupH1 = dupGroups((d) => d.h1);
  const dupTitle = dupGroups((d) => d.metaTitle);
  const dupDesc = dupGroups((d) => d.metaDescription);
  const fmcsaGroups = dupGroups((d) => d.fmcsa).filter((g) => g.count > 1);

  // 5 LSH candidate generation
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

  const failingPairs: Array<{ a: string; b: string; sim: number }> = [];
  const maxSimPerDoc = new Array(docs.length).fill(0);
  for (const pair of candidate) {
    const [ai, bi] = pair.split(':').map(Number);
    const sim = jaccard(docs[ai].sh, docs[bi].sh);
    if (sim > maxSimPerDoc[ai]) maxSimPerDoc[ai] = sim;
    if (sim > maxSimPerDoc[bi]) maxSimPerDoc[bi] = sim;
    if (sim > SIM_THRESHOLD) failingPairs.push({ a: docs[ai].key, b: docs[bi].key, sim: +sim.toFixed(3) });
  }
  failingPairs.sort((x, y) => y.sim - x.sim);
  const docsOverThreshold = maxSimPerDoc.filter((s) => s > SIM_THRESHOLD).length;

  const report = {
    config: { CITY_WORD_FLOOR, SIM_THRESHOLD, SHINGLE_K, NUM_HASHES, LSH_BANDS, LSH_ROWS, note: 'similarity is name/number-normalized, FMCSA federal text excluded' },
    totals: {
      routesScanned: params.length,
      withContentFile: docs.length,
      noContentFile,
      candidatePairs: candidate.size,
    },
    gate: {
      placeholders: placeholders.length,
      belowWordFloor: belowFloor.length,
      duplicateH1Groups: dupH1.length,
      duplicateTitleGroups: dupTitle.length,
      duplicateDescGroups: dupDesc.length,
      lowLocalSignal: lowLocalSignal.length,
      pairsOver30pct: failingPairs.length,
      docsWithADupPartnerOver30pct: docsOverThreshold,
      PASS: placeholders.length === 0 && belowFloor.length === 0 && failingPairs.length === 0,
    },
    fmcsaIdenticalGroups: { groups: fmcsaGroups.length, largest: fmcsaGroups[0]?.count ?? 0 },
    worstPairs: failingPairs.slice(0, WORST_N),
    duplicateH1: dupH1.slice(0, 15),
    duplicateTitle: dupTitle.slice(0, 15),
    duplicateDesc: dupDesc.slice(0, 15),
    placeholdersSample: placeholders.slice(0, 40),
    belowFloorSample: belowFloor.slice(0, 40),
  };

  const repDir = join('scripts', 'reports');
  if (!existsSync(repDir)) mkdirSync(repDir, { recursive: true });
  writeFileSync(join(repDir, 'quality-audit.json'), JSON.stringify(report, null, 2));

  console.log('=== QUALITY / DUPLICATE AUDIT ===');
  console.log(JSON.stringify({ totals: report.totals, gate: report.gate, fmcsa: report.fmcsaIdenticalGroups }, null, 2));
  console.log(`\nWorst ${Math.min(WORST_N, failingPairs.length)} pairs (>30% after normalization):`);
  for (const p of report.worstPairs.slice(0, 15)) console.log(`  ${(p.sim * 100).toFixed(1)}%  ${p.a}  <->  ${p.b}`);
  console.log('\nWrote scripts/reports/quality-audit.json');
  if (!report.gate.PASS) process.exitCode = 1;
}
main();
