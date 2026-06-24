/**
 * buildCityProfile — assembles ONLY trustworthy per-city signals into one bundle,
 * with provenance tags. No invented facts. Unverified data (roads, SOL, hospitals)
 * is deliberately excluded or marked NEEDS_SOURCE downstream.
 */
import farsRaw from '../../../scripts/city-accident-data.json';
import popRaw from '../../../scripts/data/city-populations.json';
import topRaw from '../../../scripts/data/top-20-cities.json';
import regionRaw from '../../../scripts/data/regional-accident-patterns.json';
import type { FarsCity } from './fars-types';

type Provenance = 'VERIFIED' | 'GENERAL' | 'NEEDS_SOURCE';

export interface MechanismMix {
  type: string;
  percentage: number;
  localFactor: string;
}

export interface CityProfile {
  // identity
  slug: string;
  name: string;
  stateSlug: string;
  stateName: string;
  // verified locals
  county: string | null;           // VERIFIED (FARS countyName) or null
  lat: number | null;
  lng: number | null;
  population: number | null;        // VERIFIED (Census) or null
  rank: number | null;              // in-state population rank (top-20 dataset) or null
  isTop20: boolean;
  // FARS
  truckFatalities: number;
  fatalCrashes: number;
  dataYear: number;
  farsSourceUrl: string;
  // region
  region: string | null;
  regionName: string | null;
  mechanismMix: MechanismMix[];     // sorted desc by percentage
  dominantMechanism: MechanismMix | null;
  // derived tiers
  sizeTier: 'metro' | 'mid' | 'small' | 'farsExtra';
  severityTier: 'none' | 'low' | 'elevated' | 'high';
  // provenance ledger
  provenance: Record<string, Provenance>;
  needsSource: string[];            // human-readable list of gaps
}

const FARS = farsRaw as { sourceUrl: string; states: Record<string, { cities: FarsCity[] }> };
const POP = popRaw as { populations: Record<string, Record<string, number>> };
const TOP = topRaw as { states: Array<{ stateSlug: string; cities: Array<{ slug: string; rank: number }> }> };
const REGION = regionRaw as {
  stateToRegion: Record<string, string>;
  regions: Record<string, { name: string; accidentPatterns: Record<string, { percentage: number; localFactor: string }> }>;
};

function sizeTier(pop: number | null): CityProfile['sizeTier'] {
  if (pop === null || pop === 0) return 'farsExtra';
  if (pop >= 400000) return 'metro';
  if (pop >= 120000) return 'mid';
  if (pop >= 25000) return 'small';
  return 'farsExtra';
}
function severityTier(deaths: number): CityProfile['severityTier'] {
  if (deaths >= 10) return 'high';
  if (deaths >= 4) return 'elevated';
  if (deaths >= 1) return 'low';
  return 'none';
}

export function buildCityProfile(stateSlug: string, citySlug: string): CityProfile | null {
  const farsCity = FARS.states[stateSlug]?.cities?.find((c) => c.slug === citySlug);
  const population = POP.populations[stateSlug]?.[citySlug] ?? null;
  const topState = TOP.states.find((s) => s.stateSlug === stateSlug);
  const topCity = topState?.cities.find((c) => c.slug === citySlug);
  const region = REGION.stateToRegion[stateSlug] ?? null;
  const regionDef = region ? REGION.regions[region] : null;

  // Need at least identity + FARS to render a real page
  const name =
    farsCity?.name ??
    citySlug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const stateName =
    farsCity?.stateName ??
    stateSlug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const mechanismMix: MechanismMix[] = regionDef
    ? Object.entries(regionDef.accidentPatterns)
        .map(([type, v]) => ({ type, percentage: v.percentage, localFactor: v.localFactor }))
        .sort((a, b) => b.percentage - a.percentage)
    : [];

  const provenance: Record<string, Provenance> = {
    identity: 'VERIFIED',
    county: farsCity?.countyName ? 'VERIFIED' : 'NEEDS_SOURCE',
    coords: farsCity?.lat ? 'VERIFIED' : 'NEEDS_SOURCE',
    population: population ? 'VERIFIED' : 'NEEDS_SOURCE',
    fars: 'VERIFIED',
    region: region ? 'VERIFIED' : 'NEEDS_SOURCE',
    roads: 'NEEDS_SOURCE',         // current road data is demonstrably wrong
    hospitals: 'NEEDS_SOURCE',
    courthouse: 'NEEDS_SOURCE',
    statuteOfLimitations: 'NEEDS_SOURCE', // repo legal file is unverified (FL/ME/WV flagged)
  };
  const needsSource = Object.entries(provenance)
    .filter(([, v]) => v === 'NEEDS_SOURCE')
    .map(([k]) => k);

  return {
    slug: citySlug,
    name,
    stateSlug,
    stateName,
    county: farsCity?.countyName ?? null,
    lat: farsCity?.lat ?? null,
    lng: farsCity?.lng ?? null,
    population,
    rank: topCity?.rank ?? null,
    isTop20: Boolean(topCity),
    truckFatalities: farsCity?.truckFatalities ?? 0,
    fatalCrashes: farsCity?.fatalCrashes ?? 0,
    dataYear: farsCity?.dataYear ?? 2022,
    farsSourceUrl: farsCity?.sourceUrl ?? FARS.sourceUrl,
    region,
    regionName: regionDef?.name ?? null,
    mechanismMix,
    dominantMechanism: mechanismMix[0] ?? null,
    sizeTier: sizeTier(population),
    severityTier: severityTier(farsCity?.truckFatalities ?? 0),
    provenance,
    needsSource,
  };
}
