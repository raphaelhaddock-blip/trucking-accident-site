/**
 * Google Maps URL Generation Utilities
 *
 * This module provides functions for generating Google Maps URLs
 * for courthouses, trauma centers, and danger zones. Used to create
 * contextual map links in city pages.
 *
 * @see docs/INTERLINK_SPEC.md for full specification
 */

import type {
  Coordinates,
  CourthouseInfo,
  TraumaCenterInfo,
  DangerZoneInfo,
  CityMapLinks,
} from './interlinks';

// =============================================================================
// URL Generation Functions
// =============================================================================

/**
 * Generate a Google Maps search URL
 * Opens Google Maps with a search query
 */
export function generateMapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/**
 * Generate a Google Maps directions URL
 * Opens Google Maps with directions to a destination
 */
export function generateMapsDirectionsUrl(destination: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

/**
 * Generate a Google Maps place URL by coordinates
 * Opens Google Maps centered on specific coordinates
 */
export function generateMapsPlaceUrl(
  lat: number,
  lng: number,
  placeName?: string
): string {
  const baseUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  return placeName
    ? `${baseUrl}&query_place_id=${encodeURIComponent(placeName)}`
    : baseUrl;
}

/**
 * Generate a Google Maps embed URL for iframe
 * Used for embedding static maps in pages
 */
export function generateMapsEmbedUrl(
  lat: number,
  lng: number,
  zoom: number = 15
): string {
  // Note: For production, use Google Maps Embed API with API key
  return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d${getZoomDistance(zoom)}!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v${Date.now()}`;
}

/**
 * Convert zoom level to distance for embed URL
 */
function getZoomDistance(zoom: number): number {
  // Approximate conversion from zoom to distance
  const zoomDistances: Record<number, number> = {
    10: 50000,
    11: 25000,
    12: 12000,
    13: 6000,
    14: 3000,
    15: 1500,
    16: 750,
    17: 375,
    18: 200,
  };
  return zoomDistances[zoom] || 1500;
}

// =============================================================================
// Map Link Generators
// =============================================================================

/**
 * Generate courthouse map link data
 */
export function generateCourthouseLink(
  name: string,
  address: string,
  coordinates: Coordinates
): CourthouseInfo {
  const fullQuery = `${name} ${address}`;

  return {
    name,
    address,
    coordinates,
    googleMapsUrl: generateMapsSearchUrl(fullQuery),
    googleMapsEmbed: generateMapsEmbedUrl(coordinates.lat, coordinates.lng, 16),
  };
}

/**
 * Generate trauma center map link data
 */
export function generateTraumaCenterLink(
  name: string,
  level: 1 | 2,
  address: string,
  coordinates: Coordinates,
  cityCenter?: Coordinates
): TraumaCenterInfo {
  const fullQuery = `${name} ${address}`;

  const traumaCenter: TraumaCenterInfo = {
    name,
    level,
    address,
    coordinates,
    googleMapsUrl: generateMapsSearchUrl(fullQuery),
  };

  // Calculate distance from city center if provided
  if (cityCenter) {
    const distance = calculateDistanceMiles(cityCenter, coordinates);
    traumaCenter.distanceFromCenter = `${distance.toFixed(1)} miles`;
  }

  return traumaCenter;
}

/**
 * Generate danger zone map link data
 */
export function generateDangerZoneLink(
  highway: string,
  description: string,
  mileMarkers: string,
  coordinates: Coordinates
): DangerZoneInfo {
  return {
    highway,
    description,
    mileMarkers,
    coordinates,
    googleMapsUrl: generateMapsPlaceUrl(
      coordinates.lat,
      coordinates.lng,
      `${highway} ${description}`
    ),
  };
}

/**
 * Generate city center map link
 */
export function generateCityCenterLink(
  city: string,
  state: string,
  coordinates: Coordinates
): { coordinates: Coordinates; googleMapsUrl: string } {
  return {
    coordinates,
    googleMapsUrl: generateMapsSearchUrl(`${city}, ${state}`),
  };
}

// =============================================================================
// Distance Calculation
// =============================================================================

/**
 * Calculate distance between two coordinates in miles
 */
export function calculateDistanceMiles(
  from: Coordinates,
  to: Coordinates
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.lat)) *
      Math.cos(toRad(to.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// =============================================================================
// Full City Map Links Generator
// =============================================================================

export interface CityMapData {
  city: string;
  state: string;
  county: string;
  cityCenter: Coordinates;
  courthouse: {
    name: string;
    address: string;
    coordinates: Coordinates;
  };
  traumaCenters: Array<{
    name: string;
    level: 1 | 2;
    address: string;
    coordinates: Coordinates;
  }>;
  dangerZones: Array<{
    highway: string;
    description: string;
    mileMarkers: string;
    coordinates: Coordinates;
  }>;
}

/**
 * Generate all map links for a city
 */
export function generateCityMapLinks(data: CityMapData): CityMapLinks {
  return {
    courthouse: generateCourthouseLink(
      data.courthouse.name,
      data.courthouse.address,
      data.courthouse.coordinates
    ),
    traumaCenters: data.traumaCenters.map((tc) =>
      generateTraumaCenterLink(
        tc.name,
        tc.level,
        tc.address,
        tc.coordinates,
        data.cityCenter
      )
    ),
    dangerZones: data.dangerZones.map((dz) =>
      generateDangerZoneLink(
        dz.highway,
        dz.description,
        dz.mileMarkers,
        dz.coordinates
      )
    ),
    cityCenter: generateCityCenterLink(
      data.city,
      data.state,
      data.cityCenter
    ),
  };
}

// =============================================================================
// Schema Markup Generators
// =============================================================================

export interface SchemaAddress {
  '@type': 'PostalAddress';
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode?: string;
  addressCountry: string;
}

export interface SchemaGeoCoordinates {
  '@type': 'GeoCoordinates';
  latitude: number;
  longitude: number;
}

/**
 * Generate schema.org Courthouse markup
 */
export function generateCourthouseSchema(courthouse: CourthouseInfo): object {
  const addressParts = parseAddress(courthouse.address);

  return {
    '@context': 'https://schema.org',
    '@type': 'Courthouse',
    name: courthouse.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: addressParts.street,
      addressLocality: addressParts.city,
      addressRegion: addressParts.state,
      postalCode: addressParts.zip,
      addressCountry: 'US',
    } as SchemaAddress,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: courthouse.coordinates.lat,
      longitude: courthouse.coordinates.lng,
    } as SchemaGeoCoordinates,
  };
}

/**
 * Generate schema.org Hospital markup for trauma center
 */
export function generateTraumaCenterSchema(traumaCenter: TraumaCenterInfo): object {
  const addressParts = parseAddress(traumaCenter.address);

  return {
    '@context': 'https://schema.org',
    '@type': 'Hospital',
    name: traumaCenter.name,
    medicalSpecialty: 'Trauma',
    address: {
      '@type': 'PostalAddress',
      streetAddress: addressParts.street,
      addressLocality: addressParts.city,
      addressRegion: addressParts.state,
      postalCode: addressParts.zip,
      addressCountry: 'US',
    } as SchemaAddress,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: traumaCenter.coordinates.lat,
      longitude: traumaCenter.coordinates.lng,
    } as SchemaGeoCoordinates,
  };
}

/**
 * Generate schema.org Place markup for danger zone
 */
export function generateDangerZoneSchema(dangerZone: DangerZoneInfo): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: `${dangerZone.highway} ${dangerZone.description}`,
    description: `High-risk trucking area at ${dangerZone.mileMarkers}`,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: dangerZone.coordinates.lat,
      longitude: dangerZone.coordinates.lng,
    } as SchemaGeoCoordinates,
  };
}

// =============================================================================
// Address Parsing Utility
// =============================================================================

interface ParsedAddress {
  street: string;
  city: string;
  state: string;
  zip?: string;
}

/**
 * Parse a full address string into components
 * Handles formats like: "123 Main St, Newark, NJ 07102"
 */
export function parseAddress(fullAddress: string): ParsedAddress {
  // Default values
  const result: ParsedAddress = {
    street: '',
    city: '',
    state: '',
  };

  // Split by comma
  const parts = fullAddress.split(',').map((p) => p.trim());

  if (parts.length >= 3) {
    // Format: "Street, City, State ZIP"
    result.street = parts[0];
    result.city = parts[1];

    // Parse state and zip from last part
    const stateZip = parts[2].trim().split(' ');
    result.state = stateZip[0];
    if (stateZip.length > 1) {
      result.zip = stateZip.slice(1).join(' ');
    }
  } else if (parts.length === 2) {
    // Format: "Street, City State ZIP"
    result.street = parts[0];
    const cityStateZip = parts[1].split(' ');
    if (cityStateZip.length >= 2) {
      result.city = cityStateZip.slice(0, -2).join(' ');
      result.state = cityStateZip[cityStateZip.length - 2];
      result.zip = cityStateZip[cityStateZip.length - 1];
    }
  } else {
    // Fallback: use entire string as street
    result.street = fullAddress;
  }

  return result;
}

// =============================================================================
// Link HTML Generators (for SSR/SSG)
// =============================================================================

/**
 * Generate HTML for courthouse link
 */
export function generateCourthouseLinkHtml(courthouse: CourthouseInfo): string {
  return `<a href="${courthouse.googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="map-link courthouse">📍 ${courthouse.name}</a>`;
}

/**
 * Generate HTML for trauma center link
 */
export function generateTraumaCenterLinkHtml(traumaCenter: TraumaCenterInfo): string {
  const distance = traumaCenter.distanceFromCenter
    ? ` - ${traumaCenter.distanceFromCenter}`
    : '';
  return `<a href="${traumaCenter.googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="map-link hospital">🏥 ${traumaCenter.name} (Level ${traumaCenter.level})${distance}</a>`;
}

/**
 * Generate HTML for danger zone link
 */
export function generateDangerZoneLinkHtml(dangerZone: DangerZoneInfo): string {
  return `<a href="${dangerZone.googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="map-link danger-zone">⚠️ ${dangerZone.highway} ${dangerZone.description} (${dangerZone.mileMarkers})</a>`;
}

// =============================================================================
// Exports
// =============================================================================

export type { CityMapLinks };
