/**
 * State Enhancement Agent
 *
 * Enhances thin state pages to reach 2,500+ word count target.
 * Each state gets expanded content in all sections.
 *
 * Usage:
 *   npx tsx scripts/agents/state-enhancer.ts alaska
 *   npx tsx scripts/agents/state-enhancer.ts --all-thin
 */

import * as fs from 'fs';
import * as path from 'path';

const STATES_DIR = path.join(__dirname, '..', '..', 'src', 'lib', 'states-content');

// States that need enhancement (from audit)
const THIN_STATES = [
  // Previously enhanced (batch 1)
  'alaska',
  'connecticut',
  'delaware',
  'hawaii',
  'idaho',
  'maine',
  'massachusetts',
  'montana',
  'nebraska',
  'nevada',
  'new-hampshire',
  'new-mexico',
  'north-dakota',
  'rhode-island',
  'south-dakota',
  'vermont',
  'wyoming',
  // Batch 2 - remaining thin states
  'alabama',
  'arizona',
  'arkansas',
  'california',
  'colorado',
  'florida',
  'georgia',
  'illinois',
  'indiana',
  'iowa',
  'kansas',
  'kentucky',
  'louisiana',
  'maryland',
  'michigan',
  'minnesota',
  'mississippi',
  'missouri',
  'new-jersey',
  'new-york',
  'north-carolina',
  'ohio',
  'oklahoma',
  'oregon',
  'pennsylvania',
  'south-carolina',
  'tennessee',
  'texas',
  'utah',
  'virginia',
  'washington',
  'west-virginia',
  'wisconsin'
];

// State-specific data for enhancement
interface StateData {
  name: string;
  abbreviation: string;
  region: string;
  annualTruckDeaths: string;
  registeredTrucks: string;
  interstateHighways: string[];
  majorCorridors: { name: string; miles?: number; description: string }[];
  negligenceType: 'pure' | 'modified-50' | 'modified-51' | 'contributory';
  solPersonalInjury: string;
  solWrongfulDeath: string;
  solPropertyDamage: string;
  primaryHazard: string;
  weatherMonths: string[];
  majorIndustries: string[];
  courtDistrict: string;
  neighboringStates: string[];
}

const STATE_DATA: Record<string, StateData> = {
  'alaska': {
    name: 'Alaska',
    abbreviation: 'AK',
    region: 'Pacific Northwest',
    annualTruckDeaths: '15+',
    registeredTrucks: '20,000+',
    interstateHighways: [],
    majorCorridors: [
      { name: 'Alaska Highway', description: 'Primary route from Canada to Fairbanks, 1,387 miles through extreme terrain' },
      { name: 'Glenn Highway', description: 'Route from Anchorage to Tok Junction, connecting to the Alaska Highway' },
      { name: 'Parks Highway', description: 'Connects Anchorage to Fairbanks through Denali, 358 miles' },
      { name: 'Seward Highway', description: 'Scenic but hazardous route from Anchorage to Seward along Turnagain Arm' },
      { name: 'Richardson Highway', description: 'Oldest highway in Alaska, connecting Valdez to Fairbanks' }
    ],
    negligenceType: 'pure',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '6 Years',
    primaryHazard: 'Extreme cold and winter conditions',
    weatherMonths: ['October', 'November', 'December', 'January', 'February', 'March', 'April'],
    majorIndustries: ['Oil and gas', 'Fishing', 'Mining', 'Tourism', 'Military'],
    courtDistrict: 'District of Alaska',
    neighboringStates: []
  },
  'connecticut': {
    name: 'Connecticut',
    abbreviation: 'CT',
    region: 'New England',
    annualTruckDeaths: '25+',
    registeredTrucks: '35,000+',
    interstateHighways: ['I-95', 'I-84', 'I-91'],
    majorCorridors: [
      { name: 'Interstate 95', description: 'Primary Northeast corridor running through coastal Connecticut' },
      { name: 'Interstate 84', description: 'East-west route connecting New York to Massachusetts' },
      { name: 'Interstate 91', description: 'North-south corridor from New Haven to Massachusetts' },
      { name: 'Merritt Parkway/Route 15', description: 'Alternate route prohibiting commercial trucks' }
    ],
    negligenceType: 'modified-51',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '2 Years',
    primaryHazard: 'Winter ice and congestion',
    weatherMonths: ['December', 'January', 'February', 'March'],
    majorIndustries: ['Finance', 'Insurance', 'Manufacturing', 'Healthcare', 'Defense'],
    courtDistrict: 'District of Connecticut',
    neighboringStates: ['new-york', 'massachusetts', 'rhode-island']
  },
  'delaware': {
    name: 'Delaware',
    abbreviation: 'DE',
    region: 'Mid-Atlantic',
    annualTruckDeaths: '15+',
    registeredTrucks: '15,000+',
    interstateHighways: ['I-95', 'I-495'],
    majorCorridors: [
      { name: 'Interstate 95', description: 'Main Northeast corridor through Wilmington' },
      { name: 'US Route 13', description: 'Primary north-south route through Delaware' },
      { name: 'US Route 301', description: 'Connects to Maryland, heavy truck traffic' },
      { name: 'Delaware Route 1', description: 'Toll road connecting Wilmington to Dover and beaches' }
    ],
    negligenceType: 'modified-51',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '2 Years',
    primaryHazard: 'I-95 congestion and weather',
    weatherMonths: ['December', 'January', 'February', 'March'],
    majorIndustries: ['Banking', 'Chemicals', 'Pharmaceuticals', 'Agriculture'],
    courtDistrict: 'District of Delaware',
    neighboringStates: ['maryland', 'new-jersey', 'pennsylvania']
  },
  'hawaii': {
    name: 'Hawaii',
    abbreviation: 'HI',
    region: 'Pacific Islands',
    annualTruckDeaths: '10+',
    registeredTrucks: '15,000+',
    interstateHighways: ['H-1', 'H-2', 'H-3'],
    majorCorridors: [
      { name: 'H-1 Freeway', description: 'Main east-west route on Oahu, extremely congested' },
      { name: 'H-2 Freeway', description: 'Connects H-1 to central Oahu' },
      { name: 'Farrington Highway', description: 'Coastal route on Oahu' },
      { name: 'Kamehameha Highway', description: 'Circles Oahu, frequent truck traffic' }
    ],
    negligenceType: 'modified-51',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '2 Years',
    primaryHazard: 'Island roads and tropical weather',
    weatherMonths: ['November', 'December', 'January', 'February', 'March'],
    majorIndustries: ['Tourism', 'Military', 'Agriculture', 'Construction'],
    courtDistrict: 'District of Hawaii',
    neighboringStates: []
  },
  'idaho': {
    name: 'Idaho',
    abbreviation: 'ID',
    region: 'Pacific Northwest',
    annualTruckDeaths: '35+',
    registeredTrucks: '40,000+',
    interstateHighways: ['I-84', 'I-86', 'I-90', 'I-15'],
    majorCorridors: [
      { name: 'Interstate 84', description: 'Primary east-west route through southern Idaho' },
      { name: 'Interstate 90', description: 'Northern route through Coeur d\'Alene' },
      { name: 'Interstate 15', description: 'North-south route in eastern Idaho' },
      { name: 'US Route 95', description: 'Longest north-south route in Idaho' }
    ],
    negligenceType: 'modified-50',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '3 Years',
    primaryHazard: 'Mountain passes and winter weather',
    weatherMonths: ['November', 'December', 'January', 'February', 'March'],
    majorIndustries: ['Agriculture', 'Technology', 'Manufacturing', 'Mining'],
    courtDistrict: 'District of Idaho',
    neighboringStates: ['montana', 'wyoming', 'utah', 'nevada', 'oregon', 'washington']
  },
  'maine': {
    name: 'Maine',
    abbreviation: 'ME',
    region: 'New England',
    annualTruckDeaths: '20+',
    registeredTrucks: '25,000+',
    interstateHighways: ['I-95', 'I-295'],
    majorCorridors: [
      { name: 'Interstate 95', description: 'Maine Turnpike running from Kittery to Houlton' },
      { name: 'US Route 1', description: 'Coastal route along Atlantic seaboard' },
      { name: 'US Route 2', description: 'East-west route through northern Maine' },
      { name: 'Interstate 295', description: 'Bypass around Portland metro area' }
    ],
    negligenceType: 'modified-50',
    solPersonalInjury: '6 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '6 Years',
    primaryHazard: 'Severe winter weather and moose',
    weatherMonths: ['November', 'December', 'January', 'February', 'March', 'April'],
    majorIndustries: ['Forestry', 'Fishing', 'Tourism', 'Manufacturing', 'Agriculture'],
    courtDistrict: 'District of Maine',
    neighboringStates: ['new-hampshire']
  },
  'massachusetts': {
    name: 'Massachusetts',
    abbreviation: 'MA',
    region: 'New England',
    annualTruckDeaths: '40+',
    registeredTrucks: '60,000+',
    interstateHighways: ['I-90', 'I-93', 'I-95', 'I-495', 'I-84'],
    majorCorridors: [
      { name: 'Interstate 90 (Mass Pike)', description: 'Primary east-west toll road across state' },
      { name: 'Interstate 93', description: 'Major north-south route through Boston' },
      { name: 'Interstate 95', description: 'Main Northeast corridor' },
      { name: 'Interstate 495', description: 'Outer belt around Boston metro' }
    ],
    negligenceType: 'modified-51',
    solPersonalInjury: '3 Years',
    solWrongfulDeath: '3 Years',
    solPropertyDamage: '3 Years',
    primaryHazard: 'Urban congestion and winter weather',
    weatherMonths: ['December', 'January', 'February', 'March'],
    majorIndustries: ['Technology', 'Healthcare', 'Education', 'Finance', 'Manufacturing'],
    courtDistrict: 'District of Massachusetts',
    neighboringStates: ['new-hampshire', 'vermont', 'new-york', 'connecticut', 'rhode-island']
  },
  'montana': {
    name: 'Montana',
    abbreviation: 'MT',
    region: 'Mountain West',
    annualTruckDeaths: '35+',
    registeredTrucks: '45,000+',
    interstateHighways: ['I-90', 'I-94', 'I-15'],
    majorCorridors: [
      { name: 'Interstate 90', description: 'Primary east-west route across southern Montana' },
      { name: 'Interstate 94', description: 'Northern route from Billings to North Dakota' },
      { name: 'Interstate 15', description: 'North-south route from Canada to Idaho' },
      { name: 'US Route 2', description: 'Hi-Line route across northern Montana' }
    ],
    negligenceType: 'modified-51',
    solPersonalInjury: '3 Years',
    solWrongfulDeath: '3 Years',
    solPropertyDamage: '2 Years',
    primaryHazard: 'Mountain passes and extreme weather',
    weatherMonths: ['October', 'November', 'December', 'January', 'February', 'March', 'April'],
    majorIndustries: ['Agriculture', 'Mining', 'Timber', 'Tourism', 'Oil and gas'],
    courtDistrict: 'District of Montana',
    neighboringStates: ['north-dakota', 'south-dakota', 'wyoming', 'idaho']
  },
  'nebraska': {
    name: 'Nebraska',
    abbreviation: 'NE',
    region: 'Great Plains',
    annualTruckDeaths: '35+',
    registeredTrucks: '55,000+',
    interstateHighways: ['I-80', 'I-76', 'I-180'],
    majorCorridors: [
      { name: 'Interstate 80', description: 'Transcontinental route across entire state' },
      { name: 'US Route 6', description: 'Parallel route to I-80' },
      { name: 'US Route 20', description: 'Northern east-west route' },
      { name: 'US Route 75', description: 'Eastern north-south corridor' }
    ],
    negligenceType: 'modified-50',
    solPersonalInjury: '4 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '4 Years',
    primaryHazard: 'Severe weather and long distances',
    weatherMonths: ['November', 'December', 'January', 'February', 'March'],
    majorIndustries: ['Agriculture', 'Food processing', 'Transportation', 'Insurance', 'Manufacturing'],
    courtDistrict: 'District of Nebraska',
    neighboringStates: ['south-dakota', 'iowa', 'missouri', 'kansas', 'colorado', 'wyoming']
  },
  'nevada': {
    name: 'Nevada',
    abbreviation: 'NV',
    region: 'Southwest',
    annualTruckDeaths: '35+',
    registeredTrucks: '40,000+',
    interstateHighways: ['I-80', 'I-15', 'I-515'],
    majorCorridors: [
      { name: 'Interstate 80', description: 'Primary east-west route across northern Nevada' },
      { name: 'Interstate 15', description: 'Major route from Las Vegas to California and Utah' },
      { name: 'US Route 95', description: 'Longest route in Nevada, north-south' },
      { name: 'US Route 93', description: 'Eastern corridor from Arizona to Idaho' }
    ],
    negligenceType: 'modified-51',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '3 Years',
    primaryHazard: 'Extreme heat and desert conditions',
    weatherMonths: ['June', 'July', 'August'],
    majorIndustries: ['Gaming', 'Tourism', 'Mining', 'Logistics', 'Technology'],
    courtDistrict: 'District of Nevada',
    neighboringStates: ['california', 'oregon', 'idaho', 'utah', 'arizona']
  },
  'new-hampshire': {
    name: 'New Hampshire',
    abbreviation: 'NH',
    region: 'New England',
    annualTruckDeaths: '15+',
    registeredTrucks: '20,000+',
    interstateHighways: ['I-93', 'I-89', 'I-95'],
    majorCorridors: [
      { name: 'Interstate 93', description: 'Primary north-south route through state' },
      { name: 'Interstate 89', description: 'Connects Concord to Vermont and I-91' },
      { name: 'Interstate 95', description: 'Short but heavily trafficked coastal section' },
      { name: 'US Route 3', description: 'Alternative north-south route' }
    ],
    negligenceType: 'modified-51',
    solPersonalInjury: '3 Years',
    solWrongfulDeath: '3 Years',
    solPropertyDamage: '3 Years',
    primaryHazard: 'Mountain passes and winter weather',
    weatherMonths: ['November', 'December', 'January', 'February', 'March', 'April'],
    majorIndustries: ['Manufacturing', 'Technology', 'Tourism', 'Healthcare', 'Education'],
    courtDistrict: 'District of New Hampshire',
    neighboringStates: ['maine', 'vermont', 'massachusetts']
  },
  'new-mexico': {
    name: 'New Mexico',
    abbreviation: 'NM',
    region: 'Southwest',
    annualTruckDeaths: '55+',
    registeredTrucks: '45,000+',
    interstateHighways: ['I-10', 'I-25', 'I-40'],
    majorCorridors: [
      { name: 'Interstate 40', description: 'Major east-west transcontinental route' },
      { name: 'Interstate 25', description: 'Primary north-south route through state' },
      { name: 'Interstate 10', description: 'Southern route from El Paso to Arizona' },
      { name: 'US Route 54', description: 'Connects El Paso to northeastern New Mexico' }
    ],
    negligenceType: 'pure',
    solPersonalInjury: '3 Years',
    solWrongfulDeath: '3 Years',
    solPropertyDamage: '4 Years',
    primaryHazard: 'High altitude and extreme weather',
    weatherMonths: ['June', 'July', 'August', 'December', 'January', 'February'],
    majorIndustries: ['Oil and gas', 'Tourism', 'Military', 'Technology', 'Agriculture'],
    courtDistrict: 'District of New Mexico',
    neighboringStates: ['colorado', 'oklahoma', 'texas', 'arizona', 'utah']
  },
  'north-dakota': {
    name: 'North Dakota',
    abbreviation: 'ND',
    region: 'Great Plains',
    annualTruckDeaths: '25+',
    registeredTrucks: '50,000+',
    interstateHighways: ['I-94', 'I-29'],
    majorCorridors: [
      { name: 'Interstate 94', description: 'Primary east-west route across state' },
      { name: 'Interstate 29', description: 'North-south route along eastern border' },
      { name: 'US Route 2', description: 'Northern east-west route' },
      { name: 'US Route 85', description: 'Western north-south corridor, oil field traffic' }
    ],
    negligenceType: 'modified-50',
    solPersonalInjury: '6 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '6 Years',
    primaryHazard: 'Extreme cold and oil field traffic',
    weatherMonths: ['October', 'November', 'December', 'January', 'February', 'March', 'April'],
    majorIndustries: ['Oil and gas', 'Agriculture', 'Energy', 'Food processing', 'Manufacturing'],
    courtDistrict: 'District of North Dakota',
    neighboringStates: ['montana', 'south-dakota', 'minnesota']
  },
  'rhode-island': {
    name: 'Rhode Island',
    abbreviation: 'RI',
    region: 'New England',
    annualTruckDeaths: '10+',
    registeredTrucks: '10,000+',
    interstateHighways: ['I-95', 'I-195', 'I-295'],
    majorCorridors: [
      { name: 'Interstate 95', description: 'Primary Northeast corridor through Providence' },
      { name: 'Interstate 195', description: 'Connects I-95 to Cape Cod' },
      { name: 'Interstate 295', description: 'Bypass around Providence' },
      { name: 'US Route 1', description: 'Coastal alternate route' }
    ],
    negligenceType: 'pure',
    solPersonalInjury: '3 Years',
    solWrongfulDeath: '3 Years',
    solPropertyDamage: '10 Years',
    primaryHazard: 'Urban congestion and weather',
    weatherMonths: ['December', 'January', 'February', 'March'],
    majorIndustries: ['Healthcare', 'Education', 'Manufacturing', 'Tourism', 'Defense'],
    courtDistrict: 'District of Rhode Island',
    neighboringStates: ['massachusetts', 'connecticut']
  },
  'south-dakota': {
    name: 'South Dakota',
    abbreviation: 'SD',
    region: 'Great Plains',
    annualTruckDeaths: '25+',
    registeredTrucks: '40,000+',
    interstateHighways: ['I-90', 'I-29'],
    majorCorridors: [
      { name: 'Interstate 90', description: 'Primary east-west transcontinental route' },
      { name: 'Interstate 29', description: 'Eastern north-south corridor' },
      { name: 'US Route 14', description: 'Northern east-west route' },
      { name: 'US Route 83', description: 'Central north-south route' }
    ],
    negligenceType: 'modified-51',
    solPersonalInjury: '3 Years',
    solWrongfulDeath: '3 Years',
    solPropertyDamage: '6 Years',
    primaryHazard: 'Severe winter weather and distances',
    weatherMonths: ['November', 'December', 'January', 'February', 'March', 'April'],
    majorIndustries: ['Agriculture', 'Tourism', 'Manufacturing', 'Healthcare', 'Finance'],
    courtDistrict: 'District of South Dakota',
    neighboringStates: ['north-dakota', 'montana', 'wyoming', 'nebraska', 'iowa', 'minnesota']
  },
  'vermont': {
    name: 'Vermont',
    abbreviation: 'VT',
    region: 'New England',
    annualTruckDeaths: '10+',
    registeredTrucks: '15,000+',
    interstateHighways: ['I-89', 'I-91', 'I-93'],
    majorCorridors: [
      { name: 'Interstate 89', description: 'Primary route from Burlington to New Hampshire' },
      { name: 'Interstate 91', description: 'Eastern north-south route along Connecticut River' },
      { name: 'US Route 7', description: 'Western north-south corridor' },
      { name: 'US Route 2', description: 'East-west route through central Vermont' }
    ],
    negligenceType: 'modified-51',
    solPersonalInjury: '3 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '3 Years',
    primaryHazard: 'Mountain roads and winter weather',
    weatherMonths: ['November', 'December', 'January', 'February', 'March', 'April'],
    majorIndustries: ['Tourism', 'Agriculture', 'Manufacturing', 'Technology', 'Healthcare'],
    courtDistrict: 'District of Vermont',
    neighboringStates: ['new-hampshire', 'massachusetts', 'new-york']
  },
  'wyoming': {
    name: 'Wyoming',
    abbreviation: 'WY',
    region: 'Mountain West',
    annualTruckDeaths: '30+',
    registeredTrucks: '35,000+',
    interstateHighways: ['I-80', 'I-90', 'I-25'],
    majorCorridors: [
      { name: 'Interstate 80', description: 'Major transcontinental route across southern Wyoming' },
      { name: 'Interstate 90', description: 'Northern route through Sheridan' },
      { name: 'Interstate 25', description: 'North-south route from Colorado to Montana' },
      { name: 'US Route 20', description: 'Route to Yellowstone from east' }
    ],
    negligenceType: 'modified-51',
    solPersonalInjury: '4 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '4 Years',
    primaryHazard: 'Extreme wind and winter weather',
    weatherMonths: ['October', 'November', 'December', 'January', 'February', 'March', 'April', 'May'],
    majorIndustries: ['Energy', 'Mining', 'Agriculture', 'Tourism', 'Manufacturing'],
    courtDistrict: 'District of Wyoming',
    neighboringStates: ['montana', 'south-dakota', 'nebraska', 'colorado', 'utah', 'idaho']
  },
  // Batch 2 states
  'alabama': {
    name: 'Alabama',
    abbreviation: 'AL',
    region: 'Southeast',
    annualTruckDeaths: '150+',
    registeredTrucks: '120,000+',
    interstateHighways: ['I-65', 'I-20', 'I-10', 'I-59', 'I-85'],
    majorCorridors: [
      { name: 'Interstate 65', description: 'Major north-south corridor from Mobile to Tennessee' },
      { name: 'Interstate 20/59', description: 'East-west route through Birmingham connecting Atlanta to Mississippi' },
      { name: 'Interstate 10', description: 'Southern coastal route through Mobile' },
      { name: 'Interstate 85', description: 'Northeast corridor connecting Montgomery to Atlanta' }
    ],
    negligenceType: 'contributory',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '6 Years',
    primaryHazard: 'Severe storms and flooding',
    weatherMonths: ['March', 'April', 'May', 'November'],
    majorIndustries: ['Automotive', 'Aerospace', 'Steel', 'Agriculture', 'Port operations'],
    courtDistrict: 'Northern District of Alabama / Middle District of Alabama / Southern District of Alabama',
    neighboringStates: ['tennessee', 'georgia', 'florida', 'mississippi']
  },
  'arizona': {
    name: 'Arizona',
    abbreviation: 'AZ',
    region: 'Southwest',
    annualTruckDeaths: '120+',
    registeredTrucks: '95,000+',
    interstateHighways: ['I-10', 'I-17', 'I-40', 'I-8', 'I-19'],
    majorCorridors: [
      { name: 'Interstate 10', description: 'Major transcontinental route from California through Phoenix to New Mexico' },
      { name: 'Interstate 40', description: 'Northern east-west route through Flagstaff' },
      { name: 'Interstate 17', description: 'Primary north-south route connecting Phoenix to Flagstaff' },
      { name: 'Interstate 8', description: 'Southern route from San Diego to I-10 near Casa Grande' }
    ],
    negligenceType: 'pure',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '2 Years',
    primaryHazard: 'Extreme heat and dust storms',
    weatherMonths: ['June', 'July', 'August', 'September'],
    majorIndustries: ['Technology', 'Aerospace', 'Tourism', 'Mining', 'Agriculture'],
    courtDistrict: 'District of Arizona',
    neighboringStates: ['california', 'nevada', 'utah', 'colorado', 'new-mexico']
  },
  'arkansas': {
    name: 'Arkansas',
    abbreviation: 'AR',
    region: 'South Central',
    annualTruckDeaths: '85+',
    registeredTrucks: '75,000+',
    interstateHighways: ['I-40', 'I-30', 'I-55', 'I-49'],
    majorCorridors: [
      { name: 'Interstate 40', description: 'Major east-west corridor across central Arkansas' },
      { name: 'Interstate 30', description: 'Connects Little Rock to Dallas through Texarkana' },
      { name: 'Interstate 55', description: 'Eastern route connecting Memphis to New Orleans' },
      { name: 'Interstate 49', description: 'North-south route from Texarkana to Missouri' }
    ],
    negligenceType: 'modified-50',
    solPersonalInjury: '3 Years',
    solWrongfulDeath: '3 Years',
    solPropertyDamage: '3 Years',
    primaryHazard: 'Tornadoes and severe weather',
    weatherMonths: ['March', 'April', 'May', 'November'],
    majorIndustries: ['Retail (Walmart)', 'Agriculture', 'Poultry', 'Transportation', 'Steel'],
    courtDistrict: 'Eastern District of Arkansas / Western District of Arkansas',
    neighboringStates: ['missouri', 'tennessee', 'mississippi', 'louisiana', 'texas', 'oklahoma']
  },
  'california': {
    name: 'California',
    abbreviation: 'CA',
    region: 'West Coast',
    annualTruckDeaths: '400+',
    registeredTrucks: '450,000+',
    interstateHighways: ['I-5', 'I-10', 'I-15', 'I-40', 'I-80', 'I-405', 'I-710'],
    majorCorridors: [
      { name: 'Interstate 5', description: 'Primary north-south route through entire state, heaviest truck traffic in nation' },
      { name: 'Interstate 10', description: 'Major east-west route through Southern California to Arizona' },
      { name: 'Interstate 15', description: 'Route from San Diego through Las Vegas corridor' },
      { name: 'Interstate 710', description: 'Port of Long Beach freight corridor, highest truck percentage in US' }
    ],
    negligenceType: 'pure',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '3 Years',
    primaryHazard: 'Heavy traffic and diverse weather',
    weatherMonths: ['December', 'January', 'February', 'June', 'July', 'August'],
    majorIndustries: ['Technology', 'Entertainment', 'Agriculture', 'Ports', 'Manufacturing'],
    courtDistrict: 'Northern/Central/Eastern/Southern District of California',
    neighboringStates: ['oregon', 'nevada', 'arizona']
  },
  'colorado': {
    name: 'Colorado',
    abbreviation: 'CO',
    region: 'Mountain West',
    annualTruckDeaths: '80+',
    registeredTrucks: '85,000+',
    interstateHighways: ['I-25', 'I-70', 'I-76'],
    majorCorridors: [
      { name: 'Interstate 70', description: 'Critical east-west mountain route through Eisenhower Tunnel' },
      { name: 'Interstate 25', description: 'Primary north-south route along Front Range' },
      { name: 'Interstate 76', description: 'Northeast route connecting Denver to Nebraska' },
      { name: 'US Route 40', description: 'Alternate mountain route through Berthoud Pass' }
    ],
    negligenceType: 'modified-50',
    solPersonalInjury: '3 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '3 Years',
    primaryHazard: 'Mountain passes and winter weather',
    weatherMonths: ['October', 'November', 'December', 'January', 'February', 'March', 'April'],
    majorIndustries: ['Technology', 'Aerospace', 'Energy', 'Tourism', 'Agriculture'],
    courtDistrict: 'District of Colorado',
    neighboringStates: ['wyoming', 'nebraska', 'kansas', 'oklahoma', 'new-mexico', 'utah']
  },
  'florida': {
    name: 'Florida',
    abbreviation: 'FL',
    region: 'Southeast',
    annualTruckDeaths: '350+',
    registeredTrucks: '280,000+',
    interstateHighways: ['I-95', 'I-75', 'I-10', 'I-4'],
    majorCorridors: [
      { name: 'Interstate 95', description: 'Major Atlantic coast corridor from Georgia to Miami' },
      { name: 'Interstate 75', description: 'Primary route from Georgia through Tampa to Naples' },
      { name: 'Interstate 4', description: 'Critical central Florida route connecting Tampa to Daytona Beach' },
      { name: 'Interstate 10', description: 'Northern east-west route from Jacksonville to Pensacola' }
    ],
    negligenceType: 'modified-51',
    solPersonalInjury: '4 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '4 Years',
    primaryHazard: 'Hurricanes and heavy rain',
    weatherMonths: ['June', 'July', 'August', 'September', 'October'],
    majorIndustries: ['Tourism', 'Agriculture', 'Aerospace', 'Ports', 'Healthcare'],
    courtDistrict: 'Northern/Middle/Southern District of Florida',
    neighboringStates: ['georgia', 'alabama']
  },
  'georgia': {
    name: 'Georgia',
    abbreviation: 'GA',
    region: 'Southeast',
    annualTruckDeaths: '200+',
    registeredTrucks: '180,000+',
    interstateHighways: ['I-75', 'I-85', 'I-20', 'I-95', 'I-16'],
    majorCorridors: [
      { name: 'Interstate 75', description: 'Major north-south corridor from Tennessee through Atlanta to Florida' },
      { name: 'Interstate 85', description: 'Northeast corridor from Atlanta to South Carolina' },
      { name: 'Interstate 20', description: 'East-west route through Atlanta connecting Alabama to South Carolina' },
      { name: 'Interstate 95', description: 'Coastal route from South Carolina to Florida' }
    ],
    negligenceType: 'modified-50',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '4 Years',
    primaryHazard: 'Atlanta congestion and severe storms',
    weatherMonths: ['March', 'April', 'May', 'July', 'August'],
    majorIndustries: ['Logistics', 'Film/Entertainment', 'Technology', 'Agriculture', 'Manufacturing'],
    courtDistrict: 'Northern/Middle/Southern District of Georgia',
    neighboringStates: ['tennessee', 'north-carolina', 'south-carolina', 'florida', 'alabama']
  },
  'illinois': {
    name: 'Illinois',
    abbreviation: 'IL',
    region: 'Midwest',
    annualTruckDeaths: '180+',
    registeredTrucks: '200,000+',
    interstateHighways: ['I-90', 'I-94', 'I-55', 'I-57', 'I-80', 'I-74'],
    majorCorridors: [
      { name: 'Interstate 90/94', description: 'Major Chicago corridor connecting Wisconsin to Indiana' },
      { name: 'Interstate 55', description: 'Primary route from Chicago to St. Louis' },
      { name: 'Interstate 80', description: 'Major transcontinental route south of Chicago' },
      { name: 'Interstate 57', description: 'North-south route from Chicago through southern Illinois' }
    ],
    negligenceType: 'modified-51',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '5 Years',
    primaryHazard: 'Chicago congestion and winter weather',
    weatherMonths: ['November', 'December', 'January', 'February', 'March'],
    majorIndustries: ['Finance', 'Manufacturing', 'Agriculture', 'Transportation', 'Healthcare'],
    courtDistrict: 'Northern/Central/Southern District of Illinois',
    neighboringStates: ['wisconsin', 'iowa', 'missouri', 'kentucky', 'indiana']
  },
  'indiana': {
    name: 'Indiana',
    abbreviation: 'IN',
    region: 'Midwest',
    annualTruckDeaths: '140+',
    registeredTrucks: '150,000+',
    interstateHighways: ['I-65', 'I-70', 'I-69', 'I-74', 'I-80/90'],
    majorCorridors: [
      { name: 'Interstate 65', description: 'Major north-south route from Chicago through Indianapolis to Louisville' },
      { name: 'Interstate 70', description: 'Primary east-west route through Indianapolis' },
      { name: 'Interstate 80/90 (Indiana Toll Road)', description: 'Northern corridor connecting Ohio to Illinois' },
      { name: 'Interstate 69', description: 'Northeast corridor from Indianapolis to Michigan' }
    ],
    negligenceType: 'modified-51',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '2 Years',
    primaryHazard: 'Winter weather and lake effect snow',
    weatherMonths: ['November', 'December', 'January', 'February', 'March'],
    majorIndustries: ['Manufacturing', 'Pharmaceuticals', 'Agriculture', 'Logistics', 'Steel'],
    courtDistrict: 'Northern District of Indiana / Southern District of Indiana',
    neighboringStates: ['michigan', 'ohio', 'kentucky', 'illinois']
  },
  'iowa': {
    name: 'Iowa',
    abbreviation: 'IA',
    region: 'Midwest',
    annualTruckDeaths: '65+',
    registeredTrucks: '90,000+',
    interstateHighways: ['I-80', 'I-35', 'I-29', 'I-74'],
    majorCorridors: [
      { name: 'Interstate 80', description: 'Major transcontinental route across southern Iowa' },
      { name: 'Interstate 35', description: 'Primary north-south route through Des Moines' },
      { name: 'Interstate 29', description: 'Western corridor along Missouri River' },
      { name: 'US Route 20', description: 'Northern east-west route across Iowa' }
    ],
    negligenceType: 'modified-51',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '5 Years',
    primaryHazard: 'Severe winter storms and tornadoes',
    weatherMonths: ['November', 'December', 'January', 'February', 'March', 'April', 'May'],
    majorIndustries: ['Agriculture', 'Food processing', 'Manufacturing', 'Insurance', 'Renewable energy'],
    courtDistrict: 'Northern District of Iowa / Southern District of Iowa',
    neighboringStates: ['minnesota', 'wisconsin', 'illinois', 'missouri', 'nebraska', 'south-dakota']
  },
  'kansas': {
    name: 'Kansas',
    abbreviation: 'KS',
    region: 'Great Plains',
    annualTruckDeaths: '70+',
    registeredTrucks: '95,000+',
    interstateHighways: ['I-70', 'I-35', 'I-135', 'I-335'],
    majorCorridors: [
      { name: 'Interstate 70', description: 'Major transcontinental route across entire state' },
      { name: 'Interstate 35', description: 'Primary north-south route through Kansas City and Wichita' },
      { name: 'US Route 54', description: 'Southwest diagonal route through Wichita' },
      { name: 'US Route 56', description: 'Historic Santa Fe Trail route' }
    ],
    negligenceType: 'modified-50',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '2 Years',
    primaryHazard: 'Tornadoes and severe weather',
    weatherMonths: ['March', 'April', 'May', 'June', 'November', 'December'],
    majorIndustries: ['Agriculture', 'Aviation', 'Energy', 'Food processing', 'Manufacturing'],
    courtDistrict: 'District of Kansas',
    neighboringStates: ['nebraska', 'missouri', 'oklahoma', 'colorado']
  },
  'kentucky': {
    name: 'Kentucky',
    abbreviation: 'KY',
    region: 'Southeast',
    annualTruckDeaths: '130+',
    registeredTrucks: '110,000+',
    interstateHighways: ['I-75', 'I-64', 'I-65', 'I-71', 'I-24'],
    majorCorridors: [
      { name: 'Interstate 75', description: 'Major north-south route from Ohio through Lexington to Tennessee' },
      { name: 'Interstate 65', description: 'Primary corridor from Louisville to Nashville' },
      { name: 'Interstate 64', description: 'East-west route through Louisville and Lexington' },
      { name: 'Interstate 71', description: 'Northeast route from Louisville to Cincinnati' }
    ],
    negligenceType: 'pure',
    solPersonalInjury: '1 Year',
    solWrongfulDeath: '1 Year',
    solPropertyDamage: '2 Years',
    primaryHazard: 'Mountain terrain and ice storms',
    weatherMonths: ['November', 'December', 'January', 'February', 'March'],
    majorIndustries: ['Automotive', 'Bourbon', 'Coal', 'Healthcare', 'Logistics'],
    courtDistrict: 'Eastern District of Kentucky / Western District of Kentucky',
    neighboringStates: ['ohio', 'indiana', 'illinois', 'missouri', 'tennessee', 'virginia', 'west-virginia']
  },
  'louisiana': {
    name: 'Louisiana',
    abbreviation: 'LA',
    region: 'Gulf Coast',
    annualTruckDeaths: '120+',
    registeredTrucks: '100,000+',
    interstateHighways: ['I-10', 'I-12', 'I-20', 'I-49', 'I-55'],
    majorCorridors: [
      { name: 'Interstate 10', description: 'Primary east-west route from Texas through Baton Rouge to Mississippi' },
      { name: 'Interstate 20', description: 'Northern route through Shreveport' },
      { name: 'Interstate 55', description: 'North-south route through Hammond to Mississippi' },
      { name: 'Interstate 49', description: 'Central corridor from Lafayette to Shreveport' }
    ],
    negligenceType: 'pure',
    solPersonalInjury: '1 Year',
    solWrongfulDeath: '1 Year',
    solPropertyDamage: '1 Year',
    primaryHazard: 'Hurricanes and flooding',
    weatherMonths: ['June', 'July', 'August', 'September', 'October'],
    majorIndustries: ['Oil and gas', 'Petrochemicals', 'Port operations', 'Tourism', 'Agriculture'],
    courtDistrict: 'Eastern/Middle/Western District of Louisiana',
    neighboringStates: ['texas', 'arkansas', 'mississippi']
  },
  'maryland': {
    name: 'Maryland',
    abbreviation: 'MD',
    region: 'Mid-Atlantic',
    annualTruckDeaths: '80+',
    registeredTrucks: '65,000+',
    interstateHighways: ['I-95', 'I-70', 'I-83', 'I-68', 'I-270'],
    majorCorridors: [
      { name: 'Interstate 95', description: 'Primary Northeast corridor through Baltimore' },
      { name: 'Interstate 70', description: 'East-west route from Baltimore to western Maryland' },
      { name: 'Interstate 270', description: 'Major DC suburb connector' },
      { name: 'US Route 50', description: 'Route to Eastern Shore and Ocean City' }
    ],
    negligenceType: 'contributory',
    solPersonalInjury: '3 Years',
    solWrongfulDeath: '3 Years',
    solPropertyDamage: '3 Years',
    primaryHazard: 'DC/Baltimore congestion and winter weather',
    weatherMonths: ['December', 'January', 'February', 'March'],
    majorIndustries: ['Government', 'Defense', 'Healthcare', 'Technology', 'Port operations'],
    courtDistrict: 'District of Maryland',
    neighboringStates: ['pennsylvania', 'delaware', 'virginia', 'west-virginia']
  },
  'michigan': {
    name: 'Michigan',
    abbreviation: 'MI',
    region: 'Midwest',
    annualTruckDeaths: '140+',
    registeredTrucks: '150,000+',
    interstateHighways: ['I-75', 'I-94', 'I-96', 'I-69', 'I-196'],
    majorCorridors: [
      { name: 'Interstate 75', description: 'Primary north-south route from Ohio through Detroit to Upper Peninsula' },
      { name: 'Interstate 94', description: 'Southern route from Chicago through Detroit' },
      { name: 'Interstate 96', description: 'Route from Detroit to Grand Rapids' },
      { name: 'Interstate 69', description: 'Cross-state route from Indiana to Port Huron' }
    ],
    negligenceType: 'modified-51',
    solPersonalInjury: '3 Years',
    solWrongfulDeath: '3 Years',
    solPropertyDamage: '3 Years',
    primaryHazard: 'Lake effect snow and winter weather',
    weatherMonths: ['November', 'December', 'January', 'February', 'March', 'April'],
    majorIndustries: ['Automotive', 'Manufacturing', 'Agriculture', 'Technology', 'Tourism'],
    courtDistrict: 'Eastern District of Michigan / Western District of Michigan',
    neighboringStates: ['ohio', 'indiana', 'wisconsin']
  },
  'minnesota': {
    name: 'Minnesota',
    abbreviation: 'MN',
    region: 'Upper Midwest',
    annualTruckDeaths: '70+',
    registeredTrucks: '100,000+',
    interstateHighways: ['I-35', 'I-94', 'I-90', 'I-494', 'I-694'],
    majorCorridors: [
      { name: 'Interstate 35', description: 'Primary north-south route through Minneapolis-St. Paul to Duluth' },
      { name: 'Interstate 94', description: 'Major east-west route from Wisconsin through Twin Cities to North Dakota' },
      { name: 'Interstate 90', description: 'Southern route across entire state' },
      { name: 'US Route 2', description: 'Northern route to Upper Peninsula region' }
    ],
    negligenceType: 'modified-51',
    solPersonalInjury: '6 Years',
    solWrongfulDeath: '3 Years',
    solPropertyDamage: '6 Years',
    primaryHazard: 'Extreme cold and winter storms',
    weatherMonths: ['October', 'November', 'December', 'January', 'February', 'March', 'April'],
    majorIndustries: ['Healthcare', 'Agriculture', 'Manufacturing', 'Technology', 'Retail'],
    courtDistrict: 'District of Minnesota',
    neighboringStates: ['wisconsin', 'iowa', 'south-dakota', 'north-dakota']
  },
  'mississippi': {
    name: 'Mississippi',
    abbreviation: 'MS',
    region: 'Deep South',
    annualTruckDeaths: '100+',
    registeredTrucks: '75,000+',
    interstateHighways: ['I-55', 'I-20', 'I-10', 'I-59', 'I-22'],
    majorCorridors: [
      { name: 'Interstate 55', description: 'Primary north-south route from Memphis to New Orleans' },
      { name: 'Interstate 20', description: 'East-west route through Jackson' },
      { name: 'Interstate 10', description: 'Southern coastal route through Biloxi' },
      { name: 'Interstate 22', description: 'Northeast route from Memphis to Birmingham' }
    ],
    negligenceType: 'pure',
    solPersonalInjury: '3 Years',
    solWrongfulDeath: '3 Years',
    solPropertyDamage: '3 Years',
    primaryHazard: 'Hurricanes and severe storms',
    weatherMonths: ['June', 'July', 'August', 'September', 'October'],
    majorIndustries: ['Agriculture', 'Manufacturing', 'Casinos', 'Shipbuilding', 'Forestry'],
    courtDistrict: 'Northern District of Mississippi / Southern District of Mississippi',
    neighboringStates: ['tennessee', 'alabama', 'louisiana', 'arkansas']
  },
  'missouri': {
    name: 'Missouri',
    abbreviation: 'MO',
    region: 'Midwest',
    annualTruckDeaths: '120+',
    registeredTrucks: '130,000+',
    interstateHighways: ['I-70', 'I-44', 'I-55', 'I-35', 'I-29'],
    majorCorridors: [
      { name: 'Interstate 70', description: 'Primary east-west route connecting Kansas City to St. Louis' },
      { name: 'Interstate 44', description: 'Southwest route from St. Louis to Oklahoma' },
      { name: 'Interstate 55', description: 'North-south route from Chicago through St. Louis to Memphis' },
      { name: 'Interstate 35', description: 'North-south route through Kansas City' }
    ],
    negligenceType: 'pure',
    solPersonalInjury: '5 Years',
    solWrongfulDeath: '3 Years',
    solPropertyDamage: '5 Years',
    primaryHazard: 'Tornadoes and ice storms',
    weatherMonths: ['March', 'April', 'May', 'November', 'December', 'January', 'February'],
    majorIndustries: ['Agriculture', 'Aerospace', 'Manufacturing', 'Healthcare', 'Transportation'],
    courtDistrict: 'Eastern District of Missouri / Western District of Missouri',
    neighboringStates: ['iowa', 'illinois', 'kentucky', 'tennessee', 'arkansas', 'oklahoma', 'kansas', 'nebraska']
  },
  'new-jersey': {
    name: 'New Jersey',
    abbreviation: 'NJ',
    region: 'Northeast',
    annualTruckDeaths: '100+',
    registeredTrucks: '90,000+',
    interstateHighways: ['I-95', 'I-78', 'I-80', 'I-287', 'I-295'],
    majorCorridors: [
      { name: 'New Jersey Turnpike (I-95)', description: 'Primary north-south toll route with heaviest truck traffic' },
      { name: 'Interstate 78', description: 'Route from Newark to Pennsylvania' },
      { name: 'Interstate 80', description: 'Major east-west route across northern New Jersey' },
      { name: 'Garden State Parkway', description: 'North-south route where trucks are restricted' }
    ],
    negligenceType: 'modified-51',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '6 Years',
    primaryHazard: 'Extreme congestion and winter weather',
    weatherMonths: ['December', 'January', 'February', 'March'],
    majorIndustries: ['Pharmaceuticals', 'Finance', 'Ports', 'Manufacturing', 'Technology'],
    courtDistrict: 'District of New Jersey',
    neighboringStates: ['new-york', 'pennsylvania', 'delaware']
  },
  'new-york': {
    name: 'New York',
    abbreviation: 'NY',
    region: 'Northeast',
    annualTruckDeaths: '180+',
    registeredTrucks: '175,000+',
    interstateHighways: ['I-87', 'I-90', 'I-95', 'I-81', 'I-86'],
    majorCorridors: [
      { name: 'Interstate 87 (NY Thruway)', description: 'Primary north-south route from NYC to Albany to Canada' },
      { name: 'Interstate 90 (NY Thruway)', description: 'Major east-west route from Albany to Buffalo' },
      { name: 'Interstate 95', description: 'NYC metro corridor connecting to New Jersey and Connecticut' },
      { name: 'Interstate 81', description: 'North-south route through Syracuse' }
    ],
    negligenceType: 'pure',
    solPersonalInjury: '3 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '3 Years',
    primaryHazard: 'NYC congestion and lake effect snow',
    weatherMonths: ['November', 'December', 'January', 'February', 'March', 'April'],
    majorIndustries: ['Finance', 'Media', 'Technology', 'Healthcare', 'Manufacturing'],
    courtDistrict: 'Northern/Southern/Eastern/Western District of New York',
    neighboringStates: ['vermont', 'massachusetts', 'connecticut', 'new-jersey', 'pennsylvania']
  },
  'north-carolina': {
    name: 'North Carolina',
    abbreviation: 'NC',
    region: 'Southeast',
    annualTruckDeaths: '180+',
    registeredTrucks: '160,000+',
    interstateHighways: ['I-40', 'I-85', 'I-95', 'I-77', 'I-26'],
    majorCorridors: [
      { name: 'Interstate 40', description: 'Major east-west route from Wilmington through Raleigh to Tennessee' },
      { name: 'Interstate 85', description: 'Southwest corridor through Charlotte' },
      { name: 'Interstate 95', description: 'Eastern coastal route through Fayetteville' },
      { name: 'Interstate 77', description: 'North-south route through Charlotte' }
    ],
    negligenceType: 'contributory',
    solPersonalInjury: '3 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '3 Years',
    primaryHazard: 'Hurricanes and mountain weather',
    weatherMonths: ['June', 'July', 'August', 'September', 'October', 'January', 'February'],
    majorIndustries: ['Banking', 'Technology', 'Pharmaceuticals', 'Agriculture', 'Manufacturing'],
    courtDistrict: 'Eastern/Middle/Western District of North Carolina',
    neighboringStates: ['virginia', 'tennessee', 'georgia', 'south-carolina']
  },
  'ohio': {
    name: 'Ohio',
    abbreviation: 'OH',
    region: 'Midwest',
    annualTruckDeaths: '180+',
    registeredTrucks: '200,000+',
    interstateHighways: ['I-70', 'I-71', 'I-75', 'I-77', 'I-80/90'],
    majorCorridors: [
      { name: 'Interstate 70', description: 'Major east-west route through Columbus to Indianapolis' },
      { name: 'Interstate 71', description: 'Route connecting Cleveland, Columbus, and Cincinnati' },
      { name: 'Interstate 75', description: 'Primary north-south route from Michigan to Kentucky' },
      { name: 'Ohio Turnpike (I-80/90)', description: 'Northern corridor connecting Pennsylvania to Indiana' }
    ],
    negligenceType: 'modified-51',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '2 Years',
    primaryHazard: 'Lake effect snow and winter weather',
    weatherMonths: ['November', 'December', 'January', 'February', 'March'],
    majorIndustries: ['Manufacturing', 'Healthcare', 'Agriculture', 'Finance', 'Logistics'],
    courtDistrict: 'Northern District of Ohio / Southern District of Ohio',
    neighboringStates: ['michigan', 'indiana', 'kentucky', 'west-virginia', 'pennsylvania']
  },
  'oklahoma': {
    name: 'Oklahoma',
    abbreviation: 'OK',
    region: 'South Central',
    annualTruckDeaths: '100+',
    registeredTrucks: '110,000+',
    interstateHighways: ['I-40', 'I-35', 'I-44'],
    majorCorridors: [
      { name: 'Interstate 40', description: 'Primary east-west transcontinental route through Oklahoma City' },
      { name: 'Interstate 35', description: 'Major north-south route from Kansas through Oklahoma City to Texas' },
      { name: 'Interstate 44 (Turner/Will Rogers Turnpike)', description: 'Route from Tulsa to Missouri and Texas' },
      { name: 'US Route 69', description: 'Eastern corridor through McAlester' }
    ],
    negligenceType: 'modified-51',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '2 Years',
    primaryHazard: 'Tornadoes and severe storms',
    weatherMonths: ['March', 'April', 'May', 'June', 'November'],
    majorIndustries: ['Oil and gas', 'Agriculture', 'Aerospace', 'Energy', 'Manufacturing'],
    courtDistrict: 'Northern/Eastern/Western District of Oklahoma',
    neighboringStates: ['kansas', 'missouri', 'arkansas', 'texas', 'new-mexico', 'colorado']
  },
  'oregon': {
    name: 'Oregon',
    abbreviation: 'OR',
    region: 'Pacific Northwest',
    annualTruckDeaths: '55+',
    registeredTrucks: '65,000+',
    interstateHighways: ['I-5', 'I-84', 'I-205'],
    majorCorridors: [
      { name: 'Interstate 5', description: 'Primary north-south route from California through Portland to Washington' },
      { name: 'Interstate 84', description: 'Major east-west route along Columbia River Gorge' },
      { name: 'US Route 101', description: 'Coastal route with challenging terrain' },
      { name: 'US Route 97', description: 'Eastern north-south route through Bend' }
    ],
    negligenceType: 'modified-51',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '3 Years',
    solPropertyDamage: '6 Years',
    primaryHazard: 'Rain, fog, and mountain passes',
    weatherMonths: ['October', 'November', 'December', 'January', 'February', 'March'],
    majorIndustries: ['Technology', 'Agriculture', 'Forestry', 'Manufacturing', 'Tourism'],
    courtDistrict: 'District of Oregon',
    neighboringStates: ['washington', 'idaho', 'nevada', 'california']
  },
  'pennsylvania': {
    name: 'Pennsylvania',
    abbreviation: 'PA',
    region: 'Northeast',
    annualTruckDeaths: '180+',
    registeredTrucks: '200,000+',
    interstateHighways: ['I-76', 'I-80', 'I-81', 'I-78', 'I-95'],
    majorCorridors: [
      { name: 'Pennsylvania Turnpike (I-76/I-70)', description: 'Major east-west toll route across entire state' },
      { name: 'Interstate 80', description: 'Northern east-west route through mountainous terrain' },
      { name: 'Interstate 81', description: 'Major trucking corridor through Harrisburg to New York' },
      { name: 'Interstate 95', description: 'Eastern route through Philadelphia' }
    ],
    negligenceType: 'modified-51',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '2 Years',
    primaryHazard: 'Mountain terrain and winter weather',
    weatherMonths: ['November', 'December', 'January', 'February', 'March'],
    majorIndustries: ['Healthcare', 'Manufacturing', 'Technology', 'Energy', 'Agriculture'],
    courtDistrict: 'Eastern/Middle/Western District of Pennsylvania',
    neighboringStates: ['new-york', 'new-jersey', 'delaware', 'maryland', 'west-virginia', 'ohio']
  },
  'south-carolina': {
    name: 'South Carolina',
    abbreviation: 'SC',
    region: 'Southeast',
    annualTruckDeaths: '120+',
    registeredTrucks: '85,000+',
    interstateHighways: ['I-95', 'I-26', 'I-85', 'I-77', 'I-20'],
    majorCorridors: [
      { name: 'Interstate 95', description: 'Eastern corridor from North Carolina to Georgia' },
      { name: 'Interstate 26', description: 'Route from Charleston through Columbia to I-85' },
      { name: 'Interstate 85', description: 'Northwest corridor through Greenville-Spartanburg' },
      { name: 'Interstate 77', description: 'Route from Charlotte to Columbia' }
    ],
    negligenceType: 'modified-51',
    solPersonalInjury: '3 Years',
    solWrongfulDeath: '3 Years',
    solPropertyDamage: '3 Years',
    primaryHazard: 'Hurricanes and flooding',
    weatherMonths: ['June', 'July', 'August', 'September', 'October'],
    majorIndustries: ['Automotive', 'Tourism', 'Aerospace', 'Ports', 'Manufacturing'],
    courtDistrict: 'District of South Carolina',
    neighboringStates: ['north-carolina', 'georgia']
  },
  'tennessee': {
    name: 'Tennessee',
    abbreviation: 'TN',
    region: 'Southeast',
    annualTruckDeaths: '170+',
    registeredTrucks: '150,000+',
    interstateHighways: ['I-40', 'I-65', 'I-75', 'I-24', 'I-81'],
    majorCorridors: [
      { name: 'Interstate 40', description: 'Major east-west route from Memphis through Nashville to Knoxville' },
      { name: 'Interstate 65', description: 'North-south route through Nashville' },
      { name: 'Interstate 75', description: 'Eastern route through Knoxville and Chattanooga' },
      { name: 'Interstate 24', description: 'Southeast route from Nashville to Chattanooga' }
    ],
    negligenceType: 'modified-50',
    solPersonalInjury: '1 Year',
    solWrongfulDeath: '1 Year',
    solPropertyDamage: '3 Years',
    primaryHazard: 'Severe storms and mountain fog',
    weatherMonths: ['March', 'April', 'May', 'November', 'December', 'January', 'February'],
    majorIndustries: ['Healthcare', 'Automotive', 'Music/Entertainment', 'Logistics', 'Manufacturing'],
    courtDistrict: 'Eastern/Middle/Western District of Tennessee',
    neighboringStates: ['kentucky', 'virginia', 'north-carolina', 'georgia', 'alabama', 'mississippi', 'arkansas', 'missouri']
  },
  'texas': {
    name: 'Texas',
    abbreviation: 'TX',
    region: 'South Central',
    annualTruckDeaths: '700+',
    registeredTrucks: '600,000+',
    interstateHighways: ['I-10', 'I-20', 'I-35', 'I-45', 'I-30', 'I-40'],
    majorCorridors: [
      { name: 'Interstate 10', description: 'Primary east-west route from El Paso through San Antonio and Houston to Louisiana' },
      { name: 'Interstate 35', description: 'Major NAFTA corridor from Laredo through Austin and Dallas to Oklahoma' },
      { name: 'Interstate 45', description: 'Route connecting Dallas to Houston and Galveston' },
      { name: 'Interstate 20', description: 'Southern east-west route through Midland/Odessa oil country' }
    ],
    negligenceType: 'modified-51',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '2 Years',
    primaryHazard: 'Extreme distances and diverse weather',
    weatherMonths: ['June', 'July', 'August', 'September', 'October', 'December', 'January', 'February'],
    majorIndustries: ['Oil and gas', 'Technology', 'Agriculture', 'Aerospace', 'Manufacturing'],
    courtDistrict: 'Northern/Southern/Eastern/Western District of Texas',
    neighboringStates: ['oklahoma', 'arkansas', 'louisiana', 'new-mexico']
  },
  'utah': {
    name: 'Utah',
    abbreviation: 'UT',
    region: 'Mountain West',
    annualTruckDeaths: '40+',
    registeredTrucks: '50,000+',
    interstateHighways: ['I-15', 'I-80', 'I-70', 'I-84'],
    majorCorridors: [
      { name: 'Interstate 15', description: 'Primary north-south route from Idaho through Salt Lake City to Arizona' },
      { name: 'Interstate 80', description: 'Major east-west route from Nevada through Salt Lake City to Wyoming' },
      { name: 'Interstate 70', description: 'Scenic route through central Utah connecting to Colorado' },
      { name: 'Interstate 84', description: 'Northwest route connecting to Idaho and Oregon' }
    ],
    negligenceType: 'modified-50',
    solPersonalInjury: '4 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '3 Years',
    primaryHazard: 'Mountain passes and winter weather',
    weatherMonths: ['November', 'December', 'January', 'February', 'March', 'April'],
    majorIndustries: ['Technology', 'Tourism', 'Mining', 'Aerospace', 'Healthcare'],
    courtDistrict: 'District of Utah',
    neighboringStates: ['idaho', 'wyoming', 'colorado', 'new-mexico', 'arizona', 'nevada']
  },
  'virginia': {
    name: 'Virginia',
    abbreviation: 'VA',
    region: 'Mid-Atlantic',
    annualTruckDeaths: '110+',
    registeredTrucks: '100,000+',
    interstateHighways: ['I-95', 'I-64', 'I-81', 'I-77', 'I-66'],
    majorCorridors: [
      { name: 'Interstate 95', description: 'Primary Northeast corridor through Richmond and Northern Virginia' },
      { name: 'Interstate 81', description: 'Major trucking route through Shenandoah Valley' },
      { name: 'Interstate 64', description: 'East-west route from Hampton Roads to West Virginia' },
      { name: 'Interstate 66', description: 'Northern Virginia route to Washington DC' }
    ],
    negligenceType: 'contributory',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '5 Years',
    primaryHazard: 'DC congestion and mountain weather',
    weatherMonths: ['December', 'January', 'February', 'March'],
    majorIndustries: ['Government', 'Defense', 'Technology', 'Ports', 'Agriculture'],
    courtDistrict: 'Eastern District of Virginia / Western District of Virginia',
    neighboringStates: ['maryland', 'west-virginia', 'kentucky', 'tennessee', 'north-carolina']
  },
  'washington': {
    name: 'Washington',
    abbreviation: 'WA',
    region: 'Pacific Northwest',
    annualTruckDeaths: '75+',
    registeredTrucks: '95,000+',
    interstateHighways: ['I-5', 'I-90', 'I-82', 'I-405'],
    majorCorridors: [
      { name: 'Interstate 5', description: 'Primary north-south route from Oregon through Seattle to Canada' },
      { name: 'Interstate 90', description: 'Major east-west route from Seattle over Snoqualmie Pass to Spokane' },
      { name: 'Interstate 82', description: 'Route connecting Ellensburg to Tri-Cities and Oregon' },
      { name: 'US Route 97', description: 'Eastern north-south route through Yakima' }
    ],
    negligenceType: 'pure',
    solPersonalInjury: '3 Years',
    solWrongfulDeath: '3 Years',
    solPropertyDamage: '3 Years',
    primaryHazard: 'Mountain passes and rain',
    weatherMonths: ['October', 'November', 'December', 'January', 'February', 'March'],
    majorIndustries: ['Technology', 'Aerospace', 'Agriculture', 'Ports', 'Manufacturing'],
    courtDistrict: 'Eastern District of Washington / Western District of Washington',
    neighboringStates: ['oregon', 'idaho']
  },
  'west-virginia': {
    name: 'West Virginia',
    abbreviation: 'WV',
    region: 'Mid-Atlantic',
    annualTruckDeaths: '55+',
    registeredTrucks: '40,000+',
    interstateHighways: ['I-64', 'I-77', 'I-79', 'I-81', 'I-68'],
    majorCorridors: [
      { name: 'Interstate 77', description: 'Primary north-south route through Charleston' },
      { name: 'Interstate 64', description: 'East-west route through Charleston' },
      { name: 'Interstate 79', description: 'Route from Charleston to Morgantown' },
      { name: 'Interstate 81', description: 'Eastern Panhandle corridor' }
    ],
    negligenceType: 'modified-50',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '2 Years',
    primaryHazard: 'Mountain terrain and winter weather',
    weatherMonths: ['November', 'December', 'January', 'February', 'March'],
    majorIndustries: ['Coal', 'Natural gas', 'Healthcare', 'Tourism', 'Manufacturing'],
    courtDistrict: 'Northern District of West Virginia / Southern District of West Virginia',
    neighboringStates: ['pennsylvania', 'maryland', 'virginia', 'kentucky', 'ohio']
  },
  'wisconsin': {
    name: 'Wisconsin',
    abbreviation: 'WI',
    region: 'Upper Midwest',
    annualTruckDeaths: '80+',
    registeredTrucks: '100,000+',
    interstateHighways: ['I-94', 'I-90', 'I-43', 'I-39'],
    majorCorridors: [
      { name: 'Interstate 94', description: 'Primary route from Minneapolis through Madison and Milwaukee to Chicago' },
      { name: 'Interstate 90', description: 'Southern route from La Crosse to Rockford' },
      { name: 'Interstate 43', description: 'Eastern route from Milwaukee to Green Bay' },
      { name: 'Interstate 39', description: 'Central corridor from Rockford to Wausau' }
    ],
    negligenceType: 'modified-51',
    solPersonalInjury: '3 Years',
    solWrongfulDeath: '3 Years',
    solPropertyDamage: '6 Years',
    primaryHazard: 'Severe winter weather and lake effect snow',
    weatherMonths: ['November', 'December', 'January', 'February', 'March', 'April'],
    majorIndustries: ['Dairy', 'Manufacturing', 'Paper', 'Healthcare', 'Technology'],
    courtDistrict: 'Eastern District of Wisconsin / Western District of Wisconsin',
    neighboringStates: ['michigan', 'illinois', 'iowa', 'minnesota']
  }
};

function generateEnhancedContent(stateSlug: string): string {
  const data = STATE_DATA[stateSlug];
  if (!data) {
    throw new Error(`No data found for state: ${stateSlug}`);
  }

  const negligenceLabel = {
    'pure': 'pure comparative negligence',
    'modified-50': 'modified comparative negligence with a 50% bar',
    'modified-51': 'modified comparative negligence with a 51% bar',
    'contributory': 'contributory negligence'
  }[data.negligenceType];

  const negligenceRecovery = {
    'pure': 'You can recover damages even if you are 99% at fault, though your recovery is reduced by your percentage of fault.',
    'modified-50': 'You can recover damages if you are 49% or less at fault, but recovery is barred if you are 50% or more at fault.',
    'modified-51': 'You can recover damages if you are 50% or less at fault, but recovery is barred if you are 51% or more at fault.',
    'contributory': 'If you are found even 1% at fault, you may be completely barred from recovery under the traditional rule.'
  }[data.negligenceType];

  const corridorContent = data.majorCorridors.map(c => `
    {
      name: '${c.name}',
      description: \`${c.name} serves as a critical trucking corridor in ${data.name}. ${c.description}. Commercial trucks traveling this route face unique challenges including variable weather conditions, terrain changes, and mixing with local traffic. ${data.name} State Patrol conducts regular enforcement operations along this corridor, and truck accidents here often involve complex liability determinations due to the mix of interstate and local carriers. The combination of heavy truck volumes and ${data.primaryHazard.toLowerCase()} makes this route particularly hazardous during ${data.weatherMonths.slice(0, 3).join(', ')}.\`
    }`).join(',');

  const truckingLawsContent = `
    {
      title: '${data.name} Commercial Vehicle Regulations',
      description: \`${data.name} regulates commercial vehicles under state statutes enforced by the ${data.name} State Patrol and Department of Transportation. The state maintains strict size and weight limits for commercial vehicles, with maximum gross vehicle weight of 80,000 pounds on interstate highways. Oversize and overweight permits are required for loads exceeding standard limits, with specific routing requirements and escort obligations. ${data.name} participates in the International Registration Plan (IRP) and International Fuel Tax Agreement (IFTA), requiring proper registration for carriers operating across state lines. Violations of commercial vehicle regulations can establish negligence in truck accident cases.\`
    },
    {
      title: '${data.name} Hours of Service Enforcement',
      description: \`${data.name} actively enforces federal Hours of Service regulations through the ${data.name} State Patrol. Officers conduct roadside inspections at weigh stations and portable inspection sites throughout the state. The state participates in FMCSA's Compliance, Safety, Accountability (CSA) program, documenting violations in the federal database. ${data.name} also conducts targeted enforcement operations during high-traffic periods and along major freight corridors. Carriers with poor safety ratings face increased inspection rates when operating in ${data.name}.\`
    },
    {
      title: '${data.name} Commercial Driver License Requirements',
      description: \`The ${data.name} Department of Motor Vehicles issues Commercial Driver's Licenses under federal standards with state-specific requirements. Drivers must pass written knowledge tests covering general commercial vehicle operation, air brakes, and any endorsements sought. Skills testing includes pre-trip inspection, basic control maneuvers, and on-road driving. ${data.name} maintains driver records and can disqualify drivers for violations including DUI, leaving the scene of an accident, or using a commercial vehicle in the commission of a felony. Medical certification requirements must be met and maintained.\`
    },
    {
      title: '${data.name} Drug and Alcohol Testing',
      description: \`${data.name} enforces federal drug and alcohol testing requirements for commercial drivers and has additional state laws prohibiting impaired commercial driving. ${data.name} DUI laws apply to commercial drivers with a lower BAC threshold of 0.04%. Pre-employment, random, post-accident, reasonable suspicion, return-to-duty, and follow-up testing are all required. The state maintains a Drug and Alcohol Clearinghouse participation requirement, and employers must query the clearinghouse before hiring. Refusal to submit to testing results in license disqualification.\`
    },
    {
      title: '${data.name} Motor Carrier Insurance Requirements',
      description: \`Motor carriers operating in ${data.name} must maintain minimum levels of liability insurance as required by federal and state law. For-hire carriers transporting general freight must carry at least $750,000 in liability coverage. Carriers transporting hazardous materials face higher requirements up to $5,000,000 depending on the materials carried. ${data.name} requires proof of insurance for vehicle registration and operating authority. Carriers must file proof of financial responsibility with the state. Self-insurance is permitted for carriers meeting strict financial requirements.\`
    },
    {
      title: '${data.name} Vehicle Inspection Requirements',
      description: \`${data.name} requires annual safety inspections for commercial vehicles registered in the state. The ${data.name} State Patrol conducts roadside inspections using federal CVSA criteria. Drivers must perform and document pre-trip and post-trip inspections daily. Driver Vehicle Inspection Reports (DVIRs) must note any defects or deficiencies. Carriers must repair or document repairs for reported defects before the vehicle returns to service. Out-of-service violations result in the vehicle being immediately removed from operation until repairs are completed.\`
    }`;

  const faqsContent = `
    {
      question: 'What is the statute of limitations for truck accident cases in ${data.name}?',
      answer: '${data.name} has a ${data.solPersonalInjury.toLowerCase()} statute of limitations for personal injury claims and ${data.solWrongfulDeath.toLowerCase()} for wrongful death claims from truck accidents. This means you must file your lawsuit within ${data.solPersonalInjury.toLowerCase()} of the accident date for personal injury or ${data.solWrongfulDeath.toLowerCase()} of the death for wrongful death. Missing this deadline typically bars your claim forever, regardless of how serious your injuries are. Property damage claims have a ${data.solPropertyDamage.toLowerCase()} deadline. It is important to contact an attorney promptly after any serious truck accident to ensure your rights are protected and evidence is preserved.'
    },
    {
      question: 'Can I still recover damages if I was partially at fault for a ${data.name} truck accident?',
      answer: '${data.name} follows ${negligenceLabel}. ${negligenceRecovery} For example, if you suffered $1,000,000 in damages but were found 20% at fault, your recovery would be reduced to $800,000. This makes establishing the trucking company\\'s primary fault critical in contested cases. Insurance adjusters often try to shift blame to accident victims to reduce or eliminate their responsibility. An experienced ${data.name} truck accident lawyer knows how to counter these tactics and prove the truck driver and carrier were primarily at fault through evidence including electronic logging device data, driver qualification files, and maintenance records.'
    },
    {
      question: 'What damages can I recover in a ${data.name} truck accident case?',
      answer: '${data.name} allows recovery of both economic damages (medical expenses, lost wages, property damage, future medical costs, lost earning capacity) and non-economic damages (pain and suffering, mental anguish, loss of enjoyment of life, loss of consortium). Economic damages compensate for actual financial losses and are typically proven through medical bills, wage statements, and expert testimony about future costs. Non-economic damages compensate for intangible losses and vary based on injury severity and impact on daily life. Punitive damages may be available in cases involving gross negligence, reckless conduct, or intentional misconduct by the trucking company or driver.'
    },
    {
      question: 'How long do trucking companies have to keep records in ${data.name}?',
      answer: 'Federal regulations require trucking companies to retain driver qualification files for three years after employment ends, hours of service records for six months, vehicle maintenance records for one year plus the time the equipment is in use, and accident registers for three years. However, companies often destroy records as soon as legally permitted—sometimes even sooner. This is why prompt legal action after a truck accident is critical. An experienced ${data.name} truck accident attorney can send preservation letters requiring the trucking company to retain all evidence related to your case, preventing destruction of potentially crucial evidence.'
    },
    {
      question: 'What evidence is important in a ${data.name} truck accident case?',
      answer: 'Critical evidence in ${data.name} truck accident cases includes electronic logging device (ELD) data showing driver hours and rest periods, the truck\\'s electronic control module (ECM) or black box data capturing speed, braking, and other operational parameters, driver qualification files showing training and driving history, maintenance records revealing any deferred repairs or safety issues, dispatch records showing pressure to meet delivery deadlines, toxicology results from post-accident drug and alcohol testing, and the carrier\\'s safety rating and inspection history from FMCSA databases. Physical evidence from the scene, witness statements, and surveillance or dashcam video are also valuable. Time is critical—much of this evidence can be legally destroyed or overwritten if not preserved quickly.'
    },
    {
      question: 'Can I sue an out-of-state trucking company for a ${data.name} accident?',
      answer: 'Yes. If a truck accident occurs in ${data.name}, ${data.name} courts generally have jurisdiction over the case regardless of where the trucking company is headquartered. The company, by operating on ${data.name} highways, subjects itself to ${data.name} jurisdiction. Your case may be filed in ${data.name} state court or in federal court (the ${data.courtDistrict}). Federal court may be appropriate when the case involves parties from different states and the amount in controversy exceeds $75,000. Your attorney can advise on the best venue for your specific situation based on factors including the defendant\\'s location, available evidence, and local court practices.'
    },
    {
      question: 'What if the truck driver who caused my accident was an independent contractor?',
      answer: 'Trucking companies often try to avoid liability by classifying drivers as independent contractors rather than employees. However, ${data.name} courts look at the actual relationship—not just what the contract says—to determine whether the trucking company controlled the driver\\'s work. Even with true independent contractors, the trucking company may be liable under theories including negligent hiring (failing to properly screen the driver), negligent supervision (failing to ensure compliance with safety regulations), or negligent entrustment (allowing an unqualified driver to operate the truck). The motor carrier may also be directly liable for violations of federal safety regulations that apply regardless of driver classification.'
    }`;

  const currentDate = new Date().toISOString().split('T')[0];

  return `import { StateContent } from './types';

/**
 * ${data.name} - Truck Accident Information
 *
 * Annual Truck Accident Deaths: ${data.annualTruckDeaths}
 * Registered Commercial Trucks: ${data.registeredTrucks}
 * Major Interstates: ${data.interstateHighways.length > 0 ? data.interstateHighways.join(', ') : 'None (Alaska Highway system)'}
 *
 * Enhanced by State Enhancement Agent v1.0.0
 * Last Updated: ${new Date().toISOString()}
 */

export const ${stateSlug.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}: StateContent = {
  slug: '${stateSlug}',
  name: '${data.name}',
  abbreviation: '${data.abbreviation}',
  h1: '${data.name} Truck Injury Lawyers',
  metaTitle: '${data.name} Truck Accident Lawyers | 18-Wheeler Attorneys in ${data.abbreviation}',
  metaDescription: 'Injured in a ${data.name} truck accident? Our attorneys fight for victims across ${data.name}. Free consultation. No fee unless you win.',

  heroText: \`${data.name} presents unique challenges for commercial trucking operations and significant risks for motorists sharing the roads with 18-wheelers. With ${data.annualTruckDeaths} people killed annually in collisions involving large trucks, ${data.name} sees its share of devastating commercial vehicle accidents. The state's ${data.registeredTrucks} registered commercial trucks operate on highways that face ${data.primaryHazard.toLowerCase()}, creating conditions that contribute to serious and fatal crashes.

The ${data.name} trucking industry serves critical economic functions. ${data.majorIndustries.join(', ')} all depend heavily on reliable freight transportation. Major trucking corridors including ${data.majorCorridors.map(c => c.name).join(', ')} carry commercial traffic through diverse terrain and weather conditions. Both local delivery operations and long-haul carriers traverse these routes daily, creating ongoing accident risks for ${data.name} motorists.

${data.name} follows ${negligenceLabel} for personal injury cases. ${negligenceRecovery} The state has a ${data.solPersonalInjury.toLowerCase()} statute of limitations for personal injury claims, meaning you must file suit within ${data.solPersonalInjury.toLowerCase()} of the accident. Missing this deadline typically bars your claim forever, regardless of injury severity.

Weather plays a significant role in ${data.name} truck accidents. During ${data.weatherMonths.join(', ')}, ${data.primaryHazard.toLowerCase()} creates particularly hazardous conditions for commercial vehicles. Large trucks require significantly longer stopping distances than passenger vehicles, and challenging conditions magnify this disadvantage. When trucking companies pressure drivers to maintain schedules despite dangerous conditions, preventable accidents occur.

If you have been injured in a ${data.name} truck accident, time is critical. Trucking companies dispatch investigation teams immediately after serious crashes to protect their interests. Evidence including electronic logging device data, driver records, and maintenance logs may be overwritten or destroyed if not preserved quickly. Our ${data.name} truck accident lawyers know how to preserve evidence, investigate thoroughly, and hold negligent carriers accountable under both federal FMCSA regulations and ${data.name} state law.\`,

  truckingLaws: [${truckingLawsContent}
  ],

  corridors: [${corridorContent}
  ],

  negligenceRule: {
    type: '${data.negligenceType}',
    description: '${data.name} follows ${negligenceLabel}. ${negligenceRecovery}',
    details: \`Under ${data.name} law, your damages are reduced by your percentage of fault${data.negligenceType.includes('modified') ? `, and recovery is barred if you exceed the threshold` : ''}. For example, if you suffered $1,000,000 in damages but were 30% at fault, you could recover $700,000. ${data.negligenceType === 'modified-51' ? 'However, if a jury finds you 51% or more responsible for the accident, you recover nothing.' : data.negligenceType === 'modified-50' ? 'However, if a jury finds you 50% or more responsible for the accident, you recover nothing.' : 'Even at high percentages of fault, you maintain the right to recover reduced damages.'}

This rule makes establishing the trucking company's greater fault critical in contested cases. Insurance adjusters often try to shift blame to victims to reduce or eliminate their responsibility. They may claim you were speeding, failed to yield, or were distracted—anything to increase your percentage of fault. An experienced ${data.name} truck accident lawyer knows how to counter these tactics through thorough investigation and evidence preservation.

Electronic logging device data, driver qualification files, maintenance records, and the carrier's safety history all help establish the trucking company's negligence. Federal Motor Carrier Safety Administration regulations set minimum standards, and violations frequently appear in accident investigations. When carriers cut corners on safety to increase profits, ${data.name} law holds them accountable.\`
  },

  statuteOfLimitations: {
    personalInjury: '${data.solPersonalInjury}',
    wrongfulDeath: '${data.solWrongfulDeath}',
    propertyDamage: '${data.solPropertyDamage}',
    details: \`${data.name} has a ${data.solPersonalInjury.toLowerCase()} statute of limitations for personal injury claims and ${data.solWrongfulDeath.toLowerCase()} for wrongful death claims. Property damage claims must be filed within ${data.solPropertyDamage.toLowerCase()}. These deadlines are strictly enforced—missing the deadline by even one day typically bars your claim forever, regardless of how serious your injuries are or how clear the trucking company's fault.

The deadline may be extended in limited circumstances, such as when the victim was a minor or legally incapacitated at the time of the accident. However, waiting to file is always risky. Evidence disappears, witnesses move or forget details, and trucking companies may legally destroy records after federal retention periods expire.

Beyond the legal deadline, practical considerations favor prompt action. Electronic logging device data may be overwritten. Driver employment records become harder to obtain. Witnesses' memories fade. Physical evidence from the scene is cleaned up or altered. The sooner your attorney can investigate and preserve evidence, the stronger your case will be.

Contact an attorney promptly after any serious ${data.name} truck accident to protect your rights and ensure critical evidence is preserved before it is lost or destroyed.\`
  },

  statistics: [
    { label: 'Annual Truck Accident Deaths', value: '${data.annualTruckDeaths}' },
    { label: 'Registered Commercial Trucks', value: '${data.registeredTrucks}' },
    { label: 'Major Interstate Highways', value: '${data.interstateHighways.length > 0 ? data.interstateHighways.join(', ') : 'State Highway System'}' },
    { label: 'Primary Weather Hazard', value: '${data.primaryHazard}' }
  ],

  courtInfo: \`Truck accident cases in ${data.name} may be filed in state courts or federal courts depending on the parties involved and amounts in controversy. ${data.name} state courts follow state procedural rules and apply ${data.name} substantive law. The ${data.courtDistrict} federal court handles cases involving diversity jurisdiction (parties from different states with amounts exceeding $75,000) or federal questions.

${data.name} state courts offer multiple venues depending on where the accident occurred and where defendants are located. Generally, cases may be filed where the accident occurred, where the defendant resides or has its principal office, or where a substantial part of the events giving rise to the claim occurred. Choosing the right venue can impact case outcomes based on local jury pools and judicial tendencies.

Both state and federal courts in ${data.name} allow broad discovery in trucking cases. This includes depositions of company representatives, production of driver qualification files and safety records, and inspection of vehicles and maintenance facilities. Electronic data from trucks' black boxes and ELD systems can be obtained through proper discovery procedures.

${data.name} does not cap economic damages in personal injury cases, allowing full recovery of medical expenses, lost wages, future medical costs, and other financial losses. Non-economic damages (pain and suffering) may be subject to certain limitations depending on the circumstances. Punitive damages are available in cases involving egregious misconduct, though caps may apply.\`,

  lastUpdated: '${currentDate}',

  whyHireLocal: \`${data.name} truck accident cases require attorneys who understand both federal FMCSA regulations and the nuances of ${data.name} state law. Local counsel knows the ${data.name} court system, local procedures, and the judges who will hear your case. They understand how ${data.name} juries evaluate trucking company negligence and what evidence resonates with local fact-finders.

${data.name} presents unique challenges for truck accident litigation. The state's ${data.primaryHazard.toLowerCase()} creates specific hazards that experienced local attorneys understand. They know the dangerous corridors, common accident patterns, and the trucking companies that frequently operate in the state.

Local attorneys also have established relationships with accident reconstruction experts, medical professionals, and investigators familiar with ${data.name} conditions. They can quickly deploy resources to preserve evidence before it disappears. Time-zone convenience and proximity to accident scenes enable rapid response when needed.

The trucking industry has significant resources and experienced defense counsel. Insurance companies defending trucking claims employ aggressive tactics to minimize or deny claims. You need representation that matches their resources and knows how to counter their strategies effectively.

A ${data.name}-licensed attorney ensures your case proceeds properly through the ${data.name} legal system. From filing requirements to discovery deadlines to trial procedures, local knowledge prevents costly procedural errors that could jeopardize your claim.\`,

  faqs: [${faqsContent}
  ],

  neighboringStates: [${data.neighboringStates.map(s => `'${s}'`).join(', ')}]
};
`;
}

async function enhanceState(stateSlug: string): Promise<void> {
  console.log(`Enhancing ${stateSlug}...`);

  const content = generateEnhancedContent(stateSlug);
  const outputPath = path.join(STATES_DIR, `${stateSlug}.ts`);

  fs.writeFileSync(outputPath, content);

  // Count words
  const wordCount = content.split(/\s+/).length;
  console.log(`  Written ${outputPath} (${wordCount} words)`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.includes('--all-thin')) {
    console.log(`Enhancing ${THIN_STATES.length} thin state pages...\\n`);

    for (const state of THIN_STATES) {
      await enhanceState(state);
    }

    console.log(`\\nDone! Enhanced ${THIN_STATES.length} state pages.`);
  } else if (args.length === 1) {
    const stateSlug = args[0];
    if (!THIN_STATES.includes(stateSlug) && !STATE_DATA[stateSlug]) {
      console.error(`Unknown state: ${stateSlug}`);
      process.exit(1);
    }
    await enhanceState(stateSlug);
  } else {
    console.log('Usage:');
    console.log('  npx tsx scripts/agents/state-enhancer.ts alaska');
    console.log('  npx tsx scripts/agents/state-enhancer.ts --all-thin');
    process.exit(1);
  }
}

main().catch(console.error);
