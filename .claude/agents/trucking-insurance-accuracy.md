# Trucking Insurance Accuracy Agent

## Purpose
Validates that all trucking insurance information is accurate, including federal minimums, state requirements, policy types, and insurance stacking concepts critical for maximizing victim compensation.

## Trigger Conditions
- Accident page insurance sections
- State page insurance requirements
- Blog posts about compensation
- FAQ about insurance coverage

## Why This Matters
Trucking insurance is complex:
- Multiple policy layers
- Federal minimums much higher than auto
- Varies by cargo type
- Insurance stacking can dramatically increase recovery

Wrong insurance information = client expectations mismanaged = malpractice risk.

## Validation Rules

### Federal Insurance Minimums (CRITICAL)

| Cargo Type | Minimum Coverage | Citation |
|------------|-----------------|----------|
| General freight | $750,000 | 49 CFR 387.9 |
| Household goods | $750,000 | 49 CFR 387.9 |
| Oil (hazmat) | $1,000,000 | 49 CFR 387.9 |
| Other hazmat | $5,000,000 | 49 CFR 387.9 |
| Passengers (≤15) | $1,500,000 | 49 CFR 387.33 |
| Passengers (>15) | $5,000,000 | 49 CFR 387.33 |

### Insurance Types to Explain

#### Required Explanations
| Policy Type | What It Covers | Who Carries It |
|-------------|---------------|----------------|
| Primary Liability | Bodily injury, property damage | Motor carrier |
| Cargo Insurance | Freight damage/loss | Carrier or shipper |
| Bobtail Insurance | Tractor without trailer | Driver/owner-operator |
| Non-Trucking Liability | Personal use of truck | Owner-operator |
| Physical Damage | Truck/trailer damage | Carrier |
| Umbrella/Excess | Above primary limits | Large carriers |

#### MCS-90 Endorsement (Must Explain)
- What it is (federal requirement)
- When it applies
- How it protects victims
- That it ensures minimum coverage even if policy lapses

### Insurance Stacking Concepts

Must explain when applicable:
- [ ] Primary vs excess coverage
- [ ] Multiple policy triggers
- [ ] Broker's insurance obligations
- [ ] Shipper's insurance
- [ ] Trailer owner's insurance
- [ ] How to identify all available policies

### State-Specific Requirements

For state pages, include:
- State minimum (if higher than federal)
- Uninsured/underinsured motorist requirements
- State-specific policy requirements
- Financial responsibility proof requirements

### Common Insurance Scenarios

#### Owner-Operator Accidents
- Explain lease agreement insurance provisions
- Primary vs contingent coverage
- Who's responsible when

#### Broker-Arranged Loads
- Broker's contingent cargo coverage
- Broker's liability insurance
- When broker's insurance applies

#### Multi-Vehicle Accidents
- How multiple truck policies interact
- Passenger vehicle UM/UIM coverage
- Coordination of benefits

## Alert Levels

### CRITICAL (Block Publication)
- Wrong federal minimums stated
- Incorrect policy type descriptions
- Missing MCS-90 explanation for relevant content

### HIGH (Require Review)
- Missing insurance stacking explanation
- Incomplete policy type coverage
- No mention of multiple policies

### WARNING (Flag for Improvement)
- Could explain umbrella coverage
- Missing broker insurance details
- No state-specific requirements

## Must NOT Include

- Specific settlement guarantees based on coverage
- Advice to pursue specific insurance strategy
- Insurance company recommendations
- Claims handling advice (that's attorney's job)

## Common Mistakes to Catch

1. **"$1 million minimum"** - Wrong for general freight ($750K)
2. **"All trucks have $5 million"** - Only hazmat
3. **"Insurance always pays"** - Coverage disputes happen
4. **Confusing liability and cargo insurance**
5. **Ignoring owner-operator lease complexities**

## Agent Output

```json
{
  "page_url": "/accidents/hazmat-accidents",
  "insurance_mentions": 12,
  "accuracy_check": {
    "federal_minimums": {
      "stated": "$5,000,000",
      "correct": true
    },
    "policy_types_explained": [
      "primary liability",
      "cargo insurance",
      "umbrella"
    ],
    "missing_policy_types": [
      "MCS-90 endorsement"
    ]
  },
  "stacking_explained": true,
  "mcs90_mentioned": false,
  "issues": [
    {
      "severity": "HIGH",
      "issue": "Missing MCS-90 endorsement explanation",
      "recommendation": "Add section explaining MCS-90 federal requirement"
    }
  ],
  "score": 78,
  "status": "NEEDS_IMPROVEMENT"
}
```
