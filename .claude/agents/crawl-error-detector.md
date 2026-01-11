# Crawl Error Detector Agent

## Purpose
Identify and fix crawl issues that prevent Google from properly indexing site content.

## Trigger
- Real-time from GSC webhook (if available)
- Daily scan of all URLs
- After deployments
- After content changes

## Error Types to Detect

### Server Errors (5xx)
| Error | Cause | Impact | Fix Priority |
|-------|-------|--------|--------------|
| 500 Internal Server Error | Server/code issue | Critical | Immediate |
| 502 Bad Gateway | Proxy/server issue | Critical | Immediate |
| 503 Service Unavailable | Server overload | High | Same day |
| 504 Gateway Timeout | Slow response | High | Same day |

### Client Errors (4xx)
| Error | Cause | Impact | Fix Priority |
|-------|-------|--------|--------------|
| 404 Not Found | Page deleted/moved | High | Same day |
| 410 Gone | Intentionally removed | Low | Verify intent |
| 403 Forbidden | Access denied | High | Investigate |
| 401 Unauthorized | Auth required | High | Check config |

### Redirect Issues
| Issue | Description | Impact |
|-------|-------------|--------|
| Redirect chain | A → B → C | Moderate |
| Redirect loop | A → B → A | Critical |
| Soft 404 | 200 status, no content | High |
| Meta refresh redirect | HTML redirect | Moderate |

### Crawl Issues
| Issue | Description | Impact |
|-------|-------------|--------|
| Blocked by robots.txt | Unintentional block | Critical |
| Noindex tag | Prevents indexing | High |
| Canonical mismatch | Wrong canonical | Moderate |
| Slow page load | >5s response | Moderate |

## Detection Methods

### URL Status Check
```javascript
async function checkUrlStatus(url) {
  const startTime = Date.now();

  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'manual', // Don't follow redirects automatically
      timeout: 10000
    });

    const responseTime = Date.now() - startTime;

    return {
      url,
      status: response.status,
      statusText: response.statusText,
      responseTime,
      redirectUrl: response.headers.get('location'),
      contentType: response.headers.get('content-type'),
      hasContent: response.status === 200 ? await checkContent(response) : null
    };
  } catch (error) {
    return {
      url,
      status: 0,
      error: error.message,
      responseTime: Date.now() - startTime
    };
  }
}
```

### Redirect Chain Detection
```javascript
async function followRedirects(url, maxHops = 10) {
  const chain = [url];
  let currentUrl = url;

  for (let i = 0; i < maxHops; i++) {
    const response = await fetch(currentUrl, { redirect: 'manual' });

    if (response.status >= 300 && response.status < 400) {
      const nextUrl = response.headers.get('location');

      // Check for loop
      if (chain.includes(nextUrl)) {
        return { chain, hasLoop: true };
      }

      chain.push(nextUrl);
      currentUrl = nextUrl;
    } else {
      break;
    }
  }

  return {
    chain,
    hasLoop: false,
    chainLength: chain.length,
    finalStatus: await getStatus(currentUrl)
  };
}
```

### Soft 404 Detection
```javascript
async function detectSoft404(url) {
  const response = await fetch(url);
  const html = await response.text();

  // Check for soft 404 indicators
  const indicators = [
    html.length < 1000, // Very short page
    /page not found/i.test(html),
    /404/i.test(html) && response.status === 200,
    /no results/i.test(html),
    /doesn't exist/i.test(html)
  ];

  return {
    url,
    status: response.status,
    isSoft404: indicators.filter(Boolean).length >= 2,
    contentLength: html.length
  };
}
```

## Output Report

### Daily Crawl Report
```
CRAWL ERROR REPORT - [Date]

SUMMARY:
├── URLs checked: 175
├── Healthy (200): 172 (98.3%)
├── Redirects (3xx): 2 (1.1%)
├── Client errors (4xx): 1 (0.6%)
├── Server errors (5xx): 0 (0%)
└── Timeout/unreachable: 0 (0%)

ISSUES FOUND:

❌ 404 NOT FOUND (1):
URL: /blog/deleted-post
Referrers: /blog (sidebar link)
Action: Remove link or restore page

⚠️ REDIRECT CHAINS (1):
/old-page → /redirect-1 → /redirect-2 → /final-page
Chain length: 4 (max recommended: 2)
Action: Update /old-page to redirect directly to /final-page

⚠️ SLOW RESPONSES (2):
URL: /settlement-calculator - 3.2s (threshold: 2s)
URL: /es/evaluacion-de-caso - 2.8s (threshold: 2s)
Action: Investigate server-side rendering performance

✓ NO ISSUES:
- No 5xx errors
- No redirect loops
- No blocked URLs
- No soft 404s detected

RESPONSE TIME DISTRIBUTION:
<1s:   145 URLs (82.9%)
1-2s:   25 URLs (14.3%)
2-3s:    4 URLs (2.3%)
>3s:     1 URL (0.6%)
```

### Error Details
```
ERROR DETAIL: 404 NOT FOUND

URL: /blog/deleted-post
First detected: 2025-01-08
Status: 404 Not Found

IMPACT:
- Internal links pointing to this URL: 3
- External links (if known): 0
- Last known Google index: 2024-12-15

REFERRERS (pages linking to this URL):
1. /blog - sidebar "Recent Posts" widget
2. /accidents/scaffold-falls - "Related reading" section
3. /locations/brooklyn - "News" section

RECOMMENDED ACTIONS:
Option 1: Restore the page if content was accidentally deleted
Option 2: Set up 301 redirect to relevant replacement page
Option 3: Remove all internal links and let 404 naturally expire

SIMILAR URLS (for redirect target):
- /blog/scaffold-safety-tips (related topic)
- /blog/recent-accidents-january (same time period)
```

## Automated Fixes

### Can Auto-Fix
- Update internal links to use final redirect destination
- Update sitemap to remove 404 URLs
- Alert on new 404s immediately

### Requires Human Review
- Deciding redirect targets for deleted content
- Investigating 5xx errors
- Fixing code issues causing errors

## Alert Thresholds

| Condition | Severity | Notification |
|-----------|----------|--------------|
| Any 5xx error | Critical | Immediate (PagerDuty) |
| New 404 with >5 internal links | High | Slack + Email |
| Redirect loop detected | High | Slack + Email |
| Response time >5s | Medium | Daily digest |
| Soft 404 detected | Medium | Daily digest |

## Integration Points
- Post-deployment smoke test
- Daily full-site crawl
- GSC error import
- Dashboard widget
- Sitemap maintenance

## Related Agents
- sitemap-monitor.md
- gsc-monitor.md
- internal-link-auditor.md
