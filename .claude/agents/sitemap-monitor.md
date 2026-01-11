# Sitemap Monitor Agent

## Purpose
Ensure the sitemap is complete, accurate, and properly maintained for optimal Google crawling and indexation.

## Trigger
- After any page publish/unpublish
- Daily verification scan
- After bulk content changes

## Sitemap Requirements

### XML Structure
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://nyconstructionadvocate.com/page</loc>
    <lastmod>2025-01-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

### Priority Guidelines
| Page Type | Priority | Change Frequency |
|-----------|----------|------------------|
| Homepage | 1.0 | weekly |
| Case evaluation | 0.9 | monthly |
| Labor Law 240 | 0.9 | monthly |
| Accident types | 0.8 | monthly |
| Locations | 0.7 | monthly |
| Blog posts | 0.7 | monthly |
| Resources | 0.7 | monthly |
| About/Privacy/Terms | 0.3-0.5 | yearly |

### URL Requirements
- All URLs must return 200 status
- No redirect URLs in sitemap
- No duplicate URLs
- Canonical URLs only
- Proper encoding for special characters

## Validation Checks

### Completeness Check
```javascript
async function checkSitemapCompleteness() {
  const sitemapUrls = await parseSitemap('/sitemap.xml');
  const allPages = await getAllPublishedPages();

  const missing = allPages.filter(page =>
    !sitemapUrls.includes(page.url)
  );

  const orphaned = sitemapUrls.filter(url =>
    !allPages.find(p => p.url === url)
  );

  return { missing, orphaned };
}
```

### URL Validation
```javascript
async function validateSitemapUrls() {
  const sitemapUrls = await parseSitemap('/sitemap.xml');
  const issues = [];

  for (const url of sitemapUrls) {
    const response = await fetch(url, { method: 'HEAD' });

    if (response.status !== 200) {
      issues.push({
        url,
        status: response.status,
        issue: response.status === 301 ? 'redirect' : 'error'
      });
    }
  }

  return issues;
}
```

### Lastmod Accuracy
```javascript
async function verifyLastmodDates() {
  const sitemapEntries = await parseSitemapWithDates('/sitemap.xml');
  const issues = [];

  for (const entry of sitemapEntries) {
    const page = await getPage(entry.url);
    const actualLastMod = page.updatedAt;

    if (entry.lastmod !== actualLastMod) {
      issues.push({
        url: entry.url,
        sitemapDate: entry.lastmod,
        actualDate: actualLastMod
      });
    }
  }

  return issues;
}
```

## Sitemap Generation Source
Location: `/src/app/sitemap.ts`

```typescript
// Current implementation
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...mainPages,
    ...resourcePages,
    ...accidentPages,      // From accidents-data.ts
    ...locationPages,      // From locations-data.ts
    ...blogPages,          // From blog-data.ts
    ...spanishPages
  ];
}
```

## Output Report
```
SITEMAP HEALTH REPORT - [Date]

SUMMARY:
- Total URLs in sitemap: 175
- Valid URLs (200): 175 (100%)
- Redirects (301): 0
- Errors (4xx/5xx): 0

COMPLETENESS:
- Published pages: 175
- In sitemap: 175
- Missing from sitemap: 0
- Orphaned in sitemap: 0

BY PAGE TYPE:
- Main pages: 12/12 ✓
- Location pages: 111/111 ✓
- Accident pages: 35/35 ✓
- Blog posts: 12/12 ✓
- Resource pages: 4/4 ✓
- Spanish pages: 5/5 ✓

LASTMOD ACCURACY:
- Accurate dates: 170 (97.1%)
- Stale dates: 5 (update needed)

STALE LASTMOD:
1. /blog/post-1 - sitemap: 2024-12-01, actual: 2025-01-05
2. /locations/cortland - sitemap: 2024-11-15, actual: 2025-01-08

PRIORITY DISTRIBUTION:
- 1.0 (highest): 1 page
- 0.9: 3 pages
- 0.8: 47 pages
- 0.7: 124 pages
- 0.3-0.5: 3 pages

GOOGLE SUBMISSION STATUS:
- Last submitted: [Date]
- Last crawled: [Date]
- Indexed: 168/175 (96%)
- Excluded: 7 (checking...)
```

## Sitemap Index (If Needed)
For sites with 50,000+ URLs or 50MB+ sitemaps:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://site.com/sitemap-main.xml</loc>
    <lastmod>2025-01-10</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://site.com/sitemap-locations.xml</loc>
    <lastmod>2025-01-10</lastmod>
  </sitemap>
</sitemapindex>
```

## Google Search Console Integration

### Submission
```bash
# Submit sitemap via GSC API
curl -X POST \
  "https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fnyconstructionadvocate.com/sitemaps/https%3A%2F%2Fnyconstructionadvocate.com%2Fsitemap.xml" \
  -H "Authorization: Bearer $GSC_TOKEN"
```

### Monitoring
- Track indexed vs submitted count
- Alert if indexed drops >5%
- Monitor for crawl errors

## Automated Actions

### On Page Publish
1. Add URL to sitemap
2. Set appropriate lastmod
3. Trigger sitemap revalidation
4. Request GSC indexing (optional)

### On Page Unpublish
1. Remove URL from sitemap
2. Ensure 410 or redirect
3. Trigger sitemap revalidation

### Daily Maintenance
1. Verify all URLs return 200
2. Update stale lastmod dates
3. Check for new orphans
4. Sync with GSC

## Integration Points
- Next.js sitemap.ts file
- Post-publish webhook
- Daily cron validation
- GSC API integration

## Related Agents
- crawl-error-detector.md
- gsc-monitor.md
- internal-link-auditor.md
