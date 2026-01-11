# FMCSA Regulation Accuracy Agent

## Purpose
Validates that all Federal Motor Carrier Safety Administration (FMCSA) regulation citations in content are accurate, current, and properly explained.

## Trigger Conditions
- New accident type page created
- State or city page content updated
- Blog post mentioning FMCSA regulations
- Any content referencing 49 CFR sections

## Validation Rules

### Citation Format (CRITICAL)
- All CFR citations must follow format: `49 CFR [Part].[Section]`
- Example: `49 CFR 395.3` (Hours of Service)
- Invalid: `CFR 395`, `49CFR395`, `FMCSA 395`

### Regulation Accuracy Matrix

| Regulation | Correct Citation | Common Errors |
|------------|-----------------|---------------|
| Hours of Service | 49 CFR Part 395 | Wrong hour limits |
| Driver Qualifications | 49 CFR Part 391 | Wrong age requirements |
| Drug & Alcohol | 49 CFR Part 382 | Wrong BAC threshold |
| Vehicle Maintenance | 49 CFR Part 396 | Wrong inspection intervals |
| Cargo Securement | 49 CFR Part 393 | Wrong weight limits |
| Hazmat | 49 CFR Part 397 | Wrong placarding rules |

### Hours of Service Rules (Most Commonly Cited)
Verify these specific values:
- 11-hour driving limit (after 10 consecutive hours off)
- 14-hour on-duty limit (cannot be extended)
- 30-minute break after 8 hours driving
- 60/70 hour limit (7/8 day period)
- 34-hour restart provision

### Driver Qualification Rules
- Minimum age: 21 for interstate, 18 for intrastate
- CDL required for vehicles >26,001 lbs GVWR
- Medical certification every 2 years
- Drug test required before employment

### Insurance Minimums
- General freight: $750,000
- Hazmat: $1,000,000 - $5,000,000 (depending on material)
- Passenger carriers: $1,500,000 - $5,000,000

## Alert Levels

### CRITICAL (Block Publication)
- Wrong CFR citation number
- Incorrect hour limits (e.g., "10-hour driving limit")
- Wrong insurance minimums
- Outdated regulations cited as current

### HIGH (Require Review)
- Missing CFR citation for regulation claim
- Incomplete regulation explanation
- Regulation mentioned without context

### WARNING (Flag for Improvement)
- Could add more regulation detail
- Related regulations not cross-referenced
- No link to official FMCSA source

## Validation Checklist

For each FMCSA reference, verify:
- [ ] Citation format is correct (49 CFR X.X)
- [ ] Specific values match current regulations
- [ ] Regulation is explained in plain language
- [ ] Context explains why it matters for liability
- [ ] Recent amendments noted if applicable

## Common Mistakes to Catch

1. **ELD Mandate Date** - December 18, 2017 (full compliance)
2. **HOS 2020 Changes** - Updated restart, short-haul exemption
3. **Drug Testing Panel** - Now includes opioids (added 2018)
4. **Speed Limiter Rule** - Currently proposed, NOT law
5. **Automatic Braking** - Currently voluntary, NOT required

## Resources
- FMCSA Regulations: https://www.fmcsa.dot.gov/regulations
- 49 CFR Full Text: https://www.ecfr.gov/current/title-49
- FMCSA Updates: https://www.fmcsa.dot.gov/newsroom

## Agent Output

```json
{
  "page_url": "/accidents/driver-fatigue",
  "citations_found": 5,
  "citations_valid": 4,
  "citations_invalid": 1,
  "issues": [
    {
      "severity": "CRITICAL",
      "location": "paragraph 3",
      "found": "10-hour driving limit",
      "correct": "11-hour driving limit",
      "regulation": "49 CFR 395.3"
    }
  ],
  "recommendations": [
    "Add citation for 34-hour restart provision"
  ]
}
```
