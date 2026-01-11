# Doorway Page Scorer Agent

## Purpose
Detects pages that may be classified as "doorway pages" by Google - pages created primarily for search engines that funnel users to a single destination without providing unique value.

## Trigger Conditions
- City page creation/updates
- Any programmatic page generation
- Bulk content creation
- Before launch verification
- Monthly quality audit

## Why This Matters
Google's definition of doorway pages:
> "Doorway pages are sites or pages created to rank highly for specific search queries to funnel users to your website."

Characteristics that trigger penalties:
- Multiple pages targeting similar keywords
- Pages that funnel to the same destination
- Minimal unique content between pages
- Exist primarily for SEO, not user value

Our 1,615 city pages are HIGH RISK for this classification.

## Validation Rules

### Doorway Page Indicators

#### Content Uniqueness Score (Per Page)
| Uniqueness | Score | Risk Level |
|------------|-------|------------|
| >70% unique content | 0 | Safe |
| 50-70% unique | 1 | Low risk |
| 30-50% unique | 2 | Medium risk |
| 10-30% unique | 3 | High risk |
| <10% unique | 4 | Critical - doorway |

#### Funnel Pattern Score
| Pattern | Score | Description |
|---------|-------|-------------|
| Multiple CTAs to different pages | 0 | Diverse user paths |
| Single primary CTA, multiple secondary | 1 | Acceptable funnel |
| All CTAs go to same page | 2 | Doorway indicator |
| Only one CTA on page | 3 | Strong doorway signal |

#### Template Dependency Score
| Template Usage | Score | Notes |
|---------------|-------|-------|
| <30% from template | 0 | Highly unique |
| 30-50% from template | 1 | Acceptable |
| 50-70% from template | 2 | High template reliance |
| >70% from template | 3 | Doorway risk |

#### Value Provision Score
| Value Provided | Score | Description |
|---------------|-------|-------------|
| Unique local resources | 0 | Real local value |
| Local statistics only | 1 | Some value |
| Generic + city name swap | 2 | Minimal value |
| No unique value | 3 | No user benefit |

### Total Doorway Score Calculation

```
Doorway Score = Uniqueness + Funnel + Template + Value
Maximum: 13 points

Interpretation:
  0-3: SAFE - Genuine unique pages
  4-6: LOW RISK - Some doorway characteristics
  7-9: MEDIUM RISK - Likely doorway classification
  10-13: HIGH RISK - Almost certainly doorway pages
```

### City Page Specific Analysis

For each city page, verify:

#### Unique Content Requirements
- [ ] Local truck fatality statistics (unique data)
- [ ] Local highway names (not just "I-10" for every TX city)
- [ ] Local court information (addresses, not templates)
- [ ] Local hospital/trauma center names
- [ ] Local trucking company references
- [ ] Local news/accident references
- [ ] Unique FAQs (not templated)

#### Distinct from Other Cities
Compare each city against:
- Other cities in same state
- Cities with similar names
- Cities of similar population

Threshold: Must be <40% similar to any other city page

#### Standalone Value Test
Ask: "Would a user in [City] find this page useful even if they didn't click the CTA?"

If no → doorway page risk
If yes → legitimate local page

### Red Flags

#### Automatic Doorway Classification
- Pages with only city name changed
- Identical paragraph structures
- Same FAQs across all cities
- No local resources or references
- Only value is the contact form

#### Strong Doorway Indicators
- Hero text only differs by city name
- "Why dangerous" section is templated
- All cities have same industries
- All cities have same weather hazards
- All cities reference same highways

### Required Unique Elements Per City

To avoid doorway classification, each city MUST have:

| Element | Requirement | Current Status |
|---------|-------------|----------------|
| Local fatality data | From FARS | ✓ Present |
| Local highways | Verified for city | ⚠️ Often templated |
| Local industries | Verified for city | ⚠️ Often generic |
| Local weather | State-level, not city | ⚠️ Could improve |
| Local courts | Address required | ✗ Missing |
| Local hospitals | Names required | ✗ Missing |
| Local trucking news | Recent article | ✗ Missing |
| Local FAQ variation | 3+ unique Qs | ⚠️ Templated |

## Alert Levels

### CRITICAL (Block Page)
- Doorway score >10
- <10% unique content
- Identical to another city
- No unique local value

### HIGH (Require Enhancement)
- Doorway score 7-9
- 10-30% unique content
- Missing 4+ required elements
- Highly templated

### WARNING (Flag for Improvement)
- Doorway score 4-6
- 30-50% unique content
- Missing 2-3 required elements
- Could add more local value

### PASS
- Doorway score 0-3
- >50% unique content
- All required elements present
- Genuine local value

## Remediation Strategies

### For High-Risk Pages

1. **Add Local Data:**
   - Local court addresses (research required)
   - Local hospital names (Google Maps API)
   - Local trucking terminals
   - Local accident news (news API)

2. **Create Unique Content:**
   - City-specific case studies
   - Local attorney profiles
   - Local jury verdict examples
   - Local dangerous intersection data

3. **Differentiate Templates:**
   - Vary section order
   - Different emphasis per city
   - Unique hero images
   - City-specific CTAs

4. **Add Resources:**
   - Local DMV information
   - Local highway patrol contacts
   - Local towing/recovery services
   - Local medical providers

## Agent Output

```json
{
  "page_url": "/states/texas/houston",
  "doorway_analysis": {
    "uniqueness_score": 1,
    "funnel_score": 1,
    "template_score": 2,
    "value_score": 1,
    "total_score": 5,
    "risk_level": "LOW RISK"
  },
  "unique_content_percentage": 45,
  "required_elements": {
    "local_fatalities": true,
    "local_highways": true,
    "local_industries": false,
    "local_courts": false,
    "local_hospitals": false,
    "local_news": false,
    "unique_faqs": false
  },
  "similar_pages": [
    {
      "url": "/states/texas/dallas",
      "similarity": 62,
      "risk": "HIGH"
    }
  ],
  "issues": [
    {
      "severity": "HIGH",
      "issue": "62% similar to Dallas page",
      "recommendation": "Add Houston-specific content to differentiate"
    },
    {
      "severity": "HIGH",
      "issue": "Missing local court and hospital information",
      "recommendation": "Add Harris County court address and trauma centers"
    }
  ],
  "status": "NEEDS_IMPROVEMENT"
}
```
