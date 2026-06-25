import Link from 'next/link';
import Logo from '@/components/Logo';
import { Phone } from '@/components/ui/Icon';

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
  { name: 'Blog & Guides', href: '/blog' },
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

const columns = [
  { title: 'Collision Types', links: collisionTypes },
  { title: 'Accident Causes', links: causeTypes },
  { title: 'Top States', links: topStates },
  { title: 'Resources', links: resources },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink-950 text-steel-200">
      <div className="hazard-strip" />
      <div className="container-page py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Logo variant="onDark" tagline />
            <p className="mt-5 max-w-md text-sm leading-relaxed text-steel-300">
              We connect victims of 18-wheeler and semi-truck accidents with experienced
              trucking-litigation attorneys nationwide. Free consultations, available 24/7.
            </p>
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="mt-6 inline-flex items-center gap-2 text-lg font-semibold text-amber-500 transition-colors hover:text-amber-400"
            >
              <Phone className="h-5 w-5" />
              {PHONE_DISPLAY}
            </a>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-ink-700 px-3 py-1 text-xs font-medium text-amber-500">
                No Fee Unless You Win
              </span>
              <span className="rounded-full border border-ink-700 px-3 py-1 text-xs font-medium text-amber-500">
                Free Consultation
              </span>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-steel-400">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-steel-300 transition-colors hover:text-white"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ink-800">
        <div className="container-page py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-steel-400">
              &copy; {currentYear} Truck Injury Lawyers. All rights reserved.
            </p>
            <div className="flex gap-6">
              {legal.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm text-steel-400 transition-colors hover:text-white"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <p className="mt-5 max-w-4xl text-xs leading-relaxed text-steel-500">
            Disclaimer: This website is a legal referral and informational service, not a law
            firm, and does not provide legal advice. Contacting us does not create an
            attorney-client relationship. Past results do not guarantee future outcomes.
          </p>
        </div>
      </div>
    </footer>
  );
}
