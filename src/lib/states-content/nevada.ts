import { StateContent } from './types';

export const nevada: StateContent = {
  slug: 'nevada',
  name: 'Nevada',
  abbreviation: 'NV',
  h1: 'Nevada Truck Injury Lawyers',
  metaTitle: 'Nevada Truck Accident Lawyers | 18-Wheeler Attorneys in NV',
  metaDescription: 'Injured in a Nevada truck accident? Our attorneys fight for victims across Nevada. Free consultation. No fee unless you win.',

  heroText: `Nevada's position as a corridor between California and Utah creates significant commercial truck traffic, particularly on the heavily traveled I-15 between Los Angeles and Las Vegas. With over 50 people killed annually in collisions involving large trucks, Nevada highways see devastating accidents.

The Nevada trucking industry handles substantial freight volumes. Over 40,000 commercial trucks are registered in the state, with I-15 carrying enormous freight volumes between the Los Angeles basin and points east, and I-80 serving transcontinental freight through northern Nevada.

The I-15 corridor between Los Angeles and Las Vegas is particularly dangerous, with long stretches of desert highway, extreme heat, and high truck volumes. The Reno area sees heavy I-80 truck traffic crossing the Sierra Nevada.

Nevada follows modified comparative negligence with a 51% bar, meaning you can recover damages if you are 50% or less at fault. The state has a two-year statute of limitations for personal injury claims.

If you've been injured in a Nevada truck accident, our Nevada truck accident lawyers know how to preserve evidence and hold negligent carriers accountable.`,

  truckingLaws: [
    {
      title: 'Nevada Commercial Vehicle Regulations',
      description: `Nevada regulates commercial vehicles under Nevada Revised Statutes Chapter 706. This includes size and weight limits enforced by the Nevada Highway Patrol and Nevada DOT.`
    },
    {
      title: 'Nevada Hours of Service Enforcement',
      description: `Nevada actively enforces federal Hours of Service regulations through the Nevada Highway Patrol Commercial Enforcement. The state conducts inspections throughout the highway system.`
    },
    {
      title: 'Nevada CDL Requirements',
      description: `The Nevada DMV issues Commercial Driver's Licenses under federal standards with state-specific testing.`
    },
    {
      title: 'Nevada Drug and Alcohol Testing',
      description: `Nevada enforces federal drug and alcohol testing requirements. DUI laws apply to commercial drivers with a lower BAC threshold of 0.04%.`
    },
    {
      title: 'Nevada Desert Highway Regulations',
      description: `Nevada's desert highways present unique challenges including extreme heat affecting tire and brake performance. The state has specific requirements for summer operations.`
    },
    {
      title: 'Nevada Mountain Pass Requirements',
      description: `I-80 through the Sierra Nevada has specific requirements including chain controls and winter restrictions affecting truck operations.`
    }
  ],

  corridors: [
    {
      name: 'Interstate 15 (I-15)',
      description: `Major corridor connecting Los Angeles to Las Vegas and Salt Lake City, extremely heavy freight traffic. This is one of the most dangerous trucking corridors in the nation.`
    },
    {
      name: 'Interstate 80 (I-80)',
      description: `Northern route from California through Reno to Utah, challenging mountain passes through the Sierra Nevada.`
    },
    {
      name: 'US Highway 93',
      description: `North-south route connecting Arizona to Idaho through eastern Nevada, serving as an alternative to I-15 for some freight.`
    },
    {
      name: 'US Highway 95',
      description: `Western route connecting Las Vegas to Reno through central Nevada.`
    }
  ],

  negligenceRule: {
    type: 'modified-51',
    description: 'Nevada follows modified comparative negligence with a 51% bar. You can recover damages if you are 50% or less at fault, but recovery is barred if you are 51% or more at fault.',
    details: `Under Nevada's modified comparative fault rule (NRS 41.141), your damages are reduced by your percentage of fault. If you are 51% or more at fault, you recover nothing.`
  },

  statuteOfLimitations: {
    personalInjury: '2 Years',
    wrongfulDeath: '2 Years',
    propertyDamage: '3 Years',
    details: `Nevada has a two-year statute of limitations for personal injury claims under NRS 11.190. Wrongful death claims also have a two-year deadline.`
  },

  statistics: [
    { label: 'Annual Truck Accident Deaths', value: '50+' },
    { label: 'Registered Commercial Trucks', value: '40,000+' },
    { label: 'Miles of Interstate Highway', value: '558' },
    { label: 'I-15 Las Vegas Corridor', value: 'High Accident Rate' }
  ],

  courtInfo: `Truck accident cases in Nevada may be filed in state district courts or federal courts. Clark County (Las Vegas) and Washoe County (Reno) handle most truck accident cases. The District of Nevada federal court handles cases involving out-of-state defendants.`,

  lastUpdated: '2026-01-08',

  whyHireLocal: `Nevada truck accident cases require attorneys who understand federal FMCSA regulations and Nevada state law. Local counsel knows the dangerous I-15 corridor and understands how desert heat and mountain passes contribute to accidents.`,

  faqs: [
    {
      question: 'What is the statute of limitations for truck accident cases in Nevada?',
      answer: 'Nevada has a two-year statute of limitations for personal injury and wrongful death claims.'
    },
    {
      question: 'Can I still recover damages if I was partially at fault?',
      answer: 'Yes, but Nevada follows modified comparative negligence with a 51% bar. You can recover if 50% or less at fault.'
    },
    {
      question: 'What damages can I recover?',
      answer: 'Nevada allows recovery of economic and non-economic damages. Punitive damages are available in cases involving malice or oppression.'
    },
    {
      question: 'How long do trucking companies have to keep records?',
      answer: 'Federal regulations require specific retention periods. An attorney can send preservation letters.'
    },
    {
      question: 'Can I sue an out-of-state trucking company?',
      answer: 'Yes. Nevada courts have jurisdiction if the accident occurred in Nevada.'
    }
  ],

  neighboringStates: ['oregon', 'idaho', 'utah', 'arizona', 'california']
};
