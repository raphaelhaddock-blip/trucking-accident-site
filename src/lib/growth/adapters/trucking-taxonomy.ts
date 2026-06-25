/**
 * Growth OS — trucking taxonomy + ontology adapter.
 *
 * Classifies the trucking site's ContentItems and resolves their ontology neighbors, deterministically
 * and from ids/routes only (no network, no analytics). Mirrors the live route shape:
 *   state:  state:<st>            -> /states/<st>
 *   city:   city:<st>/<city>      -> /states/<st>/<city>
 *   accident-type: accident:<slug>-> /accidents/<slug>
 *   blog:   blog:<slug>           -> /blog/<slug>
 */
import type { ContentItem } from '../types';
import type {
  ContentIndex, OntologyNeighbors, OntologyRule, PageClassification, SearchIntent, TaxonomyAdapter,
} from '../taxonomy';

const SIBLING_CAP = 6;       // cities link to ≤6 in-state siblings
const RELATED_TOPIC_CAP = 4; // geo pages relate to ≤4 accident types (the priority set)

/** Priority accident topics a geo page should relate to first (stable, editorial order). */
const PRIORITY_TOPICS = [
  'accident:jackknife-accidents',
  'accident:rollover-accidents',
  'accident:underride-accidents',
  'accident:rear-end-collisions',
];

function geoFromId(item: ContentItem): PageClassification['geo'] {
  if (item.kind === 'city') {
    const [state, city] = item.id.replace('city:', '').split('/');
    return { level: 'city', state, city };
  }
  if (item.kind === 'state') return { level: 'state', state: item.id.replace('state:', '') };
  return { level: 'national' }; // accident-type + blog are national topics
}

function intentFor(kind: ContentItem['kind']): SearchIntent {
  // Local-service pages carry transactional intent; topic explainers are informational.
  if (kind === 'city' || kind === 'state') return 'transactional';
  if (kind === 'blog') return 'informational';
  return 'transactional'; // accident-type pages target "X accident lawyer" — buy-intent
}

function funnelFor(kind: ContentItem['kind']): PageClassification['funnelStage'] {
  if (kind === 'blog') return 'awareness';
  if (kind === 'accident-type') return 'consideration';
  return 'decision'; // city/state = ready-to-contact
}

export function truckingTaxonomy(): TaxonomyAdapter {
  const classify = (item: ContentItem): PageClassification => {
    const geo = geoFromId(item);
    const topic = item.kind === 'accident-type' ? item.id.replace('accident:', '')
      : item.kind === 'blog' ? item.id.replace('blog:', '')
      : 'general-truck-accident';
    const intent = intentFor(item.kind);
    const funnelStage = funnelFor(item.kind);
    const path = item.kind === 'city' ? ['local', geo.state!, geo.city!, intent]
      : item.kind === 'state' ? ['local', geo.state!, intent]
      : item.kind === 'accident-type' ? ['topic', topic, intent]
      : ['blog', topic, intent];
    return { contentId: item.id, routeKind: item.kind, geo, topic, intent, funnelStage, taxonomyPath: path };
  };

  const ontologyRules = (): OntologyRule[] => [
    { fromKind: 'city', toKind: 'state', kind: 'child_of', cap: 1, rationale: 'A city belongs to its state hub.' },
    { fromKind: 'city', toKind: 'city', kind: 'sibling', cap: SIBLING_CAP, rationale: 'Same-state cities reinforce local relevance.' },
    { fromKind: 'city', toKind: 'accident-type', kind: 'related_topic', cap: RELATED_TOPIC_CAP, rationale: 'Local intent + accident mechanism intersect.' },
    { fromKind: 'state', toKind: 'city', kind: 'parent_of', cap: 50, rationale: 'A state hub spokes out to its cities.' },
    { fromKind: 'state', toKind: 'accident-type', kind: 'related_topic', cap: RELATED_TOPIC_CAP, rationale: 'State relevance + accident topics.' },
    { fromKind: 'accident-type', toKind: 'accident-type', kind: 'sibling', cap: SIBLING_CAP, rationale: 'Accident mechanisms cross-link as a topic cluster.' },
  ];

  const neighbors = (item: ContentItem, index: ContentIndex): OntologyNeighbors => {
    const c = classify(item);
    if (item.kind === 'city' && c.geo.state) {
      const parent = index.stateBySlug.get(c.geo.state);
      const inState = (index.citiesByState.get(c.geo.state) ?? []).filter((id) => id !== item.id);
      return { parent, siblings: inState.slice(0, SIBLING_CAP), relatedTopics: PRIORITY_TOPICS.slice(0, RELATED_TOPIC_CAP).filter((id) => index.byId.has(id)) };
    }
    if (item.kind === 'state' && c.geo.state) {
      const spokes = (index.citiesByState.get(c.geo.state) ?? []).slice(0, SIBLING_CAP);
      return { siblings: spokes, relatedTopics: PRIORITY_TOPICS.filter((id) => index.byId.has(id)).slice(0, RELATED_TOPIC_CAP) };
    }
    if (item.kind === 'accident-type') {
      const others = (index.byKind.get('accident-type') ?? []).map((i) => i.id).filter((id) => id !== item.id).sort();
      return { siblings: others.slice(0, SIBLING_CAP), relatedTopics: [] };
    }
    return { siblings: [], relatedTopics: [] };
  };

  return {
    taxonomyVersion: 'trucking-1.0',
    dimensions: ['geo', 'topic', 'intent', 'funnelStage'],
    classify,
    ontologyRules,
    neighbors,
  };
}
