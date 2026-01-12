/**
 * Target Cities Batch Processor
 *
 * Processes the 100 target cities from target-cities.json (20 per state).
 * Organized by state for focused regional processing.
 *
 * Usage:
 *   npx tsx scripts/agents/target-batch-processor.ts --state=new-york
 *   npx tsx scripts/agents/target-batch-processor.ts --all
 *   npx tsx scripts/agents/target-batch-processor.ts --status
 *   npx tsx scripts/agents/target-batch-processor.ts --city=buffalo --state=new-york
 *
 * Environment:
 *   ANTHROPIC_API_KEY - Required for Claude API calls
 */

import * as fs from 'fs';
import * as path from 'path';
import { enhanceCity, writeCityFile } from './city-enhancer';
import { CityInput } from './types';

// =============================================================================
// CONFIGURATION
// =============================================================================

const TARGET_CITIES_PATH = path.join(__dirname, '..', 'data', 'target-cities.json');
const CITY_DATA_PATH = path.join(__dirname, '..', 'city-accident-data.json');
const PROGRESS_FILE = path.join(__dirname, '..', 'data', 'target-progress.json');

// Rate limiting: 2 seconds between cities
const DELAY_BETWEEN_CITIES_MS = 2000;

// State slug to full name mapping
const STATE_NAMES: Record<string, string> = {
  'new-york': 'New York',
  'new-jersey': 'New Jersey',
  'pennsylvania': 'Pennsylvania',
  'ohio': 'Ohio',
  'florida': 'Florida',
};

// =============================================================================
// TYPES
// =============================================================================

interface TargetCity {
  slug: string;
  name: string;
  population: number;
  priority: number;
}

interface TargetCitiesData {
  description: string;
  created: string;
  total: number;
  [stateSlug: string]: TargetCity[] | string | number;
}

interface CityProgress {
  slug: string;
  wordCount: number;
  status: 'success' | 'failed';
  error?: string;
  timestamp: string;
}

interface StateProgress {
  total: number;
  processed: number;
  failed: number;
  cities: CityProgress[];
}

interface TargetProgress {
  lastUpdated: string;
  states: Record<string, StateProgress>;
}

// =============================================================================
// PROGRESS TRACKING
// =============================================================================

function loadProgress(): TargetProgress {
  try {
    if (fs.existsSync(PROGRESS_FILE)) {
      return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
    }
  } catch (e) {
    console.log('⚠️ Could not load progress file, starting fresh');
  }

  return {
    lastUpdated: new Date().toISOString(),
    states: {},
  };
}

function saveProgress(progress: TargetProgress): void {
  progress.lastUpdated = new Date().toISOString();
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

function isCityProcessed(progress: TargetProgress, stateSlug: string, citySlug: string): boolean {
  const stateProgress = progress.states[stateSlug];
  if (!stateProgress) return false;
  return stateProgress.cities.some(c => c.slug === citySlug && c.status === 'success');
}

function recordCityResult(
  progress: TargetProgress,
  stateSlug: string,
  citySlug: string,
  wordCount: number,
  success: boolean,
  error?: string
): void {
  if (!progress.states[stateSlug]) {
    progress.states[stateSlug] = {
      total: 20,
      processed: 0,
      failed: 0,
      cities: [],
    };
  }

  const stateProgress = progress.states[stateSlug];

  // Remove any existing entry for this city
  stateProgress.cities = stateProgress.cities.filter(c => c.slug !== citySlug);

  // Add new entry
  stateProgress.cities.push({
    slug: citySlug,
    wordCount,
    status: success ? 'success' : 'failed',
    error: error,
    timestamp: new Date().toISOString(),
  });

  // Update counts
  stateProgress.processed = stateProgress.cities.filter(c => c.status === 'success').length;
  stateProgress.failed = stateProgress.cities.filter(c => c.status === 'failed').length;

  saveProgress(progress);
}

// =============================================================================
// DATA LOADING
// =============================================================================

function loadTargetCities(): TargetCitiesData {
  if (!fs.existsSync(TARGET_CITIES_PATH)) {
    throw new Error(`Target cities file not found: ${TARGET_CITIES_PATH}`);
  }
  return JSON.parse(fs.readFileSync(TARGET_CITIES_PATH, 'utf-8'));
}

function loadCityAccidentData(): Record<string, Record<string, any>> {
  if (!fs.existsSync(CITY_DATA_PATH)) {
    throw new Error(`City accident data not found: ${CITY_DATA_PATH}`);
  }
  return JSON.parse(fs.readFileSync(CITY_DATA_PATH, 'utf-8'));
}

function buildCityInput(
  targetCity: TargetCity,
  stateSlug: string,
  cityAccidentData: Record<string, Record<string, any>>
): CityInput {
  const stateName = STATE_NAMES[stateSlug] || stateSlug;

  // Try to find accident data for this city
  const stateData = cityAccidentData[stateSlug] || {};
  const cityData = stateData[targetCity.slug] || {};

  return {
    slug: targetCity.slug,
    name: targetCity.name,
    stateSlug: stateSlug,
    stateName: stateName,
    population: targetCity.population,
    truckFatalities: cityData.truckFatalities || 0,
    fatalCrashes: cityData.fatalCrashes || 0,
    countyName: cityData.countyName || '',
    dangerousRoads: cityData.dangerousRoads || [],
    lat: cityData.lat || 0,
    lng: cityData.lng || 0,
  };
}

// =============================================================================
// CITY PROCESSING
// =============================================================================

async function processCity(
  cityInput: CityInput,
  progress: TargetProgress
): Promise<{ success: boolean; wordCount: number; error?: string }> {
  try {
    console.log(`\n🏙️ Enhancing: ${cityInput.name}, ${cityInput.stateName}...`);

    const enhanced = await enhanceCity(cityInput);
    await writeCityFile(enhanced);

    console.log(`  ✅ ${cityInput.name}: ${enhanced.wordCount} words generated`);

    recordCityResult(
      progress,
      cityInput.stateSlug,
      cityInput.slug,
      enhanced.wordCount,
      true
    );

    return { success: true, wordCount: enhanced.wordCount };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`  ❌ ${cityInput.name} failed: ${errorMessage}`);

    recordCityResult(
      progress,
      cityInput.stateSlug,
      cityInput.slug,
      0,
      false,
      errorMessage
    );

    return { success: false, wordCount: 0, error: errorMessage };
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// =============================================================================
// STATE PROCESSING
// =============================================================================

async function processState(
  stateSlug: string,
  targetCities: TargetCitiesData,
  cityAccidentData: Record<string, Record<string, any>>,
  progress: TargetProgress
): Promise<{ processed: number; succeeded: number; failed: number; totalWords: number }> {
  const cities = targetCities[stateSlug] as TargetCity[];

  if (!cities || !Array.isArray(cities)) {
    console.error(`❌ No cities found for state: ${stateSlug}`);
    return { processed: 0, succeeded: 0, failed: 0, totalWords: 0 };
  }

  const stateName = STATE_NAMES[stateSlug] || stateSlug;
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📍 Processing ${stateName} (${cities.length} cities)`);
  console.log(`${'='.repeat(60)}`);

  let processed = 0;
  let succeeded = 0;
  let failed = 0;
  let totalWords = 0;

  for (let i = 0; i < cities.length; i++) {
    const city = cities[i];

    // Skip if already processed
    if (isCityProcessed(progress, stateSlug, city.slug)) {
      console.log(`  ⏭️ Skipping ${city.name} (already processed)`);
      succeeded++;
      processed++;
      continue;
    }

    console.log(`\n  [${i + 1}/${cities.length}] ${city.name}`);

    const cityInput = buildCityInput(city, stateSlug, cityAccidentData);
    const result = await processCity(cityInput, progress);

    processed++;
    if (result.success) {
      succeeded++;
      totalWords += result.wordCount;
    } else {
      failed++;
    }

    // Rate limiting
    if (i < cities.length - 1) {
      console.log(`  ⏱️ Waiting ${DELAY_BETWEEN_CITIES_MS / 1000}s...`);
      await sleep(DELAY_BETWEEN_CITIES_MS);
    }
  }

  return { processed, succeeded, failed, totalWords };
}

// =============================================================================
// STATUS DISPLAY
// =============================================================================

function displayStatus(progress: TargetProgress, targetCities: TargetCitiesData): void {
  console.log('\n' + '═'.repeat(60));
  console.log('📊 TARGET CITIES PROGRESS');
  console.log('═'.repeat(60));

  const states = Object.keys(STATE_NAMES);
  let totalProcessed = 0;
  let totalFailed = 0;
  let totalCities = 0;
  let totalWords = 0;

  for (const stateSlug of states) {
    const stateName = STATE_NAMES[stateSlug];
    const cities = targetCities[stateSlug] as TargetCity[];
    const stateProgress = progress.states[stateSlug];

    if (!cities || !Array.isArray(cities)) continue;

    const total = cities.length;
    const processed = stateProgress?.processed || 0;
    const failed = stateProgress?.failed || 0;
    const stateWords = stateProgress?.cities
      .filter(c => c.status === 'success')
      .reduce((sum, c) => sum + c.wordCount, 0) || 0;

    totalCities += total;
    totalProcessed += processed;
    totalFailed += failed;
    totalWords += stateWords;

    const bar = '█'.repeat(Math.floor((processed / total) * 20)).padEnd(20, '░');
    const pct = ((processed / total) * 100).toFixed(0);

    console.log(`\n${stateName}:`);
    console.log(`  [${bar}] ${pct}%`);
    console.log(`  ✅ ${processed}/${total} cities | ❌ ${failed} failed | 📝 ${stateWords.toLocaleString()} words`);

    // Show failed cities if any
    if (stateProgress?.cities) {
      const failedCities = stateProgress.cities.filter(c => c.status === 'failed');
      if (failedCities.length > 0) {
        console.log(`  Failed: ${failedCities.map(c => c.slug).join(', ')}`);
      }
    }
  }

  console.log('\n' + '─'.repeat(60));
  console.log(`TOTAL: ${totalProcessed}/${totalCities} cities | ${totalFailed} failed | ${totalWords.toLocaleString()} words`);
  console.log(`Last updated: ${progress.lastUpdated}`);
  console.log('═'.repeat(60) + '\n');
}

// =============================================================================
// MAIN
// =============================================================================

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  // Parse arguments
  const stateArg = args.find(a => a.startsWith('--state='))?.split('=')[1];
  const cityArg = args.find(a => a.startsWith('--city='))?.split('=')[1];
  const allFlag = args.includes('--all');
  const statusFlag = args.includes('--status');

  // Show usage if no args
  if (!stateArg && !cityArg && !allFlag && !statusFlag) {
    console.log('Usage:');
    console.log('  npx tsx scripts/agents/target-batch-processor.ts --state=new-york');
    console.log('  npx tsx scripts/agents/target-batch-processor.ts --all');
    console.log('  npx tsx scripts/agents/target-batch-processor.ts --status');
    console.log('  npx tsx scripts/agents/target-batch-processor.ts --city=buffalo --state=new-york');
    console.log('\nValid states: new-york, new-jersey, pennsylvania, ohio, florida');
    process.exit(0);
  }

  // Load data
  console.log('📁 Loading data files...');
  const targetCities = loadTargetCities();
  const progress = loadProgress();

  // Status only (doesn't need API key)
  if (statusFlag) {
    displayStatus(progress, targetCities);
    return;
  }

  // Check API key (only needed for processing)
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY not set');
    console.log('Set it with: export ANTHROPIC_API_KEY=your-key-here');
    process.exit(1);
  }

  let cityAccidentData: Record<string, Record<string, any>>;
  try {
    cityAccidentData = loadCityAccidentData();
  } catch (e) {
    console.log('⚠️ No city accident data found, using defaults');
    cityAccidentData = {};
  }

  // Single city mode
  if (cityArg && stateArg) {
    const cities = targetCities[stateArg] as TargetCity[];
    if (!cities || !Array.isArray(cities)) {
      console.error(`❌ State not found: ${stateArg}`);
      process.exit(1);
    }

    const city = cities.find(c => c.slug === cityArg);
    if (!city) {
      console.error(`❌ City not found: ${cityArg} in ${stateArg}`);
      process.exit(1);
    }

    const cityInput = buildCityInput(city, stateArg, cityAccidentData);
    await processCity(cityInput, progress);
    displayStatus(progress, targetCities);
    return;
  }

  // Process states
  const statesToProcess: string[] = [];

  if (allFlag) {
    statesToProcess.push(...Object.keys(STATE_NAMES));
  } else if (stateArg) {
    if (!STATE_NAMES[stateArg]) {
      console.error(`❌ Unknown state: ${stateArg}`);
      console.log(`Valid states: ${Object.keys(STATE_NAMES).join(', ')}`);
      process.exit(1);
    }
    statesToProcess.push(stateArg);
  }

  // Process each state
  let grandTotal = { processed: 0, succeeded: 0, failed: 0, totalWords: 0 };

  for (const stateSlug of statesToProcess) {
    const result = await processState(stateSlug, targetCities, cityAccidentData, progress);
    grandTotal.processed += result.processed;
    grandTotal.succeeded += result.succeeded;
    grandTotal.failed += result.failed;
    grandTotal.totalWords += result.totalWords;
  }

  // Final summary
  console.log('\n' + '═'.repeat(60));
  console.log('📊 PROCESSING COMPLETE');
  console.log('═'.repeat(60));
  console.log(`Cities Processed: ${grandTotal.processed}`);
  console.log(`Succeeded: ${grandTotal.succeeded}`);
  console.log(`Failed: ${grandTotal.failed}`);
  console.log(`Total Words Generated: ${grandTotal.totalWords.toLocaleString()}`);
  console.log(`Success Rate: ${((grandTotal.succeeded / grandTotal.processed) * 100).toFixed(1)}%`);
  console.log('═'.repeat(60) + '\n');

  // Show full status
  displayStatus(progress, targetCities);
}

main().catch(console.error);
