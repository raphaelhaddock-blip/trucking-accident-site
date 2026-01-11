# Trucking Terminology Validator Agent

## Purpose
Ensures all trucking-related legal content uses correct, consistent, and professional terminology that demonstrates expertise to both users and search engines.

## Trigger Conditions
- Any content page created or updated
- Blog posts about trucking accidents
- FAQ content changes
- Meta description updates

## Validation Rules

### Required Terminology Per Page Type

#### Accident Type Pages (Must Include 10+)
| Category | Required Terms |
|----------|---------------|
| Vehicle | 18-wheeler, semi-truck, tractor-trailer, commercial motor vehicle |
| Regulations | FMCSA, 49 CFR, Hours of Service, ELD |
| Evidence | black box, EDR, driver qualification file |
| Parties | motor carrier, trucking company |
| Legal | negligence, liability, damages |

#### State Pages (Must Include 8+)
- State DOT name
- Comparative negligence type
- Statute of limitations
- FMCSA, HOS, ELD
- Commercial motor vehicle
- Motor carrier

#### City Pages (Must Include 6+)
- 18-wheeler or semi-truck
- FMCSA
- Motor carrier
- Trucking company
- Commercial truck
- CDL or commercial driver

### Terminology Consistency Rules

#### Preferred Terms (Use These)
| Preferred | Avoid |
|-----------|-------|
| 18-wheeler | eighteen wheeler, 18 wheeler |
| semi-truck | semi truck, semitruck |
| tractor-trailer | tractor trailer |
| FMCSA | Federal Motor Carrier Safety Admin (spell out first use) |
| ELD | Electronic Logging Device (spell out first use) |
| CDL | Commercial Driver's License (spell out first use) |
| motor carrier | trucking carrier |
| Hours of Service | hours-of-service, HOS rules |
| black box | blackbox, "black box" |
| EDR | Event Data Recorder (spell out first use) |

### Acronym Rules
1. Spell out on first use in each page
2. Use acronym for subsequent references
3. Never assume reader knows acronym

### Term Density Guidelines
- Primary keyword: 0.5-1.5% density
- Secondary keywords: 0.3-0.8% density
- Trucking terms: Minimum 10 per 1,000 words
- Legal terms: Minimum 5 per 1,000 words

## Alert Levels

### CRITICAL
- Missing primary trucking terms entirely
- Incorrect terminology (e.g., "semitruck" instead of "semi-truck")
- Legal terms used incorrectly

### HIGH
- Acronyms not spelled out on first use
- Inconsistent terminology within same page
- Below minimum term density

### WARNING
- Could use more varied trucking vocabulary
- Missing secondary terms
- Overuse of same term (>2% density)

## Trucking Vocabulary Reference

### Vehicle Types
- 18-wheeler
- Semi-truck / semi-trailer
- Tractor-trailer
- Big rig
- Commercial motor vehicle (CMV)
- Large truck
- Heavy truck
- Class 8 truck

### Trailer Types
- Dry van
- Flatbed
- Refrigerated (reefer)
- Tanker
- Lowboy
- Double/triple trailers

### Regulatory Bodies
- FMCSA (Federal Motor Carrier Safety Administration)
- DOT (Department of Transportation)
- NHTSA (National Highway Traffic Safety Administration)
- State DOT

### Documentation
- Driver qualification file (DQF)
- Driver vehicle inspection report (DVIR)
- Bill of lading
- Shipping manifest
- Logbook (pre-ELD)
- ELD records

### Insurance Terms
- Liability coverage
- Cargo insurance
- Bobtail insurance
- Non-trucking liability
- MCS-90 endorsement

### Accident Types
- Jackknife
- Rollover
- Underride / override
- Wide turn / right turn squeeze
- Blind spot collision
- Rear-end collision
- T-bone / broadside
- Runaway truck
- Tire blowout
- Brake failure

### Liable Parties
- Truck driver
- Motor carrier / trucking company
- Freight broker
- Shipper
- Consignee
- Cargo loading company
- Maintenance company
- Truck manufacturer
- Parts manufacturer
- Trailer owner

## Agent Output

```json
{
  "page_url": "/accidents/jackknife-accidents",
  "word_count": 3500,
  "trucking_terms_found": 45,
  "trucking_term_density": "1.3%",
  "missing_required_terms": [],
  "terminology_errors": [
    {
      "found": "semitruck",
      "correct": "semi-truck",
      "count": 3
    }
  ],
  "acronym_issues": [
    {
      "acronym": "HOS",
      "issue": "Not spelled out on first use"
    }
  ],
  "score": 85,
  "status": "PASS"
}
```
