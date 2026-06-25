import Link from 'next/link';

const PHONE_NUMBER = '1-800-555-0123';

/**
 * Persistent mobile conversion bar. Hidden on >=md (desktop has header CTAs).
 * Body carries `has-sticky-cta` so page content reserves space and is never hidden.
 */
export default function MobileStickyCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 border-t border-ink-700 bg-ink-900/95 backdrop-blur md:hidden">
      <a
        href={`tel:${PHONE_NUMBER}`}
        className="flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-white"
      >
        <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
        </svg>
        Call Now
      </a>
      <Link
        href="/contact"
        className="flex items-center justify-center gap-1.5 bg-amber-500 py-3.5 text-sm font-bold text-ink-900"
      >
        Free Case Review
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </Link>
    </div>
  );
}
