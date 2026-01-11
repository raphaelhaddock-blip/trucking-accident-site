# H1/H2 Validator Agent

## Purpose
Ensure proper heading hierarchy on all pages for SEO and accessibility compliance.

## Trigger
- Before publishing any page
- Weekly scan of all pages
- After template changes

## Heading Requirements

### H1 Tag
| Requirement | Specification |
|-------------|---------------|
| Count | Exactly 1 per page |
| Length | 20-70 characters |
| Keyword | Contains primary keyword |
| Uniqueness | Unique across entire site |
| Position | First heading on page |

### H2 Tags
| Requirement | Specification |
|-------------|---------------|
| Minimum count | 3 per page |
| Maximum count | 10-15 recommended |
| Hierarchy | Must follow H1, before any H3 |
| Content | Should outline page sections |

### H3-H6 Tags
| Requirement | Specification |
|-------------|---------------|
| Hierarchy | No skipping levels (H2 → H4 is wrong) |
| Usage | Support H2 sections |
| Count | As needed |

## Validation Rules

### Structure Check
```javascript
function validateHeadingStructure(page) {
  const errors = [];
  const headings = extractHeadings(page);

  // H1 count
  const h1Count = headings.filter(h => h.level === 1).length;
  if (h1Count === 0) errors.push("Missing H1");
  if (h1Count > 1) errors.push(`Multiple H1s found (${h1Count})`);

  // H1 position
  if (headings[0]?.level !== 1) {
    errors.push("H1 is not the first heading");
  }

  // H2 count
  const h2Count = headings.filter(h => h.level === 2).length;
  if (h2Count < 3) errors.push(`Only ${h2Count} H2s (minimum 3)`);

  // Hierarchy check
  let prevLevel = 0;
  for (const h of headings) {
    if (h.level > prevLevel + 1) {
      errors.push(`Skipped heading level: H${prevLevel} → H${h.level}`);
    }
    prevLevel = h.level;
  }

  return errors;
}
```

### Content Check
```javascript
function validateHeadingContent(page, pageType, keywords) {
  const warnings = [];
  const h1 = getH1(page);

  // H1 length
  if (h1.length < 20) warnings.push("H1 too short (<20 chars)");
  if (h1.length > 70) warnings.push("H1 too long (>70 chars)");

  // Keyword in H1
  if (!containsKeyword(h1, keywords.primary)) {
    warnings.push("Primary keyword missing from H1");
  }

  // H1 uniqueness
  if (isDuplicateH1(h1)) {
    warnings.push("Duplicate H1 found on another page");
  }

  return warnings;
}
```

## Page Type Standards

### Location Pages
```html
<h1>Brooklyn Construction Accident Lawyers</h1>  <!-- Primary keyword + location -->
<h2>Construction Accidents in Brooklyn</h2>       <!-- Context section -->
<h2>Your Rights Under Labor Law 240</h2>          <!-- Legal section -->
<h2>Common Accidents in Brooklyn</h2>             <!-- Accident types -->
<h2>Brooklyn Neighborhoods We Serve</h2>          <!-- Local section -->
<h2>Frequently Asked Questions</h2>               <!-- FAQ section -->
<h2>Get Your Free Case Evaluation</h2>            <!-- CTA section -->
```

### Accident Pages
```html
<h1>Scaffold Fall Accident Lawyers in New York</h1>
<h2>Understanding Scaffold Accidents</h2>
<h2>Labor Law 240 Protection for Scaffold Falls</h2>
<h2>Common Causes of Scaffold Accidents</h2>
<h2>Injuries from Scaffold Falls</h2>
<h2>What to Do After a Scaffold Accident</h2>
<h2>Frequently Asked Questions</h2>
```

### Blog Posts
```html
<h1>[Compelling, Specific Headline About Incident]</h1>
<h2>What Happened</h2>
<h2>Legal Implications Under Labor Law 240</h2>
<h2>How This Affects Injured Workers</h2>
<h2>Prevention Measures</h2>
```

## Output Report
```
HEADING STRUCTURE REPORT - [Date]

SUMMARY:
- Pages checked: 160
- Passing: 158 (98.8%)
- Warnings: 2 (1.2%)
- Failing: 0

STRUCTURE ANALYSIS:
- Single H1: 160/160 pages ✓
- 3+ H2s: 158/160 pages
- No skipped levels: 160/160 pages ✓

WARNINGS:
1. /blog/quick-update
   Issue: Only 2 H2 tags (minimum is 3)
   H2s found: "The Incident", "Legal Analysis"
   Suggestion: Add "Prevention" or "Resources" section

2. /locations/small-town
   Issue: H1 is 72 characters (exceeds 70)
   Current: "Small Town Construction Accident Lawyers - Free Consultation Available"
   Suggestion: "Small Town Construction Accident Lawyers | Free Consultation"

H1 LENGTH DISTRIBUTION:
- <30 chars: 0 pages
- 30-50 chars: 45 pages
- 50-70 chars: 115 pages (optimal)
- >70 chars: 0 pages

DUPLICATE H1s:
None found ✓

COMMON H2 PATTERNS:
- "Frequently Asked Questions" - 146 pages
- "Get Your Free Case Evaluation" - 142 pages
- "Your Rights Under Labor Law 240" - 111 pages (location pages)
```

## Accessibility Considerations

### Screen Reader Compatibility
- Headings should describe section content
- Avoid headings that only make sense visually
- Don't use headings for styling only

### Skip Navigation
- H1 should be reachable via skip link
- Main content should start after H1

## Integration Points
- React component structure
- Pre-publish validation
- Template enforcement
- Accessibility audits

## Related Agents
- meta-validator.md
- schema-validator.md
