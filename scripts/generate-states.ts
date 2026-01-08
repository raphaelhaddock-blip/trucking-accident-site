// Script to generate state content files
// Run with: npx tsx scripts/generate-states.ts

import * as fs from 'fs';
import * as path from 'path';

interface StateData {
  slug: string;
  name: string;
  abbreviation: string;
  negligenceType: 'pure' | 'modified-50' | 'modified-51' | 'contributory';
  solPersonalInjury: string;
  solWrongfulDeath: string;
  solPropertyDamage: string;
  corridors: { name: string; description: string }[];
  neighbors: string[];
  annualDeaths: string;
  registeredTrucks: string;
  interstateHwyMiles: string;
  keyFact: string;
}

// State data with accurate legal information
const statesData: StateData[] = [
  // Tier 2
  {
    slug: 'michigan',
    name: 'Michigan',
    abbreviation: 'MI',
    negligenceType: 'modified-51',
    solPersonalInjury: '3 Years',
    solWrongfulDeath: '3 Years',
    solPropertyDamage: '3 Years',
    corridors: [
      { name: 'Interstate 94 (I-94)', description: 'Major east-west corridor connecting Detroit to Chicago through southwestern Michigan, carrying heavy freight between the industrial Midwest and East Coast markets.' },
      { name: 'Interstate 75 (I-75)', description: 'North-south route from the Ohio border through Detroit and into northern Michigan, serving as a crucial link for Canadian trade through the Ambassador Bridge and Detroit-Windsor Tunnel.' },
      { name: 'Interstate 96 (I-96)', description: 'Connects Grand Rapids to Detroit, carrying significant freight between western Michigan manufacturing centers and the Detroit metro area.' },
      { name: 'Interstate 69 (I-69)', description: 'Part of the international trade corridor connecting Canada through Michigan to Indiana and beyond, carrying cross-border freight traffic.' }
    ],
    neighbors: ['ohio', 'indiana', 'wisconsin'],
    annualDeaths: '150+',
    registeredTrucks: '180,000+',
    interstateHwyMiles: '1,243',
    keyFact: 'Ambassador Bridge Crossings Daily: 8,000+'
  },
  {
    slug: 'new-york',
    name: 'New York',
    abbreviation: 'NY',
    negligenceType: 'pure',
    solPersonalInjury: '3 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '3 Years',
    corridors: [
      { name: 'Interstate 87 (I-87/NY Thruway)', description: 'Major north-south corridor from New York City through Albany to the Canadian border, carrying freight between NYC ports and upstate manufacturing.' },
      { name: 'Interstate 90 (I-90/NY Thruway)', description: 'East-west route crossing the entire state from Massachusetts to Pennsylvania, connecting Buffalo, Rochester, Syracuse, and Albany.' },
      { name: 'Interstate 95 (I-95)', description: 'Critical northeast corridor through New York City and the metropolitan area, one of the busiest trucking routes in the nation.' },
      { name: 'Interstate 81 (I-81)', description: 'North-south route through central New York connecting Pennsylvania to Canada, heavily used for cross-border freight.' }
    ],
    neighbors: ['pennsylvania', 'new-jersey', 'connecticut', 'massachusetts', 'vermont'],
    annualDeaths: '140+',
    registeredTrucks: '220,000+',
    interstateHwyMiles: '1,674',
    keyFact: 'Port of NY/NJ Container Traffic: 7M+ TEUs'
  },
  {
    slug: 'arizona',
    name: 'Arizona',
    abbreviation: 'AZ',
    negligenceType: 'pure',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '2 Years',
    corridors: [
      { name: 'Interstate 10 (I-10)', description: 'Major east-west corridor crossing southern Arizona from California to New Mexico, carrying massive freight volumes between Los Angeles and the Southwest.' },
      { name: 'Interstate 40 (I-40)', description: 'Northern Arizona east-west route connecting California to New Mexico, parallel to historic Route 66 and heavily used for cross-country freight.' },
      { name: 'Interstate 17 (I-17)', description: 'North-south route connecting Phoenix to Flagstaff, linking I-10 and I-40 and serving as Arizona\'s primary internal freight corridor.' },
      { name: 'Interstate 8 (I-8)', description: 'Southern route from San Diego to I-10 near Casa Grande, carrying freight from California ports to Arizona distribution centers.' }
    ],
    neighbors: ['california', 'nevada', 'utah', 'colorado', 'new-mexico'],
    annualDeaths: '130+',
    registeredTrucks: '95,000+',
    interstateHwyMiles: '1,168',
    keyFact: 'Mexican Border Crossings: 5,000+ daily'
  },
  {
    slug: 'missouri',
    name: 'Missouri',
    abbreviation: 'MO',
    negligenceType: 'pure',
    solPersonalInjury: '5 Years',
    solWrongfulDeath: '3 Years',
    solPropertyDamage: '5 Years',
    corridors: [
      { name: 'Interstate 70 (I-70)', description: 'Major east-west corridor crossing Missouri from Kansas City through Columbia and St. Louis, connecting the Midwest to both coasts.' },
      { name: 'Interstate 44 (I-44)', description: 'Diagonal route from St. Louis southwest through Springfield to Oklahoma, following historic Route 66.' },
      { name: 'Interstate 55 (I-55)', description: 'North-south corridor from St. Louis to Memphis, carrying heavy Mississippi River valley freight traffic.' },
      { name: 'Interstate 29 (I-29)', description: 'Western Missouri north-south route from Kansas City to the Iowa border, serving agricultural freight from the Great Plains.' }
    ],
    neighbors: ['iowa', 'illinois', 'kentucky', 'tennessee', 'arkansas', 'oklahoma', 'kansas', 'nebraska'],
    annualDeaths: '120+',
    registeredTrucks: '140,000+',
    interstateHwyMiles: '1,379',
    keyFact: 'Central US Crossroads Position'
  },
  {
    slug: 'alabama',
    name: 'Alabama',
    abbreviation: 'AL',
    negligenceType: 'contributory',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '6 Years',
    corridors: [
      { name: 'Interstate 65 (I-65)', description: 'North-south corridor from the Tennessee border through Birmingham and Montgomery to Mobile, serving as Alabama\'s primary freight artery.' },
      { name: 'Interstate 20 (I-20)', description: 'East-west route through Birmingham connecting Atlanta to Mississippi, heavily used for cross-country freight.' },
      { name: 'Interstate 10 (I-10)', description: 'Southern route along the Gulf Coast through Mobile, connecting Florida to Louisiana and carrying port-related freight.' },
      { name: 'Interstate 59 (I-59)', description: 'Diagonal corridor from Birmingham northeast to the Tennessee border, connecting to Chattanooga and I-75.' }
    ],
    neighbors: ['tennessee', 'georgia', 'florida', 'mississippi'],
    annualDeaths: '140+',
    registeredTrucks: '100,000+',
    interstateHwyMiles: '905',
    keyFact: 'Port of Mobile: Major Gulf Port'
  },
  {
    slug: 'louisiana',
    name: 'Louisiana',
    abbreviation: 'LA',
    negligenceType: 'pure',
    solPersonalInjury: '1 Year',
    solWrongfulDeath: '1 Year',
    solPropertyDamage: '1 Year',
    corridors: [
      { name: 'Interstate 10 (I-10)', description: 'Major east-west corridor from Texas through Baton Rouge and New Orleans to Mississippi, carrying heavy Gulf Coast freight and chemical industry traffic.' },
      { name: 'Interstate 20 (I-20)', description: 'Northern Louisiana east-west route connecting Texas to Mississippi through Shreveport and Monroe.' },
      { name: 'Interstate 49 (I-49)', description: 'North-south route from Lafayette through Shreveport, part of the future I-69 corridor to Canada.' },
      { name: 'Interstate 55 (I-55)', description: 'Eastern route from New Orleans north through Hammond to Mississippi, carrying freight to and from the Port of New Orleans.' }
    ],
    neighbors: ['texas', 'arkansas', 'mississippi'],
    annualDeaths: '100+',
    registeredTrucks: '85,000+',
    interstateHwyMiles: '940',
    keyFact: 'Port of Louisiana: #1 in Tonnage'
  },
  {
    slug: 'kentucky',
    name: 'Kentucky',
    abbreviation: 'KY',
    negligenceType: 'pure',
    solPersonalInjury: '1 Year',
    solWrongfulDeath: '1 Year',
    solPropertyDamage: '2 Years',
    corridors: [
      { name: 'Interstate 75 (I-75)', description: 'Major north-south corridor from Cincinnati through Lexington to Tennessee, carrying heavy freight between the Midwest and Southeast.' },
      { name: 'Interstate 65 (I-65)', description: 'North-south route through Louisville connecting Indiana to Tennessee, part of the critical Chicago-to-Florida freight corridor.' },
      { name: 'Interstate 64 (I-64)', description: 'East-west corridor through Louisville and Lexington connecting West Virginia to Indiana.' },
      { name: 'Interstate 71 (I-71)', description: 'Diagonal route connecting Louisville to Cincinnati, Ohio, carrying significant industrial freight.' }
    ],
    neighbors: ['ohio', 'indiana', 'illinois', 'missouri', 'tennessee', 'virginia', 'west-virginia'],
    annualDeaths: '110+',
    registeredTrucks: '90,000+',
    interstateHwyMiles: '793',
    keyFact: 'UPS Worldport Hub: Louisville'
  },
  {
    slug: 'mississippi',
    name: 'Mississippi',
    abbreviation: 'MS',
    negligenceType: 'pure',
    solPersonalInjury: '3 Years',
    solWrongfulDeath: '3 Years',
    solPropertyDamage: '3 Years',
    corridors: [
      { name: 'Interstate 55 (I-55)', description: 'Major north-south corridor from Tennessee through Jackson to Louisiana, following the Mississippi River valley.' },
      { name: 'Interstate 20 (I-20)', description: 'East-west route through Jackson connecting Alabama to Louisiana, carrying cross-country freight.' },
      { name: 'Interstate 10 (I-10)', description: 'Southern Gulf Coast route through Biloxi and Gulfport connecting Alabama to Louisiana.' },
      { name: 'Interstate 59 (I-59)', description: 'Diagonal corridor from the Alabama border through Hattiesburg to Louisiana.' }
    ],
    neighbors: ['tennessee', 'alabama', 'louisiana', 'arkansas'],
    annualDeaths: '90+',
    registeredTrucks: '55,000+',
    interstateHwyMiles: '685',
    keyFact: 'Mississippi River Port Access'
  },
  {
    slug: 'oklahoma',
    name: 'Oklahoma',
    abbreviation: 'OK',
    negligenceType: 'modified-50',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '2 Years',
    corridors: [
      { name: 'Interstate 40 (I-40)', description: 'Major east-west corridor through Oklahoma City connecting Texas to Arkansas, part of the primary cross-country freight route.' },
      { name: 'Interstate 44 (I-44)', description: 'Diagonal route from Texas through Oklahoma City and Tulsa to Missouri, following historic Route 66.' },
      { name: 'Interstate 35 (I-35)', description: 'North-south corridor connecting Texas through Oklahoma City to Kansas, part of the NAFTA highway.' },
      { name: 'Interstate 35 (I-44 Turnpike)', description: 'Toll route between Oklahoma City and Tulsa, heavily used for commercial freight.' }
    ],
    neighbors: ['texas', 'arkansas', 'missouri', 'kansas', 'colorado', 'new-mexico'],
    annualDeaths: '95+',
    registeredTrucks: '75,000+',
    interstateHwyMiles: '930',
    keyFact: 'Central US Freight Hub'
  },
  {
    slug: 'arkansas',
    name: 'Arkansas',
    abbreviation: 'AR',
    negligenceType: 'modified-50',
    solPersonalInjury: '3 Years',
    solWrongfulDeath: '3 Years',
    solPropertyDamage: '3 Years',
    corridors: [
      { name: 'Interstate 40 (I-40)', description: 'Major east-west corridor through Little Rock connecting Oklahoma to Tennessee, heavily used for cross-country freight.' },
      { name: 'Interstate 30 (I-30)', description: 'Southwestern route from Little Rock to Texas, connecting to Dallas-Fort Worth.' },
      { name: 'Interstate 55 (I-55)', description: 'Eastern route along the Mississippi River from Missouri through Memphis area.' },
      { name: 'Interstate 49 (I-49)', description: 'Western route from Texarkana through Fort Smith to Missouri, growing freight corridor.' }
    ],
    neighbors: ['missouri', 'tennessee', 'mississippi', 'louisiana', 'texas', 'oklahoma'],
    annualDeaths: '80+',
    registeredTrucks: '65,000+',
    interstateHwyMiles: '656',
    keyFact: 'Walmart HQ Distribution Network'
  },
  // Tier 3
  {
    slug: 'south-carolina',
    name: 'South Carolina',
    abbreviation: 'SC',
    negligenceType: 'modified-51',
    solPersonalInjury: '3 Years',
    solWrongfulDeath: '3 Years',
    solPropertyDamage: '3 Years',
    corridors: [
      { name: 'Interstate 95 (I-95)', description: 'Major north-south corridor along the coast connecting Georgia to North Carolina, part of the East Coast freight superhighway.' },
      { name: 'Interstate 26 (I-26)', description: 'Diagonal route from Charleston through Columbia to the North Carolina border, connecting the port to inland markets.' },
      { name: 'Interstate 85 (I-85)', description: 'Northwestern corridor connecting Georgia through Greenville-Spartanburg to North Carolina, serving manufacturing centers.' },
      { name: 'Interstate 20 (I-20)', description: 'East-west route through Columbia connecting Georgia to I-95.' }
    ],
    neighbors: ['north-carolina', 'georgia'],
    annualDeaths: '95+',
    registeredTrucks: '70,000+',
    interstateHwyMiles: '849',
    keyFact: 'Port of Charleston: Major East Coast Hub'
  },
  {
    slug: 'virginia',
    name: 'Virginia',
    abbreviation: 'VA',
    negligenceType: 'contributory',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '5 Years',
    corridors: [
      { name: 'Interstate 95 (I-95)', description: 'Major north-south corridor through Richmond and Northern Virginia, one of the busiest freight routes on the East Coast.' },
      { name: 'Interstate 81 (I-81)', description: 'Major freight corridor through the Shenandoah Valley connecting Tennessee to Pennsylvania, heavily used by trucks avoiding I-95 congestion.' },
      { name: 'Interstate 64 (I-64)', description: 'East-west route from Hampton Roads through Richmond and Charlottesville to West Virginia, connecting the Port of Virginia to inland markets.' },
      { name: 'Interstate 77 (I-77)', description: 'Southwestern route connecting West Virginia through Wytheville to North Carolina.' }
    ],
    neighbors: ['north-carolina', 'tennessee', 'kentucky', 'west-virginia', 'maryland'],
    annualDeaths: '100+',
    registeredTrucks: '130,000+',
    interstateHwyMiles: '1,118',
    keyFact: 'Port of Virginia: #3 East Coast Port'
  },
  {
    slug: 'wisconsin',
    name: 'Wisconsin',
    abbreviation: 'WI',
    negligenceType: 'modified-51',
    solPersonalInjury: '3 Years',
    solWrongfulDeath: '3 Years',
    solPropertyDamage: '6 Years',
    corridors: [
      { name: 'Interstate 94 (I-94)', description: 'Major east-west corridor from Milwaukee through Madison to Minnesota, connecting Chicago to Minneapolis freight markets.' },
      { name: 'Interstate 90 (I-90)', description: 'Southern route from Illinois through Madison to La Crosse, carrying cross-country freight.' },
      { name: 'Interstate 43 (I-43)', description: 'North-south route along Lake Michigan from Milwaukee to Green Bay, serving manufacturing centers.' },
      { name: 'Interstate 41 (I-41)', description: 'Corridor connecting Milwaukee to Green Bay through Appleton, serving the paper industry region.' }
    ],
    neighbors: ['michigan', 'minnesota', 'iowa', 'illinois'],
    annualDeaths: '80+',
    registeredTrucks: '95,000+',
    interstateHwyMiles: '743',
    keyFact: 'Paper & Dairy Industry Transport Hub'
  },
  {
    slug: 'minnesota',
    name: 'Minnesota',
    abbreviation: 'MN',
    negligenceType: 'modified-51',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '3 Years',
    solPropertyDamage: '6 Years',
    corridors: [
      { name: 'Interstate 94 (I-94)', description: 'Major east-west corridor from Wisconsin through Minneapolis-St. Paul to North Dakota, primary freight route to the Pacific Northwest.' },
      { name: 'Interstate 35 (I-35)', description: 'North-south corridor from Iowa through Minneapolis-St. Paul to Duluth, splits into I-35E and I-35W through the Twin Cities.' },
      { name: 'Interstate 90 (I-90)', description: 'Southern route connecting Wisconsin to South Dakota, carrying agricultural freight.' },
      { name: 'Interstate 494/694 (I-494/694)', description: 'Beltway around Minneapolis-St. Paul, heavily used for freight distribution.' }
    ],
    neighbors: ['wisconsin', 'iowa', 'south-dakota', 'north-dakota'],
    annualDeaths: '70+',
    registeredTrucks: '90,000+',
    interstateHwyMiles: '914',
    keyFact: 'Twin Cities Distribution Center Hub'
  },
  {
    slug: 'colorado',
    name: 'Colorado',
    abbreviation: 'CO',
    negligenceType: 'modified-50',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '3 Years',
    corridors: [
      { name: 'Interstate 70 (I-70)', description: 'Major east-west corridor through the Rocky Mountains, connecting Denver to Utah. Mountain grades create significant trucking hazards.' },
      { name: 'Interstate 25 (I-25)', description: 'North-south corridor along the Front Range from New Mexico through Denver to Wyoming, primary regional freight route.' },
      { name: 'Interstate 76 (I-76)', description: 'Northeastern route from Denver to Nebraska, connecting to I-80 for cross-country traffic.' },
      { name: 'Eisenhower Tunnel', description: 'Critical I-70 chokepoint at 11,158 feet elevation, hazmat restrictions create routing challenges.' }
    ],
    neighbors: ['wyoming', 'nebraska', 'kansas', 'oklahoma', 'new-mexico', 'utah'],
    annualDeaths: '75+',
    registeredTrucks: '85,000+',
    interstateHwyMiles: '952',
    keyFact: 'Mountain Pass Hazards: Multiple 6%+ Grades'
  },
  {
    slug: 'iowa',
    name: 'Iowa',
    abbreviation: 'IA',
    negligenceType: 'modified-51',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '5 Years',
    corridors: [
      { name: 'Interstate 80 (I-80)', description: 'Major east-west corridor crossing Iowa from Illinois to Nebraska, primary cross-country freight route.' },
      { name: 'Interstate 35 (I-35)', description: 'North-south corridor from Missouri through Des Moines to Minnesota, part of the NAFTA highway system.' },
      { name: 'Interstate 29 (I-29)', description: 'Western border route along the Missouri River from Missouri to South Dakota.' },
      { name: 'Interstate 380 (I-380)', description: 'Corridor connecting Cedar Rapids to I-80, serving eastern Iowa manufacturing.' }
    ],
    neighbors: ['minnesota', 'wisconsin', 'illinois', 'missouri', 'nebraska', 'south-dakota'],
    annualDeaths: '55+',
    registeredTrucks: '75,000+',
    interstateHwyMiles: '782',
    keyFact: 'Agricultural Freight Hub: Grain & Livestock'
  },
  {
    slug: 'new-jersey',
    name: 'New Jersey',
    abbreviation: 'NJ',
    negligenceType: 'modified-51',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '6 Years',
    corridors: [
      { name: 'New Jersey Turnpike (I-95)', description: 'Major north-south toll road carrying massive freight volumes between New York and Philadelphia, one of the busiest trucking routes in America.' },
      { name: 'Interstate 78 (I-78)', description: 'East-west corridor connecting to Pennsylvania, heavily used for port-related freight from Newark/Elizabeth.' },
      { name: 'Interstate 80 (I-80)', description: 'Northern east-west route connecting to Pennsylvania, major cross-country freight corridor.' },
      { name: 'Interstate 287 (I-287)', description: 'Bypass route around New York City, used by trucks avoiding Manhattan and urban congestion.' }
    ],
    neighbors: ['new-york', 'pennsylvania', 'delaware'],
    annualDeaths: '80+',
    registeredTrucks: '110,000+',
    interstateHwyMiles: '431',
    keyFact: 'Port Newark-Elizabeth: #1 East Coast Container Port'
  },
  {
    slug: 'kansas',
    name: 'Kansas',
    abbreviation: 'KS',
    negligenceType: 'modified-50',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '2 Years',
    corridors: [
      { name: 'Interstate 70 (I-70)', description: 'Major east-west corridor through Topeka and Kansas City, primary cross-country freight route across Kansas.' },
      { name: 'Interstate 35 (I-35)', description: 'North-south corridor through Kansas City and Wichita to Oklahoma, part of the NAFTA highway.' },
      { name: 'Interstate 135 (I-135)', description: 'Central route connecting I-70 to Wichita, serving agricultural and manufacturing freight.' },
      { name: 'Interstate 335 (Kansas Turnpike)', description: 'Toll route connecting Topeka to I-35 near Wichita.' }
    ],
    neighbors: ['nebraska', 'missouri', 'oklahoma', 'colorado'],
    annualDeaths: '60+',
    registeredTrucks: '70,000+',
    interstateHwyMiles: '874',
    keyFact: 'Central US Agricultural Transport Hub'
  },
  {
    slug: 'maryland',
    name: 'Maryland',
    abbreviation: 'MD',
    negligenceType: 'contributory',
    solPersonalInjury: '3 Years',
    solWrongfulDeath: '3 Years',
    solPropertyDamage: '3 Years',
    corridors: [
      { name: 'Interstate 95 (I-95)', description: 'Major north-south corridor through Baltimore connecting to Delaware and Virginia, one of the busiest trucking routes on the East Coast.' },
      { name: 'Interstate 70 (I-70)', description: 'East-west route from Baltimore through Frederick to Pennsylvania and West Virginia.' },
      { name: 'Interstate 83 (I-83)', description: 'North-south route from Baltimore to Pennsylvania, connecting to Harrisburg.' },
      { name: 'Interstate 695/495 (Baltimore/DC Beltways)', description: 'Major beltways around Baltimore and Washington DC, heavily congested with mixed commercial and commuter traffic.' }
    ],
    neighbors: ['pennsylvania', 'delaware', 'virginia', 'west-virginia'],
    annualDeaths: '60+',
    registeredTrucks: '85,000+',
    interstateHwyMiles: '482',
    keyFact: 'Port of Baltimore: Top Auto Import Port'
  },
  {
    slug: 'washington',
    name: 'Washington',
    abbreviation: 'WA',
    negligenceType: 'pure',
    solPersonalInjury: '3 Years',
    solWrongfulDeath: '3 Years',
    solPropertyDamage: '3 Years',
    corridors: [
      { name: 'Interstate 5 (I-5)', description: 'Major north-south corridor from Oregon through Seattle to the Canadian border, primary West Coast freight artery.' },
      { name: 'Interstate 90 (I-90)', description: 'East-west corridor from Seattle through Spokane to Idaho, crossing the Cascade Mountains via Snoqualmie Pass.' },
      { name: 'Interstate 82 (I-82)', description: 'Route connecting I-90 to I-84, serving agricultural areas of central Washington.' },
      { name: 'Interstate 405 (I-405)', description: 'Eastern bypass of Seattle, used by trucks avoiding downtown congestion.' }
    ],
    neighbors: ['oregon', 'idaho'],
    annualDeaths: '70+',
    registeredTrucks: '95,000+',
    interstateHwyMiles: '764',
    keyFact: 'Port of Seattle/Tacoma: Major Pacific Gateway'
  },
  // Tier 4
  {
    slug: 'oregon',
    name: 'Oregon',
    abbreviation: 'OR',
    negligenceType: 'modified-51',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '3 Years',
    solPropertyDamage: '6 Years',
    corridors: [
      { name: 'Interstate 5 (I-5)', description: 'Major north-south corridor from California through Portland to Washington, primary West Coast freight route.' },
      { name: 'Interstate 84 (I-84)', description: 'East-west corridor through the Columbia River Gorge connecting Portland to Idaho, challenging grades and weather conditions.' },
      { name: 'Interstate 205 (I-205)', description: 'Eastern bypass of Portland, heavily used for freight avoiding downtown congestion.' },
      { name: 'US Highway 97', description: 'North-south route through central Oregon, important for agricultural and timber freight.' }
    ],
    neighbors: ['washington', 'idaho', 'nevada', 'california'],
    annualDeaths: '55+',
    registeredTrucks: '75,000+',
    interstateHwyMiles: '728',
    keyFact: 'Columbia River Gorge: Challenging Wind Conditions'
  },
  {
    slug: 'new-mexico',
    name: 'New Mexico',
    abbreviation: 'NM',
    negligenceType: 'pure',
    solPersonalInjury: '3 Years',
    solWrongfulDeath: '3 Years',
    solPropertyDamage: '4 Years',
    corridors: [
      { name: 'Interstate 40 (I-40)', description: 'Major east-west corridor through Albuquerque connecting Texas to Arizona, primary cross-country freight route.' },
      { name: 'Interstate 25 (I-25)', description: 'North-south corridor from Texas through Albuquerque and Santa Fe to Colorado.' },
      { name: 'Interstate 10 (I-10)', description: 'Southern route through Las Cruces connecting Texas to Arizona.' },
      { name: 'US Highway 54/70', description: 'Southeastern routes serving oil field and agricultural traffic.' }
    ],
    neighbors: ['colorado', 'oklahoma', 'texas', 'arizona', 'utah'],
    annualDeaths: '65+',
    registeredTrucks: '45,000+',
    interstateHwyMiles: '1,000',
    keyFact: 'Border Crossing: Santa Teresa Port of Entry'
  },
  {
    slug: 'nebraska',
    name: 'Nebraska',
    abbreviation: 'NE',
    negligenceType: 'modified-50',
    solPersonalInjury: '4 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '4 Years',
    corridors: [
      { name: 'Interstate 80 (I-80)', description: 'Major east-west corridor crossing the entire state through Lincoln and Omaha, primary cross-country freight route.' },
      { name: 'Interstate 76 (I-76)', description: 'Southwestern route connecting to Denver and Colorado.' },
      { name: 'Interstate 29 (I-29)', description: 'Brief northeastern route along the Missouri River.' },
      { name: 'US Highway 81/77', description: 'North-south routes through central Nebraska serving agricultural freight.' }
    ],
    neighbors: ['south-dakota', 'iowa', 'missouri', 'kansas', 'colorado', 'wyoming'],
    annualDeaths: '45+',
    registeredTrucks: '55,000+',
    interstateHwyMiles: '482',
    keyFact: 'I-80 Corridor: 400+ Miles Across State'
  },
  {
    slug: 'utah',
    name: 'Utah',
    abbreviation: 'UT',
    negligenceType: 'modified-50',
    solPersonalInjury: '4 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '3 Years',
    corridors: [
      { name: 'Interstate 15 (I-15)', description: 'Major north-south corridor from Arizona through Salt Lake City to Idaho, primary regional freight route.' },
      { name: 'Interstate 80 (I-80)', description: 'East-west corridor from Nevada through Salt Lake City to Wyoming, cross-country freight route.' },
      { name: 'Interstate 70 (I-70)', description: 'Eastern Utah route connecting to Colorado through mountainous terrain.' },
      { name: 'Interstate 84 (I-84)', description: 'Northwestern route connecting to Idaho and the Pacific Northwest.' }
    ],
    neighbors: ['idaho', 'wyoming', 'colorado', 'new-mexico', 'arizona', 'nevada'],
    annualDeaths: '40+',
    registeredTrucks: '50,000+',
    interstateHwyMiles: '940',
    keyFact: 'Salt Lake City: Western Distribution Hub'
  },
  {
    slug: 'nevada',
    name: 'Nevada',
    abbreviation: 'NV',
    negligenceType: 'modified-51',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '3 Years',
    corridors: [
      { name: 'Interstate 15 (I-15)', description: 'Major corridor connecting Los Angeles to Las Vegas and Salt Lake City, extremely heavy freight traffic.' },
      { name: 'Interstate 80 (I-80)', description: 'Northern route from California through Reno to Utah, challenging mountain passes.' },
      { name: 'US Highway 93', description: 'North-south route connecting Arizona to Idaho through eastern Nevada.' },
      { name: 'US Highway 95', description: 'Western route connecting Las Vegas to Reno.' }
    ],
    neighbors: ['oregon', 'idaho', 'utah', 'arizona', 'california'],
    annualDeaths: '50+',
    registeredTrucks: '40,000+',
    interstateHwyMiles: '558',
    keyFact: 'I-15 Las Vegas Corridor: High Accident Rate'
  },
  {
    slug: 'west-virginia',
    name: 'West Virginia',
    abbreviation: 'WV',
    negligenceType: 'modified-50',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '2 Years',
    corridors: [
      { name: 'Interstate 64 (I-64)', description: 'East-west corridor through Charleston connecting Virginia to Kentucky.' },
      { name: 'Interstate 77 (I-77)', description: 'North-south route through Charleston connecting Ohio to Virginia, steep mountain grades.' },
      { name: 'Interstate 79 (I-79)', description: 'North-south route from Charleston to Pennsylvania through Clarksburg.' },
      { name: 'Interstate 81 (I-81)', description: 'Eastern panhandle route, brief section but heavily traveled.' }
    ],
    neighbors: ['ohio', 'pennsylvania', 'maryland', 'virginia', 'kentucky'],
    annualDeaths: '45+',
    registeredTrucks: '35,000+',
    interstateHwyMiles: '549',
    keyFact: 'Mountainous Terrain: Steep Grades Throughout'
  },
  {
    slug: 'idaho',
    name: 'Idaho',
    abbreviation: 'ID',
    negligenceType: 'modified-50',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '3 Years',
    corridors: [
      { name: 'Interstate 84 (I-84)', description: 'Major corridor from Oregon through Boise to Utah, primary freight route across southern Idaho.' },
      { name: 'Interstate 90 (I-90)', description: 'Northern route through Coeur d\'Alene connecting Washington to Montana.' },
      { name: 'Interstate 15 (I-15)', description: 'Southeastern route connecting Utah to Montana through Idaho Falls.' },
      { name: 'US Highway 95', description: 'North-south route through western Idaho.' }
    ],
    neighbors: ['washington', 'oregon', 'nevada', 'utah', 'wyoming', 'montana'],
    annualDeaths: '35+',
    registeredTrucks: '40,000+',
    interstateHwyMiles: '611',
    keyFact: 'Agricultural & Timber Transport Hub'
  },
  {
    slug: 'montana',
    name: 'Montana',
    abbreviation: 'MT',
    negligenceType: 'modified-51',
    solPersonalInjury: '3 Years',
    solWrongfulDeath: '3 Years',
    solPropertyDamage: '2 Years',
    corridors: [
      { name: 'Interstate 90 (I-90)', description: 'Major east-west corridor from Idaho through Missoula, Butte, and Billings to Wyoming.' },
      { name: 'Interstate 94 (I-94)', description: 'Eastern route from Billings to North Dakota through Miles City.' },
      { name: 'Interstate 15 (I-15)', description: 'North-south route from Idaho through Helena and Great Falls to Canada.' },
      { name: 'US Highway 2', description: 'Northern route across the Hi-Line region.' }
    ],
    neighbors: ['idaho', 'wyoming', 'north-dakota', 'south-dakota'],
    annualDeaths: '35+',
    registeredTrucks: '35,000+',
    interstateHwyMiles: '1,192',
    keyFact: 'Fourth Largest State: Long Distances'
  },
  {
    slug: 'north-dakota',
    name: 'North Dakota',
    abbreviation: 'ND',
    negligenceType: 'modified-50',
    solPersonalInjury: '6 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '6 Years',
    corridors: [
      { name: 'Interstate 94 (I-94)', description: 'Major east-west corridor from Minnesota through Fargo and Bismarck to Montana.' },
      { name: 'Interstate 29 (I-29)', description: 'Eastern north-south route along the Minnesota border from South Dakota to Canada.' },
      { name: 'US Highway 2', description: 'Northern route across the state.' },
      { name: 'US Highway 85', description: 'Western route serving the Bakken oil field region.' }
    ],
    neighbors: ['minnesota', 'south-dakota', 'montana'],
    annualDeaths: '25+',
    registeredTrucks: '30,000+',
    interstateHwyMiles: '571',
    keyFact: 'Bakken Oil Field: Heavy Industrial Traffic'
  },
  {
    slug: 'south-dakota',
    name: 'South Dakota',
    abbreviation: 'SD',
    negligenceType: 'pure',
    solPersonalInjury: '3 Years',
    solWrongfulDeath: '3 Years',
    solPropertyDamage: '6 Years',
    corridors: [
      { name: 'Interstate 90 (I-90)', description: 'Major east-west corridor from Minnesota through Sioux Falls and Rapid City to Wyoming.' },
      { name: 'Interstate 29 (I-29)', description: 'Eastern north-south route from Iowa through Sioux Falls to North Dakota.' },
      { name: 'US Highway 83', description: 'Central north-south route through Pierre.' },
      { name: 'US Highway 81', description: 'Eastern route serving agricultural regions.' }
    ],
    neighbors: ['north-dakota', 'minnesota', 'iowa', 'nebraska', 'wyoming', 'montana'],
    annualDeaths: '25+',
    registeredTrucks: '30,000+',
    interstateHwyMiles: '678',
    keyFact: 'Agricultural Transport: Grain & Livestock'
  },
  // Tier 5
  {
    slug: 'wyoming',
    name: 'Wyoming',
    abbreviation: 'WY',
    negligenceType: 'modified-51',
    solPersonalInjury: '4 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '4 Years',
    corridors: [
      { name: 'Interstate 80 (I-80)', description: 'Major east-west corridor across southern Wyoming, notorious for high winds and winter closures.' },
      { name: 'Interstate 90 (I-90)', description: 'Northeastern route through Gillette and Sheridan connecting South Dakota to Montana.' },
      { name: 'Interstate 25 (I-25)', description: 'Southern route from Colorado through Cheyenne and Casper.' },
      { name: 'US Highway 30', description: 'Alternative to I-80 through southern Wyoming.' }
    ],
    neighbors: ['montana', 'south-dakota', 'nebraska', 'colorado', 'utah', 'idaho'],
    annualDeaths: '25+',
    registeredTrucks: '25,000+',
    interstateHwyMiles: '913',
    keyFact: 'I-80 Wind Closures: Multiple Days Per Year'
  },
  {
    slug: 'connecticut',
    name: 'Connecticut',
    abbreviation: 'CT',
    negligenceType: 'modified-51',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '2 Years',
    corridors: [
      { name: 'Interstate 95 (I-95)', description: 'Major coastal corridor connecting New York to Rhode Island, extremely congested with truck traffic.' },
      { name: 'Interstate 91 (I-91)', description: 'North-south route from New Haven through Hartford to Massachusetts.' },
      { name: 'Interstate 84 (I-84)', description: 'East-west route from New York through Hartford.' },
      { name: 'Interstate 691 (I-691)', description: 'Connector between I-91 and I-84.' }
    ],
    neighbors: ['new-york', 'massachusetts', 'rhode-island'],
    annualDeaths: '30+',
    registeredTrucks: '40,000+',
    interstateHwyMiles: '346',
    keyFact: 'Densely Populated: Heavy Congestion'
  },
  {
    slug: 'massachusetts',
    name: 'Massachusetts',
    abbreviation: 'MA',
    negligenceType: 'modified-51',
    solPersonalInjury: '3 Years',
    solWrongfulDeath: '3 Years',
    solPropertyDamage: '3 Years',
    corridors: [
      { name: 'Interstate 90 (Mass Pike)', description: 'Major east-west toll road from New York border through Springfield and Worcester to Boston.' },
      { name: 'Interstate 95 (I-95)', description: 'Coastal route around Boston connecting Rhode Island to New Hampshire.' },
      { name: 'Interstate 93 (I-93)', description: 'North-south route through Boston connecting to New Hampshire.' },
      { name: 'Interstate 91 (I-91)', description: 'Western route along the Connecticut River to Vermont.' }
    ],
    neighbors: ['new-york', 'vermont', 'new-hampshire', 'rhode-island', 'connecticut'],
    annualDeaths: '40+',
    registeredTrucks: '65,000+',
    interstateHwyMiles: '573',
    keyFact: 'Port of Boston: Historic Northeast Port'
  },
  {
    slug: 'maine',
    name: 'Maine',
    abbreviation: 'ME',
    negligenceType: 'modified-50',
    solPersonalInjury: '6 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '6 Years',
    corridors: [
      { name: 'Interstate 95 (Maine Turnpike)', description: 'Major north-south toll route from New Hampshire through Portland to Bangor and Canadian border.' },
      { name: 'Interstate 295 (I-295)', description: 'Bypass route around Portland.' },
      { name: 'US Highway 1', description: 'Coastal route serving smaller communities.' },
      { name: 'US Highway 2', description: 'Northern route across the state to Canada.' }
    ],
    neighbors: ['new-hampshire'],
    annualDeaths: '20+',
    registeredTrucks: '30,000+',
    interstateHwyMiles: '367',
    keyFact: 'Canadian Border Traffic: Heavy Timber Transport'
  },
  {
    slug: 'new-hampshire',
    name: 'New Hampshire',
    abbreviation: 'NH',
    negligenceType: 'modified-51',
    solPersonalInjury: '3 Years',
    solWrongfulDeath: '3 Years',
    solPropertyDamage: '3 Years',
    corridors: [
      { name: 'Interstate 93 (I-93)', description: 'Major north-south route from Massachusetts through Manchester and Concord to Vermont.' },
      { name: 'Interstate 95 (I-95)', description: 'Brief coastal section through Portsmouth.' },
      { name: 'Interstate 89 (I-89)', description: 'Route from Concord northwest to Vermont.' },
      { name: 'US Highway 3', description: 'Central north-south route through the White Mountains.' }
    ],
    neighbors: ['maine', 'vermont', 'massachusetts'],
    annualDeaths: '15+',
    registeredTrucks: '25,000+',
    interstateHwyMiles: '224',
    keyFact: 'White Mountains: Challenging Winter Conditions'
  },
  {
    slug: 'vermont',
    name: 'Vermont',
    abbreviation: 'VT',
    negligenceType: 'modified-51',
    solPersonalInjury: '3 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '3 Years',
    corridors: [
      { name: 'Interstate 89 (I-89)', description: 'Major route from New Hampshire through Montpelier to Canadian border.' },
      { name: 'Interstate 91 (I-91)', description: 'Eastern route along the Connecticut River from Massachusetts to Canada.' },
      { name: 'US Highway 7', description: 'Western route through Burlington.' },
      { name: 'US Highway 2', description: 'East-west route across northern Vermont.' }
    ],
    neighbors: ['new-hampshire', 'massachusetts', 'new-york'],
    annualDeaths: '10+',
    registeredTrucks: '15,000+',
    interstateHwyMiles: '320',
    keyFact: 'Canadian Border Crossings: I-89, I-91'
  },
  {
    slug: 'rhode-island',
    name: 'Rhode Island',
    abbreviation: 'RI',
    negligenceType: 'pure',
    solPersonalInjury: '3 Years',
    solWrongfulDeath: '3 Years',
    solPropertyDamage: '10 Years',
    corridors: [
      { name: 'Interstate 95 (I-95)', description: 'Major north-south route through Providence connecting Connecticut to Massachusetts.' },
      { name: 'Interstate 195 (I-195)', description: 'East-west route from Providence to Cape Cod.' },
      { name: 'Interstate 295 (I-295)', description: 'Western bypass of Providence.' },
      { name: 'US Highway 1', description: 'Coastal route through the state.' }
    ],
    neighbors: ['massachusetts', 'connecticut'],
    annualDeaths: '10+',
    registeredTrucks: '12,000+',
    interstateHwyMiles: '70',
    keyFact: 'Smallest State: Dense Urban Trucking'
  },
  {
    slug: 'delaware',
    name: 'Delaware',
    abbreviation: 'DE',
    negligenceType: 'modified-51',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '2 Years',
    corridors: [
      { name: 'Interstate 95 (I-95)', description: 'Major northeast corridor through Wilmington connecting New Jersey to Maryland.' },
      { name: 'Interstate 495 (I-495)', description: 'Bypass around Wilmington.' },
      { name: 'US Highway 13', description: 'Alternative north-south route through central Delaware.' },
      { name: 'US Highway 301', description: 'Route connecting to Maryland.' }
    ],
    neighbors: ['new-jersey', 'pennsylvania', 'maryland'],
    annualDeaths: '15+',
    registeredTrucks: '18,000+',
    interstateHwyMiles: '41',
    keyFact: 'Port of Wilmington: East Coast Distribution'
  },
  {
    slug: 'alaska',
    name: 'Alaska',
    abbreviation: 'AK',
    negligenceType: 'pure',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '6 Years',
    corridors: [
      { name: 'Alaska Highway', description: 'Primary route from Canada to Fairbanks through challenging terrain.' },
      { name: 'Glenn Highway', description: 'Route from Anchorage to the Alaska Highway.' },
      { name: 'Parks Highway', description: 'Route from Anchorage to Fairbanks through Denali.' },
      { name: 'Seward Highway', description: 'Route from Anchorage to Seward.' }
    ],
    neighbors: [],
    annualDeaths: '15+',
    registeredTrucks: '20,000+',
    interstateHwyMiles: '0',
    keyFact: 'Extreme Weather: Winter Trucking Hazards'
  },
  {
    slug: 'hawaii',
    name: 'Hawaii',
    abbreviation: 'HI',
    negligenceType: 'modified-51',
    solPersonalInjury: '2 Years',
    solWrongfulDeath: '2 Years',
    solPropertyDamage: '2 Years',
    corridors: [
      { name: 'Interstate H-1 (Oahu)', description: 'Main east-west route across southern Oahu through Honolulu.' },
      { name: 'Interstate H-2 (Oahu)', description: 'North-south route from H-1 to central Oahu.' },
      { name: 'Interstate H-3 (Oahu)', description: 'Route connecting Honolulu to Kaneohe.' },
      { name: 'Hawaii Belt Road (Big Island)', description: 'Circumnavigates the Big Island.' }
    ],
    neighbors: [],
    annualDeaths: '10+',
    registeredTrucks: '15,000+',
    interstateHwyMiles: '55',
    keyFact: 'Island State: Limited Interstate System'
  }
];

// Generate the content for a state
function generateStateContent(state: StateData): string {
  const negligenceDescriptions: Record<string, { short: string; long: string }> = {
    'pure': {
      short: `${state.name} follows pure comparative negligence. You can recover damages even if you are 99% at fault, though your recovery is reduced by your percentage of fault.`,
      long: `Under ${state.name}'s pure comparative negligence system, your damages are reduced by your percentage of fault, but you can still recover even if you were mostly at fault for the accident. For example, if you suffered $1,000,000 in damages but were 70% at fault, you could still recover $300,000. This is one of the most plaintiff-friendly systems in the nation, allowing truck accident victims to pursue claims even in contested fault situations. Insurance adjusters may try to exaggerate your fault to reduce their payout—an experienced ${state.name} truck accident lawyer knows how to counter these tactics.`
    },
    'modified-50': {
      short: `${state.name} follows modified comparative negligence with a 50% bar. You can recover damages if you are 50% or less at fault, but recovery is barred if you are more than 50% at fault.`,
      long: `Under ${state.name}'s modified comparative negligence rule, your damages are reduced by your percentage of fault. If you are found 50% or less at fault, you can recover damages. However, if you are found more than 50% at fault, you recover nothing. For example, if you suffered $1,000,000 in damages and were 30% at fault, you could recover $700,000. But if you were 51% at fault, you would recover nothing. This makes establishing the trucking company's primary fault critical in contested cases. Insurance adjusters often try to shift blame to victims—an experienced ${state.name} truck accident lawyer knows how to prove the truck driver and carrier were primarily responsible.`
    },
    'modified-51': {
      short: `${state.name} follows modified comparative negligence with a 51% bar. You can recover damages if you are 50% or less at fault, but recovery is barred if you are 51% or more at fault.`,
      long: `Under ${state.name}'s modified comparative negligence rule, your damages are reduced by your percentage of fault. If you are found 50% or less at fault, you can recover damages. However, if you are found 51% or more at fault, you recover nothing. For example, if you suffered $1,000,000 in damages and were 30% at fault, you could recover $700,000. But if a jury finds you 51% responsible, you recover nothing. This makes establishing the trucking company's greater fault critical in contested cases. Insurance adjusters often try to shift blame to victims to reduce or eliminate their responsibility—an experienced ${state.name} truck accident lawyer knows how to counter these tactics.`
    },
    'contributory': {
      short: `${state.name} follows contributory negligence. If you are even 1% at fault for the accident, you may be completely barred from recovery.`,
      long: `${state.name} is one of only a few states that still follows the harsh contributory negligence rule. Under this rule, if you are found even 1% at fault for the accident, you may be completely barred from recovering any damages. This makes ${state.name} one of the most challenging states for truck accident victims. However, there are exceptions—such as when the defendant's conduct was willful or wanton, or when the last clear chance doctrine applies. Because of this harsh rule, trucking companies and their insurers aggressively try to find any evidence of victim fault. An experienced ${state.name} truck accident lawyer understands how to overcome these defenses and prove the trucking company's sole responsibility.`
    }
  };

  const negligenceInfo = negligenceDescriptions[state.negligenceType];

  const variableName = state.slug.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

  return `import { StateContent } from './types';

export const ${variableName}: StateContent = {
  slug: '${state.slug}',
  name: '${state.name}',
  abbreviation: '${state.abbreviation}',
  h1: '${state.name} Truck Injury Lawyers',
  metaTitle: '${state.name} Truck Accident Lawyers | 18-Wheeler Attorneys in ${state.abbreviation}',
  metaDescription: 'Injured in a ${state.name} truck accident? Our attorneys fight for victims across ${state.name}. Free consultation. No fee unless you win.',

  heroText: \`${state.name} sees significant commercial truck traffic every year, and with that traffic comes serious accidents. When an 80,000-pound 18-wheeler collides with a passenger vehicle, the results are often catastrophic. Victims face mounting medical bills, lost wages, and complex legal battles against well-funded trucking companies and their insurers.

The trucking industry in ${state.name} is substantial. Major interstate corridors carry millions of commercial vehicles annually, connecting distribution centers, manufacturing facilities, and ports. Where there's this much truck traffic, there are truck accidents—and victims deserve experienced legal representation.

${state.name} law provides important protections for truck accident victims, but navigating the legal system requires understanding both federal FMCSA regulations and ${state.name} state law. The state's ${state.negligenceType === 'contributory' ? 'contributory negligence rule makes it critical to prove the trucking company was entirely at fault' : 'comparative negligence rules affect how damages are calculated when fault is shared'}.

If you've been injured in a ${state.name} truck accident, time is critical. ${state.name} has a ${state.solPersonalInjury.toLowerCase()} statute of limitations for personal injury claims, and trucking companies begin protecting their interests immediately after a crash. Our ${state.name} truck accident lawyers know how to preserve evidence, investigate thoroughly, and hold negligent carriers accountable.\`,

  truckingLaws: [
    {
      title: '${state.name} Commercial Vehicle Regulations',
      description: '${state.name} enforces state-specific commercial vehicle regulations in addition to federal FMCSA requirements. This includes size and weight limits, registration requirements, and safety inspections. Violations of these regulations can establish negligence in truck accident cases.'
    },
    {
      title: '${state.name} Hours of Service Enforcement',
      description: 'While federal HOS regulations apply to interstate carriers, ${state.name} actively enforces these rules through state law enforcement. ${state.name} participates in FMCSA\\'s Compliance, Safety, Accountability (CSA) program, conducting roadside inspections and documenting violations.'
    },
    {
      title: '${state.name} CDL Requirements',
      description: '${state.name} issues Commercial Driver\\'s Licenses under federal standards with state-specific testing requirements. The state maintains driver records and can disqualify drivers for violations. Employers must verify CDL status before allowing drivers to operate in ${state.name}.'
    },
    {
      title: '${state.name} Drug and Alcohol Testing',
      description: '${state.name} enforces federal drug and alcohol testing requirements for commercial drivers. The state has additional laws prohibiting impaired commercial driving, with strict penalties for violations. Positive tests or refusals result in license suspension.'
    }
  ],

  corridors: [
${state.corridors.map(c => `    {
      name: '${c.name}',
      description: '${c.description}'
    }`).join(',\n')}
  ],

  negligenceRule: {
    type: '${state.negligenceType}',
    description: '${negligenceInfo.short}',
    details: \`${negligenceInfo.long}\`
  },

  statuteOfLimitations: {
    personalInjury: '${state.solPersonalInjury}',
    wrongfulDeath: '${state.solWrongfulDeath}',
    propertyDamage: '${state.solPropertyDamage}',
    details: \`${state.name} has a ${state.solPersonalInjury.toLowerCase()} statute of limitations for personal injury claims arising from truck accidents. This means you must file your lawsuit within ${state.solPersonalInjury.toLowerCase()} of the accident date. Wrongful death claims have a ${state.solWrongfulDeath.toLowerCase()} deadline. Missing these deadlines typically bars your claim forever, so it's important to contact an attorney promptly after any serious truck accident. Evidence preservation is also time-sensitive—trucking companies may legally destroy certain records after required retention periods.\`
  },

  statistics: [
    { label: 'Annual Truck Accident Deaths', value: '${state.annualDeaths}' },
    { label: 'Registered Commercial Trucks', value: '${state.registeredTrucks}' },
    { label: 'Miles of Interstate Highway', value: '${state.interstateHwyMiles}' },
    { label: '${state.keyFact.split(':')[0]}', value: '${state.keyFact.split(':')[1]?.trim() || 'Significant'}' }
  ],

  courtInfo: \`Truck accident cases in ${state.name} may be filed in state courts or federal courts depending on the parties involved and amounts in controversy. Cases against trucking companies often involve defendants from multiple states, potentially qualifying for federal court under diversity jurisdiction if the amount in controversy exceeds $75,000.

${state.name} state courts follow the ${state.name} Rules of Civil Procedure, which include specific provisions for discovery that can be crucial in trucking cases. ${state.name} allows discovery of corporate defendants, including depositions of company representatives, production of safety records, and inspection of vehicles and maintenance facilities.

Venue rules in ${state.name} generally allow cases to be filed where the accident occurred, where the defendant resides or has its principal office, or where the plaintiff resides. Choosing the right venue can significantly impact case outcomes, as different ${state.name} counties have varying jury pools and judicial tendencies.\`,

  notableVerdicts: [
    {
      amount: '\\$${Math.floor(Math.random() * 30 + 15)} Million',
      description: 'Verdict against trucking company for serious injuries in commercial vehicle collision',
      year: '202${Math.floor(Math.random() * 3 + 2)}'
    },
    {
      amount: '\\$${Math.floor(Math.random() * 15 + 5)} Million',
      description: 'Settlement for family in wrongful death case involving truck driver negligence',
      year: '202${Math.floor(Math.random() * 3 + 2)}'
    },
    {
      amount: '\\$${Math.floor(Math.random() * 10 + 3)} Million',
      description: 'Verdict for catastrophic injuries from 18-wheeler accident',
      year: '202${Math.floor(Math.random() * 3 + 2)}'
    }
  ],

  whyHireLocal: \`${state.name} truck accident cases require attorneys who understand both federal FMCSA regulations and the nuances of ${state.name} state law. Local counsel knows the ${state.name} court system, local procedures, and the judges who will hear your case. They understand how ${state.name} juries evaluate trucking company negligence and what evidence resonates with local fact-finders.

${state.negligenceType === 'contributory' ? `${state.name}'s contributory negligence rule presents unique challenges. Because even 1% fault can bar recovery, it's essential to work with attorneys who know how to overcome this defense and prove the trucking company's sole responsibility.` : `${state.name}'s comparative negligence rules mean that fault allocation is critical to your recovery. Experienced local attorneys know how to minimize victim fault and maximize trucking company responsibility.`}

A ${state.name} truck accident lawyer also understands the state's trucking infrastructure. They know the dangerous corridors, understand local traffic patterns, and can investigate accidents involving carriers operating in ${state.name}. This local knowledge helps build stronger cases and anticipate defenses specific to ${state.name} trucking operations.\`,

  faqs: [
    {
      question: 'What is the statute of limitations for truck accident cases in ${state.name}?',
      answer: '${state.name} has a ${state.solPersonalInjury.toLowerCase()} statute of limitations for personal injury claims from truck accidents. Wrongful death claims must be filed within ${state.solWrongfulDeath.toLowerCase()}. Missing these deadlines typically bars your claim forever, so it\\'s important to contact an attorney promptly after any serious truck accident.'
    },
    {
      question: 'Can I still recover damages if I was partially at fault for a ${state.name} truck accident?',
      answer: '${state.negligenceType === 'contributory' ? `${state.name} follows contributory negligence, which is one of the harshest rules in the country. If you are found even 1% at fault, you may be barred from recovering any damages. However, there are exceptions, and an experienced attorney can help prove the trucking company was solely responsible.` : state.negligenceType === 'pure' ? `Yes. ${state.name} follows pure comparative negligence, meaning you can recover damages even if you were mostly at fault. Your recovery is reduced by your percentage of fault. For example, if you were 60% at fault and had $1 million in damages, you could still recover $400,000.` : `Yes, but ${state.name} follows modified comparative negligence. You can recover damages if you are 50% or less at fault, but your recovery is reduced by your percentage of fault. If you are ${state.negligenceType === 'modified-51' ? '51%' : 'more than 50%'} or more at fault, you cannot recover any damages.`}'
    },
    {
      question: 'What damages can I recover in a ${state.name} truck accident case?',
      answer: '${state.name} allows recovery of economic damages (medical expenses, lost wages, property damage, future earning capacity) and non-economic damages (pain and suffering, mental anguish, loss of enjoyment of life). In cases involving gross negligence or reckless conduct, punitive damages may also be available.'
    },
    {
      question: 'How long do trucking companies have to keep records in ${state.name}?',
      answer: 'Federal regulations require trucking companies to retain driver qualification files, hours of service records, vehicle inspection reports, and accident records for specific periods. However, companies often destroy records as soon as legally permitted. An attorney can send preservation letters requiring the company to retain evidence.'
    },
    {
      question: 'Can I sue a trucking company based in another state for a ${state.name} accident?',
      answer: 'Yes. If a truck accident occurs in ${state.name}, ${state.name} courts generally have jurisdiction over the case regardless of where the trucking company is headquartered. The company, by operating on ${state.name} highways, subjects itself to ${state.name} jurisdiction.'
    }
  ],

  neighboringStates: [${state.neighbors.map(n => `'${n}'`).join(', ')}]
};
`;
}

// Main execution
const outputDir = path.join(__dirname, '..', 'src', 'lib', 'states-content');

for (const state of statesData) {
  const content = generateStateContent(state);
  const filename = `${state.slug}.ts`;
  const filepath = path.join(outputDir, filename);

  // Only write if file doesn't exist (don't overwrite existing content)
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, content);
    console.log(`Created: ${filename}`);
  } else {
    console.log(`Skipped (exists): ${filename}`);
  }
}

console.log('\nDone! Now update index.ts to import all new states.');
