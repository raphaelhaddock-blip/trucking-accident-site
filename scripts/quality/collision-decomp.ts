/**
 * collision-decomp.ts — for the worst-colliding engine hub pairs, decompose the
 * shared RENDERED shingles by component (hero, trucking, each common-accident, each
 * FAQ) so we can see EXACTLY which slots/answers drive the >30%. Read-only, no writes.
 *
 * Usage: npx tsx scripts/quality/collision-decomp.ts [stateA/cityA stateB/cityB]
 *   (default: connecticut/cromwell georgia/la-grange, the PR4 worst pair)
 */
import { buildCityProfile } from '../../src/lib/content-engine/profile';
import { composeCityContentHub } from '../../src/lib/content-engine/compose';
import { getStateName } from '../../src/lib/cities-content/index';
import type { CityContent } from '../../src/lib/cities-content/types';

const K = 5;
type Meta = { name: string; slug: string; stateSlug: string; stateName: string };
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
// Per-component rendered fragments, in the same order the route renders them.
function components(c: CityContent): Array<{ tag: string; text: string }> {
  const out: Array<{ tag: string; text: string }> = [];
  out.push({ tag: 'hero', text: c.heroText ?? '' });
  out.push({ tag: 'trucking', text: c.truckingIndustry ?? '' });
  (c.commonAccidents ?? []).forEach((a, i) => out.push({ tag: `mech[${i}]`, text: `${a.type} ${a.localFactor}` }));
  (c.faqs ?? []).forEach((f, i) => out.push({ tag: `faq[${i}]`, text: `${f.question} ${f.answer}` }));
  return out;
}
const metaOf = (c: CityContent): Meta => ({ name: c.name, slug: c.slug, stateSlug: c.stateSlug, stateName: c.stateName });

function main() {
  const args = process.argv.slice(2);
  const [A, B] = args.length >= 2 ? [args[0], args[1]] : ['connecticut/cromwell', 'georgia/la-grange'];
  const [[sa, ca], [sb, cb]] = [A.split('/'), B.split('/')];
  const ha = composeCityContentHub(buildCityProfile(sa, ca)!, '2026-06-24');
  const hb = composeCityContentHub(buildCityProfile(sb, cb)!, '2026-06-24');
  const ma = metaOf(ha), mb = metaOf(hb);

  const compsA = components(ha), compsB = components(hb);
  // Build whole-doc shingles (matches the gate) and a map shingle -> component tag.
  const shA = shingles(normalize(compsA.map((x) => x.text).join(' \n '), ma));
  const shB = shingles(normalize(compsB.map((x) => x.text).join(' \n '), mb));
  const overall = jaccard(shA, shB);

  // Attribute SHARED shingles to components by re-shingling each component alone.
  const compShinglesB = compsB.map((x) => ({ tag: x.tag, sh: shingles(normalize(x.text, mb)) }));
  const sharedByComp = new Map<string, number>();
  for (const s of shA) {
    if (!shB.has(s)) continue;
    // find which B-component contains this shared shingle
    const hit = compShinglesB.find((cb2) => cb2.sh.has(s));
    const tag = hit ? hit.tag.replace(/\[\d+\]/, '[*]') : 'cross/other';
    sharedByComp.set(tag, (sharedByComp.get(tag) ?? 0) + 1);
  }
  const inter = [...shA].filter((s) => shB.has(s)).length;

  console.log(`=== COLLISION DECOMP: ${A}  <->  ${B} ===`);
  console.log(`overall rendered Jaccard: ${(overall * 100).toFixed(1)}%   |shA|=${shA.size} |shB|=${shB.size} shared=${inter}`);
  console.log('\nshared shingles attributed to component (B side):');
  [...sharedByComp.entries()].sort((x, y) => y[1] - x[1]).forEach(([tag, n]) =>
    console.log(`  ${String(n).padStart(4)}  ${tag}  (${(100 * n / inter).toFixed(0)}% of shared)`));

  // Per-component identical check (which exact slots are byte-identical after normalize)
  console.log('\nper-component normalized-identical between the two cities:');
  const byTagA = new Map(compsA.map((x) => [x.tag, normalize(x.text, ma)]));
  for (const x of compsB) {
    const an = byTagA.get(x.tag);
    if (an === undefined) continue;
    const bn = normalize(x.text, mb);
    const same = an === bn;
    if (same) console.log(`  IDENTICAL  ${x.tag}: ${bn.slice(0, 70)}...`);
  }
}
main();
