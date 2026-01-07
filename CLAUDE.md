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
