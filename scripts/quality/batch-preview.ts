/**
 * batch-preview.ts — selects currently-cloned city pages, composes hub replacements
 * through the content engine IN MEMORY, and scores them on RENDERED-content similarity
 * (the same surface the model-aware gate uses) BEFORE any file is written.
 *
 * Gate for writing (all must hold):
 *   - every batch hub vs every other batch hub: rendered Jaccard < 0.30
 *   - every batch hub vs the full existing corpus (each city's CURRENT content): < 0.30
 *   - no duplicate rendered metaDescription within the batch
 *   - every hub >= 500 rendered words, dangerousRoads == [] (no fake roads), no placeholder
 *
 * Selection: only GENUINE clones (a city whose CURRENT rendered content has a >0.30
 * partner) that the engine can build a non-thin profile for (has a region), excluding
 * the 21 preserved enhancements, the 6 pilots, and the 4 enhanced controls. Same-region
 * density is capped (--percap) because the regional mechanism mix is shared.
 *
 * Usage: npx tsx scripts/quality/batch-preview.ts [--size=50] [--percap=4] [--emit=path.json]
 * No files are written to the site; --emit only writes the chosen target list for the writer.
 */
import { writeFileSync } from 'node:fs';
import { buildCityProfile } from '../../src/lib/content-engine/profile';
import { composeCityContentHub } from '../../src/lib/content-engine/compose';
import { getAllCityParams, getCityContent, getStateName } from '../../src/lib/cities-content/index';
import type { CityContent } from '../../src/lib/cities-content/types';

const K = 5;
const THRESHOLD = 0.3;
const WORD_FLOOR = 500;

// ---- protected sets (never touch) ----
const PILOTS = new Set([
  'california/fresno', 'arizona/mesa', 'arkansas/bryant', 'arkansas/benton',
  'connecticut/haddam', 'vermont/burlington',
]);
const CONTROLS = new Set(['texas/houston', 'texas/dallas', 'colorado/denver', 'tennessee/memphis']);
// 21 preserved enhancements (git-status dirty set)
const PRESERVED = new Set([
  'arizona/tucson', 'california/san-francisco', 'colorado/denver', 'indiana/indianapolis',
  'kentucky/louisville', 'massachusetts/boston', 'michigan/detroit', 'nevada/las-vegas',
  'new-mexico/albuquerque', 'new-york/brookhaven', 'new-york/buffalo', 'new-york/islip',
  'new-york/oyster-bay', 'north-carolina/charlotte', 'oregon/portland', 'tennessee/memphis',
  'tennessee/nashville', 'texas/el-paso', 'washington/seattle',
]);
const PROTECTED = new Set([...PILOTS, ...CONTROLS, ...PRESERVED]);

type Meta = { name: string; slug: string; stateSlug: string; stateName: string };
function renderedText(c: CityContent): string {
  return [
    c.heroText ?? '', c.truckingIndustry ?? '',
    ...(c.dangerousRoads ?? []).map((r) => `${r.name} ${r.description}`),
    ...(c.commonAccidents ?? []).map((a) => `${a.type} ${a.localFactor}`),
    ...(c.faqs ?? []).map((f) => `${f.question} ${f.answer}`),
  ].join(' \n ');
}
function normalize(text: string, m: Meta): string {
  let t = text.toLowerCase();
  const stateName = (getStateName(m.stateSlug) || m.stateName || '').toLowerCase();
  for (const [needle, tok] of [
    [m.name?.toLowerCase(), ' __city__ '], [m.slug?.replace(/-/g, ' ').toLowerCase(), ' __city__ '],
    [m.slug?.toLowerCase(), ' __city__ '], [stateName, ' __state__ '],
    [m.stateSlug?.replace(/-/g, ' ').toLowerCase(), ' __state__ '],
  ] as [string, string][]) if (needle && needle.length > 1) t = t.split(needle).join(tok);
  return t.replace(/[0-9][0-9.,]*/g, ' __num__ ').replace(/[^a-z_ ]+/g, ' ').replace(/\s+/g, ' ').trim();
}
function shingles(norm: string): Set<string> {
  const w = norm.split(' ').filter(Boolean); const s = new Set<string>();
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
const metaOf = (c: CityContent): Meta => ({ name: c.name, slug: c.slug, stateSlug: c.stateSlug, stateName: c.stateName });
const shOf = (c: CityContent) => shingles(normalize(renderedText(c), metaOf(c)));
const wordsOf = (c: CityContent) => renderedText(c).match(/\S+/g)?.length ?? 0;

function arg(name: string, def: number): number {
  const a = process.argv.find((x) => x.startsWith(`--${name}=`));
  return a ? Number(a.split('=')[1]) : def;
}

async function main() {
  const SIZE = arg('size', 50);
  const PERCAP = arg('percap', 4);
  const emit = process.argv.find((x) => x.startsWith('--emit='))?.split('=')[1];

  // 1) Build corpus shingles for ALL cities (current content).
  const params = getAllCityParams();
  const corpus: Array<{ key: string; stateSlug: string; city: string; sh: Set<string> }> = [];
  for (const p of params) {
    const c = await getCityContent(p.slug, p.city);
    if (!c) continue;
    corpus.push({ key: `${p.slug}/${p.city}`, stateSlug: p.slug, city: p.city, sh: shOf(c) });
  }

  // 2) Identify genuine clones (current rendered content has a >0.30 partner), excluding protected.
  //    Cheap-ish: bucket-free O(n^2) is too big (1.6k^2); use a coarse signature prefilter.
  //    We approximate "is a clone" by exact normalized-text duplicate OR high overlap with any
  //    same-state sibling (clones cluster by template within a state). That's enough to select.
  const cloneKeys = new Set<string>();
  const byState = new Map<string, typeof corpus>();
  for (const d of corpus) { (byState.get(d.stateSlug) ?? byState.set(d.stateSlug, []).get(d.stateSlug)!).push(d); }
  for (const [, group] of byState) {
    for (let i = 0; i < group.length; i++)
      for (let j = i + 1; j < group.length; j++) {
        if (jaccard(group[i].sh, group[j].sh) > THRESHOLD) { cloneKeys.add(group[i].key); cloneKeys.add(group[j].key); }
      }
  }

  // 3) Candidate targets: clones, not protected, engine can build a non-thin hub (region present, >=floor words).
  const perRegion = new Map<string, number>();
  const perState = new Map<string, number>();
  const chosen: Array<{ stateSlug: string; city: string; hub: CityContent; region: string }> = [];
  for (const key of cloneKeys) {
    if (chosen.length >= SIZE) break;
    if (PROTECTED.has(key)) continue;
    const [stateSlug, city] = key.split('/');
    const prof = buildCityProfile(stateSlug, city);
    if (!prof || !prof.region) continue;             // no region => thin mechanism mix, skip
    const hub = composeCityContentHub(prof, '2026-06-24');
    if (wordsOf(hub) < WORD_FLOOR) continue;          // engine can't clear the hub floor here
    if ((hub.dangerousRoads?.length ?? 0) !== 0) continue; // never assert roads
    // density caps
    if ((perRegion.get(prof.region) ?? 0) >= PERCAP * 6) continue;
    if ((perState.get(stateSlug) ?? 0) >= PERCAP) continue;
    perRegion.set(prof.region, (perRegion.get(prof.region) ?? 0) + 1);
    perState.set(stateSlug, (perState.get(stateSlug) ?? 0) + 1);
    chosen.push({ stateSlug, city, hub, region: prof.region });
  }

  // 4) Score: batch vs batch (rendered), and batch vs corpus (excluding each member's own current entry).
  const batch = chosen.map((x) => ({ key: `${x.stateSlug}/${x.city}`, region: x.region, hub: x.hub, sh: shOf(x.hub), words: wordsOf(x.hub) }));
  const batchKeys = new Set(batch.map((b) => b.key));

  let worstPair = { sim: 0, a: '', b: '' };
  for (let i = 0; i < batch.length; i++)
    for (let j = i + 1; j < batch.length; j++) {
      const sim = jaccard(batch[i].sh, batch[j].sh);
      if (sim > worstPair.sim) worstPair = { sim, a: batch[i].key, b: batch[j].key };
    }

  let worstCorpus = { sim: 0, a: '', who: '' };
  for (const b of batch) {
    for (const d of corpus) {
      if (batchKeys.has(d.key)) continue;            // compare against pages we are NOT rewriting
      const sim = jaccard(b.sh, d.sh);
      if (sim > worstCorpus.sim) worstCorpus = { sim, a: b.key, who: d.key };
    }
  }

  // metaDescription dupes within batch
  const descMap = new Map<string, string[]>();
  for (const x of chosen) {
    const v = (x.hub.metaDescription ?? '').trim().toLowerCase();
    (descMap.get(v) ?? descMap.set(v, []).get(v)!).push(`${x.stateSlug}/${x.city}`);
  }
  const dupDesc = [...descMap.values()].filter((g) => g.length > 1);
  const minWords = Math.min(...batch.map((b) => b.words));
  const placeholders = batch.filter((b) => renderedText(b.hub).includes('[NEEDS ENHANCEMENT]')).length;

  const PASS = worstPair.sim < THRESHOLD && worstCorpus.sim < THRESHOLD && dupDesc.length === 0 && placeholders === 0 && minWords >= WORD_FLOOR && batch.length > 0;

  console.log('=== BATCH PREVIEW (rendered-only, no files written) ===');
  console.log(`selected: ${batch.length}/${SIZE} clone targets  (per-state cap ${PERCAP})`);
  const regionCounts: Record<string, number> = {};
  for (const b of batch) regionCounts[b.region] = (regionCounts[b.region] ?? 0) + 1;
  console.log('by region:', JSON.stringify(regionCounts));
  console.log(`rendered words: min ${minWords}`);
  console.log(`WORST batch-vs-batch:  ${(worstPair.sim * 100).toFixed(1)}%  ${worstPair.a} <-> ${worstPair.b}`);
  console.log(`WORST batch-vs-corpus: ${(worstCorpus.sim * 100).toFixed(1)}%  ${worstCorpus.a}  (nearest ${worstCorpus.who})`);
  console.log(`dup metaDescription groups: ${dupDesc.length}   placeholders: ${placeholders}`);
  console.log(PASS ? 'PREVIEW PASS (<30%, no meta dupes) — safe to write' : 'PREVIEW FAIL — do NOT write; diagnose');

  if (emit && PASS) {
    writeFileSync(emit, JSON.stringify(batch.map((b) => b.key), null, 2));
    console.log(`\nwrote target list -> ${emit}`);
  }
}
main();
