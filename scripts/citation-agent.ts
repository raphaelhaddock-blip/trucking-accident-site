/**
 * Citation Agent - Phase 3 of Editorial Agent System
 *
 * Scans state content for unsourced statistics and creates
 * citation drafts in Sanity for manual review.
 *
 * Run with: npx tsx scripts/citation-agent.ts
 */

import { createClient } from '@sanity/client';
import * as fs from 'fs';
import * as path from 'path';

// Sanity client configuration
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'tspm77c6',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

// Known data sources for trucking statistics
const DATA_SOURCES = {
  fatalityStats: {
    sourceName: 'NHTSA FARS Database',
    sourceUrl: 'https://www.nhtsa.gov/research-data/fatality-analysis-reporting-system-fars',
    description: 'Fatality data from large truck crashes',
  },
  registeredTrucks: {
    sourceName: 'FMCSA Motor Carrier Census',
    sourceUrl: 'https://ai.fmcsa.dot.gov/SMS/',
    description: 'Registered commercial vehicle counts',
  },
  highwayMiles: {
    sourceName: 'FHWA Highway Statistics',
    sourceUrl: 'https://www.fhwa.dot.gov/policyinformation/statistics.cfm',
    description: 'Interstate and highway mileage by state',
  },
  borderCrossings: {
    sourceName: 'Bureau of Transportation Statistics',
    sourceUrl: 'https://www.bts.gov/browse-statistical-products-and-data/border-crossing-data',
    description: 'Border crossing traffic data',
  },
  crashStats: {
    sourceName: 'FMCSA Large Truck and Bus Crash Facts',
    sourceUrl: 'https://www.fmcsa.dot.gov/safety/data-and-statistics/large-truck-and-bus-crash-facts',
    description: 'Annual crash statistics report',
  },
};

// Patterns to identify unsourced statistics
const STAT_PATTERNS = [
  // Death/fatality statistics
  {
    regex: /(\d{1,3}(?:,\d{3})*\+?)\s*(?:people\s+)?(?:killed|deaths?|fatalities|fatality)/gi,
    category: 'fatality',
    priority: 'high' as const,
    suggestedSource: DATA_SOURCES.fatalityStats,
  },
  // Registered trucks/vehicles
  {
    regex: /(\d{1,3}(?:,\d{3})*\+?)\s*(?:commercial\s+)?(?:trucks?|vehicles?)\s+(?:are\s+)?registered/gi,
    category: 'registration',
    priority: 'medium' as const,
    suggestedSource: DATA_SOURCES.registeredTrucks,
  },
  // Highway miles
  {
    regex: /(\d{1,3}(?:,\d{3})*)\s*miles?\s+of\s+(?:interstate|highway)/gi,
    category: 'infrastructure',
    priority: 'low' as const,
    suggestedSource: DATA_SOURCES.highwayMiles,
  },
  // Border crossings
  {
    regex: /(\d{1,3}(?:,\d{3})*\+?)\s*(?:truck\s+)?(?:crossings?|trucks?)\s+(?:daily|per\s+day|annually)/gi,
    category: 'border',
    priority: 'medium' as const,
    suggestedSource: DATA_SOURCES.borderCrossings,
  },
  // Annual statistics (generic)
  {
    regex: /(?:over|more\s+than|approximately|about|nearly)\s+(\d{1,3}(?:,\d{3})*\+?)\s+(?:people|trucks?|accidents?|crashes?|injuries)/gi,
    category: 'general',
    priority: 'high' as const,
    suggestedSource: DATA_SOURCES.crashStats,
  },
  // Percentage statistics
  {
    regex: /(\d{1,2}(?:\.\d+)?%)\s+(?:of|increase|decrease|more|less)/gi,
    category: 'percentage',
    priority: 'medium' as const,
    suggestedSource: DATA_SOURCES.crashStats,
  },
  // Statistics array values (from the data structure)
  {
    regex: /value:\s*['"](\d{1,3}(?:,\d{3})*\+?)['"]/gi,
    category: 'statistic',
    priority: 'high' as const,
    suggestedSource: DATA_SOURCES.crashStats,
  },
];

interface StatMatch {
  text: string;
  value: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  suggestedSource: typeof DATA_SOURCES.fatalityStats;
  lineNumber: number;
  context: string;
}

interface StateFile {
  name: string;
  slug: string;
  path: string;
  content: string;
}

// Scan a single file for unsourced statistics
function scanFileForStats(file: StateFile): StatMatch[] {
  const matches: StatMatch[] = [];
  const lines = file.content.split('\n');
  const seenValues = new Set<string>();

  for (const pattern of STAT_PATTERNS) {
    let match;
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);

    while ((match = regex.exec(file.content)) !== null) {
      const value = match[1] || match[0];
      const normalizedValue = value.replace(/,/g, '').replace(/\+/g, '');

      // Skip if we've already found this value
      if (seenValues.has(normalizedValue)) continue;
      seenValues.add(normalizedValue);

      // Find line number
      const beforeMatch = file.content.substring(0, match.index);
      const lineNumber = beforeMatch.split('\n').length;

      // Get context (surrounding text)
      const contextStart = Math.max(0, match.index - 100);
      const contextEnd = Math.min(file.content.length, match.index + match[0].length + 100);
      const context = file.content.substring(contextStart, contextEnd).replace(/\s+/g, ' ').trim();

      matches.push({
        text: match[0],
        value: value,
        category: pattern.category,
        priority: pattern.priority,
        suggestedSource: pattern.suggestedSource,
        lineNumber,
        context: `...${context}...`,
      });
    }
  }

  return matches;
}

// Load all state content files
function loadStateFiles(): StateFile[] {
  const statesDir = path.join(process.cwd(), 'src/lib/states-content');
  const files: StateFile[] = [];

  const entries = fs.readdirSync(statesDir);

  for (const entry of entries) {
    if (entry.endsWith('.ts') && entry !== 'types.ts' && entry !== 'index.ts' && entry !== 'images.ts') {
      const filePath = path.join(statesDir, entry);
      const content = fs.readFileSync(filePath, 'utf-8');
      const slug = entry.replace('.ts', '');

      // Extract state name from content
      const nameMatch = content.match(/name:\s*['"]([^'"]+)['"]/);
      const name = nameMatch ? nameMatch[1] : slug;

      files.push({
        name,
        slug,
        path: filePath,
        content,
      });
    }
  }

  return files;
}

// Create a citation draft in Sanity
async function createCitationDraft(
  stateName: string,
  stateSlug: string,
  stat: StatMatch
): Promise<string | null> {
  try {
    const doc = {
      _type: 'citationDraft',
      targetPage: `/states/${stateSlug}`,
      pageType: 'state',
      originalClaim: stat.context,
      proposedCitation: {
        sourceName: stat.suggestedSource.sourceName,
        sourceUrl: stat.suggestedSource.sourceUrl,
        dataYear: '2024', // Default to most recent year
        verifiedValue: '', // To be filled during review
      },
      proposedText: `${stat.text} ([${stat.suggestedSource.sourceName}](${stat.suggestedSource.sourceUrl}))`,
      status: 'pending',
      priority: stat.priority,
      notes: `Auto-generated by Citation Agent.\nCategory: ${stat.category}\nMatched value: ${stat.value}\nLine: ${stat.lineNumber}`,
      createdAt: new Date().toISOString(),
    };

    const result = await sanityClient.create(doc);
    console.log(`  ✓ Created draft: ${result._id}`);
    return result._id;
  } catch (error) {
    console.error(`  ✗ Failed to create draft:`, error);
    return null;
  }
}

// Main function
async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  CITATION AGENT - Phase 3 Editorial System');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Check for API token
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error('Error: SANITY_API_WRITE_TOKEN not set');
    console.log('Please set the environment variable and try again.');
    process.exit(1);
  }

  // Load state files
  console.log('Loading state content files...');
  const stateFiles = loadStateFiles();
  console.log(`Found ${stateFiles.length} state files\n`);

  // Scan all files
  const allMatches: { state: StateFile; matches: StatMatch[] }[] = [];
  let totalMatches = 0;

  console.log('Scanning for unsourced statistics...\n');

  for (const file of stateFiles) {
    const matches = scanFileForStats(file);
    if (matches.length > 0) {
      allMatches.push({ state: file, matches });
      totalMatches += matches.length;
    }
  }

  // Summary
  console.log('───────────────────────────────────────────────────────────');
  console.log('  SCAN RESULTS');
  console.log('───────────────────────────────────────────────────────────\n');

  const byPriority = {
    high: 0,
    medium: 0,
    low: 0,
  };

  for (const { state, matches } of allMatches) {
    console.log(`${state.name}: ${matches.length} unsourced statistics`);
    for (const match of matches) {
      byPriority[match.priority]++;
      const emoji = match.priority === 'high' ? '🔴' : match.priority === 'medium' ? '🟡' : '🟢';
      console.log(`  ${emoji} ${match.value} (${match.category})`);
    }
  }

  console.log('\n───────────────────────────────────────────────────────────');
  console.log(`Total: ${totalMatches} statistics found`);
  console.log(`  🔴 High priority: ${byPriority.high}`);
  console.log(`  🟡 Medium priority: ${byPriority.medium}`);
  console.log(`  🟢 Low priority: ${byPriority.low}`);
  console.log('───────────────────────────────────────────────────────────\n');

  // Ask for confirmation before creating drafts
  const args = process.argv.slice(2);
  const createDrafts = args.includes('--create') || args.includes('-c');
  const limitStates = args.includes('--limit') ? parseInt(args[args.indexOf('--limit') + 1]) || 5 : null;
  const priorityFilter = args.includes('--priority') ? args[args.indexOf('--priority') + 1] : null;

  if (!createDrafts) {
    console.log('To create citation drafts in Sanity, run with --create flag:');
    console.log('  npx tsx scripts/citation-agent.ts --create');
    console.log('  npx tsx scripts/citation-agent.ts --create --limit 5');
    console.log('  npx tsx scripts/citation-agent.ts --create --priority high');
    return;
  }

  // Create citation drafts
  console.log('Creating citation drafts in Sanity...\n');

  let created = 0;
  let skipped = 0;
  let statesProcessed = 0;

  for (const { state, matches } of allMatches) {
    if (limitStates && statesProcessed >= limitStates) break;

    console.log(`\n${state.name}:`);
    statesProcessed++;

    for (const match of matches) {
      // Filter by priority if specified
      if (priorityFilter && match.priority !== priorityFilter) {
        skipped++;
        continue;
      }

      const result = await createCitationDraft(state.name, state.slug, match);
      if (result) {
        created++;
      }
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log(`  COMPLETE: ${created} citation drafts created`);
  if (skipped > 0) {
    console.log(`  Skipped: ${skipped} (filtered by priority)`);
  }
  console.log('  Review drafts at: https://tspm77c6.sanity.studio');
  console.log('═══════════════════════════════════════════════════════════\n');
}

main().catch(console.error);
