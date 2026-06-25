/**
 * Growth OS — source / evidence requirements registry.
 *
 * Machine-readable statement of WHICH data sources exist, what they provide, and which move kinds
 * they gate. This is the single place that declares demand/conversion as FUTURE connectors — the
 * rankability gate and daily report read intent from here, so "net-new is refused until demand is
 * wired" is a declared rule, not a buried constant. No source is connected by this file.
 */
import type { EvidenceKind } from './rankability';

export type SourceStatus = 'available' | 'available-when-present' | 'future';

export interface SourceConnector {
  signal: 'structural' | 'duplicate' | 'demand' | 'conversion';
  evidence: EvidenceKind;
  status: SourceStatus;
  provides: string[];
  /** Move kinds blocked until this source is available. */
  gates: Array<'new' | 'improve' | 'consolidate' | 'fix' | 'roi-ranking'>;
  note: string;
}

export const SOURCE_REGISTRY: SourceConnector[] = [
  {
    signal: 'structural', evidence: 'structural-quality', status: 'available',
    provides: ['wordCount', 'faqCount', 'routes', 'taxonomy', 'ontology'],
    gates: ['improve', 'fix'],
    note: 'Real repo metadata. Always on.',
  },
  {
    signal: 'duplicate', evidence: 'non-duplicate', status: 'available-when-present',
    provides: ['duplicateStatus'],
    gates: ['consolidate'],
    note: 'From audit:quality report when present; otherwise duplicate status is unknown.',
  },
  {
    signal: 'demand', evidence: 'demand-signal', status: 'future',
    provides: ['impressions', 'clicks', 'position'],
    gates: ['new'],
    note: 'GSC / keyword data. NOT wired — and premature until the redesign is live + indexed. Net-new drafting stays refused until connected.',
  },
  {
    signal: 'conversion', evidence: 'demand-signal', status: 'future',
    provides: ['leads', 'qualified', 'calls'],
    gates: ['roi-ranking'],
    note: 'CRM / form / call data. NOT wired — requires a live site with attributable leads.',
  },
];

/** True only when a real source backing this evidence is connected today. */
export function isEvidenceAvailable(e: EvidenceKind): boolean {
  if (e === 'taxonomy-classification' || e === 'ontology-placement') return true; // derived, always available
  const src = SOURCE_REGISTRY.find((s) => s.evidence === e);
  return src ? src.status !== 'future' : false;
}
