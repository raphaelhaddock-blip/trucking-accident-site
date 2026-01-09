/**
 * City Geo Coordinates Collector
 *
 * Fetches latitude/longitude for all 520 cities using OpenStreetMap Nominatim API.
 * Rate limited to 1 request/second per Nominatim usage policy.
 *
 * Usage: npx tsx scripts/collect-city-geo.ts
 */

import * as fs from 'fs';
import * as path from 'path';

interface CityGeo {
  lat: number;
  lng: number;
}

interface GeoData {
  [stateSlug: string]: {
    [citySlug: string]: CityGeo;
  };
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

// Rate limiting: 1 request per second
const RATE_LIMIT_MS = 1100; // 1.1 seconds to be safe

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchGeoCoordinates(city: string, state: string): Promise<CityGeo | null> {
  const query = encodeURIComponent(`${city}, ${state}, USA`);
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=us`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'TruckAccidentSite/1.0 (contact@example.com)', // Required by Nominatim
      },
    });

    if (!response.ok) {
      console.error(`  HTTP error: ${response.status}`);
      return null;
    }

    const data: NominatimResult[] = await response.json();

    if (data.length === 0) {
      console.error(`  No results found`);
      return null;
    }

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  } catch (error) {
    console.error(`  Fetch error:`, error);
    return null;
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  CITY GEO COORDINATES COLLECTOR');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Load city data
  const cityDataPath = path.join(process.cwd(), 'scripts/city-accident-data.json');
  const cityData = JSON.parse(fs.readFileSync(cityDataPath, 'utf-8'));

  // Check for existing geo data (for resume capability)
  const geoDataPath = path.join(process.cwd(), 'scripts/city-geo-data.json');
  let geoData: GeoData = {};

  if (fs.existsSync(geoDataPath)) {
    console.log('Found existing geo data, resuming...\n');
    geoData = JSON.parse(fs.readFileSync(geoDataPath, 'utf-8'));
  }

  const states = Object.keys(cityData.states);
  let totalProcessed = 0;
  let totalSuccess = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  console.log(`Processing ${cityData.totalCities} cities across ${states.length} states...\n`);

  for (const stateSlug of states) {
    const stateData = cityData.states[stateSlug];
    const stateName = stateData.stateName;

    if (!geoData[stateSlug]) {
      geoData[stateSlug] = {};
    }

    console.log(`\n${stateName} (${stateData.cities.length} cities)`);
    console.log('─'.repeat(50));

    for (const city of stateData.cities) {
      totalProcessed++;

      // Skip if already have geo data
      if (geoData[stateSlug][city.slug]) {
        console.log(`  ⏭ ${city.name} (cached)`);
        totalSkipped++;
        continue;
      }

      // Fetch geo coordinates
      process.stdout.write(`  📍 ${city.name}...`);
      const geo = await fetchGeoCoordinates(city.name, stateName);

      if (geo) {
        geoData[stateSlug][city.slug] = geo;
        console.log(` ✓ (${geo.lat.toFixed(4)}, ${geo.lng.toFixed(4)})`);
        totalSuccess++;
      } else {
        console.log(' ✗ FAILED');
        totalFailed++;
      }

      // Save progress after each city
      fs.writeFileSync(geoDataPath, JSON.stringify(geoData, null, 2));

      // Rate limiting
      await sleep(RATE_LIMIT_MS);

      // Progress update every 50 cities
      if (totalProcessed % 50 === 0) {
        console.log(`\n  [Progress: ${totalProcessed}/${cityData.totalCities}]\n`);
      }
    }
  }

  // Final save
  fs.writeFileSync(geoDataPath, JSON.stringify(geoData, null, 2));

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('  COLLECTION COMPLETE');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`  Total processed: ${totalProcessed}`);
  console.log(`  Success: ${totalSuccess}`);
  console.log(`  Skipped (cached): ${totalSkipped}`);
  console.log(`  Failed: ${totalFailed}`);
  console.log(`\n  Output: ${geoDataPath}`);
  console.log('═══════════════════════════════════════════════════════════\n');
}

main().catch(console.error);
