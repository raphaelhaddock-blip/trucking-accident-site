# Claude Code Rules for 18-Wheeler Accident Site

## MANDATORY: Plan Before Execute

**BEFORE starting any new task, feature, or significant change:**

1. **ASK**: "Should I enter plan mode first?"
2. **If the task involves**:
   - Creating new pages or content
   - Changing site architecture
   - Adding new features
   - Modifying SEO structure
   - Any change affecting 5+ files
   
   **→ ENTER PLAN MODE FIRST**

3. **Plan mode means**:
   - Outline what will be created/changed
   - List all files affected
   - Identify potential risks
   - Estimate scope (small/medium/large)
   - Get explicit approval before executing

4. **Only skip planning for**:
   - Bug fixes to existing code
   - Typo corrections
   - Single-file edits under 50 lines
   - Commands the user explicitly told you to run

---

## Project Context

- **Type**: National lead generation site for 18-wheeler accident referrals
- **Stack**: Next.js 14, TypeScript, Tailwind, Sanity CMS
- **Focus**: Semi-truck/18-wheeler crashes that cause injuries
- **Model**: Referral/lead generation (capture leads, refer to PI firms)
- **Dev server**: Port 3005 (NOT 3000)

---

## Content Rules

### DO NOT create thin content:
- Accident type pages must be **3,000+ words**
- State pages must be **2,500+ words**
- City pages must be **2,000+ words**
- Blog posts must be **800+ words**
- Every page needs **5+ unique FAQs**

### DO NOT create matrix/doorway pages:
- **BANNED**: `/states/[state]/[accident-type]` pattern
- **BANNED**: Pages that only swap state/city names
- **REQUIRED**: 80%+ unique content per page

### DO create:
- Deep, comprehensive single-topic pages
- Heavy cross-linking between accident types ↔ locations
- News-reactive blog posts on real trucking accidents
- FMCSA regulation explainers

---

## SEO Requirements

Before any content change, verify:
- [ ] H1 is unique and under 70 chars
- [ ] Meta title under 60 chars
- [ ] Meta description 120-160 chars
- [ ] Canonical URL set
- [ ] Schema markup present (LegalService, FAQPage, BreadcrumbList)
- [ ] Internal links to related pages
- [ ] No duplicate content with other pages

---

## Legal Content Rules

### Always include for accident pages:
- FMCSA regulation connections
- Multiple liable parties (driver, carrier, broker, shipper)
- Evidence preservation (black box, ELD, driver logs)
- Statute of limitations by state
- Typical settlement/verdict ranges

### Always include for state pages:
- State-specific trucking laws
- Major trucking corridors in that state
- State DOT statistics
- Local court information
- Comparative negligence rules

### Never claim:
- Guaranteed outcomes
- Specific settlement amounts as promises
- Attorney-client relationship exists
- [FIRM_NAME] is the reader's lawyer

---

### Cognitive Checkpoint — Domain Triggers

**Before content generation:**
- Word count met? Accident types 3,000+, states 2,500+, cities 2,000+, blog 800+, 5+ unique FAQs.
- No doorway pages: 80%+ unique content required. No state/city name-swap templates.

**Before legal content:**
- FMCSA regulations cited correctly? Verify CFR numbers.
- State-specific SOL verified? Don't guess — confirm from source.
- Multiple liable parties covered? (driver, carrier, broker, shipper, manufacturer)
- No guaranteed outcomes or specific settlement promises. No implied attorney-client relationship.
- Comparative negligence rules correct for target state?

**Before publishing:**
- SEO checklist: H1 unique, meta title < 60 chars, meta desc 120-160 chars, schema markup (LegalService, FAQPage, BreadcrumbList).
- Deploy via Vercel only. Never run local dev server.

---

## Git Rules

- Commit after each logical unit of work
- Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`
- Push to origin/main after successful build
- Run `npm run build` before committing significant changes

---

## When in Doubt

Ask the user:
- "This looks like a significant change. Want me to plan it first?"
- "I see multiple approaches here. Should I outline options?"
- "This will affect [X] files. Confirm before I proceed?"

---

## Growth OS — Taxonomy + Ontology (REQUIRED before content scaling)

Every site we build must have a site-specific **taxonomy** (category system) and **ontology** (relationships between categories) before content is scaled. Hard rule: **new content must fit the taxonomy/ontology before anyone drafts it** — same gate level as `audit:legaltone`.

Full standard: `docs/GROWTH-OS-TAXONOMY-ONTOLOGY.md`. PR12 built the Growth OS brain (`src/lib/growth/`, recommendation-only); taxonomy/ontology is the next foundation and is **not yet implemented** here. Images are brand/UI infrastructure and may proceed; they are NOT content expansion.

## STANDARD WEBSITE RULES

**See `~/.claude/SITE_RULES.md` for standard operations rules including:**
- Deployment (Vercel workflow, pre-deploy checklist)
- Security (XSS prevention, headers, secrets)
- SEO (technical requirements, Core Web Vitals)
- Content quality (word counts, required elements)
- Legal compliance (disclaimers, forbidden claims)
- Accessibility (WCAG 2.1 AA)
- Performance budget
