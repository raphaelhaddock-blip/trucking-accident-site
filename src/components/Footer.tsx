import Link from 'next/link';

// Collision types
const collisionTypes = [
  { name: 'Jackknife Accidents', href: '/accidents/jackknife-accidents' },
  { name: 'Rollover Accidents', href: '/accidents/rollover-accidents' },
  { name: 'Underride Accidents', href: '/accidents/underride-accidents' },
  { name: 'Rear-End Collisions', href: '/accidents/rear-end-collisions' },
  { name: 'Head-On Collisions', href: '/accidents/head-on-collisions' },
  { name: 'T-Bone Accidents', href: '/accidents/t-bone-accidents' },
  { name: 'Sideswipe Accidents', href: '/accidents/sideswipe-accidents' },
];

// Equipment & driver failures
const causeTypes = [
  { name: 'Brake Failure', href: '/accidents/brake-failure' },
  { name: 'Tire Blowout', href: '/accidents/tire-blowout' },
  { name: 'Driver Fatigue', href: '/accidents/driver-fatigue' },
  { name: 'Distracted Driving', href: '/accidents/distracted-driving' },
  { name: 'Speeding Accidents', href: '/accidents/speeding-accidents' },
  { name: 'Drunk Driving', href: '/accidents/drunk-driving' },
  { name: 'View All Types', href: '/accidents' },
];

const topStates = [
  { name: 'Texas', href: '/states/texas' },
  { name: 'California', href: '/states/california' },
  { name: 'Florida', href: '/states/florida' },
  { name: 'Georgia', href: '/states/georgia' },
  { name: 'Pennsylvania', href: '/states/pennsylvania' },
  { name: 'Ohio', href: '/states/ohio' },
  { name: 'Illinois', href: '/states/illinois' },
  { name: 'Tennessee', href: '/states/tennessee' },
  { name: 'View All States', href: '/states' },
];

const resources = [
  { name: 'FMCSA Regulations', href: '/fmcsa-regulations' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

const legal = [
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
  { name: 'Disclaimer', href: '/disclaimer' },
];

const PHONE_NUMBER = '1-800-555-0123';
const PHONE_DISPLAY = '(800) 555-0123';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-900 text-white">
      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <span className="text-xl font-bold text-white">
                18-Wheeler<span className="text-amber-500">Lawyers</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-300 max-w-md">
              Helping victims of 18-wheeler and semi-truck accidents get the compensation they deserve.
              Free consultations available 24/7.
            </p>
            <div className="mt-6">
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="inline-flex items-center gap-2 text-lg font-semibold text-amber-500 hover:text-amber-400 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                {PHONE_DISPLAY}
              </a>
              <p className="mt-1 text-sm text-gray-400">Available 24/7</p>
            </div>
            <div className="mt-4 flex gap-3">
              <span className="inline-flex items-center rounded-full bg-navy-800 px-3 py-1 text-xs font-medium text-amber-500">
                No Fee Unless You Win
              </span>
              <span className="inline-flex items-center rounded-full bg-navy-800 px-3 py-1 text-xs font-medium text-amber-500">
                Free Consultation
              </span>
            </div>
          </div>

          {/* Collision Types */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-500">
              Collision Types
            </h3>
            <ul className="mt-4 space-y-2">
              {collisionTypes.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Accident Causes */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-500">
              Accident Causes
            </h3>
            <ul className="mt-4 space-y-2">
              {causeTypes.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top States */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-500">
              Top States
            </h3>
            <ul className="mt-4 space-y-2">
              {topStates.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-500">
              Resources
            </h3>
            <ul className="mt-4 space-y-2">
              {resources.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-navy-800">
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-400">
              &copy; {currentYear} 18-Wheeler Lawyers. All rights reserved.
            </p>
            <div className="flex gap-6">
              {legal.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500 text-center md:text-left">
            Disclaimer: This website is for informational purposes only and does not constitute legal advice.
            Contacting us does not create an attorney-client relationship. Past results do not guarantee future outcomes.
          </p>
        </div>
      </div>
    </footer>
  );
}
