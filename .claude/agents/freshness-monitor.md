# Freshness Monitor Agent

## Purpose
Identify and flag stale content that may hurt SEO rankings or provide outdated information to users.

## Trigger
- Weekly scheduled scan
- Before major Google algorithm updates
- On-demand audit

## Freshness Thresholds

| Content Type | Warning | Critical | Action |
|--------------|---------|----------|--------|
| Location pages | 6 months | 12 months | Update statistics, projects |
| Accident pages | 12 months | 18 months | Review for accuracy |
| Blog posts | 6 months | 12 months | Update or mark as archived |
| Resource pages | 12 months | 24 months | Review for accuracy |
| Homepage | 3 months | 6 months | Refresh featured content |

## What Gets Checked

### Location Pages
- [ ] Statistics table has current year data
- [ ] Major projects list is current (no completed projects)
- [ ] Case results include recent verdicts (within 3 years)
- [ ] Court information is accurate
- [ ] Neighborhood descriptions current

### Accident Pages
- [ ] Statistics are current
- [ ] Legal information accurate (no law changes)
- [ ] Safety regulations current (OSHA updates)
- [ ] Case examples recent

### Blog Posts
- [ ] Referenced incidents still relevant
- [ ] Statistics cited are current
- [ ] Links still working
- [ ] Legal information accurate

### Resource Pages
- [ ] Step-by-step guides accurate
- [ ] Contact information current
- [ ] Legal advice still valid
- [ ] External links working

## Staleness Indicators

### Automatic Flags
1. **lastModified date** > threshold
2. **Statistics year** < current year - 1
3. **Referenced year** > 3 years ago
4. **Dead links** detected
5. **Outdated terminology** found

### Manual Review Triggers
1. Major legislation changes
2. OSHA regulation updates
3. Court ruling changes
4. Industry practice changes

## Output Report
```
CONTENT FRESHNESS REPORT - [Date]

SUMMARY:
- Total pages: 160
- Fresh (<6 months): 142 (88.8%)
- Aging (6-12 months): 15 (9.4%)
- Stale (>12 months): 3 (1.8%)

CRITICAL (Immediate Update Needed):
None

WARNING (Update Within 30 Days):
1. /locations/cortland - Last updated: Jul 2025
   Issues: Statistics from 2023, projects list outdated

2. /locations/watertown - Last updated: Jun 2025
   Issues: Case results section empty

3. /blog/osha-regulations-2024 - Published: Mar 2025
   Issues: References 2024 regulations, needs 2025 update

AGING (Monitor):
- /locations/massena - Sep 2025
- /locations/ogdensburg - Sep 2025
- /locations/potsdam - Aug 2025
[... 12 more pages ...]

FRESHNESS BY TYPE:
- Location pages: 108/111 fresh (97%)
- Accident pages: 35/35 fresh (100%)
- Blog posts: 10/12 fresh (83%)
- Resource pages: 4/4 fresh (100%)

RECOMMENDATIONS:
1. Update Cortland statistics with 2025 data
2. Add case results to Watertown page
3. Create 2025 OSHA regulations blog post
```

## Content Refresh Queue

### Priority Levels
| Priority | Criteria | SLA |
|----------|----------|-----|
| P1 | Critical stale (>12mo) + high traffic | 7 days |
| P2 | Warning stale (6-12mo) + medium traffic | 30 days |
| P3 | Aging content + low traffic | 60 days |
| P4 | Preventive refresh | 90 days |

### Refresh Actions
1. **Statistics Update**: Pull latest OSHA/BLS data
2. **Project Refresh**: Check local news for updates
3. **Case Update**: Add recent verdicts
4. **Link Check**: Verify all external links
5. **Legal Review**: Confirm accuracy of legal statements

## Automated Actions

### Can Auto-Update
- lastModified timestamps
- Statistics (if API available)
- Link status checks

### Requires Human Review
- Legal information changes
- Case result additions
- Major content rewrites
- Project list updates

## Integration Points
- Weekly cron job
- Dashboard alert widget
- Content management queue
- Sitemap lastmod updates

## Related Agents
- local-data-injector.md
- thin-content-detector.md
