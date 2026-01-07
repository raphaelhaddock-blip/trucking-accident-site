import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { ACCIDENT_SLUGS, ACCIDENT_NAMES, getAccidentContent } from '@/lib/accidents-content';

export const metadata: Metadata = {
  title: '18-Wheeler Accident Types | Types of Semi-Truck Crashes',
  description:
    'Learn about the different types of 18-wheeler accidents including jackknife, rollover, underride, and more. Free consultation with experienced truck accident lawyers.',
  alternates: {
    canonical: '/accidents',
  },
};

const PHONE_NUMBER = '1-800-555-0123';

// Group accidents by category for display
const accidentCategories = [
  {
    title: 'Collision Types',
    description: 'Accidents classified by how vehicles make contact',
    slugs: [
      'jackknife-accidents',
      'rollover-accidents',
      'underride-accidents',
      'override-accidents',
      'rear-end-collisions',
      'head-on-collisions',
      't-bone-accidents',
      'sideswipe-accidents',
    ],
  },
  {
    title: 'Maneuver Accidents',
    description: 'Accidents that occur during specific driving maneuvers',
    slugs: ['wide-turn-accidents', 'blind-spot-accidents'],
  },
  {
    title: 'Equipment Failures',
    description: 'Accidents caused by mechanical problems',
    slugs: ['brake-failure', 'tire-blowout', 'improper-maintenance'],
  },
  {
    title: 'Driver-Related Causes',
    description: 'Accidents caused by driver behavior or impairment',
    slugs: [
      'driver-fatigue',
      'distracted-driving',
      'speeding-accidents',
      'drunk-driving',
    ],
  },
  {
    title: 'Cargo & Special Circumstances',
    description: 'Accidents involving cargo or unique situations',
    slugs: ['cargo-spill-accidents', 'hazmat-accidents', 'runaway-truck'],
  },
];

export default function AccidentsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-navy-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Accident Types' },
            ]}
          />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Types of 18-Wheeler Accidents
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl leading-relaxed">
            18-wheeler accidents take many forms, each presenting unique
            challenges and requiring specific legal expertise. Understanding the
            type of accident is crucial for building a strong case and
            identifying all liable parties.
          </p>
        </div>
      </section>

      {/* Overview Stats */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-amber-500">5,000+</div>
              <div className="text-gray-600 mt-1">
                Fatal truck crashes annually
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-500">20</div>
              <div className="text-gray-600 mt-1">Accident types we handle</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-500">97%</div>
              <div className="text-gray-600 mt-1">
                Involve passenger vehicle occupant fatalities
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accident Categories */}
      {accidentCategories.map((category, categoryIndex) => (
        <section
          key={categoryIndex}
          className={`py-16 ${categoryIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
        >
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-navy-900 mb-2">
              {category.title}
            </h2>
            <p className="text-gray-600 mb-8">{category.description}</p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.slugs.map((slug) => {
                const content = getAccidentContent(slug);
                const hasContent = !!content;

                return (
                  <Link
                    key={slug}
                    href={`/accidents/${slug}`}
                    className="group bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-amber-200 transition"
                  >
                    <h3 className="text-xl font-bold text-navy-900 group-hover:text-amber-600 transition mb-2">
                      {ACCIDENT_NAMES[slug as keyof typeof ACCIDENT_NAMES]}
                    </h3>
                    {hasContent ? (
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {content.heroText.substring(0, 150)}...
                      </p>
                    ) : (
                      <p className="text-gray-500 text-sm italic">
                        Learn about {ACCIDENT_NAMES[slug as keyof typeof ACCIDENT_NAMES].toLowerCase()} and your legal options.
                      </p>
                    )}
                    <div className="mt-4 text-amber-600 font-medium text-sm group-hover:text-amber-700">
                      Learn more &rarr;
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      {/* All Accident Types List */}
      <section className="py-16 bg-navy-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">
            All 18-Wheeler Accident Types
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            {ACCIDENT_SLUGS.map((slug) => (
              <Link
                key={slug}
                href={`/accidents/${slug}`}
                className="text-gray-300 hover:text-amber-400 transition"
              >
                {ACCIDENT_NAMES[slug]}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-amber-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-navy-900 mb-4">
            Injured in a Truck Accident?
          </h2>
          <p className="text-navy-900/80 mb-8 text-lg">
            Our experienced attorneys handle all types of 18-wheeler accidents.
            We investigate thoroughly, identify all responsible parties, and
            fight for maximum compensation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="bg-navy-900 text-white font-bold px-8 py-4 rounded-lg hover:bg-navy-800 transition"
            >
              Call {PHONE_NUMBER}
            </a>
            <Link
              href="/contact"
              className="bg-white text-navy-900 font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition"
            >
              Free Case Evaluation
            </Link>
          </div>
          <p className="text-navy-900/60 mt-6 text-sm">
            No Fee Unless You Win | Available 24/7
          </p>
        </div>
      </section>
    </div>
  );
}
