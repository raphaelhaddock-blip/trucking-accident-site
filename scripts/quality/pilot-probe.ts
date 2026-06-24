/**
 * pilot-probe.ts — for a set of target city pages, report each one's single
 * highest RENDERED-content similarity partner across the whole corpus.
 * Deterministic, local, no network. Run: npx tsx scripts/quality/pilot-probe.ts [state/city ...]
 */
import { getAllCityParams, getCityContent, getStateName } from '../../src/lib/cities-content/index';
import type { CityContent } from '../../src/lib/cities-content/types';

const SHINGLE_K = 5;
function renderedText(c: CityContent): string {
  return [
    c.heroText ?? '', c.truckingIndustry ?? '',
    ...(c.dangerousRoads ?? []).map((r) => `${r.name} ${r.description}`),
    ...(c.commonAccidents ?? []).map((a) => `${a.type} ${a.localFactor}`),
    ...(c.faqs ?? []).map((f) => `${f.question} ${f.answer}`),
  ].join(' \n ');
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
  for (const [n, tok] of masks) if (n && n.length > 1) t = t.split(n).join(tok);
  t = t.replace(/[0-9][0-9.,]*/g, ' __num__ ').replace(/[^a-z_ ]+/g, ' ').replace(/\s+/g, ' ').trim();
  return t;
}
function shingles(s: string): Set<string> {
  const w = s.split(' ').filter(Boolean); const out = new Set<string>();
  for (let i = 0; i + SHINGLE_K <= w.length; i++) out.add(w.slice(i, i + SHINGLE_K).join(' '));
  if (out.size === 0 && w.length) out.add(w.join(' '));
  return out;
}
function jac(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  const [s, big] = a.size < b.size ? [a, b] : [b, a]; let i = 0;
  for (const x of s) if (big.has(x)) i++;
  return i / (a.size + b.size - i);
}

async function main() {
  const targets = process.argv.slice(2).length
    ? process.argv.slice(2)
    : ['california/fresno', 'arizona/mesa', 'arkansas/bryant', 'arkansas/benton', 'connecticut/haddam', 'vermont/burlington'];
  const params = getAllCityParams();
  const docs: Array<{ key: string; sh: Set<string>; words: number }> = [];
  for (const p of params) {
    const c = await getCityContent(p.slug, p.city);
    if (!c) continue;
    const r = renderedText(c);
    docs.push({ key: `${p.slug}/${p.city}`, sh: shingles(normalize(r, c)), words: (r.match(/\S+/g) || []).length });
  }
  for (const t of targets) {
    const me = docs.find((d) => d.key === t);
    if (!me) { console.log(`${t}: NOT FOUND`); continue; }
    let best = { key: '', sim: 0 };
    for (const d of docs) {
      if (d.key === t) continue;
      const s = jac(me.sh, d.sh);
      if (s > best.sim) best = { key: d.key, sim: s };
    }
    const flag = best.sim > 0.3 ? '  <-- OVER 30%' : '';
    console.log(`${t}  (${me.words}w)  maxRendered=${(best.sim * 100).toFixed(1)}%  vs ${best.key}${flag}`);
  }
}
main();
