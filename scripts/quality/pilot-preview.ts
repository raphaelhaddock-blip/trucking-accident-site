/**
 * In-memory preview: compose pilot pages and score similarity BEFORE writing any file.
 * Mirrors duplicate-audit.ts normalization (mask name/state/slug/numbers, 5-word
 * shingles, Jaccard, FMCSA excluded). Proves the engine clears 30% against itself and
 * against a corpus sample. No files written.
 */
import { buildCityProfile } from '../../src/lib/content-engine/profile';
import { composeCityContent } from '../../src/lib/content-engine/compose';
import { getAllCityParams, getCityContent, getStateName } from '../../src/lib/cities-content/index';
import type { CityContent } from '../../src/lib/cities-content/types';

const K = 5;
type Meta = { name: string; slug: string; stateSlug: string; stateName: string };

function differentiable(c: CityContent): string {
  return [
    c.metaTitle, c.metaDescription, c.h1, c.heroText,
    c.whyDangerous ?? '', c.liabilityExplanation ?? '', c.evidencePreservation ?? '',
    c.truckingIndustry ?? '', c.legalInfo ?? '',
    ...(c.dangerousRoads ?? []).map((r) => `${r.name} ${r.description}`),
    ...(c.commonAccidents ?? []).map((a) => `${a.type} ${a.localFactor}`),
    ...(c.faqs ?? []).map((f) => `${f.question} ${f.answer}`),
  ].join(' \n ');
}
function normalize(text: string, m: Meta): string {
  let t = text.toLowerCase();
  const stateName = (getStateName(m.stateSlug) || m.stateName || '').toLowerCase();
  for (const [needle, tok] of [
    [m.name?.toLowerCase(), ' __city__ '],
    [m.slug?.replace(/-/g, ' ').toLowerCase(), ' __city__ '],
    [m.slug?.toLowerCase(), ' __city__ '],
    [stateName, ' __state__ '],
    [m.stateSlug?.replace(/-/g, ' ').toLowerCase(), ' __state__ '],
  ] as [string, string][]) {
    if (needle && needle.length > 1) t = t.split(needle).join(tok);
  }
  return t.replace(/[0-9][0-9.,]*/g, ' __num__ ').replace(/[^a-z_ ]+/g, ' ').replace(/\s+/g, ' ').trim();
}
function shingles(norm: string): Set<string> {
  const w = norm.split(' ').filter(Boolean);
  const s = new Set<string>();
  for (let i = 0; i + K <= w.length; i++) s.add(w.slice(i, i + K).join(' '));
  if (!s.size && w.length) s.add(w.join(' '));
  return s;
}
function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  const [s, big] = a.size < b.size ? [a, b] : [b, a];
  let i = 0; for (const x of s) if (big.has(x)) i++;
  return i / (a.size + b.size - i);
}
const words = (c: CityContent) =>
  (differentiable(c) + ' ' + (c.fmcsaRegulations ?? '')).match(/\S+/g)?.length ?? 0;

const PILOTS: [string, string][] = [
  ['texas', 'houston'],        // metro, South Central
  ['texas', 'dallas'],         // metro, South Central  <- same-region METRO stress vs houston
  ['california', 'fresno'],    // mid, Pacific
  ['arizona', 'mesa'],         // mid, Southwest
  ['arkansas', 'bryant'],      // small, South Central
  ['arkansas', 'benton'],      // small, South Central  <- clone-pair stress vs bryant
  ['connecticut', 'haddam'],   // small, Northeast
  ['vermont', 'burlington'],   // small-state
];

async function main() {
  // compose pilots
  const composed = PILOTS.map(([s, c]) => {
    const p = buildCityProfile(s, c)!;
    const cc = composeCityContent(p, '2026-06-24');
    return { meta: { name: cc.name, slug: cc.slug, stateSlug: cc.stateSlug, stateName: cc.stateName }, cc, sh: shingles(normalize(differentiable(cc), { name: cc.name, slug: cc.slug, stateSlug: cc.stateSlug, stateName: cc.stateName })) };
  });

  console.log('=== PILOT WORD COUNTS ===');
  for (const x of composed) console.log(`  ${x.cc.stateSlug}/${x.cc.slug}: ${words(x.cc)} words, ${x.sh.size} shingles`);

  console.log('\n=== PILOT vs PILOT (must be < 0.30) ===');
  let worstPair = 0;
  for (let i = 0; i < composed.length; i++)
    for (let j = i + 1; j < composed.length; j++) {
      const sim = jaccard(composed[i].sh, composed[j].sh);
      worstPair = Math.max(worstPair, sim);
      console.log(`  ${(sim * 100).toFixed(1)}%  ${composed[i].cc.slug} <-> ${composed[j].cc.slug}`);
    }

  // corpus sample (every Nth existing city)
  const all = getAllCityParams();
  const step = Math.max(1, Math.floor(all.length / 250));
  const sample = all.filter((_, i) => i % step === 0);
  const corpus: { key: string; sh: Set<string> }[] = [];
  for (const pr of sample) {
    if (PILOTS.some(([s, c]) => s === pr.slug && c === pr.city)) continue;
    const c = await getCityContent(pr.slug, pr.city);
    if (!c) continue;
    corpus.push({ key: `${pr.slug}/${pr.city}`, sh: shingles(normalize(differentiable(c), { name: c.name, slug: c.slug, stateSlug: c.stateSlug, stateName: c.stateName })) });
  }
  console.log(`\n=== PILOT vs CORPUS SAMPLE (${corpus.length} existing pages; each pilot's MAX, must be < 0.30) ===`);
  let worstCorpus = 0;
  for (const x of composed) {
    let mx = 0, who = '';
    for (const d of corpus) { const s = jaccard(x.sh, d.sh); if (s > mx) { mx = s; who = d.key; } }
    worstCorpus = Math.max(worstCorpus, mx);
    console.log(`  ${(mx * 100).toFixed(1)}%  ${x.cc.slug}  (nearest: ${who})`);
  }

  console.log(`\nWORST pilot-pilot: ${(worstPair * 100).toFixed(1)}%  |  WORST pilot-corpus: ${(worstCorpus * 100).toFixed(1)}%`);
  console.log(worstPair < 0.3 && worstCorpus < 0.3 ? 'PREVIEW PASS (<30%)' : 'PREVIEW FAIL (>=30%) — diagnose before writing files');
}
main();
