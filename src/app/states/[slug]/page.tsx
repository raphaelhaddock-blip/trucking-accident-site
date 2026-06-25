import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import CaseEvaluationForm from '@/components/CaseEvaluationForm';
import CommandHero from '@/components/CommandHero';
import Section from '@/components/ui/Section';
import { ArrowRight, Phone, CheckCircle, Document, Users } from '@/components/ui/Icon';
import { STATE_IMAGES } from '@/lib/states-content/images';
import {
  getStateContent,
  getStateName,
  isValidStateSlug,
  getAvailableStateSlugs,
} from '@/lib/states-content';
import { STANDARD_SETTLEMENT_RANGES, SETTLEMENT_DISCLAIMER } from '@/lib/states-content/types';
import { ACCIDENT_SLUGS, getAccidentName } from '@/lib/accidents-content';
import { getCitiesForState } from '@/lib/cities-content';

// Generate static params for all available states
export async function generateStaticParams() {
  const availableSlugs = getAvailableStateSlugs();
  return availableSlugs.map((slug) => ({
    slug,
  }));
}

// Default OG image for pages without specific images
const DEFAULT_OG_IMAGE = 'https://trucking-accident-site.vercel.app/brand/og-default.png';

// Generate metadata for each state page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = getStateContent(slug);
  const stateName = getStateName(slug);

  // Generate SEO-optimized title (~50 chars per spec)
  const seoTitle = `${stateName} Truck Accident Lawyer | Free Consult`;

  if (!content) {
    return {
      title: seoTitle,
    };
  }

  // Get state-specific image or use default
  const ogImage = STATE_IMAGES[slug] || { url: DEFAULT_OG_IMAGE, alt: `${stateName} truck accident lawyers` };

  return {
    title: seoTitle,
    description: content.metaDescription,
    alternates: {
      canonical: `/states/${slug}`,
    },
    openGraph: {
      title: seoTitle,
      description: content.metaDescription,
      type: 'article',
      images: [
        {
          url: ogImage.url,
          width: 1408,
          height: 768,
          alt: ogImage.alt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: content.metaDescription,
      images: [ogImage.url],
    },
  };
}

// Phone number for CTAs
const PHONE_NUMBER = '1-800-555-0123';
const PHONE_DISPLAY = '(800) 555-0123';

export default async function StatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Validate slug
  if (!isValidStateSlug(slug)) {
    notFound();
  }

  // Get content
  const content = getStateContent(slug);

  // Show placeholder if content not yet created
  if (!content) {
    const stateName = getStateName(slug);
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'States', href: '/states' },
              { label: stateName },
            ]}
          />
          <h1 className="text-4xl font-bold text-navy-900 mb-6">
            {stateName} Truck Injury Lawyers
          </h1>
          <p className="text-gray-600 mb-8">
            Content for {stateName} is coming soon. In the meantime,
            please contact us for a free consultation about your truck accident case.
          </p>
          <a
            href={`tel:${PHONE_NUMBER}`}
            className="inline-block bg-amber-500 text-navy-900 font-bold px-8 py-4 rounded-lg hover:bg-amber-400 transition"
          >
            Call {PHONE_NUMBER}
          </a>
        </div>
      </div>
    );
  }

  // FAQPage schema for FAQ section
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  // LegalService schema (inherits from LocalBusiness)
  const legalServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    '@id': `https://trucking-accident-site.vercel.app/states/${slug}#legalbusiness`,
    name: `${content.name} Truck Injury Lawyers`,
    description: content.metaDescription,
    url: `https://trucking-accident-site.vercel.app/states/${slug}`,
    telephone: PHONE_NUMBER,
    priceRange: 'Free Consultation - No Fee Unless You Win',
    currenciesAccepted: 'USD',
    paymentAccepted: 'Contingency Fee',
    areaServed: {
      '@type': 'State',
      name: content.name,
      containedInPlace: {
        '@type': 'Country',
        name: 'United States',
      },
    },
    serviceType: [
      'Truck Accident Attorney',
      '18-Wheeler Accident Lawyer',
      'Semi-Truck Crash Legal Representation',
      'Commercial Vehicle Accident Claims',
    ],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
    image: STATE_IMAGES[slug]?.url || DEFAULT_OG_IMAGE,
    sameAs: [
      'https://trucking-accident-site.vercel.app',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Legal Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Free Case Evaluation',
            description: 'Free consultation to review your truck accident case',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Truck Accident Litigation',
            description: 'Full legal representation for 18-wheeler accident claims',
          },
        },
      ],
    },
  };

  // Article schema with author and dateModified for E-E-A-T
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: content.h1,
    description: content.metaDescription,
    image: STATE_IMAGES[slug]?.url || DEFAULT_OG_IMAGE,
    datePublished: '2024-01-01',
    dateModified: content.lastUpdated,
    author: {
      '@type': 'Organization',
      name: 'National Truck Accident Lawyers Editorial Team',
      url: 'https://trucking-accident-site.vercel.app/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'National Truck Accident Lawyers',
      logo: {
        '@type': 'ImageObject',
        url: 'https://trucking-accident-site.vercel.app/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://trucking-accident-site.vercel.app/states/${slug}`,
    },
  };

  // Negligence rule display text
  const negligenceRuleText: Record<string, string> = {
    'pure': 'Pure Comparative Negligence',
    'modified-50': 'Modified Comparative Negligence (50% Bar)',
    'modified-51': 'Modified Comparative Negligence (51% Bar)',
    'contributory': 'Contributory Negligence',
  };

  return (
    <>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(legalServiceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Hero — cinematic command treatment */}
      <CommandHero
        size="lg"
        eyebrow={`${content.name} Truck Accident Response`}
        title={content.h1}
        breadcrumb={
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'States', href: '/states' },
              { label: content.name },
            ]}
          />
        }
        subtitle={
          <>
            {content.heroText.split('\n\n').map((paragraph, i) => (
              <p key={i} className={i > 0 ? 'mt-4' : ''}>
                {paragraph}
              </p>
            ))}
          </>
        }
        stats={content.statistics}
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

      {/* Trucking Laws */}
      <Section
        tone="paper-2"
        eyebrow="State Regulations"
        title={
          <>
            {content.name} Trucking Laws &amp; Regulations
          </>
        }
      >
        <div className="grid gap-6 md:grid-cols-2">
          {content.truckingLaws.map((law, index) => (
            <div key={index} className="card flex flex-col p-6">
              <div className="h-0.5 w-10 bg-amber-500" />
              <h3 className="mt-4 text-xl font-bold text-ink-strong">
                {law.title}
              </h3>
              <p className="mt-2 leading-relaxed text-ink-muted">
                {law.description}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <Link
            href="/fmcsa-regulations"
            className="inline-flex items-center gap-2 text-base font-semibold text-amber-600 hover:text-amber-700"
          >
            Learn more about federal FMCSA trucking regulations
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </Section>

      {/* Major Trucking Corridors */}
      <Section
        tone="white"
        eyebrow="Freight Network"
        title={`Major Trucking Corridors in ${content.name}`}
        intro={`${content.name} serves as a critical hub for commercial trucking traffic. These major corridors see the highest concentration of 18-wheeler accidents.`}
      >
        <div className="space-y-4">
          {content.corridors.map((corridor, index) => (
            <div
              key={index}
              className="card signpost rounded-l-none py-5 pr-6"
            >
              <h3 className="text-lg font-bold text-ink-strong">
                {corridor.name}
              </h3>
              <p className="mt-2 text-ink-muted">{corridor.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Comparative Negligence & Statute of Limitations */}
      <Section tone="paper">
        <div className="grid gap-12 md:grid-cols-2">
          {/* Comparative Negligence */}
          <div>
            <p className="eyebrow">Fault Rules</p>
            <h2 className="mt-4 text-[length:var(--text-display-sm)]">
              {content.name} Negligence Laws
            </h2>
            <div className="mt-6 rounded-2xl border border-ink-700 bg-ink-900 p-6">
              <div className="text-lg font-bold text-amber-400">
                {negligenceRuleText[content.negligenceRule.type]}
              </div>
              <p className="mt-2 text-steel-200">{content.negligenceRule.description}</p>
            </div>
            <p className="mt-4 leading-relaxed text-ink-muted">
              {content.negligenceRule.details}
            </p>
          </div>

          {/* Statute of Limitations */}
          <div>
            <p className="eyebrow">Filing Deadlines</p>
            <h2 className="mt-4 text-[length:var(--text-display-sm)]">
              Statute of Limitations
            </h2>
            <dl className="mt-6 space-y-0">
              <div className="flex items-baseline justify-between border-t border-line py-4">
                <dt className="stat-label">Personal Injury</dt>
                <dd className="stat-value tabular text-[length:var(--text-display-sm)]">
                  {content.statuteOfLimitations.personalInjury}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-line py-4">
                <dt className="stat-label">Wrongful Death</dt>
                <dd className="stat-value tabular text-[length:var(--text-display-sm)]">
                  {content.statuteOfLimitations.wrongfulDeath}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-line py-4">
                <dt className="stat-label">Property Damage</dt>
                <dd className="stat-value tabular text-[length:var(--text-display-sm)]">
                  {content.statuteOfLimitations.propertyDamage}
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              {content.statuteOfLimitations.details}
            </p>
          </div>
        </div>
      </Section>

      {/* Settlement Ranges — honest industry data */}
      <Section
        tone="white"
        eyebrow="Case Value"
        title={`Typical ${content.name} Truck Accident Settlement Ranges`}
        intro="Settlement values vary significantly based on injury severity, liability, evidence quality, and available insurance coverage. Below are typical ranges based on industry data."
      >
        {/* Settlement Ranges Table */}
        <div className="overflow-hidden rounded-xl border border-line">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-ink-900 text-white">
                <th className="stat-label stat-label-ink px-6 py-4 text-left">Case Type</th>
                <th className="stat-label stat-label-ink px-6 py-4 text-left">Typical Range</th>
                <th className="stat-label stat-label-ink hidden px-6 py-4 text-left md:table-cell">Key Factors</th>
              </tr>
            </thead>
            <tbody>
              {(content.settlementRanges || STANDARD_SETTLEMENT_RANGES).map((range, index) => (
                <tr key={index} className="border-t border-line">
                  <td className="px-6 py-5">
                    <span className="font-semibold text-ink-strong">
                      {range.caseType === 'wrongfulDeath' && 'Wrongful Death'}
                      {range.caseType === 'catastrophicInjury' && 'Catastrophic Injury'}
                      {range.caseType === 'seriousInjury' && 'Serious Injury'}
                      {range.caseType === 'moderateInjury' && 'Moderate Injury'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="tabular font-bold text-amber-600">
                      {range.minAmount} - {range.maxAmount}
                    </span>
                  </td>
                  <td className="hidden px-6 py-5 text-sm text-ink-muted md:table-cell">
                    {range.factors}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-sm italic leading-relaxed text-ink-muted/80">
          {SETTLEMENT_DISCLAIMER}
        </p>
      </Section>

      {/* Court Information */}
      <Section
        tone="paper-2"
        eyebrow="Legal Process"
        title={
          <>
            {content.name} Courts &amp; Legal Process
          </>
        }
        containerClassName="max-w-3xl"
      >
        <div className="prose-legal max-w-none">
          {content.courtInfo.split('\n\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </Section>

      {/* Why Hire Local — dark command section for cinematic contrast */}
      <section className="bg-command grain relative isolate overflow-hidden py-16 md:py-24">
        <div className="container-page max-w-3xl">
          <p className="eyebrow eyebrow-on-ink">Local Advantage</p>
          <h2 className="mt-4 text-[length:var(--text-display-md)] text-white">
            Why Hire a {content.name} Truck Accident Lawyer?
          </h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-steel-200">
            {content.whyHireLocal.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* All Accident Types */}
      <Section
        tone="paper"
        eyebrow="Collision Types"
        title={`Truck Accident Types in ${content.name}`}
      >
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {ACCIDENT_SLUGS.map((accidentSlug) => (
            <Link
              key={accidentSlug}
              href={`/accidents/${accidentSlug}`}
              className="card card-hover group flex items-center justify-between gap-2 p-4"
            >
              <span className="text-sm font-medium text-ink-strong group-hover:text-amber-700">
                {getAccidentName(accidentSlug)}
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-amber-600 transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </Section>

      {/* City Pages */}
      {getCitiesForState(slug).length > 0 && (
        <Section
          tone="white"
          eyebrow="Local Coverage"
          title={`${content.name} City Truck Accident Lawyers`}
          intro={`Find truck accident attorneys in major ${content.name} cities. Each city page includes local accident statistics, dangerous corridors, and information specific to that area.`}
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {getCitiesForState(slug).map((city) => (
              <Link
                key={city.slug}
                href={`/states/${slug}/${city.slug}`}
                className="group rounded-lg border border-line bg-paper p-3.5 transition-colors hover:border-ink-800 hover:bg-white"
              >
                <span className="block text-sm font-medium text-ink-strong group-hover:text-amber-700">
                  {city.name}
                </span>
                <span className="tabular mt-1 block text-xs text-ink-muted">
                  {city.truckFatalities} fatal crashes
                </span>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* FAQ */}
      <Section
        tone="paper-2"
        eyebrow="Common Questions"
        title={`${content.name} Truck Accident FAQs`}
        containerClassName="max-w-3xl"
      >
        <div className="divide-y divide-line border-y border-line">
          {content.faqs.map((faq, index) => (
            <div key={index} className="py-6">
              <h3 className="text-lg font-bold text-ink-strong">
                {faq.question}
              </h3>
              <p className="mt-3 leading-relaxed text-ink-muted">{faq.answer}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Neighboring States */}
      <Section
        tone="paper"
        eyebrow="Nearby Coverage"
        title="Truck Accident Lawyers in Neighboring States"
      >
        <div className="flex flex-wrap gap-3">
          {content.neighboringStates.map((stateSlug) => (
            <Link
              key={stateSlug}
              href={`/states/${stateSlug}`}
              className="card card-hover inline-flex items-center gap-2 px-5 py-3"
            >
              <span className="text-sm font-semibold text-amber-600">
                {getStateName(stateSlug)}
              </span>
              <ArrowRight className="h-4 w-4 text-amber-600" />
            </Link>
          ))}
        </div>
      </Section>

      {/* Content Freshness & Author Attribution */}
      <section className="border-t border-line bg-white py-8">
        <div className="container-page max-w-3xl">
          <div className="flex flex-col items-start justify-between gap-4 text-sm text-ink-muted sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>
                Written by{' '}
                <Link href="/about/team" className="font-medium text-amber-600 hover:text-amber-700">
                  Editorial Team
                </Link>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Document className="h-4 w-4" />
              <span>
                Last Updated:{' '}
                <time dateTime={content.lastUpdated} className="font-medium">
                  {new Date(content.lastUpdated).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Form */}
      <section className="bg-ink-900 py-16 md:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left side - CTA text */}
          <div>
            <p className="eyebrow eyebrow-on-ink">Free Case Review</p>
            <h2 className="mt-4 text-[length:var(--text-display-md)] text-white">
              Injured in a {content.name} Truck Accident?
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-steel-200">
              Get experienced legal representation from attorneys who understand {content.name}&apos;s
              trucking laws and court systems. We fight to hold trucking companies accountable.
            </p>
            <ul className="mt-8 space-y-3">
              {['No fee unless you win', 'Available 24/7', 'Hablamos Español'].map((point) => (
                <li key={point} className="flex items-center gap-3 text-steel-200">
                  <CheckCircle className="h-5 w-5 shrink-0 text-amber-500" />
                  {point}
                </li>
              ))}
            </ul>
            <a href={`tel:${PHONE_NUMBER}`} className="btn btn-primary mt-8">
              <Phone className="h-5 w-5" />
              Call {PHONE_DISPLAY}
            </a>
          </div>

          {/* Right side - Form */}
          <CaseEvaluationForm
            source={`state-${slug}`}
            compact={true}
            darkMode={true}
            title="Free Case Evaluation"
            subtitle={`Tell us about your ${content.name} truck accident and we'll contact you within 24 hours.`}
          />
        </div>
      </section>
    </>
  );
}
