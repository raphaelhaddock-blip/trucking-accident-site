// Central export for all accident content

import { AccidentContent, ACCIDENT_SLUGS, AccidentSlug, ACCIDENT_NAMES } from './types';
import { jacknifeAccidents } from './jackknife-accidents';
import { rolloverAccidents } from './rollover-accidents';
import { underrideAccidents } from './underride-accidents';
import { rearEndCollisions } from './rear-end-collisions';
import { headOnCollisions } from './head-on-collisions';
import { tBoneAccidents } from './t-bone-accidents';
import { wideTurnAccidents } from './wide-turn-accidents';
import { blindSpotAccidents } from './blind-spot-accidents';
import { sideswipeAccidents } from './sideswipe-accidents';
import { overrideAccidents } from './override-accidents';
import { brakeFailure } from './brake-failure';
import { tireBlowout } from './tire-blowout';
import { driverFatigue } from './driver-fatigue';
import { distractedDriving } from './distracted-driving';
import { speedingAccidents } from './speeding-accidents';

// Map of all accident content
const accidentContentMap: Partial<Record<AccidentSlug, AccidentContent>> = {
  // Tier 1 (5 highest priority)
  'jackknife-accidents': jacknifeAccidents,
  'rollover-accidents': rolloverAccidents,
  'underride-accidents': underrideAccidents,
  'rear-end-collisions': rearEndCollisions,
  'head-on-collisions': headOnCollisions,
  // Tier 2 (5 high volume)
  't-bone-accidents': tBoneAccidents,
  'wide-turn-accidents': wideTurnAccidents,
  'blind-spot-accidents': blindSpotAccidents,
  'sideswipe-accidents': sideswipeAccidents,
  'override-accidents': overrideAccidents,
  // Tier 3 (5 cause-based)
  'brake-failure': brakeFailure,
  'tire-blowout': tireBlowout,
  'driver-fatigue': driverFatigue,
  'distracted-driving': distractedDriving,
  'speeding-accidents': speedingAccidents,
  // Tier 4 will be added as they are created
};

/**
 * Get accident content by slug
 * Returns undefined if content hasn't been created yet
 */
export function getAccidentContent(slug: string): AccidentContent | undefined {
  return accidentContentMap[slug as AccidentSlug];
}

/**
 * Get all accident slugs that have content
 */
export function getAvailableAccidentSlugs(): string[] {
  return Object.keys(accidentContentMap);
}

/**
 * Get all accident slugs (including those without content yet)
 */
export function getAllAccidentSlugs(): string[] {
  return [...ACCIDENT_SLUGS];
}

/**
 * Check if an accident slug is valid
 */
export function isValidAccidentSlug(slug: string): slug is AccidentSlug {
  return ACCIDENT_SLUGS.includes(slug as AccidentSlug);
}

/**
 * Get display name for an accident slug
 */
export function getAccidentName(slug: string): string {
  return ACCIDENT_NAMES[slug as AccidentSlug] || slug;
}

// Re-export types
export type { AccidentContent, AccidentSlug, FAQ } from './types';
export { ACCIDENT_SLUGS, ACCIDENT_NAMES } from './types';
