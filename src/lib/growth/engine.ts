/**
 * Growth OS — recommendation engine (PR12 foundation).
 *
 * Deterministic. No network, no randomness, no fabricated analytics. It reasons ONLY from real
 * structural metadata (word counts, FAQ counts, duplicate status from a prior audit) plus the
 * site's published quality thresholds. Demand and conversion signals are reported as UNAVAILABLE
 * until GSC/GA/CRM are wired — the engine never invents a number it cannot source.
 *
 * Output is proposals for humans. Nothing here writes pages or drafts content.
 */
import type {
  ContentItem, Opportunity, Recommendation, RiskAssessment, SiteAdapter, Signal, DuplicateStatus,
} from './types';
import { UNAVAILABLE } from './types';

// Minimum word counts per route kind, from the site's content rules (CLAUDE.md).
const MIN_WORDS: Record<ContentItem['kind'], number> = {
  'accident-type': 3000,
  state: 2500,
  city: 2000,
  blog: 800,
};
const MIN_FAQS = 5;

function riskFor(item: ContentItem, dup: DuplicateStatus): RiskAssessment {
  const flags: string[] = [];
  if (item.wordCount < MIN_WORDS[item.kind]) flags.push('thin-content');
  if (item.kind !== 'blog' && item.faqCount < MIN_FAQS) flags.push('insufficient-faqs');
  if (dup === 'near-duplicate') flags.push('near-duplicate');
  // Legal-tone is enforced by its own gate; flag it as a required pre-publish check, not a verdict.
  flags.push('legal-tone-gate-required');
  const level = flags.includes('near-duplicate') ? 'high' : flags.length > 1 ? 'medium' : 'low';
  return { level, flags };
}

/** Build opportunities from real structural gaps. Demand/conversion stay UNAVAILABLE. */
export function proposeOpportunities(adapter: SiteAdapter): Opportunity[] {
  const items = adapter.listContent();
  const dupMap = adapter.duplicateMap?.() ?? {};
  const opps: Opportunity[] = [];

  for (const item of items) {
    const dup: DuplicateStatus = dupMap[item.id] ?? 'unknown';
    const evidence: string[] = [
      `wordCount=${item.wordCount} (min ${MIN_WORDS[item.kind]})`,
      `faqCount=${item.faqCount} (min ${MIN_FAQS})`,
      `duplicateStatus=${dup}`,
    ];
    const risk = riskFor(item, dup);

    if (dup === 'near-duplicate') {
      opps.push({
        id: `opp:consolidate:${item.id}`, contentId: item.id, kind: 'consolidate',
        rationale: 'Flagged as near-duplicate by the quality audit; differentiate or consolidate before investing further.',
        demand: UNAVAILABLE, conversionProxy: UNAVAILABLE, evidence, duplicateStatus: dup, risk,
      });
    } else if (risk.flags.includes('thin-content') || risk.flags.includes('insufficient-faqs')) {
      opps.push({
        id: `opp:improve:${item.id}`, contentId: item.id, kind: 'improve',
        rationale: 'Below the site quality threshold for its route kind; structural improvement candidate.',
        demand: UNAVAILABLE, conversionProxy: UNAVAILABLE, evidence, duplicateStatus: dup, risk,
      });
    }
    // No "new page" opportunities in the foundation: net-new pages require demand data that is
    // not yet measurable, and the system's hands stay off content generation.
  }
  return opps;
}

/**
 * Turn opportunities into approval-gated proposals. Source confidence is bounded by the weakest
 * input: with no demand/conversion data, it can never exceed 'low', and the engine says so.
 */
export function recommend(opps: Opportunity[]): Recommendation[] {
  return opps.map((o) => {
    const haveOutcomeData = o.demand.available || o.conversionProxy.available;
    const sourceConfidence: Signal['confidence'] = haveOutcomeData ? 'medium' : 'low';
    const action = o.kind === 'consolidate'
      ? `Review "${o.contentId}" against its near-duplicate; decide differentiate vs consolidate (human).`
      : `Queue "${o.contentId}" for structural improvement to meet quality thresholds (human-authored).`;
    return {
      id: `rec:${o.id}`,
      opportunityId: o.id,
      action,
      evidence: o.evidence,
      demand: o.demand,
      conversionProxy: o.conversionProxy,
      risk: o.risk,
      duplicateStatus: o.duplicateStatus,
      sourceConfidence,
      requiredApproval: 'approved',
      state: 'proposed',
    };
  });
}
