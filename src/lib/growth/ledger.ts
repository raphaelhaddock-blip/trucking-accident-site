/**
 * Growth OS — intelligence / learning ledger.
 *
 * An append-only record of growth MOVES and (eventually) their OUTCOMES, so the system can learn
 * what works. In the foundation the ledger stores PLANS only: every outcome is { state:'planned' }
 * with UNAVAILABLE metrics, because no analytics source is wired. It NEVER fabricates a metric.
 *
 * This module defines the schema + pure constructors/serializers. Writing happens in the daily
 * report script (to a report artifact under scripts/reports/, never to site content).
 */
import type { Signal } from './types';
import { UNAVAILABLE } from './types';

export type MoveType = 'improve' | 'consolidate' | 'fix' | 'interlink' | 'new-refused';

export interface LedgerOutcome {
  state: 'planned' | 'observed';
  /** Real measurements only. In the foundation these stay UNAVAILABLE. */
  metrics: Signal[];
  observedAt?: string; // ISO, set only when state==='observed' from a real source
}

export interface LedgerEntry {
  id: string;            // stable: `${ts}:${moveType}:${contentId ?? 'site'}`
  ts: string;            // ISO timestamp (caller-supplied — deterministic in tests)
  moveType: MoveType;
  contentId?: string;
  decision: string;      // what was proposed/decided (human-readable)
  evidenceRefs: string[];// pointers to the evidence behind the move
  approvalState: 'proposed' | 'approved'; // foundation emits 'proposed'
  outcome: LedgerOutcome;
  schemaVersion: 1;
}

/** Construct a PLANNED ledger entry. Outcome metrics are UNAVAILABLE — never invented. */
export function planEntry(params: {
  ts: string;
  moveType: MoveType;
  contentId?: string;
  decision: string;
  evidenceRefs: string[];
}): LedgerEntry {
  return {
    id: `${params.ts}:${params.moveType}:${params.contentId ?? 'site'}`,
    ts: params.ts,
    moveType: params.moveType,
    contentId: params.contentId,
    decision: params.decision,
    evidenceRefs: params.evidenceRefs,
    approvalState: 'proposed',
    outcome: { state: 'planned', metrics: [UNAVAILABLE] },
    schemaVersion: 1,
  };
}

/** Serialize entries to JSONL (one entry per line) for append-only storage. */
export function toJsonl(entries: LedgerEntry[]): string {
  return entries.map((e) => JSON.stringify(e)).join('\n') + (entries.length ? '\n' : '');
}
