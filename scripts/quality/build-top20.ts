/**
 * build-top20.ts
 *
 * Builds a source-grounded "top 20 largest cities per state" dataset from the
 * repo's Census-based population file, then audits coverage against the
 * existing generated city routes.
 *
 * SOURCE: scripts/data/city-populations.json  (declares source = "US Census
 * Bureau 2022 Population Estimates"). We rank by that population only. We do
 * NOT invent city names or populations. Where the sourced dataset has fewer
 * than 20 cities for a state, we mark the state as NEEDS_SOURCING rather than
 * fabricate entries.
 *
 * Outputs:
 *   - scripts/data/top-20-cities.json        (the dataset: ranked, capped at 20)
 *   - scripts/reports/top20-coverage.json    (coverage vs existing routes)
 *
 * Run: npx tsx scripts/quality/build-top20.ts
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import popJson from '../data/city-populations.json';
import { getAllCityParams } from '../../src/lib/cities-content/index';

const TOP_N = 20;
const POP = (popJson as { source?: string; populations: Record<string, Record<string, number>> });
const SOURCE = POP.source ?? 'unknown';

interface TopCity {
  slug: string;
  rank: number;
  population: number;
  source: string;
  hasRoute: boolean;
}
interface StateBlock {
  stateSlug: string;
  availableInDataset: number;
  requiredCount: number; // min(TOP_N, available)
  status: 'COMPLETE' | 'NEEDS_SOURCING'; // NEEDS_SOURCING if <20 in dataset
  cities: TopCity[];
}

// Existing routes
const existing = new Set(getAllCityParams().map((p) => `${p.slug}/${p.city}`));

const states = Object.keys(POP.populations).sort();
const dataset: StateBlock[] = states.map((stateSlug) => {
  const ranked = Object.entries(POP.populations[stateSlug])
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_N)
    .map(([slug, population], i) => ({
      slug,
      rank: i + 1,
      population,
      source: SOURCE,
      hasRoute: existing.has(`${stateSlug}/${slug}`),
    }));
  const available = Object.keys(POP.populations[stateSlug]).length;
  return {
    stateSlug,
    availableInDataset: available,
    requiredCount: Math.min(TOP_N, available),
    status: available >= TOP_N ? 'COMPLETE' : 'NEEDS_SOURCING',
    cities: ranked,
  };
});

// Coverage math
const requiredCities = dataset.flatMap((s) => s.cities.map((c) => `${s.stateSlug}/${c.slug}`));
const requiredExisting = requiredCities.filter((k) => existing.has(k));
const requiredMissing = requiredCities.filter((k) => !existing.has(k));
const requiredSet = new Set(requiredCities);
const extraRoutes = [...existing].filter((k) => !requiredSet.has(k)); // routes outside the top-20 universe

const needsSourcing = dataset.filter((s) => s.status === 'NEEDS_SOURCING');
const idealTotal = states.length * TOP_N; // 50 * 20 = 1000

const coverage = {
  source: SOURCE,
  topN: TOP_N,
  states: states.length,
  idealRequiredCities_50x20: idealTotal,
  sourcedRequiredCities: requiredCities.length,
  sourcedRequiredExistingAsRoute: requiredExisting.length,
  sourcedRequiredMissingRoute: requiredMissing.length,
  extraRoutesOutsideTop20: extraRoutes.length,
  statesComplete_ge20: dataset.filter((s) => s.status === 'COMPLETE').length,
  statesNeedingSourcing_lt20: needsSourcing.length,
  needsSourcingDetail: needsSourcing.map((s) => ({ state: s.stateSlug, have: s.availableInDataset, need: TOP_N - s.availableInDataset })),
  missingRouteSample: requiredMissing.slice(0, 40),
  extraRouteSample: extraRoutes.slice(0, 20),
};

const dataDir = join('scripts', 'data');
const repDir = join('scripts', 'reports');
if (!existsSync(repDir)) mkdirSync(repDir, { recursive: true });
writeFileSync(join(dataDir, 'top-20-cities.json'), JSON.stringify({ source: SOURCE, topN: TOP_N, generatedFrom: 'scripts/data/city-populations.json', states: dataset }, null, 2));
writeFileSync(join(repDir, 'top20-coverage.json'), JSON.stringify(coverage, null, 2));

console.log('=== TOP-20 COVERAGE ===');
console.log(JSON.stringify(coverage, null, 2));
console.log('\nWrote scripts/data/top-20-cities.json and scripts/reports/top20-coverage.json');
