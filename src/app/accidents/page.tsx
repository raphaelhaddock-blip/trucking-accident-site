import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import CommandHero from '@/components/CommandHero';
import Section from '@/components/ui/Section';
import { ArrowRight, Phone } from '@/components/ui/Icon';
import { heroPhoto, ogImage } from '@/lib/brand-images';
import { ACCIDENT_SLUGS, ACCIDENT_NAMES, getAccidentContent } from '@/lib/accidents-content';

export const metadata: Metadata = {
  title: '18-Wheeler Accident Types | Types of Semi-Truck Crashes',
  description:
    'Learn about the different types of 18-wheeler accidents including jackknife, rollover, underride, and more. Free consultation with experienced truck accident lawyers.',
  alternates: {
    canonical: '/accidents',
  },
  openGraph: {
    title: '18-Wheeler Accident Types | Types of Semi-Truck Crashes',
    description: 'Learn about the different types of 18-wheeler accidents including jackknife, rollover, underride, and more.',
    images: [{ url: ogImage({ kind: 'accidents' }), width: 1376, height: 768, alt: 'Types of 18-Wheeler Truck Accidents' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '18-Wheeler Accident Types',
    description: 'Learn about different types of 18-wheeler accidents.',
    images: [ogImage({ kind: 'accidents' })],
  },
};

const PHONE_NUMBER = '1-800-555-0123';
const PHONE_DISPLAY = '(800) 555-0123';

const heroStats = [
  { value: '5,000+', label: 'Fatal truck crashes annually' },
  { value: '20', label: 'Accident types we handle' },
  { value: '97%', label: 'Involve passenger vehicle occupant fatalities' },
];

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

// Alternate Section tones across the category groups for visual rhythm.
const categoryTones = ['paper-2', 'white', 'paper', 'white', 'paper-2'] as const;

const findByStates = [
  { name: 'Texas', abbr: 'TX', slug: 'texas' },
  { name: 'California', abbr: 'CA', slug: 'california' },
  { name: 'Florida', abbr: 'FL', slug: 'florida' },
  { name: 'Georgia', abbr: 'GA', slug: 'georgia' },
  { name: 'Pennsylvania', abbr: 'PA', slug: 'pennsylvania' },
  { name: 'Ohio', abbr: 'OH', slug: 'ohio' },
  { name: 'Illinois', abbr: 'IL', slug: 'illinois' },
  { name: 'Tennessee', abbr: 'TN', slug: 'tennessee' },
  { name: 'North Carolina', abbr: 'NC', slug: 'north-carolina' },
  { name: 'Indiana', abbr: 'IN', slug: 'indiana' },
];

export default function AccidentsPage() {
  return (
    <>
      {/* Hero — cinematic command treatment */}
      <CommandHero
        eyebrow="National Truck Accident Response"
        title="Types of 18-Wheeler Accidents"
        breadcrumb={
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Accident Types' },
            ]}
          />
        }
        subtitle={
          <>
            18-wheeler accidents take many forms, each presenting unique challenges and
            requiring specific legal expertise. Understanding the type of accident is crucial
            for building a strong case and identifying all liable parties.
          </>
        }
        stats={heroStats}
        imageSrc={heroPhoto({ kind: 'accidents' }) ?? undefined}
        imageAlt="Truck accident evidence and crash investigation records"
      >
        <a href={`tel:${PHONE_NUMBER}`} className="btn btn-primary">
          Free Case Evaluation: {PHONE_DISPLAY}
          <ArrowRight className="h-5 w-5" />
        </a>
        <Link href="/contact" className="btn btn-ghost-ink">
          <Phone className="h-5 w-5" />
          Contact Us Online
        </Link>
      </CommandHero>

      {/* Accident category groupings */}
      {accidentCategories.map((category, categoryIndex) => (
        <Section
          key={category.title}
          tone={categoryTones[categoryIndex % categoryTones.length]}
          eyebrow={category.title}
          title={category.title}
          intro={category.description}
        >
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {category.slugs.map((slug) => {
              const content = getAccidentContent(slug);
              const name = ACCIDENT_NAMES[slug as keyof typeof ACCIDENT_NAMES];

              return (
                <Link
                  key={slug}
                  href={`/accidents/${slug}`}
                  className="card card-hover group flex flex-col p-6"
                >
                  <div className="h-0.5 w-10 bg-amber-500 transition-all group-hover:w-16" />
                  <h3 className="mt-4 text-xl font-bold text-ink-strong">{name}</h3>
                  {content ? (
                    <p className="mt-2 flex-grow text-ink-muted">
                      {content.heroText.substring(0, 150)}...
                    </p>
                  ) : (
                    <p className="mt-2 flex-grow text-ink-muted">
                      Learn about {name.toLowerCase()} and your legal options.
                    </p>
                  )}
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600">
                    Learn more
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </Section>
      ))}

      {/* All accident types — cinematic dark command section */}
      <section className="bg-command grain relative isolate overflow-hidden py-16 md:py-24">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="eyebrow eyebrow-on-ink">Full Directory</p>
            <h2 className="mt-4 text-[length:var(--text-display-md)] text-white">
              All 18-Wheeler Accident Types
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-steel-200">
              Every type of truck accident we handle, in one place. Choose your accident type to
              learn about causes, liable parties, evidence, and your legal options.
            </p>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {ACCIDENT_SLUGS.map((slug) => (
              <Link
                key={slug}
                href={`/accidents/${slug}`}
                className="group inline-flex items-center gap-2 border-t border-ink-700 pt-3 text-steel-200 transition-colors hover:text-amber-400"
              >
                <ArrowRight className="h-4 w-4 shrink-0 text-amber-500 transition-transform group-hover:translate-x-1" />
                {ACCIDENT_NAMES[slug]}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Find by State */}
      <Section
        tone="white"
        eyebrow="Nationwide Coverage"
        title="Find Truck Accident Lawyers by State"
        intro="Trucking laws, statutes of limitations, and comparative negligence rules vary by state. Find an attorney who understands your state's legal landscape."
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {findByStates.map((state) => (
            <Link
              key={state.slug}
              href={`/states/${state.slug}`}
              className="group flex items-center gap-3 rounded-lg border border-line bg-paper p-3.5 transition-colors hover:border-ink-800 hover:bg-white"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-ink-900 font-mono text-sm font-semibold text-white transition-colors group-hover:bg-ink-800">
                {state.abbr}
              </span>
              <span className="text-sm font-medium text-ink-strong group-hover:text-amber-700">{state.name}</span>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/states" className="inline-flex items-center gap-2 text-base font-semibold text-amber-600 hover:text-amber-700">
            View All 50 States
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </Section>

      {/* CTA Section */}
      <section className="bg-ink-900 py-16 md:py-24">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow eyebrow-on-ink justify-center">Free Case Review</p>
            <h2 className="mt-4 text-[length:var(--text-display-md)] text-white">
              Injured in a Truck Accident?
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-steel-200">
              Our experienced attorneys handle all types of 18-wheeler accidents. We investigate
              thoroughly, identify all responsible parties, and fight for maximum compensation.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a href={`tel:${PHONE_NUMBER}`} className="btn btn-primary">
                <Phone className="h-5 w-5" />
                Call {PHONE_DISPLAY}
              </a>
              <Link href="/contact" className="btn btn-ghost-ink">
                Free Case Evaluation
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <p className="mt-6 text-sm text-steel-400">
              No Fee Unless You Win | Available 24/7
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
