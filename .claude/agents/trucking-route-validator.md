# Trucking Route Validator Agent

## Purpose
Validates that highway and trucking route information on location pages is accurate and specific to each city. Prevents generic "I-10" references for cities not on I-10 and ensures local trucking corridor information is correct.

## Trigger Conditions
- City page creation/updates
- State page trucking corridor sections
- Dangerous roads sections
- Any highway references
- Bulk content generation

## Why This Matters
The audit found cities with incorrect highway references:
- Kingman, AZ mentions "I-10" but is on I-40
- Generic highway lists copied across cities
- Same "major trucking corridors" for all cities in state

Incorrect local data = low quality signals = ranking penalties.

## Validation Rules

### Interstate Highway Reference Rules

#### Verify City Actually On Highway
For each highway mentioned, verify:
- Highway passes through or adjacent to city
- City is within 20 miles of highway (for "near" claims)
- Highway is relevant to city's trucking traffic

#### Major Trucking Interstates Reference

| Interstate | Route | Major Cities |
|------------|-------|--------------|
| I-5 | CA-OR-WA coast | LA, San Diego, Sacramento, Portland, Seattle |
| I-10 | CA to FL | LA, Phoenix, Tucson, El Paso, San Antonio, Houston, New Orleans, Jacksonville |
| I-15 | CA-NV-UT-MT | San Diego, Las Vegas, Salt Lake City |
| I-20 | TX to SC | Dallas, Fort Worth, Midland, Atlanta, Columbia |
| I-25 | NM to WY | Albuquerque, Denver, Cheyenne |
| I-35 | TX to MN | Laredo, San Antonio, Austin, Dallas, OKC, KC, Des Moines, Minneapolis |
| I-40 | CA to NC | Barstow, Flagstaff, Albuquerque, Amarillo, OKC, Memphis, Nashville, Raleigh |
| I-44 | TX to MO | Wichita Falls, OKC, Tulsa, Springfield, St. Louis |
| I-45 | TX only | Houston, Dallas/Galveston |
| I-55 | LA to IL | New Orleans, Jackson, Memphis, St. Louis, Chicago |
| I-65 | AL to IN | Mobile, Montgomery, Birmingham, Nashville, Louisville, Indianapolis |
| I-70 | UT to MD | Denver, Kansas City, St. Louis, Indianapolis, Columbus, Baltimore |
| I-75 | FL to MI | Miami, Tampa, Atlanta, Chattanooga, Cincinnati, Detroit |
| I-80 | CA to NJ | SF Bay, Reno, SLC, Cheyenne, Omaha, Des Moines, Chicago, Cleveland, NYC area |
| I-81 | TN to NY | Knoxville, Roanoke, Harrisburg, Syracuse |
| I-85 | AL to VA | Montgomery, Atlanta, Charlotte, Durham, Petersburg |
| I-90 | WA to MA | Seattle, Spokane, Billings, Sioux Falls, Chicago, Cleveland, Buffalo, Boston |
| I-94 | MT to MI | Billings, Bismarck, Minneapolis, Milwaukee, Chicago, Detroit |
| I-95 | FL to ME | Miami, Jacksonville, Savannah, DC, Baltimore, Philly, NYC, Boston |

### City-Highway Validation Matrix

For each city, maintain verified highway data:

```json
{
  "houston": {
    "state": "texas",
    "interstates": ["I-10", "I-45", "I-69"],
    "us_routes": ["US-59", "US-290"],
    "beltways": ["I-610", "Beltway 8"],
    "verified": true
  },
  "kingman": {
    "state": "arizona",
    "interstates": ["I-40"],
    "us_routes": ["US-93"],
    "not_on": ["I-10", "I-17"],
    "verified": true
  }
}
```

### Content Validation Rules

#### Highway Mention Accuracy
| Check | Pass | Fail |
|-------|------|------|
| City on stated interstate | Verified via mapping | Not on route |
| Highway relevant to city | Major route through/near | Distant, irrelevant |
| Description accurate | Matches actual route | Wrong description |
| Trucking relevance | Known freight corridor | Not freight route |

#### Dangerous Roads Validation
For "dangerous roads" sections, verify:
- Road actually in/near the city
- Mile marker or distance accurate
- Description matches actual conditions
- Statistics cited are for correct location

### State-Level Corridor Accuracy

#### State Pages Must Include
- Major interstates through state
- Key trucking hub cities
- Port/border crossings if applicable
- Distribution center regions

#### Common Errors to Catch
- Listing I-10 for states it doesn't cross
- Wrong city assignments to corridors
- Missing major routes through state
- Outdated highway designations

### Local Road Verification

For non-interstate roads mentioned:
- Verify road exists in city
- Verify road sees truck traffic
- Verify any specific claims (accidents, conditions)

### Weather + Route Correlation

Verify weather claims match routes:
- Mountain passes: Snow/ice claims valid
- Desert routes: Heat claims valid
- Coastal routes: Fog claims valid
- Plains routes: Wind claims valid

Don't claim:
- "Icy mountain passes" for flat Texas cities
- "Dense fog" for Arizona desert
- "Snow hazards" for South Florida

## Alert Levels

### CRITICAL (Block Publication)
- City claims highway it's not on
- Completely wrong route information
- Highway doesn't exist
- Major geographical error

### HIGH (Require Correction)
- Secondary highway incorrectly listed
- Distance claim significantly wrong
- Weather claim doesn't match geography
- Trucking relevance overstated

### WARNING (Flag for Review)
- Could be more specific about routes
- Generic state routes used instead of city-specific
- Missing important local routes
- Claims could be better verified

### PASS
- All highways verified
- City-specific routes accurate
- Weather claims match geography
- Trucking relevance accurate

## Data Sources for Verification

### Primary Sources
- Google Maps / Mapping APIs
- DOT highway maps
- Trucking route planners (Trucker Path, ProMiles)
- State DOT websites

### Secondary Sources
- City government websites
- Local news (for accident locations)
- Trucking industry publications
- FMCSA safety data

## Validation Process

For each city page:

1. **Extract highway claims** from content
2. **Verify each highway** passes through/near city
3. **Check weather claims** match geography
4. **Validate trucking relevance** of routes
5. **Score accuracy** (0-100%)
6. **Flag issues** by severity

## Agent Output

```json
{
  "page_url": "/states/arizona/kingman",
  "highway_analysis": {
    "highways_claimed": ["I-10", "I-40", "I-17"],
    "highways_verified": {
      "I-40": {
        "status": "PASS",
        "note": "City is directly on I-40"
      },
      "I-10": {
        "status": "FAIL",
        "note": "I-10 is 150+ miles south of Kingman",
        "severity": "CRITICAL"
      },
      "I-17": {
        "status": "FAIL",
        "note": "I-17 is 100+ miles east",
        "severity": "HIGH"
      }
    },
    "missing_highways": ["US-93"],
    "accuracy_score": 33
  },
  "weather_claims": {
    "claimed": "Extreme heat",
    "geographic_match": true,
    "status": "PASS"
  },
  "issues": [
    {
      "severity": "CRITICAL",
      "issue": "Claims I-10 passes through Kingman",
      "fact": "I-10 is over 150 miles south",
      "recommendation": "Remove I-10 reference, keep I-40"
    },
    {
      "severity": "HIGH",
      "issue": "Claims I-17 serves Kingman",
      "fact": "I-17 is ~100 miles east",
      "recommendation": "Remove I-17 reference"
    },
    {
      "severity": "WARNING",
      "issue": "Missing US-93",
      "fact": "US-93 is major truck route through Kingman",
      "recommendation": "Add US-93 as key trucking corridor"
    }
  ],
  "status": "CRITICAL - REQUIRES FIX"
}
```
