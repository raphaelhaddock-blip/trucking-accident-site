import Link from 'next/link';

interface LogoProps {
  /** Color context the logo sits on. */
  variant?: 'onDark' | 'onLight';
  /** Show the "National Truck Accident Response" tagline under the wordmark. */
  tagline?: boolean;
  /** Wrap in a link to home. Default true. */
  asLink?: boolean;
  className?: string;
}

/**
 * Brand lockup: route-marker mark + wordmark. Inline SVG (crisp at any size,
 * theme-aware). Static kit equivalents live in /public/brand/.
 */
export default function Logo({
  variant = 'onDark',
  tagline = false,
  asLink = true,
  className = '',
}: LogoProps) {
  const wordColor = variant === 'onDark' ? 'text-white' : 'text-ink-strong';

  const inner = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 48 48"
        className="h-9 w-9 shrink-0"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="42" height="42" rx="11" fill="#0a1322" />
        <rect
          x="3.75"
          y="3.75"
          width="40.5"
          height="40.5"
          rx="10.25"
          fill="none"
          stroke="#7e90a8"
          strokeOpacity="0.45"
          strokeWidth="1.5"
        />
        <path
          d="M13 28.5 L24 16.5 L35 28.5"
          fill="none"
          stroke="#f5a300"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M14 35 H21" stroke="#fbbf24" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M27 35 H34" stroke="#fbbf24" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-[1.3rem] font-semibold tracking-tight ${wordColor}`}
        >
          Truck Injury<span className="text-amber-500"> Lawyers</span>
        </span>
        {tagline && (
          <span className="mt-1.5 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-steel-400">
            National Truck Accident Response
          </span>
        )}
      </span>
    </span>
  );

  if (!asLink) return inner;
  return (
    <Link href="/" aria-label="Truck Injury Lawyers — home" className="-m-1 p-1">
      {inner}
    </Link>
  );
}
