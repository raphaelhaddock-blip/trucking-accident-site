# Trucking Accident Site - Deep SEO & Trucking-Specific Audit

**Generated:** 2026-01-11
**Auditor:** Claude Code
**Site:** trucking-accident-site.vercel.app

---

## Executive Summary

This site has **significant SEO infrastructure** already in place but faces **critical content quality issues** that could trigger Google penalties. The site is NOT a copy of ny-construction-site - it has genuinely trucking-specific content with ~20,000 mentions of trucking terminology (FMCSA, ELD, 18-wheeler, etc.) and zero construction terms.

However, the **2,294 duplicate content issues** and templated city page structure represent serious Google penalty risks that must be addressed before launch.

---

## 1. Current State Assessment

### Site Statistics
| Metric | Value |
|--------|-------|
| Total Pages | ~1,690 |
| Accident Type Pages | 20 (3,000+ words each) |
| State Pages | 50 (2,500+ words each) |
| City Pages | 1,615 (2,000+ words target) |
| Blog Posts | 7 active posts |
| FMCSA Pillar Page | 7,962 words |
| Estimated Total Words | ~4.5 million |
| Trucking Term Mentions | 19,696 |
| Construction Terms | 0 |

### Infrastructure Assessment
- **Framework:** Next.js 14 with TypeScript
- **Deployment:** Vercel
- **CMS:** Sanity (configured but not active)
- **Analytics:** Google Analytics configured
- **Sitemap:** Dynamic XML sitemap present
- **Robots.txt:** Properly configured (no noindex issues)
- **Schema Markup:** LegalService, FAQPage, BreadcrumbList, Article schemas present
- **Audit Infrastructure:** 30+ automated SEO audit scripts exist

### Existing Audit Scripts (scripts/content-audit/)
1. `thin-content-detector.ts` - Flags pages below word thresholds
2. `duplicate-checker.ts` - Content similarity via fingerprinting
3. `keyword-stuffing.ts` - Detects over-optimization
4. `broken-links.ts` - Internal/external link validation
5. `schema-validator.ts` - JSON-LD validation
6. `faq-quality.ts` - FAQ count and quality
7. `meta-uniqueness.ts` - Duplicate meta tags
8. `content-freshness.ts` - Last updated tracking
9. `legal-accuracy.ts` - Legal claim validation
10. `internal-linking.ts` - Link structure analysis

### Existing Technical Audit Scripts (scripts/technical-audit/)
- 20 scripts covering Core Web Vitals, mobile, accessibility, security, etc.

---

## 2. Cross-Site Duplicate Risk Assessment

### Is This a Copy of NY Construction Site?

**VERDICT: NO - This is NOT a copy.**

| Comparison Point | NY Construction | Trucking Site | Status |
|-----------------|-----------------|---------------|--------|
| Trucking terms | 2 mentions | 19,696 mentions | DISTINCT |
| Construction terms | Extensive | 0 mentions | DISTINCT |
| URL structure | /locations/[slug] | /states/[slug]/[city] | DIFFERENT |
| Pillar content | Labor Law 240 | FMCSA Regulations | DIFFERENT |
| Accident types | Scaffold falls, etc. | Jackknife, rollover, etc. | DIFFERENT |
| Legal framework | NY Labor Law | FMCSA 49 CFR | DIFFERENT |

**Cross-Site Duplicate Risk Score: 1/10 (LOW)**

The sites share architectural patterns (Next.js, programmatic SEO) but content is completely different.

---

## 3. Google Penalty Risk Assessment

### Risk 1: Duplicate Content (CRITICAL - 9/10)

**Finding:** Audit detected 2,294 critical duplicate content issues across city pages.

**Evidence:**
- Cities reported as 100% similar to each other (Santa Maria = San Francisco)
- Template structure identical across all cities
- Only city name, county, state, highways swapped

**Example - Kingman, AZ vs Los Angeles, CA:**
Both have nearly identical paragraph structure:
> "Commercial truck accidents in [CITY] result from a complex combination of factors unique to this area. The convergence of major highways—[HIGHWAYS]—creates heavy truck traffic..."

**Google's View:** This is the textbook definition of a "doorway page" pattern - pages that exist primarily for SEO with minimal unique value.

**Fix Required:**
- Each city needs 60%+ genuinely unique content
- Local news, local trucking companies, local verdicts
- City-specific accident data analysis
- Unique local FAQs

### Risk 2: Thin Content (MODERATE - 5/10)

**Finding:** 50 pages flagged below word thresholds.

**Current Thresholds:**
- Accident pages: 3,000 words (mostly met)
- State pages: 2,500 words (mostly met)
- City pages: 2,000 words (some below)

**Issue:** Some city pages have placeholder/generic content despite meeting word counts.

### Risk 3: Meta Tag Uniqueness (HIGH - 7/10)

**Finding:** 1,453 meta uniqueness issues (12 critical, 1,421 warnings)

**Pattern:** Many city meta descriptions follow identical templates:
> "Injured in a truck crash in [CITY]? [X] fatal truck accidents in 2022..."

**Fix Required:**
- Unique meta titles for each city
- Unique meta descriptions with local hooks
- City-specific keywords

### Risk 4: AI-Generated Content Detection (MODERATE - 5/10)

**Signs of AI-Generated Content:**
- Perfect parallel structure across all cities
- Generic industry claims ("technology and tourism" for Kingman, AZ - unlikely)
- No local color, no specific landmarks, no local attorney references
- Cookie-cutter FAQ answers

**Fix Required:**
- Add local expertise signals (local court addresses, local news references)
- Include specific attorney/firm mentions where appropriate
- Add genuine local data (DMV locations, hospital names, etc.)

### Risk 5: Doorway Pages (HIGH - 8/10)

**Definition:** Pages created primarily to rank for specific queries that funnel users to a single destination.

**Current Pattern Matches Doorway Criteria:**
- Hundreds of similar city pages
- All funnel to same contact form
- Minimal unique content between pages
- Exist primarily for location-based SEO

**Fix Required:**
- Each page must provide standalone value
- Unique local resources on each page
- City-specific case studies or verdicts
- Local truck accident statistics analysis

### Risk 6: E-E-A-T Concerns (MODERATE - 6/10)

Google's Experience, Expertise, Authoritativeness, Trustworthiness requirements for legal/YMYL content:

**Current Gaps:**
- No author bylines on content
- No attorney credentials displayed
- No case results or verdicts shown
- No client testimonials
- No physical office addresses
- Limited "About" page detail

**Fix Required:**
- Add author attribution
- Include attorney profiles with credentials
- Add case results (anonymized)
- Include trust signals (bar memberships, awards)

### Overall Google Penalty Risk Matrix

| Risk Type | Score | Priority |
|-----------|-------|----------|
| Cross-Site Duplicate | 1/10 | LOW |
| Internal Duplicate Content | 9/10 | CRITICAL |
| Thin Content | 5/10 | MODERATE |
| Meta Tag Uniqueness | 7/10 | HIGH |
| AI Content Detection | 5/10 | MODERATE |
| Doorway Pages | 8/10 | HIGH |
| E-E-A-T Gaps | 6/10 | MODERATE |

**AGGREGATE PENALTY RISK: 7/10 (HIGH)**

---

## 4. Trucking-Specific Content Requirements

### What Makes Trucking Law UNIQUE (vs General PI)

Trucking accident cases are distinct from regular car accidents due to:

#### Federal Regulations (FMCSA)
| Regulation | Code | Purpose |
|-----------|------|---------|
| Hours of Service | 49 CFR 395 | Driver fatigue prevention |
| Driver Qualifications | 49 CFR 391 | CDL requirements, medical certs |
| Vehicle Maintenance | 49 CFR 396 | Inspection requirements |
| Drug & Alcohol | 49 CFR 382 | Testing requirements |
| Hazmat Transport | 49 CFR 397 | Dangerous cargo rules |

#### Unique Evidence Types
1. **Electronic Logging Device (ELD)** data - Hours of service proof
2. **Event Data Recorder (EDR)** / Black Box - Speed, braking, steering
3. **Driver Qualification Files** - Training records, CDL status
4. **Maintenance Logs** - Vehicle inspection history
5. **Dispatch Records** - Pressure to meet deadlines
6. **Cargo Loading Records** - Weight distribution
7. **GPS/Telematics** - Route and speed history

#### Multiple Liable Parties
| Party | Basis for Liability |
|-------|-------------------|
| Truck Driver | Direct negligence |
| Motor Carrier | Respondeat superior, negligent hiring |
| Broker/Dispatcher | Negligent selection |
| Cargo Loading Company | Improper loading |
| Maintenance Company | Defective repairs |
| Truck Manufacturer | Product defects |
| Parts Manufacturer | Defective components |

#### Insurance Requirements
- Federal minimum: $750,000 (general freight)
- Hazmat: Up to $5,000,000
- Multiple policy layers common

### Content Requirements Per Page Type

#### Accident Type Pages (20 pages)
**Required Elements:**
- [ ] What is this accident type (with physics explanation)
- [ ] Common causes (5+ specific causes)
- [ ] FMCSA regulations relevant to this type
- [ ] Evidence to preserve
- [ ] Injuries commonly caused
- [ ] Liable parties specific to this accident type
- [ ] Settlement ranges (if data available)
- [ ] 5+ FAQs with schema markup
- [ ] Internal links to states and related accidents
- [ ] 3,000+ words

**Current Status:** Generally compliant

#### State Pages (50 pages)
**Required Elements:**
- [ ] State-specific trucking laws
- [ ] State comparative negligence rule
- [ ] Statute of limitations (PI, wrongful death, property)
- [ ] Major trucking corridors in state
- [ ] State DOT enforcement info
- [ ] State court system info
- [ ] Annual truck fatality statistics
- [ ] 5+ state-specific FAQs
- [ ] Links to cities and accident types
- [ ] 2,500+ words

**Current Status:** Generally compliant, but needs more unique local data

#### City Pages (1,615 pages) - HIGHEST RISK
**Required Elements (currently missing many):**
- [ ] City-specific truck fatality data (FARS source - PRESENT)
- [ ] Local highways and trucking routes (TEMPLATED - needs uniqueness)
- [ ] Local industries generating truck traffic (OFTEN GENERIC)
- [ ] Local weather hazards (PRESENT)
- [ ] Local court information (MISSING)
- [ ] Local hospital/trauma centers (MISSING)
- [ ] Recent local truck accident news (MISSING)
- [ ] Local trucking companies/terminals (MISSING)
- [ ] City-specific FAQs (TEMPLATED)
- [ ] 2,000+ words (MET but generic)

**CRITICAL FIX:** City pages need 60%+ unique content to avoid doorway page penalty.

---

## 5. SEO Agent Architecture

### Currently Implemented Agents

#### Content Audit Agents (10)
| Agent | Purpose | Status |
|-------|---------|--------|
| thin-content-detector | Word count verification | ACTIVE |
| duplicate-checker | Content similarity | ACTIVE |
| keyword-stuffing | Over-optimization detection | ACTIVE |
| broken-links | Link validation | ACTIVE |
| schema-validator | JSON-LD validation | ACTIVE |
| faq-quality | FAQ count/quality | ACTIVE |
| meta-uniqueness | Duplicate meta tags | ACTIVE |
| content-freshness | Update tracking | ACTIVE |
| legal-accuracy | Legal claim validation | ACTIVE |
| internal-linking | Link structure | ACTIVE |

#### Technical Audit Agents (20)
All implemented in `scripts/technical-audit/`

### Required New Agents - SEO Integrity

| Agent Name | Purpose | Priority |
|-----------|---------|----------|
| cross-site-duplicate-detector | Compare against ny-construction-site | CRITICAL |
| doorway-page-scorer | Detect pages existing only for SEO | CRITICAL |
| local-content-uniqueness | Measure unique local content % | CRITICAL |
| e-e-a-t-checker | Authority signals validation | HIGH |
| ai-content-detector | AI generation patterns | HIGH |
| local-data-validator | Verify local claims accuracy | HIGH |
| cannibalization-detector | Same keyword targeting | MEDIUM |
| serp-feature-optimizer | Structured data for featured snippets | MEDIUM |

### Required New Agents - Trucking-Specific

| Agent Name | Purpose | Priority |
|-----------|---------|----------|
| fmcsa-regulation-accuracy | Verify CFR citations correct | CRITICAL |
| trucking-terminology-checker | Ensure proper legal terms | HIGH |
| multi-party-liability-validator | All liable parties mentioned | HIGH |
| evidence-preservation-checker | Spoliation letter guidance present | HIGH |
| trucking-insurance-validator | Insurance info accuracy | MEDIUM |
| highway-route-validator | Verify trucking route info | MEDIUM |
| eld-black-box-content-checker | Evidence content accuracy | MEDIUM |
| trucking-verdict-validator | Verify settlement/verdict citations | LOW |
| state-trucking-law-checker | State-specific regs accurate | MEDIUM |
| cdl-requirement-validator | CDL info accuracy | LOW |

### Agent Implementation Priority

**Phase 1 - Critical (Before Launch):**
1. cross-site-duplicate-detector
2. doorway-page-scorer
3. local-content-uniqueness
4. fmcsa-regulation-accuracy
5. trucking-terminology-checker

**Phase 2 - High (First Month):**
6. e-e-a-t-checker
7. ai-content-detector
8. local-data-validator
9. multi-party-liability-validator
10. evidence-preservation-checker

**Phase 3 - Medium (First Quarter):**
11-18. Remaining agents

---

## 6. Content Enhancement Strategy

### City Page Uniqueness Requirements

To achieve 60%+ unique content per city page, add:

#### Tier 1 Data (Required - automated)
- [ ] FARS fatality data (PRESENT)
- [ ] Population (PRESENT but some missing)
- [ ] County name (PRESENT)
- [ ] Local highways (PRESENT but needs verification)

#### Tier 2 Data (Required - needs sourcing)
- [ ] Local hospitals/trauma centers with addresses
- [ ] Local court addresses (state and federal)
- [ ] Local police/highway patrol contact
- [ ] Weather patterns with specific months
- [ ] Top employers generating truck traffic

#### Tier 3 Data (Highly Valuable - manual curation)
- [ ] Recent local truck accident news (last 2 years)
- [ ] Local trucking company terminals
- [ ] Local verdict/settlement examples
- [ ] Unique local FAQs based on actual queries

#### Tier 4 Data (Expert - attorney input)
- [ ] Local attorney network info
- [ ] Local case experience
- [ ] Local court tendencies

### City Enhancement Agent Workflow

```
1. Tier 1: Automated data injection (FARS, census)
2. Tier 2: API-based enhancement (hospitals, courts)
3. Tier 3: News curation agent
4. Tier 4: Manual attorney review
5. Validation: Run all audit agents
6. Approval: Mark as enhanced
```

---

## 7. Daily Blog Strategy (5 Blogs/Day Post-Launch)

### Blog Content Categories

| Category | % of Posts | Examples |
|----------|-----------|----------|
| News Reactive | 40% | Local truck accident coverage |
| FMCSA Updates | 15% | Regulation changes, enforcement actions |
| Case Studies | 15% | Anonymized case results |
| Legal Guides | 15% | Evidence preservation, what to do after |
| Statistics & Data | 10% | Annual reports, trend analysis |
| Q&A / FAQ | 5% | Common questions answered |

### News-Reactive Blog Workflow

```
1. news-curator-agent.ts monitors:
   - Google News API for truck accidents
   - State DOT press releases
   - FMCSA enforcement actions
   - Court verdict databases

2. Filter for relevance:
   - 18-wheeler / semi-truck / tractor-trailer involved
   - Injuries or fatalities
   - In target states/cities

3. Generate draft:
   - News summary
   - Legal analysis
   - Link to relevant accident type page
   - Link to relevant state/city page
   - CTA for free consultation

4. Human review and publish
```

### Blog SEO Requirements

- Minimum 800 words
- 1 primary keyword target
- 3-5 internal links
- 1 external authority link
- FAQ schema if Q&A content
- Article schema for all posts
- Author attribution
- Published date
- Last updated date

---

## 8. Monitoring Requirements

### Daily Monitoring
- [ ] Google Search Console - crawl errors
- [ ] Core Web Vitals scores
- [ ] Form submission tracking
- [ ] 404 error tracking

### Weekly Monitoring
- [ ] Keyword ranking changes
- [ ] Indexation status
- [ ] Competitor content analysis
- [ ] Backlink acquisition

### Monthly Audits
- [ ] Full content audit (run all agents)
- [ ] Duplicate content check
- [ ] Schema validation
- [ ] Performance regression check

### Quarterly Reviews
- [ ] Content freshness audit
- [ ] Legal accuracy review
- [ ] E-E-A-T signal assessment
- [ ] Competitive landscape analysis

---

## 9. Implementation Roadmap

### Phase 1: Critical Fixes (Before Launch)

**Week 1-2:**
1. Implement cross-site-duplicate-detector agent
2. Implement doorway-page-scorer agent
3. Identify top 100 highest-traffic cities
4. Begin Tier 2 data collection for top 100

**Week 3-4:**
5. Enhance top 100 cities with unique content
6. Fix all critical duplicate content issues
7. Add unique meta tags for enhanced cities
8. Add local data (hospitals, courts) to enhanced cities

### Phase 2: Broad Enhancement (Month 2)

1. Scale city enhancement to top 500 cities
2. Implement all Phase 2 agents
3. Launch blog with 3 posts/day
4. Begin news-reactive content workflow

### Phase 3: Full Coverage (Month 3+)

1. Complete all 1,615 city enhancements
2. Scale blog to 5 posts/day
3. Implement remaining agents
4. Begin continuous monitoring

---

## 10. Key Recommendations

### MUST DO (Critical for Avoiding Penalty)

1. **Fix City Page Duplicates** - Each city page needs 60%+ unique content
2. **Add Local Data** - Courts, hospitals, recent news for each city
3. **Unique Meta Tags** - Every page must have unique title/description
4. **E-E-A-T Signals** - Add author bylines, attorney credentials
5. **Monitor Before Launch** - Run full audit, fix all critical issues

### SHOULD DO (Important for Rankings)

1. **Verify Local Claims** - Check highway names, industry claims per city
2. **Add Verdict/Settlement Data** - Real case results build authority
3. **Implement News Curation** - Reactive content drives fresh signals
4. **Build Backlinks** - Authority links from legal directories

### NICE TO HAVE (Competitive Advantage)

1. **Video Content** - Attorney explainer videos
2. **Interactive Tools** - Case value calculator
3. **Local Attorney Profiles** - Builds trust
4. **Spanish Content** - Large demographic opportunity

---

## Appendix A: Audit Report Summary

From latest audit (2026-01-10):

| Agent | Issues | Critical | Status |
|-------|--------|----------|--------|
| duplicate-checker | 2,294 | 2,294 | CRITICAL |
| meta-uniqueness | 1,453 | 12 | HIGH |
| faq-quality | 125 | 0 | WARNING |
| thin-content | 50 | 0 | WARNING |
| legal-accuracy | 3 | 3 | CRITICAL |
| All others | - | 0 | PASS |

---

## Appendix B: Trucking Terminology Checklist

Every trucking page should include relevant terms:

**Vehicle Types:**
- 18-wheeler
- Semi-truck / semi-trailer
- Tractor-trailer
- Big rig
- Commercial motor vehicle (CMV)

**Regulations:**
- FMCSA (Federal Motor Carrier Safety Administration)
- Hours of Service (HOS)
- Electronic Logging Device (ELD)
- CDL (Commercial Driver's License)
- DOT (Department of Transportation)
- 49 CFR (Code of Federal Regulations)

**Evidence:**
- Black box / Event Data Recorder (EDR)
- Driver qualification file
- Maintenance records
- Dispatch logs
- Cargo manifests
- Spoliation letter

**Accidents:**
- Jackknife
- Rollover
- Underride / override
- Wide turn
- Blind spot
- Brake failure

**Parties:**
- Motor carrier
- Broker
- Shipper
- Consignee

---

## Appendix C: File Locations

| Resource | Path |
|----------|------|
| Content Audit Scripts | /scripts/content-audit/ |
| Technical Audit Scripts | /scripts/technical-audit/ |
| Enhancement Agents | /scripts/agents/ |
| Audit Reports | /scripts/reports/ |
| Accident Content | /src/lib/accidents-content/ |
| State Content | /src/lib/states-content/ |
| City Content | /src/lib/cities-content/ |
| Blog Content | /src/lib/blog-content/ |

---

**Document Version:** 1.0
**Last Updated:** 2026-01-11
**Next Review:** Before launch
