/**
 * Agent System Types
 *
 * Defines all interfaces for the city content enhancement agent system.
 */

// =============================================================================
// CITY DATA TYPES
// =============================================================================

export interface CityInput {
  slug: string;
  name: string;
  stateSlug: string;
  stateName: string;
  population: number;
  truckFatalities: number;
  fatalCrashes: number;
  countyName: string;
  dangerousRoads: string[];
  lat: number;
  lng: number;
}

// =============================================================================
// AGENT OUTPUT TYPES
// =============================================================================

export interface HistoryAgentOutput {
  citySlug: string;
  cityHistory: string;           // 150-200 words on city's trucking relevance
  foundingYear?: number;
  keyHistoricalFacts: string[];
  truckingRelevance: string;     // Why trucks matter to this city
  sources: string[];
  confidenceScore: number;       // 0-100
  needsHumanReview: boolean;
}

export interface IndustryAgentOutput {
  citySlug: string;
  majorIndustries: string[];
  economicContext: string;       // 100 words on local economy
  truckingDependentIndustries: string[];
  majorEmployers: string[];
  logisticsHubs: string[];       // Distribution centers, ports, etc.
  sources: string[];
  confidenceScore: number;
  needsHumanReview: boolean;
}

export interface NewsAgentOutput {
  citySlug: string;
  recentAccidents: Array<{
    date: string;
    headline: string;
    summary: string;             // 50-100 words
    source: string;
    sourceUrl: string;
    verified: boolean;
  }>;
  accidentNarratives: string;    // Combined narrative of recent accidents
  sources: string[];
  confidenceScore: number;
  needsHumanReview: boolean;
}

export interface StatisticsAgentOutput {
  citySlug: string;
  accidentTrends: {
    year2020: { fatalities: number; crashes: number } | null;
    year2021: { fatalities: number; crashes: number } | null;
    year2022: { fatalities: number; crashes: number };
    trend: 'increasing' | 'decreasing' | 'stable' | 'insufficient_data';
    percentChange: number | null;
    trendDescription: string;
  };
  stateComparison: {
    cityPercentOfState: number;
    stateRank: number | null;
    aboveOrBelowAverage: string;
  };
  sources: string[];
  confidenceScore: number;
  needsHumanReview: boolean;
}

export interface WeatherAgentOutput {
  citySlug: string;
  weatherHazards: {
    primaryHazard: string;       // "Winter ice", "Summer heat", "Fog", etc.
    secondaryHazards: string[];
    description: string;         // How it affects trucking
    dangerousMonths: string[];
    averageTemperatures: {
      summer: number;
      winter: number;
    };
  };
  climateZone: string;
  annualPrecipitation: number;
  sources: string[];
  confidenceScore: number;
  needsHumanReview: boolean;
}

export interface RoadsAgentOutput {
  citySlug: string;
  dangerousRoads: Array<{
    name: string;
    description: string;         // 100+ words, specific to this road
    annualTruckTraffic: string;
    knownHazards: string[];
    recentIncidents: string;
    milesInCity: number;
    connectsTo: string[];
  }>;
  majorCorridors: string[];
  truckRouteRestrictions: string[];
  sources: string[];
  confidenceScore: number;
  needsHumanReview: boolean;
}

export interface LegalAgentOutput {
  citySlug: string;
  localCourts: {
    stateCourt: string;
    federalCourt: string;
    venueNotes: string;
    jurisdictionDetails: string;
  };
  notableVerdicts: Array<{
    year: number;
    amount: string;
    caseType: string;
    summary: string;
  }>;
  localLegalContext: string;
  sources: string[];
  confidenceScore: number;
  needsHumanReview: boolean;
}

// =============================================================================
// MERGED OUTPUT TYPE
// =============================================================================

export interface EnhancedCityContent {
  // Metadata
  slug: string;
  name: string;
  stateSlug: string;
  stateName: string;
  population: number;
  countyName: string;

  // SEO
  metaTitle: string;
  metaDescription: string;
  h1: string;

  // City Context (from History + Industry agents)
  cityHistory: string;
  majorIndustries: string[];
  economicContext: string;
  truckingRelevance: string;

  // Extended Content Sections (for 2000+ word target)
  whyDangerous: string;          // Why trucking is dangerous here
  liabilityExplanation: string;  // Who can be held liable
  evidencePreservation: string;  // How to preserve evidence
  fmcsaRegulations: string;      // Federal regulations overview

  // Hero Section
  heroText: string;

  // Statistics (from Statistics agent)
  accidentStats: {
    truckFatalities: number;
    fatalCrashes: number;
    dataYear: number;
    yearOverYearChange: string;
    comparisonToState: string;
    sourceUrl: string;
  };
  accidentTrends: {
    year2020: { fatalities: number; crashes: number } | null;
    year2021: { fatalities: number; crashes: number } | null;
    year2022: { fatalities: number; crashes: number };
    trend: string;
    percentChange: number | null;
    trendDescription: string;
  };

  // Recent Accidents (from News agent)
  recentAccidents: Array<{
    date: string;
    headline: string;
    summary: string;
    source: string;
    sourceUrl: string;
  }>;

  // Weather (from Weather agent)
  weatherHazards: {
    primaryHazard: string;
    secondaryHazards: string[];
    description: string;
    dangerousMonths: string[];
  };

  // Roads (from Roads agent)
  dangerousRoads: Array<{
    name: string;
    description: string;
    annualTruckTraffic: string;
    knownHazards: string[];
    recentIncidents: string;
    milesInCity: number;
  }>;

  // Common Accidents (enhanced with local factors)
  commonAccidents: Array<{
    type: string;
    percentage: string;
    localFactor: string;
  }>;

  // Trucking Industry Context
  truckingIndustry: string;

  // Legal (from Legal agent)
  legalInfo: string;
  localCourts: {
    stateCourt: string;
    federalCourt: string;
    venueNotes: string;
  };

  // FAQs (unique per city)
  faqs: Array<{
    question: string;
    answer: string;
  }>;

  // Quality Metrics
  wordCount: number;
  uniquenessScore: number;
  sources: string[];
  lastEnhanced: string;
  agentVersion: string;
}

// =============================================================================
// BATCH PROCESSING TYPES
// =============================================================================

export interface BatchCity {
  slug: string;
  name: string;
  stateSlug: string;
  stateName: string;
  population: number;
  truckFatalities: number;
}

export interface Batch {
  batch: number;
  priority: 'critical' | 'high' | 'medium' | 'standard';
  cityCount: number;
  totalPopulation: number;
  totalFatalities: number;
  cities: BatchCity[];
}

export interface BatchResult {
  batchNumber: number;
  processedAt: string;
  citiesProcessed: number;
  citiesSucceeded: number;
  citiesFailed: number;
  averageWordCount: number;
  averageUniquenessScore: number;
  results: Array<{
    city: string;
    state: string;
    success: boolean;
    wordCount: number;
    uniquenessScore: number;
    needsHumanReview: boolean;
    error?: string;
  }>;
}

export interface QualityMetrics {
  wordCount: number;
  uniquenessScore: number;
  readabilityScore: number;
  factualClaims: number;
  sourcesCount: number;
  faqUniqueness: number;
  passesThreshold: boolean;
}

// =============================================================================
// AGENT CONFIGURATION
// =============================================================================

export interface AgentConfig {
  name: string;
  timeout: number;
  retries: number;
  requiredConfidence: number;
}

export const AGENT_CONFIGS: Record<string, AgentConfig> = {
  history: {
    name: 'History Agent',
    timeout: 60000,
    retries: 2,
    requiredConfidence: 70,
  },
  industry: {
    name: 'Industry Agent',
    timeout: 60000,
    retries: 2,
    requiredConfidence: 70,
  },
  news: {
    name: 'News Agent',
    timeout: 90000,
    retries: 3,
    requiredConfidence: 60,
  },
  statistics: {
    name: 'Statistics Agent',
    timeout: 30000,
    retries: 2,
    requiredConfidence: 90,
  },
  weather: {
    name: 'Weather Agent',
    timeout: 30000,
    retries: 2,
    requiredConfidence: 85,
  },
  roads: {
    name: 'Roads Agent',
    timeout: 60000,
    retries: 2,
    requiredConfidence: 75,
  },
  legal: {
    name: 'Legal Agent',
    timeout: 60000,
    retries: 2,
    requiredConfidence: 80,
  },
};
