import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

// Hero image from Sanity CDN - Side view truck
const HERO_IMAGE_URL = 'https://cdn.sanity.io/images/54bwni5t/production/8391509ade1b30502407263f03b21aad42eaedcb-1376x768.jpg';

export const metadata: Metadata = {
  title: 'Truck Injury Lawyers | Free Consultation',
  description:
    'Injured in an 18-wheeler crash? Our truck accident lawyers fight for maximum compensation. Free consultation. No fee unless you win. Call now.',
};

const accidentTypes = [
  {
    name: 'Jackknife Accidents',
    slug: 'jackknife-accidents',
    description: 'When a truck folds at the cab-trailer connection point',
  },
  {
    name: 'Rollover Accidents',
    slug: 'rollover-accidents',
    description: 'When an 18-wheeler tips over onto its side or roof',
  },
  {
    name: 'Underride Accidents',
    slug: 'underride-accidents',
    description: 'When a vehicle slides beneath a truck trailer',
  },
  {
    name: 'Rear-End Collisions',
    slug: 'rear-end-collisions',
    description: 'When a semi-truck crashes into the vehicle ahead',
  },
  {
    name: 'Head-On Collisions',
    slug: 'head-on-collisions',
    description: 'When a truck collides front-first with another vehicle',
  },
  {
    name: 'Brake Failure',
    slug: 'brake-failure',
    description: 'Accidents caused by defective or poorly maintained brakes',
  },
];

const trustElements = [
  { icon: '⚖️', title: 'No Fee Unless You Win', description: 'We only get paid if you do' },
  { icon: '📞', title: '24/7 Available', description: 'Call anytime, day or night' },
  { icon: '💰', title: 'Maximum Compensation', description: 'We fight for every dollar' },
  { icon: '🏆', title: 'Proven Results', description: 'Millions recovered for clients' },
];

const statistics = [
  { value: '$750K+', label: 'Minimum Carrier Insurance' },
  { value: '11 Hours', label: 'Max Daily Driving (FMCSA)' },
  { value: '4,000+', label: 'Trucking Deaths Annually' },
  { value: '72 Hours', label: 'Critical Evidence Window' },
];

export default function Home() {
  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'LegalService',
                '@id': '#organization',
                name: 'Truck Injury Lawyers',
                description:
                  'National legal referral service helping victims of 18-wheeler and semi-truck accidents find experienced attorneys.',
                url: 'https://trucking-accident-site.vercel.app',
                telephone: '1-800-555-0123',
                areaServed: {
                  '@type': 'Country',
                  name: 'United States',
                },
                serviceType: [
                  'Truck Accident Law',
                  '18-Wheeler Accidents',
                  'Semi-Truck Crashes',
                  'Commercial Vehicle Accidents',
                ],
                priceRange: 'Free Consultation',
              },
              {
                '@type': 'WebPage',
                '@id': '#webpage',
                name: 'Truck Injury Lawyers | Free Consultation',
                description:
                  'Injured in an 18-wheeler crash? Our truck accident lawyers fight for maximum compensation. Free consultation. No fee unless you win.',
                url: 'https://trucking-accident-site.vercel.app',
                isPartOf: { '@id': '#website' },
              },
              {
                '@type': 'WebSite',
                '@id': '#website',
                name: 'Truck Injury Lawyers',
                url: 'https://trucking-accident-site.vercel.app',
              },
            ],
          }),
        }}
      />

      {/* Hero Section */}
      <section className="relative bg-navy-900 py-20 lg:py-32 overflow-hidden">
        {/* Hero Background Image */}
        <Image
          src={HERO_IMAGE_URL}
          alt="18-wheeler semi-truck on highway at dusk"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Minimal Overlay - let the image DOMINATE */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/60 via-navy-900/20 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Truck Injury Lawyers
              </h1>
              <p className="mt-6 text-xl text-gray-300 leading-relaxed">
                Injured in a semi-truck crash? You may be entitled to significant compensation.
                Trucking companies have teams of lawyers—you deserve experienced advocates fighting
                for your rights.
              </p>
              <p className="mt-4 text-lg text-gray-400">
                We help victims of 18-wheeler accidents across the nation connect with attorneys who
                specialize in trucking litigation and understand FMCSA regulations.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-md bg-amber-500 px-6 py-4 text-lg font-semibold text-navy-900 shadow-lg hover:bg-amber-400 transition-colors"
                >
                  Free Case Evaluation
                  <svg
                    className="ml-2 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </Link>
                <a
                  href="tel:1-800-555-0123"
                  className="inline-flex items-center justify-center rounded-md border-2 border-white px-6 py-4 text-lg font-semibold text-white hover:bg-white hover:text-navy-900 transition-colors"
                >
                  <svg
                    className="mr-2 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                    />
                  </svg>
                  (800) 555-0123
                </a>
              </div>
          </div>
        </div>
      </section>

      {/* Trust Elements */}
      <section className="bg-white py-12 border-b">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {trustElements.map((item) => (
              <div key={item.title} className="text-center">
                <div className="text-3xl mb-2">{item.icon}</div>
                <h3 className="font-semibold text-navy-900">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-navy-900 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Why Trucking Accidents Are Different</h2>
            <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
              18-wheeler accidents aren&apos;t like car accidents. The stakes are higher, the injuries
              are more severe, and the legal landscape is more complex.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {statistics.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-amber-500">{stat.value}</div>
                <p className="mt-2 text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accident Types Section */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900">Types of 18-Wheeler Accidents</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Truck accidents come in many forms, each with unique causes and legal considerations.
              Understanding your accident type helps build a stronger case.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {accidentTypes.map((type) => (
              <Link
                key={type.slug}
                href={`/accidents/${type.slug}`}
                className="group rounded-xl bg-white p-6 shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
              >
                <h3 className="text-xl font-semibold text-navy-900 group-hover:text-amber-600 transition-colors">
                  {type.name}
                </h3>
                <p className="mt-2 text-gray-600">{type.description}</p>
                <span className="mt-4 inline-flex items-center text-amber-600 font-medium">
                  Learn more
                  <svg
                    className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/accidents"
              className="inline-flex items-center text-lg font-semibold text-amber-600 hover:text-amber-700"
            >
              View All 20 Accident Types
              <svg
                className="ml-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Top States Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900">
              Top States for Trucking Accidents
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              These states see the highest number of fatal truck crashes annually. Local laws,
              trucking corridors, and court systems vary significantly—your state matters.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {[
              { name: 'Texas', abbr: 'TX', slug: 'texas' },
              { name: 'California', abbr: 'CA', slug: 'california' },
              { name: 'Florida', abbr: 'FL', slug: 'florida' },
              { name: 'Georgia', abbr: 'GA', slug: 'georgia' },
              { name: 'Pennsylvania', abbr: 'PA', slug: 'pennsylvania' },
              { name: 'Ohio', abbr: 'OH', slug: 'ohio' },
              { name: 'Illinois', abbr: 'IL', slug: 'illinois' },
              { name: 'North Carolina', abbr: 'NC', slug: 'north-carolina' },
              { name: 'Tennessee', abbr: 'TN', slug: 'tennessee' },
              { name: 'Indiana', abbr: 'IN', slug: 'indiana' },
            ].map((state) => (
              <Link
                key={state.slug}
                href={`/states/${state.slug}`}
                className="group rounded-lg bg-navy-900 p-4 text-center hover:bg-navy-800 transition-colors"
              >
                <div className="text-2xl font-bold text-white">{state.abbr}</div>
                <div className="text-sm text-gray-300 group-hover:text-amber-400 transition-colors">
                  {state.name}
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/states"
              className="inline-flex items-center text-lg font-semibold text-amber-600 hover:text-amber-700"
            >
              View All 50 States
              <svg
                className="ml-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* FMCSA Section */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold text-navy-900">
                FMCSA Regulations: Your Key to Justice
              </h2>
              <p className="mt-6 text-lg text-gray-600">
                The Federal Motor Carrier Safety Administration (FMCSA) sets strict rules for
                trucking companies. When they violate these regulations, it often proves negligence
                and strengthens your case significantly.
              </p>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-gray-700">
                    <strong>Hours of Service (HOS)</strong> – Limits driving to 11 hours per day to
                    prevent fatigue
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-gray-700">
                    <strong>Electronic Logging Devices (ELD)</strong> – Digital records that can
                    prove violations
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-gray-700">
                    <strong>Drug & Alcohol Testing</strong> – Required after accidents, positive
                    results = strong evidence
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-gray-700">
                    <strong>Maintenance Records</strong> – Trucks must be inspected regularly; poor
                    maintenance = liability
                  </span>
                </li>
              </ul>
              <div className="mt-8">
                <Link
                  href="/fmcsa-regulations"
                  className="inline-flex items-center rounded-md bg-navy-900 px-6 py-3 text-base font-semibold text-white hover:bg-navy-800 transition-colors"
                >
                  Learn About FMCSA Regulations
                  <svg
                    className="ml-2 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="bg-gray-100 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-navy-900 mb-6">
                Multiple Parties May Be Liable
              </h3>
              <p className="text-gray-600 mb-6">
                Unlike car accidents, truck crashes often involve multiple defendants—each with their
                own insurance policy. This can significantly increase your potential recovery.
              </p>
              <ul className="space-y-3">
                {[
                  'Truck Driver',
                  'Trucking Company (Motor Carrier)',
                  'Freight Broker',
                  'Cargo Shipper/Loader',
                  'Truck/Parts Manufacturer',
                  'Maintenance Company',
                ].map((party) => (
                  <li key={party} className="flex items-center text-gray-700">
                    <span className="h-2 w-2 rounded-full bg-amber-500 mr-3" />
                    {party}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-amber-500 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-navy-900">
            Don&apos;t Wait—Evidence Disappears Quickly
          </h2>
          <p className="mt-4 text-xl text-navy-800 max-w-3xl mx-auto">
            Trucking companies send investigation teams within hours of a crash. ELD data can be
            overwritten, black boxes can be &quot;lost,&quot; and witnesses forget details. The sooner you act,
            the stronger your case.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-navy-900 px-8 py-4 text-lg font-semibold text-white hover:bg-navy-800 transition-colors"
            >
              Get Your Free Case Review
            </Link>
            <a
              href="tel:1-800-555-0123"
              className="inline-flex items-center justify-center rounded-md bg-white px-8 py-4 text-lg font-semibold text-navy-900 hover:bg-gray-100 transition-colors"
            >
              Call (800) 555-0123
            </a>
          </div>
        </div>
      </section>

      {/* Mobile Form (shown on mobile only) */}
      <section className="bg-navy-900 py-16 lg:hidden">
        <div className="mx-auto max-w-md px-4">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Get Your Free Case Review
          </h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full rounded-md border-0 bg-navy-800 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full rounded-md border-0 bg-navy-800 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full rounded-md border-0 bg-navy-800 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="w-full rounded-md bg-amber-500 px-6 py-4 text-lg font-semibold text-navy-900 hover:bg-amber-400 transition-colors"
            >
              Get Free Consultation
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
