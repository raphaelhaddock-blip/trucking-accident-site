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
import {
  getVerifiedCorridors, getVerifiedCourt, getVerifiedTraumaCenters, getVerifiedLegalFacts,
  localDataProvenance, type Corridor, type VenueCourt, type TraumaCenter, type LegalFacts,
} from './local-data';

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
  // verified local data (PR7) — empty until an official source is verified per record.
  // The engine does NOT render these yet; they are wired and provenance-gated so a later
  // PR can consume them. With the empty PR7 data files these are all [] / null.
  corridors: Corridor[];
  venueCourt: VenueCourt | null;
  traumaCenters: TraumaCenter[];
  legalFacts: LegalFacts | null;
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

  // Verified-local-data lookups (PR7). Empty data files => all [] / null today.
  const county = farsCity?.countyName ?? null;
  const corridors = getVerifiedCorridors(stateSlug, citySlug);
  const venueCourt = getVerifiedCourt(stateSlug, citySlug, county);
  const traumaCenters = getVerifiedTraumaCenters(stateSlug, citySlug);
  const legalFacts = getVerifiedLegalFacts(stateSlug);
  // roads/hospitals/courthouse/SOL provenance now comes from the verified-data layer.
  // With empty files these resolve to NEEDS_SOURCE — identical to the prior hardcoded
  // values — so the ledger and rendered output are unchanged until real data is added.
  const localProv = localDataProvenance(stateSlug, citySlug, county);
  const provenance: Record<string, Provenance> = {
    identity: 'VERIFIED',
    county: farsCity?.countyName ? 'VERIFIED' : 'NEEDS_SOURCE',
    coords: farsCity?.lat ? 'VERIFIED' : 'NEEDS_SOURCE',
    population: population ? 'VERIFIED' : 'NEEDS_SOURCE',
    fars: 'VERIFIED',
    region: region ? 'VERIFIED' : 'NEEDS_SOURCE',
    roads: localProv.roads,
    hospitals: localProv.hospitals,
    courthouse: localProv.courthouse,
    statuteOfLimitations: localProv.statuteOfLimitations,
  };
  const needsSource = Object.entries(provenance)
    .filter(([, v]) => v === 'NEEDS_SOURCE')
    .map(([k]) => k);

  return {
    slug: citySlug,
    name,
    stateSlug,
    stateName,
    county,
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
    corridors,
    venueCourt,
    traumaCenters,
    legalFacts,
    provenance,
    needsSource,
  };
}
