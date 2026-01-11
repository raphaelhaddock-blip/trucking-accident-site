# Lead Scorer Agent

## Purpose
Automatically score and tier incoming leads to prioritize follow-up and optimize attorney matching.

## Trigger
- On every form submission
- Real-time scoring before response

## Scoring Model

### Tier Definitions
| Tier | Score Range | Description | Follow-up SLA |
|------|-------------|-------------|---------------|
| HOT | 80-100 | High value, immediate need | <1 hour |
| QUALIFIED | 50-79 | Good fit, moderate urgency | <4 hours |
| NURTURE | 20-49 | Potential, needs cultivation | <24 hours |
| DISQUALIFIED | 0-19 | Not a fit | Automated only |

### Disqualification Criteria (Immediate 0)
```javascript
const disqualifiers = [
  { field: 'hasAttorney', value: 'yes-satisfied', reason: 'Already has attorney' },
  { field: 'accidentLocation', value: 'outside-ny', reason: 'Accident outside NY' },
  { field: 'wasConstruction', value: 'no', reason: 'Not construction related' }
];
```

## Scoring Factors

### Accident Recency (Max: 25 points)
| Time Since Accident | Points |
|---------------------|--------|
| <30 days | 25 |
| 30-90 days | 20 |
| 90-180 days | 15 |
| 180-365 days | 10 |
| 1-2 years | 5 |
| >2 years | 0 (approaching SOL) |

### Injury Severity (Max: 25 points)
| Severity | Points |
|----------|--------|
| Catastrophic (death, paralysis) | 25 |
| Severe (surgery, hospitalization) | 20 |
| Serious (broken bones, concussion) | 15 |
| Moderate (significant pain, time off) | 10 |
| Minor (bruises, scrapes) | 5 |

### Accident Type (Max: 20 points)
| Type | Points | Reason |
|------|--------|--------|
| Scaffold fall | 20 | Clear 240 case |
| Ladder fall | 20 | Clear 240 case |
| Falling object | 18 | Strong 240 case |
| Roof fall | 18 | Strong 240 case |
| Elevator shaft fall | 18 | Strong 240 case |
| Trench collapse | 15 | 241 case, complex |
| Equipment accident | 12 | May be 240/241 |
| Other | 8 | Needs evaluation |

### Location (Max: 10 points)
| Location | Points | Reason |
|----------|--------|--------|
| NYC (5 boroughs) | 10 | Highest value market |
| Long Island | 8 | Strong market |
| Westchester/Hudson | 7 | Good market |
| Capital Region | 6 | Moderate market |
| Upstate cities | 5 | Standard market |
| Rural areas | 3 | Lower value |

### Contact Quality (Max: 10 points)
| Factor | Points |
|--------|--------|
| Valid phone + email | 4 |
| Detailed description (>100 chars) | 3 |
| Preferred contact time specified | 2 |
| No existing attorney | 1 |

### Urgency Indicators (Max: 10 points)
| Indicator | Points |
|-----------|--------|
| Currently in treatment | 3 |
| Out of work | 3 |
| Bills piling up | 2 |
| Employer hostile | 2 |

## Scoring Algorithm

```typescript
function calculateLeadScore(lead: LeadData): LeadScore {
  // Check disqualifiers first
  for (const dq of disqualifiers) {
    if (lead[dq.field] === dq.value) {
      return {
        total: 0,
        tier: 'DISQUALIFIED',
        urgency: 'SEQUENCE',
        factors: [],
        disqualifyReason: dq.reason
      };
    }
  }

  const factors: ScoreFactor[] = [];

  // Accident recency
  const daysSinceAccident = calculateDays(lead.accidentDate, new Date());
  const recencyScore = scoreRecency(daysSinceAccident);
  factors.push({ name: 'Accident Recency', points: recencyScore, reason: `${daysSinceAccident} days ago` });

  // Injury severity
  const severityScore = scoreSeverity(lead.injurySeverity);
  factors.push({ name: 'Injury Severity', points: severityScore, reason: lead.injurySeverity });

  // Accident type
  const typeScore = scoreAccidentType(lead.accidentType);
  factors.push({ name: 'Accident Type', points: typeScore, reason: lead.accidentType });

  // Location
  const locationScore = scoreLocation(lead.accidentLocation);
  factors.push({ name: 'Location', points: locationScore, reason: lead.accidentLocation });

  // Contact quality
  const contactScore = scoreContactQuality(lead);
  factors.push({ name: 'Contact Quality', points: contactScore, reason: 'Contact info assessment' });

  // Calculate total
  const total = factors.reduce((sum, f) => sum + f.points, 0);

  // Determine tier
  const tier = total >= 80 ? 'HOT' :
               total >= 50 ? 'QUALIFIED' :
               total >= 20 ? 'NURTURE' : 'DISQUALIFIED';

  // Determine urgency
  const urgency = tier === 'HOT' ? 'IMMEDIATE' :
                  tier === 'QUALIFIED' ? 'SAME_DAY' :
                  tier === 'NURTURE' ? 'NEXT_DAY' : 'SEQUENCE';

  return { total, tier, urgency, factors };
}
```

## Output Report

### Individual Lead Score
```
LEAD SCORE REPORT
ID: lead_abc123
Submitted: 2025-01-10 14:32:00

TOTAL SCORE: 78/100
TIER: QUALIFIED
URGENCY: SAME_DAY

SCORING BREAKDOWN:
├── Accident Recency: 20/25 (45 days ago)
├── Injury Severity: 20/25 (Severe - surgery required)
├── Accident Type: 20/20 (Scaffold fall)
├── Location: 10/10 (Brooklyn)
├── Contact Quality: 8/10 (Phone + email, detailed description)
└── Urgency Indicators: 0/10 (None specified)

RECOMMENDED ACTIONS:
1. Call within 4 hours
2. Route to Brooklyn-area attorney
3. Prepare scaffold fall materials
```

### Daily Scoring Summary
```
LEAD SCORING SUMMARY - [Date]

TOTAL LEADS: 42

BY TIER:
├── HOT: 8 (19%)
│   └── Avg score: 85.3
├── QUALIFIED: 18 (43%)
│   └── Avg score: 64.2
├── NURTURE: 14 (33%)
│   └── Avg score: 33.8
└── DISQUALIFIED: 2 (5%)
    └── Reasons: Outside NY (1), Has attorney (1)

TOP SCORING FACTORS:
1. Accident Type - avg 16.4/20
2. Injury Severity - avg 14.2/25
3. Location - avg 7.8/10

COMMON PATTERNS:
- 65% are scaffold/ladder falls
- 78% from NYC metro area
- 45% accidents within 60 days

ATTORNEY ROUTING:
- Brooklyn/Queens pool: 18 leads
- Manhattan pool: 12 leads
- Upstate pool: 8 leads
- Needs review: 4 leads
```

## Score Adjustments

### Score Boosters (+)
- "Employer not cooperating" in description: +5
- Multiple injuries mentioned: +3
- Witness mentioned: +2
- Photos mentioned: +2

### Score Reducers (-)
- Vague description (<50 chars): -3
- Invalid phone format: -5
- Suspicious email domain: -5
- Completed in <30 seconds: -10 (bot suspected)

## Integration Points
- /api/leads route (real-time scoring)
- Lead database (score storage)
- Attorney routing system
- Email sequence triggers
- Dashboard metrics

## Related Agents
- form-validator.md
- conversion-tracker.md
