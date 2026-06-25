/**
 * compose — assembles a full CityContent object from a CityProfile using the
 * slot-based modules, meta builder, FAQ pool, and the real regional accident mix.
 * Only verified/general data is written; unverified specifics stay out.
 */
import type { CityProfile } from './profile';
import type { CityContent, CommonAccidentType } from '../cities-content/types';
import { buildModules } from './modules';
import { buildMeta } from './meta';
import { buildFaqs, buildHubFaqs } from './faq';

function humanize(type: string): string {
  return type
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

export function composeCityContent(p: CityProfile, lastUpdated: string): CityContent {
  const mods = buildModules(p);
  const meta = buildMeta(p);

  // Real regional accident mix (sourced). localFactor lives ONLY here, not repeated
  // verbatim in the prose, to avoid same-region pages colliding on it.
  const commonAccidents: CommonAccidentType[] = p.mechanismMix.slice(0, 4).map((m) => ({
    type: humanize(m.type),
    percentage: `${m.percentage}%`,
    localFactor: m.localFactor,
  }));

  return {
    slug: p.slug,
    name: p.name,
    stateSlug: p.stateSlug,
    stateName: p.stateName,
    population: p.population ?? 0,

    metaTitle: meta.metaTitle,
    metaDescription: meta.metaDescription,
    h1: meta.h1,

    heroText: mods.heroText,

    accidentStats: {
      truckFatalities: p.truckFatalities,
      fatalCrashes: p.fatalCrashes,
      dataYear: p.dataYear,
      comparisonToState: undefined,
      sourceUrl: p.farsSourceUrl,
    },

    whyDangerous: mods.whyDangerous,
    liabilityExplanation: mods.liabilityExplanation,
    evidencePreservation: mods.evidencePreservation,
    fmcsaRegulations: mods.fmcsaRegulations,

    // Roads are NEEDS_SOURCE (current data is demonstrably wrong) — do not assert.
    dangerousRoads: [],

    commonAccidents,

    truckingIndustry: mods.truckingIndustry,
    legalInfo: mods.legalInfo,

    faqs: buildFaqs(p, 7),

    lastUpdated,

    ...(p.lat && p.lng ? { geo: { latitude: p.lat, longitude: p.lng } } : {}),
  };
}

/**
 * Hub variant — populates ONLY the fields the city route actually renders
 * (hero, accidentStats, commonAccidents, truckingIndustry, faqs). The heavy
 * federal-substance fields (whyDangerous/liability/evidence/FMCSA/legalInfo) are
 * omitted because the city route does not render them — they are dead data on
 * city pages and live on the /accidents/[slug] pages instead. Omitting them
 * removes the duplication those identical-everywhere fields cause, with zero
 * rendering or SEO impact.
 */
export function composeCityContentHub(p: CityProfile, lastUpdated: string): CityContent {
  const full = composeCityContent(p, lastUpdated);
  const hub = { ...full };
  delete hub.whyDangerous;
  delete hub.liabilityExplanation;
  delete hub.evidencePreservation;
  delete hub.fmcsaRegulations;
  // legalInfo is also unrendered on the city route; drop it from the hub page.
  hub.legalInfo = '';
  // Hub-specific FAQ selection: force the two highest-signal local FAQs (real FARS
  // count + regional mechanism/region) and fill from answer-differentiated entries,
  // avoiding pure-evergreen answers that normalize to identical strings across cities.
  hub.faqs = buildHubFaqs(p, 6);
  return hub;
}
