# Content Duplicate Remediation Plan

## Executive Summary

**Problem:** 2,294 city pages flagged as **100% duplicates** by content audit. Google will penalize the site for thin/duplicate content.

**Root Cause:** City content files use a template with only city/state name swaps. Major content sections (`whyDangerous`, `liabilityExplanation`, `evidencePreservation`, `fmcsaRegulations`) are nearly identical across all 1,615 city files.

**Solution:** Deploy the existing `city-enhancer.ts` agent system properly, prioritizing high-traffic cities first.

---

## 1. Scope of Problem

### Current State

| Metric | Count |
|--------|-------|
| Total city pages flagged | 2,294 |
| City content files created | 1,615 |
| Cities using pure defaults | ~679 |
| Similarity score | **100%** |

### Audit Report Finding
```
duplicate-checker | 2294 | 2294 critical issues | 0 passed
```

Every sampled pair shows 100% similarity, meaning Google sees them as duplicate content.

---

## 2. What's Templated vs. Unique

### Comparison: Houston, TX (2.3M pop) vs. Wadsworth, IL (unknown pop)

#### TEMPLATED CONTENT (Nearly Identical - Just Name Swaps)

| Field | Template Pattern | Uniqueness |
|-------|-----------------|------------|
| `whyDangerous` | 3 paragraphs, only swaps city/state/county | ~5% unique |
| `liabilityExplanation` | 4 paragraphs, only swaps city/state | ~2% unique |
| `evidencePreservation` | 4 paragraphs, only swaps city/county | ~2% unique |
| `fmcsaRegulations` | 4 paragraphs, only swaps city name at end | ~1% unique |
| `dangerousRoads[].description` | Same sentence template for all roads | ~10% unique |
| `commonAccidents[].localFactor` | Same descriptions, only swaps road/city | ~5% unique |
| `truckingIndustry` | Same structure, swaps city/county/industries | ~10% unique |
| `faqs[]` | Same 5-6 questions, only swaps city/state/road | ~5% unique |

#### ACTUALLY UNIQUE PER CITY

| Field | Source |
|-------|--------|
| `accidentStats.truckFatalities` | FARS data |
| `accidentStats.fatalCrashes` | FARS data |
| `population` | Census/lookup |
| `dangerousRoads[].name` | FARS/research |
| `images.hero` | Some cities have unique images |
| `metaTitle`, `metaDescription`, `h1` | Contains unique stats |

### The Problem Illustrated

**Houston's `liabilityExplanation`:**
> "Determining liability in a **Houston** truck accident case requires thorough investigation..."

**Wadsworth's `liabilityExplanation`:**
> "Determining liability in a **Wadsworth** truck accident case requires thorough investigation..."

The rest of the 4-paragraph section is **word-for-word identical**.

---

## 3. What Unique Local Data Is Needed

Per the `scripts/agents/types.ts` design, each city should have:

### City-Specific Research Data

| Data Type | Source | Priority |
|-----------|--------|----------|
| City history & trucking relevance | Web research | High |
| Major local employers | Web research | High |
| Distribution centers/logistics hubs | Web research | High |
| Recent truck accidents (news) | News APIs/search | Critical |
| Local court information | Legal databases | Medium |
| Notable verdicts/settlements | Legal research | Medium |
| Actual road hazard descriptions | DOT/news research | High |
| Weather-specific trucking hazards | Weather data | Medium |
| Industry-specific trucking context | Economic data | Medium |

### Target Content Structure (from `EnhancedCityContent` type)

```typescript
{
  // City Context - MUST BE UNIQUE
  cityHistory: string;           // 150-200 words on city's trucking history
  majorIndustries: string[];     // Local industries generating truck traffic
  economicContext: string;       // 100 words on local economy
  truckingRelevance: string;     // Why trucks matter to THIS city

  // Recent Accidents - MUST BE UNIQUE
  recentAccidents: Array<{
    date: string;
    headline: string;
    summary: string;             // 50-100 words per accident
    source: string;
    sourceUrl: string;
  }>;

  // Roads - MUST BE UNIQUE DESCRIPTIONS
  dangerousRoads: Array<{
    name: string;
    description: string;         // 100+ words SPECIFIC to this road
    annualTruckTraffic: string;  // Actual traffic data
    knownHazards: string[];      // Specific hazards
    recentIncidents: string;     // Recent crash reports
    milesInCity: number;
  }>;

  // Legal - MUST BE UNIQUE
  notableVerdicts: Array<{
    year: number;
    amount: string;
    caseType: string;
    summary: string;
  }>;
  localLegalContext: string;

  // Weather - MUST BE LOCAL-SPECIFIC
  weatherHazards: {
    primaryHazard: string;
    description: string;         // Specific to this location
    dangerousMonths: string[];
  };

  // FAQs - MUST BE UNIQUE
  faqs: Array<{
    question: string;            // Reference local landmarks/roads
    answer: string;              // Include local statistics/context
  }>;

  // Quality Metrics
  wordCount: number;             // Target: 2000+
  uniquenessScore: number;       // Target: 80%+
  sources: string[];             // Verifiable sources
}
```

---

## 4. Existing Scripts That Can Help

### Primary Tool: `scripts/agents/city-enhancer.ts`

**Status:** Built but not fully deployed. Current content appears to use fallback templates.

**Capabilities:**
- 7 specialized research agents (History, Industry, News, Statistics, Weather, Roads, Legal)
- Web research for local context
- News aggregation for recent accidents
- Regional weather data integration
- Court/legal information lookup

**Why It's Not Working:**
The agent system exists, but either:
1. It was never run on most cities
2. The agents are falling back to templates instead of researching
3. API rate limits prevented full research

### Supporting Scripts

| Script | Purpose | Status |
|--------|---------|--------|
| `scripts/content-fix/regenerate-all-cities.ts` | Regenerate with regional patterns | Produces templated content (insufficient) |
| `scripts/data/regional-accident-patterns.json` | Regional variations | Only varies percentages |
| `scripts/data/faq-variations.json` | FAQ templates | Still templated, not unique |
| `scripts/data/city-priority-queue.json` | Priority ordering | Can inform batch order |
| `scripts/batch-orchestrator.ts` | Batch processing | Ready for mass updates |

### What's Missing

1. **Actual web research** per city (news articles, local sources)
2. **News API integration** for recent accidents
3. **DOT data integration** for road-specific statistics
4. **Court records integration** for notable verdicts
5. **Quality gate** that rejects content below uniqueness threshold

---

## 5. Priority Order

### Tier 1: Critical (Top 50 cities) - Do First

High-traffic cities where duplicate content penalty hurts most:

1. **Texas majors:** Houston, Dallas, Fort Worth, San Antonio, Austin, El Paso
2. **California majors:** Los Angeles, San Diego, San Francisco, San Jose, Fresno
3. **Florida majors:** Miami, Jacksonville, Tampa, Orlando
4. **Other large metros:** Phoenix, Chicago, Philadelphia, Atlanta, Detroit

**Criteria:**
- Population > 500,000
- Truck fatalities > 10
- State capitals

### Tier 2: High Priority (Next 150 cities)

- Population 100,000-500,000
- Located on major trucking corridors (I-10, I-40, I-95, I-80)
- High truck fatality counts relative to population

### Tier 3: Medium Priority (Next 500 cities)

- Population 25,000-100,000
- At least 2+ truck fatalities in data

### Tier 4: Standard (Remaining ~1,600 cities)

- All remaining cities
- Can use enhanced regional templates with more variation
- Still need unique FAQs and recent accident references

### Alternative: No-Index Low-Value Pages

For cities with:
- Population < 10,000
- Only 1 truck fatality
- No significant trucking corridor presence

**Option:** Add `<meta name="robots" content="noindex">` and redirect traffic to state page.

---

## 6. Effort Estimate

### Option A: Full Enhancement (Recommended)

**Scope:** Generate truly unique content for all 2,294 cities using AI research agents.

| Phase | Cities | Time per City | Total Time | Cost Estimate |
|-------|--------|---------------|------------|---------------|
| Tier 1 | 50 | 5 min | 4 hours | ~$50 (Claude API) |
| Tier 2 | 150 | 3 min | 7.5 hours | ~$100 |
| Tier 3 | 500 | 2 min | 16 hours | ~$200 |
| Tier 4 | 1,594 | 1 min | 26 hours | ~$300 |
| **Total** | 2,294 | - | **~54 hours** | **~$650** |

**Notes:**
- Times assume automated processing with API calls
- Requires human QA on Tier 1 (top 50)
- Can run in parallel batches

### Option B: Tiered Approach

**Scope:** Full enhancement for top 200, enhanced templates for rest.

| Phase | Approach | Cities | Uniqueness Target |
|-------|----------|--------|-------------------|
| Tier 1-2 | Full AI research | 200 | 85%+ unique |
| Tier 3-4 | Enhanced templates + unique FAQs | 2,094 | 50%+ unique |

**Time:** ~20 hours + template revision
**Cost:** ~$200

### Option C: Strategic Consolidation

**Scope:** Reduce page count, focus on quality over quantity.

| Action | Cities Affected |
|--------|-----------------|
| Full enhancement | Top 200 |
| Merge small cities into state pages | ~1,500 (< 50k pop) |
| Keep with enhanced templates | ~600 medium cities |

**Benefit:** Fewer pages = easier to maintain quality
**Risk:** Lose long-tail keyword targeting

---

## 7. Implementation Plan

### Phase 1: Fix the Agent System (Day 1)

1. Audit `city-enhancer.ts` to understand why it's producing templates
2. Add quality gate that rejects content with < 60% uniqueness
3. Test on 5 diverse cities (large metro, medium city, small town)
4. Verify output passes duplicate checker

### Phase 2: Process Tier 1 (Days 2-3)

1. Generate unique content for top 50 cities
2. Human QA review each file
3. Deploy and re-run audit to verify improvement
4. Monitor Search Console for crawl behavior

### Phase 3: Process Tier 2-3 (Days 4-7)

1. Batch process 650 cities through enhanced agent
2. Automated uniqueness scoring
3. Flag any below 70% for human review
4. Deploy in batches of 100

### Phase 4: Process Tier 4 (Days 8-14)

1. Batch process remaining 1,594 cities
2. Use more aggressive template variations
3. Ensure unique FAQs and recent accident references
4. Accept 50%+ uniqueness threshold

### Phase 5: Ongoing Maintenance

1. Weekly re-run of duplicate checker
2. Monthly refresh of news/recent accidents
3. Quarterly review of low-performing pages
4. Consider consolidation for pages with no traffic after 6 months

---

## 8. Success Metrics

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Pages flagged as duplicate | 2,294 | 0 | `duplicate-checker.ts` |
| Average uniqueness score | ~5% | 70%+ | Content fingerprinting |
| Average word count | ~2,000 | 2,500+ | Automated count |
| Pages with unique FAQs | ~0% | 100% | Content audit |
| Pages with recent accidents | ~0% | 50%+ | Content audit |

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| API rate limits slow processing | Medium | Medium | Implement backoff, run overnight |
| Generated content has factual errors | Medium | High | Human QA on Tier 1, spot-check others |
| Google penalty already applied | Low | High | Submit reconsideration request after fix |
| News API doesn't have local accidents | High | Medium | Fall back to regional news + enhanced templates |
| Cost exceeds estimate | Low | Low | Start with Tier 1, evaluate before continuing |

---

## 10. Next Steps

1. **Immediate:** Review and approve this remediation plan
2. **Day 1:** Audit `city-enhancer.ts` and fix template fallback issue
3. **Day 2:** Begin Tier 1 processing with top 50 cities
4. **Day 3:** Deploy Tier 1, verify duplicate checker passes
5. **Days 4-14:** Continue with Tiers 2-4

---

## Appendix: File Locations

```
scripts/
  agents/
    city-enhancer.ts          # Main enhancement agent
    batch-orchestrator.ts     # Batch processing
    types.ts                  # Type definitions
  content-audit/
    duplicate-checker.ts      # Audit tool
  content-fix/
    regenerate-all-cities.ts  # Regeneration script (templates)
  data/
    city-populations.json     # Population lookup
    city-priority-queue.json  # Priority ordering
    regional-accident-patterns.json
    faq-variations.json
    correct-legal-data.json
  city-accident-data.json     # FARS accident data

src/lib/cities-content/
  index.ts                    # Content loader
  types.ts                    # CityContent type
  [state]/[city].ts          # 1,615 city content files

scripts/reports/
  audit-report.md            # Latest audit results
  audit-report.json          # Machine-readable audit
```

---

*Document created: 2026-01-11*
*Author: Claude Code*
