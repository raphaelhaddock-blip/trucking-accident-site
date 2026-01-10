import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';
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

  // Get state image as fallback (city-specific images will override later)
  const ogImage = STATE_IMAGES[slug] || { url: DEFAULT_OG_IMAGE, alt: `${cityData.name} truck accident lawyers` };

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

  // Use population from city content (which has real data) or fallback
  const population = cityContent?.population || cityData.population;
  const truckFatalities = cityContent?.accidentStats?.truckFatalities || cityData.truckFatalities;

  // Get hero image (state image as fallback)
  const heroImage = STATE_IMAGES[slug];

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
      answer: `${stateName} has a statute of limitations for personal injury claims that sets strict deadlines for filing. Missing this deadline means losing your right to compensation forever. Contact a ${cityData.name} truck accident lawyer promptly to ensure your claim is filed on time and all evidence is preserved.`,
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
    <div className="min-h-screen bg-gray-50">
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

      {/* Hero Section with Image */}
      <section className="relative min-h-[400px] md:min-h-[500px] flex items-center">
        {/* Background Image */}
        {heroImage && (
          <>
            <Image
              src={heroImage.url}
              alt={heroImage.alt}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-900/70 via-navy-900/40 to-transparent" />
          </>
        )}
        {!heroImage && (
          <div className="absolute inset-0 bg-navy-900" />
        )}

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 text-white">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'States', href: '/states' },
              { label: stateName, href: `/states/${slug}` },
              { label: cityData.name },
            ]}
          />
          <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
            {cityData.name} Truck Accident Lawyers
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl drop-shadow">
            {cityContent?.heroText || `Experienced 18-wheeler accident attorneys serving ${cityData.name}, ${stateName}. With ${truckFatalities.toLocaleString()} fatal truck crashes recorded in ${cityData.dataYear}, our team fights for maximum compensation for accident victims.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
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

      {/* Statistics Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-amber-500 mb-2">
                {truckFatalities}
              </div>
              <div className="text-gray-600 text-sm">Fatal Truck Crashes ({cityData.dataYear})</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-amber-500 mb-2">
                {population.toLocaleString()}
              </div>
              <div className="text-gray-600 text-sm">City Population</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-amber-500 mb-2">
                24/7
              </div>
              <div className="text-gray-600 text-sm">Available for Calls</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-amber-500 mb-2">
                $0
              </div>
              <div className="text-gray-600 text-sm">Upfront Cost</div>
            </div>
          </div>
          <p className="text-center text-gray-500 text-sm mt-4">
            Source:{' '}
            <a
              href={cityData.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-600 hover:text-amber-700"
            >
              NHTSA FARS Database
            </a>
          </p>
        </div>
      </section>

      {/* Truck Accidents in City Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy-900 mb-6">
            Truck Accidents in {cityData.name}, {stateName}
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700">
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
        </div>
      </section>

      {/* Dangerous Roads Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy-900 mb-8">
            Dangerous Trucking Routes in {cityData.name}
          </h2>
          <p className="text-gray-600 mb-8">
            Major highways and interstates passing through {cityData.name} see heavy commercial truck
            traffic. These corridors are common sites for serious truck accidents:
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {cityContent?.dangerousRoads ? (
              // Use detailed road info from city content
              cityContent.dangerousRoads.map((road, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="text-2xl font-bold text-navy-900 mb-2">{road.name}</div>
                  <p className="text-gray-600">
                    {road.description}
                    {road.milesInCity && ` Approximately ${road.milesInCity} miles within city limits.`}
                  </p>
                </div>
              ))
            ) : (
              // Fallback to basic road names
              cityData.dangerousRoads.map((road, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="text-2xl font-bold text-navy-900 mb-2">{road}</div>
                  <p className="text-gray-600">
                    Major trucking corridor passing through {cityData.name}. High volume of
                    commercial traffic increases accident risk.
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Common Causes Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy-900 mb-8">
            Common Causes of Truck Accidents in {cityData.name}
          </h2>
          {cityContent?.commonAccidents && cityContent.commonAccidents.length > 0 ? (
            // Use regional accident data with unique percentages
            <div className="grid md:grid-cols-2 gap-6">
              {cityContent.commonAccidents.map((accident, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-navy-900">{accident.type}</h3>
                    {accident.percentage && (
                      <span className="bg-amber-100 text-amber-800 text-sm font-medium px-3 py-1 rounded-full">
                        {accident.percentage}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700">{accident.localFactor}</p>
                </div>
              ))}
            </div>
          ) : (
            // Fallback to generic content
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-navy-900 mb-3">Driver Fatigue</h3>
                <p className="text-gray-700">
                  Despite federal hours-of-service regulations, many truck drivers exceed legal driving
                  limits to meet delivery deadlines. Fatigued driving is a leading cause of truck
                  accidents in {cityData.name}.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-navy-900 mb-3">Distracted Driving</h3>
                <p className="text-gray-700">
                  Cell phone use, GPS devices, and other distractions cause truck drivers to lose
                  focus on the road. At 65 mph, looking away for just 5 seconds means traveling
                  the length of a football field blind.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-navy-900 mb-3">Improper Maintenance</h3>
                <p className="text-gray-700">
                  Trucking companies sometimes cut corners on maintenance to save money. Brake
                  failures, tire blowouts, and other mechanical issues cause catastrophic accidents.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-navy-900 mb-3">Overloaded Cargo</h3>
                <p className="text-gray-700">
                  Improperly loaded or overweight trucks are harder to control and take longer to
                  stop. Shifted cargo can cause rollovers and jackknife accidents.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Why Hire Local Section */}
      <section className="py-16 bg-navy-900 text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">
            Why Hire a {cityData.name} Truck Accident Lawyer?
          </h2>
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-gray-300">
              Truck accident cases are significantly more complex than typical car accident claims.
              A {cityData.name} truck accident lawyer brings critical advantages:
            </p>
            <ul className="text-gray-300 space-y-3 mt-6">
              <li>
                <strong className="text-white">Knowledge of {stateName} trucking laws</strong> -
                State regulations add layers of liability beyond federal FMCSA rules.
              </li>
              <li>
                <strong className="text-white">Familiarity with local courts</strong> -
                Understanding how {cityData.name} area judges and juries handle truck accident cases.
              </li>
              <li>
                <strong className="text-white">Quick accident scene investigation</strong> -
                Preserving evidence before trucking companies can alter or destroy it.
              </li>
              <li>
                <strong className="text-white">Network of local experts</strong> -
                Access to accident reconstructionists, medical experts, and economists in {stateName}.
              </li>
              <li>
                <strong className="text-white">No fee unless you win</strong> -
                Contingency fee arrangements mean you pay nothing upfront.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Link to State Page */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy-900 mb-6">
            {stateName} Truck Accident Laws
          </h2>
          <p className="text-gray-700 mb-6">
            Truck accident claims in {cityData.name} are governed by {stateName} state law, including
            statute of limitations deadlines, comparative negligence rules, and damage caps. Our
            comprehensive {stateName} truck accident guide covers everything you need to know.
          </p>
          <Link
            href={`/states/${slug}`}
            className="inline-block bg-amber-500 text-navy-900 font-bold px-8 py-4 rounded-lg hover:bg-amber-400 transition"
          >
            View {stateName} Truck Accident Laws &rarr;
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy-900 mb-8">
            {cityData.name} Truck Accident FAQs
          </h2>
          <div className="space-y-6">
            {cityFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-amber-500"
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

      {/* Other Cities Section */}
      {otherCities.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-navy-900 mb-6">
              Truck Accident Lawyers in Other {stateName} Cities
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {otherCities.map((otherCity) => (
                <Link
                  key={otherCity.slug}
                  href={`/states/${slug}/${otherCity.slug}`}
                  className="bg-white px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition text-center"
                >
                  <span className="text-amber-600 font-medium">{otherCity.name}</span>
                  <span className="text-gray-500 text-sm block">
                    {otherCity.truckFatalities} fatal crashes
                  </span>
                </Link>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link
                href={`/states/${slug}`}
                className="text-amber-600 font-semibold hover:text-amber-700"
              >
                View all {stateName} cities &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Content Freshness */}
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
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
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
              <span className="text-gray-400">|</span>
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
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-navy-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Injured in a {cityData.name} Truck Accident?
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Get experienced legal representation from attorneys who know {cityData.name} and
            {stateName} trucking laws. We fight to hold trucking companies accountable.
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
