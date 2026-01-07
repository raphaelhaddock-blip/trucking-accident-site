import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import {
  STATE_SLUGS,
  STATE_NAMES,
  STATE_ABBREVIATIONS,
  getAvailableStateSlugs,
} from '@/lib/states-content';

export const metadata: Metadata = {
  title: 'Truck Accident Lawyers by State | Find Local Attorneys',
  description:
    'Find experienced 18-wheeler accident lawyers in your state. We connect truck accident victims with attorneys who understand local laws, courts, and negligence rules.',
  alternates: {
    canonical: '/states',
  },
};

// Phone number for CTAs
const PHONE_NUMBER = '1-800-555-0123';

// Group states by region
const REGIONS: Record<string, typeof STATE_SLUGS[number][]> = {
  'South': ['texas', 'florida', 'georgia', 'north-carolina', 'tennessee', 'alabama', 'louisiana', 'kentucky', 'mississippi', 'oklahoma', 'arkansas', 'south-carolina', 'virginia', 'west-virginia'],
  'Midwest': ['ohio', 'illinois', 'indiana', 'michigan', 'missouri', 'wisconsin', 'minnesota', 'iowa', 'kansas', 'nebraska', 'north-dakota', 'south-dakota'],
  'West': ['california', 'arizona', 'colorado', 'washington', 'oregon', 'new-mexico', 'utah', 'nevada', 'idaho', 'montana', 'wyoming', 'alaska', 'hawaii'],
  'Northeast': ['pennsylvania', 'new-york', 'new-jersey', 'maryland', 'connecticut', 'massachusetts', 'maine', 'new-hampshire', 'vermont', 'rhode-island', 'delaware'],
};

// Top 10 trucking fatality states
const TOP_STATES = [
  'texas',
  'california',
  'florida',
  'georgia',
  'pennsylvania',
  'ohio',
  'illinois',
  'north-carolina',
  'tennessee',
  'indiana',
] as const;

export default function StatesPage() {
  const availableStates = getAvailableStateSlugs();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-navy-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'States' },
            ]}
          />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            18-Wheeler Accident Lawyers by State
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl leading-relaxed">
            Trucking laws vary significantly from state to state. Statutes of limitations,
            comparative negligence rules, and damage caps all impact your case. Find attorneys
            who know your state&apos;s laws inside and out.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="bg-amber-500 text-navy-900 font-bold px-8 py-4 rounded-lg hover:bg-amber-400 transition text-center"
            >
              Free Case Evaluation: {PHONE_NUMBER}
            </a>
          </div>
        </div>
      </section>

      {/* Top 10 States Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy-900 mb-4">
            States with Highest Trucking Fatalities
          </h2>
          <p className="text-gray-600 mb-8">
            These states see the most commercial truck accident deaths annually,
            according to FMCSA data. If you were injured in one of these states,
            our attorneys have extensive experience with local trucking accident cases.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {TOP_STATES.map((slug, index) => {
              const hasContent = availableStates.includes(slug);
              return (
                <Link
                  key={slug}
                  href={`/states/${slug}`}
                  className={`relative rounded-lg p-6 text-center transition ${
                    hasContent
                      ? 'bg-navy-900 text-white hover:bg-navy-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="absolute top-2 left-2 w-6 h-6 bg-amber-500 text-navy-900 rounded-full text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div className="text-3xl font-bold mb-1">
                    {STATE_ABBREVIATIONS[slug]}
                  </div>
                  <div className="text-sm opacity-80">
                    {STATE_NAMES[slug]}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* States by Region */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy-900 mb-8">
            All States by Region
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(REGIONS).map(([region, states]) => (
              <div key={region}>
                <h3 className="text-xl font-bold text-navy-900 mb-4 pb-2 border-b border-amber-500">
                  {region}
                </h3>
                <ul className="space-y-2">
                  {states.map((slug) => {
                    const hasContent = availableStates.includes(slug);
                    return (
                      <li key={slug}>
                        <Link
                          href={`/states/${slug}`}
                          className={`flex items-center justify-between py-1 transition ${
                            hasContent
                              ? 'text-amber-600 hover:text-amber-700 font-medium'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          <span>{STATE_NAMES[slug]}</span>
                          <span className="text-gray-400">{STATE_ABBREVIATIONS[slug]}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why State Matters Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy-900 mb-8">
            Why Your State&apos;s Laws Matter
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-navy-900 mb-4">
                Statute of Limitations
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Each state sets its own deadline for filing a truck accident lawsuit.
                Ranging from 1-6 years depending on the state, missing this deadline
                can permanently bar your claim. An experienced local attorney ensures
                you never miss critical deadlines.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-navy-900 mb-4">
                Comparative Negligence
              </h3>
              <p className="text-gray-700 leading-relaxed">
                States use different rules when you share some fault in an accident.
                Some states follow &quot;pure&quot; comparative negligence, others use
                &quot;modified&quot; rules, and a few use strict contributory negligence.
                These rules dramatically affect your potential recovery.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-navy-900 mb-4">
                Damage Caps
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Some states cap certain damages, particularly non-economic damages
                like pain and suffering. Understanding these caps before trial helps
                attorneys develop strategies to maximize your total recovery within
                legal limits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Federal vs State Law Section */}
      <section className="py-16 bg-navy-900 text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">
            Federal Regulations + State Laws
          </h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Truck accident cases involve both federal FMCSA regulations and state personal
            injury laws. Federal regulations establish minimum safety standards that apply
            everywhere, while state laws govern how claims proceed in court.
          </p>
          <p className="text-gray-300 mb-8 leading-relaxed">
            Our attorneys understand both layers of law and how they interact. When a
            trucking company violates federal regulations, that violation can establish
            negligence under state law—potentially making your case stronger.
          </p>
          <Link
            href="/fmcsa-regulations"
            className="inline-block bg-amber-500 text-navy-900 font-bold px-8 py-4 rounded-lg hover:bg-amber-400 transition"
          >
            Learn About FMCSA Regulations &rarr;
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-navy-900 mb-4">
            Find a Truck Accident Lawyer in Your State
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            No matter which state your accident occurred in, we can connect you with
            experienced attorneys who handle trucking accident cases in that jurisdiction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="bg-amber-500 text-navy-900 font-bold px-8 py-4 rounded-lg hover:bg-amber-400 transition"
            >
              Call Now: {PHONE_NUMBER}
            </a>
            <Link
              href="/contact"
              className="bg-navy-900 text-white font-bold px-8 py-4 rounded-lg hover:bg-navy-800 transition"
            >
              Free Case Evaluation
            </Link>
          </div>
          <p className="text-gray-500 mt-6 text-sm">
            No Fee Unless You Win | Available 24/7 | Hablamos Espa&ntilde;ol
          </p>
        </div>
      </section>
    </div>
  );
}
