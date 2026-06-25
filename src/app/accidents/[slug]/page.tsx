import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import CaseEvaluationForm from '@/components/CaseEvaluationForm';
import CommandHero from '@/components/CommandHero';
import Section from '@/components/ui/Section';
import {
  ArrowRight,
  Phone,
  CheckCircle,
  AlertTriangle,
  Scale,
  Users,
  Clock,
  ShieldCheck,
  MapPin,
} from '@/components/ui/Icon';
import {
  getAccidentContent,
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

  // SEO-optimized title (~55 chars per spec): "[Type] Accident Lawyer | 18-Wheeler Claims"
  const accidentName = getAccidentName(slug);
  const seoTitle = `${accidentName} Lawyer | 18-Wheeler Crash Claims`;

  return {
    title: seoTitle,
    description: content.metaDescription,
    alternates: {
      canonical: `/accidents/${slug}`,
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
      <Section tone="paper">
        <div className="mx-auto max-w-3xl">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Accident Types', href: '/accidents' },
              { label: getAccidentName(slug) },
            ]}
          />
          <h1 className="text-[length:var(--text-display-lg)] text-ink-strong">
            {getAccidentName(slug)}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-muted">
            Content for this accident type is coming soon. In the meantime,
            please contact us for a free consultation about your case.
          </p>
          <a href={`tel:${PHONE_NUMBER}`} className="btn btn-primary mt-8">
            <Phone className="h-5 w-5" />
            Call {PHONE_NUMBER}
          </a>
        </div>
      </Section>
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
    url: `https://trucking-accident-site.vercel.app/accidents/${slug}`,
    telephone: PHONE_NUMBER,
    areaServed: 'United States',
    serviceType: `${content.title} Legal Representation`,
  };

  const accidentLabel = content.title.replace(' Accidents', '');

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

      {/* Hero — cinematic command treatment (no Sanity stock photo) */}
      <CommandHero
        eyebrow="National Truck Accident Response"
        title={content.h1}
        breadcrumb={
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Accident Types', href: '/accidents' },
              { label: content.title },
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
      >
        <a href={`tel:${PHONE_NUMBER}`} className="btn btn-primary">
          Free Case Evaluation: {PHONE_NUMBER}
          <ArrowRight className="h-5 w-5" />
        </a>
        <Link href="/contact" className="btn btn-ghost-ink">
          <Phone className="h-5 w-5" />
          Contact Us Online
        </Link>
      </CommandHero>

      {/* What It Is */}
      <Section
        tone="white"
        eyebrow="Overview"
        title={`What Is a ${accidentLabel} Accident?`}
      >
        <div className="prose-legal max-w-3xl text-lg">
          {content.whatItIs.split('\n\n').map((paragraph, i) => (
            <p key={i}>
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
      </Section>

      {/* Causes */}
      <Section
        tone="paper"
        eyebrow="Root Causes"
        title={`Common Causes of ${content.title}`}
      >
        <div className="grid gap-5 md:grid-cols-2">
          {content.causes.map((cause, index) => (
            <div key={index} className="card flex flex-col p-6">
              <div className="h-0.5 w-10 bg-amber-500" />
              <h3 className="mt-4 text-xl font-bold text-ink-strong">
                {cause.title}
              </h3>
              <p className="mt-2 leading-relaxed text-ink-muted">
                {cause.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* FMCSA Regulations */}
      <Section
        tone="white"
        eyebrow="Federal Leverage"
        title={<>FMCSA Regulations &amp; {content.title}</>}
        intro="Federal Motor Carrier Safety Administration (FMCSA) regulations establish safety standards that trucking companies and drivers must follow. Violations of these regulations can establish negligence in your case."
      >
        <div className="space-y-5">
          {content.fmcsaRegulations.map((reg, index) => (
            <div key={index} className="signpost py-1">
              <h3 className="text-lg font-bold text-ink-strong">
                {reg.code}: {reg.title}
              </h3>
              <p className="mt-2 text-ink-muted">{reg.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <Link
            href="/fmcsa-regulations"
            className="inline-flex items-center gap-2 text-base font-semibold text-amber-600 hover:text-amber-700"
          >
            Learn more about FMCSA trucking regulations
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </Section>

      {/* Injuries */}
      <Section
        tone="paper-2"
        eyebrow="Medical Impact"
        title={`Common Injuries in ${content.title}`}
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {content.injuries.map((injury, index) => (
            <div key={index} className="card flex flex-col p-6">
              <AlertTriangle className="h-7 w-7 text-amber-600" />
              <h3 className="mt-4 text-lg font-bold text-ink-strong">
                {injury.type}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {injury.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Liability */}
      <Section
        tone="white"
        eyebrow="Who Pays"
        title="Who Can Be Held Liable?"
        intro="Trucking accident cases often involve multiple liable parties. Our attorneys investigate thoroughly to identify everyone who may be responsible for your injuries."
      >
        <div className="space-y-5">
          {content.liableParties.map((party, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-900 font-bold tabular text-white">
                  {index + 1}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink-strong">
                  {party.party}
                </h3>
                <p className="mt-1 text-ink-muted">{party.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Evidence — cinematic dark command section */}
      <section className="bg-command grain relative isolate overflow-hidden py-16 md:py-24">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="eyebrow eyebrow-on-ink">Evidence Preservation</p>
            <h2 className="mt-4 text-[length:var(--text-display-md)] text-white">
              Critical Evidence We Pursue
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-steel-200">
              Trucking companies often have rapid response teams that arrive at
              accident scenes to protect their interests. We act quickly to
              preserve crucial evidence before it disappears.
            </p>
          </div>
          <ul className="mt-10 grid gap-5 md:grid-cols-2">
            {content.evidence.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-3 border-t border-ink-700 pt-5"
              >
                <CheckCircle className="mt-0.5 h-6 w-6 shrink-0 text-amber-500" />
                <span className="text-steel-200">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Compensation */}
      <Section
        tone="white"
        eyebrow="Recovery"
        title="Compensation You May Recover"
      >
        <div className="grid gap-5 md:grid-cols-2">
          {content.compensation.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-lg border border-line bg-paper p-4"
            >
              <Scale className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <span className="text-ink-body">{item}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* What To Do */}
      <Section
        tone="paper"
        eyebrow="Action Plan"
        title={`What To Do After a ${accidentLabel} Accident`}
      >
        <ol className="space-y-5">
          {content.whatToDo.map((step, index) => (
            <li key={index} className="flex gap-4">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-amber-500 text-sm font-bold tabular text-ink-900">
                {index + 1}
              </span>
              <p className="pt-1.5 text-ink-body">{step}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* FAQ */}
      <Section
        tone="white"
        eyebrow="Questions Answered"
        title="Frequently Asked Questions"
      >
        <div className="mx-auto max-w-3xl divide-y divide-line">
          {content.faqs.map((faq, index) => (
            <div key={index} className="py-6 first:pt-0 last:pb-0">
              <h3 className="text-lg font-bold text-ink-strong">
                {faq.question}
              </h3>
              <p className="mt-3 leading-relaxed text-ink-muted">{faq.answer}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Related Content */}
      <Section tone="paper-2">
        <div className="grid gap-12 md:grid-cols-2">
          {/* Related Accident Types */}
          <div>
            <p className="eyebrow">More Collision Types</p>
            <h2 className="mt-4 text-[length:var(--text-display-sm)] text-ink-strong">
              Related Accident Types
            </h2>
            <ul className="mt-6 space-y-3">
              {content.relatedAccidents.map((relatedSlug) => (
                <li key={relatedSlug}>
                  <Link
                    href={`/accidents/${relatedSlug}`}
                    className="group inline-flex items-center gap-1.5 font-medium text-amber-600 hover:text-amber-700"
                  >
                    {getAccidentName(relatedSlug)}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Related States */}
          <div>
            <p className="eyebrow">Nationwide Coverage</p>
            <h2 className="mt-4 text-[length:var(--text-display-sm)] text-ink-strong">
              {content.title} by State
            </h2>
            <ul className="mt-6 space-y-3">
              {content.relatedStates.map((stateSlug) => (
                <li key={stateSlug}>
                  <Link
                    href={`/states/${stateSlug}`}
                    className="group inline-flex items-center gap-1.5 font-medium capitalize text-amber-600 hover:text-amber-700"
                  >
                    <MapPin className="h-4 w-4" />
                    {stateSlug.replace(/-/g, ' ')} Truck Accidents
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Content Freshness & Author Attribution */}
      <div className="border-t border-line bg-white">
        <div className="container-page py-8">
          <div className="flex flex-col items-start gap-4 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
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
              <Clock className="h-4 w-4" />
              <span>
                Last Updated:{' '}
                <time dateTime={content.lastUpdated || '2025-01-01'} className="font-medium tabular">
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
      </div>

      {/* CTA Section with Form */}
      <section className="bg-ink-900 py-16 md:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left side - CTA text */}
          <div>
            <p className="eyebrow eyebrow-on-ink">Free Case Review</p>
            <h2 className="mt-4 text-[length:var(--text-display-md)] text-white">
              Injured in a {accidentLabel} Accident?
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-steel-200">
              Get the experienced legal representation you deserve. We handle
              complex trucking accident cases nationwide and fight to hold all
              responsible parties accountable.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                'No Fee Unless You Win',
                'Available 24/7',
                'Hablamos Español',
              ].map((point) => (
                <li key={point} className="flex items-center gap-3 text-steel-200">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-amber-500" />
                  {point}
                </li>
              ))}
            </ul>
            <a href={`tel:${PHONE_NUMBER}`} className="btn btn-primary mt-9">
              <Phone className="h-5 w-5" />
              {PHONE_NUMBER}
            </a>
          </div>

          {/* Right side - Form */}
          <CaseEvaluationForm
            source={`accident-${slug}`}
            compact={true}
            darkMode={true}
            title="Free Case Evaluation"
            subtitle="Tell us about your accident and we'll contact you within 24 hours."
          />
        </div>
      </section>
    </>
  );
}
