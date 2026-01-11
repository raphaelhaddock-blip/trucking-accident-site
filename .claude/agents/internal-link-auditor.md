# Internal Link Auditor Agent

## Purpose
Maintain a healthy internal linking structure that distributes page authority, helps users navigate, and avoids spam patterns.

## Trigger
- Weekly scheduled audit
- After new pages published
- After content updates with link changes

## Link Requirements

### Minimum Links Per Page
| Page Type | Min Outgoing | Min Incoming |
|-----------|--------------|--------------|
| Location pages | 12 (6 nearby + 6 accidents) | 5 |
| Accident pages | 14 (8 locations + 6 related) | 10 |
| Blog posts | 3 | 2 |
| Resource pages | 5 | 3 |
| Homepage | 20+ | N/A (all pages link back) |

### Maximum Clicks from Homepage
- All pages reachable in ≤3 clicks
- High-priority pages in ≤2 clicks

## Validation Checks

### Link Health
```javascript
function auditInternalLinks(site) {
  const issues = [];

  // Check each page
  for (const page of site.pages) {
    // Count outgoing links
    const outgoing = getInternalLinks(page);
    if (outgoing.length < getMinLinks(page.type)) {
      issues.push({
        page: page.url,
        issue: 'insufficient_outgoing',
        count: outgoing.length,
        minimum: getMinLinks(page.type)
      });
    }

    // Check for broken links
    for (const link of outgoing) {
      if (!pageExists(link.href)) {
        issues.push({
          page: page.url,
          issue: 'broken_link',
          link: link.href
        });
      }
    }
  }

  return issues;
}
```

### Orphan Detection
```javascript
function findOrphanPages(site) {
  const linkedPages = new Set();

  // Build set of all linked pages
  for (const page of site.pages) {
    for (const link of getInternalLinks(page)) {
      linkedPages.add(link.href);
    }
  }

  // Find pages with no incoming links
  return site.pages.filter(p => !linkedPages.has(p.url));
}
```

### Anchor Text Analysis
```javascript
function analyzeAnchorText(site) {
  const anchorCounts = {};

  for (const page of site.pages) {
    for (const link of getInternalLinks(page)) {
      const anchor = link.text.toLowerCase();
      anchorCounts[anchor] = (anchorCounts[anchor] || 0) + 1;
    }
  }

  // Flag over-optimized anchors (same exact text used 20+ times)
  return Object.entries(anchorCounts)
    .filter(([_, count]) => count > 20)
    .map(([anchor, count]) => ({ anchor, count }));
}
```

## Link Patterns

### Good Patterns ✓
- Contextual links within content
- Related content sections
- Breadcrumbs
- Nearby locations lists
- Related accident types
- "Learn more" with descriptive anchors

### Bad Patterns ✗
- Footer link spam (50+ links)
- Exact match anchor text everywhere
- Hidden links (CSS hidden)
- Links in tiny font
- Excessive sidebar links
- Link farms/link wheels

## Cross-Linking Rules

### Location → Accident
Each location page links to 6 relevant accident types based on:
- Construction profile (high-rise, suburban, industrial)
- Regional prevalence
- User search patterns

### Accident → Location
Each accident page links to 8 relevant locations based on:
- Where this accident type is common
- Major cities first (NYC boroughs, then upstate)
- Regional distribution

### Blog → Evergreen
Each blog post links to:
- Relevant accident type page
- Relevant location page (if applicable)
- Related resource page

## Output Report
```
INTERNAL LINK AUDIT - [Date]

SUMMARY:
- Total internal links: 4,832
- Avg links per page: 30.2
- Orphan pages: 0
- Broken links: 0

LINK DISTRIBUTION:
- Location pages: avg 18 outgoing, avg 12 incoming
- Accident pages: avg 22 outgoing, avg 24 incoming
- Blog posts: avg 5 outgoing, avg 3 incoming
- Resource pages: avg 8 outgoing, avg 15 incoming

CLICK DEPTH:
- 1 click from home: 12 pages
- 2 clicks from home: 148 pages
- 3 clicks from home: 0 pages
- 4+ clicks: 0 pages ✓

ISSUES FOUND:
None

WARNINGS:
1. Anchor text "scaffold accidents" used 45 times
   Recommendation: Vary anchor text (e.g., "scaffold fall injuries",
   "falls from scaffolds", "scaffold collapse cases")

2. /blog/old-post has only 2 outgoing links
   Recommendation: Add link to relevant accident type

TOP LINKED PAGES (PageRank proxy):
1. /labor-law-240 - 142 incoming links
2. /accidents - 138 incoming links
3. /case-evaluation - 135 incoming links
4. /accidents/scaffold-falls - 89 incoming links
5. /locations/manhattan - 76 incoming links

ANCHOR TEXT DISTRIBUTION:
- "scaffold falls" - 34 uses
- "ladder accidents" - 28 uses
- "free consultation" - 142 uses
- [Location name] - varies by location
```

## Link Addition Workflow

### When New Page Published
1. Identify related existing pages
2. Add links FROM new page TO related pages
3. Add links FROM related pages TO new page
4. Update sitemap
5. Verify click depth ≤3

### Automated Link Suggestions
Based on cross-linking.ts logic:
- Profile-based matching (location ↔ accident)
- Regional relevance
- Topic similarity

## Integration Points
- Post-publish webhook
- Weekly cron audit
- Dashboard widget
- Content editor suggestions

## Related Agents
- sitemap-monitor.md
- crawl-error-detector.md
