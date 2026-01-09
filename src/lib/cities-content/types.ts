/**
 * City Content Types
 *
 * Defines the structure for city-specific truck accident pages
 */

export interface CityAccidentStats {
  truckFatalities: number;
  fatalCrashes: number;
  dataYear: number;
  yearOverYearChange?: string;
  comparisonToState?: string;
  sourceUrl: string;
}

export interface DangerousRoad {
  name: string;
  description: string;
  accidentCount?: number;
  milesInCity?: number;
}

export interface CommonAccidentType {
  type: string;
  percentage?: string;
  localFactor: string;
}

export interface CityFAQ {
  question: string;
  answer: string;
}

export interface CityImages {
  hero: string;      // Sanity CDN URL
  heroAlt: string;   // Descriptive alt text
}

export interface CityGeo {
  latitude: number;
  longitude: number;
}

export interface CityContent {
  // Identifiers
  slug: string;
  name: string;
  stateSlug: string;
  stateName: string;
  population: number;

  // SEO
  metaTitle: string;
  metaDescription: string;
  h1: string;

  // Hero
  heroText: string;

  // Accident Statistics (from NHTSA FARS)
  accidentStats: CityAccidentStats;

  // Dangerous Roads & Corridors
  dangerousRoads: DangerousRoad[];

  // Common Accident Types
  commonAccidents: CommonAccidentType[];

  // Local Trucking Industry
  truckingIndustry: string;

  // Legal Information
  legalInfo: string;

  // FAQs
  faqs: CityFAQ[];

  // Freshness
  lastUpdated: string;

  // Images (optional - fallback to state image if not set)
  images?: CityImages;

  // Geo coordinates for Google Maps schema
  geo?: CityGeo;
}

/**
 * Minimal city data structure from the FARS collector
 */
export interface CityAccidentData {
  slug: string;
  name: string;
  stateSlug: string;
  stateName: string;
  population: number;
  truckFatalities: number;
  fatalCrashes: number;
  dataYear: number;
  dangerousRoads: string[];
  sourceUrl: string;
}

/**
 * State summary from the FARS collector
 */
export interface StateCitySummary {
  stateSlug: string;
  stateName: string;
  cityCount: number;
  totalFatalities: number;
  cities: string[];
}
