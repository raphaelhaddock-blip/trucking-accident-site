import { StateContent } from './types';

export const iowa: StateContent = {
  slug: 'iowa',
  name: 'Iowa',
  abbreviation: 'IA',
  h1: 'Iowa Truck Injury Lawyers',
  metaTitle: 'Iowa Truck Accident Lawyers | 18-Wheeler Attorneys in IA',
  metaDescription: 'Injured in an Iowa truck accident? Our attorneys fight for victims across Iowa. Free consultation. No fee unless you win.',

  heroText: `Iowa's position as the crossroads of America's interstate system creates enormous commercial truck traffic on state highways. With over 55 people killed annually in collisions involving large trucks, Iowa sees its share of devastating accidents despite its relatively small population.

The Iowa trucking industry serves critical national logistics functions. Over 75,000 commercial trucks are registered in the state, operating on I-80 (one of the busiest cross-country freight routes), I-35 (the NAFTA highway), and corridors connecting Chicago to Denver and Minneapolis to Kansas City.

Iowa's agricultural economy generates substantial truck traffic. Grain shipments, livestock transport, and farm equipment on rural highways create unique hazards. The state's harsh winters add ice, snow, and limited visibility to an already busy highway system.

Iowa follows modified comparative negligence with a 51% bar, meaning you can recover damages if you are 50% or less at fault, but recovery is barred if you are 51% or more at fault. The state has a two-year statute of limitations for personal injury claims.

If you've been injured in an Iowa truck accident, our Iowa truck accident lawyers know how to preserve evidence, investigate thoroughly, and hold negligent carriers accountable.`,

  truckingLaws: [
    {
      title: 'Iowa Commercial Vehicle Regulations',
      description: `Iowa regulates commercial vehicles under Iowa Code Chapter 321. This includes size and weight limits, registration requirements, and safety standards enforced by the Iowa Department of Transportation Motor Vehicle Enforcement.`
    },
    {
      title: 'Iowa Hours of Service Enforcement',
      description: `Iowa actively enforces federal Hours of Service regulations through the Iowa State Patrol and DOT Motor Vehicle Enforcement. The state conducts roadside inspections and operates weigh stations on major corridors.`
    },
    {
      title: 'Iowa CDL Requirements',
      description: `The Iowa DOT issues Commercial Driver's Licenses under federal standards with state-specific testing. Iowa maintains driver records and can disqualify drivers for violations.`
    },
    {
      title: 'Iowa Drug and Alcohol Testing',
      description: `Iowa enforces federal drug and alcohol testing requirements for commercial drivers. Iowa OWI laws apply to commercial drivers with a lower BAC threshold of 0.04%.`
    },
    {
      title: 'Iowa Agricultural Trucking',
      description: `Given Iowa's agricultural economy, the state has specific provisions for agricultural hauling including harvest season exemptions and farm vehicle regulations. Commercial carriers hauling grain and livestock must comply with all federal regulations.`
    },
    {
      title: 'Iowa Winter Trucking Regulations',
      description: `Iowa's severe winters require specific safety measures for commercial vehicles. The state has chain requirements in certain conditions and can close highways during severe weather events.`
    }
  ],

  corridors: [
    {
      name: 'Interstate 80 (I-80)',
      description: `Major east-west corridor crossing Iowa from Illinois to Nebraska, primary cross-country freight route. This is one of the busiest trucking corridors in the nation.`
    },
    {
      name: 'Interstate 35 (I-35)',
      description: `North-south corridor from Missouri through Des Moines to Minnesota, part of the NAFTA highway system. This corridor carries international freight traffic.`
    },
    {
      name: 'Interstate 29 (I-29)',
      description: `Western border route along the Missouri River from Missouri to South Dakota. This corridor serves agricultural regions in western Iowa.`
    },
    {
      name: 'Interstate 380 (I-380)',
      description: `Corridor connecting Cedar Rapids to I-80, serving eastern Iowa manufacturing and the Corridor region's growing economy.`
    }
  ],

  negligenceRule: {
    type: 'modified-51',
    description: 'Iowa follows modified comparative negligence with a 51% bar. You can recover damages if you are 50% or less at fault, but recovery is barred if you are 51% or more at fault.',
    details: `Under Iowa's modified comparative fault rule (Iowa Code § 668.3), your damages are reduced by your percentage of fault. If you are found 50% or less at fault, you can recover damages. However, if you are found 51% or more at fault, you recover nothing. For example, if you suffered $1,000,000 in damages and were 30% at fault, you could recover $700,000. But if a jury finds you 51% responsible, you recover nothing.`
  },

  statuteOfLimitations: {
    personalInjury: '2 Years',
    wrongfulDeath: '2 Years',
    propertyDamage: '5 Years',
    details: `Iowa has a two-year statute of limitations for personal injury claims arising from truck accidents under Iowa Code § 614.1. This means you must file your lawsuit within two years of the accident date. Wrongful death claims also have a two-year deadline. Missing these deadlines typically bars your claim forever.`
  },

  statistics: [
    { label: 'Annual Truck Accident Deaths', value: '55+' },
    { label: 'Registered Commercial Trucks', value: '75,000+' },
    { label: 'Miles of Interstate Highway', value: '782' },
    { label: 'Agricultural Freight', value: 'Grain & Livestock Hub' }
  ],

  courtInfo: `Truck accident cases in Iowa may be filed in state district courts or federal courts depending on the parties involved and amounts in controversy. Cases against trucking companies often involve defendants from multiple states, potentially qualifying for federal court under diversity jurisdiction if the amount in controversy exceeds $75,000.

Iowa state courts follow the Iowa Rules of Civil Procedure. Iowa allows discovery of corporate defendants, including depositions of company representatives, production of safety records, and inspection of vehicles and maintenance facilities.

Venue rules in Iowa generally allow cases to be filed where the accident occurred, where the defendant resides or has its principal office, or where the plaintiff resides. Polk County (Des Moines), Linn County (Cedar Rapids), and Scott County (Davenport) handle many truck accident cases.

The Northern and Southern Districts of Iowa federal courts handle trucking cases involving out-of-state defendants.`,

  lastUpdated: '2026-01-08',

  whyHireLocal: `Iowa truck accident cases require attorneys who understand both federal FMCSA regulations and the nuances of Iowa state law. Local counsel knows the Iowa court system, local procedures, and the judges who will hear your case.

Iowa's modified comparative negligence rules mean that fault allocation is critical to your recovery. Experienced local attorneys know how to minimize victim fault and maximize trucking company responsibility.

An Iowa truck accident lawyer understands the state's position as a critical national crossroads and the unique hazards of agricultural trucking. They know how grain transport, livestock hauling, and seasonal farm equipment contribute to accidents and can investigate cases involving these factors.`,

  faqs: [
    {
      question: 'What is the statute of limitations for truck accident cases in Iowa?',
      answer: 'Iowa has a two-year statute of limitations for personal injury claims from truck accidents. Wrongful death claims must also be filed within two years. Missing these deadlines typically bars your claim forever.'
    },
    {
      question: 'Can I still recover damages if I was partially at fault for an Iowa truck accident?',
      answer: 'Yes, but Iowa follows modified comparative negligence with a 51% bar. You can recover damages if you are 50% or less at fault, but your recovery is reduced by your percentage of fault. If you are 51% or more at fault, you cannot recover any damages.'
    },
    {
      question: 'What damages can I recover in an Iowa truck accident case?',
      answer: 'Iowa allows recovery of economic damages (medical expenses, lost wages, property damage, future earning capacity) and non-economic damages (pain and suffering, mental anguish, loss of enjoyment of life). Punitive damages may be available in cases involving willful and wanton conduct.'
    },
    {
      question: 'How long do trucking companies have to keep records in Iowa?',
      answer: 'Federal regulations require trucking companies to retain driver qualification files, hours of service records, vehicle inspection reports, and accident records for specific periods. An attorney can send preservation letters requiring the company to retain evidence.'
    },
    {
      question: 'Can I sue a trucking company based in another state for an Iowa accident?',
      answer: 'Yes. If a truck accident occurs in Iowa, Iowa courts generally have jurisdiction over the case regardless of where the trucking company is headquartered.'
    }
  ],

  neighboringStates: ['minnesota', 'wisconsin', 'illinois', 'missouri', 'nebraska', 'south-dakota']
};
