import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';
import { STATE_IMAGES } from '@/lib/states-content/images';
import {
  getStateContent,
  getStateName,
  isValidStateSlug,
  STATE_SLUGS,
  getAvailableStateSlugs,
} from '@/lib/states-content';
import { STANDARD_SETTLEMENT_RANGES, SETTLEMENT_DISCLAIMER } from '@/lib/states-content/types';
import { ACCIDENT_SLUGS, getAccidentName } from '@/lib/accidents-content';

// Generate static params for all available states
export async function generateStaticParams() {
  const availableSlugs = getAvailableStateSlugs();
  return availableSlugs.map((slug) => ({
    slug,
  }));
}

// Default OG image for pages without specific images
const DEFAULT_OG_IMAGE = 'https://cdn.sanity.io/images/54bwni5t/production/8391509ade1b30502407263f03b21aad42eaedcb-1376x768.jpg';

// Generate metadata for each state page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = getStateContent(slug);
  const stateName = getStateName(slug);

  if (!content) {
    return {
      title: `${stateName} Truck Accident Lawyers | 18-Wheeler Attorneys`,
    };
  }

  // Get state-specific image or use default
  const ogImage = STATE_IMAGES[slug] || { url: DEFAULT_OG_IMAGE, alt: `${stateName} truck accident lawyers` };

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: {
      canonical: `/states/${slug}`,
    },
    openGraph: {
      title: content.metaTitle,
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
      title: content.metaTitle,
      description: content.metaDescription,
      images: [ogImage.url],
    },
  };
}

// Phone number for CTAs
const PHONE_NUMBER = '1-800-555-0123';

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
    <div className="min-h-screen bg-gray-50">
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

      {/* Hero Section */}
      <section className="relative min-h-[500px] md:min-h-[600px] flex items-center">
        {/* Background Image */}
        {STATE_IMAGES[slug] && (
          <>
            <Image
              src={STATE_IMAGES[slug].url}
              alt={STATE_IMAGES[slug].alt}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-900/60 via-navy-900/30 to-transparent" />
          </>
        )}
        {!STATE_IMAGES[slug] && (
          <div className="absolute inset-0 bg-navy-900" />
        )}

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 text-white">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'States', href: '/states' },
              { label: content.name },
            ]}
          />
          <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">{content.h1}</h1>
          <div className="prose prose-lg prose-invert max-w-2xl">
            {content.heroText.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-gray-200 leading-relaxed drop-shadow">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="bg-amber-500 text-navy-900 font-bold px-8 py-4 rounded-lg hover:bg-amber-400 transition text-center shadow-lg"
            >
              Free Case Evaluation: {PHONE_NUMBER}
            </a>
            <Link
              href="/contact"
              className="bg-white text-navy-900 font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition text-center shadow-lg"
            >
              Contact Us Online
            </Link>
          </div>
        </div>
      </section>

      {/* State Statistics Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {content.statistics.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-amber-500 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trucking Laws Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy-900 mb-8">
            {content.name} Trucking Laws &amp; Regulations
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {content.truckingLaws.map((law, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-navy-900 mb-3">
                  {law.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {law.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/fmcsa-regulations"
              className="text-amber-600 font-semibold hover:text-amber-700"
            >
              Learn more about federal FMCSA trucking regulations &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Major Trucking Corridors Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy-900 mb-4">
            Major Trucking Corridors in {content.name}
          </h2>
          <p className="text-gray-600 mb-8">
            {content.name} serves as a critical hub for commercial trucking traffic.
            These major corridors see the highest concentration of 18-wheeler accidents.
          </p>
          <div className="space-y-6">
            {content.corridors.map((corridor, index) => (
              <div
                key={index}
                className="border-l-4 border-amber-500 pl-6 py-2 bg-white rounded-r-lg shadow-sm"
              >
                <h3 className="text-lg font-bold text-navy-900">
                  {corridor.name}
                </h3>
                <p className="text-gray-700 mt-2">{corridor.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparative Negligence & SOL Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Comparative Negligence */}
            <div>
              <h2 className="text-2xl font-bold text-navy-900 mb-4">
                {content.name} Negligence Laws
              </h2>
              <div className="bg-navy-900 text-white rounded-lg p-6 mb-4">
                <div className="text-amber-500 font-bold text-lg mb-2">
                  {negligenceRuleText[content.negligenceRule.type]}
                </div>
                <p className="text-gray-300">{content.negligenceRule.description}</p>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {content.negligenceRule.details}
              </p>
            </div>

            {/* Statute of Limitations */}
            <div>
              <h2 className="text-2xl font-bold text-navy-900 mb-4">
                Statute of Limitations
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <span className="text-gray-700">Personal Injury</span>
                  <span className="font-bold text-navy-900">
                    {content.statuteOfLimitations.personalInjury}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b pb-3">
                  <span className="text-gray-700">Wrongful Death</span>
                  <span className="font-bold text-navy-900">
                    {content.statuteOfLimitations.wrongfulDeath}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b pb-3">
                  <span className="text-gray-700">Property Damage</span>
                  <span className="font-bold text-navy-900">
                    {content.statuteOfLimitations.propertyDamage}
                  </span>
                </div>
              </div>
              <p className="text-gray-700 mt-4 text-sm leading-relaxed">
                {content.statuteOfLimitations.details}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Settlement Ranges Section - Honest industry data */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy-900 mb-4">
            Typical {content.name} Truck Accident Settlement Ranges
          </h2>
          <p className="text-gray-600 mb-8">
            Settlement values vary significantly based on injury severity, liability, evidence quality,
            and available insurance coverage. Below are typical ranges based on industry data.
          </p>

          {/* Settlement Ranges Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <table className="w-full">
              <thead className="bg-navy-900 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">Case Type</th>
                  <th className="px-6 py-4 text-left font-bold">Typical Range</th>
                  <th className="px-6 py-4 text-left font-bold hidden md:table-cell">Key Factors</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(content.settlementRanges || STANDARD_SETTLEMENT_RANGES).map((range, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-medium text-navy-900">
                        {range.caseType === 'wrongfulDeath' && 'Wrongful Death'}
                        {range.caseType === 'catastrophicInjury' && 'Catastrophic Injury'}
                        {range.caseType === 'seriousInjury' && 'Serious Injury'}
                        {range.caseType === 'moderateInjury' && 'Moderate Injury'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-amber-600 font-bold">
                        {range.minAmount} - {range.maxAmount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm hidden md:table-cell">
                      {range.factors}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Disclaimer */}
          <p className="text-gray-500 text-sm italic leading-relaxed">
            {SETTLEMENT_DISCLAIMER}
          </p>
        </div>
      </section>

      {/* Court Information */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy-900 mb-6">
            {content.name} Courts &amp; Legal Process
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            {content.courtInfo.split('\n\n').map((paragraph, i) => (
              <p key={i} className="mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Why Hire Local */}
      <section className="py-16 bg-navy-900 text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">
            Why Hire a {content.name} Truck Accident Lawyer?
          </h2>
          <div className="prose prose-lg prose-invert max-w-none">
            {content.whyHireLocal.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-gray-300 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* All Accident Types Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy-900 mb-8">
            Truck Accident Types in {content.name}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ACCIDENT_SLUGS.map((accidentSlug) => (
              <Link
                key={accidentSlug}
                href={`/accidents/${accidentSlug}`}
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition text-center"
              >
                <span className="text-navy-900 font-medium text-sm">
                  {getAccidentName(accidentSlug)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy-900 mb-8">
            {content.name} Truck Accident FAQs
          </h2>
          <div className="space-y-6">
            {content.faqs.map((faq, index) => (
              <div
                key={index}
                className="border-b border-gray-200 pb-6 last:border-0"
              >
                <h3 className="text-lg font-bold text-navy-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Neighboring States Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-navy-900 mb-6">
            Truck Accident Lawyers in Neighboring States
          </h2>
          <div className="flex flex-wrap gap-4">
            {content.neighboringStates.map((stateSlug) => (
              <Link
                key={stateSlug}
                href={`/states/${stateSlug}`}
                className="bg-white px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <span className="text-amber-600 font-medium">
                  {getStateName(stateSlug)} &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Content Freshness & Author Attribution */}
      <section className="py-8 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>
                Written by{' '}
                <Link href="/about/team" className="text-amber-600 hover:text-amber-700 font-medium">
                  Editorial Team
                </Link>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
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

      {/* CTA Section */}
      <section className="py-16 bg-navy-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Injured in a {content.name} Truck Accident?
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Get experienced legal representation from attorneys who understand {content.name}&apos;s
            trucking laws and court systems. We fight to hold trucking companies accountable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="bg-amber-500 text-navy-900 font-bold px-8 py-4 rounded-lg hover:bg-amber-400 transition"
            >
              Call Now: {PHONE_NUMBER}
            </a>
            <Link
              href="/contact"
              className="bg-white text-navy-900 font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition"
            >
              Free Case Evaluation
            </Link>
          </div>
          <p className="text-gray-400 mt-6 text-sm">
            No Fee Unless You Win | Available 24/7 | Hablamos Espa&ntilde;ol
          </p>
        </div>
      </section>
    </div>
  );
}
