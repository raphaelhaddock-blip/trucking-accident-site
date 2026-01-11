# Page Speed Monitor Agent

## Purpose
Monitor Core Web Vitals and page performance to maintain good user experience and SEO rankings.

## Trigger
- Weekly Lighthouse audits
- After deployments
- On performance degradation alert
- Monthly comprehensive audit

## Core Web Vitals Thresholds

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| **LCP** (Largest Contentful Paint) | ≤2.5s | 2.5-4.0s | >4.0s |
| **FID** (First Input Delay) | ≤100ms | 100-300ms | >300ms |
| **CLS** (Cumulative Layout Shift) | ≤0.1 | 0.1-0.25 | >0.25 |
| **INP** (Interaction to Next Paint) | ≤200ms | 200-500ms | >500ms |

## Additional Metrics

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Time to First Byte (TTFB) | <600ms | >1000ms |
| First Contentful Paint (FCP) | <1.8s | >3.0s |
| Speed Index | <3.4s | >5.8s |
| Time to Interactive (TTI) | <3.8s | >7.3s |
| Total Blocking Time (TBT) | <200ms | >600ms |

## Testing Strategy

### Page Categories
```javascript
const testPages = {
  critical: [
    '/',                           // Homepage
    '/case-evaluation',            // Primary conversion page
    '/labor-law-240',              // High traffic info page
  ],
  high: [
    '/accidents/scaffold-falls',   // Top accident page
    '/locations/brooklyn',         // Top location page
    '/accidents',                  // Category page
    '/locations',                  // Category page
  ],
  sample: [
    // Random sample of 10 location pages
    // Random sample of 5 accident pages
    // Random sample of 3 blog posts
  ]
};
```

### Testing Tools
```javascript
// Lighthouse CI
const lhci = require('@lhci/cli');

async function runLighthouse(url) {
  const result = await lhci.collect({
    url,
    settings: {
      preset: 'desktop', // or 'mobile'
      onlyCategories: ['performance'],
      throttling: {
        cpuSlowdownMultiplier: 4, // Simulate mid-tier mobile
      }
    }
  });
  return result;
}

// PageSpeed Insights API
async function getPageSpeedInsights(url) {
  const response = await fetch(
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${API_KEY}&strategy=mobile`
  );
  return response.json();
}
```

## Output Report

### Weekly Performance Report
```
PAGE SPEED REPORT - Week of [Date]

CORE WEB VITALS SUMMARY:

             Mobile          Desktop
             ──────          ───────
LCP          1.8s (Good)     1.2s (Good)
FID          45ms (Good)     22ms (Good)
CLS          0.05 (Good)     0.03 (Good)
INP          156ms (Good)    89ms (Good)

Status: All Core Web Vitals PASSING ✓

LIGHTHOUSE SCORES (Mobile):
Page                          Perf   Access   Best    SEO
──────────────────────────────────────────────────────────
/                              92      98      100     100
/case-evaluation               89      97      100     100
/labor-law-240                 91      98      100     100
/accidents/scaffold-falls      88      98      100     100
/locations/brooklyn            90      98      100     100
Average                        90      97.8    100     100

PERFORMANCE BY PAGE TYPE:
- Homepage: 92
- Conversion pages: 89 avg
- Location pages: 87 avg
- Accident pages: 86 avg
- Blog posts: 91 avg

SLOWEST PAGES:
1. /settlement-calculator - 78 (heavy JS)
2. /es/evaluacion-de-caso - 82 (large form)
3. /locations/queens - 84 (many images)

IMPROVEMENTS NEEDED:
1. /settlement-calculator
   - LCP: 3.1s (Needs Improvement)
   - Issue: Large JavaScript bundle
   - Fix: Code split calculator component

2. /locations/queens
   - CLS: 0.15 (Needs Improvement)
   - Issue: Images without dimensions
   - Fix: Add width/height to img tags
```

### Performance Trends
```
PERFORMANCE TRENDS - Last 4 Weeks

Week    Perf Score    LCP      CLS      FID
────────────────────────────────────────────
W1      88           2.0s     0.08     52ms
W2      89           1.9s     0.07     48ms
W3      90           1.8s     0.06     45ms
W4      90           1.8s     0.05     45ms

Trend: Improving ↑

SIGNIFICANT CHANGES:
+ CLS improved 37% (0.08 → 0.05) after image optimization
+ LCP improved 10% (2.0s → 1.8s) after caching changes
- Settlement calculator degraded 5% after new features
```

## Common Performance Issues

### LCP Issues
| Issue | Solution |
|-------|----------|
| Large hero images | Use WebP, proper sizing, lazy load |
| Slow server response | Edge caching, SSG where possible |
| Render-blocking resources | Defer non-critical CSS/JS |
| Large JavaScript | Code splitting, tree shaking |

### CLS Issues
| Issue | Solution |
|-------|----------|
| Images without dimensions | Always set width/height |
| Fonts causing reflow | Use font-display: swap, preload fonts |
| Dynamic content | Reserve space with placeholders |
| Ads/embeds | Reserve space in advance |

### FID/INP Issues
| Issue | Solution |
|-------|----------|
| Long JavaScript tasks | Break up into smaller chunks |
| Heavy event handlers | Debounce, optimize handlers |
| Third-party scripts | Defer, lazy load |
| Main thread blocking | Use web workers |

## Automated Monitoring

### Lighthouse CI Integration
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            https://nyconstructionadvocate.com/
            https://nyconstructionadvocate.com/case-evaluation
          budgetPath: ./lighthouse-budget.json
```

### Performance Budget
```json
{
  "performance": 85,
  "first-contentful-paint": 2000,
  "largest-contentful-paint": 2500,
  "cumulative-layout-shift": 0.1,
  "total-blocking-time": 300
}
```

## Alert Thresholds

| Condition | Severity | Action |
|-----------|----------|--------|
| Performance score <70 | Critical | Immediate investigation |
| Any CWV fails (Poor) | High | Fix within 24 hours |
| Performance drops >10% | Medium | Review in daily standup |
| CWV "Needs Improvement" | Low | Queue for optimization |

## Integration Points
- CI/CD pipeline (Lighthouse CI)
- Weekly cron audit
- Real User Monitoring (RUM)
- Google Search Console CWV report
- Dashboard performance widget

## Related Agents
- gsc-monitor.md
- crawl-error-detector.md
