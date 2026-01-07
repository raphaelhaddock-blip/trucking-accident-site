// Accident page content types

export interface FAQ {
  question: string;
  answer: string;
}

export interface AccidentImages {
  hero: string;
  heroAlt: string;
  diagram?: string;
  diagramAlt?: string;
}

export interface AccidentContent {
  slug: string;
  title: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  heroText: string;
  images?: AccidentImages;

  // What It Is section
  whatItIs: string;

  // Causes section
  causes: {
    title: string;
    description: string;
  }[];

  // FMCSA Regulations section
  fmcsaRegulations: {
    code: string;
    title: string;
    description: string;
  }[];

  // Injuries section
  injuries: {
    type: string;
    description: string;
  }[];

  // Liability section
  liableParties: {
    party: string;
    description: string;
  }[];

  // Evidence section
  evidence: string[];

  // Compensation section
  compensation: string[];

  // What To Do section
  whatToDo: string[];

  // FAQs
  faqs: FAQ[];

  // Related content
  relatedAccidents: string[]; // slugs
  relatedStates: string[]; // slugs
}

// All 20 accident type slugs
export const ACCIDENT_SLUGS = [
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
] as const;

export type AccidentSlug = typeof ACCIDENT_SLUGS[number];

// Accident type display names
export const ACCIDENT_NAMES: Record<AccidentSlug, string> = {
  'jackknife-accidents': 'Jackknife Accidents',
  'rollover-accidents': 'Rollover Accidents',
  'underride-accidents': 'Underride Accidents',
  'rear-end-collisions': 'Rear-End Collisions',
  'head-on-collisions': 'Head-On Collisions',
  't-bone-accidents': 'T-Bone Accidents',
  'wide-turn-accidents': 'Wide Turn Accidents',
  'blind-spot-accidents': 'Blind Spot Accidents',
  'sideswipe-accidents': 'Sideswipe Accidents',
  'override-accidents': 'Override Accidents',
  'brake-failure': 'Brake Failure',
  'tire-blowout': 'Tire Blowout',
  'driver-fatigue': 'Driver Fatigue',
  'distracted-driving': 'Distracted Driving',
  'speeding-accidents': 'Speeding Accidents',
  'cargo-spill-accidents': 'Cargo Spill Accidents',
  'hazmat-accidents': 'Hazmat Accidents',
  'drunk-driving': 'Drunk Driving',
  'runaway-truck': 'Runaway Truck',
  'improper-maintenance': 'Improper Maintenance',
};
