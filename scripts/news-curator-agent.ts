/**
 * News Curator Agent - Phase 4 of Editorial Agent System
 *
 * Scans RSS feeds for trucking accidents and creates
 * news article drafts in Sanity for manual curation.
 *
 * Run with: npx tsx scripts/news-curator-agent.ts
 */

import { createClient } from '@sanity/client';
import { parseStringPromise } from 'xml2js';

// Sanity client configuration
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'tspm77c6',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

// RSS feed sources
const RSS_FEEDS = [
  {
    name: 'Google News - Truck Accident',
    url: 'https://news.google.com/rss/search?q=truck+accident+fatality&hl=en-US&gl=US&ceid=US:en',
    type: 'google-news',
  },
  {
    name: 'Google News - Semi Truck Crash',
    url: 'https://news.google.com/rss/search?q=semi+truck+crash&hl=en-US&gl=US&ceid=US:en',
    type: 'google-news',
  },
  {
    name: 'Google News - 18 Wheeler Accident',
    url: 'https://news.google.com/rss/search?q=18+wheeler+accident&hl=en-US&gl=US&ceid=US:en',
    type: 'google-news',
  },
  {
    name: 'Google News - Tractor Trailer Crash',
    url: 'https://news.google.com/rss/search?q=tractor+trailer+crash&hl=en-US&gl=US&ceid=US:en',
    type: 'google-news',
  },
];

// State name patterns for location detection
// Note: Avoiding 2-letter abbreviations that match common words (IN, OR, ME, etc.)
const STATE_PATTERNS: Record<string, RegExp> = {
  alabama: /\balabama\b/i,
  alaska: /\balaska\b/i,
  arizona: /\b(arizona|, AZ\b)/i,
  arkansas: /\b(arkansas|, AR\b)/i,
  california: /\b(california|, CA\b)/i,
  colorado: /\b(colorado|, CO\b)/i,
  connecticut: /\b(connecticut|, CT\b)/i,
  delaware: /\bdelaware\b/i,
  florida: /\b(florida|, FL\b)/i,
  georgia: /\b(georgia|, GA\b)/i,
  hawaii: /\bhawaii\b/i,
  idaho: /\bidaho\b/i,
  illinois: /\b(illinois|, IL\b)/i,
  indiana: /\bindiana\b/i,
  iowa: /\biowa\b/i,
  kansas: /\bkansas\b/i,
  kentucky: /\b(kentucky|, KY\b)/i,
  louisiana: /\b(louisiana|, LA\b)/i,
  maine: /\bmaine\b/i,
  maryland: /\b(maryland|, MD\b)/i,
  massachusetts: /\bmassachusetts\b/i,
  michigan: /\b(michigan|, MI\b)/i,
  minnesota: /\b(minnesota|, MN\b)/i,
  mississippi: /\bmississippi\b/i,
  missouri: /\b(missouri|, MO\b)/i,
  montana: /\bmontana\b/i,
  nebraska: /\bnebraska\b/i,
  nevada: /\b(nevada|, NV\b)/i,
  'new-hampshire': /\bnew hampshire\b/i,
  'new-jersey': /\b(new jersey|, NJ\b)/i,
  'new-mexico': /\bnew mexico\b/i,
  'new-york': /\b(new york|, NY\b)/i,
  'north-carolina': /\b(north carolina|, NC\b)/i,
  'north-dakota': /\bnorth dakota\b/i,
  ohio: /\bohio\b/i,
  oklahoma: /\boklahoma\b/i,
  oregon: /\boregon\b/i,
  pennsylvania: /\b(pennsylvania|, PA\b)/i,
  'rhode-island': /\brhode island\b/i,
  'south-carolina': /\b(south carolina|, SC\b)/i,
  'south-dakota': /\bsouth dakota\b/i,
  tennessee: /\b(tennessee|, TN\b)/i,
  texas: /\b(texas|, TX\b)/i,
  utah: /\butah\b/i,
  vermont: /\bvermont\b/i,
  virginia: /\bvirginia\b/i,
  washington: /\bwashington state\b/i,
  'west-virginia': /\bwest virginia\b/i,
  wisconsin: /\bwisconsin\b/i,
  wyoming: /\bwyoming\b/i,
};

// Accident type patterns
const ACCIDENT_TYPE_PATTERNS: Record<string, { pattern: RegExp; slug: string }> = {
  jackknife: { pattern: /\bjackknife[d]?\b/i, slug: 'jackknife-accidents' },
  rollover: { pattern: /\broll(over|ed over)\b/i, slug: 'rollover-accidents' },
  underride: { pattern: /\bunderride\b/i, slug: 'underride-accidents' },
  'rear-end': { pattern: /\brear[- ]?end(ed)?\b/i, slug: 'rear-end-collisions' },
  'head-on': { pattern: /\bhead[- ]?on\b/i, slug: 'head-on-collisions' },
  'wide-turn': { pattern: /\bwide turn\b/i, slug: 'wide-turn-accidents' },
  'blind-spot': { pattern: /\bblind[- ]?spot\b/i, slug: 'blind-spot-accidents' },
  'tire-blowout': { pattern: /\b(tire|tyre) blowout\b/i, slug: 'tire-blowout-accidents' },
  'brake-failure': { pattern: /\bbrake[s]? fail(ure|ed)?\b/i, slug: 'brake-failure-accidents' },
  'cargo-spill': { pattern: /\bcargo (spill|shift)\b/i, slug: 'cargo-spill-accidents' },
  hazmat: { pattern: /\b(hazmat|hazardous material)\b/i, slug: 'hazmat-accidents' },
  pileup: { pattern: /\b(pile[- ]?up|multi[- ]?vehicle)\b/i, slug: 'multi-vehicle-pileups' },
};

// Severity indicators
const SEVERITY_PATTERNS = {
  fatal: /\b(fatal|killed|dead|death|died)\b/i,
  multipleFatalities: /\b(\d+)\s+(killed|dead|deaths|fatalities)\b/i,
  serious: /\b(serious|critical|severe|life[- ]?threatening)\b/i,
  injuries: /\b(\d+)\s+(injured|injuries|hurt)\b/i,
};

interface RSSItem {
  title: string;
  link: string;
  description?: string;
  pubDate: string;
  source?: string;
}

interface ScoredArticle {
  title: string;
  link: string;
  description: string;
  pubDate: Date;
  source: string;
  score: number;
  state?: string;
  accidentType?: string;
  fatalities?: number;
  injuries?: number;
  scoreBreakdown: string[];
}

/**
 * Fetch and parse an RSS feed
 */
async function fetchRSSFeed(feedUrl: string): Promise<RSSItem[]> {
  try {
    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NewsCurator/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const xml = await response.text();
    const result = await parseStringPromise(xml);

    const items: RSSItem[] = [];
    const channel = result.rss?.channel?.[0];

    if (channel?.item) {
      for (const item of channel.item) {
        items.push({
          title: item.title?.[0] || '',
          link: item.link?.[0] || '',
          description: item.description?.[0] || '',
          pubDate: item.pubDate?.[0] || '',
          source: item.source?.[0]?._ || item.source?.[0] || '',
        });
      }
    }

    return items;
  } catch (error) {
    console.error(`Error fetching ${feedUrl}:`, error);
    return [];
  }
}

/**
 * Score an article for relevance
 */
function scoreArticle(item: RSSItem): ScoredArticle {
  const text = `${item.title} ${item.description || ''}`;
  let score = 0;
  const breakdown: string[] = [];

  // Detect state
  let detectedState: string | undefined;
  for (const [state, pattern] of Object.entries(STATE_PATTERNS)) {
    if (pattern.test(text)) {
      detectedState = state;
      score += 10;
      breakdown.push(`+10 State match: ${state}`);
      break;
    }
  }

  // Detect accident type
  let detectedAccidentType: string | undefined;
  for (const [type, { pattern, slug }] of Object.entries(ACCIDENT_TYPE_PATTERNS)) {
    if (pattern.test(text)) {
      detectedAccidentType = slug;
      score += 15;
      breakdown.push(`+15 Accident type: ${type}`);
      break;
    }
  }

  // Check for fatalities
  let fatalities: number | undefined;
  if (SEVERITY_PATTERNS.fatal.test(text)) {
    score += 25;
    breakdown.push('+25 Fatal accident');

    const multiMatch = text.match(SEVERITY_PATTERNS.multipleFatalities);
    if (multiMatch) {
      fatalities = parseInt(multiMatch[1]);
      if (fatalities > 1) {
        score += fatalities * 10;
        breakdown.push(`+${fatalities * 10} Multiple fatalities (${fatalities})`);
      }
    } else {
      fatalities = 1;
    }
  }

  // Check for injuries
  let injuries: number | undefined;
  const injuryMatch = text.match(SEVERITY_PATTERNS.injuries);
  if (injuryMatch) {
    injuries = parseInt(injuryMatch[1]);
    score += Math.min(injuries * 2, 20);
    breakdown.push(`+${Math.min(injuries * 2, 20)} Injuries (${injuries})`);
  }

  // Check for serious/critical
  if (SEVERITY_PATTERNS.serious.test(text)) {
    score += 10;
    breakdown.push('+10 Serious/critical');
  }

  // Bonus for truck-specific terms
  if (/\b(18[- ]?wheeler|semi[- ]?truck|tractor[- ]?trailer|big[- ]?rig)\b/i.test(text)) {
    score += 5;
    breakdown.push('+5 Truck-specific terms');
  }

  // Bonus for FMCSA/DOT mentions
  if (/\b(FMCSA|DOT|hours of service|ELD|logbook)\b/i.test(text)) {
    score += 15;
    breakdown.push('+15 FMCSA/DOT mention');
  }

  // Penalty for irrelevant content
  if (/\b(pickup truck|light truck|food truck|monster truck)\b/i.test(text)) {
    score -= 50;
    breakdown.push('-50 Not commercial truck');
  }

  return {
    title: item.title,
    link: item.link,
    description: item.description || '',
    pubDate: new Date(item.pubDate),
    source: item.source || 'Unknown',
    score,
    state: detectedState,
    accidentType: detectedAccidentType,
    fatalities,
    injuries,
    scoreBreakdown: breakdown,
  };
}

/**
 * Create a news article draft in Sanity
 */
async function createNewsArticleDraft(article: ScoredArticle): Promise<string | null> {
  try {
    // Generate slug from title
    const slug = article.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 80);

    // Create summary as Portable Text blocks
    const summaryBlocks = [
      {
        _type: 'block',
        _key: 'summary1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span1',
            text: article.description || article.title,
          },
        ],
      },
      {
        _type: 'block',
        _key: 'summary2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span2',
            text: '[Full article content to be added during review]',
          },
        ],
      },
    ];

    const doc = {
      _type: 'newsArticle',
      headline: article.title.substring(0, 100),
      slug: { current: slug },
      eventDate: article.pubDate.toISOString().split('T')[0],
      location: {
        state: article.state
          ? article.state.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
          : 'Unknown',
      },
      accidentType: article.accidentType || 'other',
      casualties: {
        fatalities: article.fatalities || 0,
        injuries: article.injuries || 0,
      },
      summary: summaryBlocks,
      sources: [
        {
          _key: 'source1',
          title: article.source || 'News Source',
          url: article.link,
        },
      ],
      status: 'needs-review',
      seo: {
        metaTitle: article.title.substring(0, 60),
        metaDescription: article.description?.substring(0, 160) || '',
      },
    };

    const result = await sanityClient.create(doc);
    return result._id;
  } catch (error) {
    console.error('Error creating news article draft:', error);
    return null;
  }
}

/**
 * Check if article already exists in Sanity (by similar headline)
 */
async function articleExists(headline: string): Promise<boolean> {
  try {
    const query = `count(*[_type == "newsArticle" && headline match $headline])`;
    const count = await sanityClient.fetch<number>(query, {
      headline: headline.substring(0, 50) + '*',
    });
    return count > 0;
  } catch {
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  NEWS CURATOR AGENT - Phase 4 Editorial System');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Check for API token
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error('Error: SANITY_API_WRITE_TOKEN not set');
    process.exit(1);
  }

  // Fetch all RSS feeds
  console.log('Fetching RSS feeds...\n');
  const allArticles: ScoredArticle[] = [];
  const seenUrls = new Set<string>();

  for (const feed of RSS_FEEDS) {
    console.log(`  ${feed.name}...`);
    const items = await fetchRSSFeed(feed.url);
    console.log(`    Found ${items.length} items`);

    for (const item of items) {
      // Deduplicate by URL
      if (seenUrls.has(item.link)) continue;
      seenUrls.add(item.link);

      const scored = scoreArticle(item);
      if (scored.score > 0) {
        allArticles.push(scored);
      }
    }
  }

  // Sort by score
  allArticles.sort((a, b) => b.score - a.score);

  // Display results
  console.log('\n───────────────────────────────────────────────────────────');
  console.log('  TOP SCORED ARTICLES');
  console.log('───────────────────────────────────────────────────────────\n');

  const topArticles = allArticles.slice(0, 20);

  for (const article of topArticles) {
    const stateTag = article.state ? `[${article.state.toUpperCase()}]` : '';
    const typeTag = article.accidentType ? `[${article.accidentType}]` : '';
    const fatalTag = article.fatalities ? `[${article.fatalities} fatal]` : '';

    console.log(`Score: ${article.score} ${stateTag} ${typeTag} ${fatalTag}`);
    console.log(`  ${article.title.substring(0, 80)}...`);
    console.log(`  Source: ${article.source}`);
    console.log(`  ${article.scoreBreakdown.join(', ')}`);
    console.log('');
  }

  console.log('───────────────────────────────────────────────────────────');
  console.log(`Total relevant articles: ${allArticles.length}`);
  console.log(`Top 20 shown above`);
  console.log('───────────────────────────────────────────────────────────\n');

  // Create drafts if requested
  const args = process.argv.slice(2);
  const createDrafts = args.includes('--create') || args.includes('-c');
  const limit = args.includes('--limit')
    ? parseInt(args[args.indexOf('--limit') + 1]) || 5
    : 5;
  const minScore = args.includes('--min-score')
    ? parseInt(args[args.indexOf('--min-score') + 1]) || 30
    : 30;

  if (!createDrafts) {
    console.log('To create news article drafts in Sanity, run with --create flag:');
    console.log('  npx tsx scripts/news-curator-agent.ts --create');
    console.log('  npx tsx scripts/news-curator-agent.ts --create --limit 10');
    console.log('  npx tsx scripts/news-curator-agent.ts --create --min-score 50');
    return;
  }

  // Filter by minimum score and create drafts
  const eligibleArticles = topArticles.filter(a => a.score >= minScore);
  const articlesToCreate = eligibleArticles.slice(0, limit);

  console.log(`Creating ${articlesToCreate.length} news article drafts (min score: ${minScore})...\n`);

  let created = 0;
  let skipped = 0;

  for (const article of articlesToCreate) {
    // Check if already exists
    const exists = await articleExists(article.title);
    if (exists) {
      console.log(`  ⏭ Skipped (exists): ${article.title.substring(0, 50)}...`);
      skipped++;
      continue;
    }

    const id = await createNewsArticleDraft(article);
    if (id) {
      console.log(`  ✓ Created: ${article.title.substring(0, 50)}...`);
      created++;
    } else {
      console.log(`  ✗ Failed: ${article.title.substring(0, 50)}...`);
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log(`  COMPLETE: ${created} news drafts created, ${skipped} skipped`);
  console.log('  Review drafts at: https://tspm77c6.sanity.studio');
  console.log('═══════════════════════════════════════════════════════════\n');
}

main().catch(console.error);
