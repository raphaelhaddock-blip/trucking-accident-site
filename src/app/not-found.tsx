import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found | Truck Injury Lawyers',
  description: 'The page you are looking for could not be found. Find truck accident lawyers, accident types, and legal resources.',
};

const PHONE_NUMBER = '1-800-555-0123';

const popularAccidents = [
  { slug: 'jackknife-accidents', name: 'Jackknife Accidents' },
  { slug: 'rollover-accidents', name: 'Rollover Accidents' },
  { slug: 'rear-end-collisions', name: 'Rear-End Collisions' },
  { slug: 'underride-accidents', name: 'Underride Accidents' },
  { slug: 'head-on-collisions', name: 'Head-On Collisions' },
];

const topStates = [
  { slug: 'texas', name: 'Texas' },
  { slug: 'california', name: 'California' },
  { slug: 'florida', name: 'Florida' },
  { slug: 'georgia', name: 'Georgia' },
  { slug: 'ohio', name: 'Ohio' },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-navy-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <p className="text-2xl text-gray-300 mb-6">Page Not Found</p>
          <p className="text-gray-400 mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let us help you find what you need.
          </p>
          <a
            href={`tel:${PHONE_NUMBER}`}
            className="inline-block bg-amber-500 text-navy-900 font-bold px-8 py-4 rounded-lg hover:bg-amber-400 transition"
          >
            Call for Free Consultation: {PHONE_NUMBER}
          </a>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Navigation */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold text-navy-900 mb-4">Main Pages</h2>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-amber-600 hover:text-amber-700 font-medium">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/accidents" className="text-amber-600 hover:text-amber-700 font-medium">
                    Accident Types
                  </Link>
                </li>
                <li>
                  <Link href="/states" className="text-amber-600 hover:text-amber-700 font-medium">
                    Lawyers by State
                  </Link>
                </li>
                <li>
                  <Link href="/fmcsa-regulations" className="text-amber-600 hover:text-amber-700 font-medium">
                    FMCSA Regulations
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-amber-600 hover:text-amber-700 font-medium">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Popular Accident Types */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold text-navy-900 mb-4">Popular Accident Types</h2>
              <ul className="space-y-3">
                {popularAccidents.map((accident) => (
                  <li key={accident.slug}>
                    <Link
                      href={`/accidents/${accident.slug}`}
                      className="text-amber-600 hover:text-amber-700 font-medium"
                    >
                      {accident.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Top States */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold text-navy-900 mb-4">Top States</h2>
              <ul className="space-y-3">
                {topStates.map((state) => (
                  <li key={state.slug}>
                    <Link
                      href={`/states/${state.slug}`}
                      className="text-amber-600 hover:text-amber-700 font-medium"
                    >
                      {state.name} Truck Accident Lawyers
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-navy-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Legal Help?</h2>
          <p className="text-gray-300 mb-6">
            If you&apos;ve been injured in a truck accident, we&apos;re here to help.
            Get a free case evaluation today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="bg-amber-500 text-navy-900 font-bold px-8 py-4 rounded-lg hover:bg-amber-400 transition"
            >
              Call {PHONE_NUMBER}
            </a>
            <Link
              href="/contact"
              className="bg-white text-navy-900 font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition"
            >
              Contact Online
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
