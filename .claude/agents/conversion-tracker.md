# Conversion Tracker Agent

## Purpose
Track all form submissions and conversions to measure site effectiveness and optimize lead generation.

## Trigger
- Real-time on form submission
- Daily analytics aggregation
- Weekly performance reports

## Events to Track

### Form Events
| Event | Trigger | Data Captured |
|-------|---------|---------------|
| form_view | Page load | page_url, referrer, utm_params |
| form_start | First field focus | page_url, timestamp |
| form_progress | Field completion | field_name, time_spent |
| form_abandon | Page exit without submit | last_field, time_on_form |
| form_error | Validation error | field_name, error_type |
| form_submit | Successful submit | all_utm_params, page_url |
| lead_scored | After scoring | lead_tier, score |

### Page Events
| Event | Trigger | Data Captured |
|-------|---------|---------------|
| page_view | Page load | page_type, page_url |
| cta_click | CTA button click | cta_text, destination |
| phone_click | Phone number click | phone_number |
| scroll_depth | 25/50/75/100% scroll | depth_percentage |

## Implementation

### Google Analytics 4
```javascript
// Track form submission
gtag('event', 'form_submit', {
  'event_category': 'lead_generation',
  'event_label': formId,
  'page_location': window.location.href,
  'utm_source': getUtmParam('utm_source'),
  'utm_medium': getUtmParam('utm_medium'),
  'utm_campaign': getUtmParam('utm_campaign')
});

// Track lead quality
gtag('event', 'lead_qualified', {
  'event_category': 'lead_generation',
  'lead_tier': leadScore.tier,
  'lead_score': leadScore.total
});
```

### Meta Pixel
```javascript
// Track form submission
fbq('track', 'Lead', {
  content_name: 'Case Evaluation',
  content_category: 'Construction Accident',
  currency: 'USD',
  value: getLeadValue(leadTier)
});
```

### Server-Side Tracking
```typescript
// In /api/leads/route.ts
async function trackConversion(lead: LeadData, score: LeadScore) {
  // Store in analytics table
  await db.analytics.create({
    event: 'form_submit',
    lead_id: lead.id,
    tier: score.tier,
    score: score.total,
    source: lead.utm_source,
    medium: lead.utm_medium,
    campaign: lead.utm_campaign,
    page_url: lead.source_url,
    timestamp: new Date()
  });

  // Send to GA4 Measurement Protocol (server-side)
  await sendToGA4({
    client_id: lead.client_id,
    events: [{
      name: 'generate_lead',
      params: {
        currency: 'USD',
        value: getLeadValue(score.tier)
      }
    }]
  });
}
```

## Metrics Dashboard

### Real-Time
```
LIVE CONVERSIONS - Last 24 Hours

Total Submissions: 12
├── HOT: 2 (16.7%)
├── QUALIFIED: 5 (41.7%)
├── NURTURE: 4 (33.3%)
└── DISQUALIFIED: 1 (8.3%)

Conversion Rate: 3.2% (12 / 375 visitors)

By Source:
├── Organic: 7 (58.3%)
├── Direct: 3 (25%)
├── Paid: 2 (16.7%)
└── Referral: 0 (0%)
```

### Daily Summary
```
DAILY CONVERSION REPORT - [Date]

OVERALL:
- Unique visitors: 1,247
- Form views: 412 (33% of visitors)
- Form starts: 156 (37.9% of views)
- Submissions: 42 (26.9% of starts)
- Conversion rate: 3.4%

BY LEAD TIER:
- HOT: 8 leads (19%)
- QUALIFIED: 18 leads (43%)
- NURTURE: 14 leads (33%)
- DISQUALIFIED: 2 leads (5%)

BY PAGE:
- /case-evaluation: 28 (66.7%)
- /es/evaluacion-de-caso: 6 (14.3%)
- Homepage widget: 5 (11.9%)
- Location pages: 3 (7.1%)

BY SOURCE:
- Google Organic: 22 (52.4%)
- Direct: 10 (23.8%)
- Google Ads: 6 (14.3%)
- Bing: 2 (4.8%)
- Referral: 2 (4.8%)

TOP CONVERTING PAGES:
1. /accidents/scaffold-falls - 4.8% CVR
2. /locations/brooklyn - 4.2% CVR
3. /labor-law-240 - 3.9% CVR

FUNNEL:
Page View → Form View: 33.0%
Form View → Form Start: 37.9%
Form Start → Submit: 26.9%
Overall: 3.4%
```

### Weekly Trends
```
WEEKLY CONVERSION TRENDS

Week of [Date]:
- Submissions: 287 (+12% vs prior week)
- Conversion rate: 3.6% (+0.3pp)
- Avg lead score: 67.4 (+2.1)

Top performing:
- Best day: Tuesday (52 leads)
- Best hour: 10am-11am (23 leads)
- Best source: Google Organic (156 leads)

Opportunities:
- Mobile CVR 2.1% vs Desktop 4.8%
  → Action: Optimize mobile form UX

- /accidents pages CVR 4.5% vs /locations 2.8%
  → Action: Add more CTAs to location pages
```

## UTM Tracking

### Required Parameters
```
utm_source   - Traffic source (google, facebook, email)
utm_medium   - Marketing medium (organic, cpc, email)
utm_campaign - Campaign name
utm_content  - Ad/link variation (optional)
utm_term     - Paid keyword (optional)
```

### Attribution Model
- First touch: Credit first interaction
- Last touch: Credit last interaction before conversion
- Linear: Equal credit to all touchpoints

## Lead Value Assignment

| Lead Tier | Estimated Value | Rationale |
|-----------|-----------------|-----------|
| HOT | $500 | High intent, immediate need |
| QUALIFIED | $200 | Good fit, moderate urgency |
| NURTURE | $50 | Potential, needs education |
| DISQUALIFIED | $0 | Not a fit |

## Alert Thresholds

### Conversion Rate Alerts
| Condition | Severity | Action |
|-----------|----------|--------|
| CVR drops >20% day-over-day | Warning | Review changes |
| CVR drops >40% day-over-day | Critical | Immediate investigation |
| 0 submissions in 4 hours | Warning | Check form functionality |
| 0 submissions in 8 hours | Critical | Emergency check |

## Integration Points
- Google Analytics 4
- Meta Pixel
- Database analytics table
- Dashboard widgets
- Slack notifications

## Related Agents
- form-validator.md
- lead-scorer.md
