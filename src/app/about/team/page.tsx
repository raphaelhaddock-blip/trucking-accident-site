import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata: Metadata = {
  title: 'Our Editorial Team | National Truck Accident Lawyers',
  description:
    'Meet the legal researchers and writers behind our trucking accident content. Our team combines legal expertise with transportation industry knowledge.',
  alternates: {
    canonical: '/about/team',
  },
};

// Team member profiles
const TEAM_MEMBERS = [
  {
    name: 'Editorial Team',
    role: 'Legal Content & Research',
    credentials: [
      'Dedicated trucking law research staff',
      'FMCSA regulations specialists',
      'Transportation industry analysts',
    ],
    bio: `Our editorial team specializes in trucking accident law and FMCSA regulations. We research, verify, and create comprehensive legal content to help truck accident victims understand their rights.

Every statistic we cite comes from verified government sources including NHTSA FARS, FMCSA Safety Measurement System, and state DOT reports. Our content undergoes rigorous fact-checking before publication.`,
    focus: [
      'State trucking laws research',
      'FMCSA regulation analysis',
      'Accident type investigations',
      'Settlement data verification',
    ],
  },
];

// Content standards
const CONTENT_STANDARDS = [
  {
    title: 'Verified Statistics',
    description:
      'All crash statistics come from NHTSA FARS, FMCSA, and state DOT databases. We cite our sources and update data annually.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: 'Legal Accuracy',
    description:
      'Our content on negligence laws, statutes of limitations, and trucking regulations is reviewed for accuracy and updated when laws change.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
        />
      </svg>
    ),
  },
  {
    title: 'Regular Updates',
    description:
      'Content is reviewed monthly. When new NHTSA data is released or regulations change, we update our pages within 30 days.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    ),
  },
  {
    title: 'Honest Ranges',
    description:
      'We provide settlement ranges based on industry data, not inflated verdicts. Every case is unique, and we make that clear.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

// Data sources we use
const DATA_SOURCES = [
  {
    name: 'NHTSA FARS',
    fullName: 'Fatality Analysis Reporting System',
    url: 'https://www.nhtsa.gov/research-data/fatality-analysis-reporting-system-fars',
    description: 'National database of fatal motor vehicle crashes',
  },
  {
    name: 'FMCSA',
    fullName: 'Federal Motor Carrier Safety Administration',
    url: 'https://www.fmcsa.dot.gov/safety/data-and-statistics',
    description: 'Commercial motor vehicle safety data and regulations',
  },
  {
    name: 'FHWA',
    fullName: 'Federal Highway Administration',
    url: 'https://www.fhwa.dot.gov/policyinformation/statistics.cfm',
    description: 'Highway statistics and infrastructure data',
  },
  {
    name: 'BTS',
    fullName: 'Bureau of Transportation Statistics',
    url: 'https://www.bts.gov/',
    description: 'Comprehensive transportation data and analysis',
  },
];

// Schema markup for the team page
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'National Truck Accident Lawyers',
  url: 'https://trucking-accident-site.vercel.app',
  description:
    'Legal referral service connecting truck accident victims with experienced attorneys nationwide.',
  foundingDate: '2024',
  knowsAbout: [
    'Trucking accident law',
    'FMCSA regulations',
    '18-wheeler accident claims',
    'Commercial vehicle liability',
    'Personal injury law',
  ],
  sameAs: ['https://trucking-accident-site.vercel.app'],
};

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Hero Section */}
      <section className="bg-navy-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'About', href: '/about' },
              { label: 'Editorial Team' },
            ]}
          />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Editorial Team</h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            Meet the researchers and writers behind our trucking accident legal content. We combine
            legal expertise with transportation industry knowledge to help accident victims
            understand their rights.
          </p>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          {TEAM_MEMBERS.map((member, index) => (
            <div key={index} className="mb-12 last:mb-0">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Avatar placeholder */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 bg-navy-900 rounded-full flex items-center justify-center">
                    <svg
                      className="w-16 h-16 text-amber-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Bio */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-navy-900 mb-2">{member.name}</h2>
                  <p className="text-amber-600 font-medium mb-4">{member.role}</p>

                  {/* Credentials */}
                  <div className="mb-4">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
                      Expertise
                    </h3>
                    <ul className="space-y-1">
                      {member.credentials.map((cred, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-700">
                          <svg
                            className="w-4 h-4 text-green-500 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {cred}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bio text */}
                  <div className="prose prose-gray max-w-none">
                    {member.bio.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="text-gray-700 leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Focus areas */}
                  <div className="mt-6">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                      Focus Areas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {member.focus.map((area, i) => (
                        <span
                          key={i}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Content Standards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy-900 mb-4 text-center">
            Our Content Standards
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            We hold ourselves to high standards of accuracy, transparency, and helpfulness. Here is
            how we approach creating legal content.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {CONTENT_STANDARDS.map((standard, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-amber-500 mb-4">{standard.icon}</div>
                <h3 className="text-xl font-bold text-navy-900 mb-2">{standard.title}</h3>
                <p className="text-gray-700 leading-relaxed">{standard.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Sources */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy-900 mb-4">Our Data Sources</h2>
          <p className="text-gray-600 mb-8">
            We cite official government sources for all statistics. Here are the primary databases
            we reference:
          </p>

          <div className="space-y-4">
            {DATA_SOURCES.map((source, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-navy-900">{source.name}</h3>
                    <p className="text-sm text-gray-500">{source.fullName}</p>
                    <p className="text-gray-700 mt-2">{source.description}</p>
                  </div>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-600 hover:text-amber-700 text-sm font-medium flex-shrink-0"
                  >
                    Visit &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Policy */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy-900 mb-6">Editorial Policy</h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              Our content is designed to help truck accident victims understand their legal options.
              We are a referral service that connects injured parties with experienced attorneys in
              their state.
            </p>

            <h3 className="text-xl font-bold text-navy-900 mt-8 mb-4">
              What We Are Not
            </h3>
            <ul className="space-y-2">
              <li>We are not a law firm and do not provide legal advice</li>
              <li>Reading our content does not create an attorney-client relationship</li>
              <li>Our settlement ranges are general industry data, not guarantees</li>
              <li>Every case is unique and outcomes depend on specific circumstances</li>
            </ul>

            <h3 className="text-xl font-bold text-navy-900 mt-8 mb-4">Corrections</h3>
            <p>
              If you find an error in our content, please{' '}
              <Link href="/contact" className="text-amber-600 hover:text-amber-700">
                contact us
              </Link>
              . We review all corrections promptly and update our content when errors are verified.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-navy-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Questions About Our Content?</h2>
          <p className="text-gray-300 mb-8">
            We are committed to providing accurate, helpful information. Reach out if you have
            questions or feedback.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-amber-500 text-navy-900 font-bold px-8 py-4 rounded-lg hover:bg-amber-400 transition"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
