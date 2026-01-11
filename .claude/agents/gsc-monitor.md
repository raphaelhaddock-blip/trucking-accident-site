# Google Search Console Monitor Agent

## Purpose
Monitor Google's view of the site including indexation, performance, and issues to catch SEO problems early.

## Trigger
- Daily data pull (GSC data has 2-3 day lag)
- Alert on threshold breaches
- Weekly summary report

## Data to Monitor

### Coverage Report
| Metric | Description | Alert Threshold |
|--------|-------------|-----------------|
| Valid (Indexed) | Pages in Google's index | Drop >5% |
| Valid with warnings | Indexed but has issues | Any increase |
| Excluded | Intentionally not indexed | Unexpected increase |
| Error | Couldn't be indexed | Any errors |

### Performance Data
| Metric | Description | Alert Threshold |
|--------|-------------|-----------------|
| Clicks | Total clicks from search | Drop >20% WoW |
| Impressions | Times shown in results | Drop >15% WoW |
| CTR | Click-through rate | Drop >1pp |
| Position | Average ranking position | Rise >3 positions |

### Core Web Vitals
| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP | <2.5s | 2.5-4s | >4s |
| FID | <100ms | 100-300ms | >300ms |
| CLS | <0.1 | 0.1-0.25 | >0.25 |

## API Integration

### Authentication
```javascript
const { google } = require('googleapis');
const searchconsole = google.searchconsole('v1');

// OAuth2 credentials required
const auth = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
```

### Fetch Performance Data
```javascript
async function getPerformanceData(siteUrl, startDate, endDate) {
  const response = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ['query', 'page', 'device'],
      rowLimit: 1000
    }
  });
  return response.data.rows;
}
```

### Fetch Coverage Data
```javascript
async function getCoverageData(siteUrl) {
  // Note: Coverage API is limited, may need to scrape GSC UI
  // or use URL Inspection API for individual URLs
  const response = await searchconsole.urlInspection.index.inspect({
    siteUrl,
    inspectionUrl: 'https://nyconstructionadvocate.com/locations/brooklyn'
  });
  return response.data;
}
```

## Output Report

### Daily Status
```
GOOGLE SEARCH CONSOLE REPORT - [Date]
Site: nyconstructionadvocate.com
Data through: [Date - 2 days]

INDEXATION STATUS:
├── Indexed pages: 168/175 (96%)
├── Excluded (intentional): 7
├── Errors: 0
└── Warnings: 2

STATUS CHANGES (vs yesterday):
├── New indexed: +2 (blog posts)
├── Dropped: 0
└── New errors: 0

PERFORMANCE (Last 7 Days):
├── Clicks: 1,247 (+12% WoW)
├── Impressions: 45,892 (+8% WoW)
├── CTR: 2.72% (+0.1pp WoW)
└── Avg Position: 14.3 (-0.8 WoW)

TOP QUERIES:
1. "construction accident lawyer brooklyn" - Pos: 4.2, Clicks: 89
2. "scaffold accident attorney nyc" - Pos: 6.1, Clicks: 67
3. "labor law 240 lawyer" - Pos: 3.8, Clicks: 54
4. "fall from ladder settlement ny" - Pos: 8.4, Clicks: 43
5. "construction injury lawyer queens" - Pos: 5.7, Clicks: 41

TOP PAGES:
1. /locations/brooklyn - 156 clicks, Pos: 5.2
2. /accidents/scaffold-falls - 134 clicks, Pos: 4.8
3. /labor-law-240 - 98 clicks, Pos: 3.1
4. /locations/manhattan - 87 clicks, Pos: 6.4
5. /accidents/ladder-accidents - 76 clicks, Pos: 5.9

CORE WEB VITALS:
├── LCP: 1.8s (Good) ✓
├── FID: 45ms (Good) ✓
└── CLS: 0.05 (Good) ✓

Mobile usability: 175/175 pages pass ✓
```

### Weekly Summary
```
WEEKLY GSC SUMMARY - Week of [Date]

PERFORMANCE TRENDS:
         Clicks    Impr    CTR    Pos
Week 1:  1,247   45,892   2.72%  14.3
Week 2:  1,112   42,456   2.62%  15.1
Week 3:  1,034   39,234   2.64%  15.8
Week 4:    987   36,123   2.73%  16.2

Trend: Improving ↑

NEW INDEXED PAGES THIS WEEK:
- /blog/brooklyn-scaffold-incident-jan-2025
- /blog/queens-construction-safety-update
- /locations/new-suburb (new location page)

POSITION CHANGES (Significant):
Improved:
- "scaffold accident lawyer" +3.2 (now #5)
- "brooklyn construction injury" +2.8 (now #4)

Declined:
- "construction worker rights ny" -1.5 (now #12)

ISSUES TO ADDRESS:
1. 2 pages with "Crawled - not indexed"
   - /blog/old-post-duplicate
   - /test-page (should delete)

2. Mobile CLS warning on /settlement-calculator
   - Current: 0.18 (Needs Improvement)
   - Action: Fix layout shift on form load
```

## Alert Conditions

### Critical Alerts (Immediate)
- Indexed pages drop >10%
- Any manual action received
- Security issues detected
- Core Web Vitals fail for >20% pages

### Warning Alerts (Daily Review)
- Indexed pages drop >5%
- CTR drops >1pp week-over-week
- Average position rises >3
- New crawl errors appear

### Info Alerts (Weekly Review)
- New pages indexed
- Keyword position changes >5
- Mobile usability warnings

## Tracking Queries

### Target Keywords
```javascript
const targetKeywords = [
  // Location keywords
  'construction accident lawyer [city]',
  'construction injury attorney [city]',
  // Accident type keywords
  'scaffold accident lawyer nyc',
  'ladder fall attorney new york',
  'falling object injury lawyer',
  // General keywords
  'labor law 240 lawyer',
  'scaffold law attorney',
  'construction worker rights ny'
];
```

### Position Tracking
For each target keyword:
- Track daily position
- 7-day rolling average
- Alert on drops >5 positions
- Celebrate gains into top 3

## Integration Points
- Daily cron job data pull
- Dashboard widgets
- Slack alerts for critical issues
- Weekly email summary

## Related Agents
- ranking-tracker.md
- crawl-error-detector.md
- page-speed-monitor.md
