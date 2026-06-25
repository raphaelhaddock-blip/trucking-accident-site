/**
 * local-data.ts — SAFE loader for verified per-city local data (roads/corridors,
 * courts/venue, trauma hospitals) and per-state legal facts (SOL + negligence).
 *
 * INVARIANT: nothing here returns a fact unless its record is `confidence: 'VERIFIED'`
 * AND passes its category cross-check. Missing, GENERAL, NEEDS_SOURCE, or cross-check-
 * failing records resolve to null / []. The page may be less specific, never wrong.
 *
 * The data files (scripts/data/city-{roads,courts,hospitals}.json) ship EMPTY in PR7,
 * so every getter returns null/[] today and the engine output is unchanged. Records are
 * added only after a human verifies an official source (see docs/PR7-SOURCE-PLAN.md).
 *
 * Validated by scripts/quality/local-data-validate.ts (`npm run audit:localdata`).
 */
import roadsRaw from '../../../scripts/data/city-roads.json';
import courtsRaw from '../../../scripts/data/city-courts.json';
import hospitalsRaw from '../../../scripts/data/city-hospitals.json';
import legalRaw from '../../../scripts/data/correct-legal-data.json';

export type Confidence = 'VERIFIED' | 'GENERAL' | 'NEEDS_SOURCE';

export interface ProvenanceMeta {
  sourceName?: string;
  sourceUrl?: string;
  verifiedDate?: string;
  confidence?: Confidence;
  note?: string;
}

export interface RoadCrashStat {
  value: number;
  metric: string;
  year: number;
  sourceUrl: string;
  confidence?: Confidence;
}
export interface Corridor extends ProvenanceMeta {
  name: string;
  designation: string; // Interstate | US | State | Loop | Beltway
  role: string;        // neutral function descriptor — never a danger claim by itself
  crashStat?: RoadCrashStat | null;
}
export interface VenueCourt extends ProvenanceMeta {
  county: string;
  trialCourtName: string;
  courtType: string;
}
export interface TraumaCenter extends ProvenanceMeta {
  name: string;
  traumaLevel: string; // I | II | III | IV — sourced designation only
}
export interface LegalFacts {
  solPersonalInjuryYears: number;
  negligenceSystem: string;
  negligenceSummary: string;
  solSourceUrl: string;
}

type RoadsFile = { roads?: Record<string, Record<string, { confidence?: Confidence; corridors?: Corridor[] } & ProvenanceMeta>> };
type CourtsFile = { courts?: Record<string, Record<string, VenueCourt>> };
type HospitalsFile = { hospitals?: Record<string, Record<string, { confidence?: Confidence; centers?: TraumaCenter[] } & ProvenanceMeta>> };

const ROADS = roadsRaw as RoadsFile;
const COURTS = courtsRaw as CourtsFile;
const HOSPITALS = hospitalsRaw as HospitalsFile;
// correct-legal-data.json today has NO per-state sourceUrl/confidence, so it is treated
// as NEEDS_SOURCE here regardless of the numbers it holds (state-law => Fable + Raphy).
const LEGAL = legalRaw as {
  statuteOfLimitations?: Record<string, { personalInjury?: number; sourceUrl?: string; confidence?: Confidence }>;
  negligenceRules?: Record<string, { type?: string; notes?: string; sourceUrl?: string; confidence?: Confidence }>;
};

export const isVerified = (m?: { confidence?: Confidence }): boolean => m?.confidence === 'VERIFIED';

// ---- PURE resolvers (operate on a given record; no file I/O) -------------------
// These hold the safety rules and are unit-tested directly by the safety proof with
// crafted unverified / mismatched records. The file getters below are thin wrappers.

type RoadCityRec = ({ confidence?: Confidence; corridors?: Corridor[] } & ProvenanceMeta) | undefined;
type HospCityRec = ({ confidence?: Confidence; centers?: TraumaCenter[] } & ProvenanceMeta) | undefined;
type SolRec = { personalInjury?: number; sourceUrl?: string; confidence?: Confidence } | undefined;
type NegRec = { type?: string; notes?: string; sourceUrl?: string; confidence?: Confidence } | undefined;

/** A corridor's crashStat is kept ONLY when fully sourced; otherwise stripped so no
 * danger claim can come from an unsourced number. */
export function resolveCorridors(rec: RoadCityRec): Corridor[] {
  if (!isVerified(rec)) return [];
  return (rec!.corridors ?? [])
    .filter((c) => isVerified(c) && c.name && c.designation && c.role)
    .map((c) => {
      const cs = c.crashStat;
      const statOk = !!cs && typeof cs.value === 'number' && !!cs.metric && typeof cs.year === 'number' && !!cs.sourceUrl && cs.confidence === 'VERIFIED';
      return { ...c, crashStat: statOk ? cs! : null };
    });
}

/** VERIFIED court only when its county matches the FARS county; mismatch/absent → null. */
export function resolveCourt(rec: VenueCourt | undefined, farsCounty: string | null): VenueCourt | null {
  if (!isVerified(rec) || !rec!.trialCourtName || !rec!.courtType || !rec!.county) return null;
  if (!farsCounty) return null;
  if (rec!.county.trim().toLowerCase() !== farsCounty.trim().toLowerCase()) return null;
  return rec!;
}

/** VERIFIED trauma centers with a sourced level only. */
export function resolveTrauma(rec: HospCityRec): TraumaCenter[] {
  if (!isVerified(rec)) return [];
  return (rec!.centers ?? []).filter((c) => isVerified(c) && c.name && c.traumaLevel);
}

/** Two-key rule: SOL renders only if BOTH the SOL and negligence records are VERIFIED
 * and the SOL carries a number + source. */
export function resolveLegal(sol: SolRec, neg: NegRec): LegalFacts | null {
  if (!isVerified(sol) || !isVerified(neg)) return null;
  if (typeof sol!.personalInjury !== 'number' || !sol!.sourceUrl) return null;
  return {
    solPersonalInjuryYears: sol!.personalInjury,
    negligenceSystem: neg!.type ?? '',
    negligenceSummary: neg!.notes ?? '',
    solSourceUrl: sol!.sourceUrl,
  };
}

// ---- file-reading getters (thin wrappers over the pure resolvers) --------------
export function getVerifiedCorridors(stateSlug: string, citySlug: string): Corridor[] {
  return resolveCorridors(ROADS.roads?.[stateSlug]?.[citySlug]);
}
export function getVerifiedCourt(stateSlug: string, citySlug: string, farsCounty: string | null): VenueCourt | null {
  return resolveCourt(COURTS.courts?.[stateSlug]?.[citySlug], farsCounty);
}
export function getVerifiedTraumaCenters(stateSlug: string, citySlug: string): TraumaCenter[] {
  return resolveTrauma(HOSPITALS.hospitals?.[stateSlug]?.[citySlug]);
}
export function getVerifiedLegalFacts(stateSlug: string): LegalFacts | null {
  return resolveLegal(LEGAL.statuteOfLimitations?.[stateSlug], LEGAL.negligenceRules?.[stateSlug]);
}

/** Provenance for the ledger: 'VERIFIED' only when a getter would return data. */
export function localDataProvenance(stateSlug: string, citySlug: string, farsCounty: string | null) {
  return {
    roads: getVerifiedCorridors(stateSlug, citySlug).length ? 'VERIFIED' : 'NEEDS_SOURCE',
    courthouse: getVerifiedCourt(stateSlug, citySlug, farsCounty) ? 'VERIFIED' : 'NEEDS_SOURCE',
    hospitals: getVerifiedTraumaCenters(stateSlug, citySlug).length ? 'VERIFIED' : 'NEEDS_SOURCE',
    statuteOfLimitations: getVerifiedLegalFacts(stateSlug) ? 'VERIFIED' : 'NEEDS_SOURCE',
  } as const;
}
