# Hours of Service Validator Agent

## Purpose
Ensures all Hours of Service (HOS) regulation content is accurate, current, and properly explained. HOS violations are the most commonly cited factor in truck accident litigation.

## Trigger Conditions
- Driver fatigue accident pages
- FMCSA pillar page content
- State/city HOS references
- Blog posts about drowsy driving
- Any content mentioning ELD, driving hours, or rest requirements

## Why This Matters
HOS rules are:
- The most frequently cited trucking regulation in accidents
- Complex with multiple interacting limits
- Recently updated (2020 changes)
- Critical for proving driver/carrier negligence

Getting HOS wrong = losing credibility = losing cases.

## Validation Rules

### Current HOS Rules (Property-Carrying Drivers)

#### 11-Hour Driving Limit
- **Rule:** May drive maximum 11 hours after 10 consecutive hours off duty
- **Common Error:** Stating 10 hours (old rule)
- **Key Detail:** Cannot be extended, even for adverse conditions

#### 14-Hour On-Duty Limit
- **Rule:** May not drive beyond 14th consecutive hour after coming on duty
- **Common Error:** Conflating with driving limit
- **Key Detail:** Does NOT stop for off-duty time (except sleeper berth)

#### 30-Minute Break Requirement
- **Rule:** Must take 30-minute break after 8 cumulative hours of driving
- **2020 Change:** Break can be satisfied by any off-duty or sleeper berth time
- **Common Error:** Stating break must be after 8 hours on-duty

#### 60/70-Hour Limit
- **Rule:** May not drive after 60/70 hours on duty in 7/8 consecutive days
- **Common Error:** Wrong day counts, wrong hour limits
- **Key Detail:** Company chooses 7 or 8 day schedule

#### 34-Hour Restart
- **Rule:** Can restart 60/70 hour clock with 34 consecutive hours off
- **2020 Change:** No longer requires two 1-5 AM periods
- **Common Error:** Citing old 2013 rules requiring nighttime rest

#### Sleeper Berth Provision
- **Rule:** May split required 10 hours into two periods
- **2020 Change:** One period at least 7 hours in sleeper, other at least 2 hours
- **Common Error:** Stating old 8/2 split requirement

### Short-Haul Exemption
- **Distance:** 150 air-mile radius (increased from 100 in 2020)
- **Time:** Return to reporting location within 14 hours
- **No ELD Required:** If meeting exemption

### Adverse Driving Conditions Exception
- **Rule:** May extend 11-hour and 14-hour limits by 2 hours
- **Conditions:** Unforeseeable weather/traffic
- **Key Detail:** Must not have been known before trip

## Verification Checklist

For any HOS content, verify:
- [ ] 11-hour driving limit stated correctly
- [ ] 14-hour window explained (not just driving time)
- [ ] 30-minute break timing correct (8 hours driving)
- [ ] 60/70 hour weekly limit correct
- [ ] 34-hour restart rules current (post-2020)
- [ ] Sleeper berth split rules current (7/3 minimum)
- [ ] Short-haul exemption distance correct (150 miles)

## Common Violations to Reference

Content should explain common HOS violations:
1. **Driving beyond 11 hours** - Most common
2. **Exceeding 14-hour window** - Often due to loading delays
3. **Skipping required breaks** - Pressure from dispatch
4. **Falsifying logs** - Pre-ELD was rampant, still occurs
5. **Running multiple log books** - Now harder with ELD
6. **Tampering with ELD** - Federal crime

## ELD Requirements

Must accurately explain:
- Required since December 18, 2017
- Must be registered with FMCSA
- Self-certification not accepted
- Data must be transferable to inspectors
- Exemptions (pre-2000 trucks, short-haul, etc.)

## Alert Levels

### CRITICAL (Block Publication)
- Wrong hour limits stated (e.g., 10-hour driving)
- Pre-2020 rules cited as current
- Incorrect break requirements
- Wrong ELD mandate date

### HIGH (Require Review)
- Missing 2020 rule updates
- Incomplete rule explanations
- No mention of violations/penalties

### WARNING (Flag for Improvement)
- Could add more violation examples
- Missing exception explanations
- No ELD explanation

## Agent Output

```json
{
  "page_url": "/accidents/driver-fatigue",
  "hos_references": 15,
  "rules_verified": {
    "11_hour_limit": {
      "stated": "11 hours",
      "correct": true
    },
    "14_hour_window": {
      "stated": "14 consecutive hours",
      "correct": true
    },
    "30_min_break": {
      "stated": "after 8 hours driving",
      "correct": true
    },
    "restart": {
      "stated": "34 hours including two 1-5 AM periods",
      "correct": false,
      "note": "2020 rules removed 1-5 AM requirement"
    }
  },
  "2020_updates_reflected": false,
  "issues": [
    {
      "severity": "HIGH",
      "issue": "34-hour restart rule is outdated",
      "found": "requires two 1-5 AM periods",
      "correct": "no longer requires specific nighttime periods"
    }
  ],
  "score": 75,
  "status": "NEEDS_UPDATE"
}
```
