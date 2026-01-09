/**
 * FARS Direct Query Script
 *
 * Downloads and parses NHTSA FARS CSV data to get REAL city-level truck accident data.
 * Unlike the approximate approach, this uses actual crash records.
 *
 * Data source: https://static.nhtsa.gov/nhtsa/downloads/FARS/2022/National/FARS2022NationalCSV.zip
 *
 * Run with: npx tsx scripts/fars-direct-query.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// State FIPS codes
const STATE_FIPS: Record<string, string> = {
  '01': 'alabama', '02': 'alaska', '04': 'arizona', '05': 'arkansas',
  '06': 'california', '08': 'colorado', '09': 'connecticut', '10': 'delaware',
  '12': 'florida', '13': 'georgia', '15': 'hawaii', '16': 'idaho',
  '17': 'illinois', '18': 'indiana', '19': 'iowa', '20': 'kansas',
  '21': 'kentucky', '22': 'louisiana', '23': 'maine', '24': 'maryland',
  '25': 'massachusetts', '26': 'michigan', '27': 'minnesota', '28': 'mississippi',
  '29': 'missouri', '30': 'montana', '31': 'nebraska', '32': 'nevada',
  '33': 'new-hampshire', '34': 'new-jersey', '35': 'new-mexico',
  '36': 'new-york', '37': 'north-carolina', '38': 'north-dakota',
  '39': 'ohio', '40': 'oklahoma', '41': 'oregon', '42': 'pennsylvania',
  '44': 'rhode-island', '45': 'south-carolina', '46': 'south-dakota',
  '47': 'tennessee', '48': 'texas', '49': 'utah', '50': 'vermont',
  '51': 'virginia', '53': 'washington', '54': 'west-virginia',
  '55': 'wisconsin', '56': 'wyoming',
};

// State names for display
const STATE_NAMES: Record<string, string> = {
  alabama: 'Alabama', alaska: 'Alaska', arizona: 'Arizona', arkansas: 'Arkansas',
  california: 'California', colorado: 'Colorado', connecticut: 'Connecticut',
  delaware: 'Delaware', florida: 'Florida', georgia: 'Georgia', hawaii: 'Hawaii',
  idaho: 'Idaho', illinois: 'Illinois', indiana: 'Indiana', iowa: 'Iowa',
  kansas: 'Kansas', kentucky: 'Kentucky', louisiana: 'Louisiana', maine: 'Maine',
  maryland: 'Maryland', massachusetts: 'Massachusetts', michigan: 'Michigan',
  minnesota: 'Minnesota', mississippi: 'Mississippi', missouri: 'Missouri',
  montana: 'Montana', nebraska: 'Nebraska', nevada: 'Nevada',
  'new-hampshire': 'New Hampshire', 'new-jersey': 'New Jersey',
  'new-mexico': 'New Mexico', 'new-york': 'New York',
  'north-carolina': 'North Carolina', 'north-dakota': 'North Dakota',
  ohio: 'Ohio', oklahoma: 'Oklahoma', oregon: 'Oregon', pennsylvania: 'Pennsylvania',
  'rhode-island': 'Rhode Island', 'south-carolina': 'South Carolina',
  'south-dakota': 'South Dakota', tennessee: 'Tennessee', texas: 'Texas',
  utah: 'Utah', vermont: 'Vermont', virginia: 'Virginia', washington: 'Washington',
  'west-virginia': 'West Virginia', wisconsin: 'Wisconsin', wyoming: 'Wyoming',
};

// FARS Large Truck Body Types (60-79)
// Per FARS Coding Manual
const LARGE_TRUCK_BODY_TYPES = new Set([
  60, // Step Van
  61, // Single-Unit Straight Truck (10,000+ lbs GVWR)
  62, // Single-Unit Straight Truck (Unknown GVWR)
  64, // Single-Unit Straight Truck
  65, // Medium/Heavy Pickup (10,000+ lbs GVWR)
  66, // Truck Tractor (Bobtail - no trailer)
  67, // Truck Tractor (Pulling trailer) - 18-wheelers!
  71, // Unknown Med/Heavy Truck Configuration
  72, // Unknown Med/Heavy Truck Configuration
  78, // Unknown Medium/Heavy Truck Type
  79, // Unknown Medium/Heavy Truck Type
]);

// Output data structure
interface CityAccidentRecord {
  cityCode: number;
  cityName: string;
  countyCode: number;
  countyName: string;
  fatalities: number;
  crashes: number;
  lat?: number;
  lng?: number;
}

interface StateAccidentData {
  stateName: string;
  totalFatalities: number;
  totalCrashes: number;
  cities: Record<string, CityAccidentRecord>;
}

interface FARSOutput {
  generatedAt: string;
  dataYear: number;
  sourceUrl: string;
  totalCities: number;
  totalFatalities: number;
  totalCrashes: number;
  states: Record<string, StateAccidentData>;
}

/**
 * Parse a CSV line, handling quoted fields
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());

  return result;
}

/**
 * Parse CSV file into records
 */
function parseCSV(content: string): Record<string, string>[] {
  const lines = content.split('\n').filter(l => l.trim());
  if (lines.length === 0) return [];

  const headers = parseCSVLine(lines[0]).map(h => h.toUpperCase());
  const records: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const record: Record<string, string> = {};

    for (let j = 0; j < headers.length; j++) {
      record[headers[j]] = values[j] || '';
    }
    records.push(record);
  }

  return records;
}

/**
 * Download and extract FARS data
 */
async function downloadFARSData(year: number): Promise<string> {
  const dataDir = path.join(process.cwd(), 'scripts/fars-data');
  const zipPath = path.join(dataDir, `FARS${year}NationalCSV.zip`);
  const extractDir = path.join(dataDir, `${year}`);

  // Create data directory
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Check if already extracted
  if (fs.existsSync(extractDir) && fs.readdirSync(extractDir).length > 0) {
    console.log(`✓ FARS ${year} data already downloaded and extracted`);
    return extractDir;
  }

  // Download the ZIP file
  const url = `https://static.nhtsa.gov/nhtsa/downloads/FARS/${year}/National/FARS${year}NationalCSV.zip`;
  console.log(`\n📥 Downloading FARS ${year} data...`);
  console.log(`   URL: ${url}`);

  try {
    execSync(`curl -L -o "${zipPath}" "${url}"`, { stdio: 'inherit' });
  } catch (error) {
    throw new Error(`Failed to download FARS data: ${error}`);
  }

  // Extract the ZIP file
  console.log(`\n📦 Extracting FARS data...`);
  if (!fs.existsSync(extractDir)) {
    fs.mkdirSync(extractDir, { recursive: true });
  }

  try {
    execSync(`unzip -o "${zipPath}" -d "${extractDir}"`, { stdio: 'inherit' });
  } catch (error) {
    throw new Error(`Failed to extract FARS data: ${error}`);
  }

  return extractDir;
}

/**
 * Main execution
 */
async function main() {
  const year = 2022; // Latest complete FARS year

  console.log('═══════════════════════════════════════════════════════════');
  console.log('  FARS DIRECT QUERY - REAL TRUCK ACCIDENT DATA');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`  Year: ${year}`);
  console.log(`  Source: NHTSA FARS CSV Download`);
  console.log('═══════════════════════════════════════════════════════════\n');

  // Step 1: Download FARS data
  const dataDir = await downloadFARSData(year);

  // Step 2: Find CSV files (they may be in a subdirectory)
  console.log('\n📂 Locating CSV files...');
  let csvDir = dataDir;
  let files = fs.readdirSync(dataDir);

  // Check if there's a subdirectory containing the CSV files
  const subDir = files.find(f => {
    const fullPath = path.join(dataDir, f);
    return fs.statSync(fullPath).isDirectory() && f.includes('CSV');
  });

  if (subDir) {
    csvDir = path.join(dataDir, subDir);
    files = fs.readdirSync(csvDir);
    console.log(`   Found CSV subdirectory: ${subDir}`);
  }

  console.log(`   Found ${files.length} files`);

  const vehicleFile = files.find(f => f.toLowerCase() === 'vehicle.csv');
  const accidentFile = files.find(f => f.toLowerCase() === 'accident.csv');

  if (!vehicleFile || !accidentFile) {
    throw new Error('Could not find Vehicle or Accident CSV files');
  }

  console.log(`   Vehicle file: ${vehicleFile}`);
  console.log(`   Accident file: ${accidentFile}`);

  // Step 3: Load and parse Vehicle CSV
  console.log('\n📊 Loading Vehicle data...');
  const vehicleContent = fs.readFileSync(path.join(csvDir, vehicleFile), 'utf-8');
  const vehicles = parseCSV(vehicleContent);
  console.log(`   Loaded ${vehicles.length.toLocaleString()} vehicle records`);

  // Step 4: Find cases with large trucks
  console.log('\n🚛 Filtering for large truck crashes...');
  const truckCases = new Map<string, Set<number>>(); // state -> set of case numbers

  for (const vehicle of vehicles) {
    const bodyType = parseInt(vehicle.BODY_TYP || '0');

    if (LARGE_TRUCK_BODY_TYPES.has(bodyType)) {
      const stateFips = vehicle.STATE?.padStart(2, '0');
      const caseNum = parseInt(vehicle.ST_CASE || '0');

      if (stateFips && caseNum > 0) {
        if (!truckCases.has(stateFips)) {
          truckCases.set(stateFips, new Set());
        }
        truckCases.get(stateFips)!.add(caseNum);
      }
    }
  }

  let totalTruckCrashes = 0;
  for (const cases of truckCases.values()) {
    totalTruckCrashes += cases.size;
  }
  console.log(`   Found ${totalTruckCrashes.toLocaleString()} crashes involving large trucks`);

  // Step 5: Load and parse Accident CSV
  console.log('\n📊 Loading Accident data...');
  const accidentContent = fs.readFileSync(path.join(csvDir, accidentFile), 'utf-8');
  const accidents = parseCSV(accidentContent);
  console.log(`   Loaded ${accidents.length.toLocaleString()} accident records`);

  // Step 6: Aggregate by city
  console.log('\n🏙️ Aggregating by city...');
  const output: FARSOutput = {
    generatedAt: new Date().toISOString(),
    dataYear: year,
    sourceUrl: `https://static.nhtsa.gov/nhtsa/downloads/FARS/${year}/National/FARS${year}NationalCSV.zip`,
    totalCities: 0,
    totalFatalities: 0,
    totalCrashes: 0,
    states: {},
  };

  for (const accident of accidents) {
    const stateFips = accident.STATE?.padStart(2, '0');
    const caseNum = parseInt(accident.ST_CASE || '0');

    // Skip if this crash doesn't involve a large truck
    if (!stateFips || !truckCases.has(stateFips) || !truckCases.get(stateFips)!.has(caseNum)) {
      continue;
    }

    const stateSlug = STATE_FIPS[stateFips];
    if (!stateSlug) continue;

    const cityCode = parseInt(accident.CITY || '0');
    const countyCode = parseInt(accident.COUNTY || '0');
    const fatalities = parseInt(accident.FATALS || '0');
    const lat = parseFloat(accident.LATITUDE || '0');
    const lng = parseFloat(accident.LONGITUD || '0');

    // Initialize state data
    if (!output.states[stateSlug]) {
      output.states[stateSlug] = {
        stateName: STATE_NAMES[stateSlug],
        totalFatalities: 0,
        totalCrashes: 0,
        cities: {},
      };
    }

    const stateData = output.states[stateSlug];

    const cityName = accident.CITYNAME || accident.cityname || '';
    const countyName = accident.COUNTYNAME || accident.countyname || '';

    // City code 0 or 9999 means unknown/rural - still count these for state totals
    // but only create city pages for known cities with valid names
    if (cityCode > 0 && cityCode < 9999 && cityName && cityName !== 'NOT APPLICABLE') {
      const cityKey = `${cityCode}-${countyCode}`;

      if (!stateData.cities[cityKey]) {
        stateData.cities[cityKey] = {
          cityCode,
          cityName,
          countyCode,
          countyName,
          fatalities: 0,
          crashes: 0,
        };
      }

      stateData.cities[cityKey].fatalities += fatalities;
      stateData.cities[cityKey].crashes += 1;

      // Store first valid lat/lng
      if (lat !== 0 && lng !== 0 && !stateData.cities[cityKey].lat) {
        stateData.cities[cityKey].lat = lat;
        stateData.cities[cityKey].lng = lng;
      }
    }

    stateData.totalFatalities += fatalities;
    stateData.totalCrashes += 1;
    output.totalFatalities += fatalities;
    output.totalCrashes += 1;
  }

  // Count total cities
  for (const stateData of Object.values(output.states)) {
    output.totalCities += Object.keys(stateData.cities).length;
  }

  // Step 7: Save output
  const outputPath = path.join(process.cwd(), 'scripts/fars-city-accidents-raw.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  // Final summary
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('  COLLECTION COMPLETE');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`  States with truck crashes: ${Object.keys(output.states).length}`);
  console.log(`  Total cities with truck crashes: ${output.totalCities}`);
  console.log(`  Total truck crash fatalities: ${output.totalFatalities}`);
  console.log(`  Total truck crashes: ${output.totalCrashes}`);
  console.log(`\n  Output: ${outputPath}`);
  console.log('═══════════════════════════════════════════════════════════\n');

  // Per-state summary
  console.log('\n📊 Per-State Summary:');
  console.log('─'.repeat(60));

  const stateSummaries = Object.entries(output.states)
    .map(([slug, data]) => ({
      slug,
      name: data.stateName,
      cities: Object.keys(data.cities).length,
      fatalities: data.totalFatalities,
      crashes: data.totalCrashes,
    }))
    .sort((a, b) => b.fatalities - a.fatalities);

  for (const state of stateSummaries.slice(0, 15)) {
    console.log(`  ${state.name.padEnd(20)} ${state.cities.toString().padStart(4)} cities, ${state.fatalities.toString().padStart(4)} fatalities`);
  }
  console.log(`  ... and ${stateSummaries.length - 15} more states`);
}

main().catch(console.error);
