import { StateContent } from './types';

export const connecticut: StateContent = {
  slug: 'connecticut',
  name: 'Connecticut',
  abbreviation: 'CT',
  h1: 'Connecticut Truck Injury Lawyers',
  metaTitle: 'Connecticut Truck Accident Lawyers | 18-Wheeler Attorneys',
  metaDescription: 'Injured in a Connecticut truck accident? Our attorneys fight for victims across CT. Free consultation. No fee unless you win.',

  heroText: `Connecticut's position between New York and Boston creates one of the most congested trucking corridors in America. With over 30 people killed annually in collisions involving large trucks, Connecticut's dense highway network sees devastating accidents.

The Connecticut trucking industry serves the Northeast megalopolis. Over 40,000 commercial trucks are registered, operating on I-95 (the congested coastal corridor), I-91 (north-south through Hartford), and I-84 (east-west from New York).

Connecticut's small geographic size concentrates enormous traffic volumes. The I-95 corridor through Connecticut is one of the most congested truck routes in America. Stop-and-go traffic, merging conflicts, and urban congestion create constant accident risks.

Connecticut follows modified comparative negligence with a 51% bar, meaning you can recover damages if you are 50% or less at fault. The state has a two-year statute of limitations for personal injury claims.

If you've been injured in a Connecticut truck accident, our Connecticut truck accident lawyers know how to preserve evidence and hold negligent carriers accountable.`,

  truckingLaws: [
    {
      title: 'Connecticut Commercial Vehicle Regulations',
      description: `Connecticut regulates commercial vehicles under Connecticut General Statutes Chapter 248. This includes size and weight limits enforced by the Connecticut State Police and DMV.`
    },
    {
      title: 'Connecticut Hours of Service Enforcement',
      description: `Connecticut actively enforces federal Hours of Service regulations through the Connecticut State Police Commercial Vehicle Safety Unit.`
    },
    {
      title: 'Connecticut CDL Requirements',
      description: `The Connecticut DMV issues Commercial Driver's Licenses under federal standards with state-specific testing.`
    },
    {
      title: 'Connecticut Drug and Alcohol Testing',
      description: `Connecticut enforces federal drug and alcohol testing requirements. DUI laws apply to commercial drivers with a lower BAC threshold of 0.04%.`
    },
    {
      title: 'Connecticut Congestion Regulations',
      description: `Connecticut has specific regulations for truck traffic during peak congestion hours on I-95 and other major routes.`
    },
    {
      title: 'Connecticut Bridge Weight Limits',
      description: `Many Connecticut bridges have specific weight restrictions due to age, requiring careful route planning for heavy loads.`
    }
  ],

  corridors: [
    {
      name: 'Interstate 95 (I-95)',
      description: `Major coastal corridor connecting New York to Rhode Island, extremely congested with mixed commercial and commuter traffic. One of the busiest truck routes in America.`
    },
    {
      name: 'Interstate 91 (I-91)',
      description: `North-south route from New Haven through Hartford to Massachusetts, serving distribution centers and manufacturing.`
    },
    {
      name: 'Interstate 84 (I-84)',
      description: `East-west route from New York through Hartford to Massachusetts. This corridor has challenging interchanges and merging zones.`
    },
    {
      name: 'Interstate 691 (I-691)',
      description: `Connector between I-91 and I-84 in the Meriden/Waterbury area.`
    }
  ],

  negligenceRule: {
    type: 'modified-51',
    description: 'Connecticut follows modified comparative negligence with a 51% bar. You can recover damages if you are 50% or less at fault, but recovery is barred if you are 51% or more at fault.',
    details: `Under Connecticut's modified comparative fault rule (Conn. Gen. Stat. § 52-572h), your damages are reduced by your percentage of fault. If you are 51% or more at fault, you recover nothing.`
  },

  statuteOfLimitations: {
    personalInjury: '2 Years',
    wrongfulDeath: '2 Years',
    propertyDamage: '2 Years',
    details: `Connecticut has a two-year statute of limitations for personal injury claims under Conn. Gen. Stat. § 52-584. Wrongful death claims also have a two-year deadline.`
  },

  statistics: [
    { label: 'Annual Truck Accident Deaths', value: '30+' },
    { label: 'Registered Commercial Trucks', value: '40,000+' },
    { label: 'Miles of Interstate Highway', value: '346' },
    { label: 'I-95 Corridor', value: 'Heavy Congestion Daily' }
  ],

  courtInfo: `Truck accident cases in Connecticut may be filed in state Superior Courts or federal courts. Hartford, New Haven, Fairfield, and Middlesex judicial districts handle many truck accident cases. The District of Connecticut federal court handles cases involving out-of-state defendants.`,

  lastUpdated: '2026-01-08',

  whyHireLocal: `Connecticut truck accident cases require attorneys who understand federal FMCSA regulations and the congested Northeast corridor. Local counsel knows I-95 traffic patterns, urban trucking challenges, and the region's complex liability issues.`,

  faqs: [
    {
      question: 'What is the statute of limitations for truck accident cases in Connecticut?',
      answer: 'Connecticut has a two-year statute of limitations for personal injury and wrongful death claims.'
    },
    {
      question: 'Can I still recover damages if I was partially at fault?',
      answer: 'Yes, but Connecticut follows modified comparative negligence with a 51% bar. You can recover if 50% or less at fault.'
    },
    {
      question: 'What damages can I recover?',
      answer: 'Connecticut allows recovery of economic and non-economic damages. Punitive damages may be available in egregious cases.'
    },
    {
      question: 'How long do trucking companies have to keep records?',
      answer: 'Federal regulations require specific retention periods. An attorney can send preservation letters.'
    },
    {
      question: 'Can I sue an out-of-state trucking company?',
      answer: 'Yes. Connecticut courts have jurisdiction if the accident occurred in Connecticut.'
    }
  ],

  neighboringStates: ['new-york', 'massachusetts', 'rhode-island']
};
