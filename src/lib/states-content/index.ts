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
// Tier 2 states
import { michigan } from './michigan';
import { newYork } from './new-york';
import { arizona } from './arizona';
import { missouri } from './missouri';
import { alabama } from './alabama';
import { louisiana } from './louisiana';
import { kentucky } from './kentucky';
import { mississippi } from './mississippi';
import { oklahoma } from './oklahoma';
import { arkansas } from './arkansas';
// Tier 3 states
import { southCarolina } from './south-carolina';
import { virginia } from './virginia';
import { wisconsin } from './wisconsin';
import { minnesota } from './minnesota';
import { colorado } from './colorado';
import { iowa } from './iowa';
import { newJersey } from './new-jersey';
import { kansas } from './kansas';
import { maryland } from './maryland';
import { washington } from './washington';
// Tier 4 states
import { oregon } from './oregon';
import { newMexico } from './new-mexico';
import { nebraska } from './nebraska';
import { utah } from './utah';
import { nevada } from './nevada';
import { westVirginia } from './west-virginia';
import { idaho } from './idaho';
import { montana } from './montana';
import { northDakota } from './north-dakota';
import { southDakota } from './south-dakota';
// Tier 5 states
import { wyoming } from './wyoming';
import { connecticut } from './connecticut';
import { massachusetts } from './massachusetts';
import { maine } from './maine';
import { newHampshire } from './new-hampshire';
import { vermont } from './vermont';
import { rhodeIsland } from './rhode-island';
import { delaware } from './delaware';
import { alaska } from './alaska';
import { hawaii } from './hawaii';

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
  // Tier 2 states
  'michigan': michigan,
  'new-york': newYork,
  'arizona': arizona,
  'missouri': missouri,
  'alabama': alabama,
  'louisiana': louisiana,
  'kentucky': kentucky,
  'mississippi': mississippi,
  'oklahoma': oklahoma,
  'arkansas': arkansas,
  // Tier 3 states
  'south-carolina': southCarolina,
  'virginia': virginia,
  'wisconsin': wisconsin,
  'minnesota': minnesota,
  'colorado': colorado,
  'iowa': iowa,
  'new-jersey': newJersey,
  'kansas': kansas,
  'maryland': maryland,
  'washington': washington,
  // Tier 4 states
  'oregon': oregon,
  'new-mexico': newMexico,
  'nebraska': nebraska,
  'utah': utah,
  'nevada': nevada,
  'west-virginia': westVirginia,
  'idaho': idaho,
  'montana': montana,
  'north-dakota': northDakota,
  'south-dakota': southDakota,
  // Tier 5 states
  'wyoming': wyoming,
  'connecticut': connecticut,
  'massachusetts': massachusetts,
  'maine': maine,
  'new-hampshire': newHampshire,
  'vermont': vermont,
  'rhode-island': rhodeIsland,
  'delaware': delaware,
  'alaska': alaska,
  'hawaii': hawaii,
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
