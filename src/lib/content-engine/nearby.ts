/**
 * Distance-based nearby in-state cities, computed from real FARS coordinates.
 * No hardcoded neighbor lists. Cities without coords are skipped (NEEDS_SOURCE).
 */
import farsRaw from '../../../scripts/city-accident-data.json';
import type { FarsCity } from './fars-types';

const FARS = farsRaw as { states: Record<string, { cities: FarsCity[] }> };

function haversineMi(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 3958.8;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export interface NearbyCity {
  slug: string;
  name: string;
  miles: number;
}

export function nearbyCities(stateSlug: string, citySlug: string, count = 6): NearbyCity[] {
  const cities = FARS.states[stateSlug]?.cities ?? [];
  const self = cities.find((c) => c.slug === citySlug);
  if (!self?.lat || !self?.lng) return [];
  const selfLat = self.lat;
  const selfLng = self.lng;
  return cities
    .filter((c): c is FarsCity & { lat: number; lng: number } =>
      c.slug !== citySlug && c.lat != null && c.lng != null)
    .map((c) => ({ slug: c.slug, name: c.name, miles: Math.round(haversineMi(selfLat, selfLng, c.lat, c.lng)) }))
    .sort((a, b) => a.miles - b.miles)
    .slice(0, count);
}
