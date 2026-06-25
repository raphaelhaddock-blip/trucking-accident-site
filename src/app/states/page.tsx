import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import CommandHero from '@/components/CommandHero';
import Section from '@/components/ui/Section';
import { ArrowRight, Phone, Clock, Scale, ShieldCheck, CheckCircle } from '@/components/ui/Icon';
import { heroPhoto, ogImage } from '@/lib/brand-images';
import {
  STATE_SLUGS,
  STATE_NAMES,
  STATE_ABBREVIATIONS,
  getAvailableStateSlugs,
} from '@/lib/states-content';

export const metadata: Metadata = {
  title: 'Truck Accident Lawyers by State | Find Local Attorneys',
  description:
    'Find experienced 18-wheeler accident lawyers in your state. We connect truck accident victims with attorneys who understand local laws, courts, and negligence rules.',
  alternates: {
    canonical: '/states',
  },
  openGraph: {
    title: 'Truck Accident Lawyers by State | Find Local Attorneys',
    description: 'Find experienced 18-wheeler accident lawyers in your state. We connect truck accident victims with local attorneys.',
    images: [{ url: ogImage({ kind: 'states' }), width: 1376, height: 768, alt: 'Truck Accident Lawyers by State' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Truck Accident Lawyers by State',
    description: 'Find experienced 18-wheeler accident lawyers in your state.',
    images: [ogImage({ kind: 'states' })],
  },
};

// Phone number for CTAs
const PHONE_NUMBER = '1-800-555-0123';
const PHONE_DISPLAY = '(800) 555-0123';

// Group states by region
const REGIONS: Record<string, typeof STATE_SLUGS[number][]> = {
  'South': ['texas', 'florida', 'georgia', 'north-carolina', 'tennessee', 'alabama', 'louisiana', 'kentucky', 'mississippi', 'oklahoma', 'arkansas', 'south-carolina', 'virginia', 'west-virginia'],
  'Midwest': ['ohio', 'illinois', 'indiana', 'michigan', 'missouri', 'wisconsin', 'minnesota', 'iowa', 'kansas', 'nebraska', 'north-dakota', 'south-dakota'],
  'West': ['california', 'arizona', 'colorado', 'washington', 'oregon', 'new-mexico', 'utah', 'nevada', 'idaho', 'montana', 'wyoming', 'alaska', 'hawaii'],
  'Northeast': ['pennsylvania', 'new-york', 'new-jersey', 'maryland', 'connecticut', 'massachusetts', 'maine', 'new-hampshire', 'vermont', 'rhode-island', 'delaware'],
};

// Top 10 trucking fatality states
const TOP_STATES = [
  'texas',
  'california',
  'florida',
  'georgia',
  'pennsylvania',
  'ohio',
  'illinois',
  'north-carolina',
  'tennessee',
  'indiana',
] as const;

// Why-state-matters legal factors
const STATE_FACTORS = [
  {
    Icon: Clock,
    title: 'Statute of Limitations',
    body: 'Each state sets its own deadline for filing a truck accident lawsuit. Ranging from 1-6 years depending on the state, missing this deadline can permanently bar your claim. An experienced local attorney ensures you never miss critical deadlines.',
  },
  {
    Icon: Scale,
    title: 'Comparative Negligence',
    body: 'States use different rules when you share some fault in an accident. Some states follow "pure" comparative negligence, others use "modified" rules, and a few use strict contributory negligence. These rules dramatically affect your potential recovery.',
  },
  {
    Icon: ShieldCheck,
    title: 'Damage Caps',
    body: 'Some states cap certain damages, particularly non-economic damages like pain and suffering. Understanding these caps before trial helps attorneys develop strategies to maximize your total recovery within legal limits.',
  },
];

// Hub-level statistics strip
const STATISTICS = [
  { value: '50', label: 'States Covered' },
  { value: '4,000+', label: 'Trucking Deaths Annually' },
  { value: '1-6 Yrs', label: 'Filing Deadline Range' },
  { value: '24/7', label: 'Attorney Availability' },
];

// Common 18-wheeler accident types
const ACCIDENT_TYPES = [
  { name: 'Jackknife Accidents', slug: 'jackknife-accidents' },
  { name: 'Rollover Accidents', slug: 'rollover-accidents' },
  { name: 'Underride Accidents', slug: 'underride-accidents' },
  { name: 'Rear-End Collisions', slug: 'rear-end-collisions' },
  { name: 'Head-On Collisions', slug: 'head-on-collisions' },
  { name: 'Brake Failure', slug: 'brake-failure' },
  { name: 'Tire Blowout', slug: 'tire-blowout' },
  { name: 'Driver Fatigue', slug: 'driver-fatigue' },
];

export default function StatesPage() {
  const availableStates = getAvailableStateSlugs();

  return (
    <>
      {/* Hero — cinematic command treatment */}
      <CommandHero
        size="lg"
        eyebrow="Nationwide Coverage"
        title="Truck Injury Lawyers by State"
        breadcrumb={
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'States' },
            ]}
          />
        }
        subtitle={
          <>
            Trucking laws vary significantly from state to state. Statutes of limitations,
            comparative negligence rules, and damage caps all impact your case. Find attorneys
            who know your state&apos;s laws inside and out.
          </>
        }
        stats={STATISTICS}
        imageSrc={heroPhoto({ kind: 'states' }) ?? undefined}
        imageAlt="National network of interstate trucking corridors"
      >
        <a href={`tel:${PHONE_NUMBER}`} className="btn btn-primary">
          <Phone className="h-5 w-5" />
          Free Case Evaluation: {PHONE_DISPLAY}
        </a>
        <Link href="/contact" className="btn btn-ghost-ink">
          Contact Us Online
          <ArrowRight className="h-5 w-5" />
        </Link>
      </CommandHero>

      {/* Top 10 States */}
      <Section
        tone="paper-2"
        eyebrow="Highest Risk"
        title="States with Highest Trucking Fatalities"
        intro="These states see the most commercial truck accident deaths annually, according to FMCSA data. If you were injured in one of these states, our attorneys have extensive experience with local trucking accident cases."
      >
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {TOP_STATES.map((slug, index) => {
            const hasContent = availableStates.includes(slug);
            return (
              <Link
                key={slug}
                href={`/states/${slug}`}
                className={`group relative flex flex-col items-center rounded-xl border p-6 text-center transition-colors ${
                  hasContent
                    ? 'border-line bg-white hover:border-ink-800'
                    : 'border-line bg-paper hover:border-ink-800 hover:bg-white'
                }`}
              >
                <span className="absolute left-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 font-mono text-xs font-bold text-ink-900">
                  {index + 1}
                </span>
                <div className="font-display text-3xl font-semibold text-ink-strong">
                  {STATE_ABBREVIATIONS[slug]}
                </div>
                <div className="mt-1 text-sm text-ink-muted group-hover:text-amber-700">
                  {STATE_NAMES[slug]}
                </div>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* States by Region — route-marker plates */}
      <Section
        tone="white"
        eyebrow="Full Directory"
        title="All States by Region"
        intro="Browse every state we cover, grouped by region. States with detailed guides are highlighted — and we connect victims with attorneys in all 50 states."
      >
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {Object.entries(REGIONS).map(([region, states]) => (
            <div key={region}>
              <h3 className="border-b border-amber-500 pb-2 text-xl font-bold text-ink-strong">
                {region}
              </h3>
              <ul className="mt-4 space-y-2">
                {states.map((slug) => {
                  const hasContent = availableStates.includes(slug);
                  return (
                    <li key={slug}>
                      <Link
                        href={`/states/${slug}`}
                        className={`flex items-center justify-between gap-3 py-1 transition-colors ${
                          hasContent
                            ? 'font-medium text-amber-600 hover:text-amber-700'
                            : 'text-ink-muted hover:text-ink-strong'
                        }`}
                      >
                        <span>{STATE_NAMES[slug]}</span>
                        <span className="flex h-7 w-9 shrink-0 items-center justify-center rounded-md border border-line bg-paper font-mono text-xs font-semibold text-ink-muted">
                          {STATE_ABBREVIATIONS[slug]}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Why State Matters */}
      <Section
        tone="paper"
        eyebrow="Why It Matters"
        title={
          <>
            Why Your State&apos;s Laws Matter
          </>
        }
        intro="The state where your crash happened shapes your deadline to file, how shared fault is handled, and the limits on what you can recover. Three factors carry the most weight."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {STATE_FACTORS.map(({ Icon, title, body }) => (
            <div key={title} className="card flex flex-col p-6">
              <Icon className="h-8 w-8 text-amber-600" />
              <h3 className="mt-4 text-xl font-bold text-ink-strong">{title}</h3>
              <p className="mt-2 leading-relaxed text-ink-muted">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Types of Accidents */}
      <Section
        tone="paper-2"
        eyebrow="Collision Types"
        title="Common 18-Wheeler Accident Types"
        intro="Different accident types present unique legal challenges. Understanding your accident type helps identify liable parties and build a stronger case."
      >
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {ACCIDENT_TYPES.map((accident) => (
            <Link
              key={accident.slug}
              href={`/accidents/${accident.slug}`}
              className="card card-hover group flex items-center justify-between gap-2 p-4"
            >
              <span className="text-sm font-medium text-ink-strong group-hover:text-amber-700">
                {accident.name}
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-amber-600 transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/accidents"
            className="inline-flex items-center gap-2 text-base font-semibold text-amber-600 hover:text-amber-700"
          >
            View All 20 Accident Types
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </Section>

      {/* Federal vs State Law — dark command section */}
      <section className="bg-command grain relative isolate overflow-hidden py-16 md:py-24">
        <div className="container-page max-w-4xl">
          <p className="eyebrow eyebrow-on-ink">Federal Leverage</p>
          <h2 className="mt-4 text-[length:var(--text-display-md)] text-white">
            Federal Regulations + State Laws
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-steel-200">
            Truck accident cases involve both federal FMCSA regulations and state personal
            injury laws. Federal regulations establish minimum safety standards that apply
            everywhere, while state laws govern how claims proceed in court.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-steel-200">
            Our attorneys understand both layers of law and how they interact. When a
            trucking company violates federal regulations, that violation can establish
            negligence under state law—potentially making your case stronger.
          </p>
          <Link href="/fmcsa-regulations" className="btn btn-primary mt-9">
            Learn About FMCSA Regulations
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <Section
        tone="ink"
        center
        eyebrow="Find Your Lawyer"
        title="Find a Truck Accident Lawyer in Your State"
        intro="No matter which state your accident occurred in, we can connect you with experienced attorneys who handle trucking accident cases in that jurisdiction."
      >
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <a href={`tel:${PHONE_NUMBER}`} className="btn btn-primary">
            <Phone className="h-5 w-5" />
            Call Now: {PHONE_DISPLAY}
          </a>
          <Link href="/contact" className="btn btn-ghost-ink">
            Free Case Evaluation
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
        <ul className="mt-8 flex flex-col items-center justify-center gap-4 text-sm text-steel-200 sm:flex-row sm:gap-8">
          {['No Fee Unless You Win', 'Available 24/7', 'Hablamos Español'].map((point) => (
            <li key={point} className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 shrink-0 text-amber-500" />
              {point}
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
