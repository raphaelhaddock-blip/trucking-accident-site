/**
 * Merge City Data Script
 *
 * Combines FARS raw city data with population data and formats
 * for the city-accident-data.json used by city pages.
 *
 * Run with: npx tsx scripts/merge-city-data.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Input types from FARS raw data
interface FARSCityRecord {
  cityCode: number;
  cityName: string;
  countyCode: number;
  countyName: string;
  fatalities: number;
  crashes: number;
  lat?: number;
  lng?: number;
}

interface FARSStateData {
  stateName: string;
  totalFatalities: number;
  totalCrashes: number;
  cities: Record<string, FARSCityRecord>;
}

interface FARSRawData {
  generatedAt: string;
  dataYear: number;
  sourceUrl: string;
  totalCities: number;
  totalFatalities: number;
  totalCrashes: number;
  states: Record<string, FARSStateData>;
}

// Output types for city pages
interface CityOutput {
  slug: string;
  name: string;
  stateSlug: string;
  stateName: string;
  population: number;
  truckFatalities: number;
  fatalCrashes: number;
  dataYear: number;
  dangerousRoads: string[];
  sourceUrl: string;
  lat?: number;
  lng?: number;
  countyName?: string;
}

interface StateOutput {
  stateName: string;
  totalFatalities: number;
  cities: CityOutput[];
}

interface OutputData {
  generatedAt: string;
  totalCities: number;
  totalFatalities: number;
  dataYear: number;
  sourceUrl: string;
  states: Record<string, StateOutput>;
}

// Dangerous road patterns by state
const STATE_ROADS: Record<string, string[]> = {
  alabama: ['I-65', 'I-20', 'I-10', 'I-85', 'US-231'],
  alaska: ['AK-1', 'AK-2', 'AK-3', 'Glenn Highway'],
  arizona: ['I-10', 'I-40', 'I-17', 'I-8', 'US-60'],
  arkansas: ['I-40', 'I-30', 'I-55', 'US-71', 'US-67'],
  california: ['I-5', 'I-10', 'I-15', 'I-80', 'US-101'],
  colorado: ['I-70', 'I-25', 'I-76', 'US-40', 'US-285'],
  connecticut: ['I-95', 'I-84', 'I-91', 'US-1', 'Route 8'],
  delaware: ['I-95', 'US-13', 'US-1', 'US-301', 'DE-1'],
  florida: ['I-95', 'I-4', 'I-75', 'I-10', 'US-1'],
  georgia: ['I-75', 'I-85', 'I-20', 'I-16', 'US-23'],
  hawaii: ['H-1', 'H-2', 'H-3', 'Kamehameha Hwy'],
  idaho: ['I-84', 'I-90', 'I-15', 'US-95', 'US-20'],
  illinois: ['I-55', 'I-80', 'I-90', 'I-94', 'I-57'],
  indiana: ['I-65', 'I-70', 'I-69', 'I-74', 'US-31'],
  iowa: ['I-80', 'I-35', 'I-29', 'US-20', 'US-30'],
  kansas: ['I-70', 'I-35', 'US-54', 'US-83', 'US-56'],
  kentucky: ['I-65', 'I-75', 'I-64', 'I-71', 'US-127'],
  louisiana: ['I-10', 'I-20', 'I-49', 'I-55', 'US-90'],
  maine: ['I-95', 'I-295', 'US-1', 'US-2', 'Route 1'],
  maryland: ['I-95', 'I-70', 'I-83', 'I-695', 'US-50'],
  massachusetts: ['I-90', 'I-95', 'I-93', 'I-495', 'Route 3'],
  michigan: ['I-75', 'I-94', 'I-96', 'I-69', 'US-131'],
  minnesota: ['I-94', 'I-35', 'I-90', 'US-169', 'US-10'],
  mississippi: ['I-55', 'I-20', 'I-10', 'US-82', 'US-49'],
  missouri: ['I-70', 'I-44', 'I-55', 'I-35', 'US-60'],
  montana: ['I-90', 'I-15', 'US-2', 'US-93', 'US-12'],
  nebraska: ['I-80', 'I-76', 'US-30', 'US-20', 'US-77'],
  nevada: ['I-15', 'I-80', 'US-95', 'US-93', 'US-50'],
  'new-hampshire': ['I-93', 'I-89', 'I-95', 'US-3', 'Route 101'],
  'new-jersey': ['I-95', 'I-78', 'I-80', 'NJ Turnpike', 'Garden State Pkwy'],
  'new-mexico': ['I-40', 'I-25', 'I-10', 'US-54', 'US-70'],
  'new-york': ['I-87', 'I-90', 'I-95', 'I-81', 'US-20'],
  'north-carolina': ['I-85', 'I-40', 'I-95', 'I-77', 'US-70'],
  'north-dakota': ['I-94', 'I-29', 'US-2', 'US-83', 'US-52'],
  ohio: ['I-71', 'I-75', 'I-77', 'I-80', 'I-90'],
  oklahoma: ['I-40', 'I-35', 'I-44', 'US-69', 'US-75'],
  oregon: ['I-5', 'I-84', 'US-101', 'US-97', 'US-26'],
  pennsylvania: ['I-76', 'I-80', 'I-81', 'I-95', 'PA Turnpike'],
  'rhode-island': ['I-95', 'I-195', 'US-1', 'Route 4', 'Route 10'],
  'south-carolina': ['I-85', 'I-26', 'I-95', 'I-20', 'US-17'],
  'south-dakota': ['I-90', 'I-29', 'US-14', 'US-83', 'US-81'],
  tennessee: ['I-40', 'I-65', 'I-24', 'I-75', 'US-41'],
  texas: ['I-10', 'I-35', 'I-20', 'I-45', 'US-59'],
  utah: ['I-15', 'I-80', 'I-70', 'US-89', 'US-6'],
  vermont: ['I-89', 'I-91', 'US-7', 'US-2', 'Route 100'],
  virginia: ['I-95', 'I-81', 'I-64', 'I-66', 'US-29'],
  washington: ['I-5', 'I-90', 'I-82', 'US-2', 'US-97'],
  'west-virginia': ['I-77', 'I-79', 'I-64', 'I-81', 'US-19'],
  wisconsin: ['I-94', 'I-90', 'I-43', 'US-41', 'US-51'],
  wyoming: ['I-80', 'I-90', 'I-25', 'US-20', 'US-26'],
};

/**
 * Convert city name to title case
 */
function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/\bMc(\w)/g, (_, c) => `Mc${c.toUpperCase()}`) // McDonald, McAllen, etc.
    .replace(/\bO'(\w)/g, (_, c) => `O'${c.toUpperCase()}`); // O'Fallon, etc.
}

/**
 * Create URL slug from city name
 */
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, '') // Remove apostrophes
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Main execution
 */
async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  MERGE CITY DATA');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Load FARS raw data
  const rawDataPath = path.join(process.cwd(), 'scripts/fars-city-accidents-raw.json');
  const rawData: FARSRawData = JSON.parse(fs.readFileSync(rawDataPath, 'utf-8'));

  console.log(`Loaded FARS raw data:`);
  console.log(`  - ${rawData.totalCities} cities`);
  console.log(`  - ${rawData.totalFatalities} fatalities`);
  console.log(`  - ${Object.keys(rawData.states).length} states\n`);

  // Transform data
  const output: OutputData = {
    generatedAt: new Date().toISOString(),
    totalCities: 0,
    totalFatalities: rawData.totalFatalities,
    dataYear: rawData.dataYear,
    sourceUrl: rawData.sourceUrl,
    states: {},
  };

  const seenSlugs = new Set<string>(); // Track duplicates

  for (const [stateSlug, stateData] of Object.entries(rawData.states)) {
    const roads = STATE_ROADS[stateSlug] || ['I-10', 'I-20', 'US-1'];

    const cities: CityOutput[] = [];

    for (const cityRecord of Object.values(stateData.cities)) {
      // Skip cities without proper names
      if (!cityRecord.cityName || cityRecord.cityName === 'NOT APPLICABLE') {
        continue;
      }

      const cityName = toTitleCase(cityRecord.cityName);
      let slug = createSlug(cityName);

      // Handle duplicate slugs within state by appending county
      const fullSlug = `${stateSlug}-${slug}`;
      if (seenSlugs.has(fullSlug)) {
        // Append county name for uniqueness
        const countyPart = cityRecord.countyName
          ? createSlug(cityRecord.countyName.split(' (')[0])
          : cityRecord.countyCode.toString();
        slug = `${slug}-${countyPart}`;
      }
      seenSlugs.add(`${stateSlug}-${slug}`);

      // Extract county name without code
      const countyName = cityRecord.countyName
        ? toTitleCase(cityRecord.countyName.split(' (')[0])
        : '';

      cities.push({
        slug,
        name: cityName,
        stateSlug,
        stateName: stateData.stateName,
        population: 0, // Will be filled by population merge if available
        truckFatalities: cityRecord.fatalities,
        fatalCrashes: cityRecord.crashes,
        dataYear: rawData.dataYear,
        dangerousRoads: roads.slice(0, 3), // Top 3 roads
        sourceUrl: rawData.sourceUrl,
        lat: cityRecord.lat,
        lng: cityRecord.lng,
        countyName,
      });
    }

    // Sort by fatalities (descending)
    cities.sort((a, b) => b.truckFatalities - a.truckFatalities);

    if (cities.length > 0) {
      output.states[stateSlug] = {
        stateName: stateData.stateName,
        totalFatalities: stateData.totalFatalities,
        cities,
      };
      output.totalCities += cities.length;
    }
  }

  // Save output
  const outputPath = path.join(process.cwd(), 'scripts/city-accident-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  // Summary
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  MERGE COMPLETE');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`  Total cities: ${output.totalCities}`);
  console.log(`  Total fatalities: ${output.totalFatalities}`);
  console.log(`  States: ${Object.keys(output.states).length}`);
  console.log(`\n  Output: ${outputPath}`);
  console.log('═══════════════════════════════════════════════════════════\n');

  // Per-state summary
  console.log('Top 15 States by City Count:');
  console.log('─'.repeat(60));

  const stateSummaries = Object.entries(output.states)
    .map(([slug, data]) => ({
      slug,
      name: data.stateName,
      cities: data.cities.length,
      fatalities: data.totalFatalities,
    }))
    .sort((a, b) => b.cities - a.cities);

  for (const state of stateSummaries.slice(0, 15)) {
    console.log(`  ${state.name.padEnd(20)} ${state.cities.toString().padStart(4)} cities`);
  }
}

main().catch(console.error);
