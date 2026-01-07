// Central export for all accident content

import { AccidentContent, ACCIDENT_SLUGS, AccidentSlug, ACCIDENT_NAMES } from './types';
import { jacknifeAccidents } from './jackknife-accidents';

// Map of all accident content
const accidentContentMap: Partial<Record<AccidentSlug, AccidentContent>> = {
  'jackknife-accidents': jacknifeAccidents,
  // Other accident types will be added here as they are created:
  // 'rollover-accidents': rolloverAccidents,
  // 'underride-accidents': underrideAccidents,
  // etc.
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
