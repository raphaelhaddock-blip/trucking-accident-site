/**
 * Page Crawler - Collects all page URLs for the trucking accident site
 * Reads from content sources to build complete URL inventory
 */

import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'https://trucking-accident-site.vercel.app';

export interface PageInfo {
  url: string;
  path: string;
  type: 'static' | 'accident' | 'state' | 'city' | 'blog';
  slug: string;
  parentSlug?: string;
  wordThreshold: number;
}

// Static pages
const STATIC_PAGES: Omit<PageInfo, 'url'>[] = [
  { path: '/', type: 'static', slug: 'home', wordThreshold: 500 },
  { path: '/about', type: 'static', slug: 'about', wordThreshold: 500 },
  { path: '/about/team', type: 'static', slug: 'team', wordThreshold: 300 },
  { path: '/contact', type: 'static', slug: 'contact', wordThreshold: 300 },
  { path: '/accidents', type: 'static', slug: 'accidents-index', wordThreshold: 500 },
  { path: '/states', type: 'static', slug: 'states-index', wordThreshold: 500 },
  { path: '/blog', type: 'static', slug: 'blog-index', wordThreshold: 300 },
  { path: '/fmcsa-regulations', type: 'static', slug: 'fmcsa', wordThreshold: 2000 },
  { path: '/privacy', type: 'static', slug: 'privacy', wordThreshold: 500 },
  { path: '/terms', type: 'static', slug: 'terms', wordThreshold: 500 },
  { path: '/disclaimer', type: 'static', slug: 'disclaimer', wordThreshold: 500 },
];

// Accident types (20 pages)
const ACCIDENT_SLUGS = [
  'jackknife-accidents',
  'rollover-accidents',
  'underride-accidents',
  'rear-end-collisions',
  'head-on-collisions',
  't-bone-accidents',
  'wide-turn-accidents',
  'blind-spot-accidents',
  'sideswipe-accidents',
  'override-accidents',
  'brake-failure',
  'tire-blowout',
  'driver-fatigue',
  'distracted-driving',
  'speeding-accidents',
  'cargo-spill-accidents',
  'hazmat-accidents',
  'drunk-driving',
  'runaway-truck',
  'improper-maintenance',
];

// Blog slugs
const BLOG_SLUGS = [
  'what-to-do-after-truck-accident',
  'underride-truck-accidents',
  'truck-accident-settlement-amounts',
  'fmcsa-violations-truck-accidents',
  'when-to-hire-truck-accident-lawyer',
];

// State slugs (all 50 states)
const STATE_SLUGS = [
  'alabama', 'alaska', 'arizona', 'arkansas', 'california',
  'colorado', 'connecticut', 'delaware', 'florida', 'georgia',
  'hawaii', 'idaho', 'illinois', 'indiana', 'iowa',
  'kansas', 'kentucky', 'louisiana', 'maine', 'maryland',
  'massachusetts', 'michigan', 'minnesota', 'mississippi', 'missouri',
  'montana', 'nebraska', 'nevada', 'new-hampshire', 'new-jersey',
  'new-mexico', 'new-york', 'north-carolina', 'north-dakota', 'ohio',
  'oklahoma', 'oregon', 'pennsylvania', 'rhode-island', 'south-carolina',
  'south-dakota', 'tennessee', 'texas', 'utah', 'vermont',
  'virginia', 'washington', 'west-virginia', 'wisconsin', 'wyoming',
];

/**
 * Get all city data from the FARS data file
 */
function getCityData(): Array<{ stateSlug: string; citySlug: string }> {
  const dataPath = path.join(process.cwd(), 'scripts', 'city-accident-data.json');

  if (!fs.existsSync(dataPath)) {
    console.warn('Warning: city-accident-data.json not found, skipping city pages');
    return [];
  }

  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const cities: Array<{ stateSlug: string; citySlug: string }> = [];

  // New format: { states: { alabama: { cities: [...] } } }
  if (data.states) {
    for (const [stateSlug, stateData] of Object.entries(data.states)) {
      const state = stateData as { cities?: Array<{ slug: string }> };
      if (state.cities && Array.isArray(state.cities)) {
        for (const city of state.cities) {
          if (city.slug) {
            cities.push({ stateSlug, citySlug: city.slug });
          }
        }
      }
    }
  } else {
    // Old format: { alabama: [...cities] }
    for (const [stateSlug, cityList] of Object.entries(data)) {
      if (Array.isArray(cityList)) {
        for (const city of cityList) {
          if (city.slug) {
            cities.push({ stateSlug, citySlug: city.slug });
          }
        }
      }
    }
  }

  return cities;
}

/**
 * Get all pages for the site
 */
export function getAllPages(): PageInfo[] {
  const pages: PageInfo[] = [];

  // Static pages
  for (const page of STATIC_PAGES) {
    pages.push({
      ...page,
      url: `${BASE_URL}${page.path}`,
    });
  }

  // Accident pages
  for (const slug of ACCIDENT_SLUGS) {
    pages.push({
      url: `${BASE_URL}/accidents/${slug}`,
      path: `/accidents/${slug}`,
      type: 'accident',
      slug,
      wordThreshold: 3000,
    });
  }

  // State pages
  for (const slug of STATE_SLUGS) {
    pages.push({
      url: `${BASE_URL}/states/${slug}`,
      path: `/states/${slug}`,
      type: 'state',
      slug,
      wordThreshold: 2500,
    });
  }

  // Blog pages
  for (const slug of BLOG_SLUGS) {
    pages.push({
      url: `${BASE_URL}/blog/${slug}`,
      path: `/blog/${slug}`,
      type: 'blog',
      slug,
      wordThreshold: 800,
    });
  }

  // City pages
  const cities = getCityData();
  for (const { stateSlug, citySlug } of cities) {
    pages.push({
      url: `${BASE_URL}/states/${stateSlug}/${citySlug}`,
      path: `/states/${stateSlug}/${citySlug}`,
      type: 'city',
      slug: citySlug,
      parentSlug: stateSlug,
      wordThreshold: 2000,
    });
  }

  return pages;
}

/**
 * Get pages by type
 */
export function getPagesByType(type: PageInfo['type']): PageInfo[] {
  return getAllPages().filter(p => p.type === type);
}

/**
 * Get page count summary
 */
export function getPageSummary(): Record<string, number> {
  const pages = getAllPages();
  const summary: Record<string, number> = {
    total: pages.length,
    static: 0,
    accident: 0,
    state: 0,
    city: 0,
    blog: 0,
  };

  for (const page of pages) {
    summary[page.type]++;
  }

  return summary;
}

// CLI execution
import { fileURLToPath } from 'url';

const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);
if (isMainModule) {
  const summary = getPageSummary();
  console.log('\n📊 Page Inventory Summary\n');
  console.log(`  Static pages:   ${summary.static}`);
  console.log(`  Accident pages: ${summary.accident}`);
  console.log(`  State pages:    ${summary.state}`);
  console.log(`  City pages:     ${summary.city}`);
  console.log(`  Blog posts:     ${summary.blog}`);
  console.log(`  ─────────────────`);
  console.log(`  TOTAL:          ${summary.total}\n`);
}
