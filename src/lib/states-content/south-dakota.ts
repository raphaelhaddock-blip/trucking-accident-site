import { StateContent } from './types';

export const southDakota: StateContent = {
  slug: 'south-dakota',
  name: 'South Dakota',
  abbreviation: 'SD',
  h1: 'South Dakota Truck Injury Lawyers',
  metaTitle: 'South Dakota Truck Accident Lawyers | 18-Wheeler Attorneys',
  metaDescription: 'Injured in a South Dakota truck accident? Our attorneys fight for victims across SD. Free consultation. No fee unless you win.',

  heroText: `South Dakota's position on the I-90 corridor creates significant commercial truck traffic across the state. With over 25 people killed annually in collisions involving large trucks, South Dakota highways see devastating accidents.

The South Dakota trucking industry handles critical east-west freight. Over 30,000 commercial trucks are registered, operating on I-90 (crossing the entire state), I-29 (eastern border), and routes serving agricultural regions.

South Dakota's agricultural economy generates substantial truck traffic. Grain shipments, livestock transport, and farm equipment create unique hazards. Severe weather including blizzards and extreme cold add to trucking dangers.

South Dakota follows modified comparative negligence with a 51% bar, meaning you can recover damages if you are 50% or less at fault, but recovery is barred if you are 51% or more at fault. The state has a three-year statute of limitations for personal injury claims.

If you've been injured in a South Dakota truck accident, our South Dakota truck accident lawyers know how to preserve evidence and hold negligent carriers accountable.`,

  truckingLaws: [
    {
      title: 'South Dakota Commercial Vehicle Regulations',
      description: `South Dakota regulates commercial vehicles under South Dakota Codified Laws Title 32. This includes size and weight limits enforced by the South Dakota Highway Patrol.`
    },
    {
      title: 'South Dakota Hours of Service Enforcement',
      description: `South Dakota actively enforces federal Hours of Service regulations through the South Dakota Highway Patrol. The state conducts inspections throughout the highway system.`
    },
    {
      title: 'South Dakota CDL Requirements',
      description: `The South Dakota Driver Licensing Program issues Commercial Driver's Licenses under federal standards with state-specific testing.`
    },
    {
      title: 'South Dakota Drug and Alcohol Testing',
      description: `South Dakota enforces federal drug and alcohol testing requirements. DUI laws apply to commercial drivers with a lower BAC threshold of 0.04%.`
    },
    {
      title: 'South Dakota Agricultural Trucking',
      description: `South Dakota's agricultural economy generates significant truck traffic. The state has specific provisions for grain transport and livestock hauling.`
    },
    {
      title: 'South Dakota Winter Trucking',
      description: `South Dakota's severe winters require specific preparations. The state can close highways during blizzards.`
    }
  ],

  corridors: [
    {
      name: 'Interstate 90 (I-90)',
      description: `Major east-west corridor from Minnesota through Sioux Falls and Rapid City to Wyoming. This route carries enormous cross-country freight volumes.`
    },
    {
      name: 'Interstate 29 (I-29)',
      description: `Eastern north-south route from Iowa through Sioux Falls to North Dakota. This corridor serves agricultural freight and connects to major markets.`
    },
    {
      name: 'US Highway 83',
      description: `Central north-south route through Pierre, serving agricultural regions.`
    },
    {
      name: 'US Highway 81',
      description: `Eastern route serving agricultural communities and connecting to I-90.`
    }
  ],

  negligenceRule: {
    type: 'modified-51',
    description: 'South Dakota follows modified comparative negligence with a 51% bar. You can recover damages if you are 50% or less at fault, but recovery is barred if you are 51% or more at fault.',
    details: `Under South Dakota's modified comparative fault rule (SDCL § 20-9-2), your damages are reduced by your percentage of fault. If you are 51% or more at fault, you recover nothing.`
  },

  statuteOfLimitations: {
    personalInjury: '3 Years',
    wrongfulDeath: '3 Years',
    propertyDamage: '6 Years',
    details: `South Dakota has a three-year statute of limitations for personal injury claims under SDCL § 15-2-14. Wrongful death claims also have a three-year deadline.`
  },

  statistics: [
    { label: 'Annual Truck Accident Deaths', value: '25+' },
    { label: 'Registered Commercial Trucks', value: '30,000+' },
    { label: 'Miles of Interstate Highway', value: '678' },
    { label: 'Agricultural Transport', value: 'Grain & Livestock' }
  ],

  courtInfo: `Truck accident cases in South Dakota may be filed in state circuit courts or federal courts. Minnehaha County (Sioux Falls), Pennington County (Rapid City), and Lincoln County handle many truck accident cases. The District of South Dakota federal court handles cases involving out-of-state defendants.`,

  lastUpdated: '2026-01-08',

  whyHireLocal: `South Dakota truck accident cases require attorneys who understand federal FMCSA regulations and the agricultural trucking environment. Local counsel knows the I-90 corridor, severe weather, and agricultural traffic patterns.`,

  faqs: [
    {
      question: 'What is the statute of limitations for truck accident cases in South Dakota?',
      answer: 'South Dakota has a three-year statute of limitations for personal injury and wrongful death claims.'
    },
    {
      question: 'Can I still recover damages if I was partially at fault?',
      answer: 'Yes, but South Dakota follows modified comparative negligence with a 51% bar. You can recover if 50% or less at fault, but not if you are 51% or more at fault. Your recovery is reduced by your percentage of fault.'
    },
    {
      question: 'What damages can I recover?',
      answer: 'South Dakota allows recovery of economic and non-economic damages. Punitive damages may be available in egregious cases.'
    },
    {
      question: 'How long do trucking companies have to keep records?',
      answer: 'Federal regulations require specific retention periods. An attorney can send preservation letters.'
    },
    {
      question: 'Can I sue an out-of-state trucking company?',
      answer: 'Yes. South Dakota courts have jurisdiction if the accident occurred in South Dakota.'
    }
  ],

  neighboringStates: ['north-dakota', 'minnesota', 'iowa', 'nebraska', 'wyoming', 'montana']
};
