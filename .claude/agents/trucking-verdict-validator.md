# Trucking Verdict Validator Agent

## Purpose
Validates that any settlement or verdict references in content are accurate, properly sourced, and legally compliant. Prevents false advertising and manages client expectations.

## Trigger Conditions
- Accident pages with settlement examples
- State pages with verdict references
- Blog posts about case results
- "Results" or "case studies" sections
- Any dollar amount claims

## Why This Matters
- False settlement claims = bar violations
- Unverified verdicts = credibility damage
- Inflated expectations = client dissatisfaction
- Accurate results = authority building

## Validation Rules

### Settlement/Verdict Citation Requirements

#### Required Elements for Any Claim
| Element | Requirement | Example |
|---------|-------------|---------|
| Amount | Exact or range | "$2.5 million" or "$1-3 million" |
| Year | When resolved | "2023" |
| Jurisdiction | Where | "Texas" or "Harris County" |
| Case type | Accident type | "jackknife accident" |
| Outcome type | Settlement vs verdict | "jury verdict" |
| Disclaimer | Standard language | "Results vary" |

#### Acceptable Sources
- Verified firm case results
- Published court records
- Jury verdict reporters
- News reports (with citation)
- Industry databases

#### Unacceptable Sources
- Unverified claims
- "I heard about a case..."
- Competitor claims without verification
- Inflated or rounded-up numbers

### Required Disclaimers

Every page with verdict/settlement info MUST include:
```
"Past results do not guarantee future outcomes. Every case is unique
and results depend on the specific facts and circumstances."
```

Additional disclaimers if applicable:
- "Settlement amounts are confidential and may not reflect typical results"
- "Verdict amounts may be reduced on appeal"
- "Gross recovery before fees and costs"

### Statistical Claims

If citing average settlements:
- [ ] Source must be identified
- [ ] Sample size must be mentioned
- [ ] Time period must be specified
- [ ] "Average" vs "median" must be clear

#### Valid Example
"According to jury verdict reporters, the median verdict for fatal truck accidents in Texas from 2020-2023 was $3.2 million (n=47 cases)."

#### Invalid Example
"Truck accident settlements average $5 million." (No source, timeframe, or sample)

### Range Claims

Acceptable range format:
- "$500,000 to $5,000,000 depending on injury severity"
- "Settlements typically range from $100,000 for minor injuries to multi-million dollars for catastrophic injuries"

Unacceptable:
- "You could get millions!"
- "Expect at least $1 million"
- Specific promises without disclaimers

### Case Study Requirements

If including detailed case studies:
- [ ] Must be actual cases (anonymized ok)
- [ ] Key facts must be accurate
- [ ] No identifying information without consent
- [ ] Must include "results may vary" disclaimer
- [ ] Should explain why result was achieved

## Alert Levels

### CRITICAL (Block Publication)
- Specific settlement promise without disclaimer
- Unverified verdict claim
- Missing required disclaimers
- Potentially false advertising

### HIGH (Require Review)
- Statistical claim without source
- Range that may be misleading
- Missing context for large verdicts
- Outdated results (>5 years old)

### WARNING (Flag for Improvement)
- Could add more context
- Disclaimer could be more prominent
- Source could be more specific

## Ethical Rules Reference

### ABA Model Rules
- Rule 7.1: Communications concerning services (no false/misleading)
- Rule 7.2: Advertising (truthfulness requirement)

### State Bar Considerations
- Texas: Must be verifiable and not misleading
- California: Specific disclaimer requirements
- Florida: Strict advertising rules
- New York: Prior results don't guarantee

## Prohibited Claims

Never include:
- "Guaranteed" settlements
- "We always win"
- Specific promises tied to injury type
- Claims that can't be verified
- Competitor disparagement

## Agent Output

```json
{
  "page_url": "/accidents/wrongful-death",
  "verdict_references": 4,
  "validation_results": [
    {
      "claim": "$4.5 million verdict, Texas 2022",
      "verified": true,
      "source": "Jury Verdict Reporter",
      "disclaimer_present": true
    },
    {
      "claim": "Average truck accident settlement: $1.5 million",
      "verified": false,
      "issue": "No source cited",
      "recommendation": "Add source or remove claim"
    }
  ],
  "required_disclaimers": {
    "general_disclaimer": true,
    "results_vary": true,
    "no_guarantee": true
  },
  "issues": [
    {
      "severity": "HIGH",
      "issue": "Statistical claim without source",
      "location": "paragraph 5",
      "recommendation": "Add verifiable source or use range with disclaimer"
    }
  ],
  "score": 72,
  "status": "NEEDS_IMPROVEMENT"
}
```
