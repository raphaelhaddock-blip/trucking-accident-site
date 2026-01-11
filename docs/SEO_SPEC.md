# SEO Specification

## Overview

This document defines all SEO requirements for the trucking accident site. Every page must meet these specifications before going live.

---

## Meta Tags Per Page Type

### City Pages

**Title Tag:**
```
{City} Truck Accident Lawyer | {X} Fatal Crashes ({Year}) | Free Consult
```

| Rule | Requirement |
|------|-------------|
| Max length | 60 characters |
| Required elements | City name, fatality count, CTA |
| Format | `{City} Truck Accident Lawyer \| {X} Fatal Crashes ({Year}) \| Free Consult` |

**Examples:**
- ✅ `Newark Truck Accident Lawyer | 27 Fatal Crashes (2023) | Free Consult` (59 chars)
- ✅ `Miami Truck Accident Lawyer | 89 Fatal Crashes (2023) | Free Consult` (58 chars)
- ❌ `Truck Accident Lawyer in Newark, New Jersey - Call Today` (missing stats)
- ❌ `Newark, NJ Truck Accident Attorney and Personal Injury Law Firm...` (too long, truncated)

**Meta Description:**
```
Injured in a truck crash in {City}, {State}? {X} fatal trucking accidents in {County} County in {Year}. Experienced attorneys handle {Highway} crashes. Free consultation.
```

| Rule | Requirement |
|------|-------------|
| Max length | 155 characters |
| Required elements | City, county, statistic, highway, CTA |

**Examples:**
- ✅ `Injured in a truck crash in Newark, NJ? 27 fatal trucking accidents in Essex County in 2023. Attorneys handle I-95, I-78 crashes. Free consultation.` (148 chars)
- ❌ `Looking for a truck accident lawyer? We can help.` (too generic, missing local data)

**H1 Tag:**
```
{City} Truck Accident Lawyers
```

| Rule | Requirement |
|------|-------------|
| Count | Exactly ONE H1 per page |
| Format | Must match primary keyword |
| Length | Under 60 characters |

---

### State Pages

**Title Tag:**
```
{State} Truck Accident Attorneys | #{Rank} in US Trucking Deaths
```

**Examples:**
- ✅ `New Jersey Truck Accident Attorneys | #14 in US Trucking Deaths` (62 chars)
- ✅ `Florida Truck Accident Attorneys | #2 in US Trucking Deaths` (58 chars)

**Meta Description:**
```
{State} truck accident lawyers handling {Highway1}, {Highway2}, {Highway3} crashes. {X} trucking fatalities statewide. Free case review.
```

**Examples:**
- ✅ `New Jersey truck accident lawyers handling I-95, NJ Turnpike, I-78 crashes. 87 trucking fatalities statewide. Free case review.` (127 chars)

**H1 Tag:**
```
{State} Truck Accident Attorneys
```

---

### Accident Type Pages

**Title Tag:**
```
{Accident Type} Truck Accidents | Causes, Injuries & Legal Help
```

**Examples:**
- ✅ `Jackknife Truck Accidents | Causes, Injuries & Legal Help` (57 chars)
- ✅ `Underride Truck Accidents | Causes, Injuries & Legal Help` (57 chars)

**Meta Description:**
```
Learn about {accident type} truck accidents: common causes, typical injuries, liable parties, and how to protect your legal rights. Free consultation available.
```

**H1 Tag:**
```
{Accident Type} Truck Accidents
```

---

### Blog Posts

**Title Tag:**
```
{Post Title} | Trucking Accident Guide ({Year})
```

**Meta Description:**
```
{Compelling summary of post content in 140-155 characters with relevant keywords}
```

**H1 Tag:**
```
{Post Title}
```

---

## Schema Markup Requirements

### City Pages (ALL required)

#### 1. LegalService Schema

```json
{
  "@context": "https://schema.org",
  "@type": "LegalService",
  "name": "{City} Truck Accident Lawyers",
  "description": "Experienced truck accident attorneys serving {City}, {State}. Handling 18-wheeler crashes, semi-truck accidents, and commercial vehicle collisions.",
  "areaServed": {
    "@type": "City",
    "name": "{City}",
    "containedInPlace": {
      "@type": "State",
      "name": "{State}"
    }
  },
  "serviceType": ["Truck Accident Law", "Personal Injury Law", "Wrongful Death Claims"],
  "telephone": "+1-XXX-XXX-XXXX",
  "url": "https://trucking-accident-site.vercel.app/states/{state}/{city}",
  "priceRange": "Free Consultation",
  "paymentAccepted": "Contingency Fee",
  "currenciesAccepted": "USD"
}
```

#### 2. FAQPage Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long do I have to file a truck accident lawsuit in {City}?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Under {State statute}, you have {X} years from the date of the accident to file a personal injury lawsuit..."
      }
    },
    {
      "@type": "Question",
      "name": "What is the average truck accident settlement in {City}?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Settlement amounts vary based on injury severity..."
      }
    }
  ]
}
```

#### 3. BreadcrumbList Schema

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://trucking-accident-site.vercel.app/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "States",
      "item": "https://trucking-accident-site.vercel.app/states"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "{State}",
      "item": "https://trucking-accident-site.vercel.app/states/{state}"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "{City}",
      "item": "https://trucking-accident-site.vercel.app/states/{state}/{city}"
    }
  ]
}
```

#### 4. Article Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{City} Truck Accident Lawyers",
  "description": "{Meta description}",
  "datePublished": "2024-01-15T00:00:00Z",
  "dateModified": "2024-01-15T00:00:00Z",
  "author": {
    "@type": "Organization",
    "name": "{Site Name}"
  },
  "publisher": {
    "@type": "Organization",
    "name": "{Site Name}",
    "logo": {
      "@type": "ImageObject",
      "url": "https://trucking-accident-site.vercel.app/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://trucking-accident-site.vercel.app/states/{state}/{city}"
  }
}
```

#### 5. LocalBusiness Schema (Optional but Recommended)

```json
{
  "@context": "https://schema.org",
  "@type": "Attorney",
  "name": "{City} Truck Accident Lawyers",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "{City}",
    "addressRegion": "{State}",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "{lat}",
    "longitude": "{long}"
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "opens": "09:00",
    "closes": "17:00"
  },
  "telephone": "+1-XXX-XXX-XXXX",
  "priceRange": "Free Consultation"
}
```

---

### State Pages (ALL required)

1. **LegalService** - Same as city, with state-level areaServed
2. **FAQPage** - State-specific FAQs
3. **BreadcrumbList** - Home > States > {State}
4. **Article** - State-level article markup

---

### Accident Type Pages (ALL required)

1. **Article** - Detailed accident type information
2. **FAQPage** - Accident-specific FAQs
3. **BreadcrumbList** - Home > Accident Types > {Type}
4. **HowTo** (optional) - "What to do after a {type} accident"

---

## Keyword Strategy

### Primary Keywords (1 per page)

| Page Type | Primary Keyword Format |
|-----------|----------------------|
| City | `{city} truck accident lawyer` |
| State | `{state} truck accident attorney` |
| Accident Type | `{type} truck accident` |
| Blog | `{topic} truck accident` |

### Secondary Keywords (3-5 per page)

**City Pages:**
- `{city} 18 wheeler accident lawyer`
- `{city} semi truck crash attorney`
- `{county} trucking accident law firm`
- `{highway} truck accident lawyer`
- `truck accident lawyer near me {city}`

**State Pages:**
- `{state} 18 wheeler accident attorney`
- `{state} semi truck crash lawyer`
- `{state} trucking accident law firm`
- `{state} commercial truck accident`
- `{state} tractor trailer accident lawyer`

### Long-tail Keywords (5-10 per page)

**City Pages:**
- `best truck accident lawyer in {city}`
- `{city} jackknife truck accident attorney`
- `how much is a truck accident case worth in {city}`
- `{highway} semi truck crash lawyer {city}`
- `truck accident settlement {city} {state}`
- `{city} wrongful death truck accident`
- `free consultation truck accident lawyer {city}`
- `{city} trucking company negligence attorney`
- `{city} {accident type} truck accident lawyer`

**State Pages:**
- `how to file truck accident lawsuit in {state}`
- `{state} truck accident statute of limitations`
- `average truck accident settlement {state}`
- `{state} trucking regulations violations`
- `{state} FMCSA truck accident`

### Keyword Placement Rules

| Location | Keywords | Density |
|----------|----------|---------|
| Title tag | Primary keyword | 1x |
| Meta description | Primary + 1 secondary | 1-2x |
| H1 | Primary keyword | 1x |
| First 100 words | Primary keyword | 1x |
| H2 headings | Secondary keywords | 1x each |
| Body content | Long-tail keywords | Natural |
| FAQs | Long-tail keywords | Natural |
| Alt text | Primary/secondary as relevant | 1x per image |

**Keyword Density Guidelines:**
- Primary keyword: 0.5-1% of total content
- Secondary keywords: 0.3-0.5% each
- Long-tail: Natural occurrence, not forced
- NEVER keyword stuff

---

## Internal Linking Rules

### City Page Must Link To:

| Link Type | Count | Anchor Text Rule | Placement |
|-----------|-------|------------------|-----------|
| Parent state | 1 | `{State} truck accident lawyers` | Intro paragraph |
| Same-state cities | 6 | `{City} truck accident lawyer` | Body + Related Cities section |
| Same-corridor cities | 3 | `truck accidents on {Highway}` | Highway section |
| Accident type pages | 4-5 | `{Accident Type} accidents` | Throughout content |
| Blog posts | 3-5 | Contextual anchor | Natural placement |

**Example for Newark, NJ:**
```
Required links:
- NJ state page (1x)
- Jersey City, Paterson, Elizabeth, Trenton, Camden, Edison (6 same-state)
- NYC, Philadelphia, Baltimore (3 same-corridor on I-95)
- Jackknife, Underride, Rear-end, Brake failure (4 accident types)
- 3-5 relevant blog posts
```

### State Page Must Link To:

| Link Type | Count | Anchor Text Rule | Placement |
|-----------|-------|------------------|-----------|
| Top cities | 10-20 | `{City} truck accident lawyer` | Cities section |
| Neighboring states | 2-4 | `{State} trucking accidents` | Body content |
| Accident types | 10+ | `{Type} truck accidents` | Types section |
| Blog posts | 5+ | Contextual anchor | Throughout |

**Example for New Jersey:**
```
Required links:
- 20 city pages (Newark, Jersey City, Paterson, etc.)
- NY, PA, DE neighboring states
- All accident type pages
- 5+ blog posts
```

### Link Placement Rules

| Rule | Requirement |
|------|-------------|
| In-content links | Natural placement, max 1 per 100 words |
| Consecutive links | NEVER place links back-to-back |
| Anchor text variety | Don't repeat exact match >2x per page |
| Section links | Use "Related" sections at page end |
| Link density | 3-5% of total words can be anchor text |
| External links | Max 2-3 per page (authoritative sources only) |

### Anchor Text Variation Examples

**For Newark city page linking to Jersey City:**
- `Jersey City truck accident lawyer` (exact match)
- `truck accident attorneys in Jersey City` (phrase match)
- `nearby Jersey City` (partial match)
- `Hudson County` (branded/location)

**NEVER:**
- `click here`
- `learn more`
- `this page`
- Naked URLs

---

## Technical SEO

### URL Structure

| Page Type | URL Format | Example |
|-----------|------------|---------|
| Homepage | `/` | `/` |
| State list | `/states` | `/states` |
| State page | `/states/{state-slug}` | `/states/new-jersey` |
| City page | `/states/{state-slug}/{city-slug}` | `/states/new-jersey/newark` |
| Accident types | `/accidents` | `/accidents` |
| Accident page | `/accidents/{type-slug}` | `/accidents/jackknife-accidents` |
| Blog index | `/blog` | `/blog` |
| Blog post | `/blog/{post-slug}` | `/blog/truck-accident-settlements` |

### URL Rules

- All lowercase
- Hyphens for word separation (no underscores)
- No trailing slashes
- No special characters
- Max 75 characters
- Include primary keyword where natural

### Canonical Tags

```html
<link rel="canonical" href="https://trucking-accident-site.vercel.app/states/new-jersey/newark" />
```

| Rule | Requirement |
|------|-------------|
| Self-referencing | Every page has canonical pointing to itself |
| Protocol | Always https |
| Trailing slashes | Consistent (no trailing slash) |
| Parameters | Canonical excludes query parameters |

### Robots Meta

```html
<!-- Standard pages -->
<meta name="robots" content="index, follow" />

<!-- Pagination (if any) -->
<meta name="robots" content="index, follow" />

<!-- Utility pages (if any) -->
<meta name="robots" content="noindex, follow" />
```

### XML Sitemap

**Auto-generated via Next.js with priority scores:**

| Page Type | Priority | Change Frequency |
|-----------|----------|------------------|
| Homepage | 1.0 | weekly |
| State pages | 0.9 | monthly |
| Tier 1 cities (enhanced) | 0.8 | monthly |
| Tier 2 cities | 0.7 | monthly |
| Tier 3 cities | 0.6 | monthly |
| Accident types | 0.8 | monthly |
| Blog posts | 0.6 | monthly |

**Sitemap location:** `/sitemap.xml`

### Page Speed Requirements

| Metric | Target | Maximum |
|--------|--------|---------|
| LCP (Largest Contentful Paint) | < 2.0s | 2.5s |
| FID (First Input Delay) | < 50ms | 100ms |
| CLS (Cumulative Layout Shift) | < 0.05 | 0.1 |
| TTFB (Time to First Byte) | < 200ms | 600ms |
| Total page weight | < 500KB | 1MB |

**Core Web Vitals pass required for all pages.**

### Mobile Optimization

- Responsive design (no separate mobile site)
- Touch targets: minimum 48x48px
- Font size: minimum 16px base
- Viewport meta tag required
- No horizontal scroll
- Mobile-first indexing ready

---

## Image SEO

### Alt Text Requirements

| Image Type | Alt Text Format |
|------------|-----------------|
| Highway photo | `{Highway} truck traffic near {City}, {State}` |
| Accident scene | `{Accident type} truck accident on {Highway}` |
| City skyline | `{City}, {State} skyline - trucking hub` |
| Infographic | `{Topic} infographic - {brief description}` |
| Logo | `{Site name} logo` |

### Image File Names

```
{city}-truck-accident-{context}.webp
```

**Examples:**
- `newark-truck-accident-i95.webp`
- `miami-jackknife-accident-scene.webp`
- `new-jersey-trucking-statistics.webp`

### Image Optimization

| Rule | Requirement |
|------|-------------|
| Format | WebP preferred, JPEG fallback |
| Compression | 80-85% quality |
| Dimensions | Max 1200px width for content images |
| Lazy loading | All images below fold |
| srcset | Provide 1x, 2x for retina |

---

## SEO Validation Checklist

### Pre-Launch Checklist (Every Page)

**Meta Tags:**
- [ ] Title tag present and under 60 characters
- [ ] Title contains primary keyword
- [ ] Meta description present and 120-155 characters
- [ ] Meta description contains primary keyword + CTA
- [ ] Exactly one H1 tag
- [ ] H1 matches primary keyword intent

**Schema Markup:**
- [ ] LegalService schema present and valid
- [ ] FAQPage schema present and valid
- [ ] BreadcrumbList schema present and valid
- [ ] Article schema present and valid
- [ ] All schema validates at schema.org/validator

**Keywords:**
- [ ] Primary keyword in title
- [ ] Primary keyword in H1
- [ ] Primary keyword in first 100 words
- [ ] Primary keyword in meta description
- [ ] Secondary keywords in H2s
- [ ] Long-tail keywords in FAQs
- [ ] No keyword stuffing (density < 1.5%)

**Internal Links:**
- [ ] Links to parent state page
- [ ] Links to 6 same-state cities
- [ ] Links to 3 same-corridor cities
- [ ] Links to 4-5 accident type pages
- [ ] Links to 3-5 blog posts
- [ ] Varied anchor text
- [ ] No broken links

**Technical:**
- [ ] Canonical tag present and correct
- [ ] URL follows structure guidelines
- [ ] Page loads in under 2.5s
- [ ] Core Web Vitals pass
- [ ] Mobile-friendly
- [ ] All images have alt text
- [ ] Images optimized (WebP, compressed)

**Content Quality:**
- [ ] Word count meets minimum (city: 3000+, state: 4000+)
- [ ] No duplicate content with other pages
- [ ] All data is accurate and cited
- [ ] FAQs are unique to this location

### Post-Launch Monitoring

**Weekly:**
- [ ] Check Google Search Console for errors
- [ ] Monitor Core Web Vitals scores
- [ ] Review crawl stats

**Monthly:**
- [ ] Check indexation status
- [ ] Review search rankings for primary keywords
- [ ] Analyze click-through rates
- [ ] Check for broken links

**Quarterly:**
- [ ] Full technical SEO audit
- [ ] Update statistics/data
- [ ] Refresh content if needed
- [ ] Review and update internal links

---

## Common SEO Mistakes to Avoid

### Meta Tags
❌ Duplicate titles across pages
❌ Titles over 60 characters (truncated)
❌ Generic descriptions ("We help with truck accidents")
❌ Missing keywords in title/description
❌ Multiple H1 tags

### Schema
❌ Invalid JSON-LD syntax
❌ Missing required properties
❌ Schema not matching page content
❌ Incorrect @type values

### Keywords
❌ Keyword stuffing (same phrase repeated)
❌ Missing primary keyword in key locations
❌ Targeting impossible keywords (too competitive)
❌ Cannibalization (multiple pages same keyword)

### Links
❌ Generic anchor text ("click here")
❌ Too many links (>100 per page)
❌ Broken internal links
❌ Orphan pages (no internal links pointing to them)
❌ Over-optimized anchors (exact match every time)

### Technical
❌ Missing canonical tags
❌ Slow page speed (>3s)
❌ Not mobile-friendly
❌ Blocked by robots.txt
❌ Missing sitemap entries
