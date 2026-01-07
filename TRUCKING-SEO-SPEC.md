# 18-Wheeler Accident Site - Complete SEO Specification

## Site Structure

```
~250+ pages total:
├── / (homepage)
├── /fmcsa-regulations (pillar)
├── /accidents/[slug] (20 pages)
├── /states/[slug] (50 pages eventually)
├── /states/[state]/[city] (100+ city pages)
├── /blog/[slug] (100+ posts)
├── /about
├── /contact
├── /privacy
├── /terms
└── /disclaimer
```

---

## 1. URL Structure

### Rules
- All lowercase
- Hyphens only (no underscores)
- No trailing slashes (enforce via redirect)
- No parameters for content pages
- Max 60 characters
- Include primary keyword

### Templates
```
Homepage:          /
Pillar:            /fmcsa-regulations
Accidents:         /accidents/{accident-type}
States:            /states/{state-slug}
Cities:            /states/{state-slug}/{city-slug}
Blog:              /blog/{post-slug}
```

### Examples
```
✓ /accidents/jackknife-accidents
✓ /states/texas
✓ /states/texas/houston
✓ /blog/i-10-semi-crash-houston-january-2026

✗ /accidents/Jackknife_Accidents/
✗ /states/TX (use full name)
✗ /states/texas/jackknife (no matrix pages!)
```

---

## 2. H1 Structure

### Rules
- ONE H1 per page (never zero, never two+)
- H1 = primary keyword target
- H1 unique across entire site
- H1 appears first in main content
- 50-70 characters ideal

### Templates

| Page Type | H1 Template | Example |
|-----------|-------------|---------|
| Homepage | 18-Wheeler Accident Lawyers | 18-Wheeler Accident Lawyers |
| Pillar | FMCSA Regulations: Trucking Laws That Protect You | FMCSA Regulations: Trucking Laws That Protect You |
| Accident | [Type] Truck Accidents | Jackknife Truck Accidents |
| State | [State] Truck Accident Lawyer | Texas Truck Accident Lawyer |
| City | [City] 18-Wheeler Accident Attorney | Houston 18-Wheeler Accident Attorney |
| Blog | [Descriptive headline] | I-10 Semi-Truck Crash Kills Three Near Houston |

### Heading Hierarchy
```
H1 - Page title (one per page)
  H2 - Major section
    H3 - Subsection
      H4 - Detail (rarely needed)
```

Never skip levels. Never use headings for styling.

---

## 3. Meta Titles

### Rules
- 50-60 characters (Google truncates at ~60)
- Primary keyword near front
- Brand at end (if space)
- Unique across all pages
- Action-oriented when possible

### Templates

| Page Type | Title Template | Chars |
|-----------|----------------|-------|
| Homepage | 18-Wheeler Accident Lawyers \| Free Consultation | 48 |
| Pillar | FMCSA Trucking Regulations \| Know Your Rights | 47 |
| Accident | [Type] Accident Lawyer \| 18-Wheeler Crash Claims | ~55 |
| State | [State] Truck Accident Lawyer \| Free Consult | ~50 |
| City | [City] 18-Wheeler Accident Attorney \| [State] | ~55 |

### Examples
```
Jackknife Accident Lawyer | 18-Wheeler Crash Claims
Texas Truck Accident Lawyer | Free Consultation
Houston 18-Wheeler Accident Attorney | Texas
FMCSA Hours of Service Violations | Drowsy Trucker Accidents
```

---

## 4. Meta Descriptions

### Rules
- 150-160 characters
- Include primary keyword naturally
- Include call-to-action
- Unique per page
- Compelling (affects CTR)

### Templates

| Page Type | Description Template |
|-----------|---------------------|
| Homepage | Injured in an 18-wheeler crash? Our truck accident lawyers fight for maximum compensation. Free consultation. No fee unless you win. Call now. |
| Pillar | Complete guide to FMCSA trucking regulations. Learn how Hours of Service violations prove negligence. Free case evaluation from experienced attorneys. |
| Accident | Hurt in a [type] truck accident? Semi-truck crashes cause catastrophic injuries. Get free legal help from attorneys who fight trucking companies. |
| State | [State] truck accident lawyer. 18-wheeler crashes require specialized legal expertise. Free consultation with attorneys who know trucking law. |

### Examples
```
Jackknife accident victim? These crashes cause catastrophic injuries. Our attorneys fight trucking companies & their insurers. Free case review. (148 chars)

Texas truck accident lawyer. 18-wheeler crashes on I-10, I-35, I-45 require immediate investigation. Free consultation. No fee unless we win. (144 chars)
```

---

## 5. Canonical Tags

### Rules
- Every page has a self-referencing canonical
- Canonicals are absolute URLs (https://domain.com/path)
- No trailing slashes
- Parameters pages canonical to clean URL

### Implementation
```html
<!-- On /accidents/jackknife-accidents -->
<link rel="canonical" href="https://domain.com/accidents/jackknife-accidents" />

<!-- On /states/texas?ref=google -->
<link rel="canonical" href="https://domain.com/states/texas" />
```

---

## 6. Schema Markup

### Every Page Gets:
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LegalService",
      "@id": "https://domain.com/#organization",
      "name": "[FIRM_NAME]",
      "url": "https://domain.com",
      "telephone": "[PHONE]",
      "areaServed": {
        "@type": "Country",
        "name": "United States"
      },
      "serviceType": ["Truck Accident Law", "18-Wheeler Accidents", "Personal Injury"]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [...]
    },
    {
      "@type": "WebPage",
      "name": "Page Title",
      "description": "Meta description",
      "url": "https://domain.com/page"
    }
  ]
}
```

### Accident Pages Add:
```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What should I do after a jackknife accident?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "..."
      }
    }
  ]
}
```

### State Pages Add:
```json
{
  "@type": "LegalService",
  "name": "Texas Truck Accident Lawyer",
  "areaServed": {
    "@type": "State",
    "name": "Texas"
  }
}
```

---

## 7. Breadcrumbs

### Structure
```
Homepage:
(no breadcrumb)

Pillar:
Home > FMCSA Regulations

Accident pages:
Home > Truck Accidents > Jackknife Accidents

State pages:
Home > States > Texas

City pages:
Home > States > Texas > Houston

Blog:
Home > Blog > [Post Title]
```

---

## 8. Internal Linking

### Click Depth Rule
- No page more than 3 clicks from homepage
- Homepage → Pillar → Accident/State = 2 clicks ✓
- Homepage → State → City = 2 clicks ✓

### Link Equity Flow
```
Homepage (authority)
    ↓
FMCSA Pillar (concentrates)
    ↓
Accidents ←→ States (distributes)
    ↓
Cities & Blog (captures long-tail)
```

### Anchor Text Variation
For `/accidents/jackknife-accidents`:
- "jackknife accidents"
- "jackknife truck crashes"
- "semi-truck jackknife"
- "jackknifed 18-wheeler"
- "jackknife collision lawyer"

### Footer Links
- Top 10 states
- Top 6 accident types
- FMCSA pillar page
- Contact
- Privacy/Terms

---

## 9. Sitemap

### Requirements
- XML sitemap at /sitemap.xml
- All indexable pages included
- Priority values set appropriately
- Updated automatically with new content
- Submitted to Search Console

### Priority Values
```xml
<url>
  <loc>https://domain.com/</loc>
  <priority>1.0</priority>
</url>
<url>
  <loc>https://domain.com/fmcsa-regulations</loc>
  <priority>0.9</priority>
</url>
<url>
  <loc>https://domain.com/accidents/jackknife-accidents</loc>
  <priority>0.8</priority>
</url>
<url>
  <loc>https://domain.com/states/texas</loc>
  <priority>0.8</priority>
</url>
<url>
  <loc>https://domain.com/blog/post-slug</loc>
  <priority>0.6</priority>
</url>
```

---

## 10. Robots.txt

```
User-agent: *
Allow: /

Disallow: /api/
Disallow: /studio/
Disallow: /_next/
Disallow: /thank-you

Sitemap: https://domain.com/sitemap.xml
```

---

## 11. Image Optimization

### Rules
- All images have alt text
- Alt text describes image + includes keyword naturally
- Lazy load below-fold images
- Use next/image for automatic optimization
- WebP format preferred
- Max width: 1200px for content images

### Alt Text Examples
```
Hero image: "18-wheeler truck on highway at night"
Accident illustration: "Diagram showing jackknife truck accident mechanics"
State image: "Semi-truck on Texas I-10 highway"
```

---

## 12. Technical Performance

### Core Web Vitals Targets
- LCP (Largest Contentful Paint): < 2.5s
- INP (Interaction to Next Paint): < 200ms
- CLS (Cumulative Layout Shift): < 0.1

### Lighthouse Targets
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

---

## 13. Keyword Mapping

### Accident Pages
| URL | Primary Keyword | Secondary Keywords |
|-----|-----------------|-------------------|
| /accidents/jackknife-accidents | jackknife accident lawyer | jackknife truck crash, semi jackknife |
| /accidents/rollover-accidents | truck rollover lawyer | 18 wheeler rollover, semi rollover |
| /accidents/underride-accidents | underride accident attorney | underride crash, truck underride |
| /accidents/rear-end-collisions | rear ended by semi | truck rear end, 18 wheeler rear end |

### State Pages
| URL | Primary Keyword | Secondary Keywords |
|-----|-----------------|-------------------|
| /states/texas | texas truck accident lawyer | texas 18 wheeler crash, texas semi accident |
| /states/california | california truck accident lawyer | california semi crash, CA trucking accident |
| /states/florida | florida truck accident lawyer | florida 18 wheeler, FL truck crash |

### Rules
- One primary keyword per page
- No two pages target same primary keyword
- Location pages own "[location] + truck accident lawyer"
- Accident pages own "[type] + accident lawyer"

---

## 14. 404 Page

### Content
```
Page Not Found

Sorry, we couldn't find that page.

Here's what you can do:
- [Go to homepage]
- [View accident types]
- [Find your state]
- [Contact us]

Or call us: [PHONE]
```

---

## 15. Redirects

### 301 Redirect Rules
- Trailing slash → no trailing slash
- HTTP → HTTPS
- www → non-www (pick one, be consistent)

### Implementation (next.config.js)
```javascript
module.exports = {
  async redirects() {
    return [
      {
        source: '/:path+/',
        destination: '/:path+',
        permanent: true,
      },
    ];
  },
};
```

---

## 16. Index/Noindex Rules

### Index (default)
- All content pages
- Homepage, pillar, accidents, states, cities
- Blog posts

### Noindex
- Thank you pages
- Form confirmation pages
- Utility pages
- API routes

---

## 17. Analytics & Tracking

### Required
- Google Analytics 4
- Google Search Console
- Microsoft Clarity (heatmaps) - optional

### Event Tracking
- Form submissions
- Phone clicks
- CTA clicks
- Scroll depth

---

## 18. Mobile-First

### Requirements
- All content accessible on mobile
- Touch targets min 44x44px
- Font size min 16px
- No horizontal scroll
- Tap-to-call phone numbers
- Form inputs properly sized

---

## 19. Page Speed Checklist

- [ ] Images optimized (WebP, lazy loaded)
- [ ] JavaScript minimized
- [ ] CSS minimized
- [ ] Fonts preloaded
- [ ] No render-blocking resources
- [ ] CDN for static assets
- [ ] Caching headers set

---

## 20. Launch Checklist

### Technical
- [ ] All pages have unique H1
- [ ] All pages have unique meta title
- [ ] All pages have unique meta description
- [ ] All pages have canonical tag
- [ ] Schema markup validates
- [ ] Sitemap generated and submitted
- [ ] Robots.txt correct
- [ ] 404 page works
- [ ] HTTPS enforced
- [ ] Mobile responsive
- [ ] Core Web Vitals passing

### Content
- [ ] No duplicate H1s
- [ ] No duplicate content
- [ ] All images have alt text
- [ ] All pages have breadcrumbs
- [ ] Internal links working
- [ ] No orphan pages

### Tracking
- [ ] GA4 installed
- [ ] Search Console connected
- [ ] Form tracking working
- [ ] Phone click tracking working
