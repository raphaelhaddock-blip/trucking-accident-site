# Competitor Monitor Agent

## Purpose
Track competitor activities, rankings, and content to identify opportunities and threats.

## Trigger
- Weekly competitor scan
- On significant ranking changes
- Monthly comprehensive analysis

## Competitors to Track

### Primary Competitors (Direct)
```javascript
const primaryCompetitors = [
  {
    domain: 'constructionaccidentlawyers.com',
    name: 'Construction Accident Lawyers',
    type: 'direct'
  },
  {
    domain: 'cellino.com',
    name: 'Cellino Law',
    type: 'direct'
  },
  {
    domain: 'weitzlux.com',
    name: 'Weitz & Luxenberg',
    type: 'direct'
  },
  {
    domain: 'levinperconti.com',
    name: 'Levin & Perconti',
    type: 'direct'
  }
];
```

### Secondary Competitors (Partial Overlap)
```javascript
const secondaryCompetitors = [
  {
    domain: 'findlaw.com',
    name: 'FindLaw',
    type: 'directory'
  },
  {
    domain: 'avvo.com',
    name: 'Avvo',
    type: 'directory'
  },
  {
    domain: 'justia.com',
    name: 'Justia',
    type: 'directory'
  }
];
```

## Monitoring Dimensions

### 1. Ranking Comparison
Track competitor positions for all target keywords:
```
Target Keywords (sample):
- construction accident lawyer brooklyn
- scaffold fall attorney nyc
- labor law 240 lawyer
- construction injury settlement ny
```

### 2. Content Analysis
| Metric | What to Track |
|--------|---------------|
| Page count | Total indexed pages |
| New content | New pages published |
| Content depth | Average word count |
| Topics covered | Accident types, locations |
| Blog frequency | Posts per week |

### 3. Backlink Profile
| Metric | What to Track |
|--------|---------------|
| Domain Authority | Overall site strength |
| Total backlinks | Link count |
| Referring domains | Unique linking sites |
| New links | Recent link acquisition |
| Anchor text | Link text distribution |

### 4. Technical SEO
| Metric | What to Track |
|--------|---------------|
| Page speed | Core Web Vitals |
| Mobile optimization | Mobile scores |
| Schema markup | Rich snippet eligibility |
| Site structure | URL patterns, depth |

## Data Collection

### Ranking Data
```javascript
async function getCompetitorRankings(keyword) {
  const results = await serpApi.search({ q: keyword, num: 50 });

  const rankings = {};
  const allDomains = [...primaryCompetitors, ...secondaryCompetitors, { domain: 'nyconstructionadvocate.com' }];

  results.organic_results.forEach((result, index) => {
    allDomains.forEach(competitor => {
      if (result.link.includes(competitor.domain)) {
        rankings[competitor.domain] = {
          position: index + 1,
          url: result.link,
          title: result.title
        };
      }
    });
  });

  return rankings;
}
```

### Content Inventory
```javascript
async function analyzeCompetitorContent(domain) {
  // Get indexed page count
  const indexedPages = await getIndexedCount(domain);

  // Get recent content (via site: search with date filter)
  const recentContent = await getRecentPages(domain, 30); // Last 30 days

  // Analyze content topics
  const topics = await categorizeContent(recentContent);

  return {
    totalPages: indexedPages,
    recentPages: recentContent.length,
    topics
  };
}
```

## Output Report

### Weekly Competitor Report
```
COMPETITOR ANALYSIS - Week of [Date]

RANKING COMPARISON (Top Keywords):

Keyword: "construction accident lawyer brooklyn"
Position | Domain                          | Change
─────────────────────────────────────────────────
    1    | constructionaccidentlawyers.com |  -
    2    | cellino.com                     |  ↑1
    3    | weitzlux.com                    |  ↓1
    4    | nyconstructionadvocate.com      |  -  ← US
    5    | avvo.com                        |  -

Keyword: "scaffold fall lawyer nyc"
Position | Domain                          | Change
─────────────────────────────────────────────────
    1    | nyconstructionadvocate.com      |  ↑2 ← US (WINNING!)
    2    | constructionaccidentlawyers.com |  ↓1
    3    | weitzlux.com                    |  ↓1
    4    | levinperconti.com               |  -

[Additional keywords...]

OVERALL RANKING SUMMARY:
                                    Top 3   Page 1   Page 2+
nyconstructionadvocate.com            8       23        5
constructionaccidentlawyers.com      12       28        2
cellino.com                          10       25        3
weitzlux.com                          9       24        4

CONTENT ACTIVITY:
Domain                           | New Pages (30d) | Total Pages
────────────────────────────────────────────────────────────────
constructionaccidentlawyers.com  |      12         |   450
cellino.com                      |       8         |   380
weitzlux.com                     |       5         |   520
nyconstructionadvocate.com       |      15         |   175 ← US

NOTABLE COMPETITOR MOVES:
1. constructionaccidentlawyers.com launched 5 new borough-specific pages
   - /brooklyn-scaffold-accidents
   - /queens-fall-injuries
   Action: Verify our location pages rank for these terms

2. cellino.com published blog series on Labor Law 240 updates
   Action: Consider similar content, ensure we're covering topic

3. weitzlux.com improved mobile speed (was 65, now 82)
   Action: Monitor their ranking changes
```

### Content Gap Analysis
```
CONTENT GAP ANALYSIS

Topics competitors cover that we DON'T:
1. "Construction accident settlements by injury type" - 3 competitors have this
   Opportunity: Create detailed settlement range guide

2. "Union vs non-union construction accidents" - 2 competitors cover
   Opportunity: Add section to labor law page

3. "Workers comp claim timeline NY" - 4 competitors rank
   Opportunity: Create resource page

Topics we cover that competitors DON'T:
1. Settlement calculator - Unique differentiator ✓
2. Spanish language content - Only 1 competitor has this
3. Comprehensive location pages - More detailed than competitors

KEYWORD OPPORTUNITIES:
Keywords where competitors rank but we don't:
1. "construction site injury compensation ny" - Vol: 480, Diff: 35
2. "scaffold law new york explained" - Vol: 320, Diff: 28
3. "construction accident lawyer near me" - Vol: 1,200, Diff: 45
```

### Backlink Comparison
```
BACKLINK PROFILE COMPARISON

Domain                           | DA  | Links    | Domains  | New (30d)
────────────────────────────────────────────────────────────────────────
constructionaccidentlawyers.com  | 58  | 12,400   | 890      | 45
cellino.com                      | 62  | 28,000   | 1,240    | 78
weitzlux.com                     | 65  | 35,000   | 1,890    | 52
nyconstructionadvocate.com       | 28  | 450      | 85       | 12 ← US

LINK BUILDING OPPORTUNITIES:
Sites linking to competitors but not us:
1. constructiondive.com - Links to 3 competitors
2. law.com - Links to 2 competitors
3. nycourts.gov (resource page) - Links to 1 competitor
```

## Alert Conditions

### High Priority
- Competitor takes #1 for priority keyword we had
- Competitor launches location pages matching ours
- Competitor DA increases >5 points

### Medium Priority
- New competitor enters top 10 for target keyword
- Competitor publishes content on our unique topics
- Competitor improves Core Web Vitals significantly

### Low Priority
- Competitor publishes routine blog content
- Minor ranking fluctuations (±1-2 positions)
- Competitor social media activity

## Competitive Response Playbook

| Competitor Action | Our Response |
|-------------------|--------------|
| New location pages | Ensure ours rank higher, add unique content |
| Blog series on topic | Create comprehensive guide |
| Improved speed | Audit our performance |
| New backlinks from quality site | Pursue same opportunities |
| Takes our #1 ranking | Analyze their page, improve ours |

## Integration Points
- Weekly cron job
- Dashboard competitor widget
- Slack alerts for major changes
- Monthly strategy review input

## Related Agents
- ranking-tracker.md
- gsc-monitor.md
- freshness-monitor.md
