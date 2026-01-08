// State page content types

export interface FAQ {
  question: string;
  answer: string;
}

export interface StateImages {
  hero: string;
  heroAlt: string;
  corridor?: string;
  corridorAlt?: string;
}

// Settlement ranges - honest industry data instead of fake verdicts
export interface SettlementRange {
  caseType: 'wrongfulDeath' | 'catastrophicInjury' | 'seriousInjury' | 'moderateInjury';
  minAmount: string;
  maxAmount: string;
  factors: string;
}

// Standard settlement ranges (applies to all states - based on industry data)
export const STANDARD_SETTLEMENT_RANGES: SettlementRange[] = [
  {
    caseType: 'wrongfulDeath',
    minAmount: '$2,000,000',
    maxAmount: '$10,000,000+',
    factors: 'Victim age, number of dependents, lost earning capacity, carrier insurance limits'
  },
  {
    caseType: 'catastrophicInjury',
    minAmount: '$1,000,000',
    maxAmount: '$5,000,000+',
    factors: 'Permanent disability, future medical costs, loss of quality of life'
  },
  {
    caseType: 'seriousInjury',
    minAmount: '$250,000',
    maxAmount: '$1,000,000',
    factors: 'Surgery required, extended recovery, significant lost wages'
  },
  {
    caseType: 'moderateInjury',
    minAmount: '$50,000',
    maxAmount: '$250,000',
    factors: 'Medical treatment needed, some lost work time, ongoing therapy'
  }
];

export const SETTLEMENT_DISCLAIMER = `*Settlement ranges are based on industry data and are provided for informational purposes only. Every case is unique. These figures should not be interpreted as a guarantee or prediction of results. Past outcomes do not guarantee future results. Many factors affect case value including liability, evidence, insurance coverage, and jurisdiction.*`;

export interface StateContent {
  slug: string;
  name: string;
  abbreviation: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  heroText: string;
  images?: StateImages;

  // State-Specific Trucking Laws
  truckingLaws: {
    title: string;
    description: string;
  }[];

  // Major Trucking Corridors
  corridors: {
    name: string;
    description: string;
  }[];

  // Comparative Negligence Rules
  negligenceRule: {
    type: 'pure' | 'modified-50' | 'modified-51' | 'contributory';
    description: string;
    details: string;
  };

  // Statute of Limitations
  statuteOfLimitations: {
    personalInjury: string;
    wrongfulDeath: string;
    propertyDamage: string;
    details: string;
  };

  // State DOT Statistics
  statistics: {
    label: string;
    value: string;
  }[];

  // Local Court Information
  courtInfo: string;

  // Settlement Ranges (uses STANDARD_SETTLEMENT_RANGES if not specified)
  // Replaces fake "notableVerdicts" with honest industry ranges
  settlementRanges?: SettlementRange[];

  // Content freshness
  lastUpdated: string; // ISO date string e.g. "2026-01-08"

  // Why Hire Local
  whyHireLocal: string;

  // FAQs
  faqs: FAQ[];

  // Related content
  neighboringStates: string[]; // slugs
}

// All 50 state slugs (plus DC if desired)
export const STATE_SLUGS = [
  // Tier 1 - 10 highest trucking fatality states
  'texas',
  'california',
  'florida',
  'georgia',
  'pennsylvania',
  'ohio',
  'illinois',
  'north-carolina',
  'tennessee',
  'indiana',
  // Tier 2 - next 10
  'michigan',
  'new-york',
  'arizona',
  'missouri',
  'alabama',
  'louisiana',
  'kentucky',
  'mississippi',
  'oklahoma',
  'arkansas',
  // Tier 3 - next 10
  'south-carolina',
  'virginia',
  'wisconsin',
  'minnesota',
  'colorado',
  'iowa',
  'new-jersey',
  'kansas',
  'maryland',
  'washington',
  // Tier 4 - next 10
  'oregon',
  'new-mexico',
  'nebraska',
  'utah',
  'nevada',
  'west-virginia',
  'idaho',
  'montana',
  'north-dakota',
  'south-dakota',
  // Tier 5 - remaining
  'wyoming',
  'connecticut',
  'massachusetts',
  'maine',
  'new-hampshire',
  'vermont',
  'rhode-island',
  'delaware',
  'alaska',
  'hawaii',
] as const;

export type StateSlug = typeof STATE_SLUGS[number];

// State display names
export const STATE_NAMES: Record<StateSlug, string> = {
  'texas': 'Texas',
  'california': 'California',
  'florida': 'Florida',
  'georgia': 'Georgia',
  'pennsylvania': 'Pennsylvania',
  'ohio': 'Ohio',
  'illinois': 'Illinois',
  'north-carolina': 'North Carolina',
  'tennessee': 'Tennessee',
  'indiana': 'Indiana',
  'michigan': 'Michigan',
  'new-york': 'New York',
  'arizona': 'Arizona',
  'missouri': 'Missouri',
  'alabama': 'Alabama',
  'louisiana': 'Louisiana',
  'kentucky': 'Kentucky',
  'mississippi': 'Mississippi',
  'oklahoma': 'Oklahoma',
  'arkansas': 'Arkansas',
  'south-carolina': 'South Carolina',
  'virginia': 'Virginia',
  'wisconsin': 'Wisconsin',
  'minnesota': 'Minnesota',
  'colorado': 'Colorado',
  'iowa': 'Iowa',
  'new-jersey': 'New Jersey',
  'kansas': 'Kansas',
  'maryland': 'Maryland',
  'washington': 'Washington',
  'oregon': 'Oregon',
  'new-mexico': 'New Mexico',
  'nebraska': 'Nebraska',
  'utah': 'Utah',
  'nevada': 'Nevada',
  'west-virginia': 'West Virginia',
  'idaho': 'Idaho',
  'montana': 'Montana',
  'north-dakota': 'North Dakota',
  'south-dakota': 'South Dakota',
  'wyoming': 'Wyoming',
  'connecticut': 'Connecticut',
  'massachusetts': 'Massachusetts',
  'maine': 'Maine',
  'new-hampshire': 'New Hampshire',
  'vermont': 'Vermont',
  'rhode-island': 'Rhode Island',
  'delaware': 'Delaware',
  'alaska': 'Alaska',
  'hawaii': 'Hawaii',
};

// State abbreviations
export const STATE_ABBREVIATIONS: Record<StateSlug, string> = {
  'texas': 'TX',
  'california': 'CA',
  'florida': 'FL',
  'georgia': 'GA',
  'pennsylvania': 'PA',
  'ohio': 'OH',
  'illinois': 'IL',
  'north-carolina': 'NC',
  'tennessee': 'TN',
  'indiana': 'IN',
  'michigan': 'MI',
  'new-york': 'NY',
  'arizona': 'AZ',
  'missouri': 'MO',
  'alabama': 'AL',
  'louisiana': 'LA',
  'kentucky': 'KY',
  'mississippi': 'MS',
  'oklahoma': 'OK',
  'arkansas': 'AR',
  'south-carolina': 'SC',
  'virginia': 'VA',
  'wisconsin': 'WI',
  'minnesota': 'MN',
  'colorado': 'CO',
  'iowa': 'IA',
  'new-jersey': 'NJ',
  'kansas': 'KS',
  'maryland': 'MD',
  'washington': 'WA',
  'oregon': 'OR',
  'new-mexico': 'NM',
  'nebraska': 'NE',
  'utah': 'UT',
  'nevada': 'NV',
  'west-virginia': 'WV',
  'idaho': 'ID',
  'montana': 'MT',
  'north-dakota': 'ND',
  'south-dakota': 'SD',
  'wyoming': 'WY',
  'connecticut': 'CT',
  'massachusetts': 'MA',
  'maine': 'ME',
  'new-hampshire': 'NH',
  'vermont': 'VT',
  'rhode-island': 'RI',
  'delaware': 'DE',
  'alaska': 'AK',
  'hawaii': 'HI',
};
