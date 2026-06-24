/**
 * Internal-link builder. Returns real nearby in-state cities (distance-based),
 * core trucking-evidence / accident-mechanism pages, and the state hub.
 *
 * NOTE: the current city route already renders its own nearby/state/accident links,
 * so this helper is for the eventual runtime-composition route (a later PR). It is
 * exported for reuse and tested by the engine, not yet wired into rendering.
 */
import type { CityProfile } from './profile';
import { nearbyCities, type NearbyCity } from './nearby';

export interface CityLinks {
  state: { href: string; label: string };
  nearby: Array<{ href: string; label: string; miles: number }>;
  mechanisms: Array<{ href: string; label: string }>;
}

// mechanism key (regional pattern) -> existing /accidents/[slug]
const MECH_TO_ACCIDENT: Record<string, string> = {
  rearEnd: 'rear-end-collisions',
  jackknife: 'jackknife-accidents',
  rollover: 'rollover-accidents',
  underride: 'underride-accidents',
  headOn: 'head-on-collisions',
  sideswipe: 'sideswipe-accidents',
  tBone: 't-bone-accidents',
  wideTurn: 'wide-turn-accidents',
  blindSpot: 'blind-spot-accidents',
};

export function buildLinks(p: CityProfile, nearbyCount = 6): CityLinks {
  const nearby: NearbyCity[] = nearbyCities(p.stateSlug, p.slug, nearbyCount);
  const mechanisms = p.mechanismMix
    .map((m) => MECH_TO_ACCIDENT[m.type])
    .filter(Boolean)
    .slice(0, 4)
    .map((slug) => ({ href: `/accidents/${slug}`, label: slug.replace(/-/g, ' ') }));
  return {
    state: { href: `/states/${p.stateSlug}`, label: `${p.stateName} truck accident lawyers` },
    nearby: nearby.map((n) => ({ href: `/states/${p.stateSlug}/${n.slug}`, label: `${n.name} truck accident lawyers`, miles: n.miles })),
    mechanisms,
  };
}
