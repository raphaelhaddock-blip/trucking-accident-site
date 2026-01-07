# 18-Wheeler Accident Site - Master Context Prompt

**CRITICAL: Read this entire document before doing ANYTHING.**

---

## PART 1: PROJECT OVERVIEW

### What We're Building
A national lead generation website for 18-wheeler/semi-truck accident victims. The site captures leads from people injured in trucking accidents and refers them to personal injury law firms.

### Business Model
- **Traffic source**: Organic SEO (primary), potentially paid later
- **Conversion**: Free case evaluation forms, phone calls
- **Monetization**: Referral fees from PI firms who take the cases

### Why This Works
- 18-wheeler accidents cause catastrophic injuries = high case values ($500K-$10M+)
- FMCSA regulations create clear liability paths
- Multiple defendants = multiple insurance policies
- Victims search online for help immediately after crashes

---

## PART 2: TECHNICAL STACK

| Component | Technology |
|-----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| CMS | Sanity (headless) |
| AI Content | Claude API |
| Hosting | Vercel |
| News Feed | NewsAPI (for blog automation) |

### Project Structure
```
/
├── src/
│   ├── app/
│   │   ├── page.tsx                    (homepage)
│   │   ├── fmcsa-regulations/          (pillar page)
│   │   ├── accidents/[slug]/           (accident type pages)
│   │   ├── states/[slug]/              (state pages)
│   │   ├── blog/[slug]/                (blog posts)
│   │   ├── api/
│   │   │   ├── generate-content/       (Claude API)
│   │   │   └── cron/generate-blogs/    (automated blogs)
│   │   └── studio/[[...index]]/        (Sanity Studio)
│   ├── lib/
│   │   ├── accidents-content/          (accident page content)
│   │   ├── states-content/             (state page content)
│   │   ├── sanity/                     (Sanity client & queries)
│   │   ├── claude/                     (Claude API integration)
│   │   └── schema.ts                   (JSON-LD schema)
│   └── components/
├── sanity/
│   └── schemas/
├── public/
├── .env.local
└── CLAUDE.md                           (this rules file)
```

---

## PART 3: CONTENT ARCHITECTURE

### Page Types & Targets

| Page Type | Count | Word Minimum | Purpose |
|-----------|-------|--------------|---------|
| Homepage | 1 | 800 | Trust, hero CTA, navigation |
| FMCSA Pillar | 1 | 4,000 | Authority page, links to all |
| Accident Types | 20 | 3,000 | Rank for "[type] accident lawyer" |
| State Pages | 15-50 | 2,500 | Rank for "[state] truck accident lawyer" |
| City Pages | 50-100 | 2,000 | Rank for "[city] 18 wheeler accident" |
| Blog Posts | 150+/year | 800 | Long-tail, news, freshness |

### URL Structure
```
/                                   Homepage
/fmcsa-regulations                  Pillar page
/accidents/[slug]                   Accident type pages
/states/[slug]                      State pages
/states/[state]/[city]              City pages (under parent state)
/blog/[slug]                        Blog posts
/about                              About/trust page
/contact                            Contact form
/privacy                            Privacy policy
/terms                              Terms of service
/disclaimer                         Legal disclaimer
```

---

## PART 4: ACCIDENT TYPES (20 Core Pages)

Build these pages in priority order:

### Tier 1 - Highest Search Volume
| Slug | H1 | Primary Keyword |
|------|-----|-----------------|
| `jackknife-accidents` | Jackknife Truck Accidents | jackknife accident lawyer |
| `rollover-accidents` | 18-Wheeler Rollover Accidents | semi truck rollover lawyer |
| `underride-accidents` | Underride Truck Accidents | underride accident attorney |
| `rear-end-collisions` | Rear-End Truck Collisions | rear ended by 18 wheeler |
| `head-on-collisions` | Head-On Semi-Truck Crashes | head on collision with semi |

### Tier 2 - High Volume
| Slug | H1 | Primary Keyword |
|------|-----|-----------------|
| `t-bone-accidents` | T-Bone Truck Accidents | t-bone semi truck accident |
| `wide-turn-accidents` | Wide Turn Truck Accidents | truck wide turn accident |
| `blind-spot-accidents` | No-Zone Blind Spot Accidents | truck blind spot accident |
| `sideswipe-accidents` | Sideswipe Truck Accidents | sideswipe 18 wheeler |
| `override-accidents` | Override Truck Accidents | truck override collision |

### Tier 3 - Cause-Based
| Slug | H1 | Primary Keyword |
|------|-----|-----------------|
| `brake-failure` | Brake Failure Truck Accidents | truck brake failure accident |
| `tire-blowout` | Tire Blowout Semi Accidents | semi truck tire blowout |
| `driver-fatigue` | Driver Fatigue Truck Crashes | drowsy truck driver accident |
| `distracted-driving` | Distracted Truck Driver Accidents | distracted trucker accident |
| `speeding-accidents` | Speeding Semi-Truck Accidents | speeding truck accident |

### Tier 4 - Additional
| Slug | H1 | Primary Keyword |
|------|-----|-----------------|
| `cargo-spill-accidents` | Cargo Spill & Lost Load Accidents | truck cargo spill accident |
| `hazmat-accidents` | Hazmat Truck Accidents | hazmat truck spill lawyer |
| `drunk-driving` | Drunk Truck Driver Accidents | drunk trucker accident |
| `runaway-truck` | Runaway Truck Accidents | runaway semi accident |
| `improper-maintenance` | Improper Maintenance Accidents | truck maintenance negligence |

---

## PART 5: STATE PAGES (Priority Order)

### Tier 1 - Build First (Highest Trucking Fatalities)
| State | Slug | Key Corridors |
|-------|------|---------------|
| Texas | `texas` | I-10, I-20, I-35, I-45 |
| California | `california` | I-5, I-10, I-15, I-40 |
| Florida | `florida` | I-4, I-10, I-75, I-95 |
| Georgia | `georgia` | I-20, I-75, I-85, I-95 |
| Pennsylvania | `pennsylvania` | I-76, I-78, I-80, I-81 |
| Ohio | `ohio` | I-70, I-71, I-75, I-77 |
| Illinois | `illinois` | I-55, I-57, I-70, I-80, I-90 |
| North Carolina | `north-carolina` | I-40, I-77, I-85, I-95 |
| Tennessee | `tennessee` | I-24, I-40, I-65, I-75, I-81 |
| Indiana | `indiana` | I-65, I-69, I-70, I-74 |

### Tier 2 - Build Second
| State | Slug | Key Corridors |
|-------|------|---------------|
| Michigan | `michigan` | I-69, I-75, I-94, I-96 |
| Arizona | `arizona` | I-8, I-10, I-17, I-40 |
| Missouri | `missouri` | I-29, I-35, I-44, I-55, I-70 |
| Alabama | `alabama` | I-10, I-20, I-59, I-65, I-85 |
| Louisiana | `louisiana` | I-10, I-12, I-20, I-49, I-55 |
| Kentucky | `kentucky` | I-24, I-64, I-65, I-71, I-75 |
| Virginia | `virginia` | I-64, I-66, I-77, I-81, I-95 |
| New Jersey | `new-jersey` | I-78, I-80, I-95, NJ Turnpike |
| New York | `new-york` | I-81, I-87, I-90, I-95 |
| South Carolina | `south-carolina` | I-20, I-26, I-77, I-85, I-95 |

---

## PART 6: LEGAL FRAMEWORK (CRITICAL)

### FMCSA Regulations - The Liability Foundation

This is your **Labor Law 240 equivalent**. FMCSA violations = near-automatic negligence.

#### Hours of Service (HOS) Rules
| Driver Type | Max Driving | Max On-Duty | Required Rest |
|-------------|-------------|-------------|---------------|
| Property-carrying | 11 hours | 14 hours | 10 consecutive hours off |
| 70-hour limit | 70 hours in 8 days | Reset with 34-hour break |
| 30-minute break | Required after 8 hours driving |

**Why this matters**: Fatigued driving is a leading cause. ELD data proves violations.

#### Key FMCSA Regulations to Reference
| Regulation | What It Covers | Why It Matters |
|------------|----------------|----------------|
| 49 CFR 395 | Hours of Service | Proves fatigue/violation |
| 49 CFR 392.3 | Ill/Fatigued Operation | Can't drive when impaired |
| 49 CFR 393 | Parts & Accessories | Maintenance requirements |
| 49 CFR 396 | Inspection/Repair | Pre-trip inspection duties |
| 49 CFR 382 | Drug/Alcohol Testing | Post-accident testing required |
| 49 CFR 391 | Driver Qualifications | Training, medical, background |

#### Electronic Logging Device (ELD) Data
- Mandatory since December 2017
- Records: driving time, location, speed, hard braking
- Must be preserved - send spoliation letter immediately
- Can prove hours violations, speeding, route deviations

#### Black Box / ECM Data
- Engine Control Module records last events before crash
- Speed, braking, throttle position, engine RPM
- Data degrades - must image within days
- Requires expert to download

### Multiple Defendants - Why Cases Are Valuable

| Defendant | Liability Theory | Insurance |
|-----------|------------------|-----------|
| **Driver** | Direct negligence | Often limited personal coverage |
| **Motor Carrier** | Vicarious liability, negligent hiring | $750K-$5M+ policy required |
| **Broker** | Negligent selection of carrier | Separate policy |
| **Shipper** | Improper loading, unrealistic schedules | Company insurance |
| **Cargo Loader** | Improper securement, overloading | Company insurance |
| **Truck Manufacturer** | Product defect (brakes, tires) | Deep pockets |
| **Maintenance Company** | Negligent repair | Company insurance |

**Key point**: Multiple $1M+ policies can stack. A single crash can have $10M+ in available coverage.

### Evidence Preservation (URGENT)

Content must emphasize:
1. **Spoliation letter** - Send within 24-48 hours
2. **ELD data** - Can be overwritten in days
3. **Black box** - Must image before repair
4. **Driver logs** - Paper backups still exist
5. **Dashcam footage** - Carrier may delete
6. **Drug/alcohol test results** - Required post-accident
7. **Maintenance records** - 90-day inspection history
8. **Driver qualification file** - Training, medical cert, violations

---

## PART 7: CONTENT REQUIREMENTS

### Accident Type Page Structure (3,000+ words)

```
H1: [Accident Type] Truck Accidents

1. Overview (200 words)
   - What is this type of accident
   - Why 18-wheelers specifically
   - Statistics/frequency

2. Common Causes (400 words)
   - Driver error factors
   - Equipment failures
   - Environmental factors
   - FMCSA violations that contribute

3. FMCSA Regulations & Liability (500 words)
   - Specific regulations that apply
   - How violations prove negligence
   - Evidence to look for

4. Injuries from [Type] Accidents (400 words)
   - Common injury types
   - Severity factors
   - Long-term impacts
   - Medical treatment needed

5. Who Can Be Held Liable (400 words)
   - Driver
   - Carrier
   - Broker/shipper if applicable
   - Manufacturer if applicable
   - How multiple parties increases recovery

6. Evidence & Investigation (300 words)
   - What needs to be preserved
   - Time-sensitive evidence
   - Expert witnesses needed

7. Compensation Available (300 words)
   - Economic damages
   - Non-economic damages
   - Punitive damages when available
   - Settlement vs trial ranges

8. What To Do After a [Type] Accident (200 words)
   - Immediate steps
   - Evidence to gather
   - When to contact attorney

9. FAQs (5-7 questions, 300 words)
   - Real questions people search
   - Specific to this accident type

10. CTA (100 words)
    - Free case evaluation
    - Time-sensitive nature
    - No fee unless you win
```

### State Page Structure (2,500+ words)

```
H1: [State] Truck Accident Lawyer

1. Overview (200 words)
   - Trucking in this state
   - Major corridors
   - Accident statistics

2. [State] Trucking Laws (400 words)
   - State-specific regulations
   - How they interact with FMCSA
   - Unique state requirements

3. Major Trucking Corridors (300 words)
   - Interstate highways
   - High-accident areas
   - Port/distribution centers

4. Common Accident Types in [State] (300 words)
   - Link to accident type pages
   - State-specific patterns

5. Liable Parties in [State] (300 words)
   - Carriers based in state
   - Passing-through carriers
   - Local companies

6. [State] Comparative Negligence (200 words)
   - Pure vs modified
   - How it affects recovery
   - Percentage thresholds

7. Statute of Limitations (200 words)
   - State deadline
   - Discovery rule
   - Government entity exceptions

8. Filing a Claim in [State] (200 words)
   - Court system
   - Venue options
   - Jury tendencies

9. Settlement & Verdict Ranges (200 words)
   - State-specific ranges
   - Factors affecting value

10. FAQs (5 questions, 200 words)
    - State-specific questions

11. CTA (100 words)
```

### Blog Post Structure (800+ words)

```
H1: [Descriptive headline about accident/topic]

1. News Hook (100 words)
   - What happened
   - Where, when
   - Injuries/fatalities

2. Legal Analysis (300 words)
   - FMCSA regulations that apply
   - Potential liability
   - Investigation factors

3. What Victims Should Know (200 words)
   - Rights
   - Evidence to preserve
   - Timeline concerns

4. FAQs (3 questions, 150 words)

5. CTA (50 words)
```

---

## PART 8: SEO SPECIFICATIONS

### Meta Title Templates
| Page Type | Template | Example |
|-----------|----------|---------|
| Homepage | 18-Wheeler Accident Lawyers \| Free Consultation | 18-Wheeler Accident Lawyers \| Free Consultation |
| Pillar | FMCSA Trucking Regulations \| Truck Accident Law | FMCSA Trucking Regulations \| Truck Accident Law |
| Accident | [Type] Accident Lawyer \| 18-Wheeler Crashes | Jackknife Accident Lawyer \| 18-Wheeler Crashes |
| State | [State] Truck Accident Lawyer \| Free Consult | Texas Truck Accident Lawyer \| Free Consult |
| Blog | [Topic] - [Descriptor] \| [Site] | Houston I-10 Crash - FMCSA Violations \| [Site] |

### Meta Description Templates
| Page Type | Template |
|-----------|----------|
| Accident | Injured in a [type] truck accident? Our attorneys fight trucking companies & their insurers. Free consultation. No fee unless you win. |
| State | [State] truck accident lawyer. 18-wheeler crash victims deserve maximum compensation. Free case review from experienced attorneys. |

### Schema Markup Required
Every page needs:
- `LegalService` (organization)
- `BreadcrumbList`
- `WebPage`

Accident & state pages add:
- `FAQPage`

### Internal Linking Rules
**Every accident page links to:**
- FMCSA pillar page
- 3-5 relevant state pages
- 2-3 related accident types

**Every state page links to:**
- FMCSA pillar page
- All 20 accident type pages
- Neighboring state pages
- Major city pages within state

---

## PART 9: SANITY CMS SCHEMAS

### accidentPage
```javascript
{
  name: 'accidentPage',
  title: 'Accident Type Page',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', validation: required },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'metaTitle', type: 'string', validation: max(60) },
    { name: 'metaDescription', type: 'string', validation: max(160) },
    { name: 'content', type: 'array', of: [{ type: 'block' }] },
    { name: 'faqs', type: 'array', of: [{ type: 'faqItem' }] },
    { name: 'relatedAccidentTypes', type: 'array', of: [{ type: 'reference', to: [{ type: 'accidentPage' }] }] },
    { name: 'status', type: 'string', options: { list: ['draft', 'published'] } },
    { name: 'generatedByAI', type: 'boolean' },
    { name: 'generatedAt', type: 'datetime' }
  ]
}
```

### statePage
```javascript
{
  name: 'statePage',
  title: 'State Page',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'slug', type: 'slug' },
    { name: 'stateCode', type: 'string', validation: max(2) },
    { name: 'metaTitle', type: 'string', validation: max(60) },
    { name: 'metaDescription', type: 'string', validation: max(160) },
    { name: 'content', type: 'array', of: [{ type: 'block' }] },
    { name: 'faqs', type: 'array', of: [{ type: 'faqItem' }] },
    { name: 'majorCorridors', type: 'array', of: [{ type: 'string' }] },
    { name: 'statuteOfLimitations', type: 'string' },
    { name: 'comparativeNegligence', type: 'string' },
    { name: 'status', type: 'string', options: { list: ['draft', 'published'] } },
    { name: 'generatedByAI', type: 'boolean' }
  ]
}
```

### blogPost
```javascript
{
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'slug', type: 'slug' },
    { name: 'metaTitle', type: 'string', validation: max(60) },
    { name: 'metaDescription', type: 'string', validation: max(160) },
    { name: 'content', type: 'array', of: [{ type: 'block' }] },
    { name: 'publishedAt', type: 'datetime' },
    { name: 'relatedAccidentTypes', type: 'array', of: [{ type: 'reference', to: [{ type: 'accidentPage' }] }] },
    { name: 'relatedStates', type: 'array', of: [{ type: 'reference', to: [{ type: 'statePage' }] }] },
    { name: 'newsSource', type: 'object', fields: [
      { name: 'title', type: 'string' },
      { name: 'url', type: 'url' },
      { name: 'publishedAt', type: 'datetime' }
    ]},
    { name: 'status', type: 'string', options: { list: ['draft', 'published'] } },
    { name: 'generatedByAI', type: 'boolean' }
  ]
}
```

### faqItem
```javascript
{
  name: 'faqItem',
  title: 'FAQ Item',
  type: 'object',
  fields: [
    { name: 'question', type: 'string' },
    { name: 'answer', type: 'text' }
  ]
}
```

---

## PART 10: BUILD PRIORITIES

### Phase 1: Foundation (Week 1)
1. Set up Next.js project with TypeScript + Tailwind
2. Configure Sanity CMS with schemas
3. Create base layout, header, footer, components
4. Build homepage
5. Build FMCSA pillar page
6. Set up Claude API integration

### Phase 2: Core Content (Weeks 2-3)
1. Build all 20 accident type pages (3,000+ words each)
2. Generate content with Claude API
3. Implement schema markup
4. Set up internal linking

### Phase 3: Geographic Expansion (Weeks 4-5)
1. Build Tier 1 state pages (10 states, 2,500+ words each)
2. Build major city pages for each
3. Cross-link states ↔ accident types

### Phase 4: Blog Automation (Week 6)
1. NewsAPI integration for trucking news
2. Claude API blog generator
3. Vercel cron for daily generation
4. Target: 5 posts/day

### Phase 5: Launch & Scale (Week 7+)
1. Deploy to production
2. Submit to Search Console
3. Build Tier 2 states
4. Monitor and optimize

---

## PART 11: RULES SUMMARY

### DO:
- ✅ Enter plan mode for significant changes
- ✅ Write 3,000+ words for accident pages
- ✅ Write 2,500+ words for state pages
- ✅ Include 5+ unique FAQs per page
- ✅ Cross-link extensively
- ✅ Reference FMCSA regulations with specifics
- ✅ Mention evidence preservation urgency
- ✅ Commit after each major piece of work

### DO NOT:
- ❌ Create matrix pages (`/states/texas/jackknife`)
- ❌ Create pages under word minimums
- ❌ Swap state/city names with identical content
- ❌ Promise specific outcomes or settlements
- ❌ Skip schema markup
- ❌ Forget internal linking

---

## START HERE

1. Read this entire document ✓
2. Set up project foundation (Phase 1)
3. Enter plan mode before each major phase
4. Build systematically through phases
5. Commit frequently
6. Ask if blocked or uncertain

**Begin with Phase 1: Create the Next.js project and Sanity configuration.**
