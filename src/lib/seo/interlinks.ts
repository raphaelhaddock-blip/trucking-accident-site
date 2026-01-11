/**
 * Interlinking System Types and Utilities
 *
 * This module defines the types and functions for the automated
 * internal linking system. Links are generated based on geographic,
 * topical, and corridor relationships between pages.
 *
 * @see docs/INTERLINK_SPEC.md for full specification
 */

// =============================================================================
// Core Types
// =============================================================================

export type PageType = 'city' | 'state' | 'accident' | 'blog';

export type LinkType =
  | 'geographic'    // Same state, nearby cities
  | 'corridor'      // Share same highway
  | 'topical'       // Related accident types
  | 'content'       // Contextual blog/resource links
  | 'hierarchical'  // Parent-child (state->city)
  | 'maps';         // Google Maps links

export type LinkPlacement =
  | 'intro'         // First paragraph
  | 'body'          // Within content
  | 'section'       // Related section
  | 'footer';       // Bottom navigation

// =============================================================================
// Graph Interfaces
// =============================================================================

export interface PageNode {
  type: PageType;
  slug: string;
  state?: string;
  county?: string;
  highways?: string[];
  accidentTypes?: string[];
  population?: number;
  farsData?: {
    fatalities: number;
    years: string;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
  mapLinks?: CityMapLinks;
}

export interface LinkEdge {
  from: string;
  to: string;
  type: LinkType;
  score: number;
  anchor: string;
  placement: LinkPlacement;
}

export interface LinkGraph {
  nodes: Record<string, PageNode>;
  edges: LinkEdge[];
}

// =============================================================================
// Map Links Interfaces
// =============================================================================

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface CourthouseInfo {
  name: string;
  address: string;
  coordinates: Coordinates;
  googleMapsUrl: string;
  googleMapsEmbed?: string;
}

export interface TraumaCenterInfo {
  name: string;
  level: 1 | 2;
  address: string;
  coordinates: Coordinates;
  googleMapsUrl: string;
  distanceFromCenter?: string;
}

export interface DangerZoneInfo {
  highway: string;
  description: string;
  mileMarkers: string;
  coordinates: Coordinates;
  googleMapsUrl: string;
}

export interface CityMapLinks {
  courthouse: CourthouseInfo;
  traumaCenters: TraumaCenterInfo[];
  dangerZones: DangerZoneInfo[];
  cityCenter: {
    coordinates: Coordinates;
    googleMapsUrl: string;
  };
}

// =============================================================================
// Link Selection Interfaces
// =============================================================================

export interface LinkSelectionConfig {
  count: number;
  minScore: number;
}

export interface PageLinkConfig {
  toState?: LinkSelectionConfig;
  toSameStateCities?: LinkSelectionConfig;
  toCorridorCities?: LinkSelectionConfig;
  toAccidentTypes?: LinkSelectionConfig;
  toBlogs?: LinkSelectionConfig;
  toCities?: LinkSelectionConfig;
  toNeighborStates?: LinkSelectionConfig;
  toRelatedAccidents?: LinkSelectionConfig;
}

export interface SelectedLinks {
  hierarchical: LinkEdge[];
  geographic: LinkEdge[];
  corridor: LinkEdge[];
  topical: LinkEdge[];
  content: LinkEdge[];
  maps: LinkEdge[];
}

// =============================================================================
// Anchor Text Interfaces
// =============================================================================

export interface AnchorVariation {
  exact: string[];
  phrase: string[];
  partial: string[];
  branded: string[];
}

// =============================================================================
// Configuration
// =============================================================================

export const CITY_LINK_CONFIG: PageLinkConfig = {
  toState: { count: 1, minScore: 50 },
  toSameStateCities: { count: 6, minScore: 40 },
  toCorridorCities: { count: 3, minScore: 60 },
  toAccidentTypes: { count: 5, minScore: 30 },
  toBlogs: { count: 3, minScore: 30 },
};

export const STATE_LINK_CONFIG: PageLinkConfig = {
  toCities: { count: 20, minScore: 30 },
  toNeighborStates: { count: 4, minScore: 40 },
  toAccidentTypes: { count: 10, minScore: 20 },
  toBlogs: { count: 5, minScore: 20 },
};

export const ACCIDENT_LINK_CONFIG: PageLinkConfig = {
  toCities: { count: 10, minScore: 30 },
  toRelatedAccidents: { count: 3, minScore: 50 },
  toBlogs: { count: 3, minScore: 30 },
};

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Get the link configuration for a page type
 */
export function getLinkConfig(pageType: PageType): PageLinkConfig {
  switch (pageType) {
    case 'city':
      return CITY_LINK_CONFIG;
    case 'state':
      return STATE_LINK_CONFIG;
    case 'accident':
      return ACCIDENT_LINK_CONFIG;
    default:
      return {};
  }
}

/**
 * Check if two pages share a highway
 */
export function shareHighway(from: PageNode, to: PageNode): boolean {
  if (!from.highways || !to.highways) return false;
  return from.highways.some(h => to.highways?.includes(h));
}

/**
 * Check if two pages are in the same state
 */
export function sameState(from: PageNode, to: PageNode): boolean {
  return from.state === to.state;
}

/**
 * Check if two pages share an accident type focus
 */
export function shareAccidentType(from: PageNode, to: PageNode): boolean {
  if (!from.accidentTypes || !to.accidentTypes) return false;
  return from.accidentTypes.some(a => to.accidentTypes?.includes(a));
}

/**
 * Calculate distance between two coordinates in miles
 */
export function calculateDistance(
  from: Coordinates | undefined,
  to: Coordinates | undefined
): number {
  if (!from || !to) return Infinity;

  const R = 3959; // Earth's radius in miles
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Calculate link score between two pages
 */
export function calculateLinkScore(from: PageNode, to: PageNode): number {
  let score = 0;

  // Relevance (0-40)
  if (shareHighway(from, to)) score += 25;
  if (sameState(from, to)) score += 10;
  if (shareAccidentType(from, to)) score += 15;

  // Geographic (0-20)
  const distance = calculateDistance(from.coordinates, to.coordinates);
  if (distance < 25) score += 20;
  else if (distance < 50) score += 15;
  else if (distance < 100) score += 10;
  else if (distance < 200) score += 5;

  // SEO Value (0-20)
  if (to.population && to.population > 500000) score += 10;
  else if (to.population && to.population > 100000) score += 7;
  else if (to.population && to.population > 50000) score += 5;

  if (to.farsData && to.farsData.fatalities > 50) score += 10;
  else if (to.farsData && to.farsData.fatalities > 20) score += 7;
  else if (to.farsData && to.farsData.fatalities > 10) score += 5;

  // User Intent (0-20)
  if (from.type === 'city' && to.type === 'accident') score += 15;
  if (from.type === 'city' && to.type === 'state') score += 10;
  if (from.type === 'city' && to.type === 'city' && shareHighway(from, to)) score += 20;

  return Math.min(100, score);
}

/**
 * Generate anchor text for a link
 */
export function generateAnchor(
  from: PageNode,
  to: PageNode,
  linkType: LinkType,
  highway?: string
): string {
  const toName = to.slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  switch (linkType) {
    case 'hierarchical':
      return `${toName} truck accident lawyers`;

    case 'geographic':
      return `${toName} truck accident lawyer`;

    case 'corridor':
      return highway
        ? `truck accidents on ${highway} near ${toName}`
        : `${toName} truck accident lawyer`;

    case 'topical':
      return `${toName} accidents`;

    case 'content':
      return toName.toLowerCase();

    default:
      return toName;
  }
}

/**
 * Select links for a page based on configuration
 */
export function selectLinksForPage(
  pageId: string,
  graph: LinkGraph
): SelectedLinks {
  const node = graph.nodes[pageId];
  if (!node) {
    return {
      hierarchical: [],
      geographic: [],
      corridor: [],
      topical: [],
      content: [],
      maps: [],
    };
  }

  const config = getLinkConfig(node.type);
  const outboundEdges = graph.edges
    .filter(e => e.from === pageId)
    .sort((a, b) => b.score - a.score);

  const selectedLinks: SelectedLinks = {
    hierarchical: [],
    geographic: [],
    corridor: [],
    topical: [],
    content: [],
    maps: [],
  };

  // Select hierarchical links (state page)
  if (config.toState) {
    selectedLinks.hierarchical = outboundEdges
      .filter(e => e.type === 'hierarchical' && e.score >= config.toState!.minScore)
      .slice(0, config.toState.count);
  }

  // Select geographic links (same state cities)
  if (config.toSameStateCities) {
    selectedLinks.geographic = outboundEdges
      .filter(e => e.type === 'geographic' && e.score >= config.toSameStateCities!.minScore)
      .slice(0, config.toSameStateCities.count);
  }

  // Select corridor links (same highway cities)
  if (config.toCorridorCities) {
    selectedLinks.corridor = outboundEdges
      .filter(e => e.type === 'corridor' && e.score >= config.toCorridorCities!.minScore)
      .slice(0, config.toCorridorCities.count);
  }

  // Select topical links (accident types)
  if (config.toAccidentTypes) {
    selectedLinks.topical = outboundEdges
      .filter(e => e.type === 'topical' && e.score >= config.toAccidentTypes!.minScore)
      .slice(0, config.toAccidentTypes.count);
  }

  // Select content links (blogs)
  if (config.toBlogs) {
    selectedLinks.content = outboundEdges
      .filter(e => e.type === 'content' && e.score >= config.toBlogs!.minScore)
      .slice(0, config.toBlogs.count);
  }

  return selectedLinks;
}

// =============================================================================
// Exports for use in build scripts
// =============================================================================

export type {
  PageNode as InterlinkPageNode,
  LinkEdge as InterlinkEdge,
  LinkGraph as InterlinkGraph,
};
