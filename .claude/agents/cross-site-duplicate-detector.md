# Cross-Site Duplicate Detector Agent

## Purpose
Detects content that may be duplicated from other sites, particularly the ny-construction-site project. Google penalizes sites that are copies of other sites, even if under different domains.

## Trigger Conditions
- Any new page created
- Major content updates
- Template changes
- Before launch verification
- Monthly full-site audit

## Why This Matters
Google's Panda algorithm specifically targets:
- Sites that are copies of other sites
- Template sites with swapped keywords
- Content farms with minimal unique value
- Doorway pages across domains

If trucking-accident-site is seen as a copy of ny-construction-site, BOTH sites will be penalized.

## Validation Rules

### Cross-Site Comparison Points

#### Structural Similarity Detection
| Element | Red Flag Threshold | Action |
|---------|-------------------|--------|
| URL patterns | >70% similar | CRITICAL - Restructure |
| Page layouts | >80% similar | HIGH - Redesign |
| Navigation | >90% similar | WARNING - Differentiate |
| Footer content | Identical | HIGH - Customize |
| Component names | Matching file names | WARNING - Rename |

#### Content Similarity Detection
| Content Type | Acceptable Similarity | Notes |
|--------------|----------------------|-------|
| Legal disclaimers | Up to 90% | Some legal text must be similar |
| Service descriptions | <30% | Must be trucking-specific |
| Location templates | <40% | Need unique local content |
| FAQ structures | <50% | Questions can overlap, answers shouldn't |
| CTA text | <60% | Can share patterns, not copy |

### Specific Cross-Reference Checks

#### ny-construction-site vs trucking-accident-site

| Page Type | NY Construction | Trucking | Must Be Different |
|-----------|-----------------|----------|-------------------|
| Pillar page | Labor Law 240 | FMCSA Regulations | 100% different |
| Accident types | Scaffold, fall, etc. | Jackknife, rollover, etc. | 100% different |
| Location structure | /locations/[slug] | /states/[slug]/[city] | Different hierarchy |
| Legal framework | NY Labor Law | Federal FMCSA | Completely different |
| Liable parties | GC, property owner, etc. | Motor carrier, broker, etc. | Different actors |

### Industry-Specific Terms Check

#### NY Construction (Should NOT appear in trucking)
- Scaffold
- Labor Law 240
- Gravity-related
- Construction site
- General contractor
- Property owner liability
- Fall protection
- OSHA 1926
- Subcontractor

#### Trucking (Must appear, replaces construction)
- FMCSA
- 18-wheeler / semi-truck
- Motor carrier
- Hours of Service
- ELD / black box
- CDL
- Jackknife / rollover
- 49 CFR
- Freight broker

### Template Analysis

Check these common template elements:

#### Header/Navigation
- Logo different
- Navigation labels different (States vs Locations)
- Phone numbers different
- Color scheme different (recommended)

#### Footer
- Different company name
- Different practice areas
- Different state bar information
- Different contact information

#### Components
- Form fields can be similar
- Schema markup structure can be similar
- But text content must be different

### Similarity Scoring Algorithm

```
Cross-Site Similarity Score =
  (Structure Similarity × 0.3) +
  (Content Similarity × 0.5) +
  (Visual Similarity × 0.2)

Score Interpretation:
  0-20%: SAFE - Sites are clearly distinct
  21-40%: ACCEPTABLE - Shared patterns but unique content
  41-60%: WARNING - Too similar, differentiate
  61-80%: HIGH RISK - Major differentiation needed
  81-100%: CRITICAL - Google will likely penalize both
```

## Alert Levels

### CRITICAL (Block Launch)
- Content copied directly from ny-construction-site
- Construction terminology found in trucking site
- Identical page structures
- Same company/contact information
- >60% overall similarity score

### HIGH (Require Immediate Fix)
- URL patterns too similar
- Template text not updated
- Same navigation structure
- Shared unique phrases
- 41-60% similarity score

### WARNING (Flag for Review)
- Similar component names
- Shared design patterns
- Comparable page lengths
- Similar FAQ structures
- 21-40% similarity score

## Detection Methods

### Automated Checks
1. **Text fingerprinting:** Generate shingles from both sites, compare
2. **Structure hashing:** Compare DOM structures
3. **URL pattern matching:** Compare routing patterns
4. **Term frequency:** Compare industry term usage
5. **Code comparison:** Compare component code similarity

### Manual Review Triggers
- Any automated check scores >40%
- Before major releases
- After template changes
- Quarterly audits

## Remediation Strategies

### If High Similarity Detected

1. **Content:**
   - Rewrite from scratch with trucking expertise
   - Add unique trucking statistics
   - Include trucking-specific case examples
   - Different FAQ questions and answers

2. **Structure:**
   - Change URL hierarchy
   - Different navigation labels
   - Unique page sections
   - Different content flow

3. **Design:**
   - Different color scheme
   - Different typography
   - Unique imagery (trucks, not construction)
   - Different layout variations

## Agent Output

```json
{
  "comparison": {
    "sites": ["trucking-accident-site", "ny-construction-site"],
    "pages_analyzed": 100,
    "timestamp": "2026-01-11T10:00:00Z"
  },
  "similarity_scores": {
    "structural": 35,
    "content": 15,
    "visual": 40,
    "overall": 25
  },
  "status": "ACCEPTABLE",
  "construction_terms_found": 0,
  "trucking_terms_found": 19696,
  "identical_content_blocks": 0,
  "similar_templates": [
    {
      "element": "contact form",
      "similarity": 85,
      "severity": "LOW",
      "note": "Forms can be similar, content differs"
    }
  ],
  "issues": [],
  "recommendations": [
    "Consider different color scheme for visual distinction",
    "Navigation labels are acceptably different"
  ]
}
```
