import { StateContent } from './types';

export const newMexico: StateContent = {
  slug: 'new-mexico',
  name: 'New Mexico',
  abbreviation: 'NM',
  h1: 'New Mexico Truck Injury Lawyers',
  metaTitle: 'New Mexico Truck Accident Lawyers | 18-Wheeler Attorneys in NM',
  metaDescription: 'Injured in a New Mexico truck accident? Our attorneys fight for victims across New Mexico. Free consultation. No fee unless you win.',

  heroText: `New Mexico's position as a critical crossroads for cross-country freight creates significant commercial truck traffic on state highways. With over 65 people killed annually in collisions involving large trucks, New Mexico roadways see devastating accidents regularly.

The New Mexico trucking industry handles substantial freight volumes. Over 45,000 commercial trucks are registered in the state, operating on I-40 (a primary cross-country route), I-25 (connecting Texas to Colorado), and I-10 (the southern tier route).

New Mexico's vast distances and sparse population mean emergency response times can be extended in rural areas. Long stretches of highway through desert terrain see high-speed truck accidents with severe consequences.

New Mexico follows pure comparative negligence, allowing you to recover damages even if you were mostly at fault. The state has a three-year statute of limitations for personal injury claims.

If you've been injured in a New Mexico truck accident, our New Mexico truck accident lawyers know how to preserve evidence, investigate thoroughly, and hold negligent carriers accountable.`,

  truckingLaws: [
    {
      title: 'New Mexico Commercial Vehicle Regulations',
      description: `New Mexico regulates commercial vehicles under NMSA 1978, Chapter 66. This includes size and weight limits and safety standards enforced by the New Mexico Department of Transportation Motor Transportation Division.`
    },
    {
      title: 'New Mexico Hours of Service Enforcement',
      description: `New Mexico actively enforces federal Hours of Service regulations through the New Mexico State Police and Motor Transportation Police. The state conducts roadside inspections throughout the highway system.`
    },
    {
      title: 'New Mexico CDL Requirements',
      description: `The New Mexico Motor Vehicle Division issues Commercial Driver's Licenses under federal standards with state-specific testing.`
    },
    {
      title: 'New Mexico Drug and Alcohol Testing',
      description: `New Mexico enforces federal drug and alcohol testing requirements. DWI laws apply to commercial drivers with a lower BAC threshold of 0.04%.`
    },
    {
      title: 'New Mexico Border Trucking',
      description: `The Santa Teresa port of entry handles significant Mexican truck traffic. New Mexico coordinates with federal authorities on international trucking safety.`
    },
    {
      title: 'New Mexico Oil Field Trucking',
      description: `The Permian Basin oil fields generate significant truck traffic in southeastern New Mexico, with specific regulations for oilfield equipment and hazmat transport.`
    }
  ],

  corridors: [
    {
      name: 'Interstate 40 (I-40)',
      description: `Major east-west corridor through Albuquerque connecting Texas to Arizona, primary cross-country freight route. This corridor carries enormous transcontinental truck traffic.`
    },
    {
      name: 'Interstate 25 (I-25)',
      description: `North-south corridor from Texas through Albuquerque and Santa Fe to Colorado. This route connects major New Mexico cities and serves as a NAFTA corridor.`
    },
    {
      name: 'Interstate 10 (I-10)',
      description: `Southern route through Las Cruces connecting Texas to Arizona. This corridor serves the southern tier transcontinental freight.`
    },
    {
      name: 'US Highway 54/70',
      description: `Southeastern routes serving oil field and agricultural traffic in the Permian Basin region.`
    }
  ],

  negligenceRule: {
    type: 'pure',
    description: 'New Mexico follows pure comparative negligence. You can recover damages even if you are 99% at fault, though your recovery is reduced by your percentage of fault.',
    details: `Under New Mexico's pure comparative fault system, your damages are reduced by your percentage of fault, but you can still recover even if you were mostly at fault.`
  },

  statuteOfLimitations: {
    personalInjury: '3 Years',
    wrongfulDeath: '3 Years',
    propertyDamage: '4 Years',
    details: `New Mexico has a three-year statute of limitations for personal injury claims under NMSA 1978 § 37-1-8. Wrongful death claims also have a three-year deadline.`
  },

  statistics: [
    { label: 'Annual Truck Accident Deaths', value: '65+' },
    { label: 'Registered Commercial Trucks', value: '45,000+' },
    { label: 'Miles of Interstate Highway', value: '1,000' },
    { label: 'Border Crossing', value: 'Santa Teresa Port of Entry' }
  ],

  courtInfo: `Truck accident cases in New Mexico may be filed in state district courts or federal courts. Bernalillo County (Albuquerque), Dona Ana County (Las Cruces), and Santa Fe County handle many truck accident cases. The District of New Mexico federal court handles cases involving out-of-state defendants.`,

  lastUpdated: '2026-01-08',

  whyHireLocal: `New Mexico truck accident cases require attorneys who understand both federal FMCSA regulations and New Mexico state law. Local counsel knows the state's vast distances, remote highways, and the unique challenges of desert trucking. They understand oil field operations and border crossing traffic patterns.`,

  faqs: [
    {
      question: 'What is the statute of limitations for truck accident cases in New Mexico?',
      answer: 'New Mexico has a three-year statute of limitations for personal injury claims. Wrongful death claims also have a three-year deadline.'
    },
    {
      question: 'Can I still recover damages if I was partially at fault for a New Mexico truck accident?',
      answer: 'Yes. New Mexico follows pure comparative negligence, meaning you can recover damages even if mostly at fault. Your recovery is reduced by your percentage of fault.'
    },
    {
      question: 'What damages can I recover in a New Mexico truck accident case?',
      answer: 'New Mexico allows recovery of economic damages and non-economic damages. Punitive damages may be available in cases involving reckless conduct.'
    },
    {
      question: 'How long do trucking companies have to keep records?',
      answer: 'Federal regulations require specific retention periods. An attorney can send preservation letters requiring the company to retain evidence.'
    },
    {
      question: 'Can I sue a trucking company based in another state?',
      answer: 'Yes. If a truck accident occurs in New Mexico, New Mexico courts have jurisdiction regardless of where the trucking company is headquartered.'
    }
  ],

  neighboringStates: ['colorado', 'oklahoma', 'texas', 'arizona', 'utah']
};
