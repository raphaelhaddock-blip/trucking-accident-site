import { StateContent } from './types';

export const wyoming: StateContent = {
  slug: 'wyoming',
  name: 'Wyoming',
  abbreviation: 'WY',
  h1: 'Wyoming Truck Injury Lawyers',
  metaTitle: 'Wyoming Truck Accident Lawyers | 18-Wheeler Attorneys in WY',
  metaDescription: 'Injured in a Wyoming truck accident? Our attorneys fight for victims across Wyoming. Free consultation. No fee unless you win.',

  heroText: `Wyoming's Interstate 80 corridor is notorious for some of the most dangerous trucking conditions in the nation. With over 25 people killed annually in collisions involving large trucks, Wyoming highways see devastating accidents despite the state's sparse population.

The Wyoming trucking industry must navigate extreme conditions. Over 25,000 commercial trucks are registered in the state, operating on I-80 (the southern corridor notorious for wind closures), I-90 (northeastern route), and I-25 (north-south corridor through Cheyenne and Casper).

Wyoming's I-80 corridor is infamous for high winds that can overturn trucks. Multiple days each year see highway closures due to wind, snow, and ice. The state has some of the longest stretches of remote interstate in the nation, meaning delayed emergency response times.

Wyoming follows modified comparative negligence with a 51% bar, meaning you can recover damages if you are 50% or less at fault. The state has a four-year statute of limitations for personal injury claims—longer than most states.

If you've been injured in a Wyoming truck accident, our Wyoming truck accident lawyers know how to preserve evidence and hold negligent carriers accountable.`,

  truckingLaws: [
    {
      title: 'Wyoming Commercial Vehicle Regulations',
      description: `Wyoming regulates commercial vehicles under Wyoming Statutes Title 31. This includes size and weight limits enforced by the Wyoming Highway Patrol and Wyoming Department of Transportation.`
    },
    {
      title: 'Wyoming Hours of Service Enforcement',
      description: `Wyoming actively enforces federal Hours of Service regulations through the Wyoming Highway Patrol. The state conducts inspections at ports of entry and throughout the highway system.`
    },
    {
      title: 'Wyoming CDL Requirements',
      description: `The Wyoming Department of Transportation issues Commercial Driver's Licenses under federal standards with state-specific testing.`
    },
    {
      title: 'Wyoming Drug and Alcohol Testing',
      description: `Wyoming enforces federal drug and alcohol testing requirements. DUI laws apply to commercial drivers with a lower BAC threshold of 0.04%.`
    },
    {
      title: 'Wyoming Wind Restrictions',
      description: `Wyoming has specific wind restrictions for high-profile vehicles. I-80 frequently closes due to high winds, and carriers must monitor wind advisories.`
    },
    {
      title: 'Wyoming Winter Operations',
      description: `Wyoming's severe winters require chain requirements and winter equipment. The state can close highways during blizzards and extreme conditions.`
    }
  ],

  corridors: [
    {
      name: 'Interstate 80 (I-80)',
      description: `Major east-west corridor across southern Wyoming, notorious for high winds and winter closures. This route is one of the most dangerous in the nation for truck accidents.`
    },
    {
      name: 'Interstate 90 (I-90)',
      description: `Northeastern route through Gillette and Sheridan connecting South Dakota to Montana. This corridor serves energy industry traffic.`
    },
    {
      name: 'Interstate 25 (I-25)',
      description: `Southern route from Colorado through Cheyenne and Casper, serving north-south freight between Colorado and Montana.`
    },
    {
      name: 'US Highway 30',
      description: `Alternative to I-80 through southern Wyoming, sometimes used when I-80 is closed.`
    }
  ],

  negligenceRule: {
    type: 'modified-51',
    description: 'Wyoming follows modified comparative negligence with a 51% bar. You can recover damages if you are 50% or less at fault, but recovery is barred if you are 51% or more at fault.',
    details: `Under Wyoming's modified comparative fault rule (Wyo. Stat. § 1-1-109), your damages are reduced by your percentage of fault. If you are 51% or more at fault, you recover nothing.`
  },

  statuteOfLimitations: {
    personalInjury: '4 Years',
    wrongfulDeath: '2 Years',
    propertyDamage: '4 Years',
    details: `Wyoming has a four-year statute of limitations for personal injury claims under Wyo. Stat. § 1-3-105. Wrongful death claims have a two-year deadline.`
  },

  statistics: [
    { label: 'Annual Truck Accident Deaths', value: '25+' },
    { label: 'Registered Commercial Trucks', value: '25,000+' },
    { label: 'Miles of Interstate Highway', value: '913' },
    { label: 'I-80 Wind Closures', value: 'Multiple Days/Year' }
  ],

  courtInfo: `Truck accident cases in Wyoming may be filed in state district courts or federal courts. Laramie County (Cheyenne), Natrona County (Casper), and Campbell County (Gillette) handle many truck accident cases. The District of Wyoming federal court handles cases involving out-of-state defendants.`,

  lastUpdated: '2026-01-08',

  whyHireLocal: `Wyoming truck accident cases require attorneys who understand federal FMCSA regulations and the extreme conditions on Wyoming highways. Local counsel knows the I-80 corridor, wind restrictions, and winter hazards that contribute to accidents.`,

  faqs: [
    {
      question: 'What is the statute of limitations for truck accident cases in Wyoming?',
      answer: 'Wyoming has a four-year statute of limitations for personal injury claims—longer than most states. Wrongful death claims have a two-year deadline.'
    },
    {
      question: 'Can I still recover damages if I was partially at fault?',
      answer: 'Yes, but Wyoming follows modified comparative negligence with a 51% bar. You can recover if 50% or less at fault.'
    },
    {
      question: 'What damages can I recover?',
      answer: 'Wyoming allows recovery of economic and non-economic damages. Punitive damages may be available in egregious cases.'
    },
    {
      question: 'How long do trucking companies have to keep records?',
      answer: 'Federal regulations require specific retention periods. An attorney can send preservation letters.'
    },
    {
      question: 'Can I sue an out-of-state trucking company?',
      answer: 'Yes. Wyoming courts have jurisdiction if the accident occurred in Wyoming.'
    }
  ],

  neighboringStates: ['montana', 'south-dakota', 'nebraska', 'colorado', 'utah', 'idaho']
};
