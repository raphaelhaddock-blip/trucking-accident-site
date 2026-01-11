# Meta Validator Agent

## Purpose
Ensure every page has unique, optimized meta titles and descriptions to maximize CTR and avoid duplicate meta penalties.

## Trigger
- Before publishing any page
- Daily scan of all pages
- After bulk content updates

## Meta Requirements

### Title Tag
| Requirement | Specification |
|-------------|---------------|
| Length | 50-60 characters (hard limit: 70) |
| Uniqueness | 100% unique across site |
| Primary keyword | Within first 60 characters |
| Brand | Optional suffix ": NY Construction Advocate" |
| Format | "[Location/Topic] Construction Accident Lawyer \| Free Consultation" |

### Meta Description
| Requirement | Specification |
|-------------|---------------|
| Length | 120-160 characters (optimal: 155) |
| Uniqueness | 100% unique across site |
| Call to action | Include CTA phrase |
| Location keyword | Include for location pages |
| Value proposition | Free consultation, no fee unless win |

## Validation Rules

### Title Validation
```javascript
function validateTitle(title, pageType, location) {
  const errors = [];

  // Length check
  if (title.length < 30) errors.push("Title too short (<30 chars)");
  if (title.length > 70) errors.push("Title too long (>70 chars)");

  // Uniqueness (check against all other titles)
  if (isDuplicate(title)) errors.push("Duplicate title found");

  // Keyword presence
  if (pageType === 'location' && !title.includes(location)) {
    errors.push("Location name missing from title");
  }

  // Legal terms presence
  if (!title.match(/lawyer|attorney|legal/i)) {
    errors.push("No legal keyword in title");
  }

  return errors;
}
```

### Description Validation
```javascript
function validateDescription(desc, pageType, location) {
  const errors = [];

  // Length check
  if (desc.length < 100) errors.push("Description too short");
  if (desc.length > 160) errors.push("Description may be truncated (>160)");

  // Uniqueness
  if (isDuplicate(desc)) errors.push("Duplicate description found");

  // CTA presence
  if (!desc.match(/free|consultation|call|contact/i)) {
    errors.push("No CTA in description");
  }

  // Location for location pages
  if (pageType === 'location' && !desc.includes(location)) {
    errors.push("Location missing from description");
  }

  return errors;
}
```

## Page Type Templates

### Location Pages
```
Title: [City] Construction Accident Lawyer | Free Consultation
       Brooklyn Construction Accident Lawyer | Free Consultation (53 chars)

Description: Injured on a [City] construction site? Get free legal help from
Labor Law 240 specialists. No fee unless we win your case.
(Brooklyn example: 134 chars)
```

### Accident Pages
```
Title: [Accident Type] Lawyer NYC | Labor Law 240 Specialists
       Scaffold Fall Lawyer NYC | Labor Law 240 Specialists (52 chars)

Description: Hurt in a [accident type]? New York's Labor Law 240 may entitle
you to full compensation. Free case review - no obligation.
```

### Blog Posts
```
Title: [Compelling Headline] | NY Construction Advocate
       Brooklyn Scaffold Collapse Injures 3 Workers | NY Construction Advocate

Description: [Summary of article with hook]. Learn about your rights and
how Labor Law 240 protects injured construction workers.
```

## Output Report
```
META VALIDATION REPORT - [Date]

SUMMARY:
- Pages checked: 160
- Passing: 157 (98.1%)
- Warnings: 2 (1.3%)
- Failing: 1 (0.6%)

FAILURES:
1. /blog/new-post
   Title: "Construction Accident" (too short, missing location)
   Description: Missing

WARNINGS:
1. /locations/albany
   Title: 68 chars (close to limit)
   Recommendation: Shorten to <60 chars

2. /accidents/ladder-accidents
   Description: 162 chars (may truncate)
   Recommendation: Trim to 155 chars

DUPLICATES FOUND:
None

LENGTH DISTRIBUTION:
Titles:
- <50 chars: 12 pages
- 50-60 chars: 128 pages (optimal)
- 60-70 chars: 20 pages

Descriptions:
- <120 chars: 5 pages
- 120-155 chars: 145 pages (optimal)
- >155 chars: 10 pages
```

## Uniqueness Tracking

### Database Schema
```sql
CREATE TABLE meta_tags (
  page_url VARCHAR(255) PRIMARY KEY,
  title VARCHAR(100),
  description VARCHAR(200),
  title_hash VARCHAR(64),  -- For quick duplicate detection
  desc_hash VARCHAR(64),
  last_checked TIMESTAMP
);
```

### Duplicate Detection
- Hash all titles and descriptions
- Alert if any hash matches another page
- Consider near-duplicates (>80% similar)

## Integration Points
- generateMetadata() function in Next.js
- Pre-publish validation hook
- Daily cron scan
- Sitemap generation

## Related Agents
- h1-h2-validator.md
- schema-validator.md
- uniqueness-validator.md
