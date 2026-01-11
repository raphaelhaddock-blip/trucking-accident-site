# CDL Regulation Checker Agent

## Purpose
Validates that all Commercial Driver's License (CDL) information is accurate, including requirements, endorsements, disqualifications, and how CDL violations establish liability in truck accident cases.

## Trigger Conditions
- Driver qualification sections
- Negligent hiring content
- State licensing information
- Blog posts about driver requirements
- FAQ about driver qualifications

## Why This Matters
CDL requirements are:
- Federal standards (49 CFR Part 383)
- Critical for negligent hiring/retention claims
- Frequently violated (driving on suspended CDL, etc.)
- Complex with multiple endorsements

Wrong CDL info = missing negligence arguments = weaker cases.

## Validation Rules

### CDL Requirement Thresholds

#### When CDL is Required
| Vehicle Type | Weight Threshold | Notes |
|--------------|-----------------|-------|
| Single vehicle | GVWR > 26,001 lbs | Must have CDL |
| Combination | GCWR > 26,001 lbs AND towed unit > 10,001 lbs | Must have CDL |
| Hazmat | Any amount | Requires H endorsement |
| Passengers | 16+ passengers | Requires P endorsement |
| School bus | Any | Requires S endorsement |

**Common Error:** Stating 26,000 lbs (should be 26,001)

### CDL Classes

| Class | Authorizes | Examples |
|-------|-----------|----------|
| Class A | Combination vehicles > 26,001 GCWR with trailer > 10,001 | Tractor-trailers, tankers |
| Class B | Single vehicles > 26,001 GVWR | Straight trucks, buses |
| Class C | Vehicles < 26,001 with hazmat or 16+ passengers | Small hazmat trucks, vans |

### Endorsements

| Code | Endorsement | Required For |
|------|-------------|--------------|
| H | Hazardous Materials | Hazmat placarded loads |
| N | Tank Vehicles | Liquid/gas tanks > 1,000 gal |
| P | Passenger | Vehicles with 16+ passengers |
| S | School Bus | School buses |
| T | Double/Triple Trailers | Multiple trailer combinations |
| X | Combination H+N | Hazmat tankers |

### Restrictions

| Code | Restriction | Meaning |
|------|------------|---------|
| L | Air Brakes | Cannot drive air brake equipped |
| Z | Air Brake Equipped | Full air brake restriction |
| E | Automatic Transmission | Cannot drive manual |
| O | Tractor-Trailer Restriction | No tractor-trailer combinations |

### Age Requirements

| Operation | Minimum Age |
|-----------|------------|
| Interstate | 21 years |
| Intrastate | 18 years (most states) |
| Hazmat | 21 years |

### Medical Certification

- Physical exam every 2 years
- Must be by FMCSA-registered medical examiner
- Medical Examiner's Certificate must be on file
- Self-certification of operating category required

### Disqualifications

#### Major Disqualifications (Grounds for Negligent Retention)
| Violation | First Offense | Second Offense |
|-----------|--------------|----------------|
| DUI (any vehicle) | 1 year | Lifetime |
| Leaving accident scene | 1 year | Lifetime |
| Felony with CMV | 1 year | Lifetime |
| Driving CMV suspended | 1 year | Lifetime |
| Causing fatality through negligence | 1 year | Lifetime |

#### Serious Traffic Violations
| Violation | Two in 3 Years | Three in 3 Years |
|-----------|---------------|------------------|
| Speeding 15+ mph | 60 day disqualification | 120 day disqualification |
| Reckless driving | 60 day disqualification | 120 day disqualification |
| Lane violations | 60 day disqualification | 120 day disqualification |
| Following too closely | 60 day disqualification | 120 day disqualification |
| Texting while driving | 60 day disqualification | 120 day disqualification |

### Drug & Alcohol Clearinghouse

Must explain:
- Operational since January 6, 2020
- Employers must query before hiring
- Failed tests reported to clearinghouse
- Return-to-duty process required
- How clearinghouse failures establish negligent hiring

## Litigation Relevance

Content should explain how CDL violations prove negligence:

1. **Driving without valid CDL** - Negligence per se
2. **Expired medical certificate** - Carrier should have known
3. **Missing endorsement** - Operating without authority
4. **Prior disqualifications** - Negligent retention if carrier knew
5. **Clearinghouse failures** - Negligent hiring if not checked

## Alert Levels

### CRITICAL (Block Publication)
- Wrong weight thresholds
- Wrong age requirements
- Incorrect endorsement information
- Wrong disqualification periods

### HIGH (Require Review)
- Missing medical certification requirements
- Incomplete endorsement list
- No clearinghouse explanation
- Missing negligence connections

### WARNING (Flag for Improvement)
- Could add more violation examples
- Missing state-specific variations
- No restriction explanations

## Agent Output

```json
{
  "page_url": "/states/texas",
  "cdl_references": 8,
  "accuracy_check": {
    "weight_threshold": {
      "stated": "26,001 lbs",
      "correct": true
    },
    "age_requirements": {
      "interstate": "21",
      "intrastate": "18",
      "correct": true
    },
    "endorsements_explained": 4,
    "disqualifications_explained": true,
    "clearinghouse_mentioned": true
  },
  "litigation_connection": {
    "negligent_hiring": true,
    "negligent_retention": true,
    "negligence_per_se": false
  },
  "issues": [
    {
      "severity": "WARNING",
      "issue": "Missing negligence per se explanation for CDL violations"
    }
  ],
  "score": 88,
  "status": "PASS"
}
```
