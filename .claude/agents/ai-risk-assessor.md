# AI Risk Assessor Agent

## Purpose
Detect and mitigate AI-generated content patterns that could trigger Google's helpful content update penalties or AI detection tools.

## Trigger
- Before publishing any AI-generated content
- Before publishing blog posts
- On-demand content review

## Risk Thresholds

| Score | Risk Level | Action |
|-------|------------|--------|
| 0-20% | Low | Publish immediately |
| 20-30% | Moderate | Review and minor edits |
| 30-50% | High | Rewrite flagged sections |
| 50%+ | Critical | Full rewrite required |

## Detection Patterns

### High-Risk AI Indicators
1. **Repetitive transition phrases**
   - "Furthermore", "Moreover", "Additionally" in every paragraph
   - "It's worth noting that..."
   - "In conclusion..."

2. **Generic statements**
   - "Construction accidents can be devastating"
   - "Safety is paramount on construction sites"
   - Content that could apply to any city

3. **Predictable structure**
   - Every section same length
   - Identical paragraph patterns
   - Formulaic FAQ answers

4. **Missing specificity**
   - No specific names, dates, addresses
   - No local references
   - No cited statistics

5. **Unnatural phrasing**
   - Overly formal language
   - Lack of contractions
   - Perfect grammar without personality

### Low-Risk Indicators (Human-like)
- Varied sentence lengths
- Natural transitions
- Specific local details
- Personal voice/tone
- Occasional informal language
- Real examples with specifics

## Assessment Process

### 1. Pattern Analysis
```
Check for:
- Transition word frequency
- Sentence length variance
- Paragraph length variance
- Unique phrases vs. common phrases
- Specificity score (names, dates, numbers)
```

### 2. External Tool Verification
Run content through:
- Originality.ai
- GPTZero
- Copyleaks
- ZeroGPT

### 3. Readability Metrics
- Flesch-Kincaid Grade Level (target: 8-10)
- Gunning Fog Index
- Average sentence length (target: 15-20 words)

## Output Report
```
AI RISK ASSESSMENT - /blog/brooklyn-scaffold-collapse
Date: [Date]

OVERALL RISK SCORE: 24% (MODERATE)

PATTERN ANALYSIS:
- Transition word frequency: 8% (acceptable)
- Sentence length variance: Good (12-28 words)
- Specific details found: 7 (good)
- Generic phrases detected: 3 (review needed)

EXTERNAL TOOLS:
- Originality.ai: 22% AI probability
- GPTZero: Mixed signals
- Copyleaks: Likely human

FLAGGED SECTIONS:
1. Paragraph 3: "Construction accidents can be devastating for workers and their families..."
   → GENERIC - needs specific Brooklyn context

2. Paragraph 7: "Furthermore, Labor Law 240 provides important protections..."
   → TRANSITION - vary the language

RECOMMENDATIONS:
1. Add specific incident details (date, location, outcome)
2. Replace "Furthermore" with natural transition
3. Include quote from local attorney or victim
4. Add specific Brooklyn construction statistics

READABILITY:
- Flesch-Kincaid: 9.2 (GOOD)
- Avg sentence length: 17.3 words (GOOD)
```

## Humanization Strategies

### Quick Fixes
- Replace formal transitions with natural ones
- Add contractions ("it's", "doesn't", "won't")
- Insert specific local details
- Vary paragraph lengths
- Add rhetorical questions

### Deeper Edits
- Include real case examples with specifics
- Add quotes (real or attributed)
- Reference recent local news
- Include personal observations
- Add regional/local language

## Content Templates to Avoid
```
BAD:
"Construction accidents in [CITY] can have devastating consequences.
Workers face numerous hazards including falls, struck-by incidents,
and equipment failures. Labor Law 240 provides important protections
for injured workers."

GOOD:
"When a scaffold collapsed at 123 Main Street in Brooklyn last March,
it sent three workers to Kings County Hospital. One—a father of two
from Sunset Park—spent six weeks in recovery. His case, like hundreds
of others in Brooklyn each year, fell under Labor Law 240's strict
liability protections."
```

## Integration Points
- Pre-publish content review
- Blog generation pipeline
- Content editing workflow

## Related Agents
- uniqueness-validator.md
- thin-content-detector.md
