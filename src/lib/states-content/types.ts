// State page content types

export interface FAQ {
  question: string;
  answer: string;
}

export interface StateContent {
  slug: string;
  name: string;
  abbreviation: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  heroText: string;

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

  // Notable Verdicts/Settlements
  notableVerdicts: {
    amount: string;
    description: string;
    year: string;
  }[];

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
