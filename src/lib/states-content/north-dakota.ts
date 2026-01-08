import { StateContent } from './types';

export const northDakota: StateContent = {
  slug: 'north-dakota',
  name: 'North Dakota',
  abbreviation: 'ND',
  h1: 'North Dakota Truck Injury Lawyers',
  metaTitle: 'North Dakota Truck Accident Lawyers | 18-Wheeler Attorneys',
  metaDescription: 'Injured in a North Dakota truck accident? Our attorneys fight for victims across ND. Free consultation. No fee unless you win.',

  heroText: `North Dakota's energy industry and agricultural economy create significant commercial truck traffic despite the state's sparse population. With over 25 people killed annually in collisions involving large trucks, North Dakota highways see devastating accidents.

The North Dakota trucking industry has grown substantially with the Bakken oil field development. Over 30,000 commercial trucks are registered, operating on I-94 (east-west corridor), I-29 (eastern border), and US Highway 85 through the oil patch.

The Bakken oil field in western North Dakota has created intense industrial truck traffic. Oil field equipment, tanker trucks, and service vehicles share rural highways with agricultural traffic. Severe winter weather adds additional hazards.

North Dakota follows modified comparative negligence with a 50% bar, meaning you can recover damages if you are 50% or less at fault. The state has a six-year statute of limitations for personal injury claims—the longest in the nation.

If you've been injured in a North Dakota truck accident, our North Dakota truck accident lawyers know how to preserve evidence and hold negligent carriers accountable.`,

  truckingLaws: [
    {
      title: 'North Dakota Commercial Vehicle Regulations',
      description: `North Dakota regulates commercial vehicles under North Dakota Century Code Chapter 39. This includes size and weight limits enforced by the North Dakota Highway Patrol.`
    },
    {
      title: 'North Dakota Hours of Service Enforcement',
      description: `North Dakota actively enforces federal Hours of Service regulations through the North Dakota Highway Patrol. The state conducts inspections throughout the highway system.`
    },
    {
      title: 'North Dakota CDL Requirements',
      description: `The North Dakota DOT issues Commercial Driver's Licenses under federal standards with state-specific testing.`
    },
    {
      title: 'North Dakota Drug and Alcohol Testing',
      description: `North Dakota enforces federal drug and alcohol testing requirements. DUI laws apply to commercial drivers with a lower BAC threshold of 0.04%.`
    },
    {
      title: 'North Dakota Oil Field Trucking',
      description: `The Bakken oil field has specific regulations for oilfield equipment and hazmat transport. Oil field service traffic requires compliance with state and federal regulations.`
    },
    {
      title: 'North Dakota Winter Trucking',
      description: `North Dakota's severe winters require specific preparations. The state can close highways during blizzards and extreme cold.`
    }
  ],

  corridors: [
    {
      name: 'Interstate 94 (I-94)',
      description: `Major east-west corridor from Minnesota through Fargo and Bismarck to Montana. This route is critical for cross-state freight and oil field supply.`
    },
    {
      name: 'Interstate 29 (I-29)',
      description: `Eastern north-south route along the Minnesota border from South Dakota to Canada. This corridor serves agricultural freight and border trade.`
    },
    {
      name: 'US Highway 2',
      description: `Northern route across the state, serving agricultural communities.`
    },
    {
      name: 'US Highway 85',
      description: `Western route serving the Bakken oil field region with heavy industrial truck traffic.`
    }
  ],

  negligenceRule: {
    type: 'modified-50',
    description: 'North Dakota follows modified comparative negligence with a 50% bar. You can recover damages if you are 50% or less at fault, but recovery is barred if you are more than 50% at fault.',
    details: `Under North Dakota's modified comparative fault rule (N.D. Cent. Code § 32-03.2-02), your damages are reduced by your percentage of fault. If you are more than 50% at fault, you recover nothing.`
  },

  statuteOfLimitations: {
    personalInjury: '6 Years',
    wrongfulDeath: '2 Years',
    propertyDamage: '6 Years',
    details: `North Dakota has a six-year statute of limitations for personal injury claims under N.D. Cent. Code § 28-01-16—the longest in the nation. Wrongful death claims have a two-year deadline.`
  },

  statistics: [
    { label: 'Annual Truck Accident Deaths', value: '25+' },
    { label: 'Registered Commercial Trucks', value: '30,000+' },
    { label: 'Miles of Interstate Highway', value: '571' },
    { label: 'Bakken Oil Field', value: 'Heavy Industrial Traffic' }
  ],

  courtInfo: `Truck accident cases in North Dakota may be filed in state district courts or federal courts. Cass County (Fargo), Burleigh County (Bismarck), and Williams County (Williston) handle many truck accident cases. The District of North Dakota federal court handles cases involving out-of-state defendants.`,

  lastUpdated: '2026-01-08',

  whyHireLocal: `North Dakota truck accident cases require attorneys who understand federal FMCSA regulations and the unique oil field trucking environment. Local counsel knows the Bakken region, severe weather, and industrial traffic patterns.`,

  faqs: [
    {
      question: 'What is the statute of limitations for truck accident cases in North Dakota?',
      answer: 'North Dakota has a six-year statute of limitations for personal injury claims—the longest in the nation. Wrongful death claims have a two-year deadline.'
    },
    {
      question: 'Can I still recover damages if I was partially at fault?',
      answer: 'Yes, but North Dakota follows modified comparative negligence. You can recover if 50% or less at fault.'
    },
    {
      question: 'What damages can I recover?',
      answer: 'North Dakota allows recovery of economic and non-economic damages. Punitive damages may be available in egregious cases.'
    },
    {
      question: 'How long do trucking companies have to keep records?',
      answer: 'Federal regulations require specific retention periods. An attorney can send preservation letters.'
    },
    {
      question: 'Can I sue an out-of-state trucking company?',
      answer: 'Yes. North Dakota courts have jurisdiction if the accident occurred in North Dakota.'
    }
  ],

  neighboringStates: ['minnesota', 'south-dakota', 'montana']
};
