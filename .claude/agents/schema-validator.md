# Schema Validator Agent

## Purpose
Ensure all pages have valid, complete schema.org structured data to maximize rich snippet eligibility and search visibility.

## Trigger
- Before publishing any page
- Weekly validation of all pages
- After schema template changes

## Required Schemas by Page Type

### All Pages
```json
{
  "@type": "Organization",
  "name": "NY Construction Advocate",
  "url": "https://nyconstructionadvocate.com",
  "logo": "...",
  "telephone": "...",
  "email": "..."
}
```

### Location Pages
```json
[
  {
    "@type": "LegalService",
    "name": "NY Construction Advocate - [City]",
    "areaServed": { "@type": "City", "name": "[City]" },
    "parentOrganization": { "@id": "...#organization" }
  },
  {
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "position": 1, "name": "Home", "item": "/" },
      { "position": 2, "name": "Locations", "item": "/locations" },
      { "position": 3, "name": "[City]", "item": "/locations/[slug]" }
    ]
  },
  {
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "...", "acceptedAnswer": { "@type": "Answer", "text": "..." } }
    ]
  }
]
```

### Accident Pages
```json
[
  {
    "@type": "Service",
    "name": "[Accident Type] Legal Assistance",
    "provider": { "@id": "...#organization" },
    "areaServed": { "@type": "State", "name": "New York" }
  },
  { "@type": "BreadcrumbList", "..." },
  { "@type": "FAQPage", "..." }
]
```

### Blog Posts
```json
{
  "@type": "Article",
  "headline": "...",
  "datePublished": "2025-01-01",
  "dateModified": "2025-01-10",
  "author": { "@id": "...#organization" },
  "publisher": { "@id": "...#organization" }
}
```

### Resource Pages
```json
{
  "@type": "HowTo",
  "name": "What To Do After a Construction Accident",
  "step": [
    { "@type": "HowToStep", "position": 1, "name": "...", "text": "..." }
  ]
}
```

## Validation Rules

### Syntax Validation
```javascript
function validateSchemaSyntax(jsonLd) {
  try {
    const parsed = JSON.parse(jsonLd);

    // Must have @context
    if (!parsed['@context']?.includes('schema.org')) {
      return { valid: false, error: 'Missing schema.org context' };
    }

    // Must have @type
    if (!parsed['@type']) {
      return { valid: false, error: 'Missing @type' };
    }

    return { valid: true };
  } catch (e) {
    return { valid: false, error: 'Invalid JSON: ' + e.message };
  }
}
```

### Property Validation
```javascript
function validateSchemaProperties(schema, type) {
  const required = REQUIRED_PROPERTIES[type];
  const missing = [];

  for (const prop of required) {
    if (!schema[prop]) {
      missing.push(prop);
    }
  }

  return missing;
}

const REQUIRED_PROPERTIES = {
  'LegalService': ['name', 'areaServed', 'telephone'],
  'Article': ['headline', 'datePublished', 'author'],
  'FAQPage': ['mainEntity'],
  'BreadcrumbList': ['itemListElement'],
  'HowTo': ['name', 'step'],
  'Service': ['name', 'provider', 'areaServed']
};
```

### Google Rich Results Test
```javascript
async function testWithGoogle(url) {
  // Use Google's Rich Results Test API
  const response = await fetch(
    `https://searchconsole.googleapis.com/v1/urlTestingTools/mobileFriendlyTest:run`,
    { method: 'POST', body: JSON.stringify({ url }) }
  );
  return response.json();
}
```

## Output Report
```
SCHEMA VALIDATION REPORT - [Date]

SUMMARY:
- Pages checked: 160
- Valid schemas: 158 (98.8%)
- Warnings: 2
- Errors: 0

SCHEMA TYPES FOUND:
- LegalService: 111 pages (location pages)
- Service: 35 pages (accident pages)
- Article: 12 pages (blog posts)
- FAQPage: 146 pages
- BreadcrumbList: 158 pages
- HowTo: 4 pages (resource pages)
- Organization: 1 page (global)
- WebSite: 1 page (global)

VALIDATION RESULTS:
✓ All @context values correct
✓ All @type values valid
✓ All required properties present
✓ All URLs properly formatted
✓ All dates in ISO 8601 format

WARNINGS:
1. /locations/cortland
   FAQPage has only 4 questions (recommended: 5+)

2. /blog/old-post
   Article missing dateModified property

GOOGLE RICH RESULTS ELIGIBILITY:
- FAQ snippets: 146/146 eligible
- Breadcrumbs: 158/158 eligible
- Articles: 12/12 eligible
- HowTo: 4/4 eligible

RECOMMENDATIONS:
1. Add 5th FAQ question to Cortland page
2. Add dateModified to old blog post
```

## Common Schema Errors

### Syntax Errors
- Missing quotes around property names
- Trailing commas
- Unescaped characters in strings
- Invalid date formats

### Content Errors
- Empty required fields
- Invalid URLs
- Non-existent @id references
- Mismatched types

### Structure Errors
- Missing @context
- Multiple incompatible types
- Circular references
- Orphaned nested objects

## Schema Testing Process

1. **Local Validation**: JSON syntax + schema.org spec
2. **Staging Test**: Google Rich Results Test
3. **Production Verify**: Search Console enhancement report

## Integration Points
- generateSchema() functions in /lib/schema.ts
- Pre-publish validation hook
- Weekly cron scan
- Google Search Console monitoring

## Related Agents
- meta-validator.md
- h1-h2-validator.md
- gsc-monitor.md
