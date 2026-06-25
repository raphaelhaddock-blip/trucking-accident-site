/**
 * Growth OS — taxonomy + ontology data model (niche-agnostic).
 *
 * Taxonomy = how a page is CLASSIFIED (a set of orthogonal dimensions).
 * Ontology = how pages RELATE (typed edges between content items).
 *
 * This is a pure data model + deterministic helpers. It reads nothing from the network, invents no
 * analytics, and writes no content. A site implements `TaxonomyAdapter` (see adapters/) to map its
 * own ContentItems into these shapes; everything downstream (rankability, interlink, daily report)
 * is site-agnostic and consumes only this model.
 */
import type { ContentItem, RouteKind } from './types';

export type GeoLevel = 'national' | 'state' | 'city';
export type SearchIntent = 'informational' | 'transactional' | 'navigational';
export type FunnelStage = 'awareness' | 'consideration' | 'decision';

/** Where a page sits geographically (the primary taxonomy axis for local-service sites). */
export interface GeoScope {
  level: GeoLevel;
  state?: string; // slug, e.g. 'texas'
  city?: string;  // slug, e.g. 'houston'
}

/** The orthogonal dimensions that classify one page. All values are derived, never guessed. */
export interface PageClassification {
  contentId: string;
  routeKind: RouteKind;
  geo: GeoScope;
  topic: string;            // 'jackknife-accidents' | 'general-truck-accident' | blog slug
  intent: SearchIntent;
  funnelStage: FunnelStage;
  /** Human-readable breadcrumb of the classification, e.g. ['local','texas','houston','transactional']. */
  taxonomyPath: string[];
}

/** Typed relationship between two content items. */
export type EdgeKind =
  | 'child_of'      // city -> state, state -> national hub
  | 'parent_of'     // inverse
  | 'sibling'       // cities in the same state; accident types to each other
  | 'related_topic' // geo page <-> accident-type page
  | 'hub_spoke';    // index/hub -> member

export interface OntologyEdge {
  from: string;     // ContentItem.id
  to: string;       // ContentItem.id
  kind: EdgeKind;
  rationale: string;
}

/** Resolved, BOUNDED neighbors for one page (caps prevent 1,600×20 blow-ups). */
export interface OntologyNeighbors {
  parent?: string;            // the page's hub/parent id (e.g. its state)
  siblings: string[];         // capped
  relatedTopics: string[];    // capped
  hub?: string;               // index page id for this kind
}

/** A declarative edge rule, for documentation/inspection of the ontology shape. */
export interface OntologyRule {
  fromKind: RouteKind;
  toKind: RouteKind;
  kind: EdgeKind;
  cap: number;                // max edges of this kind emitted per page
  rationale: string;
}

/** Niche-agnostic classifier + ontology resolver. Each site implements one. */
export interface TaxonomyAdapter {
  taxonomyVersion: string;
  dimensions: string[];                                   // names of the taxonomy axes
  classify(item: ContentItem): PageClassification;
  ontologyRules(): OntologyRule[];
  neighbors(item: ContentItem, index: ContentIndex): OntologyNeighbors;
}

/** Fast lookup structure built once from a flat ContentItem[]. */
export interface ContentIndex {
  byId: Map<string, ContentItem>;
  byKind: Map<RouteKind, ContentItem[]>;
  /** city ids grouped by state slug */
  citiesByState: Map<string, string[]>;
  /** state id by state slug */
  stateBySlug: Map<string, string>;
  classify: (item: ContentItem) => PageClassification;
}

/** Build a deterministic lookup index. Pure; no IO. */
export function buildIndex(items: ContentItem[], adapter: TaxonomyAdapter): ContentIndex {
  const byId = new Map<string, ContentItem>();
  const byKind = new Map<RouteKind, ContentItem[]>();
  const citiesByState = new Map<string, string[]>();
  const stateBySlug = new Map<string, string>();

  for (const it of items) {
    byId.set(it.id, it);
    (byKind.get(it.kind) ?? byKind.set(it.kind, []).get(it.kind)!).push(it);
    const c = adapter.classify(it);
    if (it.kind === 'city' && c.geo.state) {
      (citiesByState.get(c.geo.state) ?? citiesByState.set(c.geo.state, []).get(c.geo.state)!).push(it.id);
    }
    if (it.kind === 'state' && c.geo.state) stateBySlug.set(c.geo.state, it.id);
  }
  // Deterministic ordering (alpha by id) so reports are stable across runs.
  for (const list of citiesByState.values()) list.sort();
  return { byId, byKind, citiesByState, stateBySlug, classify: (it) => adapter.classify(it) };
}
