import { StateContent } from './types';

export const idaho: StateContent = {
  slug: 'idaho',
  name: 'Idaho',
  abbreviation: 'ID',
  h1: 'Idaho Truck Injury Lawyers',
  metaTitle: 'Idaho Truck Accident Lawyers | 18-Wheeler Attorneys in ID',
  metaDescription: 'Injured in an Idaho truck accident? Our attorneys fight for victims across Idaho. Free consultation. No fee unless you win.',

  heroText: `Idaho's position as a corridor between the Pacific Northwest and the Mountain West creates significant commercial truck traffic. With over 35 people killed annually in collisions involving large trucks, Idaho highways see devastating accidents.

The Idaho trucking industry handles substantial freight volumes. Over 40,000 commercial trucks are registered in the state, operating on I-84 (connecting Oregon to Utah), I-90 (northern route to Washington and Montana), and I-15 (connecting Utah to Montana).

Idaho's agricultural economy generates significant truck traffic. Potato and grain shipments, livestock transport, and timber hauling create unique hazards on Idaho highways. Mountain passes and winter weather add additional challenges.

Idaho follows modified comparative negligence with a 50% bar, meaning you can recover damages if you are 50% or less at fault. The state has a two-year statute of limitations for personal injury claims.

If you've been injured in an Idaho truck accident, our Idaho truck accident lawyers know how to preserve evidence and hold negligent carriers accountable.`,

  truckingLaws: [
    {
      title: 'Idaho Commercial Vehicle Regulations',
      description: `Idaho regulates commercial vehicles under Idaho Code Title 49. This includes size and weight limits enforced by the Idaho State Police Commercial Vehicle Safety Program.`
    },
    {
      title: 'Idaho Hours of Service Enforcement',
      description: `Idaho actively enforces federal Hours of Service regulations through the Idaho State Police. The state conducts inspections at ports of entry and throughout the highway system.`
    },
    {
      title: 'Idaho CDL Requirements',
      description: `The Idaho Transportation Department issues Commercial Driver's Licenses under federal standards with state-specific testing.`
    },
    {
      title: 'Idaho Drug and Alcohol Testing',
      description: `Idaho enforces federal drug and alcohol testing requirements. DUI laws apply to commercial drivers with a lower BAC threshold of 0.04%.`
    },
    {
      title: 'Idaho Agricultural Trucking',
      description: `Idaho's agricultural economy generates significant truck traffic. The state has specific provisions for agricultural hauling including potato transport and harvest season operations.`
    },
    {
      title: 'Idaho Mountain Pass Requirements',
      description: `Mountain passes including Lookout Pass on I-90 have specific requirements for truck operations including chain requirements and winter restrictions.`
    }
  ],

  corridors: [
    {
      name: 'Interstate 84 (I-84)',
      description: `Major corridor from Oregon through Boise to Utah, primary freight route across southern Idaho connecting Pacific Northwest markets to the Mountain West.`
    },
    {
      name: 'Interstate 90 (I-90)',
      description: `Northern route through Coeur d'Alene connecting Washington to Montana. Lookout Pass and other mountain sections create challenging conditions.`
    },
    {
      name: 'Interstate 15 (I-15)',
      description: `Southeastern route connecting Utah to Montana through Idaho Falls. This corridor serves trade between the Mountain West and Pacific Northwest.`
    },
    {
      name: 'US Highway 95',
      description: `North-south route through western Idaho connecting the state's communities from border to border.`
    }
  ],

  negligenceRule: {
    type: 'modified-50',
    description: 'Idaho follows modified comparative negligence with a 50% bar. You can recover damages if you are 50% or less at fault, but recovery is barred if you are more than 50% at fault.',
    details: `Under Idaho's modified comparative fault rule (Idaho Code § 6-801), your damages are reduced by your percentage of fault. If you are more than 50% at fault, you recover nothing.`
  },

  statuteOfLimitations: {
    personalInjury: '2 Years',
    wrongfulDeath: '2 Years',
    propertyDamage: '3 Years',
    details: `Idaho has a two-year statute of limitations for personal injury claims under Idaho Code § 5-219. Wrongful death claims also have a two-year deadline.`
  },

  statistics: [
    { label: 'Annual Truck Accident Deaths', value: '35+' },
    { label: 'Registered Commercial Trucks', value: '40,000+' },
    { label: 'Miles of Interstate Highway', value: '611' },
    { label: 'Agricultural & Timber', value: 'Transport Hub' }
  ],

  courtInfo: `Truck accident cases in Idaho may be filed in state district courts or federal courts. Ada County (Boise), Canyon County (Nampa), and Kootenai County (Coeur d'Alene) handle many truck accident cases. The District of Idaho federal court handles cases involving out-of-state defendants.`,

  lastUpdated: '2026-01-08',

  whyHireLocal: `Idaho truck accident cases require attorneys who understand federal FMCSA regulations and Idaho state law. Local counsel knows the agricultural trucking industry, mountain corridors, and weather challenges that contribute to accidents.`,

  faqs: [
    {
      question: 'What is the statute of limitations for truck accident cases in Idaho?',
      answer: 'Idaho has a two-year statute of limitations for personal injury and wrongful death claims.'
    },
    {
      question: 'Can I still recover damages if I was partially at fault?',
      answer: 'Yes, but Idaho follows modified comparative negligence. You can recover if 50% or less at fault.'
    },
    {
      question: 'What damages can I recover?',
      answer: 'Idaho allows recovery of economic and non-economic damages. Punitive damages may be available in egregious cases.'
    },
    {
      question: 'How long do trucking companies have to keep records?',
      answer: 'Federal regulations require specific retention periods. An attorney can send preservation letters.'
    },
    {
      question: 'Can I sue an out-of-state trucking company?',
      answer: 'Yes. Idaho courts have jurisdiction if the accident occurred in Idaho.'
    }
  ],

  neighboringStates: ['washington', 'oregon', 'nevada', 'utah', 'wyoming', 'montana']
};
