import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';
import {
  getAccidentContent,
  getAllAccidentSlugs,
  getAccidentName,
  isValidAccidentSlug,
  ACCIDENT_SLUGS,
} from '@/lib/accidents-content';
import { ACCIDENT_IMAGES } from '@/lib/accidents-content/images';

// Generate static params for all 20 accident types
export async function generateStaticParams() {
  return ACCIDENT_SLUGS.map((slug) => ({
    slug,
  }));
}

// Default OG image for pages without specific images
const DEFAULT_OG_IMAGE = 'https://cdn.sanity.io/images/54bwni5t/production/8391509ade1b30502407263f03b21aad42eaedcb-1376x768.jpg';

// Generate metadata for each accident page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = getAccidentContent(slug);

  if (!content) {
    return {
      title: 'Accident Type Not Found',
    };
  }

  // Get accident-specific image or use default
  const ogImage = ACCIDENT_IMAGES[slug] || { url: DEFAULT_OG_IMAGE, alt: '18-wheeler truck accident' };

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: {
      canonical: `/accidents/${slug}`,
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

export default async function AccidentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Validate slug
  if (!isValidAccidentSlug(slug)) {
    notFound();
  }

  // Get content
  const content = getAccidentContent(slug);

  // Show placeholder if content not yet created
  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Accident Types', href: '/accidents' },
              { label: getAccidentName(slug) },
            ]}
          />
          <h1 className="text-4xl font-bold text-navy-900 mb-6">
            {getAccidentName(slug)}
          </h1>
          <p className="text-gray-600 mb-8">
            Content for this accident type is coming soon. In the meantime,
            please contact us for a free consultation about your case.
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

  // LegalService schema
  const legalServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: 'Truck Injury Lawyers',
    description: content.metaDescription,
    url: `https://www.18wheeleraccidentlawyers.com/accidents/${slug}`,
    telephone: PHONE_NUMBER,
    areaServed: 'United States',
    serviceType: `${content.title} Legal Representation`,
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

      {/* Hero Section */}
      <section className="relative min-h-[500px] md:min-h-[600px] flex items-center">
        {/* Background Image */}
        {ACCIDENT_IMAGES[slug] && (
          <>
            <Image
              src={ACCIDENT_IMAGES[slug].url}
              alt={ACCIDENT_IMAGES[slug].alt}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-900/60 via-navy-900/30 to-transparent" />
          </>
        )}
        {!ACCIDENT_IMAGES[slug] && (
          <div className="absolute inset-0 bg-navy-900" />
        )}

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 text-white">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Accident Types', href: '/accidents' },
              { label: content.title },
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

      {/* What It Is Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy-900 mb-6">
            What Is a {content.title.replace(' Accidents', '')} Accident?
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            {content.whatItIs.split('\n\n').map((paragraph, i) => (
              <p key={i} className="mb-4 leading-relaxed">
                {paragraph.startsWith('**') ? (
                  <span>
                    <strong>{paragraph.match(/\*\*(.*?)\*\*/)?.[1]}</strong>
                    {paragraph.replace(/\*\*.*?\*\*:?/, '')}
                  </span>
                ) : (
                  paragraph
                )}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Causes Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy-900 mb-8">
            Common Causes of {content.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {content.causes.map((cause, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold text-navy-900 mb-3">
                  {cause.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {cause.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FMCSA Regulations Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy-900 mb-4">
            FMCSA Regulations &amp; {content.title}
          </h2>
          <p className="text-gray-600 mb-8">
            Federal Motor Carrier Safety Administration (FMCSA) regulations
            establish safety standards that trucking companies and drivers must
            follow. Violations of these regulations can establish negligence in
            your case.
          </p>
          <div className="space-y-6">
            {content.fmcsaRegulations.map((reg, index) => (
              <div
                key={index}
                className="border-l-4 border-amber-500 pl-6 py-2"
              >
                <h3 className="text-lg font-bold text-navy-900">
                  {reg.code}: {reg.title}
                </h3>
                <p className="text-gray-700 mt-2">{reg.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/fmcsa-regulations"
              className="text-amber-600 font-semibold hover:text-amber-700"
            >
              Learn more about FMCSA trucking regulations &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Injuries Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy-900 mb-8">
            Common Injuries in {content.title}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.injuries.map((injury, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-bold text-navy-900 mb-2">
                  {injury.type}
                </h3>
                <p className="text-gray-700 text-sm">{injury.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Liability Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy-900 mb-4">
            Who Can Be Held Liable?
          </h2>
          <p className="text-gray-600 mb-8">
            Trucking accident cases often involve multiple liable parties. Our
            attorneys investigate thoroughly to identify everyone who may be
            responsible for your injuries.
          </p>
          <div className="space-y-6">
            {content.liableParties.map((party, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-navy-900 font-bold">
                    {index + 1}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-navy-900">
                    {party.party}
                  </h3>
                  <p className="text-gray-700 mt-1">{party.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Evidence Section */}
      <section className="py-16 bg-navy-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">
            Critical Evidence We Pursue
          </h2>
          <p className="text-gray-300 mb-8">
            Trucking companies often have rapid response teams that arrive at
            accident scenes to protect their interests. We act quickly to
            preserve crucial evidence before it disappears.
          </p>
          <ul className="grid md:grid-cols-2 gap-4">
            {content.evidence.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-gray-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Compensation Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy-900 mb-8">
            Compensation You May Recover
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {content.compensation.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What To Do Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy-900 mb-8">
            What To Do After a {content.title.replace(' Accidents', '')} Accident
          </h2>
          <ol className="space-y-4">
            {content.whatToDo.map((step, index) => (
              <li key={index} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-navy-900 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </span>
                <p className="text-gray-700 pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy-900 mb-8">
            Frequently Asked Questions
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

      {/* Related Content Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Related Accident Types */}
            <div>
              <h2 className="text-2xl font-bold text-navy-900 mb-6">
                Related Accident Types
              </h2>
              <ul className="space-y-3">
                {content.relatedAccidents.map((relatedSlug) => (
                  <li key={relatedSlug}>
                    <Link
                      href={`/accidents/${relatedSlug}`}
                      className="text-amber-600 hover:text-amber-700 font-medium"
                    >
                      {getAccidentName(relatedSlug)} &rarr;
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Related States */}
            <div>
              <h2 className="text-2xl font-bold text-navy-900 mb-6">
                {content.title} by State
              </h2>
              <ul className="space-y-3">
                {content.relatedStates.map((stateSlug) => (
                  <li key={stateSlug}>
                    <Link
                      href={`/states/${stateSlug}`}
                      className="text-amber-600 hover:text-amber-700 font-medium capitalize"
                    >
                      {stateSlug.replace(/-/g, ' ')} Truck Accidents &rarr;
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
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
                <time dateTime={content.lastUpdated || '2025-01-01'} className="font-medium">
                  {new Date(content.lastUpdated || '2025-01-01').toLocaleDateString('en-US', {
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
            Injured in a {content.title.replace(' Accidents', '')} Accident?
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Get the experienced legal representation you deserve. We handle
            complex trucking accident cases nationwide and fight to hold all
            responsible parties accountable.
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
