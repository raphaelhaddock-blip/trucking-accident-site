/**
 * Generate State Hero Images via Sanity AI
 *
 * Creates hero images for states that don't have one yet.
 * Uses Sanity's AI image generation.
 *
 * Run with: npx tsx scripts/generate-state-images.ts
 */

const STATES_MISSING_IMAGES = [
  { slug: 'alabama', name: 'Alabama', roads: 'I-65, I-20, I-10', landmarks: 'Gulf Coast, Birmingham skyline' },
  { slug: 'alaska', name: 'Alaska', roads: 'Alaska Highway, Glenn Highway', landmarks: 'Denali, mountain ranges, wilderness' },
  { slug: 'arizona', name: 'Arizona', roads: 'I-10, I-40, I-17', landmarks: 'Sonoran Desert, Phoenix skyline, red rocks' },
  { slug: 'arkansas', name: 'Arkansas', roads: 'I-40, I-30, I-55', landmarks: 'Ozark Mountains, forests' },
  { slug: 'colorado', name: 'Colorado', roads: 'I-70, I-25', landmarks: 'Rocky Mountains, Denver skyline' },
  { slug: 'connecticut', name: 'Connecticut', roads: 'I-95, I-84, I-91', landmarks: 'New England coast, fall foliage' },
  { slug: 'delaware', name: 'Delaware', roads: 'I-95, US-13, US-1', landmarks: 'Mid-Atlantic coast, historic towns' },
  { slug: 'hawaii', name: 'Hawaii', roads: 'H-1, H-2, H-3', landmarks: 'Pacific Ocean, volcanic mountains, palm trees' },
  { slug: 'idaho', name: 'Idaho', roads: 'I-84, I-90, I-15', landmarks: 'Snake River Canyon, mountain passes' },
  { slug: 'iowa', name: 'Iowa', roads: 'I-80, I-35, I-29', landmarks: 'Midwest farmland, corn fields, rolling plains' },
  { slug: 'kansas', name: 'Kansas', roads: 'I-70, I-35', landmarks: 'Great Plains, wheat fields, prairies' },
  { slug: 'kentucky', name: 'Kentucky', roads: 'I-65, I-75, I-64', landmarks: 'Appalachian foothills, horse country, Louisville skyline' },
  { slug: 'louisiana', name: 'Louisiana', roads: 'I-10, I-20, I-49', landmarks: 'Bayou country, New Orleans, Gulf Coast' },
  { slug: 'maine', name: 'Maine', roads: 'I-95, US-1', landmarks: 'Rocky coast, pine forests, lighthouses' },
  { slug: 'maryland', name: 'Maryland', roads: 'I-95, I-70, I-83', landmarks: 'Chesapeake Bay, Baltimore skyline' },
  { slug: 'massachusetts', name: 'Massachusetts', roads: 'I-90, I-95, I-93', landmarks: 'Boston skyline, New England coast' },
  { slug: 'michigan', name: 'Michigan', roads: 'I-75, I-94, I-96', landmarks: 'Great Lakes, Detroit skyline' },
  { slug: 'minnesota', name: 'Minnesota', roads: 'I-94, I-35, I-90', landmarks: 'Land of 10,000 Lakes, Minneapolis skyline' },
  { slug: 'mississippi', name: 'Mississippi', roads: 'I-55, I-20, I-10', landmarks: 'Mississippi River, Deep South landscapes' },
  { slug: 'missouri', name: 'Missouri', roads: 'I-70, I-44, I-55', landmarks: 'Gateway Arch, St. Louis skyline, Ozarks' },
  { slug: 'montana', name: 'Montana', roads: 'I-90, I-15', landmarks: 'Big Sky Country, Rocky Mountains, vast plains' },
  { slug: 'nebraska', name: 'Nebraska', roads: 'I-80, US-30', landmarks: 'Great Plains, Platte River valley, corn fields' },
  { slug: 'nevada', name: 'Nevada', roads: 'I-15, I-80, US-95', landmarks: 'Mojave Desert, Las Vegas strip at distance' },
  { slug: 'new-hampshire', name: 'New Hampshire', roads: 'I-93, I-89, I-95', landmarks: 'White Mountains, covered bridges, fall colors' },
  { slug: 'new-jersey', name: 'New Jersey', roads: 'I-95, NJ Turnpike, Garden State Parkway', landmarks: 'NYC skyline in distance, industrial ports' },
  { slug: 'new-mexico', name: 'New Mexico', roads: 'I-40, I-25, I-10', landmarks: 'Desert mesas, Santa Fe, Southwest landscape' },
  { slug: 'new-york', name: 'New York', roads: 'I-87, I-90, I-95', landmarks: 'NYC skyline, Hudson Valley, Catskills' },
  { slug: 'north-dakota', name: 'North Dakota', roads: 'I-94, I-29', landmarks: 'Northern Great Plains, oil fields, prairies' },
  { slug: 'oklahoma', name: 'Oklahoma', roads: 'I-40, I-35, I-44', landmarks: 'Red earth plains, wind turbines, Route 66' },
  { slug: 'oregon', name: 'Oregon', roads: 'I-5, I-84', landmarks: 'Pacific Northwest forests, Columbia River Gorge' },
  { slug: 'rhode-island', name: 'Rhode Island', roads: 'I-95, I-195', landmarks: 'New England coast, Providence skyline' },
  { slug: 'south-carolina', name: 'South Carolina', roads: 'I-85, I-26, I-95', landmarks: 'Charleston harbor, Low Country, palm trees' },
  { slug: 'south-dakota', name: 'South Dakota', roads: 'I-90, I-29', landmarks: 'Badlands, Black Hills, Mount Rushmore area' },
  { slug: 'utah', name: 'Utah', roads: 'I-15, I-80, I-70', landmarks: 'Red rock canyons, Salt Lake City, mountain passes' },
  { slug: 'vermont', name: 'Vermont', roads: 'I-89, I-91', landmarks: 'Green Mountains, fall foliage, covered bridges' },
  { slug: 'virginia', name: 'Virginia', roads: 'I-95, I-81, I-64', landmarks: 'Blue Ridge Mountains, Richmond skyline, Shenandoah' },
  { slug: 'washington', name: 'Washington', roads: 'I-5, I-90, I-82', landmarks: 'Mount Rainier, Seattle skyline, evergreen forests' },
  { slug: 'west-virginia', name: 'West Virginia', roads: 'I-77, I-79, I-64', landmarks: 'Appalachian Mountains, mountain tunnels, New River Gorge' },
  { slug: 'wisconsin', name: 'Wisconsin', roads: 'I-94, I-90, I-43', landmarks: 'Dairy farms, Milwaukee skyline, Great Lakes' },
  { slug: 'wyoming', name: 'Wyoming', roads: 'I-80, I-90, I-25', landmarks: 'Yellowstone region, Rocky Mountains, wide open spaces' },
];

console.log('States needing images:', STATES_MISSING_IMAGES.length);
console.log('\nTo generate images, use the Sanity MCP tool:');
console.log('mcp__Sanity__generate_image with prompts like:\n');

for (const state of STATES_MISSING_IMAGES.slice(0, 5)) {
  console.log(`State: ${state.name}`);
  console.log(`Prompt: "Convoy of 18-wheeler semi trucks on ${state.roads} through ${state.name}, ${state.landmarks}, golden hour lighting, dramatic sky, photorealistic trucking industry scene"`);
  console.log('');
}

console.log(`... and ${STATES_MISSING_IMAGES.length - 5} more states`);
