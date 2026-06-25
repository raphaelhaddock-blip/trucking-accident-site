import Link from 'next/link';
import type { Metadata } from 'next';
import CaseEvaluationForm from '@/components/CaseEvaluationForm';
import CommandHero from '@/components/CommandHero';
import Section from '@/components/ui/Section';
import {
  ArrowRight,
  Phone,
  ShieldCheck,
  Scale,
  CheckCircle,
  Document,
  AlertTriangle,
  Users,
  Clock,
} from '@/components/ui/Icon';

// Hero image from Sanity CDN - Side view truck (kept for OG/social cards only)
const HERO_IMAGE_URL = 'https://trucking-accident-site.vercel.app/brand/og-default.png';

const PHONE_NUMBER = '1-800-555-0123';
const PHONE_DISPLAY = '(800) 555-0123';

export const metadata: Metadata = {
  title: 'Truck Injury Lawyers | Free Consultation',
  description:
    'Injured in an 18-wheeler crash? Our truck accident lawyers fight for maximum compensation. Free consultation. No fee unless you win. Call now.',
  openGraph: {
    title: 'Truck Injury Lawyers | Free Consultation',
    description: 'Injured in an 18-wheeler crash? Our truck accident lawyers fight for maximum compensation. Free consultation. No fee unless you win.',
    images: [
      {
        url: HERO_IMAGE_URL,
        width: 1376,
        height: 768,
        alt: '18-wheeler semi-truck on highway at dusk',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Truck Injury Lawyers | Free Consultation',
    description: 'Injured in an 18-wheeler crash? Our truck accident lawyers fight for maximum compensation.',
    images: [HERO_IMAGE_URL],
  },
};

const accidentTypes = [
  { name: 'Jackknife Accidents', slug: 'jackknife-accidents', description: 'When a truck folds at the cab-trailer connection point' },
  { name: 'Rollover Accidents', slug: 'rollover-accidents', description: 'When an 18-wheeler tips over onto its side or roof' },
  { name: 'Underride Accidents', slug: 'underride-accidents', description: 'When a vehicle slides beneath a truck trailer' },
  { name: 'Rear-End Collisions', slug: 'rear-end-collisions', description: 'When a semi-truck crashes into the vehicle ahead' },
  { name: 'Head-On Collisions', slug: 'head-on-collisions', description: 'When a truck collides front-first with another vehicle' },
  { name: 'Brake Failure', slug: 'brake-failure', description: 'Accidents caused by defective or poorly maintained brakes' },
];

const trustElements = [
  { Icon: ShieldCheck, title: 'No Fee Unless You Win', description: 'We only get paid if you do' },
  { Icon: Phone, title: '24/7 Available', description: 'Call anytime, day or night' },
  { Icon: Scale, title: 'Maximum Compensation', description: 'We fight for every dollar' },
  { Icon: CheckCircle, title: 'Proven Results', description: 'Millions recovered for clients' },
];

const statistics = [
  { value: '$750K+', label: 'Minimum Carrier Insurance' },
  { value: '11 Hours', label: 'Max Daily Driving (FMCSA)' },
  { value: '4,000+', label: 'Trucking Deaths Annually' },
  { value: '72 Hours', label: 'Critical Evidence Window' },
];

const topStates = [
  { name: 'Texas', abbr: 'TX', slug: 'texas' },
  { name: 'California', abbr: 'CA', slug: 'california' },
  { name: 'Florida', abbr: 'FL', slug: 'florida' },
  { name: 'Georgia', abbr: 'GA', slug: 'georgia' },
  { name: 'Pennsylvania', abbr: 'PA', slug: 'pennsylvania' },
  { name: 'Ohio', abbr: 'OH', slug: 'ohio' },
  { name: 'Illinois', abbr: 'IL', slug: 'illinois' },
  { name: 'North Carolina', abbr: 'NC', slug: 'north-carolina' },
  { name: 'Tennessee', abbr: 'TN', slug: 'tennessee' },
  { name: 'Indiana', abbr: 'IN', slug: 'indiana' },
];

const fmcsaRules = [
  { title: 'Hours of Service (HOS)', body: 'Limits driving to 11 hours per day to prevent fatigue' },
  { title: 'Electronic Logging Devices (ELD)', body: 'Digital records that can prove violations' },
  { title: 'Drug & Alcohol Testing', body: 'Required after accidents — positive results are strong evidence' },
  { title: 'Maintenance Records', body: 'Trucks must be inspected regularly; poor maintenance means liability' },
];

const liableParties = [
  'Truck Driver',
  'Trucking Company (Motor Carrier)',
  'Freight Broker',
  'Cargo Shipper / Loader',
  'Truck / Parts Manufacturer',
  'Maintenance Company',
];

const whyDifferent = [
  { Icon: AlertTriangle, title: 'Catastrophic Injuries', body: 'An 80,000-pound commercial truck creates devastating impact forces. Victims often suffer traumatic brain injuries, spinal cord damage, multiple fractures, and internal organ injuries that require extensive treatment. Many survivors face permanent disabilities.' },
  { Icon: Users, title: 'Complex Liability', body: 'Unlike car accidents with one at-fault driver, truck crashes often involve multiple liable parties: the driver, trucking company, freight broker, cargo shipper, maintenance provider, and equipment manufacturer. Each may carry separate insurance policies.' },
  { Icon: Scale, title: 'Federal Regulations', body: 'The Federal Motor Carrier Safety Administration enforces detailed rules on hours of service, driver qualifications, vehicle maintenance, cargo securement, and drug testing. Violations of these rules can prove negligence and strengthen your case.' },
  { Icon: Document, title: 'Critical Evidence', body: 'Electronic logging devices, black box data, driver qualification files, inspection reports, and maintenance records contain crucial evidence. Trucking companies know this — they often send rapid response teams within hours of a crash.' },
  { Icon: ShieldCheck, title: 'Higher Insurance Limits', body: 'Federal law requires commercial trucks to carry minimum liability coverage of $750,000 to $5 million depending on cargo type. That means greater potential compensation — but also more aggressive defense tactics from insurers.' },
  { Icon: CheckCircle, title: 'Expert Analysis Required', body: 'Successful truck accident claims often require accident reconstruction specialists, medical experts, trucking industry consultants, and economic damages analysts. Building a strong case demands resources most individuals cannot access alone.' },
];

export default function Home() {
  return (
    <>
      {/* JSON-LD Schema — preserved verbatim */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'LegalService',
                '@id': '#organization',
                name: 'Truck Injury Lawyers',
                description:
                  'National legal referral service helping victims of 18-wheeler and semi-truck accidents find experienced attorneys.',
                url: 'https://trucking-accident-site.vercel.app',
                telephone: '1-800-555-0123',
                areaServed: { '@type': 'Country', name: 'United States' },
                serviceType: [
                  'Truck Accident Law',
                  '18-Wheeler Accidents',
                  'Semi-Truck Crashes',
                  'Commercial Vehicle Accidents',
                ],
                priceRange: 'Free Consultation',
              },
              {
                '@type': 'WebPage',
                '@id': '#webpage',
                name: 'Truck Injury Lawyers | Free Consultation',
                description:
                  'Injured in an 18-wheeler crash? Our truck accident lawyers fight for maximum compensation. Free consultation. No fee unless you win.',
                url: 'https://trucking-accident-site.vercel.app',
                isPartOf: { '@id': '#website' },
              },
              {
                '@type': 'WebSite',
                '@id': '#website',
                name: 'Truck Injury Lawyers',
                url: 'https://trucking-accident-site.vercel.app',
              },
            ],
          }),
        }}
      />

      {/* Hero — cinematic command treatment */}
      <CommandHero
        size="lg"
        eyebrow="National Truck Accident Response"
        title="Truck Injury Lawyers"
        subtitle={
          <>
            Injured in a semi-truck crash? You may be entitled to significant compensation.
            Trucking companies have teams of lawyers the moment a crash happens — you deserve
            experienced advocates who understand FMCSA regulations fighting for you.
          </>
        }
        stats={statistics}
      >
        <Link href="/contact" className="btn btn-primary">
          Free Case Evaluation
          <ArrowRight className="h-5 w-5" />
        </Link>
        <a href={`tel:${PHONE_NUMBER}`} className="btn btn-ghost-ink">
          <Phone className="h-5 w-5" />
          {PHONE_DISPLAY}
        </a>
      </CommandHero>

      {/* Trust bar */}
      <div className="border-b border-line bg-white">
        <div className="container-page grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
          {trustElements.map(({ Icon, title, description }) => (
            <div key={title} className="flex items-start gap-3">
              <Icon className="mt-0.5 h-7 w-7 shrink-0 text-amber-600" />
              <div>
                <h3 className="text-sm font-bold text-ink-strong">{title}</h3>
                <p className="text-sm text-ink-muted">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accident types */}
      <Section
        tone="paper-2"
        eyebrow="Collision Types"
        title="Types of 18-Wheeler Accidents"
        intro="Truck accidents come in many forms, each with unique causes and legal considerations. Understanding your accident type helps build a stronger case."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {accidentTypes.map((type) => (
            <Link
              key={type.slug}
              href={`/accidents/${type.slug}`}
              className="card card-hover group flex flex-col p-6"
            >
              <div className="h-0.5 w-10 bg-amber-500 transition-all group-hover:w-16" />
              <h3 className="mt-4 text-xl font-bold text-ink-strong">{type.name}</h3>
              <p className="mt-2 flex-grow text-ink-muted">{type.description}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600">
                Learn more
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/accidents" className="inline-flex items-center gap-2 text-base font-semibold text-amber-600 hover:text-amber-700">
            View All 20 Accident Types
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </Section>

      {/* National reach — state finder */}
      <Section
        tone="white"
        eyebrow="Nationwide Coverage"
        title="Top States for Trucking Accidents"
        intro="These states see the highest number of fatal truck crashes annually. Local laws, trucking corridors, and court systems vary significantly — your state matters."
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {topStates.map((state) => (
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

      {/* FMCSA + liable parties — dark command section */}
      <section className="bg-command grain relative isolate overflow-hidden py-16 md:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow eyebrow-on-ink">Federal Leverage</p>
            <h2 className="mt-4 text-[length:var(--text-display-md)] text-white">
              FMCSA Regulations: Your Key to Justice
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-steel-200">
              The Federal Motor Carrier Safety Administration sets strict rules for trucking
              companies. When they violate these regulations, it often proves negligence and
              strengthens your case significantly.
            </p>
            <ul className="mt-8 space-y-5">
              {fmcsaRules.map((rule) => (
                <li key={rule.title} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-6 w-6 shrink-0 text-amber-500" />
                  <span className="text-steel-200">
                    <strong className="font-semibold text-white">{rule.title}</strong> — {rule.body}
                  </span>
                </li>
              ))}
            </ul>
            <Link href="/fmcsa-regulations" className="btn btn-primary mt-9">
              Learn About FMCSA Regulations
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="rounded-2xl border border-ink-700 bg-ink-850/70 p-8 backdrop-blur">
            <p className="eyebrow eyebrow-on-ink">
              <Users className="h-4 w-4" /> Who Pays
            </p>
            <h3 className="mt-3 text-xl font-bold text-white">Multiple Parties May Be Liable</h3>
            <p className="mt-3 text-steel-300">
              Unlike car accidents, truck crashes often involve several defendants — each with
              their own insurance policy. That can significantly increase your potential recovery.
            </p>
            <ul className="mt-6 space-y-3">
              {liableParties.map((party) => (
                <li key={party} className="flex items-center gap-3 border-t border-ink-700 pt-3 text-steel-200">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                  {party}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Why truck cases are different */}
      <Section
        tone="paper"
        eyebrow="Why It's Different"
        title="Why Truck Accident Cases Require Specialized Legal Help"
        intro="18-wheeler accidents aren't like car accidents. The stakes are higher, the injuries are more severe, and the legal landscape is far more complex."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {whyDifferent.map(({ Icon, title, body }) => (
            <div key={title} className="card flex flex-col p-6">
              <Icon className="h-8 w-8 text-amber-600" />
              <h3 className="mt-4 text-lg font-bold text-ink-strong">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Urgency band */}
      <section className="relative overflow-hidden bg-ink-950">
        <div className="hazard-strip" />
        <div className="container-page py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow eyebrow-on-ink justify-center !text-signal-400">
              <Clock className="h-4 w-4" /> Time-Sensitive
            </p>
            <h2 className="mt-4 text-[length:var(--text-display-md)] text-white">
              Don&apos;t Wait — Evidence Disappears Quickly
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-steel-200">
              Trucking companies send investigation teams within hours of a crash. ELD data can be
              overwritten, black boxes can be &quot;lost,&quot; and witnesses forget details. The sooner
              you act, the stronger your case. Our network of experienced truck accident attorneys
              has recovered millions for victims — they know how to preserve critical evidence and
              take on major carriers and their insurers.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/contact" className="btn btn-primary">
                Get Your Free Case Review
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a href={`tel:${PHONE_NUMBER}`} className="btn btn-ghost-ink">
                <Phone className="h-5 w-5" />
                Call {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Case evaluation form */}
      <section className="bg-ink-900 py-16 md:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow eyebrow-on-ink">Free Case Review</p>
            <h2 className="mt-4 text-[length:var(--text-display-md)] text-white">
              Tell us what happened. We&apos;ll do the rest.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-steel-200">
              Fill out the form and we&apos;ll connect you with an experienced truck accident
              attorney within 24 hours. No cost, no obligation, and no fee unless you win.
            </p>
            <ul className="mt-8 space-y-3">
              {['100% free, confidential case review', 'No fee unless you win your case', 'Available 24/7 — Hablamos Español'].map((point) => (
                <li key={point} className="flex items-center gap-3 text-steel-200">
                  <CheckCircle className="h-5 w-5 shrink-0 text-amber-500" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <CaseEvaluationForm
            source="homepage"
            compact={true}
            darkMode={true}
            title="Get Your Free Case Review"
            subtitle="Fill out this form and we'll contact you within 24 hours."
          />
        </div>
      </section>
    </>
  );
}
