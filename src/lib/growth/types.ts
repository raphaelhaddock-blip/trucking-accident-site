/**
 * Growth OS — core types (PR12 foundation, recommendation-only).
 *
 * This is the "brain and scoreboard" skeleton. It models the data an adaptive content-growth
 * system needs to learn from market demand and business results LATER. In the foundation:
 *   - The only wired data source is real repo/route metadata (ContentItem.source = 'repo-metadata').
 *   - PerformanceEvent / LeadOutcome are types with NO data source connected — no GSC/GA/CRM,
 *     no fabricated analytics. Signals derived from them report { available: false }.
 *   - Nothing here writes pages or drafts content. Recommendations are proposals requiring
 *     human approval; the lifecycle never auto-advances past 'proposed'.
 */

/** Lifecycle of any growth action. Foundation only ever emits 'proposed'. */
export type WorkflowState = 'proposed' | 'approved' | 'drafted' | 'gated' | 'published' | 'measured';

/** Confidence in the SOURCE of a signal (not in a recommendation's merit). */
export type SourceConfidence = 'none' | 'low' | 'medium' | 'high';

export type RouteKind = 'state' | 'city' | 'accident-type' | 'blog';

export interface SiteConfig {
  siteId: string;
  niche: string;            // e.g. 'trucking-accident'
  domain: string;
  routeKinds: RouteKind[];
  /** Gates that MUST pass before any item may reach 'published'. */
  qualityGates: string[];
  /** Foundation: always true — nothing publishes without explicit human approval. */
  approvalRequired: boolean;
}

/** A real, existing piece of content, described from repo metadata only. */
export interface ContentItem {
  id: string;               // stable id, e.g. 'city:texas/houston'
  kind: RouteKind;
  route: string;            // '/states/texas/houston'
  filePath: string;
  title?: string;
  wordCount: number;
  faqCount: number;
  source: 'repo-metadata';  // the ONLY provenance wired in the foundation
}

/** Real outcome signal — DELIBERATELY no data source wired yet. */
export interface PerformanceEvent {
  contentId: string;
  metric: 'impressions' | 'clicks' | 'position' | 'pageviews';
  value: number;
  capturedAt: string;       // ISO
  source: 'gsc' | 'ga' | 'manual';
}

/** Real business outcome — DELIBERATELY no data source wired yet. */
export interface LeadOutcome {
  contentId: string;
  leads: number;
  qualified: number;
  capturedAt: string;       // ISO
  source: 'crm' | 'form' | 'manual';
}

/** A signal that may not yet be measurable. `available:false` until a real source is connected. */
export interface Signal {
  available: boolean;
  value?: number;
  confidence: SourceConfidence;
  note: string;
}

export interface RiskAssessment {
  level: 'low' | 'medium' | 'high';
  flags: string[];          // e.g. ['legal-tone-gate', 'thin-content', 'near-duplicate']
}

export type OpportunityKind = 'improve' | 'new' | 'consolidate' | 'fix';
export type DuplicateStatus = 'unknown' | 'unique' | 'near-duplicate';

export interface Opportunity {
  id: string;
  contentId?: string;       // existing item, or undefined for net-new
  kind: OpportunityKind;
  rationale: string;
  demand: Signal;           // market/search demand
  conversionProxy: Signal;  // lead/conversion potential
  evidence: string[];       // concrete structural facts (real)
  duplicateStatus: DuplicateStatus;
  risk: RiskAssessment;
}

export interface Recommendation {
  id: string;
  opportunityId: string;
  action: string;           // human-readable proposed action — NOT generated content
  evidence: string[];
  demand: Signal;
  conversionProxy: Signal;
  risk: RiskAssessment;
  duplicateStatus: DuplicateStatus;
  sourceConfidence: SourceConfidence;
  requiredApproval: WorkflowState; // 'approved' — nothing auto-acts
  state: WorkflowState;            // foundation: 'proposed'
}

export interface Experiment {
  id: string;
  recommendationId: string;
  hypothesis: string;
  metric: PerformanceEvent['metric'];
  state: WorkflowState;
  startedAt?: string;
  result?: 'pending' | 'win' | 'loss' | 'inconclusive';
}

export interface GateResult {
  gate: string;             // 'audit:legaltone', 'audit:quality', …
  passed: boolean;
  details: string;
  ranAt: string;            // ISO
}

/** Niche-agnostic data source. A trucking/construction/etc. site implements this. */
export interface SiteAdapter {
  config(): SiteConfig;
  listContent(): ContentItem[];      // real repo metadata
  performance(): PerformanceEvent[]; // [] until GSC/GA wired
  leads(): LeadOutcome[];            // [] until CRM wired
  /** Optional structural duplicate map keyed by ContentItem.id, from a real prior audit. */
  duplicateMap?(): Record<string, DuplicateStatus>;
}

/** A signal with no source connected yet — the honest default. */
export const UNAVAILABLE: Signal = {
  available: false,
  confidence: 'none',
  note: 'No data source connected (GSC/GA/CRM not wired in foundation).',
};
