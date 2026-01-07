// Central export for all state content

import { StateContent, STATE_SLUGS, StateSlug, STATE_NAMES, STATE_ABBREVIATIONS } from './types';
import { texas } from './texas';
import { california } from './california';
import { florida } from './florida';
import { georgia } from './georgia';
import { pennsylvania } from './pennsylvania';
import { ohio } from './ohio';
import { illinois } from './illinois';
import { northCarolina } from './north-carolina';
import { tennessee } from './tennessee';
import { indiana } from './indiana';

// Map of all state content (will be populated as content is created)
const stateContentMap: Partial<Record<StateSlug, StateContent>> = {
  // Tier 1 states (10 highest trucking fatality states)
  'texas': texas,
  'california': california,
  'florida': florida,
  'georgia': georgia,
  'pennsylvania': pennsylvania,
  'ohio': ohio,
  'illinois': illinois,
  'north-carolina': northCarolina,
  'tennessee': tennessee,
  'indiana': indiana,
};

/**
 * Get state content by slug
 * Returns undefined if content hasn't been created yet
 */
export function getStateContent(slug: string): StateContent | undefined {
  return stateContentMap[slug as StateSlug];
}

/**
 * Get all state slugs that have content
 */
export function getAvailableStateSlugs(): string[] {
  return Object.keys(stateContentMap);
}

/**
 * Get all state slugs (including those without content yet)
 */
export function getAllStateSlugs(): string[] {
  return [...STATE_SLUGS];
}

/**
 * Check if a state slug is valid
 */
export function isValidStateSlug(slug: string): slug is StateSlug {
  return STATE_SLUGS.includes(slug as StateSlug);
}

/**
 * Get display name for a state slug
 */
export function getStateName(slug: string): string {
  return STATE_NAMES[slug as StateSlug] || slug;
}

/**
 * Get abbreviation for a state slug
 */
export function getStateAbbreviation(slug: string): string {
  return STATE_ABBREVIATIONS[slug as StateSlug] || slug.toUpperCase();
}

// Re-export types
export type { StateContent, StateSlug, FAQ } from './types';
export { STATE_SLUGS, STATE_NAMES, STATE_ABBREVIATIONS } from './types';
