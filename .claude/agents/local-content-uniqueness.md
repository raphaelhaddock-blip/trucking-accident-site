# Local Content Uniqueness Agent

## Purpose
Measures the percentage of genuinely unique content on location pages (states and cities) compared to templated/boilerplate content. Critical for avoiding Google's duplicate content and doorway page penalties.

## Trigger Conditions
- Any state or city page created/updated
- Batch content generation
- Before launch verification
- Weekly uniqueness audit
- After template changes

## Why This Matters
The audit revealed:
- 2,294 duplicate content issues
- Many city pages 100% similar to each other
- Templated content with city name swaps

Google will classify these as:
1. Duplicate content (won't rank both)
2. Doorway pages (penalty risk)
3. Thin content (quality filter)

Target: **60%+ unique content per page**

## Validation Rules

### Content Classification

#### Boilerplate Content (Doesn't Count as Unique)
| Element | Why Boilerplate |
|---------|-----------------|
| FMCSA regulation text | Same on all pages |
| General liability explanations | Not location-specific |
| Evidence preservation guide | Same everywhere |
| Statute of limitations (by state) | State-level, not city |
| Insurance minimums | Federal, same everywhere |
| Generic CTA text | Same on all pages |
| Navigation/footer | Same on all pages |

#### Semi-Unique Content (Counts 50%)
| Element | Why Semi-Unique |
|---------|-----------------|
| State-specific negligence rules | Unique to state, not city |
| State court information | State-level |
| State trucking corridors | State-level |
| State weather patterns | Regional |
| State-level statistics | State, not city |

#### Unique Content (Counts 100%)
| Element | Why Unique |
|---------|------------|
| City-specific fatality data | FARS data by city |
| Local highway references (verified) | City-specific routes |
| Local trucking companies | Research required |
| Local court addresses | City/county specific |
| Local hospital names | City-specific |
| Local accident news | City-specific events |
| Local verdict examples | City-specific cases |
| Unique local FAQs | City-specific questions |
| Local industry mix | City's actual economy |
| Local weather hazards | Microclimate data |

### Uniqueness Calculation

```
Uniqueness Score =
  (Unique Words × 1.0) + (Semi-Unique Words × 0.5)
  ÷ Total Words (excluding boilerplate)
  × 100

Target: ≥60%
```

### City Page Content Breakdown

#### Current Typical City Page (~2,000 words)

| Section | Words | Type | Uniqueness Credit |
|---------|-------|------|-------------------|
| Hero text | 100 | Templated + city swap | 10% (city name only) |
| Why Dangerous | 200 | Templated + variables | 20% |
| Liability Explanation | 250 | Boilerplate | 0% |
| Evidence Preservation | 200 | Boilerplate | 0% |
| FMCSA Regulations | 250 | Boilerplate | 0% |
| Dangerous Roads | 200 | Semi-unique (state) | 50% |
| Common Accidents | 200 | Semi-unique (state) | 50% |
| Trucking Industry | 150 | Templated | 10% |
| Legal Info | 100 | Semi-unique (state) | 50% |
| FAQs | 350 | Templated | 10% |

**Current Estimated Uniqueness: ~20-25%**
**Target: 60%**
**Gap: 35-40% more unique content needed**

### Required Enhancements to Reach 60%

#### Tier 1: Automated Data (Add ~500 unique words)
- Detailed FARS fatality analysis (unique to city)
- Population-adjusted accident rate (calculation)
- Year-over-year trend analysis
- Comparison to state average

#### Tier 2: Research-Based (Add ~400 unique words)
- Local court addresses (county and federal)
- Local trauma center names and addresses
- Local police/highway patrol contacts
- Local DMV information

#### Tier 3: News/Events (Add ~300 unique words)
- Recent local truck accidents (news API)
- Local enforcement actions
- Local road construction affecting trucking
- Local trucking industry news

#### Tier 4: Expert Content (Add ~300 unique words)
- Local case study (anonymized)
- Local attorney insights
- Local jury tendencies
- Local settlement patterns

### Per-Page Analysis

For each city page, calculate:

```json
{
  "total_words": 2000,
  "boilerplate_words": 900,
  "semi_unique_words": 600,
  "unique_words": 500,
  "uniqueness_score": ((500 × 1.0) + (600 × 0.5)) / 1100 × 100,
  "result": "72%",
  "status": "PASS"
}
```

### Comparison Analysis

Compare each page against:
1. **Template:** How much matches the base template?
2. **Same-state cities:** How similar to other cities in state?
3. **All cities:** How similar to entire city corpus?

#### Similarity Thresholds
| Comparison | Acceptable | Warning | Critical |
|------------|-----------|---------|----------|
| To template | <50% | 50-70% | >70% |
| To same-state city | <40% | 40-60% | >60% |
| To any city | <30% | 30-50% | >50% |

## Alert Levels

### CRITICAL (Block Publication)
- Uniqueness score <20%
- >60% similar to any other city
- No city-specific data at all
- Template only with name swap

### HIGH (Require Enhancement)
- Uniqueness score 20-40%
- >40% similar to another city
- Missing critical unique elements
- Boilerplate dominant

### WARNING (Flag for Improvement)
- Uniqueness score 40-60%
- >30% similar to another city
- Could add more local data
- Some templates showing

### PASS
- Uniqueness score >60%
- <30% similar to any other city
- All required unique elements present
- Genuine local value provided

## Enhancement Priority Queue

Prioritize city enhancement by:
1. **Search volume:** Higher traffic potential = higher priority
2. **Competition:** More competitive markets need better pages
3. **Current score:** Worst pages need most help
4. **State coverage:** Ensure major cities per state done first

### Top Priority Cities (Do First)
- State capitals
- Top 3 population per state
- Known trucking hub cities
- Cities with high FARS fatality counts

## Agent Output

```json
{
  "page_url": "/states/texas/houston",
  "word_analysis": {
    "total_words": 2289,
    "boilerplate_words": 950,
    "semi_unique_words": 650,
    "unique_words": 689,
    "effective_unique": 1014
  },
  "uniqueness_score": 44,
  "target_score": 60,
  "gap": 16,
  "status": "WARNING",
  "similarity_analysis": {
    "to_template": 48,
    "to_nearest_city": {
      "city": "Dallas",
      "similarity": 52
    },
    "max_similarity_any": 52
  },
  "unique_elements_present": [
    "FARS fatality data",
    "Highway names",
    "County name"
  ],
  "unique_elements_missing": [
    "Local court addresses",
    "Local hospital names",
    "Local trucking companies",
    "Recent local news",
    "Unique FAQs"
  ],
  "recommendations": [
    {
      "action": "Add Harris County court address",
      "estimated_unique_words": 50,
      "new_score": 46
    },
    {
      "action": "Add Memorial Hermann, Ben Taub trauma centers",
      "estimated_unique_words": 75,
      "new_score": 49
    },
    {
      "action": "Add recent Houston truck accident news",
      "estimated_unique_words": 200,
      "new_score": 58
    },
    {
      "action": "Write 3 Houston-specific FAQs",
      "estimated_unique_words": 250,
      "new_score": 68
    }
  ],
  "priority": "HIGH",
  "enhancement_effort": "MEDIUM"
}
```
