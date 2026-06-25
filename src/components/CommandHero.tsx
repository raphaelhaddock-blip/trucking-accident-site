import Image from 'next/image';
import type { ReactNode } from 'react';
import Stat from '@/components/ui/Stat';

interface CommandHeroProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /** CTA buttons / extra content under the subtitle. */
  children?: ReactNode;
  /** Breadcrumb node rendered above the eyebrow. */
  breadcrumb?: ReactNode;
  stats?: { value: string; label: string; note?: string }[];
  size?: 'lg' | 'md';
  /**
   * Optional documentary photo layer (heavily darkened, behind the command
   * gradient). Omit for the pure command treatment. See public/brand/README.md.
   */
  imageSrc?: string;
  imageAlt?: string;
}

/**
 * Cinematic dark hero — the "command center" treatment that replaces the old
 * Sanity stock-photo hero. Ink gradient + freight-network motif + grain, with an
 * optional darkened photo slot for when local documentary assets are generated.
 */
export default function CommandHero({
  eyebrow,
  title,
  subtitle,
  children,
  breadcrumb,
  stats,
  size = 'md',
  imageSrc,
  imageAlt = '',
}: CommandHeroProps) {
  const titleSize =
    size === 'lg'
      ? 'text-[length:var(--text-display-xl)]'
      : 'text-[length:var(--text-display-lg)]';

  return (
    <section className="bg-command grain relative isolate overflow-hidden">
      {/* Optional documentary photo, darkened to keep text legible */}
      {imageSrc && (
        <>
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="-z-10 object-cover opacity-30"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950/90 via-ink-900/80 to-ink-900/40" />
        </>
      )}
      {/* Freight-network motif */}
      <Image
        src="/brand/interstate-network.svg"
        alt=""
        aria-hidden="true"
        width={1200}
        height={620}
        className="pointer-events-none absolute right-0 top-0 -z-10 h-full w-full max-w-[60%] object-cover object-right opacity-70 md:opacity-90"
      />
      <div className="lane-lines absolute inset-0 -z-10 opacity-40" />

      <div className={`container-page ${size === 'lg' ? 'py-14 md:py-32' : 'py-12 md:py-24'}`}>
        <div className="max-w-3xl">
          {breadcrumb && <div className="mb-4 md:mb-6">{breadcrumb}</div>}
          {eyebrow && <p className="eyebrow eyebrow-on-ink">{eyebrow}</p>}
          <h1 className={`mt-3 font-display font-semibold tracking-tight text-white md:mt-5 ${titleSize}`}>
            {title}
          </h1>
          {subtitle && (
            <div className="mt-4 max-w-2xl text-base leading-relaxed text-steel-200 md:mt-6 md:text-xl [&>p:nth-child(n+2)]:hidden sm:[&>p:nth-child(n+2)]:block">
              {subtitle}
            </div>
          )}
          {children && (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-8 [&>*]:w-full sm:[&>*]:w-auto">
              {children}
            </div>
          )}
        </div>

        {stats && stats.length > 0 && (
          <div className="mt-10 grid max-w-4xl grid-cols-2 gap-x-6 gap-y-6 md:mt-14 md:grid-cols-4 md:gap-x-8 md:gap-y-8">
            {stats.map((s) => (
              <Stat key={s.label} value={s.value} label={s.label} note={s.note} onInk />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
