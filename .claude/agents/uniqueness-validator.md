# Uniqueness Validator Agent

## Purpose
Prevent duplicate or highly similar content across pages to avoid Google duplicate content penalties.

## Trigger
- Before publishing any new page
- Weekly scheduled scan of all pages
- On-demand when content is updated

## Similarity Thresholds
| Level | Similarity | Action |
|-------|-----------|--------|
| Safe | <20% | Pass - content is unique |
| Warning | 20-30% | Review - may need differentiation |
| Block | >30% | Fail - do not publish until unique |

## Validation Steps

### 1. Extract Content
```bash
# For each page, extract main content (excluding navigation, footer, boilerplate)
# Focus on: H1, H2s, body paragraphs, FAQ content
```

### 2. Compare Against Existing Pages
Compare new/updated content against:
- All location pages (111 pages)
- All accident type pages (35 pages)
- All blog posts
- All resource pages

### 3. Calculate Similarity
Methods to use:
- **Jaccard Index**: Word-level overlap
- **Cosine Similarity**: TF-IDF vectors
- **N-gram Overlap**: 3-gram and 5-gram sequences

### 4. Flag Issues
For each page pair with >20% similarity:
- Identify specific overlapping sections
- Highlight the most similar paragraphs
- Suggest differentiation strategies

## Output Report
```
UNIQUENESS REPORT - [Date]
Page: /locations/brooklyn

Comparisons: 160 pages checked
Highest Similarity: 18% (vs /locations/queens)
Status: PASS

Detailed Matches:
- /locations/queens: 18% (FAQ structure similar)
- /locations/manhattan: 15% (Labor Law section)
- /locations/bronx: 12% (CTA section)

Recommendation: Safe to publish
```

## Common Similarity Sources
1. **Boilerplate sections** - CTA, disclaimers, contact info (exclude from check)
2. **Legal explanations** - Labor Law 240 descriptions (acceptable if <25%)
3. **FAQ patterns** - Similar question structures (need unique answers)
4. **Template phrases** - "Injured in [city]?" (acceptable)

## Integration Points
- Pre-publish hook in Sanity CMS
- GitHub Action on content PRs
- Manual trigger via CLI

## Related Agents
- thin-content-detector.md
- ai-risk-assessor.md
