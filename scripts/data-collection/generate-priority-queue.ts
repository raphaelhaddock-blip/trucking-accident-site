/**
 * Generate City Priority Queue
 *
 * Sorts all 1,339 cities by population and divides into batches of 20
 * for phased content enhancement processing.
 */

import * as fs from 'fs';
import * as path from 'path';

interface CityData {
  slug: string;
  name: string;
  stateSlug: string;
  stateName: string;
  population: number;
  truckFatalities: number;
  fatalCrashes: number;
  countyName: string;
}

interface CityAccidentData {
  states: Record<string, {
    stateName: string;
    totalFatalities: number;
    cities: CityData[];
  }>;
}

interface PopulationData {
  populations: Record<string, Record<string, number>>;
}

interface CityWithPriority extends CityData {
  priorityScore: number;  // Combines population + fatalities
}

interface Batch {
  batch: number;
  priority: 'critical' | 'high' | 'medium' | 'standard';
  cityCount: number;
  totalPopulation: number;
  totalFatalities: number;
  cities: Array<{
    slug: string;
    name: string;
    stateSlug: string;
    stateName: string;
    population: number;
    truckFatalities: number;
  }>;
}

const BATCH_SIZE = 20;

async function generatePriorityQueue() {
  console.log('Loading city data...');

  // Load city accident data
  const cityDataPath = path.join(__dirname, '..', 'city-accident-data.json');
  const cityData: CityAccidentData = JSON.parse(fs.readFileSync(cityDataPath, 'utf-8'));

  // Load population data
  const popDataPath = path.join(__dirname, '..', 'data', 'city-populations.json');
  const popData: PopulationData = JSON.parse(fs.readFileSync(popDataPath, 'utf-8'));

  // Collect all cities and enrich with population
  const allCities: CityWithPriority[] = [];

  for (const [stateSlug, stateData] of Object.entries(cityData.states)) {
    for (const city of stateData.cities) {
      // Look up real population
      const statePopulations = popData.populations[stateSlug] || {};
      const realPopulation = statePopulations[city.slug] || 0;

      // Priority score: population + (fatalities * 10000)
      // This ensures high-fatality cities get priority even if small
      const priorityScore = realPopulation + (city.truckFatalities * 10000);

      allCities.push({
        ...city,
        population: realPopulation,
        priorityScore,
      });
    }
  }

  console.log(`Found ${allCities.length} total cities`);

  // Sort by priority score (descending)
  allCities.sort((a, b) => b.priorityScore - a.priorityScore);

  // Log top 20 cities
  console.log('\nTop 20 cities by priority:');
  allCities.slice(0, 20).forEach((city, i) => {
    console.log(`  ${i + 1}. ${city.name}, ${city.stateName} (pop: ${city.population.toLocaleString()}, fatalities: ${city.truckFatalities})`);
  });

  // Divide into batches
  const batches: Batch[] = [];
  const totalBatches = Math.ceil(allCities.length / BATCH_SIZE);

  for (let i = 0; i < totalBatches; i++) {
    const startIdx = i * BATCH_SIZE;
    const batchCities = allCities.slice(startIdx, startIdx + BATCH_SIZE);

    // Determine priority level
    let priority: 'critical' | 'high' | 'medium' | 'standard';
    if (i < 5) priority = 'critical';
    else if (i < 15) priority = 'high';
    else if (i < 35) priority = 'medium';
    else priority = 'standard';

    batches.push({
      batch: i + 1,
      priority,
      cityCount: batchCities.length,
      totalPopulation: batchCities.reduce((sum, c) => sum + c.population, 0),
      totalFatalities: batchCities.reduce((sum, c) => sum + c.truckFatalities, 0),
      cities: batchCities.map(c => ({
        slug: c.slug,
        name: c.name,
        stateSlug: c.stateSlug,
        stateName: c.stateName,
        population: c.population,
        truckFatalities: c.truckFatalities,
      })),
    });
  }

  // Create output
  const output = {
    generatedAt: new Date().toISOString(),
    totalCities: allCities.length,
    totalBatches: batches.length,
    batchSize: BATCH_SIZE,
    priorityBreakdown: {
      critical: batches.filter(b => b.priority === 'critical').length,
      high: batches.filter(b => b.priority === 'high').length,
      medium: batches.filter(b => b.priority === 'medium').length,
      standard: batches.filter(b => b.priority === 'standard').length,
    },
    batches,
  };

  // Write output
  const outputPath = path.join(__dirname, '..', 'data', 'city-priority-queue.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log(`\nGenerated ${batches.length} batches:`);
  console.log(`  Critical (1-5): ${output.priorityBreakdown.critical} batches, ${output.priorityBreakdown.critical * BATCH_SIZE} cities`);
  console.log(`  High (6-15): ${output.priorityBreakdown.high} batches, ${output.priorityBreakdown.high * BATCH_SIZE} cities`);
  console.log(`  Medium (16-35): ${output.priorityBreakdown.medium} batches, ${output.priorityBreakdown.medium * BATCH_SIZE} cities`);
  console.log(`  Standard (36+): ${output.priorityBreakdown.standard} batches`);
  console.log(`\nOutput written to: ${outputPath}`);

  // Also log batch 1 details for verification
  console.log('\n=== BATCH 1 (Top 20 Cities) ===');
  batches[0].cities.forEach((city, i) => {
    console.log(`  ${i + 1}. ${city.name}, ${city.stateName}`);
  });
}

generatePriorityQueue().catch(console.error);
