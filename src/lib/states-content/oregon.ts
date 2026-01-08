import { StateContent } from './types';

export const oregon: StateContent = {
  slug: 'oregon',
  name: 'Oregon',
  abbreviation: 'OR',
  h1: 'Oregon Truck Injury Lawyers',
  metaTitle: 'Oregon Truck Accident Lawyers | 18-Wheeler Attorneys in OR',
  metaDescription: 'Injured in an Oregon truck accident? Our attorneys fight for victims across Oregon. Free consultation. No fee unless you win.',

  heroText: `Oregon's position as a Pacific gateway and corridor between California and Washington creates significant commercial truck traffic on state highways. With over 55 people killed annually in collisions involving large trucks, Oregon roadways see devastating accidents.

The Oregon trucking industry handles substantial freight volumes. Over 75,000 commercial trucks are registered in the state, operating on I-5 (the primary West Coast freight corridor), I-84 through the Columbia River Gorge, and routes serving the Port of Portland.

The Columbia River Gorge on I-84 presents unique hazards. Challenging grades, frequent high winds, and weather conditions contribute to serious truck accidents. The Gorge's microclimate creates sudden wind gusts that have overturned trucks and caused multi-vehicle crashes.

Oregon follows modified comparative negligence with a 51% bar, meaning you can recover damages if you are 50% or less at fault. The state has a two-year statute of limitations for personal injury claims.

If you've been injured in an Oregon truck accident, our Oregon truck accident lawyers know how to preserve evidence, investigate thoroughly, and hold negligent carriers accountable.`,

  truckingLaws: [
    {
      title: 'Oregon Commercial Vehicle Regulations',
      description: `Oregon regulates commercial vehicles under Oregon Revised Statutes Chapter 825. This includes size and weight limits, registration requirements, and safety standards enforced by the Oregon Department of Transportation Motor Carrier Division.`
    },
    {
      title: 'Oregon Hours of Service Enforcement',
      description: `Oregon actively enforces federal Hours of Service regulations through the Oregon State Police and ODOT. The state conducts roadside inspections and operates weigh stations throughout the highway system.`
    },
    {
      title: 'Oregon CDL Requirements',
      description: `The Oregon DMV issues Commercial Driver's Licenses under federal standards with state-specific testing. Oregon maintains driver records and can disqualify drivers for violations.`
    },
    {
      title: 'Oregon Drug and Alcohol Testing',
      description: `Oregon enforces federal drug and alcohol testing requirements for commercial drivers. Oregon DUII laws apply to commercial drivers with a lower BAC threshold of 0.04%.`
    },
    {
      title: 'Oregon Gorge Wind Regulations',
      description: `The Columbia River Gorge has specific regulations for commercial vehicles during high wind events. Wind restrictions can close portions of I-84 to high-profile vehicles.`
    },
    {
      title: 'Oregon Environmental Trucking Regulations',
      description: `Oregon has specific environmental regulations for commercial vehicles including emissions standards and idle restrictions. The Port of Portland has additional clean truck requirements.`
    }
  ],

  corridors: [
    {
      name: 'Interstate 5 (I-5)',
      description: `Major north-south corridor from California through Portland to Washington, primary West Coast freight route. The Portland metropolitan section sees heavy truck congestion.`
    },
    {
      name: 'Interstate 84 (I-84)',
      description: `East-west corridor through the Columbia River Gorge connecting Portland to Idaho. Challenging grades, weather conditions, and high winds create significant trucking hazards.`
    },
    {
      name: 'Interstate 205 (I-205)',
      description: `Eastern bypass of Portland, heavily used for freight avoiding downtown congestion. This corridor serves distribution centers east of Portland.`
    },
    {
      name: 'US Highway 97',
      description: `North-south route through central Oregon, important for agricultural and timber freight. This route serves Oregon's interior communities.`
    }
  ],

  negligenceRule: {
    type: 'modified-51',
    description: 'Oregon follows modified comparative negligence with a 51% bar. You can recover damages if you are 50% or less at fault, but recovery is barred if you are 51% or more at fault.',
    details: `Under Oregon's modified comparative fault rule (ORS 31.600), your damages are reduced by your percentage of fault. If you are found 50% or less at fault, you can recover damages. However, if you are found 51% or more at fault, you recover nothing.`
  },

  statuteOfLimitations: {
    personalInjury: '2 Years',
    wrongfulDeath: '3 Years',
    propertyDamage: '6 Years',
    details: `Oregon has a two-year statute of limitations for personal injury claims arising from truck accidents under ORS 12.110. Wrongful death claims have a three-year deadline. Missing these deadlines typically bars your claim forever.`
  },

  statistics: [
    { label: 'Annual Truck Accident Deaths', value: '55+' },
    { label: 'Registered Commercial Trucks', value: '75,000+' },
    { label: 'Miles of Interstate Highway', value: '728' },
    { label: 'Columbia River Gorge', value: 'Challenging Wind Conditions' }
  ],

  courtInfo: `Truck accident cases in Oregon may be filed in state circuit courts or federal courts. Oregon follows the Oregon Rules of Civil Procedure. Multnomah County (Portland), Lane County (Eugene), and Jackson County (Medford) handle many truck accident cases. The District of Oregon federal court handles cases involving out-of-state defendants.`,

  lastUpdated: '2026-01-08',

  whyHireLocal: `Oregon truck accident cases require attorneys who understand both federal FMCSA regulations and the nuances of Oregon state law. Local counsel knows the Oregon court system and understands the unique hazards of the Columbia River Gorge and mountain passes. They know how weather and wind conditions contribute to accidents and can effectively investigate these cases.`,

  faqs: [
    {
      question: 'What is the statute of limitations for truck accident cases in Oregon?',
      answer: 'Oregon has a two-year statute of limitations for personal injury claims from truck accidents. Wrongful death claims have a three-year deadline. Missing these deadlines typically bars your claim forever.'
    },
    {
      question: 'Can I still recover damages if I was partially at fault for an Oregon truck accident?',
      answer: 'Yes, but Oregon follows modified comparative negligence with a 51% bar. You can recover damages if you are 50% or less at fault. If you are 51% or more at fault, you cannot recover any damages.'
    },
    {
      question: 'What damages can I recover in an Oregon truck accident case?',
      answer: 'Oregon allows recovery of economic damages (medical expenses, lost wages, property damage) and non-economic damages (pain and suffering). Oregon has no cap on non-economic damages in most cases. Punitive damages are available in limited circumstances.'
    },
    {
      question: 'How long do trucking companies have to keep records in Oregon?',
      answer: 'Federal regulations require trucking companies to retain records for specific periods. An attorney can send preservation letters requiring the company to retain evidence.'
    },
    {
      question: 'Can I sue a trucking company based in another state for an Oregon accident?',
      answer: 'Yes. If a truck accident occurs in Oregon, Oregon courts have jurisdiction regardless of where the trucking company is headquartered.'
    }
  ],

  neighboringStates: ['washington', 'idaho', 'nevada', 'california']
};
