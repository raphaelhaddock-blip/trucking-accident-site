# Ranking Tracker Agent

## Purpose
Track keyword rankings across target search terms to measure SEO effectiveness and identify opportunities.

## Trigger
- Daily automated position checks
- On-demand for specific keywords
- After major content updates

## Target Keywords

### Tier 1: High Priority (Check Daily)
Location + Service keywords (highest conversion intent):
```
"construction accident lawyer brooklyn"
"construction accident lawyer queens"
"construction accident lawyer manhattan"
"construction accident lawyer bronx"
"construction accident attorney nyc"
"scaffold accident lawyer new york"
"labor law 240 attorney"
```

### Tier 2: Medium Priority (Check 3x/week)
Accident type keywords:
```
"scaffold fall lawyer nyc"
"ladder accident attorney new york"
"falling object injury lawyer ny"
"construction fall lawyer"
"roof fall accident attorney"
"trench collapse lawyer"
```

### Tier 3: Long Tail (Check Weekly)
Specific/informational keywords:
```
"labor law 240 what is covered"
"construction accident settlement amounts ny"
"can undocumented workers sue for injury"
"workers comp vs personal injury construction"
```

## Data Collection

### API Options
```javascript
// Option 1: SerpApi
const SerpApi = require('google-search-results-nodejs');
const search = new SerpApi.GoogleSearch(API_KEY);

async function checkRanking(keyword) {
  const params = {
    q: keyword,
    location: 'New York, United States',
    gl: 'us',
    hl: 'en',
    num: 100
  };

  const results = await search.json(params);

  // Find our domain in results
  const ourDomain = 'nyconstructionadvocate.com';
  for (let i = 0; i < results.organic_results.length; i++) {
    if (results.organic_results[i].link.includes(ourDomain)) {
      return {
        position: i + 1,
        url: results.organic_results[i].link,
        title: results.organic_results[i].title
      };
    }
  }
  return { position: null, url: null }; // Not in top 100
}
```

### Data Storage
```sql
CREATE TABLE keyword_rankings (
  id SERIAL PRIMARY KEY,
  keyword VARCHAR(255),
  position INT,
  url VARCHAR(500),
  checked_at TIMESTAMP,
  device VARCHAR(20), -- 'desktop' or 'mobile'
  location VARCHAR(100)
);

-- Index for fast lookups
CREATE INDEX idx_keyword_date ON keyword_rankings(keyword, checked_at);
```

## Position Categories

| Position | Category | Value |
|----------|----------|-------|
| 1-3 | Top 3 | Excellent - maximum visibility |
| 4-10 | Page 1 | Good - visible above fold |
| 11-20 | Page 2 | Fair - some traffic |
| 21-50 | Page 3-5 | Poor - minimal traffic |
| 50+ | Deep | Very Poor - no traffic |
| Not found | N/A | Not ranking |

## Output Report

### Daily Position Report
```
RANKING REPORT - [Date]

SUMMARY:
├── Top 3 positions: 8 keywords
├── Page 1 (1-10): 23 keywords
├── Page 2 (11-20): 12 keywords
├── Page 3+ (21+): 5 keywords
└── Not ranking: 2 keywords

TIER 1 KEYWORDS (High Priority):
Keyword                                    Pos   Change  URL
────────────────────────────────────────────────────────────
construction accident lawyer brooklyn      4     -       /locations/brooklyn
construction accident lawyer queens        6     ↑2      /locations/queens
construction accident lawyer manhattan     3     ↑1      /locations/manhattan
construction accident lawyer bronx         8     -       /locations/bronx
construction accident attorney nyc         5     ↓1      /
scaffold accident lawyer new york          4     ↑3      /accidents/scaffold-falls
labor law 240 attorney                     2     -       /labor-law-240

SIGNIFICANT CHANGES (±3 positions):
↑ scaffold accident lawyer new york: 7 → 4 (+3)
↑ ladder fall attorney queens: 15 → 11 (+4)
↓ construction injury bronx: 6 → 10 (-4)

NEW RANKINGS:
+ "queens scaffold collapse lawyer" - Position 18
+ "brooklyn construction fall settlement" - Position 24

LOST RANKINGS:
- "construction accident settlement calculator" - Was #34, now not in top 100
```

### Weekly Trend Report
```
WEEKLY RANKING TRENDS - Week of [Date]

OVERALL VISIBILITY SCORE: 78/100 (+3 vs last week)

POSITION DISTRIBUTION TREND:
         Top 3   Page 1   Page 2   Page 3+   Lost
Week 1:    8       23       12        5        2
Week 2:    7       21       14        6        2
Week 3:    6       22       13        5        4
Week 4:    8       23       12        5        2

BEST PERFORMERS (Most Improved):
1. "scaffold fall lawyer nyc" - 12 → 4 (+8)
2. "queens construction injury attorney" - 18 → 9 (+9)
3. "labor law 240 brooklyn" - 8 → 3 (+5)

DECLINING (Need Attention):
1. "construction worker rights" - 5 → 11 (-6)
2. "fall from height lawyer" - 9 → 15 (-6)

COMPETITOR MOVEMENTS:
- competitor1.com gained "scaffold lawyer nyc" (now #3, we're #4)
- competitor2.com dropped from page 1 for "labor law 240"

OPPORTUNITIES:
Keywords we rank 11-20 that could move to page 1:
1. "ladder accident settlement ny" - Position 12, 1,200 monthly searches
2. "construction fall compensation" - Position 14, 890 monthly searches
3. "scaffold injury claim" - Position 11, 720 monthly searches
```

## Alert Thresholds

### Immediate Alert
- Top 3 keyword drops out of top 10
- Any Tier 1 keyword drops >5 positions
- Competitor takes #1 for priority keyword

### Daily Alert
- Tier 1 keyword drops >3 positions
- New competitor enters top 3 for target keyword
- Any keyword drops off page 1

### Weekly Alert
- Overall visibility score drops >10%
- Lost rankings for >3 keywords
- No improvement in any keyword

## Competitor Tracking

### Competitors to Monitor
```javascript
const competitors = [
  'constructionaccidentlawyers.com',
  'nyinjurylawyers.com',
  'weitzlux.com',
  'cellino.com',
  'levinperconti.com'
];
```

### Track Their Rankings
For each target keyword:
- Our position
- Top 5 competitors' positions
- Identify gaps and opportunities

## Integration Points
- Daily cron job (6 AM)
- Dashboard position tracker widget
- Slack alerts for significant changes
- Weekly email summary

## Related Agents
- gsc-monitor.md
- competitor-monitor.md
- content-freshness-monitor.md
