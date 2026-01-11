# Local Data Injector Agent

## Purpose
Ensure location pages contain real, verifiable local data to differentiate from generic/doorway pages and provide genuine value.

## Trigger
- New location page creation
- Monthly refresh of existing pages
- When local data sources update

## Required Local Elements Per Location Page

### Mandatory (Must Have All)
| Element | Source | Example |
|---------|--------|---------|
| Accident statistics | OSHA/BLS data | "Brooklyn: 398 injuries in 2024" |
| County court info | NY Courts website | "Kings County Supreme Court, 360 Adams St" |
| Major projects | Local news/permits | "Pacific Park - 22-acre development" |
| Neighborhoods | Census/local sources | "DUMBO, Park Slope, Williamsburg..." |
| Local verdicts | Court records | "$9.8M scaffold collapse verdict, 2023" |

### Recommended (Should Have 3+)
| Element | Source | Example |
|---------|--------|---------|
| Construction employment | BLS regional data | "45,000+ construction workers" |
| Permit activity | NYC DOB | "3,800+ active permits" |
| Union local info | Union websites | "Ironworkers Local 361" |
| Hospital/trauma centers | Local hospitals | "Brooklyn Hospital Center" |
| Recent incidents | News APIs | "January 2025 scaffold collapse..." |

## Validation Checklist

### For Each Location Page:
- [ ] **Statistics table present** with 5 years of data
  - Total injuries per year
  - Fall injuries per year
  - Struck-by injuries per year
  - Fatalities per year

- [ ] **Court information accurate**
  - County name correct
  - Court address current
  - Jurisdiction description accurate

- [ ] **Major projects list** (6+ items)
  - Projects are real and current
  - Dollar amounts/scale included where available
  - Project names are specific

- [ ] **Neighborhood list** (8+ neighborhoods)
  - All neighborhoods actually in that location
  - Descriptions are unique per neighborhood
  - No copy-paste from other locations

- [ ] **Case results** (3+ cases)
  - Year provided
  - Dollar amount provided
  - Accident type specified
  - Brief description included

- [ ] **FAQ questions** (5+ questions)
  - Questions reference specific location
  - Answers include local details
  - No generic/templated answers

## Data Freshness Requirements

| Data Type | Max Age | Refresh Frequency |
|-----------|---------|-------------------|
| Statistics | 12 months | Annually |
| Court info | 24 months | As needed |
| Major projects | 6 months | Quarterly |
| Case results | 36 months | As available |
| Neighborhoods | Evergreen | As needed |

## Output Report
```
LOCAL DATA AUDIT - Brooklyn
Date: [Date]

COMPLETENESS SCORE: 98%

MANDATORY ELEMENTS:
[x] Accident statistics - 5 years present
[x] Court information - Kings County Supreme Court
[x] Major projects - 6 projects listed
[x] Neighborhoods - 12 areas with descriptions
[x] Case results - 5 verdicts with details

RECOMMENDED ELEMENTS:
[x] Employment data - 45,000+ workers
[x] Permit activity - 3,800+ permits
[ ] Union info - MISSING
[x] Recent incidents - 3 referenced

DATA FRESHNESS:
- Statistics: Jan 2025 (CURRENT)
- Projects: Dec 2024 (CURRENT)
- Verdicts: 2021-2023 (ACCEPTABLE)

RECOMMENDATIONS:
1. Add local union information (Ironworkers 361, Carpenters 926)
2. Update projects list with 2025 developments
```

## Data Sources

### Official Sources
- OSHA Injury Tracking: osha.gov/injuryreporting
- BLS Regional Data: bls.gov/regions
- NY Court System: nycourts.gov
- NYC DOB: nyc.gov/dob

### News Sources
- Construction Dive
- ENR New York
- Crain's New York Business
- Local news outlets

### Court Records
- PACER for federal cases
- NY eCourts for state cases
- Legal news services

## Integration Points
- Content generation pipeline
- Monthly data refresh cron
- Manual trigger for updates

## Related Agents
- thin-content-detector.md
- freshness-monitor.md
