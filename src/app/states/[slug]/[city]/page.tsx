import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import CommandHero from '@/components/CommandHero';
import Section from '@/components/ui/Section';
import {
  ArrowRight,
  Phone,
  ShieldCheck,
  Scale,
  Document,
  AlertTriangle,
  Clock,
  MapPin,
  Users,
} from '@/components/ui/Icon';
import { STATE_IMAGES } from '@/lib/states-content/images';
import {
  getCityData,
  getCityDataWithFallback,
  getCityContent,
  getAllCityParams,
  getStateName,
  getStateAbbreviation,
  getCitiesForState,
  isValidCity,
} from '@/lib/cities-content';
import type { CityContent } from '@/lib/cities-content';
import { buildCityProfile } from '@/lib/content-engine/profile';

// Generate static params for all cities
export async function generateStaticParams() {
  return getAllCityParams();
}

// Default OG image for pages without specific images
const DEFAULT_OG_IMAGE = 'https://cdn.sanity.io/images/54bwni5t/production/8391509ade1b30502407263f03b21aad42eaedcb-1376x768.jpg';

// Generate metadata for each city page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; city: string }>;
}): Promise<Metadata> {
  const { slug, city } = await params;
  const cityData = await getCityDataWithFallback(slug, city);
  const cityContent = await getCityContent(slug, city);
  const stateName = getStateName(slug);

  if (!cityData) {
    return {
      title: 'City Not Found',
    };
  }

  // Get state abbreviation for shorter title
  const stateAbbr = getStateAbbreviation(slug);

  // SEO-optimized title (~55 chars per spec): "[City] 18-Wheeler Accident Attorney | [State]"
  const title = `${cityData.name} 18-Wheeler Accident Attorney | ${stateAbbr}`;
  const description = cityContent?.metaDescription || `Experienced truck accident lawyers in ${cityData.name}, ${stateName}. ${cityData.truckFatalities} fatal truck crashes in ${cityData.dataYear}. Free consultation for 18-wheeler accident victims.`;

  // Get OG image - prefer city-specific image, fallback to state, then default
  const ogImage = cityContent?.images
    ? { url: cityContent.images.hero, alt: cityContent.images.heroAlt }
    : STATE_IMAGES[slug] || { url: DEFAULT_OG_IMAGE, alt: `${cityData.name} truck accident lawyers` };

  return {
    title,
    description,
    alternates: {
      canonical: `/states/${slug}/${city}`,
    },
    openGraph: {
      title,
      description,
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
      title,
      description,
      images: [ogImage.url],
    },
  };
}

// Phone number for CTAs
const PHONE_NUMBER = '1-800-555-0123';

// Maps a regional accident-mechanism label (from commonAccidents.type) to its
// national deep-dive page. Lets a thin local hub link out to the substance — how
// each crash type is investigated, who is liable, what evidence matters — instead
// of repeating that federal content on every city page.
const MECHANISM_TO_SLUG: Record<string, string> = {
  'rear end': 'rear-end-collisions',
  'rollover': 'rollover-accidents',
  'jackknife': 'jackknife-accidents',
  'sideswipe': 'sideswipe-accidents',
  'head on': 'head-on-collisions',
  't bone': 't-bone-accidents',
  'underride': 'underride-accidents',
  'override': 'override-accidents',
  'blind spot': 'blind-spot-accidents',
  'wide turn': 'wide-turn-accidents',
};
function mechanismSlug(type: string): string | null {
  const k = type.toLowerCase().replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim();
  return MECHANISM_TO_SLUG[k] ?? null;
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ slug: string; city: string }>;
}) {
  const { slug, city } = await params;

  // Validate city exists (checks both FARS data and content files)
  if (!isValidCity(slug, city)) {
    notFound();
  }

  // Get city data from FARS or fallback to content file data
  const cityData = await getCityDataWithFallback(slug, city);
  const cityContent = await getCityContent(slug, city);
  if (!cityData) {
    notFound();
  }

  const stateName = getStateName(slug);
  const stateAbbr = getStateAbbreviation(slug);
  const otherCities = getCitiesForState(slug)
    .filter(c => c.slug !== city)
    .slice(0, 6);

  // Engine-hub detection: a thin local hub has trucking-industry prose but no
  // sourced roads. Enhanced/metro pages (sourced roads) and templated fallbacks
  // are unaffected. Used to show a provenance note and the national-resources block.
  const isHub = Boolean(cityContent?.truckingIndustry) && (cityContent?.dangerousRoads?.length ?? 0) === 0;
  // Deduped, mapped regional mechanisms -> national deep-dive pages.
  const mechanismLinks = Array.from(
    new Map(
      (cityContent?.commonAccidents ?? [])
        .map((a) => [mechanismSlug(a.type), a.type] as const)
        .filter((pair): pair is [string, string] => pair[0] !== null)
    ).entries()
  ).slice(0, 6);

  // VERIFIED court context (PR8/PR9). buildCityProfile resolves venueCourt only when a
  // city-courts.json record is confidence==VERIFIED AND its county matches FARS. Empty
  // for every city without a verified record; never rendered otherwise.
  const venueCourt = buildCityProfile(slug, city)?.venueCourt ?? null;

  // Use population from city content (which has real data) or fallback
  const population = cityContent?.population || cityData.population;
  const truckFatalities = cityContent?.accidentStats?.truckFatalities || cityData.truckFatalities;

  // Get hero image - prefer city-specific image, fallback to state image
  const heroImage = cityContent?.images
    ? { url: cityContent.images.hero, alt: cityContent.images.heroAlt }
    : STATE_IMAGES[slug];

  // Schema markup with PostalAddress for Google Maps visibility
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: `${cityData.name} Truck Accident Lawyers`,
    description: `Truck accident attorneys serving ${cityData.name}, ${stateName}`,
    url: `https://trucking-accident-site.vercel.app/states/${slug}/${city}`,
    telephone: PHONE_NUMBER,
    address: {
      '@type': 'PostalAddress',
      addressLocality: cityData.name,
      addressRegion: stateAbbr,
      addressCountry: 'US',
    },
    areaServed: {
      '@type': 'City',
      name: cityData.name,
      containedInPlace: {
        '@type': 'State',
        name: stateName,
      },
    },
    priceRange: 'Free Consultation',
    image: heroImage?.url || DEFAULT_OG_IMAGE,
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${cityData.name} Truck Accident Lawyers - ${stateName}`,
    description: `Truck accident statistics and legal resources for ${cityData.name}`,
    image: heroImage?.url || DEFAULT_OG_IMAGE,
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
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
      '@id': `https://trucking-accident-site.vercel.app/states/${slug}/${city}`,
    },
  };

  // City-specific FAQs - use from city content files if available
  const defaultFaqs = [
    {
      question: `How much is my ${cityData.name} truck accident case worth?`,
      answer: `Truck accident settlement values in ${cityData.name} depend on injury severity, medical expenses, lost wages, and liability. Serious injury cases often settle for $500,000 to several million dollars. With ${truckFatalities} fatal truck crashes in ${cityData.name} in ${cityData.dataYear}, these cases require experienced legal representation. A free consultation can provide a case-specific estimate.`,
    },
    {
      question: `What should I do after a truck accident in ${cityData.name}?`,
      answer: `First, seek medical attention even if injuries seem minor. Call 911 to file a police report. Document the scene with photos and get contact information from witnesses. Do not give statements to the trucking company's insurance. Contact a ${cityData.name} truck accident lawyer before accepting any settlement offer.`,
    },
    {
      question: `How long do I have to file a truck accident lawsuit in ${stateName}?`,
      answer: `${stateName} sets legal time limits for personal injury claims, and they vary by the type of claim and the facts. Because getting that wrong can affect a case, it is worth confirming with a licensed ${stateName} attorney rather than relying on a web page. Separately, the physical evidence — the truck's logs and electronic data — can disappear within weeks, so preserving it early matters regardless of the legal deadline. This is general information, not legal advice.`,
    },
    {
      question: `Who can be held liable for a truck accident in ${cityData.name}?`,
      answer: `Multiple parties may be liable in ${cityData.name} truck accidents: the truck driver, trucking company, cargo loading company, truck manufacturer, and maintenance providers. An experienced attorney will investigate all potentially responsible parties to maximize your compensation.`,
    },
    {
      question: `Do I need a lawyer for my ${cityData.name} truck accident?`,
      answer: `While not legally required, truck accident cases are complex. Trucking companies have aggressive legal teams and extensive resources. An experienced ${cityData.name} truck accident lawyer levels the playing field, handles negotiations, and typically recovers significantly more compensation than unrepresented victims.`,
    },
  ];

  // Use unique FAQs from city content if available
  const cityFaqs = cityContent?.faqs && cityContent.faqs.length > 0
    ? cityContent.faqs
    : defaultFaqs;

  // FAQ Schema for SEO
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: cityFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero — cinematic command treatment (Sanity stock hero dropped) */}
      <CommandHero
        size="lg"
        eyebrow={`${stateName} Truck Accident Response`}
        title={`${cityData.name} Truck Accident Lawyers`}
        breadcrumb={
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'States', href: '/states' },
              { label: stateName, href: `/states/${slug}` },
              { label: cityData.name },
            ]}
          />
        }
        subtitle={
          cityContent?.heroText ||
          `Experienced 18-wheeler accident attorneys serving ${cityData.name}, ${stateName}. With ${truckFatalities.toLocaleString()} fatal truck crashes recorded in ${cityData.dataYear}, our team fights for maximum compensation for accident victims.`
        }
        stats={[
          { value: String(truckFatalities), label: `Fatal Truck Crashes (${cityData.dataYear})` },
          { value: population.toLocaleString(), label: 'City Population' },
          { value: '24/7', label: 'Available for Calls' },
          { value: '$0', label: 'Upfront Cost' },
        ]}
      >
        <a href={`tel:${PHONE_NUMBER}`} className="btn btn-primary">
          <Phone className="h-5 w-5" />
          Free Case Evaluation: {PHONE_NUMBER}
        </a>
        <Link href="/contact" className="btn btn-ghost-ink">
          Contact Us Online
          <ArrowRight className="h-5 w-5" />
        </Link>
      </CommandHero>

      {/* Source attribution for the hero stats (FARS) */}
      <div className="border-b border-line bg-white">
        <div className="container-page py-4">
          <p className="text-sm text-ink-muted">
            Source:{' '}
            <a
              href={cityData.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-amber-600 hover:text-amber-700"
            >
              NHTSA FARS Database
            </a>
          </p>
        </div>
      </div>

      {/* Truck Accidents in City */}
      <Section
        tone="white"
        eyebrow="Local Overview"
        title={`Truck Accidents in ${cityData.name}, ${stateName}`}
      >
        <div className="prose-legal max-w-3xl text-lg">
          <p>
            {cityData.name} is one of {stateName}&apos;s largest cities with a population of{' '}
            {population.toLocaleString()} residents. The city&apos;s location along major
            trucking corridors makes it a high-traffic area for commercial vehicles, including
            18-wheelers, semi-trucks, and other large trucks.
          </p>
          <p>
            According to the National Highway Traffic Safety Administration (NHTSA) Fatality Analysis
            Reporting System (FARS), {cityData.name} and its surrounding area recorded{' '}
            <strong>{truckFatalities} fatal truck crashes</strong> in {cityData.dataYear}.
            These accidents resulted in devastating injuries and wrongful deaths that forever changed
            families throughout the {cityData.name} metropolitan area.
          </p>
          {cityContent?.truckingIndustry && (
            <div dangerouslySetInnerHTML={{ __html: cityContent.truckingIndustry.replace(/\n\n/g, '</p><p>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') }} />
          )}
          {!cityContent?.truckingIndustry && (
            <p>
              If you or a loved one was injured in a truck accident in {cityData.name}, understanding
              your legal rights is critical. Trucking companies and their insurers have teams of lawyers
              working to minimize their liability. You deserve experienced legal representation that
              knows how to investigate these complex cases and fight for maximum compensation.
            </p>
          )}
        </div>
      </Section>

      {/* Dangerous Roads */}
      <Section
        tone="paper"
        eyebrow="High-Risk Corridors"
        title={`Dangerous Trucking Routes in ${cityData.name}`}
        intro={`Major highways and interstates passing through ${cityData.name} see heavy commercial truck traffic. These corridors are common sites for serious truck accidents:`}
      >
        <div className="grid gap-5 md:grid-cols-3">
          {cityContent?.dangerousRoads ? (
            // Use detailed road info from city content
            cityContent.dangerousRoads.map((road, index) => (
              <div key={index} className="card flex flex-col p-6">
                <MapPin className="h-7 w-7 text-amber-600" />
                <h3 className="mt-4 text-xl font-bold text-ink-strong">{road.name}</h3>
                <p className="mt-2 text-ink-muted">
                  {road.description}
                  {road.milesInCity && ` Approximately ${road.milesInCity} miles within city limits.`}
                </p>
              </div>
            ))
          ) : (
            // Fallback to basic road names
            cityData.dangerousRoads.map((road, index) => (
              <div key={index} className="card flex flex-col p-6">
                <MapPin className="h-7 w-7 text-amber-600" />
                <h3 className="mt-4 text-xl font-bold text-ink-strong">{road}</h3>
                <p className="mt-2 text-ink-muted">
                  Major trucking corridor passing through {cityData.name}. High volume of
                  commercial traffic increases accident risk.
                </p>
              </div>
            ))
          )}
        </div>
      </Section>

      {/* Common Causes */}
      <Section
        tone="white"
        eyebrow="Crash Mechanisms"
        title={`Common Causes of Truck Accidents in ${cityData.name}`}
      >
        {cityContent?.commonAccidents && cityContent.commonAccidents.length > 0 ? (
          // Use regional accident data with unique percentages
          <div className="grid gap-5 md:grid-cols-2">
            {cityContent.commonAccidents.map((accident, index) => {
              const slug = mechanismSlug(accident.type);
              return (
                <div key={index} className="card flex flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-bold text-ink-strong">
                      {slug ? (
                        <Link href={`/accidents/${slug}`} className="hover:text-amber-600">
                          {accident.type}
                        </Link>
                      ) : (
                        accident.type
                      )}
                    </h3>
                    {accident.percentage && (
                      <span className="tabular shrink-0 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-sm font-semibold text-amber-700">
                        {accident.percentage}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-ink-muted">{accident.localFactor}</p>
                  {slug && (
                    <Link
                      href={`/accidents/${slug}`}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700"
                    >
                      How these cases are built
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          // Fallback to generic content
          <div className="grid gap-5 md:grid-cols-2">
            <div className="card flex flex-col p-6">
              <AlertTriangle className="h-7 w-7 text-amber-600" />
              <h3 className="mt-4 text-xl font-bold text-ink-strong">Driver Fatigue</h3>
              <p className="mt-2 text-ink-muted">
                Despite federal hours-of-service regulations, many truck drivers exceed legal driving
                limits to meet delivery deadlines. Fatigued driving is a leading cause of truck
                accidents in {cityData.name}.
              </p>
            </div>
            <div className="card flex flex-col p-6">
              <AlertTriangle className="h-7 w-7 text-amber-600" />
              <h3 className="mt-4 text-xl font-bold text-ink-strong">Distracted Driving</h3>
              <p className="mt-2 text-ink-muted">
                Cell phone use, GPS devices, and other distractions cause truck drivers to lose
                focus on the road. At 65 mph, looking away for just 5 seconds means traveling
                the length of a football field blind.
              </p>
            </div>
            <div className="card flex flex-col p-6">
              <AlertTriangle className="h-7 w-7 text-amber-600" />
              <h3 className="mt-4 text-xl font-bold text-ink-strong">Improper Maintenance</h3>
              <p className="mt-2 text-ink-muted">
                Trucking companies sometimes cut corners on maintenance to save money. Brake
                failures, tire blowouts, and other mechanical issues cause catastrophic accidents.
              </p>
            </div>
            <div className="card flex flex-col p-6">
              <AlertTriangle className="h-7 w-7 text-amber-600" />
              <h3 className="mt-4 text-xl font-bold text-ink-strong">Overloaded Cargo</h3>
              <p className="mt-2 text-ink-muted">
                Improperly loaded or overweight trucks are harder to control and take longer to
                stop. Shifted cargo can cause rollovers and jackknife accidents.
              </p>
            </div>
          </div>
        )}
      </Section>

      {/* National Resources — deep-link the local hub to the federal substance */}
      <Section
        tone="paper-2"
        eyebrow="Federal Substance"
        title={`How a ${cityData.name} Truck Accident Case Works`}
        intro={`Truck claims turn on federal rules and physical evidence that are the same whether the crash happened in ${cityData.name} or anywhere else. These national guides go deep on the parts that decide a case — what to preserve, who can be held liable, and how value is built.`}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {mechanismLinks.length > 0 && mechanismLinks.map(([mSlug, mType]) => (
            <Link
              key={mSlug}
              href={`/accidents/${mSlug}`}
              className="card card-hover group flex items-start justify-between gap-4 p-6"
            >
              <span>
                <span className="block font-bold text-ink-strong">{mType} crashes</span>
                <span className="mt-1 block text-sm text-ink-muted">
                  How they happen, the evidence trail, and who is liable.
                </span>
              </span>
              <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-amber-600 transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
          <Link
            href="/fmcsa-regulations"
            className="card card-hover group flex items-start justify-between gap-4 p-6"
          >
            <span>
              <span className="block font-bold text-ink-strong">FMCSA Trucking Regulations</span>
              <span className="mt-1 block text-sm text-ink-muted">
                The federal rules — hours of service, maintenance, driver files — that often decide fault.
              </span>
            </span>
            <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-amber-600 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/accidents"
            className="card card-hover group flex items-start justify-between gap-4 p-6"
          >
            <span>
              <span className="block font-bold text-ink-strong">All Truck Accident Types</span>
              <span className="mt-1 block text-sm text-ink-muted">
                Evidence preservation, liable parties, and compensation factors, by crash type.
              </span>
            </span>
            <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-amber-600 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        {venueCourt && (
          <div className="mt-8 max-w-3xl border-t border-line pt-4 text-sm text-ink-muted">
            <strong className="text-ink-strong">Court context:</strong> {cityData.name} is located in{' '}
            {venueCourt.county} County, {stateName}. The trial court that serves {venueCourt.county} County
            is the{' '}
            <a
              href={venueCourt.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-600 hover:text-amber-700"
            >
              {venueCourt.displayName ?? venueCourt.trialCourtName}
            </a>
            {' '}— see the official court website for locations, hours, and filing information. This is
            general public-record information, not legal advice.
          </div>
        )}
        {isHub && (
          <p className="mt-8 max-w-3xl border-t border-line pt-4 text-sm text-ink-muted/80">
            <strong>About this page:</strong> the local figures above come from NHTSA&apos;s FARS
            fatality records. We do not list specific {cityData.name} roads{venueCourt ? '' : ', courts,'} or
            carriers unless we can source them, so state-law deadlines and local specifics should be
            confirmed with a licensed {stateName} attorney.
          </p>
        )}
      </Section>

      {/* Why Hire Local — cinematic dark command section */}
      <section className="bg-command grain relative isolate overflow-hidden py-16 md:py-24">
        <div className="container-page max-w-4xl">
          <p className="eyebrow eyebrow-on-ink">The Local Advantage</p>
          <h2 className="mt-4 text-[length:var(--text-display-md)] text-white">
            Why Hire a {cityData.name} Truck Accident Lawyer?
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-steel-200">
            Truck accident cases are significantly more complex than typical car accident claims.
            A {cityData.name} truck accident lawyer brings critical advantages:
          </p>
          <ul className="mt-8 space-y-5">
            <li className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-amber-500" />
              <span className="text-steel-200">
                <strong className="font-semibold text-white">Preserving the evidence</strong> —
                Organizing the trucking company&apos;s records, the driver&apos;s logs, and the
                federal compliance trail that a routine car case never involves.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="mt-0.5 h-6 w-6 shrink-0 text-amber-500" />
              <span className="text-steel-200">
                <strong className="font-semibold text-white">Tracking the deadlines</strong> —
                Keeping the filing deadline and the evidence-preservation steps on schedule,
                so nothing critical lapses while you recover.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Document className="mt-0.5 h-6 w-6 shrink-0 text-amber-500" />
              <span className="text-steel-200">
                <strong className="font-semibold text-white">Quick accident scene investigation</strong> —
                Preserving evidence before trucking companies can alter or destroy it.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Users className="mt-0.5 h-6 w-6 shrink-0 text-amber-500" />
              <span className="text-steel-200">
                <strong className="font-semibold text-white">Network of local experts</strong> —
                Access to accident reconstructionists, medical experts, and economists in {stateName}.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Scale className="mt-0.5 h-6 w-6 shrink-0 text-amber-500" />
              <span className="text-steel-200">
                <strong className="font-semibold text-white">No fee unless you win</strong> —
                Contingency fee arrangements mean you pay nothing upfront.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Link to State Page */}
      <Section
        tone="white"
        eyebrow="State Law"
        title={`${stateName} Truck Accident Laws`}
        intro={`Truck accident claims in ${cityData.name} are governed by ${stateName} state law, including statute of limitations deadlines, comparative negligence rules, and damage caps. Our state truck accident guide covers what you need to know.`}
      >
        <Link href={`/states/${slug}`} className="btn btn-primary">
          View {stateName} Truck Accident Laws
          <ArrowRight className="h-5 w-5" />
        </Link>
      </Section>

      {/* FAQ */}
      <Section
        tone="paper"
        eyebrow="Common Questions"
        title={`${cityData.name} Truck Accident FAQs`}
      >
        <div className="mx-auto max-w-3xl space-y-4">
          {cityFaqs.map((faq, index) => (
            <div key={index} className="card signpost p-6">
              <h3 className="text-lg font-bold text-ink-strong">{faq.question}</h3>
              <p className="mt-3 leading-relaxed text-ink-muted">{faq.answer}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Other Cities */}
      {otherCities.length > 0 && (
        <Section
          tone="white"
          eyebrow="Nearby Coverage"
          title={`Truck Accident Lawyers in Other ${stateName} Cities`}
        >
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {otherCities.map((otherCity) => (
              <Link
                key={otherCity.slug}
                href={`/states/${slug}/${otherCity.slug}`}
                className="group flex flex-col rounded-lg border border-line bg-paper p-4 text-center transition-colors hover:border-ink-800 hover:bg-white"
              >
                <span className="font-medium text-ink-strong group-hover:text-amber-700">{otherCity.name}</span>
                <span className="tabular mt-1 text-sm text-ink-muted">
                  {otherCity.truckFatalities} fatal crashes
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href={`/states/${slug}`}
              className="inline-flex items-center gap-2 text-base font-semibold text-amber-600 hover:text-amber-700"
            >
              View all {stateName} cities
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </Section>
      )}

      {/* Content Freshness */}
      <div className="border-t border-line bg-white">
        <div className="container-page py-8">
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
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  Last Updated:{' '}
                  <time dateTime={new Date().toISOString().split('T')[0]} className="font-medium">
                    {new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </span>
              </div>
              <span className="text-line">|</span>
              <a
                href={cityData.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 hover:text-amber-700"
              >
                NHTSA FARS {cityData.dataYear}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* CTA — cinematic dark command close */}
      <section className="bg-command grain relative isolate overflow-hidden py-16 md:py-24">
        <div className="container-page max-w-3xl text-center">
          <h2 className="text-[length:var(--text-display-md)] text-white">
            Injured in a {cityData.name} Truck Accident?
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-steel-200">
            Get experienced legal representation that knows how to preserve the trucking
            company&apos;s records, meet the deadlines, and hold carriers accountable under the
            federal safety rules. We fight to hold trucking companies accountable.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={`tel:${PHONE_NUMBER}`} className="btn btn-primary">
              <Phone className="h-5 w-5" />
              Call Now: {PHONE_NUMBER}
            </a>
            <Link href="/contact" className="btn btn-ghost-ink">
              Free Case Evaluation
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          <p className="mt-6 text-sm text-steel-400">
            No Fee Unless You Win | Available 24/7 | Hablamos Espa&ntilde;ol
          </p>
        </div>
      </section>
    </>
  );
}
