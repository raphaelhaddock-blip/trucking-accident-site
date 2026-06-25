/**
 * Growth OS — internal-link rules derived from the ontology.
 *
 * Turns ontology neighbors into a per-page LINK PLAN (required + suggested internal links). This is a
 * recommendation only: it proposes links a human/template should ensure exist. It writes nothing and
 * generates no anchor copy — anchors are described structurally, not authored.
 */
import type { ContentItem } from './types';
import type { ContentIndex, OntologyNeighbors, PageClassification } from './taxonomy';

export interface LinkTarget {
  to: string;        // ContentItem.id
  route: string;     // resolved route for the link
  kind: 'up' | 'sibling' | 'related-topic' | 'hub';
  rationale: string;
}

export interface LinkPlan {
  contentId: string;
  required: LinkTarget[];   // links that SHOULD exist for graph integrity (e.g. city → state)
  suggested: LinkTarget[];  // additional relevance links (siblings, related topics)
  /** Gaps require human/template action; the plan never edits pages. */
  note: string;
}

function route(index: ContentIndex, id: string): string {
  return index.byId.get(id)?.route ?? id;
}

/** Build the link plan for one page from its ontology neighbors. Pure. */
export function deriveLinkPlan(
  item: ContentItem,
  _classification: PageClassification,
  neighbors: OntologyNeighbors,
  index: ContentIndex,
): LinkPlan {
  const required: LinkTarget[] = [];
  const suggested: LinkTarget[] = [];

  if (neighbors.parent) {
    required.push({ to: neighbors.parent, route: route(index, neighbors.parent), kind: 'up', rationale: 'Child must link up to its hub for crawl + topical authority.' });
  }
  for (const s of neighbors.siblings) {
    suggested.push({ to: s, route: route(index, s), kind: 'sibling', rationale: 'Same-cluster relevance link.' });
  }
  for (const t of neighbors.relatedTopics) {
    suggested.push({ to: t, route: route(index, t), kind: 'related-topic', rationale: 'Cross intent×topic relevance link.' });
  }

  return {
    contentId: item.id,
    required,
    suggested,
    note: required.length === 0 && item.kind === 'city'
      ? 'No parent state resolved — ontology gap to fix before relying on this cluster.'
      : 'Plan only — verify these links exist in the page template; nothing was edited.',
  };
}
