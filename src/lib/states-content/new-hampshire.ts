import { StateContent } from './types';

export const newHampshire: StateContent = {
  slug: 'new-hampshire',
  name: 'New Hampshire',
  abbreviation: 'NH',
  h1: 'New Hampshire Truck Injury Lawyers',
  metaTitle: 'New Hampshire Truck Accident Lawyers | 18-Wheeler Attorneys',
  metaDescription: 'Injured in a New Hampshire truck accident? Our attorneys fight for victims across NH. Free consultation. No fee unless you win.',

  heroText: `New Hampshire's position between Massachusetts and Maine creates significant commercial truck traffic through the state's highway network. With over 15 people killed annually in collisions involving large trucks, New Hampshire highways see devastating accidents.

The New Hampshire trucking industry connects New England markets. Over 25,000 commercial trucks are registered, operating on I-93 (north-south through Manchester and Concord), I-95 (brief coastal section), and I-89 (northwest to Vermont).

New Hampshire's White Mountains create challenging terrain for trucking. Mountain grades, winter weather, and wildlife hazards add to the dangers. The state's tax-free shopping draws additional truck traffic to distribution centers near the Massachusetts border.

New Hampshire follows modified comparative negligence with a 51% bar, meaning you can recover damages if you are 50% or less at fault. The state has a three-year statute of limitations for personal injury claims.

If you've been injured in a New Hampshire truck accident, our New Hampshire truck accident lawyers know how to preserve evidence and hold negligent carriers accountable.`,

  truckingLaws: [
    {
      title: 'New Hampshire Commercial Vehicle Regulations',
      description: `New Hampshire regulates commercial vehicles under New Hampshire Revised Statutes Chapter 266. This includes size and weight limits enforced by the New Hampshire State Police.`
    },
    {
      title: 'New Hampshire Hours of Service Enforcement',
      description: `New Hampshire actively enforces federal Hours of Service regulations through the New Hampshire State Police Commercial Vehicle Enforcement Unit.`
    },
    {
      title: 'New Hampshire CDL Requirements',
      description: `The New Hampshire DMV issues Commercial Driver's Licenses under federal standards with state-specific testing.`
    },
    {
      title: 'New Hampshire Drug and Alcohol Testing',
      description: `New Hampshire enforces federal drug and alcohol testing requirements. DUI laws apply to commercial drivers with a lower BAC threshold of 0.04%.`
    },
    {
      title: 'New Hampshire Mountain Operations',
      description: `White Mountains routes have specific requirements for truck operations including grade restrictions and runaway truck ramps.`
    },
    {
      title: 'New Hampshire Winter Trucking',
      description: `New Hampshire's severe winters require winter equipment and chain requirements on mountain routes.`
    }
  ],

  corridors: [
    {
      name: 'Interstate 93 (I-93)',
      description: `Major north-south route from Massachusetts through Manchester and Concord to Vermont. Includes challenging Franconia Notch section through the White Mountains.`
    },
    {
      name: 'Interstate 95 (I-95)',
      description: `Brief coastal section through Portsmouth connecting Maine to Massachusetts. Heavily traveled despite short length.`
    },
    {
      name: 'Interstate 89 (I-89)',
      description: `Route from Concord northwest to Vermont, serving distribution centers and cross-state traffic.`
    },
    {
      name: 'US Highway 3',
      description: `Central north-south route through the White Mountains, alternative to I-93 with challenging mountain grades.`
    }
  ],

  negligenceRule: {
    type: 'modified-51',
    description: 'New Hampshire follows modified comparative negligence with a 51% bar. You can recover damages if you are 50% or less at fault, but recovery is barred if you are 51% or more at fault.',
    details: `Under New Hampshire's modified comparative fault rule (N.H. Rev. Stat. § 507:7-d), your damages are reduced by your percentage of fault. If you are 51% or more at fault, you recover nothing.`
  },

  statuteOfLimitations: {
    personalInjury: '3 Years',
    wrongfulDeath: '3 Years',
    propertyDamage: '3 Years',
    details: `New Hampshire has a three-year statute of limitations for personal injury claims under N.H. Rev. Stat. § 508:4. Wrongful death claims also have a three-year deadline.`
  },

  statistics: [
    { label: 'Annual Truck Accident Deaths', value: '15+' },
    { label: 'Registered Commercial Trucks', value: '25,000+' },
    { label: 'Miles of Interstate Highway', value: '224' },
    { label: 'White Mountains', value: 'Challenging Winter Conditions' }
  ],

  courtInfo: `Truck accident cases in New Hampshire may be filed in state Superior Courts or federal courts. Hillsborough County (Manchester), Rockingham County (Portsmouth), and Merrimack County (Concord) handle many truck accident cases. The District of New Hampshire federal court handles cases involving out-of-state defendants.`,

  lastUpdated: '2026-01-08',

  whyHireLocal: `New Hampshire truck accident cases require attorneys who understand federal FMCSA regulations and the challenging mountain terrain. Local counsel knows the White Mountains routes, winter conditions, and traffic patterns that contribute to accidents.`,

  faqs: [
    {
      question: 'What is the statute of limitations for truck accident cases in New Hampshire?',
      answer: 'New Hampshire has a three-year statute of limitations for personal injury and wrongful death claims.'
    },
    {
      question: 'Can I still recover damages if I was partially at fault?',
      answer: 'Yes, but New Hampshire follows modified comparative negligence with a 51% bar. You can recover if 50% or less at fault.'
    },
    {
      question: 'What damages can I recover?',
      answer: 'New Hampshire allows recovery of economic and non-economic damages. Punitive damages may be available in egregious cases.'
    },
    {
      question: 'How long do trucking companies have to keep records?',
      answer: 'Federal regulations require specific retention periods. An attorney can send preservation letters.'
    },
    {
      question: 'Can I sue an out-of-state trucking company?',
      answer: 'Yes. New Hampshire courts have jurisdiction if the accident occurred in New Hampshire.'
    }
  ],

  neighboringStates: ['maine', 'vermont', 'massachusetts']
};
