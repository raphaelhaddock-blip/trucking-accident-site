# E-E-A-T Signal Checker Agent

## Purpose
Validates that content demonstrates Experience, Expertise, Authoritativeness, and Trustworthiness (E-E-A-T) - critical for YMYL (Your Money Your Life) legal content that Google scrutinizes heavily.

## Trigger Conditions
- All content pages
- About page updates
- Author/attorney pages
- Blog posts
- Before launch verification
- Quarterly E-E-A-T audit

## Why This Matters
Legal content is classified as YMYL by Google:
- Directly impacts users' health, finances, safety
- Requires higher E-E-A-T standards than other content
- Poor E-E-A-T = suppressed in search results
- Strong E-E-A-T = ranking advantage in competitive legal market

## Validation Rules

### Experience Signals

#### What Google Looks For
Evidence that content comes from people with real-world experience.

#### Required Signals
| Signal | Implementation | Status Check |
|--------|---------------|--------------|
| Case examples | Anonymized case studies | Present? |
| Client outcomes | Settlement/verdict examples | Present? |
| First-hand accounts | "In our experience..." language | Present? |
| Practice focus | Years handling truck cases | Stated? |
| Geographic experience | Local court experience | Mentioned? |

#### Experience Verification Checklist
- [ ] Page mentions attorney/firm experience
- [ ] Specific case types handled mentioned
- [ ] Years of experience stated
- [ ] Number of cases/clients referenced
- [ ] Local practice experience noted

### Expertise Signals

#### What Google Looks For
Credentials, qualifications, and deep knowledge.

#### Required Signals
| Signal | Implementation | Status Check |
|--------|---------------|--------------|
| Author bylines | Named author on content | Present? |
| Credentials | JD, bar admissions | Listed? |
| Specializations | Board certifications | Mentioned? |
| Professional affiliations | AAJ, state trial lawyers | Listed? |
| Publications/speaking | CLE presentations, articles | Mentioned? |

#### Expertise Verification Checklist
- [ ] Content has author attribution
- [ ] Author credentials displayed
- [ ] Bar admission states listed
- [ ] Specialty certifications noted
- [ ] Professional memberships shown
- [ ] Link to author bio page

### Authoritativeness Signals

#### What Google Looks For
Recognition from other authoritative sources.

#### Required Signals
| Signal | Implementation | Status Check |
|--------|---------------|--------------|
| External citations | Cited by other sites | Trackable? |
| Media mentions | News coverage | Listed? |
| Awards/recognition | Super Lawyers, Best Lawyers | Displayed? |
| Testimonials | Client reviews | Present? |
| Case results | Verifiable outcomes | Displayed? |

#### Authoritativeness Verification Checklist
- [ ] Awards/recognitions displayed
- [ ] Media mentions listed
- [ ] Testimonials with attribution
- [ ] Notable case results shown
- [ ] Industry association memberships
- [ ] External links from authority sites

### Trustworthiness Signals

#### What Google Looks For
Transparency, accuracy, and user safety.

#### Required Signals
| Signal | Implementation | Status Check |
|--------|---------------|--------------|
| Contact information | Real address, phone | Visible? |
| Privacy policy | Data handling disclosure | Present? |
| Disclaimers | Legal disclaimers | Appropriate? |
| Transparency | Referral disclosure | Clear? |
| SSL certificate | HTTPS | Active? |
| Accuracy | Factual content | Verified? |

#### Trustworthiness Verification Checklist
- [ ] Physical address displayed (or disclosure it's referral)
- [ ] Phone number prominently displayed
- [ ] Privacy policy page exists
- [ ] Terms of service present
- [ ] Disclaimer about referral service
- [ ] Attorney advertising disclosures
- [ ] HTTPS on all pages
- [ ] No misleading claims

### Page-Level E-E-A-T Requirements

#### Homepage
- [ ] Clear statement of service (referral vs. law firm)
- [ ] Trust badges/awards
- [ ] Contact information
- [ ] Attorney network credentials summary

#### Accident Pages
- [ ] Author byline
- [ ] Last updated date
- [ ] Expert citations (FMCSA, NHTSA)
- [ ] Disclaimer that content is informational

#### State/City Pages
- [ ] Local attorney credentials (if applicable)
- [ ] Local court experience
- [ ] Local case results (if available)
- [ ] Local bar information

#### Blog Posts
- [ ] Author name and photo
- [ ] Author credentials/bio link
- [ ] Publication date
- [ ] Last updated date
- [ ] Sources cited

#### About Page
- [ ] Service model explanation
- [ ] Attorney network description
- [ ] Company history (if applicable)
- [ ] Team credentials
- [ ] Referral disclosure

### E-E-A-T Scoring System

```
E-E-A-T Score =
  Experience (0-25) +
  Expertise (0-25) +
  Authoritativeness (0-25) +
  Trustworthiness (0-25)

Score Interpretation:
  0-40: POOR - Major E-E-A-T gaps
  41-60: FAIR - Some signals present
  61-80: GOOD - Most signals present
  81-100: EXCELLENT - Comprehensive E-E-A-T
```

### Scoring Criteria

#### Experience (0-25 points)
| Criteria | Points |
|----------|--------|
| Case examples present | 5 |
| Years of experience stated | 5 |
| Local experience mentioned | 5 |
| Client outcomes referenced | 5 |
| First-hand insights | 5 |

#### Expertise (0-25 points)
| Criteria | Points |
|----------|--------|
| Author bylines | 5 |
| Credentials displayed | 5 |
| Bar admissions listed | 5 |
| Specialty certifications | 5 |
| Professional affiliations | 5 |

#### Authoritativeness (0-25 points)
| Criteria | Points |
|----------|--------|
| Awards displayed | 5 |
| Media mentions | 5 |
| Testimonials present | 5 |
| Case results shown | 5 |
| External authority links | 5 |

#### Trustworthiness (0-25 points)
| Criteria | Points |
|----------|--------|
| Contact info visible | 5 |
| Privacy policy exists | 5 |
| Disclaimers appropriate | 5 |
| Referral transparency | 5 |
| Factual accuracy | 5 |

## Alert Levels

### CRITICAL (Major E-E-A-T Failure)
- E-E-A-T score <40
- No author attribution anywhere
- Missing privacy policy
- Misleading claims present
- No contact information

### HIGH (Significant Gaps)
- E-E-A-T score 40-60
- Missing author bylines on most pages
- No credentials displayed
- Limited trust signals
- Missing disclaimers

### WARNING (Needs Improvement)
- E-E-A-T score 60-80
- Some pages missing attribution
- Could add more credentials
- Limited case results
- Could improve transparency

### PASS
- E-E-A-T score >80
- Comprehensive author attribution
- Credentials clearly displayed
- Strong trust signals
- Full transparency

## Remediation Strategies

### Quick Wins (1-2 days)
- Add author bylines to all pages
- Display attorney credentials
- Add last updated dates
- Ensure disclaimers present
- Add contact information to footer

### Medium Effort (1-2 weeks)
- Create attorney profile pages
- Add case results page
- Implement testimonial section
- Add professional affiliations
- Create comprehensive about page

### Long-term (1-3 months)
- Build external authority links
- Seek media mentions
- Collect client testimonials
- Document case results
- Pursue industry awards

## Agent Output

```json
{
  "page_url": "/accidents/jackknife-accidents",
  "eeat_scores": {
    "experience": 10,
    "expertise": 8,
    "authoritativeness": 5,
    "trustworthiness": 18,
    "total": 41
  },
  "status": "FAIR",
  "signals_present": [
    "Contact information",
    "Privacy policy",
    "Disclaimers",
    "Expert citations (FMCSA)"
  ],
  "signals_missing": [
    "Author byline",
    "Author credentials",
    "Case examples",
    "Testimonials",
    "Awards/recognition"
  ],
  "issues": [
    {
      "severity": "HIGH",
      "category": "Expertise",
      "issue": "No author attribution",
      "recommendation": "Add author byline with credentials"
    },
    {
      "severity": "HIGH",
      "category": "Authoritativeness",
      "issue": "No case results or testimonials",
      "recommendation": "Add relevant case examples"
    }
  ],
  "recommendations": [
    "Add author byline: 'Reviewed by [Attorney Name], J.D.'",
    "Include 'Last updated: [date]' timestamp",
    "Add relevant case result example",
    "Link to attorney credentials page"
  ],
  "priority": "HIGH"
}
```
