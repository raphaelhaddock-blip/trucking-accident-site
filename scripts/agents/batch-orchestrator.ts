/**
 * Batch Orchestrator
 *
 * Coordinates processing of city batches using specialized Claude agents.
 * Processes 20 cities at a time with parallel agent execution.
 *
 * Usage:
 *   npx tsx scripts/agents/batch-orchestrator.ts --batch=1
 *   npx tsx scripts/agents/batch-orchestrator.ts --batch=1-5
 *   npx tsx scripts/agents/batch-orchestrator.ts --pilot (first 5 cities)
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  Batch,
  BatchResult,
  CityInput,
  EnhancedCityContent,
} from './types';
import { enhanceCity, writeCityFile } from './city-enhancer';

// =============================================================================
// CONFIGURATION
// =============================================================================

const BATCH_DATA_PATH = path.join(__dirname, '..', 'data', 'city-priority-queue.json');
const CITY_DATA_PATH = path.join(__dirname, '..', 'city-accident-data.json');
const OUTPUT_DIR = path.join(__dirname, '..', '..', 'src', 'lib', 'cities-content');
const REPORTS_DIR = path.join(__dirname, '..', 'reports', 'batch-results');

// Ensure output directories exist
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

// =============================================================================
// DATA LOADING
// =============================================================================

interface PriorityQueueData {
  batches: Batch[];
  totalCities: number;
  totalBatches: number;
}

interface CityAccidentData {
  states: Record<string, {
    stateName: string;
    totalFatalities: number;
    cities: CityInput[];
  }>;
}

function loadBatchData(): PriorityQueueData {
  return JSON.parse(fs.readFileSync(BATCH_DATA_PATH, 'utf-8'));
}

function loadCityData(): CityAccidentData {
  return JSON.parse(fs.readFileSync(CITY_DATA_PATH, 'utf-8'));
}

function getCityDetails(stateSlug: string, citySlug: string, cityData: CityAccidentData): CityInput | null {
  const state = cityData.states[stateSlug];
  if (!state) return null;
  return state.cities.find(c => c.slug === citySlug) || null;
}

// =============================================================================
// AGENT PROMPTS
// =============================================================================

function buildCityEnhancementPrompt(city: CityInput): string {
  return `You are enhancing content for a truck accident lawyer website. Your task is to create genuinely valuable, unique content for ${city.name}, ${city.stateName}.

## CITY DATA (Verified from NHTSA FARS 2022)
- City: ${city.name}, ${city.stateName}
- Population: ${city.population > 0 ? city.population.toLocaleString() : 'Unknown'}
- County: ${city.countyName}
- Truck Fatalities (2022): ${city.truckFatalities}
- Fatal Crashes (2022): ${city.fatalCrashes}
- Major Roads: ${city.dangerousRoads.join(', ')}
- Coordinates: ${city.lat}, ${city.lng}

## YOUR TASK

Research and write the following sections. Each section must be UNIQUE to ${city.name} - no generic content that could apply to any city.

### 1. CITY HISTORY & TRUCKING RELEVANCE (150-200 words)
- When was ${city.name} founded and why?
- What historical industries made trucks important here?
- How has the city's relationship with trucking evolved?
- Reference specific historical facts, not generalities.

### 2. MAJOR INDUSTRIES & ECONOMIC CONTEXT (100-150 words)
- What are the top employers in ${city.name}?
- Which industries depend heavily on trucking?
- Are there distribution centers, ports, or logistics hubs?
- What makes this city's economy unique?

### 3. WEATHER HAZARDS FOR TRUCKING (75-100 words)
- What is the primary weather hazard for truckers in ${city.name}?
- What months are most dangerous?
- How does the local climate specifically affect truck safety?
- Include approximate temperature ranges if relevant.

### 4. DANGEROUS ROADS ANALYSIS (100 words per road, minimum 3 roads)
For each major road (${city.dangerousRoads.join(', ')}):
- What makes this road dangerous for trucks specifically in ${city.name}?
- What are known hazards (grades, curves, congestion points)?
- Any notable truck accidents on this road?
- Estimated truck traffic volume if known.

### 5. LOCAL COURT INFORMATION (75-100 words)
- Which state court handles truck accident cases in ${city.countyName} County?
- Which federal district court has jurisdiction?
- Any notable truck accident verdicts or settlements in this area?

### 6. UNIQUE FAQs (5-7 questions, 100+ word answers each)
Create FAQs that are SPECIFIC to ${city.name}. Examples:
- "Why do truck accidents happen frequently on [specific local road]?"
- "How does [local weather pattern] contribute to ${city.name} truck accidents?"
- "What industries in ${city.name} create the most truck traffic?"

DO NOT use generic questions like "How much is my case worth?" - those should be city-specific.

## OUTPUT FORMAT

Return a JSON object with this structure:
{
  "cityHistory": "...",
  "majorIndustries": ["...", "..."],
  "economicContext": "...",
  "truckingRelevance": "...",
  "weatherHazards": {
    "primaryHazard": "...",
    "secondaryHazards": ["..."],
    "description": "...",
    "dangerousMonths": ["..."]
  },
  "dangerousRoads": [
    {
      "name": "I-XX",
      "description": "...",
      "knownHazards": ["..."],
      "recentIncidents": "..."
    }
  ],
  "localCourts": {
    "stateCourt": "...",
    "federalCourt": "...",
    "venueNotes": "..."
  },
  "faqs": [
    {
      "question": "...",
      "answer": "..."
    }
  ],
  "sources": ["..."],
  "confidenceScore": 85
}

## CRITICAL RULES

1. NO HALLUCINATION: If you don't know something, say "Information not available" rather than making it up.
2. CITE SOURCES: Include source references for verifiable facts.
3. BE SPECIFIC: Every sentence should contain details specific to ${city.name}.
4. MINIMUM WORD COUNTS: Respect the word count requirements for each section.
5. NO GENERIC CONTENT: If a sentence could apply to any city, rewrite it.`;
}

// =============================================================================
// CITY PROCESSING
// =============================================================================

async function processCity(city: CityInput): Promise<{
  success: boolean;
  content?: EnhancedCityContent;
  error?: string;
}> {
  try {
    // Use the real city enhancer to generate unique content
    const enhancedContent = await enhanceCity(city);

    // Write the content file
    await writeCityFile(enhancedContent);

    return {
      success: true,
      content: enhancedContent,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.log(`    ✗ ${city.name}: ${errorMessage}`);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

async function generateEnhancedContent(city: CityInput): Promise<EnhancedCityContent> {
  // This is a placeholder that creates a structured template
  // In production, this would call Claude API with buildCityEnhancementPrompt(city)

  const stateContent = getStateContent(city.stateSlug);

  return {
    slug: city.slug,
    name: city.name,
    stateSlug: city.stateSlug,
    stateName: city.stateName,
    population: city.population,
    countyName: city.countyName,

    metaTitle: `${city.name} Truck Accident Lawyers | ${city.stateName} 18-Wheeler Attorneys`,
    metaDescription: `Injured in a truck crash in ${city.name}? ${city.truckFatalities} fatal truck accidents in 2022. Experienced attorneys serving ${city.countyName} County. Free consultation.`,
    h1: `${city.name} Truck Accident Lawyers`,

    cityHistory: `[AGENT_PLACEHOLDER: Research ${city.name}'s founding, historical industries, and relationship with trucking]`,
    majorIndustries: ['[AGENT_PLACEHOLDER: Research major employers]'],
    economicContext: `[AGENT_PLACEHOLDER: Research ${city.name}'s economic profile and trucking-dependent industries]`,
    truckingRelevance: `[AGENT_PLACEHOLDER: Explain why trucks are important to ${city.name}]`,

    heroText: `${city.name}, ${city.stateName} is home to ${city.population > 0 ? city.population.toLocaleString() + ' residents and' : ''} significant commercial truck traffic. In 2022, there were ${city.truckFatalities} truck-related fatalities in the ${city.name} area according to NHTSA FARS data. Our attorneys have extensive experience handling complex trucking cases in ${city.countyName} County and throughout ${city.stateName}.`,

    accidentStats: {
      truckFatalities: city.truckFatalities,
      fatalCrashes: city.fatalCrashes,
      dataYear: 2022,
      yearOverYearChange: '[AGENT_PLACEHOLDER: Calculate from multi-year FARS data]',
      comparisonToState: '[AGENT_PLACEHOLDER: Calculate percentage of state total]',
      sourceUrl: 'https://static.nhtsa.gov/nhtsa/downloads/FARS/2022/National/FARS2022NationalCSV.zip',
    },

    accidentTrends: {
      year2020: null,
      year2021: null,
      year2022: { fatalities: city.truckFatalities, crashes: city.fatalCrashes },
      trend: 'insufficient_data',
      percentChange: null,
      trendDescription: '[AGENT_PLACEHOLDER: Describe trend from multi-year data]',
    },

    recentAccidents: [
      {
        date: '[AGENT_PLACEHOLDER]',
        headline: `[AGENT_PLACEHOLDER: Find recent truck accident news for ${city.name}]`,
        summary: '[AGENT_PLACEHOLDER: Summarize accident]',
        source: '[AGENT_PLACEHOLDER: News source]',
        sourceUrl: '[AGENT_PLACEHOLDER: Source URL]',
      },
    ],

    weatherHazards: {
      primaryHazard: '[AGENT_PLACEHOLDER: Primary weather hazard]',
      secondaryHazards: ['[AGENT_PLACEHOLDER]'],
      description: `[AGENT_PLACEHOLDER: Describe how weather affects trucking in ${city.name}]`,
      dangerousMonths: ['[AGENT_PLACEHOLDER]'],
    },

    dangerousRoads: city.dangerousRoads.map(road => ({
      name: road,
      description: `[AGENT_PLACEHOLDER: Deep research on ${road} through ${city.name}]`,
      annualTruckTraffic: '[AGENT_PLACEHOLDER: Truck traffic data]',
      knownHazards: ['[AGENT_PLACEHOLDER]'],
      recentIncidents: '[AGENT_PLACEHOLDER: Recent incidents on this road]',
      milesInCity: 0,
    })),

    commonAccidents: [
      {
        type: 'Rear-End Collisions',
        percentage: '[AGENT_PLACEHOLDER: Local percentage]',
        localFactor: `[AGENT_PLACEHOLDER: Why this type is common in ${city.name}]`,
      },
    ],

    truckingIndustry: `[AGENT_PLACEHOLDER: Describe ${city.name}'s trucking industry, major carriers, distribution centers]`,

    legalInfo: stateContent?.legalInfo || `[AGENT_PLACEHOLDER: Legal information for ${city.stateName}]`,

    localCourts: {
      stateCourt: `[AGENT_PLACEHOLDER: ${city.countyName} County state court]`,
      federalCourt: `[AGENT_PLACEHOLDER: Federal district court for ${city.name}]`,
      venueNotes: `[AGENT_PLACEHOLDER: Venue considerations for ${city.countyName} County]`,
    },

    faqs: [
      {
        question: `Why do truck accidents happen frequently in ${city.name}?`,
        answer: `[AGENT_PLACEHOLDER: City-specific answer about local factors, roads, industries]`,
      },
      {
        question: `What are the most dangerous roads for trucks in ${city.name}?`,
        answer: `[AGENT_PLACEHOLDER: Detailed answer about ${city.dangerousRoads.join(', ')}]`,
      },
      {
        question: `How long do I have to file a truck accident lawsuit in ${city.stateName}?`,
        answer: `[AGENT_PLACEHOLDER: State-specific statute of limitations with ${city.name} court context]`,
      },
    ],

    whyDangerous: `[AGENT_PLACEHOLDER: Why trucking is dangerous in ${city.name}]`,
    liabilityExplanation: `[AGENT_PLACEHOLDER: Liability explanation for ${city.name}]`,
    evidencePreservation: `[AGENT_PLACEHOLDER: Evidence preservation guidance for ${city.name}]`,
    fmcsaRegulations: `[AGENT_PLACEHOLDER: FMCSA regulations relevant to ${city.name}]`,

    wordCount: 0, // Will be calculated
    uniquenessScore: 0, // Will be calculated
    sources: ['NHTSA FARS 2022'],
    lastEnhanced: new Date().toISOString(),
    agentVersion: '1.0.0-placeholder',
  };
}

function getStateContent(stateSlug: string): { legalInfo?: string } | null {
  try {
    const statePath = path.join(__dirname, '..', '..', 'src', 'lib', 'states-content', `${stateSlug}.ts`);
    if (fs.existsSync(statePath)) {
      // In production, would properly import and parse
      return null;
    }
  } catch {
    return null;
  }
  return null;
}

function calculateWordCount(content: EnhancedCityContent): number {
  const textFields = [
    content.cityHistory,
    content.economicContext,
    content.truckingRelevance,
    content.heroText,
    content.truckingIndustry,
    content.legalInfo,
    ...content.dangerousRoads.map(r => r.description),
    ...content.faqs.map(f => f.question + ' ' + f.answer),
  ];

  return textFields.join(' ').split(/\s+/).filter(w => w.length > 0).length;
}

async function writeCityContent(stateSlug: string, citySlug: string, content: EnhancedCityContent): Promise<void> {
  const stateDir = path.join(OUTPUT_DIR, stateSlug);
  if (!fs.existsSync(stateDir)) {
    fs.mkdirSync(stateDir, { recursive: true });
  }

  const filePath = path.join(stateDir, `${citySlug}.ts`);

  // Generate TypeScript file content
  const tsContent = `import type { CityContent } from '../types';

/**
 * ${content.name}, ${content.stateName} - Enhanced Truck Accident Information
 *
 * Population: ${content.population > 0 ? content.population.toLocaleString() : 'Unknown'}
 * Fatal Truck Crashes (2022): ${content.accidentStats.fatalCrashes}
 * County: ${content.countyName}
 *
 * Enhanced by Agent System v${content.agentVersion}
 * Last Updated: ${content.lastEnhanced}
 */

export const ${citySlug.toUpperCase().replace(/-/g, '_')}_CONTENT: CityContent = ${JSON.stringify({
    slug: content.slug,
    name: content.name,
    stateSlug: content.stateSlug,
    stateName: content.stateName,
    population: content.population,
    metaTitle: content.metaTitle,
    metaDescription: content.metaDescription,
    h1: content.h1,
    heroText: content.heroText,
    accidentStats: content.accidentStats,
    dangerousRoads: content.dangerousRoads,
    commonAccidents: content.commonAccidents,
    truckingIndustry: content.truckingIndustry,
    legalInfo: content.legalInfo,
    faqs: content.faqs,
    lastUpdated: content.lastEnhanced.split('T')[0],
  }, null, 2)};

export default ${citySlug.toUpperCase().replace(/-/g, '_')}_CONTENT;
`;

  fs.writeFileSync(filePath, tsContent);
}

// =============================================================================
// BATCH PROCESSING
// =============================================================================

async function processBatch(batchNumber: number): Promise<BatchResult> {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`PROCESSING BATCH ${batchNumber}`);
  console.log(`${'='.repeat(60)}\n`);

  const batchData = loadBatchData();
  const cityData = loadCityData();

  const batch = batchData.batches.find(b => b.batch === batchNumber);
  if (!batch) {
    throw new Error(`Batch ${batchNumber} not found`);
  }

  console.log(`Priority: ${batch.priority.toUpperCase()}`);
  console.log(`Cities: ${batch.cityCount}`);
  console.log(`Total Population: ${batch.totalPopulation.toLocaleString()}`);
  console.log(`Total Fatalities: ${batch.totalFatalities}\n`);

  const results: BatchResult['results'] = [];
  let succeeded = 0;
  let failed = 0;

  for (const batchCity of batch.cities) {
    const cityDetails = getCityDetails(batchCity.stateSlug, batchCity.slug, cityData);
    if (!cityDetails) {
      console.log(`    ✗ ${batchCity.name}: City data not found`);
      results.push({
        city: batchCity.slug,
        state: batchCity.stateSlug,
        success: false,
        wordCount: 0,
        uniquenessScore: 0,
        needsHumanReview: true,
        error: 'City data not found',
      });
      failed++;
      continue;
    }

    // Enrich with population from batch data
    cityDetails.population = batchCity.population;

    const result = await processCity(cityDetails);

    if (result.success && result.content) {
      results.push({
        city: batchCity.slug,
        state: batchCity.stateSlug,
        success: true,
        wordCount: result.content.wordCount,
        uniquenessScore: result.content.uniquenessScore,
        needsHumanReview: false,
      });
      succeeded++;
    } else {
      results.push({
        city: batchCity.slug,
        state: batchCity.stateSlug,
        success: false,
        wordCount: 0,
        uniquenessScore: 0,
        needsHumanReview: true,
        error: result.error,
      });
      failed++;
    }
  }

  const batchResult: BatchResult = {
    batchNumber,
    processedAt: new Date().toISOString(),
    citiesProcessed: batch.cityCount,
    citiesSucceeded: succeeded,
    citiesFailed: failed,
    averageWordCount: results.reduce((sum, r) => sum + r.wordCount, 0) / results.length,
    averageUniquenessScore: results.reduce((sum, r) => sum + r.uniquenessScore, 0) / results.length,
    results,
  };

  // Save batch report
  const reportPath = path.join(REPORTS_DIR, `batch-${batchNumber}-report.json`);
  fs.writeFileSync(reportPath, JSON.stringify(batchResult, null, 2));

  console.log(`\n${'='.repeat(60)}`);
  console.log(`BATCH ${batchNumber} COMPLETE`);
  console.log(`${'='.repeat(60)}`);
  console.log(`  Succeeded: ${succeeded}/${batch.cityCount}`);
  console.log(`  Failed: ${failed}/${batch.cityCount}`);
  console.log(`  Avg Word Count: ${Math.round(batchResult.averageWordCount)}`);
  console.log(`  Report: ${reportPath}\n`);

  return batchResult;
}

// =============================================================================
// CLI
// =============================================================================

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.length === 0) {
    console.log(`
City Content Enhancement - Batch Orchestrator

Usage:
  npx tsx scripts/agents/batch-orchestrator.ts --batch=N       Process batch N
  npx tsx scripts/agents/batch-orchestrator.ts --batch=1-5     Process batches 1-5
  npx tsx scripts/agents/batch-orchestrator.ts --pilot         Process first 5 cities (test)
  npx tsx scripts/agents/batch-orchestrator.ts --list          List all batches

Options:
  --batch=N      Process specific batch number
  --batch=N-M    Process range of batches
  --pilot        Process 5 test cities from batch 1
  --list         Show batch summary
  --help         Show this help
`);
    return;
  }

  if (args.includes('--list')) {
    const batchData = loadBatchData();
    console.log(`\nCity Priority Queue Summary`);
    console.log(`${'='.repeat(50)}`);
    console.log(`Total Cities: ${batchData.totalCities}`);
    console.log(`Total Batches: ${batchData.totalBatches}\n`);

    console.log('Priority Breakdown:');
    for (const batch of batchData.batches.slice(0, 10)) {
      console.log(`  Batch ${batch.batch}: ${batch.priority.toUpperCase()} - ${batch.cities.map(c => c.name).slice(0, 3).join(', ')}...`);
    }
    console.log('  ...');
    return;
  }

  if (args.includes('--pilot')) {
    console.log('Running PILOT mode (first 5 cities from batch 1)\n');
    const batchData = loadBatchData();
    const cityData = loadCityData();
    const pilotCities = batchData.batches[0].cities.slice(0, 5);

    for (const batchCity of pilotCities) {
      const cityDetails = getCityDetails(batchCity.stateSlug, batchCity.slug, cityData);
      if (cityDetails) {
        cityDetails.population = batchCity.population;
        await processCity(cityDetails);
      }
    }
    console.log('\nPilot complete!');
    return;
  }

  const batchArg = args.find(a => a.startsWith('--batch='));
  if (batchArg) {
    const batchValue = batchArg.split('=')[1];

    if (batchValue.includes('-')) {
      const [start, end] = batchValue.split('-').map(Number);
      for (let i = start; i <= end; i++) {
        await processBatch(i);
      }
    } else {
      await processBatch(parseInt(batchValue));
    }
    return;
  }

  console.log('No valid arguments. Use --help for usage.');
}

main().catch(console.error);
