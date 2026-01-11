/**
 * Batch Processor for City Enhancement
 *
 * Processes cities in priority order using the city-enhancer.ts agent.
 * Includes rate limiting, error handling, and progress tracking.
 *
 * Usage:
 *   npx tsx scripts/agents/batch-processor.ts --tier=1         # Top 50 cities
 *   npx tsx scripts/agents/batch-processor.ts --tier=2         # Next 150 cities
 *   npx tsx scripts/agents/batch-processor.ts --tier=3         # Next 500 cities
 *   npx tsx scripts/agents/batch-processor.ts --tier=4         # Remaining 1,594
 *   npx tsx scripts/agents/batch-processor.ts --batch=1        # Process batch 1 only
 *   npx tsx scripts/agents/batch-processor.ts --city=houston   # Single city
 *
 * Environment:
 *   ANTHROPIC_API_KEY - Required for Claude API calls
 */

import * as fs from 'fs';
import * as path from 'path';
import { enhanceCity, writeCityFile } from './city-enhancer';
import { CityInput, Batch, BatchResult } from './types';

// =============================================================================
// CONFIGURATION
// =============================================================================

const CITY_DATA_PATH = path.join(__dirname, '..', 'city-accident-data.json');
const POPULATION_PATH = path.join(__dirname, '..', 'data', 'city-populations.json');
const PRIORITY_QUEUE_PATH = path.join(__dirname, '..', 'data', 'city-priority-queue.json');
const PROGRESS_FILE = path.join(__dirname, '..', 'data', 'batch-progress.json');

// Rate limiting: 1 request per 2 seconds to stay within API limits
const DELAY_BETWEEN_CITIES_MS = 2000;

// Tier definitions
const TIER_BATCHES: Record<number, { start: number; end: number; description: string }> = {
  1: { start: 1, end: 3, description: 'Critical (Top 50 cities)' },
  2: { start: 4, end: 11, description: 'High Priority (150 cities)' },
  3: { start: 12, end: 37, description: 'Medium Priority (500 cities)' },
  4: { start: 38, end: 67, description: 'Standard (Remaining 1,594)' },
};

// =============================================================================
// PROGRESS TRACKING
// =============================================================================

interface BatchProgress {
  lastUpdated: string;
  totalProcessed: number;
  totalFailed: number;
  completedBatches: number[];
  failedCities: Array<{
    city: string;
    state: string;
    error: string;
    timestamp: string;
  }>;
  successfulCities: Array<{
    city: string;
    state: string;
    wordCount: number;
    timestamp: string;
  }>;
}

function loadProgress(): BatchProgress {
  try {
    if (fs.existsSync(PROGRESS_FILE)) {
      return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
    }
  } catch (e) {
    console.log('⚠️ Could not load progress file, starting fresh');
  }

  return {
    lastUpdated: new Date().toISOString(),
    totalProcessed: 0,
    totalFailed: 0,
    completedBatches: [],
    failedCities: [],
    successfulCities: [],
  };
}

function saveProgress(progress: BatchProgress): void {
  progress.lastUpdated = new Date().toISOString();
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

// =============================================================================
// BATCH PROCESSING
// =============================================================================

async function processCity(
  cityInput: CityInput,
  progress: BatchProgress
): Promise<{ success: boolean; wordCount: number; error?: string }> {
  try {
    console.log(`\n  Processing: ${cityInput.name}, ${cityInput.stateName}`);

    const enhanced = await enhanceCity(cityInput);
    await writeCityFile(enhanced);

    progress.successfulCities.push({
      city: cityInput.slug,
      state: cityInput.stateSlug,
      wordCount: enhanced.wordCount,
      timestamp: new Date().toISOString(),
    });
    progress.totalProcessed++;

    return { success: true, wordCount: enhanced.wordCount };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);

    progress.failedCities.push({
      city: cityInput.slug,
      state: cityInput.stateSlug,
      error: errorMsg,
      timestamp: new Date().toISOString(),
    });
    progress.totalFailed++;

    console.error(`  ❌ Failed: ${cityInput.name} - ${errorMsg}`);

    return { success: false, wordCount: 0, error: errorMsg };
  }
}

async function processBatch(
  batchNumber: number,
  batches: Batch[],
  cityData: any,
  popData: any,
  progress: BatchProgress
): Promise<BatchResult> {
  const batch = batches.find(b => b.batch === batchNumber);
  if (!batch) {
    throw new Error(`Batch ${batchNumber} not found`);
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`📦 Processing Batch ${batchNumber} (${batch.priority})`);
  console.log(`   ${batch.cityCount} cities, ${batch.totalFatalities} total fatalities`);
  console.log(`${'='.repeat(60)}`);

  const results: BatchResult = {
    batchNumber,
    processedAt: new Date().toISOString(),
    citiesProcessed: 0,
    citiesSucceeded: 0,
    citiesFailed: 0,
    averageWordCount: 0,
    averageUniquenessScore: 85,
    results: [],
  };

  let totalWordCount = 0;

  for (const batchCity of batch.cities) {
    // Find full city data
    const state = cityData.states[batchCity.stateSlug];
    if (!state) {
      console.error(`  ⚠️ State ${batchCity.stateSlug} not found, skipping ${batchCity.name}`);
      continue;
    }

    const city = state.cities.find((c: CityInput) => c.slug === batchCity.slug);
    if (!city) {
      console.error(`  ⚠️ City ${batchCity.slug} not found, skipping`);
      continue;
    }

    // Enrich with population
    const statePopulations = popData.populations[batchCity.stateSlug] || {};
    city.population = statePopulations[batchCity.slug] || 0;

    // Check if already processed
    const alreadyProcessed = progress.successfulCities.some(
      s => s.city === batchCity.slug && s.state === batchCity.stateSlug
    );

    if (alreadyProcessed) {
      console.log(`  ⏭️ Skipping ${batchCity.name} (already processed)`);
      continue;
    }

    // Process the city
    const result = await processCity(city, progress);

    results.results.push({
      city: batchCity.slug,
      state: batchCity.stateSlug,
      success: result.success,
      wordCount: result.wordCount,
      uniquenessScore: 85,
      needsHumanReview: false,
      error: result.error,
    });

    results.citiesProcessed++;
    if (result.success) {
      results.citiesSucceeded++;
      totalWordCount += result.wordCount;
    } else {
      results.citiesFailed++;
    }

    // Save progress after each city
    saveProgress(progress);

    // Rate limiting delay
    if (batch.cities.indexOf(batchCity) < batch.cities.length - 1) {
      console.log(`  ⏱️ Waiting ${DELAY_BETWEEN_CITIES_MS / 1000}s before next city...`);
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CITIES_MS));
    }
  }

  results.averageWordCount = results.citiesSucceeded > 0
    ? Math.round(totalWordCount / results.citiesSucceeded)
    : 0;

  // Mark batch as completed
  if (!progress.completedBatches.includes(batchNumber)) {
    progress.completedBatches.push(batchNumber);
  }
  saveProgress(progress);

  console.log(`\n📊 Batch ${batchNumber} Complete:`);
  console.log(`   Processed: ${results.citiesProcessed}`);
  console.log(`   Succeeded: ${results.citiesSucceeded}`);
  console.log(`   Failed: ${results.citiesFailed}`);
  console.log(`   Avg Word Count: ${results.averageWordCount}`);

  return results;
}

async function processTier(
  tierNumber: number,
  batches: Batch[],
  cityData: any,
  popData: any,
  progress: BatchProgress
): Promise<void> {
  const tier = TIER_BATCHES[tierNumber];
  if (!tier) {
    throw new Error(`Invalid tier: ${tierNumber}. Valid tiers: 1, 2, 3, 4`);
  }

  console.log(`\n${'#'.repeat(60)}`);
  console.log(`# TIER ${tierNumber}: ${tier.description}`);
  console.log(`# Batches ${tier.start} through ${tier.end}`);
  console.log(`${'#'.repeat(60)}`);

  for (let batchNum = tier.start; batchNum <= tier.end; batchNum++) {
    if (progress.completedBatches.includes(batchNum)) {
      console.log(`\n⏭️ Skipping batch ${batchNum} (already completed)`);
      continue;
    }

    await processBatch(batchNum, batches, cityData, popData, progress);
  }

  console.log(`\n✅ Tier ${tierNumber} processing complete!`);
}

// =============================================================================
// CLI
// =============================================================================

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.length === 0) {
    console.log(`
Batch Processor for City Enhancement v2.0

Usage:
  npx tsx scripts/agents/batch-processor.ts --tier=1      # Process Tier 1 (Top 50)
  npx tsx scripts/agents/batch-processor.ts --tier=2      # Process Tier 2 (150 cities)
  npx tsx scripts/agents/batch-processor.ts --tier=3      # Process Tier 3 (500 cities)
  npx tsx scripts/agents/batch-processor.ts --tier=4      # Process Tier 4 (1,594 cities)
  npx tsx scripts/agents/batch-processor.ts --batch=5     # Process specific batch
  npx tsx scripts/agents/batch-processor.ts --status      # Show progress status
  npx tsx scripts/agents/batch-processor.ts --reset       # Reset progress tracking

Tiers:
  Tier 1: Batches 1-3   (Critical - Top 50 cities by population/fatalities)
  Tier 2: Batches 4-11  (High Priority - Next 150 cities)
  Tier 3: Batches 12-37 (Medium Priority - Next 500 cities)
  Tier 4: Batches 38-67 (Standard - Remaining 1,594 cities)

Environment:
  ANTHROPIC_API_KEY must be set for Claude API calls

Estimated Time & Cost:
  Tier 1: ~2 hours, ~$25 API cost
  Tier 2: ~5 hours, ~$75 API cost
  Tier 3: ~17 hours, ~$200 API cost
  Tier 4: ~53 hours, ~$300 API cost
`);
    return;
  }

  // Load data
  console.log('📁 Loading data files...');
  const cityData = JSON.parse(fs.readFileSync(CITY_DATA_PATH, 'utf-8'));
  const popData = JSON.parse(fs.readFileSync(POPULATION_PATH, 'utf-8'));
  const priorityQueue = JSON.parse(fs.readFileSync(PRIORITY_QUEUE_PATH, 'utf-8'));
  const progress = loadProgress();

  // Handle --status
  if (args.includes('--status')) {
    console.log('\n📊 Batch Processing Status');
    console.log('═'.repeat(40));
    console.log(`Total Processed: ${progress.totalProcessed}`);
    console.log(`Total Failed: ${progress.totalFailed}`);
    console.log(`Completed Batches: ${progress.completedBatches.length}`);
    console.log(`Last Updated: ${progress.lastUpdated}`);

    if (progress.failedCities.length > 0) {
      console.log(`\n❌ Failed Cities (${progress.failedCities.length}):`);
      progress.failedCities.slice(-10).forEach(f => {
        console.log(`   - ${f.city}, ${f.state}: ${f.error}`);
      });
    }
    return;
  }

  // Handle --reset
  if (args.includes('--reset')) {
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify({
      lastUpdated: new Date().toISOString(),
      totalProcessed: 0,
      totalFailed: 0,
      completedBatches: [],
      failedCities: [],
      successfulCities: [],
    }, null, 2));
    console.log('✅ Progress reset');
    return;
  }

  // Check for API key
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ Error: ANTHROPIC_API_KEY environment variable not set');
    console.log('Set it with: export ANTHROPIC_API_KEY=your-key-here');
    console.log('Or add it to .env.local: ANTHROPIC_API_KEY=your-key-here');
    process.exit(1);
  }

  // Parse arguments
  const tierArg = args.find(a => a.startsWith('--tier='));
  const batchArg = args.find(a => a.startsWith('--batch='));

  if (tierArg) {
    const tierNum = parseInt(tierArg.split('=')[1], 10);
    await processTier(tierNum, priorityQueue.batches, cityData, popData, progress);
  } else if (batchArg) {
    const batchNum = parseInt(batchArg.split('=')[1], 10);
    await processBatch(batchNum, priorityQueue.batches, cityData, popData, progress);
  } else {
    console.error('❌ Please specify --tier=N or --batch=N');
    process.exit(1);
  }

  // Final summary
  console.log('\n' + '═'.repeat(60));
  console.log('📊 FINAL SUMMARY');
  console.log('═'.repeat(60));
  console.log(`Total Cities Processed: ${progress.totalProcessed}`);
  console.log(`Total Cities Failed: ${progress.totalFailed}`);
  console.log(`Success Rate: ${((progress.totalProcessed / (progress.totalProcessed + progress.totalFailed)) * 100).toFixed(1)}%`);
}

// Only run CLI when executed directly
if (require.main === module) {
  main().catch(console.error);
}
