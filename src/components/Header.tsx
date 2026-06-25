'use client';

import Link from 'next/link';
import { useState } from 'react';
import Logo from '@/components/Logo';
import { Phone, ArrowRight } from '@/components/ui/Icon';

const navigation = [
  { name: 'Accident Types', href: '/accidents' },
  { name: 'States', href: '/states' },
  { name: 'FMCSA Regulations', href: '/fmcsa-regulations' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

const PHONE_NUMBER = '1-800-555-0123';
const PHONE_DISPLAY = '(800) 555-0123';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-700 bg-ink-900/95 backdrop-blur supports-[backdrop-filter]:bg-ink-900/85">
      <nav className="container-page flex items-center justify-between py-3.5" aria-label="Primary">
        <Logo variant="onDark" />

        {/* Desktop navigation */}
        <div className="hidden items-center gap-x-7 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="relative text-sm font-medium text-steel-200 transition-colors hover:text-white after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:bg-amber-500 after:transition-all hover:after:w-full"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-x-4 lg:flex">
          <a
            href={`tel:${PHONE_NUMBER}`}
            className="flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-amber-400"
          >
            <Phone className="h-4 w-4 text-amber-500" />
            {PHONE_DISPLAY}
          </a>
          <Link href="/contact" className="btn btn-primary !px-4 !py-2.5 !text-sm">
            Free Case Review
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-ink-700 lg:hidden">
          <div className="container-page space-y-1 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-lg px-3 py-2.5 text-base font-medium text-steel-200 hover:bg-ink-800 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-4 grid gap-2 border-t border-ink-700 pt-4">
              <a href={`tel:${PHONE_NUMBER}`} className="btn btn-ghost-ink w-full">
                <Phone className="h-5 w-5 text-amber-500" />
                Call {PHONE_DISPLAY}
              </a>
              <Link
                href="/contact"
                className="btn btn-primary w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                Free Case Review
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
