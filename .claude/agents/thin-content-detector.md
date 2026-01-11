# Thin Content Detector Agent

## Purpose
Ensure all pages meet minimum content requirements to avoid Google thin content penalties.

## Trigger
- Before publishing any new page
- Daily scheduled scan of all pages
- After content edits

## Word Count Thresholds

| Page Type | Minimum Words | Target Words | Status |
|-----------|---------------|--------------|--------|
| Location pages | 2,000 | 2,500+ | Required |
| Accident pages | 3,000 | 3,500+ | Required |
| Blog posts | 800 | 1,200+ | Required |
| Resource pages | 1,500 | 2,000+ | Required |
| Homepage | 500 | 800+ | Required |

## Validation Steps

### 1. Word Count Calculation
```javascript
// Count words excluding:
// - Navigation/footer (shared across pages)
// - Schema JSON-LD
// - Image alt text
// - Button text
// - Meta tags

function countContentWords(page) {
  const mainContent = extractMainContent(page);
  const words = mainContent.split(/\s+/).filter(w => w.length > 0);
  return words.length;
}
```

### 2. Content Quality Check
Beyond word count, verify:
- [ ] Has unique H1
- [ ] Has 3+ H2 sections
- [ ] Has 5+ paragraphs of body content
- [ ] Has FAQ section (5+ questions for location/accident pages)
- [ ] Has internal links (3+ minimum)

### 3. Identify Thin Pages
Flag pages that:
- Fall below word count minimum
- Have <3 H2 sections
- Have <5 FAQs (location/accident pages)
- Have boilerplate-heavy content

## Output Report
```
THIN CONTENT REPORT - [Date]

PASSING: 158 pages
WARNING: 2 pages (approaching minimum)
FAILING: 0 pages

WARNINGS:
- /locations/cortland: 2,012 words (min: 2,000) - CLOSE
- /blog/post-123: 812 words (min: 800) - CLOSE

PAGE TYPE BREAKDOWN:
- Location pages: 111/111 passing (avg: 2,847 words)
- Accident pages: 35/35 passing (avg: 3,421 words)
- Blog posts: 12/12 passing (avg: 1,156 words)
- Resource pages: 4/4 passing (avg: 2,103 words)

Recommendation: All pages meet minimum requirements
```

## Content Expansion Triggers
When a page is flagged as thin:
1. Generate expansion suggestions based on:
   - Missing FAQ topics
   - Additional case examples
   - More detailed legal explanations
   - Local statistics/data
   - Neighborhood/area coverage

2. Queue for content writer review

## Excluded From Count
- Navigation menu text
- Footer content
- Sidebar content
- Schema markup
- Meta descriptions
- Image captions
- Button labels
- Form labels

## Integration Points
- Pre-publish validation hook
- Daily cron job scan
- Dashboard widget

## Related Agents
- uniqueness-validator.md
- freshness-monitor.md
- local-data-injector.md
