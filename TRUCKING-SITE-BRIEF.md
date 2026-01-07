# 18-Wheeler Accident Site - Project Brief

## Executive Summary

A national lead generation website targeting victims of 18-wheeler/semi-truck accidents. The site captures leads through organic SEO and refers them to personal injury law firms.

**Why This Market:**
- Catastrophic injury = high case values ($500K - $10M+)
- FMCSA regulations create clear liability paths
- Multiple defendants = multiple insurance policies stacking
- Victims search immediately after crashes
- Less saturated than general PI keywords

---

## Business Model

```
Traffic (SEO) → Lead Capture (Form/Phone) → Referral (PI Firms) → Revenue (Referral Fee)
```

**Revenue per lead:** $500-$2,000 depending on case quality and referral terms
**Target:** 50-100 leads/month at maturity = $25K-$200K/month potential

---

## Technical Architecture

### Stack
| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| CMS | Sanity (headless) |
| AI Content | Claude API (Anthropic) |
| News Feed | NewsAPI |
| Hosting | Vercel |
| Analytics | GA4 + Search Console |

### Why This Stack
- **Next.js**: SEO-optimized, fast, great DX
- **Sanity**: Flexible CMS, good free tier, real-time
- **Claude API**: Quality content generation at scale
- **Vercel**: Easy deployment, cron jobs, edge functions

---

## Content Strategy

### The Morgan & Morgan Model (Adapted)
Deep, authoritative pages + aggressive cross-linking + daily fresh content

**NOT doing:**
- Matrix pages (`/states/texas/jackknife`) ❌
- Thin content (under minimums) ❌
- City-swap pages with identical content ❌

**Doing:**
- 20 deep accident type pages (3,000+ words) ✅
- 50 deep state pages (2,500+ words) ✅
- 100+ city pages (2,000+ words) ✅
- 5 blogs/day on real trucking news ✅
- Heavy cross-linking throughout ✅

### Content Minimums (Enforced)

| Page Type | Minimum Words | Minimum FAQs |
|-----------|---------------|--------------|
| Accident pages | 3,000 | 5 |
| State pages | 2,500 | 5 |
| City pages | 2,000 | 3 |
| Blog posts | 800 | 3 |

---

## Legal Framework: FMCSA is Your Labor Law 240

The Federal Motor Carrier Safety Administration (FMCSA) regulations are the foundation of trucking liability. Violations = near-automatic negligence.

### Key Regulations

| Regulation | What It Covers | Why It Matters |
|------------|----------------|----------------|
| 49 CFR 395 | Hours of Service | #1 cause of fatigue accidents |
| 49 CFR 382 | Drug/Alcohol Testing | Post-accident testing required |
| 49 CFR 393 | Parts & Accessories | Brake, tire, lighting requirements |
| 49 CFR 396 | Inspection/Maintenance | Pre-trip and periodic inspections |
| 49 CFR 391 | Driver Qualifications | Training, medical, background |

### Evidence That Wins Cases

| Evidence | What It Proves | Time Sensitivity |
|----------|----------------|------------------|
| ELD Data | Hours violations, location, speed | Can be overwritten in days |
| Black Box/ECM | Speed, braking, throttle | Must image before repair |
| Driver Logs | Hours of Service compliance | 6-month retention required |
| Drug Test Results | Intoxication | Post-accident testing required |
| Maintenance Records | Inspection compliance | 90-day minimum retention |
| Driver Qualification File | Training, medical cert | Carrier must maintain |

### Multiple Defendants = Multiple Policies

| Defendant | Theory | Insurance |
|-----------|--------|-----------|
| Driver | Direct negligence | Limited personal |
| Motor Carrier | Vicarious liability, negligent hiring | $750K-$5M+ required |
| Broker | Negligent carrier selection | Separate policy |
| Shipper | Unrealistic schedules, improper loading | Company policy |
| Loader | Improper securement | Company policy |
| Manufacturer | Product defect | Deep pockets |
| Maintenance Co | Negligent repair | Company policy |

---

## Site Structure

```
/                           Homepage
├── /fmcsa-regulations      Pillar page (authority)
├── /accidents/             Accident type pages (20)
│   ├── jackknife-accidents
│   ├── rollover-accidents
│   ├── underride-accidents
│   └── ... (17 more)
├── /states/                State pages (50)
│   ├── texas
│   │   ├── houston         City pages (nested)
│   │   ├── dallas
│   │   └── san-antonio
│   ├── california
│   └── ... (48 more)
├── /blog/                  Blog posts (150+/year)
├── /about
├── /contact
├── /privacy
├── /terms
└── /disclaimer
```

---

## Build Phases

### Phase 1: Foundation (Week 1)
- [ ] Create Next.js project
- [ ] Configure TypeScript + Tailwind
- [ ] Set up Sanity CMS with schemas
- [ ] Build base layout (header, footer, nav)
- [ ] Build homepage
- [ ] Build FMCSA pillar page
- [ ] Set up Claude API integration
- [ ] Create content generation prompts

### Phase 2: Accident Pages (Weeks 2-3)
- [ ] Build accident page template
- [ ] Generate 20 accident type pages (3,000+ words each)
- [ ] Implement FAQ schema markup
- [ ] Set up internal linking structure
- [ ] Review and refine content

### Phase 3: State Pages (Weeks 4-5)
- [ ] Build state page template
- [ ] Generate Tier 1 states (10 pages)
- [ ] Generate Tier 2 states (10 pages)
- [ ] Build city page template
- [ ] Generate major city pages (30-50)
- [ ] Cross-link states ↔ accidents

### Phase 4: Blog System (Week 6)
- [ ] NewsAPI integration
- [ ] Claude API blog generator
- [ ] Vercel cron job setup
- [ ] Test automated generation
- [ ] Generate initial 20 posts manually

### Phase 5: Launch (Week 7)
- [ ] Final content review
- [ ] Technical SEO audit
- [ ] Deploy to production
- [ ] Submit to Search Console
- [ ] Set up monitoring

### Phase 6: Scale (Ongoing)
- [ ] Complete remaining 30 state pages
- [ ] Add more city pages
- [ ] Monitor rankings
- [ ] Optimize underperforming pages
- [ ] Build backlinks

---

## Conversion Strategy

### Primary CTA: Free Case Evaluation
- Prominent on every page
- Above fold and end of content
- Form captures: Name, Phone, Email, State, Accident Type, Brief Description

### Secondary CTA: Phone Call
- Click-to-call on mobile
- Displayed prominently in header
- Tracking via call tracking number

### Trust Elements
- "No Fee Unless You Win"
- "24/7 Free Consultation"
- Settlement/verdict amounts (when available)
- Attorney credentials
- Client testimonials (when available)

---

## SEO Strategy

### Primary Keywords by Page Type

| Page Type | Keyword Pattern | Example |
|-----------|-----------------|---------|
| Homepage | 18 wheeler accident lawyer | 18 wheeler accident lawyer |
| Pillar | fmcsa regulations + trucking law | fmcsa trucking regulations |
| Accident | [type] accident lawyer | jackknife accident lawyer |
| State | [state] truck accident lawyer | texas truck accident lawyer |
| City | [city] 18 wheeler accident | houston 18 wheeler accident |

### Link Building Strategy
1. **Legal directories** (Avvo, Justia, FindLaw profiles)
2. **HARO/Connectively** (expert commentary on trucking accidents)
3. **Local news** (commentary on local accidents)
4. **Trucking industry sites** (safety articles)
5. **Guest posts** (legal/safety blogs)

### Content Freshness
- 5 blog posts/day (automated via NewsAPI + Claude)
- Update state pages quarterly with new statistics
- Add new accident types as relevant

---

## Risk Mitigation

### SEO Risks

| Risk | Mitigation |
|------|------------|
| Doorway page penalty | No matrix pages, 80%+ unique content |
| Thin content | Enforce word minimums, quality review |
| Duplicate content | Unique content per page, canonical tags |
| Over-optimization | Natural anchor text variation |

### Legal Risks

| Risk | Mitigation |
|------|------------|
| UPL claims | Clear disclaimers, no legal advice |
| Misleading claims | No guarantees, realistic ranges |
| TCPA violations | Proper consent on forms |

### Business Risks

| Risk | Mitigation |
|------|------------|
| Single traffic source | Build email list, diversify later |
| Referral partner issues | Multiple firm relationships |
| Algorithm changes | Quality content, diverse pages |

---

## Success Metrics

### Month 1-3
- 50+ pages indexed
- 1,000+ organic sessions
- 10+ leads

### Month 4-6
- 150+ pages indexed
- 5,000+ organic sessions
- 50+ leads
- Top 10 rankings for long-tail keywords

### Month 7-12
- 250+ pages indexed
- 20,000+ organic sessions
- 100+ leads/month
- Top 10 rankings for primary keywords

---

## Files in This Package

| File | Purpose |
|------|---------|
| `TRUCKING-CLAUDE.md` | Rules file for project root |
| `TRUCKING-MASTER-PROMPT.md` | Full context prompt for Claude Code |
| `TRUCKING-SEO-SPEC.md` | Complete SEO specifications |
| `TRUCKING-CONTENT-GUIDE.md` | All 20 accident types + state info |
| `TRUCKING-SANITY-SCHEMAS.md` | CMS schema definitions |
| `TRUCKING-SITE-BRIEF.md` | This document - project overview |

---

## How to Use This Package

1. **Move files to project folder:**
   ```bash
   mkdir ~/trucking-accident-site
   mv ~/Downloads/TRUCKING-*.md ~/trucking-accident-site/
   ```

2. **Rename CLAUDE.md:**
   ```bash
   mv ~/trucking-accident-site/TRUCKING-CLAUDE.md ~/trucking-accident-site/CLAUDE.md
   ```

3. **Start Claude Code with master prompt:**
   ```
   Read ~/trucking-accident-site/TRUCKING-MASTER-PROMPT.md completely.
   
   Then begin Phase 1: Create the Next.js project and Sanity configuration.
   
   Follow all rules. Enter plan mode for significant changes. Work systematically through phases.
   ```

4. **Claude Code will:**
   - Create the project structure
   - Set up Sanity with all schemas
   - Build the base layout
   - Generate content following the content guide
   - Implement SEO per the spec

---

## Questions?

This package gives Claude Code everything needed to build the site from scratch. The same architecture, rules, and quality standards that work for the NY construction site, adapted for national trucking accidents.

Ready to go when you are.
