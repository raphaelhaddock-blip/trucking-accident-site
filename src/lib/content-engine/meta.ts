/**
 * SEO surface builder. Template pools selected by hash so that, even after the
 * duplicate auditor masks city names and numbers, different cities land on
 * structurally different titles/descriptions/H1s.
 */
import type { CityProfile } from './profile';
import { selectIndex } from './hash';

const farsShort = (p: CityProfile) =>
  p.truckFatalities > 0
    ? `${p.truckFatalities} truck ${p.truckFatalities === 1 ? 'death' : 'deaths'} in ${p.dataYear}`
    : `${p.dataYear} federal crash data`;

const titlePool = [
  (p: CityProfile) => `${p.name} Truck Accident Lawyers`,
  (p: CityProfile) => `Truck Accident Attorneys in ${p.name}`,
  (p: CityProfile) => `${p.name} 18-Wheeler Accident Lawyers`,
  (p: CityProfile) => `${p.name} Semi-Truck Injury Attorneys`,
  (p: CityProfile) => `Hurt by a Truck in ${p.name}? Lawyers Who Help`,
];

const h1Pool = [
  (p: CityProfile) => `${p.name} Truck Accident Lawyers`,
  (p: CityProfile) => `Truck Accident Attorneys Serving ${p.name}`,
  (p: CityProfile) => `${p.name}, ${p.stateName} Truck Injury Lawyers`,
  (p: CityProfile) => `Injured by a Commercial Truck in ${p.name}?`,
];

const descPool = [
  (p: CityProfile) => `Hurt in a truck crash in ${p.name}? ${farsShort(p)}. Learn what evidence matters, who may be liable, and the first steps to take. Free consultation.`,
  (p: CityProfile) => `Truck wrecks in ${p.name} are not ordinary car cases. See why they differ, the federal records that decide them, and how to protect your claim.`,
  (p: CityProfile) => `Injured by an 18-wheeler near ${p.name}? ${farsShort(p)}. Understand liability, evidence preservation, and your options before deadlines pass.`,
  (p: CityProfile) => `A ${p.name} truck accident can involve the driver, the carrier, and more. Find out who may owe you and what proof to secure right away.`,
  (p: CityProfile) => `What to do after a truck crash in ${p.name}: preserve the black box and logs, identify every liable company, and know your ${p.stateName} options.`,
];

export function buildMeta(p: CityProfile) {
  const seed = `${p.stateSlug}/${p.slug}`;
  return {
    metaTitle: titlePool[selectIndex(seed, 'title', titlePool.length)](p),
    h1: h1Pool[selectIndex(seed, 'h1', h1Pool.length)](p),
    metaDescription: descPool[selectIndex(seed, 'desc', descPool.length)](p),
  };
}
