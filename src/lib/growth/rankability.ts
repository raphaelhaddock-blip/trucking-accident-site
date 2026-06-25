/**
 * Growth OS — rankability gate.
 *
 * The gate that decides whether a move may proceed and, critically, REFUSES to draft net-new content
 * without the required evidence. It is the enforcement point for "no content without
 * taxonomy + ontology + rankability evidence."
 *
 * Honesty rule: demand/conversion evidence is UNAVAILABLE until GSC/GA/CRM are wired, so in the
 * foundation EVERY net-new draft is refused (missing demand evidence) — by design, not by accident.
 */
import type { Signal } from './types';
import type { OntologyNeighbors, PageClassification } from './taxonomy';

/** The evidence classes a move can require. */
export type EvidenceKind =
  | 'taxonomy-classification'
  | 'ontology-placement'   // has a parent/hub + ≥1 sibling — i.e. it fits the site graph
  | 'demand-signal'        // real search demand (GSC/keyword) — UNAVAILABLE in foundation
  | 'structural-quality'   // meets word/FAQ thresholds (for improve moves)
  | 'non-duplicate';       // not flagged near-duplicate

export interface RankabilityInput {
  contentId: string;
  moveKind: 'new' | 'improve' | 'consolidate' | 'fix';
  classification?: PageClassification;
  neighbors?: OntologyNeighbors;
  demand: Signal;
  conversionProxy: Signal;
  duplicateStatus: 'unknown' | 'unique' | 'near-duplicate';
  meetsStructuralThresholds: boolean;
}

export interface RankabilityVerdict {
  contentId: string;
  moveKind: RankabilityInput['moveKind'];
  rankable: boolean;
  /** null until a real demand source exists — never a fabricated number. */
  score: number | null;
  requiredEvidence: EvidenceKind[];
  presentEvidence: EvidenceKind[];
  missingEvidence: EvidenceKind[];
  /** TRUE means: do not draft/generate content for this move. */
  refusesDraft: boolean;
  reason: string;
}

/** Which evidence each move kind requires before it may act. */
function requirementsFor(kind: RankabilityInput['moveKind']): EvidenceKind[] {
  switch (kind) {
    case 'new':
      // Strictest: a net-new page must fit the taxonomy + ontology AND have real demand evidence.
      return ['taxonomy-classification', 'ontology-placement', 'demand-signal', 'non-duplicate'];
    case 'improve':
      return ['taxonomy-classification', 'ontology-placement', 'structural-quality'];
    case 'consolidate':
      return ['taxonomy-classification', 'non-duplicate'];
    case 'fix':
      return ['taxonomy-classification'];
  }
}

export function assessRankability(input: RankabilityInput): RankabilityVerdict {
  const required = requirementsFor(input.moveKind);
  const present: EvidenceKind[] = [];

  if (input.classification) present.push('taxonomy-classification');
  if (input.neighbors && (input.neighbors.parent || input.neighbors.siblings.length > 0)) present.push('ontology-placement');
  if (input.demand.available || input.conversionProxy.available) present.push('demand-signal');
  if (input.meetsStructuralThresholds) present.push('structural-quality');
  if (input.duplicateStatus === 'unique') present.push('non-duplicate');

  const missing = required.filter((r) => !present.includes(r));
  // A "non-duplicate" requirement is satisfiable two ways for consolidate (it's about KNOWING the dup
  // status), but for safety we treat unknown duplicate status as missing evidence.
  const rankable = missing.length === 0;

  // Refuse to DRAFT content whenever required evidence is missing. New content is the guarded surface.
  const refusesDraft = input.moveKind === 'new' ? !rankable : missing.includes('taxonomy-classification') || missing.includes('ontology-placement');

  // Score stays null until a real demand source is connected — no fabricated rankability number.
  const score = present.includes('demand-signal') ? null : null;

  const reason = rankable
    ? `All required evidence present for a '${input.moveKind}' move.`
    : `Blocked: missing ${missing.join(', ')}. ${missing.includes('demand-signal') ? 'No demand source wired (GSC/GA) — net-new drafting is refused until real demand evidence exists.' : ''}`.trim();

  return { contentId: input.contentId, moveKind: input.moveKind, rankable, score, requiredEvidence: required, presentEvidence: present, missingEvidence: missing, refusesDraft, reason };
}
